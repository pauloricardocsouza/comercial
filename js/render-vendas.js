// ════════════════════════════════════════════════════════════════════════════
// GPC Comercial · render-vendas.js
// ════════════════════════════════════════════════════════════════════════════
// Gerado pela divisão do index.html em v4.6 (etapa #3 da auditoria)
// Carregado via <script src="js/render-vendas.js"> no index.html
// IMPORTANTE: ordem de carregamento importa — ver comentário no index.html
// ════════════════════════════════════════════════════════════════════════════

// Define o esqueleto visual de cada uma das 14 páginas.
// Quando os dados chegarem, basta plugar a renderização real.
// ================================================================
const VENDAS_PANELS_STRUCTURE = {
  'v-visao-grupo': {
    pk: 'Vendas · Grupo',
    h2: 'Visão <em>Consolidada</em> GPC',
    desc: 'Faturamento consolidado das 4 unidades · 27 meses (Jan/2025 – Abr/2026)',
    kpis: [
      {l:'GPC · Fat. 2024', v:'R$ —', s:'4 lojas · ano completo'},
      {l:'GPC · Fat. 2025', v:'R$ —', s:'crescimento vs 2024'},
      {l:'GPC · Jan-Mar 2026', v:'R$ —', s:'crescimento vs 2025'},
      {l:'Crescimento acumulado', v:'—', s:'Jan-Mar 2024 → 2026'}
    ],
    rows: [
      [{t:'Participação no faturamento GPC — 2025', s:'Por loja'}, {t:'Faturamento Jan-Mar — 3 anos empilhados', s:'Comparativo anual'}]
    ],
    tables: [
      {t:'Resumo 2026 vs 2025', cols:['Loja','Venda Líquida','Massa Margem','Margem %','2026','2025','Dif. R$','Dif. %']},
      {t:'Resumo 2025 vs 2024', cols:['Loja','Venda Líquida','Massa Margem','Margem %','2025','2024','Dif. R$','Dif. %']},
      {t:'Resumo Jan-Mar (26 vs 25)', cols:['Loja','Venda Líquida','Massa Margem','Margem %','Jan-Mar/26','Jan-Mar/25','Dif. R$','Dif. %']}
    ]
  },
  'v-evolucao': {
    pk: 'Vendas · Grupo',
    h2: 'Evolução <em>Mensal</em>',
    desc: 'Série temporal de faturamento por unidade · Jan/2025 – Abr/2026',
    kpis: [],
    rows: [
      [{t:'ATP — Varejo + Atacado', s:'Faturamento mensal'}, {t:'Cestão Loja 1', s:'Faturamento mensal'}],
      [{t:'Cestão Inhambupe', s:'Faturamento mensal'}, {t:'Variação YoY (%)', s:'2025 vs 2024 por mês'}]
    ],
    tables: []
  },
  'v-atp-varejo': {
    pk: 'Vendas · Por Loja',
    h2: 'ATP — <em>Varejo</em>',
    desc: 'Análise detalhada da unidade ATP Varejo',
    kpis: [
      {l:'Faturamento 2024', v:'R$ —', s:'Margem —'},
      {l:'Faturamento 2025', v:'R$ —', s:'vs 2024'},
      {l:'Faturamento Jan-Mar/26', v:'R$ —', s:'vs Jan-Mar/25'},
      {l:'Crescimento médio', v:'—', s:'YoY consolidado'}
    ],
    rows: [
      [{t:'Faturamento por departamento — Mar/2026', s:'Top departamentos'}, {t:'Variação vs mês anterior e ano anterior', s:'%'}],
      [{t:'Departamentos — Mar/2026 detalhado', s:'Visão expandida'}, {t:'Faturamento mensal por departamento', s:'R$k · histórico'}]
    ],
    tables: [
      {t:'Departamentos', cols:['Departamento','Mar/2026','vs Fev/26','vs Mar/25','Margem']},
      {t:'Top produtos', cols:['#','Produto','Mar/2026','vs Fev/26','vs Mar/25']}
    ]
  },
  'v-atp-atacado': {
    pk: 'Vendas · Por Loja',
    h2: 'ATP — <em>Atacado</em>',
    desc: 'Análise detalhada da unidade ATP Atacado',
    kpis: [
      {l:'Faturamento 2024', v:'R$ —', s:'Margem —'},
      {l:'Faturamento 2025', v:'R$ —', s:'vs 2024'},
      {l:'Faturamento Jan-Mar/26', v:'R$ —', s:'vs Jan-Mar/25'},
      {l:'Crescimento médio', v:'—', s:'YoY consolidado'}
    ],
    rows: [
      [{t:'Faturamento por departamento — Mar/2026', s:'Top departamentos'}, {t:'Variação vs mês anterior e ano anterior', s:'%'}],
      [{t:'Departamentos — Mar/2026 detalhado', s:'Visão expandida'}, {t:'Faturamento mensal por departamento', s:'R$k · histórico'}]
    ],
    tables: [
      {t:'Departamentos', cols:['Departamento','Mar/2026','vs Fev/26','vs Mar/25','Margem']},
      {t:'Top produtos', cols:['#','Produto','Departamento','Mar/2026','vs Fev/26','vs Mar/25']}
    ]
  },
  'v-cestao': {
    pk: 'Vendas · Por Loja',
    h2: 'Cestão <em>Loja 1</em>',
    desc: 'Análise detalhada da unidade Cestão Loja 1',
    kpis: [
      {l:'Faturamento 2024', v:'R$ —', s:'Margem —'},
      {l:'Faturamento 2025', v:'R$ —', s:'vs 2024'},
      {l:'Faturamento Jan-Mar/26', v:'R$ —', s:'vs Jan-Mar/25'},
      {l:'Crescimento médio', v:'—', s:'YoY consolidado'}
    ],
    rows: [
      [{t:'Faturamento por departamento — Mar/2026', s:'Top departamentos'}, {t:'Variação vs mês anterior e ano anterior', s:'%'}],
      [{t:'Departamentos — Mar/2026 detalhado', s:'Visão expandida'}, {t:'Faturamento mensal por departamento', s:'R$k · histórico'}]
    ],
    tables: [
      {t:'Departamentos', cols:['Departamento','Mar/2026','vs Fev/26','vs Mar/25','Margem']},
      {t:'Top categorias', cols:['#','Categoria','Mar/2026','vs Fev/26','vs Mar/25']}
    ]
  },
  'v-inh': {
    pk: 'Vendas · Por Loja',
    h2: 'Cestão <em>Inhambupe</em>',
    desc: 'Análise detalhada da unidade Cestão Inhambupe',
    kpis: [
      {l:'Faturamento 2024', v:'R$ —', s:'Margem —'},
      {l:'Faturamento 2025', v:'R$ —', s:'vs 2024'},
      {l:'Faturamento Jan-Mar/26', v:'R$ —', s:'vs Jan-Mar/25'},
      {l:'Crescimento médio', v:'—', s:'YoY consolidado'}
    ],
    rows: [
      [{t:'Faturamento por departamento — Mar/2026', s:'Top departamentos'}, {t:'Variação vs mês anterior e ano anterior', s:'%'}],
      [{t:'Departamentos — Mar/2026 detalhado', s:'Visão expandida'}, {t:'Faturamento mensal por departamento', s:'R$k · histórico'}]
    ],
    tables: [
      {t:'Departamentos', cols:['Departamento','Mar/2026','vs Fev/26','vs Mar/25','Margem']},
      {t:'Top produtos', cols:['#','Produto','Mar/2026','vs Fev/26','vs Mar/25']}
    ]
  },
  'v-itens': {
    pk: 'Vendas · Análise',
    h2: 'Itens & <em>Departamentos</em>',
    desc: 'Volume, faturamento e preço médio por categoria de produto',
    kpis: [],
    rows: [
      [{t:'Faturamento vs Preço médio — Perecíveis', s:'R$k vs R$/un'}, {t:'Volume vs Preço/kg — Perecíveis', s:'Toneladas'}],
      [{t:'Faturamento vs Preço médio — Mercearia', s:'R$k vs R$/un'}, {t:'Faturamento vs Preço médio — Açougue', s:'R$k vs R$/un'}],
      [{t:'Volume vs Preço/kg — Açougue', s:'Toneladas'}, {t:'Faturamento vs Preço médio — Bebida', s:'R$k vs R$/un'}],
      [{t:'Faturamento vs Preço médio — Hipel', s:'R$k vs R$/un'}, {t:'Faturamento vs Preço médio — Bazar', s:'R$k vs R$/un'}],
      [{t:'Faturamento vs Preço médio — Eletro', s:'R$k vs R$/un'}]
    ],
    tables: [
      {t:'Top produtos', cols:['#','Produto','Departamento','Mar/2026','vs Fev/26','vs Mar/25']}
    ]
  },
  'v-vendas-diarias': {
    pk: 'Vendas · Análise',
    h2: 'Vendas <em>Diárias</em>',
    desc: 'Faturamento diário consolidado · 780 dias · Jan/2025 – Abr/2026',
    kpis: [
      {l:'Média diária GPC', v:'R$ —', s:'Desvio padrão ±—'},
      {l:'Maior dia GPC', v:'R$ —', s:'Data e dia da semana'},
      {l:'Dias com 3 lojas+1 atacado >R$1M', v:'—', s:'Total acumulado'}
    ],
    rows: [
      [{t:'🏆 Top 10 dias — GPC consolidado', s:'Maiores faturamentos'}, {t:'📉 10 menores dias — GPC consolidado', s:'Menores faturamentos'}],
      [{t:'Média diária por mês', s:'R$k/dia · Jan/24 – Mar/26'}, {t:'Variação YoY da média diária', s:'%'}],
      [{t:'Média de faturamento por dia da semana', s:'R$k'}, {t:'% do faturamento semanal por dia', s:'Distribuição'}],
      [{t:'Média histórica por dia do mês', s:'R$k'}]
    ],
    tables: [
      {t:'Top 10 dias', cols:['#','Data','Dia da semana','Faturamento']},
      {t:'10 menores dias', cols:['#','Data','Dia da semana','Faturamento']}
    ]
  },
  'v-dias-cp': {
    pk: 'Vendas · Análise',
    h2: 'Dias <em>C &amp; P</em>',
    desc: 'Análise dos dias de oferta (Comuns e Promocionais) · 42 dias · 14 meses',
    kpis: [
      {l:'Total faturado em dias C&P', v:'R$ —', s:'42 dias · 4 unidades'},
      {l:'Premium médio GPC', v:'+—%', s:'vs dias normais'},
      {l:'Melhor evento GPC', v:'R$ —', s:'3 dias consecutivos'},
      {l:'Média rep. mensal', v:'—%', s:'do faturamento mensal'},
      {l:'Total 15 eventos', v:'R$ —', s:'Jan/25 – Mar/26'},
      {l:'Premium médio eventos', v:'+—%', s:'vs dias normais'}
    ],
    rows: [
      [{t:'Total faturado nos 3 dias de oferta — GPC por mês', s:'R$k'}, {t:'Premium dos dias de oferta (%) — comparativo entre lojas', s:'%'}],
      [{t:'Influência dos dias de oferta no faturamento mensal', s:'%'}, {t:'ATP — Média diária: Dias P vs dias normais', s:'R$k'}],
      [{t:'🏆 ATP — Top 3 melhores dias individuais', s:'Por loja'}, {t:'🏅 ATP — Top 3 melhores eventos (3 dias)', s:'Por loja'}],
      [{t:'Histórico completo — ATP - Varejo', s:'Linha do tempo'}, {t:'ATP - Atacado — Média diária: C&P vs normais', s:'R$k'}],
      [{t:'🏆 ATP-Atacado — Top 3 dias', s:'Por loja'}, {t:'🏅 ATP-Atacado — Top 3 eventos', s:'Por loja'}],
      [{t:'Histórico completo — ATP - Atacado', s:'Linha do tempo'}, {t:'Cestão L1 — Média diária: C vs normais', s:'R$k'}],
      [{t:'🏆 Cestão L1 — Top 3 dias', s:'Por loja'}, {t:'🏅 Cestão L1 — Top 3 eventos', s:'Por loja'}],
      [{t:'Histórico completo — Cestão Loja 1', s:'Linha do tempo'}, {t:'Inhambupe — Média diária: C vs normais', s:'R$k'}],
      [{t:'🏆 Inhambupe — Top 3 dias', s:'Por loja'}, {t:'🏅 Inhambupe — Top 3 eventos', s:'Por loja'}],
      [{t:'Histórico completo — Cestão Inhambupe', s:'Linha do tempo'}]
    ],
    tables: [
      {t:'ATP - Varejo', cols:['Mês','Dias','Total 3 dias','Premium','% do mês','Melhor dia','Melhor venda']},
      {t:'ATP - Atacado', cols:['Mês','Dias','Total 3 dias','Premium','% do mês','Melhor dia','Melhor venda']},
      {t:'Cestão Loja 1', cols:['Mês','Dias','Total 3 dias','Premium','% do mês','Melhor dia','Melhor venda']},
      {t:'Cestão Inhambupe', cols:['Mês','Dias','Total 3 dias','Premium','% do mês','Melhor dia','Melhor venda']}
    ]
  },
  'v-metas': {
    pk: 'Vendas · Análise',
    h2: '<em>Metas</em> e Atingimento',
    desc: 'Acompanhamento de metas vs realizado · 27 meses · 4 unidades',
    kpis: [
      {l:'Meta total acumulada', v:'R$ —', s:'27 meses · 4 lojas'},
      {l:'Atingimento médio', v:'—%', s:'2024 / 2025 / 2026'},
      {l:'Meses ≥ 100%', v:'—/27', s:'Distribuição por ano'}
    ],
    rows: [
      [{t:'GPC — Meta vs Realizado mensal', s:'R$ Milhões'}, {t:'GPC — Desvio mensal da meta', s:'R$k'}],
      [{t:'Atingimento mensal (%) — 4 lojas', s:'Por unidade'}, {t:'GPC Consolidado', s:'4 lojas · Jan/2025 – Abr/2026'}],
      [{t:'ATP - Varejo — Atingimento por mês', s:'%'}, {t:'ATP - Varejo — histórico completo', s:'Meta vs Realizado'}],
      [{t:'ATP - Atacado — Atingimento por mês', s:'%'}, {t:'ATP - Atacado — histórico completo', s:'Meta vs Realizado'}],
      [{t:'Cestão L1 — Atingimento por mês', s:'%'}, {t:'Cestão Loja 1 — histórico completo', s:'Meta vs Realizado'}],
      [{t:'Inhambupe — Atingimento por mês', s:'%'}, {t:'Cestão Inhambupe — histórico completo', s:'Meta vs Realizado'}]
    ],
    tables: [
      {t:'Atingimento mensal por loja', cols:['Mês','ATP Var.','ATP Ata.','CES L1','INH','GPC']},
      {t:'GPC Consolidado · Meta vs Real', cols:['Mês','Meta','Real','Atingimento','Desvio']},
      {t:'ATP - Varejo · Meta vs Real', cols:['Mês','Meta','Real','Atingimento','Desvio']},
      {t:'ATP - Atacado · Meta vs Real', cols:['Mês','Meta','Real','Atingimento','Desvio']},
      {t:'Cestão Loja 1 · Meta vs Real', cols:['Mês','Meta','Real','Atingimento','Desvio']},
      {t:'Cestão Inhambupe · Meta vs Real', cols:['Mês','Meta','Real','Atingimento','Desvio']}
    ]
  },
  'v-drilldown': {
    pk: 'Vendas · Análise',
    h2: 'Drill-Down por <em>Período</em>',
    desc: 'Decomposição por departamento, seção e categoria com filtros de período',
    kpis: [],
    rows: [],
    tables: [
      {t:'Hierarquia de produtos', cols:['Departamento / Seção / Categoria','Participação %']}
    ],
    customNote: 'Esta página tem comportamento interativo (drill-down). Será integrada após carga dos dados.'
  },
  'v-benchmarking': {
    pk: 'Vendas · Análise',
    h2: '<em>RCA</em> · Análise por Vendedor',
    desc: 'Comparativo de representatividade de departamentos por unidade',
    kpis: [],
    rows: [
      [{t:'ATP - Varejo · Representatividade 2024', s:'Por departamento'}, {t:'ATP - Varejo · Representatividade 2025', s:'Por departamento'}],
      [{t:'Cestão Loja 1 · Representatividade 2024', s:'Por departamento'}, {t:'Cestão Loja 1 · Representatividade 2025', s:'Por departamento'}],
      [{t:'Cestão Inhambupe · Representatividade 2024', s:'Por departamento'}, {t:'Cestão Inhambupe · Representatividade 2025', s:'Por departamento'}],
      [{t:'ATP - Atacado · Representatividade 2024', s:'Por departamento'}, {t:'ATP - Atacado · Representatividade 2025', s:'Por departamento'}],
      [{t:'Crescimento 2024→2025 por departamento', s:'Comparativo entre lojas'}]
    ],
    tables: [
      {t:'Comparativo geral', cols:['Departamento','ATP Var 2024','ATP Var 2025','Var%','ATK 2024','ATK 2025','Var%','CES 2024']}
    ]
  },
  'v-ano2026': {
    pk: 'Vendas · Análise',
    h2: 'Análise <em>2026</em>',
    desc: 'Comparativo Jan-Mar 2026 vs 2025 e 2024 · Por loja e departamento',
    kpis: [
      {l:'GPC Jan-Mar 2024', v:'R$ —', s:'Base de comparação'},
      {l:'GPC Jan-Mar 2025', v:'R$ —', s:'vs 2024'},
      {l:'GPC Jan-Mar 2026', v:'R$ —', s:'vs 2025'},
      {l:'Acumulado 2 anos', v:'—%', s:'Jan-Mar 2026 vs 2024'}
    ],
    rows: [
      [{t:'GPC — Jan-Mar comparativo 3 anos', s:'Consolidado'}, {t:'ATP - Varejo — Jan-Mar por departamento', s:'3 anos'}],
      [{t:'Cestão Loja 1 — Jan-Mar por departamento', s:'3 anos'}, {t:'ATP - Atacado — Jan-Mar por departamento', s:'3 anos'}],
      [{t:'Cestão Inhambupe — Jan-Mar por departamento', s:'3 anos'}]
    ],
    tables: []
  }
};

// ================================================================
// VENDAS · ARQUITETURA DE RENDER
// ================================================================
// Quando vendas.json não está carregado (V === null) → renderVendasStruct(pg)
//   mostra placeholder com KPIs/gráficos/tabelas vazios e badge "Aguardando dados"
// ================================================================
// VENDAS · IMPLEMENTAÇÕES (sub-etapa 4c.1 · 30/abr/2026)
// Páginas consolidadas: V Visão Grupo, V Evolução, V Ano 2026
// Consomem `V` (vendas_atp.json). Usam helpers _PAL, fK, fP, fI, fB,
// _ymToLabel, mkC, kgHtml, esc.
// ================================================================

/**
 * Helper interno: agrega V.mensal por (loja, ym) ou só por ym.
 * Útil para gerar séries mensais consolidadas vs por loja.
 *
 * @param {string} loja - sigla da loja (null = consolidado de todas)
 * @param {string} pagina - id da página pra aplicar filtro de supervisor (opcional)
 */
// Cache memoizado para _vendasMensalPor — invalida quando V muda (verifica V.meta.geradoEm)
// ou quando o cfg de supervisores ignorados muda (snapshot na chave).
// Cache de _vendasMensalPor foi removido na v4.64 (causava valores errados ao
// trocar de visão em alguns cenários — recomputar é barato).
function _vendasMensalPor(loja, pagina){
  if(!V || !V.mensal) return [];

  // Cache desabilitado: o overhead é mínimo (16 linhas × 6 lojas) e elimina
  // qualquer hipótese de stale data ao trocar de visão. Em testes anteriores,
  // bugs de filtros sobrepostos e cache de referência causaram valores errados
  // (CP5 mostrando R$ 25-32M em vez de R$ 1,7M). Recomputar é seguro e barato.
  const aplica = pagina && typeof aplicaFiltroSupVMensalRow === 'function';
  let resultado;
  if(loja){
    resultado = V.mensal.filter(function(r){return r.loja === loja;})
                       .map(function(r){ return aplica ? aplicaFiltroSupVMensalRow(r, pagina) : r; })
                       .sort(function(a,b){return a.ym<b.ym?-1:1;});
  } else {
    const m = new Map();
    V.mensal.forEach(function(rRaw){
      const r = aplica ? aplicaFiltroSupVMensalRow(rRaw, pagina) : rRaw;
      if(!m.has(r.ym)) m.set(r.ym, {ym:r.ym, fat_brt:0, fat_liq:0, devol:0, lucro:0, qt:0, nfs:0});
      const x = m.get(r.ym);
      x.fat_brt += r.fat_brt||0;
      x.fat_liq += r.fat_liq||0;
      x.devol   += r.devol||0;
      x.lucro   += r.lucro||0;
      x.qt      += r.qt||0;
      x.nfs     += r.nfs||0;
    });
    resultado = Array.from(m.values()).sort(function(a,b){return a.ym<b.ym?-1:1;});
  }
  return resultado;
}

/**
 * Helper: calcula KPI de "jan-mar" de um ano, a partir do V.mensal consolidado.
 * Ignora abr+ pra ser comparável entre anos com diferentes meses fechados.
 */
function _vendasJanMar(ano){
  const m = _vendasMensalPor(null);
  return m.filter(function(r){return r.ym >= ano+'-01' && r.ym <= ano+'-03';})
          .reduce(function(s,r){
            return {
              fat_liq: s.fat_liq + r.fat_liq,
              lucro:   s.lucro   + r.lucro,
              qt:      s.qt      + r.qt,
            };
          }, {fat_liq:0, lucro:0, qt:0});
}

// ────────────────────────────────────────────────────────────────────
// V VISÃO GRUPO
// ────────────────────────────────────────────────────────────────────
function renderVVisaoGrupo(){
  const cont = document.getElementById('page-v-visao-grupo');
  if(!cont) return;

  // Verifica se a base ativa é GRUPO. Se não for, mostra aviso.
  // Modo consolidado: _filialAtual é null OU _filialAtual.sigla === 'grupo'.
  const _ehGrupo = !_filialAtual
    || (typeof _filialAtual.sigla === 'string' && _filialAtual.sigla.toLowerCase() === 'grupo')
    || (typeof _filialAtual.tipo === 'string' && (_filialAtual.tipo === 'consolidado' || _filialAtual.tipo === 'raiz'));
  if(typeof _filialAtual !== 'undefined' && _filialAtual && !_ehGrupo){
    const baseLabel = (_filialAtual.sigla || '').toUpperCase();
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Grupo</div><h2>Visão <em>Consolidada</em> GPC</h2></div>'
      + '<div class="ph-sep"></div>'
      + '<div class="page-body">'
      + '<div style="background:#fef3c7;border:1px solid #d97706;border-radius:8px;padding:24px;text-align:center;color:#92400e;">'
      +   '<div style="font-size:36px;margin-bottom:10px;">📊</div>'
      +   '<div style="font-size:14px;font-weight:700;margin-bottom:8px;">Esta página mostra dados consolidados do grupo</div>'
      +   '<div style="font-size:12px;line-height:1.5;margin-bottom:14px;">Você está na base <strong>'+esc(baseLabel)+'</strong>. A Visão Consolidada compara todas as lojas do GPC entre si e só faz sentido na base GRUPO.</div>'
      +   '<button onclick="(function(){var s=document.querySelector(\'.fil-tab[data-cod=GRUPO]\')||document.querySelector(\'[data-base=GRUPO]\');if(s)s.click();else alert(\'Use o seletor de base no topo para escolher GRUPO.\');})()" '
      +     'style="padding:8px 16px;background:#d97706;color:white;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:12px;">Trocar para base GRUPO</button>'
      + '</div>'
      + '</div>';
    return;
  }

  const grupoAno = (V && V.resumo && V.resumo.grupo && V.resumo.grupo.por_ano) || {};
  const fat2024 = (grupoAno['2024'] && grupoAno['2024'].fat_liq) || 0;
  const fat2025 = (grupoAno['2025'] && grupoAno['2025'].fat_liq) || 0;
  const fat2026 = (grupoAno['2026'] && grupoAno['2026'].fat_liq) || 0;

  // Jan-mar de cada ano
  const jm2024 = _vendasJanMar('2024');
  const jm2025 = _vendasJanMar('2025');
  const jm2026 = _vendasJanMar('2026');

  // Crescimento jan-mar 2026 vs 2025
  const cresceJM = jm2025.fat_liq>0 ? (jm2026.fat_liq/jm2025.fat_liq - 1)*100 : 0;
  // Crescimento 2025 vs 2024
  const cresce25 = fat2024>0 ? (fat2025/fat2024 - 1)*100 : 0;

  let html = '<div class="ph"><div class="pk">Vendas · Grupo</div><h2>Visão <em>Consolidada</em> GPC</h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // KPIs
  html += '<div class="kg" style="grid-template-columns:repeat(3,1fr);margin-bottom:14px;" id="kg-v-visao"></div>';

  // Linha 1 de gráficos
  html += '<div class="row2eq" style="margin-bottom:14px;">'
       +    '<div class="cc"><div class="cct">Participação no faturamento — '+(fat2025>fat2026?'2025':'2026')+'</div>'
       +      '<div class="ccs">Por loja</div>'
       +      '<div style="height:240px;"><canvas id="c-vvis-pizza"></canvas></div></div>'
       +    '<div class="cc"><div class="cct">Faturamento jan-mar — anos comparados</div>'
       +      '<div class="ccs">Empilhado por loja</div>'
       +      '<div style="height:240px;"><canvas id="c-vvis-bars"></canvas></div></div>'
       + '</div>';

  // Tabela: Resumo 2026 vs 2025 (cobertura completa que temos)
  html += '<div class="cc" style="margin-bottom:12px;">'
       +    '<div class="cct">Resumo por loja: 2026 acumulado (jan-abr) vs 2025 (ano completo)</div>'
       +    '<div class="ccs" style="color:var(--warning);">⚠ A variação compara <strong>4 meses de 2026</strong> com <strong>12 meses de 2025</strong> — não é comparável diretamente. Veja a tabela de jan-mar abaixo para comparativo justo.</div>'
       +    '<div class="tscroll"><table class="t" id="t-vvis-1">'
       +      '<thead><tr><th class="L">Loja</th>'
       +      '<th>Fat. Líq. 2026 YTD</th><th>Margem 2026</th>'
       +      '<th>Fat. Líq. 2025 ano</th><th>Margem 2025</th>'
       +      '<th>Δ R$</th><th>Δ %</th></tr></thead>'
       +      '<tbody id="tb-vvis-1"></tbody></table></div>'
       + '</div>';

  // Tabela: jan-mar 26 vs jan-mar 25
  html += '<div class="cc" style="margin-bottom:12px;">'
       +    '<div class="cct">Resumo jan-mar (período comparável)</div>'
       +    '<div class="ccs">Comparativo entre o mesmo trimestre dos anos</div>'
       +    '<div class="tscroll"><table class="t" id="t-vvis-2">'
       +      '<thead><tr><th class="L">Loja</th>'
       +      '<th>Jan-Mar/26</th><th>Jan-Mar/25</th>'
       +      '<th>Δ R$</th><th>Δ %</th></tr></thead>'
       +      '<tbody id="tb-vvis-2"></tbody></table></div>'
       + '</div>';

  html += '</div>'; // page-body
  cont.innerHTML = html;

  // ─── Popular KPIs ───
  document.getElementById('kg-v-visao').innerHTML = kgHtml([
    {l:'Fat. Líq. 2025', v: fK(fat2025), s: 'Ano completo'},
    {l:'Fat. Líq. jan-abr/26', v: fK(fat2026), s: '4 meses'},
    {l:'Crescimento jan-mar 26 vs 25', v: (cresceJM>=0?'+':'') + fP(cresceJM), s: 'Período comparável', cls: cresceJM>=0?'up':'dn'},
  ]);

  // ─── Pizza por loja ───
  // Usa o ano com mais dados (2025 se completo, senão 2026)
  const anoRef = fat2025 > 0 ? '2025' : '2026';
  const lojas = ['ATP-V', 'ATP-A'];
  const fatLojas = lojas.map(function(l){
    const dados = (V.resumo.por_loja[l] && V.resumo.por_loja[l].por_ano && V.resumo.por_loja[l].por_ano[anoRef]) || {};
    return dados.fat_liq || 0;
  });
  const totRef = fatLojas.reduce(function(s,x){return s+x;}, 0);

  mkC('c-vvis-pizza', {type:'doughnut', data:{labels:lojas.map(function(l){return l==='ATP-V'?'ATP Varejo':'ATP Atacado';}),
    datasets:[{data:fatLojas, backgroundColor:[_PAL.ac, _PAL.hl], borderWidth:2, borderColor:'#fff'}]},
    options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'bottom', labels:{padding:10, usePointStyle:true, boxWidth:8, font:{size:11}}},
               tooltip:{callbacks:{label:function(ctx){return ctx.label+': '+fK(ctx.raw)+' ('+fP(totRef>0?ctx.raw/totRef*100:0)+')';}}}}}});

  // ─── Barras: jan-mar dos anos disponíveis empilhado por loja ───
  // Para cada ano, soma jan-mar de ATP-V e ATP-A
  const anosBars = [];
  ['2024','2025','2026'].forEach(function(ano){
    const grupoTem = grupoAno[ano] || jm2024.fat_liq>0 || jm2025.fat_liq>0 || jm2026.fat_liq>0;
    const v = ano==='2024'?jm2024:(ano==='2025'?jm2025:jm2026);
    if(v.fat_liq > 0) anosBars.push(ano);
  });
  // Para cada ano, jan-mar por loja
  const dsLojas = lojas.map(function(loja, idx){
    return {
      label: loja==='ATP-V'?'ATP Varejo':'ATP Atacado',
      data: anosBars.map(function(ano){
        const m = _vendasMensalPor(loja, 'v-visao-grupo').filter(function(r){return r.ym >= ano+'-01' && r.ym <= ano+'-03';});
        return m.reduce(function(s,r){return s+r.fat_liq;}, 0);
      }),
      backgroundColor: idx===0 ? _PAL.ac+'CC' : _PAL.hl+'CC',
      borderRadius: 5,
    };
  });

  if(anosBars.length){
    mkC('c-vvis-bars', {type:'bar', data:{labels:anosBars, datasets:dsLojas},
      options:{responsive:true, maintainAspectRatio:false,
        plugins:{legend:{position:'bottom', labels:{padding:10, usePointStyle:true, boxWidth:8}},
                 tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+fB(ctx.raw);}}}},
        scales:{x:{stacked:true, grid:{display:false}}, y:{stacked:true, beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}}}}});
  }

  // ─── Tabela 1: 2026 vs 2025 ───
  const linhasT1 = [];
  ['ATP-V', 'ATP-A'].forEach(function(loja){
    const lj = V.resumo.por_loja[loja];
    if(!lj) return;
    const a26 = (lj.por_ano && lj.por_ano['2026']) || {};
    const a25 = (lj.por_ano && lj.por_ano['2025']) || {};
    const f26 = a26.fat_liq || 0, f25 = a25.fat_liq || 0;
    const m26 = a26.marg || 0, m25 = a25.marg || 0;
    const dif = f26 - f25;
    const difPct = f25>0 ? dif/f25*100 : 0;
    linhasT1.push({
      loja: loja==='ATP-V'?'ATP Varejo':'ATP Atacado',
      f26:f26, m26:m26, f25:f25, m25:m25, dif:dif, difPct:difPct,
    });
  });
  // Total grupo
  const f26g = grupoAno['2026'] && grupoAno['2026'].fat_liq || 0;
  const f25g = grupoAno['2025'] && grupoAno['2025'].fat_liq || 0;
  const m26g = grupoAno['2026'] && grupoAno['2026'].marg || 0;
  const m25g = grupoAno['2025'] && grupoAno['2025'].marg || 0;
  linhasT1.push({
    loja:'<strong>GRUPO</strong>', f26:f26g, m26:m26g, f25:f25g, m25:m25g,
    dif:f26g-f25g, difPct: f25g>0?(f26g-f25g)/f25g*100:0,
    isTotal: true,
  });

  document.getElementById('tb-vvis-1').innerHTML = linhasT1.map(function(r){
    const cls = r.isTotal ? ' style="background:var(--surface-2);font-weight:700;"' : '';
    const difCls = r.dif>=0 ? 'val-pos' : 'val-neg';
    return '<tr'+cls+'>'
      + '<td class="L">'+r.loja+'</td>'
      + '<td class="val-strong">'+fK(r.f26)+'</td>'
      + '<td>'+fP(r.m26)+'</td>'
      + '<td>'+fK(r.f25)+'</td>'
      + '<td>'+fP(r.m25)+'</td>'
      + '<td class="'+difCls+'">'+(r.dif>=0?'+':'')+fK(r.dif)+'</td>'
      + '<td class="'+difCls+'">'+(r.difPct>=0?'+':'')+fP(r.difPct)+'</td>'
      + '</tr>';
  }).join('');

  // ─── Tabela 2: jan-mar do ano atual vs jan-mar do ano anterior ───
  // v4.75: extrai o ano dinamicamente. Mês fim = último mês fechado do ano atual
  // (se nada disponível, usa março como default).
  const _anoNow = new Date().getFullYear();
  const _anoPrev = _anoNow - 1;
  const _ultYmAno = (V && V.meta && V.meta.ultimo_mes && V.meta.ultimo_mes.ym && V.meta.ultimo_mes.ym.indexOf(_anoNow+'-')===0)
    ? V.meta.ultimo_mes.ym : (_anoNow+'-03');
  const _mesFimComp = (V && V.meta && V.meta.ultimo_mes && V.meta.ultimo_mes.aberto)
    ? ((parseInt(_ultYmAno.substring(5,7),10)-1) || 12)
    : parseInt(_ultYmAno.substring(5,7),10);
  const _ymFimAtual = _anoNow + '-' + String(_mesFimComp).padStart(2,'0');
  const _ymFimPrev  = _anoPrev + '-' + String(_mesFimComp).padStart(2,'0');
  const _ymIniAtual = _anoNow + '-01';
  const _ymIniPrev  = _anoPrev + '-01';
  const linhasT2 = [];
  ['ATP-V', 'ATP-A'].forEach(function(loja){
    const m25 = _vendasMensalPor(loja, 'v-visao-grupo').filter(function(r){return r.ym >= _ymIniPrev && r.ym <= _ymFimPrev;});
    const m26 = _vendasMensalPor(loja, 'v-visao-grupo').filter(function(r){return r.ym >= _ymIniAtual && r.ym <= _ymFimAtual;});
    const f25 = m25.reduce(function(s,r){return s+r.fat_liq;}, 0);
    const f26 = m26.reduce(function(s,r){return s+r.fat_liq;}, 0);
    const dif = f26 - f25;
    const difPct = f25>0 ? dif/f25*100 : 0;
    linhasT2.push({loja: loja==='ATP-V'?'ATP Varejo':'ATP Atacado', f26, f25, dif, difPct});
  });
  // Total
  const f26jm = jm2026.fat_liq, f25jm = jm2025.fat_liq;
  linhasT2.push({
    loja:'<strong>GRUPO</strong>', f26:f26jm, f25:f25jm,
    dif:f26jm-f25jm, difPct:f25jm>0?(f26jm-f25jm)/f25jm*100:0, isTotal: true,
  });

  document.getElementById('tb-vvis-2').innerHTML = linhasT2.map(function(r){
    const cls = r.isTotal ? ' style="background:var(--surface-2);font-weight:700;"' : '';
    const difCls = r.dif>=0 ? 'val-pos' : 'val-neg';
    return '<tr'+cls+'>'
      + '<td class="L">'+r.loja+'</td>'
      + '<td class="val-strong">'+fK(r.f26)+'</td>'
      + '<td>'+fK(r.f25)+'</td>'
      + '<td class="'+difCls+'">'+(r.dif>=0?'+':'')+fK(r.dif)+'</td>'
      + '<td class="'+difCls+'">'+(r.difPct>=0?'+':'')+fP(r.difPct)+'</td>'
      + '</tr>';
  }).join('');
}

