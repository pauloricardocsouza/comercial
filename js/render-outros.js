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
    cont.innerHTML = '<div class="ph"><div class="pk">Inadimplência</div><h2><em>Recebimentos</em> em atraso</h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc" style="text-align:center;color:var(--text-muted);padding:30px;">Dados de recebimentos não carregados.</div></div>';
    return;
  }

  const meta = R.meta || {};
  // Detecta automaticamente qual chave do resumo usar baseado na base ativa.
  // Aceita: ATP, CP1, CP3, CP5, CP40 ou _total_grupo (consolidado).
  // Antes era hardcoded em R.resumo.ATP — quebrava nas filiais CP.
  const _resumoTodo = R.resumo || {};
  let resumo = {};
  // Prioriza não-_total_grupo se houver apenas uma chave principal
  const chavesResumo = Object.keys(_resumoTodo).filter(function(k){return !k.startsWith('_');});
  if(chavesResumo.length === 1){
    resumo = _resumoTodo[chavesResumo[0]] || {};
  } else if(chavesResumo.length > 1){
    // Múltiplas filiais (cubo CP com CP1/CP3/CP5/CP40) → usa o agregado
    resumo = _resumoTodo._total_grupo || _resumoTodo[chavesResumo[0]] || {};
  } else {
    resumo = _resumoTodo._total_grupo || {};
  }
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

  let html = '<div class="ph"><div class="pk">Inadimplência</div><h2><em>Recebimentos</em> em atraso</h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // Banner com escopo
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>Escopo:</strong> '+esc(meta.escopo||'Inadimplência ATP')+' · '
       +   '<strong>Vencidos:</strong> '+esc((meta.periodo_vencimento||{}).inicio||'?')+' a '+esc((meta.periodo_vencimento||{}).fim||'?')+' · '
       +   fI(meta.linhas_processadas||0)+' linhas processadas · '
       +   'gerado em '+esc((meta.geradoEm||'').substring(0,16).replace('T',' '))
       + '</div>';

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
       +      '<div style="display:flex;align-items:center;gap:8px;">'
       +        '<label style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:600;">Supervisor:</label>'
       +        '<select id="rec-cli-sup-filtro" style="padding:5px 10px;border-radius:5px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:12px;font-weight:600;min-width:180px;"></select>'
       +      '</div>'
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

  // ─── KPIs ───
  const c1 = clientes[0] || {};
  document.getElementById('kg-rec').innerHTML = kgHtml([
    {l:'Total atrasado',          v:fK(resumo.total_atrasado||0), s:fI(resumo.parcelas||0)+' parcelas',cls:'dn'},
    {l:'Clientes inadimplentes',  v:fI(resumo.clientes_inadimplentes||0), s:'em '+fI(resumo.nfs||0)+' NFs'},
    {l:'RCAs envolvidos',         v:fI(resumo.rcas_envolvidos||0), s:'vendedores das NFs'},
    {l:'Dias de atraso médio',    v:fI(resumo.dias_atraso_medio||0)+'d', s:'mediana: '+fI(resumo.dias_atraso_mediano||0)+'d'},
    {l:'Concentração top 1',      v:fP(conc.top_1_pct||0), s:'cliente cod='+esc(c1.cod||'?'), cls:'hl'},
    {l:'Concentração top 5',      v:fP(conc.top_5_pct||0), s:'soma top 5 clientes', cls:'hl'},
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

  // ─── Chart mensal ───
  if(mensal.length){
    mkC('c-rec-mensal', {type:'bar',
      data:{labels:mensal.map(function(m){return _ymToLabel(m.ym);}),
        datasets:[{label:'Valor', data:mensal.map(function(m){return m.valor;}),
          backgroundColor:_PAL.dn+'CC', borderRadius:4}]},
      options:{responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:false},
                 tooltip:{callbacks:{label:function(ctx){
                   const m = mensal[ctx.dataIndex];
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
  const clientesEnriquecidos = clientes.map(function(c){
    const supsSet = new Map(); // cod → nome
    (c.rcas || []).forEach(function(rNome){
      // Pula RCAs internos do GPC (não interessam pra análise de inadimplência)
      if(_rcaNomeEhGpcInterno(rNome)) return;
      const k = (rNome||'').trim().toUpperCase();
      const info = supPorNomeRca.get(k);
      if(info && info.cod != null){
        // Aplica filtro de supervisores ignorados (config Administração)
        if(_isSupervisorIgnorado(info.loja, info.cod)) return;
        if(!supsSet.has(info.cod)) supsSet.set(info.cod, info.nome);
      }
    });
    return Object.assign({}, c, {
      _supervisores: Array.from(supsSet.entries()).map(function(e){return {cod:e[0], nome:e[1]};})
    });
  });

  // Popular dropdown com supervisores únicos presentes nos clientes
  const supsUnicos = new Map();
  clientesEnriquecidos.forEach(function(c){
    c._supervisores.forEach(function(s){ supsUnicos.set(s.cod, s.nome); });
  });
  const supsArr = Array.from(supsUnicos.entries())
    .map(function(e){return {cod:e[0], nome:e[1]};})
    .sort(function(a,b){return a.cod - b.cod;});
  const sel = document.getElementById('rec-cli-sup-filtro');
  if(sel){
    sel.innerHTML = '<option value="">Todos</option>'
      + supsArr.map(function(s){return '<option value="'+s.cod+'">#'+s.cod+' '+esc(s.nome)+'</option>';}).join('');
  }

  // Função que renderiza tbody com filtro aplicado
  function _renderTopClientesAtraso(filtroSupCod){
    let lista = clientesEnriquecidos;
    if(filtroSupCod !== '' && filtroSupCod != null){
      const cod = Number(filtroSupCod);
      lista = lista.filter(function(c){
        return c._supervisores.some(function(s){return s.cod === cod;});
      });
    }
    const top = lista.slice(0, 30);
    const tb = document.getElementById('tb-rec-cli');
    if(!tb) return;
    if(top.length === 0){
      tb.innerHTML = '<tr><td colspan="11" style="text-align:center;color:var(--text-muted);padding:20px;font-size:12px;">Nenhum cliente em atraso para este supervisor.</td></tr>';
      return;
    }
    tb.innerHTML = top.map(function(c, i){
      const fx = c.faixas || {};
      const f1 = fx.ATRASO_1_30D||0;
      const f2 = fx.ATRASO_31_60D||0;
      const f3 = fx.ATRASO_61_90D||0;
      const f4 = fx.ATRASO_91D_OU_MAIS||0;
      const isTop1 = i === 0 && !filtroSupCod;
      const valCls = c.dias_atraso_max>90 ? 'val-neg' : c.dias_atraso_max>60 ? 'hl' : '';
      const supsTxt = c._supervisores.length === 0
        ? '<span class="val-dim">—</span>'
        : c._supervisores.map(function(s){return '#'+s.cod+' '+esc((s.nome||'').substring(0,16));}).join('<br>');
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
  _renderTopClientesAtraso('');
  if(sel){
    sel.addEventListener('change', function(){ _renderTopClientesAtraso(sel.value); });
  }

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
  const rcaSorted = rcas.filter(function(r){ return !_rcaEhGpcInterno(r); })
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
}

// ────────────────────────────────────────────────────────────────────
// VERBAS · análise de descontos comerciais (sub-etapa 4g · 30/abr/2026)
// Consome /dados-modulares/verbas_atp.json
// Verba = redução de custo (dedução do CMV); aumenta margem real do SKU
// ────────────────────────────────────────────────────────────────────
function renderVerbas(){
  const cont = document.getElementById('page-verbas');
  if(!cont) return;

  if(!Vb){
    cont.innerHTML = '<div class="ph"><div class="pk">Compras · Análise</div><h2><em>Verbas</em> e descontos comerciais</h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc" style="text-align:center;color:var(--text-muted);padding:30px;">Dados de verbas não carregados pra esta base.</div></div>';
    return;
  }

  const meta = Vb.meta || {};
  const resumo = Vb.resumo || {};
  const mensal = Vb.mensal || [];
  const deptos = Vb.por_departamento || [];
  const secoes = Vb.por_secao || [];
  const forns  = Vb.por_fornecedor || [];
  const prodTop = Vb.por_produto_top || [];
  const conc   = Vb.concentracao || {};
  const aplic  = Vb.aplicacoes || [];
  const compl  = meta.completude || {};

  // Sem dados (placeholder)
  if((meta.linhas_processadas||0) === 0){
    cont.innerHTML = '<div class="ph"><div class="pk">Compras · Análise</div><h2><em>Verbas</em> e descontos comerciais</h2></div>'
      + '<div class="ph-sep"></div><div class="page-body">'
      + '<div class="cc" style="text-align:center;color:var(--text-muted);padding:30px;">'
      + (esc(meta.aviso || 'Sem dados de verba neste extrato pra esta base.'))
      + '</div></div>';
    return;
  }

  let html = '<div class="ph"><div class="pk">Compras · Análise</div><h2><em>Verbas</em> e descontos comerciais</h2></div>';
  html += '<div class="ph-sep"></div>';
  html += '<div class="page-body">';

  // ─── Banner de escopo ───
  const periodo = meta.periodo || {};
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>Modelo:</strong> '+esc(meta.modelo||'verba como redução de custo')+' · '
       +   '<strong>Período:</strong> '+esc(periodo.inicio||'?')+' a '+esc(periodo.fim||'?')+' · '
       +   fI(meta.linhas_processadas||0)+' aplicações · '
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
    html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:8px 14px;margin-bottom:14px;font-size:11.5px;color:var(--text-muted);line-height:1.5;">'
         +   '<strong>Limitação WinThor:</strong> coluna TIPO_VERBA vem 100% vazia, sem subclassificação por natureza.'
         + '</div>';
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
      + '<td class="L"><strong>'+esc(f.nome||'')+'</strong></td>'
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
      + '<td class="L"><strong>'+esc(p.desc||'')+'</strong>'+(p.desc?'':'<span style="color:var(--text-muted);">cod '+fI(p.cod||0)+'</span>')+'</td>'
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
      + '<td class="L val-dim">'+fD(a.dt)+'</td>'
      + '<td class="L val-dim">'+esc((a.filial||'').substring(0,18))+'</td>'
      + '<td class="L val-dim">'+esc(a.num_verba||'')+'</td>'
      + '<td class="L val-dim">'+fI(a.cod_prod||0)+'</td>'
      + '<td class="L"><strong>'+esc(a.prod||'')+'</strong>'+(a.prod?'':' <span style="color:var(--text-muted);">sem descrição</span>')+(a.embalagem?' <span style="color:var(--text-muted);font-size:10px;">'+esc(a.embalagem)+'</span>':'')+'</td>'
      + '<td class="L val-dim">'+esc((a.forn||'').substring(0,28))+'</td>'
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
  const slugEfetivo = slug === 'grupo' ? 'cp' : slug;
  // Tamanho aproximado por base (pra mostrar algo realista no loader)
  const tamInfo = slugEfetivo === 'cp'
    ? '~23 MB gzip · 1,4 milhão de linhas'
    : '~10 MB gzip · 612 mil linhas';

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

  // Injeta CSS de animação (uma vez)
  if(!document.getElementById('cubo-anim-css')){
    const st = document.createElement('style');
    st.id = 'cubo-anim-css';
    st.textContent = '@keyframes pulseLoad{0%,100%{transform:translateX(-100%);}50%{transform:translateX(250%);}}';
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

function _renderCuboUI(c){
  const meta = c.meta || {};
  const dims = c.dimensoes || {};
  const fatos = c.fatos || {};
  const fv = fatos.vendas || {campos:[], linhas:[]};
  const idx = _buildCuboIdx(c);

  // Estado da página
  _cuboState = {
    cubo: c,
    idx: idx,
    fatoVendas: fv,
    filtros: {
      ymDe: ((dims.tempo||{}).items||[])[0] && dims.tempo.items[0].cod,
      ymAte: ((dims.tempo||{}).items||[])[(dims.tempo.items||[]).length-1] && dims.tempo.items[dims.tempo.items.length-1].cod,
      loja: '__all__',
      supervisor: '__all__'
    },
    // Pivot config
    linha: 'tempo',     // dimensão de linha (default: tempo)
    coluna: '__none__', // dimensão de coluna (default: nenhuma = 1D)
    metrica: 'fat_liq',
    topN: 30
  };

  const tempos = (dims.tempo||{}).items || [];
  const lojas = (dims.loja||{}).items || [];
  const supervisores = (dims.supervisor||{}).items || [];

  let html = '';

  // Aviso de fallback (quando GRUPO usa cubo CP)
  if(c._fallback_de){
    html += '<div style="background:#fef3c7;border:1px solid #d97706;border-radius:8px;padding:10px 14px;margin-bottom:10px;font-size:12px;color:#92400e;">'
         +   '<strong>Atenção:</strong> a visão GRUPO não tem cubo próprio. Mostrando dados do cubo de Comercial Pinto (4 lojas: CP1, CP3, CP5, CP40). ATP não está incluído nesta análise.'
         + '</div>';
  }

  // Banner com info do cubo
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>Período:</strong> '+esc(((meta.periodo||{}).inicio||'?'))+' a '+esc(((meta.periodo||{}).fim||'?'))+' ('+esc(((meta.periodo||{}).meses||'?'))+' meses) · '
       +   '<strong>'+fI(fv.linhas.length)+'</strong> linhas no fato vendas · '
       +   '<strong>'+(dims.vendedor && dims.vendedor.items ? dims.vendedor.items.length : 0)+'</strong> vendedores · '
       +   '<strong>'+(dims.fornecedor && dims.fornecedor.items ? dims.fornecedor.items.length : 0)+'</strong> fornecedores'
       + '</div>';

  // ─── Filtros globais ───
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cct">Filtros globais</div>'
       +    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-top:8px;">'
       +      '<div><label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px;">De</label>'
       +        '<select id="cu-ym-de" style="width:100%;padding:6px;font-size:12px;border:1px solid var(--border);border-radius:4px;background:#fff;">'
       +          tempos.map(function(t){return '<option value="'+t.cod+'">'+t.nome+'</option>';}).join('')
       +        '</select></div>'
       +      '<div><label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px;">Até</label>'
       +        '<select id="cu-ym-ate" style="width:100%;padding:6px;font-size:12px;border:1px solid var(--border);border-radius:4px;background:#fff;">'
       +          tempos.map(function(t){return '<option value="'+t.cod+'"'+(t.cod===_cuboState.filtros.ymAte?' selected':'')+'>'+t.nome+'</option>';}).join('')
       +        '</select></div>'
       +      '<div><label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px;">Loja</label>'
       +        '<select id="cu-loja" style="width:100%;padding:6px;font-size:12px;border:1px solid var(--border);border-radius:4px;background:#fff;">'
       +          '<option value="__all__">Todas</option>'
       +          lojas.map(function(l){return '<option value="'+esc(l.cod)+'">'+esc(l.nome)+'</option>';}).join('')
       +        '</select></div>'
       +      '<div><label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px;">Supervisor</label>'
       +        '<select id="cu-sup" style="width:100%;padding:6px;font-size:12px;border:1px solid var(--border);border-radius:4px;background:#fff;">'
       +          '<option value="__all__">Todos</option>'
       +          supervisores.map(function(s){return '<option value="'+s.cod+'">'+esc(s.nome)+'</option>';}).join('')
       +        '</select></div>'
       +    '</div>'
       + '</div>';

  // ─── Drilldowns rápidos ───
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cct">Visões rápidas</div>'
       +    '<div class="ccs">Análises pré-configuradas · clique para aplicar</div>'
       +    '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;" id="cu-quick">'
       +      '<button class="cu-quick-btn" data-q="evolucao">📊 Evolução mensal · faturamento</button>'
       +      '<button class="cu-quick-btn" data-q="lj-sup">🏪 Loja × Supervisor</button>'
       +      '<button class="cu-quick-btn" data-q="depto-mes">📦 Depto × Mês</button>'
       +      '<button class="cu-quick-btn" data-q="top-vendedor">👤 Top vendedores · ano</button>'
       +      '<button class="cu-quick-btn" data-q="top-fornecedor">🏭 Top fornecedores · margem</button>'
       +      '<button class="cu-quick-btn" data-q="top-sku">🛒 Top SKUs · vendidos</button>'
       +    '</div>'
       + '</div>';

  // CSS dos botões
  if(!document.getElementById('cu-quick-css')){
    const st = document.createElement('style');
    st.id = 'cu-quick-css';
    st.textContent = '.cu-quick-btn{padding:6px 10px;font-size:11px;border:1px solid var(--border);background:#fff;border-radius:14px;cursor:pointer;transition:.15s;color:var(--text);}'
                  + '.cu-quick-btn:hover{background:var(--accent);color:#fff;border-color:var(--accent);}';
    document.head.appendChild(st);
  }

  // ─── Pivot interativo ───
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cct">Pivot interativo</div>'
       +    '<div class="ccs">Escolha linha, coluna e métrica para cruzar dimensões</div>'
       +    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-top:8px;">'
       +      '<div><label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px;">Linha</label>'
       +        '<select id="cu-linha" style="width:100%;padding:6px;font-size:12px;border:1px solid var(--border);border-radius:4px;background:#fff;">'
       +          '<option value="tempo">Tempo (mês)</option>'
       +          '<option value="loja">Loja</option>'
       +          '<option value="supervisor">Supervisor</option>'
       +          '<option value="vendedor">Vendedor</option>'
       +          '<option value="depto">Departamento</option>'
       +          '<option value="categoria">Categoria/Seção</option>'
       +          '<option value="fornecedor">Fornecedor</option>'
       +          '<option value="sku_vendas">SKU (top 100)</option>'
       +        '</select></div>'
       +      '<div><label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px;">Coluna</label>'
       +        '<select id="cu-coluna" style="width:100%;padding:6px;font-size:12px;border:1px solid var(--border);border-radius:4px;background:#fff;">'
       +          '<option value="__none__">— sem coluna (1D) —</option>'
       +          '<option value="tempo">Tempo (mês)</option>'
       +          '<option value="loja">Loja</option>'
       +          '<option value="supervisor">Supervisor</option>'
       +          '<option value="depto">Departamento</option>'
       +        '</select></div>'
       +      '<div><label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px;">Métrica</label>'
       +        '<select id="cu-metrica" style="width:100%;padding:6px;font-size:12px;border:1px solid var(--border);border-radius:4px;background:#fff;">'
       +          '<option value="fat_liq">Faturamento líquido</option>'
       +          '<option value="fat_brt">Faturamento bruto</option>'
       +          '<option value="lucro">Lucro</option>'
       +          '<option value="cmv">CMV</option>'
       +          '<option value="margem">Margem %</option>'
       +          '<option value="qt_v">Quantidade vendida</option>'
       +          '<option value="nfs_v">NFs vendidas</option>'
       +          '<option value="cli">Clientes positivados</option>'
       +          '<option value="tkt_med">Ticket médio</option>'
       +          '<option value="devol">Devolução</option>'
       +        '</select></div>'
       +      '<div><label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px;">Top N (linhas)</label>'
       +        '<select id="cu-topn" style="width:100%;padding:6px;font-size:12px;border:1px solid var(--border);border-radius:4px;background:#fff;">'
       +          '<option value="10">Top 10</option>'
       +          '<option value="20">Top 20</option>'
       +          '<option value="30" selected>Top 30</option>'
       +          '<option value="50">Top 50</option>'
       +          '<option value="100">Top 100</option>'
       +          '<option value="999">Tudo</option>'
       +        '</select></div>'
       +    '</div>'
       +    '<div style="margin-top:10px;">'
       +      '<button id="cu-aplicar" style="padding:7px 16px;background:var(--accent);color:#fff;border:none;border-radius:5px;font-size:12px;font-weight:600;cursor:pointer;">Aplicar</button>'
       +      '<span id="cu-status" style="margin-left:10px;font-size:11px;color:var(--text-muted);"></span>'
       +    '</div>'
       + '</div>';

  // ─── Resultado ───
  html += '<div id="cu-resultado"></div>';

  document.getElementById('cubo-body').innerHTML = html;

  // Define ymDe inicial = 12 meses antes do último (ou primeiro se for menos)
  const tempos2 = tempos;
  let ymDeIdxInicial = Math.max(0, tempos2.length - 12);
  document.getElementById('cu-ym-de').selectedIndex = ymDeIdxInicial;
  _cuboState.filtros.ymDe = tempos2[ymDeIdxInicial].cod;

  // ─── Listeners ───
  ['cu-ym-de','cu-ym-ate','cu-loja','cu-sup'].forEach(function(id){
    document.getElementById(id).addEventListener('change', function(){
      _cuboState.filtros.ymDe = document.getElementById('cu-ym-de').value;
      _cuboState.filtros.ymAte = document.getElementById('cu-ym-ate').value;
      _cuboState.filtros.loja = document.getElementById('cu-loja').value;
      _cuboState.filtros.supervisor = document.getElementById('cu-sup').value;
    });
  });

  document.getElementById('cu-aplicar').addEventListener('click', function(){
    _cuboState.linha = document.getElementById('cu-linha').value;
    _cuboState.coluna = document.getElementById('cu-coluna').value;
    _cuboState.metrica = document.getElementById('cu-metrica').value;
    _cuboState.topN = parseInt(document.getElementById('cu-topn').value, 10);
    _executarPivot();
  });

  // Visões rápidas
  document.querySelectorAll('.cu-quick-btn').forEach(function(b){
    b.addEventListener('click', function(){ _aplicarVisaoRapida(b.dataset.q); });
  });

  // Renderiza pivot inicial
  _executarPivot();
}

// Aplica uma visão rápida (presets)
function _aplicarVisaoRapida(q){
  const presets = {
    'evolucao':       {linha:'tempo',      coluna:'__none__',   metrica:'fat_liq', topN:999},
    'lj-sup':         {linha:'loja',       coluna:'supervisor', metrica:'fat_liq', topN:999},
    'depto-mes':      {linha:'depto',      coluna:'tempo',      metrica:'fat_liq', topN:999},
    'top-vendedor':   {linha:'vendedor',   coluna:'__none__',   metrica:'fat_liq', topN:30},
    'top-fornecedor': {linha:'fornecedor', coluna:'__none__',   metrica:'lucro',   topN:30},
    'top-sku':        {linha:'sku_vendas', coluna:'__none__',   metrica:'qt_v',    topN:30}
  };
  const p = presets[q];
  if(!p) return;
  document.getElementById('cu-linha').value = p.linha;
  document.getElementById('cu-coluna').value = p.coluna;
  document.getElementById('cu-metrica').value = p.metrica;
  document.getElementById('cu-topn').value = p.topN;
  _cuboState.linha = p.linha;
  _cuboState.coluna = p.coluna;
  _cuboState.metrica = p.metrica;
  _cuboState.topN = p.topN;
  _executarPivot();
}

// Executa a agregação e renderiza tabela + chart
function _executarPivot(){
  const status = document.getElementById('cu-status');
  status.textContent = 'Calculando…';
  status.style.color = 'var(--accent)';

  // Async pra não travar a UI
  setTimeout(function(){
    const t0 = Date.now();
    const r = _agregarPivot();
    const ms = Date.now() - t0;
    _renderResultadoPivot(r);
    status.textContent = '✓ '+fI(r.totalLinhasProcessadas)+' linhas processadas em '+ms+'ms · '+fI(r.linhas.length)+' grupos';
    status.style.color = 'var(--success)';
  }, 30);
}

// Núcleo: agregação column-store eficiente
function _agregarPivot(){
  const st = _cuboState;
  const fv = st.fatoVendas;
  const linhasFato = fv.linhas;
  const campos = fv.campos;

  // Indexação dos campos (column-store: array de arrays)
  // campos: ['ym','lj','sup','vend','dep','cat','forn','sku','v_brt','v_liq','v_dev','v_cmv','v_luc','v_qt','v_nfs','v_cli']
  const c = {};
  campos.forEach(function(nm, i){ c[nm] = i; });

  // Mapeia métrica → campo do fato + tipo de agregação
  const metMap = {
    fat_brt: {campo:'v_brt', tipo:'sum'},
    fat_liq: {campo:'v_liq', tipo:'sum'},
    devol:   {campo:'v_dev', tipo:'sum'},
    cmv:     {campo:'v_cmv', tipo:'sum'},
    lucro:   {campo:'v_luc', tipo:'sum'},
    qt_v:    {campo:'v_qt',  tipo:'sum'},
    nfs_v:   {campo:'v_nfs', tipo:'sum'},
    cli:     {campo:'v_cli', tipo:'sum'},
    margem:  {tipo:'calc', formula:'lucro/fat_liq*100'},
    tkt_med: {tipo:'calc', formula:'fat_liq/nfs_v'}
  };
  const mDef = metMap[st.metrica] || metMap.fat_liq;

  // Filtros
  const ymDe = st.filtros.ymDe, ymAte = st.filtros.ymAte;
  const ljF = st.filtros.loja, supF = st.filtros.supervisor;

  // Mapeia dimensão de linha/coluna → campo do fato
  const dimMap = {
    tempo: 'ym', loja: 'lj', supervisor: 'sup', vendedor: 'vend',
    depto: 'dep', categoria: 'cat', fornecedor: 'forn', sku_vendas: 'sku'
  };
  const linCampo = dimMap[st.linha];
  const colCampo = st.coluna === '__none__' ? null : dimMap[st.coluna];

  // Agregação: Map(linhaKey → Map(colKey → {fat_brt,fat_liq,...}))
  const agg = new Map();
  let totalProc = 0, totalFiltrado = 0;

  for(let i = 0, n = linhasFato.length; i < n; i++){
    const ln = linhasFato[i];
    const ym = ln[c.ym];
    if(ym < ymDe || ym > ymAte) continue;
    if(ljF !== '__all__' && ln[c.lj] !== ljF) continue;
    if(supF !== '__all__' && ln[c.sup] !== parseInt(supF, 10)) continue;

    totalFiltrado++;

    const lk = ln[c[linCampo]];
    const ck = colCampo ? ln[c[colCampo]] : '__total__';

    if(!agg.has(lk)) agg.set(lk, new Map());
    const colMap = agg.get(lk);
    if(!colMap.has(ck)){
      colMap.set(ck, {fat_brt:0, fat_liq:0, devol:0, cmv:0, lucro:0, qt_v:0, nfs_v:0, cli:0});
    }
    const cell = colMap.get(ck);
    // `|| 0` protege contra cubos sem campos (cubo CP antigo não tem v_nfs/v_cli)
    cell.fat_brt += ln[c.v_brt] || 0;
    cell.fat_liq += ln[c.v_liq] || 0;
    cell.devol   += ln[c.v_dev] || 0;
    cell.cmv     += ln[c.v_cmv] || 0;
    cell.lucro   += ln[c.v_luc] || 0;
    cell.qt_v    += ln[c.v_qt]  || 0;
    cell.nfs_v   += ln[c.v_nfs] || 0;
    cell.cli     += ln[c.v_cli] || 0;
  }
  totalProc = linhasFato.length;

  // Calcula valor da métrica em cada célula
  function valorMetrica(cell){
    if(mDef.tipo === 'sum') return cell[st.metrica];
    if(st.metrica === 'margem') return cell.fat_liq>0 ? (cell.lucro/cell.fat_liq*100) : 0;
    if(st.metrica === 'tkt_med') return cell.nfs_v>0 ? (cell.fat_liq/cell.nfs_v) : 0;
    return 0;
  }

  // Coleta colunas únicas (ordenadas)
  const colunasSet = new Set();
  agg.forEach(function(colMap){ colMap.forEach(function(_, k){ colunasSet.add(k); }); });
  let colunas = Array.from(colunasSet);
  if(st.coluna === 'tempo') colunas.sort();
  else colunas.sort();

  // Resolve labels das linhas e colunas
  const idx = st.idx;
  function labelDim(dimNome, key){
    if(dimNome === 'tempo') return _ymToLabel(key);
    if(dimNome === 'loja') return key;  // loja já vem como string ATP
    if(dimNome === 'sku_vendas'){
      const it = idx.sku_vendas.get(key);
      return it ? (it.desc || ('#'+key)) : '#'+key;
    }
    const dimKey = dimNome === 'supervisor' ? 'supervisor' : dimNome === 'fornecedor' ? 'fornecedor' : dimNome;
    const it = idx[dimKey] && idx[dimKey].get(key);
    return it ? (it.nome || it.desc || String(key)) : String(key);
  }

  // Constrói linhas com totais
  const linhas = [];
  agg.forEach(function(colMap, lk){
    const cells = {};
    let totLinha = {fat_brt:0, fat_liq:0, devol:0, cmv:0, lucro:0, qt_v:0, nfs_v:0, cli:0};
    colMap.forEach(function(cell, ck){
      cells[ck] = valorMetrica(cell);
      totLinha.fat_brt += cell.fat_brt;
      totLinha.fat_liq += cell.fat_liq;
      totLinha.devol   += cell.devol;
      totLinha.cmv     += cell.cmv;
      totLinha.lucro   += cell.lucro;
      totLinha.qt_v    += cell.qt_v;
      totLinha.nfs_v   += cell.nfs_v;
      totLinha.cli     += cell.cli;
    });
    linhas.push({
      key: lk,
      label: labelDim(st.linha, lk),
      cells: cells,
      total: valorMetrica(totLinha)
    });
  });

  // Ordena linhas: por tempo se for tempo, senão por valor desc
  if(st.linha === 'tempo') linhas.sort(function(a,b){return a.key < b.key ? -1 : 1;});
  else linhas.sort(function(a,b){return b.total - a.total;});

  // Aplica top N
  const linhasFinal = linhas.slice(0, st.topN);

  // Total geral
  let totalGeral = 0;
  linhas.forEach(function(l){ totalGeral += l.total; });

  return {
    linhas: linhasFinal,
    todasLinhas: linhas,
    colunas: colunas,
    colunasLabels: colunas.map(function(ck){ return st.coluna === '__none__' ? '' : labelDim(st.coluna, ck); }),
    totalGeral: totalGeral,
    totalLinhasProcessadas: totalFiltrado,
    metrica: st.metrica,
    metricaDef: mDef
  };
}

// Renderiza o resultado: chart + tabela
function _renderResultadoPivot(r){
  const cont = document.getElementById('cu-resultado');
  if(!r.linhas.length){
    cont.innerHTML = '<div class="cc" style="text-align:center;color:var(--text-muted);padding:30px;">Nenhum dado encontrado para os filtros selecionados.</div>';
    return;
  }

  const st = _cuboState;
  const isPct = st.metrica === 'margem';
  const isQtde = st.metrica === 'qt_v' || st.metrica === 'nfs_v' || st.metrica === 'cli';
  const fmt = function(v){
    if(isPct) return fP(v);
    if(isQtde) return fI(v);
    return fK(v);
  };

  let html = '<div class="cc" style="margin-bottom:14px;">';
  html += '<div class="cct">Resultado · ' + esc(_dimLabel(st.linha));
  if(st.coluna !== '__none__') html += ' × ' + esc(_dimLabel(st.coluna));
  html += ' · ' + esc(_metricaLabel(st.metrica)) + '</div>';
  html += '<div class="ccs">' + fI(r.linhas.length) + ' grupos exibidos · total geral: <strong>' + fmt(r.totalGeral) + '</strong></div>';

  // Chart só pra 1D (sem coluna de quebra)
  if(st.coluna === '__none__' && r.linhas.length <= 50){
    html += '<div style="height:300px;margin-top:10px;"><canvas id="c-cu-pivot"></canvas></div>';
  }

  // Tabela
  html += '<div class="tscroll" style="margin-top:10px;"><table class="t" id="t-cu-pivot"><thead><tr>';
  html += '<th class="L" style="width:24px;">#</th>';
  html += '<th class="L">' + esc(_dimLabel(st.linha)) + '</th>';
  if(st.coluna === '__none__'){
    html += '<th>' + esc(_metricaLabel(st.metrica)) + '</th>';
    html += '<th>% sobre total</th>';
  } else {
    r.colunasLabels.forEach(function(cl){ html += '<th>' + esc(cl) + '</th>'; });
    html += '<th><strong>Total</strong></th>';
  }
  html += '</tr></thead><tbody>';

  r.linhas.forEach(function(ln, i){
    html += '<tr>';
    html += '<td class="L" style="color:var(--text-muted);font-weight:700;">' + (i+1) + '</td>';
    html += '<td class="L"><strong>' + esc((ln.label||'').substring(0, 50)) + '</strong></td>';
    if(st.coluna === '__none__'){
      html += '<td class="val-strong">' + fmt(ln.total) + '</td>';
      const pct = r.totalGeral > 0 ? (ln.total/r.totalGeral*100) : 0;
      html += '<td class="val-dim">' + fP(pct) + '</td>';
    } else {
      r.colunas.forEach(function(ck){
        const v = ln.cells[ck];
        html += '<td>' + (v !== undefined ? fmt(v) : '<span style="color:var(--text-muted);">—</span>') + '</td>';
      });
      html += '<td class="val-strong">' + fmt(ln.total) + '</td>';
    }
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  html += '</div>';

  cont.innerHTML = html;

  // Renderiza chart se cabe
  if(st.coluna === '__none__' && r.linhas.length <= 50){
    const isTempo = st.linha === 'tempo';
    const labels = r.linhas.map(function(l){return (l.label||'').substring(0, 22);});
    const data = r.linhas.map(function(l){return l.total;});
    mkC('c-cu-pivot', {type:'bar',
      data:{labels:labels, datasets:[{label:_metricaLabel(st.metrica), data:data,
        backgroundColor:_PAL.ac+'CC', borderRadius:4}]},
      options:{
        indexAxis: isTempo ? 'x' : 'y',
        responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:false},
                 tooltip:{callbacks:{label:function(ctx){return fmt(ctx.raw);}}}},
        scales: isTempo
          ? {y:{ticks:{callback:function(v){return isPct?fP(v):isQtde?fI(v):fAbbr(v);}}}, x:{grid:{display:false}}}
          : {x:{ticks:{callback:function(v){return isPct?fP(v):isQtde?fI(v):fAbbr(v);}}}, y:{grid:{display:false}, ticks:{font:{size:10}}}}
      }});
  }
}

function _dimLabel(d){
  return {tempo:'Mês', loja:'Loja', supervisor:'Supervisor', vendedor:'Vendedor',
          depto:'Departamento', categoria:'Categoria/Seção', fornecedor:'Fornecedor', sku_vendas:'SKU'}[d] || d;
}
function _metricaLabel(m){
  return {fat_brt:'Faturamento bruto', fat_liq:'Faturamento líquido', lucro:'Lucro', cmv:'CMV',
          margem:'Margem %', qt_v:'Qtde vendida', nfs_v:'NFs vendidas', cli:'Clientes positivados',
          tkt_med:'Ticket médio', devol:'Devolução'}[m] || m;
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
  const evo=getEvo();
  const tv=sumE('vdo'),tl=sumE('luc');
  const tc_liq=evo.reduce((s,e)=>s+comLiq(e.com,e.dvf),0);
  const tp=sumE('pag'),ta=sumE('abr'),tdvc=sumE('dvc'),tdvf=sumE('dvf');
  const lbl=evo.map(e=>PLBL[PERS.indexOf(e.m)]);
  const cob_geral=tv>0?tc_liq/tv*100:0;

  document.getElementById('kg-cv').innerHTML=kgHtml([
    {l:'Faturamento líquido',v:fK(tv),s:fP(tv>0?tl/tv*100:0)+' margem'},
    {l:'Compras líquidas',v:fK(tc_liq),s:fP(tv>0?tc_liq/tv*100:0)+' de cobertura',cls:tc_liq>tv?'dn':tc_liq/tv>0.80?'':'up'},
    {l:'Pago',v:fK(tp),s:fP((tp+ta)>0?tp/(tp+ta)*100:0)+' do total',cls:'up'},
    {l:'Em aberto',v:fK(ta),s:'A pagar',cls:ta>0?'hl':''},
    {l:'Dev. cliente',v:fK(tdvc),s:fP(tv>0?tdvc/tv*100:0)+' do fat.',cls:tv>0&&tdvc/tv>0.01?'dn':''},
    {l:'Dev. fornecedor',v:fK(tdvf),s:'Subtraído das compras',cls:''},
    {l:'Financiado forn.',v:fK(tc_liq-tp),s:'Comprado não pago'},
    {l:'Lucro bruto',v:fK(tl),s:'Resultado operacional',cls:tl>0?'up':'dn'},
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
