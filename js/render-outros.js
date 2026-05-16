// ════════════════════════════════════════════════════════════════════════════
// GPC Comercial · render-outros.js
// ════════════════════════════════════════════════════════════════════════════
// Gerado pela divisão do index.html em v4.6 (etapa #3 da auditoria)
// Carregado via <script src="js/render-outros.js"> no index.html
// IMPORTANTE: ordem de carregamento importa — ver comentário no index.html
// ════════════════════════════════════════════════════════════════════════════

function renderRecebimentos(){
  const cont = document.getElementById('page-recebimentos');
  if(!cont) return;

  if(!R){
    cont.innerHTML = '<div class="ph"><div class="pk">Vendas · Análise</div><h2><em>Inadimplência</em></h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc">'+_emptyState('Dados de recebimentos não carregados','O JSON recebimentos_<base>.json não está disponível para esta filial.')+'</div></div>';
    return;
  }

  const meta = R.meta || {};
  // Detecta automaticamente qual chave do resumo usar baseado na base ativa.
  // Aceita: ATP, CP1, CP3, CP5, CP40 ou _total_grupo (consolidado).
  // Antes era hardcoded em R.resumo.ATP — quebrava nas filiais CP.
  const _resumoTodo = R.resumo || {};
  let _resumoBruto = {};
  // Prioriza não-_total_grupo se houver apenas uma chave principal
  const chavesResumo = Object.keys(_resumoTodo).filter(function(k){return !k.startsWith('_');});
  if(chavesResumo.length === 1){
    _resumoBruto = _resumoTodo[chavesResumo[0]] || {};
  } else if(chavesResumo.length > 1){
    // Múltiplas filiais (cubo CP com CP1/CP3/CP5/CP40) → usa o agregado
    _resumoBruto = _resumoTodo._total_grupo || _resumoTodo[chavesResumo[0]] || {};
  } else {
    _resumoBruto = _resumoTodo._total_grupo || {};
  }
  // Normaliza schemas antigo (ATP) e novo (CP) num formato único
  // ATP usa: total_atrasado, clientes_inadimplentes, rcas_envolvidos, dias_atraso_medio, dias_atraso_mediano
  // CP usa:  valor,           inadimplentes,         rcas,             (sem dias)
  const resumo = {
    total_atrasado: _resumoBruto.total_atrasado != null ? _resumoBruto.total_atrasado : (_resumoBruto.valor || 0),
    parcelas: _resumoBruto.parcelas || 0,
    nfs: _resumoBruto.nfs || _resumoBruto.duplicatas || 0,
    clientes_inadimplentes: _resumoBruto.clientes_inadimplentes != null ? _resumoBruto.clientes_inadimplentes : (_resumoBruto.inadimplentes || 0),
    rcas_envolvidos: _resumoBruto.rcas_envolvidos != null ? _resumoBruto.rcas_envolvidos : (_resumoBruto.rcas || 0),
    dias_atraso_medio: _resumoBruto.dias_atraso_medio || 0,
    dias_atraso_mediano: _resumoBruto.dias_atraso_mediano || 0
  };
  const aging = R.aging || {};
  const mensal = R.mensal || [];
  const clientes = R.por_cliente_top || [];
  const rcas = R.por_rca || [];
  const cobrancas = R.por_cobranca || [];
  const deptos = R.por_departamento || [];
  const conc = R.concentracao || {};

  // Faixas em ordem
  const FAIXAS_ORD = ['ATRASO_1_30D', 'ATRASO_31_60D', 'ATRASO_61_90D', 'ATRASO_91D_OU_MAIS'];
  const FAIXAS_LBL = ['1 a 30 dias', '31 a 60 dias', '61 a 90 dias', '> 90 dias'];
  const FAIXAS_COR = ['#fbbf24', '#f97316', '#dc2626', '#7c1d1d'];

  // ── Filtros (estado entre re-renders) ──
  if(typeof window._inadPeriodo === 'undefined') window._inadPeriodo = 'todo';
  if(typeof window._inadSups === 'undefined') window._inadSups = null; // null = todos; array = lista de "loja|cod"
  const periodoSel = window._inadPeriodo;
  const supsSelArr = window._inadSups;

  // Cruzar RCAs com cadastro de vendedores pra ter cod_supervisor de cada RCA
  // Cadastro: {cod, nome, loja, supervisor, cod_supervisor}
  const cadVendF = (V && V.vendedores && V.vendedores.cadastro) || [];
  const cadByCod = new Map();
  cadVendF.forEach(function(v){ cadByCod.set(v.cod, v); });

  // Lista de supervisores únicos (loja + cod_supervisor + nome) — pra dropdown
  const supsMap = new Map(); // "loja|cod" → {loja, cod, nome}
  cadVendF.forEach(function(v){
    if(v.cod_supervisor != null && v.supervisor){
      const k = (v.loja||'?')+'|'+v.cod_supervisor;
      if(!supsMap.has(k)) supsMap.set(k, {loja:v.loja||'', cod:v.cod_supervisor, nome:v.supervisor});
    }
  });
  const supsLista = Array.from(supsMap.values()).sort(function(a,b){
    if(a.loja !== b.loja) return a.loja.localeCompare(b.loja);
    return a.nome.localeCompare(b.nome);
  });

  // Mapeia cada RCA -> "loja|cod_supervisor" pra filtragem
  function rcaSupKey(rcaCod){
    const v = cadByCod.get(rcaCod);
    if(!v || v.cod_supervisor == null) return null;
    return (v.loja||'?')+'|'+v.cod_supervisor;
  }

  // Aplicar filtros nos dados antes de renderizar
  // PERÍODO: filtra mensal (lista por ym)
  let mensalFilt = mensal.slice();
  if(periodoSel !== 'todo' && mensal.length){
    const ymsOrd = mensal.map(function(m){return m.ym;}).sort();
    const ymMax = ymsOrd[ymsOrd.length-1];
    function ymMinusMonths(ym, n){
      const p = ym.split('-'); let y = parseInt(p[0],10), m = parseInt(p[1],10);
      m -= n; while(m < 1){m += 12; y--;}
      return y+'-'+String(m).padStart(2,'0');
    }
    let ymIni = null;
    if(periodoSel === '3m')  ymIni = ymMinusMonths(ymMax, 2);  // últimos 3 meses
    else if(periodoSel === '6m')  ymIni = ymMinusMonths(ymMax, 5);
    else if(periodoSel === '12m') ymIni = ymMinusMonths(ymMax, 11);
    else if(periodoSel === 'ano-atual')    ymIni = ymMax.substring(0,4)+'-01';
    else if(periodoSel === 'ano-anterior'){
      const ano = parseInt(ymMax.substring(0,4),10) - 1;
      mensalFilt = mensal.filter(function(m){return m.ym >= ano+'-01' && m.ym <= ano+'-12';});
    }
    if(ymIni && periodoSel !== 'ano-anterior'){
      mensalFilt = mensal.filter(function(m){return m.ym >= ymIni && m.ym <= ymMax;});
    }
  }

  // SUPERVISOR: filtra rcas (mantém só os que estão no set selecionado)
  const supsSel = (supsSelArr && supsSelArr.length) ? new Set(supsSelArr) : null;
  let rcasFilt = rcas.slice();
  if(supsSel){
    rcasFilt = rcas.filter(function(r){
      const k = rcaSupKey(r.cod);
      return k && supsSel.has(k);
    });
  }

  // Recálculo de KPIs com filtros aplicados
  // - Total atrasado (período): soma do mensal filtrado.
  // - Parcelas/Clientes/NFs (período): soma do mensal filtrado.
  // - RCAs envolvidos: count distinto de rcasFilt.
  const totPeriodo  = mensalFilt.reduce(function(s,m){return s + (m.valor||0);}, 0);
  const parcPeriodo = mensalFilt.reduce(function(s,m){return s + (m.parcelas||0);}, 0);
  const cliPeriodo  = mensalFilt.reduce(function(s,m){return s + (m.clientes||0);}, 0);
  const nfsPeriodo  = mensalFilt.reduce(function(s,m){return s + (m.nfs||0);}, 0);

  // Se há filtro de supervisor, abate KPIs proporcionalmente pela soma valor RCAs
  // (aproximação: % do valor total de RCAs que está nos selecionados)
  const totRcasGeral = rcas.reduce(function(s,r){return s + (r.valor||0);}, 0);
  const totRcasFilt  = rcasFilt.reduce(function(s,r){return s + (r.valor||0);}, 0);
  const fracSup = (supsSel && totRcasGeral > 0) ? (totRcasFilt / totRcasGeral) : 1;

  const kpiTotal = (periodoSel !== 'todo' ? totPeriodo : (resumo.total_atrasado||0)) * fracSup;
  const kpiParc  = (periodoSel !== 'todo' ? parcPeriodo : (resumo.parcelas||0)) * fracSup;
  const kpiNfs   = (periodoSel !== 'todo' ? nfsPeriodo  : (resumo.nfs||0))      * fracSup;
  const kpiCli   = (periodoSel !== 'todo' ? cliPeriodo  : (resumo.clientes_inadimplentes||0)) * fracSup;
  const kpiRcas  = supsSel ? rcasFilt.length : (resumo.rcas_envolvidos||0);

  let html = '<div class="ph"><div class="pk">Vendas · Análise</div><h2><em>Inadimplência</em></h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // Banner com escopo
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>Escopo:</strong> '+esc(meta.escopo||'Inadimplência ATP')+' · '
       +   '<strong>Vencidos:</strong> '+fDt((meta.periodo_vencimento||{}).inicio||'')+' a '+fDt((meta.periodo_vencimento||{}).fim||'')+' · '
       +   fI(meta.linhas_processadas||0)+' linhas processadas · '
       +   'gerado em '+esc((meta.geradoEm||'').substring(0,16).replace('T',' '))
       + '</div>';

  // ── Barra de filtros ──
  const opcoesPer = [
    {id:'todo', lbl:'Todo período'},
    {id:'3m',   lbl:'Últimos 3 meses'},
    {id:'6m',   lbl:'Últimos 6 meses'},
    {id:'12m',  lbl:'Últimos 12 meses'},
    {id:'ano-atual',    lbl:'Ano atual'},
    {id:'ano-anterior', lbl:'Ano anterior'},
  ];
  html += '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:8px;">';
  // linha 1: período
  html += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">';
  html += '<span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;min-width:70px;">Período:</span>';
  opcoesPer.forEach(function(o){
    const ativo = o.id === periodoSel;
    html += '<button class="inad-per-btn" data-per="'+esc(o.id)+'" style="padding:5px 10px;font-size:11px;border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;'
         +   (ativo?'background:var(--accent);color:white;':'background:var(--surface);color:var(--text);')
         + 'font-weight:600;">'+esc(o.lbl)+'</button>';
  });
  html += '</div>';
  // linha 2: supervisor
  if(supsLista.length){
    const totalSel = supsSel ? supsSel.size : 0;
    const lblSup = supsSel
      ? (totalSel === 1 ? '1 supervisor' : totalSel+' supervisores')
      : 'Todos ('+supsLista.length+')';
    html += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">';
    html += '<span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;min-width:70px;">Supervisor:</span>';
    html += '<button id="inad-sup-toggle" style="padding:5px 12px;font-size:11px;border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;background:var(--surface);color:var(--text);font-weight:600;">'+esc(lblSup)+' ▾</button>';
    if(supsSel){
      html += '<button id="inad-sup-clear" style="padding:5px 8px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Limpar</button>';
    }
    html += '<div id="inad-sup-panel" style="display:none;width:100%;margin-top:6px;padding:10px;background:var(--surface-2);border:1px solid var(--border);border-radius:6px;max-height:280px;overflow-y:auto;">';
    supsLista.forEach(function(s){
      const k = (s.loja||'?')+'|'+s.cod;
      const checked = supsSel ? supsSel.has(k) : true;
      html += '<label style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12px;cursor:pointer;">'
           +   '<input type="checkbox" class="inad-sup-cb" data-key="'+esc(k)+'"'+(checked?' checked':'')+' style="cursor:pointer;">'
           +   '<span style="color:var(--text);">'+esc(s.nome)+' <span style="color:var(--text-muted);font-size:10px;">· '+esc(s.loja)+' #'+esc(s.cod)+'</span></span>'
           + '</label>';
    });
    html += '</div></div>';
  }
  // linha 3: aviso quando há filtros aplicados
  if(periodoSel !== 'todo' || supsSel){
    html += '<div style="font-size:11px;color:var(--text-dim);font-style:italic;line-height:1.4;">'
         +   'Filtros aplicam em: <strong>KPIs</strong>, <strong>gráfico mensal</strong> e <strong>tabela de RCAs</strong>. '
         +   'Aging, top clientes, cobranças e departamentos continuam mostrando valores totais (limitação dos dados agregados).'
         + '</div>';
  }
  html += '</div>';

  // Alerta de concentração removido a pedido do usuário

  // KPIs (6)
  html += '<div class="kg" style="grid-template-columns:repeat(6,1fr);margin-bottom:14px;" id="kg-rec"></div>';

  // Linha 1: aging chart + mensal
  html += '<div class="row2eq" style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Aging — distribuição por faixa</div>'
       +      '<div class="ccs">Quanto está atrasado em cada bucket de dias</div>'
       +      '<div style="height:280px;"><canvas id="c-rec-aging"></canvas></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">Vencimentos atrasados por mês</div>'
       +      '<div class="ccs">Distribuição do valor atrasado por mês de vencimento</div>'
       +      '<div style="height:280px;"><canvas id="c-rec-mensal"></canvas></div>'
       +    '</div>'
       + '</div>';

  // Linha 2: meios de cobrança + deptos
  html += '<div class="row2eq" style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Distribuição por meio de cobrança</div>'
       +      '<div class="ccs">Como os atrasados foram emitidos</div>'
       +      '<div style="height:260px;"><canvas id="c-rec-cobranca"></canvas></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">Atrasados por departamento</div>'
       +      '<div class="ccs">Origem dos itens das NFs em atraso</div>'
       +      '<div style="height:260px;"><canvas id="c-rec-depto"></canvas></div>'
       +    '</div>'
       + '</div>';

  // Tabela top clientes (com aging por linha)
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cch">'
       +      '<div><div class="cct">Top 30 clientes em atraso</div>'
       +      '<div class="ccs">Com distribuição de valor por faixa de aging · ordenado por valor total</div></div>'
       +    '</div>'
       +    '<div style="margin:10px 0 6px 0;padding:10px 12px;background:var(--surface-2);border:1px solid var(--border);border-radius:6px;">'
       +      '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:6px;">Supervisor por loja (multi-select)</div>'
       +      '<div id="rec-sup-box" style="display:flex;flex-wrap:wrap;gap:5px;"></div>'
       +    '</div>'
       +    '<div class="tscroll" style="margin-top:10px;"><table class="t" id="t-rec-cli">'
       +      '<thead><tr>'
       +      '<th class="L" style="width:24px;">#</th>'
       +      '<th class="L">Cód.</th>'
       +      '<th class="L">Nome</th>'
       +      '<th class="L">Supervisor(es)</th>'
       +      '<th>Total atrasado</th><th>Parcelas</th>'
       +      '<th>1-30d</th><th>31-60d</th><th>61-90d</th><th>+90d</th>'
       +      '<th>Atraso máx</th>'
       +      '</tr></thead><tbody id="tb-rec-cli"></tbody></table></div>'
       + '</div>';

  // Tabela RCAs e cobrança lado a lado
  html += '<div class="row2eq" style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Top 20 RCAs com inadimplência</div>'
       +      '<div class="ccs">Vendedores responsáveis pelas NFs em atraso</div>'
       +      '<div class="tscroll"><table class="t"><thead><tr>'
       +        '<th class="L" style="width:24px;">#</th><th class="L">Cód.</th><th class="L">Nome</th>'
       +        '<th>Valor</th><th>Parcelas</th><th>Ticket</th>'
       +      '</tr></thead><tbody id="tb-rec-rca"></tbody></table></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">Meios de cobrança</div>'
       +      '<div class="ccs">Detalhamento dos meios na inadimplência</div>'
       +      '<div class="tscroll"><table class="t"><thead><tr>'
       +        '<th class="L">Meio</th><th>Valor</th><th>Parcelas</th><th>Clientes</th>'
       +      '</tr></thead><tbody id="tb-rec-cob"></tbody></table></div>'
       +    '</div>'
       + '</div>';

  html += '</div>';
  cont.innerHTML = html;

  // ─── KPIs (filtrados) ───
  const c1 = clientes[0] || {};
  const sufFiltro = (periodoSel !== 'todo' || supsSel) ? ' (filtrado)' : '';
  document.getElementById('kg-rec').innerHTML = kgHtml([
    {l:'Total atrasado'+sufFiltro,        v:fK(kpiTotal), s:fI(Math.round(kpiParc))+' parcelas',cls:'dn'},
    {l:'Clientes inadimplentes'+sufFiltro, v:fI(Math.round(kpiCli)),     s:'em '+fI(Math.round(kpiNfs))+' NFs'},
    {l:'RCAs envolvidos'+(supsSel?' (filtrado)':''), v:fI(kpiRcas),       s:'vendedores das NFs'},
    {l:'Dias de atraso médio',            v:fI(resumo.dias_atraso_medio||0)+'d', s:'mediana: '+fI(resumo.dias_atraso_mediano||0)+'d'},
    {l:'Concentração top 1',              v:fP(conc.top_1_pct||0), s:'cliente cod='+esc(c1.cod||'?'), cls:'hl'},
    {l:'Concentração top 5',              v:fP(conc.top_5_pct||0), s:'soma top 5 clientes', cls:'hl'},
  ]);

  // ─── Chart aging (doughnut + valor) ───
  const agingData = FAIXAS_ORD.map(function(f){return (aging[f]||{}).valor || 0;});
  const agingTotal = agingData.reduce(function(s,v){return s+v;}, 0);
  mkC('c-rec-aging', {type:'doughnut',
    data:{labels:FAIXAS_LBL, datasets:[{data:agingData, backgroundColor:FAIXAS_COR, borderWidth:2, borderColor:'#fff'}]},
    options:{responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'right', labels:{padding:10, usePointStyle:true, boxWidth:8, font:{size:11}}},
               tooltip:{callbacks:{label:function(ctx){
                 const f = aging[FAIXAS_ORD[ctx.dataIndex]] || {};
                 return [ctx.label+': '+fK(ctx.raw)+' ('+fP(agingTotal>0?ctx.raw/agingTotal*100:0)+')',
                         fI(f.parcelas||0)+' parcelas · '+fI(f.clientes||0)+' clientes'];
               }}}}}});

  // ─── Chart mensal (filtrado por período) ───
  if(mensalFilt.length){
    mkC('c-rec-mensal', {type:'bar',
      data:{labels:mensalFilt.map(function(m){return _ymToLabel(m.ym);}),
        datasets:[{label:'Valor', data:mensalFilt.map(function(m){return m.valor;}),
          backgroundColor:_PAL.dn+'CC', borderRadius:4}]},
      options:{responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:false},
                 tooltip:{callbacks:{label:function(ctx){
                   const m = mensalFilt[ctx.dataIndex];
                   return [fB(ctx.raw), fI(m.parcelas||0)+' parcelas · '+fI(m.clientes||0)+' clientes'];
                 }}}},
        scales:{y:{beginAtZero:true, ticks:{callback:function(v){return fAbbr(v);}}},
                x:{grid:{display:false}}}}});
  }

  // ─── Chart cobrança ───
  if(cobrancas.length){
    const cobSorted = cobrancas.slice().sort(function(a,b){return b.valor - a.valor;}).slice(0, 8);
    mkC('c-rec-cobranca', {type:'bar',
      data:{labels:cobSorted.map(function(c){return c.meio;}),
        datasets:[{label:'Valor', data:cobSorted.map(function(c){return c.valor;}),
          backgroundColor:_PAL.ac+'CC', borderRadius:4}]},
      options:{indexAxis:'y', responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:false},
                 tooltip:{callbacks:{label:function(ctx){
                   const c = cobSorted[ctx.dataIndex];
                   return [fB(ctx.raw), fI(c.parcelas||0)+' parcelas · '+fI(c.clientes||0)+' clientes'];
                 }}}},
        scales:{x:{ticks:{callback:function(v){return fAbbr(v);}}},
                y:{grid:{display:false}, ticks:{font:{size:11}}}}}});
  }

  // ─── Chart deptos ───
  if(deptos.length){
    const deptSorted = deptos.slice().sort(function(a,b){return b.valor_atrasado - a.valor_atrasado;});
    const dC = ['#2E476F','#F58634','#109854','#7c3aed','#DC7529','#1E3558','#0891B2','#94a3b8'];
    mkC('c-rec-depto', {type:'doughnut',
      data:{labels:deptSorted.map(function(d){return d.nome;}),
        datasets:[{data:deptSorted.map(function(d){return d.valor_atrasado;}), backgroundColor:dC, borderWidth:2, borderColor:'#fff'}]},
      options:{responsive:true, maintainAspectRatio:false,
        plugins:{legend:{position:'right', labels:{padding:6, usePointStyle:true, boxWidth:8, font:{size:10}}},
                 tooltip:{callbacks:{label:function(ctx){
                   const d = deptSorted[ctx.dataIndex];
                   return [ctx.label+': '+fK(ctx.raw), fI(d.parcelas||0)+' parcelas · '+fI(d.itens||0)+' itens'];
                 }}}}}});
  }

  // ─── Tabela top clientes ───
  // Cruzar RCAs (lista de nomes) com cadastro de vendedores → supervisores
  // Ignora supervisores marcados em Administração ("Supervisores ignorados por loja")
  const cadVend = (V && V.vendedores && V.vendedores.cadastro) || [];
  const supPorNomeRca = new Map();
  cadVend.forEach(function(v){
    // chave normalizada: trim + uppercase, pra cruzar c.rcas que vêm com espaços/case variados
    const k = (v.nome||'').trim().toUpperCase();
    if(k) supPorNomeRca.set(k, {cod:v.cod_supervisor, nome:v.supervisor||'', loja:v.loja||''});
  });

  // Pré-calcular supervisores de cada cliente
  // Heurística pra excluir RCAs internos do GPC (intragrupo) das análises:
  function _rcaNomeEhGpcInterno(nome){
    const n = (nome||'').toUpperCase();
    if(!n) return false;
    if(/\bGPC\b/.test(n)) return true;
    if(/INTRA[\s-]?GRUPO/.test(n)) return true;
    return false;
  }
  // Cada cliente tem uma lista de supervisores. A unidade é (loja, cod_supervisor),
  // pois cod_supervisor não é único entre lojas (ex: cod=1 = VAREJO em ATP-V e
  // CESTAO 01 em CP3/CP40). A chave do Map é "loja|cod" para evitar colisão.
  const clientesEnriquecidos = clientes.map(function(c){
    const supsSet = new Map(); // "loja|cod" → {loja, cod, nome}
    (c.rcas || []).forEach(function(rNome){
      // Pula RCAs internos do GPC (não interessam pra análise de inadimplência)
      if(_rcaNomeEhGpcInterno(rNome)) return;
      const k = (rNome||'').trim().toUpperCase();
      const info = supPorNomeRca.get(k);
      if(info && info.cod != null){
        // Aplica filtro de supervisores ignorados (config Administração) — escopo desta página
        if(_isSupervisorIgnorado('recebimentos', info.loja, info.cod)) return;
        const chave = (info.loja||'?')+'|'+info.cod;
        if(!supsSet.has(chave)) supsSet.set(chave, {loja:info.loja, cod:info.cod, nome:info.nome});
      }
    });
    return Object.assign({}, c, {
      _supervisores: Array.from(supsSet.values())
    });
  });

  // Popular os "chips" de supervisor — chave (loja, cod) pra distinguir
  // VAREJO #1 (ATP-V) de CESTAO 01 #1 (CP3/CP40), por exemplo.
  const supsUnicos = new Map(); // "loja|cod" → {loja, cod, nome}
  clientesEnriquecidos.forEach(function(c){
    (c._supervisores || []).forEach(function(s){
      const chave = (s.loja||'?')+'|'+s.cod;
      if(!supsUnicos.has(chave)) supsUnicos.set(chave, s);
    });
  });
  const supsArr = Array.from(supsUnicos.values())
    .sort(function(a,b){
      if(a.loja !== b.loja) return (a.loja||'').localeCompare(b.loja||'');
      return a.cod - b.cod;
    });

  // Estado dos filtros (sessão)
  if(typeof window._recSupAtivos === 'undefined') window._recSupAtivos = null;     // null = todos · array = chaves "loja|cod"

  function _renderSupBox(){
    const box = document.getElementById('rec-sup-box');
    if(!box) return;
    const ativos = window._recSupAtivos; // null = todos · array = chaves "loja|cod"
    let h = '<button class="rec-sup-shortcut" data-act="todos" style="padding:4px 9px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Todos</button>';
    h += supsArr.map(function(s){
      const chave = (s.loja||'?')+'|'+s.cod;
      const isOn = ativos === null || ativos.indexOf(chave) >= 0;
      const lojaLbl = s.loja ? (s.loja+' · ') : '';
      return '<button class="rec-sup-btn" data-chave="'+esc(chave)+'" style="padding:4px 9px;font-size:11px;border:1px solid var(--border-strong);border-radius:4px;cursor:pointer;'
        + (isOn?'background:var(--accent);color:white;border-color:var(--accent);':'background:var(--surface);color:var(--text);')
        + 'font-weight:600;" title="'+esc(s.loja||'')+' #'+s.cod+' '+esc(s.nome||'')+'">'
        + esc(lojaLbl)+'#'+s.cod+' '+esc((s.nome||'').substring(0,18))
        +'</button>';
    }).join('');
    box.innerHTML = h;
    const todasChaves = supsArr.map(function(x){return (x.loja||'?')+'|'+x.cod;});
    box.querySelectorAll('.rec-sup-btn').forEach(function(b){
      b.addEventListener('click', function(){
        const chave = b.getAttribute('data-chave');
        let cur = (window._recSupAtivos === null) ? todasChaves.slice() : window._recSupAtivos.slice();
        const i = cur.indexOf(chave);
        if(i >= 0) cur.splice(i, 1); else cur.push(chave);
        window._recSupAtivos = (cur.length === 0 || cur.length === todasChaves.length) ? null : cur;
        _renderSupBox();
        _renderTopClientesAtraso();
      });
    });
    box.querySelectorAll('.rec-sup-shortcut').forEach(function(b){
      b.addEventListener('click', function(){
        window._recSupAtivos = null;
        _renderSupBox();
        _renderTopClientesAtraso();
      });
    });
  }

  // Função que renderiza tbody com filtros aplicados
  function _renderTopClientesAtraso(){
    let lista = clientesEnriquecidos;
    const supSel = window._recSupAtivos; // null = todos · array = chaves "loja|cod"
    if(supSel !== null && supSel.length > 0){
      const setSup = new Set(supSel);
      lista = lista.filter(function(c){
        return c._supervisores.some(function(s){return setSup.has((s.loja||'?')+'|'+s.cod);});
      });
    }
    // Nota: filtro de mês de vencimento atua como filtro informativo no aviso da tabela.
    // O JSON de inadimplência não traz o ym por cliente, apenas por mês agregado em R.mensal.
    // Mantido aqui pra preparar evolução do ETL com vinculação ym→cliente.
    const top = lista.slice(0, 30);
    const tb = document.getElementById('tb-rec-cli');
    if(!tb) return;
    if(top.length === 0){
      tb.innerHTML = '<tr><td colspan="11" style="text-align:center;color:var(--text-muted);padding:20px;font-size:12px;">Nenhum cliente em atraso para os filtros aplicados.</td></tr>';
      return;
    }
    tb.innerHTML = top.map(function(c, i){
      const fx = c.faixas || {};
      const f1 = fx.ATRASO_1_30D||0;
      const f2 = fx.ATRASO_31_60D||0;
      const f3 = fx.ATRASO_61_90D||0;
      const f4 = fx.ATRASO_91D_OU_MAIS||0;
      const isTop1 = i === 0 && supSel === null;
      const valCls = c.dias_atraso_max>90 ? 'val-neg' : c.dias_atraso_max>60 ? 'hl' : '';
      const supsTxt = c._supervisores.length === 0
        ? '<span class="val-dim">—</span>'
        : c._supervisores.map(function(s){
            const lojaLbl = s.loja ? (s.loja+' ') : '';
            return esc(lojaLbl)+'#'+s.cod+' '+esc((s.nome||'').substring(0,16));
          }).join('<br>');
      return '<tr'+(isTop1?' style="background:#fee2e2;"':'')+'>'
        + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
        + '<td class="L"><strong>'+esc(c.cod)+'</strong></td>'
        + '<td class="L val-dim" style="font-style:italic;">— <span style="font-size:10px;">(nome não exportado)</span></td>'
        + '<td class="L" style="font-size:10px;line-height:1.4;">'+supsTxt+'</td>'
        + '<td class="val-strong">'+fK(c.valor||0)+'</td>'
        + '<td class="val-dim">'+fI(c.parcelas||0)+'</td>'
        + '<td>'+(f1>0?fK(f1):'—')+'</td>'
        + '<td>'+(f2>0?fK(f2):'—')+'</td>'
        + '<td>'+(f3>0?fK(f3):'—')+'</td>'
        + '<td class="'+(f4>0?'val-neg':'')+'">'+(f4>0?fK(f4):'—')+'</td>'
        + '<td class="'+valCls+'">'+fI(c.dias_atraso_max||0)+'d</td>'
        + '</tr>';
    }).join('');
  }
  _renderSupBox();
  _renderTopClientesAtraso();

  // ─── Tabela RCAs ───
  // Filtra RCAs que são da operação GPC interna (intragrupo) — esses não devem
  // aparecer em análises de inadimplência por fazer parte de operações entre lojas
  // do próprio grupo. Heurística: nome contém "GPC" ou "INTRAGRUPO" ou "INTRA GRUPO".
  function _rcaEhGpcInterno(r){
    const n = ((r && r.nome) || '').toUpperCase();
    if(!n) return false;
    if(/\bGPC\b/.test(n)) return true;
    if(/INTRA[\s-]?GRUPO/.test(n)) return true;
    return false;
  }
  const rcaSorted = rcasFilt.filter(function(r){ return !_rcaEhGpcInterno(r); })
                        .slice().sort(function(a,b){return b.valor - a.valor;});
  document.getElementById('tb-rec-rca').innerHTML = rcaSorted.slice(0, 20).map(function(r, i){
    return '<tr>'
      + '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
      + '<td class="L"><div style="font-family:\'JetBrains Mono\',monospace;font-size:10px;">#'+esc(r.cod)+'</div></td>'
      + '<td class="L"><div style="font-weight:600;font-size:11px;">'+esc(r.nome||'')+'</div></td>'
      + '<td class="val-strong">'+fK(r.valor||0)+'</td>'
      + '<td class="val-dim">'+fI(r.parcelas||0)+'</td>'
      + '<td>'+fK(r.ticket_medio||0)+'</td>'
      + '</tr>';
  }).join('');

  // ─── Tabela cobranças ───
  const cobSorted = cobrancas.slice().sort(function(a,b){return b.valor - a.valor;});
  document.getElementById('tb-rec-cob').innerHTML = cobSorted.map(function(c){
    return '<tr>'
      + '<td class="L"><strong>'+esc(c.meio)+'</strong></td>'
      + '<td class="val-strong">'+fK(c.valor||0)+'</td>'
      + '<td class="val-dim">'+fI(c.parcelas||0)+'</td>'
      + '<td class="val-dim">'+fI(c.clientes||0)+'</td>'
      + '</tr>';
  }).join('');

  // ─── Binds dos filtros ───
  document.querySelectorAll('.inad-per-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      window._inadPeriodo = btn.getAttribute('data-per');
      renderRecebimentos();
    });
  });
  const supTog = document.getElementById('inad-sup-toggle');
  const supPanel = document.getElementById('inad-sup-panel');
  if(supTog && supPanel){
    supTog.addEventListener('click', function(){
      supPanel.style.display = (supPanel.style.display === 'none') ? 'block' : 'none';
    });
  }
  document.querySelectorAll('.inad-sup-cb').forEach(function(cb){
    cb.addEventListener('change', function(){
      // Coleta todos os checkboxes marcados
      const marcados = Array.from(document.querySelectorAll('.inad-sup-cb'))
        .filter(function(c){return c.checked;})
        .map(function(c){return c.getAttribute('data-key');});
      // Se todos marcados → trata como "todos" (null)
      window._inadSups = marcados.length === document.querySelectorAll('.inad-sup-cb').length ? null : marcados;
      renderRecebimentos();
    });
  });
  const supClear = document.getElementById('inad-sup-clear');
  if(supClear){
    supClear.addEventListener('click', function(){
      window._inadSups = null;
      renderRecebimentos();
    });
  }
}

