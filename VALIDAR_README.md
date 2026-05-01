# validar.py · Validação de invariantes do ETL

Roda em < 30s e checa que os JSONs gerados pelo ETL respeitam invariantes esperadas pelo front.

## Uso

```bash
cd <pasta dos JSONs>
python3 validar.py             # roda e imprime resultado
python3 validar.py --strict    # exit code 2 se houver WARN (útil em CI)
```

## Exit codes

| Code | Significado |
|---|---|
| `0` | Tudo OK |
| `1` | Algum FAIL (bug provável no ETL) |
| `2` | Algum WARN (só em modo `--strict`) |

## Invariantes checadas

1. **Arquivos esperados**: cada base tem 7 tipos (vendas, compras, estoque, financeiro, recebimentos, verbas, devolucoes)
2. **Consistência de soma · Vendas**: `ATP isolado == ATP no grupo`, `CP isolado == CP no grupo`, e cada loja individual
3. **Consistência resumo vs mensal**: `resumo.total.valor == sum(mensal.valor)` em vendas e compras
4. **Estoque**: `vl_custo_total > 0` quando há produtos, `vl_venda_total > 0` quando há produtos com preço, `por_status.skus.sum == skus_total`
5. **Períodos uniformes**: cada loja tem o mesmo número de meses (esperado: 16 = jan/2025 a abr/2026)
6. **2024 ausente**: ETL deve filtrar `>= 2025-01`
7. **Metas**: estrutura `config + metas` com filiais conhecidas e ym formato YYYY-MM
8. **filiais.json**: bases mínimas (grupo, atp, cp) presentes e hierarquia consistente
9. **Recebimentos**: clientes em atraso devem ter aging e estar em ordem decrescente de valor
10. **Cubo OLAP**: formato uniforme (preferir `dimensoes/fatos`, `dim/fato_vendas` é legado)

## Quando rodar

- **Sempre depois de cada execução do ETL**, antes de fazer upload pro GitHub Pages
- Em CI/CD se você criar pipeline de deploy
- Quando alguém se queixar de número estranho no dashboard (descobre ETL ruim em vez de bug do front)

## Como adicionar novas validações

Edite o arquivo, adicione uma `def validar_X(): ...` no padrão das outras (use `R.ok/warn/fail/skip`), e chame em `main()`.

Heurística de classificação:
- `fail` = invariante quebrada, certeza de bug do ETL
- `warn` = situação suspeita, mas pode ser dado real
- `ok` = invariante respeitada
- `skip` = arquivo opcional não encontrado
