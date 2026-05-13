# Integração ETL · v4.69-comercial

Frontend v4.69 adicionou um novo quadro em Financeiro que mostra o **valor pago mensalmente** das contas **99912 (Multa e Juros)** e **99907 (Encargos Conta Garantida)** em 2026. Hoje o JSON `financeiro_<base>.json` não fornece dados mensais por conta individual — só agregados:

- `pagas.por_conta[]` — anual, agregado por código de conta
- `pagas.por_grupo[]` — mensal, mas só por grupo (3 dígitos, ex: `100`, `999`)
- `pagas.mensal[]`   — total mensal sem quebra de conta

Por isso o quadro **renderiza zerado e exibe aviso** até o pipeline ETL incluir uma das opções abaixo.

---

## Opção A · `pagas.por_conta_mensal[]` (preferida)

Quebra mensal por conta individual. Estrutura mínima:

```json
"pagas": {
  "por_conta_mensal": [
    {"loja":"ATP","ym":"2026-01","cod":"99912","nome":"MULTA E JUROS DE MORA","pago":15234.56,"titulos":18},
    {"loja":"ATP","ym":"2026-01","cod":"99907","nome":"ENCARGOS CONTA GARANTIDA","pago":8120.40,"titulos":3},
    {"loja":"ATP","ym":"2026-02","cod":"99912","pago":12450.00,"titulos":14}
  ]
}
```

Campos obrigatórios: `ym`, `cod`, `pago`. Campos opcionais: `nome`, `titulos`, `loja`.

Filtros: 2026 inteiro (`ym` de `2026-01` a `2026-12`). Pode incluir todas as contas individuais — o frontend faz o filtro por código.

---

## Opção B · `pagas.titulos[]`

Lista de títulos pagos individuais (similar ao que já existe em `aberto.titulos[]` para abertos). Estrutura mínima:

```json
"pagas": {
  "titulos": [
    {"conta":"99912","data_pgto":"2026-01-15","valor":2340.00,"loja":"ATP","parceiro":{"cod":877,"nome":"BANCO X"}},
    {"conta":"99907","data_pgto":"2026-01-22","valor":540.00,"loja":"ATP"}
  ]
}
```

Frontend agruparia por `data_pgto.substring(0,7)` + `conta`.

> Observação: essa opção é mais pesada (centenas de milhares de linhas/ano). Se possível, prefira a Opção A já agregada.

---

## Como o frontend consome (referência)

A função `_renderQuadroMultaJuros()` em `js/render-compras.js` tenta:

1. Ler `F.pagas.por_conta_mensal[]` → preferida.
2. Senão, ler `F.pagas.titulos[]` e agrupar por (`conta`, `data_pgto.substring(0,7)`).
3. Senão, renderizar matriz zerada e mostrar aviso ao usuário sinalizando esta dependência.

Contas observadas pelo frontend: `99912`, `99907` (códigos fixos no código). Para incluir mais contas, atualizar o array `contas` no início da função.

---

## Verificação rápida

Após o ETL gerar o novo campo, basta:

1. Subir o `financeiro_<base>.json.gz` para o GitHub Pages.
2. Acessar **Financeiro** no Comercial GPC.
3. Quadro **Multa e Juros (99912) + Encargos Conta Garantida (99907) · 2026** deve preencher com os valores reais e a observação muda de "Aguardando ETL" para "Pago mensalmente por conta".

Sem dependência adicional de regras Firestore ou versão de cliente.