// ────────────────────────────────────────────────────────────────────
// VERBAS · análise de descontos comerciais (sub-etapa 4g · 30/abr/2026)
// Consome /dados-modulares/verbas_atp.json
// Verba = redução de custo (dedução do CMV); aumenta margem real do SKU
// ────────────────────────────────────────────────────────────────────
// Estado do filtro de mês para Verbas (sessão)
// v4.70: filtro de Verbas migrado pro padrão (activePers do core.js).
// Mantido só pra compatibilidade caso algum chamador externo set-e a variável.
let _verbasMesFiltro = null;

function renderVerbas(){
  const cont = document.getElementById('page-verbas');
  if(!cont) return;

  if(!Vb){
    cont.innerHTML = '<div class="ph"><div class="pk">Compras · Análise</div><h2>Verbas aplicadas em produtos</h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc">'+_emptyState('Dados de verbas não carregados','O JSON verbas_<base>.json não está disponível para a filial ativa.')+'</div></div>';
    return;
  }

  const meta = Vb.meta || {};
  // Coleta meses disponíveis a partir do mensal original
  const mesesDisp = (Vb.mensal || []).map(function(m){ return m.ym; }).sort();

  // v4.70: filtro de meses agora usa o padrão global (activePers do core.js)
  // — o mesmo selecionado em Compras × Vendas e demais páginas. A pfb padrão
  // só apresenta 2026 (PERS=['2026-01'..'2026-04']), então o filtro implícito
  // já restringe a 2026.
  const _ymsAtivos = (typeof activePers !== 'undefined' && activePers && activePers.has)
    ? mesesDisp.filter(function(ym){return activePers.has(ym);})
    : mesesDisp.slice();
  const _setAtivo = new Set(_ymsAtivos);
  // Filtro ativo = subconjunto de meses (não todos)
  const filtroAtivo = _ymsAtivos.length > 0 && _ymsAtivos.length < mesesDisp.length;

  let resumo, mensal, deptos, secoes, forns, prodTop, conc, aplic;
  if(_ymsAtivos.length > 0 && _ymsAtivos.length < mesesDisp.length){
    // Recalcula a partir das aplicações filtradas pelos meses ativos
    aplic = (Vb.aplicacoes || []).filter(function(a){ return _setAtivo.has(a.ym); });
    const calc = _verbasRecalcular(aplic, null);
    resumo = calc.resumo;
    mensal = calc.mensal;
    deptos = calc.por_departamento;
    secoes = calc.por_secao;
    forns = calc.por_fornecedor;
    prodTop = calc.por_produto_top;
    conc = calc.concentracao;
  } else {
    resumo = Vb.resumo || {};
    mensal = Vb.mensal || [];
    deptos = Vb.por_departamento || [];
    secoes = Vb.por_secao || [];
    forns = Vb.por_fornecedor || [];
    prodTop = Vb.por_produto_top || [];
    conc = Vb.concentracao || {};
    aplic = Vb.aplicacoes || [];
  }
  const compl = meta.completude || {};

  // Sem dados (placeholder)
  if((meta.linhas_processadas||0) === 0){
    cont.innerHTML = '<div class="ph"><div class="pk">Compras · Análise</div><h2>Verbas aplicadas em produtos</h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc">'+_emptyState('Sem verba registrada nesta base', meta.aviso || 'O extrato carregado não contém linhas de verba aplicada para esta filial.')+'</div></div>';
    return;
  }

  let html = '<div class="ph"><div class="pk">Compras · Análise</div><h2>Verbas aplicadas em produtos</h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // ─── Slot pro filtro padrão (injetado abaixo via buildFilterBar) ───
  html += '<div id="verbas-pfb-slot"></div>';

  // ─── Banner de escopo ───
  const periodo = meta.periodo || {};
  let _perTxt2;
  if(filtroAtivo){
    _perTxt2 = _ymsAtivos.map(_ymToLabel).join(', ');
  } else {
    _perTxt2 = (periodo.inicio && periodo.fim)
      ? esc(periodo.inicio)+' a '+esc(periodo.fim)
      : '<span style="color:var(--text-muted);font-style:italic;">carregando…</span>';
  }
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>Período:</strong> '+_perTxt2+' · '
       +   fI(aplic.length)+' aplicações · '
       +   'gerado em '+esc((meta.gerado_em||'').substring(0,16).replace('T',' '))
       + '</div>';

  // ─── Avisos de completude ───
  if(compl && compl.tem_custo_antes_depois_pct < 80){
    html += '<div style="background:#fef3c7;border:1px solid #d97706;border-radius:8px;padding:10px 14px;margin-bottom:10px;font-size:11.5px;color:#92400e;line-height:1.5;">'
         +   '<strong>Atenção:</strong> Custo antes/depois preenchido em apenas '+fP(compl.tem_custo_antes_depois_pct,1)+' das aplicações nesta base. '
         +   'Análises de redução de custo refletem só as linhas com dado.'
         + '</div>';
  }
  if(compl && compl.tem_tipo_verba === 0){
    // Subtítulo "Limitação WinThor" removido conforme pedido — mantém só o aviso de custo acima se aplicável
    html += '<div style="margin-bottom:14px;"></div>';
  } else {
    html += '<div style="margin-bottom:14px;"></div>';
  }

  // ─── KPIs (6 cards) ───
  const r = resumo;
  html += '<div class="kg" style="grid-template-columns:repeat(6,1fr);margin-bottom:14px;">';
  html += '<div class="kc"><div class="kl">Total aplicado</div><div class="kv">'+fK(r.total_aplicado||0)+'</div><div class="ku">'+(periodo.meses||0)+' meses</div></div>';
  html += '<div class="kc"><div class="kl">Aplicações</div><div class="kv">'+fI(r.aplicacoes||0)+'</div><div class="ku">'+fI(r.verbas||0)+' verbas distintas</div></div>';
  html += '<div class="kc"><div class="kl">Fornecedores</div><div class="kv">'+fI(r.fornecedores||0)+'</div><div class="ku">com verba aplicada</div></div>';
  html += '<div class="kc"><div class="kl">Produtos</div><div class="kv">'+fI(r.produtos||0)+'</div><div class="ku">distintos beneficiados</div></div>';
  html += '<div class="kc"><div class="kl">Departamentos</div><div class="kv">'+fI(r.departamentos||0)+'</div><div class="ku">'+fI(r.secoes||0)+' seções</div></div>';
  if(r.reducao_custo_total_pct != null){
    html += '<div class="kc"><div class="kl">Redução de custo</div><div class="kv">'+fP(r.reducao_custo_total_pct,2)+'</div><div class="ku">média ponderada</div></div>';
  } else {
    html += '<div class="kc"><div class="kl">Redução de custo</div><div class="kv" style="color:var(--text-muted);">—</div><div class="ku">sem dados</div></div>';
  }
  html += '</div>';

  // ─── Linha 1: Mensal + Departamento ───
  html += '<div class="row2eq" style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Aplicação mensal de verbas</div>'
       +      '<div class="ccs">Valor aplicado por mês · linha mostra % de redução de custo (quando disponível)</div>'
       +      '<div style="height:280px;"><canvas id="c-vb-mensal"></canvas></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">Distribuição por departamento</div>'
       +      '<div class="ccs">Onde as verbas estão sendo aplicadas</div>'
       +      '<div style="height:280px;"><canvas id="c-vb-depto"></canvas></div>'
       +    '</div>'
       + '</div>';

  // ─── Linha 2: Top fornecedores + Top seções ───
  html += '<div class="row2eq" style="margin-bottom:14px;">'
       +    '<div class="cc">'
       +      '<div class="cct">Top 10 fornecedores · valor aplicado</div>'
       +      '<div class="ccs">Quem mais traz verba pra rede</div>'
       +      '<div style="height:300px;"><canvas id="c-vb-forn"></canvas></div>'
       +    '</div>'
       +    '<div class="cc">'
       +      '<div class="cct">Top 10 seções · valor aplicado</div>'
       +      '<div class="ccs">Categorias de produto que mais recebem rebaixa</div>'
       +      '<div style="height:300px;"><canvas id="c-vb-secao"></canvas></div>'
       +    '</div>'
       + '</div>';

  // ─── Concentração ───
  html += '<div class="cc" style="margin-bottom:14px;">'
       +   '<div class="cct">Concentração de verbas</div>'
       +   '<div class="ccs">Quanto do total está concentrado nos primeiros</div>'
       +   '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-top:10px;font-size:12px;">'
       +     _vbConcCard('Top 1 forn.', conc.top_1_fornecedor_pct)
       +     _vbConcCard('Top 3 forn.', conc.top_3_fornecedores_pct)
       +     _vbConcCard('Top 5 forn.', conc.top_5_fornecedores_pct)
       +     _vbConcCard('Top 10 forn.', conc.top_10_fornecedores_pct)
       +     _vbConcCard('Top 1 dep.', conc.top_1_dep_pct, conc.top_1_dep_nome)
       +     _vbConcCard('Top 3 deps.', conc.top_3_deps_pct)
       +     '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:10px;text-align:center;"><div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;">Departamento líder</div><div style="font-weight:700;color:var(--text);margin-top:4px;font-size:13px;">'+esc(conc.top_1_dep_nome||'—')+'</div></div>'
       +   '</div>'
       + '</div>';

  // ─── Tabela fornecedores ───
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cct">Fornecedores com verba · ranking completo</div>'
       +    '<div class="ccs">'+fI(forns.length)+' fornecedores ordenados por valor aplicado</div>'
       +    '<div class="tscroll" style="max-height:380px;"><table class="t" id="t-vb-forn">'
       +      '<thead><tr>'
       +      '<th class="L" style="width:30px;">#</th>'
       +      '<th class="L">Cód.</th><th class="L">Fornecedor</th>'
       +      '<th>Verba aplicada</th><th>% do total</th>'
       +      '<th>Aplicações</th><th>Verbas</th><th>Produtos</th>'
       +      '</tr></thead><tbody id="tb-vb-forn"></tbody></table></div>'
       + '</div>';

  // ─── Tabela top produtos ───
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cct">Top 50 produtos · maiores valores em verba</div>'
       +    '<div class="ccs">Produtos que mais receberam aplicação no período</div>'
       +    '<div class="tscroll" style="max-height:380px;"><table class="t" id="t-vb-prod">'
       +      '<thead><tr>'
       +      '<th class="L" style="width:30px;">#</th>'
       +      '<th class="L">Cód.</th><th class="L">Produto</th><th class="L">Fornecedor</th><th class="L">Depto.</th>'
       +      '<th>Verba aplicada</th><th>Aplicações</th><th>Redução custo %</th>'
       +      '</tr></thead><tbody id="tb-vb-prod"></tbody></table></div>'
       + '</div>';

  // ─── Quadro filtrável (aplicações detalhadas) ───
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cct">Aplicações detalhadas · filtro livre</div>'
       +    '<div class="ccs">Cada linha = uma aplicação de verba a um item · '+fI(aplic.length)+' registros</div>'
       +    '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:14px;margin-bottom:10px;">'
       +      '<div><label style="display:block;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;">Mês</label><select id="f-vb-ym" style="width:100%;padding:7px 8px;border:1px solid var(--border);border-radius:5px;font-size:12px;background:var(--surface);color:var(--text);"></select></div>'
       +      '<div><label style="display:block;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;">Filial</label><select id="f-vb-filial" style="width:100%;padding:7px 8px;border:1px solid var(--border);border-radius:5px;font-size:12px;background:var(--surface);color:var(--text);"></select></div>'
       +      '<div><label style="display:block;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;">Departamento</label><select id="f-vb-dep" style="width:100%;padding:7px 8px;border:1px solid var(--border);border-radius:5px;font-size:12px;background:var(--surface);color:var(--text);"></select></div>'
       +      '<div><label style="display:block;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;">Fornecedor</label><select id="f-vb-forn" style="width:100%;padding:7px 8px;border:1px solid var(--border);border-radius:5px;font-size:12px;background:var(--surface);color:var(--text);"></select></div>'
       +      '<div><label style="display:block;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;">Buscar produto</label><input type="text" id="f-vb-q" placeholder="código ou nome…" style="width:100%;padding:7px 8px;border:1px solid var(--border);border-radius:5px;font-size:12px;background:var(--surface);color:var(--text);"></div>'
       +    '</div>'
       +    '<div id="f-vb-summary" style="font-size:11px;color:var(--text-muted);margin-bottom:8px;"></div>'
       +    '<div class="tscroll" style="max-height:520px;"><table class="t" id="t-vb-aplic">'
       +      '<thead><tr>'
       +      '<th class="L">Data</th><th class="L">Filial</th><th class="L">Verba</th>'
       +      '<th class="L">Cód.</th><th class="L">Produto</th>'
       +      '<th class="L">Fornecedor</th><th class="L">Departamento</th>'
       +      '<th>Custo antes</th><th>Verba</th><th>Custo depois</th><th>% rebaixa</th>'
       +      '</tr></thead><tbody id="tb-vb-aplic"></tbody></table></div>'
       +    '<div id="f-vb-pager" style="margin-top:10px;display:flex;align-items:center;justify-content:space-between;font-size:11.5px;color:var(--text-muted);"></div>'
       + '</div>';

  html += '</div>'; // page-body
  cont.innerHTML = html;

  // ═══════════════════════════════════════════════════════════════
  // GRÁFICOS
  // ═══════════════════════════════════════════════════════════════

  // Gráfico mensal: barras valor + linha % redução
  const ctxMes = document.getElementById('c-vb-mensal');
  if(ctxMes && mensal.length){
    new Chart(ctxMes, {
      type: 'bar',
      data: {
        labels: mensal.map(m => m.ym),
        datasets: [
          {
            type: 'bar',
            label: 'Valor aplicado',
            data: mensal.map(m => m.valor||0),
            backgroundColor: 'rgba(245,134,52,0.7)',
            borderColor: 'rgba(245,134,52,1)',
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            type: 'line',
            label: '% redução custo',
            data: mensal.map(m => m.reducao_custo_pct),
            borderColor: 'rgba(48,86,159,1)',
            backgroundColor: 'rgba(48,86,159,0.1)',
            tension: 0.3,
            yAxisID: 'y1',
            spanGaps: true,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: { position:'left', ticks:{callback:v=>fAbbr(v)} },
          y1: { position:'right', grid:{drawOnChartArea:false}, ticks:{callback:v=>v+'%'} }
        },
        plugins: { legend:{position:'bottom',labels:{boxWidth:12,font:{size:11}}} }
      }
    });
  }

  // Gráfico por departamento: pizza
  const ctxDep = document.getElementById('c-vb-depto');
  if(ctxDep && deptos.length){
    const cores = ['#f58634','#30569f','#06b6d4','#10b981','#f59e0b','#8b5cf6','#ef4444','#64748b','#84cc16','#ec4899'];
    new Chart(ctxDep, {
      type: 'doughnut',
      data: {
        labels: deptos.map(d => d.nome),
        datasets: [{
          data: deptos.map(d => d.valor||0),
          backgroundColor: deptos.map((_,i) => cores[i % cores.length]),
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position:'right', labels:{boxWidth:10,font:{size:11}} },
          tooltip: { callbacks: { label: ctx => ctx.label+': '+fK(ctx.parsed)+' ('+(ctx.parsed/(r.total_aplicado||1)*100).toFixed(1)+'%)' } }
        }
      }
    });
  }

  // Top fornecedores
  const ctxForn = document.getElementById('c-vb-forn');
  if(ctxForn && forns.length){
    const top = forns.slice(0, 10);
    new Chart(ctxForn, {
      type: 'bar',
      data: {
        labels: top.map(f => f.nome.substring(0,28) + (f.nome.length>28?'…':'')),
        datasets: [{
          label: 'Verba aplicada',
          data: top.map(f => f.valor),
          backgroundColor: 'rgba(48,86,159,0.7)',
          borderColor: 'rgba(48,86,159,1)',
          borderWidth: 1,
        }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        scales: { x: { ticks:{callback:v=>fAbbr(v)} } },
        plugins: { legend:{display:false}, tooltip:{callbacks:{label:ctx=>fK(ctx.parsed.x)}} }
      }
    });
  }

  // Top seções
  const ctxSec = document.getElementById('c-vb-secao');
  if(ctxSec && secoes.length){
    const top = secoes.slice(0, 10);
    new Chart(ctxSec, {
      type: 'bar',
      data: {
        labels: top.map(s => s.nome_sec.substring(0,28) + (s.nome_sec.length>28?'…':'')),
        datasets: [{
          label: 'Verba aplicada',
          data: top.map(s => s.valor),
          backgroundColor: 'rgba(245,134,52,0.7)',
          borderColor: 'rgba(245,134,52,1)',
          borderWidth: 1,
        }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        scales: { x: { ticks:{callback:v=>fAbbr(v)} } },
        plugins: { legend:{display:false}, tooltip:{callbacks:{label:ctx=>fK(ctx.parsed.x)}} }
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // TABELAS
  // ═══════════════════════════════════════════════════════════════

  const totalForn = r.total_aplicado || 1;
  document.getElementById('tb-vb-forn').innerHTML = forns.map((f,i) => {
    return '<tr>'
      + '<td class="L val-dim">'+(i+1)+'</td>'
      + '<td class="L val-dim">'+fI(f.cod||0)+'</td>'
      + '<td class="L" data-forn-cod="'+esc(f.cod)+'" title="Clique para ver diagnóstico do fornecedor"><strong>'+esc(f.nome||'')+'</strong></td>'
      + '<td class="val-strong">'+fK(f.valor||0)+'</td>'
      + '<td class="val-dim">'+fP(f.valor/totalForn*100,1)+'</td>'
      + '<td class="val-dim">'+fI(f.aplicacoes||0)+'</td>'
      + '<td class="val-dim">'+fI(f.verbas||0)+'</td>'
      + '<td class="val-dim">'+fI(f.produtos||0)+'</td>'
      + '</tr>';
  }).join('');

  document.getElementById('tb-vb-prod').innerHTML = prodTop.slice(0, 50).map((p,i) => {
    const red = p.reducao_custo_pct;
    const redCls = red == null ? 'val-dim' : (red > 0 ? 'val-pos' : '');
    const redTxt = red == null ? '—' : fP(red, 2);
    return '<tr>'
      + '<td class="L val-dim">'+(i+1)+'</td>'
      + '<td class="L val-dim">'+fI(p.cod||0)+'</td>'
      + '<td class="L" data-prod-cod="'+esc(p.cod)+'" title="Clique para ver diagnóstico do produto"><strong>'+esc(p.desc||'')+'</strong>'+(p.desc?'':'<span style="color:var(--text-muted);">cod '+fI(p.cod||0)+'</span>')+'</td>'
      + '<td class="L val-dim">'+esc((p.forn||'').substring(0,30))+'</td>'
      + '<td class="L val-dim">'+esc(p.dep||'')+'</td>'
      + '<td class="val-strong">'+fK(p.valor||0)+'</td>'
      + '<td class="val-dim">'+fI(p.aplicacoes||0)+'</td>'
      + '<td class="'+redCls+'">'+redTxt+'</td>'
      + '</tr>';
  }).join('');

  // ═══════════════════════════════════════════════════════════════
  // QUADRO FILTRÁVEL
  // ═══════════════════════════════════════════════════════════════
  _vbAplicState = {
    todos: aplic,
    pagina: 0,
    tamPag: 100,
    filtros: { ym:'', filial:'', dep:'', forn:'', q:'' }
  };

  // Popular dropdowns com valores únicos das aplicações
  const ymsSet = new Set(), filSet = new Set(), depSet = new Set(), forSet = new Set();
  aplic.forEach(a => {
    if(a.ym) ymsSet.add(a.ym);
    if(a.cod_filial) filSet.add(a.cod_filial+'|'+(a.filial||''));
    if(a.cod_dep) depSet.add(a.cod_dep+'|'+(a.dep||''));
    if(a.cod_forn) forSet.add(a.cod_forn+'|'+(a.forn||''));
  });

  const fillSel = (id, opts, label) => {
    const sel = document.getElementById(id);
    if(!sel) return;
    let h = '<option value="">'+label+'</option>';
    opts.forEach(o => {
      h += '<option value="'+escAttr(o.v)+'">'+esc(o.label)+'</option>';
    });
    sel.innerHTML = h;
  };
  fillSel('f-vb-ym',
    Array.from(ymsSet).sort().map(v => ({v:v, label:v})),
    'Todos os meses');
  fillSel('f-vb-filial',
    Array.from(filSet).map(s => { const [c,n]=s.split('|'); return {v:c, label:n+' ('+c+')', _ord:parseInt(c)}; })
      .sort((a,b)=>a._ord-b._ord),
    'Todas as filiais');
  fillSel('f-vb-dep',
    Array.from(depSet).map(s => { const [c,n]=s.split('|'); return {v:c, label:n+' ('+c+')', _ord:parseInt(c)}; })
      .sort((a,b)=>a._ord-b._ord),
    'Todos os departamentos');
  fillSel('f-vb-forn',
    Array.from(forSet).map(s => { const [c,n]=s.split('|'); return {v:c, label:n.substring(0,40)+(n.length>40?'…':''), _ord:n}; })
      .sort((a,b)=>a._ord.localeCompare(b._ord)),
    'Todos os fornecedores');

  // Listeners
  ['f-vb-ym','f-vb-filial','f-vb-dep','f-vb-forn'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('change', _vbRenderAplic);
  });
  const inpQ = document.getElementById('f-vb-q');
  if(inpQ){
    let _vbDeb = null;
    inpQ.addEventListener('input', () => {
      clearTimeout(_vbDeb);
      _vbDeb = setTimeout(_vbRenderAplic, 200);
    });
  }

  _vbRenderAplic();

  // v4.70: injeta a pfb padrão (mesma de Compras × Vendas)
  if(typeof buildFilterBar === 'function'){
    const slot = document.getElementById('verbas-pfb-slot');
    if(slot){
      slot.innerHTML = '';
      slot.appendChild(buildFilterBar('verbas'));
    }
  }
}

// Helper compartilhado: gera HTML do select de filtro de mês
function _filtroMesHTML(elId, mesesDisp, valorAtual, opts){
  opts = opts || {};
  const labelTodos = opts.labelTodos || 'Todos os meses';
  let html = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;">';
  html += '<label style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Filtrar mês:</label>';
  html += '<select id="'+elId+'" style="padding:5px 10px;border:1px solid var(--border);border-radius:5px;font-size:12px;background:var(--surface);color:var(--text);min-width:180px;">';
  html += '<option value="">'+esc(labelTodos)+'</option>';
  // Opções extras antes da lista, ex: "Total 2026"
  if(opts.extras){
    opts.extras.forEach(function(e){
      const sel = (valorAtual === e.value) ? ' selected' : '';
      html += '<option value="'+esc(e.value)+'"'+sel+'>'+esc(e.label)+'</option>';
    });
  }
  // Lista de meses (mais recentes primeiro)
  mesesDisp.slice().reverse().forEach(function(ym){
    const sel = (valorAtual === ym) ? ' selected' : '';
    html += '<option value="'+esc(ym)+'"'+sel+'>'+esc(_ymToLabel(ym))+'</option>';
  });
  html += '</select>';
  if(valorAtual){
    html += '<span style="font-size:10.5px;color:var(--text-muted);font-style:italic;">filtro ativo</span>';
  }
  html += '</div>';
  return html;
}

// Helper compartilhado: bind do select de filtro de mês
function _filtroMesBind(elId, callback){
  const sel = document.getElementById(elId);
  if(!sel) return;
  sel.addEventListener('change', function(){
    callback(sel.value || null);
  });
}

// Recalcula agregados de Verbas a partir das aplicações filtradas por mês
function _verbasRecalcular(aplic, mesYm){
  // Resumo
  const fornecedoresSet = new Set();
  const produtosSet = new Set();
  const verbasSet = new Set();
  const deptosSet = new Set();
  const secoesSet = new Set();
  let totalAplicado = 0;
  let custoAntesTotal = 0;
  let custoDepoisTotal = 0;
  let comCustoCount = 0;
  aplic.forEach(function(a){
    totalAplicado += a.vl_aplicado || 0;
    if(a.cod_forn != null) fornecedoresSet.add(a.cod_forn);
    if(a.cod_prod != null) produtosSet.add(a.cod_prod);
    if(a.num_verba) verbasSet.add(a.num_verba);
    if(a.cod_dep != null) deptosSet.add(a.cod_dep);
    if(a.cod_sec != null) secoesSet.add(a.cod_sec);
    if(a.custo_antes && a.custo_depois){
      custoAntesTotal += a.custo_antes;
      custoDepoisTotal += a.custo_depois;
      comCustoCount++;
    }
  });
  const reducaoPct = custoAntesTotal > 0
    ? ((custoAntesTotal - custoDepoisTotal) / custoAntesTotal * 100)
    : null;

  const resumo = {
    total_aplicado: totalAplicado,
    aplicacoes: aplic.length,
    verbas: verbasSet.size,
    fornecedores: fornecedoresSet.size,
    produtos: produtosSet.size,
    departamentos: deptosSet.size,
    secoes: secoesSet.size,
    reducao_custo_total_pct: reducaoPct
  };

  // Mensal: só esse mês
  const mensal = [{
    ym: mesYm,
    aplicacoes: aplic.length,
    valor: totalAplicado,
    verbas: verbasSet.size,
    fornecedores: fornecedoresSet.size,
    produtos: produtosSet.size,
    reducao_custo_pct: reducaoPct
  }];

  // Agregar por dept/sec/forn/produto
  function agruparPor(chave, nomeChave, idChave){
    const map = new Map();
    aplic.forEach(function(a){
      const k = a[idChave];
      if(k == null) return;
      if(!map.has(k)){
        map.set(k, {cod: k, nome: a[nomeChave] || ('#'+k), valor: 0, aplicacoes: 0, fornecedores: new Set(), produtos: new Set()});
      }
      const e = map.get(k);
      e.valor += a.vl_aplicado || 0;
      e.aplicacoes += 1;
      if(a.cod_forn != null) e.fornecedores.add(a.cod_forn);
      if(a.cod_prod != null) e.produtos.add(a.cod_prod);
    });
    return Array.from(map.values()).map(function(e){
      return {
        cod: e.cod,
        nome: e.nome,
        valor: e.valor,
        aplicacoes: e.aplicacoes,
        fornecedores: e.fornecedores.size,
        produtos: e.produtos.size
      };
    }).sort(function(a,b){return b.valor - a.valor;});
  }

  const por_departamento = agruparPor('dep', 'dep', 'cod_dep');
  const por_secao = agruparPor('sec', 'sec', 'cod_sec');
  const por_fornecedor = agruparPor('forn', 'forn', 'cod_forn');
  const por_produto_top = agruparPor('prod', 'prod', 'cod_prod').slice(0, 50);

  // Concentração
  function pctTop(lista, n){
    const total = lista.reduce(function(s,e){return s + e.valor;}, 0);
    if(total <= 0) return null;
    const top = lista.slice(0, n).reduce(function(s,e){return s + e.valor;}, 0);
    return top / total * 100;
  }
  const concentracao = {
    top_1_fornecedor_pct: pctTop(por_fornecedor, 1),
    top_3_fornecedores_pct: pctTop(por_fornecedor, 3),
    top_5_fornecedores_pct: pctTop(por_fornecedor, 5),
    top_10_fornecedores_pct: pctTop(por_fornecedor, 10),
    top_1_dep_pct: pctTop(por_departamento, 1),
    top_1_dep_nome: por_departamento[0] ? por_departamento[0].nome : null,
    top_3_deps_pct: pctTop(por_departamento, 3)
  };

  return {
    resumo: resumo,
    mensal: mensal,
    por_departamento: por_departamento,
    por_secao: por_secao,
    por_fornecedor: por_fornecedor,
    por_produto_top: por_produto_top,
    concentracao: concentracao
  };
}

function _vbConcCard(label, val, sub){
  if(val == null) return '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:10px;text-align:center;"><div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;">'+esc(label)+'</div><div style="font-weight:700;color:var(--text-muted);margin-top:4px;font-size:16px;">—</div></div>';
  return '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:10px;text-align:center;"><div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;">'+esc(label)+'</div><div style="font-weight:700;color:var(--text);margin-top:4px;font-size:16px;">'+fP(val,1)+'</div>'+(sub?'<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">'+esc(sub)+'</div>':'')+'</div>';
}

let _vbAplicState = null;

function _vbRenderAplic(){
  if(!_vbAplicState) return;
  // Captura filtros
  _vbAplicState.filtros.ym     = (document.getElementById('f-vb-ym')||{}).value || '';
  _vbAplicState.filtros.filial = (document.getElementById('f-vb-filial')||{}).value || '';
  _vbAplicState.filtros.dep    = (document.getElementById('f-vb-dep')||{}).value || '';
  _vbAplicState.filtros.forn   = (document.getElementById('f-vb-forn')||{}).value || '';
  _vbAplicState.filtros.q      = ((document.getElementById('f-vb-q')||{}).value || '').toLowerCase().trim();
  _vbAplicState.pagina = 0;

  const f = _vbAplicState.filtros;
  let filtrado = _vbAplicState.todos.filter(a => {
    if(f.ym && a.ym !== f.ym) return false;
    if(f.filial && String(a.cod_filial) !== f.filial) return false;
    if(f.dep && String(a.cod_dep) !== f.dep) return false;
    if(f.forn && String(a.cod_forn) !== f.forn) return false;
    if(f.q){
      const hay = ((a.prod||'')+' '+(a.cod_prod||'')+' '+(a.forn||'')).toLowerCase();
      if(hay.indexOf(f.q) === -1) return false;
    }
    return true;
  });

  _vbAplicState._filtrado = filtrado;

  // Sumário
  const totalVal = filtrado.reduce((s,a) => s + (a.vl_aplicado||0), 0);
  const sumEl = document.getElementById('f-vb-summary');
  if(sumEl){
    sumEl.innerHTML = '<strong>'+fI(filtrado.length)+'</strong> aplicações · '
      + '<strong>'+fK(totalVal)+'</strong> em verba'
      + (filtrado.length !== _vbAplicState.todos.length ? ' (de '+fI(_vbAplicState.todos.length)+' totais)' : '');
  }

  _vbRenderAplicPagina();
}

function _vbRenderAplicPagina(){
  const f = _vbAplicState._filtrado || [];
  const tb = document.getElementById('tb-vb-aplic');
  if(!tb) return;
  const ini = _vbAplicState.pagina * _vbAplicState.tamPag;
  const fim = Math.min(ini + _vbAplicState.tamPag, f.length);
  const pag = f.slice(ini, fim);

  tb.innerHTML = pag.map(a => {
    const red = a.perc_rebaixa;
    const redCls = (red == null || red === 0) ? 'val-dim' : (red > 0 ? 'val-pos' : '');
    const redTxt = (red == null) ? '—' : fP(red, 2);
    const ca = a.custo_fin_antes;
    const cd = a.custo_fin_depois;
    return '<tr>'
      + '<td class="L val-dim">'+fDt(a.dt)+'</td>'
      + '<td class="L val-dim">'+esc((a.filial||'').substring(0,18))+'</td>'
      + '<td class="L val-dim">'+esc(a.num_verba||'')+'</td>'
      + '<td class="L val-dim">'+fI(a.cod_prod||0)+'</td>'
      + '<td class="L" data-prod-cod="'+esc(a.cod_prod||'')+'" title="Clique para ver diagnóstico do produto"><strong>'+esc(a.prod||'')+'</strong>'+(a.prod?'':' <span style="color:var(--text-muted);">sem descrição</span>')+(a.embalagem?' <span style="color:var(--text-muted);font-size:10px;">'+esc(a.embalagem)+'</span>':'')+'</td>'
      + '<td class="L val-dim" data-forn-cod="'+esc(a.cod_forn||'')+'" title="Clique para ver diagnóstico do fornecedor">'+esc((a.forn||'').substring(0,28))+'</td>'
      + '<td class="L val-dim">'+esc(a.dep||'')+'</td>'
      + '<td class="val-dim">'+(ca==null?'—':fB(ca,2))+'</td>'
      + '<td class="val-strong">'+fB(a.vl_aplicado||0,2)+'</td>'
      + '<td class="val-dim">'+(cd==null?'—':fB(cd,2))+'</td>'
      + '<td class="'+redCls+'">'+redTxt+'</td>'
      + '</tr>';
  }).join('');

  // Pager
  const pgEl = document.getElementById('f-vb-pager');
  if(pgEl){
    const totalPag = Math.max(1, Math.ceil(f.length / _vbAplicState.tamPag));
    pgEl.innerHTML = '<div>Mostrando '+fI(ini+1)+' a '+fI(fim)+' de '+fI(f.length)+'</div>'
      + '<div style="display:flex;gap:6px;align-items:center;">'
      + '<button class="bt-mini" onclick="_vbPagAnt()" '+(_vbAplicState.pagina===0?'disabled':'')+' style="padding:5px 10px;border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:5px;cursor:pointer;font-size:11px;">‹ Anterior</button>'
      + '<span>Página '+(_vbAplicState.pagina+1)+' de '+totalPag+'</span>'
      + '<button class="bt-mini" onclick="_vbPagProx()" '+(_vbAplicState.pagina>=totalPag-1?'disabled':'')+' style="padding:5px 10px;border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:5px;cursor:pointer;font-size:11px;">Próxima ›</button>'
      + '</div>';
  }
}

function _vbPagAnt(){ if(_vbAplicState && _vbAplicState.pagina>0){ _vbAplicState.pagina--; _vbRenderAplicPagina(); } }
function _vbPagProx(){
  if(!_vbAplicState) return;
  const f = _vbAplicState._filtrado || [];
  const totalPag = Math.max(1, Math.ceil(f.length / _vbAplicState.tamPag));
  if(_vbAplicState.pagina < totalPag-1){ _vbAplicState.pagina++; _vbRenderAplicPagina(); }
}
window._vbPagAnt = _vbPagAnt;
window._vbPagProx = _vbPagProx;

// ────────────────────────────────────────────────────────────────────
// ANÁLISE DINÂMICA · cubo OLAP (sub-etapa 4h · 30/abr/2026)
// Consome /dados-modulares/cubo_atp.json (lazy-load, ~10MB gzip, 612k linhas fato)
// Schema column-store: fatos.vendas = {campos:[...], linhas:[[...]]}
// ────────────────────────────────────────────────────────────────────
let _cuboState = null;  // estado da página (filtros, índices)

function renderCubo(){
  const cont = document.getElementById('page-cubo');
  if(!cont) return;

  const slug = _getBaseSlug();
  // Tamanho aproximado por base (pra mostrar algo realista no loader)
  let tamInfo;
  if(slug === 'grupo'){
    tamInfo = 'CP + ATP combinados · ~33 MB gzip · 2 milhões de linhas';
  } else if(slug === 'cp'){
    tamInfo = '~23 MB gzip · 1,4 milhão de linhas';
  } else {
    tamInfo = '~10 MB gzip · 612 mil linhas';
  }

  cont.innerHTML = '<div class="ph"><div class="pk">Análise Dinâmica</div><h2>Pivot interativo · <em>cubo OLAP</em></h2></div>'
                 + '<div class="ph-sep"></div>'
                 + '<div class="page-body" id="cubo-body">'
                 +   '<div class="cc" style="text-align:center;padding:40px;">'
                 +     '<div style="font-size:14px;color:var(--text-dim);margin-bottom:8px;">Carregando cubo OLAP…</div>'
                 +     '<div style="font-size:11px;color:var(--text-muted);">'+tamInfo+'</div>'
                 +     '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">Arquivos grandes podem levar 30 a 60 segundos. Aguarde.</div>'
                 +     '<div style="margin-top:14px;width:200px;height:4px;background:var(--surface-2);border-radius:2px;margin-left:auto;margin-right:auto;overflow:hidden;">'
                 +       '<div style="width:40%;height:100%;background:var(--accent);animation:pulseLoad 1.4s ease-in-out infinite;"></div>'
                 +     '</div>'
                 +   '</div>'
                 + '</div>';

  // Injeta CSS de animação + ajustes de usabilidade (uma vez)
  if(!document.getElementById('cubo-anim-css')){
    const st = document.createElement('style');
    st.id = 'cubo-anim-css';
    st.textContent = ''
      + '@keyframes pulseLoad{0%,100%{transform:translateX(-100%);}50%{transform:translateX(250%);}}'
      // Sem seleção de texto nos campos arrastáveis e nas pílulas das zonas
      // (evita o gesto de arrastar virar seleção de texto, principalmente no mobile)
      + '.pv-field, .pv-pill, .pv-zone, .pv-chip {'
      +   '-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;'
      +   '-webkit-touch-callout:none;'
      +   'touch-action:manipulation;'
      + '}'
      // Mobile: painel vira coluna única, dimensões e métricas em duas colunas
      + '@media (max-width: 720px){'
      +   '.pv-painel{grid-template-columns:1fr !important;gap:10px !important;}'
      +   '.pv-fields-pane{max-height:none !important;}'
      +   '.pv-fields-scroll{max-height:280px;}'
      +   '#pv-fields{display:grid !important;grid-template-columns:1fr 1fr !important;gap:5px !important;margin-bottom:10px !important;}'
      +   '#pv-metrics{display:grid !important;grid-template-columns:1fr 1fr !important;gap:5px !important;}'
      +   '#pv-metrics > div[style*="text-transform"]{grid-column:1/-1;margin-top:8px !important;}'
      +   '.pv-field{padding:6px 8px !important;font-size:11.5px !important;}'
      +   '.pv-zones-grid{gap:8px !important;}'
      +   '.pv-zone{min-height:60px !important;}'
      +   '.pv-acoes{flex-direction:column !important;align-items:stretch !important;}'
      +   '.pv-acoes select, .pv-acoes button{width:100% !important;min-width:0 !important;}'
      + '}';
    document.head.appendChild(st);
  }

  function _exibirErroCubo(msg, detalhe){
    const arq = slugEfetivo === slug ? 'cubo_'+slug+'.json' : 'cubo_'+slugEfetivo+'.json (fallback)';
    const body = document.getElementById('cubo-body');
    if(!body) return;
    body.innerHTML = '<div class="cc" style="text-align:center;padding:30px;">'
      + '<div style="font-size:14px;font-weight:700;color:#dc2626;margin-bottom:8px;">⚠ '+esc(msg)+'</div>'
      + '<div style="font-size:12px;color:var(--text-dim);margin-bottom:14px;">'+(detalhe ? esc(detalhe) : '')+'</div>'
      + '<div style="font-size:11px;color:var(--text-muted);font-family:JetBrains Mono,monospace;">Arquivo: '+esc(arq)+'</div>'
      + '<button onclick="Cu=null; _cuLoading=null; renderCubo();" class="ebtn" style="background:var(--accent);color:white;border:none;margin-top:14px;padding:8px 16px;font-size:12px;">Tentar novamente</button>'
      + '</div>';
  }

  _carregarCuboLazy()
    .then(function(c){
      if(!c){
        _exibirErroCubo('Cubo OLAP indisponível', 'O arquivo não foi encontrado ou retornou vazio.');
        return;
      }
      // Validação básica: tem dimensões e fato vendas com linhas?
      const fv = (c.fatos && c.fatos.vendas) || {};
      if(!fv.linhas || fv.linhas.length === 0){
        _exibirErroCubo(
          'Cubo OLAP em formato incompatível',
          'O arquivo carregou mas não foi possível extrair os dados de vendas. Estrutura esperada: fatos.vendas.linhas. Pode ser uma versão antiga do ETL.'
        );
        return;
      }
      try {
        _renderCuboUI(c);
      } catch(e){
        console.error('[renderCubo] erro renderizando UI:', e);
        _exibirErroCubo('Erro ao renderizar cubo', e.message || 'Erro desconhecido');
      }
    })
    .catch(function(e){
      const msg = (e && e.message) || 'Erro desconhecido';
      const isTimeout = msg.indexOf('Timeout') >= 0;
      _exibirErroCubo(
        isTimeout ? 'Tempo esgotado ao carregar cubo' : 'Erro ao carregar cubo',
        msg
      );
    });
}

// Constrói índices de dimensões para lookup O(1)
function _buildCuboIdx(c){
  const idx = {};
  const dims = c.dimensoes || {};
  ['tempo','loja','supervisor','vendedor','depto','categoria','fornecedor','grupo_conta','conta','sku_vendas','sku_compras'].forEach(function(d){
    const m = new Map();
    const items = (dims[d] && dims[d].items) || [];
    items.forEach(function(it){ m.set(it.cod, it); });
    idx[d] = m;
  });
  return idx;
}

// ────────────────────────────────────────────────────────────────────
// ANÁLISE DINÂMICA · Tabela dinâmica estilo Excel (v4.17 · 02/mai/2026)
// Drag-and-drop, múltiplas dimensões em linhas/colunas, filtros, ordenação.
// Compatibilidade fato × dimensão (opção C): métricas habilitam/desabilitam
// conforme as dimensões em uso.
// ────────────────────────────────────────────────────────────────────

// Mapa de quais campos cada fato possui — fonte de verdade da compatibilidade
// IMPORTANTE: 'sku' é o nome real do campo nos fatos vendas e compras (sem sufixo).
// Tratamos como duas dimensões lógicas diferentes (sku_vendas, sku_compras) porque
// o domínio de SKU é diferente entre os fatos, mas no fato o campo é só 'sku'.
const _CUBO_FATO_DIMS = {
  vendas:     ['ym','lj','sup','vend','dep','cat','forn','sku_vendas'],
  compras:    ['ym','lj','dep','cat','forn','sku_compras'],
  financeiro: ['ym','lj','grp','cnt','forn']
};

// Mapa: dimensão lógica → nome real do campo no fato (quando diferente)
// Usado pra resolver qual coluna do fato indexa cada dimensão lógica.
const _CUBO_DIM_TO_CAMPO = {
  sku_vendas: 'sku',
  sku_compras: 'sku'
  // demais dimensões usam o mesmo nome
};

// Mapa de métricas → campo no fato + função de agregação + qual fato pertence
const _CUBO_METRICAS = {
  // VENDAS
  v_brt:    {label:'Faturamento bruto',    fato:'vendas',     campo:'v_brt', agg:'sum', fmt:'k'},
  v_liq:    {label:'Faturamento líquido',  fato:'vendas',     campo:'v_liq', agg:'sum', fmt:'k'},
  v_dev:    {label:'Devolução cliente',    fato:'vendas',     campo:'v_dev', agg:'sum', fmt:'k'},
  v_cmv:    {label:'CMV',                  fato:'vendas',     campo:'v_cmv', agg:'sum', fmt:'k'},
  v_luc:    {label:'Lucro bruto',          fato:'vendas',     campo:'v_luc', agg:'sum', fmt:'k'},
  v_marg:   {label:'Margem %',             fato:'vendas',     calc:'marg',   fmt:'p'},
  v_qt:     {label:'Qtde vendida',         fato:'vendas',     campo:'v_qt',  agg:'sum', fmt:'i'},
  v_nfs:    {label:'NFs vendidas',         fato:'vendas',     campo:'v_nfs', agg:'sum', fmt:'i'},
  v_cli:    {label:'Clientes positivados', fato:'vendas',     campo:'v_cli', agg:'sum', fmt:'i'},
  v_tkt:    {label:'Ticket médio',         fato:'vendas',     calc:'tkt',    fmt:'k'},
  // COMPRAS
  c_val:    {label:'Compras (valor)',      fato:'compras',    campo:'c_val', agg:'sum', fmt:'k'},
  c_qt:     {label:'Compras (qtde)',       fato:'compras',    campo:'c_qt',  agg:'sum', fmt:'i'},
  c_nfs:    {label:'NFs entrada',          fato:'compras',    campo:'c_nfs', agg:'sum', fmt:'i'},
  // FINANCEIRO
  f_pago:   {label:'Pago',                 fato:'financeiro', campo:'f_pago',    agg:'sum', fmt:'k'},
  f_titulos:{label:'Títulos pagos',        fato:'financeiro', campo:'f_titulos', agg:'sum', fmt:'i'},
  f_juros:  {label:'Juros pagos',          fato:'financeiro', campo:'f_juros',   agg:'sum', fmt:'k'},
  f_desc:   {label:'Descontos obtidos',    fato:'financeiro', campo:'f_desc',    agg:'sum', fmt:'k'}
};

// Mapa de dimensões disponíveis com seu label e qual campo do fato indexa
const _CUBO_DIMS_INFO = {
  ym:         {label:'Mês',          dimKey:'tempo',      icone:'📅'},
  lj:         {label:'Loja',         dimKey:'loja',       icone:'🏪'},
  sup:        {label:'Supervisor',   dimKey:'supervisor', icone:'👔'},
  vend:       {label:'Vendedor',     dimKey:'vendedor',   icone:'👤'},
  dep:        {label:'Departamento', dimKey:'depto',      icone:'📦'},
  cat:        {label:'Categoria',    dimKey:'categoria',  icone:'🏷️'},
  forn:       {label:'Fornecedor',   dimKey:'fornecedor', icone:'🚚'},
  sku_vendas: {label:'SKU (vendas)', dimKey:'sku_vendas', icone:'🛒'},
  sku_compras:{label:'SKU (compras)',dimKey:'sku_compras',icone:'📥'},
  grp:        {label:'Grupo conta',  dimKey:'grupo_conta',icone:'💰'},
  cnt:        {label:'Conta',        dimKey:'conta',      icone:'💳'}
};

// Estado global da pivot
let _pivotState = null;

function _renderCuboUI(c){
  const meta = c.meta || {};
  const dims = c.dimensoes || {};
  const fatos = c.fatos || {};
  const idx = _buildCuboIdx(c);
  // Invalida cache de labels de dimensão (cubo pode ter mudado)
  _pvDimCache = {};

  // Diagnóstico: lista filiais visíveis na dim Loja (ajuda a debugar problemas
  // como "Inhambupe não aparece"). Aparece no console do navegador.
  try {
    const lojaItems = ((dims.loja||{}).items || []);
    console.info('[Análise Dinâmica] base =', meta.base || '?',
                 '· filiais na dim Loja:', lojaItems.map(function(it){return it.cod+' ('+it.nome+')';}));
  } catch(e){}

  // Inicializa estado (ou recupera do localStorage)
  let saved = null;
  try {
    const raw = localStorage.getItem('pivot_state_v2');
    if(raw){ saved = JSON.parse(raw); }
  } catch(e){}

  _pivotState = saved || {
    rows: [],
    cols: [],
    vals: [],
    filters: {},
    comp: {tipo:null, base:null},
    sort: {col:null, dir:'asc'}
  };
  _pivotState.cubo = c;
  _pivotState.idx = idx;

  // Estado de visibilidade do painel (persistido)
  let painelOculto = false;
  try {
    painelOculto = localStorage.getItem('pivot_painel_oculto_v1') === '1';
  } catch(e){}

  // Banner de status do cubo (especial pra GRUPO mesclado)
  let html = '';
  if(c._formato_origem === 'merged'){
    const filiaisCount = (((c.dimensoes||{}).loja||{}).items || []).length;
    html += '<div style="background:#dcfce7;border:1px solid #15803d;border-radius:8px;padding:10px 14px;margin-bottom:10px;font-size:12px;color:#15803d;">'
         +   '<strong>Visão GRUPO:</strong> dados de Comercial Pinto (CP1, CP3, CP5, CP40) e ATP combinados. '+filiaisCount+' filiais disponíveis na dimensão Loja.'
         + '</div>';
  } else if(c._fallback_de){
    const labels = {cp:'Comercial Pinto (CP1, CP3, CP5, CP40)', atp:'ATP'};
    const ausente = c._fallback_de === 'cp' ? 'ATP' : 'CP';
    html += '<div style="background:#fef3c7;border:1px solid #d97706;border-radius:8px;padding:10px 14px;margin-bottom:10px;font-size:12px;color:#92400e;">'
         +   '<strong>Atenção:</strong> em GRUPO, só foi possível carregar o cubo de '+esc(labels[c._fallback_de] || c._fallback_de)+'. Os dados de '+ausente+' não estão incluídos. Verifique se o arquivo cubo_'+(c._fallback_de === 'cp' ? 'atp' : 'cp')+'.json existe no servidor.'
         + '</div>';
  }

  // Banner com info do cubo
  const _per = meta.periodo || {};
  const _perTxt = (_per.inicio && _per.fim)
    ? esc(_per.inicio)+' a '+esc(_per.fim)+' ('+esc(_per.meses||'?')+' meses)'
    : '<span style="color:var(--text-muted);font-style:italic;">carregando…</span>';
  const fv = fatos.vendas || {};
  const fc = fatos.compras || {};
  const ff = fatos.financeiro || {};

  // ─── Topbar com controles ───
  html += '<div class="pv-topbar" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px;padding:10px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;">';
  html += '<button id="pv-toggle-painel" class="ebtn" style="background:var(--surface);color:var(--text);border:1px solid var(--border);padding:6px 10px;font-size:12px;display:inline-flex;align-items:center;gap:6px;">'
       +    '<span id="pv-toggle-icon">'+(painelOculto?'☰':'✕')+'</span>'
       +    '<span id="pv-toggle-txt">'+(painelOculto?'Mostrar painel':'Ocultar painel')+'</span>'
       + '</button>';
  html += '<div style="font-size:11px;color:var(--text-dim);flex:1;">';
  html += '<strong>Período:</strong> '+_perTxt+' · ';
  html += '<strong>'+fI((fv.linhas||[]).length)+'</strong> vendas · ';
  html += '<strong>'+fI((fc.linhas||[]).length)+'</strong> compras · ';
  html += '<strong>'+fI((ff.linhas||[]).length)+'</strong> financeiro';
  html += '</div>';
  html += '<button id="pv-chart" class="ebtn" style="background:var(--surface);color:var(--text);border:1px solid var(--border);padding:6px 10px;font-size:11px;">📊 Gráfico</button>';
  // v4.76 fix18: três opções de export do conteúdo gerado (XLSX, PDF, JPG)
  html += '<div class="pv-export-group" style="display:inline-flex;gap:4px;border-left:1px solid var(--border);padding-left:8px;margin-left:4px;">';
  html += '<button id="pv-export-xlsx" class="ebtn" title="Exportar tabela em XLSX" style="background:var(--surface);color:var(--text);border:1px solid var(--border);padding:6px 10px;font-size:11px;">📥 XLSX</button>';
  html += '<button id="pv-export-pdf" class="ebtn" title="Exportar conteúdo em PDF (sem topbar/sidebar)" style="background:var(--surface);color:var(--text);border:1px solid var(--border);padding:6px 10px;font-size:11px;">📄 PDF</button>';
  html += '<button id="pv-export-jpg" class="ebtn" title="Exportar conteúdo como imagem JPG" style="background:var(--surface);color:var(--text);border:1px solid var(--border);padding:6px 10px;font-size:11px;">🖼 JPG</button>';
  html += '</div>';
  html += '</div>';

  // ─── Painel de configuração (área superior) ───
  // v4.76 fix18: layout equilibrado — colunas com larguras balanceadas,
  // stretch pra mesma altura, lista de campos em 2 colunas
  html += '<div id="pv-painel" class="pv-painel" style="display:'+(painelOculto?'none':'grid')+';grid-template-columns:minmax(320px,1.1fr) minmax(0,1fr);gap:14px;align-items:stretch;margin-bottom:14px;">';

  // ── Coluna esquerda: lista de campos (2 colunas internas) ──
  html += '<div class="pv-fields-pane cc" style="padding:12px;display:flex;flex-direction:column;min-height:420px;">';
  html += '<div class="cct" style="font-size:11px;margin-bottom:4px;">Campos disponíveis</div>';
  html += '<div class="ccs" style="font-size:10px;margin-bottom:10px;">Arraste para as zonas →</div>';
  // Container scrollável dos campos (dimensões + métricas)
  html += '<div class="pv-fields-scroll" style="flex:1;overflow-y:auto;padding-right:4px;margin-right:-4px;">';

  // Dimensões (v4.76 fix18: grid 2 colunas)
  html += '<div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:4px;">Dimensões</div>';
  html += '<div id="pv-fields" style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:14px;">';
  Object.keys(_CUBO_DIMS_INFO).forEach(function(dCod){
    const usadoEm = Object.keys(_CUBO_FATO_DIMS).filter(function(f){
      return _CUBO_FATO_DIMS[f].indexOf(dCod) >= 0;
    });
    if(!usadoEm.length) return;
    const info = _CUBO_DIMS_INFO[dCod];
    html += '<div class="pv-field" draggable="true" data-field="'+dCod+'" data-type="dim" '
         +  'style="padding:6px 10px;background:var(--surface);border:1px solid var(--border);border-radius:5px;cursor:grab;font-size:12px;display:flex;align-items:center;gap:6px;">'
         +    '<span style="font-size:14px;">'+info.icone+'</span>'
         +    '<span>'+esc(info.label)+'</span>'
         + '</div>';
  });
  html += '</div>';

  // Métricas agrupadas (v4.76 fix18: grid 2 colunas; labels de grupo ocupam linha inteira)
  html += '<div id="pv-metrics" style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">';
  ['vendas','compras','financeiro'].forEach(function(grupoFato){
    const titulos = {vendas:'Vendas', compras:'Compras', financeiro:'Financeiro'};
    html += '<div style="grid-column:1/-1;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-top:6px;">'+titulos[grupoFato]+'</div>';
    Object.keys(_CUBO_METRICAS).forEach(function(mCod){
      const m = _CUBO_METRICAS[mCod];
      if(m.fato !== grupoFato) return;
      html += '<div class="pv-field pv-metric" draggable="true" data-field="'+mCod+'" data-type="metric" data-fato="'+m.fato+'" '
           +  'style="padding:5px 9px;background:var(--surface);border:1px solid var(--border);border-radius:5px;cursor:grab;font-size:11.5px;">'
           +    '<span style="color:#0a7c4a;font-weight:700;">∑</span> '+esc(m.label)
           + '</div>';
    });
  });
  html += '</div>';
  html += '</div>'; // pv-fields-scroll
  html += '</div>'; // pv-fields-pane

  // ── Coluna direita: zonas + ações (v4.76 fix18: flex-column pra ficar mesma altura que campos) ──
  html += '<div class="pv-zones-pane cc" style="padding:12px;display:flex;flex-direction:column;">';

  // Zonas em layout 2x2 — ocupam todo espaço vertical disponível
  html += '<div class="pv-zones-grid" style="display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:10px;flex:1;">';
  const zonasLabels = {
    filters:{titulo:'🔍 Filtros',  desc:'restringe os dados'},
    rows:   {titulo:'📋 Linhas',   desc:'agrupa em linhas'},
    cols:   {titulo:'📊 Colunas',  desc:'distribui em colunas'},
    vals:   {titulo:'∑ Valores',   desc:'métricas a calcular'}
  };
  ['filters','cols','rows','vals'].forEach(function(zona){
    const info = zonasLabels[zona];
    // v4.76 fix18: cada wrap em flex-column pra zona crescer com altura disponivel
    html += '<div class="pv-zone-wrap" style="display:flex;flex-direction:column;min-height:0;">';
    html += '<div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px;">';
    html += '<span style="font-size:11px;font-weight:700;color:var(--text);">'+info.titulo+'</span>';
    html += '<span style="font-size:9.5px;color:var(--text-muted);">'+info.desc+'</span>';
    html += '</div>';
    html += '<div class="pv-zone" data-zone="'+zona+'" '
         +  'style="flex:1;min-height:50px;background:var(--surface-2);border:2px dashed var(--border);border-radius:5px;padding:5px;display:flex;flex-direction:column;gap:3px;"></div>';
    html += '</div>';
  });
  html += '</div>'; // pv-zones-grid

  // Linha de ações abaixo das zonas
  html += '<div class="pv-acoes" style="display:flex;gap:8px;margin-top:12px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--border);padding-top:10px;">';
  html += '<select id="pv-comp" style="padding:6px 8px;border:1px solid var(--border);border-radius:5px;font-size:11px;background:var(--surface);color:var(--text);min-width:200px;">'
       +    '<option value="">Sem cálculo comparativo</option>'
       +    '<option value="vert">% vertical (% da coluna)</option>'
       +    '<option value="horiz">% horizontal (cresc. vs anterior)</option>'
       + '</select>';
  html += '<button id="pv-clear" class="ebtn" style="background:var(--surface);color:var(--text);border:1px solid var(--border);padding:6px 10px;font-size:11px;">🗑 Limpar</button>';
  html += '<div style="flex:1;"></div>';
  // Salvar/carregar análise
  html += '<select id="pv-load-sel" style="padding:6px 8px;border:1px solid var(--border);border-radius:5px;font-size:11px;background:var(--surface);color:var(--text);min-width:200px;">'
       +    '<option value="">— Carregar análise —</option>'
       +  '</select>';
  html += '<button id="pv-save" class="ebtn" style="font-size:11px;padding:6px 10px;background:var(--accent);color:white;border:none;">💾 Salvar</button>';
  html += '<button id="pv-delete" class="ebtn" style="font-size:11px;padding:6px 10px;background:var(--surface);color:#dc2626;border:1px solid var(--border);" disabled title="Selecione uma análise salva">🗑</button>';
  html += '</div>';

  html += '</div>'; // pv-zones-pane
  html += '</div>'; // pv-painel

  // ─── Container do gráfico (escondido por padrão) ───
  html += '<div id="pv-chart-wrap" style="display:none;margin-bottom:14px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px;">'
       +    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">'
       +      '<label style="font-size:11px;color:var(--text-muted);">Tipo:</label>'
       +      '<select id="pv-chart-type" style="padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:var(--surface);color:var(--text);">'
       +        '<option value="bar">Colunas</option>'
       +        '<option value="line">Linhas</option>'
       +        '<option value="pie">Pizza</option>'
       +      '</select>'
       +      '<label style="font-size:11px;color:var(--text-muted);">Métrica:</label>'
       +      '<select id="pv-chart-metric" style="padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:var(--surface);color:var(--text);"></select>'
       +      '<button id="pv-chart-close" style="margin-left:auto;background:transparent;border:none;color:var(--text-muted);cursor:pointer;font-size:14px;">✕</button>'
       +    '</div>'
       +    '<div style="height:340px;"><canvas id="pv-chart-canvas"></canvas></div>'
       + '</div>';

  // ─── Área de resultado (sempre visível) ───
  html += '<div class="cc" style="padding:12px;">';
  html += '<div id="pv-status" style="font-size:11px;color:var(--text-muted);margin-bottom:8px;"></div>';
  html += '<div id="pv-result" style="overflow:auto;"></div>';
  html += '</div>';

  document.getElementById('cubo-body').innerHTML = html;

  // Aplica estado inicial nas zonas
  _pvSyncZonas();
  // Bind drag-and-drop
  _pvBindDnD();

  // ─── Ações ───
  // Toggle painel
  document.getElementById('pv-toggle-painel').addEventListener('click', function(){
    const painel = document.getElementById('pv-painel');
    const ic = document.getElementById('pv-toggle-icon');
    const tx = document.getElementById('pv-toggle-txt');
    const oculto = painel.style.display === 'none';
    painel.style.display = oculto ? 'grid' : 'none';
    ic.textContent = oculto ? '✕' : '☰';
    tx.textContent = oculto ? 'Ocultar painel' : 'Mostrar painel';
    try { localStorage.setItem('pivot_painel_oculto_v1', oculto ? '0' : '1'); } catch(e){}
  });

  // Limpar
  document.getElementById('pv-clear').addEventListener('click', function(){
    if(!confirm('Limpar toda a configuração da pivot?')) return;
    _pivotState.rows = [];
    _pivotState.cols = [];
    _pivotState.vals = [];
    _pivotState.filters = {};
    _pivotState.comp = {tipo:null, base:null};
    _pivotState._idAtual = null;
    _pivotState._nomeAtual = null;
    _pvPersistir();
    _pvSyncZonas();
    const cs = document.getElementById('pv-comp'); if(cs) cs.value = '';
    const ls = document.getElementById('pv-load-sel'); if(ls) ls.value = '';
    document.getElementById('pv-delete').disabled = true;
    _pvAtualizar();
  });

  // Comparativo
  const compSel = document.getElementById('pv-comp');
  if(compSel){
    compSel.value = _pivotState.comp.tipo || '';
    compSel.addEventListener('change', function(){
      _pivotState.comp.tipo = compSel.value || null;
      _pvPersistir();
      _pvAtualizar();
    });
  }

  // Salvar / carregar / excluir
  document.getElementById('pv-save').addEventListener('click', _pvSalvarAnaliseUI);
  document.getElementById('pv-delete').addEventListener('click', _pvExcluirAnaliseUI);
  const loadSel = document.getElementById('pv-load-sel');
  loadSel.addEventListener('change', function(){
    if(loadSel.value){ _pvCarregarAnalise(loadSel.value); }
    document.getElementById('pv-delete').disabled = !loadSel.value;
  });
  _pvAtualizarListaSalvas();

  // Gráfico
  document.getElementById('pv-chart').addEventListener('click', function(){
    const wrap = document.getElementById('pv-chart-wrap');
    if(wrap.style.display === 'none'){
      wrap.style.display = '';
      _pvRenderGrafico();
    } else {
      wrap.style.display = 'none';
    }
  });
  document.getElementById('pv-chart-close').addEventListener('click', function(){
    document.getElementById('pv-chart-wrap').style.display = 'none';
  });
  document.getElementById('pv-chart-type').addEventListener('change', _pvRenderGrafico);
  document.getElementById('pv-chart-metric').addEventListener('change', _pvRenderGrafico);

  // Export XLSX/PDF/JPG (v4.76 fix18: três formatos para o conteúdo gerado)
  document.getElementById('pv-export-xlsx').addEventListener('click', _pvExportarXLSX);
  var btnPdfPv = document.getElementById('pv-export-pdf');
  if(btnPdfPv) btnPdfPv.addEventListener('click', _pvExportarPDF);
  var btnJpgPv = document.getElementById('pv-export-jpg');
  if(btnJpgPv) btnJpgPv.addEventListener('click', _pvExportarJPG);

  // Renderiza pivot inicial
  _pvAtualizar();
}


// ── Persistência local ──
function _pvPersistir(){
  try {
    const snap = {
      rows: _pivotState.rows,
      cols: _pivotState.cols,
      vals: _pivotState.vals,
      filters: _pivotState.filters,
      comp: _pivotState.comp,
      sort: _pivotState.sort
    };
    localStorage.setItem('pivot_state_v2', JSON.stringify(snap));
  } catch(e){}
}

// ── Sincroniza visualmente as zonas com o estado ──
function _pvSyncZonas(){
  ['rows','cols','vals','filters'].forEach(function(zona){
    const el = document.querySelector('.pv-zone[data-zone="'+zona+'"]');
    if(!el) return;
    const items = zona === 'filters' ? Object.keys(_pivotState.filters) : _pivotState[zona];
    if(!items.length){
      el.innerHTML = '<div style="color:var(--text-muted);font-size:10px;font-style:italic;padding:4px;">arraste aqui</div>';
      return;
    }
    el.innerHTML = items.map(function(field){
      const isMet = _CUBO_METRICAS[field];
      const isDim = _CUBO_DIMS_INFO[field];
      const label = isMet ? isMet.label : (isDim ? isDim.label : field);
      const icone = isMet ? '∑' : (isDim ? isDim.icone : '');
      // Pra filtros, mostrar resumo dos valores selecionados
      let extra = '';
      if(zona === 'filters'){
        const fvals = _pivotState.filters[field] || [];
        extra = ' <span style="color:var(--text-muted);font-size:9px;">('+fvals.length+')</span>';
      }
      return '<div class="pv-pill" data-field="'+field+'" data-zone="'+zona+'" draggable="true" '
        +    'style="padding:4px 8px;background:var(--accent-bg,#e0e7ff);color:var(--accent-text,#1a2f5c);border-radius:4px;font-size:11px;display:flex;align-items:center;gap:5px;justify-content:space-between;cursor:grab;">'
        +      '<span><span style="font-weight:700;">'+icone+'</span> '+esc(label)+extra+'</span>'
        +      '<button class="pv-pill-x" data-field="'+field+'" data-zone="'+zona+'" style="background:transparent;border:none;color:inherit;cursor:pointer;font-size:13px;line-height:1;padding:0 2px;" title="Remover">×</button>'
        +    '</div>';
    }).join('');
  });
  // Bind dos × (remover) e click no pill (filtros)
  document.querySelectorAll('.pv-pill-x').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      const f = btn.getAttribute('data-field');
      const z = btn.getAttribute('data-zone');
      _pvRemover(z, f);
    });
  });
  // Click no pill da zona "filters" abre seletor de valores
  document.querySelectorAll('.pv-zone[data-zone="filters"] .pv-pill').forEach(function(pill){
    pill.addEventListener('click', function(){
      const f = pill.getAttribute('data-field');
      _pvAbrirFiltro(f);
    });
  });
  // Bind drag dos pills (HTML5 + touch) — só uma vez por elemento
  if(typeof _pvBindPillsDrag === 'function') _pvBindPillsDrag();
}

function _pvRemover(zona, field){
  if(zona === 'filters'){
    delete _pivotState.filters[field];
  } else {
    _pivotState[zona] = _pivotState[zona].filter(function(x){return x !== field;});
  }
  _pvPersistir();
  _pvSyncZonas();
  _pvAtualizar();
}

// ── Drag-and-drop ──
function _pvBindDnD(){
  let dragData = null;

  // Source: campos disponíveis e pills já em zonas
  function bindDragSource(el){
    // ─ Drag HTML5 (desktop / com mouse) ─
    el.addEventListener('dragstart', function(e){
      const field = el.getAttribute('data-field');
      const fromZone = el.getAttribute('data-zone');
      const type = el.getAttribute('data-type');
      dragData = {field:field, fromZone:fromZone, type:type};
      el.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', field); } catch(_){}
    });
    el.addEventListener('dragend', function(){
      el.style.opacity = '';
      dragData = null;
    });

    // ─ Touch (mobile): inicia o drag visual ─
    el.addEventListener('touchstart', function(e){
      if(e.touches.length !== 1) return;
      const t = e.touches[0];
      const field = el.getAttribute('data-field');
      const fromZone = el.getAttribute('data-zone');
      const type = el.getAttribute('data-type');
      const ghost = el.cloneNode(true);
      ghost.style.cssText = el.style.cssText
        + ';position:fixed;pointer-events:none;z-index:99999;opacity:0.85;'
        + 'box-shadow:0 4px 12px rgba(0,0,0,.25);transform:scale(1.05);';
      ghost.style.left = (t.clientX - el.offsetWidth/2) + 'px';
      ghost.style.top  = (t.clientY - el.offsetHeight/2) + 'px';
      ghost.style.width = el.offsetWidth + 'px';
      document.body.appendChild(ghost);
      el.style.opacity = '0.4';
      window.__pvTouchDrag = {field:field, fromZone:fromZone, type:type, ghost:ghost, sourceEl:el, started:false, startX:t.clientX, startY:t.clientY};
    }, {passive:true});
  }

  document.querySelectorAll('#pv-fields .pv-field, #pv-metrics .pv-field').forEach(bindDragSource);
  // Pills bindam separado (são re-criados a cada syncZonas)
  _pvBindPillsDrag();

  // ─ Listeners globais de touch ─
  // (registrados uma vez, lendo window.__pvTouchDrag)
  if(!window.__pvTouchListenersOk){
    window.__pvTouchListenersOk = true;
    document.addEventListener('touchmove', function(e){
      const td = window.__pvTouchDrag;
      if(!td) return;
      if(e.touches.length !== 1) return;
      const t = e.touches[0];
      if(!td.started){
        const dx = Math.abs(t.clientX - td.startX);
        const dy = Math.abs(t.clientY - td.startY);
        if(dx > 8 || dy > 8) td.started = true;
      }
      if(!td.started) return;
      e.preventDefault();
      td.ghost.style.left = (t.clientX - td.ghost.offsetWidth/2) + 'px';
      td.ghost.style.top  = (t.clientY - td.ghost.offsetHeight/2) + 'px';
      td.ghost.style.display = 'none';
      const elBelow = document.elementFromPoint(t.clientX, t.clientY);
      td.ghost.style.display = '';
      const zone = elBelow && elBelow.closest && elBelow.closest('.pv-zone');
      document.querySelectorAll('.pv-zone').forEach(function(z){
        z.style.background = (z === zone) ? 'var(--accent-bg, #e0e7ff)' : 'var(--surface-2)';
      });
    }, {passive:false});

    document.addEventListener('touchend', function(e){
      const td = window.__pvTouchDrag;
      if(!td) return;
      const t = (e.changedTouches && e.changedTouches[0]) || null;
      if(td.ghost && td.ghost.parentNode) td.ghost.parentNode.removeChild(td.ghost);
      if(td.sourceEl) td.sourceEl.style.opacity = '';
      document.querySelectorAll('.pv-zone').forEach(function(z){ z.style.background = 'var(--surface-2)'; });
      if(td.started && t){
        const elBelow = document.elementFromPoint(t.clientX, t.clientY);
        const zone = elBelow && elBelow.closest && elBelow.closest('.pv-zone');
        if(zone){
          const targetZona = zone.getAttribute('data-zone');
          _pvAdicionar(targetZona, {field:td.field, fromZone:td.fromZone, type:td.type});
        }
      }
      window.__pvTouchDrag = null;
    }, {passive:true});

    document.addEventListener('touchcancel', function(){
      const td = window.__pvTouchDrag;
      if(!td) return;
      if(td.ghost && td.ghost.parentNode) td.ghost.parentNode.removeChild(td.ghost);
      if(td.sourceEl) td.sourceEl.style.opacity = '';
      document.querySelectorAll('.pv-zone').forEach(function(z){ z.style.background = 'var(--surface-2)'; });
      window.__pvTouchDrag = null;
    }, {passive:true});
  }

  // Targets: zonas (HTML5 drag — desktop)
  document.querySelectorAll('.pv-zone').forEach(function(zone){
    zone.addEventListener('dragover', function(e){
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.style.background = 'var(--accent-bg, #e0e7ff)';
    });
    zone.addEventListener('dragleave', function(){
      zone.style.background = 'var(--surface-2)';
    });
    zone.addEventListener('drop', function(e){
      e.preventDefault();
      zone.style.background = 'var(--surface-2)';
      // Pode vir de pill (window.__pvPillDrag) ou de field (dragData local)
      const drag = dragData || window.__pvPillDrag;
      if(!drag) return;
      const targetZona = zone.getAttribute('data-zone');
      _pvAdicionar(targetZona, drag);
      window.__pvPillDrag = null;
    });
  });
}

// Toast visual curto pra feedback de rejeição de drop
function _pvToast(msg){
  let t = document.getElementById('pv-toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'pv-toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1f2937;color:#fff;padding:10px 18px;border-radius:6px;font-size:13px;z-index:99998;box-shadow:0 4px 12px rgba(0,0,0,.25);transition:opacity .2s;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t.__hideTimer);
  t.__hideTimer = setTimeout(function(){ t.style.opacity = '0'; }, 2500);
}

function _pvAdicionar(zona, drag){
  const field = drag.field;
  const isMetric = !!_CUBO_METRICAS[field];
  const isDim    = !!_CUBO_DIMS_INFO[field];

  // Métrica só vai pra "vals". Dimensão vai pra rows/cols/filters.
  if(isMetric && zona !== 'vals'){
    _pvToast('Métricas só podem ir em "∑ Valores"');
    return;
  }
  if(isDim && zona === 'vals'){
    _pvToast('Dimensões não podem ir em "∑ Valores"');
    return;
  }

  // Se vinha de uma zona anterior, remove de lá primeiro
  if(drag.fromZone){
    if(drag.fromZone === 'filters'){ delete _pivotState.filters[field]; }
    else _pivotState[drag.fromZone] = _pivotState[drag.fromZone].filter(function(x){return x !== field;});
  } else {
    // Veio da lista — checa se já está em alguma zona (move em vez de duplicar)
    ['rows','cols','vals'].forEach(function(z){
      _pivotState[z] = _pivotState[z].filter(function(x){return x !== field;});
    });
    if(zona !== 'filters' && _pivotState.filters[field]){ delete _pivotState.filters[field]; }
  }

  // Adiciona na zona destino
  if(zona === 'filters'){
    if(!_pivotState.filters[field]) _pivotState.filters[field] = [];
  } else {
    if(_pivotState[zona].indexOf(field) < 0) _pivotState[zona].push(field);
  }

  _pvPersistir();
  _pvSyncZonas();
  // Re-bind drag dos novos pills (HTML5 + touch)
  _pvBindPillsDrag();
  _pvAtualizar();

  // Se foi pra filters, abre dialog imediatamente
  if(zona === 'filters'){
    setTimeout(function(){ _pvAbrirFiltro(field); }, 50);
  }
}

// Bind apenas dos pills nas zonas (chamado após cada syncZonas)
function _pvBindPillsDrag(){
  document.querySelectorAll('.pv-pill').forEach(function(p){
    if(p.__pvBound) return; // evita duplicar
    p.__pvBound = true;
    // HTML5 drag
    p.addEventListener('dragstart', function(e){
      const f = p.getAttribute('data-field');
      const z = p.getAttribute('data-zone');
      window.__pvPillDrag = {field:f, fromZone:z};
      p.style.opacity = '0.4';
      try { e.dataTransfer.setData('text/plain', f); } catch(_){}
      e.dataTransfer.effectAllowed = 'move';
    });
    p.addEventListener('dragend', function(){ p.style.opacity = ''; });
    // Touch
    p.addEventListener('touchstart', function(e){
      if(e.touches.length !== 1) return;
      const t = e.touches[0];
      const field = p.getAttribute('data-field');
      const fromZone = p.getAttribute('data-zone');
      const ghost = p.cloneNode(true);
      ghost.style.cssText = p.style.cssText
        + ';position:fixed;pointer-events:none;z-index:99999;opacity:0.85;'
        + 'box-shadow:0 4px 12px rgba(0,0,0,.25);transform:scale(1.05);';
      ghost.style.left = (t.clientX - p.offsetWidth/2) + 'px';
      ghost.style.top  = (t.clientY - p.offsetHeight/2) + 'px';
      ghost.style.width = p.offsetWidth + 'px';
      document.body.appendChild(ghost);
      p.style.opacity = '0.4';
      window.__pvTouchDrag = {field:field, fromZone:fromZone, ghost:ghost, sourceEl:p, started:false, startX:t.clientX, startY:t.clientY};
    }, {passive:true});
  });
}

// ── Dialog de filtro: multi-select dos valores da dimensão ──
function _pvAbrirFiltro(field){
  const dimInfo = _CUBO_DIMS_INFO[field];
  if(!dimInfo) return;
  const items = ((_pivotState.cubo.dimensoes||{})[dimInfo.dimKey]||{}).items || [];
  const selecionados = new Set(_pivotState.filters[field] || []);

  // Modal simples
  let html = '<div id="pv-flt-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;">'
    +    '<div style="background:var(--surface);border-radius:8px;padding:18px;max-width:480px;width:90%;max-height:80vh;display:flex;flex-direction:column;">'
    +      '<div style="font-weight:700;font-size:13px;margin-bottom:4px;">'+dimInfo.icone+' Filtrar por '+esc(dimInfo.label)+'</div>'
    +      '<div style="font-size:10.5px;color:var(--text-muted);margin-bottom:10px;">'+items.length+' item'+(items.length!==1?'s':'')+' disponíve'+(items.length!==1?'is':'l')+'</div>'
    +      '<div style="display:flex;gap:6px;margin-bottom:8px;">'
    +        '<input type="text" id="pv-flt-search" placeholder="Buscar…" style="flex:1;padding:5px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px;background:var(--surface);color:var(--text);">'
    +        '<button id="pv-flt-all" class="ebtn" style="font-size:11px;padding:4px 8px;">Todos</button>'
    +        '<button id="pv-flt-none" class="ebtn" style="font-size:11px;padding:4px 8px;">Nenhum</button>'
    +      '</div>'
    +      '<div id="pv-flt-list" style="flex:1;overflow-y:auto;border:1px solid var(--border);border-radius:5px;padding:6px;background:var(--surface-2);max-height:400px;">';
  // Lista
  items.forEach(function(it){
    const cod = it.cod;
    const nome = it.nome || it.desc || String(cod);
    const checked = selecionados.has(cod) || selecionados.has(String(cod)) || selecionados.size === 0;
    html += '<label class="pv-flt-row" style="display:flex;align-items:center;gap:6px;padding:3px 4px;font-size:12px;cursor:pointer;" data-name="'+esc(String(nome).toLowerCase())+'">'
      +     '<input type="checkbox" data-cod="'+esc(String(cod))+'" '+(checked?'checked':'')+'>'
      +     '<span>'+esc(nome)+'</span>'
      +    '</label>';
  });
  html += '</div>'
    +    '<div style="display:flex;justify-content:space-between;margin-top:12px;gap:8px;">'
    +      '<button id="pv-flt-cancel" class="ebtn" style="font-size:12px;">Cancelar</button>'
    +      '<button id="pv-flt-apply" class="ebtn" style="background:var(--accent);color:white;border:none;font-size:12px;">Aplicar</button>'
    +    '</div>'
    +  '</div>'
    + '</div>';
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap.firstChild);

  const modal = document.getElementById('pv-flt-modal');
  const search = document.getElementById('pv-flt-search');
  search.addEventListener('input', function(){
    const t = search.value.toLowerCase().trim();
    document.querySelectorAll('.pv-flt-row').forEach(function(row){
      const n = row.getAttribute('data-name');
      row.style.display = (!t || n.indexOf(t) >= 0) ? '' : 'none';
    });
  });
  document.getElementById('pv-flt-all').addEventListener('click', function(){
    document.querySelectorAll('#pv-flt-list input[type=checkbox]').forEach(function(c){
      if(c.closest('.pv-flt-row').style.display !== 'none') c.checked = true;
    });
  });
  document.getElementById('pv-flt-none').addEventListener('click', function(){
    document.querySelectorAll('#pv-flt-list input[type=checkbox]').forEach(function(c){
      if(c.closest('.pv-flt-row').style.display !== 'none') c.checked = false;
    });
  });
  document.getElementById('pv-flt-cancel').addEventListener('click', function(){ modal.remove(); });
  document.getElementById('pv-flt-apply').addEventListener('click', function(){
    const sel = [];
    let total = 0;
    document.querySelectorAll('#pv-flt-list input[type=checkbox]').forEach(function(c){
      total++;
      if(c.checked){
        const cod = c.getAttribute('data-cod');
        // Tenta converter pra número se for numérico
        const n = Number(cod);
        sel.push(isNaN(n) || String(n) !== cod ? cod : n);
      }
    });
    // Se selecionou todos, considera "sem filtro" (limpa)
    if(sel.length === total) _pivotState.filters[field] = [];
    else _pivotState.filters[field] = sel;
    _pvPersistir();
    _pvSyncZonas();
    _pvAtualizar();
    modal.remove();
  });
}

// ── Núcleo: calcula a pivot ──
function _pvCalcular(){
  const st = _pivotState;
  const rows = st.rows;
  const cols = st.cols;
  const vals = st.vals;
  if(!vals.length) return null;

  const dimsEmUso = rows.concat(cols);
  // Para cada métrica, verifica se o fato dela suporta as dims em uso
  const valsValidas = vals.filter(function(m){
    const meta = _CUBO_METRICAS[m]; if(!meta) return false;
    return dimsEmUso.every(function(d){ return _CUBO_FATO_DIMS[meta.fato].indexOf(d) >= 0; });
  });
  if(!valsValidas.length){
    // Diagnostica qual dimensão está bloqueando
    const incompatPorMetrica = vals.map(function(m){
      const meta = _CUBO_METRICAS[m];
      if(!meta) return null;
      const incompat = dimsEmUso.filter(function(d){
        return _CUBO_FATO_DIMS[meta.fato].indexOf(d) < 0;
      });
      return {metrica: meta.label, fato: meta.fato, dimsIncompat: incompat};
    }).filter(Boolean);
    // Caso 1: todas as métricas são desconhecidas (nenhuma em _CUBO_METRICAS)
    // Acontece quando o usuário carrega análise salva com schema antigo
    if(!incompatPorMetrica.length){
      return {erro: 'As métricas dessa análise não existem nesta versão do sistema. Remova-as e adicione novas métricas válidas.'};
    }
    // Caso 2: métricas existem mas são incompatíveis com as dimensões
    const todasDimsRuins = new Set();
    incompatPorMetrica.forEach(function(x){
      x.dimsIncompat.forEach(function(d){ todasDimsRuins.add(d); });
    });
    const labels = Array.from(todasDimsRuins).map(function(d){
      return (_CUBO_DIMS_INFO[d] && _CUBO_DIMS_INFO[d].label) || d;
    });
    if(!labels.length){
      return {erro: 'As métricas selecionadas não puderam ser calculadas. Tente outra combinação.'};
    }
    return {erro: 'Nenhuma métrica é compatível com as dimensões selecionadas. Remova ' + labels.join(' ou ') + ' das linhas/colunas, ou troque por outra métrica.'};
  }

  // Coleta linhas brutas de cada fato necessário, aplicando filtros + filtros embutidos
  const fatosNecessarios = {};
  valsValidas.forEach(function(m){ fatosNecessarios[_CUBO_METRICAS[m].fato] = true; });
  const fatos = st.cubo.fatos || {};

  // Map: rowKey → colKey → métrica → valor agregado
  // rowKey/colKey são tuplas serializadas
  const matriz = {};
  // Pra calcular margem (lucro/vlr_liq) precisamos guardar lucro e v_liq separados
  // Estratégia: guardar agregados base como nomes internos e calcular pós

  // Helper: resolve nome real do campo no fato a partir da dim lógica
  function _campoDeDim(d){ return _CUBO_DIM_TO_CAMPO[d] || d; }

  Object.keys(fatosNecessarios).forEach(function(fato){
    const f = fatos[fato]; if(!f || !f.linhas) return;
    const campos = f.campos;
    const colIdx = {};
    campos.forEach(function(c, i){ colIdx[c] = i; });

    // Filtro pré-loop
    const fltAplicar = [];
    Object.keys(st.filters).forEach(function(d){
      const vals = st.filters[d];
      if(!vals || !vals.length) return;
      const campoReal = _campoDeDim(d);
      if(colIdx[campoReal] == null) return; // dim n/a neste fato → linhas todas passam
      const setV = new Set(vals.map(function(v){return String(v);}));
      fltAplicar.push({ci:colIdx[campoReal], setV:setV});
    });

    f.linhas.forEach(function(lin){
      // Filtro
      for(let i = 0; i < fltAplicar.length; i++){
        if(!fltAplicar[i].setV.has(String(lin[fltAplicar[i].ci]))) return;
      }
      // Construir rowKey/colKey
      const rk = rows.map(function(d){ const ci = colIdx[_campoDeDim(d)]; return ci != null ? lin[ci] : '__na__'; }).join('|||');
      const ck = cols.map(function(d){ const ci = colIdx[_campoDeDim(d)]; return ci != null ? lin[ci] : '__na__'; }).join('|||');
      if(!matriz[rk]) matriz[rk] = {};
      if(!matriz[rk][ck]) matriz[rk][ck] = {};
      const cell = matriz[rk][ck];
      // Agrega cada métrica
      valsValidas.forEach(function(mCod){
        const m = _CUBO_METRICAS[mCod];
        if(m.fato !== fato) return;
        if(m.calc){
          // Métrica calculada: precisamos guardar campos base
          if(m.calc === 'marg'){
            cell.__v_luc = (cell.__v_luc||0) + (lin[colIdx.v_luc]||0);
            cell.__v_liq = (cell.__v_liq||0) + (lin[colIdx.v_liq]||0);
          } else if(m.calc === 'tkt'){
            cell.__v_liq = (cell.__v_liq||0) + (lin[colIdx.v_liq]||0);
            cell.__v_nfs = (cell.__v_nfs||0) + (lin[colIdx.v_nfs]||0);
          }
        } else {
          cell[mCod] = (cell[mCod]||0) + (lin[colIdx[m.campo]]||0);
        }
      });
    });
  });

  // Pós-cálculo: métricas calculadas
  Object.keys(matriz).forEach(function(rk){
    Object.keys(matriz[rk]).forEach(function(ck){
      const cell = matriz[rk][ck];
      valsValidas.forEach(function(mCod){
        const m = _CUBO_METRICAS[mCod];
        if(m.calc === 'marg'){
          cell[mCod] = (cell.__v_liq>0) ? (cell.__v_luc/cell.__v_liq*100) : 0;
        } else if(m.calc === 'tkt'){
          cell[mCod] = (cell.__v_nfs>0) ? (cell.__v_liq/cell.__v_nfs) : 0;
        }
      });
    });
  });

  // Coleta rowKeys e colKeys distintos
  // Sort natural: tenta numérico primeiro, depois lexicográfico
  function _sortChaves(arr){
    return arr.slice().sort(function(a, b){
      const partsA = a.split('|||');
      const partsB = b.split('|||');
      for(let i = 0; i < partsA.length; i++){
        const va = partsA[i], vb = partsB[i];
        // Tenta numérico
        const na = Number(va), nb = Number(vb);
        if(!isNaN(na) && !isNaN(nb) && va !== '' && vb !== ''){
          if(na !== nb) return na - nb;
        } else {
          const cmp = String(va).localeCompare(String(vb), 'pt-BR');
          if(cmp !== 0) return cmp;
        }
      }
      return 0;
    });
  }
  const rowKeys = _sortChaves(Object.keys(matriz));
  const colKeysSet = new Set();
  rowKeys.forEach(function(rk){
    Object.keys(matriz[rk]).forEach(function(ck){ colKeysSet.add(ck); });
  });
  const colKeys = _sortChaves(Array.from(colKeysSet));

  return {
    matriz: matriz,
    rowKeys: rowKeys,
    colKeys: colKeys,
    rows: rows,
    cols: cols,
    vals: valsValidas,
    valsIgnoradas: vals.filter(function(v){return valsValidas.indexOf(v) < 0;})
  };
}

// ── Renderiza a tabela ──
// Wrapper público: debounced + indicador "calculando"
let _pvDebounceTimer = null;
let _pvUltimoResultado = null; // cache do último _pvCalcular() pra evitar recalculo em export/gráfico
function _pvAtualizar(){
  if(_pvDebounceTimer) clearTimeout(_pvDebounceTimer);
  // Mostra indicador imediatamente se cálculo for demorar
  const status = document.getElementById('pv-status');
  if(status){
    status.innerHTML = '<span style="color:var(--text-muted);">⏳ calculando…</span>';
  }
  _pvDebounceTimer = setTimeout(function(){
    _pvAtualizarReal();
    _pvDebounceTimer = null;
  }, 80);
}

function _pvAtualizarReal(){
  const result = _pvCalcular();
  // Cacheia só resultado válido (sem erro) pra uso em export/gráfico
  if(result && !result.erro) _pvUltimoResultado = result;
  else _pvUltimoResultado = null;
  const cont = document.getElementById('pv-result');
  const status = document.getElementById('pv-status');
  if(!cont) return;

  // Atualiza disponibilidade visual das métricas baseado nas dims em uso
  _pvAtualizarDisponibilidade();

  if(!result){
    cont.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:60px 20px;font-size:13px;">'
      + '<div style="font-size:42px;margin-bottom:14px;opacity:0.4;">📊</div>'
      + '<div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;">Comece configurando sua análise</div>'
      + '<div style="margin-bottom:4px;">Arraste pelo menos uma <strong>métrica</strong> em <strong>∑ Valores</strong></div>'
      + '<div>e uma <strong>dimensão</strong> em <strong>📋 Linhas</strong> ou <strong>📊 Colunas</strong>.</div>'
      + '</div>';
    status.textContent = '';
    return;
  }
  if(result.erro){
    cont.innerHTML = '<div style="background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;border-radius:6px;padding:12px;font-size:12px;">'+esc(result.erro)+'</div>';
    status.textContent = '';
    return;
  }

  // Status
  let st = fI(result.rowKeys.length)+' linhas × '+fI(result.colKeys.length||1)+' colunas · '+result.vals.length+' métricas';
  if(result.valsIgnoradas.length){
    st += ' · ⚠ '+result.valsIgnoradas.length+' métrica(s) ignorada(s) por incompatibilidade';
  }
  status.textContent = st;

  // Render da tabela
  cont.innerHTML = _pvRenderTabela(result);
  // Bind sort no header
  cont.querySelectorAll('th[data-sort]').forEach(function(th){
    th.addEventListener('click', function(){
      const k = th.getAttribute('data-sort');
      if(_pivotState.sort.col === k){
        _pivotState.sort.dir = _pivotState.sort.dir === 'asc' ? 'desc' : 'asc';
      } else {
        _pivotState.sort.col = k;
        _pivotState.sort.dir = 'desc';
      }
      _pvPersistir();
      _pvAtualizar();
    });
  });

  // Se gráfico está aberto, atualiza também
  const cw = document.getElementById('pv-chart-wrap');
  if(cw && cw.style.display !== 'none'){
    _pvRenderGrafico();
  }
}

// ── Atualiza estado visual (riscado/desabilitado) das métricas no painel ──
function _pvAtualizarDisponibilidade(){
  const dimsEmUso = _pivotState.rows.concat(_pivotState.cols);
  document.querySelectorAll('#pv-metrics .pv-metric').forEach(function(el){
    const fato = el.getAttribute('data-fato');
    const compat = dimsEmUso.every(function(d){
      return _CUBO_FATO_DIMS[fato].indexOf(d) >= 0;
    });
    if(compat){
      el.style.opacity = '1';
      el.style.textDecoration = 'none';
      el.title = '';
    } else {
      el.style.opacity = '0.4';
      el.style.textDecoration = 'line-through';
      const incompat = dimsEmUso.filter(function(d){
        return _CUBO_FATO_DIMS[fato].indexOf(d) < 0;
      }).map(function(d){
        return _CUBO_DIMS_INFO[d] ? _CUBO_DIMS_INFO[d].label : d;
      });
      el.title = 'Incompatível com: '+incompat.join(', ');
    }
  });
}

// ── Helpers de label ──
// Cache: dCod → Map(cod → nome). Construído sob demanda no primeiro lookup
// e invalidado quando o cubo muda (em _renderCuboUI).
let _pvDimCache = {};

function _pvLabelDim(dCod, valor){
  if(valor === '__na__' || valor == null || valor === '') return '—';
  const info = _CUBO_DIMS_INFO[dCod];
  if(!info) return String(valor);
  if(dCod === 'ym'){ return _ymToLabel(String(valor)); }
  // Cache por dimensão
  let cache = _pvDimCache[dCod];
  if(!cache){
    cache = new Map();
    const dim = ((_pivotState.cubo.dimensoes||{})[info.dimKey]||{}).items || [];
    dim.forEach(function(it){
      cache.set(String(it.cod), it.nome || it.desc || String(it.cod));
    });
    _pvDimCache[dCod] = cache;
  }
  const v = cache.get(String(valor));
  return v != null ? v : String(valor);
}

function _pvFmtMetrica(mCod, valor){
  if(valor == null || isNaN(valor)) return '—';
  const m = _CUBO_METRICAS[mCod]; if(!m) return String(valor);
  if(m.fmt === 'k') return fK(valor);
  if(m.fmt === 'p') return fP(valor);
  if(m.fmt === 'i') return fI(valor);
  return String(valor);
}

// ── Renderiza HTML da tabela ──
function _pvRenderTabela(r){
  const rows = r.rows;
  const cols = r.cols;
  const vals = r.vals;
  const matriz = r.matriz;
  let rowKeys = r.rowKeys;
  const colKeys = r.colKeys.length ? r.colKeys : [''];

  // Cálculo comparativo: % vertical (% da coluna) ou % horizontal (crescimento vs anterior)
  // Aplica em cima dos valores
  const compTipo = _pivotState.comp.tipo;

  // Totais por coluna pra % vertical
  const totalCol = {}; // ck → mCod → soma
  if(compTipo === 'vert'){
    colKeys.forEach(function(ck){ totalCol[ck] = {}; });
    rowKeys.forEach(function(rk){
      colKeys.forEach(function(ck){
        const cell = (matriz[rk]||{})[ck] || {};
        vals.forEach(function(mCod){
          const m = _CUBO_METRICAS[mCod];
          // Pct só faz sentido pra valores aditivos (não pra % e médias)
          if(m.fmt === 'p' || m.calc) return;
          totalCol[ck][mCod] = (totalCol[ck][mCod]||0) + (cell[mCod]||0);
        });
      });
    });
  }

  // Sort: aplicar à ordem das linhas se houver col selecionada
  if(_pivotState.sort.col){
    const sortKey = _pivotState.sort.col; // formato: "rowLabel" | "ck|||mCod"
    const dir = _pivotState.sort.dir === 'asc' ? 1 : -1;
    if(sortKey === '__rowLabel__'){
      rowKeys = rowKeys.slice().sort(function(a,b){
        return a.localeCompare(b, 'pt-BR') * dir;
      });
    } else {
      const parts = sortKey.split('|||');
      const sortMet = parts.pop(); // último é a métrica
      const sortCk = parts.join('|||');
      rowKeys = rowKeys.slice().sort(function(a,b){
        const va = ((matriz[a]||{})[sortCk]||{})[sortMet] || 0;
        const vb = ((matriz[b]||{})[sortCk]||{})[sortMet] || 0;
        return (va - vb) * dir;
      });
    }
  }

  // Limita pra não travar UI em tabelas gigantes
  const TOP_LIMITE = 500;
  const truncado = rowKeys.length > TOP_LIMITE;
  if(truncado) rowKeys = rowKeys.slice(0, TOP_LIMITE);

  // ─── Header ───
  let html = '<table class="t" style="font-size:11px;">';
  html += '<thead>';
  // Se há colunas, faz header de 2 níveis: 1ª linha cols, 2ª métricas
  if(cols.length > 0){
    html += '<tr>';
    rows.forEach(function(d){
      html += '<th class="L" rowspan="2" data-sort="__rowLabel__" style="cursor:pointer;background:var(--surface-2);position:sticky;left:0;z-index:2;">'+esc(_CUBO_DIMS_INFO[d]?_CUBO_DIMS_INFO[d].label:d)+'</th>';
    });
    colKeys.forEach(function(ck){
      const colVals = ck.split('|||');
      const colLabel = cols.map(function(d, i){
        return _pvLabelDim(d, colVals[i]);
      }).join(' / ');
      html += '<th colspan="'+vals.length+'" style="text-align:center;background:var(--accent-bg,#e0e7ff);color:var(--accent-text,#1a2f5c);font-weight:700;">'+esc(colLabel)+'</th>';
    });
    if(vals.length === 1){
      // Total geral por linha — só faz sentido com 1 métrica
      html += '<th rowspan="2" style="background:var(--surface-3,#cbd5e1);font-weight:700;">Total</th>';
    }
    html += '</tr>';
    html += '<tr>';
    colKeys.forEach(function(ck){
      vals.forEach(function(mCod){
        html += '<th data-sort="'+esc(ck)+'|||'+esc(mCod)+'" style="cursor:pointer;background:var(--surface-2);font-size:10px;">'+esc(_CUBO_METRICAS[mCod].label)+'</th>';
      });
    });
    html += '</tr>';
  } else {
    // Sem cols: header simples (linhas + métricas)
    html += '<tr>';
    rows.forEach(function(d){
      html += '<th class="L" data-sort="__rowLabel__" style="cursor:pointer;background:var(--surface-2);position:sticky;left:0;z-index:2;">'+esc(_CUBO_DIMS_INFO[d]?_CUBO_DIMS_INFO[d].label:d)+'</th>';
    });
    vals.forEach(function(mCod){
      html += '<th data-sort="|||'+esc(mCod)+'" style="cursor:pointer;background:var(--surface-2);">'+esc(_CUBO_METRICAS[mCod].label)+'</th>';
    });
    html += '</tr>';
  }
  html += '</thead>';

  // ─── Body ───
  html += '<tbody>';
  // Total geral (linhas com __na__ acumulam tudo se cols vazia)
  rowKeys.forEach(function(rk){
    const rVals = rk.split('|||');
    html += '<tr>';
    rows.forEach(function(d, i){
      html += '<td class="L" style="background:var(--surface);position:sticky;left:0;font-weight:600;">'+esc(_pvLabelDim(d, rVals[i]))+'</td>';
    });
    let totalRow = 0; // soma da linha pra coluna Total quando 1 métrica
    colKeys.forEach(function(ck, ckIdx){
      vals.forEach(function(mCod){
        const cell = (matriz[rk]||{})[ck] || {};
        let v = cell[mCod];
        let txt;
        // Análise vertical
        if(compTipo === 'vert' && totalCol[ck] && totalCol[ck][mCod]){
          const p = (v||0) / totalCol[ck][mCod] * 100;
          txt = fP(p) + ' <span style="color:var(--text-muted);font-size:9px;">('+_pvFmtMetrica(mCod, v)+')</span>';
        }
        // Análise horizontal: cresc vs col anterior
        else if(compTipo === 'horiz' && ckIdx > 0){
          const ckPrev = colKeys[ckIdx - 1];
          const cellPrev = (matriz[rk]||{})[ckPrev] || {};
          const vPrev = cellPrev[mCod];
          if(vPrev && vPrev !== 0){
            const cresc = ((v||0) / vPrev - 1) * 100;
            const corr = cresc >= 0 ? 'val-pos' : 'val-neg';
            const sign = cresc >= 0 ? '+' : '';
            txt = '<span class="'+corr+'">'+sign+fP(cresc)+'</span> <span style="color:var(--text-muted);font-size:9px;">('+_pvFmtMetrica(mCod, v)+')</span>';
          } else {
            txt = _pvFmtMetrica(mCod, v);
          }
        }
        else {
          txt = _pvFmtMetrica(mCod, v);
        }
        html += '<td>'+txt+'</td>';
        if(vals.length === 1){ totalRow += (v||0); }
      });
    });
    if(cols.length > 0 && vals.length === 1){
      html += '<td style="background:var(--surface-2);font-weight:700;">'+_pvFmtMetrica(vals[0], totalRow)+'</td>';
    }
    html += '</tr>';
  });
  html += '</tbody></table>';

  if(truncado){
    html += '<div style="margin-top:8px;font-size:11px;color:var(--text-muted);font-style:italic;">⚠ Exibindo apenas as primeiras '+TOP_LIMITE+' linhas. Use filtros para refinar.</div>';
  }

  return html;
}

// ────────────────────────────────────────────────────────────────────
// SALVAR / CARREGAR / EXCLUIR / COMPARTILHAR análises (Firestore)
// Collection: analises_pivot/{id}
// Schema: { nome, owner_uid, owner_email, escopo: 'privado'|'time', criado_em, atualizado_em, state: {rows, cols, vals, filters, comp} }
// ────────────────────────────────────────────────────────────────────

let _pvAnalisesCache = []; // [{id, nome, owner_uid, escopo, ...}]

async function _pvCarregarListaAnalises(){
  if(typeof window.fbDb === 'undefined' || !window.fbDb){
    return [];
  }
  try {
    const sess = (typeof _getSessao === 'function') ? _getSessao() : null;
    const uid = sess && sess.uid;
    // Pega todas (regra Firestore filtra escopo)
    const snap = await window.fbDb.collection('analises_pivot').get();
    const arr = [];
    snap.forEach(function(doc){
      const d = doc.data();
      arr.push({
        id: doc.id,
        nome: d.nome || '(sem nome)',
        owner_uid: d.owner_uid,
        owner_email: d.owner_email,
        escopo: d.escopo || 'privado',
        atualizado_em: d.atualizado_em,
        state: d.state || {},
        ehMeu: uid && d.owner_uid === uid
      });
    });
    arr.sort(function(a,b){ return (b.atualizado_em||'').localeCompare(a.atualizado_em||''); });
    _pvAnalisesCache = arr;
    return arr;
  } catch(e){
    console.warn('[pivot] erro ao listar análises salvas:', e.message);
    return [];
  }
}

async function _pvAtualizarListaSalvas(){
  const sel = document.getElementById('pv-load-sel');
  if(!sel) return;
  // Mostra estado de loading enquanto Firestore responde
  sel.innerHTML = '<option value="">⏳ Carregando análises salvas…</option>';
  sel.disabled = true;
  const arr = await _pvCarregarListaAnalises();
  let html = '<option value="">— Carregar análise salva —</option>';
  // Agrupa: minhas + do time
  const minhas = arr.filter(function(a){return a.ehMeu;});
  const time = arr.filter(function(a){return !a.ehMeu && a.escopo === 'time';});
  if(!minhas.length && !time.length){
    html = '<option value="">— Nenhuma análise salva —</option>';
  } else {
    if(minhas.length){
      html += '<optgroup label="Minhas análises">';
      minhas.forEach(function(a){
        html += '<option value="'+esc(a.id)+'">'+esc(a.nome)+(a.escopo==='time'?' 🌐':'')+'</option>';
      });
      html += '</optgroup>';
    }
    if(time.length){
      html += '<optgroup label="Compartilhadas pelo time">';
      time.forEach(function(a){
        html += '<option value="'+esc(a.id)+'">'+esc(a.nome)+' · '+esc(a.owner_email||'?')+'</option>';
      });
      html += '</optgroup>';
    }
  }
  sel.innerHTML = html;
  sel.disabled = false;
}

async function _pvSalvarAnaliseUI(){
  if(typeof window.fbDb === 'undefined' || !window.fbDb){
    alert('Salvamento disponível apenas com Firebase ativo.');
    return;
  }
  const sess = (typeof _getSessao === 'function') ? _getSessao() : null;
  if(!sess || !sess.uid){
    alert('Você precisa estar logado para salvar análises.');
    return;
  }
  if(!_pivotState.vals.length){
    alert('Configure pelo menos uma métrica antes de salvar.');
    return;
  }
  const nome = prompt('Nome da análise:', _pivotState._nomeAtual || '');
  if(!nome || !nome.trim()) return;
  const escopo = confirm('Compartilhar com o time? (OK = sim, todos podem ver / Cancelar = só você)') ? 'time' : 'privado';

  // Refresh token pra evitar permission-denied
  try {
    if(window.fbAuth && window.fbAuth.currentUser){
      await window.fbAuth.currentUser.getIdToken(true);
    }
  } catch(e){}

  const doc = {
    nome: nome.trim(),
    owner_uid: sess.uid,
    owner_email: sess.email || '',
    escopo: escopo,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString(),
    state: {
      rows: _pivotState.rows,
      cols: _pivotState.cols,
      vals: _pivotState.vals,
      filters: _pivotState.filters,
      comp: _pivotState.comp,
      sort: _pivotState.sort
    }
  };
  try {
    const ref = await window.fbDb.collection('analises_pivot').add(doc);
    _pivotState._idAtual = ref.id;
    _pivotState._nomeAtual = nome.trim();
    if(typeof _auditLog === 'function') _auditLog('analise_salvar', {id:ref.id, nome:nome, escopo:escopo});
    await _pvAtualizarListaSalvas();
    document.getElementById('pv-load-sel').value = ref.id;
    document.getElementById('pv-delete').disabled = false;
    alert('Análise "'+nome+'" salva.');
  } catch(e){
    console.error('[pivot] erro ao salvar:', e);
    alert('Erro ao salvar: '+(e.message||'desconhecido'));
  }
}

async function _pvCarregarAnalise(id){
  const a = _pvAnalisesCache.find(function(x){return x.id === id;});
  if(!a) return;
  if(!a.state) return;
  _pivotState.rows = a.state.rows || [];
  _pivotState.cols = a.state.cols || [];
  _pivotState.vals = a.state.vals || [];
  _pivotState.filters = a.state.filters || {};
  _pivotState.comp = a.state.comp || {tipo:null, base:null};
  _pivotState.sort = a.state.sort || {col:null, dir:'asc'};
  _pivotState._idAtual = id;
  _pivotState._nomeAtual = a.nome;
  // Atualiza select de comp
  const compSel = document.getElementById('pv-comp');
  if(compSel) compSel.value = _pivotState.comp.tipo || '';
  _pvPersistir();
  _pvSyncZonas();
  _pvAtualizar();
}

async function _pvExcluirAnaliseUI(){
  const sel = document.getElementById('pv-load-sel');
  const id = sel.value;
  if(!id) return;
  const a = _pvAnalisesCache.find(function(x){return x.id === id;});
  if(!a) return;
  if(!a.ehMeu){
    alert('Você só pode excluir análises que você criou.');
    return;
  }
  if(!confirm('Excluir a análise "'+a.nome+'"? Essa ação não pode ser desfeita.')) return;
  try {
    if(window.fbAuth && window.fbAuth.currentUser){
      await window.fbAuth.currentUser.getIdToken(true);
    }
  } catch(e){}
  try {
    await window.fbDb.collection('analises_pivot').doc(id).delete();
    if(typeof _auditLog === 'function') _auditLog('analise_excluir', {id:id, nome:a.nome});
    if(_pivotState._idAtual === id){
      _pivotState._idAtual = null;
      _pivotState._nomeAtual = null;
    }
    await _pvAtualizarListaSalvas();
    document.getElementById('pv-delete').disabled = true;
    alert('Análise excluída.');
  } catch(e){
    console.error('[pivot] erro ao excluir:', e);
    alert('Erro ao excluir: '+(e.message||'desconhecido'));
  }
}

// ────────────────────────────────────────────────────────────────────
// GRÁFICO derivado da pivot
// ────────────────────────────────────────────────────────────────────
let _pvChart = null;

function _pvRenderGrafico(){
  const r = _pvUltimoResultado || _pvCalcular();
  const wrap = document.getElementById('pv-chart-wrap');
  if(!wrap || wrap.style.display === 'none') return;
  if(!r || r.erro){
    if(_pvChart){ _pvChart.destroy(); _pvChart = null; }
    return;
  }
  // Popular select de métricas com as válidas
  const mSel = document.getElementById('pv-chart-metric');
  if(mSel){
    const cur = mSel.value;
    mSel.innerHTML = r.vals.map(function(m){
      return '<option value="'+esc(m)+'">'+esc(_CUBO_METRICAS[m].label)+'</option>';
    }).join('');
    if(cur && r.vals.indexOf(cur) >= 0) mSel.value = cur;
  }
  const tipo = (document.getElementById('pv-chart-type')||{}).value || 'bar';
  const mCod = mSel.value || r.vals[0];
  if(!mCod) return;

  const canvas = document.getElementById('pv-chart-canvas');
  if(!canvas) return;

  // Constrói datasets a partir da matriz
  // Se há colunas: cada coluna é um dataset, labels são rowKeys
  // Se não há: 1 dataset, labels são rowKeys
  const rowLabels = r.rowKeys.map(function(rk){
    const parts = rk.split('|||');
    return r.rows.map(function(d, i){return _pvLabelDim(d, parts[i]);}).join(' / ');
  });
  const PAL = ['#2E476F','#F58634','#109854','#7c3aed','#DC7529','#0891B2','#b45309','#94a3b8','#1E3558','#16a34a'];

  if(_pvChart){ _pvChart.destroy(); _pvChart = null; }

  let cfg;
  if(tipo === 'pie'){
    // Pizza: só faz sentido com 1 série; usa total da linha
    // Pra métricas calculadas (margem%, ticket médio), não é correto somar entre colunas
    // — usa só a primeira coluna nesses casos pra não distorcer
    const mMeta = _CUBO_METRICAS[mCod];
    const ehCalc = mMeta && mMeta.calc;
    const valores = r.rowKeys.map(function(rk){
      const colKeys = r.colKeys.length ? r.colKeys : [''];
      if(ehCalc){
        // Usa só a primeira coluna (representativo, não distorce)
        const cell = (r.matriz[rk]||{})[colKeys[0]] || {};
        return cell[mCod] || 0;
      }
      // Métricas aditivas: soma todas as colunas
      let total = 0;
      colKeys.forEach(function(ck){
        const cell = (r.matriz[rk]||{})[ck] || {};
        total += (cell[mCod]||0);
      });
      return total;
    });
    // Top 10 + "Outros" — filtra valores não-positivos (pizza não representa negativo)
    const idxs = valores
      .map(function(v,i){return {v:v,i:i};})
      .filter(function(x){return x.v > 0;})
      .sort(function(a,b){return b.v-a.v;});
    if(idxs.length === 0){
      // Nenhum valor positivo — mostra mensagem em vez de gráfico vazio
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Sem valores positivos para plotar em pizza', canvas.width/2, canvas.height/2);
      return;
    }
    const topN = idxs.slice(0,10);
    const outros = idxs.slice(10).reduce(function(s,x){return s+x.v;},0);
    const finalLabels = topN.map(function(x){return rowLabels[x.i];});
    const finalVals = topN.map(function(x){return x.v;});
    if(outros > 0){ finalLabels.push('Outros'); finalVals.push(outros); }
    cfg = {
      type:'doughnut',
      data:{labels:finalLabels, datasets:[{data:finalVals, backgroundColor:PAL, borderWidth:2, borderColor:'#fff'}]},
      options:{responsive:true, maintainAspectRatio:false,
        plugins:{legend:{position:'right', labels:{padding:6, font:{size:10}}},
                 tooltip:{callbacks:{label:function(ctx){return ctx.label+': '+_pvFmtMetrica(mCod, ctx.raw);}}}}}
    };
  } else {
    // Linhas / Colunas
    const colKeys = r.colKeys.length ? r.colKeys : [''];
    const datasets = colKeys.map(function(ck, idx){
      const colVals = ck.split('|||');
      const colLabel = ck === '' ? _CUBO_METRICAS[mCod].label : r.cols.map(function(d, i){
        return _pvLabelDim(d, colVals[i]);
      }).join(' / ');
      const data = r.rowKeys.map(function(rk){
        const cell = (r.matriz[rk]||{})[ck] || {};
        return cell[mCod] || 0;
      });
      const cor = PAL[idx % PAL.length];
      return {
        label: colLabel,
        data: data,
        backgroundColor: tipo === 'bar' ? cor+'CC' : cor+'33',
        borderColor: cor,
        borderWidth: tipo === 'line' ? 2 : 1,
        borderRadius: tipo === 'bar' ? 3 : 0,
        tension: tipo === 'line' ? 0.3 : 0,
        pointRadius: tipo === 'line' ? 3 : 0,
        fill: tipo === 'line'
      };
    });
    cfg = {
      type: tipo,
      data: {labels: rowLabels, datasets: datasets},
      options:{responsive:true, maintainAspectRatio:false,
        plugins:{legend:{position:'bottom', labels:{padding:8, usePointStyle:true, boxWidth:8, font:{size:10}}},
                 tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+_pvFmtMetrica(mCod, ctx.raw);}}}},
        scales:{
          y:{beginAtZero:true, ticks:{callback:function(v){return _CUBO_METRICAS[mCod].fmt==='p'?fP(v):fAbbr(v);}}},
          x:{grid:{display:false}, ticks:{maxRotation:60, minRotation:rowLabels.length>8?45:0, font:{size:9}}}
        }}
    };
  }
  _pvChart = new Chart(canvas, cfg);
}

