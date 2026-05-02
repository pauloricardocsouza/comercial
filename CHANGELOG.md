# Histórico de versões · Comercial GPC

Lista das melhorias do sistema de BI da R2 Soluções para o Grupo Pinto Cerqueira.

---

## v4.30 · 02/mai/2026

**Etapa 7 · Diagnóstico de fornecedor expandido**

Página de diagnóstico de fornecedor recebeu três adições importantes. Boa parte do que você pediu (extrato de entradas, posição financeira com aging, notas pagas, itens em excesso) já existia na versão anterior, mas estava parcialmente coberta. Agora está mais completa.

**Nota honesta sobre escopo**

Você mencionou que tinha feito uma versão mais completa em outro chat. Eu não tenho acesso àquela conversa (cada chat é isolado), então construí com o que tenho disponível nos JSONs atuais. Pode não ficar idêntico ao que você lembra. Se faltar algo específico, me diga o que.

**Mudanças desta versão**

1. **Histórico mensal redesenhado · vendas vs compras (R\$)**

A versão antiga mostrava apenas quantidade vendida por mês (em barras). Agora mostra dois conjuntos no mesmo gráfico: vendas em valor (barras verdes) e compras em valor (linha laranja). Permite ver visualmente se o fornecedor está com saída maior ou menor que entrada — indicador de pressão de estoque ou ruptura. Cabeçalho mostra os totais de vendas e compras no período.

Quando o cubo OLAP não está carregado, a página cai no comportamento antigo (só qt vendida), com aviso pra abrir Análise Dinâmica primeiro.

2. **KPI novo · Prazo médio de compra**

Adicionado um sexto KPI no header da página: "Prazo médio compra", calculado como média ponderada por NF dos prazos das entradas no período. Indicador útil pra comparar fornecedores e negociar condições.

3. **NFs em aberto separadas em "vencidas" e "a vencer"**

Antes a tabela de títulos abertos misturava os dois. Agora aparecem em duas tabelas distintas, com cabeçalho contextual e até 50 linhas em cada. Vencidas aparecem primeiro com ícone ⚠.

**O que a página mostra hoje (lista completa)**

- Hero com tags automáticas (margem negativa, devoluções altas, fornecedor estratégico, etc.)
- 6 KPIs (SKUs, Compras 12m, Vendas, Lucro, Devoluções, Prazo médio compra)
- Histórico mensal vendas vs compras
- Top 12 SKUs por faturamento (gráfico)
- Tabela completa de SKUs do fornecedor
- Itens em excesso (subset visual com top 50)
- Extrato de entradas mensal (do cubo OLAP)
- Posição financeira com aging em 6 buckets
- NFs vencidas (separadas)
- NFs a vencer (separadas)
- Notas pagas · resumo (total pago, juros, descontos)
- Observações automáticas (margem, devoluções, paralisação, concentração)

**Limitação dos dados**

O ETL não exporta extrato detalhado nota a nota — só agregados mensais e o `compras_12m` resumido por SKU. Pra reconstruir nota a nota teria que mudar o ETL pra exportar uma tabela de NFs de entrada por fornecedor com data, valor, quantidade, prazo.

---

## v4.30 · 02/mai/2026

**Etapa 7 · Diagnóstico de fornecedor expandido**

A página de Diagnóstico de Fornecedor ganhou 4 seções novas que tornam ela um painel completo do relacionamento com cada fornecedor.

**Itens em excesso · novo bloco**

Lista todos os SKUs do fornecedor com status PARADO, MORTO ou CRÍTICO, ordenados por valor imobilizado. Mostra: produto, quantidade em estoque, valor a custo, data da última entrada e status. Cada produto é clicável (drill direto pro diagnóstico do produto). Limite de 50 itens visíveis com aviso quando há mais.

**Extrato de entradas · novo bloco**

Tabela mensal de compras do fornecedor com valor, quantidade, NFs e prazo médio de pagamento por mês. Os dados vêm do cubo OLAP. Se o cubo ainda não estiver carregado quando você abrir o diagnóstico, o sistema dispara o carregamento em background e re-renderiza automaticamente quando chega — você não precisa visitar a Análise Dinâmica antes.