// ────────────────────────────────────────────────────────────────────
// V EVOLUÇÃO MENSAL
// ────────────────────────────────────────────────────────────────────
function renderVEvolucao(){
  const cont = document.getElementById('page-v-evolucao');
  if(!cont) return;

  const periodo = (V.meta && V.meta.periodo) || {};
  // Detectar lojas disponíveis no V.mensal (não hardcoded)
  const lojasDisp = (function(){
    if(!V || !V.mensal) return [];
    const set = new Set();
    V.mensal.forEach(function(r){ if(r.loja) set.add(r.loja); });
    // Ordem preferencial: ATP primeiro, depois CP por código
    const ordem = ['ATP-V','ATP-A','CP1','CP3','CP5','CP40'];
    const arr = Array.from(set);
    arr.sort(function(a,b){
      const ia = ordem.indexOf(a), ib = ordem.indexOf(b);
      if(ia >= 0 && ib >= 0) return ia - ib;
      if(ia >= 0) return -1;
      if(ib >= 0) return 1;
      return a.localeCompare(b);
    });
    return arr;
  })();

  // Mapeamento de label amigável (para gráficos e tabelas)
  const lojaLabel = {
    'ATP-V':'ATP Varejo', 'ATP-A':'ATP Atacado',
    'CP1':'Comercial Pinto', 'CP3':'Cestão Loja 1',
    'CP5':'Cestão Inhambupe', 'CP40':'Barros 40'
  };
  const labelDe = function(l){ return lojaLabel[l] || l; };

  let html = '<div class="ph"><div class="pk">Vendas · Grupo</div><h2>Evolução <em>Mensal</em></h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>Cobertura:</strong> '+esc(periodo.inicio||'?')+' a '+esc(periodo.fim||'?')+' · '+(periodo.meses||0)+' meses · '
       +   '<strong>'+lojasDisp.length+'</strong> lojas: '+lojasDisp.map(esc).join(', ')
       + '</div>';

  // ── Gráfico consolidado: todas as lojas + total ──
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cct">Faturamento líquido mensal · todas as lojas</div>'
       +    '<div class="ccs">Linha total + linha por loja (sobreposto)</div>'
       +    '<div style="height:340px;"><canvas id="c-vevo-multi"></canvas></div>'
       + '</div>';

  // ── Comparativo: uma loja vs as outras ──
  if(lojasDisp.length > 1){
    html += '<div class="cc" style="margin-bottom:14px;">'
         +    '<div class="cch">'
         +      '<div><div class="cct">Comparativo · loja em destaque vs demais</div>'
         +        '<div class="ccs">A loja escolhida aparece em destaque, todas as outras em cinza claro</div></div>'
         +      '<select id="vevo-comp-select" style="padding:6px 10px;border:1px solid var(--border);border-radius:5px;font-size:12px;background:var(--surface);color:var(--text);">'
         +        lojasDisp.map(function(l, i){return '<option value="'+esc(l)+'"'+(i===0?' selected':'')+'>'+esc(labelDe(l))+'</option>';}).join('')
         +      '</select>'
         +    '</div>'
         +    '<div style="height:300px;margin-top:8px;"><canvas id="c-vevo-comp"></canvas></div>'
         +    '<div id="tb-vevo-comp-resumo" style="margin-top:10px;font-size:11px;color:var(--text-dim);"></div>'
         + '</div>';
  }

  // ── Cards individuais (uma loja por card) ──
  html += '<div class="cct" style="margin:18px 0 8px;font-size:14px;">Por loja · faturamento mensal</div>';
  // grid responsivo: 3 colunas em telas largas, 2 em médias, 1 em pequenas
  const cols = lojasDisp.length >= 6 ? 3 : (lojasDisp.length >= 3 ? 3 : lojasDisp.length);
  html += '<div style="display:grid;grid-template-columns:repeat('+cols+',1fr);gap:10px;margin-bottom:14px;">';
  lojasDisp.forEach(function(l){
    html += '<div class="cc">'
         +   '<div class="cct" style="font-size:12px;">'+esc(labelDe(l))+'</div>'
         +   '<div class="ccs" style="font-size:10px;">cód: '+esc(l)+'</div>'
         +   '<div style="height:160px;"><canvas id="c-vevo-loja-'+esc(l)+'"></canvas></div>'
         + '</div>';
  });
  html += '</div>';

  // ── Margem mensal (consolidada GRUPO) ──
  html += '<div style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Margem mensal · GRUPO consolidado</div>'
       +      '<div class="ccs">% sobre faturamento líquido (todas as lojas)</div>'
       +      '<div style="height:240px;"><canvas id="c-vevo-marg"></canvas></div>'
       +    '</div>'
       + '</div>';

  // ── Seletor de loja para tabela mensal ──
  html += '<div class="cc">'
       +    '<div class="cch">'
       +      '<div><div class="cct">Tabela mensal</div><div class="ccs">Selecione uma loja ou veja o GRUPO consolidado</div></div>'
       +      '<select id="vevo-loja-select" style="padding:6px 10px;border:1px solid var(--border);border-radius:5px;font-size:12px;background:var(--surface);color:var(--text);">'
       +        '<option value="">GRUPO (consolidado)</option>'
       +        lojasDisp.map(function(l){return '<option value="'+esc(l)+'">'+esc(labelDe(l))+'</option>';}).join('')
       +      '</select>'
       +    '</div>'
       +    '<div class="tscroll" style="margin-top:10px;"><table class="t">'
       +      '<thead><tr><th class="L">Mês</th>'
       +      '<th>Fat. Bruto</th><th>Devol.</th><th>Fat. Líquido</th>'
       +      '<th>Lucro</th><th>Margem</th><th>QT</th><th>NFs</th>'
       +      '</tr></thead><tbody id="tb-vevo"></tbody></table></div>'
       + '</div>';

  html += '</div>'; // page-body
  cont.innerHTML = html;

  // ═══════════════════════════════════════════════════════════
  // GRÁFICOS
  // ═══════════════════════════════════════════════════════════

  const grupo = _vendasMensalPor(null, 'v-evolucao');
  const lblG = grupo.map(function(r){return _ymToLabel(r.ym);});

  // Cores fixas por loja (consistência visual)
  const cores = {
    'ATP-V': '#f58634', 'ATP-A': '#30569f',
    'CP1':   '#10b981', 'CP3':   '#8b5cf6',
    'CP5':   '#ef4444', 'CP40':  '#06b6d4'
  };

  // ── Multi-line chart: total + cada loja ──
  // Detectar se a base atual já É o GRUPO consolidado (todas as 6 lojas estão presentes).
  // Se for filhote-folha (CP3, CP5, CP1, CP40, ATP-V, ATP-A) ou consolidado parcial
  // (ATP com 2 lojas, CP com 4), o "GRUPO (total)" desta visão é só a soma das
  // lojas presentes — diferente do GRUPO consolidado real do GPC. Precisamos
  // buscar o vendas_grupo.json pra plotar a linha de referência correta.
  const sigAtual = (typeof _filialAtual !== 'undefined' && _filialAtual && _filialAtual.sigla)
    ? _filialAtual.sigla.toLowerCase() : 'grupo';
  const ehGrupoConsolidado = (sigAtual === 'grupo');
  const ehFolhaUnica = (lojasDisp.length === 1);

  const datasetsMulti = [];

  // Cabeçalho do gráfico
  if(ehGrupoConsolidado || !ehFolhaUnica){
    // GRUPO real ou consolidado parcial (ATP/CP): mostra linha grossa do total
    datasetsMulti.push({
      label: ehGrupoConsolidado ? 'GRUPO (total)' : 'GPC consolidado (referência)',
      data: grupo.map(function(r){return r.fat_liq;}),
      borderColor: '#1f2937',
      backgroundColor: 'rgba(31,41,55,0.10)',
      borderWidth: 2.5,
      tension: 0.3,
      fill: false,
      pointRadius: 3
    });
  } else {
    // Folha-única: linha de referência GPC (tracejada, cinza) — fica atrás
    // da loja, que vira o protagonista
    datasetsMulti.push({
      label: 'GPC consolidado (referência)',
      data: grupo.map(function(){return null;}), // será preenchido pelo fetch
      borderColor: '#94a3b8',
      backgroundColor: 'rgba(148,163,184,0.06)',
      borderWidth: 1.5,
      borderDash: [6,4],
      tension: 0.3,
      fill: false,
      pointRadius: 0,
      hidden: true,                 // invisível até o fetch chegar
      order: 2                      // atrás da loja
    });
  }

  // Datasets das lojas presentes na base
  // v4.79: indexar m por ym (era O(N²) com .find por mes)
  lojasDisp.forEach(function(l){
    const m = _vendasMensalPor(l, 'v-evolucao');
    const mByYm = new Map(m.map(function(x){return [x.ym, x];}));
    const data = lblG.map(function(_, i){
      const linha = mByYm.get(grupo[i].ym);
      return linha ? linha.fat_liq : 0;
    });
    if(ehFolhaUnica && !ehGrupoConsolidado){
      // Folha-única vira protagonista: cor da loja, traço grosso, com fill
      datasetsMulti.push({
        label: labelDe(l),
        data: data,
        borderColor: cores[l] || '#1f2937',
        backgroundColor: (cores[l] || '#1f2937') + '20',
        borderWidth: 3,
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        order: 1
      });
    } else {
      datasetsMulti.push({
        label: labelDe(l),
        data: data,
        borderColor: cores[l] || '#999',
        backgroundColor: (cores[l] || '#999') + '20',
        borderWidth: 1.5,
        tension: 0.3,
        fill: false,
        pointRadius: 2
      });
    }
  });

  let chartMulti = null;

  chartMulti = mkC('c-vevo-multi', {
    type:'line',
    data:{labels: lblG, datasets: datasetsMulti},
    options:{
      responsive:true, maintainAspectRatio:false,
      interaction:{mode:'index', intersect:false},
      plugins:{
        legend:{position:'bottom', labels:{boxWidth:12, font:{size:11}, padding:8}},
        tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+fK(ctx.raw);}}}
      },
      scales:{
        y:{beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}},
        x:{grid:{display:false}}
      }
    }
  });

  // Log defensivo pro debug do gráfico Evolução Mensal (v4.65: corrigido tipoAtual + erro visível)
  try {
    var tipoAtual = (typeof _filialAtual !== 'undefined' && _filialAtual && _filialAtual.tipo) || 'desconhecido';
    console.log('═══════════════════════════════════════════════════════════');
    console.log('[v-evolucao] DEBUG v4.65');
    console.log('  sigAtual    =', sigAtual);
    console.log('  tipoAtual   =', tipoAtual);
    console.log('  ehGrupoCons =', ehGrupoConsolidado);
    console.log('  ehFolhaUnica=', ehFolhaUnica);
    console.log('  lojasDisp   =', lojasDisp);
    console.log('  V.mensal.lojas (raw) =', Array.from(new Set(V.mensal.map(function(r){return r.loja;}))));
    console.log('  V.mensal.length      =', V.mensal.length);
    console.log('  V.meta.geradoEm      =', V.meta && V.meta.geradoEm);
    console.log('  V.meta.periodo       =', V.meta && V.meta.periodo);
    console.log('  V.meta.fonte         =', V.meta && V.meta.fonte);

    // Amostra dos primeiros 3 registros brutos de V.mensal por loja
    console.log('--- Amostra V.mensal (primeiros 3 por loja) ---');
    lojasDisp.forEach(function(l){
      var amostra = V.mensal.filter(function(r){return r.loja === l;}).slice(0,3);
      console.log('  ['+l+']', amostra);
    });

    // Datasets enviados pro chart (min/max)
    console.log('--- Datasets enviados pro chart ---');
    datasetsMulti.forEach(function(ds, i){
      var validos = ds.data.filter(function(x){return x!=null;});
      var min = validos.length ? Math.min.apply(null, validos) : null;
      var max = validos.length ? Math.max.apply(null, validos) : null;
      var soma = validos.reduce(function(s,x){return s+x;}, 0);
      console.log('  ds['+i+'] "'+ds.label+'" min='+min+' max='+max+' soma='+soma+' n='+ds.data.length);
      // Se max é absurdo (>10M num gráfico de loja-folha que deveria ter max ~2M), avisar
      if(ehFolhaUnica && max > 10000000){
        console.warn('  ⚠ ALERTA: dataset "'+ds.label+'" com max='+max+' suspeito em folha-única!');
        console.warn('  ⚠ Dados brutos do dataset:', ds.data);
      }
    });
    console.log('═══════════════════════════════════════════════════════════');
  } catch(e){
    console.error('[v-evolucao] Erro no log defensivo:', e.message, e.stack);
  }

  // Buscar GRUPO consolidado real quando estamos em base não-grupo
  if(!ehGrupoConsolidado){
    _fetchJsonComGz('vendas_grupo.json').then(function(vGrupo){
      if(!vGrupo || !vGrupo.mensal || !chartMulti) return;
      // Agregar V.mensal do grupo por ym
      const porYm = new Map();
      vGrupo.mensal.forEach(function(r){
        if(!porYm.has(r.ym)) porYm.set(r.ym, 0);
        porYm.set(r.ym, porYm.get(r.ym) + (r.fat_liq||0));
      });
      // Alinha pelos ym do gráfico atual
      const novoData = grupo.map(function(r){return porYm.get(r.ym) || 0;});
      chartMulti.data.datasets[0].data = novoData;
      chartMulti.data.datasets[0].hidden = false;
      chartMulti.update('none');
    }).catch(function(e){
      console.warn('[v-evolucao] vendas_grupo.json não disponível:', e && e.message);
    });
  }

  // ── Cards individuais por loja ──
  lojasDisp.forEach(function(l){
    const m = _vendasMensalPor(l, 'v-evolucao');
    if(!m.length) return;
    const lbl = m.map(function(r){return _ymToLabel(r.ym);});
    mkC('c-vevo-loja-'+l, {
      type:'bar',
      data:{labels:lbl, datasets:[{
        label: labelDe(l),
        data: m.map(function(r){return r.fat_liq;}),
        backgroundColor: (cores[l] || '#999')+'CC',
        borderRadius: 3
      }]},
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{
          legend:{display:false},
          tooltip:{callbacks:{label:function(ctx){return fK(ctx.raw);}}}
        },
        scales:{
          y:{beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);},font:{size:9}}},
          x:{grid:{display:false}, ticks:{font:{size:9}, maxRotation:0}}
        }
      }
    });
  });

  // ── Comparativo: loja em destaque vs demais ──
  if(lojasDisp.length > 1){
    function _vevoCompRender(lojaDestaque){
      const dsComp = [];
      const dadosLojas = {};
      lojasDisp.forEach(function(l){
        const m = _vendasMensalPor(l, 'v-evolucao');
        dadosLojas[l] = m;
      });
      // Datasets: lojas não-destacadas em cinza claro fino, loja destaque colorida grossa
      // v4.79: indexar m por ym (era O(N²) com .find)
      lojasDisp.forEach(function(l){
        const m = dadosLojas[l];
        const mByYm = new Map(m.map(function(x){return [x.ym, x];}));
        const data = lblG.map(function(_, i){
          const linha = mByYm.get(grupo[i].ym);
          return linha ? linha.fat_liq : 0;
        });
        const ehDestaque = (l === lojaDestaque);
        dsComp.push({
          label: labelDe(l) + (ehDestaque ? ' (destaque)' : ''),
          data: data,
          borderColor: ehDestaque ? (cores[l] || '#1f2937') : '#cbd5e1',
          backgroundColor: ehDestaque ? ((cores[l] || '#1f2937') + '20') : 'rgba(203,213,225,0.08)',
          borderWidth: ehDestaque ? 3 : 1,
          tension: 0.3,
          fill: ehDestaque,
          pointRadius: ehDestaque ? 4 : 0,
          order: ehDestaque ? 1 : 2
        });
      });
      mkC('c-vevo-comp', {
        type: 'line',
        data: {labels: lblG, datasets: dsComp},
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {position: 'bottom', labels: {boxWidth: 10, font: {size: 10}, padding: 8}},
            tooltip: {callbacks: {label: function(ctx){return ctx.dataset.label.replace(' (destaque)','') + ': ' + fK(ctx.raw);}}}
          },
          scales: {
            y: {beginAtZero: true, ticks: {callback: function(v){return fAbbr(v);}}},
            x: {grid: {display: false}, ticks: {font: {size: 10}}}
          }
        }
      });

      // Resumo numérico embaixo
      const mDest = dadosLojas[lojaDestaque] || [];
      const fatDest = mDest.reduce(function(s,r){return s+r.fat_liq;}, 0);
      const fatTot  = grupo.reduce(function(s,r){return s+r.fat_liq;}, 0);
      const pct = fatTot > 0 ? (fatDest/fatTot*100) : 0;
      // Posição (ranking) por faturamento
      const ranking = lojasDisp.map(function(l){
        return {l:l, fat:(dadosLojas[l]||[]).reduce(function(s,r){return s+r.fat_liq;}, 0)};
      }).sort(function(a,b){return b.fat - a.fat;});
      const pos = ranking.findIndex(function(x){return x.l === lojaDestaque;}) + 1;
      const resumoEl = document.getElementById('tb-vevo-comp-resumo');
      if(resumoEl){
        resumoEl.innerHTML = '<strong>'+esc(labelDe(lojaDestaque))+':</strong> '
          + fK(fatDest) + ' acumulado · '
          + fP(pct,1) + ' do grupo · '
          + 'posição ' + pos + ' de ' + lojasDisp.length + ' lojas';
      }
    }
    _vevoCompRender(lojasDisp[0]);
    const compSel = document.getElementById('vevo-comp-select');
    if(compSel){
      compSel.addEventListener('change', function(){
        _vevoCompRender(compSel.value);
      });
    }
  }

  // ── Margem mensal consolidada ──
  mkC('c-vevo-marg', {type:'line', data:{labels:lblG, datasets:[{
    label:'Margem %',
    data: grupo.map(function(r){return r.fat_liq>0?r.lucro/r.fat_liq*100:0;}),
    borderColor:_PAL.ok, backgroundColor:'rgba(16,152,84,.12)', fill:true,
    tension:.4, pointRadius:4, pointBackgroundColor:_PAL.ok,
  }]}, options:{responsive:true, maintainAspectRatio:false,
    plugins:{legend:{display:false}, tooltip:{callbacks:{label:function(ctx){return fP(ctx.raw,2);}}}},
    scales:{y:{beginAtZero:false, ticks:{callback:function(v){return fP(v);}}}, x:{grid:{display:false}}}}});

  // ── Tabela mensal com seletor de loja ──
  function renderTabelaVevo(loja){
    const dados = _vendasMensalPor(loja || null, 'v-evolucao');
    const tb = document.getElementById('tb-vevo');
    if(!tb) return;
    tb.innerHTML = dados.slice().reverse().map(function(r){
      const marg = r.fat_liq>0 ? r.lucro/r.fat_liq*100 : 0;
      const margCls = marg<10 ? 'val-neg' : marg>15 ? 'val-pos' : '';
      return '<tr>'
        + '<td class="L">'+_ymToLabel(r.ym)+'</td>'
        + '<td>'+fK(r.fat_brt)+'</td>'
        + '<td class="val-dim">'+fK(r.devol)+'</td>'
        + '<td class="val-strong">'+fK(r.fat_liq)+'</td>'
        + '<td>'+fK(r.lucro)+'</td>'
        + '<td class="'+margCls+'">'+fP(marg)+'</td>'
        + '<td class="val-dim">'+fI(r.qt)+'</td>'
        + '<td class="val-dim">'+fI(r.nfs)+'</td>'
        + '</tr>';
    }).join('');
  }
  renderTabelaVevo(null);
  const sel = document.getElementById('vevo-loja-select');
  if(sel){
    sel.addEventListener('change', function(){ renderTabelaVevo(sel.value); });
  }
}

// ────────────────────────────────────────────────────────────────────
// V ATP VAREJO + V ATP ATACADO (drilldowns por loja)
// Sub-etapa 4c.2 · 30/abr/2026
// As duas páginas têm estrutura idêntica, só mudando a loja.
// ────────────────────────────────────────────────────────────────────

function renderVATPVarejo()  { return _renderVLoja('ATP-V', 'v-atp-varejo'); }
function renderVATPAtacado() { return _renderVLoja('ATP-A', 'v-atp-atacado'); }

/**
 * Renderiza uma página de drilldown por loja.
 * @param {string} loja  'ATP-V' | 'ATP-A' | 'CSTL1' | 'INH'
 * @param {string} pageId  ID HTML da página (sem prefixo 'page-')
 */
function _renderVLoja(loja, pageId){
  const cont = document.getElementById('page-' + pageId);
  if(!cont) return;

  const lojaInfo = (V.resumo && V.resumo.por_loja && V.resumo.por_loja[loja]) || null;
  if(!lojaInfo){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Por loja</div><h2>'+esc(loja)+'</h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc" style="text-align:center;color:var(--text-muted);padding:30px;">'
      +   'Sem dados disponíveis para a loja '+esc(loja)
      + '</div></div>';
    return;
  }

  const nomeLoja = (V.meta && V.meta.lojas_nomes && V.meta.lojas_nomes[loja]) || loja;
  const ehVarejo = loja === 'ATP-V';
  const tituloPk = 'Vendas · Por Loja';
  const tituloH2 = ehVarejo ? 'ATP — <em>Varejo</em>' : 'ATP — <em>Atacado</em>';

  // Mensal da loja
  const mensal = _vendasMensalPor(loja);

  // KPIs por ano + jan-mar
  const ano2024 = (lojaInfo.por_ano && lojaInfo.por_ano['2024']) || null;
  const ano2025 = (lojaInfo.por_ano && lojaInfo.por_ano['2025']) || {};
  const ano2026 = (lojaInfo.por_ano && lojaInfo.por_ano['2026']) || {};

  const jm2025 = mensal.filter(function(r){return r.ym >= '2025-01' && r.ym <= '2025-03';});
  const jm2026 = mensal.filter(function(r){return r.ym >= '2026-01' && r.ym <= '2026-03';});
  const fjm25 = jm2025.reduce(function(s,r){return s+r.fat_liq;}, 0);
  const fjm26 = jm2026.reduce(function(s,r){return s+r.fat_liq;}, 0);
  const cresceJM = fjm25>0 ? (fjm26/fjm25 - 1)*100 : 0;

  // Fat jan-abr de cada ano (já que cobrimos isso)
  const ja2025 = mensal.filter(function(r){return r.ym >= '2025-01' && r.ym <= '2025-04';})
                         .reduce(function(s,r){return s+r.fat_liq;}, 0);
  const ja2026 = mensal.filter(function(r){return r.ym >= '2026-01' && r.ym <= '2026-04';})
                         .reduce(function(s,r){return s+r.fat_liq;}, 0);
  const cresceJA = ja2025>0 ? (ja2026/ja2025 - 1)*100 : 0;

  // ─── Estrutura HTML ───
  let html = '<div class="ph"><div class="pk">'+tituloPk+'</div><h2>'+tituloH2+'</h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // Banner
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>'+esc(nomeLoja)+'</strong> · '+(mensal.length||0)+' meses cobertos · '
       +   fI(lojaInfo.total.skus||0)+' SKUs únicos · '+fI(lojaInfo.total.vendedores||0)+' vendedores'
       + '</div>';

  // KPIs (4)
  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px;" id="kg-vl-'+pageId+'"></div>';

  // Linha 1 de gráficos: depto último mês + variação
  html += '<div class="row2eq" style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Faturamento por departamento — último mês</div>'
       +      '<div class="ccs" id="cct-vl-dept-sub-'+pageId+'">Top departamentos</div>'
       +      '<div style="height:240px;"><canvas id="c-vl-dept-'+pageId+'"></canvas></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">Variação mensal — Δ vs mês anterior</div>'
       +      '<div class="ccs">% de variação MoM (todos os meses cobertos)</div>'
       +      '<div style="height:240px;"><canvas id="c-vl-mom-'+pageId+'"></canvas></div>'
       +    '</div>'
       + '</div>';

  // Linha 2: depto mensal empilhado
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cct">Faturamento mensal por departamento</div>'
       +    '<div class="ccs">Empilhado · evolução do mix por categoria principal</div>'
       +    '<div style="height:280px;"><canvas id="c-vl-deptmes-'+pageId+'"></canvas></div>'
       + '</div>';

  // Tabela: Departamentos
  html += '<div class="cc" style="margin-bottom:12px;">'
       +    '<div class="cct">Departamentos — último mês</div>'
       +    '<div class="ccs" id="cct-vl-tdept-sub-'+pageId+'">Comparativo com mês anterior e mesmo mês ano anterior</div>'
       +    '<div class="tscroll"><table class="t" id="t-vl-tdept-'+pageId+'">'
       +      '<thead><tr><th class="L">Departamento</th>'
       +      '<th>Último mês</th><th>vs mês anterior</th><th>vs ano anterior</th>'
       +      '<th>Margem</th></tr></thead>'
       +      '<tbody id="tb-vl-tdept-'+pageId+'"></tbody></table></div>'
       + '</div>';

  // Tabela: Top produtos
  html += '<div class="cc">'
       +    '<div class="cct">Top 20 produtos — último mês</div>'
       +    '<div class="ccs" id="cct-vl-tprod-sub-'+pageId+'">Maiores faturamentos</div>'
       +    '<div class="tscroll"><table class="t" id="t-vl-tprod-'+pageId+'">'
       +      '<thead><tr><th class="L" style="width:28px;">#</th>'
       +      '<th class="L">Produto</th>'
       +      '<th>Último mês</th><th>vs mês anterior</th><th>vs ano anterior</th>'
       +      '<th>Margem</th></tr></thead>'
       +      '<tbody id="tb-vl-tprod-'+pageId+'"></tbody></table></div>'
       + '</div>';

  html += '</div>'; // page-body
  cont.innerHTML = html;

  // ─── Popular KPIs ───
  document.getElementById('kg-vl-'+pageId).innerHTML = kgHtml([
    {l:'Fat. Líq. 2024', v: ano2024 ? fK(ano2024.fat_liq||0) : '—',
       s: ano2024 ? 'Margem '+fP(ano2024.marg||0) : 'Sem dados'},
    {l:'Fat. Líq. 2025', v: fK(ano2025.fat_liq||0),
       s: 'Margem '+fP(ano2025.marg||0)+' · ano completo'},
    {l:'Fat. Líq. jan-abr/26', v: fK(ja2026),
       s: ja2025>0 ? (cresceJA>=0?'+':'')+fP(cresceJA)+' vs jan-abr/25' : '4 meses',
       cls: cresceJA>=0?'up':'dn'},
    {l:'Crescimento jan-mar', v: (cresceJM>=0?'+':'')+fP(cresceJM),
       s: '26 vs 25 · período comparável', cls: cresceJM>=0?'up':'dn'},
  ]);

  // ─── Identificar último mês com dados ───
  if(!mensal.length) return;
  const ultimoYm = mensal[mensal.length-1].ym;
  const labelUltimoMes = _ymToLabel(ultimoYm);

  // Atualizar legendas dinâmicas
  const subDept = document.getElementById('cct-vl-dept-sub-'+pageId);
  if(subDept) subDept.textContent = 'Top departamentos · '+labelUltimoMes;
  const subTd = document.getElementById('cct-vl-tdept-sub-'+pageId);
  if(subTd) subTd.textContent = 'Período: '+labelUltimoMes+' · variações vs mês anterior e mesmo mês de '+ultimoYm.substring(0,4)*1-1;
  const subTp = document.getElementById('cct-vl-tprod-sub-'+pageId);
  if(subTp) subTp.textContent = 'Top 20 produtos por faturamento líquido em '+labelUltimoMes;

  // ─── Chart 1: Pizza de departamentos do último mês ───
  const deptosUlt = (V.deptos || []).filter(function(r){
    return r.loja === loja && r.ym === ultimoYm;
  });
  const totalDeptUlt = deptosUlt.reduce(function(s,r){return s+r.fat_liq;}, 0);
  // Top 7 deptos + outros
  const dpSorted = deptosUlt.slice().sort(function(a,b){return b.fat_liq - a.fat_liq;});
  const dpTop = dpSorted.slice(0, 7);
  const dpOutros = dpSorted.slice(7);
  const dpLabels = dpTop.map(function(d){return d.nome;});
  const dpData = dpTop.map(function(d){return d.fat_liq;});
  if(dpOutros.length){
    dpLabels.push('Outros ('+dpOutros.length+')');
    dpData.push(dpOutros.reduce(function(s,r){return s+r.fat_liq;}, 0));
  }
  const dC = ['#2E476F','#F58634','#109854','#7c3aed','#DC7529','#1E3558','#0891B2','#94a3b8'];

  if(dpData.length){
    mkC('c-vl-dept-'+pageId, {type:'doughnut',
      data:{labels:dpLabels, datasets:[{data:dpData, backgroundColor:dC, borderWidth:2, borderColor:'#fff'}]},
      options:{responsive:true, maintainAspectRatio:false,
        plugins:{legend:{position:'right', labels:{padding:7, usePointStyle:true, boxWidth:8, font:{size:10}}},
                 tooltip:{callbacks:{label:function(ctx){return ctx.label+': '+fK(ctx.raw)+' ('+fP(totalDeptUlt>0?ctx.raw/totalDeptUlt*100:0)+')';}}}}}});
  }

  // ─── Chart 2: Variação MoM (Δ% vs mês anterior) ───
  const lblMom = [];
  const valMom = [];
  for(let i = 1; i < mensal.length; i++){
    const cur = mensal[i];
    const prev = mensal[i-1];
    if(prev.fat_liq > 0){
      lblMom.push(_ymToLabel(cur.ym));
      valMom.push((cur.fat_liq/prev.fat_liq - 1)*100);
    }
  }
  if(valMom.length){
    mkC('c-vl-mom-'+pageId, {type:'bar', data:{labels:lblMom, datasets:[{
      label:'MoM %', data: valMom,
      backgroundColor: valMom.map(function(v){return v>=0?_PAL.ok+'CC':_PAL.dn+'CC';}),
      borderRadius:4,
    }]}, options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false},
               tooltip:{callbacks:{label:function(ctx){return (ctx.raw>=0?'+':'')+fP(ctx.raw,1);}}}},
      scales:{y:{ticks:{callback:function(v){return (v>=0?'+':'')+fP(v);}}},
              x:{grid:{display:false}, ticks:{maxRotation:60, minRotation:45, font:{size:9}}}}}});
  }

  // ─── Chart 3: Faturamento mensal por departamento (empilhado) ───
  // Pega top 6 departamentos do último mês e agrega por todos os meses
  const top6Deptos = dpSorted.slice(0, 6).map(function(d){return d.nome;});
  const yms = mensal.map(function(r){return r.ym;});
  // v4.79: indexar V.deptos da loja uma vez (O(N) build + O(1) lookup)
  const dIdx = new Map();
  (V.deptos || []).forEach(function(x){
    if(x.loja !== loja) return;
    dIdx.set(x.ym + '|' + x.nome, x.fat_liq);
  });
  const datasetsDeptMes = top6Deptos.map(function(deptoNome, idx){
    return {
      label: deptoNome,
      data: yms.map(function(ym){ return dIdx.get(ym + '|' + deptoNome) || 0; }),
      backgroundColor: dC[idx],
    };
  });

  if(datasetsDeptMes.length && yms.length){
    mkC('c-vl-deptmes-'+pageId, {type:'bar',
      data:{labels:yms.map(_ymToLabel), datasets:datasetsDeptMes},
      options:{responsive:true, maintainAspectRatio:false,
        plugins:{legend:{position:'bottom', labels:{padding:8, usePointStyle:true, boxWidth:8, font:{size:10}}},
                 tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+fK(ctx.raw);}}}},
        scales:{x:{stacked:true, grid:{display:false}, ticks:{maxRotation:60, minRotation:45, font:{size:9}}},
                y:{stacked:true, beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}}}}});
  }

  // ─── Tabela: Departamentos ───
  // Mês anterior (se existir)
  let mesAnt = null;
  if(mensal.length >= 2){
    mesAnt = mensal[mensal.length-2].ym;
  }
  // Mesmo mês ano anterior (ex: 2026-04 → 2025-04)
  const mesAnoAnt = (parseInt(ultimoYm.substring(0,4),10)-1)+ultimoYm.substring(4);
  const temAnoAnt = yms.indexOf(mesAnoAnt) >= 0;

  // Otimização: índice Map<loja|ym|cod, linha> para evitar O(n²) nos lookups
  // Constrói uma vez, reutiliza nos dois lookups (mes anterior + ano anterior)
  // Só indexa as linhas que vamos consultar (dois ym específicos), não a base toda
  const _deptosIdx = new Map();
  if(V.deptos && (mesAnt || temAnoAnt)){
    const ymsConsulta = new Set();
    if(mesAnt) ymsConsulta.add(mesAnt);
    if(temAnoAnt) ymsConsulta.add(mesAnoAnt);
    V.deptos.forEach(function(x){
      if(x.loja !== loja || !ymsConsulta.has(x.ym)) return;
      _deptosIdx.set(x.loja+'|'+x.ym+'|'+x.cod, x);
    });
  }

  const tbDept = document.getElementById('tb-vl-tdept-'+pageId);
  if(tbDept){
    if(!deptosUlt.length){
      tbDept.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:18px;">Sem dados para '+labelUltimoMes+'</td></tr>';
    } else {
      tbDept.innerHTML = dpSorted.map(function(d){
        // Lookup O(1) via índice
        const ant = mesAnt ? _deptosIdx.get(loja+'|'+mesAnt+'|'+d.cod) : null;
        const anoAnt = temAnoAnt ? _deptosIdx.get(loja+'|'+mesAnoAnt+'|'+d.cod) : null;

        const difAnt = ant && ant.fat_liq>0 ? (d.fat_liq/ant.fat_liq - 1)*100 : null;
        const difAnoAnt = anoAnt && anoAnt.fat_liq>0 ? (d.fat_liq/anoAnt.fat_liq - 1)*100 : null;
        const margCls = d.marg<5 ? 'val-neg' : d.marg>15 ? 'val-pos' : '';

        return '<tr>'
          + '<td class="L">'+esc(d.nome)+'</td>'
          + '<td class="val-strong">'+fK(d.fat_liq)+'</td>'
          + '<td class="'+(difAnt===null?'val-dim':difAnt>=0?'val-pos':'val-neg')+'">'
          +    (difAnt===null?'—':(difAnt>=0?'+':'')+fP(difAnt))
          + '</td>'
          + '<td class="'+(difAnoAnt===null?'val-dim':difAnoAnt>=0?'val-pos':'val-neg')+'">'
          +    (difAnoAnt===null?'—':(difAnoAnt>=0?'+':'')+fP(difAnoAnt))
          + '</td>'
          + '<td class="'+margCls+'">'+fP(d.marg)+'</td>'
          + '</tr>';
      }).join('');
    }
  }

  // ─── Tabela: Top 20 produtos do último mês ───
  const prodsUlt = (V.produtos_top || []).filter(function(r){
    return r.loja === loja && r.ym === ultimoYm;
  }).sort(function(a,b){return b.fat_liq - a.fat_liq;}).slice(0, 20);

  // Otimização: índice Map<loja|ym|cod, linha> só dos produtos que estão no top 20
  // (evita indexar 6.4k linhas inteiras quando precisamos de 40 lookups)
  const _prodsIdx = new Map();
  if(V.produtos_top && prodsUlt.length && (mesAnt || temAnoAnt)){
    const codsAlvo = new Set(prodsUlt.map(function(p){return p.cod;}));
    const ymsConsulta = new Set();
    if(mesAnt) ymsConsulta.add(mesAnt);
    if(temAnoAnt) ymsConsulta.add(mesAnoAnt);
    V.produtos_top.forEach(function(x){
      if(x.loja !== loja || !ymsConsulta.has(x.ym) || !codsAlvo.has(x.cod)) return;
      _prodsIdx.set(x.loja+'|'+x.ym+'|'+x.cod, x);
    });
  }

  const tbProd = document.getElementById('tb-vl-tprod-'+pageId);
  if(tbProd){
    if(!prodsUlt.length){
      tbProd.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:18px;">Sem dados de produtos para '+labelUltimoMes+'</td></tr>';
    } else {
      tbProd.innerHTML = prodsUlt.map(function(p, i){
        // Lookup O(1) via índice
        const ant = mesAnt ? _prodsIdx.get(loja+'|'+mesAnt+'|'+p.cod) : null;
        const anoAnt = temAnoAnt ? _prodsIdx.get(loja+'|'+mesAnoAnt+'|'+p.cod) : null;

        const difAnt = ant && ant.fat_liq>0 ? (p.fat_liq/ant.fat_liq - 1)*100 : null;
        const difAnoAnt = anoAnt && anoAnt.fat_liq>0 ? (p.fat_liq/anoAnt.fat_liq - 1)*100 : null;
        const margCls = p.marg<5 ? 'val-neg' : p.marg>15 ? 'val-pos' : '';

        return '<tr onclick="if(typeof openProd===\'function\')openProd('+escJs(p.cod)+');">'
          + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
          + '<td class="L">'
          +   '<div style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text-muted);">#'+esc(p.cod)+'</div>'
          +   '<div style="font-weight:600;">'+esc(p.desc||'')+'</div>'
          + '</td>'
          + '<td class="val-strong">'+fK(p.fat_liq)+'</td>'
          + '<td class="'+(difAnt===null?'val-dim':difAnt>=0?'val-pos':'val-neg')+'">'
          +    (difAnt===null?'—':(difAnt>=0?'+':'')+fP(difAnt))
          + '</td>'
          + '<td class="'+(difAnoAnt===null?'val-dim':difAnoAnt>=0?'val-pos':'val-neg')+'">'
          +    (difAnoAnt===null?'—':(difAnoAnt>=0?'+':'')+fP(difAnoAnt))
          + '</td>'
          + '<td class="'+margCls+'">'+fP(p.marg)+'</td>'
          + '</tr>';
      }).join('');
    }
  }
}

