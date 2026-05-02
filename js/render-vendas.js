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
  },
  'v-alertas': {
    pk: 'Vendas · Análise',
    h2: 'Alertas e <em>Oportunidades</em>',
    desc: 'Detecção automática de oscilações relevantes, sazonalidades e oportunidades',
    kpis: [],
    rows: [],
    tables: [],
    customNote: 'Página de alertas: lista contextual gerada após o cálculo dos indicadores. Será populada automaticamente com os dados de Vendas.'
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
 */
// Cache memoizado para _vendasMensalPor — invalida quando V muda (verifica V.meta.geradoEm)
let _vmpCache = null;
let _vmpCacheKey = null;
function _vendasMensalPor(loja){
  if(!V || !V.mensal) return [];
  // Chave do cache: identificador único do dataset V atual
  const cacheKey = (V.meta && V.meta.geradoEm) || 'noKey';
  if(_vmpCacheKey !== cacheKey){
    _vmpCache = new Map();
    _vmpCacheKey = cacheKey;
  }
  const k = loja || '__GRUPO__';
  const cached = _vmpCache.get(k);
  if(cached) return cached;

  let resultado;
  if(loja){
    resultado = V.mensal.filter(function(r){return r.loja === loja;})
                       .sort(function(a,b){return a.ym<b.ym?-1:1;});
  } else {
    // Consolida grupo (somando todas as lojas por ym)
    const m = new Map();
    V.mensal.forEach(function(r){
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
  _vmpCache.set(k, resultado);
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
  // _filialAtual === null indica modo consolidado/grupo (definido em core.js).
  if(typeof _filialAtual !== 'undefined' && _filialAtual){
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
        const m = _vendasMensalPor(loja).filter(function(r){return r.ym >= ano+'-01' && r.ym <= ano+'-03';});
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

  // ─── Tabela 2: jan-mar 26 vs jan-mar 25 ───
  const linhasT2 = [];
  ['ATP-V', 'ATP-A'].forEach(function(loja){
    const m25 = _vendasMensalPor(loja).filter(function(r){return r.ym >= '2025-01' && r.ym <= '2025-03';});
    const m26 = _vendasMensalPor(loja).filter(function(r){return r.ym >= '2026-01' && r.ym <= '2026-03';});
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

  const grupo = _vendasMensalPor(null);
  const lblG = grupo.map(function(r){return _ymToLabel(r.ym);});

  // Cores fixas por loja (consistência visual)
  const cores = {
    'ATP-V': '#f58634', 'ATP-A': '#30569f',
    'CP1':   '#10b981', 'CP3':   '#8b5cf6',
    'CP5':   '#ef4444', 'CP40':  '#06b6d4'
  };

  // ── Multi-line chart: total + cada loja ──
  const datasetsMulti = [
    {
      label: 'GRUPO (total)',
      data: grupo.map(function(r){return r.fat_liq;}),
      borderColor: '#1f2937',
      backgroundColor: 'rgba(31,41,55,0.10)',
      borderWidth: 2.5,
      tension: 0.3,
      fill: false,
      pointRadius: 3
    }
  ];
  lojasDisp.forEach(function(l){
    const m = _vendasMensalPor(l);
    // Alinhar pelo eixo do grupo (preencher 0 onde não tiver mês)
    const data = lblG.map(function(_, i){
      const ym = grupo[i].ym;
      const linha = m.find(function(x){return x.ym === ym;});
      return linha ? linha.fat_liq : 0;
    });
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
  });

  mkC('c-vevo-multi', {
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

  // ── Cards individuais por loja ──
  lojasDisp.forEach(function(l){
    const m = _vendasMensalPor(l);
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
        const m = _vendasMensalPor(l);
        dadosLojas[l] = m;
      });
      // Datasets: lojas não-destacadas em cinza claro fino, loja destaque colorida grossa
      lojasDisp.forEach(function(l){
        const m = dadosLojas[l];
        const data = lblG.map(function(_, i){
          const ym = grupo[i].ym;
          const linha = m.find(function(x){return x.ym === ym;});
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
    const dados = _vendasMensalPor(loja || null);
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
  const datasetsDeptMes = top6Deptos.map(function(deptoNome, idx){
    return {
      label: deptoNome,
      data: yms.map(function(ym){
        const r = (V.deptos || []).find(function(x){return x.loja===loja && x.ym===ym && x.nome===deptoNome;});
        return r ? r.fat_liq : 0;
      }),
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
  const m2026 = _vendasMensalPor(null).filter(function(r){return r.ym.startsWith('2026-');});
  const m2025JanAbr = _vendasMensalPor(null).filter(function(r){return r.ym >= '2025-01' && r.ym <= '2025-04';});

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
  const d26 = meses.map(function(m){
    const r = m2026.find(function(x){return x.ym === '2026-'+m;});
    return r ? r.fat_liq : 0;
  });
  const d25 = meses.map(function(m){
    const r = m2025JanAbr.find(function(x){return x.ym === '2025-'+m;});
    return r ? r.fat_liq : 0;
  });

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
    const r26 = m2026.find(function(x){return x.ym === '2026-'+m;}) || {fat_liq:0, lucro:0};
    const r25 = m2025JanAbr.find(function(x){return x.ym === '2025-'+m;}) || {fat_liq:0, lucro:0};
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
    case 'v-alertas':        return renderVAlertas();
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
const MF={'2026-01':'Janeiro','2026-02':'Fevereiro','2026-03':'Março','2026-04':'Abril'};
const MS={'2026-01':'Jan','2026-02':'Fev','2026-03':'Mar','2026-04':'Abr'};


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
function renderExecutivo(){
  // Se estamos no consolidado legado, redirecionar para visao especial
  if(typeof isConsolidado === 'function' && isConsolidado()){
    if(typeof renderConsolidadoView === 'function') renderConsolidadoView();
    return;
  }

  // Atualiza cabeçalho da página com base na visão atual
  // (substitui o "Dashboard · ATP" hardcoded do template inicial)
  const _phExecPk = document.getElementById('ph-exec-pk');
  if(_phExecPk){
    const slug = (typeof _getBaseSlug === 'function') ? _getBaseSlug() : 'atp';
    const baseInfo = (_basesDisponiveis || []).find(function(b){ return b.sigla === slug; });
    const labelBase = (baseInfo && baseInfo.nome) || slug.toUpperCase();
    _phExecPk.textContent = 'Dashboard · ' + labelBase;
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

  // ─── helpers internos ─────────────────────────────────────────────
  // Mensal de vendas: V.mensal é [{loja, ym, fat_liq, lucro, marg, qt, nfs}, ...]
  // Agregamos por ym (somando ATP-V + ATP-A).
  function _vendasMensalGrupo(){
    if(!V || !V.mensal) return [];
    const m = new Map();
    V.mensal.forEach(function(r){
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
    return F.pago.mensal.slice().sort(function(a,b){return a.ym<b.ym?-1:1;});
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
    {l:'Estoque (preço venda)',v:estoqueValorPV>0?fK(estoqueValorPV):'—',s:estoqueValorPV>0?'Retrato '+dataEstoque:'sem dados', cls:'vio'},
    {l:'SKUs com venda',      v:fI(skusComVenda), s:fI(skusComEstoque)+' c/ estoque atual'},
    {l:'NFs de entrada',      v:fI(totalNfs),     s:fI(totalForns)+' fornecedores'},
  ]);

  // ─── Charts ───────────────────────────────────────────────────────
  const lbl = ymsExibicao.map(_ymToLabel);

  // Chart 1: Compras × Vendas × Pago (mensal)
  const dCompras = ymsExibicao.map(function(ym){
    const r = mensalC.find(function(x){return x.ym === ym;});
    return r ? r.valor : 0;
  });
  const dVendas = ymsExibicao.map(function(ym){
    const r = mensalVno.find(function(x){return x.ym === ym;});
    return r ? r.fat_liq : 0;
  });
  const dPagos = ymsExibicao.map(function(ym){
    const r = mensalP.find(function(x){return x.ym === ym;});
    return r ? r.valor : 0;
  });

  mkC('c-exec-evo', {data:{labels:lbl, datasets:[
    {type:'bar', label:'Compras líq.', data:dCompras, backgroundColor:_PAL.ac+'CC', borderRadius:5},
    {type:'bar', label:'Vendas líq.',  data:dVendas,  backgroundColor:_PAL.hl+'CC', borderRadius:5},
    {type:'line',label:'Pago',         data:dPagos,   borderColor:_PAL.ok, backgroundColor:'rgba(16,152,84,.1)', tension:.4, pointRadius:4, pointBackgroundColor:_PAL.ok},
  ]}, options:{responsive:true, maintainAspectRatio:false,
    plugins:{legend:{position:'bottom', labels:{padding:10, usePointStyle:true, boxWidth:8}},
             tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+fB(ctx.raw);}}}},
    scales:{y:{beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}}, x:{grid:{display:false}}}}});

  // Chart 2: Margem mensal
  const dMargem = ymsExibicao.map(function(ym){
    const r = mensalVno.find(function(x){return x.ym === ym;});
    return r && r.fat_liq>0 ? r.lucro/r.fat_liq*100 : 0;
  });

  mkC('c-exec-marg', {type:'line', data:{labels:lbl, datasets:[
    {label:'Margem %', data:dMargem, borderColor:_PAL.hl, backgroundColor:'rgba(245,134,52,.15)', fill:true, tension:.4, pointRadius:5, pointBackgroundColor:_PAL.hl}
  ]}, options:{responsive:true, maintainAspectRatio:false,
    plugins:{legend:{display:false}, tooltip:{callbacks:{label:function(ctx){return fP(ctx.raw);}}}},
    scales:{y:{beginAtZero:false, ticks:{callback:function(v){return fP(v);}}}, x:{grid:{display:false}}}}});

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
    mkC('c-exec-agenda', {type:'bar', data:{labels:agendaArr.map(function(a){return _ymToLabel(a.ym);}),
      datasets:[{label:'A pagar', data:agendaArr.map(function(a){return a.valor;}),
                 backgroundColor:agendaArr.map(function(a){
                   // Vencidos passados em vermelho, recente em laranja, futuros em azul
                   if(/^VENCIDO/.test(a.ym) || (a.ym && a.ym < '2026-05')) return _PAL.dn+'AA';
                   if(a.ym && a.ym < '2026-06') return _PAL.hl+'AA';
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

      tbody.innerHTML = top.map(function(p, i){
        const margPct = p.fat_liq>0 ? p.lucro/p.fat_liq*100 : 0;
        const margClass = margPct<0 ? 'val-neg' : margPct>18 ? 'val-pos' : '';
        const eqProd = eIdx.get(p.cod);
        const estoqueQt    = eqProd && eqProd.estoque ? eqProd.estoque.qt : 0;
        const estoqueCusto = eqProd && eqProd.estoque ? eqProd.estoque.vl_custo : 0;

        // Sparkline a partir de vendas_por_sku.por_mes
        let sparkHtml = '';
        if(V.vendas_por_sku){
          const skuFull = V.vendas_por_sku.find(function(s){return s.cod === p.cod;});
          if(skuFull && skuFull.por_mes && skuFull.por_mes.length){
            sparkHtml = sparkSvg(skuFull.por_mes.map(function(m){return m.qt;}));
          }
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

  // Aplicar filtro de supervisores ignorados (configurado em Administração)
  const cad = Filtros.vendedoresAtivos(cadOriginal);
  const codsValidos = Filtros.codsValidos(cad);
  const mensalV = mensalVorig.filter(function(r){return codsValidos.has(r.cod);});

  if(!cad.length || !mensalV.length){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Drill-Down por <em>Vendedor</em></h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc" style="text-align:center;color:var(--text-muted);padding:30px;">Sem dados de vendedores</div></div>';
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
  const agregados = cad.map(function(v){
    const arr = mensalIdx.get(v.cod) || [];
    const ult = arr.find(function(r){return r.ym === ultimoYm;});
    const ant = arr.find(function(r){return r.ym === prevYm;});
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
  document.getElementById('flt-vdrl-q').addEventListener('input', rebuildTable);

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

  // Aplicar filtro de supervisores ignorados
  const cad = Filtros.vendedoresAtivos(cadOriginal);
  const codsValidos = Filtros.codsValidos(cad);
  const mensalV = mensalVorig.filter(function(r){return codsValidos.has(r.cod);});

  if(!cad.length || !mensalV.length){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2><em>RCA</em> · Análise por Vendedor</h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc" style="text-align:center;color:var(--text-muted);padding:30px;">Sem dados de vendedores</div></div>';
    return;
  }

  // Indexar mensal por cod
  const mensalIdx = new Map();
  mensalV.forEach(function(r){
    if(!mensalIdx.has(r.cod)) mensalIdx.set(r.cod, []);
    mensalIdx.get(r.cod).push(r);
  });

  // Para cada vendedor: comparar jan-mar 2026 vs jan-mar 2025
  const compara = cad.map(function(v){
    const arr = mensalIdx.get(v.cod) || [];
    const jm25 = arr.filter(function(r){return r.ym >= '2025-01' && r.ym <= '2025-03';});
    const jm26 = arr.filter(function(r){return r.ym >= '2026-01' && r.ym <= '2026-03';});
    const fat25 = jm25.reduce(function(s,r){return s+r.fat_liq;}, 0);
    const fat26 = jm26.reduce(function(s,r){return s+r.fat_liq;}, 0);
    const luc25 = jm25.reduce(function(s,r){return s+r.lucro;}, 0);
    const luc26 = jm26.reduce(function(s,r){return s+r.lucro;}, 0);
    const nfs26 = jm26.reduce(function(s,r){return s+r.nfs;}, 0);
    const cli26 = jm26.reduce(function(s,r){return s+r.clientes;}, 0);

    return {
      cod: v.cod, nome: v.nome, loja: v.loja, supervisor: v.supervisor,
      fat25: fat25, fat26: fat26, luc25: luc25, luc26: luc26,
      cresce: fat25>0 ? (fat26/fat25 - 1)*100 : null,
      dif_abs: fat26 - fat25,
      marg26: fat26>0 ? luc26/fat26*100 : 0,
      marg25: fat25>0 ? luc25/fat25*100 : 0,
      ticket26: nfs26>0 ? fat26/nfs26 : 0,
      clientes26: cli26,
      ativo26: fat26 > 0,
      ativo25: fat25 > 0,
    };
  });

  // KPIs comparativos
  const ativos25 = compara.filter(function(x){return x.ativo25;}).length;
  const ativos26 = compara.filter(function(x){return x.ativo26;}).length;
  const novos = compara.filter(function(x){return !x.ativo25 && x.ativo26;}).length;
  const desligados = compara.filter(function(x){return x.ativo25 && !x.ativo26;}).length;

  // Crescimento ponderado total jan-mar
  const totFat26 = compara.reduce(function(s,x){return s+x.fat26;}, 0);
  const totFat25 = compara.reduce(function(s,x){return s+x.fat25;}, 0);
  const cresceMedio = totFat25>0 ? (totFat26/totFat25 - 1)*100 : 0;

  // Top 10 maiores quedas e maiores crescimentos (apenas RCAs ativos nos 2 anos)
  const ativosBoth = compara.filter(function(x){return x.ativo25 && x.ativo26 && x.fat25 > 10000;});
  const topCresce = ativosBoth.slice().sort(function(a,b){return (b.cresce||0) - (a.cresce||0);}).slice(0, 10);
  const topCai = ativosBoth.slice().sort(function(a,b){return (a.cresce||0) - (b.cresce||0);}).slice(0, 10);

  // Top 10 por margem (apenas com fat_liq > 50k pra evitar outliers)
  const ativos26Filt = compara.filter(function(x){return x.fat26 > 50000;});
  const topMargem = ativos26Filt.slice().sort(function(a,b){return b.marg26 - a.marg26;}).slice(0, 10);
  const topTicket = ativos26Filt.slice().sort(function(a,b){return b.ticket26 - a.ticket26;}).slice(0, 10);

  let html = '<div class="ph"><div class="pk">Vendas · Análise</div><h2><em>RCA</em> · Análise por Vendedor</h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   'Comparativo: <strong>jan-mar 2026 vs jan-mar 2025</strong> · '
       +   'Filtros: rankings consideram apenas vendedores com faturamento > R$ 10k em 2025 e ativos em 2026.'
       + '</div>';

  // KPIs
  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px;" id="kg-vbm"></div>';

  // [removido em v4.13] Top 10 crescimentos e quedas removidos a pedido do usuário

  // Scatter de distribuição removido a pedido do usuário

  // Linha 3: Top 10 por margem + Top 10 por ticket
  html += '<div class="row2eq" style="margin-bottom:12px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Top 10 por margem</div>'
       +      '<div class="ccs">jan-mar 2026 · com fat. > R$ 50k</div>'
       +      '<div class="tscroll"><table class="t"><thead><tr>'
       +        '<th class="L" style="width:24px;">#</th><th class="L">Vendedor</th>'
       +        '<th class="L">Loja</th><th>Fat. 2026</th><th>Margem</th>'
       +      '</tr></thead><tbody id="tb-vbm-marg"></tbody></table></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">Top 10 por ticket médio</div>'
       +      '<div class="ccs">jan-mar 2026 · ticket = fat / NFs</div>'
       +      '<div class="tscroll"><table class="t"><thead><tr>'
       +        '<th class="L" style="width:24px;">#</th><th class="L">Vendedor</th>'
       +        '<th class="L">Loja</th><th>NFs</th><th>Ticket</th>'
       +      '</tr></thead><tbody id="tb-vbm-tick"></tbody></table></div>'
       +    '</div>'
       + '</div>';

  // Tabela completa do benchmarking
  html += '<div class="cc">'
       +    '<div class="cct">Comparativo geral (todos os vendedores ativos)</div>'
       +    '<div class="ccs">Ordenado por crescimento percentual · clique no nome para ver detalhe no Drill-Down</div>'
       +    '<div class="tscroll"><table class="t" id="t-vbm">'
       +      '<thead><tr>'
       +      '<th class="L">Vendedor</th><th class="L">Loja</th>'
       +      '<th>Fat. jan-mar/25</th><th>Fat. jan-mar/26</th>'
       +      '<th>Δ R$</th><th>Δ %</th>'
       +      '<th>Margem 26</th><th>Status</th>'
       +      '</tr></thead><tbody id="tb-vbm"></tbody></table></div>'
       + '</div>';

  html += '</div>'; // page-body
  cont.innerHTML = html;

  // ─── KPIs ───
  document.getElementById('kg-vbm').innerHTML = kgHtml([
    {l:'Ativos jan-mar/25', v:fI(ativos25), s:'no período'},
    {l:'Ativos jan-mar/26', v:fI(ativos26), s:fI(novos)+' novos · '+fI(desligados)+' desligados'},
    {l:'Crescimento médio', v:(cresceMedio>=0?'+':'')+fP(cresceMedio), s:'ponderado por fat.', cls:cresceMedio>=0?'up':'dn'},
    {l:'Δ Faturamento total', v:(totFat26-totFat25>=0?'+':'')+fK(totFat26-totFat25), s:'jan-mar/26 vs jan-mar/25', cls:totFat26>totFat25?'up':'dn'},
  ]);

  // [removido em v4.13] Charts de top crescimentos e quedas removidos a pedido do usuário

  // ─── Chart: scatter ───
  // Apenas RCAs com fat 2026 > 0
  const scatterData = compara.filter(function(x){return x.fat26 > 0 && x.cresce !== null;});
  const lojaCor = {'ATP-V':_PAL.ac, 'ATP-A':_PAL.hl};
  const datasetsScatter = ['ATP-V','ATP-A'].map(function(loja){
    const pontos = scatterData.filter(function(x){return x.loja===loja;});
    return {
      label: loja==='ATP-V'?'ATP Varejo':'ATP Atacado',
      data: pontos.map(function(x){
        return {x: x.fat26, y: x.cresce, r: Math.min(20, Math.max(3, x.ticket26/200)),
                _nome: x.nome, _cod: x.cod, _ticket: x.ticket26};
      }),
      backgroundColor: (lojaCor[loja]||'#888')+'AA',
      borderColor: lojaCor[loja]||'#888',
      borderWidth:1.5,
    };
  });

  mkC('c-vbm-scatter', {type:'bubble', data:{datasets:datasetsScatter},
    options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'bottom', labels:{padding:10, usePointStyle:true, boxWidth:8}},
               tooltip:{callbacks:{label:function(ctx){
                 const p = ctx.raw;
                 return [p._nome+' (#'+p._cod+')', 'Fat. 26: '+fK(p.x),
                         'Crescimento: '+(p.y>=0?'+':'')+fP(p.y), 'Ticket: '+fK(p._ticket)];
               }}}},
      scales:{
        x:{title:{display:true,text:'Faturamento jan-mar/26 (R$)'},ticks:{callback:function(v){return fAbbr(v);}}},
        y:{title:{display:true,text:'Crescimento vs 2025 (%)'},ticks:{callback:function(v){return (v>=0?'+':'')+fP(v);}}},
      }}});

  // ─── Tabelas top margem e top ticket ───
  document.getElementById('tb-vbm-marg').innerHTML = topMargem.map(function(x, i){
    const margCls = x.marg26>15 ? 'val-pos' : '';
    return '<tr>'
      + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
      + '<td class="L"><div style="font-weight:600;">'+esc(x.nome)+'</div></td>'
      + '<td class="L">'+esc(x.loja||'—')+'</td>'
      + '<td>'+fK(x.fat26)+'</td>'
      + '<td class="'+margCls+'"><strong>'+fP(x.marg26)+'</strong></td>'
      + '</tr>';
  }).join('');

  document.getElementById('tb-vbm-tick').innerHTML = topTicket.map(function(x, i){
    const nfs = x.fat26>0 && x.ticket26>0 ? Math.round(x.fat26/x.ticket26) : 0;
    return '<tr>'
      + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
      + '<td class="L"><div style="font-weight:600;">'+esc(x.nome)+'</div></td>'
      + '<td class="L">'+esc(x.loja||'—')+'</td>'
      + '<td class="val-dim">'+fI(nfs)+'</td>'
      + '<td><strong>'+fK(x.ticket26)+'</strong></td>'
      + '</tr>';
  }).join('');

  // ─── Tabela geral ───
  // Sort por crescimento (nulls no fim)
  const compSort = compara.slice().sort(function(a,b){
    if(a.cresce === null && b.cresce === null) return 0;
    if(a.cresce === null) return 1;
    if(b.cresce === null) return -1;
    return b.cresce - a.cresce;
  });
  document.getElementById('tb-vbm').innerHTML = compSort.map(function(x){
    const difCls = x.dif_abs>=0 ? 'val-pos' : 'val-neg';
    let status, statusCls;
    if(!x.ativo25 && x.ativo26){ status = 'Novo em 26'; statusCls = 'val-pos'; }
    else if(x.ativo25 && !x.ativo26){ status = 'Desligado'; statusCls = 'val-neg'; }
    else if(x.ativo25 && x.ativo26){ status = 'Ativo'; statusCls = ''; }
    else { status = '—'; statusCls = 'val-dim'; }
    const cresceStr = x.cresce===null ? '—' : (x.cresce>=0?'+':'')+fP(x.cresce);
    const cresceCls = x.cresce===null ? 'val-dim' : x.cresce>=0?'val-pos':'val-neg';
    return '<tr>'
      + '<td class="L"><div style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text-muted);">#'+esc(x.cod)+'</div>'
      +    '<div style="font-weight:600;">'+esc(x.nome)+'</div></td>'
      + '<td class="L">'+esc(x.loja||'—')+'</td>'
      + '<td class="val-dim">'+(x.fat25>0?fK(x.fat25):'—')+'</td>'
      + '<td>'+(x.fat26>0?fK(x.fat26):'—')+'</td>'
      + '<td class="'+difCls+'">'+(x.dif_abs>=0?'+':'')+fK(x.dif_abs)+'</td>'
      + '<td class="'+cresceCls+'">'+cresceStr+'</td>'
      + '<td>'+(x.fat26>0?fP(x.marg26):'—')+'</td>'
      + '<td class="'+statusCls+'">'+status+'</td>'
      + '</tr>';
  }).join('');
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
      + '<div class="cc" style="text-align:center;color:var(--text-muted);padding:30px;">Sem dados de departamentos</div></div>';
    return;
  }

  // Filtrar INATIVO (depto cod=11) — não é interesse de análise
  const deptosFilt = Filtros.deptosValidos(deptos);

  // Agregar por depto (todos os meses, todas as lojas)
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

  const totalGeral = deptoArr.reduce(function(s,d){return s+d.fat_liq;}, 0);

  // Último mês para análise temporal
  const yms = [...new Set(deptosFilt.map(function(r){return r.ym;}))].sort();
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

  // KPIs
  html += '<div class="kg" style="grid-template-columns:repeat(5,1fr);margin-bottom:14px;" id="kg-vit"></div>';

  // Linha 1: pizza geral + barras evolução por depto top 5
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

  // [removido em v4.13] Scatter "Faturamento × Preço médio por departamento"

  // Tabela departamentos
  html += '<div class="cc" style="margin-bottom:12px;">'
       +    '<div class="cct">Departamentos — visão consolidada</div>'
       +    '<div class="ccs">Período total · ordenado por faturamento</div>'
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
       +    '<div class="ccs" style="display:flex;gap:10px;align-items:center;">'
       +      '<span>Filtre por departamento:</span>'
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

  // ─── Tabela departamentos ───
  document.getElementById('tb-vit-dept').innerHTML = deptoArr.map(function(d, i){
    const pct = totalGeral>0 ? d.fat_liq/totalGeral*100 : 0;
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

  // ─── Tabela categorias com filtro ───
  function rebuildCats(){
    const fltCod = document.getElementById('flt-vit-dept').value;
    let rows = cats.slice();

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
}

// ────────────────────────────────────────────────────────────────────
// V VENDAS DIÁRIAS (sub-etapa 4c.4)
// Análise diária: top 10 dias, ticket médio por dia da semana, distribuição
// ────────────────────────────────────────────────────────────────────
function renderVDiarias(){
  const cont = document.getElementById('page-v-vendas-diarias');
  if(!cont) return;

  const diario = V.diario || [];
  if(!diario.length){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Vendas <em>Diárias</em></h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc" style="text-align:center;color:var(--text-muted);padding:30px;">Sem dados diários</div></div>';
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
       +   'período '+dias[0].data+' a '+dias[dias.length-1].data+' · '
       +   'consolidado ATP-V + ATP-A'
       + '</div>';

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
    {l:'Maior dia',    v:top1?fK(top1.fat_liq):'—', s:top1?(top1.data+' · '+diaSemNome[top1DataDt.getDay()]):'',  cls:'hl'},
    {l:'Menor dia',    v:bot10[0]?fK(bot10[0].fat_liq):'—', s:bot10[0]?bot10[0].data:''},
    {l:'Total dias trabalhados', v:fI(dias.length), s:'cobertura completa'},
  ]);

  // ─── Chart top 10 ───
  mkC('c-vd-top', {type:'bar',
    data:{labels:top10.map(function(d){
      const dt = new Date(d.data+'T12:00:00');
      return d.data+' ('+diaSemAbrev[dt.getDay()]+')';
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
      return d.data+' ('+diaSemAbrev[dt.getDay()]+')';
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
      + '<td class="L"><strong>'+esc(d.data)+'</strong></td>'
      + '<td class="L">'+diaSemNome[dt.getDay()]+'</td>'
      + '<td class="val-strong">'+fK(d.fat_liq)+'</td>'
      + '<td class="val-dim">'+fI(d.nfs)+'</td>'
      + '</tr>';
  }
  document.getElementById('tb-vd-top').innerHTML = top10.map(rowDay).join('');
  document.getElementById('tb-vd-bot').innerHTML = bot10.map(rowDay).join('');
}

// ────────────────────────────────────────────────────────────────────
// V DIAS C&P (sub-etapa 4c.4)
// Heurística: identifica "dias atípicos" (provavelmente promocionais)
// como aqueles com fat > 1.5× a média do mesmo dia da semana.
// Quando o cliente fornecer calendário oficial, substituir essa lógica.
// ────────────────────────────────────────────────────────────────────
function renderVDiasCP(){
  const cont = document.getElementById('page-v-dias-cp');
  if(!cont) return;

  const diario = V.diario || [];
  if(!diario.length){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Dias <em>C &amp; P</em></h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc" style="text-align:center;color:var(--text-muted);padding:30px;">Sem dados diários</div></div>';
    return;
  }

  const LIMIAR = 1.5; // fator do limiar para considerar "atípico"

  // Calcular média e desvio por (loja, dia da semana)
  function calcMedias(lojaFiltro){
    const linhas = lojaFiltro ? diario.filter(function(r){return r.loja === lojaFiltro;}) : diario;
    const mediasPorDS = Array(7).fill(null).map(function(){return {fat:0, count:0};});
    linhas.forEach(function(r){
      const ds = new Date(r.data+'T12:00:00').getDay();
      mediasPorDS[ds].fat += r.fat_liq||0;
      mediasPorDS[ds].count++;
    });
    return mediasPorDS.map(function(x){return x.count>0 ? x.fat/x.count : 0;});
  }

  const mediasV = calcMedias('ATP-V');
  const mediasA = calcMedias('ATP-A');

  // Marcar cada linha como "atípica" ou "normal" baseado na média do mesmo dia da semana da mesma loja
  function classifica(r){
    const ds = new Date(r.data+'T12:00:00').getDay();
    const med = r.loja === 'ATP-V' ? mediasV[ds] : mediasA[ds];
    if(med <= 0) return 'normal';
    return r.fat_liq >= LIMIAR * med ? 'atipico' : 'normal';
  }
  const classificado = diario.map(function(r){
    return Object.assign({}, r, {classe: classifica(r)});
  });

  const atipicos = classificado.filter(function(r){return r.classe === 'atipico';});
  const normais  = classificado.filter(function(r){return r.classe === 'normal';});

  // Agregar atípicos por data (consolidando lojas) — possíveis "eventos"
  const atipicosByData = new Map();
  atipicos.forEach(function(r){
    if(!atipicosByData.has(r.data)) atipicosByData.set(r.data, {data:r.data, fat:0, lojas:[], lojas_atip:0});
    const x = atipicosByData.get(r.data);
    x.fat += r.fat_liq||0;
    x.lojas.push({loja:r.loja, fat:r.fat_liq, dia_sem:new Date(r.data+'T12:00:00').getDay()});
    x.lojas_atip++;
  });
  // Para cada data atípica, verificar fat total daquele dia (todas lojas — incluso normais)
  const totalDia = new Map();
  diario.forEach(function(r){
    if(!totalDia.has(r.data)) totalDia.set(r.data, 0);
    totalDia.set(r.data, totalDia.get(r.data) + (r.fat_liq||0));
  });
  const eventos = Array.from(atipicosByData.values()).map(function(e){
    return {
      data: e.data, fat_atipico: e.fat, fat_total_dia: totalDia.get(e.data) || 0,
      lojas_atip: e.lojas_atip, lojas: e.lojas,
    };
  }).sort(function(a,b){return b.fat_total_dia - a.fat_total_dia;});

  // Identificar "blocos consecutivos" de 2-3 dias com atípicos (potenciais eventos)
  const datasEventoSet = new Set(eventos.map(function(e){return e.data;}));
  const datasOrdenadas = Array.from(datasEventoSet).sort();
  const blocos = [];
  let atual = [];
  for(let i = 0; i < datasOrdenadas.length; i++){
    const d = datasOrdenadas[i];
    const dPrev = i>0 ? datasOrdenadas[i-1] : null;
    if(!dPrev){ atual = [d]; continue; }
    const diff = Math.round((new Date(d) - new Date(dPrev)) / 86400000);
    if(diff <= 1){
      atual.push(d);
    } else {
      if(atual.length >= 2) blocos.push(atual);
      atual = [d];
    }
  }
  if(atual.length >= 2) blocos.push(atual);

  // Estatísticas comparativas
  const fatAtip = atipicos.reduce(function(s,r){return s+r.fat_liq;}, 0);
  const fatNormal = normais.reduce(function(s,r){return s+r.fat_liq;}, 0);
  const mediaAtip = atipicos.length>0 ? fatAtip/atipicos.length : 0;
  const mediaNormal = normais.length>0 ? fatNormal/normais.length : 0;
  const premium = mediaNormal>0 ? (mediaAtip/mediaNormal - 1)*100 : 0;

  let html = '<div class="ph"><div class="pk">Vendas · Análise</div><h2>Dias <em>C &amp; P</em></h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // Banner explicando heurística
  html += '<div style="background:var(--warning-bg);border:1px solid var(--warning);border-radius:8px;padding:12px 14px;margin-bottom:14px;display:flex;align-items:start;gap:10px;">'
       +   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
       +   '<div style="font-size:12px;color:var(--warning);line-height:1.5;">'
       +     '<strong>Aviso · análise heurística:</strong> os dados não trazem identificação oficial de dias promocionais. '
       +     'Esta página identifica <strong>dias atípicos</strong> como aqueles com faturamento ≥ <strong>'+LIMIAR+'×</strong> a média do mesmo dia da semana na mesma loja. '
       +     'Quando o cliente fornecer o calendário oficial de eventos C&P, esta lógica deve ser substituída.'
       +   '</div>'
       + '</div>';

  // KPIs
  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px;" id="kg-vcp"></div>';

  // Linha 1: top 10 atípicos + comparativo médias
  html += '<div class="row2eq" style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">🏆 Top 10 dias atípicos</div>'
       +      '<div class="ccs">Faturamento total do dia (consolidado)</div>'
       +      '<div style="height:280px;"><canvas id="c-vcp-top"></canvas></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">Premium dos atípicos vs normais</div>'
       +      '<div class="ccs">Comparativo de média diária por loja</div>'
       +      '<div style="height:280px;"><canvas id="c-vcp-comp"></canvas></div>'
       +    '</div>'
       + '</div>';

  // Linha 2: distribuição mensal de atípicos
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cct">Distribuição mensal de dias atípicos</div>'
       +    '<div class="ccs">Quantidade de dias e fat total por mês</div>'
       +    '<div style="height:240px;"><canvas id="c-vcp-mensal"></canvas></div>'
       + '</div>';

  // Tabela eventos
  html += '<div class="cc" style="margin-bottom:12px;">'
       +    '<div class="cct">Eventos detectados (top 30 dias atípicos)</div>'
       +    '<div class="ccs">Dias com fat. ≥ '+LIMIAR+'× a média do mesmo dia da semana</div>'
       +    '<div class="tscroll"><table class="t" id="t-vcp-eventos">'
       +      '<thead><tr>'
       +      '<th class="L" style="width:24px;">#</th>'
       +      '<th class="L">Data</th><th class="L">Dia</th>'
       +      '<th>Fat. total dia</th>'
       +      '<th>Lojas atípicas</th>'
       +      '<th class="L">Detalhe</th>'
       +      '</tr></thead><tbody id="tb-vcp-eventos"></tbody></table></div>'
       + '</div>';

  // Blocos consecutivos
  html += '<div class="cc">'
       +    '<div class="cct">Possíveis eventos plurianuais (2+ dias consecutivos atípicos)</div>'
       +    '<div class="ccs">Sequências contíguas de dias atípicos · '+blocos.length+' blocos identificados</div>'
       +    '<div class="tscroll"><table class="t"><thead><tr>'
       +      '<th class="L">Período</th>'
       +      '<th>Duração</th>'
       +      '<th>Fat. total bloco</th>'
       +      '</tr></thead><tbody id="tb-vcp-blocos"></tbody></table></div>'
       + '</div>';

  html += '</div>';
  cont.innerHTML = html;

  // ─── KPIs ───
  document.getElementById('kg-vcp').innerHTML = kgHtml([
    {l:'Dias atípicos detectados', v:fI(eventos.length), s:'em '+fI(diario.length)+' dia-loja', cls:'hl'},
    {l:'Fat. total atípicos',      v:fK(fatAtip), s:(fatAtip+fatNormal)>0?fP(fatAtip/(fatAtip+fatNormal)*100)+' do total':'sem dados'},
    {l:'Premium médio',            v:'+'+fP(premium), s:'média atípicos vs normais', cls:'up'},
    {l:'Blocos contíguos',         v:fI(blocos.length), s:'2+ dias consecutivos'},
  ]);

  // ─── Chart: top 10 atípicos ───
  const top10ev = eventos.slice(0, 10);
  mkC('c-vcp-top', {type:'bar',
    data:{labels:top10ev.map(function(e){
      const dt = new Date(e.data+'T12:00:00');
      const ds = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
      return e.data+' ('+ds[dt.getDay()]+')';
    }), datasets:[{label:'Fat. dia', data:top10ev.map(function(e){return e.fat_total_dia;}),
      backgroundColor:_PAL.hl+'CC', borderRadius:3}]},
    options:{indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false},
               tooltip:{callbacks:{label:function(ctx){
                 const e = top10ev[ctx.dataIndex];
                 return [fB(ctx.raw), e.lojas_atip+' loja(s) atípica(s)'];
               }}}},
      scales:{x:{ticks:{callback:function(v){return fAbbr(v);}}},
              y:{ticks:{font:{size:10}}}}}});

  // Chart: comparativo
  // Médias atípicos vs normais por loja
  const fatA_atip = atipicos.filter(function(r){return r.loja==='ATP-A';}).reduce(function(s,r){return s+r.fat_liq;}, 0);
  const cntA_atip = atipicos.filter(function(r){return r.loja==='ATP-A';}).length;
  const fatV_atip = atipicos.filter(function(r){return r.loja==='ATP-V';}).reduce(function(s,r){return s+r.fat_liq;}, 0);
  const cntV_atip = atipicos.filter(function(r){return r.loja==='ATP-V';}).length;
  const fatA_norm = normais.filter(function(r){return r.loja==='ATP-A';}).reduce(function(s,r){return s+r.fat_liq;}, 0);
  const cntA_norm = normais.filter(function(r){return r.loja==='ATP-A';}).length;
  const fatV_norm = normais.filter(function(r){return r.loja==='ATP-V';}).reduce(function(s,r){return s+r.fat_liq;}, 0);
  const cntV_norm = normais.filter(function(r){return r.loja==='ATP-V';}).length;

  mkC('c-vcp-comp', {type:'bar',
    data:{labels:['ATP Varejo','ATP Atacado'],
      datasets:[
        {label:'Média dias normais', data:[
          cntV_norm>0?fatV_norm/cntV_norm:0,
          cntA_norm>0?fatA_norm/cntA_norm:0,
        ], backgroundColor:_PAL.ac+'CC', borderRadius:4},
        {label:'Média dias atípicos', data:[
          cntV_atip>0?fatV_atip/cntV_atip:0,
          cntA_atip>0?fatA_atip/cntA_atip:0,
        ], backgroundColor:_PAL.ok+'CC', borderRadius:4},
      ]},
    options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'bottom', labels:{padding:10, usePointStyle:true, boxWidth:8}},
               tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+fB(ctx.raw);}}}},
      scales:{y:{beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}},
              x:{grid:{display:false}}}}});

  // ─── Chart mensal ───
  const mensalCP = new Map();
  eventos.forEach(function(e){
    const ym = e.data.substring(0, 7);
    if(!mensalCP.has(ym)) mensalCP.set(ym, {ym:ym, count:0, fat:0});
    const x = mensalCP.get(ym);
    x.count++;
    x.fat += e.fat_total_dia;
  });
  const mensalArr = Array.from(mensalCP.values()).sort(function(a,b){return a.ym<b.ym?-1:1;});
  mkC('c-vcp-mensal', {data:{labels:mensalArr.map(function(m){return _ymToLabel(m.ym);}),
    datasets:[
      {type:'bar', label:'Qtd dias atípicos', data:mensalArr.map(function(m){return m.count;}),
        backgroundColor:_PAL.hl+'CC', borderRadius:4, yAxisID:'y'},
      {type:'line', label:'Fat. total atípicos', data:mensalArr.map(function(m){return m.fat;}),
        borderColor:_PAL.ok, backgroundColor:'rgba(16,152,84,.1)', tension:.3, pointRadius:4, yAxisID:'y2'},
    ]},
    options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'bottom', labels:{padding:10, usePointStyle:true, boxWidth:8}},
               tooltip:{callbacks:{label:function(ctx){
                 if(ctx.dataset.label.indexOf('Qtd') === 0) return 'Qtd: '+fI(ctx.raw)+' dias';
                 return 'Fat: '+fB(ctx.raw);
               }}}},
      scales:{
        y:{beginAtZero:true, position:'left', title:{display:true,text:'Qtd dias'}},
        y2:{position:'right', grid:{display:false}, ticks:{callback:function(v){return fAbbr(v);}}, title:{display:true,text:'Fat (R$)'}},
        x:{grid:{display:false}, ticks:{maxRotation:60, minRotation:45, font:{size:9}}}
      }}});

  // ─── Tabela eventos ───
  const ds = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  document.getElementById('tb-vcp-eventos').innerHTML = eventos.slice(0, 30).map(function(e, i){
    const dt = new Date(e.data+'T12:00:00');
    const detalhe = e.lojas.map(function(l){return l.loja+': '+fK(l.fat);}).join(' · ');
    return '<tr>'
      + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
      + '<td class="L"><strong>'+esc(e.data)+'</strong></td>'
      + '<td class="L">'+ds[dt.getDay()]+'</td>'
      + '<td class="val-strong">'+fK(e.fat_total_dia)+'</td>'
      + '<td>'+e.lojas_atip+'/2</td>'
      + '<td class="L" style="font-size:10px;color:var(--text-muted);">'+esc(detalhe)+'</td>'
      + '</tr>';
  }).join('');

  // ─── Tabela blocos ───
  if(!blocos.length){
    document.getElementById('tb-vcp-blocos').innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:18px;">Nenhum bloco contíguo de 2+ dias detectado</td></tr>';
  } else {
    document.getElementById('tb-vcp-blocos').innerHTML = blocos.map(function(bl){
      const fatBloco = bl.reduce(function(s, d){
        const e = eventos.find(function(x){return x.data === d;});
        return s + (e ? e.fat_total_dia : 0);
      }, 0);
      return '<tr>'
        + '<td class="L"><strong>'+bl[0]+' a '+bl[bl.length-1]+'</strong></td>'
        + '<td>'+bl.length+' dias</td>'
        + '<td class="val-strong">'+fK(fatBloco)+'</td>'
        + '</tr>';
    }).sort(function(a,b){
      // Sort por fat (extrair do html) — simplifica: deixa na ordem cronológica
      return 0;
    }).join('');
  }
}

// ────────────────────────────────────────────────────────────────────
// V ALERTAS · gerados heuristicamente (sub-etapa 4c.5)
// Vasculha V/E/F para detectar situações que merecem atenção:
// vendedores em queda, deptos com margem ruim, SKUs em ruptura, etc.
// ────────────────────────────────────────────────────────────────────
function renderVAlertas(){
  const cont = document.getElementById('page-v-alertas');
  if(!cont) return;

  // ─── Coleta de alertas ───
  const alertas = [];

  // Tipo 1: Vendedores em queda forte (jan-mar 26 vs 25, > -30%)
  if(V && V.vendedores && V.vendedores.cadastro && V.vendedores.mensal){
    const cad = Filtros.vendedoresAtivos(V.vendedores.cadastro);
    const mensalIdx = new Map();
    V.vendedores.mensal.forEach(function(r){
      if(!mensalIdx.has(r.cod)) mensalIdx.set(r.cod, []);
      mensalIdx.get(r.cod).push(r);
    });

    cad.forEach(function(v){
      const arr = mensalIdx.get(v.cod) || [];
      const f25 = arr.filter(function(r){return r.ym>='2025-01' && r.ym<='2025-03';})
                      .reduce(function(s,r){return s+r.fat_liq;}, 0);
      const f26 = arr.filter(function(r){return r.ym>='2026-01' && r.ym<='2026-03';})
                      .reduce(function(s,r){return s+r.fat_liq;}, 0);
      // Só alerta para vendedores com volume relevante (> R$ 50k em 25)
      if(f25 < 50000 || f26 === 0) return;
      const cresce = (f26/f25 - 1)*100;
      if(cresce <= -30){
        alertas.push({
          severity: cresce <= -50 ? 'crit' : 'warn',
          tipo: 'Vendedor em queda',
          titulo: '#'+v.cod+' '+v.nome,
          desc: (v.loja||'?')+' · '+v.supervisor+' · '+fK(f25)+' (25) → '+fK(f26)+' (26)',
          metric: fP(cresce),
          metricCls: 'val-neg',
          ordem: cresce, // mais negativo primeiro
        });
      }
    });
  }

  // Tipo 2: Departamentos com margem baixa (< 5%) e fat relevante
  if(V && V.deptos){
    const deptoAgg = new Map();
    Filtros.deptosValidos(V.deptos).forEach(function(r){
      const k = r.cod;
      if(!deptoAgg.has(k)) deptoAgg.set(k, {cod:r.cod, nome:r.nome, fat:0, lucro:0});
      const x = deptoAgg.get(k);
      x.fat += r.fat_liq||0;
      x.lucro += r.lucro||0;
    });
    deptoAgg.forEach(function(d){
      if(d.fat < 1000000) return; // só deptos relevantes
      const marg = d.fat>0 ? d.lucro/d.fat*100 : 0;
      if(marg < 5){
        alertas.push({
          severity: marg < 3 ? 'crit' : 'warn',
          tipo: 'Margem baixa em depto',
          titulo: d.nome,
          desc: 'Fat. '+fK(d.fat)+' · Lucro '+fK(d.lucro),
          metric: fP(marg),
          metricCls: 'val-neg',
          ordem: marg,
        });
      }
    });
  }

  // Tipo 3: SKUs em ruptura (estoque=0, mas com vendas históricas relevantes)
  if(E && E.produtos){
    const ruptura = [];
    E.produtos.forEach(function(p){
      const eq = (p.estoque && p.estoque.qt) || 0;
      if(eq > 0) return;
      // Vendas nos últimos 3 meses (últimos 3 elementos de vendas_por_mes)
      const vpm = p.vendas_por_mes || [];
      if(!vpm.length) return;
      const ult3 = vpm.slice(-3);
      const fatUlt3 = ult3.reduce(function(s,m){return s + (m.fat_liq||0);}, 0);
      if(fatUlt3 < 5000) return; // só rupturas relevantes
      ruptura.push({cod:p.cod, desc:p.desc, fat:fatUlt3, depto:p.depto && p.depto.nome});
    });
    // Top 30 rupturas
    ruptura.sort(function(a,b){return b.fat - a.fat;});
    ruptura.slice(0, 30).forEach(function(r){
      alertas.push({
        severity: r.fat > 50000 ? 'crit' : 'warn',
        tipo: 'SKU em ruptura',
        titulo: '#'+r.cod+' '+(r.desc||''),
        desc: (r.depto||'?')+' · vendas últimos 3 meses: '+fK(r.fat),
        metric: '0 un',
        metricCls: 'val-neg',
        ordem: -r.fat, // maior fat primeiro
      });
    });
  }

  // Tipo 4: Concentração crítica em vendedores (top 5 > 50% do total)
  if(V && V.vendedores && V.vendedores.mensal){
    // Identificar vendedores cujo supervisor está ignorado
    const cadIdx = new Map();
    (V.vendedores.cadastro||[]).forEach(function(v){ cadIdx.set(v.cod, v); });
    const totalVend = new Map();
    V.vendedores.mensal.forEach(function(r){
      const v = cadIdx.get(r.cod);
      // Pula se temos cadastro E ele está com supervisor marcado como ignorado.
      // Se não houver cadastro, mantém (vendedor desconhecido conta).
      if(v && _isSupervisorIgnorado(v.loja, v.cod_supervisor)) return;
      totalVend.set(r.cod, (totalVend.get(r.cod)||0) + (r.fat_liq||0));
    });
    const arr = Array.from(totalVend.entries()).map(function(kv){return {cod:kv[0], fat:kv[1]};})
                    .sort(function(a,b){return b.fat-a.fat;});
    const grandeTotal = arr.reduce(function(s,x){return s+x.fat;}, 0);
    const top5 = arr.slice(0, 5).reduce(function(s,x){return s+x.fat;}, 0);
    const pct5 = grandeTotal>0 ? top5/grandeTotal*100 : 0;
    if(pct5 > 50){
      alertas.push({
        severity: 'warn',
        tipo: 'Concentração de vendedores',
        titulo: 'Top 5 vendedores = '+fP(pct5)+' do faturamento',
        desc: 'Risco de dependência · queda de qualquer um afeta proporcionalmente',
        metric: fP(pct5),
        metricCls: 'hl',
        ordem: -pct5,
      });
    }
  }

  // Tipo 5: Vencidos críticos (faixa 91+ dias)
  if(F && F.aberto && F.aberto.aging && F.aberto.aging.VENCIDO_90_PLUS){
    const f = F.aberto.aging.VENCIDO_90_PLUS;
    if(f.valor > 100000){
      alertas.push({
        severity: 'crit',
        tipo: 'Vencidos > 90 dias',
        titulo: 'Atraso crítico em pagamentos',
        desc: fI(f.titulos||0)+' títulos · vencimento >90 dias',
        metric: fK(f.valor),
        metricCls: 'val-neg',
        ordem: -f.valor,
      });
    }
  }

  // Tipo 6: Recebimentos atrasados — top cliente concentra muito
  if(R && R.concentracao && R.concentracao.top_1_pct > 30 && R.por_cliente_top){
    const c = R.por_cliente_top[0];
    alertas.push({
      severity: 'warn',
      tipo: 'Concentração de inadimplência',
      titulo: 'Cliente cod='+c.cod+' = '+fP(R.concentracao.top_1_pct)+' do total atrasado',
      desc: fI(c.parcelas||0)+' parcelas · '+(c.dias_atraso_max||'?')+' dias máx atraso',
      metric: fK(c.valor),
      metricCls: 'val-neg',
      ordem: -c.valor,
    });
  }

  // Ordenar alertas: crit antes de warn, e dentro do grupo, por ordem
  alertas.sort(function(a,b){
    const sevOrder = {crit:0, warn:1, info:2};
    if(sevOrder[a.severity] !== sevOrder[b.severity]){
      return sevOrder[a.severity] - sevOrder[b.severity];
    }
    return a.ordem - b.ordem;
  });

  // Contagem por tipo
  const porTipo = new Map();
  alertas.forEach(function(a){
    porTipo.set(a.tipo, (porTipo.get(a.tipo)||0) + 1);
  });

  // ─── HTML ───
  let html = '<div class="ph"><div class="pk">Vendas · Alertas</div><h2>Alertas <em>Heurísticos</em></h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>Análise automática</strong> · alertas gerados a partir dos dados disponíveis (vendas, estoque, financeiro, recebimentos). '
       +   'Esta página será personalizada quando o cliente definir regras específicas.'
       + '</div>';

  // KPIs por severidade
  const nCrit = alertas.filter(function(a){return a.severity==='crit';}).length;
  const nWarn = alertas.filter(function(a){return a.severity==='warn';}).length;

  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px;" id="kg-vala"></div>';

  // Tabela de alertas
  html += '<div class="cc">'
       +    '<div class="cct">'+alertas.length+' alertas detectados</div>'
       +    '<div class="ccs">Ordenado por severidade · clique no tipo para filtrar</div>'
       +    '<div style="padding:8px 0;display:flex;gap:6px;flex-wrap:wrap;" id="vala-filtros"></div>'
       +    '<div class="tscroll"><table class="t" id="t-vala">'
       +      '<thead><tr>'
       +      '<th class="L" style="width:80px;">Sev.</th>'
       +      '<th class="L">Tipo</th>'
       +      '<th class="L">Item</th>'
       +      '<th class="L">Detalhe</th>'
       +      '<th>Métrica</th>'
       +      '</tr></thead><tbody id="tb-vala"></tbody></table></div>'
       + '</div>';

  html += '</div>';
  cont.innerHTML = html;

  // KPIs
  document.getElementById('kg-vala').innerHTML = kgHtml([
    {l:'Total alertas',  v:fI(alertas.length), s:'detectados automaticamente'},
    {l:'Críticos',       v:fI(nCrit), s:'severity=crit', cls: nCrit>0?'dn':''},
    {l:'Avisos',         v:fI(nWarn), s:'severity=warn', cls: nWarn>0?'hl':''},
    {l:'Tipos distintos', v:fI(porTipo.size), s:'categorias diferentes'},
  ]);

  // Filtros por tipo
  const filtroDiv = document.getElementById('vala-filtros');
  let filtroAtivo = '';
  function rebuildAlertas(){
    let arr = alertas.slice();
    if(filtroAtivo) arr = arr.filter(function(a){return a.tipo === filtroAtivo;});

    document.getElementById('tb-vala').innerHTML = arr.map(function(a){
      const sevColor = a.severity==='crit' ? '#dc2626'
                     : a.severity==='warn' ? '#f59e0b'
                     : '#3b82f6';
      const sevLabel = a.severity==='crit' ? 'CRÍTICO'
                      : a.severity==='warn' ? 'AVISO'
                      : 'INFO';
      return '<tr>'
        + '<td class="L"><span style="display:inline-block;padding:2px 8px;border-radius:4px;background:'+sevColor+'18;color:'+sevColor+';font-weight:700;font-size:10px;font-family:JetBrains Mono,monospace;letter-spacing:.05em;">'+sevLabel+'</span></td>'
        + '<td class="L">'+esc(a.tipo)+'</td>'
        + '<td class="L"><strong>'+esc(a.titulo)+'</strong></td>'
        + '<td class="L" style="font-size:11px;color:var(--text-dim);">'+esc(a.desc)+'</td>'
        + '<td class="'+(a.metricCls||'')+'"><strong>'+esc(a.metric)+'</strong></td>'
        + '</tr>';
    }).join('');
  }

  // Botões de filtro
  const tipos = Array.from(porTipo.entries()).sort(function(a,b){return b[1]-a[1];});
  filtroDiv.innerHTML = '<button data-tipo="" style="padding:4px 10px;border:1px solid var(--accent);background:var(--accent);color:white;border-radius:4px;cursor:pointer;font-size:11px;font-family:inherit;">Todos ('+alertas.length+')</button>'
    + tipos.map(function(t){
      return '<button data-tipo="'+escAttr(t[0])+'" style="padding:4px 10px;border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:4px;cursor:pointer;font-size:11px;font-family:inherit;">'+esc(t[0])+' ('+t[1]+')</button>';
    }).join('');

  filtroDiv.querySelectorAll('button').forEach(function(btn){
    btn.addEventListener('click', function(){
      filtroAtivo = btn.dataset.tipo;
      // Atualizar visual
      filtroDiv.querySelectorAll('button').forEach(function(b){
        if(b.dataset.tipo === filtroAtivo){
          b.style.background = 'var(--accent)';
          b.style.color = 'white';
          b.style.borderColor = 'var(--accent)';
        } else {
          b.style.background = 'var(--surface)';
          b.style.color = 'var(--text)';
          b.style.borderColor = 'var(--border)';
        }
      });
      rebuildAlertas();
    });
  });

  rebuildAlertas();
}

// ────────────────────────────────────────────────────────────────────
// V METAS · placeholder explicativo (sub-etapa 4c.5)
// ────────────────────────────────────────────────────────────────────
function renderVMetas(){
  const cont = document.getElementById('page-v-metas');
  if(!cont) return;

  // Carrega metas e config (do localStorage primeiro, sync com Firebase em background)
  if(!window._metas) {
    window._metas = _loadMetas();
  }
  // Em paralelo, tenta puxar versão mais recente do Firebase e re-renderiza se mudou
  if(AUTH_MODE === 'firebase' && window.fbDb && !window._metas._fbLoaded){
    _loadMetasFirebase().then(function(remote){
      if(remote){
        window._metas._fbLoaded = true;
        renderVMetas();
      }
    });
  }
  const M = window._metas;
  const cfg = M.config || {};
  const supByFilial = cfg.supervisor_por_filial || {};
  const supNomes = cfg.supervisor_nomes || {};

  // Determinar visão atual
  const baseSlug = _getBaseSlug();
  const isGrupoOuConsolidado = (baseSlug === 'grupo' || baseSlug === 'cp');

  // Filiais alvo
  let filiaisAlvo;
  if(baseSlug === 'grupo') filiaisAlvo = ['atp','cp1','cp3','cp5','cp40'];
  else if(baseSlug === 'cp') filiaisAlvo = ['cp1','cp3','cp5','cp40'];
  else filiaisAlvo = [baseSlug];

  // Filiais que TÊM metas configuradas (excluindo CP1 que não tem)
  const filiaisComMeta = filiaisAlvo.filter(f => Array.isArray(supByFilial[f]) && supByFilial[f].length > 0);

  // Anos disponíveis (do realizado)
  const mensal = (V && V.mensal) || [];
  const anos = [...new Set(mensal.map(m => m.ym ? m.ym.slice(0,4) : null).filter(Boolean))].sort();
  const anoAtual = (new Date()).getFullYear().toString();
  const anoSel = anos.includes(anoAtual) ? anoAtual : (anos[anos.length-1] || anoAtual);

  let html = '<div class="ph"><div class="pk">Vendas · Análise</div><h2><em>Metas</em> e Realizado</h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // Header com botão Editor de Metas
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px;">';
  html += '<div style="font-size:12px;color:var(--text-dim);">Ano <select id="metas-ano" style="padding:4px 10px;border-radius:5px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-weight:600;">' + anos.map(a => '<option value="'+a+'" '+(a===anoSel?'selected':'')+'>'+a+'</option>').join('') + '</select></div>';
  html += '<button id="btn-abrir-editor-metas" class="ebtn" style="background:var(--accent);color:white;border:none;display:inline-flex;align-items:center;gap:6px;padding:7px 14px;font-size:12px;">';
  html += '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  html += 'Editor de metas';
  html += '</button>';
  html += '</div>';

  // Card resumo do mapeamento de supervisores
  html += '<div class="cc">';
  html += '<div class="cct">Mapeamento de supervisores por filial</div>';
  html += '<div class="ccs">A meta é definida sobre as vendas do supervisor abaixo. Para CP1 não há meta; demais informações continuam visíveis em outras análises.</div>';
  html += '<div style="margin-top:10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;">';
  filiaisAlvo.forEach(f => {
    const sups = supByFilial[f];
    const fNome = (_filiaisDisponiveis.find(x => x.sigla === f) || {}).nome || f.toUpperCase();
    const supLabel = (sups && sups.length)
      ? sups.map(s => '#' + s + ' ' + (supNomes[String(s)] || '')).join(', ')
      : '<em style="color:#888;">sem meta configurada</em>';
    html += '<div style="border:1px solid var(--border);border-radius:6px;padding:10px;background:#fafbfc;">'
      +    '<div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">'+esc(fNome)+'</div>'
      +    '<div style="font-size:13px;margin-top:4px;color:#1a1a1a;">'+supLabel+'</div>'
      +  '</div>';
  });
  html += '</div></div>';

  // Realizado vs Meta
  html += '<div class="cc" style="margin-top:14px;">';
  html += '<div class="cct">Realizado vs Meta · Mensal <span style="font-weight:400;color:#666;">(filtrado pelos supervisores corretos)</span></div>';
  html += '<div class="tscroll"><table class="t">';
  html += '<thead><tr>';
  html += '<th class="L">Mês</th>';
  filiaisComMeta.forEach(f => {
    const fNome = (_filiaisDisponiveis.find(x => x.sigla === f) || {}).nome || f.toUpperCase();
    html += '<th colspan="3" style="border-left:2px solid var(--border);">'+esc(fNome)+'</th>';
  });
  html += '<th colspan="3" style="border-left:2px solid var(--border);">Total visão</th>';
  html += '</tr><tr>';
  html += '<th class="L"></th>';
  filiaisComMeta.forEach(() => {
    html += '<th style="font-size:10px;color:#888;border-left:2px solid var(--border);">Meta</th>';
    html += '<th style="font-size:10px;color:#888;">Real</th>';
    html += '<th style="font-size:10px;color:#888;">%</th>';
  });
  html += '<th style="font-size:10px;color:#888;border-left:2px solid var(--border);">Meta</th>';
  html += '<th style="font-size:10px;color:#888;">Real</th>';
  html += '<th style="font-size:10px;color:#888;">%</th>';
  html += '</tr></thead><tbody id="tb-metas-rvr"></tbody></table></div>';
  html += '</div>';

  html += '</div>'; // page-body
  cont.innerHTML = html;

  // Popular tabela Realizado vs Meta (a tabela de edição agora vive no modal)
  _renderTabelaRealVsMeta(filiaisComMeta, anoSel);

  // Trocar ano (re-renderiza Real vs Meta na página)
  const selAno = document.getElementById('metas-ano');
  if(selAno){
    selAno.addEventListener('change', function(e){
      _renderTabelaRealVsMeta(filiaisComMeta, e.target.value);
    });
  }

  // Botão "Editor de metas" → abre modal
  const btnEditor = document.getElementById('btn-abrir-editor-metas');
  if(btnEditor){
    btnEditor.addEventListener('click', function(){
      _abrirEditorMetas(filiaisComMeta, (selAno && selAno.value) || anoSel);
    });
  }
}

// ────────────────────────────────────────────────────────────────────
// EDITOR DE METAS · modal flutuante
// ────────────────────────────────────────────────────────────────────
function _abrirEditorMetas(filiaisComMeta, anoSel){
  // Remove modal anterior se existir
  const antigo = document.getElementById('editor-metas-modal');
  if(antigo) antigo.remove();

  const M = window._metas || {};
  const cfg = M.config || {};
  const supByFilial = cfg.supervisor_por_filial || {};
  const supNomes = cfg.supervisor_nomes || {};

  // Anos disponíveis (do realizado)
  const mensal = (V && V.mensal) || [];
  const anos = [...new Set(mensal.map(m => m.ym ? m.ym.slice(0,4) : null).filter(Boolean))].sort();

  const overlay = document.createElement('div');
  overlay.id = 'editor-metas-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;';

  let html = '<div style="background:var(--surface);border-radius:10px;width:100%;max-width:1100px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.4);">';

  // Header
  html += '<div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">';
  html += '<div>';
  html += '<div style="font-size:16px;font-weight:800;color:var(--text);">Editor de metas</div>';
  html += '<div style="font-size:11px;color:var(--text-dim);margin-top:2px;">Edite as células diretamente. Salvar grava no Firestore (visível pra todos os usuários).</div>';
  html += '</div>';
  html += '<button id="editor-metas-fechar" style="background:none;border:none;cursor:pointer;padding:6px;color:var(--text-muted);" aria-label="Fechar">';
  html += '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  html += '</button>';
  html += '</div>';

  // Toolbar
  html += '<div style="padding:12px 20px;border-bottom:1px solid var(--border);background:var(--surface-2);display:flex;flex-wrap:wrap;gap:12px;align-items:center;">';
  html += '<div><label style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-right:6px;">Ano:</label>';
  html += '<select id="editor-metas-ano" style="padding:5px 10px;border-radius:5px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-weight:600;">' + anos.map(a => '<option value="'+a+'" '+(a===anoSel?'selected':'')+'>'+a+'</option>').join('') + '</select></div>';
  html += '<div style="flex:1;"></div>';
  html += '<button id="editor-metas-import" class="ebtn" style="background:var(--surface-2);border:1px solid var(--border);color:var(--text);font-size:12px;padding:6px 12px;">Importar CSV</button>';
  html += '<button id="editor-metas-export" class="ebtn" style="background:var(--surface-2);border:1px solid var(--border);color:var(--text);font-size:12px;padding:6px 12px;">Exportar CSV</button>';
  html += '</div>';

  // Body (tabela)
  html += '<div style="flex:1;overflow:auto;padding:16px 20px;">';
  if(filiaisComMeta.length === 0){
    html += '<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:6px;padding:14px;color:#664d03;">Nenhuma filial com meta configurada nesta visão.</div>';
  } else {
    html += '<table class="t" id="tb-metas-edit"><thead><tr>';
    html += '<th class="L" style="position:sticky;left:0;background:var(--surface);">Mês</th>';
    filiaisComMeta.forEach(f => {
      const fNome = (_filiaisDisponiveis.find(x => x.sigla === f) || {}).nome || f.toUpperCase();
      html += '<th>'+esc(fNome)+'<br><span style="font-weight:400;font-size:10px;color:#888;">meta R$ líq</span></th>';
    });
    html += '<th>Total visão</th>';
    html += '</tr></thead><tbody></tbody></table>';
  }
  html += '</div>';

  // Footer
  html += '<div style="padding:14px 20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:var(--surface-2);">';
  html += '<span id="editor-metas-status" style="font-size:12px;color:var(--text-muted);"></span>';
  html += '<div style="display:flex;gap:10px;">';
  html += '<button id="editor-metas-cancelar" class="ebtn" style="background:var(--surface);border:1px solid var(--border);color:var(--text);padding:8px 16px;">Cancelar</button>';
  html += '<button id="editor-metas-salvar" class="ebtn" style="background:var(--accent);color:white;border:none;padding:8px 18px;font-weight:700;">Salvar metas</button>';
  html += '</div>';
  html += '</div>';

  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);

  // Popular tabela
  if(filiaisComMeta.length > 0){
    _renderTabelaMetasEdit(filiaisComMeta, anoSel);
  }

  // Função pra fechar
  function fechar(){
    overlay.remove();
  }

  // Listeners
  document.getElementById('editor-metas-fechar').addEventListener('click', fechar);
  document.getElementById('editor-metas-cancelar').addEventListener('click', fechar);
  // Click fora do modal fecha
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) fechar();
  });

  // Trocar ano dentro do modal
  const selAnoModal = document.getElementById('editor-metas-ano');
  if(selAnoModal){
    selAnoModal.addEventListener('change', function(e){
      _renderTabelaMetasEdit(filiaisComMeta, e.target.value);
    });
  }

  // Salvar
  document.getElementById('editor-metas-salvar').addEventListener('click', function(){
    _saveMetas();
    const status = document.getElementById('editor-metas-status');
    if(status){
      status.textContent = '✓ salvo · atualizando análises…';
      status.style.color = 'var(--success-text)';
    }
    // Re-renderiza Real vs Meta na página de fundo (com o ano atualmente selecionado lá)
    const selAnoPagina = document.getElementById('metas-ano');
    const anoP = (selAnoPagina && selAnoPagina.value) || anoSel;
    _renderTabelaRealVsMeta(filiaisComMeta, anoP);
    setTimeout(fechar, 700);
  });

  // Import/Export
  document.getElementById('editor-metas-import').addEventListener('click', _importMetasCSV);
  document.getElementById('editor-metas-export').addEventListener('click', _exportMetasCSV);

  // Atalho ESC pra fechar
  function escListener(e){
    if(e.key === 'Escape'){
      fechar();
      document.removeEventListener('keydown', escListener);
    }
  }
  document.addEventListener('keydown', escListener);
}

function _renderTabelaMetasEdit(filiais, ano){
  const tb = document.querySelector('#tb-metas-edit tbody');
  if(!tb) return;
  const M = window._metas;
  const meses = [];
  for(let m=1; m<=12; m++) meses.push(ano+'-'+String(m).padStart(2,'0'));

  let html = '';
  meses.forEach(ym => {
    html += '<tr>';
    html += '<td class="L" style="position:sticky;left:0;background:var(--bg-card);">'+_ymToLabel(ym)+'</td>';
    let total = 0;
    filiais.forEach(f => {
      const v = ((M.metas[f] || {})[ym]) || 0;
      total += v;
      html += '<td><input type="text" data-filial="'+escAttr(f)+'" data-ym="'+escAttr(ym)+'" value="'+(v>0?fK(v).replace('R$ ',''):'')+'" placeholder="0" '
        + 'style="width:90px;padding:4px 6px;border:1px solid #ccc;border-radius:3px;text-align:right;font-family:JetBrains Mono,monospace;font-size:12px;" '
        + 'class="meta-input"></td>';
    });
    html += '<td style="font-weight:600;">'+(total>0?fK(total):'—')+'</td>';
    html += '</tr>';
  });
  tb.innerHTML = html;

  // Listener de blur pra atualizar o objeto + recalcular total da linha
  tb.querySelectorAll('.meta-input').forEach(inp => {
    inp.addEventListener('blur', function(e){
      const f = e.target.getAttribute('data-filial');
      const ym = e.target.getAttribute('data-ym');
      const raw = e.target.value.replace(/[^0-9,\.]/g, '').replace(/\./g,'').replace(',','.');
      const num = parseFloat(raw) || 0;
      if(!M.metas[f]) M.metas[f] = {};
      if(num > 0) M.metas[f][ym] = num;
      else delete M.metas[f][ym];
      // Re-render só a linha
      _renderTabelaMetasEdit(filiais, ano);
    });
  });
}

function _renderTabelaRealVsMeta(filiais, ano){
  const tb = document.getElementById('tb-metas-rvr');
  if(!tb) return;
  const M = window._metas;
  const cfg = M.config || {};
  const supByFilial = cfg.supervisor_por_filial || {};
  const meses = [];
  for(let m=1; m<=12; m++) meses.push(ano+'-'+String(m).padStart(2,'0'));

  // ─── Pré-computação (uma vez por chamada, não 72×) ───
  // Indexa cadastro de vendedores por código
  const cadIdx = {};
  if(V && V.vendedores && V.vendedores.cadastro){
    V.vendedores.cadastro.forEach(function(r){ cadIdx[r.cod] = r; });
  }
  // Pré-agrega vendedores.mensal por (loja, cod_supervisor, ym) → soma fat_liq
  // Estrutura: agg[loja+'|'+codSup+'|'+ym] = total
  const _aggRealizado = {};
  const baseSlug = (typeof _getBaseSlug === 'function') ? _getBaseSlug() : 'atp';
  if(V && V.vendedores && V.vendedores.mensal){
    V.vendedores.mensal.forEach(function(vm){
      const cad = cadIdx[vm.cod];
      // Pula se cadastro inexistente, sem supervisor, sem loja, ou supervisor ignorado
      if(!Filtros.vendedorEhValido(cad)) return;
      const k = (cad.loja||'').toLowerCase() + '|' + cad.cod_supervisor + '|' + vm.ym;
      _aggRealizado[k] = (_aggRealizado[k]||0) + (vm.fat_liq||0);
    });
  }

  // Helper: lê o agregado pré-calculado (O(1) por filial × ym)
  function _realFilialYm(f, ym){
    const supsAlvo = supByFilial[f];
    if(!supsAlvo || !supsAlvo.length) return 0;
    const lojaEsperada = f.toLowerCase();
    let total = 0;
    supsAlvo.forEach(function(codSup){
      // Para cada supervisor configurado, soma o agregado
      // Em visão grupo/cp, só conta se a loja do vendedor for a esperada
      // Em visão por filial individual, qualquer loja serve (filtro implícito do JSON)
      if(baseSlug === 'grupo' || baseSlug === 'cp'){
        const k = lojaEsperada + '|' + codSup + '|' + ym;
        total += _aggRealizado[k] || 0;
      } else {
        // Em visão por filial, qualquer loja registrada funciona — somar todas
        // que tenham aquele cod_supervisor e ym
        Object.keys(_aggRealizado).forEach(function(k){
          const parts = k.split('|');
          if(Number(parts[1]) === codSup && parts[2] === ym){
            total += _aggRealizado[k];
          }
        });
      }
    });
    return total;
  }

  let html = '';
  let totMetaAno = 0, totRealAno = 0;
  const totMetaPorFilial = {}; const totRealPorFilial = {};
  filiais.forEach(f => { totMetaPorFilial[f] = 0; totRealPorFilial[f] = 0; });

  meses.forEach(ym => {
    let totMetaLin = 0, totRealLin = 0;
    let cells = '';
    filiais.forEach(f => {
      const meta = ((M.metas[f] || {})[ym]) || 0;
      const real = _realFilialYm(f, ym);
      const pct = meta > 0 ? (real/meta*100) : 0;
      const cls = pct >= 100 ? 'val-pos' : pct >= 80 ? '' : pct > 0 ? 'val-neg' : '';
      cells += '<td style="border-left:2px solid var(--border);">'+(meta>0?fK(meta):'—')+'</td>';
      cells += '<td>'+(real>0?fK(real):'—')+'</td>';
      cells += '<td class="'+cls+'">'+(meta>0?fP(pct):'—')+'</td>';
      totMetaLin += meta; totRealLin += real;
      totMetaPorFilial[f] += meta;
      totRealPorFilial[f] += real;
    });
    const pctLin = totMetaLin > 0 ? (totRealLin/totMetaLin*100) : 0;
    const clsLin = pctLin >= 100 ? 'val-pos' : pctLin >= 80 ? '' : pctLin > 0 ? 'val-neg' : '';
    html += '<tr>';
    html += '<td class="L">'+_ymToLabel(ym)+'</td>';
    html += cells;
    html += '<td style="border-left:2px solid var(--border);font-weight:600;">'+(totMetaLin>0?fK(totMetaLin):'—')+'</td>';
    html += '<td style="font-weight:600;">'+(totRealLin>0?fK(totRealLin):'—')+'</td>';
    html += '<td class="'+clsLin+'" style="font-weight:600;">'+(totMetaLin>0?fP(pctLin):'—')+'</td>';
    html += '</tr>';
    totMetaAno += totMetaLin; totRealAno += totRealLin;
  });

  // Linha total ano
  html += '<tr style="background:#f0f4f8;border-top:2px solid var(--border);font-weight:700;">';
  html += '<td class="L">' + ano + '</td>';
  filiais.forEach(f => {
    const meta = totMetaPorFilial[f]; const real = totRealPorFilial[f];
    const pct = meta > 0 ? (real/meta*100) : 0;
    const cls = pct >= 100 ? 'val-pos' : pct >= 80 ? '' : pct > 0 ? 'val-neg' : '';
    html += '<td style="border-left:2px solid var(--border);">'+(meta>0?fK(meta):'—')+'</td>';
    html += '<td>'+(real>0?fK(real):'—')+'</td>';
    html += '<td class="'+cls+'">'+(meta>0?fP(pct):'—')+'</td>';
  });
  const pctAno = totMetaAno > 0 ? (totRealAno/totMetaAno*100) : 0;
  const clsAno = pctAno >= 100 ? 'val-pos' : pctAno >= 80 ? '' : pctAno > 0 ? 'val-neg' : '';
  html += '<td style="border-left:2px solid var(--border);">'+(totMetaAno>0?fK(totMetaAno):'—')+'</td>';
  html += '<td>'+(totRealAno>0?fK(totRealAno):'—')+'</td>';
  html += '<td class="'+clsAno+'">'+(totMetaAno>0?fP(pctAno):'—')+'</td>';
  html += '</tr>';
  tb.innerHTML = html;
}

// Persistência de metas — Firebase quando ativo, senão localStorage
function _loadMetas(){
  // Tenta localStorage primeiro
  try {
    const raw = localStorage.getItem('_metas_gpc');
    if(raw){
      const m = JSON.parse(raw);
      if(m && m.metas) return m;
    }
  } catch(e){}
  // Default
  return {
    geradoEm: new Date().toISOString().slice(0,10),
    config: {
      supervisor_por_filial: {atp:[1,4], cp1:null, cp3:[1], cp5:[17], cp40:[4]},
      supervisor_nomes: {"1":"VAREJO / CESTAO 01 - IRARA", "4":"ATACADO BALCÃO / VENDA BALCAO", "17":"CESTAO 04 - INHAMBUPE"}
    },
    metas: {}
  };
}

function _saveMetas(){
  if(!window._metas) return;
  window._metas.atualizadoEm = new Date().toISOString();
  try {
    localStorage.setItem('_metas_gpc', JSON.stringify(window._metas));
  } catch(e){
    console.error('Erro salvando metas no localStorage:', e);
  }
  // Sync Firebase quando ativo
  if(AUTH_MODE === 'firebase' && window.fbDb){
    window.fbDb.collection('config').doc('metas_gpc').set(window._metas)
      .catch(function(e){ console.warn('[metas] sync Firebase falhou:', e.message); });
  }
}

// Carrega metas do Firebase (se ativo) ou localStorage
async function _loadMetasFirebase(){
  if(AUTH_MODE !== 'firebase' || !window.fbDb) return null;
  try {
    const doc = await window.fbDb.collection('config').doc('metas_gpc').get();
    if(doc.exists){
      const data = doc.data();
      // Salva no localStorage como cache
      try { localStorage.setItem('_metas_gpc', JSON.stringify(data)); } catch(e){}
      window._metas = data;
      return data;
    }
  } catch(e){
    console.warn('[metas] load Firebase falhou:', e.message);
  }
  return null;
}

function _exportMetasCSV(){
  const M = window._metas;
  const linhas = ['filial;ym;meta_fat_liq'];
  Object.keys(M.metas).forEach(f => {
    Object.keys(M.metas[f]).forEach(ym => {
      linhas.push(f+';'+ym+';'+M.metas[f][ym]);
    });
  });
  const csv = linhas.join('\n');
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'metas_gpc_'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function _importMetasCSV(){
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.csv,text/csv';
  inp.addEventListener('change', function(e){
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      try {
        const txt = ev.target.result;
        const linhas = txt.split(/\r?\n/).slice(1).filter(Boolean);
        if(!window._metas.metas) window._metas.metas = {};
        let n = 0;
        linhas.forEach(l => {
          const parts = l.split(';');
          if(parts.length < 3) return;
          const fi = parts[0].trim();
          const ym = parts[1].trim();
          const v = parseFloat(parts[2].replace(',','.'));
          if(!fi || !ym || isNaN(v)) return;
          if(!window._metas.metas[fi]) window._metas.metas[fi] = {};
          window._metas.metas[fi][ym] = v;
          n++;
        });
        _saveMetas();
        alert(n + ' metas importadas.');
        // Pega ano da fonte ativa (modal se aberto, senão página)
        const elModal = document.getElementById('editor-metas-ano');
        const elPag = document.getElementById('metas-ano');
        const ano = (elModal && elModal.value) || (elPag && elPag.value) || (new Date()).getFullYear().toString();
        const M = window._metas;
        const filiais = Object.keys(M.config.supervisor_por_filial).filter(f => Array.isArray(M.config.supervisor_por_filial[f]) && M.config.supervisor_por_filial[f].length);
        // Re-renderiza tabela do editor (se modal estiver aberto)
        if(document.getElementById('tb-metas-edit')){
          _renderTabelaMetasEdit(filiais, ano);
        }
        // Re-renderiza Real vs Meta na página (sempre)
        if(document.getElementById('tb-metas-rvr')){
          _renderTabelaRealVsMeta(filiais, ano);
        }
      } catch(e){
        alert('Erro lendo CSV: ' + e.message);
      }
    };
    reader.readAsText(f, 'utf-8');
  });
  inp.click();
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