// ────────────────────────────────────────────────────────────────────
// EXPORTAR pivot pra Excel (XLSX)
// ────────────────────────────────────────────────────────────────────
function _pvExportarXLSX(){
  const r = _pvUltimoResultado || _pvCalcular();
  if(!r || r.erro){
    alert('Configure a pivot antes de exportar.');
    return;
  }
  if(typeof XLSX === 'undefined'){
    alert('Biblioteca de exportação não disponível. Recarregue a página.');
    return;
  }
  // Constrói matriz de células
  const aoa = []; // array de arrays
  const rows = r.rows;
  const cols = r.cols;
  const vals = r.vals;
  const colKeys = r.colKeys.length ? r.colKeys : [''];

  // Header 1: cols span métricas
  if(cols.length){
    const h1 = rows.map(function(d){return _CUBO_DIMS_INFO[d]?_CUBO_DIMS_INFO[d].label:d;});
    colKeys.forEach(function(ck){
      const colVals = ck.split('|||');
      const colLabel = cols.map(function(d, i){return _pvLabelDim(d, colVals[i]);}).join(' / ');
      h1.push(colLabel);
      // Ocupa as outras células do colspan com vazio
      for(let i = 1; i < vals.length; i++) h1.push('');
    });
    aoa.push(h1);
    // Header 2: nome de cada métrica
    const h2 = rows.map(function(){return '';});
    colKeys.forEach(function(){
      vals.forEach(function(m){ h2.push(_CUBO_METRICAS[m].label); });
    });
    aoa.push(h2);
  } else {
    const h = rows.map(function(d){return _CUBO_DIMS_INFO[d]?_CUBO_DIMS_INFO[d].label:d;});
    vals.forEach(function(m){ h.push(_CUBO_METRICAS[m].label); });
    aoa.push(h);
  }

  // Body
  r.rowKeys.forEach(function(rk){
    const parts = rk.split('|||');
    const row = rows.map(function(d, i){return _pvLabelDim(d, parts[i]);});
    colKeys.forEach(function(ck){
      vals.forEach(function(m){
        const cell = (r.matriz[rk]||{})[ck] || {};
        const v = cell[m];
        row.push(v == null ? '' : Number(v));
      });
    });
    aoa.push(row);
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pivot');
  const fname = 'analise_pivot_' + new Date().toISOString().substring(0,10) + '.xlsx';
  XLSX.writeFile(wb, fname);
}



function _dimLabel(d){
  return (_CUBO_DIMS_INFO[d] && _CUBO_DIMS_INFO[d].label) || d;
}
function _metricaLabel(m){
  return (_CUBO_METRICAS[m] && _CUBO_METRICAS[m].label) || m;
}

// ────────────────────────────────────────────────────────────────────
// v4.76 fix18: EXPORTAR pivot pra PDF e JPG — captura só o conteúdo gerado
// (tabela #pv-result + gráfico se visível). Usa html2canvas + jsPDF.
// ────────────────────────────────────────────────────────────────────
function _pvCapturaAlvo(){
  // Captura: gráfico (se visível) + tabela resultado. Cria wrapper temporário
  // pra ficar tudo em ordem visual no PDF/JPG.
  var chartWrap = document.getElementById('pv-chart-wrap');
  var resultEl  = document.getElementById('pv-result');
  if(!resultEl || !resultEl.children.length){
    if(typeof _toast === 'function') _toast('Nada para exportar — gere uma análise antes.', 'aviso');
    else alert('Nada para exportar. Gere uma análise antes.');
    return null;
  }
  var wrap = document.createElement('div');
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  wrap.style.cssText = 'position:fixed;left:-99999px;top:0;padding:18px;background:'+(isDark?'#0f1620':'#ffffff')+';color:'+(isDark?'#e6edf3':'#1a2031')+';width:'+Math.max(1100, resultEl.scrollWidth+40)+'px;font-family:Inter,Arial,sans-serif;';
  // Título
  var h = document.createElement('div');
  h.style.cssText = 'font-family:Archivo,Arial,sans-serif;font-weight:800;font-size:18px;margin-bottom:4px;color:'+(isDark?'#fff':'#2E476F')+';';
  h.textContent = 'Análise Dinâmica · Comercial GPC';
  wrap.appendChild(h);
  var sub = document.createElement('div');
  sub.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:10px;color:#888;margin-bottom:14px;text-transform:uppercase;letter-spacing:.1em;';
  sub.textContent = 'Gerado em ' + fDtH(new Date());
  wrap.appendChild(sub);
  // Gráfico (clone se visível)
  if(chartWrap && chartWrap.style.display !== 'none'){
    var clone = chartWrap.cloneNode(true);
    clone.style.display = 'block';
    clone.style.marginBottom = '14px';
    wrap.appendChild(clone);
  }
  // Tabela (clone)
  var resClone = resultEl.cloneNode(true);
  resClone.style.overflow = 'visible';
  wrap.appendChild(resClone);
  document.body.appendChild(wrap);
  return wrap;
}

function _pvExportarPDF(){
  var JsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
  if(!JsPDF || typeof html2canvas !== 'function'){
    alert('Bibliotecas de PDF/canvas não carregaram.');
    return;
  }
  var wrap = _pvCapturaAlvo();
  if(!wrap) return;
  if(typeof _toast === 'function') _toast('Gerando PDF…', 'info');
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  html2canvas(wrap, {scale:2, backgroundColor: isDark ? '#0f1620' : '#ffffff', useCORS:true, logging:false}).then(function(canvas){
    document.body.removeChild(wrap);
    // Orientação: paisagem se canvas for mais largo que alto
    var orient = canvas.width >= canvas.height ? 'landscape' : 'portrait';
    var pdf = new JsPDF({orientation:orient, unit:'mm', format:'a4', compress:true});
    var pageW = pdf.internal.pageSize.getWidth();
    var pageH = pdf.internal.pageSize.getHeight();
    var marginX = 10, headerH = 16, footerH = 9;
    var contentW = pageW - marginX*2;
    var contentH = pageH - headerH - footerH;
    var imgW = contentW;
    var imgH = canvas.height * imgW / canvas.width;
    var totalPages = Math.ceil(imgH / contentH);
    var dt = fDtH(new Date());
    var pxPerMm = canvas.width / imgW;
    var logo = new Image();
    logo.onload = render; logo.onerror = function(){ render(null); };
    logo.src = 'assets/gpc-color.png';
    function render(logoImg){
      for(var p=0; p<totalPages; p++){
        if(p>0) pdf.addPage();
        if(logoImg){
          var ratio = logoImg.width/logoImg.height; var lH=10; var lW=lH*ratio;
          try{ pdf.addImage(logoImg, 'PNG', marginX, 4, lW, lH);}catch(e){}
        }
        pdf.setFont('helvetica','bold'); pdf.setFontSize(11); pdf.setTextColor(46,71,111);
        pdf.text('Análise Dinâmica', pageW - marginX, 9, {align:'right'});
        pdf.setFont('helvetica','normal'); pdf.setFontSize(8); pdf.setTextColor(120,120,120);
        pdf.text('Inteligência Comercial · Grupo Pinto Cerqueira', pageW - marginX, 13, {align:'right'});
        pdf.setDrawColor(245,134,52); pdf.setLineWidth(0.4);
        pdf.line(marginX, headerH - 1, pageW - marginX, headerH - 1);

        var sliceYmm = p*contentH;
        var remainingMm = imgH - sliceYmm;
        var thisSliceMm = Math.min(contentH, remainingMm);
        var srcY = Math.floor(sliceYmm*pxPerMm);
        var srcH = Math.floor(thisSliceMm*pxPerMm);
        var tmp = document.createElement('canvas');
        tmp.width = canvas.width; tmp.height = srcH;
        var tctx = tmp.getContext('2d');
        tctx.fillStyle = isDark ? '#0f1620' : '#ffffff';
        tctx.fillRect(0,0,tmp.width,tmp.height);
        tctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        pdf.addImage(tmp.toDataURL('image/jpeg',0.92),'JPEG',marginX,headerH,contentW,thisSliceMm,undefined,'FAST');

        pdf.setDrawColor(220,220,220); pdf.setLineWidth(0.2);
        pdf.line(marginX, pageH - footerH + 2, pageW - marginX, pageH - footerH + 2);
        pdf.setFont('helvetica','normal'); pdf.setFontSize(8); pdf.setTextColor(110,110,110);
        pdf.text('Exportado em ' + dt, marginX, pageH - 3);
        pdf.text('Página ' + (p+1) + ' de ' + totalPages, pageW - marginX, pageH - 3, {align:'right'});
      }
      var stamp = (new Date()).toISOString().slice(0,16).replace(/[-:T]/g,'');
      pdf.save('AnaliseDinamica_'+stamp+'.pdf');
      if(typeof _toast === 'function') _toast('PDF gerado.', 'sucesso');
    }
  }).catch(function(err){
    if(wrap.parentNode) document.body.removeChild(wrap);
    console.error('[PV PDF]', err);
    if(typeof _toast === 'function') _toast('Erro ao gerar PDF.', 'erro');
  });
}

function _pvExportarJPG(){
  if(typeof html2canvas !== 'function'){ alert('html2canvas não carregou.'); return; }
  var wrap = _pvCapturaAlvo();
  if(!wrap) return;
  if(typeof _toast === 'function') _toast('Gerando JPG…', 'info');
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  html2canvas(wrap, {scale:2, backgroundColor: isDark ? '#0f1620' : '#ffffff', useCORS:true, logging:false}).then(function(canvas){
    document.body.removeChild(wrap);
    canvas.toBlob(function(blob){
      if(!blob){ if(typeof _toast === 'function') _toast('Falha ao codificar JPG.', 'erro'); return; }
      var a = document.createElement('a');
      var stamp = (new Date()).toISOString().slice(0,16).replace(/[-:T]/g,'');
      a.href = URL.createObjectURL(blob);
      a.download = 'AnaliseDinamica_'+stamp+'.jpg';
      document.body.appendChild(a); a.click();
      setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 100);
      if(typeof _toast === 'function') _toast('JPG gerado.', 'sucesso');
    }, 'image/jpeg', 0.92);
  }).catch(function(err){
    if(wrap.parentNode) document.body.removeChild(wrap);
    console.error('[PV JPG]', err);
    if(typeof _toast === 'function') _toast('Erro ao gerar JPG.', 'erro');
  });
}

// Helper: converte 'YYYY-MM' em 'Mmm/AA' (ex: 2026-04 → 'Abr/26')
function _ymToLabel(ym){
  if(!ym || !/^\d{4}-\d{2}/.test(ym)) return String(ym||'');
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const ano = ym.substring(2, 4);
  const mes = parseInt(ym.substring(5, 7), 10) - 1;
  return meses[mes]+'/'+ano;
}

// ================================================================
// COMPRAS × VENDAS (com gráfico semanal - item 5)
// ================================================================
function renderCV(){
  const evo=getEvo('cv');
  // Totais derivados de evo (já com filtro aplicado), em vez de sumE() global
  const tv=evo.reduce((s,e)=>s+(e.vdo||0),0);
  const tl=evo.reduce((s,e)=>s+(e.luc||0),0);
  const tc_liq=evo.reduce((s,e)=>s+comLiq(e.com,e.dvf),0);
  const tp=evo.reduce((s,e)=>s+(e.pag||0),0);
  const ta=evo.reduce((s,e)=>s+(e.abr||0),0);
  const tdvc=evo.reduce((s,e)=>s+(e.dvc||0),0);
  const tdvf=evo.reduce((s,e)=>s+(e.dvf||0),0);
  const lbl=evo.map(e=>PLBL[PERS.indexOf(e.m)]);
  const cob_geral=tv>0?tc_liq/tv*100:0;

  document.getElementById('kg-cv').innerHTML=kgHtml([
    {l:'Faturamento líquido',v:fK(tv),s:fP(tv>0?tl/tv*100:0)+' margem'},
    {l:'Compras líquidas',v:fK(tc_liq),s:fP(tv>0?tc_liq/tv*100:0)+' de cobertura',cls:tc_liq>tv?'dn':tc_liq/tv>0.80?'':'up'},
    {l:'Pago',v:fK(tp),s:fP((tp+ta)>0?tp/(tp+ta)*100:0)+' do exigível (pago+aberto)',cls:'up'},
    {l:'Em aberto',v:fK(ta),s:'A pagar',cls:ta>0?'hl':''},
    {l:'Dev. cliente',v:fK(tdvc),s:fP(tv>0?tdvc/tv*100:0)+' do fat.',cls:tv>0&&tdvc/tv>0.01?'dn':''},
    {l:'Dev. fornecedor',v:fK(tdvf),s:'Subtraído das compras',cls:''},
  ]);

  const comLiqs=evo.map(e=>comLiq(e.com,e.dvf));

  mkC('c-cv-det',{data:{labels:lbl,datasets:[
    {type:'bar',label:'Vendas líq.',data:evo.map(e=>e.vdo),backgroundColor:_PAL.hl+'CC',borderRadius:5,order:3},
    {type:'bar',label:'Compras líq.',data:comLiqs,backgroundColor:_PAL.ac+'CC',borderRadius:5,order:3},
    {type:'line',label:'Pago',data:evo.map(e=>e.pag),borderColor:_PAL.ok,backgroundColor:'rgba(16,152,84,.1)',tension:.4,pointRadius:4,pointBackgroundColor:_PAL.ok,order:2},
    {type:'line',label:'Em aberto',data:evo.map(e=>e.abr),borderColor:_PAL.hl,borderDash:[5,3],tension:.4,pointRadius:4,pointBackgroundColor:_PAL.hl,order:1},
  ]},options:{responsive:true,maintainAspectRatio:false,
    plugins:{legend:{position:'bottom',labels:{padding:10,usePointStyle:true,boxWidth:8}},
             tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': '+fB(ctx.raw)}}},
    scales:{y:{beginAtZero:true,ticks:{callback:v=>fAbbr(v)}},x:{grid:{display:false}}}}});

  // Item 7: cobertura com nova lógica e valores líquidos
  mkC('c-cv-cob',{type:'bar',data:{labels:lbl,datasets:[
    {label:'Cobertura % (compras líq. / vendas líq.)',
     data:evo.map(e=>{const cl=comLiq(e.com,e.dvf);return e.vdo>0?+(cl/e.vdo*100).toFixed(2):0;}),
     backgroundColor:evo.map(e=>{const cl=comLiq(e.com,e.dvf);const c=e.vdo>0?cl/e.vdo*100:0;return cobCls(c);}),
     borderRadius:5}
  ]},options:{responsive:true,maintainAspectRatio:false,
    plugins:{
      legend:{position:'bottom',labels:{padding:10,usePointStyle:true,boxWidth:8}},
      tooltip:{callbacks:{label:ctx=>{
        const c=ctx.raw;
        const tag=c>100?'⚠ Excesso':c>80?'⚡ Atenção':'✓ OK';
        return fP(c,1)+' — '+tag;
      }}},
      annotation:{annotations:[{type:'line',yMin:80,yMax:80,borderColor:_PAL.ok,borderWidth:2,borderDash:[6,4],label:{content:'80% — OK',display:true,position:'end',font:{size:10}}},{type:'line',yMin:100,yMax:100,borderColor:_PAL.dn,borderWidth:2,borderDash:[6,4],label:{content:'100% — Excesso',display:true,position:'end',font:{size:10}}}]},
    },
    scales:{y:{beginAtZero:false,min:60,ticks:{callback:v=>fP(v)}},x:{grid:{display:false}}}}});

  // Item 5: GRÁFICO SEMANAL
  const sems=getSem();
  if(sems.length>0){
    mkC('c-cv-semanal',{type:'bar',data:{
      labels:sems.map(s=>s.lbl),
      datasets:[
        {type:'bar',label:'Vendas líq.',data:sems.map(s=>s.vdo),backgroundColor:_PAL.hl+'CC',borderRadius:4},
        {type:'bar',label:'Compras líq.',data:sems.map(s=>s.com),backgroundColor:_PAL.ac+'CC',borderRadius:4},
      ]
    },options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{position:'bottom',labels:{padding:10,usePointStyle:true,boxWidth:8}},
               tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': '+fB(ctx.raw)}}},
      scales:{y:{beginAtZero:true,ticks:{callback:v=>fAbbr(v)}},x:{grid:{display:false},ticks:{font:{size:10},maxRotation:0}}}}});
  }

  // Tabela mensal (item 7: lógica cobertura corrigida)
  document.getElementById('tb-cv').innerHTML=evo.map(e=>{
    const cl=comLiq(e.com,e.dvf);
    const cob=e.vdo>0?cl/e.vdo*100:0;
    return`<tr>
      <td class="L" style="font-weight:700;">${PLBL[PERS.indexOf(e.m)]}</td>
      <td>${fB(e.vdo,0)}</td>
      <td class="${mc(e.marg)}">${fP(e.marg)}</td>
      <td>${fB(cl,0)}</td>
      <td class="L">${cob>0?cobTag(cob)+' '+fP(cob,1):'—'}</td>
      <td class="val-pos">${fB(e.pag,0)}</td>
      <td class="${e.abr>0?'val-neg':''}">${fB(e.abr,0)}</td>
      <td class="val-dim">${fB(e.dvc,0)}</td>
      <td class="val-dim">${fB(e.dvf,0)}</td>
      <td class="val-dim">${fI(e.ni)}</td>
    </tr>`;
  }).join('');
}

// ================================================================
// DEPARTAMENTOS (item 9: totalizador)