// ────────────────────────────────────────────────────────────────────
// V ANO 2026
// ────────────────────────────────────────────────────────────────────
function renderVAno2026(){
  const cont = document.getElementById('page-v-ano2026');
  if(!cont) return;

  const grupo2026 = (V.resumo && V.resumo.grupo && V.resumo.grupo.por_ano && V.resumo.grupo.por_ano['2026']) || {};
  const grupo2025 = (V.resumo && V.resumo.grupo && V.resumo.grupo.por_ano && V.resumo.grupo.por_ano['2025']) || {};

  // Janela jan-abr (período coberto em 2026)
  const m2026 = _vendasMensalPor(null, 'v-ano2026').filter(function(r){return r.ym.startsWith('2026-');});
  const m2025JanAbr = _vendasMensalPor(null, 'v-ano2026').filter(function(r){return r.ym >= '2025-01' && r.ym <= '2025-04';});

  const fat26 = m2026.reduce(function(s,r){return s+r.fat_liq;}, 0);
  const fat25JA = m2025JanAbr.reduce(function(s,r){return s+r.fat_liq;}, 0);
  const luc26 = m2026.reduce(function(s,r){return s+r.lucro;}, 0);
  const luc25JA = m2025JanAbr.reduce(function(s,r){return s+r.lucro;}, 0);
  const marg26 = fat26>0 ? luc26/fat26*100 : 0;
  const marg25JA = fat25JA>0 ? luc25JA/fat25JA*100 : 0;

  const cresceFat = fat25JA>0 ? (fat26/fat25JA - 1)*100 : 0;
  const cresceLuc = luc25JA>0 ? (luc26/luc25JA - 1)*100 : 0;

  let html = '<div class="ph"><div class="pk">Vendas · Foco 2026</div><h2>Análise <em>Ano 2026</em></h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   'Janela: <strong>jan-abr/2026</strong> · comparativo direto com <strong>jan-abr/2025</strong> (período comparável)'
       + '</div>';

  // KPIs em 2 linhas (5 + 3)
  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px;" id="kg-v-ano1"></div>';
  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px;" id="kg-v-ano2"></div>';

  // Charts
  html += '<div class="row2eq" style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Mensal 2026 vs 2025</div>'
       +      '<div class="ccs">Faturamento líquido</div>'
       +      '<div style="height:240px;"><canvas id="c-vano-mensal"></canvas></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">Variação YoY</div>'
       +      '<div class="ccs">% de variação por mês</div>'
       +      '<div style="height:240px;"><canvas id="c-vano-yoy"></canvas></div>'
       +    '</div>'
       + '</div>';

  // Tabela detalhada por mês
  html += '<div class="cc">'
       +    '<div class="cct">Comparativo mensal: 2026 vs 2025</div>'
       +    '<div class="tscroll"><table class="t" id="t-vano">'
       +      '<thead><tr><th class="L">Mês</th>'
       +      '<th>2026</th><th>2025</th><th>Δ R$</th><th>Δ %</th>'
       +      '<th>Margem 26</th><th>Margem 25</th>'
       +      '</tr></thead><tbody id="tb-vano"></tbody></table></div>'
       + '</div>';

  html += '</div>';
  cont.innerHTML = html;

  // ─── KPIs linha 1 ───
  document.getElementById('kg-v-ano1').innerHTML = kgHtml([
    {l:'Fat. Líquido jan-abr/26', v:fK(fat26), s:'4 meses', cls:'hl'},
    {l:'Fat. Líquido jan-abr/25', v:fK(fat25JA), s:'mesmo período'},
    {l:'Crescimento jan-abr', v:(cresceFat>=0?'+':'')+fP(cresceFat), s:'2026 vs 2025', cls:cresceFat>=0?'up':'dn'},
    {l:'Δ Faturamento', v:(fat26-fat25JA>=0?'+':'')+fK(fat26-fat25JA), s:'em valor absoluto', cls:fat26>fat25JA?'up':'dn'},
  ]);

  // ─── KPIs linha 2 ───
  document.getElementById('kg-v-ano2').innerHTML = kgHtml([
    {l:'Lucro 2026', v:fK(luc26), s:'jan-abr'},
    {l:'Margem 2026', v:fP(marg26), s:'consolidado'},
    {l:'Δ Lucro', v:(cresceLuc>=0?'+':'')+fP(cresceLuc), s:'vs 2025', cls:cresceLuc>=0?'up':'dn'},
    {l:'Vendedores ativos', v:fI(grupo2026.vendedores||0), s:'no período'},
  ]);

  // ─── Chart: mensal lado a lado ───
  const meses = ['01','02','03','04'];
  const lbl = meses.map(function(m){return _ymToLabel('2026-'+m);});
  // v4.80: indexar 1× para reuso no chart + YoY + tabela (era 4 find sequenciais)
  const _m26ByYm = new Map(m2026.map(function(r){return [r.ym, r];}));
  const _m25ByYm = new Map(m2025JanAbr.map(function(r){return [r.ym, r];}));
  const d26 = meses.map(function(m){const r=_m26ByYm.get('2026-'+m); return r?r.fat_liq:0;});
  const d25 = meses.map(function(m){const r=_m25ByYm.get('2025-'+m); return r?r.fat_liq:0;});

  mkC('c-vano-mensal', {type:'bar', data:{labels:lbl, datasets:[
    {label:'2026', data:d26, backgroundColor:_PAL.hl+'CC', borderRadius:4},
    {label:'2025', data:d25, backgroundColor:_PAL.ac+'CC', borderRadius:4},
  ]}, options:{responsive:true, maintainAspectRatio:false,
    plugins:{legend:{position:'bottom', labels:{padding:10, usePointStyle:true, boxWidth:8}},
             tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+fB(ctx.raw);}}}},
    scales:{y:{beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}}, x:{grid:{display:false}}}}});

  // Chart YoY
  const yoy = meses.map(function(m, i){
    return d25[i] > 0 ? (d26[i]/d25[i] - 1)*100 : 0;
  });
  mkC('c-vano-yoy', {type:'bar', data:{labels:lbl,
    datasets:[{label:'YoY %', data:yoy,
      backgroundColor: yoy.map(function(v){return v>=0?_PAL.ok+'CC':_PAL.dn+'CC';}),
      borderRadius:4}]},
    options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false}, tooltip:{callbacks:{label:function(ctx){return (ctx.raw>=0?'+':'')+fP(ctx.raw,1);}}}},
      scales:{y:{ticks:{callback:function(v){return (v>=0?'+':'')+fP(v);}}}, x:{grid:{display:false}}}}});

  // ─── Tabela ───
  const linhas = meses.map(function(m, i){
    const r26 = _m26ByYm.get('2026-'+m) || {fat_liq:0, lucro:0};
    const r25 = _m25ByYm.get('2025-'+m) || {fat_liq:0, lucro:0};
    const dif = r26.fat_liq - r25.fat_liq;
    const difPct = r25.fat_liq>0 ? dif/r25.fat_liq*100 : 0;
    const m26 = r26.fat_liq>0 ? r26.lucro/r26.fat_liq*100 : 0;
    const m25 = r25.fat_liq>0 ? r25.lucro/r25.fat_liq*100 : 0;
    const difCls = dif>=0 ? 'val-pos' : 'val-neg';
    return '<tr>'
      + '<td class="L">'+_ymToLabel('2026-'+m)+'</td>'
      + '<td class="val-strong">'+fK(r26.fat_liq)+'</td>'
      + '<td>'+fK(r25.fat_liq)+'</td>'
      + '<td class="'+difCls+'">'+(dif>=0?'+':'')+fK(dif)+'</td>'
      + '<td class="'+difCls+'">'+(difPct>=0?'+':'')+fP(difPct)+'</td>'
      + '<td>'+fP(m26)+'</td>'
      + '<td class="val-dim">'+fP(m25)+'</td>'
      + '</tr>';
  });
  // Linha total
  const totDif = fat26 - fat25JA;
  const totDifPct = fat25JA>0 ? totDif/fat25JA*100 : 0;
  const totDifCls = totDif>=0 ? 'val-pos' : 'val-neg';
  linhas.push('<tr style="background:var(--surface-2);font-weight:700;">'
    + '<td class="L"><strong>jan-abr</strong></td>'
    + '<td class="val-strong">'+fK(fat26)+'</td>'
    + '<td>'+fK(fat25JA)+'</td>'
    + '<td class="'+totDifCls+'">'+(totDif>=0?'+':'')+fK(totDif)+'</td>'
    + '<td class="'+totDifCls+'">'+(totDifPct>=0?'+':'')+fP(totDifPct)+'</td>'
    + '<td>'+fP(marg26)+'</td>'
    + '<td class="val-dim">'+fP(marg25JA)+'</td>'
    + '</tr>');
  document.getElementById('tb-vano').innerHTML = linhas.join('');
}

// Quando vendas.json carregou (V !== null) → renderVendasReal(pg)
//   despacha para a função específica de cada página
//
// Para integrar dados reais quando vendas.json estiver definido:
//   1. Ativar os case do switch abaixo (descomentar e implementar uma a uma)
//   2. Cada função renderXXX(V) recebe a referência global de Vendas
//   3. Pode reutilizar helpers fK/fB/fAbbr/fP/fI/fN/fD do módulo Compras
//   4. Usar mkC('id', cfg) para gráficos (cleanup automático via CH[id])
// ================================================================
function renderVendasReal(pg){
  if(!V){ renderVendasStruct(pg); return; }
  switch(pg){
    case 'v-visao-grupo':    return renderVVisaoGrupo();
    case 'v-evolucao':       return renderVEvolucao();
    case 'v-ano2026':        return renderVAno2026();
    case 'v-drilldown':      return renderVDrilldown();
    case 'v-benchmarking':   return renderVBenchmarking();
    case 'v-itens':          return renderVItens();
    case 'v-vendas-diarias': return renderVDiarias();
    case 'v-dias-cp':        return renderVDiasCP();
    case 'v-metas':          return renderVMetas();
    // [removido em v4.13] cases de loja: v-atp-varejo, v-atp-atacado, v-cestao, v-inh
  }
  // Página ainda sem implementação real → cai no placeholder
  return renderVendasStruct(pg);
}

function renderVendasStruct(pg){
  const cont = document.getElementById('page-' + pg);
  if(!cont) return;
  const cfg = VENDAS_PANELS_STRUCTURE[pg];
  if(!cfg){ // fallback se não tiver config
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas</div><h2>'+esc(pg)+'</h2></div><div class="ph-sep"></div><div class="page-body"><div class="cc">Aguardando configuração estrutural.</div></div>';
    return;
  }

  // Header padrão (Compras style)
  let html = '<div class="ph"><div class="pk">'+esc(cfg.pk)+'</div><h2>'+cfg.h2+'</h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // Banner sutil de "Aguardando carga de dados"
  html += '<div style="background:var(--warning-bg);border:1px solid var(--warning);border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;">'
    + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    + '<div style="font-size:12px;color:var(--warning);font-weight:600;">'
    + 'Estrutura preparada · <span style="font-weight:400;">' + esc(cfg.desc || '') + '</span>'
    + '</div>'
    + '</div>';

  // KPIs (se houver) — filtrar 2024 (sem dados)
  const kpisFiltrados = (cfg.kpis || []).filter(function(k){
    const txt = (k.l || '') + ' ' + (k.s || '');
    return txt.indexOf('2024') === -1;
  });
  if(kpisFiltrados.length){
    const cols = kpisFiltrados.length <= 4 ? kpisFiltrados.length : (kpisFiltrados.length <= 6 ? 3 : 4);
    html += '<div class="kg" style="grid-template-columns:repeat('+cols+',1fr);margin-bottom:14px;">';
    kpisFiltrados.forEach(function(k){
      html += '<div class="kc" style="opacity:.7;">'
        + '<div class="kl">'+esc(k.l)+'</div>'
        + '<div class="kv" style="color:var(--text-muted);font-style:italic;font-size:18px;">'+esc(k.v)+'</div>'
        + (k.s ? '<div style="font-size:10px;color:var(--text-muted);margin-top:3px;">'+esc(k.s)+'</div>' : '')
        + '</div>';
    });
    html += '</div>';
  }

  // Linhas de gráficos — filtrar charts que mencionam 2024
  const rowsFiltradas = (cfg.rows || []).map(function(row){
    return row.filter(function(c){
      const txt = (c.t || '') + ' ' + (c.s || '');
      return txt.indexOf('2024') === -1;
    });
  }).filter(function(row){ return row.length > 0; });
  cfg.rows = rowsFiltradas;
  // Tabelas — filtrar
  cfg.tables = (cfg.tables || []).filter(function(tab){
    const txt = (tab.t || '') + ' ' + (tab.cols || []).join(' ');
    return txt.indexOf('2024') === -1;
  });

  // Linhas de gráficos
  if(cfg.rows && cfg.rows.length){
    cfg.rows.forEach(function(row){
      const cls = row.length === 1 ? 'cc' : 'row2eq';
      if(row.length === 1){
        html += '<div class="cc" style="margin-bottom:12px;">';
        html += renderChartPlaceholder(row[0]);
        html += '</div>';
      } else {
        html += '<div class="row2eq" style="margin-bottom:12px;">';
        row.forEach(function(c){
          html += '<div class="cc">' + renderChartPlaceholder(c) + '</div>';
        });
        html += '</div>';
      }
    });
  }

  // Tabelas
  if(cfg.tables && cfg.tables.length){
    cfg.tables.forEach(function(tab){
      html += '<div class="cc" style="margin-bottom:12px;">';
      html += '<div class="cct">'+esc(tab.t)+'</div>';
      html += '<div class="ccs" style="color:var(--text-muted);font-style:italic;">Tabela aguardando dados de Vendas</div>';
      html += '<div class="tscroll"><table class="t"><thead><tr>';
      tab.cols.forEach(function(c, idx){
        const align = idx === 0 ? 'L' : '';
        html += '<th class="'+align+'">'+esc(c)+'</th>';
      });
      html += '</tr></thead><tbody>';
      // Linhas de placeholder
      for(let i=0; i<3; i++){
        html += '<tr>';
        tab.cols.forEach(function(c, idx){
          const align = idx === 0 ? 'L' : '';
          html += '<td class="'+align+'" style="color:var(--surface-3);">———</td>';
        });
        html += '</tr>';
      }
      html += '</tbody></table></div>';
      html += '</div>';
    });
  }

  // Nota customizada (se houver)
  if(cfg.customNote){
    html += '<div class="cc" style="background:var(--accent-bg);border:1px solid var(--accent-glow);">'
      + '<div style="display:flex;gap:10px;align-items:start;">'
      + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
      + '<div style="font-size:12px;color:var(--text-dim);line-height:1.5;">'+esc(cfg.customNote)+'</div>'
      + '</div></div>';
  }

  html += '</div>'; // page-body
  cont.innerHTML = html;
}

// Helper: renderiza placeholder de um gráfico
function renderChartPlaceholder(c){
  return '<div class="cct">'+esc(c.t)+'</div>'
    + (c.s ? '<div class="ccs">'+esc(c.s)+'</div>' : '')
    + '<div style="height:200px;background:var(--surface-2);border:1px dashed var(--border);border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;">'
    + '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="opacity:.5;"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>'
    + '<div style="font-size:10px;color:var(--text-muted);font-family:JetBrains Mono,monospace;letter-spacing:.1em;">AGUARDANDO DADOS</div>'
    + '</div>';
}

// Injetar filtros nas páginas (chamado uma vez na init)
function injectFilterBars(){
  ['executivo','cv','estoque','financeiro','fornecedores','alertas'].forEach(pg=>{
    const page=document.getElementById('page-'+pg);
    if(!page)return;
    const body=page.querySelector('.page-body');
    if(!body)return;
    const fb=buildFilterBar(pg);
    body.insertBefore(fb,body.firstChild);
  });
}

// ================================================================
// KG HELPER
// ================================================================
function kgHtml(items){
  return items.map(k=>`<div class="kc ${k.cls||''}">
    <div class="kl">${k.l}</div>
    <div class="kv">${k.v}</div>
    <div class="ks">${k.s||''}</div>
    ${k.bar||''}
  </div>`).join('');
}

function sparkSvg(vals){
  const w=64,h=22,p=2;
  const max=Math.max(...vals)||1;
  const pts=vals.map((v,i)=>{
    const x=p+(i/Math.max(vals.length-1,1))*(w-p*2);
    const y=h-p-(v/max)*(h-p*2);
    return[x.toFixed(1),y.toFixed(1)];
  });
  const path=pts.map((pt,i)=>(i===0?'M':'L')+pt.join(',')).join(' ');
  const fill=path+` L${pts[pts.length-1][0]},${h-p} L${pts[0][0]},${h-p} Z`;
  const last=pts[pts.length-1];
  return `<svg viewBox="0 0 ${w} ${h}" style="width:60px;height:20px;vertical-align:middle;">
    <path d="${fill}" fill="rgba(46,71,111,.15)"/>
    <path d="${path}" fill="none" stroke="#2E476F" stroke-width="1.5"/>
    <circle cx="${last[0]}" cy="${last[1]}" r="2" fill="#F58634"/>
  </svg>`;
}



// ================================================================
// ORDENAÇÃO DE TABELAS — makeSortable(idOuEl)
// ================================================================
function makeSortable(idOrEl){
  const el = typeof idOrEl==='string'?document.getElementById(idOrEl):idOrEl;
  if(!el) return;
  const tbl = el.tagName==='TABLE'?el:el.closest('table');
  if(!tbl||tbl.dataset.sortable) return;
  tbl.dataset.sortable='1';
  const tbody=tbl.querySelector('tbody');
  if(!tbody) return;

  let activeIdx=-1, activeDir=1;

  // Parser numérico que entende formato pt-BR + percentuais + unidades
  function parseNum(text){
    text=text.trim();
    if(!text||text==='—'||text==='-') return null;
    if(text.includes('∞')) return Infinity;
    const hasCur=text.includes('R$')||text.includes('R\xa0$');
    const hasPct=text.includes('%');
    // Percentuais usam toFixed() → ponto como decimal
    if(hasPct){
      const n=parseFloat(text.replace(/[^0-9.%-]/g,'').replace('−','-'));
      return isNaN(n)?null:n;
    }
    // Moeda pt-BR: ponto = milhar, vírgula = decimal
    if(hasCur){
      let s=text.replace(/R\$\s*/g,'').replace(/[^\d.,-]/g,'').trim();
      const neg=s.startsWith('-')||text.includes('−');
      s=s.replace(/-/g,'').replace(/\./g,'').replace(',','.');
      const n=parseFloat(s);
      return isNaN(n)?null:(neg?-n:n);
    }
    // Números pt-BR genéricos: ponto = milhar
    let s=text.replace(/[^\d.,−-]/g,'').trim();
    const neg=s.startsWith('-')||text.includes('−');
    s=s.replace(/-/g,'').replace('−','').replace(/\./g,'').replace(',','.');
    const n=parseFloat(s);
    return isNaN(n)?null:(neg?-n:n);
  }

  tbl.querySelectorAll('thead th').forEach(function(th,idx){
    if(!th.textContent.trim()) return;
    th.style.cursor='pointer';
    th.style.userSelect='none';
    const ico=document.createElement('span');
    ico.className='srt-ico';
    ico.textContent=' ⇅';
    th.appendChild(ico);

    th.addEventListener('click',function(e){
      e.stopPropagation();
      const dir=(activeIdx===idx&&activeDir===1)?-1:1;
      activeIdx=idx; activeDir=dir;

      // Atualizar ícones
      tbl.querySelectorAll('.srt-ico').forEach(function(i){
        i.textContent=' ⇅'; i.style.color=''; i.style.opacity='.45';
      });
      ico.textContent=dir===1?' ↑':' ↓';
      ico.style.color='var(--highlight)';
      ico.style.opacity='1';

      // Separar linha de totalizador das linhas de dados
      const rows=[...tbody.querySelectorAll('tr')];
      const isTot=function(r){
        return r.style.background||r.querySelector('[style*="font-weight:900"]');
      };
      const totRow=rows.find(isTot);
      const dataRows=rows.filter(function(r){return r!==totRow;});

      dataRows.sort(function(a,b){
        const ac=a.cells[idx], bc=b.cells[idx];
        if(!ac||!bc) return 0;
        // data-val tem prioridade
        if(ac.dataset.val!==undefined&&bc.dataset.val!==undefined)
          return dir*(+ac.dataset.val-+bc.dataset.val);
        const an=parseNum(ac.textContent), bn=parseNum(bc.textContent);
        if(an!==null&&bn!==null){
          if(an===Infinity&&bn===Infinity) return 0;
          if(an===Infinity) return dir;
          if(bn===Infinity) return -dir;
          return dir*(an-bn);
        }
        return dir*ac.textContent.trim().localeCompare(bc.textContent.trim(),'pt-BR');
      });

      dataRows.forEach(function(r){tbody.appendChild(r);});
      if(totRow) tbody.appendChild(totRow);
    });
  });
}

// ================================================================
// FILTRO REATIVO — label e totais por período + departamento
// ================================================================
// v4.75: substitui mapas hardcoded por funções dinâmicas
function _mfLabel(ym){
  if(!ym) return '';
  const m = parseInt(ym.substring(5,7),10);
  return ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'][m-1] || ym;
}
function _msLabel(ym){
  if(!ym) return '';
  const m = parseInt(ym.substring(5,7),10);
  return (typeof _MES_LBL_PT !== 'undefined' && _MES_LBL_PT[m-1]) || ym.substring(5,7);
}
// Proxies pra compatibilidade com código legado que iterar MF/MS por chave.
// Sempre retornam o label dinâmico — funcionam pra qualquer ym.
const MF = new Proxy({}, {get:function(_, key){return _mfLabel(key);}});
const MS = new Proxy({}, {get:function(_, key){return _msLabel(key);}});


// ================================================================
// HELPER: label de cobertura com ressalva quando base=abril
// ================================================================
function cobLabel(p){
  // p.ebc: 0=sem dados, 1=padrão 90d, 2=fallback abr/26 parcial
  const dc = p.edc||0, bc = p.ebc||0;
  if(dc<=0||p.eq<=0) return '—';
  const dcStr = dc>=999?'∞ dias':dc.toFixed(0)+' dias';
  if(bc===2) return '<span class="tag ori" style="font-size:9px;vertical-align:middle;" title="Sem venda em jan–mar. Giro calculado com abril/26 parcial (20 dias)">⚠ abr/26</span> '+dcStr;
  return dcStr;
}
function cobLabelPlain(p){
  const dc=p.edc||0;
  if(dc<=0||p.eq<=0) return '—';
  return dc>=999?'∞ dias':dc.toFixed(0)+' dias';
}
function cobSubLabel(p){
  const bc=p.ebc||0, vd=p.evd||0;
  if(p.eq<=0) return '—';
  const vdStr = vd>0?fN(vd,1)+' un/dia':'—';
  if(bc===2) return vdStr+' · base: abr/26 (20 dias)';
  if(bc===1) return vdStr+' · base: jan–mar (90 dias)';
  return 'Sem venda registrada';
}

function getFilterLabel(){
  const ps=[...activePers].sort();
  if(!ps.length) return 'Nenhum período';
  let per;
  if(ps.length===1) per=MF[ps[0]]+'/2026';
  else if(ps.length===PERS.length) per='Jan–Abr/2026';
  else per=MS[ps[0]]+'–'+MS[ps[ps.length-1]]+'/2026';
  return activeDept?activeDept+' · '+per:per;
}

function getFilteredTotals(){
  const perIdxs=[...activePers].map(p=>PERS.indexOf(p)).filter(i=>i>=0);
  const prods=activeDept?D.produtos.filter(p=>p.dp===activeDept):D.produtos;
  let tv=0,tl=0,tc_liq=0,n_skus=0;
  prods.forEach(function(p){
    perIdxs.forEach(function(i){
      tv+=p.sv[i]?p.sv[i][0]:0;
      tl+=p.sv[i]?p.sv[i][1]:0;
    });
    perIdxs.forEach(function(i){
      tc_liq+=p.sc2?p.sc2[i]||0:0;
    });
    // distribuir devolução forn proporcionalmente
    tc_liq-=(p.vdf||0)*(perIdxs.length/PERS.length);
    // contar skus com venda no período filtrado
    if(perIdxs.some(function(i){return p.sv[i]&&p.sv[i][0]>0;})) n_skus++;
  });
  tc_liq=Math.max(0,tc_liq);
  const pp=D.meta.pct_pago, pa=D.meta.pct_aberto;
  if(activeDept){
    const dept=D.departamentos.find(function(d){return d.n===activeDept;});
    if(dept){pp=dept.pp||pp; pa=dept.pa||pa;}
  }
  const tp=tc_liq*pp/100, ta=tc_liq*pa/100;
  const te_pv=D.meta.te_pv||D.meta.total_est;
  if(activeDept){
    const dept2=D.departamentos.find(function(d){return d.n===activeDept;});
    if(dept2) te_pv=(dept2.ev||0)*1.38;
  }
  return {tv:tv,tl:tl,tc_liq:tc_liq,tp:tp,ta:ta,n_skus:n_skus,te_pv:te_pv,pp:pp,pa:pa};
}


// ================================================================
// VISÃO CONSOLIDADA — quando todas as filiais estão somadas
// ================================================================
function renderConsolidadoView(){
  if(!D || !D.filiais_resumo){
    document.getElementById('page-executivo').innerHTML = '<div class="ph"><h2>Erro</h2></div><div class="page-body">Dados consolidados inv\u00e1lidos.</div>';
    return;
  }

  const filiais = D.filiais_resumo;
  const m = D.meta;
  const venc = D.titulos_vencidos_valor || 0;
  const vencN = D.titulos_vencidos_count || 0;

  document.getElementById('page-executivo').innerHTML = '<div class="ph"><div class="pk">Vis\u00e3o consolidada</div><h2>GPC <em>todas as filiais</em></h2></div>'
    +'<div class="ph-sep"></div>'
    +'<div class="page-body">'
    +'<div style="background:var(--accent-bg);border:1px solid var(--accent);border-radius:8px;padding:10px 14px;margin-top:10px;margin-bottom:14px;font-size:12px;color:var(--accent-text);display:flex;align-items:start;gap:10px;">'
    +'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-top:2px;flex-shrink:0;"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>'
    +'<div><strong>'+filiais.length+' filia'+(filiais.length===1?'l':'is')+' consolidada'+(filiais.length===1?'':'s')+'.</strong> Para acessar an\u00e1lises detalhadas (produtos, fornecedores, vencidos por t\u00edtulo, excesso, diagn\u00f3sticos), troque para uma filial espec\u00edfica no seletor acima.</div>'
    +'</div>'
    +'<div class="kg c4" id="kg-cons"></div>'
    +'<div class="cc" style="margin-top:14px;">'
    +'<div class="cct">Filiais do grupo</div>'
    +'<div class="ccs">Clique em uma filial para abrir a an\u00e1lise detalhada</div>'
    +'<div id="cons-filiais" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:14px;"></div>'
    +'</div>'
    +'<div class="ds" style="margin-top:14px;">'
    +'<div class="ds-hdr">'
    +'<div class="ds-ico" style="background:var(--accent-bg);color:var(--accent-text);">'
    +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>'
    +'</div><div>'
    +'<div class="ds-title">Departamentos consolidados</div>'
    +'<div class="ds-sub">Soma de todas as filiais</div>'
    +'</div></div>'
    +'<div class="ds-body np"><div class="tscroll"><table class="t" id="tbl-cons-dp">'
    +'<thead><tr><th class="L">Departamento</th><th>Faturamento</th><th>Margem</th><th>Lucro</th><th>Compras l\u00edq.</th><th>% Pago</th><th>SKUs</th></tr></thead>'
    +'<tbody></tbody></table></div></div></div>'
    +'</div>';

  // KPIs
  document.getElementById('kg-cons').innerHTML = kgHtml([
    {l:'Faturamento GPC',  v:fK(m.total_vendido), s:filiais.length+' filia'+(filiais.length===1?'l':'is')},
    {l:'Lucro bruto',      v:fK(m.total_lucro),   s:'Margem '+fP(m.margem_media), cls:m.margem_media>12?'up':''},
    {l:'Compras l\u00edq.',v:fK(m.total_comprado),s:fP(m.cob)+' do faturamento'},
    {l:'Vencidos',         v:fK(venc),            s:vencN+' t\u00edtulos vencidos', cls:'dn'},
    {l:'Em aberto',        v:fK(m.total_aberto),  s:fP(m.pct_aberto)+' a pagar', cls:'hl'},
    {l:'Estoque atual',    v:fK(m.te_pv),         s:'Valor p/ venda'},
    {l:'SKUs',             v:fI(m.qt_skus),       s:'cadastrados'},
    {l:'Custo de atraso',  v:fK(m.total_jr),      s:'Juros pagos no per\u00edodo', cls:'dn'},
  ]);

  // Cards de filiais
  document.getElementById('cons-filiais').innerHTML = filiais.map(function(f){
    return '<a href="?filial='+encodeURIComponent(f.sigla)+'" style="display:block;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:14px 16px;text-decoration:none;color:inherit;transition:all .15s;cursor:pointer;" onmouseover="this.style.borderColor=\'var(--accent)\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.transform=\'\'">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">'
      +'<div><div style="font-weight:800;font-size:15px;">'+esc(f.nome)+'</div>'
      +'<div style="font-size:10px;color:var(--text-muted);font-family:JetBrains Mono,monospace;text-transform:uppercase;letter-spacing:.1em;">'+f.sigla+'</div></div>'
      +'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>'
      +'</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;">'
      +'<div><div style="color:var(--text-muted);font-size:9px;text-transform:uppercase;letter-spacing:.05em;">Faturamento</div><div style="font-weight:700;font-size:13px;">'+fK(f.vdo)+'</div></div>'
      +'<div><div style="color:var(--text-muted);font-size:9px;text-transform:uppercase;letter-spacing:.05em;">Margem</div><div style="font-weight:700;font-size:13px;">'+fP(f.marg)+'</div></div>'
      +'<div><div style="color:var(--text-muted);font-size:9px;text-transform:uppercase;letter-spacing:.05em;">Em aberto</div><div style="font-weight:700;font-size:13px;color:var(--warning);">'+fK(f.abr)+'</div></div>'
      +'<div><div style="color:var(--text-muted);font-size:9px;text-transform:uppercase;letter-spacing:.05em;">Juros</div><div style="font-weight:700;font-size:13px;color:'+(f.jr>10000?'var(--danger-text)':'var(--text)')+';">'+fK(f.jr)+'</div></div>'
      +'</div></a>';
  }).join('');

  // Tabela departamentos consolidados
  const tbody = document.querySelector('#tbl-cons-dp tbody');
  tbody.innerHTML = (D.departamentos||[]).slice(0,15).map(function(d){
    return '<tr>'
      +'<td class="L" style="font-weight:600;">'+d.n+'</td>'
      +'<td>'+fB(d.vdo,0)+'</td>'
      +'<td class="'+mc(d.marg)+'">'+fP(d.marg)+'</td>'
      +'<td class="'+(d.tl<0?'val-neg':'val-pos')+'">'+fB(d.tl||d.luc,0)+'</td>'
      +'<td>'+fB(d.com-d.dvf,0)+'</td>'
      +'<td class="val-pos">'+fP(d.pp)+'</td>'
      +'<td class="val-dim">'+fI(d.ni)+'</td>'
      +'</tr>';
  }).join('');
  makeSortable('tbl-cons-dp');
}

// ================================================================
// EXECUTIVO
// ================================================================
// ================================================================
// EXECUTIVO · versão NOVA (consumindo JSONs modulares V, C, E, F)
// Sub-etapa 4b · 30/abr/2026
// ================================================================