**Posição financeira · novo bloco**

Mostra todos os títulos do fornecedor que ainda não foram pagos, com:
- 6 cards de aging (A vencer, Hoje, 1-7d, 8-30d, 31-90d, 90+d) com valor e contagem de títulos em cada faixa
- Tabela detalhada com vencimento, NF, valor, dias de atraso e conta contábil
- Filtra apenas contas relacionadas a fornecedores de mercadorias (10001 e 99912), consistente com o resto do sistema

**Notas pagas · novo bloco**

4 cards com o resumo do que já foi pago para o fornecedor:
- Total pago
- Quantidade de títulos pagos
- Juros pagos (em vermelho se > 0, indicando atrasos custosos)
- Descontos obtidos (em verde se > 0, indicando bom relacionamento comercial)

**Ressalva**

Versão construída do zero baseada nos dados disponíveis no sistema atual (estoque, cubo OLAP, financeiro). Pode diferir da versão anterior do projeto compras.solucoesr2.com.br que foi mencionada — sem acesso àquele código, fui pelas seções que fazem sentido com os dados que tenho.

---

## v4.29 · 02/mai/2026

**Etapa 6 · Drill-through · clique abre diagnóstico**

Implementei um sistema global de drill-through. Qualquer elemento marcado com `data-prod-cod` ou `data-forn-cod` em qualquer página do sistema agora vira clicável e abre a página de diagnóstico correspondente — produto ou fornecedor.

**Como funciona**

Adicionei um listener delegado no `document.body` que intercepta cliques. Quando o usuário clica numa célula marcada, o sistema abre `_openProdNovo(cod)` ou `_openFornNovo(cod)` automaticamente. Isso evita ter que atribuir handlers manuais em cada tabela.

**Visual**

Células clicáveis ganham:
- Cursor `pointer`
- Hover sutil em laranja (rgba(245,134,52,.08))
- Tooltip "Clique para ver diagnóstico do produto/fornecedor"

**Onde já está ativo**

- Excesso de estoque · top 100 (produto)
- Excesso de estoque · por fornecedor (fornecedor)
- Análise de fornecedores · ranking (fornecedor)
- Fornecedores GPC · listas (fornecedor)
- Verbas · top fornecedores (fornecedor)
- Verbas · top produtos (produto)
- Verbas · aplicações detalhadas (ambos)
- Análise por departamento · drill em níveis (categoria/seção)
- Estoque · top SKUs (produto)
- Outras tabelas que já tinham `onclick` nativo continuam funcionando

**Compatibilidade**

A delegação não interfere com handlers `onclick` existentes — quando há um onclick num ancestor, a delegação cede a vez. Tabelas que tinham `<tr onclick="openProd(123)">` continuam funcionando idêntico.

---

## v4.29 · 02/mai/2026

**Etapa 6 · Drill-through · clique em fornecedor/produto**

Agora qualquer fornecedor ou produto exibido nas tabelas leva direto para a página de diagnóstico correspondente quando clicado. Antes era preciso navegar até "Diagnóstico de Produto" ou "Diagnóstico de Fornecedor" e buscar manualmente.

**Como funciona**

Adicionado um listener global de cliques que detecta elementos marcados com `data-prod-cod="X"` ou `data-forn-cod="X"`. Ao clicar, abre a página de diagnóstico daquele item. Cursor vira pointer no hover, fundo da célula fica laranja claro e o texto vira cor de destaque pra deixar claro que é clicável.

**Tabelas marcadas nesta versão**

- Excesso de Estoque · top 100 produtos
- Excesso de Estoque · excesso por fornecedor (novo quadro)
- Curva ABC · top 100 produtos
- Análise de Fornecedores · tabela principal
- Análise de Fornecedores · top 10 devoluções
- Posição Financeira · top fornecedores em aberto
- Fornecedores GPC · tabela principal

Mais tabelas serão marcadas conforme uso real revelar onde os usuários esperam clicar.

