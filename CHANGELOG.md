# Histórico de versões · Comercial GPC

Lista das melhorias do sistema de BI da R2 Soluções para o Grupo Pinto Cerqueira.

---

## v4.54 · 05/mai/2026

**Três correções a partir do feedback dos prints**

1. **Página Metas agora respeita o filtro VISÃO.** Era o bug do "valor muito maior" no gráfico: o seletor estava em CP3 mas a página mostrava R$ 297,7 mi (soma das 4 lojas) e o gráfico tinha barras de R$ 16-25 mi. Causa: `_metasRenderConteudo` iterava `_METAS_LOJAS` (sempre as 4) e ignorava `_filialAtual`. Agora a página usa o helper `_metasLojasNaBase()` que filtra:
   - GPC Consolidado / GRUPO → 4 lojas (CP3, CP5, ATP-V, ATP-A)
   - ATP → ATP-V + ATP-A
   - Comercial Pinto → CP3 + CP5
   - CP3 / Cestão Loja 1 → só CP3
   - CP5 / Inhambupe → só CP5
   - CP1 ou CP40 → mensagem "Sem metas para a base selecionada" (CP1 e CP40 não têm metas cadastradas)
   
   Os títulos dos gráficos, KPIs, tabela comparativa e histórico detalhado também passaram a usar a label dinâmica do escopo (ex: "Cestão Loja 1 · Meta vs Realizado mensal" no lugar de "GPC ·"). A coluna "GPC" da tabela comparativa só aparece se houver mais de uma loja no escopo.

2. **Visão Consolidada GPC parou de aparecer com o aviso indevido.** O bug era na detecção da base: a página testava só `if (_filialAtual)`, e mesmo na visão GPC Consolidado o `_filialAtual` é `{sigla:'grupo', tipo:'raiz'}` (não-null). Resultado: a página mostrava o aviso "Você está na base GRUPO. Trocar para base GRUPO" e o botão não fazia nada porque já estava lá. Agora a detecção considera GRUPO quando `_filialAtual` é null OU `sigla==='grupo'` OU `tipo` é `'consolidado'/'raiz'`.

3. **CP1 (Comercial Pinto) e CP40 (Barros 40) removidos do seed de Dias C&P.** Você apontou que essas duas lojas não participam de Campanha & Promoção (são atacado). O `dias_cp_seed.json` agora aplica os dias só em GRUPO, ATP-V, ATP-A, CP3 e CP5. **Atenção:** se você já abriu a página Dias C&P na v4.53 antes deste pacote, os docs `CP1_*` e `CP40_*` já foram gravados no Firestore. Apague-os manualmente no console Firestore ou abra a página Dias C&P, selecione CP1/CP40 e remova os dias pelo botão da UI.

---

## v4.53 · 05/mai/2026

**Cabeçalho enxuto + carga inicial de Metas e Dias C&P**

1. **Removido do cabeçalho:** os meses ativos (`Jan/26, Fev/26, Mar/26, Abr/26`) e a data de retrato (`📅 29/04/2026`) que apareciam o tempo todo. Agora o topo só mostra o widget de usuário e os botões XLSX/PDF. As regras CSS dos elementos `#fil-sum` e `#snapshot-info` foram fixadas com `!important` pra prevalecer sobre os scripts que tentavam mostrá-los de novo.

2. **Metas iniciais carregadas (4 lojas, 17 meses cada):**
   - **Cestão Inhambupe (CP5):** R$ 29,3 mi total
   - **Cestão Loja 1 / Irará (CP3):** R$ 115,6 mi total
   - **ATP Varejo (ATP-V):** R$ 110,1 mi total
   - **ATP Atacado (ATP-A):** R$ 42,7 mi total
   
   Para 2026, ATP-V e ATP-A foram derivados rateando a meta consolidada de cada mês pelo perfil VAREJO/ATACADO de 2025 do mesmo mês (porque o Excel só trouxe o split V/A pra 2025 e o consolidado pra 2026). Edite manualmente na página Metas se quiser ajustar os percentuais. CP1 e CP40 ficaram sem metas — o sistema só comporta as 4 lojas listadas em `_METAS_LOJAS`.

3. **Dias C&P iniciais carregados (16 meses, jan/2025 a abr/2026):** os mesmos dias foram aplicados pra todas as 7 lojas (GRUPO, ATP-V, ATP-A, CP1, CP3, CP5, CP40) já que são decisões corporativas. Caso varie por loja, basta editar pela página Dias C&P.

4. **Mecanismo de seed:** ambos os dados foram entregues como arquivos `metas_seed.json` e `dias_cp_seed.json` no diretório raiz do dist. Na primeira abertura de cada página (Metas ou Dias C&P) com Firestore vazio, o sistema lê o seed e grava no Firestore automaticamente. Idempotente — não sobrescreve dados existentes. Ricardo abre a página Metas uma vez, dá meio segundo pra gravar, e tudo aparece.

---

## v4.52 · 05/mai/2026

**Correção: botão Home continuava aparecendo na v4.50/v4.51**

1. **Diagnóstico:** o `style="display:none;"` inline que coloquei no botão era sobrescrito por `_aplicarPermissoesPaginas` (core.js:2640), que faz `btn.style.display = ''` em todos os `.sb-link` permitidos no perfil. Como o template de perfil incluía `'home'` na lista de páginas permitidas, o botão era reabilitado a cada render.

2. **Correção:** adicionada regra CSS `.sb-link[data-p="home"] { display: none !important; }` no `<style>` do `index.html`, que tem precedência sobre o inline manipulado pelo JS. Também removi `'home'` da lista `paginas` do template do perfil "Visualizador" em `core.js`. Agora a Home está oculta em qualquer cenário (admin, visualizador, perfis customizados).

---

## v4.51 · 05/mai/2026

**Badge "ATP · Filial 1" removido do cabeçalho**

1. **Badge fixo "ATP · Filial 1" tirado do topo.** Era um span estático no `index.html` (ao lado dos botões XLSX/PDF), não refletia a base/loja realmente ativa — apenas poluía o cabeçalho. Removido. As regras CSS de responsividade da classe `.base-badge` ficaram no arquivo (sem efeito), prontas pra reuso futuro caso queiramos um badge dinâmico de fato.

---

## v4.50 · 04/mai/2026

**Página Home oculta**

1. **Página Home foi ocultada por enquanto.** O botão "Home" no menu lateral foi escondido (`display:none`), a página inicial padrão passou a ser **Visão Executiva**, e qualquer chamada interna a `renderPage('home')` é redirecionada automaticamente pra Visão Executiva. Se o usuário tinha "home" gravado como última página em `localStorage._paginaAtual`, na próxima abertura cai direto na Visão Executiva. Botão "← Voltar para Home" do Excesso de estoque virou "← Voltar para Visão Executiva".