// v4.69: Quadro de metas do mês atual no Sumário Executivo.
// Renderiza no container #exec-metas-wrap criado em index.html.
// Mostra apenas lojas que têm meta lançada no mês corrente. Atualiza
// async após o load das metas do Firestore/seed.
function _execRenderQuadroMetas(){
  const wrap = document.getElementById('exec-metas-wrap');
  if(!wrap) return;
  // YM atual: usar data corrente. Como nem todo mês corrente tem dados de
  // venda carregados, mostramos mesmo assim — realizado fica 0.
  function _ymHoje(){
    const d = new Date();
    const yy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    return yy+'-'+mm;
  }
  function _render(){
    const ymAtual = _ymHoje();
    const lojasAll = (_metasDados && _metasDados.lojas) ? Object.keys(_metasDados.lojas) : [];
    const linhas = lojasAll
      .map(function(lj){
        const meta = (typeof _metasGetMeta === 'function') ? _metasGetMeta(lj, ymAtual) : 0;
        const real = (typeof _metasGetRealizado === 'function') ? _metasGetRealizado(lj, ymAtual) : 0;
        return {loja:lj, meta:meta, real:real};
      })
      .filter(function(r){return r.meta > 0;})
      .sort(function(a,b){return b.meta - a.meta;});

    if(!linhas.length){
      wrap.innerHTML = '<div class="cc"><div class="cct">Metas do mês atual</div>'
        + '<div class="ccs" style="color:var(--text-muted);">Nenhuma loja tem meta lançada para '+_ymToLabel(ymAtual)+'. Acesse <em>Vendas › Metas</em> para cadastrar.</div></div>';
      return;
    }

    const totMeta = linhas.reduce(function(s,r){return s+r.meta;}, 0);
    const totReal = linhas.reduce(function(s,r){return s+r.real;}, 0);
    const totPct  = totMeta > 0 ? totReal/totMeta*100 : 0;

    let html = '<div class="cc">'
      + '<div class="cct">Metas · '+_ymToLabel(ymAtual)+'</div>'
      + '<div class="ccs">Lojas com meta lançada para o mês atual · realizado segue a base ativa</div>'
      + '<div class="tscroll" style="margin-top:8px;"><table class="t">'
      +   '<thead><tr><th class="L">Loja</th><th>Meta</th><th>Realizado</th><th>% da meta</th></tr></thead>'
      +   '<tbody>';
    linhas.forEach(function(r){
      const pct = r.meta>0 ? r.real/r.meta*100 : 0;
      const cls = pct>=100 ? 'val-pos' : pct>=95 ? '' : 'val-neg';
      html += '<tr>'
           +   '<td class="L"><strong>'+esc(r.loja)+'</strong></td>'
           +   '<td>'+fK(r.meta)+'</td>'
           +   '<td class="val-strong">'+fK(r.real)+'</td>'
           +   '<td class="'+cls+'">'+fP(pct,1)+'</td>'
           + '</tr>';
    });
    const clsTot = totPct>=100 ? 'val-pos' : totPct>=95 ? '' : 'val-neg';
    html += '<tr style="background:var(--surface-2);font-weight:700;border-top:2px solid var(--border-strong);">'
         +   '<td class="L">Total</td>'
         +   '<td>'+fK(totMeta)+'</td>'
         +   '<td class="val-strong">'+fK(totReal)+'</td>'
         +   '<td class="'+clsTot+'">'+fP(totPct,1)+'</td>'
         + '</tr>';
    html += '</tbody></table></div></div>';
    wrap.innerHTML = html;
  }

  // Render síncrono inicial (com o que estiver carregado) + refresh após load
  _render();
  if(typeof _metasCarregarFirestore === 'function'){
    _metasCarregarFirestore().then(_render).catch(function(){});
  }
}

function renderExecutivo(){
  // Se estamos no consolidado legado, redirecionar para visao especial
  if(typeof isConsolidado === 'function' && isConsolidado()){
    if(typeof renderConsolidadoView === 'function') renderConsolidadoView();
    return;
  }

  // v4.76 fix21: o kicker (Dashboard · …) é mantido como base "Dashboard";
  // o handler global _cofreSyncFilialNoTitulo() em core.js anexa a filial atual
  // em todas as páginas que tenham .ph .pk. Aqui só garantimos o base correto.
  const _phExecPk = document.getElementById('ph-exec-pk');
  if(_phExecPk){
    _phExecPk.setAttribute('data-pk-base', 'Dashboard');
    if(typeof _cofreSyncFilialNoTitulo === 'function') _cofreSyncFilialNoTitulo();
  }

  // Fallback: se nenhum JSON novo carregou ainda, mostra placeholder
  if(!V && !C && !F && !E){
    const cont = document.getElementById('page-executivo');
    if(cont){
      // Limpa as áreas dinâmicas sem destruir a estrutura
      const kg = document.getElementById('kg-exec');
      if(kg) kg.innerHTML = '<div style="grid-column:1/-1;padding:24px;text-align:center;color:var(--text-muted);font-size:13px;">Aguardando carga dos dados…</div>';
    }
    return;
  }

  // Conjunto de meses ativos no filtro (activePers em core.js). Quando o
  // usuário desliga meses na filter-bar, aqui descartamos as linhas do mês
  // pra que cards/charts reflitam o filtro. Se activePers não existir
  // (modo legado), aceita tudo.
  const _filtraYm = (typeof activePers !== 'undefined' && activePers && activePers.has)
    ? function(ym){return activePers.has(ym);}
    : function(){return true;};

  // ─── helpers internos ─────────────────────────────────────────────
  // Mensal de vendas: V.mensal é [{loja, ym, fat_liq, lucro, marg, qt, nfs}, ...]
  // Agregamos por ym (somando ATP-V + ATP-A), descontando supervisores ignorados
  // configurados pra página 'executivo' em Administração.
  function _vendasMensalGrupo(){
    if(!V || !V.mensal) return [];
    const m = new Map();
    V.mensal.forEach(function(rRaw){
      const r = aplicaFiltroSupVMensalRow(rRaw, 'executivo');
      if(!_filtraYm(r.ym)) return;
      if(!m.has(r.ym)) m.set(r.ym, {ym:r.ym, fat_liq:0, lucro:0, qt:0, nfs:0});
      const x = m.get(r.ym);
      x.fat_liq += r.fat_liq||0;
      x.lucro   += r.lucro||0;
      x.qt      += r.qt||0;
      x.nfs     += r.nfs||0;
    });
    return Array.from(m.values()).sort(function(a,b){return a.ym<b.ym?-1:1;});
  }

  // Compras mensal: C.mensal é [{loja, ym, valor, qtd, nfs, ...}, ...]
  function _comprasMensalGrupo(){
    if(!C || !C.mensal) return [];
    const m = new Map();
    C.mensal.forEach(function(r){
      if(!_filtraYm(r.ym)) return;
      if(!m.has(r.ym)) m.set(r.ym, {ym:r.ym, valor:0, nfs:0});
      const x = m.get(r.ym);
      x.valor += r.valor||0;
      x.nfs   += r.nfs||0;
    });
    return Array.from(m.values()).sort(function(a,b){return a.ym<b.ym?-1:1;});
  }

  // Pagamentos mensais: F.pago.mensal é [{ym, valor, titulos, ...}]
  function _pagosMensal(){
    if(!F || !F.pago || !F.pago.mensal) return [];
    return F.pago.mensal.filter(function(r){return _filtraYm(r.ym);})
      .slice().sort(function(a,b){return a.ym<b.ym?-1:1;});
  }

  // Mês mais recente (do conjunto de vendas)
  const mensalV = _vendasMensalGrupo();
  const mensalC = _comprasMensalGrupo();
  const mensalP = _pagosMensal();

  // Periodo de exibição: usa interseção dos meses disponíveis em V e C.
  // Como V tem 16 meses e C tem só 4 (jan-abr/26), focamos no período do C.
  const ymsC = new Set(mensalC.map(function(x){return x.ym;}));
  const mensalVno = mensalV.filter(function(x){return ymsC.has(x.ym);});
  const ymsExibicao = (mensalVno.length ? mensalVno : mensalV).map(function(x){return x.ym;});

  // ─── KPIs ─────────────────────────────────────────────────────────
  const totalFat = mensalVno.reduce(function(s,x){return s+x.fat_liq;}, 0);
  const totalLucro = mensalVno.reduce(function(s,x){return s+x.lucro;}, 0);
  const margem = totalFat>0 ? totalLucro/totalFat*100 : 0;

  const totalCompras = mensalC.reduce(function(s,x){return s+x.valor;}, 0);
  const cobPct = totalFat>0 ? totalCompras/totalFat*100 : 0;
  const cobCls = cobPct>100 ? 'dn' : cobPct>80 ? '' : 'up';

  // Vencidos e em aberto (do financeiro)
  let totalAberto = 0, vencido90Plus = 0, nVencidos = 0, valorVencidos = 0;
  if(F && F.aberto){
    if(F.aberto.aging){
      // Soma vencidos (todas as faixas exceto A_VENCER e HOJE)
      ['VENCIDO_1_7','VENCIDO_8_30','VENCIDO_31_90','VENCIDO_90_PLUS'].forEach(function(k){
        const f = F.aberto.aging[k];
        if(f){
          valorVencidos += f.valor || 0;
          nVencidos     += f.titulos || 0;
        }
      });
    }
    // Total em aberto: soma de todas as faixas
    if(F.aberto.aging){
      Object.values(F.aberto.aging).forEach(function(f){
        totalAberto += f.valor || 0;
      });
    } else if(F.resumo && F.resumo.aberto && F.resumo.aberto.ATP){
      totalAberto = F.resumo.aberto.ATP.total_pagar || 0;
    }
  }

  // Estoque
  let estoqueValorPV = 0, estoqueSKUs = 0, dataEstoque = '—';
  if(E){
    estoqueSKUs = (E.produtos || []).length;
    if(E.resumo){
      // schema real: vl_preco (valor a preço de venda), vl_custo (a custo)
      estoqueValorPV = E.resumo.vl_preco || 0;
    }
    if(E.meta){
      dataEstoque = E.meta.data_estoque || E.meta.data_referencia || (E.resumo && E.resumo.data_ref) || '—';
    } else if(E.resumo && E.resumo.data_ref){
      dataEstoque = E.resumo.data_ref;
    }
  }

  // SKUs com venda
  const skusComVenda = V && V.vendas_por_sku ? V.vendas_por_sku.length : 0;
  const skusComEstoque = estoqueSKUs;

  // NFs e fornecedores de COMPRAS
  let totalNfs = 0, totalForns = 0;
  if(C && C.resumo && C.resumo.grupo && C.resumo.grupo.total){
    totalNfs   = C.resumo.grupo.total.nfs || 0;
    totalForns = C.resumo.grupo.total.fornecedores || 0;
  }

  const labelPeriodo = ymsExibicao.length
    ? (_ymToLabel(ymsExibicao[0]) + ' a ' + _ymToLabel(ymsExibicao[ymsExibicao.length-1]))
    : 'período completo';

  document.getElementById('kg-exec').innerHTML = kgHtml([
    {l:'Faturamento líquido', v:fK(totalFat),     s:labelPeriodo},
    {l:'Lucro bruto',         v:fK(totalLucro),   s:'Margem '+fP(margem)+' · '+labelPeriodo, cls:margem>12?'up':''},
    {l:'Compras líquidas',    v:fK(totalCompras), s:fP(cobPct)+' do fat. · '+labelPeriodo,    cls:cobCls},
    {l:'Vencidos',            v:fK(valorVencidos),s:fI(nVencidos)+' títulos · 1 dia ou mais',        cls:'dn'},
    {l:'Em aberto',           v:fK(totalAberto),  s:'Total a pagar', cls:'hl'},
    {l:'Estoque (preço venda)',v:estoqueValorPV>0?fK(estoqueValorPV):'—',s:estoqueValorPV>0?'Retrato '+fDt(dataEstoque):'sem dados', cls:'vio'},
    {l:'SKUs com venda',      v:fI(skusComVenda), s:fI(skusComEstoque)+' c/ estoque atual'},
    {l:'NFs de entrada',      v:fI(totalNfs),     s:fI(totalForns)+' fornecedores'},
  ]);

  // Quadro Metas do mês atual (lojas com meta lançada para o YM corrente)
  _execRenderQuadroMetas();


  // ─── Charts ───────────────────────────────────────────────────────
  const lbl = ymsExibicao.map(_ymToLabel);

  // Chart 1: Compras × Vendas × Pago (mensal)
  // v4.80: indexar 1× (era 3× O(N²) com find por ym)
  const _cByYm = new Map(mensalC.map(function(r){return [r.ym, r];}));
  const _vByYm = new Map(mensalVno.map(function(r){return [r.ym, r];}));
  const _pByYm = new Map(mensalP.map(function(r){return [r.ym, r];}));
  const dCompras = ymsExibicao.map(function(ym){const r=_cByYm.get(ym); return r?r.valor:0;});
  const dVendas  = ymsExibicao.map(function(ym){const r=_vByYm.get(ym); return r?r.fat_liq:0;});
  const dPagos   = ymsExibicao.map(function(ym){const r=_pByYm.get(ym); return r?r.valor:0;});

  mkC('c-exec-evo', {data:{labels:lbl, datasets:[
    {type:'bar', label:'Compras líq.', data:dCompras, backgroundColor:_PAL.ac+'CC', borderRadius:5},
    {type:'bar', label:'Vendas líq.',  data:dVendas,  backgroundColor:_PAL.hl+'CC', borderRadius:5},
    {type:'line',label:'Pago',         data:dPagos,   borderColor:_PAL.ok, backgroundColor:'rgba(16,152,84,.1)', tension:.4, pointRadius:4, pointBackgroundColor:_PAL.ok},
  ]}, options:{responsive:true, maintainAspectRatio:false,
    plugins:{legend:{position:'bottom', labels:{padding:10, usePointStyle:true, boxWidth:8}},
             tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+fB(ctx.raw);}}}},
    scales:{y:{beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}}, x:{grid:{display:false}}}}});

  // Chart 3: Participação por departamento (vendas)
  // Agregar vendas.deptos por nome de depto
  const deptAgg = new Map();
  if(V && V.deptos){
    V.deptos.forEach(function(r){
      if(!deptAgg.has(r.nome)) deptAgg.set(r.nome, {nome:r.nome, fat_liq:0});
      deptAgg.get(r.nome).fat_liq += r.fat_liq||0;
    });
  }
  const dpArr = Array.from(deptAgg.values()).sort(function(a,b){return b.fat_liq - a.fat_liq;}).slice(0, 7);
  const totalDp = dpArr.reduce(function(s,x){return s+x.fat_liq;}, 0);
  const dC = ['#2E476F','#F58634','#109854','#7c3aed','#DC7529','#1E3558','#0891B2'];

  mkC('c-exec-dept', {type:'doughnut', data:{labels:dpArr.map(function(d){return d.nome;}),
    datasets:[{data:dpArr.map(function(d){return d.fat_liq;}), backgroundColor:dC, borderWidth:2, borderColor:'#fff'}]},
    options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'right', labels:{padding:7, usePointStyle:true, boxWidth:8, font:{size:10}}},
               tooltip:{callbacks:{label:function(ctx){return ctx.label+': '+fK(ctx.raw)+' ('+fP(totalDp>0?ctx.raw/totalDp*100:0)+')';}}}}}});

  // Chart 4: Agenda de vencimentos (a vencer + vencidos por mês)
  // Usa F.aberto.por_mes_venc se existir, senão constrói do aging
  let agendaArr = [];
  if(F && F.aberto && F.aberto.por_mes_venc){
    agendaArr = F.aberto.por_mes_venc.slice().sort(function(a,b){return a.ym<b.ym?-1:1;});
  } else if(F && F.aberto && F.aberto.aging){
    // Fallback: usa só as faixas como pseudo-mês
    Object.entries(F.aberto.aging).forEach(function(kv){
      agendaArr.push({ym:kv[0], valor:kv[1].valor||0, titulos:kv[1].titulos||0});
    });
  }

  if(agendaArr.length){
    // v4.75: cores agora relativas à data de hoje (não hardcoded 2026-05/06)
    const _hojeYm = (function(){
      const d = new Date();
      return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
    })();
    function _proxYm(ym, n){
      const a = parseInt(ym.substring(0,4),10);
      let m = parseInt(ym.substring(5,7),10) + n;
      let y = a;
      while(m > 12){ m -= 12; y += 1; }
      while(m < 1){ m += 12; y -= 1; }
      return y+'-'+String(m).padStart(2,'0');
    }
    const _ymProxMes = _proxYm(_hojeYm, 1);
    // v4.76 fix33: lazy — chart fica abaixo da dobra na Visão Executiva
    mkCLazy('c-exec-agenda', {type:'bar', data:{labels:agendaArr.map(function(a){return _ymToLabel(a.ym);}),
      datasets:[{label:'A pagar', data:agendaArr.map(function(a){return a.valor;}),
                 backgroundColor:agendaArr.map(function(a){
                   // Vencidos passados em vermelho, mês corrente em laranja, futuros em azul
                   if(/^VENCIDO/.test(a.ym) || (a.ym && a.ym < _hojeYm)) return _PAL.dn+'AA';
                   if(a.ym && a.ym < _ymProxMes) return _PAL.hl+'AA';
                   return _PAL.ac+'AA';
                 }),
                 borderRadius:5}]},
      options:{responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:false}, tooltip:{callbacks:{label:function(ctx){
          const d = agendaArr[ctx.dataIndex];
          return fB(ctx.raw)+' · '+fI(d.titulos||0)+' tít.';
        }}}},
        scales:{y:{beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}}, x:{grid:{display:false}}}}});
  }

  // ─── Tabela Top 20 produtos ───────────────────────────────────────
  const tbody = document.getElementById('tb-exec-top20');
  if(tbody){
    if(!V || !V.produtos_top){
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:24px;">Aguardando dados de vendas…</td></tr>';
    } else {
      // Agregar produtos_top de vendas: somar todos meses por SKU
      const prodAgg = new Map();
      V.produtos_top.forEach(function(r){
        const k = r.cod;
        if(!prodAgg.has(k)) prodAgg.set(k, {cod:r.cod, desc:r.desc, fat_liq:0, lucro:0, qt:0});
        const x = prodAgg.get(k);
        x.fat_liq += r.fat_liq||0;
        x.lucro   += r.lucro||0;
        x.qt      += r.qt||0;
      });
      // Top 20 por fat_liq
      const top = Array.from(prodAgg.values()).sort(function(a,b){return b.fat_liq - a.fat_liq;}).slice(0, 20);

      // Indexar estoque para cruzar
      const eIdx = new Map();
      if(E && E.produtos){
        E.produtos.forEach(function(p){ eIdx.set(p.cod, p); });
      }
      // v4.79: indexar vendas_por_sku para evitar O(N²) com .find em loop
      const skuIdx = new Map();
      if(V.vendas_por_sku){
        V.vendas_por_sku.forEach(function(s){ skuIdx.set(s.cod, s); });
      }

      tbody.innerHTML = top.map(function(p, i){
        const margPct = p.fat_liq>0 ? p.lucro/p.fat_liq*100 : 0;
        const margClass = margPct<0 ? 'val-neg' : margPct>18 ? 'val-pos' : '';
        const eqProd = eIdx.get(p.cod);
        const estoqueQt    = eqProd && eqProd.estoque ? eqProd.estoque.qt : 0;
        const estoqueCusto = eqProd && eqProd.estoque ? eqProd.estoque.vl_custo : 0;

        // Sparkline a partir de vendas_por_sku.por_mes (lookup O(1) via Map)
        let sparkHtml = '';
        const skuFull = skuIdx.get(p.cod);
        if(skuFull && skuFull.por_mes && skuFull.por_mes.length){
          sparkHtml = sparkSvg(skuFull.por_mes.map(function(m){return m.qt;}));
        }

        return '<tr onclick="if(typeof openProd===\'function\')openProd('+escJs(p.cod)+');">'
          + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
          + '<td class="L">'
          +   '<div style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text-muted);">#'+esc(p.cod)+'</div>'
          +   '<div style="font-weight:600;">'+esc(p.desc||'')+'</div>'
          + '</td>'
          + '<td>'+sparkHtml+'</td>'
          + '<td class="val-strong">'+fB(p.fat_liq, 0)+'</td>'
          + '<td class="'+margClass+'">'+fP(margPct)+'</td>'
          + '<td class="val-dim">'+(estoqueCusto>0 ? fB(estoqueCusto, 0) : '—')+'</td>'
          + '<td class="val-dim">'+(estoqueQt>0 ? fI(estoqueQt) : '—')+'</td>'
          + '</tr>';
      }).join('');
      if(typeof makeSortable === 'function') makeSortable('t-exec-top20');
    }
  }
}

// ────────────────────────────────────────────────────────────────────
// V DRILLDOWN POR VENDEDOR (sub-etapa 4c.3 · 30/abr/2026)
// Lista os 114 RCAs com filtros (loja, supervisor) e métricas agregadas.
// Permite clique para drill em um RCA específico e ver sua evolução.
// ────────────────────────────────────────────────────────────────────
function renderVDrilldown(){
  const cont = document.getElementById('page-v-drilldown');
  if(!cont) return;

  const cadOriginal = (V.vendedores && V.vendedores.cadastro) || [];
  const mensalVorig = (V.vendedores && V.vendedores.mensal) || [];

  // Aplicar filtro de supervisores ignorados (configurado em Administração) — escopo desta página
  const cad = Filtros.vendedoresAtivos(cadOriginal, 'v-drilldown');
  const codsValidos = Filtros.codsValidos(cad, 'v-drilldown');
  const mensalV = mensalVorig.filter(function(r){return codsValidos.has(r.cod);});

  if(!cad.length || !mensalV.length){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Drill-Down por <em>Vendedor</em></h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc">'+_emptyState('Sem dados de vendedores', 'Aguardando carga do JSON de vendedores ou filial sem cadastro de RCAs.')+'</div></div>';
    return;
  }

  // Agregar mensal por vendedor (último mês + total + por_ano)
  const mensalIdx = new Map();
  mensalV.forEach(function(r){
    if(!mensalIdx.has(r.cod)) mensalIdx.set(r.cod, []);
    mensalIdx.get(r.cod).push(r);
  });
  // Sort de cada lista por ym
  mensalIdx.forEach(function(arr){ arr.sort(function(a,b){return a.ym<b.ym?-1:1;}); });

  // Determinar o último mês global
  const ultimoYm = mensalV.reduce(function(m, r){ return r.ym > m ? r.ym : m; }, '');

  // Mês anterior comparável
  const mesAntPart = ultimoYm.split('-');
  let prevYm;
  if(mesAntPart[1] === '01'){
    prevYm = (parseInt(mesAntPart[0],10)-1)+'-12';
  } else {
    prevYm = mesAntPart[0]+'-'+String(parseInt(mesAntPart[1],10)-1).padStart(2,'0');
  }

  // Agregar por vendedor: total no período, último mês, mês anterior, por loja, por supervisor
  // v4.81: arr é sorted ASC por ym (linha 2317) — busca reversa O(2) em vez de 2× find linear
  const agregados = cad.map(function(v){
    const arr = mensalIdx.get(v.cod) || [];
    let ult = null, ant = null;
    for(let i = arr.length - 1; i >= 0; i--){
      const r = arr[i];
      if(!ult && r.ym === ultimoYm){ ult = r; if(ant) break; continue; }
      if(!ant && r.ym === prevYm){ ant = r; if(ult) break; continue; }
      if(r.ym < prevYm) break; // sorted ASC: nada mais vai matchar
    }
    const total = arr.reduce(function(s, r){
      return {fat_liq: s.fat_liq + (r.fat_liq||0), lucro: s.lucro + (r.lucro||0),
              qt: s.qt + (r.qt||0), nfs: s.nfs + (r.nfs||0), clientes: s.clientes + (r.clientes||0)};
    }, {fat_liq:0, lucro:0, qt:0, nfs:0, clientes:0});

    // Crescimento MoM
    const cresce = (ant && ant.fat_liq > 0 && ult)
      ? (ult.fat_liq/ant.fat_liq - 1)*100
      : null;

    return {
      cod: v.cod, nome: v.nome, loja: v.loja, supervisor: v.supervisor,
      meses_ativos: arr.length,
      total: total,
      marg: total.fat_liq>0 ? total.lucro/total.fat_liq*100 : 0,
      ticket: total.nfs>0 ? total.fat_liq/total.nfs : 0,
      ult_ym: ult ? ult.ym : null,
      ult_fat: ult ? ult.fat_liq : 0,
      ant_fat: ant ? ant.fat_liq : 0,
      cresce_mom: cresce,
    };
  });
  // Sort default por total fat_liq desc
  agregados.sort(function(a,b){return b.total.fat_liq - a.total.fat_liq;});

  // Listar supervisores únicos
  const supSet = new Set();
  cad.forEach(function(v){ if(v.supervisor) supSet.add(v.supervisor); });
  const supervisores = Array.from(supSet).sort();

  let html = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Drill-Down por <em>Vendedor</em></h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // Banner com resumo
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>'+fI(cad.length)+' vendedores cadastrados</strong> · '
       +   fI(supervisores.length)+' supervisores · '
       +   fI(mensalV.length)+' linhas mensais · cobertura até '+_ymToLabel(ultimoYm)
       + '</div>';

  // KPIs gerais
  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px;" id="kg-vdrl"></div>';

  // Filtros
  html += '<div class="cc" style="margin-bottom:12px;padding:12px 14px;">'
       +   '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">'
       +     '<label style="font-size:12px;color:var(--text-dim);font-weight:600;">Loja:</label>'
       +     '<select id="flt-vdrl-loja" style="padding:5px 10px;border:1px solid var(--border);border-radius:5px;background:var(--surface);color:var(--text);font-size:12px;font-family:inherit;">'
       +       '<option value="">Todas</option>'
       +       '<option value="ATP-V">ATP Varejo</option>'
       +       '<option value="ATP-A">ATP Atacado</option>'
       +     '</select>'
       +     '<label style="font-size:12px;color:var(--text-dim);font-weight:600;margin-left:12px;">Supervisor:</label>'
       +     '<select id="flt-vdrl-sup" style="padding:5px 10px;border:1px solid var(--border);border-radius:5px;background:var(--surface);color:var(--text);font-size:12px;font-family:inherit;">'
       +       '<option value="">Todos</option>'
       +       supervisores.map(function(s){return '<option value="'+escAttr(s)+'">'+esc(s)+'</option>';}).join('')
       +     '</select>'
       +     '<label style="font-size:12px;color:var(--text-dim);font-weight:600;margin-left:12px;">Buscar:</label>'
       +     '<input id="flt-vdrl-q" type="text" placeholder="Nome ou código..." style="padding:5px 10px;border:1px solid var(--border);border-radius:5px;background:var(--surface);color:var(--text);font-size:12px;font-family:inherit;width:180px;" />'
       +     '<span id="flt-vdrl-count" style="margin-left:auto;font-size:11px;color:var(--text-muted);font-family:JetBrains Mono,monospace;"></span>'
       +   '</div>'
       + '</div>';

  // Tabela principal
  html += '<div class="cc">'
       +    '<div class="cct">Ranking de vendedores</div>'
       +    '<div class="ccs">Clique em uma linha para ver evolução mensal · ordenado por faturamento total</div>'
       +    '<div class="tscroll"><table class="t" id="t-vdrl">'
       +      '<thead><tr>'
       +      '<th class="L" style="width:28px;">#</th>'
       +      '<th class="L">Vendedor</th>'
       +      '<th class="L">Loja</th>'
       +      '<th class="L">Supervisor</th>'
       +      '<th>Fat. Total</th>'
       +      '<th>Margem</th>'
       +      '<th>Ticket Médio</th>'
       +      '<th>Último mês</th>'
       +      '<th>MoM</th>'
       +      '<th>Meses ativo</th>'
       +      '</tr></thead>'
       +      '<tbody id="tb-vdrl"></tbody></table></div>'
       + '</div>';

  // Painel de detalhe (inicialmente oculto)
  html += '<div id="vdrl-detalhe" class="cc" style="margin-top:14px;display:none;">'
       +   '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
       +     '<div>'
       +       '<div class="cct" id="vdrl-det-titulo"></div>'
       +       '<div class="ccs" id="vdrl-det-sub"></div>'
       +     '</div>'
       +     '<button id="vdrl-det-close" style="background:transparent;border:1px solid var(--border);color:var(--text-muted);padding:4px 10px;border-radius:5px;cursor:pointer;font-size:11px;">Fechar ✕</button>'
       +   '</div>'
       +   '<div style="height:240px;"><canvas id="c-vdrl-evo"></canvas></div>'
       +   '<div class="tscroll" style="margin-top:12px;"><table class="t" id="t-vdrl-det">'
       +     '<thead><tr><th class="L">Mês</th><th>Fat. Líq.</th><th>Lucro</th><th>Margem</th>'
       +     '<th>NFs</th><th>Clientes</th><th>Ticket Médio</th></tr></thead>'
       +     '<tbody id="tb-vdrl-det"></tbody></table></div>'
       + '</div>';

  html += '</div>'; // page-body
  cont.innerHTML = html;

  // ─── KPIs gerais ───
  const totalGeral = agregados.reduce(function(s,a){return s + a.total.fat_liq;}, 0);
  const lucroGeral = agregados.reduce(function(s,a){return s + a.total.lucro;}, 0);
  const ativosUlt = agregados.filter(function(a){return a.ult_fat>0;}).length;
  // Top 10 representam quanto do faturamento?
  const top10 = agregados.slice(0, 10).reduce(function(s,a){return s + a.total.fat_liq;}, 0);
  const top10Pct = totalGeral>0 ? top10/totalGeral*100 : 0;

  document.getElementById('kg-vdrl').innerHTML = kgHtml([
    {l:'Vendedores cadastrados', v:fI(cad.length), s:fI(supervisores.length)+' supervisores'},
    {l:'Ativos no último mês',   v:fI(ativosUlt), s:'em '+_ymToLabel(ultimoYm)},
    {l:'Concentração top 10',    v:fP(top10Pct), s:'do faturamento total', cls: top10Pct>50?'hl':''},
    {l:'Margem média ponderada', v:fP(totalGeral>0?lucroGeral/totalGeral*100:0), s:'sobre fat. total'},
  ]);

  // ─── Função interna de filtro+render ───
  function rebuildTable(){
    const fltLoja = document.getElementById('flt-vdrl-loja').value;
    const fltSup = document.getElementById('flt-vdrl-sup').value;
    const fltQ = (document.getElementById('flt-vdrl-q').value||'').toLowerCase().trim();
    const filtered = agregados.filter(function(a){
      if(fltLoja && a.loja !== fltLoja) return false;
      if(fltSup && a.supervisor !== fltSup) return false;
      if(fltQ){
        const txt = (a.nome+' '+a.cod).toLowerCase();
        if(txt.indexOf(fltQ) < 0) return false;
      }
      return true;
    });
    document.getElementById('flt-vdrl-count').textContent = fI(filtered.length)+' resultado'+(filtered.length===1?'':'s');

    document.getElementById('tb-vdrl').innerHTML = filtered.map(function(a, i){
      const margCls = a.marg<5 ? 'val-neg' : a.marg>15 ? 'val-pos' : '';
      const momCls = a.cresce_mom===null ? 'val-dim' : a.cresce_mom>=0 ? 'val-pos' : 'val-neg';
      const momStr = a.cresce_mom===null ? '—' : (a.cresce_mom>=0?'+':'')+fP(a.cresce_mom);
      return '<tr style="cursor:pointer;" data-cod="'+escAttr(a.cod)+'" onclick="if(typeof _vdrlAbrir===\'function\')_vdrlAbrir('+escJs(a.cod)+');">'
        + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
        + '<td class="L"><div style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text-muted);">#'+esc(a.cod)+'</div>'
        +   '<div style="font-weight:600;">'+esc(a.nome)+'</div></td>'
        + '<td class="L">'+esc(a.loja||'—')+'</td>'
        + '<td class="L">'+esc(a.supervisor||'—')+'</td>'
        + '<td class="val-strong">'+fK(a.total.fat_liq)+'</td>'
        + '<td class="'+margCls+'">'+fP(a.marg)+'</td>'
        + '<td>'+fK(a.ticket)+'</td>'
        + '<td class="val-dim">'+(a.ult_fat>0?fK(a.ult_fat):'—')+'</td>'
        + '<td class="'+momCls+'">'+momStr+'</td>'
        + '<td class="val-dim">'+a.meses_ativos+'</td>'
        + '</tr>';
    }).join('');
  }

  // Bind dos filtros
  document.getElementById('flt-vdrl-loja').addEventListener('change', rebuildTable);
  document.getElementById('flt-vdrl-sup').addEventListener('change', rebuildTable);
  // v4.79: debounce 120ms · digitar 6 letras fazia 6 rebuilds completos
  let _vdrlTmr = null;
  document.getElementById('flt-vdrl-q').addEventListener('input', function(){
    clearTimeout(_vdrlTmr);
    _vdrlTmr = setTimeout(rebuildTable, 120);
  });

  // Função global para abrir detalhe (acessível via onclick)
  window._vdrlAbrir = function(cod){
    const arr = mensalIdx.get(cod) || [];
    const v = cad.find(function(x){return x.cod === cod;});
    if(!v || !arr.length) return;

    const det = document.getElementById('vdrl-detalhe');
    det.style.display = '';
    document.getElementById('vdrl-det-titulo').textContent = '#'+v.cod+' · '+v.nome;
    document.getElementById('vdrl-det-sub').textContent = (v.loja||'—')+' · Supervisor: '+(v.supervisor||'—')+' · '+arr.length+' meses ativos';

    // Chart de evolução
    const lbl = arr.map(function(r){return _ymToLabel(r.ym);});
    mkC('c-vdrl-evo', {data:{labels:lbl, datasets:[
      {type:'bar', label:'Fat. Líq.', data:arr.map(function(r){return r.fat_liq;}),
        backgroundColor:_PAL.hl+'CC', borderRadius:4, yAxisID:'y'},
      {type:'line', label:'Margem %', data:arr.map(function(r){return r.marg;}),
        borderColor:_PAL.ok, backgroundColor:'rgba(16,152,84,.1)', tension:.3, pointRadius:4, yAxisID:'y2'},
    ]}, options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'bottom', labels:{padding:10, usePointStyle:true, boxWidth:8}},
               tooltip:{callbacks:{label:function(ctx){
                 if(ctx.dataset.label==='Margem %') return ctx.dataset.label+': '+fP(ctx.raw);
                 return ctx.dataset.label+': '+fB(ctx.raw);
               }}}},
      scales:{
        y:{beginAtZero:true, position:'left', ticks:{callback:function(v){return fAbbr(v);}}},
        y2:{position:'right', grid:{display:false}, ticks:{callback:function(v){return fP(v);}}},
        x:{grid:{display:false}}
      }}});

    // Tabela detalhe (mensal reversa)
    document.getElementById('tb-vdrl-det').innerHTML = arr.slice().reverse().map(function(r){
      const ticket = r.nfs>0 ? r.fat_liq/r.nfs : 0;
      const margCls = r.marg<5 ? 'val-neg' : r.marg>15 ? 'val-pos' : '';
      return '<tr>'
        + '<td class="L">'+_ymToLabel(r.ym)+'</td>'
        + '<td class="val-strong">'+fK(r.fat_liq)+'</td>'
        + '<td>'+fK(r.lucro)+'</td>'
        + '<td class="'+margCls+'">'+fP(r.marg)+'</td>'
        + '<td class="val-dim">'+fI(r.nfs)+'</td>'
        + '<td class="val-dim">'+fI(r.clientes)+'</td>'
        + '<td>'+fK(ticket)+'</td>'
        + '</tr>';
    }).join('');

    // Scroll suave
    det.scrollIntoView({behavior:'smooth', block:'start'});
  };

  // Botão fechar
  document.getElementById('vdrl-det-close').addEventListener('click', function(){
    document.getElementById('vdrl-detalhe').style.display = 'none';
  });

  // Render inicial
  rebuildTable();

  // v4.76 fix26: foco vindo do RCA — abre auto-magicamente o detalhe do vendedor
  // clicado, com filtro de busca pré-preenchido e scroll suave até a linha.
  try {
    const focoCod = window._rcaVendedorFoco;
    if(focoCod){
      window._rcaVendedorFoco = null;
      const vAlvo = cad.find(function(x){return String(x.cod) === String(focoCod);});
      if(vAlvo){
        // Pré-filtra pelo nome pra que a linha apareça primeiro
        const inp = document.getElementById('flt-vdrl-q');
        if(inp){ inp.value = vAlvo.nome; rebuildTable(); }
        // Abre o detalhe e dá scroll suave
        if(typeof window._vdrlAbrir === 'function'){
          window._vdrlAbrir(focoCod);
          setTimeout(function(){
            const det = document.getElementById('vdrl-detalhe');
            if(det && det.scrollIntoView) det.scrollIntoView({behavior:'smooth', block:'start'});
          }, 80);
        }
      }
    }
  } catch(e){ /* ignore */ }
}