**Outras tabelas e listas com produto/fornecedor que não foram marcadas**

Algumas listas em gráficos (top X em barras horizontais por exemplo) não foram marcadas porque envolvem elementos do Chart.js, não do DOM da tabela. Pra fazer isso precisaria de handlers customizados de clique no canvas — pode ser uma evolução futura.

---

## v4.28 · 02/mai/2026

**Etapa 5 · Visão consolidada, Evolução mensal e Recebimentos**

**Visão Consolidada · aviso quando base não é GRUPO**

Quando o usuário trocava a base ativa para uma loja específica (ATP, CP1, etc), a Visão Consolidada ficava em branco porque o JSON daquela loja não tem dados consolidados de todas as lojas. Agora aparece um aviso amarelo claro com botão "Trocar para base GRUPO" pra evitar confusão.

**Evolução mensal · novo gráfico comparativo**

Adicionado um novo bloco "Comparativo · loja em destaque vs demais" abaixo do gráfico multi-linha existente. O usuário escolhe uma loja num seletor, e o gráfico destaca essa loja (linha grossa colorida com área preenchida) enquanto as outras aparecem em cinza claro como referência. Abaixo do gráfico, um resumo numérico mostra:
- Faturamento acumulado da loja
- % do grupo
- Posição no ranking de faturamento

**Recebimentos · normalização de schema entre ATP e CP**

Bug crítico identificado: a página Recebimentos estava quebrada para todas as bases CP (CP1, CP3, CP5, CP40) e parcialmente para o consolidado. Causa: o ETL gera dois schemas diferentes:

- ATP usa `total_atrasado`, `clientes_inadimplentes`, `rcas_envolvidos`, `dias_atraso_medio`
- CP usa `valor`, `inadimplentes`, `rcas`, sem dias

O código antigo só conhecia o schema ATP, então nas bases CP os KPIs apareciam zerados. Agora o código detecta e normaliza ambos para um formato único antes de renderizar.

**Limitações conhecidas (problema do ETL)**

Os JSONs CP não trazem `dias_atraso_medio` nem `dias_atraso_mediano`, então esses KPIs aparecem como "0d" nas bases CP. Pra resolver, o ETL precisa ser ajustado para gerar esses campos também na visão CP. O `_total_grupo` também não tem `rcas`, então o KPI "RCAs envolvidos" fica como 0 no consolidado.

Em alguns clientes do CP1, o campo `faixas` traz contagem de parcelas em vez de valor monetário — isso também é problema de ETL, não de frontend.

---

## v4.27 · 02/mai/2026

**Etapa 3 · Excesso de estoque**

**Status PARADO/MORTO agora são estáveis entre métodos de cálculo**

Antes: PARADO/MORTO eram definidos pela cobertura de estoque (giro_dias > 180 ou > 365). Quando o usuário trocava entre "Cálculo Winthor" e "Maior mês de venda", o número de itens em cada status mudava porque o cálculo de cobertura mudava — confuso.

Agora: PARADO e MORTO são definidos pela ausência de venda nos últimos meses, independente do método. CRÍTICO e ATIVO continuam usando cobertura.

- **MORTO**: sem estoque OU sem venda nos últimos 180 dias
- **PARADO**: sem venda nos últimos 90 dias
- **CRÍTICO**: vende, mas com cobertura > 90 dias
- **ATIVO**: vende com cobertura ≤ 90 dias

A legenda da Análise por Departamento foi atualizada com as novas definições.

**Coluna "Dias p/ consumir"**

A coluna "Giro (d)" da tabela de excesso foi renomeada para "Dias p/ consumir" — nome mais claro, com tooltip explicando "Dias até esgotar o estoque atual no ritmo de venda".

**Top 100**

A tabela "Top 50 · maior valor imobilizado" virou "Top 100", mostrando o dobro de SKUs em excesso.

**Excesso de estoque por fornecedor**

Novo quadro acima da tabela de top 100. Lista os top 50 fornecedores com SKUs em excesso, ordenados por valor imobilizado. Mostra: SKUs em excesso, valor a custo, valor em preço de venda, e contagem de status críticos/parados/mortos por fornecedor.

