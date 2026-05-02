# Histórico de versões · Comercial GPC

Lista das melhorias do sistema de BI da R2 Soluções para o Grupo Pinto Cerqueira.

---

## v4.22 · 02/mai/2026

**Bug fixes críticos descobertos em verificação sistemática**

Inspecionei os JSONs reais (`cubo_atp.json.gz` e `cubo_cp.json.gz`) e descobri inconsistências graves entre os mapas que escrevi e os campos reais. Sem essas correções, a Análise Dinâmica funcionava parcialmente em ATP e quase nada em CP.

**Análise Dinâmica · CP não funcionava**

O cubo de Comercial Pinto usa um formato diferente do ATP: `dim`/`fato_vendas` em vez de `dimensoes`/`fatos`. A normalizadora `_normalizarCubo` no core.js já tratava o `fato_vendas`, mas deixava `fato_compras` de fora. Resultado: quem visse a Análise Dinâmica em CP não veria nenhuma métrica de Compras, mesmo havendo dados. Estendi a normalizadora para também mapear `fato_compras` (incluindo o campo `valor` do CP que vira `c_val`).

**Análise Dinâmica · SKU não casava com o cubo**

Eu havia declarado as dimensões `sku_vendas` e `sku_compras` no mapa de fatos, mas o campo real nos JSONs é só `sku`. Quando o usuário arrastasse SKU para linhas ou colunas, o sistema não encontraria o campo no fato e tudo viraria "—". Criei o mapa auxiliar `_CUBO_DIM_TO_CAMPO` que resolve dimensão lógica → campo real, aplicado em todos os pontos de indexação.

**Análise Dinâmica · feedback de drag rejeitado**

Quando você arrastava uma métrica para Linhas ou Colunas (ou uma dimensão para Valores), o drop era rejeitado em silêncio. Agora aparece um toast curto explicando: "Métricas só podem ir em ∑ Valores".

**Limpeza**

Função `_pvFatosCompativeis` que ficou definida sem ser chamada foi removida.

---

## v4.21 · 02/mai/2026

**Bug fixes encontrados em revisão crítica das versões 4.17 a 4.20**

Antes de avançar para reformulações grandes (Processamento), revisei o código entregue desde a v4.17 e corrigi problemas reais detectáveis sem teste:

**Análise Dinâmica**

- Removida cláusula sempre-verdadeira na validação de métricas (sem impacto funcional, mas era código morto que dificultava leitura).
- Exportação para XLSX não tenta mais carregar SheetJS sob demanda, já que o sistema já carrega a biblioteca no `index.html`. Antes ficava o risco de carregar uma versão diferente em paralelo.

**Excesso de Estoque**

- Status `'ZERADO'` (que eu havia inventado) corrigido para `'MORTO'`. O filtro de excessos só captura `PARADO/MORTO/CRITICO`; produtos sem estoque ficavam com status não reconhecido e somem dos filtros.
- Adicionada defensiva no helper `_calcularGiroMaiorMes` para o caso (improvável) de lista de candidatos vazia.

---

**Reformulação da página Processamento adiada**

Comecei a implementar a reformulação (lista compacta + painel detalhe + KPIs) mas reverti antes de empacotar. A reescrita envolve 14 queries Firestore em paralelo na abertura da página, possivelmente exige índice composto, e inventa critérios de "atraso" (7d/30d/60d) que precisam ser validados com você. Vamos retomar em sessão dedicada quando você puder testar incrementalmente.

---

## v4.20 · 02/mai/2026

**Excesso de Estoque · novo método de cálculo "Maior mês de venda"**

A página Excesso de Estoque agora oferece dois métodos de cálculo do giro/dia, alternáveis por toggle no topo:

**Cálculo Winthor** (método atual, mantido como default)
- Usa o `giro_dias` que vem do ERP, baseado na fórmula tradicional do Winthor.

**Maior mês de venda** (novo)
- Compara a quantidade vendida nos 3 últimos meses fechados com o mês atual.
- Usa o **maior** dos 4 valores como referência de venda.
- Se o vencedor é um mês fechado, divide a qtde por 30 para obter o giro/dia.
- Se o vencedor é o mês atual (aberto), divide pelos dias corridos do mês.
- Se o mês atual tem menos de 5 dias, é ignorado pra evitar falsos alarmes de ruptura.

Quando o método "Maior mês de venda" está ativo, o status do SKU (ATIVO, CRÍTICO, PARADO, MORTO) é recalculado com base na nova cobertura. Passar o mouse sobre a coluna "Giro (d)" mostra o detalhe: qual mês venceu, com quantas unidades, e como o cálculo foi feito.

A escolha do método persiste no navegador. Os dados base (vendas_por_mes por SKU) já vêm prontos do ETL no `estoque.json`. Se a base ativa não tiver os campos de meta necessários (cubos antigos), o botão fica desabilitado.