// ────────────────────────────────────────────────────────────────────
// V BENCHMARKING ENTRE VENDEDORES (sub-etapa 4c.3)
// Comparativo de performance dos 114 RCAs:
// - Maiores crescimentos / quedas (jan-mar 26 vs 25)
// - Top performers por margem, ticket médio, clientes
// - Ranking visual e KPIs comparativos
// ────────────────────────────────────────────────────────────────────
function renderVBenchmarking(){
  const cont = document.getElementById('page-v-benchmarking');
  if(!cont) return;

  const cadOriginal = (V.vendedores && V.vendedores.cadastro) || [];
  const mensalVorig = (V.vendedores && V.vendedores.mensal) || [];

  // Aplicar filtro de supervisores ignorados — escopo desta página
  const cad = Filtros.vendedoresAtivos(cadOriginal, 'v-benchmarking');
  const codsValidos = Filtros.codsValidos(cad, 'v-benchmarking');
  const mensalV = mensalVorig.filter(function(r){return codsValidos.has(r.cod);});

  if(!cad.length || !mensalV.length){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2><em>RCA</em> · Análise por Vendedor</h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc">'+_emptyState('Sem dados de vendedores', 'O JSON de vendedores ainda não foi carregado ou a base ativa não possui cadastro de RCAs.')+'</div></div>';
    return;
  }

  // ─── Filtros de sessão ───
  const ymsAll = Array.from(new Set(mensalV.map(function(r){return r.ym;}).filter(Boolean))).sort();
  if(typeof window._rcaMesesAtivos === 'undefined') window._rcaMesesAtivos = null; // null = jan-mar 2026 padrão
  if(typeof window._rcaSupAtivos === 'undefined') window._rcaSupAtivos = null;     // null = todos

  // Período padrão: jan-mar 2026 (ou todos os meses 2026 se não houver mar)
  let mesesDestino;
  if(window._rcaMesesAtivos === null){
    // v4.75: usa o ano corrente dos dados (não 2026 hardcoded)
    const _anoNow = new Date().getFullYear();
    const _pref = _anoNow + '-';
    mesesDestino = ymsAll.filter(function(y){return y.indexOf(_pref) === 0;}).slice(0, 3);
    if(mesesDestino.length === 0) mesesDestino = ymsAll.slice(-3);
  } else {
    mesesDestino = window._rcaMesesAtivos.slice();
  }
  const mesesDestinoSet = new Set(mesesDestino);

  // Período comparação: mesmos meses ano anterior (ano-1)
  const mesesCompara = mesesDestino.map(function(ym){
    const y = parseInt(ym.slice(0,4), 10) - 1;
    return y + ym.slice(4);
  }).filter(function(y){return ymsAll.indexOf(y) >= 0;});
  const mesesComparaSet = new Set(mesesCompara);

  // Lista de supervisores únicos por (loja, cod_supervisor)
  // ATENÇÃO: cod_supervisor não é único entre lojas. cod=1 é VAREJO em ATP-V e
  // CESTAO 01 em CP3/CP40. A chave precisa incluir a loja pra distinguir.
  const supsMap = new Map(); // "loja|cod" → {loja, cod, nome}
  cad.forEach(function(v){
    if(v.cod_supervisor == null) return;
    const chave = (v.loja||'?')+'|'+v.cod_supervisor;
    if(!supsMap.has(chave)){
      supsMap.set(chave, {loja:v.loja, cod:v.cod_supervisor, nome:v.supervisor || ('Sup. '+v.cod_supervisor)});
    }
  });
  const supsArr = Array.from(supsMap.values())
    .sort(function(a,b){
      if(a.loja !== b.loja) return (a.loja||'').localeCompare(b.loja||'');
      return a.cod - b.cod;
    });

  // Aplicar filtro de supervisores ao cadastro filtrado.
  // window._rcaSupAtivos é null (todos) ou array de chaves "loja|cod_supervisor".
  const supSel = window._rcaSupAtivos;
  const cadFilt = (supSel === null || supSel.length === 0)
    ? cad
    : cad.filter(function(v){
        const chave = (v.loja||'?')+'|'+v.cod_supervisor;
        return supSel.indexOf(chave) >= 0;
      });

  // Indexar mensal por cod
  const mensalIdx = new Map();
  mensalV.forEach(function(r){
    if(!mensalIdx.has(r.cod)) mensalIdx.set(r.cod, []);
    mensalIdx.get(r.cod).push(r);
  });

  // Para cada vendedor: comparar período destino vs período comparação
  const compara = cadFilt.map(function(v){
    const arr = mensalIdx.get(v.cod) || [];
    const jmAnt = arr.filter(function(r){return mesesComparaSet.has(r.ym);});
    const jmDst = arr.filter(function(r){return mesesDestinoSet.has(r.ym);});
    const fat25 = jmAnt.reduce(function(s,r){return s+r.fat_liq;}, 0);
    const fat26 = jmDst.reduce(function(s,r){return s+r.fat_liq;}, 0);
    const luc25 = jmAnt.reduce(function(s,r){return s+r.lucro;}, 0);
    const luc26 = jmDst.reduce(function(s,r){return s+r.lucro;}, 0);
    const nfs26 = jmDst.reduce(function(s,r){return s+r.nfs;}, 0);
    const cli26 = jmDst.reduce(function(s,r){return s+r.clientes;}, 0);
    const qt26 = jmDst.reduce(function(s,r){return s+(r.qt||0);}, 0);

    return {
      cod: v.cod, nome: v.nome, loja: v.loja, supervisor: v.supervisor,
      fat25: fat25, fat26: fat26, luc25: luc25, luc26: luc26,
      cresce: fat25>0 ? (fat26/fat25 - 1)*100 : null,
      dif_abs: fat26 - fat25,
      marg26: fat26>0 ? luc26/fat26*100 : 0,
      marg25: fat25>0 ? luc25/fat25*100 : 0,
      ticket26: nfs26>0 ? fat26/nfs26 : 0,
      nfs26: nfs26,
      qt26: qt26,
      mix26: null, // preenchido abaixo a partir do cubo OLAP (Cu), se disponível
      clientes26: cli26,
      ativo26: fat26 > 0,
      ativo25: fat25 > 0,
    };
  });

  // v4.76 fix26: Mix REAL (SKUs distintos por vendedor) do cubo OLAP.
  // Se o cubo já foi carregado (pré-fetch ou navegação anterior), itera
  // Cu.fatos.vendas.linhas uma vez e cacheia. Caso indisponível, x.mix26
  // fica null e o ranking de Mix usa qt26 como proxy.
  const _mixIdx = (function(){
    try {
      if(window._rcaMixCache) return window._rcaMixCache;
      if(typeof Cu === 'undefined' || !Cu || !Cu.fatos || !Cu.fatos.vendas) return null;
      const fv = Cu.fatos.vendas;
      const camposCu = fv.campos || [];
      const iVend = camposCu.indexOf('vend');
      const iSku  = camposCu.indexOf('sku');
      if(iVend < 0 || iSku < 0) return null;
      const mapa = {};
      const linhasCu = fv.linhas || [];
      for(let i=0; i<linhasCu.length; i++){
        const vc = linhasCu[i][iVend];
        const sc = linhasCu[i][iSku];
        if(vc == null || sc == null) continue;
        if(!mapa[vc]) mapa[vc] = new Set();
        mapa[vc].add(sc);
      }
      const out = {};
      Object.keys(mapa).forEach(function(k){ out[k] = mapa[k].size; });
      window._rcaMixCache = out;
      return out;
    } catch(e){ return null; }
  })();
  if(_mixIdx){
    compara.forEach(function(x){
      if(_mixIdx[x.cod] != null) x.mix26 = _mixIdx[x.cod];
    });
  }
  // mix_val: valor unificado pra sort/coluna (SKUs distintos ou qt como proxy)
  compara.forEach(function(x){ x.mix_val = (x.mix26 != null ? x.mix26 : (x.qt26 || 0)); });

  // KPIs comparativos
  const ativos25 = compara.filter(function(x){return x.ativo25;}).length;
  const ativos26 = compara.filter(function(x){return x.ativo26;}).length;
  const novos = compara.filter(function(x){return !x.ativo25 && x.ativo26;}).length;
  const desligados = compara.filter(function(x){return x.ativo25 && !x.ativo26;}).length;

  // Crescimento ponderado total
  const totFat26 = compara.reduce(function(s,x){return s+x.fat26;}, 0);
  const totFat25 = compara.reduce(function(s,x){return s+x.fat25;}, 0);
  const cresceMedio = totFat25>0 ? (totFat26/totFat25 - 1)*100 : 0;

  // Top 10 por métrica (apenas com fat_liq > 50k pra evitar outliers)
  // v4.76 fix23: 4 rankings agora — Faturamento / Margem / Mix / Ticket Médio
  const ativos26Filt = compara.filter(function(x){return x.fat26 > 50000;});
  const topFat    = compara.filter(function(x){return x.fat26 > 0;}).slice().sort(function(a,b){return b.fat26 - a.fat26;}).slice(0, 10);
  const topMargem = ativos26Filt.slice().sort(function(a,b){return b.marg26 - a.marg26;}).slice(0, 10);
  // v4.76 fix26: Mix prefere SKUs distintos (cubo OLAP) quando disponível; senão usa qt como proxy.
  const _mixVal = function(x){ return (x.mix26 != null ? x.mix26 : (x.qt26||0)); };
  const topMix    = ativos26Filt.slice().sort(function(a,b){return _mixVal(b) - _mixVal(a);}).slice(0, 10);
  const topTicket = ativos26Filt.slice().sort(function(a,b){return b.ticket26 - a.ticket26;}).slice(0, 10);

  const labelDst = mesesDestino.length
    ? _ymToLabel(mesesDestino[0])+(mesesDestino.length>1?' a '+_ymToLabel(mesesDestino[mesesDestino.length-1]):'')
    : '—';
  const labelAnt = mesesCompara.length
    ? _ymToLabel(mesesCompara[0])+(mesesCompara.length>1?' a '+_ymToLabel(mesesCompara[mesesCompara.length-1]):'')
    : 'mesmos meses ano anterior';

  let html = '<div class="ph"><div class="pk">Vendas · Análise</div><h2><em>RCA</em> · Análise por Vendedor</h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // ─── Filtros ───
  html += '<div class="cc" style="padding:12px 14px;margin-bottom:14px;">';
  html += '<div style="display:flex;flex-wrap:wrap;gap:18px;align-items:flex-start;">';

  // Período (multi-select)
  html += '<div style="flex:1;min-width:280px;">';
  html += '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:6px;">Período (vs. mesmos meses do ano anterior)</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:5px;">';
  html += '<button class="rca-mes-shortcut" data-act="default" style="padding:4px 9px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Padrão (jan-mar 26)</button>';
  html += '<button class="rca-mes-shortcut" data-act="2026" style="padding:4px 9px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Todo 2026</button>';
  html += '<button class="rca-mes-shortcut" data-act="ult3" style="padding:4px 9px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Últimos 3</button>';
  html += '<button class="rca-mes-shortcut" data-act="ult6" style="padding:4px 9px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Últimos 6</button>';
  html += '</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;">';
  ymsAll.forEach(function(ym){
    const ativo = mesesDestinoSet.has(ym);
    html += '<button class="rca-mes-btn" data-ym="'+esc(ym)+'" style="padding:3px 7px;font-size:10.5px;border:1px solid var(--border-strong);border-radius:4px;cursor:pointer;'
         +   (ativo?'background:var(--accent);color:white;border-color:var(--accent);':'background:var(--surface);color:var(--text);')
         + 'font-weight:600;">'+esc(_ymToLabel(ym))+'</button>';
  });
  html += '</div>';
  html += '</div>';

  // Supervisor multi-select
  html += '<div style="flex:1;min-width:280px;">';
  html += '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:6px;">Supervisor por loja (multi-select)</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:5px;">';
  html += '<button class="rca-sup-shortcut" data-act="todos" style="padding:4px 9px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Todos</button>';
  supsArr.forEach(function(s){
    const chave = (s.loja||'?')+'|'+s.cod;
    const isOn = (supSel === null || supSel.indexOf(chave) >= 0);
    const lojaLbl = s.loja ? (s.loja+' · ') : '';
    html += '<button class="rca-sup-btn" data-chave="'+esc(chave)+'" style="padding:4px 9px;font-size:11px;border:1px solid var(--border-strong);border-radius:4px;cursor:pointer;'
         +   (isOn?'background:var(--accent);color:white;border-color:var(--accent);':'background:var(--surface);color:var(--text);')
         + 'font-weight:600;" title="'+esc(s.loja||'')+' · #'+s.cod+' '+esc(s.nome||'')+'">'
         + esc(lojaLbl)+'#'+s.cod+' '+esc((s.nome||'').substring(0,20))
         +'</button>';
  });
  html += '</div>';
  html += '</div>';

  html += '</div>'; // flex
  html += '</div>'; // cc

  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   'Comparativo: <strong>'+esc(labelDst)+'</strong> vs <strong>'+esc(labelAnt)+'</strong> · '
       +   'Filtros: rankings consideram apenas vendedores com faturamento > R$ 10k no período anterior e ativos no período destino.'
       + '</div>';

  // KPIs
  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px;" id="kg-vbm"></div>';

  // v4.76 fix23: Tabs — Top Faturamento / Margem / Mix / Ticket Médio
  html += '<div class="cc" style="margin-bottom:12px;">'
       +   '<div class="cch"><div>'
       +     '<div class="cct">Top 10 vendedores</div>'
       +     '<div class="ccs" id="vbm-top-sub">'+esc(labelDst)+' · escolha a métrica abaixo · "Mix" usa quantidade de itens vendidos (proxy)</div>'
       +   '</div></div>'
       +   '<div class="rca-tabs" style="display:inline-flex;gap:4px;margin:8px 0;border-bottom:1px solid var(--border);padding-bottom:6px;flex-wrap:wrap;">'
       +     '<button type="button" class="rca-top-tab on" data-tab="fat" style="padding:6px 12px;font-size:11.5px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:6px;cursor:pointer;font-weight:700;">🏆 Top Faturamento</button>'
       +     '<button type="button" class="rca-top-tab" data-tab="marg" style="padding:6px 12px;font-size:11.5px;border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:6px;cursor:pointer;font-weight:600;">📈 Top Margem</button>'
       +     '<button type="button" class="rca-top-tab" data-tab="mix" style="padding:6px 12px;font-size:11.5px;border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:6px;cursor:pointer;font-weight:600;">🧺 Top Mix de Produtos</button>'
       +     '<button type="button" class="rca-top-tab" data-tab="tick" style="padding:6px 12px;font-size:11.5px;border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:6px;cursor:pointer;font-weight:600;">💵 Top Ticket Médio</button>'
       +   '</div>'
       +   '<div class="tscroll"><table class="t" id="t-vbm-top"><thead id="th-vbm-top"></thead><tbody id="tb-vbm-top"></tbody></table></div>'
       + '</div>';

  // v4.76 fix23: Comparativo geral com colunas clicáveis (sort) + drill-down funcional
  html += '<div class="cc">'
       +    '<div class="cct">Comparativo geral (todos os vendedores ativos)</div>'
       +    '<div class="ccs">Clique no cabeçalho da coluna para ordenar · clique no nome do vendedor para abrir o Drill-Down</div>'
       +    '<div class="tscroll"><table class="t" id="t-vbm">'
       +      '<thead><tr>'
       +      '<th class="L vbm-sort" data-sort="nome">Vendedor</th>'
       +      '<th class="L vbm-sort" data-sort="loja">Loja</th>'
       +      '<th class="L vbm-sort" data-sort="supervisor">Sup.</th>'
       +      '<th class="vbm-sort" data-sort="fat25">Fat. '+esc(labelAnt)+'</th>'
       +      '<th class="vbm-sort" data-sort="fat26">Fat. '+esc(labelDst)+'</th>'
       +      '<th class="vbm-sort" data-sort="dif_abs">Δ R$</th>'
       +      '<th class="vbm-sort" data-sort="cresce">Δ %</th>'
       +      '<th class="vbm-sort" data-sort="marg26">Margem dest.</th>'
       +      '<th class="vbm-sort" data-sort="mix_val" title="'+(_mixIdx?'SKUs distintos vendidos (cubo OLAP)':'Quantidade de itens vendidos · proxy enquanto SKUs distintos não estão no JSON')+'">'+(_mixIdx?'Mix (SKUs)':'Mix (qt)')+'</th>'
       +      '<th class="vbm-sort" data-sort="ticket26">Ticket</th>'
       +      '<th class="L">Status</th>'
       +      '</tr></thead><tbody id="tb-vbm"></tbody></table></div>'
       + '</div>';

  html += '</div>'; // page-body
  cont.innerHTML = html;

  // ─── KPIs ───
  document.getElementById('kg-vbm').innerHTML = kgHtml([
    {l:'Ativos '+labelAnt, v:fI(ativos25), s:'no período'},
    {l:'Ativos '+labelDst, v:fI(ativos26), s:fI(novos)+' novos · '+fI(desligados)+' desligados'},
    {l:'Crescimento médio', v:(cresceMedio>=0?'+':'')+fP(cresceMedio), s:'ponderado por fat.', cls:cresceMedio>=0?'up':'dn'},
    {l:'Δ Faturamento total', v:(totFat26-totFat25>=0?'+':'')+fK(totFat26-totFat25), s:esc(labelDst)+' vs '+esc(labelAnt), cls:totFat26>totFat25?'up':'dn'},
  ]);

  // ─── v4.76 fix23: Tabs Top 10 vendedores (Faturamento / Margem / Mix / Ticket) ───
  // v4.76 fix26: coluna "Mix" muda label quando temos SKUs distintos reais (Cu)
  const _mixLabel = _mixIdx ? 'SKUs distintos' : 'Itens vendidos (proxy)';
  const _vbmTopDefs = {
    fat:  {dados: topFat,    cols: ['#','Vendedor','Loja','Fat.','Margem'],         render: function(x){return ['<strong>'+fK(x.fat26)+'</strong>', fP(x.marg26)];}},
    marg: {dados: topMargem, cols: ['#','Vendedor','Loja','Fat.','Margem'],         render: function(x){var c=x.marg26>15?'val-pos':''; return [fK(x.fat26), '<strong class="'+c+'">'+fP(x.marg26)+'</strong>'];}},
    mix:  {dados: topMix,    cols: ['#','Vendedor','Loja',_mixLabel,'Fat.'],        render: function(x){return ['<strong>'+fI(_mixVal(x))+'</strong>', fK(x.fat26)];}},
    tick: {dados: topTicket, cols: ['#','Vendedor','Loja','NFs','Ticket'],          render: function(x){var nfs=x.fat26>0 && x.ticket26>0?Math.round(x.fat26/x.ticket26):0; return ['<span class="val-dim">'+fI(nfs)+'</span>', '<strong>'+fK(x.ticket26)+'</strong>'];}},
  };
  function _renderVbmTopTab(key){
    const def = _vbmTopDefs[key] || _vbmTopDefs.fat;
    const th = document.getElementById('th-vbm-top');
    const tb = document.getElementById('tb-vbm-top');
    if(!th || !tb) return;
    th.innerHTML = '<tr>'
      + '<th class="L" style="width:24px;">'+def.cols[0]+'</th>'
      + '<th class="L">'+def.cols[1]+'</th>'
      + '<th class="L">'+def.cols[2]+'</th>'
      + '<th>'+def.cols[3]+'</th>'
      + '<th>'+def.cols[4]+'</th>'
      + '</tr>';
    tb.innerHTML = def.dados.map(function(x, i){
      const cells = def.render(x);
      return '<tr>'
        + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
        + '<td class="L"><div style="font-weight:600;cursor:pointer;color:var(--accent);" data-vend-cod="'+esc(x.cod)+'" data-vend-nome="'+escAttr(x.nome)+'" title="Abrir Drill-Down deste vendedor">'+esc(x.nome)+'</div></td>'
        + '<td class="L">'+esc(x.loja||'—')+'</td>'
        + '<td>'+cells[0]+'</td>'
        + '<td>'+cells[1]+'</td>'
        + '</tr>';
    }).join('');
  }
  _renderVbmTopTab('fat');
  document.querySelectorAll('.rca-top-tab').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.rca-top-tab').forEach(function(b){
        b.classList.remove('on');
        b.style.background = 'var(--surface)';
        b.style.color = 'var(--text)';
        b.style.borderColor = 'var(--border)';
        b.style.fontWeight = '600';
      });
      btn.classList.add('on');
      btn.style.background = 'var(--accent)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--accent)';
      btn.style.fontWeight = '700';
      _renderVbmTopTab(btn.getAttribute('data-tab'));
    });
  });

  // ─── v4.76 fix23: Tabela geral ordenável + drill-down clicável ───
  // Sort default: crescimento desc (nulls last)
  window._rcaSortKey = window._rcaSortKey || 'cresce';
  window._rcaSortDir = window._rcaSortDir || 'desc';
  function _rcaCompararSort(arr){
    const key = window._rcaSortKey;
    const dir = window._rcaSortDir === 'asc' ? 1 : -1;
    return arr.slice().sort(function(a,b){
      const va = a[key], vb = b[key];
      // Nulls sempre no fim
      const an = (va===null || va===undefined);
      const bn = (vb===null || vb===undefined);
      if(an && bn) return 0;
      if(an) return 1;
      if(bn) return -1;
      if(typeof va === 'string') return va.localeCompare(vb) * dir;
      return (va - vb) * dir;
    });
  }
  function _rcaRenderTabVbm(){
    const compSort = _rcaCompararSort(compara);
    // v4.78.3: lazy render — só pinta primeiras 80 linhas, demais ao scroll
    _lazyTable(document.getElementById('tb-vbm'), compSort, function(x){
      const difCls = x.dif_abs>=0 ? 'val-pos' : 'val-neg';
      let status, statusCls;
      if(!x.ativo25 && x.ativo26){ status = 'Novo'; statusCls = 'val-pos'; }
      else if(x.ativo25 && !x.ativo26){ status = 'Inativo no período'; statusCls = 'val-neg'; }
      else if(x.ativo25 && x.ativo26){ status = 'Ativo'; statusCls = ''; }
      else { status = '—'; statusCls = 'val-dim'; }
      const cresceStr = x.cresce===null ? '—' : (x.cresce>=0?'+':'')+fP(x.cresce);
      const cresceCls = x.cresce===null ? 'val-dim' : x.cresce>=0?'val-pos':'val-neg';
      return '<tr>'
        + '<td class="L"><div style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text-muted);">#'+esc(x.cod)+'</div>'
        +    '<div style="font-weight:600;cursor:pointer;color:var(--accent);" data-vend-cod="'+esc(x.cod)+'" data-vend-nome="'+escAttr(x.nome)+'" title="Abrir Drill-Down deste vendedor">'+esc(x.nome)+'</div></td>'
        + '<td class="L">'+esc(x.loja||'—')+'</td>'
        + '<td class="L val-dim" style="font-size:10px;">'+esc(x.supervisor||'—')+'</td>'
        + '<td class="val-dim">'+(x.fat25>0?fK(x.fat25):'—')+'</td>'
        + '<td>'+(x.fat26>0?fK(x.fat26):'—')+'</td>'
        + '<td class="'+difCls+'">'+(x.dif_abs>=0?'+':'')+fK(x.dif_abs)+'</td>'
        + '<td class="'+cresceCls+'">'+cresceStr+'</td>'
        + '<td>'+(x.fat26>0?fP(x.marg26):'—')+'</td>'
        + '<td class="val-dim">'+(x.mix_val>0?fI(x.mix_val):'—')+'</td>'
        + '<td>'+(x.ticket26>0?fK(x.ticket26):'—')+'</td>'
        + '<td class="'+statusCls+'">'+status+'</td>'
        + '</tr>';
    });
    // Atualiza indicador de sort no <th>
    document.querySelectorAll('#t-vbm .vbm-sort').forEach(function(th){
      const k = th.getAttribute('data-sort');
      const cur = th.textContent.replace(/[\s↑↓]+$/,'');
      th.innerHTML = cur + (k === window._rcaSortKey ? (window._rcaSortDir==='asc'?' ↑':' ↓') : '');
      th.style.cursor = 'pointer';
    });
  }
  _rcaRenderTabVbm();

  // v4.76 fix33: bind com guard pra não acumular listeners em re-renders
  // (filtros de mês/supervisor chamam renderVBenchmarking N vezes; antes cada chamada
  // re-anexava listener nos <th> e no #tb-vbm-top → click disparava drilldown N vezes).
  // Re-render. Os nós <th> são novos a cada innerHTML, mas os tbodies são re-populados
  // (referência preservada se já marcados). Função _rcaCompararSort/_rcaRenderTabVbm
  // estão em closure desse render — re-criadas, sem leak.
  const _thsSort = document.querySelectorAll('#t-vbm .vbm-sort');
  for(let _ti=0; _ti<_thsSort.length; _ti++){
    const th = _thsSort[_ti];
    if(th.__rcaSortBound) continue;
    th.__rcaSortBound = true;
    th.addEventListener('click', function(){
      const k = th.getAttribute('data-sort');
      if(window._rcaSortKey === k){
        window._rcaSortDir = window._rcaSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        window._rcaSortKey = k;
        window._rcaSortDir = (k === 'nome' || k === 'loja' || k === 'supervisor') ? 'asc' : 'desc';
      }
      _rcaRenderTabVbm();
    });
  }

  // Click no nome do vendedor → abre Drill-Down. Usa flag __rcaDrillBound nos tbodies.
  function _rcaAbrirDrillDown(ev){
    const el = ev.target.closest('[data-vend-cod]');
    if(!el) return;
    const cod = el.getAttribute('data-vend-cod');
    try { window._rcaVendedorFoco = cod; } catch(e){}
    document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); p.style.display=''; });
    const pg = document.getElementById('page-v-drilldown');
    if(pg){
      pg.classList.add('active');
      pg.style.display = 'block';
      if(typeof renderVDrilldown === 'function') renderVDrilldown();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }
  const _tbVbm = document.getElementById('tb-vbm');
  if(_tbVbm && !_tbVbm.__rcaDrillBound){
    _tbVbm.__rcaDrillBound = true;
    _tbVbm.addEventListener('click', _rcaAbrirDrillDown);
  }
  const _tbVbmTop = document.getElementById('tb-vbm-top');
  if(_tbVbmTop && !_tbVbmTop.__rcaDrillBound){
    _tbVbmTop.__rcaDrillBound = true;
    _tbVbmTop.addEventListener('click', _rcaAbrirDrillDown);
  }

  // ─── Listeners filtros ───
  document.querySelectorAll('.rca-mes-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const ym = btn.getAttribute('data-ym');
      let cur = (window._rcaMesesAtivos === null) ? mesesDestino.slice() : window._rcaMesesAtivos.slice();
      const i = cur.indexOf(ym);
      if(i >= 0) cur.splice(i, 1); else cur.push(ym);
      window._rcaMesesAtivos = cur.length === 0 ? null : cur;
      renderVBenchmarking();
    });
  });
  document.querySelectorAll('.rca-mes-shortcut').forEach(function(btn){
    btn.addEventListener('click', function(){
      const act = btn.getAttribute('data-act');
      if(act === 'default'){
        window._rcaMesesAtivos = null;
      } else if(act === '2026'){
        window._rcaMesesAtivos = ymsAll.filter(function(y){return y.indexOf('2026') === 0;});
      } else if(act === 'ult3'){
        window._rcaMesesAtivos = ymsAll.slice(-3);
      } else if(act === 'ult6'){
        window._rcaMesesAtivos = ymsAll.slice(-6);
      }
      renderVBenchmarking();
    });
  });
  document.querySelectorAll('.rca-sup-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const chave = btn.getAttribute('data-chave');
      const todasChaves = supsArr.map(function(x){return (x.loja||'?')+'|'+x.cod;});
      let cur = (window._rcaSupAtivos === null) ? todasChaves.slice() : window._rcaSupAtivos.slice();
      const i = cur.indexOf(chave);
      if(i >= 0) cur.splice(i, 1); else cur.push(chave);
      window._rcaSupAtivos = (cur.length === 0 || cur.length === todasChaves.length) ? null : cur;
      renderVBenchmarking();
    });
  });
  document.querySelectorAll('.rca-sup-shortcut').forEach(function(btn){
    btn.addEventListener('click', function(){
      window._rcaSupAtivos = null;
      renderVBenchmarking();
    });
  });
}

