# ETL · Integração NF Fechamento (v4.68)

## Visão geral

A partir da v4.68 o frontend tem a página **NF Fechamento** (sidebar Compras), que permite a usuários **admin** e **gestor** marcarem NFs de entrada específicas para serem **ignoradas** em todas as análises.

A lista canônica de NFs ignoradas fica em:

- **Firestore:** `config/nfs_ignoradas_v1`
- **localStorage** (cache espelhado, por device): chave `nfs_ignoradas_v1`

## Estrutura no Firestore

```json
{
  "nfs": {
    "atp__ATP__4836230__1542__2026-01-06": {
      "base": "atp",
      "filial": "ATP",
      "num_nota": "4836230",
      "forn_cod": 1542,
      "forn_nome": "NESTLE BRASIL LTDA",
      "data": "2026-01-06",
      "valor": 55138.0,
      "motivo": "Devolução total · cancelada",
      "marcado_por_uid": "<firebase_uid>",
      "marcado_por_email": "ricardo@solucoesr2.com.br",
      "marcado_por_nome": "Ricardo",
      "marcado_em": "2026-05-12T18:30:00.000Z"
    },
    "...": { ... }
  },
  "atualizado_em": "2026-05-12T18:30:00.000Z",
  "atualizado_por": "ricardo@solucoesr2.com.br"
}
```

### Chave (`nfKey`)
Formato: `<base>__<filial>__<num_nota>__<forn_cod>__<data>`
- `base`: slug minúsculo (`atp`, `cp1`, etc.)
- `filial`: sigla maiúscula (`ATP`, `CP1`, `CP3`, `CP5`)
- `num_nota`: número da NF como string
- `forn_cod`: código do fornecedor (inteiro)
- `data`: data emissão YYYY-MM-DD

## O que o ETL precisa fazer

No início do pipeline, antes de qualquer agregação de compras:

1. **Ler a lista de NFs ignoradas do Firestore:**
   ```python
   from firebase_admin import firestore
   db = firestore.client()
   doc = db.collection('config').document('nfs_ignoradas_v1').get()
   nfs_ignoradas = doc.to_dict().get('nfs', {}) if doc.exists else {}
   ```

2. **Construir o índice de filtro** (set de tuplas pra O(1) lookup):
   ```python
   ign_set = set()
   for nf_data in nfs_ignoradas.values():
       key = (
           nf_data['filial'],
           str(nf_data['num_nota']),
           int(nf_data['forn_cod']),
           nf_data['data']
       )
       ign_set.add(key)
   ```

3. **Filtrar antes de agregar.** Para cada fonte de entrada (PCNFENT do WinThor, etc.):
   ```python
   def is_ignorada(filial, num_nota, forn_cod, data):
       return (filial, str(num_nota), int(forn_cod), str(data)) in ign_set

   # Antes de agregar:
   linhas_filtradas = [r for r in linhas_entrada if not is_ignorada(
       r['filial'], r['num_nota'], r['forn_cod'], r['data']
   )]
   ```

4. **Aplicar em todas as fontes que alimentam análises de compra:**
   - `cubo_*.json.gz` → fato_compras
   - `estoque_*.json.gz` → `produtos[].entradas_detalhadas` (manter consistente)
   - `compras_*.json` → mensal, diário, fornecedores_top
   - `financeiro_*.json` → posição financeira (se NF foi paga, o título também deve sair)

5. **Registrar contagem no `meta`** do JSON resultante (transparência):
   ```python
   resultado['meta']['nfs_ignoradas_aplicadas'] = {
       'count': len(ign_set),
       'aplicado_em': datetime.now().isoformat()
   }
   ```

## Sequência recomendada no pipeline

```
extract → fetch_nfs_ignoradas → apply_filter → aggregate → write_json
```

A leitura do Firestore custa 1 read e a lista é pequena (centenas de NFs no máximo), então pode ser feita a cada run sem cache.

## Considerações

- **Idempotência:** se uma NF é marcada como ignorada DEPOIS de já ter entrado num snapshot histórico (Histórico de Versões), os snapshots antigos não mudam. Só novas execuções do ETL filtram.
- **Auditoria:** o frontend já registra em `auditLog/*` cada marcação/desmarcação com `marcado_por_email`. O ETL não precisa logar de novo.
- **Conflitos:** se uma NF é ignorada e depois desmarcada entre dois runs, o run seguinte traz a NF de volta naturalmente.
- **Motivo:** o campo `motivo` é informativo (rastreabilidade), não precisa de tratamento no ETL.

## Frontend: o que já filtra (v4.68)

Imediatamente após marcar uma NF, o **extrato detalhado** do Diag. Fornecedor já a exclui (e mostra um aviso "X lançamentos foram excluídos"). Demais painéis aguardam o próximo processamento ETL.