2. **Configuração reversível em uma linha.** Pra mostrar a Home de novo no futuro, basta remover o `style="display:none;"` do botão em `index.html` linha 1499 e tirar o redirect no topo de `renderPage` em `render-compras.js`.

---

## v4.49 · 04/mai/2026

**Configuração de supervisores ignorados expandida e Compras × Vendas agora desconta**

1. **Compras × Vendas passou a descontar supervisores ignorados.** Era a queixa principal: a página somava todos os RCAs sem respeitar a marcação de "supervisores ignorados" da Administração. Causa identificada: `V.mensal` é agregado por `(loja, ym)` sem campo de vendedor, então o desconto não podia ser feito linha-a-linha como em RCA/Inadimplência. Solução implementada: novo helper `Filtros.fatLiqIgnoradoPorLojaYm(pagina)` que usa `V.vendedores.supervisores_por_filial[loja][cod].fat_liq` (fonte autoritativa, gerada do FATO de vendas) e ratea o total pelos meses da loja proporcionalmente ao perfil de venda. Aplicado em Compras × Vendas, Visão Executiva, Visão Consolidada, Evolução Mensal e Análise 2026.

2. **Lista de páginas no admin foi reformulada.** Antes só apareciam 3 páginas (Inadimplência, RCA, Drill-Down) — todas baseadas em iteração linha-a-linha sobre vendedores. Agora aparecem 8: as 3 antigas + Compras × Vendas, Visão Executiva, Visão Consolidada, Evolução Mensal, Análise 2026. Páginas baseadas em estoque por SKU (Estoque, Excesso, Departamentos, Curva ABC, Fornecedores, GPC) e em vendas diárias por loja (Vendas Diárias, Dias C&P, Metas, Itens & Deptos, Cubo, Diag. Produto, Diag. Fornecedor) **continuam fora da lista** porque o ETL não traz vendedor por SKU/dia — ainda. O texto de ajuda da admin foi reescrito explicando o que entra e o que não entra hoje.

3. **Fonte autoritativa: `supervisores_por_filial`, não cruzamento de cadastro.** Identifiquei que cruzar `V.vendedores.cadastro` × `V.vendedores.mensal` deixaria de fora supervisores como INATIVOS e GPC INTRAGRUPO, que aparecem em `supervisores_por_filial` (gerado do FATO) mas não têm vendedor ativo no cadastro atual do WinThor. Por isso o helper usa diretamente o total já calculado pelo ETL e distribui pelos meses pela proporção mensal de venda da loja. Validado: marcar "CP1 · #9 INATIVOS" desconta exatamente R$ 1.530.601,17 no acumulado, batendo com a fonte.

4. **Cache invalida automaticamente quando você muda a config.** Ao salvar nova seleção em Administração, o cache de evo (`_evoCache`) e do helper agregado (`_fatIgnCache`) são invalidados. Próxima abertura de página recalcula com a config nova sem precisar dar F5.

5. **Aviso explícito sobre limitação ATP no admin.** A nota da página Administração agora informa que os supervisores de ATP-V (VAREJO, GPC INTRAGRUPO) e ATP-A (ATACADO BALCÃO) aparecem na lista mas com `fat_liq=0` no ETL, então marcá-los lá não tem efeito até esse bug ser corrigido no Python.

---

## v4.48 · 03/mai/2026

**Correção de bugs no filtro de supervisores e pins, após revisão profunda**

1. **Inadimplência voltou a renderizar.** Bug crítico introduzido na v4.47 — uma variável (`supsUnicos`) era referenciada antes de ser declarada e a página simplesmente travava ao abrir. Corrigido. A página agora abre normalmente e os filtros aparecem.

2. **Filtro de supervisor agora distingue lojas.** Bug semântico encontrado: o `cod_supervisor=1` é "VAREJO" no ATP-V mas "CESTAO 01 - IRARA" no CP3 e CP40. Antes o filtro juntava todos com mesmo número e quando você marcava "#1 VAREJO" estava também filtrando os RCAs do CESTAO 01. Agora a chave é a combinação **(loja, código de supervisor)** e os chips mostram com clareza: "ATP-V · #1 VAREJO" separado de "CP3 · #1 CESTAO 01 - IRARA". Aplicado em RCA e Inadimplência.

3. **Catálogo de Administração só lista páginas que de fato filtram.** Antes apareciam 25 páginas no dropdown de "Configurar página", mas só 3 (Inadimplência, RCA e Drill-Down) realmente respeitavam a configuração. Marcar nas outras 22 não tinha efeito. Para evitar essa frustração, agora o seletor mostra somente as páginas que efetivamente aplicam o filtro. Quando uma página nova ganhar essa capacidade, ela aparece automaticamente.

4. **Pins na home: snapshot do valor é capturado ao fixar.** Antes, fixar um pin guardava só título e link. Se você recarregava e ia direto pra home sem antes visitar a página de origem, aparecia o aviso "Visite a página de origem". Agora ao clicar pra fixar, o sistema renderiza o pin numa área invisível e guarda o HTML do valor atual no Firestore. Se em alguma sessão futura o renderer não estiver disponível, o último valor visto é mostrado com o rótulo "Valor salvo · visite a página para atualizar". Toda vez que você visita a página de origem o snapshot é renovado.

5. **Race condition no carregamento da config.** O carregamento da configuração de supervisores ignorados era feito em paralelo com a renderização das páginas. Em conexões lentas a página podia renderizar antes do cache chegar, ignorando a config. Agora o init aguarda a config terminar antes de mostrar as páginas.

6. **Picker do diagnóstico só mostra lojas finais.** Antes o picker oferecia "GPC Consolidado" e "Comercial Pinto" como opções, mas clicar lá não resolvia (caía de novo no aviso de loja consolidada). Agora só aparecem as lojas finais: ATP, CP1, CP3, CP5, CP40.

7. **Filtro de período removido da Inadimplência.** Era decorativo — o JSON de inadimplência atual não traz o vínculo cliente×mês de vencimento individual, então clicar em um mês não mudava a tabela. Foi removido pra não enganar. Quando o ETL evoluir trazendo essa granularidade, o filtro volta funcionando de verdade.

---

## v4.47 · 03/mai/2026

**8 ajustes em Vendas**