---

## v4.19 · 02/mai/2026

**Análise Dinâmica · Entrega 3 de 3 (refinos e mobile)**

Esta entrega fecha a reescrita da Análise Dinâmica iniciada na v4.17. Foco em estabilidade, mobile e bug fixes.

**Touch / mobile**

- Drag-and-drop agora funciona em telas touch (celular e tablet). Toque e segure um campo, arraste pra zona desejada e solte. Um "fantasma" do campo segue o dedo.
- Layout muda em telas estreitas: painel de campos vai pra baixo da pivot em vez de ficar lateral.

**Performance e UX**

- Indicador "⏳ calculando…" aparece imediatamente quando você arrasta um campo. Antes, a tela ficava parada por alguns segundos sem feedback.
- Cálculos da pivot agora são debounced (80ms): se você arrastar vários campos seguidos, calcula só uma vez no fim.
- Gráfico do Chart.js é destruído ao sair da página da Análise Dinâmica, libera memória.

**Bug fixes**

- Mensagem "Nenhuma métrica é compatível" agora explica qual dimensão está bloqueando e como resolver. Antes era genérica.
- Select de "Carregar análise salva" mostra "⏳ Carregando…" enquanto Firestore responde, e fica desabilitado nesse intervalo (evita clique acidental).
- Mensagem "— Nenhuma análise salva —" aparece quando ainda não há nada salvo.

**Refinos visuais**

- Campos arrastáveis sobem levemente ao passar o mouse.
- Zonas de drop destacam ao receber drag (cor de borda).
- Cursor muda pra "grabbing" durante o drag.
- Hover no botão × dos pills agora destaca melhor.

---

## v4.18 · 02/mai/2026

**Análise Dinâmica · Entrega 2 de 3 (salvar + gráficos + exportar)**

Continuação da reescrita iniciada na v4.17. Esta entrega adiciona persistência no Firestore, gráficos derivados da pivot, e exportação para Excel.

**Salvar / Carregar / Excluir análises**

- Botão "💾 Salvar" no topo do painel direito. Pede um nome e pergunta se quer compartilhar com o time (todos os usuários autenticados podem ver) ou deixar privada (só você).
- Dropdown "— Carregar análise salva —" mostra suas análises e as compartilhadas pelo time, agrupadas separadamente. Ícone 🌐 indica análises suas que estão compartilhadas.
- Botão "🗑 Excluir" remove a análise selecionada. Você só consegue excluir as suas próprias (admin pode excluir qualquer).
- Análises ficam salvas no Firestore, sincronizadas entre dispositivos.

**Gráficos derivados da pivot**

- Botão "📊 Gráfico" abre um painel acima da tabela que reflete a pivot atual.
- Tipos disponíveis: Colunas, Linhas, Pizza.
- Seletor de qual métrica plotar (entre as métricas configuradas em ∑ Valores).
- Pizza mostra top 10 + "Outros".
- Quando você reordena a pivot ou troca filtros, o gráfico atualiza junto.

**Exportar para Excel**

- Botão "📥 XLSX" baixa a pivot atual como arquivo .xlsx pronto pra abrir no Excel ou Google Sheets.
- Mantém a estrutura de cabeçalhos (linhas + colunas + métricas).
- Biblioteca SheetJS é carregada sob demanda apenas quando você clica em exportar (não pesa o load inicial).

**⚠ Antes de funcionar, precisa atualizar as regras Firestore.** Está no arquivo `REGRAS_FIRESTORE_v4.18.txt`. Cole no Firebase Console > Firestore > Regras > Publicar. Sem isso, salvar análise vai dar "Missing or insufficient permissions".

**Pendente para Entrega 3:**

- Pré-agregações server-side para resolver os 23MB no cliente
- Cache de pivots calculados
- Drag-and-drop touch (mobile)
- Refinos visuais

---

## v4.17 · 02/mai/2026

**Análise Dinâmica reescrita como tabela dinâmica estilo Excel (Entrega 1 de 3)**

Esta é a primeira de três entregas planejadas. O motor da pivot foi reescrito do zero para suportar análises arbitrárias.

**O que está funcional nesta entrega:**

