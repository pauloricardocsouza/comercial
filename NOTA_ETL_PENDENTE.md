# Bug ETL · financeiro_cp3.json (Cestão Loja 1)

**Sintoma no front:** Visão Compras × Vendas × Financeiro, Mar/26 mostra PAGO de R$ -2,1 bilhões.

**Causa raiz:** valores anômalos no JSON gerado pelo ETL:
- `pagas.mensal[fev/26].pago = R$ +2.165.193.086,08` (2,1 bilhões)
- `pagas.mensal[mar/26].pago = R$ -2.121.365.590,80` (-2,1 bilhões)

Bases ATP, CP1, CP5 e CP40 estão corretas. Apenas CP3 está errada, e o erro propaga para `financeiro_cp.json` (cubo agregado) e `financeiro_grupo.json` (consolidado).

**Provável:** dupla contagem em fev/26 com estorno em mar/26 na origem.

**Ação:** investigar a query que gera o JSON do CP3 e regerar.