1. **Página Alertas Vendas removida.** Excluída por completo: botão do menu, página, função de render, fallback. Quem precisa de alertas pode usar a página Alertas em Compras (excessos, parados, quedas).

2. **Itens & Departamentos · filtro de meses nas tabelas.** A página continua acumulando jan/2025+ no topo (KPIs, pizza, evolução) — esses não mudam para preservar a referência. Embaixo, dois quadros novos: "Departamentos visão consolidada" e "Top categorias por departamento" agora respeitam um filtro de meses (todo o período / só 2025 / só 2026 / últimos 12 / clicar mês a mês). Os atalhos ficam logo acima das tabelas. Marcação visual indica quando há filtro aplicado.

3. **Diag. Produto e Diag. Fornecedor saem de Compras.** As duas páginas foram movidas pra fora do grupo Compras e agora aparecem na seção Análise junto com Análise Dinâmica.

4. **EAN no diag de produto.** Cabeçalho do diag agora mostra o EAN do produto se ele existir no JSON (campo `ean`, com fallback `codigo_barras`/`ean13`). **Nota importante:** o JSON atual de estoque ainda não traz EAN — pendência de ETL. Quando o campo for incluído no extract, vai aparecer automaticamente.

5. **Diag só funciona com loja selecionada (já estava certo).** A trava de "selecione uma loja" já existia desde versões anteriores. Verifiquei: o picker oferece todas as lojas ativas do `filiais.json` (ATP, CP1, CP3, CP5, CP40, CP consolidado e GPC consolidado). Se não estavam aparecendo, era cache do navegador. Faça Ctrl+Shift+R uma vez nesta versão.

6. **Pins na home — fallback resiliente.** Antes, se você fixasse um pin em uma página e depois recarregasse e fosse direto pra home (sem visitar a página de origem), aparecia "Elemento não disponível nesta sessão". Agora cada pin guarda no Firestore um snapshot do último HTML rendererizado. Se o renderer não estiver registrado nessa sessão, a home exibe o snapshot salvo com um aviso "Valor salvo · visite a página para atualizar". O snapshot é atualizado toda vez que você visita a página de origem.

7. **Recebimentos → Inadimplência.** O menu agora se chama "Inadimplência" e o título da página também. A barra de filtros foi remodelada: dois grupos de chips (período de vencimento e supervisor multi-select). Você pode clicar em cada mês ou supervisor pra ligar/desligar, ou usar atalhos ("Todos", "Últimos 3"). A tabela top 30 clientes em atraso reage aos filtros aplicados. Nota: o filtro de período no JSON atual atua como filtro informativo na seleção (o JSON não traz vínculo cliente → mês de vencimento individual, apenas agregação mensal). Pendência de ETL pra cobertura completa.

8. **RCA · filtros período + supervisor multi-select.** A página agora tem dois grupos de chips no topo:
   - **Período**: padrão jan-mar 2026, com atalhos (Padrão / Todo 2026 / Últimos 3 / Últimos 6) e clique mês a mês. Se você seleciona, por exemplo, abr-jun 2026, o sistema compara automaticamente com abr-jun 2025 (mesmos meses ano anterior).
   - **Supervisor multi-select**: padrão todos. Cada chip liga/desliga um supervisor; "Todos" volta ao default.

   Tudo reage: KPIs (Δ faturamento, crescimento médio, ativos no período), top 10 por margem, top 10 por ticket, e tabela geral comparativa. A coluna "Supervisor" foi adicionada à tabela geral pra você ver de qual sup cada RCA vem.

---

## v4.46 · 03/mai/2026

**11 ajustes solicitados**

1. **Cabeçalho responsivo em mobile.** Em telas estreitas a topbar agora encolhe: a data atualizada, o nome "Comercial GPC" e em telas muito estreitas até o rótulo "VISÃO" desaparecem pra dar espaço ao seletor de visão e ao avatar.

2. **Departamentos · filtro por mês.** A página agora tem botões de mês (Jan/Fev/Mar/Abr 2026) no mesmo modelo de Compras × Vendas. Quando você seleciona um subconjunto, fat/lucro/margem/qt são recalculados a partir do cubo (granularidade por SKU), preservando o drill-down até categoria. Estoque, markup e contagens de status continuam refletindo a posição atual (são fotos do dia, não fazem sentido por mês).

3. **Padrão de data DD-MM-AAAA.** Criado helper `fDt` que converte qualquer data ISO ou Date em DD-MM-AAAA (com traço, padrão R2). Aplicado em estoque (Retrato), última compra do produto, vencidos e Top 20 contas a pagar. Vou aplicar em mais lugares conforme você for me apontando.

4. **Estoque por departamento · tabela hierárquica drill-down.** O gráfico de barras horizontal foi substituído por uma tabela hierárquica clicável. Departamento → seção → categoria. Cada linha mostra SKUs, estoque a custo, estoque a preço de venda e markup. Clique no departamento expande as seções; clique na seção expande as categorias.

5. **Excesso de estoque · status estável + banner removido.** O banner "Critério: SKUs com status PARADO, MORTO, CRITICO..." foi removido. Mais importante: corrigido o comportamento estranho dos contadores de status mudarem entre os métodos de cálculo. Agora PARADO/MORTO/CRITICO sempre vêm do ETL (são fatos sobre o produto: vendeu ou não vendeu), e o método de cálculo só afeta o **giro de cobertura** (quanto tempo o estoque vai durar). Os números abaixo da seleção de método ficam estáveis.

6. **Financeiro · Top fornecedores filtrado.** Bug corrigido: o "Top 20 contas a pagar por fornecedor" ainda mostrava Banco do Brasil, Receita Federal, Secretaria da Fazenda etc. Causa: o JSON traz por_fornecedor agregado por TODAS as contas, e eu só estava filtrando títulos. Agora reconstruo `por_fornecedor` em runtime a partir dos títulos já filtrados pela conta de mercadorias (10001 e 99912). Esses fornecedores governamentais aparecem em outras contas que não são compras.

7. **Fornecedores · acumulado 2026 + filtro de mês.** Página já estava com isso implementado em versão anterior. Modelo CV de botões de mês.

8. **Fornecedores GPC · idem.** Mesma estrutura de filtros, já implementada.

9. **Curva ABC · só 2026 + filtro de mês.** Já implementada anteriormente. Modo "valor" estima faturamento mensal proporcional à quantidade (limitação do ETL atual que exporta vendas mensais só em quantidade).

10. **Alertas · 4 buckets removidos.** Excluídos: Risco de ruptura, Markup estreito, Alta devolução a fornecedor, Crescimento forte. Mantidos: Excesso de compras, Estoque parado, Queda nas vendas.