- **Drag-and-drop** de dimensões e métricas entre 4 zonas: 🔍 Filtros, 📋 Linhas, 📊 Colunas, ∑ Valores. Arraste qualquer campo do painel esquerdo direto para a zona desejada.
- **Múltiplas dimensões em linhas e colunas** sem limite. Por exemplo: linha = Departamento + Categoria, coluna = Loja + Mês.
- **Compatibilidade automática:** as métricas ficam riscadas quando incompatíveis com as dimensões escolhidas (ex: "Pago" não funciona com Vendedor porque o Financeiro não tem essa dimensão).
- **Filtros multi-select:** clique em uma dimensão na zona Filtros para abrir um seletor com busca, "Todos" e "Nenhum".
- **Análise vertical:** mostra cada célula como % do total da coluna.
- **Análise horizontal:** mostra cada célula como % de crescimento vs a coluna anterior.
- **Ordenação:** click no cabeçalho de qualquer coluna ordena ASC/DESC. Detecta tipo automaticamente.
- **Persistência local:** o estado da pivot (rows/cols/vals/filtros) fica salvo no navegador. Quando você volta na página, está como deixou.
- **Métricas de 3 fatos no mesmo painel:** Vendas (10 métricas), Compras (3), Financeiro (3).
- **Métricas calculadas:** Margem % e Ticket médio são calculadas sobre os agregados, não somadas.
- **Limite de 500 linhas** por render, pra não travar a UI em pivots gigantes. Use filtros para refinar.

**Pendente (próximas entregas):**

- Salvar/carregar/excluir análises com nome no Firestore (próxima sessão)
- Compartilhar análises com outros usuários
- Gráficos de linhas, colunas e pizza derivados da pivot
- Exportar pivot para Excel
- Pré-agregações server-side para resolver os 23MB no cliente

---

## v4.16 · 02/mai/2026

**Sprint 1 (final) + Sprint 2 (UX) + Sprint 3 (acessibilidade)**

Sprint 1 · finalização

- Indicador de freshness no header: agora mostra a data do snapshot (ex: 📅 29/04/2026) ao lado do badge de filial, atualizado quando os dados carregam.
- Bug do PAGO de R$ -2,1 bilhões em Mar/26 identificado: é problema do ETL no `financeiro_cp3.json` (valor +2,1 bi em fev/26 e -2,1 bi em mar/26). Documentado em `NOTA_ETL_PENDENTE.md`. Não corrigível no front.

Sprint 2 · UX

- Menu manager: ao abrir o dropdown de filial, o menu de usuário fecha automaticamente (e vice-versa). Não tem mais dois menus abertos sobrepostos.
- Skeleton de carregamento no banner da Análise Dinâmica e Verbas em vez de "Período: ? a ?".
- KPI "QT total vendida" da Visão Itens & Deptos foi separado em "QT em unidades" (mercearia, bebidas, bazar, hipel) e "QT em KG" (perecíveis, açougue, hortifruti).
- Item "Alterar senha" adicionado ao menu do usuário. Faz refresh do token e marca senha_temp como falso no Firestore.
- Tabelas com scroll horizontal: gradiente lateral indicando que dá pra rolar (não corta colunas sem aviso).

Sprint 3 · acessibilidade

- `<meta name="robots" content="noindex, nofollow">` adicionado para prevenir indexação acidental.
- `maximum-scale=1.0` removido do viewport (impedia zoom no mobile, ruim pra acessibilidade).
- `:focus-visible` global: foco de teclado consistente em botões, links, inputs e selects.
- aria-label nos botões-ícone (mobBtn, collapseBtn, btn-xlsx, btn-pdf).

---

## v4.15 · 02/mai/2026

**Sprint 1 · bugs críticos de confiança (parte 1)**

- **2 exceções de JavaScript que travavam telas inteiras corrigidas.** A barra de filtros de Vendas e a tabela "Análise por departamento" de Compras não quebram mais.
- **KPI "Pago" no Compras × Vendas × Financeiro:** texto ambíguo "85,7% do total" causava confusão (a base era pago vs aberto, não pago vs compras). Agora mostra "85,7% do exigível (pago+aberto)".
- **KPI "Vl imobilizado" em Excesso de Estoque:** quando a base não trazia o total do estoque (caso de bases consolidadas), mostrava "0,0% do estoque total" enganoso. Agora calcula via fallback (soma por_status) ou mostra "estoque total não disponível".
- **KPI "Vencidos" entre Visão Executiva e Financeiro:** valores diferentes (24,7M vs 25,3M) sem explicação. A diferença é a faixa "vencido hoje". Agora ambos os subtítulos deixam o critério explícito.
- **Badge de alertas no menu lateral:** mostrava "9" hardcoded. Agora é populado dinamicamente com a contagem real (ex: "3,9k") quando os dados de Estoque carregam.
- **Contagem de departamentos:** Compras mostrava 10 e Vendas mostrava 9 (Compras incluía o INATIVO). Agora os dois usam o mesmo critério (sem INATIVO).
- **Gráficos de pizza/donut:** corrigido bug que renderizava cortado/deslocado no primeiro paint. Adicionado resize automático após o layout estabilizar.

---

## v4.14 · 02/mai/2026

**Supervisores ignorados · resiliência**