// ────────────────────────────────────────────────────────────────────
// V ITENS & DEPARTAMENTOS (sub-etapa 4c.4 · 30/abr/2026)
// Análise por departamento: faturamento, margem, preço médio, qt
// ────────────────────────────────────────────────────────────────────
function renderVItens(){
  const cont = document.getElementById('page-v-itens');
  if(!cont) return;

  const deptos = V.deptos || [];
  const cats = V.categorias_top || [];
  if(!deptos.length){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Itens & <em>Departamentos</em></h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc">'+_emptyState('Sem dados de departamentos', 'Verifique a carga do JSON de vendas para a filial selecionada.')+'</div></div>';
    return;
  }

  // Filtrar INATIVO (depto cod=11) — não é interesse de análise
  const deptosFilt = Filtros.deptosValidos(deptos);

  // Lista de meses disponíveis (todos do dataset, jan/2025+)
  const ymsAll = Array.from(new Set(deptosFilt.map(function(r){return r.ym;}).filter(Boolean))).sort();

  // Filtro de meses persistido por sessão (persiste só durante a sessão JS)
  if(typeof window._vitMesesAtivos === 'undefined'){
    window._vitMesesAtivos = null; // null = todos os meses
  }
  const mesesAtivos = (Array.isArray(window._vitMesesAtivos) && window._vitMesesAtivos.length)
    ? window._vitMesesAtivos.filter(function(y){return ymsAll.indexOf(y) >= 0;})
    : ymsAll.slice();
  const mesesSet = new Set(mesesAtivos);
  const filtroAtivo = window._vitMesesAtivos !== null && mesesAtivos.length !== ymsAll.length;

  // Linhas filtradas pelo conjunto de meses ativos (afeta tabelas de depto e categoria)
  function filtrarPorMes(arr){
    if(!filtroAtivo) return arr;
    return arr.filter(function(r){return mesesSet.has(r.ym);});
  }
  const deptosFiltMes = filtrarPorMes(deptosFilt);
  const catsFiltMes   = filtrarPorMes(cats);

  // Agregar por depto (USANDO TODOS OS MESES — para gráficos topo-fixos)
  // As tabelas inferiores usarão deptosFiltMes/catsFiltMes (com filtro de meses).
  const deptoAgg = new Map();
  deptosFilt.forEach(function(r){
    const k = r.cod;
    if(!deptoAgg.has(k)) deptoAgg.set(k, {cod:r.cod, nome:r.nome, fat_liq:0, lucro:0, qt:0, lojas:new Set(), meses:new Set()});
    const x = deptoAgg.get(k);
    x.fat_liq += r.fat_liq||0;
    x.lucro   += r.lucro||0;
    x.qt      += r.qt||0;
    if(r.loja) x.lojas.add(r.loja);
    if(r.ym)   x.meses.add(r.ym);
  });

  const deptoArr = Array.from(deptoAgg.values()).map(function(d){
    return {
      cod: d.cod, nome: d.nome,
      fat_liq: d.fat_liq, lucro: d.lucro, qt: d.qt,
      marg: d.fat_liq>0 ? d.lucro/d.fat_liq*100 : 0,
      preco_medio: d.qt>0 ? d.fat_liq/d.qt : 0,
      n_lojas: d.lojas.size,
      n_meses: d.meses.size,
    };
  }).sort(function(a,b){return b.fat_liq - a.fat_liq;});

  // Agregar por depto APENAS COM MESES ATIVOS — para a tabela "Departamentos visão consolidada"
  const deptoAggMes = new Map();
  deptosFiltMes.forEach(function(r){
    const k = r.cod;
    if(!deptoAggMes.has(k)) deptoAggMes.set(k, {cod:r.cod, nome:r.nome, fat_liq:0, lucro:0, qt:0});
    const x = deptoAggMes.get(k);
    x.fat_liq += r.fat_liq||0;
    x.lucro   += r.lucro||0;
    x.qt      += r.qt||0;
  });
  const deptoArrMes = Array.from(deptoAggMes.values()).map(function(d){
    return {
      cod: d.cod, nome: d.nome,
      fat_liq: d.fat_liq, lucro: d.lucro, qt: d.qt,
      marg: d.fat_liq>0 ? d.lucro/d.fat_liq*100 : 0,
      preco_medio: d.qt>0 ? d.fat_liq/d.qt : 0,
    };
  }).sort(function(a,b){return b.fat_liq - a.fat_liq;});
  const totalGeralMes = deptoArrMes.reduce(function(s,d){return s+d.fat_liq;}, 0);

  const totalGeral = deptoArr.reduce(function(s,d){return s+d.fat_liq;}, 0);

  // Último mês para análise temporal
  const yms = ymsAll;
  const ultimoYm = yms[yms.length-1];
  const labelUltimoMes = _ymToLabel(ultimoYm);

  let html = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Itens & <em>Departamentos</em></h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // Banner
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>'+deptoArr.length+' departamentos ativos</strong> · '+yms.length+' meses · '
       +   'período '+_ymToLabel(yms[0])+' a '+labelUltimoMes
       + '</div>';

  // KPIs (sempre acumulados — todo o período)
  html += '<div class="kg" style="grid-template-columns:repeat(5,1fr);margin-bottom:14px;" id="kg-vit"></div>';

  // Linha 1: pizza geral + barras evolução por depto top 5 (sempre todo o período — referência fixa)
  html += '<div class="row2eq" style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Participação no faturamento</div>'
       +      '<div class="ccs">Por departamento · período total</div>'
       +      '<div style="height:280px;"><canvas id="c-vit-pizza"></canvas></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">Evolução mensal — top 5 deptos</div>'
       +      '<div class="ccs">Faturamento líquido</div>'
       +      '<div style="height:280px;"><canvas id="c-vit-evo"></canvas></div>'
       +    '</div>'
       + '</div>';

  // ─── Filtro de meses (afeta apenas tabelas de depto e categoria abaixo) ───
  const labelFiltro = filtroAtivo
    ? mesesAtivos.length+' de '+yms.length+' meses'
    : 'todos os meses do período';
  html += '<div class="cc" style="padding:12px 14px;margin-bottom:12px;">';
  html += '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">';
  html += '<span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Filtrar período (afeta as tabelas abaixo):</span>';
  // Atalhos
  html += '<button class="vit-mes-shortcut" data-act="todos" style="padding:4px 8px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Todos</button>';
  html += '<button class="vit-mes-shortcut" data-act="2026" style="padding:4px 8px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Só 2026</button>';
  html += '<button class="vit-mes-shortcut" data-act="2025" style="padding:4px 8px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Só 2025</button>';
  html += '<button class="vit-mes-shortcut" data-act="ult12" style="padding:4px 8px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Últimos 12m</button>';
  html += '</div>';
  // Botões individuais por mês
  html += '<div style="display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin-top:8px;">';
  yms.forEach(function(ym){
    const ativo = mesesSet.has(ym);
    html += '<button class="vit-mes-btn" data-ym="'+esc(ym)+'" style="padding:4px 9px;font-size:11px;border:1px solid var(--border-strong);border-radius:4px;cursor:pointer;'
         +   (ativo?'background:var(--accent);color:white;border-color:var(--accent);':'background:var(--surface);color:var(--text);')
         + 'font-weight:600;">'+esc(_ymToLabel(ym))+'</button>';
  });
  html += '</div>';
  html += '<div style="margin-top:8px;font-size:11.5px;color:var(--text-dim);">'
       +   (filtroAtivo
            ? 'Acumulado de '+esc(labelFiltro)+' nas tabelas abaixo. Os gráficos do topo seguem mostrando o período total.'
            : 'Mostrando '+esc(labelFiltro)+'. Clique em meses para filtrar as duas tabelas abaixo.')
       + '</div>';
  html += '</div>';

  // Tabela departamentos
  html += '<div class="cc" style="margin-bottom:12px;">'
       +    '<div class="cct">Departamentos — visão consolidada</div>'
       +    '<div class="ccs">'+(filtroAtivo?'Período filtrado: '+esc(labelFiltro):'Período total')+' · ordenado por faturamento</div>'
       +    '<div class="tscroll"><table class="t" id="t-vit-dept">'
       +      '<thead><tr>'
       +      '<th class="L" style="width:28px;">#</th><th class="L">Departamento</th>'
       +      '<th>Faturamento</th><th>% Total</th>'
       +      '<th>Lucro</th><th>Margem</th>'
       +      '<th>QT vendida</th><th>Preço médio</th>'
       +      '</tr></thead><tbody id="tb-vit-dept"></tbody></table></div>'
       + '</div>';

  // Tabela top categorias (filtrada por depto via select)
  html += '<div class="cc">'
       +    '<div class="cct">Top categorias por departamento</div>'
       +    '<div class="ccs" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">'
       +      '<span>'+(filtroAtivo?'Período filtrado: '+esc(labelFiltro)+' · ':'')+'Filtre por departamento:</span>'
       +      '<select id="flt-vit-dept" style="padding:4px 10px;border:1px solid var(--border);border-radius:5px;background:var(--surface);color:var(--text);font-size:12px;font-family:inherit;">'
       +        '<option value="">Todos</option>'
       +        deptoArr.map(function(d){return '<option value="'+escAttr(d.cod)+'">'+esc(d.nome)+'</option>';}).join('')
       +      '</select>'
       +    '</div>'
       +    '<div class="tscroll" style="margin-top:8px;"><table class="t" id="t-vit-cat">'
       +      '<thead><tr>'
       +      '<th class="L" style="width:28px;">#</th><th class="L">Categoria</th>'
       +      '<th>Faturamento</th><th>Lucro</th><th>Margem</th><th>QT</th><th>Preço médio</th>'
       +      '</tr></thead><tbody id="tb-vit-cat"></tbody></table></div>'
       + '</div>';

  html += '</div>';
  cont.innerHTML = html;

  // ─── KPIs ───
  const top1 = deptoArr[0];
  const top1Pct = totalGeral>0 ? top1.fat_liq/totalGeral*100 : 0;
  const margGeral = totalGeral>0 ? deptoArr.reduce(function(s,d){return s+d.lucro;}, 0)/totalGeral*100 : 0;
  // Separa QT em UN (peças/embalagens) vs KG (perecíveis vendidos a peso)
  // Heurística: deptos com PERECIVEL, ACOUGUE, HORTI, FRIOS, FRUT no nome são em KG
  const _ehKg = function(nome){
    const n = (nome||'').toUpperCase();
    return /PERECIV|ACOUGUE|HORTI|FRIOS|PADAR|FRUT|PEIXARIA/.test(n);
  };
  let qtUn = 0, qtKg = 0;
  deptoArr.forEach(function(d){
    if(_ehKg(d.nome)) qtKg += d.qt||0;
    else qtUn += d.qt||0;
  });

  document.getElementById('kg-vit').innerHTML = kgHtml([
    {l:'Faturamento total',  v:fK(totalGeral), s:deptoArr.length+' deptos · '+yms.length+' meses'},
    {l:'Top depto',          v:esc(top1.nome), s:fP(top1Pct)+' do total · '+fK(top1.fat_liq), cls:'hl'},
    {l:'Margem consolidada', v:fP(margGeral),  s:'média ponderada por fat.'},
    {l:'QT em unidades',     v:fI(qtUn),       s:'mercearia, bebidas, bazar, hipel'},
    {l:'QT em KG',           v:fI(qtKg),       s:'perecíveis, açougue, hortifruti'},
  ]);

  // ─── Pizza por depto ───
  const dC = ['#2E476F','#F58634','#109854','#7c3aed','#DC7529','#1E3558','#0891B2','#94a3b8','#b45309'];
  mkC('c-vit-pizza', {type:'doughnut',
    data:{labels:deptoArr.map(function(d){return d.nome;}),
      datasets:[{data:deptoArr.map(function(d){return d.fat_liq;}), backgroundColor:dC, borderWidth:2, borderColor:'#fff'}]},
    options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'right', labels:{padding:7, usePointStyle:true, boxWidth:8, font:{size:10}}},
               tooltip:{callbacks:{label:function(ctx){return ctx.label+': '+fK(ctx.raw)+' ('+fP(totalGeral>0?ctx.raw/totalGeral*100:0)+')';}}}}}});

  // ─── Evolução mensal top 5 deptos (linhas) ───
  const top5 = deptoArr.slice(0, 5);
  const evoData = top5.map(function(d, idx){
    return {
      label: d.nome,
      data: yms.map(function(ym){
        // Soma todas as lojas para o depto+ym
        const linhas = deptosFilt.filter(function(r){return r.cod === d.cod && r.ym === ym;});
        return linhas.reduce(function(s,r){return s+r.fat_liq;}, 0);
      }),
      borderColor: dC[idx],
      backgroundColor: dC[idx]+'20',
      tension:.3, pointRadius:3, fill:false,
    };
  });
  mkC('c-vit-evo', {type:'line',
    data:{labels:yms.map(_ymToLabel), datasets:evoData},
    options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'bottom', labels:{padding:8, usePointStyle:true, boxWidth:8, font:{size:10}}},
               tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+fK(ctx.raw);}}}},
      scales:{y:{beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}},
              x:{grid:{display:false}, ticks:{maxRotation:60, minRotation:45, font:{size:9}}}}}});

  // [removido em v4.13] Scatter fat × preço médio por depto

  // ─── Tabela departamentos (usa deptoArrMes — respeita filtro de meses) ───
  document.getElementById('tb-vit-dept').innerHTML = deptoArrMes.map(function(d, i){
    const pct = totalGeralMes>0 ? d.fat_liq/totalGeralMes*100 : 0;
    const margCls = d.marg<5 ? 'val-neg' : d.marg>15 ? 'val-pos' : '';
    return '<tr style="cursor:pointer;" onclick="document.getElementById(\'flt-vit-dept\').value='+escJs(String(d.cod))+';document.getElementById(\'flt-vit-dept\').dispatchEvent(new Event(\'change\'));">'
      + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
      + '<td class="L"><strong>'+esc(d.nome)+'</strong></td>'
      + '<td class="val-strong">'+fK(d.fat_liq)+'</td>'
      + '<td>'+fP(pct)+'</td>'
      + '<td>'+fK(d.lucro)+'</td>'
      + '<td class="'+margCls+'">'+fP(d.marg)+'</td>'
      + '<td class="val-dim">'+fI(d.qt)+'</td>'
      + '<td>'+fB(d.preco_medio)+'</td>'
      + '</tr>';
  }).join('');

  // ─── Tabela categorias com filtro de depto (usa catsFiltMes — respeita filtro de meses) ───
  function rebuildCats(){
    const fltCod = document.getElementById('flt-vit-dept').value;
    let rows = catsFiltMes.slice();

    // Aplicar filtro de departamento: cod da categoria começa com cod do depto.
    // Ex: depto 7 (MERCEARIA) → categorias com cod 7XXXX (71303, 70205, etc).
    // Validado: cobre 100% das categorias do JSON ATP.
    if(fltCod){
      const fltStr = String(fltCod);
      rows = rows.filter(function(r){
        const cs = String(r.cod || '');
        return cs.indexOf(fltStr) === 0;
      });
    }

    // Agregar por categoria (todos meses/lojas)
    const catAgg = new Map();
    rows.forEach(function(r){
      const k = r.cod;
      if(!catAgg.has(k)) catAgg.set(k, {cod:r.cod, nome:r.nome, fat_liq:0, lucro:0, qt:0});
      const x = catAgg.get(k);
      x.fat_liq += r.fat_liq||0;
      x.lucro   += r.lucro||0;
      x.qt      += r.qt||0;
    });
    let catArr = Array.from(catAgg.values());

    catArr.sort(function(a,b){return b.fat_liq - a.fat_liq;});
    catArr = catArr.slice(0, 30);

    document.getElementById('tb-vit-cat').innerHTML = catArr.map(function(c, i){
      const marg = c.fat_liq>0 ? c.lucro/c.fat_liq*100 : 0;
      const pmed = c.qt>0 ? c.fat_liq/c.qt : 0;
      const margCls = marg<5 ? 'val-neg' : marg>15 ? 'val-pos' : '';
      return '<tr>'
        + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
        + '<td class="L">'+esc(c.nome)+'</td>'
        + '<td class="val-strong">'+fK(c.fat_liq)+'</td>'
        + '<td>'+fK(c.lucro)+'</td>'
        + '<td class="'+margCls+'">'+fP(marg)+'</td>'
        + '<td class="val-dim">'+fI(c.qt)+'</td>'
        + '<td>'+fB(pmed)+'</td>'
        + '</tr>';
    }).join('');
  }
  document.getElementById('flt-vit-dept').addEventListener('change', rebuildCats);
  rebuildCats();

  // ─── Listeners do filtro de meses ───
  document.querySelectorAll('.vit-mes-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const ym = btn.getAttribute('data-ym');
      const atual = (Array.isArray(window._vitMesesAtivos) && window._vitMesesAtivos.length)
        ? window._vitMesesAtivos.slice()
        : ymsAll.slice();
      const i = atual.indexOf(ym);
      if(i >= 0) atual.splice(i, 1); else atual.push(ym);
      window._vitMesesAtivos = (atual.length === 0 || atual.length === ymsAll.length) ? null : atual;
      renderVItens();
    });
  });
  document.querySelectorAll('.vit-mes-shortcut').forEach(function(btn){
    btn.addEventListener('click', function(){
      const act = btn.getAttribute('data-act');
      if(act === 'todos'){
        window._vitMesesAtivos = null;
      } else if(act === '2026'){
        window._vitMesesAtivos = ymsAll.filter(function(y){return y.indexOf('2026') === 0;});
        if(window._vitMesesAtivos.length === ymsAll.length) window._vitMesesAtivos = null;
      } else if(act === '2025'){
        window._vitMesesAtivos = ymsAll.filter(function(y){return y.indexOf('2025') === 0;});
        if(window._vitMesesAtivos.length === ymsAll.length) window._vitMesesAtivos = null;
      } else if(act === 'ult12'){
        window._vitMesesAtivos = ymsAll.slice(-12);
        if(window._vitMesesAtivos.length === ymsAll.length) window._vitMesesAtivos = null;
      }
      renderVItens();
    });
  });
}

// ────────────────────────────────────────────────────────────────────
// V VENDAS DIÁRIAS (sub-etapa 4c.4)
// Análise diária: top 10 dias, ticket médio por dia da semana, distribuição
// ────────────────────────────────────────────────────────────────────
function renderVDiarias(){
  const cont = document.getElementById('page-v-vendas-diarias');
  if(!cont) return;

  const diarioRaw = V.diario || [];
  if(!diarioRaw.length){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Vendas <em>Diárias</em></h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc">'+_emptyState('Sem dados diários', 'O JSON de vendas para esta filial não tem a granularidade diária.')+'</div></div>';
    return;
  }

  // Lojas presentes na base atual (pra label do escopo)
  const lojasNaBase = Array.from(new Set(diarioRaw.map(function(r){return r.loja;}).filter(Boolean))).sort();
  const lojaLabel = {
    'ATP-V':'ATP Varejo', 'ATP-A':'ATP Atacado',
    'CP1':'Comercial Pinto', 'CP3':'Cestão Loja 1',
    'CP5':'Cestão Inhambupe', 'CP40':'Barros 40'
  };
  const escopoTxt = lojasNaBase.length === 1
    ? (lojaLabel[lojasNaBase[0]] || lojasNaBase[0])
    : lojasNaBase.length+' lojas: '+lojasNaBase.join(' + ');

  // ── Filtro de período ──
  // Faixas disponíveis: ['todo','30d','90d','6m','12m','ano-atual','ano-anterior']
  // window._vdPeriodo guarda a seleção entre re-renders
  if(typeof window._vdPeriodo === 'undefined') window._vdPeriodo = 'todo';
  const periodoSel = window._vdPeriodo;

  // Determinar data corte com base na faixa
  const todasDatasOrd = diarioRaw.map(function(r){return r.data;}).sort();
  const dataMaisRecente = todasDatasOrd[todasDatasOrd.length-1];
  const refDt = new Date(dataMaisRecente + 'T12:00:00');
  function isoDaysAgo(n){
    const d = new Date(refDt.getTime() - n*86400000);
    return d.toISOString().substring(0,10);
  }
  let dtIni = null;
  if(periodoSel === '30d')         dtIni = isoDaysAgo(30);
  else if(periodoSel === '90d')    dtIni = isoDaysAgo(90);
  else if(periodoSel === '6m')     dtIni = isoDaysAgo(180);
  else if(periodoSel === '12m')    dtIni = isoDaysAgo(365);
  else if(periodoSel === 'ano-atual')    dtIni = refDt.getFullYear()+'-01-01';
  else if(periodoSel === 'ano-anterior') dtIni = (refDt.getFullYear()-1)+'-01-01';

  let dtFim = null;
  if(periodoSel === 'ano-anterior') dtFim = (refDt.getFullYear()-1)+'-12-31';

  const diario = diarioRaw.filter(function(r){
    if(dtIni && r.data < dtIni) return false;
    if(dtFim && r.data > dtFim) return false;
    return true;
  });

  if(!diario.length){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Vendas <em>Diárias</em></h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc">'+_emptyState('Sem dados no período selecionado', 'Tente expandir o filtro de período no topo da página.')+'</div></div>';
    return;
  }

  // Agregar por data (consolidando lojas)
  const diaIdx = new Map();
  diario.forEach(function(r){
    const d = r.data;
    if(!diaIdx.has(d)) diaIdx.set(d, {data:d, fat_liq:0, lucro:0, qt:0, nfs:0, clientes:0, lojas:new Set()});
    const x = diaIdx.get(d);
    x.fat_liq += r.fat_liq||0;
    x.lucro   += r.lucro||0;
    x.qt      += r.qt||0;
    x.nfs     += r.nfs||0;
    x.clientes += r.clientes_pdv||0;
    if(r.loja) x.lojas.add(r.loja);
  });
  const dias = Array.from(diaIdx.values()).sort(function(a,b){return a.data<b.data?-1:1;});

  // Estatísticas gerais
  const totalFat = dias.reduce(function(s,d){return s+d.fat_liq;}, 0);
  const mediaFat = dias.length>0 ? totalFat/dias.length : 0;
  const desvio = dias.length>0
    ? Math.sqrt(dias.reduce(function(s,d){return s + Math.pow(d.fat_liq - mediaFat, 2);}, 0) / dias.length)
    : 0;

  // Por dia da semana (0=Dom, 1=Seg, ... 6=Sab)
  const diaSemNome = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  const diaSemAbrev = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const porDiaSem = Array(7).fill(null).map(function(_,i){return {idx:i, nome:diaSemNome[i], abrev:diaSemAbrev[i], fat:0, count:0, nfs:0, qt:0};});
  dias.forEach(function(d){
    const dt = new Date(d.data + 'T12:00:00');  // T12 evita fuso bagunçando
    const ds = dt.getDay();
    porDiaSem[ds].fat += d.fat_liq;
    porDiaSem[ds].count++;
    porDiaSem[ds].nfs += d.nfs;
    porDiaSem[ds].qt += d.qt;
  });
  porDiaSem.forEach(function(p){
    p.media_fat = p.count>0 ? p.fat/p.count : 0;
    p.ticket_med = p.nfs>0 ? p.fat/p.nfs : 0;
  });
  const totalSemana = porDiaSem.reduce(function(s,p){return s+p.fat;}, 0);

  // Top 10 e bottom 10 dias
  const top10 = dias.slice().sort(function(a,b){return b.fat_liq - a.fat_liq;}).slice(0, 10);
  const bot10 = dias.slice().sort(function(a,b){return a.fat_liq - b.fat_liq;}).slice(0, 10);

  // Média mensal de fat diário
  const ymIdx = new Map();
  dias.forEach(function(d){
    const ym = d.data.substring(0, 7);
    if(!ymIdx.has(ym)) ymIdx.set(ym, {ym:ym, fat:0, count:0});
    const x = ymIdx.get(ym);
    x.fat += d.fat_liq;
    x.count++;
  });
  const mediaMensal = Array.from(ymIdx.values()).map(function(m){
    return {ym:m.ym, media: m.count>0 ? m.fat/m.count : 0, count:m.count};
  }).sort(function(a,b){return a.ym<b.ym?-1:1;});

  let html = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Vendas <em>Diárias</em></h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>'+fI(dias.length)+' dias</strong> · '
       +   'período '+fDt(dias[0].data)+' a '+fDt(dias[dias.length-1].data)+' · '
       +   esc(escopoTxt)
       + '</div>';

  // Filtro de período (segmented buttons) — abate todos os blocos da página
  const opcoesPer = [
    {id:'todo', lbl:'Tudo'},
    {id:'30d',  lbl:'Últimos 30 dias'},
    {id:'90d',  lbl:'Últimos 90 dias'},
    {id:'6m',   lbl:'Últimos 6 meses'},
    {id:'12m',  lbl:'Últimos 12 meses'},
    {id:'ano-atual',    lbl:'Ano atual'},
    {id:'ano-anterior', lbl:'Ano anterior'},
  ];
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap;">';
  html += '<span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Período:</span>';
  opcoesPer.forEach(function(o){
    const ativo = o.id === periodoSel;
    html += '<button class="vd-per-btn" data-per="'+esc(o.id)+'" style="padding:6px 11px;font-size:11.5px;border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;'
         +   (ativo?'background:var(--accent);color:white;':'background:var(--surface);color:var(--text);')
         + 'font-weight:600;">'+esc(o.lbl)+'</button>';
  });
  html += '</div>';

  // KPIs
  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px;" id="kg-vd"></div>';

  // Linha 1: top 10 + bottom 10 dias
  html += '<div class="row2eq" style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">🏆 Top 10 maiores dias</div>'
       +      '<div class="ccs">Faturamento líquido consolidado</div>'
       +      '<div style="height:280px;"><canvas id="c-vd-top"></canvas></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">📉 Top 10 menores dias</div>'
       +      '<div class="ccs">Faturamento líquido consolidado</div>'
       +      '<div style="height:280px;"><canvas id="c-vd-bot"></canvas></div>'
       +    '</div>'
       + '</div>';

  // Linha 2: média mensal de fat diário
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cct">Média de faturamento diário por mês</div>'
       +    '<div class="ccs">R$ médios por dia trabalhado</div>'
       +    '<div style="height:240px;"><canvas id="c-vd-mensal"></canvas></div>'
       + '</div>';

  // Linha 3: dia da semana
  html += '<div style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Média por dia da semana</div>'
       +      '<div class="ccs">R$ médios por ocorrência do dia</div>'
       +      '<div style="height:260px;"><canvas id="c-vd-semana"></canvas></div>'
       +    '</div>'
       + '</div>';

  // Tabelas top 10 / bottom 10
  html += '<div class="row2eq" style="margin-bottom:12px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Top 10 dias (detalhe)</div>'
       +      '<div class="tscroll"><table class="t"><thead><tr>'
       +        '<th class="L" style="width:24px;">#</th><th class="L">Data</th>'
       +        '<th class="L">Dia</th><th>Fat. Líq.</th><th>NFs</th>'
       +      '</tr></thead><tbody id="tb-vd-top"></tbody></table></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">Bottom 10 dias (detalhe)</div>'
       +      '<div class="tscroll"><table class="t"><thead><tr>'
       +        '<th class="L" style="width:24px;">#</th><th class="L">Data</th>'
       +        '<th class="L">Dia</th><th>Fat. Líq.</th><th>NFs</th>'
       +      '</tr></thead><tbody id="tb-vd-bot"></tbody></table></div>'
       +    '</div>'
       + '</div>';

  html += '</div>';
  cont.innerHTML = html;

  // ─── KPIs ───
  const top1 = top10[0];
  const top1DataDt = top1 ? new Date(top1.data + 'T12:00:00') : null;
  document.getElementById('kg-vd').innerHTML = kgHtml([
    {l:'Média diária', v:fK(mediaFat), s:'desvio padrão ±'+fK(desvio)},
    {l:'Maior dia',    v:top1?fK(top1.fat_liq):'—', s:top1?(fDt(top1.data)+' · '+diaSemNome[top1DataDt.getDay()]):'',  cls:'hl'},
    {l:'Menor dia',    v:bot10[0]?fK(bot10[0].fat_liq):'—', s:bot10[0]?fDt(bot10[0].data):''},
    {l:'Total dias trabalhados', v:fI(dias.length), s:'cobertura completa'},
  ]);

  // ─── Chart top 10 ───
  mkC('c-vd-top', {type:'bar',
    data:{labels:top10.map(function(d){
      const dt = new Date(d.data+'T12:00:00');
      return fDt(d.data)+' ('+diaSemAbrev[dt.getDay()]+')';
    }), datasets:[{label:'Fat. Líq.', data:top10.map(function(d){return d.fat_liq;}),
      backgroundColor:_PAL.ok+'CC', borderRadius:3}]},
    options:{indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false}, tooltip:{callbacks:{label:function(ctx){return fB(ctx.raw);}}}},
      scales:{x:{ticks:{callback:function(v){return fAbbr(v);}}},
              y:{ticks:{font:{size:10}}}}}});

  // Chart bottom 10
  mkC('c-vd-bot', {type:'bar',
    data:{labels:bot10.map(function(d){
      const dt = new Date(d.data+'T12:00:00');
      return fDt(d.data)+' ('+diaSemAbrev[dt.getDay()]+')';
    }), datasets:[{label:'Fat. Líq.', data:bot10.map(function(d){return d.fat_liq;}),
      backgroundColor:_PAL.dn+'CC', borderRadius:3}]},
    options:{indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false}, tooltip:{callbacks:{label:function(ctx){return fB(ctx.raw);}}}},
      scales:{x:{ticks:{callback:function(v){return fAbbr(v);}}},
              y:{ticks:{font:{size:10}}}}}});

  // Mensal
  mkC('c-vd-mensal', {type:'bar',
    data:{labels:mediaMensal.map(function(m){return _ymToLabel(m.ym);}),
      datasets:[{label:'Média diária', data:mediaMensal.map(function(m){return m.media;}),
        backgroundColor:_PAL.ac+'CC', borderRadius:4}]},
    options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false},
               tooltip:{callbacks:{label:function(ctx){return 'Média: '+fB(ctx.raw)+' ('+mediaMensal[ctx.dataIndex].count+' dias)';}}}},
      scales:{y:{beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}},
              x:{grid:{display:false}, ticks:{maxRotation:60, minRotation:45, font:{size:9}}}}}});

  // Por dia da semana
  mkC('c-vd-semana', {type:'bar',
    data:{labels:porDiaSem.map(function(p){return p.abrev;}),
      datasets:[{label:'Média', data:porDiaSem.map(function(p){return p.media_fat;}),
        backgroundColor:porDiaSem.map(function(p,i){return i===0?_PAL.dn+'CC':i===6?_PAL.ok+'CC':_PAL.ac+'CC';}),
        borderRadius:4}]},
    options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false},
               tooltip:{callbacks:{label:function(ctx){
                 const p = porDiaSem[ctx.dataIndex];
                 const pctSem = totalSemana>0 ? p.fat/totalSemana*100 : 0;
                 return ['Média: '+fB(ctx.raw), p.count+' ocorrências', fP(pctSem)+' do total semanal'];
               }}}},
      scales:{y:{beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}},
              x:{grid:{display:false}}}}});

  // ─── Tabelas top 10 e bottom 10 ───
  function rowDay(d, i){
    const dt = new Date(d.data+'T12:00:00');
    return '<tr>'
      + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
      + '<td class="L"><strong>'+fDt(d.data)+'</strong></td>'
      + '<td class="L">'+diaSemNome[dt.getDay()]+'</td>'
      + '<td class="val-strong">'+fK(d.fat_liq)+'</td>'
      + '<td class="val-dim">'+fI(d.nfs)+'</td>'
      + '</tr>';
  }
  document.getElementById('tb-vd-top').innerHTML = top10.map(rowDay).join('');
  document.getElementById('tb-vd-bot').innerHTML = bot10.map(rowDay).join('');

  // Bind dos filtros de período: clicar re-renderiza a página inteira com a faixa nova
  document.querySelectorAll('.vd-per-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      window._vdPeriodo = btn.getAttribute('data-per');
      renderVDiarias();
    });
  });
}

// ────────────────────────────────────────────────────────────────────
// V DIAS C&P (sub-etapa 4c.4)
// Heurística: identifica "dias atípicos" (provavelmente promocionais)
// como aqueles com fat > 1.5× a média do mesmo dia da semana.
// Quando o cliente fornecer calendário oficial, substituir essa lógica.
// ────────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════
// DIAS C&P · v4.32 · análise de eventos de oferta
// Reescrita conforme dash.solucoesr2.com.br/gpc.html (escopo etapa 8)
// O usuário cadastra os dias C&P de cada mês e loja.
// O sistema calcula premium (% acima dos dias normais), influência mensal etc.
// ════════════════════════════════════════════════════════════════════════

// Estado global da página Dias C&P (v4.71: filtra entre as 4 filiais com C&P)
let _dcpFiltroLoja = 'ATP-V';
let _dcpDiasCadastrados = {};      // {loja: {ym: ['YYYY-MM-DD', ...]}}
let _dcpFirestoreCarregado = false;

// Carrega dias cadastrados do Firestore
async function _dcpCarregarFirestore(){
  if(_dcpFirestoreCarregado) return;
  try {
    const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
    if(!auth || !auth.currentUser){ _dcpFirestoreCarregado = true; return; }
    const db = firebase.firestore();
    const snap = await db.collection('dias_cp').get();
    _dcpDiasCadastrados = {};
    snap.forEach(function(doc){
      const d = doc.data();
      const id = doc.id; // formato: 'LOJA_YYYY-MM' ex: 'ATP-V_2026-04'
      const partes = id.split('_');
      if(partes.length < 2) return;
      const ym = partes[partes.length-1];
      const loja = partes.slice(0, -1).join('_');
      if(!_dcpDiasCadastrados[loja]) _dcpDiasCadastrados[loja] = {};
      _dcpDiasCadastrados[loja][ym] = d.dias || [];
    });
    _dcpFirestoreCarregado = true;
    // Sempre tenta carregar o seed: a fn é idempotente por (loja,ym)
    await _dcpTentarCarregarSeed();
  } catch(e){
    console.warn('[dcp] erro carregando:', e);
    _dcpFirestoreCarregado = true;
  }
}

// Carrega dias_cp_seed.json (estático no dist) e grava cada (loja,ym) faltante
// no Firestore. Idempotente: só cria docs que ainda não existem.
async function _dcpTentarCarregarSeed(){
  try {
    const resp = await fetch('dias_cp_seed.json?ts='+Date.now());
    if(!resp.ok) return;
    const seed = await resp.json();
    const dpl = seed && seed.dias_por_loja_ym;
    if(!dpl) return;
    let importou = 0;
    const promises = [];
    Object.keys(dpl).forEach(function(loja){
      Object.keys(dpl[loja] || {}).forEach(function(ym){
        const dias = dpl[loja][ym];
        if(!dias || !dias.length) return;
        // Só importa se ainda não existir
        if(_dcpDiasCadastrados[loja] && _dcpDiasCadastrados[loja][ym]) return;
        promises.push(_dcpSalvar(loja, ym, dias).then(function(ok){ if(ok) importou++; }));
      });
    });
    await Promise.all(promises);
    if(importou > 0){
      console.log('[dcp] seed inicial: '+importou+' (loja,mês) importados');
    }
  } catch(e){
    console.warn('[dcp] seed indisponível:', e.message);
  }
}

// Salva dias para uma loja+mês no Firestore
async function _dcpSalvar(loja, ym, dias){
  try {
    const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
    if(!auth || !auth.currentUser){ alert('Faça login para salvar.'); return false; }
    const db = firebase.firestore();
    const id = loja+'_'+ym;
    if(dias && dias.length){
      await db.collection('dias_cp').doc(id).set({
        loja: loja, ym: ym, dias: dias,
        atualizadoEm: firebase.firestore.FieldValue.serverTimestamp(),
        atualizadoPor: auth.currentUser.email || auth.currentUser.uid
      });
    } else {
      await db.collection('dias_cp').doc(id).delete();
    }
    if(!_dcpDiasCadastrados[loja]) _dcpDiasCadastrados[loja] = {};
    _dcpDiasCadastrados[loja][ym] = dias;
    return true;
  } catch(e){
    console.warn('[dcp] erro salvando:', e);
    alert('Erro ao salvar: '+(e.message || e.code || 'desconhecido'));
    return false;
  }
}

// Mapeamento de label de loja (v4.71: 4 filiais com C&P ativo)
const _DCP_LOJAS = [
  {cod:'ATP-V', label:'ATP - Varejo'},
  {cod:'ATP-A', label:'ATP - Atacado'},
  {cod:'CP3',   label:'Cestão L1'},
  {cod:'CP5',   label:'Inhambupe'}
];

// Calcula métricas por loja a partir de V.diario + dias cadastrados
// Retorna: {meses: [{ym, dias_cp, fat_dias_cp, fat_dias_normais, num_dias_normais,
//                     premium_pct, repres_pct, melhor_dia: {data, fat}}],
//           total: {fat_dias_cp, num_eventos, num_dias, premium_medio,
//                   media_dia_cp, media_dia_normal, repres_media, melhor_evento}}
function _dcpCalcular(lojaCod){
  const diario = (V && V.diario) || [];
  // Filtra por loja (se GRUPO, agrega tudo por dia)
  let porData;
  if(lojaCod === 'GRUPO'){
    porData = new Map();
    diario.forEach(function(r){
      if(!r.data) return;
      if(!porData.has(r.data)) porData.set(r.data, {data:r.data, fat:0});
      porData.get(r.data).fat += r.fat_liq || 0;
    });
  } else {
    porData = new Map();
    diario.filter(function(r){return r.loja === lojaCod;}).forEach(function(r){
      if(!r.data) return;
      if(!porData.has(r.data)) porData.set(r.data, {data:r.data, fat:r.fat_liq || 0});
    });
  }

  // Pega dias cadastrados para esta loja (se GRUPO, usa união de todas as lojas)
  let diasCpSet = new Set();
  if(lojaCod === 'GRUPO'){
    Object.keys(_dcpDiasCadastrados).forEach(function(lj){
      Object.keys(_dcpDiasCadastrados[lj] || {}).forEach(function(ym){
        (_dcpDiasCadastrados[lj][ym] || []).forEach(function(d){ diasCpSet.add(d); });
      });
    });
  } else {
    const dl = _dcpDiasCadastrados[lojaCod] || {};
    Object.keys(dl).forEach(function(ym){
      (dl[ym] || []).forEach(function(d){ diasCpSet.add(d); });
    });
  }

  // Agrupa por mês
  const porMes = new Map();
  porData.forEach(function(r){
    const ym = r.data.substring(0,7);
    if(!porMes.has(ym)) porMes.set(ym, {ym:ym, dias_cp_lista:[], dias_normais_lista:[]});
    const m = porMes.get(ym);
    if(diasCpSet.has(r.data)) m.dias_cp_lista.push(r);
    else m.dias_normais_lista.push(r);
  });

  // Calcula métricas por mês
  const meses = [];
  let totFatCp = 0, totDiasCp = 0, totEventos = 0, totRepres = 0, totMesesComCp = 0;
  let melhorEvento = {fat:0, ym:'', dias:[]};
  let premiumSum = 0, premiumCount = 0;
  let mediaDiaCpSum = 0, mediaDiaCpCount = 0;
  let mediaDiaNormalSum = 0, mediaDiaNormalCount = 0;

  Array.from(porMes.values()).sort(function(a,b){return a.ym.localeCompare(b.ym);}).forEach(function(m){
    const fatCp = m.dias_cp_lista.reduce(function(s,r){return s+r.fat;}, 0);
    const fatNm = m.dias_normais_lista.reduce(function(s,r){return s+r.fat;}, 0);
    const fatTot = fatCp + fatNm;
    const mediaCp = m.dias_cp_lista.length > 0 ? fatCp / m.dias_cp_lista.length : 0;
    const mediaNm = m.dias_normais_lista.length > 0 ? fatNm / m.dias_normais_lista.length : 0;
    const premium = mediaNm > 0 ? ((mediaCp / mediaNm - 1) * 100) : null;
    const repres = fatTot > 0 ? (fatCp / fatTot * 100) : 0;
    const melhorDia = m.dias_cp_lista.slice().sort(function(a,b){return b.fat - a.fat;})[0] || null;

    meses.push({
      ym: m.ym,
      num_dias_cp: m.dias_cp_lista.length,
      datas_cp: m.dias_cp_lista.map(function(r){return r.data;}).sort(),
      num_dias_normais: m.dias_normais_lista.length,
      fat_dias_cp: fatCp,
      fat_dias_normais: fatNm,
      fat_total: fatTot,
      media_dia_cp: mediaCp,
      media_dia_normal: mediaNm,
      premium_pct: premium,
      repres_pct: repres,
      melhor_dia: melhorDia
    });

    if(m.dias_cp_lista.length > 0){
      totFatCp += fatCp;
      totDiasCp += m.dias_cp_lista.length;
      totEventos += 1;
      totRepres += repres;
      totMesesComCp += 1;
      if(premium != null){ premiumSum += premium; premiumCount += 1; }
      mediaDiaCpSum += fatCp; mediaDiaCpCount += m.dias_cp_lista.length;
      mediaDiaNormalSum += fatNm; mediaDiaNormalCount += m.dias_normais_lista.length;
      if(fatCp > melhorEvento.fat){
        melhorEvento = {fat:fatCp, ym:m.ym, dias:m.dias_cp_lista.map(function(r){return r.data;}).sort(), premium:premium};
      }
    }
  });

  return {
    meses: meses,
    total: {
      fat_dias_cp: totFatCp,
      num_eventos: totEventos,
      num_dias: totDiasCp,
      premium_medio: premiumCount > 0 ? premiumSum / premiumCount : 0,
      media_dia_cp: mediaDiaCpCount > 0 ? mediaDiaCpSum / mediaDiaCpCount : 0,
      media_dia_normal: mediaDiaNormalCount > 0 ? mediaDiaNormalSum / mediaDiaNormalCount : 0,
      repres_media: totMesesComCp > 0 ? totRepres / totMesesComCp : 0,
      melhor_evento: melhorEvento
    }
  };
}

// Top N melhores dias individuais (entre os dias C&P)
function _dcpTopDias(lojaCod, n){
  const diario = (V && V.diario) || [];
  let dadosDia;
  if(lojaCod === 'GRUPO'){
    dadosDia = new Map();
    diario.forEach(function(r){
      if(!dadosDia.has(r.data)) dadosDia.set(r.data, {data:r.data, fat:0});
      dadosDia.get(r.data).fat += r.fat_liq || 0;
    });
    dadosDia = Array.from(dadosDia.values());
  } else {
    dadosDia = diario.filter(function(r){return r.loja === lojaCod;}).map(function(r){return {data:r.data, fat:r.fat_liq||0};});
  }

  let diasCpSet = new Set();
  if(lojaCod === 'GRUPO'){
    Object.keys(_dcpDiasCadastrados).forEach(function(lj){
      Object.keys(_dcpDiasCadastrados[lj] || {}).forEach(function(ym){
        (_dcpDiasCadastrados[lj][ym] || []).forEach(function(d){ diasCpSet.add(d); });
      });
    });
  } else {
    const dl = _dcpDiasCadastrados[lojaCod] || {};
    Object.keys(dl).forEach(function(ym){
      (dl[ym] || []).forEach(function(d){ diasCpSet.add(d); });
    });
  }

  return dadosDia.filter(function(r){return diasCpSet.has(r.data);})
                 .sort(function(a,b){return b.fat - a.fat;})
                 .slice(0, n);
}