11. **Cache busting nos JSONs** (já em v4.45). Cada subida de versão força navegador a baixar JSONs novos.

---

## v4.45 · 03/mai/2026

**Cache busting nos arquivos JSON de dados**

Você reportou que os supervisores extras (CP3 ganhou +2, CP40 ganhou +6, CP5 ganhou +1) não estavam aparecendo no admin. Investiguei e encontrei a causa: o navegador estava cacheando os arquivos JSON antigos.

O sistema sempre teve cache busting nos arquivos JS (`?v=4.45`), mas os JSONs de dados eram baixados sem isso. Quando o `vendas_grupo.json` era atualizado no servidor com supervisores novos, o navegador continuava servindo a versão antiga do cache local.

Corrigi adicionando cache busting com APP_VERSION em todos os fetches dos JSONs em `_fetchJsonComGz`. Agora cada vez que a versão do app sobe, o navegador é forçado a baixar os JSONs novamente.

Pra esta versão funcionar visualmente, é importante que você dê **Ctrl+Shift+R** no navegador (hard refresh) na primeira abertura — isso força a recarga do JS, que aí baixa o JSON com a query string `?v=4.45` e finalmente pega os dados novos.

Depois dessa primeira atualização, qualquer mudança em JSON acompanha a versão do app automaticamente.

---

## v4.44 · 02/mai/2026

**Supervisores · agora todas as combinações filial × supervisor que existem no fato**

Você reportou: "Estranho Inhambupe ter só um supervisor". Investiguei e descobri uma divergência grande entre o que estava sendo mostrado no admin e o que realmente acontece nos dados.

O problema

O cadastro de RCAs (que era a fonte do admin) registra cada RCA em uma loja só. Mas no fato de vendas, RCAs cadastrados em uma filial fazem vendas em outra. Exemplo concreto: RCA #241 está cadastrado como CP1 sup=3, mas o fato de vendas mostra R$ 42M faturados em CP40. Isso é normal no fluxo do WinThor — RCAs do atacado emitem em CP40 mesmo cadastrados em CP1.