- Antes: ao salvar a configuração de supervisores ignorados, podia aparecer "Erro ao salvar: Missing or insufficient permissions" mesmo com permissões corretas. Causa: token de autenticação ficava com decisões obsoletas após mudanças nas regras do Firebase.
- Agora: o sistema força refresh do token antes de cada salvamento crítico, e se ainda assim houver erro de permissão, tenta uma segunda vez automaticamente.
- Resultado: salvamento confiável sem precisar fazer logout/login.

---

## v4.13 · 02/mai/2026

**Limpeza e melhorias diversas**

- **Compras líquidas:** o KPI "Total comprado 12m" agora mostra valor líquido (compras brutas menos devoluções a fornecedor). Mostra os dois valores na descrição.
- **Removido gráfico** "Faturamento × Preço médio por departamento" (Visão Itens & Departamentos).
- **Recebimentos · CP corrigido:** página estava quebrada nas filiais Cestão Pinto (CP1, CP3, CP5, CP40). Causa: KPIs hardcoded em `R.resumo.ATP`. Agora detecta a base ativa automaticamente.
- **Recebimentos · GPC oculto:** RCAs internos do GPC (intragrupo, ex: "RCA GPC") não aparecem mais nas tabelas de inadimplência.
- **Renomeado:** página "Benchmarking" → "RCA". Removidos os gráficos de "Top 10 maiores crescimentos" e "Top 10 maiores quedas".
- **Menu de Vendas simplificado:** removidas as 4 entradas individuais de loja (ATP-Varejo, ATP-Atacado, Cestão Loja 1, Cestão Inhambupe). Para análise por loja, use a Visão Consolidada com filtro.
- **Top categorias respeita filtro de departamento:** ao filtrar por depto na seção Itens & Deptos, a tabela de categorias agora mostra apenas categorias daquele departamento.
- **Tabelas com filtro e ordenação:** todas as tabelas com 6+ linhas agora têm uma busca por texto acima e ordenação por clique no cabeçalho da coluna (detecta números, R$, % e texto automaticamente).
- **Mobile · botão do usuário:** layout corrigido — antes o botão ficava cortado/escondido em telas estreitas. Agora mostra avatar circular + menu suspenso com nome completo e logout.

---

## v4.12 · 01/mai/2026

**Bug crítico · Administração (continuação)**

- Corrigido outro ponto que abortava o script de Administração: `let allForn = D.fornecedores` no top-level falhava porque `D` é null em modo modular.
- Mesmo padrão do bug da v4.11 (que corrigiu o `srchInp.addEventListener`), só que em outro ponto.
- Agora protegido com `D && D.fornecedores`.

**Histórico · tela em construção**

- Antes: erro vermelho "HTTP 404 — verifique se snapshots.json está no servidor".
- Agora: tela amigável "Histórico em construção", explicando que a funcionalidade depende do ETL gerar snapshots periódicos.

---

## v4.11 · 01/mai/2026

**Bug crítico · Administração não abria**

- Página de Administração lançava `Cannot access 'GPC_DEFAULTS' before initialization`.
- Causa: o script da página tentava registrar listener no campo de busca de Diagnóstico sem checar se o elemento existia. Quando o elemento estava ausente, o script abortava antes de inicializar a constante de fornecedores GPC, e qualquer acesso posterior à página de Administração caía em erro.
- Correção: guards (`if(elemento)`) antes dos `addEventListener`.

**UX · Manter página ao trocar visão de empresa**

- Antes: trocar de "ATP" para "Cestão Loja 1" jogava o usuário de volta para a Home.
- Agora: ao recarregar com nova base, a página em que o usuário estava é restaurada (Estoque continua em Estoque, Vendas em Vendas, etc).
- Se a página não estiver disponível para a nova base ou o perfil não tiver permissão, cai silenciosamente em Home.

**Verbas · descrição do produto mais robusta**

- Quando a descrição do produto vier vazia do CSV, agora mostra um placeholder com o código no lugar de uma célula em branco.

---

## v4.10 · 01/mai/2026

**Bug crítico · Análise Dinâmica em GPC Consolidado**

- A página "Análise Dinâmica" estava retornando R$ 0 em todas as células e labels "undefined" quando a base selecionada era GPC Consolidado.
- Causa: o cubo OLAP de CP (usado como fallback do Consolidado) tem schema antigo com nomes de campos diferentes (`fat_liq`, `lucro`, `rca`, `filial`) do que o motor de pivot espera (`v_liq`, `v_luc`, `vend`, `lj`).
- O normalizador `_normalizarCubo` mapeava só os nomes das dimensões, mas não os campos das métricas — resultado: o motor lia `undefined` em vez dos números.
- Correção: mapeamento completo de todos os campos (dimensões + métricas + filial). Adicionado fallback `|| 0` nas somas pra tolerar campos ausentes (cubo CP não tem `v_nfs`/`v_cli`).

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