// Top N melhores eventos (eventos = grupo de dias seguidos no mesmo mês)
function _dcpTopEventos(lojaCod, n){
  const calc = _dcpCalcular(lojaCod);
  return calc.meses.filter(function(m){return m.num_dias_cp > 0;})
                   .sort(function(a,b){return b.fat_dias_cp - a.fat_dias_cp;})
                   .slice(0, n);
}

function renderVDiasCP(){
  const cont = document.getElementById('page-v-dias-cp');
  if(!cont) return;

  const diario = (V && V.diario) || [];
  if(!diario.length){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Dias <em>C &amp; P</em> — Análise de oferta</h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc">'+_emptyState('Sem dados diários carregados', 'Esta análise depende do agregado diário de vendas. Confira a página de Processamento.')+'</div></div>';
    return;
  }

  // Carrega dias cadastrados do Firestore (assíncrono)
  _dcpCarregarFirestore().then(function(){ _dcpRenderConteudo(); });

  // Render inicial vazio enquanto carrega
  cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Dias <em>C &amp; P</em> — Análise de oferta</h2></div>'
    + '<div class="ph-sep"></div><div class="page-body" id="dcp-body">'
    + '<div style="text-align:center;color:var(--text-muted);padding:30px;">Carregando dias cadastrados...</div>'
    + '</div>';
}

function _dcpRenderConteudo(){
  const body = document.getElementById('dcp-body');
  if(!body) return;

  // v4.71: sempre as 4 filiais com C&P (sem filtragem pelo diário — a base
  // ativa pode não ter todas, mas as abas mostram a lista oficial).
  const lojasNoDiario = new Set();
  (V.diario || []).forEach(function(r){ if(r.loja) lojasNoDiario.add(r.loja); });
  const lojasDispon = _DCP_LOJAS.filter(function(l){return lojasNoDiario.has(l.cod);});
  // Se o filtro atual não está disponível na base, troca para a primeira disponível
  if(lojasDispon.length && !lojasDispon.find(function(l){return l.cod === _dcpFiltroLoja;})){
    _dcpFiltroLoja = lojasDispon[0].cod;
  }

  let html = '';

  // ─── Seletor de loja ───
  html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">';
  lojasDispon.forEach(function(l){
    const ativo = (l.cod === _dcpFiltroLoja);
    html += '<button class="dcp-tab" data-loja="'+esc(l.cod)+'" '
      + 'style="padding:7px 14px;border-radius:18px;border:1px solid '
      + (ativo?'var(--accent)':'var(--border-strong)')+';background:'
      + (ativo?'var(--accent)':'var(--surface)')+';color:'+(ativo?'#fff':'var(--text)')
      + ';cursor:pointer;font-size:12px;font-weight:600;">'
      + esc(l.label) + '</button>';
  });
  html += '</div>';

  // ─── Cabeçalho do escopo + botão "Cadastrar dias" ───
  const lojaInfo = _DCP_LOJAS.find(function(l){return l.cod === _dcpFiltroLoja;}) || {label:_dcpFiltroLoja};
  const calc = _dcpCalcular(_dcpFiltroLoja);
  const tot = calc.total;

  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;">';
  html += '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Resultado · '+esc(lojaInfo.label)+'</div>';
  html += '<button id="dcp-cadastrar" style="padding:6px 12px;background:var(--accent);color:white;border:none;border-radius:5px;font-weight:700;cursor:pointer;font-size:11.5px;">📅 Cadastrar dias C&amp;P</button>';
  html += '</div>';

  // ─── KPIs (4) ───
  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px;">';
  if(tot.num_eventos === 0){
    html += '<div class="kc" style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-muted);">'
      + '<div style="font-size:32px;margin-bottom:8px;opacity:.4;">📅</div>'
      + '<div style="font-size:14px;font-weight:600;margin-bottom:4px;color:var(--text);">Nenhum dia C&amp;P cadastrado para esta loja</div>'
      + '<div style="font-size:11.5px;line-height:1.5;">Clique em "Cadastrar dias C&amp;P" acima para informar quais foram as datas de oferta. O sistema vai calcular automaticamente o premium e a representatividade.</div>'
      + '</div>';
  } else {
    html += '<div class="kc"><div class="kl">Total faturado em Dias C&amp;P</div>'
      + '<div class="kv">'+fK(tot.fat_dias_cp)+'</div>'
      + '<div class="ku">'+fI(tot.num_dias)+' dias · '+fI(tot.num_eventos)+' eventos</div></div>';
    html += '<div class="kc"><div class="kl">Premium médio</div>'
      + '<div class="kv">'+(tot.premium_medio>=0?'+':'')+fP(tot.premium_medio)+'</div>'
      + '<div class="ku">faturamento médio acima dos dias normais</div></div>';
    const me = tot.melhor_evento;
    html += '<div class="kc"><div class="kl">Melhor evento</div>'
      + '<div class="kv">'+fK(me.fat)+'</div>'
      + '<div class="ku">'+fI(me.dias.length)+' dias de '+_ymToLabel(me.ym)+'</div></div>';
    html += '<div class="kc"><div class="kl">Média rep. no mês</div>'
      + '<div class="kv">'+fP(tot.repres_media)+'</div>'
      + '<div class="ku">do faturamento mensal</div></div>';
  }
  html += '</div>';

  if(tot.num_eventos === 0){
    body.innerHTML = html;
    _dcpBindEventos();
    return;
  }

  // ─── Box explicativo do Premium ───
  html += '<div style="background:#f3f4f6;border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;margin-bottom:14px;font-size:12px;line-height:1.6;color:var(--text-dim);">'
    + '<strong style="color:var(--text);">💡 O que é o "Premium"?</strong><br>'
    + 'É a diferença percentual entre a venda média de cada Dia C&amp;P e a média dos dias normais do mesmo mês. '
    + 'Exemplo: se o mês teve média de R$200k/dia e os dias de oferta venderam R$320k/dia em média, o premium é <strong>+60%</strong>. '
    + 'Quanto maior o premium, maior o poder de atração dos dias de oferta.'
    + '</div>';

  // ─── Gráfico: Total faturado nos dias C&P por mês ───
  html += '<div class="cc" style="margin-bottom:14px;">'
    + '<div class="cct">Total faturado nos dias de oferta · '+esc(lojaInfo.label)+' por mês (R$k)</div>'
    + '<div class="ccs">Soma do faturamento dos dias C&amp;P</div>'
    + '<div style="height:280px;margin-top:8px;"><canvas id="dcp-chart-mensal"></canvas></div>'
    + '</div>';

  // ─── Gráfico: Premium % por mês ───
  html += '<div class="cc" style="margin-bottom:14px;">'
    + '<div class="cct">Premium dos dias de oferta (%) · evolução mensal</div>'
    + '<div class="ccs">% acima da média dos dias normais do mesmo mês — ex: +100% = os dias de oferta faturaram o dobro dos dias comuns</div>'
    + '<div style="height:260px;margin-top:8px;"><canvas id="dcp-chart-premium"></canvas></div>'
    + '</div>';

  // ─── Gráfico: Influência (% repres) por mês ───
  html += '<div class="cc" style="margin-bottom:14px;">'
    + '<div class="cct">Influência dos dias de oferta no faturamento mensal (%)</div>'
    + '<div class="ccs">3 dias representando até 25% do mês — eficiência operacional</div>'
    + '<div style="height:260px;margin-top:8px;"><canvas id="dcp-chart-repres"></canvas></div>'
    + '</div>';

  // ─── v4.76 fix24: Top 3 dias + Top 3 eventos lado a lado (row2eq) ───
  const top3Dias = _dcpTopDias(_dcpFiltroLoja, 3);
  const top3Eventos = _dcpTopEventos(_dcpFiltroLoja, 3);
  if(top3Dias.length || top3Eventos.length){
    html += '<div class="row2eq" style="margin-bottom:14px;align-items:stretch;">';
    if(top3Dias.length){
      html += '<div class="cc" style="margin-bottom:0;">'
        + '<div class="cct">🏆 Top 3 — Melhores dias individuais</div>'
        + '<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;">';
      const medalhas = ['🥇','🥈','🥉'];
      top3Dias.forEach(function(d, i){
        const dt = new Date(d.data+'T12:00:00');
        const dn = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][dt.getDay()];
        const ymL = _ymToLabel(d.data.substring(0,7));
        html += '<div style="display:flex;align-items:center;gap:14px;padding:10px;background:var(--surface-2);border-radius:6px;">'
          + '<div style="font-size:24px;">'+medalhas[i]+'</div>'
          + '<div style="flex:1;min-width:0;">'
          +   '<div style="font-size:18px;font-weight:800;color:var(--text);">'+fK(d.fat)+'</div>'
          +   '<div style="font-size:11.5px;color:var(--text-muted);">'+fDt(d.data)+' · '+dn+' · '+esc(ymL)+'</div>'
          + '</div>'
          + '</div>';
      });
      html += '</div></div>';
    }
    if(top3Eventos.length){
      html += '<div class="cc" style="margin-bottom:0;">'
        + '<div class="cct">🥇 Top 3 — Melhores eventos (3 dias)</div>'
        + '<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;">';
      const medalhas2 = ['🥇','🥈','🥉'];
      top3Eventos.forEach(function(ev, i){
        const datasCurta = ev.datas_cp.map(function(d){return fDt(d);}).join(' · ');
        const ymL = _ymToLabel(ev.ym);
        const premiumStr = ev.premium_pct != null ? ' · Premium '+(ev.premium_pct>=0?'+':'')+fP(ev.premium_pct,0) : '';
        html += '<div style="display:flex;align-items:center;gap:14px;padding:10px;background:var(--surface-2);border-radius:6px;">'
          + '<div style="font-size:24px;">'+medalhas2[i]+'</div>'
          + '<div style="flex:1;min-width:0;">'
          +   '<div style="font-size:18px;font-weight:800;color:var(--text);">'+fK(ev.fat_dias_cp)+' <span style="font-size:11px;color:var(--text-muted);font-weight:400;">'+ev.num_dias_cp+' dias</span></div>'
          +   '<div style="font-size:11.5px;color:var(--text-muted);">'+esc(datasCurta)+' · '+esc(ymL)+esc(premiumStr)+'</div>'
          + '</div>'
          + '</div>';
      });
      html += '</div></div>';
    }
    html += '</div>';
  }

  // ─── Tabela histórico completo ───
  html += '<div class="cc" style="margin-bottom:14px;">'
    + '<div class="cct">Histórico completo — '+esc(lojaInfo.label)+'</div>'
    + '<div class="tscroll" style="margin-top:8px;">'
    + '<table class="t"><thead><tr>'
    + '<th class="L">Mês</th>'
    + '<th class="L">Dias</th>'
    + '<th>Total dias C&amp;P</th>'
    + '<th title="% acima da média dos dias normais do mesmo mês">Premium</th>'
    + '<th>% do mês</th>'
    + '<th class="L">Melhor dia</th>'
    + '<th>Valor</th>'
    + '</tr></thead><tbody>';
  calc.meses.slice().reverse().forEach(function(m){
    if(m.num_dias_cp === 0) return;
    const datasCurta = m.datas_cp.map(function(d){return d.substring(8,10);}).join(' · ');
    const premium = m.premium_pct;
    const premCls = premium == null ? '' : (premium >= 100 ? 'ok' : premium >= 50 ? 'hl' : '');
    const melhor = m.melhor_dia;
    let melhorTxt = '—', melhorVal = '—';
    if(melhor){
      const dt = new Date(melhor.data+'T12:00:00');
      const dn = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][dt.getDay()];
      melhorTxt = fDt(melhor.data)+' · '+dn;
      melhorVal = fK(melhor.fat);
    }
    html += '<tr>'
      + '<td class="L"><strong>'+_ymToLabel(m.ym)+'</strong></td>'
      + '<td class="L" style="color:var(--text-muted);font-size:11px;">'+esc(datasCurta)+'</td>'
      + '<td class="val-strong">'+fK(m.fat_dias_cp)+'</td>'
      + '<td><span class="kg-tag '+premCls+'">'+(premium == null ? '—' : (premium >= 0 ? '+' : '')+fP(premium,0))+'</span></td>'
      + '<td>'+fP(m.repres_pct,1)+'</td>'
      + '<td class="L">'+esc(melhorTxt)+'</td>'
      + '<td>'+melhorVal+'</td>'
      + '</tr>';
  });
  html += '</tbody></table></div></div>';

  body.innerHTML = html;

  // ─── Renderiza gráficos ───
  _dcpRenderGraficos(calc);

  // ─── Bind eventos ───
  _dcpBindEventos();
}

function _dcpRenderGraficos(calc){
  const meses = calc.meses.filter(function(m){return m.fat_total > 0;});
  const labels = meses.map(function(m){return _ymToLabel(m.ym);});

  // Gráfico 1: Total faturado nos dias C&P por mês
  const cMensal = document.getElementById('dcp-chart-mensal');
  if(cMensal){
    mkC('dcp-chart-mensal', {
      type: 'bar',
      data: {labels: labels, datasets: [{
        label: 'Faturamento Dias C&P',
        data: meses.map(function(m){return m.fat_dias_cp;}),
        backgroundColor: '#f58634CC',
        borderRadius: 4
      }]},
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {display: false},
          tooltip: {callbacks: {label: function(ctx){
            const m = meses[ctx.dataIndex];
            return [fK(ctx.raw), fI(m.num_dias_cp)+' dias · '+fP(m.repres_pct,1)+' do mês'];
          }}}
        },
        scales: {
          x: {grid: {display: false}, ticks: {font: {size: 10}, maxRotation: 45}},
          y: {ticks: {callback: function(v){return fAbbr(v);}}}
        }
      }
    });
  }

  // Gráfico 2: Premium % por mês
  const cPremium = document.getElementById('dcp-chart-premium');
  if(cPremium){
    mkC('dcp-chart-premium', {
      type: 'line',
      data: {labels: labels, datasets: [{
        label: 'Premium (%)',
        data: meses.map(function(m){return m.premium_pct == null ? 0 : m.premium_pct;}),
        borderColor: '#1a2f5c',
        backgroundColor: 'rgba(26,47,92,0.10)',
        borderWidth: 2.5,
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#1a2f5c'
      }]},
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {display: false},
          tooltip: {callbacks: {label: function(ctx){return (ctx.raw>=0?'+':'')+fP(ctx.raw,1);}}}
        },
        scales: {
          x: {grid: {display: false}, ticks: {font: {size: 10}, maxRotation: 45}},
          y: {ticks: {callback: function(v){return (v>=0?'+':'')+fP(v,0);}}}
        }
      }
    });
  }

  // Gráfico 3: Representatividade % por mês
  const cRepres = document.getElementById('dcp-chart-repres');
  if(cRepres){
    mkC('dcp-chart-repres', {
      type: 'bar',
      data: {labels: labels, datasets: [{
        label: 'Repres. (%)',
        data: meses.map(function(m){return m.repres_pct;}),
        backgroundColor: '#1a2f5cCC',
        borderRadius: 4
      }]},
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {display: false},
          tooltip: {callbacks: {label: function(ctx){return fP(ctx.raw,1)+' do mês';}}}
        },
        scales: {
          x: {grid: {display: false}, ticks: {font: {size: 10}, maxRotation: 45}},
          y: {ticks: {callback: function(v){return fP(v,0);}}}
        }
      }
    });
  }
}

function _dcpBindEventos(){
  // Tabs de loja
  document.querySelectorAll('.dcp-tab').forEach(function(btn){
    btn.addEventListener('click', function(){
      _dcpFiltroLoja = btn.getAttribute('data-loja');
      _dcpRenderConteudo();
    });
  });

  // Botão cadastrar
  const btnCad = document.getElementById('dcp-cadastrar');
  if(btnCad){
    btnCad.addEventListener('click', function(){
      _dcpAbrirCadastroUI();
    });
  }
}

// UI modal de cadastro de dias C&P (v4.71: sem seleção de loja — os dias
// são os mesmos pras 4 filiais com C&P (ATP-V, ATP-A, CP3, CP5). Usuário
// escolhe mês e intervalo DE → ATÉ. Lista os meses cadastrados pra edição.
function _dcpAbrirCadastroUI(){
  // Lista todos os meses disponíveis no diário (qualquer loja)
  const mesesNoDiario = new Set();
  (V.diario || []).forEach(function(r){
    if(r.data) mesesNoDiario.add(r.data.substring(0,7));
  });
  // Inclui também meses já cadastrados (mesmo se não estão mais no diário)
  _DCP_LOJAS.forEach(function(l){
    const atual = _dcpDiasCadastrados[l.cod] || {};
    Object.keys(atual).forEach(function(ym){ if(ym && ym.indexOf('2026') === 0) mesesNoDiario.add(ym); });
  });
  // Restringe a 2026 (foco operacional atual)
  const mesesOrd = Array.from(mesesNoDiario).filter(function(ym){return ym.indexOf('2026') === 0;}).sort();

  // Referência (usa ATP-V — todas as 4 lojas têm o mesmo conjunto, por design)
  const _diasRefAtuais = _dcpDiasCadastrados['ATP-V'] || {};

  // Funções utilitárias do modal (declaradas no escopo do _dcpAbrirCadastroUI)
  function _diasDoMes(ym){
    const a = parseInt(ym.substring(0,4),10);
    const m = parseInt(ym.substring(5,7),10);
    return new Date(a, m, 0).getDate();
  }
  function _gerarIntervalo(ym, de, ate){
    const out = [];
    const lim = _diasDoMes(ym);
    let a = Math.max(1, de|0), b = Math.min(lim, ate|0);
    if(a > b){ const t=a; a=b; b=t; }
    for(let d = a; d <= b; d++){
      out.push(ym + '-' + String(d).padStart(2,'0'));
    }
    return out;
  }

  // Modal
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = '<div style="background:white;border-radius:10px;max-width:680px;width:100%;max-height:90vh;overflow-y:auto;padding:22px;box-shadow:0 10px 40px rgba(0,0,0,.3);">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    +   '<h3 style="margin:0;font-size:16px;font-weight:700;color:var(--text);">Cadastrar dias C&amp;P</h3>'
    +   '<button id="dcp-modal-close" style="background:transparent;border:none;cursor:pointer;font-size:18px;color:var(--text-muted);padding:4px;">✕</button>'
    + '</div>'
    + '<div style="font-size:11.5px;color:var(--text-muted);margin-bottom:14px;line-height:1.5;">'
    +   'Os dias C&amp;P são os mesmos para as 4 filiais (ATP-V, ATP-A, Cestão L1, Inhambupe). Escolha o mês, informe a data <strong>de</strong> e <strong>até</strong>, e salve. Para editar, basta abrir um mês já cadastrado.'
    + '</div>'
    + '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:16px;">'
    +   '<div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">Novo cadastro / edição</div>'
    +   '<div style="display:grid;grid-template-columns:1fr 90px 90px auto;gap:8px;align-items:end;">'
    +     '<div><label style="display:block;font-size:10px;color:var(--text-muted);margin-bottom:3px;">Mês</label>'
    +       '<select id="dcp-novo-ym" style="width:100%;padding:7px 8px;border:1px solid var(--border-strong);border-radius:5px;font-size:12px;background:white;">'
    +         mesesOrd.map(function(ym){return '<option value="'+esc(ym)+'">'+_ymToLabel(ym)+'</option>';}).join('')
    +       '</select></div>'
    +     '<div><label style="display:block;font-size:10px;color:var(--text-muted);margin-bottom:3px;">De (dia)</label>'
    +       '<input id="dcp-novo-de" type="number" min="1" max="31" placeholder="ex 4" style="width:100%;padding:7px 8px;border:1px solid var(--border-strong);border-radius:5px;font-size:12px;"></div>'
    +     '<div><label style="display:block;font-size:10px;color:var(--text-muted);margin-bottom:3px;">Até (dia)</label>'
    +       '<input id="dcp-novo-ate" type="number" min="1" max="31" placeholder="ex 6" style="width:100%;padding:7px 8px;border:1px solid var(--border-strong);border-radius:5px;font-size:12px;"></div>'
    +     '<button id="dcp-novo-aplicar" style="padding:8px 14px;background:var(--accent);color:white;border:none;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;">Aplicar</button>'
    +   '</div>'
    +   '<div id="dcp-novo-preview" style="margin-top:8px;font-size:11px;color:var(--text-muted);min-height:14px;"></div>'
    + '</div>'
    + '<div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">Meses cadastrados</div>'
    + '<div id="dcp-modal-body" style="display:flex;flex-direction:column;gap:8px;"></div>'
    + '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px;border-top:1px solid var(--border);padding-top:12px;">'
    +   '<button id="dcp-modal-cancel" style="padding:8px 16px;border:1px solid var(--border-strong);background:white;border-radius:5px;cursor:pointer;font-size:12px;">Fechar</button>'
    +   '<button id="dcp-modal-save" style="padding:8px 16px;background:var(--accent);color:white;border:none;border-radius:5px;cursor:pointer;font-size:12px;font-weight:700;">Salvar nas 4 filiais</button>'
    + '</div>'
    + '</div>';
  document.body.appendChild(overlay);

  // Estado interno do modal: edits[ym] = ['YYYY-MM-DD', ...]
  const edits = {};
  mesesOrd.forEach(function(ym){
    edits[ym] = (_diasRefAtuais[ym] || []).slice();
  });

  const modalBody = document.getElementById('dcp-modal-body');
  function _redesenhaLista(){
    if(!mesesOrd.length){
      modalBody.innerHTML = '<div style="padding:14px;text-align:center;color:var(--text-muted);font-size:12px;">Nenhum mês de 2026 disponível.</div>';
      return;
    }
    let h = '';
    mesesOrd.forEach(function(ym){
      const dias = edits[ym] || [];
      const ddList = dias.map(function(d){return d.substring(8,10);}).sort().join(', ');
      const vazio = !dias.length;
      h += '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:'+(vazio?'transparent':'var(--surface-2)')+';border:1px solid var(--border);border-radius:6px;">'
        +   '<div style="min-width:90px;font-weight:700;font-size:12.5px;color:var(--text);">'+_ymToLabel(ym)+'</div>'
        +   '<div style="flex:1;font-family:JetBrains Mono,monospace;font-size:12px;color:'+(vazio?'var(--text-muted)':'var(--text)')+';">'+(vazio?'(sem dias)':esc(ddList))+'</div>'
        +   '<button class="dcp-clear-mes" data-ym="'+esc(ym)+'" style="padding:4px 10px;border:1px solid var(--border-strong);background:white;color:var(--text-muted);border-radius:4px;cursor:pointer;font-size:11px;" title="Limpar dias deste mês">Limpar</button>'
        + '</div>';
    });
    modalBody.innerHTML = h;
    modalBody.querySelectorAll('.dcp-clear-mes').forEach(function(b){
      b.addEventListener('click', function(){
        const ym = b.getAttribute('data-ym');
        edits[ym] = [];
        _redesenhaLista();
      });
    });
  }
  _redesenhaLista();

  // Botão "Aplicar" (gera intervalo e adiciona ao mês selecionado)
  const inpDe   = document.getElementById('dcp-novo-de');
  const inpAte  = document.getElementById('dcp-novo-ate');
  const selYm   = document.getElementById('dcp-novo-ym');
  const preview = document.getElementById('dcp-novo-preview');
  function _atualizaPreview(){
    const ym = selYm.value;
    const de = parseInt(inpDe.value, 10);
    const ate = parseInt(inpAte.value, 10);
    if(!ym || isNaN(de) || isNaN(ate)){ preview.textContent = 'Preencha mês, de e até.'; return; }
    const lim = _diasDoMes(ym);
    if(de < 1 || ate < 1 || de > lim || ate > lim){
      preview.textContent = 'Dias fora do mês ('+_ymToLabel(ym)+' tem '+lim+' dias).';
      return;
    }
    const range = _gerarIntervalo(ym, de, ate);
    preview.textContent = range.length+' dia(s): '+range.map(function(d){return d.substring(8,10);}).join(', ');
  }
  selYm.addEventListener('change', _atualizaPreview);
  inpDe.addEventListener('input', _atualizaPreview);
  inpAte.addEventListener('input', _atualizaPreview);

  document.getElementById('dcp-novo-aplicar').addEventListener('click', function(){
    const ym = selYm.value;
    const de = parseInt(inpDe.value, 10);
    const ate = parseInt(inpAte.value, 10);
    if(!ym || isNaN(de) || isNaN(ate)){ alert('Preencha mês, de e até.'); return; }
    const range = _gerarIntervalo(ym, de, ate);
    // Mescla com o que já existe pro mês (sem duplicar)
    const set = new Set(edits[ym] || []);
    range.forEach(function(d){set.add(d);});
    edits[ym] = Array.from(set).sort();
    _redesenhaLista();
    preview.textContent = 'Aplicado: '+range.length+' dia(s) adicionado(s) em '+_ymToLabel(ym)+'.';
    inpDe.value = ''; inpAte.value = '';
  });

  // Fechar
  function _close(){ overlay.remove(); }
  document.getElementById('dcp-modal-close').addEventListener('click', _close);
  document.getElementById('dcp-modal-cancel').addEventListener('click', _close);

  // Salvar nas 4 filiais
  document.getElementById('dcp-modal-save').addEventListener('click', async function(){
    const tarefas = [];
    mesesOrd.forEach(function(ym){
      const novoSorted = (edits[ym] || []).slice().sort();
      _DCP_LOJAS.forEach(function(l){
        const atual = ((_dcpDiasCadastrados[l.cod] || {})[ym] || []).slice().sort();
        if(atual.join(',') !== novoSorted.join(',')){
          tarefas.push(_dcpSalvar(l.cod, ym, novoSorted));
        }
      });
    });
    if(!tarefas.length){ _close(); return; }
    const btn = document.getElementById('dcp-modal-save');
    btn.textContent = 'Salvando...'; btn.disabled = true;
    await Promise.all(tarefas);
    _close();
    _dcpRenderConteudo();
  });
}

// ────────────────────────────────────────────────────────────────────
// V METAS · placeholder explicativo (sub-etapa 4c.5)
// ────────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════
// METAS · v4.34 · análise de desempenho mensal por loja
// Reescrita conforme dash.solucoesr2.com.br/gpc.html (etapa 8)
// ════════════════════════════════════════════════════════════════════════

// Mapeamento de loja (cod do JSON → label visível)
const _METAS_LOJAS = [
  {cod:'ATP-V', label:'ATP - Varejo',   curto:'ATP V'},
  {cod:'ATP-A', label:'ATP - Atacado',  curto:'ATP A'},
  {cod:'CP3',   label:'Cestão Loja 1',  curto:'CES L1'},
  {cod:'CP5',   label:'Inhambupe',      curto:'INH'}
];

// Filtra _METAS_LOJAS pela base ativa (sigla do _filialAtual).
// Retorna o subconjunto das 4 lojas com meta que pertence à base atual.
//   grupo / consolidado  → todas as 4
//   atp                  → ATP-V, ATP-A
//   cp                   → CP3, CP5 (CP1 e CP40 não têm meta)
//   cp3 | cp5            → só ela
//   cp1 | cp40           → nenhuma (sem meta cadastrada para essa loja)
function _metasLojasNaBase(){
  const sig = (typeof _filialAtual !== 'undefined' && _filialAtual && _filialAtual.sigla)
    ? _filialAtual.sigla.toLowerCase() : 'grupo';
  if(sig === 'grupo') return _METAS_LOJAS.slice();
  if(sig === 'atp')   return _METAS_LOJAS.filter(function(l){return l.cod === 'ATP-V' || l.cod === 'ATP-A';});
  if(sig === 'cp')    return _METAS_LOJAS.filter(function(l){return l.cod === 'CP3'   || l.cod === 'CP5';});
  if(sig === 'cp3')   return _METAS_LOJAS.filter(function(l){return l.cod === 'CP3';});
  if(sig === 'cp5')   return _METAS_LOJAS.filter(function(l){return l.cod === 'CP5';});
  if(sig === 'atp-v' || sig === 'atpv') return _METAS_LOJAS.filter(function(l){return l.cod === 'ATP-V';});
  if(sig === 'atp-a' || sig === 'atpa') return _METAS_LOJAS.filter(function(l){return l.cod === 'ATP-A';});
  return []; // cp1, cp40 ou outras siglas não mapeadas
}

// Estado global das metas
let _metasDados = null;        // {lojas: {ATP-V: {YYYY-MM: meta}, ...}, atualizadoEm, ...}
let _metasFirestoreCarregado = false;

async function _metasCarregarFirestore(){
  if(_metasFirestoreCarregado) return;
  try {
    const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
    if(!auth || !auth.currentUser){
      _metasDados = {lojas:{}};
      _metasFirestoreCarregado = true;
      return;
    }
    const db = firebase.firestore();
    const doc = await db.collection('config').doc('metas_gpc_v2').get();
    if(doc.exists){
      const data = doc.data();
      _metasDados = {
        lojas: data.lojas || {},
        atualizadoEm: data.atualizadoEm,
        atualizadoPor: data.atualizadoPor,
        seed_version: data.seed_version || 0
      };
    } else {
      _metasDados = {lojas:{}, seed_version: 0};
    }
    _metasFirestoreCarregado = true;
    // Sempre tenta carregar seed (idempotente por versão)
    await _metasTentarCarregarSeed();
  } catch(e){
    console.warn('[metas] erro carregando:', e);
    _metasDados = {lojas:{}};
    _metasFirestoreCarregado = true;
  }
}

// Carrega metas_seed.json (arquivo estático no dist).
// Comportamento:
//   - 1ª vez (Firestore vazio para a loja): importa todos os YMs do seed.
//   - Seed nova (seed.meta.version > seed_version armazenada): faz merge
//     PER-YM, sobrescrevendo cada mês do seed e preservando meses extras
//     que o usuário cadastrou pelo sistema.
//   - Seed igual: não faz nada (idempotente).
async function _metasTentarCarregarSeed(){
  try {
    const resp = await fetch('metas_seed.json?ts='+Date.now());
    if(!resp.ok) return;
    const seed = await resp.json();
    if(!seed || !seed.lojas) return;
    if(!_metasDados.lojas) _metasDados.lojas = {};

    const seedVersion = (seed.meta && seed.meta.version) ? seed.meta.version : 1;
    const storedVersion = _metasDados.seed_version || 0;

    let mudou = false;

    if(seedVersion > storedVersion){
      // Seed nova → overwrite per-YM (preserva meses não-presentes no seed)
      Object.keys(seed.lojas).forEach(function(loja){
        if(!_metasDados.lojas[loja]) _metasDados.lojas[loja] = {};
        Object.keys(seed.lojas[loja] || {}).forEach(function(ym){
          const novo = seed.lojas[loja][ym];
          if(_metasDados.lojas[loja][ym] !== novo){
            _metasDados.lojas[loja][ym] = novo;
            mudou = true;
          }
        });
      });
      _metasDados.seed_version = seedVersion;
      if(mudou) console.log('[metas] seed v'+seedVersion+' aplicada (per-YM overwrite, preservando meses extras)');
    } else {
      // Comportamento legado: preencher apenas lojas vazias
      Object.keys(seed.lojas).forEach(function(loja){
        const atual = _metasDados.lojas[loja] || {};
        if(Object.keys(atual).length === 0){
          _metasDados.lojas[loja] = Object.assign({}, seed.lojas[loja]);
          mudou = true;
        }
      });
      if(mudou) console.log('[metas] seed inicial aplicada (lojas vazias)');
    }

    if(mudou) await _metasSalvarFirestore();
  } catch(e){
    console.warn('[metas] seed indisponível:', e.message);
  }
}

async function _metasSalvarFirestore(){
  try {
    const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
    if(!auth || !auth.currentUser){ alert('Faça login para salvar.'); return false; }
    const db = firebase.firestore();
    await db.collection('config').doc('metas_gpc_v2').set({
      lojas: _metasDados.lojas,
      seed_version: _metasDados.seed_version || 0,
      atualizadoEm: firebase.firestore.FieldValue.serverTimestamp(),
      atualizadoPor: auth.currentUser.email || auth.currentUser.uid
    });
    return true;
  } catch(e){
    console.warn('[metas] erro salvando:', e);
    alert('Erro ao salvar metas: '+(e.message || e.code || 'desconhecido'));
    return false;
  }
}

// Pega o realizado de uma loja num mês específico (do V.mensal)
// v4.74: aplica o filtro de supervisores ignorados da página 'v-metas'.
function _metasGetRealizado(lojaCod, ym){
  if(!V || !V.mensal) return 0;
  const r = V.mensal.find(function(x){return x.loja === lojaCod && x.ym === ym;});
  if(!r) return 0;
  if(typeof aplicaFiltroSupVMensalRow === 'function'){
    const rf = aplicaFiltroSupVMensalRow(r, 'v-metas');
    return rf ? (rf.fat_liq || 0) : 0;
  }
  return r.fat_liq || 0;
}

// Pega a meta de uma loja num mês específico
function _metasGetMeta(lojaCod, ym){
  if(!_metasDados || !_metasDados.lojas) return 0;
  const lj = _metasDados.lojas[lojaCod] || {};
  return lj[ym] || 0;
}

// Lista todos os YMs que têm meta OU realizado em qualquer loja
function _metasYmsDisponiveis(){
  const set = new Set();
  if(_metasDados && _metasDados.lojas){
    Object.keys(_metasDados.lojas).forEach(function(lj){
      Object.keys(_metasDados.lojas[lj] || {}).forEach(function(ym){ set.add(ym); });
    });
  }
  if(V && V.mensal){
    V.mensal.forEach(function(r){ if(r.ym) set.add(r.ym); });
  }
  return Array.from(set).sort();
}

// Calcula atingimento de uma loja (real / meta)
function _metasCalcAt(real, meta){
  if(!meta || meta === 0) return null;
  return real / meta;
}

// Status visual baseado em atingimento
function _metasStatus(at){
  if(at == null) return {sigla:'—', cor:'var(--text-muted)', cls:''};
  if(at >= 1.0)  return {sigla:'✓', cor:'#15803d', cls:'ok'};
  if(at >= 0.95) return {sigla:'~', cor:'#b45309', cls:'wn'};
  return {sigla:'✗', cor:'#dc2626', cls:'dn'};
}

function renderVMetas(){
  const cont = document.getElementById('page-v-metas');
  if(!cont) return;

  if(!V || !V.mensal || !V.mensal.length){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Metas — <em>Análise de Desempenho</em></h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc" style="text-align:center;color:var(--text-muted);padding:30px;">Sem dados de vendas mensais carregados</div></div>';
    return;
  }

  // Carrega metas do Firestore
  _metasCarregarFirestore().then(function(){ _metasRenderConteudo(); });

  cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Metas — <em>Análise de Desempenho</em></h2></div>'
    + '<div class="ph-sep"></div><div class="page-body" id="metas-body">'
    + '<div style="text-align:center;color:var(--text-muted);padding:30px;">Carregando metas...</div>'
    + '</div>';
}