---

**Etapa 4 · Financeiro filtrado por contas de mercadorias**

**Posição financeira e Vencidos a pagar**

Ambas páginas agora mostram apenas contas relacionadas a fornecedores de mercadorias:
- `10001` · COMPRA DE MERCADORIAS
- `99912` · MULTA E JUROS DE MORA

Banner azul no topo das duas páginas avisa explicitamente do filtro ativo. Os agregados (KPIs, aging, totais) são todos recalculados a partir dos títulos filtrados — não mostram mais valores de salários, impostos, fretes, energia etc.

**Vencidos: filtro de grupo removido**

Como já vem filtrado por conta, o seletor "Grupo de despesa" virou redundante e foi removido da página Vencidos. Os filtros restantes são: Faixa de atraso e Buscar fornecedor.

---

## v4.26 · 02/mai/2026

**Etapa 2 (parcial) · Filtros de mês + ajustes em departamento**

**Verbas com filtro de mês**

Na página Verbas aplicadas em produtos agora existe um seletor de mês acima do banner. Selecionando um mês específico, todos os agregados são recalculados a partir das aplicações daquele mês: KPIs, gráficos, tabelas de departamento, seção, fornecedor, produto e concentração. Voltar para "Todos os meses" restaura o comportamento original. A escolha não é persistida entre sessões — toda vez que entra na página, começa em "Todos os meses".

**Análise por departamento**

- Adicionada legenda explicativa dos status (ATIVO, CRÍTICO, PARADO, MORTO) acima da tabela.
- Removida coluna "Markup %" da tabela. A coluna "Margem %" foi mantida.
- Estados PARADO e MORTO recebem destaque visual (badges coloridas) na contagem.

**Páginas que NÃO receberam filtro de mês**

Os JSONs gerados pelo ETL exportam apenas o total acumulado nas chaves `vendas.valor`, `vendas.lucro` etc., e o desdobramento mensal (`vendas_por_mes`) traz somente quantidade vendida, não valor nem lucro. Por isso, as seguintes páginas precisariam de mudança no ETL antes de receber filtro de mês:

- Curva ABC
- Análise de fornecedores
- Fornecedores GPC
- Análise por departamento

Pra implementar filtro de mês nessas páginas, o ETL precisa exportar `vendas_por_mes` com `valor` e `lucro` (não só `qt`).

---

## v4.25 · 02/mai/2026

**Etapa 1 da reformulação · 8 itens**

Primeira leva de melhorias da nova lista de demandas. Mudanças pequenas e mecânicas, com baixo risco.

**Linguagem**
- "Snapshot" virou "Retrato" em toda a interface visível ao usuário (banners, tooltips, listas, mensagens). URLs (`?snapshot=`) e código interno foram preservados pra não quebrar links salvos.

**Excesso de Estoque**
- Título: removido "imobilizações sem giro". Fica só "Excesso de estoque".

**Verbas**
- Título mudado de "Verbas e descontos comerciais" para "Verbas aplicadas em produtos".
- Removido subtítulo "Modelo: verba como redução de custo".
- Removido aviso "Limitação WinThor: coluna TIPO_VERBA vem 100% vazia".

**Limpeza de gráficos**
- Removido "Variação YoY · GRUPO" da Evolução Mensal (era um gráfico de barras com % vs ano anterior).
- Removido "Ticket médio por dia da semana" da página Vendas Diárias.
- Página Drill-Down removida do menu (a section HTML continua escondida pra preservar histórico de URLs).

**Mobile**
- Zoom de pinça travado novamente (`maximum-scale=1.0,user-scalable=no`). Trade-off conhecido: perde-se acessibilidade pra usuários com baixa visão, mas ganha-se UX em interações de toque.
- Avatar do menu de usuário encolheu: 30px no desktop, 26px em telas até 768px, 24px até 560px, 22px até 380px. Não vaza mais do cabeçalho em iPhone SE e similares.