Resultado: no admin, CP40 aparecia com só 1 supervisor (#9 INATIVOS), enquanto o cubo de vendas mostra 7 supervisores ativamente faturando lá.

Correção

Adicionei ao `vendas_grupo.json` um campo novo `supervisores_por_filial` reconstruído a partir do FATO de vendas, que lista todas as combinações filial × supervisor que efetivamente existem nos dados, com contagem de RCAs e faturamento real.

O admin agora prioriza esse campo. Se não existir (JSON antigo), cai no comportamento anterior.

Comparação antes vs depois

| Filial | Antes | Depois |
|---|---|---|
| ATP-V | 2 supervisores | 2 supervisores |
| ATP-A | 1 supervisor | 1 supervisor |
| CP1 | 6 supervisores | 6 supervisores |
| CP3 | 2 supervisores | 4 supervisores (+3, +11) |
| CP5 | 1 supervisor | 2 supervisores (+3 GPC INTRAGRUPO) |
| CP40 | 1 supervisor | 7 supervisores (+1, +2, +3, +4, +10, +11) |
| **Total** | 13 combinações | 22 combinações |

Inhambupe (CP5) agora aparece com Cestão 04 e GPC INTRAGRUPO (que vende 1 RCA com R$ 28k). Barros 40 (CP40) deixa de ter só "INATIVOS" e mostra todos os supervisores reais.

Cadastro reconstruído

O cadastro de RCAs em `vendas_grupo.json` também foi reconstruído baseado no fato. Cada RCA agora aparece na filial onde mais fatura (não onde está cadastrado). Total: 304 RCAs (189 CP + 115 ATP).

---

## v4.43 · 02/mai/2026

**ATP · GPC INTRAGRUPO agora soma no total**

Você reportou (com print do WinThor): em jan/26, o WinThor mostra os 3 supervisores de ATP somados:

- VAREJO: R$ 5.263.999,25
- ATACADO BALCÃO: R$ 1.559.701,53
- GPC INTRAGRUPO: R$ 624.017,54
- **Total: R$ 7.447.718,32**

Mas o sistema mostrava só R$ 6.823.697 — exatamente o intragrupo de fora. Causa: o ETL antigo separava o GPC INTRAGRUPO num bloco `intragrupo` à parte e o agregado mensal usado no Compras × Vendas e em outras telas não considerava esse bloco.

Correção: GPC INTRAGRUPO agora entra no `mensal` regular (vai pra ATP-V junto com VAREJO). O bloco `intragrupo` separado ainda existe para análises específicas, mas o total que aparece nas telas bate com o WinThor.

Validação: jan/26 agora soma R$ 7.447.714,65 — diferença de R$ 3,67 só de arredondamento de centavos.

Para 2025 (que veio do JSON antigo), o intragrupo separado foi reincorporado no mensal de ATP-V mês a mês. ATP-V 2025 passou a totalizar R$ 80,7M (antes era ~R$ 75,2M, faltavam ~R$ 5,5M de intragrupo).

Limitação: para os agregados mais granulares de 2025 (vendas_por_sku, deptos, categorias_top, fornecedores_top, produtos_top), o intragrupo não foi reincorporado porque o JSON antigo não preservou esses dados separadamente. Esses 5 agregados de 2025 estão subestimados em ~6%. Quando você enviar os dados originais de 2025 reprocesso tudo do zero e o problema some.

vendas_grupo.json também atualizado pra refletir os mesmos vendedores de ATP (incluindo o supervisor 3 GPC INTRAGRUPO).

---

## v4.42 · 02/mai/2026

**ATP reprocessado · entradas, saídas e devoluções 2026**

A partir dos arquivos enviados (4 CSVs de vendas + 1 xlsx de entradas + 1 xlsx de devoluções), reprocessei tudo de 2026 mantendo 2025 do JSON anterior intacto.

Vendas (16 meses cobertos: 2025-01 a 2026-04)

- 2026 reprocessado a partir dos CSVs novos (1.044.117 linhas)
- 2025 preservado do JSON antigo (estatísticas mensais, diárias, vendedores, deptos, categorias, fornecedores, produtos)
- Total ATP 2026: R$ 29,89M de faturamento, R$ 4,13M de lucro, margem 13,83%

Supervisores ATP atualizados

- ATP-V cod=1 VAREJO → 111 vendedores
- ATP-A cod=4 ATACADO BALCÃO → 3 vendedores
- ATP-V cod=3 GPC (INTRAGRUPO) → 1 vendedor (NOVO!)

O supervisor 3 (GPC INTRAGRUPO) é um caso especial: ele aparece a partir de 2026 e tem comportamento diferente. As vendas dele NÃO entram nos cálculos mensais regulares — vão para um bloco `intragrupo` separado pra não distorcer as métricas. Mas o vendedor aparece normalmente no cadastro e na configuração de supervisores ignorados em Administração.

Total intragrupo 2026: R$ 1,79M de faturamento (com prejuízo de R$ 122k, margem -6,81%).

Compras (entradas) 2026

- 18.532 linhas processadas
- 5.744 SKUs com compra atualizados
- Atualização do `compras_12m` por SKU em estoque_atp.json
- Atualização do `fato_compras` no cubo_atp.json (12.152 linhas com ym × forn × sku)

Total compras ATP 2026:

- jan/26: R$ 7,19M
- fev/26: R$ 7,92M
- mar/26: R$ 9,13M
- abr/26: R$ 7,77M

Devoluções 2026

- 320 linhas processadas
- 55 fornecedores receberam devoluções
- Total: R$ 686k em 205 NFs

Top fornecedores em devolução: A P CERQUEIRA (R$ 268k), COMERCIAL PINTO DE CERQUEIRA (R$ 248k), INDUSTRIA DE LATICINIOS PALMEIRA DOS INDIOS (R$ 58k).

vendas_grupo atualizado

O arquivo consolidado `vendas_grupo.json` (usado no admin pra listar supervisores de todas as bases) também foi atualizado pra incluir o novo supervisor 3 (GPC INTRAGRUPO) em ATP-V. Total: 13 combinações supervisor×loja, 293 vendedores cadastrados.

Limitação importante

Para `vendas_por_sku` (agregado total por produto), foi necessário zerar fat_liq e lucro de 2025 e somar só 2026. O JSON antigo tinha o agregado total mas não tinha como decompor entre 2025 e 2026 sem dados originais. Os sparklines de quantidade por mês (`por_mes`) preservaram 2025 corretamente. Quando você enviar os dados de 2025 esse problema some — basta reprocessar tudo do zero.

---

## v4.41 · 02/mai/2026

**Supervisores ignorados · ordem do menu e supervisores de todas as bases**

Mudanças no admin de supervisores ignorados:

1. **Ordem do menu:** o dropdown "Configurar página" agora segue a ordem exata em que as páginas aparecem no menu lateral. Visão Executiva primeiro, depois grupo Compras (Compras × Vendas, Departamentos, Estoque, ...), depois Vendas (Visão Consolidada, Evolução, ...), depois Análise Dinâmica.

2. **Supervisores de todas as bases:** antes a lista de supervisores nas caixas de cada loja vinha só da base atual da sessão. Se você estivesse em ATP, só aparecia ATP-V e ATP-A no admin (mesmo que CP1, CP3, etc também tivessem supervisores). Agora o admin carrega `vendas_grupo.json` automaticamente e mostra TODAS as 6 lojas com seus supervisores reais, independente da base atual.

3. **Sobre a quantidade de supervisores em ATP:** ATP-V tem só 1 supervisor cadastrado no WinThor (#1 VAREJO, com 111 vendedores) e ATP-A tem só 1 (#4 ATACADO BALCÃO, com 3 vendedores). Isso reflete o cadastro real do ERP — não é limitação do sistema. Se você precisar de mais supervisores em ATP, o cadastro precisa ser feito no WinThor primeiro.

Para referência, supervisores cadastrados hoje:

- ATP-V: #1 VAREJO
- ATP-A: #4 ATACADO BALCÃO
- CP1: #2 LICITAÇÃO, #3 GPC INTRAGRUPO, #4 VENDA BALCAO, #9 INATIVOS, #10 ALMIR PINHEIRO, #11 NEGOCIAÇÕES ESPECIAIS
- CP3: #1 CESTAO 01 IRARA, #4 VENDA BALCAO
- CP5: #17 CESTAO 04 INHAMBUPE
- CP40: #9 INATIVOS

Total: 12 supervisores em 6 lojas.

---

## v4.40 · 02/mai/2026

**Análise Dinâmica · GRUPO agora carrega CP + ATP juntos**

Antes: na visão GRUPO, a Análise Dinâmica fazia fallback pro cubo CP e mostrava só CP1, CP3, CP5, CP40. ATP ficava de fora.

Agora: em GRUPO, o sistema carrega os dois cubos em paralelo (CP e ATP) e mescla automaticamente. A dimensão Loja passa a ter as 5 filiais: ATP, CP1, CP3, CP5, CP40.

Como funciona o merge: união de dimensões por código, concatenação de linhas dos fatos com normalização de campos. Se um fato existe num cubo e não no outro, prevalece o que tem.

Custo: o carregamento em GRUPO leva mais tempo (~33MB combinados em vez de ~23MB do CP sozinho). O timeout foi aumentado pra 60s. Em redes lentas pode ficar pesado. Se preferir uma experiência mais rápida, troca pra base CP ou ATP no seletor do topo — assim carrega só o cubo necessário.

Caso só um dos dois cubos esteja disponível, o sistema avisa em banner amarelo qual está faltando e mostra os dados do que tem.

**Configuração de supervisores ignorados · todas as páginas listadas**

O seletor de página em Administração agora mostra todas as 29 páginas do sistema, agrupadas por área (Vendas, Vendas/Loja, Executivo, Compras, Diagnóstico, Financeiro, Análise).

Cada página tem um marcador antes do nome:
- ✓ páginas que **aplicam** o filtro hoje (Drill-Down, Benchmarking, Alertas, Recebimentos)
- ○ páginas onde a configuração fica salva mas **não tem efeito ainda**

Quando você seleciona uma página com marca ○, aparece um banner amarelo avisando que a configuração será salva mas não muda nada visualmente na página. Isso permite pré-configurar com antecedência: quando o filtro for adicionado àquela página em uma versão futura, a configuração já está valendo.

Pra adicionar o filtro de supervisor a uma página específica precisa ser feito no código — me avisa qual página é prioridade que eu adiciono.

---

## v4.39 · 02/mai/2026

**Curva ABC com toggle de modo e filtro de meses**

A página Curva ABC ganhou um seletor "Ranking por:" com duas opções:

- **Faturamento** (modo padrão): comportamento atual, ranking baseado no faturamento total dos últimos 12 meses. Sem filtro de mês, porque os dados de venda mensal só trazem quantidade. O agregado de faturamento é fechado em 12m.
- **Quantidade**: ranking por unidades vendidas. Aqui aparece um seletor de meses que permite escolher quais meses entram no cálculo. Atalhos: Todos / Nenhum / Últimos 12m / Últimos 3m.

No modo Quantidade os títulos, eixos do gráfico, KPIs e a coluna de valores se ajustam pra mostrar unidades em vez de R$.

Importante: o ranking por quantidade não é o ABC tradicional (que usa receita), mas é honesto. Útil pra identificar produtos de alto giro independente do preço unitário.

**Páginas Fornecedores e Departamentos**

Adicionei nota explicativa no banner dessas páginas dizendo por que o filtro de mês não está disponível: o ETL hoje exporta vendas mensais só em quantidade, e compras só em agregado anual. Pra análises mensais detalhadas a sugestão é usar Análise Dinâmica.

Quando o ETL for atualizado pra exportar valor + lucro mensal, libero o filtro nas duas páginas.

**Inhambupe (CP5) na Análise Dinâmica · pendente**

Continuo aguardando você abrir a Análise Dinâmica no console (F12) e me dizer o que aparece no log `[Análise Dinâmica] base = ... · filiais na dim Loja: [...]`. Sem isso não consigo fechar o diagnóstico.

---

## v4.38 · 02/mai/2026

**Análise Dinâmica · melhorias no mobile e investigação Inhambupe**

Mobile

- Painel de configuração agora vira coluna única no celular (até 720px de largura). Antes ele forçava o layout de duas colunas e ficava apertado.
- Dimensões e métricas exibidas em duas colunas no celular. Antes era uma só, ocupava muito espaço vertical.
- Bloqueada a seleção de texto nos campos arrastáveis e nas pílulas das zonas. Quando você tentava arrastar e o gesto pegava errado, acabava selecionando o texto. Agora não acontece mais.
- Botões de ação (limpar, salvar, carregar) viram coluna única no mobile, ocupando largura total.

Inhambupe não aparece

Investiguei o código e os dados no cubo CP. CESTÃO INHAMBUPE (CP5) está presente no cubo com 272 mil linhas de vendas e 4 entradas de compras. A configuração `meta.filiais` lista as 4 filiais corretamente: CP1, CP3, CP5, CP40.

Não consegui reproduzir o problema só lendo o código. Pra te ajudar a debugar, fiz duas coisas:

1. Adicionei log no console: ao abrir Análise Dinâmica, aparece no console do navegador uma linha tipo `[Análise Dinâmica] base = COMERCIAL PINTO · filiais na dim Loja: ['CP1 (COMERCIAL PINTO)', 'CP3 (CESTÃO LOJA 1)', 'CP5 (CESTÃO INHAMBUPE)', 'CP40 (BARROS 40)']`. Confere ali se aparecem as 4. Se aparecer só 3, é problema de meta.filiais e o ETL precisa regerar. Se aparecer 4 mas a tela mostra 3, é bug de renderização.
2. Reforcei o `_normalizarCubo`: agora cruza `meta.filiais` com os valores reais que aparecem no fato. Se alguma filial está nos dados mas falta no meta, ela é adicionada com aviso no console.
3. No modal de filtro agora aparece "N itens disponíveis" abaixo do título. Se ali mostrar 4 mas você só vê 3, é problema de overflow de tela e me avisa.

Me passa o que aparece no console quando abrir a página pra eu fechar o diagnóstico.

Importante: se a base atual for ATP, CP5 não vai aparecer mesmo, porque o cubo ATP não tem CP5. CP5 só está no cubo CP. Pra ver Inhambupe na Análise Dinâmica é necessário estar com a base CP ou GRUPO selecionada no topo.

---

## v4.37 · 02/mai/2026

**Supervisores ignorados agora é por página**

A configuração de supervisores ignorados deixou de ser global e passou a ser por página. Cada página da lista pode ter sua própria seleção de supervisores excluídos, mantendo as outras intactas.

**Como funciona**

Em Administração → Supervisores ignorados agora aparece um seletor "Configurar página". Você escolhe a página (ex: Drill-Down por Vendedor), marca quais supervisores ignorar nessa página, salva. Outras páginas (ex: Benchmarking) seguem com sua própria configuração independente.

O dropdown mostra ao lado de cada página o número de supervisores ignorados nela, pra você ter visão rápida do que está configurado.

**Páginas que respeitam o filtro**

Apenas estas páginas hoje aplicam o filtro de supervisores ignorados:

- **Vendas**: Drill-Down por Vendedor, Benchmarking, Alertas
- **Financeiro**: Recebimentos

Páginas fora dessa lista consideram todos os supervisores. Se quiser estender pra mais páginas, é necessário trabalho de código (adicionar a chamada do filtro dentro daquela função render).

**Atalhos no admin**

- **Limpar página**: remove todos os supervisores ignorados da página selecionada
- **Copiar para...**: abre um modal pra replicar a configuração da página atual em outras páginas (substitui a configuração existente nas selecionadas)

**Estrutura nova no Firestore**

- Documento novo: `config/supervisores_loja_v2`
- Formato: `{paginas: {pagina_id: {loja: [cod_supervisor, ...]}}}`
- O documento antigo `config/supervisores_loja` fica intocado mas o sistema não lê mais dele

**Reset conforme combinado**

A migração foi um reset: nenhuma página começa com supervisores ignorados. Você precisa reconfigurar caso a caso. Os supervisores que estavam globalmente ignorados antes não foram trazidos.

**API interna (pra desenvolvedores)**

- `_isSupervisorIgnorado(pagina, loja, codSup)` agora exige `pagina` como primeiro argumento
- `Filtros.vendedoresAtivos(cad, pagina)` aceita opcionalmente `pagina` — se omitido, considera todos os supervisores
- Mesma coisa pra `Filtros.codsValidos`, `Filtros.mensalVendedoresAtivos`, `Filtros.vendedorEhValido`

---

## v4.36 · 02/mai/2026

**Diagnóstico de Fornecedor melhorado**

Inspirado no Raio-X de Fornecedor do antigo compras.solucoesr2.com.br. Mudanças:

- **8 KPIs reorganizados** seguindo a referência: Faturamento Gerado / Margem Bruta / Lucro Líquido / Compras Líquidas / % Pago / Em Aberto / Custo de Atraso / SKUs c/ Prejuízo. Substitui os 6 KPIs anteriores que tinham menor relevância gerencial.
- **% Pago calculado** dinamicamente: pago ÷ (pago + em aberto). Mostra a parcela quitada das compras feitas pra esse fornecedor.
- **Custo de Atraso** = juros pagos. Vermelho quando >0.
- **Lucro Líquido** = Lucro − Custo de Atraso. Mostra o resultado real depois dos juros.
- **SKUs c/ Prejuízo** = quantos itens do fornecedor têm lucro negativo. Cor amarela quando >0.

**Novo bloco "Financeiro do fornecedor"**

Substitui o card antigo "Notas pagas · resumo". Agora tem o layout da referência:
- 3 KPIs grandes com bordas coloridas (cinza para Total Comprado, verde para Já Pago, laranja para Em Aberto)
- Barra de progresso horizontal mostrando proporção pago vs aberto
- Linha de detalhes com juros, descontos e número de títulos pagos

**Novo gráfico "Margem bruta por mês"**

Linha laranja com área preenchida mostrando a evolução da margem percentual (lucro ÷ faturamento) ao longo do tempo. Aparece só quando há pelo menos 2 meses com dados de venda no cubo OLAP carregado.

**Tabela de SKUs com Cobertura**

A tabela "SKUs do fornecedor" ganhou duas colunas:
- **Lucro** em R$ (com cor vermelha quando negativo)
- **Cobertura** em dias (estoque atual ÷ venda diária média) com tag amarela quando >90 dias e vermelha quando >180 dias

A coluna "Giro (d)" foi removida — Cobertura é mais útil porque considera o ritmo real de saída do produto.

**Limitações**

A tabela de extrato de compras ainda mostra agregado por mês. Para fazer a versão da referência (lista detalhada de NFs com produtos, expansível com "+ N produtos"), seria preciso enriquecer o cubo OLAP pra trazer cada NF com seus itens. Essa é uma melhoria de ETL grande, fica como sugestão.

---

## v4.35 · 02/mai/2026

**Diagnóstico de Produto melhorado**

Inspirado no modelo do antigo compras.solucoesr2.com.br. Mudanças:

- Os KPIs agora seguem o padrão da referência: Vendas Líquidas / Margem Bruta / Compras Líquidas / Estoque Atual / Cobertura. O KPI de Status virou apenas tag no cabeçalho (já tinha).
- **Cobertura calculada**: estoque atual ÷ venda diária média (qt vendida ÷ meses × 30). Mostra "X dias" com cor de alerta se acima de 90 dias (amarelo) ou 180 dias (vermelho).
- **Tag de Curva ABC** ao lado do status: A (≤80% acumulado), B (≤95%), C (resto). Calculada na hora a partir de E.produtos.
- **Extrato do produto** abaixo do gráfico de histórico: tabela mensal com saídas (vendas em qt), entradas (compras quando o ETL informa) e saldo do mês.
- **Gráfico de histórico ampliado**: agora tem 2 séries (saídas + entradas) em vez de só vendas.

**Limitações**

O ETL atual fornece compras 12m apenas como total agregado (sem detalhamento por mês). Por isso o "extrato" mostra entradas só no mês da última compra com o total acumulado. Para um extrato fiel à referência (entradas mês a mês com NF, fornecedor e valor), seria preciso enriquecer o ETL com `compras_por_mes` no produto. Isso fica como sugestão pra próxima rodada.

EAN, data de cadastro original e preço de venda cadastrado também não vêm do ETL. Se quiser esses campos, precisa ajustar a extração WinThor.

---

## v4.34 · 02/mai/2026

**Etapa 8 (parcial) · Página Metas reescrita**

A página Metas foi completamente reescrita seguindo o modelo do dash.solucoesr2.com.br/gpc.html. A versão antiga era baseada em vínculo com supervisores e não tinha relação com a referência. A nova versão é uma análise direta de meta vs realizado por loja.

**Como funciona**

Cadastre as metas mensais de cada loja (4 lojas: ATP-V, ATP-A, Cestão L1, Inhambupe). O realizado vem automaticamente do faturamento líquido em V.mensal. O sistema calcula:

- Atingimento (real ÷ meta)
- Desvio (real - meta)
- Status visual: ✓ Atingido (≥100%) · ~ Próximo (≥95%) · ✗ Abaixo (<95%)

**Painéis e gráficos**

- 4 KPIs: Meta total acumulada, Realizado total (com desvio), Atingimento médio, Meses ≥100%
- Gráfico Meta vs Realizado mensal (barras + linha + atingimento %)
- Gráfico de desvio mensal (verde/vermelho)
- Box de insight: piora/melhora ano a ano + identificação do pior mês
- Gráfico de comparativo de atingimento entre as 4 lojas
- Tabela comparativa todas as lojas por mês (com símbolos)
- Histórico detalhado por loja com totais

**Cadastro de metas**

Botão "📝 Cadastrar metas" abre um modal estilo planilha (loja × mês). Insira o valor em R$ de cada meta. Salva no Firestore (collection `config`, doc `metas_gpc_v2`).

**Importação de Excel**

Botão "📥 Excel" permite importar de uma planilha .xlsx no formato da referência (aba "Resumo GPC" com colunas Meta/Realizado/Ating. para cada loja). O sistema lê apenas as metas e ignora o realizado (que vem dos JSONs). A biblioteca XLSX é carregada sob demanda do CDN.

**Mapeamento de loja**

- ATP-V → ATP - Varejo
- ATP-A → ATP - Atacado
- CP3 → Cestão Loja 1
- CP5 → Inhambupe

CP1 (Comercial Pinto) e CP40 (Barros 40) não são considerados nas metas, conforme a referência.

**Limitações conhecidas**

- O realizado pode divergir ligeiramente do Excel histórico se o ETL trata fat_liq de forma diferente. Os números do JSON são autoritativos.
- O Firestore só permite escrita por admin (regra existente). Outros usuários veem mas não editam.
- O Excel sample tinha 27 meses (Jan/24 a Mar/26). Os JSONs atuais cobrem só Jan/25 a Abr/26 — meses anteriores aparecerão sem realizado.

**O que falta na etapa 8**

- **Processamento** ainda aguarda explicação das novas rotinas que substituíram as antigas.

---

## v4.33 · 02/mai/2026

**Cinco correções pedidas**

**1. SKUs ocultos por base (bug fix)**

A configuração de SKUs ocultos era para ser por base mas tinha dois bugs:

- O default global (item 30132) era aplicado a todas as bases mesmo sem cadastro específico, então o item ficava oculto em CP também.
- A função que filtrava SKUs ocultos só atualizava `D.produtos` (do sistema legado), mas as páginas atuais leem de `E.produtos`. Resultado: ocultar um SKU não tirava ele de lugar nenhum visível.

Agora cada base tem sua própria lista, sem default global. O 30132 só estará oculto na base ATP se você cadastrar lá. E o filtro funciona de verdade nas páginas atuais.

**2. Fornecedores internos por base (cleanup)**

Já estava por base no localStorage (chave `gpcSuppliers:BASE`). Mas tinha 4 fornecedores hardcoded no código como default global. Removi o default. Agora cada base começa vazia e você cadastra os fornecedores específicos dela.

**3. Administração travada na visão consolidada**

A página de Administração agora bloqueia o acesso quando você está em GPC consolidado e mostra um aviso pedindo pra escolher uma loja. O motivo: as configurações são todas por base (SKUs ocultos, fornecedores internos, estoque ideal), e gerenciar em consolidado fica confuso. Clicando numa loja, o sistema recarrega já dentro daquela filial.

**4. Análise Dinâmica · subrolagem + trocar Linhas/Colunas**

- O painel de campos disponíveis agora tem altura máxima de 520px com subrolagem própria. A lista de dimensões e métricas não mais empurra a área de zonas pra baixo.
- A posição das zonas trocou: agora é `Filtros / Colunas` na primeira linha e `Linhas / Valores` na segunda. Fica mais intuitivo: as colunas são o cabeçalho da tabela (em cima) e as linhas são o corpo (embaixo).

**5. Diagnóstico de Produto/Fornecedor bloqueado em consolidado**

Igual à Administração: as páginas de Diagnóstico (Produto e Fornecedor) agora avisam que precisam de uma loja específica e mostram botões pra escolher. O motivo é que esses diagnósticos analisam estoque, giro e ruptura por SKU, dados que só fazem sentido por loja.

---

## v4.32 · 02/mai/2026

**Etapa 8 (parcial) · Página Dias C&P reescrita**

A página Dias C&P foi reescrita seguindo o modelo do dash.solucoesr2.com.br/gpc.html (com base nos screenshots que você passou). A versão antiga usava heurística de "dias atípicos" baseada em desvio padrão. A nova exige cadastro explícito dos dias de oferta — o que dá controle e precisão.

**Como funciona**

A página agora tem um seletor de loja no topo (GPC Consolidado, ATP-V, ATP-A, CP1, CP3, CP5, CP40). Para cada loja, o usuário cadastra quais foram os dias C&P de cada mês via botão "📅 Cadastrar dias C&P".

A partir dos dias cadastrados, o sistema calcula automaticamente:

- **Total faturado em dias C&P** (soma dos dias cadastrados)
- **Premium médio** (% acima da média dos dias normais do mesmo mês)
- **Melhor evento** (mês com maior faturamento concentrado nos dias)
- **Média de representatividade no mês** (quanto os dias C&P pesam no faturamento mensal)

**Painéis e gráficos**

- 4 KPIs no topo
- Box explicativo do conceito de "Premium"
- Gráfico mensal de faturamento dos dias C&P
- Gráfico mensal de premium %
- Gráfico mensal de representatividade %
- Top 3 melhores dias individuais
- Top 3 melhores eventos (3 dias)
- Tabela histórica completa por mês

**Cadastro de dias**

O cadastro é feito via modal que lista todos os meses disponíveis no diário. Para cada mês, o usuário digita os números dos dias separados por vírgula (ex: "04, 05, 06"). O sistema valida (1-31) e salva no Firestore.

A coleção `dias_cp` é compartilhada entre todos os usuários — só admin pode escrever, todos podem ler. Cada documento tem ID `LOJA_YYYY-MM` (ex: `ATP-V_2026-04`).

**Visão GRUPO**

A loja "GPC Consolidado" agrega o faturamento diário de todas as lojas e usa a união dos dias cadastrados. Para cadastrar dias na visão GRUPO, é necessário primeiro cadastrar para cada loja individual. O cadastro direto pela visão GRUPO mostra um prompt pedindo qual loja específica.

**Importante: regras Firestore v4.32**

A coleção `dias_cp` precisa ser autorizada nas regras (arquivo REGRAS_FIRESTORE_v4.32.txt anexo). Sem isso, o cadastro falha com permission-denied.

**Etapas 8 que ainda faltam**

- **Metas** (cadastro de metas mensais por loja com gráfico de realizado vs meta)
- **Processamento** remodelado (você disse que as rotinas mudaram, preciso saber as novas)

Para fazer Metas, preciso saber: quais campos quer cadastrar (apenas faturamento? margem? lucro?), qual granularidade (por loja, por departamento?), e qual o look-and-feel dos gráficos.

Para Processamento, preciso saber quais novas rotinas estão sendo usadas pra extrair os dados.

---

## v4.31 · 02/mai/2026

**Etapa 9 · Home customizável (versão inicial)**

A home agora tem uma seção "Meus pins" no topo onde cada usuário fixa os elementos que considera mais importantes. Cada usuário tem sua própria seleção, salva no Firestore.

**Como funciona**

Em algumas páginas (Executivo, Excesso de Estoque, Recebimentos por enquanto), aparece um botão de pin (📍) no canto superior direito de KPIs específicos. Clicar fixa o elemento na home; clicar de novo remove. O ícone vira 📌 quando está fixado.

Na home, os pins ficam em cards que mostram o valor atualizado. Cada card tem:
- Botão de pin (📌) pra remover
- Link "Ver página completa" pra abrir a página de origem
- Drag-and-drop pra reordenar entre eles

A ordem é salva automaticamente após cada arrasto.

**Elementos pináveis nesta versão**

- **Executivo**: Faturamento líquido, Lucro bruto, Vencidos, Total a pagar, Estoque (preço de venda)
- **Excesso de Estoque**: Valor imobilizado em excesso
- **Recebimentos**: Total atrasado

**Elementos que ainda não estão pináveis**

Pra cada elemento que vai ser pinável, é preciso (1) adicionar o botão de pin no card original e (2) registrar uma função de "render standalone" que reproduz o conteúdo na home. É trabalho mecânico mas que precisa ser feito caso a caso. Próximas sessões devem expandir pra mais KPIs e gráficos.

**Importante: regras Firestore**

Pra o sistema de pins funcionar, é necessário aplicar as **regras Firestore v4.31** (arquivo REGRAS_FIRESTORE_v4.31.txt anexo) no Firebase Console substituindo as anteriores. Sem isso, salvar pins falha com permission-denied.

**Limitações conhecidas**

- Os pins só funcionam pra usuários autenticados (anonymous auth não persiste pins entre sessões).
- O botão de pin some se o card for re-renderizado depois de uma navegação. Volta ao reentrar na página.
- A home só re-renderiza pins quando você navega pra ela. Se você fixar um pin estando em outra página, ele aparece na próxima vez que entrar na home.

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