function _metasRenderConteudo(){
  const body = document.getElementById('metas-body');
  if(!body) return;

  const yms = _metasYmsDisponiveis();
  if(!yms.length){
    body.innerHTML = '<div class="cc" style="text-align:center;padding:40px;">'
      + '<div style="font-size:32px;margin-bottom:8px;opacity:.4;">📊</div>'
      + '<div style="font-size:14px;font-weight:700;margin-bottom:6px;">Nenhuma meta cadastrada</div>'
      + '<div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;line-height:1.5;">Cadastre as metas mensais por loja para ver a análise comparativa de atingimento.</div>'
      + '<button id="metas-btn-cad" class="ebtn" style="background:var(--accent);color:white;border:none;padding:9px 16px;font-size:12px;font-weight:700;">📝 Cadastrar metas</button>'
      + '<button id="metas-btn-import" class="ebtn" style="background:var(--surface);color:var(--text);border:1px solid var(--border-strong);padding:9px 16px;font-size:12px;font-weight:600;margin-left:6px;">📥 Importar Excel</button>'
      + '</div>';
    document.getElementById('metas-btn-cad').addEventListener('click', _metasAbrirEditorUI);
    document.getElementById('metas-btn-import').addEventListener('click', _metasImportarExcelUI);
    return;
  }

  // ─── Lojas ativas conforme base selecionada (filtro VISÃO) ───
  const lojasAtivas = _metasLojasNaBase();
  if(lojasAtivas.length === 0){
    body.innerHTML = '<div class="cc" style="text-align:center;padding:40px;">'
      + '<div style="font-size:32px;margin-bottom:8px;opacity:.4;">📊</div>'
      + '<div style="font-size:14px;font-weight:700;margin-bottom:6px;">Sem metas para a base selecionada</div>'
      + '<div style="font-size:12px;color:var(--text-muted);max-width:420px;margin:0 auto 12px;line-height:1.5;">'
      + 'A loja escolhida (CP1 Comercial Pinto ou CP40 Barros 40) não tem metas cadastradas. '
      + 'Troque a visão no topo (GPC Consolidado, ATP, Comercial Pinto, Cestão Loja 1 ou Inhambupe) para ver a análise.</div>'
      + '</div>';
    return;
  }

  // ─── Calcula KPIs gerais (somente lojas da base ativa) ───
  let totMeta = 0, totReal = 0;
  let mesesComMeta = 0, mesesAtingidos = 0;
  const atingPorAno = {}; // {2024:{soma, count}, ...}
  const atingMensal = []; // [{ym, meta, real, at, lojas:{ATP-V:{meta,real,at}, ...}}]

  // v4.80: pré-indexa V.mensal por loja|ym (era O(Y*L*N) com find dentro de loop duplo)
  const _mensalMapV = new Map();
  if(V && V.mensal){
    for(let i=0; i<V.mensal.length; i++){
      const r = V.mensal[i];
      _mensalMapV.set(r.loja + '|' + r.ym, r);
    }
  }
  const _getRealFast = function(cod, ym){
    const r = _mensalMapV.get(cod + '|' + ym);
    if(!r) return 0;
    if(typeof aplicaFiltroSupVMensalRow === 'function'){
      const rf = aplicaFiltroSupVMensalRow(r, 'v-metas');
      return rf ? (rf.fat_liq || 0) : 0;
    }
    return r.fat_liq || 0;
  };

  yms.forEach(function(ym){
    let metaMes = 0, realMes = 0;
    const lojasMes = {};
    lojasAtivas.forEach(function(l){
      const m = _metasGetMeta(l.cod, ym);
      const r = _getRealFast(l.cod, ym);
      lojasMes[l.cod] = {meta:m, real:r, at: _metasCalcAt(r, m)};
      metaMes += m;
      realMes += r;
    });
    const atMes = _metasCalcAt(realMes, metaMes);
    atingMensal.push({ym:ym, meta:metaMes, real:realMes, at:atMes, lojas:lojasMes});

    totMeta += metaMes;
    totReal += realMes;
    if(metaMes > 0){
      mesesComMeta++;
      if(atMes != null && atMes >= 1.0) mesesAtingidos++;
      const ano = ym.substring(0,4);
      if(!atingPorAno[ano]) atingPorAno[ano] = {soma:0, count:0, atingidos:0};
      atingPorAno[ano].soma += atMes || 0;
      atingPorAno[ano].count += 1;
      if(atMes != null && atMes >= 1.0) atingPorAno[ano].atingidos += 1;
    }
  });

  const mesesComMetaList = atingMensal.filter(function(m){return m.meta > 0;});
  const atingMedio = mesesComMeta > 0
    ? mesesComMetaList.reduce(function(s,m){return s+(m.at||0);},0) / mesesComMeta
    : 0;

  let html = '';

  // ─── Cabeçalho do escopo ───
  const ymIni = mesesComMetaList[0] ? _ymToLabel(mesesComMetaList[0].ym) : '—';
  const ymFim = mesesComMetaList.length ? _ymToLabel(mesesComMetaList[mesesComMetaList.length-1].ym) : '—';
  const lojasComMeta = lojasAtivas.filter(function(l){
    return Object.keys((_metasDados.lojas||{})[l.cod] || {}).length > 0;
  });

  // Label dinâmica do escopo conforme base ativa
  const _sig = (typeof _filialAtual !== 'undefined' && _filialAtual && _filialAtual.sigla) ? _filialAtual.sigla.toLowerCase() : 'grupo';
  let escopoLbl = 'GPC Consolidado';
  if(_sig === 'atp')      escopoLbl = 'ATP (Varejo + Atacado)';
  else if(_sig === 'cp')  escopoLbl = 'Comercial Pinto (Cestão Loja 1 + Inhambupe)';
  else if(_sig === 'cp3') escopoLbl = 'Cestão Loja 1';
  else if(_sig === 'cp5') escopoLbl = 'Cestão Inhambupe';
  else if(_sig === 'atp-v' || _sig === 'atpv') escopoLbl = 'ATP Varejo';
  else if(_sig === 'atp-a' || _sig === 'atpa') escopoLbl = 'ATP Atacado';

  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;">';
  html += '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">'
    + 'Resultado · '+esc(escopoLbl)+' · '+esc(ymIni)+' a '+esc(ymFim)+' · '+fI(mesesComMeta)+' meses · '+fI(lojasComMeta.length)+(lojasComMeta.length===1?' loja':' lojas')
    + '</div>';
  html += '<div style="display:flex;gap:6px;">';
  html += '<button id="metas-btn-cad" class="ebtn" style="background:var(--accent);color:white;border:none;padding:6px 12px;font-size:11.5px;font-weight:700;">📝 Cadastrar metas</button>';
  html += '<button id="metas-btn-import" class="ebtn" style="background:var(--surface);color:var(--text);border:1px solid var(--border-strong);padding:6px 12px;font-size:11.5px;font-weight:600;">📥 Excel</button>';
  html += '</div></div>';

  // ─── KPIs (4) ───
  const desvio = totReal - totMeta;
  const anos = Object.keys(atingPorAno).sort();
  const anosTxt = anos.map(function(a){
    const v = atingPorAno[a].soma / atingPorAno[a].count;
    return a+': '+fP(v*100,1);
  }).join(' · ');
  const atingPorAnoCount = anos.map(function(a){
    return a+': '+atingPorAno[a].atingidos+'/'+atingPorAno[a].count;
  }).join(' · ');

  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px;">';
  html += '<div class="kc"><div class="kl">Meta total acumulada</div>'
    + '<div class="kv">'+fK(totMeta)+'</div>'
    + '<div class="ku">'+fI(mesesComMeta)+' meses · '+fI(lojasComMeta.length)+' lojas</div></div>';
  html += '<div class="kc '+(desvio>=0?'up':'dn')+'"><div class="kl">Realizado total</div>'
    + '<div class="kv">'+fK(totReal)+'</div>'
    + '<div class="ku">'+(desvio>=0?'+':'')+fK(desvio)+' vs meta</div></div>';
  html += '<div class="kc '+(atingMedio>=1?'up':atingMedio>=0.95?'hl':'dn')+'"><div class="kl">Atingimento médio</div>'
    + '<div class="kv">'+fP(atingMedio*100,1)+'</div>'
    + '<div class="ku">'+esc(anosTxt)+'</div></div>';
  html += '<div class="kc"><div class="kl">Meses ≥100%</div>'
    + '<div class="kv">'+fI(mesesAtingidos)+'/'+fI(mesesComMeta)+'</div>'
    + '<div class="ku">'+esc(atingPorAnoCount)+'</div></div>';
  html += '</div>';

  // ─── Gráfico 1: Meta vs Realizado mensal ───
  html += '<div class="cc" style="margin-bottom:14px;">'
    + '<div class="cct">'+esc(escopoLbl)+' · Meta vs Realizado mensal (R$ Milhões)</div>'
    + '<div class="ccs">Barras = meta · Linha azul = realizado · Linha laranja = atingimento %</div>'
    + '<div style="height:300px;margin-top:8px;"><canvas id="metas-chart-mensal"></canvas></div>'
    + '</div>';

  // v4.76 fix24: Gráfico 'Desvio mensal da meta' removido a pedido do usuário.

  // ─── Insights (piora ano a ano + pior mês) ───
  if(anos.length >= 2){
    const a0 = anos[anos.length-2], a1 = anos[anos.length-1];
    const v0 = atingPorAno[a0].soma / atingPorAno[a0].count;
    const v1 = atingPorAno[a1].soma / atingPorAno[a1].count;
    const direcao = v1 < v0 ? 'Piora' : 'Melhora';
    const cor = v1 < v0 ? '#b45309' : '#15803d';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
    html += '<div style="background:#f9fafb;border-left:4px solid '+cor+';border-radius:8px;padding:12px 14px;">'
      + '<div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px;">'+direcao+' de '+a0+' para '+a1+'</div>'
      + '<div style="font-size:11.5px;color:var(--text-dim);line-height:1.5;">'+a0+': '+fP(v0*100,1)+' ('+atingPorAno[a0].atingidos+'/'+atingPorAno[a0].count+' ≥100%) → '+a1+': '+fP(v1*100,1)+' ('+atingPorAno[a1].atingidos+'/'+atingPorAno[a1].count+' ≥100%)</div>'
      + '</div>';

    // Pior mês
    const piorMes = mesesComMetaList.slice().sort(function(a,b){return a.at - b.at;})[0];
    if(piorMes){
      const lojasPior = lojasAtivas.map(function(l){
        const lm = piorMes.lojas[l.cod];
        if(!lm || !lm.meta) return null;
        return l.curto+': '+fP((lm.at||0)*100,1);
      }).filter(Boolean).join(' · ');
      html += '<div style="background:#fef3c7;border-left:4px solid #b45309;border-radius:8px;padding:12px 14px;">'
        + '<div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px;">⚠ '+_ymToLabel(piorMes.ym)+' — Pior mês: '+fP(piorMes.at*100,1)+'</div>'
        + '<div style="font-size:11.5px;color:var(--text-dim);line-height:1.5;">Desvio '+fK(piorMes.real - piorMes.meta)+'. '+esc(lojasPior)+'</div>'
        + '</div>';
    }
    html += '</div>';
  }

  // ─── Comparativo entre lojas (linhas) ───
  html += '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin:14px 0 8px;">Comparativo por loja · atingimento mensal</div>';
  html += '<div class="cc" style="margin-bottom:14px;">'
    + '<div class="cct">Atingimento mensal (%) · '+fI(lojasAtivas.length)+(lojasAtivas.length===1?' loja':' lojas')+'</div>'
    + '<div class="ccs">Linha tracejada = 100% de meta</div>'
    + '<div style="height:300px;margin-top:8px;"><canvas id="metas-chart-comp"></canvas></div>'
    + '</div>';

  // ─── Tabela comparativa ───
  html += '<div class="cc" style="margin-bottom:14px;">'
    + '<div class="cct">Tabela comparativa · '+(lojasAtivas.length===1?'loja':'lojas da base')+' por mês</div>'
    + '<div class="tscroll" style="margin-top:8px;">'
    + '<table class="t"><thead><tr><th class="L">Mês</th>';
  lojasAtivas.forEach(function(l){
    html += '<th>'+esc(l.curto)+'</th>';
  });
  if(lojasAtivas.length > 1) html += '<th>'+esc(escopoLbl)+'</th>';
  html += '</tr></thead><tbody>';
  atingMensal.forEach(function(m){
    if(m.meta === 0) return;
    html += '<tr><td class="L"><strong>'+_ymToLabel(m.ym)+'</strong></td>';
    lojasAtivas.forEach(function(l){
      const lm = m.lojas[l.cod];
      if(!lm || !lm.meta){
        html += '<td style="color:var(--text-muted);">—</td>';
      } else {
        const st = _metasStatus(lm.at);
        html += '<td style="color:'+st.cor+';font-weight:600;">'+fP((lm.at||0)*100,1)+' '+st.sigla+'</td>';
      }
    });
    if(lojasAtivas.length > 1){
      const stG = _metasStatus(m.at);
      html += '<td style="color:'+stG.cor+';font-weight:700;">'+fP((m.at||0)*100,1)+' '+stG.sigla+'</td>';
    }
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';

  // ─── Histórico detalhado por loja (consolidado + cada loja da base) ───
  if(lojasAtivas.length > 1){
    html += '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin:14px 0 8px;">Histórico detalhado · '+esc(escopoLbl)+'</div>';
    html += _metasRenderTabelaDetalhe(atingMensal.map(function(m){return {ym:m.ym, meta:m.meta, real:m.real, at:m.at};}), escopoLbl);
  }

  // v4.80: Set de códigos com meta (O(1) lookup vs find O(L) por loja)
  const _metaCodSet = new Set(lojasComMeta.map(function(x){return x.cod;}));
  lojasAtivas.forEach(function(l){
    if(!_metaCodSet.has(l.cod)) return;
    const dados = atingMensal.map(function(m){
      const lm = m.lojas[l.cod];
      return {ym:m.ym, meta:lm.meta, real:lm.real, at:lm.at};
    });
    html += '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin:14px 0 8px;">Histórico · '+esc(l.label)+'</div>';
    html += _metasRenderTabelaDetalhe(dados, l.label);
  });

  body.innerHTML = html;

  // Render gráficos
  _metasRenderGraficos(atingMensal);

  // Bind eventos
  document.getElementById('metas-btn-cad').addEventListener('click', _metasAbrirEditorUI);
  document.getElementById('metas-btn-import').addEventListener('click', _metasImportarExcelUI);
}

function _metasRenderTabelaDetalhe(linhas, titulo){
  let totMeta = 0, totReal = 0;
  let html = '<div class="cc" style="margin-bottom:10px;">'
    + '<div class="cct">'+esc(titulo)+'</div>'
    + '<div class="tscroll" style="margin-top:8px;">'
    + '<table class="t"><thead><tr>'
    + '<th class="L">Mês</th><th>Meta</th><th>Realizado</th><th>Ating.</th><th>Desvio</th>'
    + '</tr></thead><tbody>';
  linhas.forEach(function(r){
    if(r.meta === 0) return;
    totMeta += r.meta;
    totReal += r.real;
    const desvio = r.real - r.meta;
    const st = _metasStatus(r.at);
    html += '<tr>'
      + '<td class="L"><strong>'+_ymToLabel(r.ym)+'</strong></td>'
      + '<td>'+fK(r.meta)+'</td>'
      + '<td>'+fK(r.real)+'</td>'
      + '<td style="color:'+st.cor+';font-weight:600;">'+fP((r.at||0)*100,1)+' '+st.sigla+'</td>'
      + '<td style="color:'+(desvio>=0?'#15803d':'#dc2626')+';">'+(desvio>=0?'+':'')+fK(desvio)+'</td>'
      + '</tr>';
  });
  // Linha total
  const atTot = totMeta > 0 ? totReal / totMeta : 0;
  const stTot = _metasStatus(atTot);
  const desvioTot = totReal - totMeta;
  html += '<tr style="border-top:2px solid var(--border-strong);font-weight:700;background:var(--surface-2);">'
    + '<td class="L">TOTAL</td>'
    + '<td>'+fK(totMeta)+'</td>'
    + '<td>'+fK(totReal)+'</td>'
    + '<td style="color:'+stTot.cor+';">'+fP(atTot*100,1)+' '+stTot.sigla+'</td>'
    + '<td style="color:'+(desvioTot>=0?'#15803d':'#dc2626')+';">'+(desvioTot>=0?'+':'')+fK(desvioTot)+'</td>'
    + '</tr>';
  html += '</tbody></table></div></div>';
  return html;
}

function _metasRenderGraficos(atingMensal){
  const dadosCom = atingMensal.filter(function(m){return m.meta > 0;});
  const labels = dadosCom.map(function(m){return _ymToLabel(m.ym);});

  // Gráfico 1: Meta vs Realizado mensal
  if(document.getElementById('metas-chart-mensal')){
    mkC('metas-chart-mensal', {
      type: 'bar',
      data: {labels: labels, datasets: [
        {label:'Meta', type:'bar', data: dadosCom.map(function(m){return m.meta/1000000;}),
         backgroundColor: 'rgba(220,230,200,0.6)', borderColor:'#94a3b8', borderWidth:1, borderRadius:3, yAxisID:'y'},
        {label:'Realizado', type:'line', data: dadosCom.map(function(m){return m.real/1000000;}),
         borderColor: '#1a2f5c', backgroundColor:'rgba(26,47,92,0.10)', borderWidth:2.5, tension:0.3,
         pointRadius:3, pointBackgroundColor:'#1a2f5c', yAxisID:'y'},
        {label:'Atingimento %', type:'line', data: dadosCom.map(function(m){return (m.at||0)*100;}),
         borderColor: '#f58634', borderWidth:2, borderDash:[5,3], tension:0.3,
         pointRadius:3, pointBackgroundColor:'#f58634', yAxisID:'y2'}
      ]},
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins:{
          legend:{position:'bottom', labels:{padding:8, usePointStyle:true, boxWidth:8, font:{size:10}}},
          tooltip:{callbacks:{label:function(ctx){
            if(ctx.dataset.label === 'Atingimento %') return 'Atingimento: '+fP(ctx.raw,1);
            return ctx.dataset.label+': '+fK(ctx.raw*1000000);
          }}}
        },
        scales:{
          x:{grid:{display:false}, ticks:{font:{size:10}, maxRotation:45}},
          y:{position:'left', ticks:{callback:function(v){return 'R$'+v.toFixed(1)+'M';}, font:{size:10}}},
          y2:{position:'right', grid:{display:false}, min:70, max:115,
              ticks:{callback:function(v){return v+'%';}, font:{size:10}}}
        }
      }
    });
  }

  // Gráfico 2: Desvio mensal
  if(document.getElementById('metas-chart-desvio')){
    const cores = dadosCom.map(function(m){return (m.real - m.meta) >= 0 ? '#86efac' : '#fca5a5';});
    mkC('metas-chart-desvio', {
      type:'bar',
      data:{labels:labels, datasets:[{
        label:'Desvio',
        data: dadosCom.map(function(m){return (m.real - m.meta) / 1000;}),
        backgroundColor: cores,
        borderRadius:3
      }]},
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{
          legend:{display:false},
          tooltip:{callbacks:{label:function(ctx){return (ctx.raw>=0?'+':'')+'R$'+fAbbr(ctx.raw*1000);}}}
        },
        scales:{
          x:{grid:{display:false}, ticks:{font:{size:10}, maxRotation:45}},
          y:{ticks:{callback:function(v){return 'R$'+v+'k';}, font:{size:10}}}
        }
      }
    });
  }

  // Gráfico 3: Comparativo entre lojas (atingimento %)
  if(document.getElementById('metas-chart-comp')){
    const cores = ['#1a2f5c','#7c3aed','#dc2626','#f58634'];
    const _lojasAtivas = _metasLojasNaBase();
    const datasets = _lojasAtivas.map(function(l, i){
      return {
        label: l.label,
        data: dadosCom.map(function(m){
          const lm = m.lojas[l.cod];
          if(!lm || !lm.meta) return null;
          return (lm.at || 0) * 100;
        }),
        borderColor: cores[i % cores.length],
        backgroundColor: cores[i % cores.length] + '20',
        borderWidth: 2,
        borderDash: l.cod === 'ATP-A' ? [5,3] : [],
        tension: 0.3,
        pointRadius: 3,
        spanGaps: true
      };
    });
    mkC('metas-chart-comp', {
      type:'line',
      data:{labels:labels, datasets:datasets},
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{
          legend:{position:'bottom', labels:{padding:8, usePointStyle:true, boxWidth:10, font:{size:10}}},
          tooltip:{callbacks:{label:function(ctx){
            if(ctx.raw == null) return ctx.dataset.label+': sem meta';
            return ctx.dataset.label+': '+fP(ctx.raw,1);
          }}},
          annotation:{}
        },
        scales:{
          x:{grid:{display:false}, ticks:{font:{size:10}, maxRotation:45}},
          y:{ticks:{callback:function(v){return v+'%';}, font:{size:10}},
             grid:{color:function(ctx){return ctx.tick.value === 100 ? '#94a3b8' : '#e5e7eb';}}}
        }
      }
    });
  }
}

// ─── UI: editor manual de metas ───
function _metasAbrirEditorUI(){
  const yms = _metasYmsDisponiveis();
  // Se não tem nenhum ym de meta nem realizado, gera 24 meses pra trás
  let ymsExibir = yms.slice();
  if(!ymsExibir.length){
    const hoje = new Date();
    for(let i=23; i>=0; i--){
      const d = new Date(hoje.getFullYear(), hoje.getMonth()-i, 1);
      ymsExibir.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'));
    }
  } else {
    // Adiciona meses futuros se quiser planejar à frente
    // Por enquanto só mostra o que tem
  }

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';

  let html = '<div style="background:white;border-radius:10px;max-width:900px;width:100%;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 10px 40px rgba(0,0,0,.3);">';
  html += '<div style="padding:18px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">';
  html +=   '<h3 style="margin:0;font-size:16px;font-weight:700;">Cadastrar metas mensais</h3>';
  html +=   '<button id="metas-modal-close" style="background:transparent;border:none;cursor:pointer;font-size:18px;color:var(--text-muted);">✕</button>';
  html += '</div>';
  html += '<div style="padding:12px 20px;border-bottom:1px solid var(--border);font-size:12px;color:var(--text-muted);line-height:1.5;">'
    +    'Insira a meta de faturamento líquido (em R$) para cada loja em cada mês. Use ponto ou vírgula como separador decimal. Deixe em branco para apagar a meta de um mês.'
    + '</div>';
  html += '<div style="flex:1;overflow:auto;padding:8px 20px;">';
  html += '<table style="width:100%;border-collapse:collapse;font-size:11.5px;">';
  html += '<thead style="position:sticky;top:0;background:white;z-index:1;"><tr style="border-bottom:2px solid var(--border-strong);">';
  html += '<th style="text-align:left;padding:8px 6px;font-size:10px;text-transform:uppercase;color:var(--text-muted);letter-spacing:.05em;">Mês</th>';
  _METAS_LOJAS.forEach(function(l){
    html += '<th style="text-align:right;padding:8px 6px;font-size:10px;text-transform:uppercase;color:var(--text-muted);letter-spacing:.05em;">'+esc(l.curto)+'</th>';
  });
  html += '</tr></thead><tbody>';
  ymsExibir.forEach(function(ym){
    html += '<tr style="border-bottom:1px solid var(--border);">';
    html += '<td style="padding:6px;font-weight:700;">'+_ymToLabel(ym)+'</td>';
    _METAS_LOJAS.forEach(function(l){
      const meta = _metasGetMeta(l.cod, ym);
      const valStr = meta > 0 ? meta.toString() : '';
      html += '<td style="padding:4px;">'
        + '<input type="text" data-loja="'+esc(l.cod)+'" data-ym="'+esc(ym)+'" '
        + 'value="'+esc(valStr)+'" placeholder="0" '
        + 'style="width:100%;padding:5px 8px;border:1px solid var(--border-strong);border-radius:4px;font-size:11.5px;text-align:right;font-family:JetBrains Mono,monospace;">'
        + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  html += '</div>';
  html += '<div style="padding:14px 20px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end;align-items:center;">';
  html += '<div style="flex:1;font-size:11px;color:var(--text-muted);">'+ymsExibir.length+' meses · '+_METAS_LOJAS.length+' lojas = '+(ymsExibir.length * _METAS_LOJAS.length)+' campos</div>';
  html += '<button id="metas-modal-cancel" class="ebtn" style="background:white;color:var(--text);border:1px solid var(--border-strong);padding:8px 14px;font-size:12px;">Cancelar</button>';
  html += '<button id="metas-modal-save" class="ebtn" style="background:var(--accent);color:white;border:none;padding:8px 14px;font-size:12px;font-weight:700;">Salvar metas</button>';
  html += '</div>';
  html += '</div>';

  overlay.innerHTML = html;
  document.body.appendChild(overlay);

  document.getElementById('metas-modal-close').addEventListener('click', function(){overlay.remove();});
  document.getElementById('metas-modal-cancel').addEventListener('click', function(){overlay.remove();});
  document.getElementById('metas-modal-save').addEventListener('click', async function(){
    const inputs = overlay.querySelectorAll('input[data-loja][data-ym]');
    const novoLojas = _clone(_metasDados.lojas || {});
    let mudancas = 0;
    inputs.forEach(function(inp){
      const loja = inp.getAttribute('data-loja');
      const ym = inp.getAttribute('data-ym');
      const txt = inp.value.trim().replace(/\./g,'').replace(/,/g,'.');
      const v = parseFloat(txt);
      if(!novoLojas[loja]) novoLojas[loja] = {};
      const atual = novoLojas[loja][ym] || 0;
      if(!txt || isNaN(v) || v <= 0){
        if(atual){ delete novoLojas[loja][ym]; mudancas++; }
      } else {
        if(Math.abs(atual - v) > 0.01){
          novoLojas[loja][ym] = v;
          mudancas++;
        }
      }
    });
    if(mudancas === 0){
      overlay.remove();
      return;
    }
    document.getElementById('metas-modal-save').textContent = 'Salvando...';
    document.getElementById('metas-modal-save').disabled = true;
    _metasDados.lojas = novoLojas;
    const ok = await _metasSalvarFirestore();
    overlay.remove();
    if(ok){
      _metasFirestoreCarregado = false;
      _metasCarregarFirestore().then(_metasRenderConteudo);
    }
  });
}

// ─── UI: importar Excel ───
function _metasImportarExcelUI(){
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = '<div style="background:white;border-radius:10px;max-width:560px;width:100%;padding:20px;">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    +   '<h3 style="margin:0;font-size:16px;font-weight:700;">Importar metas de Excel</h3>'
    +   '<button id="mi-close" style="background:transparent;border:none;cursor:pointer;font-size:18px;color:var(--text-muted);">✕</button>'
    + '</div>'
    + '<div style="font-size:12px;color:var(--text-muted);line-height:1.6;margin-bottom:14px;">'
    +   'Carregue um arquivo .xlsx no formato esperado: aba "Resumo GPC" com colunas Mês, Meta ATP-V, Meta ATP-A, Meta Cestão, Meta Inhambupe. Ou aba por loja com Mês e Meta. O sistema detecta automaticamente.'
    + '</div>'
    + '<input type="file" id="mi-file" accept=".xlsx,.xls" style="width:100%;padding:8px;border:1px dashed var(--border-strong);border-radius:6px;font-size:12px;">'
    + '<div id="mi-status" style="font-size:11.5px;color:var(--text-dim);margin-top:10px;min-height:20px;"></div>'
    + '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">'
    +   '<button id="mi-cancel" class="ebtn" style="background:white;color:var(--text);border:1px solid var(--border-strong);padding:8px 14px;font-size:12px;">Cancelar</button>'
    +   '<button id="mi-import" class="ebtn" style="background:var(--accent);color:white;border:none;padding:8px 14px;font-size:12px;font-weight:700;" disabled>Importar</button>'
    + '</div>'
    + '</div>';
  document.body.appendChild(overlay);

  let importPayload = null;
  const status = document.getElementById('mi-status');
  const btnImport = document.getElementById('mi-import');

  document.getElementById('mi-close').addEventListener('click', function(){overlay.remove();});
  document.getElementById('mi-cancel').addEventListener('click', function(){overlay.remove();});

  document.getElementById('mi-file').addEventListener('change', async function(e){
    const file = e.target.files[0];
    if(!file) return;
    status.textContent = 'Lendo arquivo...';
    if(typeof XLSX === 'undefined'){
      try { await _carregarXLSXLib(); }
      catch(err){ status.textContent = '✗ Erro: biblioteca XLSX não disponível.'; return; }
    }
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, {type:'array'});
      // Tenta achar a aba "Resumo GPC"
      const sheet = wb.Sheets['Resumo GPC'] || wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, {header:1});

      // Detectar layout: header em linha que começa com "Mês"
      let headerIdx = -1;
      for(let i=0; i<Math.min(rows.length, 10); i++){
        if(rows[i] && rows[i][0] && String(rows[i][0]).trim().toLowerCase() === 'mês'){
          headerIdx = i;
          break;
        }
      }
      if(headerIdx < 0){
        status.textContent = '✗ Não encontrei linha de cabeçalho com "Mês".';
        return;
      }

      // Layout esperado: Mês | Meta(ATP-V) | Real(ATP-V) | At(ATP-V) | Meta(ATP-A) | ... | Meta(GPC) | ...
      // Cada loja ocupa 3 colunas: Meta, Realizado, Ating.
      // Vamos pegar só as colunas Meta de cada uma das 4 lojas (não a GPC)
      const colunas = [
        {loja:'ATP-V', col:1},
        {loja:'ATP-A', col:4},
        {loja:'CP3',   col:7},   // Cestão Loja 1
        {loja:'CP5',   col:10}   // Inhambupe
      ];

      const novoLojas = {};
      colunas.forEach(function(c){ novoLojas[c.loja] = {}; });

      let totalLinhas = 0;
      for(let i=headerIdx+1; i<rows.length; i++){
        const row = rows[i];
        if(!row || !row[0]) continue;
        const mes = String(row[0]).trim();
        // Aceita "Jan/24" ou "01/2024" ou "2024-01"
        const ym = _metasParseMes(mes);
        if(!ym) continue;
        colunas.forEach(function(c){
          const v = parseFloat(row[c.col]);
          if(!isNaN(v) && v > 0){
            novoLojas[c.loja][ym] = v;
          }
        });
        totalLinhas++;
      }

      const totalCampos = Object.keys(novoLojas).reduce(function(s,lj){
        return s + Object.keys(novoLojas[lj]).length;
      }, 0);

      if(totalCampos === 0){
        status.textContent = '✗ Não consegui ler nenhuma meta. Verifique o formato do arquivo.';
        return;
      }

      importPayload = novoLojas;
      status.innerHTML = '✓ Pronto: <strong>'+totalLinhas+' meses</strong> · <strong>'+totalCampos+' metas</strong> detectadas. Clique em Importar para confirmar.';
      btnImport.disabled = false;
    } catch(err){
      console.error(err);
      status.textContent = '✗ Erro ao ler: '+(err.message || 'desconhecido');
    }
  });

  btnImport.addEventListener('click', async function(){
    if(!importPayload) return;
    btnImport.textContent = 'Importando...';
    btnImport.disabled = true;
    // Merge: novas metas substituem antigas, mas mantém o que não veio no Excel
    if(!_metasDados) _metasDados = {lojas:{}};
    if(!_metasDados.lojas) _metasDados.lojas = {};
    Object.keys(importPayload).forEach(function(lj){
      if(!_metasDados.lojas[lj]) _metasDados.lojas[lj] = {};
      Object.keys(importPayload[lj]).forEach(function(ym){
        _metasDados.lojas[lj][ym] = importPayload[lj][ym];
      });
    });
    const ok = await _metasSalvarFirestore();
    overlay.remove();
    if(ok){
      _metasFirestoreCarregado = false;
      _metasCarregarFirestore().then(_metasRenderConteudo);
    }
  });
}

// Parse "Jan/24", "01/2024", "2024-01" → "YYYY-MM"
function _metasParseMes(s){
  if(!s) return null;
  s = String(s).trim();
  // YYYY-MM
  if(/^\d{4}-\d{2}$/.test(s)) return s;
  // MM/YYYY
  let m = s.match(/^(\d{1,2})\/(\d{4})$/);
  if(m) return m[2]+'-'+String(m[1]).padStart(2,'0');
  // Mes/AA ou Mes/AAAA (em pt-BR)
  const meses = {jan:'01',fev:'02',mar:'03',abr:'04',mai:'05',jun:'06',jul:'07',ago:'08',set:'09',out:'10',nov:'11',dez:'12'};
  m = s.toLowerCase().match(/^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)[a-z]*\s*[\/-]?\s*(\d{2,4})$/);
  if(m){
    let ano = m[2];
    if(ano.length === 2) ano = '20'+ano;
    return ano+'-'+meses[m[1]];
  }
  return null;
}

// Carrega lib XLSX dinamicamente (só quando precisar)
function _carregarXLSXLib(){
  return new Promise(function(resolve, reject){
    if(typeof XLSX !== 'undefined') return resolve();
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}


// ────────────────────────────────────────────────────────────────────
// V CESTÃO L1 · placeholder (sub-etapa 4c.5)
// ────────────────────────────────────────────────────────────────────
function renderVCestao(){
  return _renderPlaceholderLojaSemDados('v-cestao', 'Cestão Loja 1', 'CSTL1');
}

// ────────────────────────────────────────────────────────────────────
// V INHAMBUPE · placeholder (sub-etapa 4c.5)
// ────────────────────────────────────────────────────────────────────
function renderVInhambupe(){
  return _renderPlaceholderLojaSemDados('v-inh', 'Cestão Inhambupe', 'INH');
}

/**
 * Helper: renderiza placeholder para uma loja que ainda não tem dados.
 */
function _renderPlaceholderLojaSemDados(pageId, nomeLoja, codigo){
  const cont = document.getElementById('page-' + pageId);
  if(!cont) return;

  let html = '<div class="ph"><div class="pk">Vendas · Por Loja</div><h2>'+esc(nomeLoja)+'</h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  html += '<div style="background:var(--accent-bg);border:1px solid var(--accent-glow);border-radius:8px;padding:18px 20px;margin-bottom:14px;display:flex;align-items:start;gap:14px;">'
       +   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
       +   '<div style="font-size:13px;color:var(--text-dim);line-height:1.6;">'
       +     '<strong style="font-size:14px;color:var(--text);">Aguardando dados desta loja.</strong><br>'
       +     'Os dados atualmente carregados cobrem apenas as lojas <strong>ATP Varejo</strong> e <strong>ATP Atacado</strong> '
       +     '(base ATP do WinThor). Quando os arquivos da base <strong>COMERCIAL PINTO</strong> chegarem, '
       +     'esta página vai exibir o drill-down completo de '+esc(nomeLoja)+' (código '+esc(codigo)+'), '
       +     'no mesmo formato das páginas de ATP — KPIs, evolução mensal, top departamentos, top produtos.'
       +   '</div>'
       + '</div>';

  // Mostrar links pras outras páginas como sugestão
  html += '<div class="cc">'
       +    '<div class="cct">Páginas com dados disponíveis</div>'
       +    '<div class="ccs">Enquanto não há dados desta loja, as seguintes páginas estão operacionais com base ATP:</div>'
       +    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;padding:10px 0;">'
       +      '<a class="ebtn" href="javascript:document.querySelector(\'.sb-link[data-p=v-atp-varejo]\').click();" style="display:block;background:var(--surface-2);padding:14px;border-radius:7px;text-align:center;text-decoration:none;color:var(--text);font-weight:600;font-size:12px;border:1px solid var(--border);">→ ATP Varejo</a>'
       +      '<a class="ebtn" href="javascript:document.querySelector(\'.sb-link[data-p=v-atp-atacado]\').click();" style="display:block;background:var(--surface-2);padding:14px;border-radius:7px;text-align:center;text-decoration:none;color:var(--text);font-weight:600;font-size:12px;border:1px solid var(--border);">→ ATP Atacado</a>'
       +      '<a class="ebtn" href="javascript:document.querySelector(\'.sb-link[data-p=v-visao-grupo]\').click();" style="display:block;background:var(--surface-2);padding:14px;border-radius:7px;text-align:center;text-decoration:none;color:var(--text);font-weight:600;font-size:12px;border:1px solid var(--border);">→ Visão Consolidada</a>'
       +    '</div>'
       + '</div>';

  html += '</div>';
  cont.innerHTML = html;
}

// ────────────────────────────────────────────────────────────────────
// RECEBIMENTOS · análise de inadimplência (sub-etapa 4f · 30/abr/2026)
// Consome /dados-modulares/recebimentos_atp.json
// ────────────────────────────────────────────────────────────────────