---

## v4.24 · 02/mai/2026

**Análise Dinâmica · novo layout de configuração**

Reformulei a interface da Análise Dinâmica conforme feedback. O layout antigo (painel lateral fixo + tabela à direita) foi substituído por um fluxo vertical mais limpo.

**Novo layout**

- **Topbar:** botão "Ocultar painel", info do período/contagens, e ações XLSX/Gráfico à direita.
- **Painel de configuração** (acima do resultado):
  - Coluna esquerda: lista de campos (dimensões e métricas)
  - Coluna direita: zonas de drop em grid 2×2 (Filtros / Linhas / Colunas / Valores)
  - Linha de ações: Comparativo, Limpar, Carregar análise, Salvar, Excluir
- **Área de resultado** (sempre visível abaixo): tabela e/ou gráfico

**Botão "Ocultar painel"**

O painel de configuração inteiro pode ser ocultado com um clique. Útil quando você já configurou a análise e quer ver só o resultado em tela cheia. O estado é persistido — se você ocultou e recarregar, continua oculto.

**Página inicial em branco**

Ao abrir a Análise Dinâmica pela primeira vez, todas as zonas começam vazias. Antes vinha pré-configurado com Mês × Faturamento líquido. Agora o estado inicial é uma tela vazia com instruções claras: "Comece configurando sua análise". Análises salvas anteriormente continuam disponíveis no dropdown "Carregar análise".

**Botão Limpar pede confirmação**

Antes limpava direto. Agora pergunta antes — evita perda acidental.

**Mensagem de boas-vindas redesenhada**

A mensagem inicial ficou mais convidativa: ícone grande, título "Comece configurando sua análise", e instruções em duas linhas claras.

**Mobile**

Em telas estreitas (<900px), painel vira coluna única, zonas viram 1×4, ações se ajustam.

---

## v4.23 · 02/mai/2026

**Análise Dinâmica · revisão estática profunda**

Continuei a revisão crítica do código e encontrei mais bugs detectáveis sem teste:

**Métrica nova: Descontos obtidos**

O fato financeiro do cubo tem um campo `f_desc` (descontos) que eu não havia mapeado. Adicionado como métrica "Descontos obtidos" na seção Financeiro.

**Cache de cálculo: gráficos e exports não recalculam mais**

Quando você abria o gráfico ou exportava XLSX, a pivot era recalculada do zero. Em pivots grandes isso podia congelar a tela por segundos. Agora o resultado é cacheado em `_pvUltimoResultado` e reutilizado.

**Cache de labels de dimensões**

O lookup de "qual é o nome do depto código 3?" era feito por busca linear na lista. Pra pivots com muitas linhas e dimensões grandes (ex: 1500 SKUs), isso podia chegar a milhões de comparações por render. Agora é Map com lookup O(1).

**Pizza com valores negativos: agora mostra mensagem em vez de gráfico esquisito**

Métricas como Lucro podem ter valores negativos (prejuízo). Pizza não consegue representar fatias negativas. Agora valores não-positivos são filtrados, e se não sobra nenhum positivo, aparece "Sem valores positivos para plotar em pizza".

**Pizza com métricas calculadas (Margem%, Ticket médio)**

Antes a pizza somava o valor entre todas as colunas. Pra métricas aditivas (faturamento, lucro) isso é correto. Pra métricas calculadas como margem% ou ticket médio, somar entre colunas distorce o resultado. Agora a pizza usa só a primeira coluna nesses casos.

**Ordenação natural de chaves**

A ordenação default das linhas e colunas usava lex (string). Isso fazia depto 1, 10, 2, 20, 3 aparecer fora de ordem. Agora a ordenação tenta numérico primeiro, depois lex. Datas no formato `2026-04` continuam ordenando corretamente como string.

**Mensagem de erro mais clara quando análise salva está obsoleta**

Se você carregar uma análise salva com métricas que não existem mais nessa versão do sistema, agora aparece "As métricas dessa análise não existem nesta versão do sistema" em vez de uma mensagem confusa com lista vazia.

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
