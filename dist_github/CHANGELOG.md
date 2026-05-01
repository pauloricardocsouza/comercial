# Histórico de versões · Comercial GPC

Lista das melhorias do sistema de BI da R2 Soluções para o Grupo Pinto Cerqueira.

---

## v4.9 · 01/mai/2026

**Auditoria profunda · correção de referências órfãs**

- Encontradas 2 referências a funções legadas removidas em v4.2 que ainda apareciam no código:
  - Listener do botão "voltar" do drilldown de departamentos chamava `renderDeptos()` e `renderDeptTable()` (deletadas). Agora usa `renderDeptosNovo`.
  - Painel de Smoke Tests testava 8 funções deletadas. Atualizado para apontar para as versões "Novo".
- Sem mudança visível para o usuário, mas elimina dois erros silenciosos que poderiam aparecer em condições específicas.

---

## v4.8 · 01/mai/2026

**Histórico público de versões**

- Adicionado link "NOVIDADES" no rodapé que abre um modal com este histórico.
- Toda nova versão passa a registrar aqui o que mudou, em linguagem amigável.

---

## v4.7 · 01/mai/2026

**Refator interno**

- Centralização de filtros de domínio em uma camada `Filtros` única.
- 8 lugares no código que duplicavam regras (filtrar supervisores ignorados, ignorar departamento INATIVO, etc.) agora apontam para o mesmo lugar.
- Quando uma nova regra for adicionada, ela passa a valer em todas as telas automaticamente.

Sem mudança visível para o usuário.

---

## v4.6 · 01/mai/2026

**Reorganização do código**

- O arquivo principal foi dividido em 5 módulos menores (core, vendas, compras, outros, admin).
- Mais fácil de manter e estender.

Sem mudança visível para o usuário.

---

## v4.5 · 01/mai/2026

**Validação de dados no carregamento**

- Adicionado sistema de assertions no boot: quando um JSON do ETL chega com formato inesperado, aparece um aviso no console.
- Detecta automaticamente problemas no ETL antes de virarem confusão na tela.

---

## v4.4 · 01/mai/2026

**Higiene**

- Removidos logs de debug que poluíam o console.
- Padronização de declarações `var` → `const`.
- Corrigido bug oculto: `renderJrFornTable` referenciada em template HTML mas removida em v4.2 (agora tem stub seguro).

---

## v4.3 · 01/mai/2026

**Performance**

- Tela de Vendas: cálculo de "Realizado vs Meta" do ano completo ficou ~65× mais rápido (otimização do agregado por supervisor).
- Tela de Evolução: gráfico de comparação entre lojas ficou ~6× mais rápido (memoização da função `_vendasMensalPor`).

---

## v4.2 · 01/mai/2026

**Limpeza de código**

- Removidas 13 funções legadas que ainda estavam no código mas não eram mais usadas (1.160 linhas, ~7% do arquivo).
- Roteamento de páginas simplificado: de 22 condicionais encadeadas para 11 guards consistentes.
- Quando o JSON de uma página não está disponível, o sistema agora mostra mensagem clara em vez de tentar fallback que poderia quebrar.

---

## v4.1 · 01/mai/2026

**Performance e robustez**

- Tela de Vendas (drill-down de departamentos e produtos top): substituído algoritmo O(n²) por busca indexada — ~19× mais rápido.
- Adicionado `try/catch` em leituras de localStorage (`_filialTreeExpandidos`) e `JSON.parse` no fetch de gzip — o sistema não trava mais se houver dados corrompidos.

---

## v4.0 · 01/mai/2026

**Correções críticas (auditoria)**

- Corrigido cabeçalho fixo "Dashboard · ATP" que aparecia mesmo em GPC Consolidado. Agora o cabeçalho da Visão Executiva é dinâmico.
- Card "Estoque (preço venda): R$ 0" agora mostra "—" em vez de zero quando o ETL não tem dado.
- Corrigidas 6 divisões por zero em tooltips e gráficos que mostravam "Infinity%" ou "NaN" quando algum total era zero (estoque por status, departamentos, fornecedores).

---

## v3.9 · 30/abr/2026

- Removido gráfico "Top 12 · Margem real (vendas)" da página de Fornecedores. O Top 12 · Compras agora ocupa a linha sozinho.

---

## v3.8 · 30/abr/2026

**Recebimentos · filtro por supervisor**

- Adicionado dropdown de filtro por supervisor na tabela "Top 30 clientes em atraso".
- Nova coluna "Supervisor(es)" mostrando quais supervisores são responsáveis pelos clientes (cruza RCAs do cliente com cadastro de vendedores).
- Filtro de "supervisores ignorados" (configurado em Administração) também aplicado aqui.
- Coluna "Nome do cliente" mostra "—" temporariamente — pendência do ETL para incluir nome no JSON de recebimentos.

---

## Versões anteriores

A versão 3.7 e anteriores não estão registradas neste CHANGELOG (sistema em rápida evolução). A linha do tempo grosso modo:

- **v3.x** · iteração rápida adicionando páginas (Recebimentos, Verbas, Análise Dinâmica, Metas, Visão por loja, Cestão Inhambupe), reorganização do menu, ajustes de UI, correções pontuais.
- **v2.x** · transição do schema "consolidado.json" único para JSONs modulares por base (vendas_atp, compras_atp, etc).
- **v1.x** · primeira versão com renders Novo (a partir dos JSONs do ETL Python).

---

*Mantido por R2 Soluções Empresariais · contato: r2@solucoesr2.com.br*
