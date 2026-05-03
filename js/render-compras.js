// ════════════════════════════════════════════════════════════════════════════
// GPC Comercial · render-compras.js
// ════════════════════════════════════════════════════════════════════════════
// Gerado pela divisão do index.html em v4.6 (etapa #3 da auditoria)
// Carregado via <script src="js/render-compras.js"> no index.html
// IMPORTANTE: ordem de carregamento importa — ver comentário no index.html
// ════════════════════════════════════════════════════════════════════════════

// ==== Compras · Tratamento de "dados indisponíveis" =========
// Páginas que dependem de D.produtos / D.fornecedores etc. (schema legado).
// REMOVIDOS: 'executivo' e 'cv' (já migrados em 4b/4d, não precisam mais de D).

const _PAGINAS_COMPRAS_COM_DADOS = [
  'deptos','estoque','excesso','financeiro','vencidos',
  'fornecedores','forn-gpc','abc','alertas','diagnostico','diag-forn'
];

function _renderComprasIndisponivel(pg){
  const cont = document.getElementById('page-' + pg);
  if(!cont) return;
  const meta = (PAGINAS_CATALOGO || []).find(p => p.id === pg) || {nome: pg, grupo:'Compras'};

  // Mapa de páginas para sugestões de alternativas funcionais já migradas
  const sugestoes = {
    'deptos':       {alt:'cubo', altLabel:'Análise Dinâmica', altDesc:'Arquivo estoque_atp.json não encontrado. Use linha=Departamento na Análise Dinâmica como alternativa.'},
    'fornecedores': {alt:'cubo', altLabel:'Análise Dinâmica', altDesc:'Arquivo estoque_atp.json não encontrado. Use linha=Fornecedor na Análise Dinâmica como alternativa.'},
    'forn-gpc':     {alt:'cubo', altLabel:'Análise Dinâmica', altDesc:'Arquivo estoque_atp.json não encontrado. Use linha=Fornecedor com filtro "CERQUEIRA" na Análise Dinâmica.'},
    'abc':          {alt:'cubo', altLabel:'Análise Dinâmica', altDesc:'Arquivo estoque_atp.json não encontrado. Use a Análise Dinâmica como alternativa.'},
    'estoque':      {alt:'cubo', altLabel:'Análise Dinâmica', altDesc:'Arquivo estoque_atp.json não encontrado. Use a Análise Dinâmica como alternativa.'},
    'excesso':      {alt:'cubo', altLabel:'Análise Dinâmica', altDesc:'Arquivo estoque_atp.json não encontrado. Use a Análise Dinâmica como alternativa.'},
    'diagnostico':  {alt:'cubo', altLabel:'Análise Dinâmica', altDesc:'Arquivo estoque_atp.json não encontrado. Use linha=SKU na Análise Dinâmica como alternativa.'},
    'diag-forn':    {alt:'cubo', altLabel:'Análise Dinâmica', altDesc:'Arquivo estoque_atp.json não encontrado. Use linha=Fornecedor na Análise Dinâmica como alternativa.'},
    'alertas':      {alt:'v-alertas', altLabel:'Alertas Vendas', altDesc:'Arquivo estoque_atp.json não encontrado. Os alertas de vendas estão em Alertas Vendas (já migrada).'},
    'financeiro':   {alt:'recebimentos', altLabel:'Recebimentos', altDesc:'Arquivo financeiro_atp.json não encontrado. Para vendas a prazo veja Recebimentos.'},
    'vencidos':     {alt:'financeiro', altLabel:'Financeiro', altDesc:'Arquivo financeiro_atp.json não encontrado. Use a página Financeiro como alternativa.'}
  };
  const s = sugestoes[pg] || {alt:null, altLabel:null, altDesc:'Esta página depende do schema antigo (D) que está em migração.'};

  let html = '<div class="ph"><div class="pk">'+esc(meta.grupo||'Compras')+'</div><h2>'+esc(meta.nome||pg)+'</h2></div>'
    + '<div class="ph-sep"></div>'
    + '<div class="page-body">'
    + '<div class="cc" style="padding:32px 28px;text-align:center;border:2px dashed var(--border-strong);background:var(--surface-2);max-width:680px;margin:20px auto;">'
    + '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:14px;">'
    + '<div style="width:56px;height:56px;border-radius:50%;background:var(--warning-bg);display:flex;align-items:center;justify-content:center;">'
    + '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>'
    + '</div>'
    + '<h3 style="font-size:17px;font-weight:700;color:var(--text);margin:0;">Página em migração</h3>'
    + '<p style="font-size:13px;color:var(--text-dim);line-height:1.6;margin:0;max-width:520px;">'
    + esc(s.altDesc)
    + '</p>';

  if(s.alt){
    html += '<button class="ebtn" style="background:var(--accent);color:#fff;border:none;padding:10px 22px;border-radius:7px;font-weight:700;cursor:pointer;font-size:13px;display:inline-flex;align-items:center;gap:8px;margin-top:6px;" onclick="document.querySelector(\'.sb-link[data-p='+s.alt+']\').click()">'
         + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>'
         + 'Ir para ' + esc(s.altLabel)
         + '</button>';
  }

  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:6px;">'
       + '<button class="ebtn" style="background:var(--surface);border:1px solid var(--border-strong);color:var(--text);padding:8px 14px;border-radius:7px;font-weight:600;cursor:pointer;font-size:11px;" onclick="document.querySelector(\'.sb-link[data-p=cubo]\').click()">📊 Análise Dinâmica (cubo OLAP)</button>'
       + '<button class="ebtn" style="background:var(--surface);border:1px solid var(--border-strong);color:var(--text);padding:8px 14px;border-radius:7px;font-weight:600;cursor:pointer;font-size:11px;" onclick="document.querySelector(\'.sb-link[data-p=home]\').click()">← Voltar para Home</button>'
       + '</div>'
       + '</div></div></div>';

  cont.innerHTML = html;
}

// ════════════════════════════════════════════════════════════════════════
// ESTOQUE NOVO · usa estoque_atp.json (E) · sub-etapa 4i · 30/abr/2026
// ════════════════════════════════════════════════════════════════════════
function renderEstoqueNovo(){
  const cont = document.getElementById('page-estoque');
  if(!cont || !E) return;
  const r = E.resumo || {};
  const meta = E.meta || {};
  let pd = E.por_depto || [];
  // Se por_depto não veio no JSON (consolidados podem não trazer), calcular on-the-fly
  if((!pd || pd.length === 0) && Array.isArray(E.produtos)){
    const acc = {};
    E.produtos.forEach(function(p){
      if(!p.depto || !p.depto.cod) return;
      const k = p.depto.cod;
      if(!acc[k]) acc[k] = {cod:p.depto.cod, nome:p.depto.nome, vl_custo:0, vl_preco:0, qt:0, skus:0};
      const e = p.estoque || {};
      acc[k].vl_custo += e.vl_custo || 0;
      acc[k].vl_preco += e.vl_preco || 0;
      acc[k].qt += e.qt || 0;
      acc[k].skus += 1;
    });
    pd = Object.values(acc).sort(function(a,b){return b.vl_custo - a.vl_custo;});
  }

  let html = '<div class="ph"><div class="pk">Compras</div><h2>Estoque · retrato atual</h2></div>'
           + '<div class="ph-sep"></div>'
           + '<div class="page-body">';

  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       + '<strong>Retrato:</strong> '+fDt(meta.data_referencia||r.data_ref)+' · '
       + '<strong>'+fI(r.skus_total||0)+'</strong> SKUs'
       + (r.markup_pct != null ? ' · Markup médio <strong>'+fP(r.markup_pct)+'</strong>' : '')
       + '</div>';

  html += '<div class="kg" style="grid-template-columns:repeat(6,1fr);margin-bottom:14px;" id="kg-est-novo"></div>';

  html += '<div class="cc"><div class="cct">Distribuição por status</div>'
       +    '<div class="ccs">SKUs e capital imobilizado por classificação de giro</div>'
       +    '<div style="height:280px;margin-top:8px;"><canvas id="c-est-status"></canvas></div>'
       + '</div>';

  // Estoque por departamento · tabela hierárquica drill-down
  // Estrutura: agregar por (depto.cod) → (secao.cod) → (categoria.cod)
  // a partir de E.produtos. Mostra Estoque a custo + Estoque a preço de venda.
  // O usuário expande um depto pra ver suas seções e cada seção pra ver categorias.
  html += '<div class="cc"><div class="cct">Estoque por departamento</div>'
       +    '<div class="ccs">Clique no departamento para ver seções, depois categorias. Valor em <strong>custo</strong> e em <strong>preço de venda</strong>.</div>'
       +    '<div id="est-hier-table" style="margin-top:10px;"></div>'
       + '</div>';

  const skus = (E.produtos || []).slice().sort(function(a,b){return (b.estoque?b.estoque.vl_custo:0) - (a.estoque?a.estoque.vl_custo:0);});
  const top30 = skus.slice(0, 30);
  html += '<div class="cc"><div class="cct">Top 30 SKUs · maior valor em estoque</div>'
       +    '<div class="tscroll" style="margin-top:8px;"><table class="t"><thead><tr>'
       +      '<th class="L" style="width:24px;">#</th>'
       +      '<th class="L">Produto</th>'
       +      '<th>Depto</th>'
       +      '<th>Qt estoque</th>'
       +      '<th>Vl custo</th>'
       +      '<th>Vl venda</th>'
       +      '<th>Giro (dias)</th>'
       +      '<th>Status</th>'
       +    '</tr></thead><tbody>';
  top30.forEach(function(p, i){
    const e = p.estoque || {};
    const cls = p.status==='ATIVO'?'ok':p.status==='CRITICO'?'wn':p.status==='PARADO'?'wn':p.status==='MORTO'?'dn':'';
    html += '<tr>'
         +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
         +    '<td class="L" data-prod-cod="'+esc(p.cod)+'" title="Clique para ver diagnóstico do produto"><strong>'+esc((p.desc||'').substring(0,42))+'</strong></td>'
         +    '<td>'+esc((p.depto&&p.depto.nome)||'-')+'</td>'
         +    '<td>'+fI(e.qt||0)+'</td>'
         +    '<td class="val-strong">'+fK(e.vl_custo||0)+'</td>'
         +    '<td>'+fK(e.vl_preco||0)+'</td>'
         +    '<td>'+(p.giro_dias?p.giro_dias.toFixed(0):'-')+'</td>'
         +    '<td><span class="kg-tag '+cls+'">'+esc(p.status||'-')+'</span></td>'
         +  '</tr>';
  });
  html += '</tbody></table></div></div>';

  html += '</div>';
  cont.innerHTML = html;

  const teCusto = r.vl_custo || r.vl_custo_total || 0;
  const tePreco = r.vl_preco || r.vl_preco_total || r.vl_venda_total || 0;
  const acima = teCusto > 0 ? ((tePreco - teCusto) / teCusto * 100) : 0;
  document.getElementById('kg-est-novo').innerHTML = kgHtml([
    {l:'Valor a custo',v:fK(teCusto),s:'Total imobilizado em estoque'},
    {l:'Valor a preço de venda',v:tePreco>0?fK(tePreco):'—',s:tePreco>0?(fP(acima)+' acima do custo'):'sem dados',cls:'vio'},
    {l:'Margem potencial',v:tePreco>0?fK(tePreco-teCusto):'—',s:'Se vender tudo pelo preço tabela',cls:'up'},
    {l:'SKUs em estoque',v:fI(r.skus_total||0),s:'Total cadastrado'},
    {l:'SKUs ativos',v:fI((r.por_status&&r.por_status.ATIVO&&r.por_status.ATIVO.skus)||0),s:'Com giro normal',cls:'ok'},
    {l:'SKUs parados/mortos',v:fI(((r.por_status&&r.por_status.PARADO&&r.por_status.PARADO.skus)||0)+((r.por_status&&r.por_status.MORTO&&r.por_status.MORTO.skus)||0)),s:'Sem giro · candidatos a desova',cls:'dn'},
  ]);

  const statusOrder = ['ATIVO','CRITICO','PARADO','MORTO','ZERADO'];
  const statusCols = {ATIVO:_PAL.ok, CRITICO:_PAL.wn, PARADO:_PAL.hl, MORTO:_PAL.dn, ZERADO:'#94a3b8'};
  const stData = statusOrder.map(function(s){return r.por_status&&r.por_status[s]?r.por_status[s].vl_custo:0;});
  const stLabels = statusOrder.map(function(s){return s+' ('+fI(r.por_status&&r.por_status[s]?r.por_status[s].skus:0)+' SKUs)';});
  const stCols = statusOrder.map(function(s){return statusCols[s];});
  mkC('c-est-status',{type:'doughnut',
    data:{labels:stLabels,datasets:[{data:stData,backgroundColor:stCols,borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{position:'right',labels:{padding:8,usePointStyle:true,boxWidth:8,font:{size:10}}},
               tooltip:{callbacks:{label:function(ctx){return ctx.label+': '+fK(ctx.raw)+(teCusto>0?' ('+fP(ctx.raw/teCusto*100)+')':'');}}}}}});

  // ─── Tabela hierárquica de estoque (depto → seção → categoria) ───
  // Pré-calcula a hierarquia uma vez. Estado de expansão fica em window._estHierExp.
  if(!window._estHierExp) window._estHierExp = {deptos:new Set(), secoes:new Set()};
  const _hier = (function(){
    const deptos = new Map();
    (E.produtos||[]).forEach(function(p){
      if(!p.estoque) return;
      const d = p.depto || {cod:'?',nome:'(sem depto)'};
      const s = p.secao || {cod:'?',nome:'(sem seção)'};
      const c = p.categoria || {cod:'?',nome:'(sem categoria)'};
      if(!deptos.has(d.cod)) deptos.set(d.cod, {cod:d.cod, nome:d.nome, vl_custo:0, vl_preco:0, qt:0, skus:0, secoes:new Map()});
      const dN = deptos.get(d.cod);
      dN.vl_custo += p.estoque.vl_custo||0;
      dN.vl_preco += p.estoque.vl_preco||0;
      dN.qt       += p.estoque.qt||0;
      dN.skus     += 1;
      if(!dN.secoes.has(s.cod)) dN.secoes.set(s.cod, {cod:s.cod, nome:s.nome, vl_custo:0, vl_preco:0, qt:0, skus:0, cats:new Map()});
      const sN = dN.secoes.get(s.cod);
      sN.vl_custo += p.estoque.vl_custo||0;
      sN.vl_preco += p.estoque.vl_preco||0;
      sN.qt       += p.estoque.qt||0;
      sN.skus     += 1;
      if(!sN.cats.has(c.cod)) sN.cats.set(c.cod, {cod:c.cod, nome:c.nome, vl_custo:0, vl_preco:0, qt:0, skus:0});
      const cN = sN.cats.get(c.cod);
      cN.vl_custo += p.estoque.vl_custo||0;
      cN.vl_preco += p.estoque.vl_preco||0;
      cN.qt       += p.estoque.qt||0;
      cN.skus     += 1;
    });
    return Array.from(deptos.values()).sort(function(a,b){return b.vl_custo-a.vl_custo;});
  })();

  function _renderEstHier(){
    const exp = window._estHierExp;
    let h = '<table class="t" style="font-size:12px;"><thead><tr>'
          + '<th class="L">Departamento / Seção / Categoria</th>'
          + '<th>SKUs</th>'
          + '<th>Estoque (custo)</th>'
          + '<th>Estoque (preço venda)</th>'
          + '<th>Markup</th>'
          + '</tr></thead><tbody>';
    _hier.forEach(function(d){
      const dExp = exp.deptos.has(d.cod);
      const dMk = d.vl_custo>0 ? ((d.vl_preco-d.vl_custo)/d.vl_custo*100) : 0;
      h += '<tr style="cursor:pointer;background:var(--surface-2);font-weight:600;" data-est-depto="'+esc(d.cod)+'">'
        +    '<td class="L"><span style="display:inline-block;width:14px;text-align:center;color:var(--accent);">'+(dExp?'▼':'▶')+'</span> '+esc(d.nome)+'</td>'
        +    '<td>'+fI(d.skus)+'</td>'
        +    '<td class="val-strong">'+fK(d.vl_custo)+'</td>'
        +    '<td>'+fK(d.vl_preco)+'</td>'
        +    '<td>'+fP(dMk)+'</td>'
        +  '</tr>';
      if(dExp){
        const secs = Array.from(d.secoes.values()).sort(function(a,b){return b.vl_custo-a.vl_custo;});
        secs.forEach(function(s){
          const sKey = d.cod+'/'+s.cod;
          const sExp = exp.secoes.has(sKey);
          const sMk = s.vl_custo>0 ? ((s.vl_preco-s.vl_custo)/s.vl_custo*100) : 0;
          h += '<tr style="cursor:pointer;" data-est-secao="'+esc(sKey)+'">'
            +    '<td class="L" style="padding-left:32px;"><span style="display:inline-block;width:14px;text-align:center;color:var(--text-muted);">'+(sExp?'▼':'▶')+'</span> '+esc(s.nome)+'</td>'
            +    '<td>'+fI(s.skus)+'</td>'
            +    '<td>'+fK(s.vl_custo)+'</td>'
            +    '<td>'+fK(s.vl_preco)+'</td>'
            +    '<td>'+fP(sMk)+'</td>'
            +  '</tr>';
          if(sExp){
            const cats = Array.from(s.cats.values()).sort(function(a,b){return b.vl_custo-a.vl_custo;});
            cats.forEach(function(c){
              const cMk = c.vl_custo>0 ? ((c.vl_preco-c.vl_custo)/c.vl_custo*100) : 0;
              h += '<tr style="color:var(--text-muted);">'
                +    '<td class="L" style="padding-left:60px;font-size:11.5px;">└ '+esc(c.nome)+'</td>'
                +    '<td>'+fI(c.skus)+'</td>'
                +    '<td>'+fK(c.vl_custo)+'</td>'
                +    '<td>'+fK(c.vl_preco)+'</td>'
                +    '<td>'+fP(cMk)+'</td>'
                +  '</tr>';
            });
          }
        });
      }
    });
    h += '</tbody></table>';
    const cont = document.getElementById('est-hier-table');
    if(cont){
      cont.innerHTML = h;
      cont.querySelectorAll('[data-est-depto]').forEach(function(tr){
        tr.addEventListener('click', function(){
          const k = tr.getAttribute('data-est-depto');
          if(exp.deptos.has(k)) exp.deptos.delete(k); else exp.deptos.add(k);
          _renderEstHier();
        });
      });
      cont.querySelectorAll('[data-est-secao]').forEach(function(tr){
        tr.addEventListener('click', function(ev){
          ev.stopPropagation();
          const k = tr.getAttribute('data-est-secao');
          if(exp.secoes.has(k)) exp.secoes.delete(k); else exp.secoes.add(k);
          _renderEstHier();
        });
      });
    }
  }
  _renderEstHier();
}

// ════════════════════════════════════════════════════════════════════════
// EXCESSO DE ESTOQUE NOVO · usa estoque_atp.json (E) · sub-etapa 4i
// ════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════
// Helper: cálculo de giro_dias pelo método "Maior mês de venda"
// Lê meta.ultimo_mes_vendas {ym, aberto, dias_corridos} e produto.vendas_por_mes
// Regra:
//  1. Pega 3 últimos meses fechados + mês atual (se aberto)
//  2. Vencedor = mês com maior qtde
//  3. Se vencedor é fechado → giro = qt/30
//  4. Se vencedor é mês atual → giro = qt/dias_corridos
//  5. Se mês atual tem <5 dias, ignora ele
// Retorna: {giro_dias, vencedor_ym, vencedor_qt, metodo} ou null se sem dados
// ════════════════════════════════════════════════════════════════════
function _calcularGiroMaiorMes(produto, ultimoMesInfo){
  if(!produto || !produto.vendas_por_mes || !produto.vendas_por_mes.length) return null;
  if(!ultimoMesInfo || !ultimoMesInfo.ym) return null;

  const ultYm = ultimoMesInfo.ym;
  const ultAberto = ultimoMesInfo.aberto !== false;
  const diasCorr = Number(ultimoMesInfo.dias_corridos || 0);
  // Calcula os 3 meses fechados anteriores (sequenciais ao último)
  function ymPrev(ym, n){
    const ano = parseInt(ym.substring(0,4), 10);
    const mes = parseInt(ym.substring(5,7), 10);
    let m = mes - n;
    let a = ano;
    while(m <= 0){ m += 12; a -= 1; }
    return a + '-' + (m < 10 ? '0' : '') + m;
  }

  // Define os 3 fechados de referência:
  // se últimoMes está aberto → fechados são (último - 1), (último - 2), (último - 3)
  // se últimoMes está fechado → fechados são último, (último - 1), (último - 2)
  const fechados = [];
  if(ultAberto){
    fechados.push(ymPrev(ultYm, 1));
    fechados.push(ymPrev(ultYm, 2));
    fechados.push(ymPrev(ultYm, 3));
  } else {
    fechados.push(ultYm);
    fechados.push(ymPrev(ultYm, 1));
    fechados.push(ymPrev(ultYm, 2));
  }

  const ignorarMesAtual = ultAberto && diasCorr < 5;

  // Lookup rápido em vendas_por_mes
  const mapVendas = new Map();
  produto.vendas_por_mes.forEach(function(v){ mapVendas.set(v.ym, v.qt || 0); });

  // Candidatos: mês atual (se aberto e não ignorado) + 3 fechados
  const candidatos = [];
  if(ultAberto && !ignorarMesAtual){
    candidatos.push({ym:ultYm, qt:mapVendas.get(ultYm) || 0, aberto:true});
  }
  fechados.forEach(function(ym){
    candidatos.push({ym:ym, qt:mapVendas.get(ym) || 0, aberto:false});
  });

  // Vencedor = maior qt
  if(!candidatos.length) return null;
  let vencedor = candidatos[0];
  for(let i = 1; i < candidatos.length; i++){
    if(candidatos[i].qt > vencedor.qt) vencedor = candidatos[i];
  }

  // Sem venda em nenhum dos meses → produto parado/morto, sem giro
  if(!vencedor || vencedor.qt <= 0){
    return {giro_dia:0, vencedor_ym:null, vencedor_qt:0, metodo:'sem_venda'};
  }

  // Calcula giro/dia conforme regra
  const divisor = vencedor.aberto ? Math.max(1, diasCorr) : 30;
  const giro_dia = vencedor.qt / divisor;

  return {
    giro_dia: giro_dia,
    vencedor_ym: vencedor.ym,
    vencedor_qt: vencedor.qt,
    aberto: vencedor.aberto,
    divisor: divisor,
    metodo: vencedor.aberto ? 'mes_atual' : 'mes_fechado'
  };
}

// Retorna o método de cálculo ativo (persistido em localStorage)
function _getMetodoExcesso(){
  try {
    const v = localStorage.getItem('metodo_excesso_v1');
    if(v === 'maior_mes' || v === 'winthor') return v;
  } catch(e){}
  return 'winthor'; // default
}
function _setMetodoExcesso(m){
  try { localStorage.setItem('metodo_excesso_v1', m); } catch(e){}
}

function renderExcessoNovo(){
  const cont = document.getElementById('page-excesso');
  if(!cont || !E) return;
  const produtos = E.produtos || [];
  const metodo = _getMetodoExcesso();
  const ultimoMesInfo = (E.meta && E.meta.ultimo_mes_vendas) || null;

  // Quando método é "maior_mes", recalcula APENAS giro_dia (cobertura).
  // Status PARADO/MORTO/CRITICO sempre vem do ETL — são fatos sobre o produto
  // (vendeu ou não vendeu, há quanto tempo) e não dependem do método de cálculo de giro.
  // O método só afeta a métrica de cobertura (quantos dias o estoque vai durar)
  // e por consequência quais SKUs entram na lista de "excesso por giro".
  if(metodo === 'maior_mes'){
    produtos.forEach(function(p){
      const r = _calcularGiroMaiorMes(p, ultimoMesInfo);
      if(!r){ p.__giro_dia_novo = p.giro_dias || 0; p.__calc_novo = null; return; }
      p.__calc_novo = r;
      const estQt = (p.estoque && p.estoque.qt) || 0;
      if(r.giro_dia > 0){
        p.__giro_dia_novo = estQt / r.giro_dia;
      } else {
        p.__giro_dia_novo = estQt > 0 ? 9999 : 0;
      }
    });
  } else {
    produtos.forEach(function(p){ p.__giro_dia_novo = null; p.__calc_novo = null; });
  }

  // Status SEMPRE vem do ETL (estável entre métodos)
  function _giro(p){ return metodo === 'maior_mes' ? (p.__giro_dia_novo||0) : (p.giro_dias||0); }
  function _status(p){ return p.status; }

  const excessos = produtos.filter(function(p){
    const st = _status(p);
    if(['PARADO','MORTO','CRITICO'].indexOf(st)>=0) return true;
    const g = _giro(p);
    if(g && g > 180) return true;
    return false;
  });

  let totVlCusto = 0, totVlPreco = 0;
  excessos.forEach(function(p){
    if(p.estoque){ totVlCusto += p.estoque.vl_custo||0; totVlPreco += p.estoque.vl_preco||0; }
  });
  const skusTotal = E.resumo ? E.resumo.skus_total : 0;
  // Calcula vl_custo total do estoque. Se ausente no resumo (caso de cubos
  // consolidados/CP), reconstrói a partir de por_status.
  let vlCustoTotal = 0;
  if(E.resumo && typeof E.resumo.vl_custo === 'number'){
    vlCustoTotal = E.resumo.vl_custo;
  } else if(E.resumo && E.resumo.por_status){
    Object.values(E.resumo.por_status).forEach(function(s){
      vlCustoTotal += (s && s.vl_custo) || 0;
    });
  }

  let html = '<div class="ph"><div class="pk">Compras</div><h2>Excesso de estoque</h2></div>'
           + '<div class="ph-sep"></div>'
           + '<div class="page-body">';

  // Toggle de método de cálculo no topo
  const ultMesTxt = ultimoMesInfo ? (_ymToLabel(ultimoMesInfo.ym) + (ultimoMesInfo.aberto ? ' aberto · '+ultimoMesInfo.dias_corridos+' dias' : ' fechado')) : '?';
  const semDadosNovo = !ultimoMesInfo;
  html += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">'
       +   '<strong style="font-size:12px;">Método de cálculo:</strong>'
       +   '<div role="group" style="display:inline-flex;border:1px solid var(--border);border-radius:5px;overflow:hidden;">'
       +     '<button id="exc-met-w" data-met="winthor" style="padding:5px 12px;border:none;font-size:11.5px;cursor:pointer;'
       +       (metodo==='winthor'?'background:var(--accent);color:white;':'background:var(--surface);color:var(--text);')+'">Cálculo Winthor</button>'
       +     '<button id="exc-met-m" data-met="maior_mes" style="padding:5px 12px;border:none;font-size:11.5px;cursor:pointer;border-left:1px solid var(--border);'
       +       (metodo==='maior_mes'?'background:var(--accent);color:white;':'background:var(--surface);color:var(--text);')
       +       (semDadosNovo?'opacity:0.5;cursor:not-allowed;':'')+'"'
       +       (semDadosNovo?' disabled title="Dados do ETL não disponíveis"':'')+'>Maior mês de venda</button>'
       +   '</div>';
  if(metodo === 'maior_mes'){
    html += '<span style="font-size:11px;color:var(--text-muted);">Último mês: '+esc(ultMesTxt)+'</span>';
  }
  html += '</div>';

  // Banner explicativo do método
  if(metodo === 'maior_mes'){
    html += '<div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:11.5px;color:#1e3a8a;line-height:1.5;">'
         +   '<strong>Como funciona:</strong> compara qtde vendida nos 3 últimos meses fechados com o mês atual e usa o <strong>maior</strong> como referência. '
         +   'Se vencedor é mês fechado, divide por 30 dias. Se é o mês atual, divide pelos dias corridos. '
         +   'Mês atual com menos de 5 dias é ignorado.'
         + '</div>';
  }
  // (banner antigo "Critério: SKUs com status PARADO..." removido conforme solicitado)

  const pctSku = skusTotal>0?(excessos.length/skusTotal*100):0;
  const pctVl = vlCustoTotal>0?(totVlCusto/vlCustoTotal*100):null;
  html += '<div class="kg" style="grid-template-columns:repeat(6,1fr);margin-bottom:14px;" id="kg-exc-novo"></div>';

  // ── Excesso por fornecedor (top 50) ──
  // Agrupa os SKUs em excesso por fornecedor, soma valor imobilizado e SKUs
  const fornMap = new Map();
  excessos.forEach(function(p){
    const fCod = (p.fornecedor && p.fornecedor.cod) || 0;
    const fNm = (p.fornecedor && p.fornecedor.nome) || '(sem fornecedor)';
    if(!fornMap.has(fCod)){
      fornMap.set(fCod, {cod:fCod, nome:fNm, skus:0, vl_custo:0, vl_preco:0, parados:0, mortos:0, criticos:0});
    }
    const e = fornMap.get(fCod);
    e.skus += 1;
    if(p.estoque){
      e.vl_custo += p.estoque.vl_custo || 0;
      e.vl_preco += p.estoque.vl_preco || 0;
    }
    const stP = _status(p);
    if(stP === 'PARADO') e.parados += 1;
    else if(stP === 'MORTO') e.mortos += 1;
    else if(stP === 'CRITICO') e.criticos += 1;
  });
  const fornsExc = Array.from(fornMap.values())
    .filter(function(f){return f.vl_custo > 0;})
    .sort(function(a,b){return b.vl_custo - a.vl_custo;})
    .slice(0, 50);

  if(fornsExc.length){
    html += '<div class="cc" style="margin-bottom:14px;">'
         +    '<div class="cct">Excesso por fornecedor · top 50</div>'
         +    '<div class="ccs">'+fI(fornMap.size)+' fornecedores com SKUs em excesso · ordenados por valor imobilizado</div>'
         +    '<div class="tscroll" style="margin-top:8px;"><table class="t"><thead><tr>'
         +      '<th class="L" style="width:24px;">#</th>'
         +      '<th class="L">Fornecedor</th>'
         +      '<th>SKUs em excesso</th>'
         +      '<th>Vl imobilizado (custo)</th>'
         +      '<th>Vl em preço de venda</th>'
         +      '<th>Críticos</th>'
         +      '<th>Parados</th>'
         +      '<th>Mortos</th>'
         +    '</tr></thead><tbody>';
    fornsExc.forEach(function(f, i){
      html += '<tr>'
           +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
           +    '<td class="L" data-forn-cod="'+esc(f.cod)+'" title="Clique para ver diagnóstico do fornecedor"><strong>'+esc((f.nome||'').substring(0,50))+'</strong></td>'
           +    '<td>'+fI(f.skus)+'</td>'
           +    '<td class="val-strong">'+fK(f.vl_custo)+'</td>'
           +    '<td>'+fK(f.vl_preco)+'</td>'
           +    '<td>'+(f.criticos>0?'<span class="kg-tag wn">'+fI(f.criticos)+'</span>':fI(f.criticos))+'</td>'
           +    '<td>'+(f.parados>0?'<span class="kg-tag wn">'+fI(f.parados)+'</span>':fI(f.parados))+'</td>'
           +    '<td>'+(f.mortos>0?'<span class="kg-tag dn">'+fI(f.mortos)+'</span>':fI(f.mortos))+'</td>'
           +  '</tr>';
    });
    html += '</tbody></table></div></div>';
  }

  const top = excessos.slice().sort(function(a,b){return (b.estoque?b.estoque.vl_custo:0) - (a.estoque?a.estoque.vl_custo:0);}).slice(0, 100);
  html += '<div class="cc"><div class="cct">Top 100 · maior valor imobilizado</div>'
       +    '<div class="ccs">'+fI(excessos.length)+' SKUs em excesso · '+fK(totVlCusto)+' a custo</div>'
       +    '<div class="tscroll" style="margin-top:8px;"><table class="t"><thead><tr>'
       +      '<th class="L" style="width:24px;">#</th>'
       +      '<th class="L">Produto</th>'
       +      '<th>Depto</th>'
       +      '<th>Qt estoque</th>'
       +      '<th>Vl custo</th>'
       +      '<th title="Dias até esgotar o estoque atual no ritmo de venda">Dias p/ consumir</th>'
       +      '<th>Última entrada</th>'
       +      '<th>Status</th>'
       +    '</tr></thead><tbody>';
  top.forEach(function(p, i){
    const e = p.estoque || {};
    const stAtual = _status(p);
    const giroAtual = _giro(p);
    const cls = stAtual==='CRITICO'?'wn':stAtual==='PARADO'?'wn':stAtual==='MORTO'?'dn':'';
    const giro = giroAtual!=null && giroAtual>0 ? giroAtual.toFixed(0) : '-';
    // Tooltip com detalhe do cálculo se método é maior_mes
    let giroTooltip = '';
    if(metodo === 'maior_mes' && p.__calc_novo && p.__calc_novo.vencedor_ym){
      const c = p.__calc_novo;
      giroTooltip = ' title="Vencedor: '+c.vencedor_ym+' ('+fI(c.vencedor_qt)+' un · '+(c.aberto?'mês atual, '+c.divisor+'d':'mês fechado, 30d')+') → giro/dia: '+c.giro_dia.toFixed(2)+'"';
    }
    html += '<tr>'
         +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
         +    '<td class="L" data-prod-cod="'+esc(p.cod)+'" title="Clique para ver diagnóstico do produto"><strong>'+esc((p.desc||'').substring(0,40))+'</strong></td>'
         +    '<td>'+esc((p.depto&&p.depto.nome)||'-')+'</td>'
         +    '<td>'+fI(e.qt||0)+'</td>'
         +    '<td class="val-strong">'+fK(e.vl_custo||0)+'</td>'
         +    '<td'+giroTooltip+'>'+giro+'</td>'
         +    '<td>'+esc(e.dt_ult_entrada||'-')+'</td>'
         +    '<td><span class="kg-tag '+cls+'">'+esc(stAtual||'-')+'</span></td>'
         +  '</tr>';
  });
  html += '</tbody></table></div></div>';

  html += '</div>';
  cont.innerHTML = html;

  // Bind toggle de método
  document.querySelectorAll('#exc-met-w, #exc-met-m').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(btn.disabled) return;
      const m = btn.getAttribute('data-met');
      if(m === metodo) return;
      _setMetodoExcesso(m);
      // Re-renderiza a página
      renderExcessoNovo();
    });
  });

  document.getElementById('kg-exc-novo').innerHTML = kgHtml([
    {l:'SKUs em excesso',v:fI(excessos.length),s:fP(pctSku)+' do total cadastrado',cls:'dn'},
    {l:'Vl imobilizado (custo)',v:fK(totVlCusto),s:(pctVl!==null?fP(pctVl)+' do estoque total':'estoque total não disponível'),cls:'dn'},
    {l:'Vl em preço de venda',v:fK(totVlPreco),s:'Se desovasse a preço cheio'},
    {l:'Status PARADO',v:fI(excessos.filter(function(p){return _status(p)==='PARADO';}).length),s:'Sem venda > 90 dias',cls:'wn'},
    {l:'Status MORTO',v:fI(excessos.filter(function(p){return _status(p)==='MORTO';}).length),s:'Sem venda > 180 dias',cls:'dn'},
    {l:'Status CRÍTICO',v:fI(excessos.filter(function(p){return _status(p)==='CRITICO';}).length),s:'Risco iminente',cls:'wn'},
  ]);

  // Pin: imobilizado em excesso
  if(typeof _pinRegistrar === 'function'){
    const _captExc = {totVlCusto:totVlCusto, qtdExc:excessos.length, pctSku:pctSku};
    _pinRegistrar('kpi-excesso-imobilizado', 'Excesso · valor imobilizado', 'excesso-novo', function(c){
      c.innerHTML = '<div style="font-size:24px;font-weight:800;color:#dc2626;">'+fK(_captExc.totVlCusto)+'</div>'
        + '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">'+fI(_captExc.qtdExc)+' SKUs · '+fP(_captExc.pctSku)+' do cadastro</div>';
    });
    setTimeout(function(){
      const kg = document.getElementById('kg-exc-novo');
      if(!kg) return;
      const card = kg.querySelectorAll('.kc')[1];
      if(!card || card.querySelector('.pin-btn')) return;
      card.style.position = 'relative';
      const btn = document.createElement('div');
      btn.style.cssText = 'position:absolute;top:6px;right:6px;';
      btn.innerHTML = _pinBotao('kpi-excesso-imobilizado');
      card.appendChild(btn);
      _pinAtualizarBotoes();
    }, 50);
  }

  const statusOrder = ['CRITICO','PARADO','MORTO'];
  const stCounts = statusOrder.map(function(s){return excessos.filter(function(p){return _status(p)===s;}).length;});
  const stVl = statusOrder.map(function(s){return excessos.filter(function(p){return _status(p)===s;}).reduce(function(t,p){return t+(p.estoque?p.estoque.vl_custo:0);},0);});
  mkC('c-exc-status',{type:'bar',
    data:{labels:statusOrder,datasets:[
      {label:'SKUs (qtde)',data:stCounts,backgroundColor:_PAL.ac+'CC',borderRadius:4,yAxisID:'yQt'},
      {label:'Valor a custo',data:stVl,backgroundColor:_PAL.dn+'CC',borderRadius:4,yAxisID:'yVl'}
    ]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{position:'top',labels:{padding:6,usePointStyle:true,boxWidth:8,font:{size:10}}}},
      scales:{
        yQt:{type:'linear',position:'left',ticks:{callback:function(v){return fI(v);}},title:{display:true,text:'SKUs'}},
        yVl:{type:'linear',position:'right',grid:{display:false},ticks:{callback:function(v){return fAbbr(v);}},title:{display:true,text:'R$ a custo'}}
      }}});
}

// ════════════════════════════════════════════════════════════════════════
// CURVA ABC NOVA · usa estoque_atp.json (E) · sub-etapa 4i
// ════════════════════════════════════════════════════════════════════════
// Estado ABC: modo de ranking + meses filtrados.
// Modo "valor": ranking por faturamento (12m total, sem filtro de mês).
// Modo "qt": ranking por quantidade vendida — permite filtrar meses específicos.
let _abcModo = 'valor'; // 'valor' | 'qt'
let _abcMesesSel = null; // null = todos · array de YMs = só esses

function renderABCNovo(){
  const cont = document.getElementById('page-abc');
  if(!cont || !E) return;
  const produtos = E.produtos || [];

  // YMs disponíveis (vindos de vendas_por_mes) — RESTRINGE A 2026
  const ymsSet = {};
  produtos.forEach(function(p){
    (p.vendas_por_mes||[]).forEach(function(v){
      if(v.ym && v.ym.indexOf('2026') === 0) ymsSet[v.ym] = true;
    });
  });
  const ymsTodos = Object.keys(ymsSet).sort();

  // Se _abcMesesSel é null, considera todos os meses de 2026.
  const mesesAtivos = (Array.isArray(_abcMesesSel) && _abcMesesSel.length)
    ? _abcMesesSel.filter(function(ym){return ymsSet[ym];}) // só aceita meses de 2026
    : ymsTodos;
  const mesesSet = new Set(mesesAtivos.length ? mesesAtivos : ymsTodos);

  // Calcula ranking de acordo com o modo
  // No modo "valor" agora também acumulamos só os meses selecionados de 2026.
  // Limitação: vendas_por_mes só traz QT (sem valor). Pra "valor" usamos
  // p.vendas.valor (12m total) — mas se o usuário filtrar meses, recalculamos
  // proporcionalmente: valor_estimado = vendas.valor * (qt_periodo / qt_12m).
  // Isso é uma estimativa enquanto o ETL não exporta valor por mês.
  let comVenda, ordenado, totalGeral;
  if(_abcModo === 'qt'){
    // Ranking por quantidade vendida nos meses selecionados (de 2026)
    comVenda = produtos.map(function(p){
      const qtPeriodo = (p.vendas_por_mes||[]).reduce(function(s,v){
        return s + (mesesSet.has(v.ym) ? (v.qt||0) : 0);
      }, 0);
      return {p:p, _qtPeriodo:qtPeriodo};
    }).filter(function(x){return x._qtPeriodo > 0;});
    ordenado = comVenda.slice().sort(function(a,b){return b._qtPeriodo - a._qtPeriodo;});
    totalGeral = ordenado.reduce(function(t,x){return t + x._qtPeriodo;}, 0);
    let acum = 0;
    ordenado.forEach(function(x){
      acum += x._qtPeriodo;
      x._pctAcum = totalGeral>0?(acum/totalGeral*100):0;
      x._classe = x._pctAcum<=80?'A':x._pctAcum<=95?'B':'C';
    });
  } else {
    // Modo valor (faturamento). Estima valor 2026 a partir da proporção
    // qt_periodo / qt_12m_total * vendas.valor.
    comVenda = produtos.map(function(p){
      const vds = p.vendas || {};
      const valor12m = vds.valor || 0;
      const qt12m = vds.qt || 0;
      const qtPeriodo = (p.vendas_por_mes||[]).reduce(function(s,v){
        return s + (mesesSet.has(v.ym) ? (v.qt||0) : 0);
      }, 0);
      let valEstimado = 0;
      if(qt12m > 0 && valor12m > 0){
        valEstimado = valor12m * (qtPeriodo / qt12m);
      }
      return {p:p, _valEstimado:valEstimado, _qtPeriodo:qtPeriodo};
    }).filter(function(x){return x._valEstimado > 0;});
    ordenado = comVenda.slice().sort(function(a,b){return b._valEstimado - a._valEstimado;});
    totalGeral = ordenado.reduce(function(t,x){return t + x._valEstimado;}, 0);
    let acum = 0;
    ordenado.forEach(function(x){
      acum += x._valEstimado;
      x._pctAcum = totalGeral>0?(acum/totalGeral*100):0;
      x._classe = x._pctAcum<=80?'A':x._pctAcum<=95?'B':'C';
    });
  }

  const cA = ordenado.filter(function(x){return x._classe==='A';});
  const cB = ordenado.filter(function(x){return x._classe==='B';});
  const cC = ordenado.filter(function(x){return x._classe==='C';});

  function sumEst(arr){return arr.reduce(function(t,x){return t+(x.p.estoque?x.p.estoque.vl_custo:0);},0);}
  const vlA = sumEst(cA), vlB = sumEst(cB), vlC = sumEst(cC);

  const isQt = _abcModo === 'qt';
  const labelMes = (mesesAtivos.length === ymsTodos.length)
    ? 'todos os meses de 2026'
    : mesesAtivos.length+' de '+ymsTodos.length+' meses de 2026';
  const subTitleSufixo = isQt
    ? ' · ranking por quantidade · '+labelMes
    : ' · ranking por faturamento estimado · '+labelMes;

  let html = '<div class="ph"><div class="pk">Compras</div><h2>Curva ABC · '+fI(comVenda.length)+' SKUs com venda<span style="font-size:11px;color:var(--text-muted);font-weight:400;display:block;margin-top:2px;">'+esc(subTitleSufixo)+'</span></h2></div>'
           + '<div class="ph-sep"></div>'
           + '<div class="page-body">';

  // ── Toggle modo + filtro de mês ──
  html += '<div class="cc" style="padding:12px 14px;margin-bottom:12px;">';
  html += '<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;">';
  // Toggle modo
  html += '<div style="display:flex;align-items:center;gap:8px;">';
  html += '<span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Ranking por:</span>';
  html += '<div style="display:inline-flex;border:1px solid var(--border-strong);border-radius:6px;overflow:hidden;">';
  html += '<button class="abc-modo-btn" data-modo="valor" style="padding:6px 12px;font-size:12px;border:none;cursor:pointer;background:'+(isQt?'transparent':'var(--accent)')+';color:'+(isQt?'var(--text)':'white')+';font-weight:600;">Faturamento</button>';
  html += '<button class="abc-modo-btn" data-modo="qt" style="padding:6px 12px;font-size:12px;border:none;cursor:pointer;background:'+(isQt?'var(--accent)':'transparent')+';color:'+(isQt?'white':'var(--text)')+';font-weight:600;border-left:1px solid var(--border-strong);">Quantidade</button>';
  html += '</div>';
  html += '</div>';

  // Filtro de meses (sempre disponível agora, em ambos os modos, modelo CV)
  html += '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:280px;flex-wrap:wrap;">';
  html += '<span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Período:</span>';
  ymsTodos.forEach(function(ym){
    const ativo = mesesSet.has(ym);
    html += '<button class="abc-mes-btn" data-ym="'+esc(ym)+'" style="padding:5px 10px;font-size:11.5px;border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;'
         +   (ativo?'background:var(--accent);color:white;':'background:var(--surface);color:var(--text);')
         + 'font-weight:600;">'+esc(_ymToLabel(ym))+'</button>';
  });
  if(mesesAtivos.length !== ymsTodos.length){
    html += '<button id="abc-meses-clear" style="padding:5px 8px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Limpar</button>';
  }
  html += '</div>';
  html += '</div>';

  // Aviso sobre estimativa no modo Faturamento
  if(!isQt){
    html += '<div style="margin-top:10px;font-size:11.5px;color:var(--text-dim);font-style:italic;">'
         +   'Modo Faturamento: o ETL atual exporta valor de venda apenas no agregado dos 12 meses. '
         +   'Para acumular só 2026, o sistema estima o valor proporcional pela quantidade vendida no período. '
         +   'É uma aproximação — para números exatos por mês, use o modo Quantidade.'
         + '</div>';
  }
  html += '</div>';

  // ── Card de critério ──
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       + '<strong>Critério:</strong> SKUs ordenados por '+(isQt?'quantidade vendida':'faturamento')+'. <strong>A</strong> = primeiros 80% do '+(isQt?'volume':'faturamento')+' · '
       + '<strong>B</strong> = próximos 15% (até 95%) · <strong>C</strong> = restante (5%). '
       + 'Total '+(isQt?'de unidades':'faturado')+' considerado: <strong>'+(isQt?fI(totalGeral)+' un':fK(totalGeral))+'</strong>.'
       + '</div>';

  html += '<div class="kg" style="grid-template-columns:repeat(6,1fr);margin-bottom:14px;" id="kg-abc-novo"></div>';

  html += '<div class="cc"><div class="cct">Composição por classe</div>'
       +    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px;">';
  [['A',cA,vlA,_PAL.ok],['B',cB,vlB,_PAL.hl],['C',cC,vlC,_PAL.dn]].forEach(function(t){
    const cls = t[0], arr = t[1], vl = t[2], color = t[3];
    const tot = arr.reduce(function(s,x){return s + (isQt ? x._qtPeriodo : (x._valEstimado||0));}, 0);
    const pctSku = comVenda.length>0?(arr.length/comVenda.length*100):0;
    const pctTot = totalGeral>0?(tot/totalGeral*100):0;
    html += '<div style="background:var(--surface-2);border-left:4px solid '+color+';padding:12px 14px;border-radius:6px;">'
         +    '<div style="font-size:24px;font-weight:800;color:'+color+';">Classe '+cls+'</div>'
         +    '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">SKUs</div>'
         +    '<div style="font-size:18px;font-weight:700;color:var(--text);">'+fI(arr.length)+' <span style="font-size:11px;color:var(--text-muted);font-weight:400;">('+fP(pctSku)+')</span></div>'
         +    '<div style="font-size:11px;color:var(--text-muted);margin-top:8px;">'+(isQt?'Quantidade':'Faturamento')+'</div>'
         +    '<div style="font-size:14px;font-weight:600;color:var(--text);">'+(isQt?fI(tot)+' un':fK(tot))+' <span style="font-size:11px;color:var(--text-muted);font-weight:400;">('+fP(pctTot)+')</span></div>'
         +    '<div style="font-size:11px;color:var(--text-muted);margin-top:8px;">Estoque a custo</div>'
         +    '<div style="font-size:14px;font-weight:600;color:var(--text);">'+fK(vl)+'</div>'
         +  '</div>';
  });
  html += '</div></div>';

  // Tabela Classe A
  html += '<div class="cc"><div class="cct">Classe A · '+fI(cA.length)+' SKUs (80% do '+(isQt?'volume':'faturamento')+')</div>'
       +    '<div class="tscroll" style="margin-top:8px;max-height:480px;overflow-y:auto;"><table class="t"><thead><tr>'
       +      '<th class="L" style="width:24px;">#</th>'
       +      '<th class="L">Produto</th>'
       +      '<th>Depto</th>'
       +      '<th>'+(isQt?'Qtde no período':'Faturamento')+'</th>'
       +      '<th>% acumulado</th>'
       +      '<th>Margem %</th>'
       +      '<th>Estoque (custo)</th>'
       +    '</tr></thead><tbody>';
  cA.slice(0, 100).forEach(function(x, i){
    const p = x.p;
    const e = p.estoque || {};
    const valExibido = isQt ? fI(x._qtPeriodo)+' un' : fK(p.vendas.valor||0);
    html += '<tr>'
         +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
         +    '<td class="L" data-prod-cod="'+esc(p.cod)+'" title="Clique para ver diagnóstico do produto"><strong>'+esc((p.desc||'').substring(0,40))+'</strong></td>'
         +    '<td>'+esc((p.depto&&p.depto.nome)||'-')+'</td>'
         +    '<td class="val-strong">'+valExibido+'</td>'
         +    '<td>'+fP(x._pctAcum||0)+'</td>'
         +    '<td>'+fP(p.vendas.marg||0)+'</td>'
         +    '<td>'+fK(e.vl_custo||0)+'</td>'
         +  '</tr>';
  });
  if(cA.length>100) html += '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);font-size:11px;padding:10px;">... e mais '+(cA.length-100)+' SKUs na classe A. Use a Análise Dinâmica do cubo para ver tudo.</td></tr>';
  html += '</tbody></table></div></div>';

  html += '</div>';
  cont.innerHTML = html;

  // KPIs
  document.getElementById('kg-abc-novo').innerHTML = kgHtml([
    {l:'SKUs com venda',v:fI(comVenda.length),s:isQt?'No período selecionado':'No período de '+(E.meta&&E.meta.periodo_vendas?E.meta.periodo_vendas.meses+' meses':'?')},
    {l:isQt?'Volume total':'Faturamento total',v:isQt?fI(totalGeral)+' un':fK(totalGeral),s:isQt?'Soma de unidades vendidas':'Soma de todos os SKUs'},
    {l:'Classe A',v:fI(cA.length)+' SKUs',s:fP(comVenda.length>0?cA.length/comVenda.length*100:0)+' do total · 80% do '+(isQt?'volume':'faturamento'),cls:'ok'},
    {l:'Classe B',v:fI(cB.length)+' SKUs',s:fP(comVenda.length>0?cB.length/comVenda.length*100:0)+' do total · 15% adicional',cls:'vio'},
    {l:'Classe C',v:fI(cC.length)+' SKUs',s:fP(comVenda.length>0?cC.length/comVenda.length*100:0)+' do total · só 5% do '+(isQt?'volume':'faturamento'),cls:'dn'},
    {l:'Cauda longa',v:fI(cC.length)+' SKUs',s:'Avalie descontinuação de itens classe C de baixo giro',cls:''},
  ]);

  // Bind toggle modo
  document.querySelectorAll('.abc-modo-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const novoModo = btn.getAttribute('data-modo');
      if(novoModo === _abcModo) return;
      _abcModo = novoModo;
      renderABCNovo();
    });
  });

  // Bind toggle de mês (botões inline modelo CV)
  document.querySelectorAll('.abc-mes-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const ym = btn.getAttribute('data-ym');
      // Se _abcMesesSel é null, considera todos selecionados; ao clicar, deseleciona o ym
      const atual = (_abcMesesSel && _abcMesesSel.length) ? _abcMesesSel.slice() : ymsTodos.slice();
      const idx = atual.indexOf(ym);
      if(idx >= 0) atual.splice(idx, 1);
      else atual.push(ym);
      // Se acabou deselecionando tudo, volta pra todos
      _abcMesesSel = atual.length === 0 ? null : atual;
      renderABCNovo();
    });
  });
  const btnClear = document.getElementById('abc-meses-clear');
  if(btnClear) btnClear.addEventListener('click', function(){ _abcMesesSel = null; renderABCNovo(); });

  const top100 = ordenado.slice(0, 100);
  mkC('c-abc-pareto',{
    type:'bar',
    data:{
      labels:top100.map(function(_,i){return (i+1).toString();}),
      datasets:[
        {label:isQt?'Quantidade':'Faturamento estimado (R$)',type:'bar',data:top100.map(function(x){return isQt?x._qtPeriodo:x._valEstimado;}),
         backgroundColor:top100.map(function(x){return x._classe==='A'?_PAL.ok+'CC':x._classe==='B'?_PAL.hl+'CC':_PAL.dn+'CC';}),
         yAxisID:'y'},
        {label:'% acumulado',type:'line',data:top100.map(function(x){return x._pctAcum;}),
         borderColor:_PAL.vi,backgroundColor:_PAL.vi+'33',tension:0.2,pointRadius:0,borderWidth:2,yAxisID:'y2'}
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{position:'top',labels:{padding:6,usePointStyle:true,boxWidth:8,font:{size:10}}},
               tooltip:{callbacks:{title:function(ctx){var i=ctx[0].dataIndex;return '#'+(i+1)+' '+(top100[i].p.desc||'').substring(0,40);},
                                   label:function(ctx){
                                     if(ctx.dataset.type==='line') return ctx.dataset.label+': '+fP(ctx.raw);
                                     return ctx.dataset.label+': '+(isQt?fI(ctx.raw)+' un':fK(ctx.raw));
                                   }}}},
      scales:{
        x:{ticks:{display:false},grid:{display:false},title:{display:true,text:'Posição (rank de '+(isQt?'volume':'faturamento')+')',font:{size:10}}},
        y:{position:'left',ticks:{callback:function(v){return isQt?fI(v):fAbbr(v);}},title:{display:true,text:isQt?'Unidades':'R$',font:{size:10}}},
        y2:{position:'right',min:0,max:100,grid:{display:false},ticks:{callback:function(v){return v+'%';}},title:{display:true,text:'% acumulado',font:{size:10}}}
      }}});
}

// Modal de seleção de meses pra modo qt
function _abcAbrirSeletorMeses(ymsTodos){
  const selecionados = new Set(_abcMesesSel || ymsTodos);

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
  let html = '<div style="background:white;border-radius:10px;max-width:480px;width:100%;padding:20px;box-shadow:0 10px 40px rgba(0,0,0,.3);">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">';
  html += '<h3 style="margin:0;font-size:16px;font-weight:700;">📅 Selecione os meses</h3>';
  html += '<button id="abcm-close" style="background:transparent;border:none;cursor:pointer;font-size:18px;color:var(--text-muted);">✕</button>';
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">Marque os meses que devem entrar no ranking de quantidade.</div>';
  html += '<div style="display:flex;gap:6px;margin-bottom:10px;">';
  html += '<button id="abcm-todos" style="padding:5px 10px;font-size:11px;border:1px solid var(--border-strong);border-radius:4px;background:white;cursor:pointer;">Todos</button>';
  html += '<button id="abcm-nenhum" style="padding:5px 10px;font-size:11px;border:1px solid var(--border-strong);border-radius:4px;background:white;cursor:pointer;">Nenhum</button>';
  html += '<button id="abcm-12m" style="padding:5px 10px;font-size:11px;border:1px solid var(--border-strong);border-radius:4px;background:white;cursor:pointer;">Últimos 12m</button>';
  html += '<button id="abcm-3m" style="padding:5px 10px;font-size:11px;border:1px solid var(--border-strong);border-radius:4px;background:white;cursor:pointer;">Últimos 3m</button>';
  html += '</div>';
  html += '<div style="max-height:280px;overflow-y:auto;border:1px solid var(--border);border-radius:6px;padding:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px;">';
  ymsTodos.forEach(function(ym){
    const checked = selecionados.has(ym);
    html += '<label style="display:flex;align-items:center;gap:6px;padding:4px 6px;cursor:pointer;font-size:12px;border-radius:4px;'+(checked?'background:#fef3c7;':'')+'">'
      + '<input type="checkbox" data-ym="'+esc(ym)+'" '+(checked?'checked':'')+' class="abcm-chk" style="cursor:pointer;">'
      + '<span style="font-family:JetBrains Mono,monospace;font-size:11px;">'+_ymToLabel(ym)+'</span>'
      + '</label>';
  });
  html += '</div>';
  html += '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">';
  html += '<button id="abcm-cancel" style="padding:8px 14px;background:white;color:var(--text);border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;font-size:12px;">Cancelar</button>';
  html += '<button id="abcm-apply" style="padding:8px 14px;background:var(--accent);color:white;border:none;border-radius:5px;cursor:pointer;font-size:12px;font-weight:700;">Aplicar</button>';
  html += '</div>';
  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);

  function close(){ overlay.remove(); }
  document.getElementById('abcm-close').addEventListener('click', close);
  document.getElementById('abcm-cancel').addEventListener('click', close);
  document.getElementById('abcm-todos').addEventListener('click', function(){
    overlay.querySelectorAll('.abcm-chk').forEach(function(c){c.checked = true; c.closest('label').style.background = '#fef3c7';});
  });
  document.getElementById('abcm-nenhum').addEventListener('click', function(){
    overlay.querySelectorAll('.abcm-chk').forEach(function(c){c.checked = false; c.closest('label').style.background = '';});
  });
  document.getElementById('abcm-12m').addEventListener('click', function(){
    const last12 = new Set(ymsTodos.slice(-12));
    overlay.querySelectorAll('.abcm-chk').forEach(function(c){
      const ok = last12.has(c.getAttribute('data-ym'));
      c.checked = ok;
      c.closest('label').style.background = ok ? '#fef3c7' : '';
    });
  });
  document.getElementById('abcm-3m').addEventListener('click', function(){
    const last3 = new Set(ymsTodos.slice(-3));
    overlay.querySelectorAll('.abcm-chk').forEach(function(c){
      const ok = last3.has(c.getAttribute('data-ym'));
      c.checked = ok;
      c.closest('label').style.background = ok ? '#fef3c7' : '';
    });
  });
  // toggle de fundo no clique
  overlay.querySelectorAll('.abcm-chk').forEach(function(c){
    c.addEventListener('change', function(){
      c.closest('label').style.background = c.checked ? '#fef3c7' : '';
    });
  });
  document.getElementById('abcm-apply').addEventListener('click', function(){
    const sel = Array.from(overlay.querySelectorAll('.abcm-chk:checked')).map(function(c){return c.getAttribute('data-ym');});
    if(sel.length === 0){
      alert('Selecione ao menos um mês.');
      return;
    }
    _abcMesesSel = (sel.length === ymsTodos.length) ? null : sel;
    overlay.remove();
    renderABCNovo();
  });
}

// ════════════════════════════════════════════════════════════════════════
// FORNECEDORES NOVO · usa estoque_atp.json (E) + devolucoes (Dev) · sub-etapa 4j
// Agrega E.produtos por fornecedor → compras 12m, vendas 16m, margem real,
// vl em estoque, devoluções (se Dev disponível).
// ════════════════════════════════════════════════════════════════════════
let _fornAggCache = null; // cache da agregação 12m (recalcula só quando dados mudam)
let _fornFiltroMeses = null; // null = 2026 inteiro · array = só esses meses 2026

/**
 * Agrega fornecedores filtrando por período. Usa o cubo (Cu) para reagregar
 * dados por (ym × fornecedor) tanto de vendas quanto de compras.
 * Retorna array com a mesma estrutura de _fornAgregar mas restrito aos meses.
 *
 * Se o cubo não estiver disponível (ou não tiver as dimensões necessárias),
 * cai pro _fornAgregar() padrão (12m).
 */
function _fornAgregarPorPeriodo(mesesSet){
  if(!Cu) return _fornAgregar();
  // Localiza fato_vendas e fato_compras + campos
  let fv, vCampos, fc, cCampos;
  if(Cu.fatos && Cu.fatos.vendas){
    fv = Cu.fatos.vendas.linhas || []; vCampos = Cu.fatos.vendas.campos || [];
  } else if(Cu.fato_vendas){
    fv = Cu.fato_vendas.linhas || []; vCampos = Cu.fato_vendas.campos || [];
  } else { return _fornAgregar(); }
  if(Cu.fatos && Cu.fatos.compras){
    fc = Cu.fatos.compras.linhas || []; cCampos = Cu.fatos.compras.campos || [];
  } else if(Cu.fato_compras){
    fc = Cu.fato_compras.linhas || []; cCampos = Cu.fato_compras.campos || [];
  } else { return _fornAgregar(); }

  const idx = function(arr,n){var i = arr.indexOf(n); return i;};
  const vYm   = idx(vCampos,'ym');
  const vForn = idx(vCampos,'forn');
  const vLiq  = idx(vCampos,'v_liq');
  const vLuc  = idx(vCampos,'v_luc');
  const vQt   = idx(vCampos,'v_qt');
  const cYm   = idx(cCampos,'ym');
  const cForn = idx(cCampos,'forn');
  const cVal  = idx(cCampos,'c_val');
  const cQt   = idx(cCampos,'c_qt');
  const cNfs  = idx(cCampos,'c_nfs');
  if(vYm<0 || vForn<0 || cYm<0 || cForn<0) return _fornAgregar();

  // dim de fornecedores pra resolver nome
  let dimForn = {};
  if(Cu.dim && Cu.dim.forn){
    (Cu.dim.forn || []).forEach(function(f){ dimForn[f.cod] = f.nome; });
  } else if(Cu.dimensoes && Cu.dimensoes.fornecedor){
    (Cu.dimensoes.fornecedor.items || []).forEach(function(f){ dimForn[f.cod] = f.nome; });
  }

  // Cruza com SKU→fornecedor do estoque pra capturar dados de estoque/markup
  const map = new Map();
  function getF(cod){
    if(!map.has(cod)){
      map.set(cod, {cod:cod, nome:dimForn[cod]||'?', skus:0,
        v_compra:0, qt_compra:0, nfs_compra:0, ult_compra:'',
        v_venda:0, lucro:0, qt_venda:0,
        vl_est_custo:0, vl_est_preco:0,
        skus_paralisados:0, skus_ativos:0,
        dev_valor:0, dev_qt:0, dev_nfs:0});
    }
    return map.get(cod);
  }

  // Agrega vendas filtradas por meses
  fv.forEach(function(l){
    if(!mesesSet.has(l[vYm])) return;
    const fcod = l[vForn];
    if(fcod == null) return;
    const a = getF(fcod);
    a.v_venda  += l[vLiq] || 0;
    a.lucro    += l[vLuc] || 0;
    a.qt_venda += l[vQt]  || 0;
  });

  // Agrega compras filtradas
  fc.forEach(function(l){
    if(!mesesSet.has(l[cYm])) return;
    const fcod = l[cForn];
    if(fcod == null) return;
    const a = getF(fcod);
    a.v_compra   += l[cVal] || 0;
    a.qt_compra  += l[cQt]  || 0;
    a.nfs_compra += l[cNfs] || 0;
  });

  // Cruza com estoque (que é "snapshot atual", não tem mês — sempre incluído)
  // pra ter SKUs cadastrados, valor em estoque, status etc
  const produtos = (E && E.produtos) || [];
  produtos.forEach(function(p){
    const f = p.fornecedor || {};
    if(f.cod == null) return;
    if(!map.has(f.cod)){
      // Fornecedor que tem cadastro mas nada de venda/compra no período
      return; // ignora — só queremos quem aparece no período
    }
    const a = getF(f.cod);
    a.skus += 1;
    if(['ATIVO','CRITICO'].indexOf(p.status)>=0) a.skus_ativos += 1;
    if(['PARADO','MORTO'].indexOf(p.status)>=0) a.skus_paralisados += 1;
    const e = p.estoque || {};
    a.vl_est_custo += e.vl_custo || 0;
    a.vl_est_preco += e.vl_preco || 0;
  });

  // Devoluções: o JSON Dev não tem mês discriminado por linha — usa o total como proxy
  // Quando o filtro é 2026 inteiro, é o total real. Quando é mês específico, é uma aproximação.
  // (Pra ter exato, o ETL de Dev precisaria expor por mês. Hoje não expõe.)
  const devMap = new Map();
  if(typeof Dev !== 'undefined' && Dev && Dev.por_fornecedor){
    Dev.por_fornecedor.forEach(function(d){ devMap.set(d.cod, d); });
  }

  const arr = [];
  map.forEach(function(a){
    a.marg = a.v_venda > 0 ? (a.lucro/a.v_venda*100) : 0;
    a.markup_est = a.vl_est_custo > 0 ? ((a.vl_est_preco - a.vl_est_custo)/a.vl_est_custo*100) : 0;
    const dev = devMap.get(a.cod);
    a.dev_valor = dev ? dev.valor : 0;
    a.dev_qt    = dev ? dev.qt    : 0;
    a.dev_nfs   = dev ? dev.nfs   : 0;
    a.pct_devol = a.v_compra > 0 ? (a.dev_valor/a.v_compra*100) : 0;
    a.v_compra_liq = Math.max(0, a.v_compra - a.dev_valor);
    a.qt_compra_liq = Math.max(0, a.qt_compra - a.dev_qt);
    arr.push(a);
  });
  return arr;
}

/**
 * Retorna os meses YM disponíveis em 2026 baseado no cubo.
 */
function _fornYmsDisponiveis2026(){
  if(!Cu) return [];
  let fv, campos;
  if(Cu.fatos && Cu.fatos.vendas){
    fv = Cu.fatos.vendas.linhas || []; campos = Cu.fatos.vendas.campos || [];
  } else if(Cu.fato_vendas){
    fv = Cu.fato_vendas.linhas || []; campos = Cu.fato_vendas.campos || [];
  } else { return []; }
  const idxYm = campos.indexOf('ym');
  if(idxYm < 0) return [];
  const set = {};
  fv.forEach(function(l){
    const ym = l[idxYm];
    if(ym && ym.indexOf('2026') === 0) set[ym] = true;
  });
  return Object.keys(set).sort();
}
let _fornFiltro = '';     // filtro de busca

function _fornAgregar(){
  if(_fornAggCache) return _fornAggCache;
  const produtos = (E && E.produtos) || [];
  const map = new Map();

  produtos.forEach(function(p){
    const f = p.fornecedor || {};
    if(f.cod == null) return;
    let a = map.get(f.cod);
    if(!a){
      a = {cod:f.cod, nome:f.nome||'?', skus:0,
           v_compra:0, qt_compra:0, nfs_compra:0, ult_compra:'',
           v_venda:0, lucro:0, qt_venda:0,
           vl_est_custo:0, vl_est_preco:0,
           skus_paralisados:0, skus_ativos:0};
      map.set(f.cod, a);
    }
    a.skus += 1;
    if(['ATIVO','CRITICO'].indexOf(p.status)>=0) a.skus_ativos += 1;
    if(['PARADO','MORTO'].indexOf(p.status)>=0) a.skus_paralisados += 1;

    const c12 = p.compras_12m || {};
    a.v_compra   += c12.valor || 0;
    a.qt_compra  += c12.qt    || 0;
    a.nfs_compra += c12.nfs   || 0;
    if(c12.ult_data && c12.ult_data > a.ult_compra) a.ult_compra = c12.ult_data;

    const vds = p.vendas || {};
    a.v_venda  += vds.valor || 0;
    a.lucro    += vds.lucro || 0;
    a.qt_venda += vds.qt    || 0;

    const e = p.estoque || {};
    a.vl_est_custo += e.vl_custo || 0;
    a.vl_est_preco += e.vl_preco || 0;
  });

  // Devoluções (se Dev disponível)
  const devMap = new Map();
  if(typeof Dev !== 'undefined' && Dev && Dev.por_fornecedor){
    Dev.por_fornecedor.forEach(function(d){ devMap.set(d.cod, d); });
  }

  // Calcula margem real e cruza devoluções
  const arr = [];
  map.forEach(function(a){
    a.marg = a.v_venda > 0 ? (a.lucro/a.v_venda*100) : 0;
    a.markup_est = a.vl_est_custo > 0 ? ((a.vl_est_preco - a.vl_est_custo)/a.vl_est_custo*100) : 0;
    const dev = devMap.get(a.cod);
    a.dev_valor = dev ? dev.valor : 0;
    a.dev_qt    = dev ? dev.qt    : 0;
    a.dev_nfs   = dev ? dev.nfs   : 0;
    a.pct_devol = a.v_compra > 0 ? (a.dev_valor/a.v_compra*100) : 0;
    // Compras líquidas = brutas − devoluções (nunca abaixo de zero)
    a.v_compra_liq = Math.max(0, a.v_compra - a.dev_valor);
    a.qt_compra_liq = Math.max(0, a.qt_compra - a.dev_qt);
    arr.push(a);
  });
  _fornAggCache = arr;
  return arr;
}

function renderFornecedoresNovo(){
  const cont = document.getElementById('page-fornecedores');
  if(!cont || !E) return;

  const ymsTodos = _fornYmsDisponiveis2026();
  // Se não há dados de 2026 no cubo, cai pra agregação 12m antiga
  const usarPeriodo = ymsTodos.length > 0;
  const mesesAtivos = usarPeriodo
    ? ((Array.isArray(_fornFiltroMeses) && _fornFiltroMeses.length)
        ? _fornFiltroMeses.filter(function(y){return ymsTodos.indexOf(y)>=0;})
        : ymsTodos)
    : [];
  const mesesSet = new Set(mesesAtivos);

  const fornAll = usarPeriodo
    ? _fornAgregarPorPeriodo(mesesSet)
    : _fornAgregar();
  const fornAtivos = fornAll.filter(function(f){return f.v_compra>0;});
  const totCompra = fornAtivos.reduce(function(s,f){return s+f.v_compra;},0);
  const totVenda  = fornAll.reduce(function(s,f){return s+f.v_venda;},0);
  const totLucro  = fornAll.reduce(function(s,f){return s+f.lucro;},0);
  const totDev    = fornAll.reduce(function(s,f){return s+f.dev_valor;},0);
  const totEst    = fornAll.reduce(function(s,f){return s+f.vl_est_custo;},0);
  const margGlob  = totVenda>0?(totLucro/totVenda*100):0;

  // Ordenado por compra desc
  const rankCompra = fornAtivos.slice().sort(function(a,b){return b.v_compra-a.v_compra;});
  const top1 = rankCompra[0];
  const top10Compra = rankCompra.slice(0,10).reduce(function(s,f){return s+f.v_compra;},0);
  const concTop10 = totCompra>0?(top10Compra/totCompra*100):0;

  let html = '<div class="ph"><div class="pk">Compras</div><h2>Análise de <em>fornecedores</em></h2></div>'
           + '<div class="ph-sep"></div>'
           + '<div class="page-body">';

  // Banner explicativo + filtro de meses (modelo CV)
  if(usarPeriodo){
    const labelMes = (mesesAtivos.length === ymsTodos.length)
      ? 'todos os meses de 2026'
      : mesesAtivos.length+' de '+ymsTodos.length+' meses';
    html += '<div class="cc" style="padding:12px 14px;margin-bottom:14px;">';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">';
    html += '<span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Período:</span>';
    ymsTodos.forEach(function(ym){
      const ativo = mesesSet.has(ym);
      html += '<button class="forn-mes-btn" data-ym="'+esc(ym)+'" style="padding:5px 10px;font-size:11.5px;border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;'
           +   (ativo?'background:var(--accent);color:white;':'background:var(--surface);color:var(--text);')
           + 'font-weight:600;">'+esc(_ymToLabel(ym))+'</button>';
    });
    if(mesesAtivos.length !== ymsTodos.length){
      html += '<button id="forn-meses-clear" style="padding:5px 8px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Limpar</button>';
    }
    html += '</div>';
    html += '<div style="margin-top:10px;font-size:12px;color:var(--text-dim);">'
         +   '<strong>'+fI(fornAll.length)+'</strong> fornecedores no período · '
         +   '<strong>'+fI(fornAtivos.length)+'</strong> com compras · '+esc(labelMes)+' · '
         +   'Retrato estoque: '+fDt(E.meta && E.meta.data_referencia)
         + '</div>';
    html += '<div style="margin-top:6px;font-size:11px;color:var(--text-muted);font-style:italic;">'
         +   'Devoluções não são filtradas por mês (o ETL de devoluções não exporta detalhe mensal por fornecedor) — o valor exibido é o total do período disponível.'
         + '</div>';
    html += '</div>';
  } else {
    const periodoCompra = (E.meta && E.meta.periodo_vendas) ? E.meta.periodo_vendas.meses+' meses' : '12 meses';
    html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);line-height:1.5;">'
         + '<strong>Período:</strong> compras 12 meses · vendas '+periodoCompra+' · '
         + '<strong>'+fI(fornAll.length)+'</strong> fornecedores cadastrados · '
         + '<strong>'+fI(fornAtivos.length)+'</strong> com compras no período · '
         + 'Retrato estoque: '+fDt(E.meta && E.meta.data_referencia)
         + '</div>';
  }

  html += '<div id="kg-forn-novo"></div>';

  // 2 charts lado a lado
  html += '<div class="cc"><div class="cct">Top 12 · Compras 12 meses</div>'
       +    '<div class="ccs">Cor por margem real das vendas (verde >10%, amarelo 5-10%, vermelho &lt;5%)</div>'
       +    '<div style="height:280px;margin-top:8px;"><canvas id="c-forn-compra"></canvas></div>'
       +  '</div>';

  // Devoluções (se houver)
  const comDev = fornAll.filter(function(f){return f.dev_valor>0;}).sort(function(a,b){return b.dev_valor-a.dev_valor;});
  if(comDev.length > 0){
    const top10Dev = comDev.slice(0, 10);
    html += '<div class="cc"><div class="cct">Top 10 · Devoluções a fornecedor</div>'
         +    '<div class="ccs">'+fI(comDev.length)+' fornecedores receberam devoluções · total '+fK(totDev)+'</div>'
         +    '<div class="tscroll" style="margin-top:8px;"><table class="t"><thead><tr>'
         +      '<th class="L" style="width:24px;">#</th>'
         +      '<th class="L">Fornecedor</th>'
         +      '<th>Vl devolvido</th>'
         +      '<th>Qt</th>'
         +      '<th>NFs</th>'
         +      '<th>Compras 12m</th>'
         +      '<th>% devol/compra</th>'
         +    '</tr></thead><tbody>';
    top10Dev.forEach(function(f, i){
      const cls = f.pct_devol > 5 ? 'dn' : f.pct_devol > 2 ? 'wn' : '';
      const pctTxt = f.pct_devol > 999 ? '+999% ⚠' : fP(f.pct_devol);
      html += '<tr>'
           +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
           +    '<td class="L" data-forn-cod="'+esc(f.cod)+'" title="Clique para ver diagnóstico do fornecedor"><strong>'+esc((f.nome||'').substring(0,42))+'</strong></td>'
           +    '<td class="val-strong">'+fK(f.dev_valor)+'</td>'
           +    '<td>'+fI(f.dev_qt||0)+'</td>'
           +    '<td>'+fI(f.dev_nfs||0)+'</td>'
           +    '<td>'+fK(f.v_compra)+'</td>'
           +    '<td><span class="kg-tag '+cls+'">'+pctTxt+'</span></td>'
           +  '</tr>';
    });
    html += '</tbody></table></div></div>';
  }

  // Tabela completa com busca
  html += '<div class="cc">'
       +    '<div class="cch">'
       +      '<div><div class="cct">Ranking completo · ' + fI(fornAtivos.length) + ' fornecedores ativos</div>'
       +        '<div class="ccs">Ordenado por compras 12 meses · clique nos cabeçalhos para reordenar</div></div>'
       +      '<input type="text" id="forn-novo-srch" placeholder="Buscar fornecedor..." style="padding:6px 10px;border:1px solid var(--border-strong);border-radius:6px;font-size:12px;background:var(--surface);color:var(--text);width:240px;">'
       +    '</div>'
       +    '<div class="tscroll" style="margin-top:8px;max-height:520px;overflow-y:auto;">'
       +      '<table class="t" id="t-forn-novo">'
       +        '<thead><tr>'
       +          '<th class="L" style="width:30px;">#</th>'
       +          '<th class="L">Fornecedor</th>'
       +          '<th>SKUs</th>'
       +          '<th>Compras 12m</th>'
       +          '<th>NFs compra</th>'
       +          '<th>Vendas</th>'
       +          '<th>Lucro</th>'
       +          '<th>Margem %</th>'
       +          '<th>Estoque (custo)</th>'
       +          '<th>Devolução</th>'
       +          '<th>SKUs parados</th>'
       +        '</tr></thead>'
       +        '<tbody id="tb-forn-novo"></tbody>'
       +      '</table>'
       +    '</div>'
       + '</div>';

  html += '</div>'; // page-body
  cont.innerHTML = html;

  // KPIs
  const totCompraLiq = fornAtivos.reduce(function(s,f){return s+f.v_compra_liq;},0);
  const top1Nome = top1 ? (top1.nome||'').substring(0, 22) : '—';
  document.getElementById('kg-forn-novo').innerHTML = kgHtml([
    {l:'Fornecedores ativos', v:fI(fornAtivos.length), s:'Com compras 12m · de '+fI(fornAll.length)+' cadastrados'},
    {l:'Líder em compras',    v:top1Nome,              s:top1?fK(top1.v_compra_liq||top1.v_compra)+' líquidas nos últimos 12m':'-'},
    {l:'Concentração top 10', v:fP(concTop10),         s:'do total de compras'},
    {l:'Compras líquidas 12m',v:fK(totCompraLiq),      s:'Brutas '+fK(totCompra)+' − devoluções '+fK(totDev)},
    {l:'Margem global',       v:fP(margGlob),          s:'Lucro/Vendas com produtos desses fornecedores',cls:margGlob>10?'ok':margGlob>5?'':'wn'},
    {l:'Devoluções',          v:fK(totDev),            s:fI(comDev.length)+' fornecedores · '+fP(totCompra>0?totDev/totCompra*100:0)+' das compras',cls:'dn'},
  ]);

  // Chart 1: Top 12 compras (cor por margem)
  const top12Compra = rankCompra.slice(0, 12);
  function corMarg(m){
    if(m<5)  return _PAL.dn+'CC';
    if(m<10) return _PAL.wn+'CC';
    return _PAL.ok+'CC';
  }
  mkC('c-forn-compra',{type:'bar',
    data:{labels:top12Compra.map(function(f){return (f.nome||'').length>22?(f.nome||'').substring(0,22)+'…':(f.nome||'');}),
          datasets:[{label:'Compras 12m', data:top12Compra.map(function(f){return f.v_compra;}),
                     backgroundColor:top12Compra.map(function(f){return corMarg(f.marg);}), borderRadius:4}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},
               tooltip:{callbacks:{label:function(ctx){var f=top12Compra[ctx.dataIndex];return fK(ctx.raw)+' · margem '+fP(f.marg);}}}},
      scales:{x:{ticks:{callback:function(v){return fAbbr(v);}}},y:{grid:{display:false},ticks:{font:{size:10}}}}}});

  // Chart 2: Top 12 margem (filtra fornecedores com vendas mínimas pra evitar ruído)
  const minVenda = 50000; // R$ 50k mínimo pra entrar no ranking de margem
  const rankMarg = fornAll.filter(function(f){return f.v_venda>=minVenda;}).sort(function(a,b){return b.lucro-a.lucro;}).slice(0, 12);
  mkC('c-forn-marg',{type:'bar',
    data:{labels:rankMarg.map(function(f){return (f.nome||'').length>22?(f.nome||'').substring(0,22)+'…':(f.nome||'');}),
          datasets:[
            {label:'Lucro (R$)', data:rankMarg.map(function(f){return f.lucro;}), backgroundColor:_PAL.ok+'CC', borderRadius:4, yAxisID:'y'},
            {label:'Margem %',   data:rankMarg.map(function(f){return f.marg;}),  type:'line', borderColor:_PAL.vi, backgroundColor:_PAL.vi+'33', tension:0.2, pointRadius:3, borderWidth:2, yAxisID:'y2'}
          ]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{position:'top',labels:{padding:6,usePointStyle:true,boxWidth:8,font:{size:10}}},
               tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+(ctx.dataset.type==='line'?fP(ctx.raw):fK(ctx.raw));}}}},
      scales:{
        x:{grid:{display:false},ticks:{font:{size:9},maxRotation:60,minRotation:45}},
        y:{position:'left',ticks:{callback:function(v){return fAbbr(v);}},title:{display:true,text:'Lucro R$',font:{size:10}}},
        y2:{position:'right',grid:{display:false},ticks:{callback:function(v){return v+'%';}},title:{display:true,text:'Margem %',font:{size:10}}}
      }}});

  // Render tabela inicial
  _fornFiltro = '';
  _fornRenderTabela(rankCompra);

  // Listener da busca
  const inp = document.getElementById('forn-novo-srch');
  if(inp){
    inp.addEventListener('input', function(){
      _fornFiltro = (inp.value || '').toLowerCase();
      const filtrado = _fornFiltro.length < 2 ? rankCompra : rankCompra.filter(function(f){
        return (f.nome||'').toLowerCase().indexOf(_fornFiltro) >= 0;
      });
      _fornRenderTabela(filtrado);
    });
  }

  // Filtro de meses (modelo CV)
  document.querySelectorAll('.forn-mes-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const ym = btn.getAttribute('data-ym');
      const atual = (_fornFiltroMeses && _fornFiltroMeses.length) ? _fornFiltroMeses.slice() : ymsTodos.slice();
      const i = atual.indexOf(ym);
      if(i >= 0) atual.splice(i, 1);
      else atual.push(ym);
      _fornFiltroMeses = atual.length === 0 ? null : atual;
      renderFornecedoresNovo();
    });
  });
  const btnClearF = document.getElementById('forn-meses-clear');
  if(btnClearF) btnClearF.addEventListener('click', function(){
    _fornFiltroMeses = null;
    renderFornecedoresNovo();
  });
}

function _fornRenderTabela(arr){
  const tb = document.getElementById('tb-forn-novo');
  if(!tb) return;
  if(arr.length === 0){
    tb.innerHTML = '<tr><td colspan="11" style="text-align:center;color:var(--text-muted);padding:14px;">Nenhum fornecedor encontrado.</td></tr>';
    return;
  }
  let html = '';
  arr.forEach(function(f, i){
    const margCls = f.marg<0?'dn':f.marg<5?'wn':f.marg<10?'':'ok';
    const devCls  = f.pct_devol>5?'dn':f.pct_devol>2?'wn':'';
    html += '<tr>'
         +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
         +    '<td class="L" data-forn-cod="'+esc(f.cod)+'" title="Clique para ver diagnóstico do fornecedor"><strong>'+esc((f.nome||'').substring(0,40))+'</strong></td>'
         +    '<td>'+fI(f.skus)+'</td>'
         +    '<td class="val-strong">'+fK(f.v_compra)+'</td>'
         +    '<td>'+fI(f.nfs_compra||0)+'</td>'
         +    '<td>'+fK(f.v_venda)+'</td>'
         +    '<td>'+fK(f.lucro)+'</td>'
         +    '<td><span class="kg-tag '+margCls+'">'+fP(f.marg)+'</span></td>'
         +    '<td>'+fK(f.vl_est_custo)+'</td>'
         +    '<td>'+(f.dev_valor>0?'<span class="kg-tag '+devCls+'">'+fK(f.dev_valor)+'</span>':'<span style="color:var(--text-muted);">—</span>')+'</td>'
         +    '<td>'+(f.skus_paralisados>0?'<span class="kg-tag wn">'+fI(f.skus_paralisados)+'</span>':fI(f.skus_paralisados))+'</td>'
         +  '</tr>';
  });
  tb.innerHTML = html;
}

// ════════════════════════════════════════════════════════════════════════
// DIAGNÓSTICO DE PRODUTO NOVO · usa estoque_atp.json (E) · sub-etapa 4k
// Substitui o initDiag() vazio + handlers legados que dependiam de D.produtos.
// ════════════════════════════════════════════════════════════════════════
let _diagIdxByC = null;       // Map(cod → produto)
let _diagIdxByE = null;       // Map(ean → produto) — não temos EAN no estoque_atp ainda
let _diagListaOrd = null;     // Lista ordenada por vendas.valor desc
let _diagBoundProd = false;   // Flag pra não bindar listeners 2x

function _diagBuildIdx(){
  if(_diagIdxByC) return;
  _diagIdxByC = new Map();
  _diagIdxByE = new Map();
  _diagListaOrd = ((E && E.produtos) || []).slice().sort(function(a,b){
    return ((b.vendas&&b.vendas.valor)||0) - ((a.vendas&&a.vendas.valor)||0);
  });
  _diagListaOrd.forEach(function(p){ _diagIdxByC.set(p.cod, p); });
}

// Aviso quando usuário está em consolidado tentando usar diagnóstico
// O diagnóstico precisa de E (estoque) específico de uma loja, não faz sentido em consolidado
function _renderDiagAvisoConsolidado(containerId, tituloPagina){
  const cont = document.getElementById(containerId);
  if(!cont) return;
  const filiaisDispon = (_filiaisDisponiveis || []).filter(function(f){return !f.placeholder;});
  let html = '<div class="ph"><div class="pk">'+esc(tituloPagina)+'</div><h2>Escolha uma <em>loja</em> para diagnosticar</h2></div>'
    + '<div class="ph-sep"></div>'
    + '<div class="page-body" style="padding:40px 20px;">'
    + '<div style="max-width:560px;margin:20px auto;text-align:center;">'
    + '<div style="width:64px;height:64px;background:var(--accent-bg);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;">'
    +   '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    + '</div>'
    + '<h3 style="font-size:18px;font-weight:800;margin-bottom:10px;color:var(--text);">Diagnóstico é por loja específica</h3>'
    + '<p style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:24px;">'
    +   'O diagnóstico analisa estoque, giro, ruptura e histórico de vendas/compras de itens. '
    +   'Esses dados são por loja — em consolidado os números se misturam e não dão diagnóstico útil. '
    +   'Selecione uma loja específica para começar.'
    + '</p>'
    + '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:10px;">Selecione a loja:</div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';
  filiaisDispon.forEach(function(f){
    html += '<button class="diag-pick-loja" data-sigla="'+escAttr(f.sigla)+'" '
      + 'style="padding:9px 16px;background:var(--surface);border:1px solid var(--border-strong);border-radius:6px;cursor:pointer;font-size:12.5px;font-weight:700;color:var(--text);transition:background .12s;">'
      + esc(f.nome)
      + '</button>';
  });
  html += '</div></div></div>';
  cont.innerHTML = html;

  cont.querySelectorAll('.diag-pick-loja').forEach(function(btn){
    btn.addEventListener('mouseenter', function(){ btn.style.background = 'var(--accent-bg)'; });
    btn.addEventListener('mouseleave', function(){ btn.style.background = 'var(--surface)'; });
    btn.addEventListener('click', function(){
      const sigla = btn.getAttribute('data-sigla');
      const url = new URL(window.location);
      if(sigla && sigla !== 'grupo') url.searchParams.set('filial', sigla);
      else url.searchParams.delete('filial');
      url.searchParams.delete('snapshot');
      if(typeof _auditLog === 'function'){
        _auditLog('filial_change', {de: 'consolidado', para: sigla, origem: 'diag'});
      }
      window.location = url.toString();
    });
  });
}

function renderDiagNovo(){
  const cont = document.getElementById('page-diagnostico');
  if(!cont || !E) return;

  // Bloqueio: diagnóstico só faz sentido por loja específica
  // Em consolidado os dados de produtos não fazem sentido (estoque, vendas por SKU misturados)
  if(typeof _filialAtual === 'undefined' || !_filialAtual || !_filialAtual.base_sigla){
    _renderDiagAvisoConsolidado('page-diagnostico', 'Diagnóstico de Produto');
    return;
  }

  _diagBuildIdx();

  // Reseta área de conteúdo
  const empty = document.getElementById('diag-empty');
  const dcnt  = document.getElementById('diag-content');
  if(empty) empty.style.display = '';
  if(dcnt){ dcnt.style.display = 'none'; dcnt.innerHTML = ''; }

  // Liga handlers (uma vez só)
  if(_diagBoundProd) return;
  _diagBoundProd = true;

  const inp = document.getElementById('prod-srch');
  const drp = document.getElementById('srch-drop');
  if(!inp || !drp) return;

  // Clona pra remover handlers legados (que dependiam de D)
  const inpNew = inp.cloneNode(true);
  inp.parentNode.replaceChild(inpNew, inp);

  let timer = null;
  inpNew.addEventListener('input', function(){
    clearTimeout(timer);
    timer = setTimeout(function(){ _diagDoSearch(inpNew.value); }, 120);
  });
  inpNew.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ drp.classList.remove('show'); inpNew.blur(); }
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('#prod-srch') && !e.target.closest('#srch-drop')){
      drp.classList.remove('show');
    }
  });
}

function _diagDoSearch(q){
  q = (q||'').trim();
  const drp = document.getElementById('srch-drop');
  if(!drp) return;
  if(q.length < 2){ drp.classList.remove('show'); return; }

  const tokens = q.toLowerCase().split(/\s+/).filter(function(t){return t.length>0;});
  const qNum = (tokens.length===1 && /^\d+$/.test(q.trim())) ? parseInt(q.trim(), 10) : null;

  let achados;
  if(qNum !== null && _diagIdxByC.has(qNum)){
    achados = [_diagIdxByC.get(qNum)];
  } else {
    achados = _diagListaOrd.filter(function(p){
      const desc = (p.desc||'').toLowerCase();
      return tokens.every(function(t){return desc.indexOf(t)>=0;});
    });
  }

  // Ordena: começa com primeiro token primeiro, depois por venda
  if(qNum === null && achados.length > 1){
    const first = tokens[0];
    achados.sort(function(a,b){
      const dA = (a.desc||'').toLowerCase();
      const dB = (b.desc||'').toLowerCase();
      const sA = dA.indexOf(first)===0?0:1;
      const sB = dB.indexOf(first)===0?0:1;
      if(sA !== sB) return sA - sB;
      return ((b.vendas&&b.vendas.valor)||0) - ((a.vendas&&a.vendas.valor)||0);
    });
  }

  const top = achados.slice(0, 30);
  if(!top.length){
    drp.innerHTML = '<div style="padding:18px;text-align:center;color:var(--text-muted);font-size:13px;">Nenhum produto encontrado para &quot;'+esc(q)+'&quot;</div>';
    drp.classList.add('show');
    return;
  }

  let html = '<div class="drp-hdr">'+achados.length+' resultado'+(achados.length!==1?'s':'')+' para "'+esc(q)+'"';
  if(achados.length > 30) html += ' · mostrando top 30';
  html += '</div>';

  top.forEach(function(p){
    const dep  = (p.depto && p.depto.nome) || '?';
    const cat  = (p.categoria && p.categoria.nome) || '?';
    const sec  = (p.secao && p.secao.nome) || '';
    const v    = (p.vendas && p.vendas.valor) || 0;
    const ini  = (p.desc||'').substring(0, 2).toUpperCase();
    html += '<div class="sri" data-cod="'+p.cod+'">'
         +    '<div class="si">'+esc(ini)+'</div>'
         +    '<div>'
         +      '<div class="sm">'+_diagHighlight(p.desc, tokens)+'</div>'
         +      '<div class="ss">#'+esc(p.cod)+(p.embalagem?' · '+esc(p.embalagem):'')+' · '+esc(dep)+(sec?' › '+esc(sec):'')+(cat?' › '+esc(cat):'')+'</div>'
         +    '</div>'
         +    '<div class="sv">'+fK(v)+'</div>'
         +  '</div>';
  });
  drp.innerHTML = html;
  drp.querySelectorAll('.sri').forEach(function(el){
    el.addEventListener('click', function(){
      _openProdNovo(parseInt(el.dataset.cod, 10));
      drp.classList.remove('show');
      const inp = document.getElementById('prod-srch');
      if(inp) inp.value = '';
    });
  });
  drp.classList.add('show');
}

function _diagHighlight(text, tokens){
  if(!text || !tokens || !tokens.length) return esc(text||'');
  let out = esc(text);
  tokens.forEach(function(t){
    const safe = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp('('+safe+')', 'gi'),
      '<mark style="background:rgba(245,134,52,.25);border-radius:2px;padding:0 1px;">$1</mark>');
  });
  return out;
}

// Substitui openProd quando E está carregado
window._openProdNovo = function(cod){
  const p = _diagIdxByC.get(cod);
  if(!p){
    console.warn('[_openProdNovo] produto não encontrado:', cod);
    return;
  }
  // Garante que está na página de diagnóstico
  document.querySelectorAll('.sb-link').forEach(function(x){x.classList.remove('active');});
  const link = document.querySelector('.sb-link[data-p="diagnostico"]');
  if(link) link.classList.add('active');
  if(typeof _expandirGrupoDaPaginaAtiva==='function') _expandirGrupoDaPaginaAtiva();
  document.querySelectorAll('.page').forEach(function(x){x.classList.remove('active');});
  document.getElementById('page-diagnostico').classList.add('active');

  const empty = document.getElementById('diag-empty');
  if(empty) empty.style.display = 'none';
  const cont = document.getElementById('diag-content');
  if(!cont) return;
  cont.style.display = 'block';

  const dep   = (p.depto && p.depto.nome) || '—';
  const sec   = (p.secao && p.secao.nome) || '';
  const cat   = (p.categoria && p.categoria.nome) || '';
  const forn  = (p.fornecedor && p.fornecedor.nome) || '—';
  const fornC = (p.fornecedor && p.fornecedor.cod) || '';
  const e     = p.estoque || {};
  const vds   = p.vendas || {};
  const c12   = p.compras_12m || {};
  const dev   = p.devol_2026 || {};
  const nav   = [dep, sec, cat].filter(Boolean).join(' › ');

  // Status visual
  const stCls = p.status==='ATIVO'?'ok':p.status==='CRITICO'?'wn':p.status==='PARADO'?'wn':p.status==='MORTO'?'dn':'';
  const stTxt = p.status || '?';

  // Cálculos
  const margPot = e.vl_custo > 0 ? ((e.vl_preco - e.vl_custo)/e.vl_custo*100) : 0;
  const margReal = vds.marg || 0;
  const giroD = p.giro_dias != null ? p.giro_dias : null;
  const giroTxt = giroD!=null ? giroD.toFixed(0)+' dias' : 'sem dados';
  const giroCls = giroD==null?'':giroD>180?'dn':giroD>90?'wn':'ok';

  // Calcula curva ABC (baseado em vendas valor)
  const vendasVal = vds.valor || 0;
  let curvaABC = '';
  if(vendasVal > 0 && _diagListaOrd && _diagListaOrd.length){
    const totalGrupo = _diagListaOrd.reduce(function(s,x){return s + ((x.vendas&&x.vendas.valor)||0);}, 0);
    if(totalGrupo > 0){
      // Ordena (já está ordenada por valor desc) e acha posição cumulativa
      let acum = 0;
      for(let i=0; i<_diagListaOrd.length; i++){
        acum += (_diagListaOrd[i].vendas&&_diagListaOrd[i].vendas.valor)||0;
        if(_diagListaOrd[i].cod === p.cod){
          const pct = acum / totalGrupo;
          curvaABC = pct <= 0.80 ? 'A' : pct <= 0.95 ? 'B' : 'C';
          break;
        }
      }
    }
  }

  // Calcula cobertura (em dias) baseada em qt em estoque ÷ vendas/dia
  // Vendas/dia = qt total ÷ (meses com venda × 30)
  let coberturaTxt = 'sem dados';
  let coberturaCls = '';
  let coberturaDias = null;
  const mesesVend = vds.meses || 0;
  const qtVend = vds.qt || 0;
  if(e.qt > 0 && qtVend > 0 && mesesVend > 0){
    const vendaDia = qtVend / (mesesVend * 30);
    if(vendaDia > 0){
      coberturaDias = e.qt / vendaDia;
      coberturaTxt = coberturaDias.toFixed(0)+' dias';
      coberturaCls = coberturaDias > 180 ? 'dn' : coberturaDias > 90 ? 'wn' : coberturaDias < 7 ? 'wn' : 'ok';
    }
  } else if(e.qt > 0 && qtVend === 0){
    coberturaTxt = 'sem venda';
    coberturaCls = 'dn';
  }

  let html = '';

  // Hero
  html += '<div class="prod-hero">'
       +    '<div class="ph-nav">'+esc(nav)+'</div>'
       +    '<div class="ph-code">#'+esc(p.cod)+(p.embalagem?' · '+esc(p.embalagem):'')+' · '+esc(p.unidade||'—')+'</div>'
       +    '<h2>'+esc(p.desc||'')+'</h2>'
       +    '<div class="ph-meta">'
       +      '<div class="ph-mi"><div class="pml">Fornecedor</div><div class="pmv">'+esc(forn)+(fornC?' <span style="color:var(--text-muted);font-size:11px;">#'+esc(fornC)+'</span>':'')+'</div></div>'
       +      '<div class="ph-mi"><div class="pml">Última entrada</div><div class="pmv">'+esc(e.dt_ult_entrada||'—')+'</div></div>'
       +      '<div class="ph-mi"><div class="pml">Custo atual</div><div class="pmv">'+(e.custo>0?fB(e.custo):'—')+'</div></div>'
       +      '<div class="ph-mi"><div class="pml">P. venda atual</div><div class="pmv">'+(e.preco>0?fB(e.preco):'—')+'</div></div>'
       +    '</div>'
       +    '<div class="ph-tags">'
       +      '<span class="kg-tag '+stCls+'" style="font-size:11px;">'+esc(stTxt)+'</span>'
       +      (curvaABC ? ' <span class="kg-tag '+(curvaABC==='A'?'ok':curvaABC==='B'?'hl':'')+'" style="font-size:11px;">Curva '+curvaABC+'</span>' : '')
       +    '</div>'
       + '</div>';

  // KPIs principais (5) — alinhado com a referência: Vendas Líq · Margem · Compras Líq · Estoque · Cobertura
  html += '<div class="kg c5" id="kp-diag-novo"></div>';

  // Extrato resumido por mês (vendas qt + entradas) — versão visual aprimorada
  html += '<div class="ds">'
       +    '<div class="ds-hdr">'
       +      '<div class="ds-ico" style="background:var(--accent-bg);color:var(--accent-text);">'
       +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>'
       +      '</div>'
       +      '<div><div class="ds-title">Extrato do produto</div><div class="ds-sub">Saídas mensais e entradas (compras + devoluções)</div></div>'
       +    '</div>'
       +    '<div class="ds-body" style="padding:14px;"><div style="height:240px;"><canvas id="c-diag-hist"></canvas></div></div>'
       +    '<div class="tscroll" style="border-top:1px solid var(--border);">'
       +      '<table class="t" style="margin:0;">'
       +        '<thead><tr><th class="L">Mês</th><th>Saídas (un)</th><th>Entradas (un)</th><th>Saldo</th></tr></thead>'
       +        '<tbody id="diag-extrato-tbody"></tbody>'
       +      '</table>'
       +    '</div>'
       + '</div>';

  // Estoque + Compras lado a lado
  html += '<div class="row2eq">'
       +    '<div class="cc"><div class="cct">Estoque atual</div>'
       +      '<table class="t" style="margin-top:8px;"><tbody>'
       +        '<tr><td class="L">Quantidade em estoque</td><td class="val-strong">'+fI(e.qt||0)+' '+esc(p.unidade||'')+'</td></tr>'
       +        '<tr><td class="L">Valor a custo</td><td class="val-strong">'+fK(e.vl_custo||0)+'</td></tr>'
       +        '<tr><td class="L">Valor a preço de venda</td><td>'+fK(e.vl_preco||0)+'</td></tr>'
       +        '<tr><td class="L">Markup potencial</td><td>'+fP(margPot)+'</td></tr>'
       +        '<tr><td class="L">Quantidade reservada</td><td>'+fI(e.qt_reservada||0)+'</td></tr>'
       +        '<tr><td class="L">Quantidade bloqueada</td><td>'+fI(e.qt_bloq||0)+'</td></tr>'
       +        '<tr><td class="L">Avarias</td><td>'+(e.qt_avaria>0?'<span class="kg-tag wn">'+fI(e.qt_avaria)+'</span>':'0')+'</td></tr>'
       +        '<tr><td class="L">Última entrada</td><td>'+esc(e.dt_ult_entrada||'—')+'</td></tr>'
       +        '<tr><td class="L">Giro</td><td><span class="kg-tag '+giroCls+'">'+esc(giroTxt)+'</span></td></tr>'
       +      '</tbody></table>'
       +    '</div>'
       +    '<div class="cc"><div class="cct">Compras 12 meses</div>'
       +      '<table class="t" style="margin-top:8px;"><tbody>'
       +        '<tr><td class="L">Quantidade comprada</td><td class="val-strong">'+fI(c12.qt||0)+' '+esc(p.unidade||'')+'</td></tr>'
       +        '<tr><td class="L">Valor total</td><td class="val-strong">'+fK(c12.valor||0)+'</td></tr>'
       +        '<tr><td class="L">Notas fiscais</td><td>'+fI(c12.nfs||0)+'</td></tr>'
       +        '<tr><td class="L">Preço médio de compra</td><td>'+(c12.preco_medio>0?fB(c12.preco_medio):'—')+'</td></tr>'
       +        '<tr><td class="L">Última compra</td><td>'+fDt(c12.ult_data)+'</td></tr>'
       +        '<tr><td colspan="2" style="height:8px;"></td></tr>'
       +        '<tr><td class="L" style="font-weight:700;">Devoluções 2026</td><td>'+(dev.qt>0?'<span class="kg-tag dn">'+fI(dev.qt||0)+' un · '+fK(dev.valor||0)+'</span>':'<span style="color:var(--text-muted);">nenhuma</span>')+'</td></tr>'
       +      '</tbody></table>'
       +    '</div>'
       + '</div>';

  // Diagnóstico automático
  const obs = _diagGerarObservacoes(p);
  if(obs.length){
    html += '<div class="ds">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico" style="background:var(--highlight-bg);color:var(--highlight-text);">'
         +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
         +      '</div>'
         +      '<div><div class="ds-title">Observações automáticas</div><div class="ds-sub">'+obs.length+' ponto'+(obs.length!==1?'s':'')+' identificado'+(obs.length!==1?'s':'')+'</div></div>'
         +    '</div>'
         +    '<div class="ds-body" style="padding:14px;">'
         +      '<ul style="margin:0;padding-left:20px;line-height:1.7;font-size:13px;color:var(--text);">'
         +      obs.map(function(o){return '<li><strong style="color:'+o.color+';">'+esc(o.tag)+'</strong> '+esc(o.msg)+'</li>';}).join('')
         +      '</ul>'
         +    '</div>'
         + '</div>';
  }

  cont.innerHTML = html;

  // KPIs (5) — Vendas Líq · Margem · Compras Líq · Estoque · Cobertura
  const totVendas = vds.valor || 0;
  const lucro = vds.lucro || 0;
  document.getElementById('kp-diag-novo').innerHTML = kgHtml([
    {l:'Vendas líquidas', v:fK(totVendas), s:fI(vds.qt||0)+' '+esc(p.unidade||'un')+' · '+(vds.meses||0)+' meses'},
    {l:'Margem bruta', v:fP(margReal), s:'Lucro '+fK(lucro), cls:margReal>10?'ok':margReal<5?'wn':''},
    {l:'Compras líquidas', v:fK(c12.valor||0), s:fI(c12.qt||0)+' '+esc(p.unidade||'un')+' · '+fI(c12.nfs||0)+' NFs'},
    {l:'Estoque atual', v:fI(e.qt||0)+' '+esc(p.unidade||''), s:'R$ '+fK(e.vl_preco||0)+' p/ venda'},
    {l:'Cobertura', v:coberturaTxt, s:coberturaDias!=null?'base: '+(mesesVend)+' meses de venda':'sem cálculo possível', cls:coberturaCls},
  ]);

  // Chart histórico mensal — saídas (vendas) + entradas (compras se tem ult_data)
  // Como compras_12m é só agregado, distribui no mês da última compra (ou mostra total)
  const meses = (p.vendas_por_mes||[]).slice();
  if(meses.length){
    // Cria mapa de entradas por mês (estimativa: só o mês da última compra, mostrando o total)
    // Nota: dados mais precisos exigiriam ETL com compras detalhadas por mês — futuro
    const entradasPorMes = {};
    if(c12.ult_data && c12.qt > 0){
      const ymUlt = c12.ult_data.substring(0,7);
      entradasPorMes[ymUlt] = c12.qt;
    }
    const labels = meses.map(function(m){return _ymToLabel(m.ym);});
    const dadosSaidas = meses.map(function(m){return m.qt||0;});
    const dadosEntradas = meses.map(function(m){return entradasPorMes[m.ym] || 0;});

    mkC('c-diag-hist', {type:'bar',
      data:{labels:labels,
            datasets:[
              {label:'Saídas (un)', data:dadosSaidas, backgroundColor:_PAL.ac+'CC', borderRadius:4},
              {label:'Entradas (un)', data:dadosEntradas, backgroundColor:_PAL.ok+'B0', borderRadius:4}
            ]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{position:'bottom', labels:{padding:8, usePointStyle:true, boxWidth:8, font:{size:10}}},
                 tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+fI(ctx.raw)+' '+(p.unidade||'un');}}}},
        scales:{x:{grid:{display:false},ticks:{font:{size:10}}},
                y:{ticks:{callback:function(v){return fI(v);}}}}}});

    // Popula tabela de extrato
    const tbody = document.getElementById('diag-extrato-tbody');
    if(tbody){
      let saldo = 0;
      let trs = '';
      meses.forEach(function(m){
        const sai = m.qt || 0;
        const ent = entradasPorMes[m.ym] || 0;
        const mov = ent - sai;
        saldo += mov;
        trs += '<tr>'
          + '<td class="L"><strong>'+_ymToLabel(m.ym)+'</strong></td>'
          + '<td style="color:#dc2626;">'+(sai>0?'-'+fI(sai):'—')+'</td>'
          + '<td style="color:#15803d;">'+(ent>0?'+'+fI(ent):'—')+'</td>'
          + '<td class="val-strong" style="color:'+(mov>=0?'#15803d':'#dc2626')+';">'+(mov>=0?'+':'')+fI(mov)+'</td>'
          + '</tr>';
      });
      tbody.innerHTML = trs;
    }
  }

  // Scroll pro topo da página
  cont.scrollTop = 0;
  window.scrollTo({top:0, behavior:'smooth'});
};

// Gera observações automáticas baseadas em status, giro, devolução, margem
function _diagGerarObservacoes(p){
  const obs = [];
  const e = p.estoque || {};
  const vds = p.vendas || {};
  const c12 = p.compras_12m || {};
  const dev = p.devol_2026 || {};

  if(p.status === 'MORTO'){
    obs.push({tag:'⚠ Estoque morto.', color:'#d92d20', msg:'sem venda há mais de 180 dias. Avalie remarcação ou devolução ao fornecedor.'});
  } else if(p.status === 'PARADO'){
    obs.push({tag:'⚠ Estoque parado.', color:'#b45309', msg:'sem venda nos últimos 90 dias.'});
  } else if(p.status === 'CRITICO'){
    obs.push({tag:'⚠ Giro crítico.', color:'#b45309', msg:'volume baixo de vendas, monitorar antes de imobilizar mais capital.'});
  }

  if(p.giro_dias != null && p.giro_dias > 180){
    obs.push({tag:'Giro elevado:', color:'#b45309', msg:p.giro_dias.toFixed(0)+' dias para girar o estoque atual (acima de 180 é alto).'});
  }

  if(vds.marg != null){
    if(vds.marg < 0){
      obs.push({tag:'⚠ Margem negativa.', color:'#d92d20', msg:'venda gerando prejuízo. Verifique custo, preço de venda e devoluções.'});
    } else if(vds.marg < 5){
      obs.push({tag:'Margem baixa:', color:'#b45309', msg:fP(vds.marg)+' está abaixo de 5%, espaço estreito para descontos.'});
    } else if(vds.marg > 25){
      obs.push({tag:'Boa margem:', color:'#109854', msg:fP(vds.marg)+' acima de 25%, rentável.'});
    }
  }

  if(dev.qt > 0){
    const pctDev = c12.qt > 0 ? (dev.qt/c12.qt*100) : 0;
    obs.push({tag:'Devoluções 2026:', color:'#b45309', msg:fI(dev.qt)+' unidades devolvidas ('+fP(pctDev)+' das compras 12m).'});
  }

  if(e.qt_avaria > 0){
    obs.push({tag:'Avarias:', color:'#b45309', msg:fI(e.qt_avaria)+' unidades em estoque marcadas como avariadas.'});
  }

  if(e.qt > 0 && c12.valor === 0){
    obs.push({tag:'Sem compras 12m:', color:'#b45309', msg:'tem estoque mas não houve compra nos últimos 12 meses. Possível encalhe.'});
  }

  if(e.qt === 0 && vds.qt > 0){
    obs.push({tag:'⚠ Estoque zerado:', color:'#d92d20', msg:'produto vende mas não há estoque atual. Risco de ruptura.'});
  }

  if(c12.preco_medio > 0 && e.custo > 0){
    const dif = ((e.custo - c12.preco_medio)/c12.preco_medio*100);
    if(Math.abs(dif) > 10){
      const dir = dif>0?'aumentou':'reduziu';
      obs.push({tag:'Variação de custo:', color:'#b45309', msg:'custo atual '+dir+' '+fP(Math.abs(dif))+' em relação à média de compra dos 12m.'});
    }
  }

  if(obs.length === 0){
    obs.push({tag:'✓ Tudo dentro do esperado.', color:'#109854', msg:'produto sem alertas críticos.'});
  }
  return obs;
}

// Sobrescreve openProd quando E está carregado pra que clicks em outras tabelas usem a versão nova.
// Adiamos a captura para após a definição do openProd legado (que aparece bem abaixo no script).
function _instalarWrapOpenProd(){
  if(_instalarWrapOpenProd._done) return;
  _instalarWrapOpenProd._done = true;
  const _origOpenProd = window.openProd;
  window.openProd = function(cod){
    if(typeof E !== 'undefined' && E && E.produtos && E.produtos.length){
      _diagBuildIdx();
      if(_diagIdxByC.has(cod)) return _openProdNovo(cod);
    }
    if(typeof _origOpenProd === 'function') return _origOpenProd(cod);
  };
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', _instalarWrapOpenProd);
} else {
  setTimeout(_instalarWrapOpenProd, 0);
}

// ════════════════════════════════════════════════════════════════════════
// FINANCEIRO NOVO · usa financeiro_atp.json (F) · sub-etapa 4l · 30/abr/2026
// Cobre: pagas (mensal/grupo/conta/fornecedor/perf), aberto (aging/grupo/forn/dia/titulos)
// ════════════════════════════════════════════════════════════════════════

// Contas relacionadas a fornecedores de mercadorias (filtro fixo aplicado em
// Posição Financeira e Vencidos a pagar)
const _CONTAS_MERCADORIAS = ['10001', '99912'];

function _ehContaMercadoria(c){
  if(c == null) return false;
  return _CONTAS_MERCADORIAS.indexOf(String(c)) >= 0;
}

// Recalcula aging a partir de uma lista de títulos abertos
// Buckets: A_VENCER, HOJE, VENCIDO_1_7, VENCIDO_8_30, VENCIDO_31_90, VENCIDO_90_PLUS
function _agingDeTitulos(titulos){
  const hoje = new Date();
  hoje.setHours(0,0,0,0);
  const buckets = {
    A_VENCER:        {valor:0, titulos:0},
    HOJE:            {valor:0, titulos:0},
    VENCIDO_1_7:     {valor:0, titulos:0},
    VENCIDO_8_30:    {valor:0, titulos:0},
    VENCIDO_31_90:   {valor:0, titulos:0},
    VENCIDO_90_PLUS: {valor:0, titulos:0}
  };
  titulos.forEach(function(t){
    if(!t.data_venc) return;
    const dv = new Date(t.data_venc + 'T12:00:00');
    const diffDias = Math.floor((dv - hoje) / (1000*60*60*24));
    const v = t.valor || t.valor_dup || 0;
    let b;
    if(diffDias > 0)        b = 'A_VENCER';
    else if(diffDias === 0) b = 'HOJE';
    else if(diffDias >= -7) b = 'VENCIDO_1_7';
    else if(diffDias >= -30) b = 'VENCIDO_8_30';
    else if(diffDias >= -90) b = 'VENCIDO_31_90';
    else                    b = 'VENCIDO_90_PLUS';
    buckets[b].valor += v;
    buckets[b].titulos += 1;
  });
  return buckets;
}

// Filtra os agregados de "pagas" (mensal, por_conta, por_fornecedor, etc)
// pra que considerem só conta de mercadorias quando isso for possível.
// Quando o agregado não tem mais o detalhe por conta (ex: mensal já é total),
// retorna ele como veio. Os agregados detalhados são reconstruídos a partir
// dos títulos pagos se disponíveis, ou simplesmente filtrados por código.
function _filtrarPagasMercadorias(pagas){
  const out = Object.assign({}, pagas);
  // por_conta: filtra
  if(Array.isArray(pagas.por_conta)){
    out.por_conta = pagas.por_conta.filter(function(c){return _ehContaMercadoria(c.cod);});
  }
  // por_grupo: pode ter grupo 100 (CMV) e 999 (Multa/Juros). Mantém só esses.
  // mas como eu não tenho certeza dos códigos do grupo, deixo todos pra evitar perda de dado.
  // por_fornecedor: já é só fornecedor; se houver títulos pagos detalhados, pode
  // ser filtrado por título.
  return out;
}

function renderFinanceiroNovo(){
  const cont = document.getElementById('page-financeiro');
  if(!cont || !F) return;
  const meta = F.meta || {};
  const res  = F.resumo || {};
  // F.aberto.titulos: filtra só conta 10001 e 99912
  const _abrOriginal = F.aberto || {};
  const titulosOrig = _abrOriginal.titulos || [];
  const titulosFiltrados = titulosOrig.filter(function(t){return _ehContaMercadoria(t.conta);});
  // Recalcula aging com os títulos filtrados
  const aging = _agingDeTitulos(titulosFiltrados);
  // Reconstrói por_fornecedor agregando só os títulos da conta de mercadorias.
  // Sem isso, `abr.por_fornecedor` (que vem direto do JSON) inclui Banco do Brasil,
  // Receita Federal, Secretaria da Fazenda etc — que aparecem em outras contas.
  const _hojeRef = new Date(); _hojeRef.setHours(0,0,0,0);
  const fornAgg = new Map();
  titulosFiltrados.forEach(function(t){
    const cod = (t.parceiro && t.parceiro.cod) || null;
    if(cod == null) return;
    if(!fornAgg.has(cod)){
      fornAgg.set(cod, {
        cod: cod,
        nome: (t.parceiro && t.parceiro.nome) || '',
        valor: 0, titulos: 0,
        mais_atrasado_dias: null
      });
    }
    const x = fornAgg.get(cod);
    x.valor   += t.valor || t.valor_dup || 0;
    x.titulos += 1;
    if(t.data_venc){
      const dv = new Date(t.data_venc + 'T12:00:00');
      const dias = Math.floor((_hojeRef - dv)/(1000*60*60*24)); // positivo = atrasado
      if(x.mais_atrasado_dias == null || dias > x.mais_atrasado_dias){
        x.mais_atrasado_dias = dias;
      }
    }
  });
  const porFornFiltrado = Array.from(fornAgg.values()).sort(function(a,b){return b.valor-a.valor;});
  // Reconstrói abr com os filtrados pra que código posterior use
  const abr = Object.assign({}, _abrOriginal, {
    titulos: titulosFiltrados,
    aging: aging,
    por_fornecedor: porFornFiltrado
  });
  // pagas: filtra apenas mensal/perfomance/por_conta/por_fornecedor que estiverem disponíveis
  const pagas = _filtrarPagasMercadorias(F.pagas || {});

  const resPago = (res.pago||{}).ATP || (res.pago||{})._total_grupo || {};
  // Recalcula resumo aberto a partir dos títulos filtrados
  const totalPagar = titulosFiltrados.reduce(function(s,t){return s+(t.valor||t.valor_dup||0);}, 0);
  const fornsAbr = new Set(); titulosFiltrados.forEach(function(t){if(t.parceiro&&t.parceiro.cod)fornsAbr.add(t.parceiro.cod);});
  const resAbr  = {total_pagar: totalPagar, titulos: titulosFiltrados.length, fornecedores: fornsAbr.size};
  const perf    = pagas.performance_prazo || {};

  // Totais derivados
  const vencidoTotal = (aging.HOJE||{valor:0}).valor + (aging.VENCIDO_1_7||{valor:0}).valor
                    + (aging.VENCIDO_8_30||{valor:0}).valor + (aging.VENCIDO_31_90||{valor:0}).valor
                    + (aging.VENCIDO_90_PLUS||{valor:0}).valor;
  const vencidoTit = (aging.HOJE||{titulos:0}).titulos + (aging.VENCIDO_1_7||{titulos:0}).titulos
                  + (aging.VENCIDO_8_30||{titulos:0}).titulos + (aging.VENCIDO_31_90||{titulos:0}).titulos
                  + (aging.VENCIDO_90_PLUS||{titulos:0}).titulos;
  const aVencer = (aging.A_VENCER||{valor:0}).valor;
  const pctVencido = resAbr.total_pagar > 0 ? (vencidoTotal/resAbr.total_pagar*100) : 0;

  const topConta = (pagas.por_conta||[]).slice().sort(function(a,b){return b.pago-a.pago;})[0];

  // Build HTML
  let html = '<div class="ph"><div class="pk">Financeiro</div><h2>Posição <em>financeira</em></h2></div>'
           + '<div class="ph-sep"></div>'
           + '<div class="page-body">';

  // Banner de filtro fixo
  html += '<div style="background:#dbeafe;border:1px solid #93c5fd;border-radius:8px;padding:9px 14px;margin-bottom:10px;font-size:11.5px;color:#1e40af;">'
       +   '<strong>Filtro ativo:</strong> mostrando apenas contas relacionadas a fornecedores de mercadorias '
       +   '(10001 · COMPRA DE MERCADORIAS, 99912 · MULTA E JUROS DE MORA).'
       + '</div>';

  // Banner explicativo
  const periodoIni = (meta.periodo&&meta.periodo.inicio) || '?';
  const periodoFim = (meta.periodo&&meta.periodo.fim)    || '?';
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       + '<strong>Pagas:</strong> '+esc(periodoIni)+' a '+esc(periodoFim)+' · '
       + '<strong>'+fI(resPago.titulos||0)+'</strong> títulos · '
       + '<strong>'+fI(resPago.fornecedores||0)+'</strong> fornecedores · '
       + 'Retrato a pagar gerado em '+esc((meta.geradoEm||'').substring(0,10))
       + '</div>';

  // KPIs
  html += '<div class="kg" style="grid-template-columns:repeat(6,1fr);margin-bottom:14px;" id="kg-fin-novo"></div>';

  // Gráficos removidos a pedido do usuário (Pagamentos por mês, Aging, Performance, Top grupos)

  // Próximos 30 dias (calculado dos títulos abertos)
  const titulos = abr.titulos || [];
  const hoje = new Date();
  const hojeStr = hoje.toISOString().substring(0,10);
  const limite = new Date(hoje.getTime() + 30*24*3600*1000).toISOString().substring(0,10);
  const prox30 = titulos.filter(function(t){return t.data_venc && t.data_venc >= hojeStr && t.data_venc <= limite;});
  const venc = titulos.filter(function(t){return t.data_venc && t.data_venc < hojeStr;});

  // Resumo dos próximos 30 dias por dia
  const porDia30 = {};
  prox30.forEach(function(t){
    if(!porDia30[t.data_venc]) porDia30[t.data_venc] = {valor:0, titulos:0};
    porDia30[t.data_venc].valor += t.valor || 0;
    porDia30[t.data_venc].titulos += 1;
  });
  const dias30Ord = Object.keys(porDia30).sort();

  html += '<div class="cc"><div class="cct">Agenda · próximos 30 dias</div>'
       +   '<div class="ccs">'+fI(prox30.length)+' títulos · total '+fK(prox30.reduce(function(s,t){return s+t.valor;},0))+'</div>'
       +   '<div style="height:200px;margin-top:8px;"><canvas id="c-fin-novo-prox"></canvas></div>'
       + '</div>';

  // Tabela de top fornecedores em aberto
  const topAberto = (abr.por_fornecedor||[]).slice().sort(function(a,b){return b.valor-a.valor;}).slice(0, 20);
  html += '<div class="cc"><div class="cct">Top 20 · contas a pagar por fornecedor</div>'
       +   '<div class="ccs">Maior atraso destacado · ordem por valor a pagar</div>'
       +   '<div class="tscroll" style="margin-top:8px;"><table class="t"><thead><tr>'
       +     '<th class="L" style="width:24px;">#</th>'
       +     '<th class="L">Fornecedor</th>'
       +     '<th>Títulos</th>'
       +     '<th>Valor a pagar</th>'
       +     '<th>Mais atrasado</th>'
       +   '</tr></thead><tbody>';
  topAberto.forEach(function(f, i){
    const dias = f.mais_atrasado_dias;
    let dTxt, dCls;
    if(dias == null){ dTxt='-'; dCls=''; }
    else if(dias < 0){ dTxt='vence em '+Math.abs(dias)+'d'; dCls=''; }
    else if(dias === 0){ dTxt='vence hoje'; dCls='wn'; }
    else if(dias <= 7){ dTxt='atrasado '+dias+'d'; dCls='wn'; }
    else if(dias <= 30){ dTxt='atrasado '+dias+'d'; dCls='dn'; }
    else { dTxt='atrasado '+dias+'d'; dCls='dn'; }
    html += '<tr>'
         +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
         +    '<td class="L" data-forn-cod="'+esc(f.cod)+'" title="Clique para ver diagnóstico do fornecedor"><strong>'+esc((f.nome||'').substring(0,42))+'</strong></td>'
         +    '<td>'+fI(f.titulos||0)+'</td>'
         +    '<td class="val-strong">'+fK(f.valor||0)+'</td>'
         +    '<td><span class="kg-tag '+dCls+'">'+esc(dTxt)+'</span></td>'
         +  '</tr>';
  });
  html += '</tbody></table></div></div>';

  // Tabela top contas (despesas)
  const topContas = (pagas.por_conta||[]).slice().sort(function(a,b){return b.pago-a.pago;}).slice(0, 15);
  const totPago = topContas.reduce(function(s,c){return s+c.pago;},0) || 1;
  html += '<div class="cc"><div class="cct">Top 15 · contas de despesa pagas no período</div>'
       +   '<div class="ccs">Análise para tomada de decisão sobre maiores categorias de gasto</div>'
       +   '<div class="tscroll" style="margin-top:8px;"><table class="t"><thead><tr>'
       +     '<th class="L" style="width:24px;">#</th>'
       +     '<th class="L">Conta</th>'
       +     '<th class="L">Grupo</th>'
       +     '<th>Pago</th>'
       +     '<th>Títulos</th>'
       +     '<th>% do total</th>'
       +   '</tr></thead><tbody>';
  let acum = 0;
  topContas.forEach(function(c, i){
    acum += c.pago;
    const pct = c.pago/(resPago.total||1)*100;
    html += '<tr>'
         +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
         +    '<td class="L"><strong>'+esc((c.nome||'').substring(0,38))+'</strong></td>'
         +    '<td>'+esc((c.grupo||'')+' '+(_fimGrupoNome(pagas.por_grupo, c.grupo)||'').substring(0,22))+'</td>'
         +    '<td class="val-strong">'+fK(c.pago)+'</td>'
         +    '<td>'+fI(c.titulos||0)+'</td>'
         +    '<td>'+fP(pct)+'</td>'
         +  '</tr>';
  });
  html += '</tbody></table></div></div>';

  // Tabela de títulos vencidos (top 30 maiores)
  if(venc.length > 0){
    const topVenc = venc.slice().sort(function(a,b){return b.valor-a.valor;}).slice(0, 30);
    html += '<div class="cc"><div class="cct">Títulos vencidos · top 30 maiores</div>'
         +   '<div class="ccs">'+fI(venc.length)+' títulos vencidos · total '+fK(venc.reduce(function(s,t){return s+t.valor;},0))+'</div>'
         +   '<div class="tscroll" style="max-height:480px;overflow-y:auto;margin-top:8px;"><table class="t"><thead><tr>'
         +     '<th class="L" style="width:24px;">#</th>'
         +     '<th class="L">Vencido em</th>'
         +     '<th class="L">Fornecedor</th>'
         +     '<th class="L">Conta</th>'
         +     '<th>Valor</th>'
         +     '<th>Atraso (d)</th>'
         +   '</tr></thead><tbody>';
    topVenc.forEach(function(t, i){
      const dCls = t.dias_atraso > 30 ? 'dn' : t.dias_atraso > 7 ? 'wn' : '';
      html += '<tr>'
           +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
           +    '<td class="L">'+fDt(t.data_venc)+'</td>'
           +    '<td class="L"><strong>'+esc(((t.parceiro&&t.parceiro.nome)||'').substring(0,32))+'</strong></td>'
           +    '<td class="L">'+esc((t.conta_desc||'').substring(0,28))+'</td>'
           +    '<td class="val-strong">'+fK(t.valor||0)+'</td>'
           +    '<td><span class="kg-tag '+dCls+'">'+fI(t.dias_atraso||0)+'d</span></td>'
           +  '</tr>';
    });
    html += '</tbody></table></div></div>';
  }

  html += '</div>'; // page-body
  cont.innerHTML = html;

  // KPIs
  document.getElementById('kg-fin-novo').innerHTML = kgHtml([
    {l:'Pago no período',v:fK(resPago.total||0),s:fI(resPago.titulos||0)+' títulos · '+fI(resPago.fornecedores||0)+' fornecedores'},
    {l:'A pagar (aberto)',v:fK(resAbr.total_pagar||0),s:fI(resAbr.titulos||0)+' títulos · '+fI(resAbr.fornecedores||0)+' fornecedores'},
    {l:'Vencido hoje',v:fK(vencidoTotal),s:fI(vencidoTit)+' títulos · '+fP(pctVencido)+' do aberto · inclui hoje + atrasados',cls:vencidoTotal>0?'dn':''},
    {l:'A vencer',v:fK(aVencer),s:fI((aging.A_VENCER||{titulos:0}).titulos)+' títulos no futuro'},
    {l:'Juros pagos',v:fK(resPago.juros||0),s:fP((resPago.total>0?resPago.juros/resPago.total*100:0))+' do total · custo de atraso',cls:resPago.juros>50000?'wn':''},
    {l:'Próximos 30 dias',v:fK(prox30.reduce(function(s,t){return s+t.valor;},0)),s:fI(prox30.length)+' títulos a vencer'},
  ]);

  // Chart 1: Mensal pago
  const mensal = (pagas.mensal||[]).slice().sort(function(a,b){return a.ym<b.ym?-1:1;});
  mkC('c-fin-novo-mensal',{type:'bar',
    data:{labels:mensal.map(function(m){return _ymToLabel(m.ym);}),
          datasets:[{label:'Pago',data:mensal.map(function(m){return m.pago;}),backgroundColor:_PAL.ac+'CC',borderRadius:4}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){var m=mensal[ctx.dataIndex];return fK(ctx.raw)+' · '+fI(m.titulos)+' títulos';}}}},
      scales:{x:{grid:{display:false}},y:{ticks:{callback:function(v){return fAbbr(v);}}}}}});

  // Chart 2: Aging
  const agOrd = ['A_VENCER','HOJE','VENCIDO_1_7','VENCIDO_8_30','VENCIDO_31_90','VENCIDO_90_PLUS'];
  const agLab = {A_VENCER:'A vencer',HOJE:'Hoje',VENCIDO_1_7:'1-7d',VENCIDO_8_30:'8-30d',VENCIDO_31_90:'31-90d',VENCIDO_90_PLUS:'90+d'};
  const agCol = {A_VENCER:_PAL.ok,HOJE:_PAL.wn,VENCIDO_1_7:_PAL.wn,VENCIDO_8_30:'#ea580c',VENCIDO_31_90:_PAL.dn,VENCIDO_90_PLUS:'#7f1d1d'};
  mkC('c-fin-novo-aging',{type:'bar',
    data:{labels:agOrd.map(function(k){return agLab[k];}),
          datasets:[{label:'Valor R$',data:agOrd.map(function(k){return (aging[k]||{valor:0}).valor;}),
                     backgroundColor:agOrd.map(function(k){return agCol[k]+'CC';}),borderRadius:4}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},
               tooltip:{callbacks:{label:function(ctx){var k=agOrd[ctx.dataIndex];var a=aging[k]||{};return fK(ctx.raw)+' · '+fI(a.titulos||0)+' títulos · '+fI(a.fornecedores||0)+' fornec';}}}},
      scales:{x:{grid:{display:false},ticks:{font:{size:10}}},y:{ticks:{callback:function(v){return fAbbr(v);}}}}}});

  // Chart 3: Performance prazo (donut)
  const ppOrd = ['adiantado','em_dia','atraso_curto','atraso_medio','atraso_longo'];
  const ppCol = {adiantado:_PAL.vi, em_dia:_PAL.ok, atraso_curto:_PAL.wn, atraso_medio:'#ea580c', atraso_longo:_PAL.dn};
  const ppData = ppOrd.map(function(k){return (perf[k]||{titulos:0}).titulos;});
  const ppLab  = ppOrd.map(function(k){return (perf[k]||{label:k}).label;});
  mkC('c-fin-novo-perf',{type:'doughnut',
    data:{labels:ppLab,datasets:[{data:ppData,backgroundColor:ppOrd.map(function(k){return ppCol[k];}),borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{position:'right',labels:{padding:8,usePointStyle:true,boxWidth:8,font:{size:10}}},
               tooltip:{callbacks:{label:function(ctx){var k=ppOrd[ctx.dataIndex];var p=perf[k]||{};return ctx.label+': '+fI(p.titulos||0)+' tit ('+fP(p.titulos_pct||0)+') · '+fK(p.valor||0)+' ('+fP(p.valor_pct||0)+')';}}}}}});

  // Chart 4: Top grupos
  const topGrupos = (function(){
    // Agrega por_grupo (que é por loja+ym+grupo) num único valor por grupo
    const agg = {};
    (pagas.por_grupo||[]).forEach(function(g){
      if(!agg[g.cod]) agg[g.cod] = {cod:g.cod, nome:g.nome, pago:0, titulos:0};
      agg[g.cod].pago += g.pago;
      agg[g.cod].titulos += g.titulos;
    });
    return Object.values(agg).sort(function(a,b){return b.pago-a.pago;}).slice(0,10);
  })();
  mkC('c-fin-novo-grupo',{type:'bar',
    data:{labels:topGrupos.map(function(g){return (g.nome||'').length>26?(g.nome||'').substring(0,26)+'…':(g.nome||'');}),
          datasets:[{label:'Pago',data:topGrupos.map(function(g){return g.pago;}),backgroundColor:_PAL.ac+'CC',borderRadius:4}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){var g=topGrupos[ctx.dataIndex];return fK(ctx.raw)+' · '+fI(g.titulos)+' tit';}}}},
      scales:{x:{ticks:{callback:function(v){return fAbbr(v);}}},y:{grid:{display:false},ticks:{font:{size:10}}}}}});

  // Chart 5: Próximos 30 dias por dia
  if(dias30Ord.length > 0){
    mkC('c-fin-novo-prox',{type:'bar',
      data:{labels:dias30Ord.map(function(d){return d.substring(8)+'/'+d.substring(5,7);}),
            datasets:[{label:'A pagar',data:dias30Ord.map(function(d){return porDia30[d].valor;}),
                       backgroundColor:_PAL.hl+'CC',borderRadius:3}]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){var d=dias30Ord[ctx.dataIndex];var p=porDia30[d];return fK(p.valor)+' · '+fI(p.titulos)+' títulos';}}}},
        scales:{x:{grid:{display:false},ticks:{font:{size:9},maxRotation:60,minRotation:45}},
                y:{ticks:{callback:function(v){return fAbbr(v);}}}}}});
  }
}

// Helper: encontra nome do grupo na lista por_grupo
function _fimGrupoNome(porGrupo, cod){
  if(!porGrupo) return '';
  const f = porGrupo.find(function(g){return g.cod===cod;});
  return f ? (f.nome||'') : '';
}

// ════════════════════════════════════════════════════════════════════════
// DEPARTAMENTOS NOVO · usa estoque_atp.json (E) · sub-etapa 4m · 30/abr/2026
// 3 níveis de drill: depto → seção → categoria
// Agrega E.produtos uma vez na primeira chamada, depois só filtra do cache.
// ════════════════════════════════════════════════════════════════════════
let _deptosCache = null;
let _deptosNivel = 'depto'; // 'depto' | 'secao' | 'categoria'
let _deptosPath = {};       // {deptoCod, deptoNome, secaoCod, secaoNome}

// Filtro de meses 2026 para Análise por Departamento.
// null = todos os meses 2026; array = só esses meses.
let _deptosFiltroMeses = null;

/**
 * Retorna meses YM em 2026 disponíveis no cubo (vendas).
 */
function _deptosYms2026(){
  if(!Cu) return [];
  let fv, campos;
  if(Cu.fatos && Cu.fatos.vendas){
    fv = Cu.fatos.vendas.linhas || []; campos = Cu.fatos.vendas.campos || [];
  } else if(Cu.fato_vendas){
    fv = Cu.fato_vendas.linhas || []; campos = Cu.fato_vendas.campos || [];
  } else { return []; }
  const idxYm = campos.indexOf('ym');
  if(idxYm < 0) return [];
  const set = {};
  fv.forEach(function(l){ const ym = l[idxYm]; if(ym && ym.indexOf('2026')===0) set[ym] = true; });
  return Object.keys(set).sort();
}

function _deptosAgregar(){
  // Decide se vai usar agregação 12m (default, original) ou agregação por meses 2026 do cubo
  const ymsAll = _deptosYms2026();
  const usarPeriodo = ymsAll.length > 0 && _deptosFiltroMeses !== null;
  if(!usarPeriodo){
    // Comportamento original (cache 12m)
    if(_deptosCache) return _deptosCache;
    return _deptosAgregar12m();
  }
  // Recalcula a cada chamada quando há filtro (sem cache, pra refletir a seleção)
  return _deptosAgregarPorPeriodo(_deptosFiltroMeses);
}

function _deptosAgregar12m(){
  const produtos = (E && E.produtos) || [];

  // Aggregator helper
  function emptyAgg(){
    return {skus:0, fat:0, lucro:0, vl_est_custo:0, vl_est_preco:0,
            parados:0, mortos:0, ativos:0, criticos:0, qt_v:0};
  }
  function pushProd(target, p){
    target.skus += 1;
    const vds = p.vendas || {};
    target.fat   += vds.valor || 0;
    target.lucro += vds.lucro || 0;
    target.qt_v  += vds.qt    || 0;
    const e = p.estoque || {};
    target.vl_est_custo += e.vl_custo || 0;
    target.vl_est_preco += e.vl_preco || 0;
    if(p.status === 'PARADO') target.parados += 1;
    if(p.status === 'MORTO')  target.mortos  += 1;
    if(p.status === 'ATIVO')  target.ativos  += 1;
    if(p.status === 'CRITICO') target.criticos += 1;
  }
  function finalize(arr){
    arr.forEach(function(a){
      a.marg = a.fat > 0 ? (a.lucro/a.fat*100) : 0;
      a.markup = a.vl_est_custo > 0 ? ((a.vl_est_preco - a.vl_est_custo)/a.vl_est_custo*100) : 0;
    });
  }

  const dMap = new Map();
  const sByD = new Map();
  const cBySD = new Map();

  produtos.forEach(function(p){
    const dCod = (p.depto && p.depto.cod) || 0;
    const dNm  = (p.depto && p.depto.nome) || '?';
    if(dNm === 'INATIVO') return;
    const sCod = (p.secao && p.secao.cod) || 0;
    const sNm  = (p.secao && p.secao.nome) || '(sem seção)';
    const cCod = (p.categoria && p.categoria.cod) || 0;
    const cNm  = (p.categoria && p.categoria.nome) || '(sem categoria)';

    if(!dMap.has(dCod)) dMap.set(dCod, Object.assign({cod:dCod, nome:dNm}, emptyAgg()));
    pushProd(dMap.get(dCod), p);

    if(!sByD.has(dCod)) sByD.set(dCod, new Map());
    const sm = sByD.get(dCod);
    if(!sm.has(sCod)) sm.set(sCod, Object.assign({cod:sCod, nome:sNm}, emptyAgg()));
    pushProd(sm.get(sCod), p);

    const sdKey = dCod+'/'+sCod;
    if(!cBySD.has(sdKey)) cBySD.set(sdKey, new Map());
    const cm = cBySD.get(sdKey);
    if(!cm.has(cCod)) cm.set(cCod, Object.assign({cod:cCod, nome:cNm}, emptyAgg()));
    pushProd(cm.get(cCod), p);
  });

  const deptos = Array.from(dMap.values());
  finalize(deptos);
  deptos.sort(function(a,b){return b.fat-a.fat;});

  const secoesPorDepto = new Map();
  sByD.forEach(function(m, dCod){
    const arr = Array.from(m.values());
    finalize(arr);
    arr.sort(function(a,b){return b.fat-a.fat;});
    secoesPorDepto.set(dCod, arr);
  });

  const categoriasPorSec = new Map();
  cBySD.forEach(function(m, key){
    const arr = Array.from(m.values());
    finalize(arr);
    arr.sort(function(a,b){return b.fat-a.fat;});
    categoriasPorSec.set(key, arr);
  });

  _deptosCache = {deptos:deptos, secoesPorDepto:secoesPorDepto, categoriasPorSec:categoriasPorSec};
  return _deptosCache;
}

/**
 * Agrega depto/seção/categoria filtrando por meses 2026 do cubo.
 * Mantém o cruzamento com E.produtos pra preservar status/markup/seção.
 */
function _deptosAgregarPorPeriodo(mesesArr){
  const ymsAll = _deptosYms2026();
  const meses = (mesesArr && mesesArr.length) ? mesesArr.filter(function(y){return ymsAll.indexOf(y)>=0;}) : ymsAll.slice();
  if(meses.length === 0) return _deptosAgregar12m();
  const mesesSet = new Set(meses);

  // Localiza fato_vendas
  let fv, campos;
  if(Cu.fatos && Cu.fatos.vendas){
    fv = Cu.fatos.vendas.linhas || []; campos = Cu.fatos.vendas.campos || [];
  } else if(Cu.fato_vendas){
    fv = Cu.fato_vendas.linhas || []; campos = Cu.fato_vendas.campos || [];
  } else { return _deptosAgregar12m(); }
  const iYm = campos.indexOf('ym');
  const iSku = campos.indexOf('sku');
  const iLiq = campos.indexOf('v_liq');
  const iLuc = campos.indexOf('v_luc');
  const iQt  = campos.indexOf('v_qt');
  if(iYm<0 || iSku<0) return _deptosAgregar12m();

  // Soma vendas por SKU no período selecionado
  const vSku = new Map();
  fv.forEach(function(l){
    if(!mesesSet.has(l[iYm])) return;
    const sku = l[iSku];
    if(!vSku.has(sku)) vSku.set(sku, {fat:0, lucro:0, qt:0});
    const a = vSku.get(sku);
    a.fat   += l[iLiq] || 0;
    a.lucro += l[iLuc] || 0;
    a.qt    += l[iQt]  || 0;
  });

  // Cruza com E.produtos pra ter depto/seção/categoria/estoque/status
  const produtos = (E && E.produtos) || [];

  function emptyAgg(){
    return {skus:0, fat:0, lucro:0, vl_est_custo:0, vl_est_preco:0,
            parados:0, mortos:0, ativos:0, criticos:0, qt_v:0};
  }
  function pushAgg(target, p, vendas){
    target.skus += 1;
    target.fat   += vendas.fat;
    target.lucro += vendas.lucro;
    target.qt_v  += vendas.qt;
    const e = p.estoque || {};
    target.vl_est_custo += e.vl_custo || 0;
    target.vl_est_preco += e.vl_preco || 0;
    if(p.status === 'PARADO') target.parados += 1;
    if(p.status === 'MORTO')  target.mortos  += 1;
    if(p.status === 'ATIVO')  target.ativos  += 1;
    if(p.status === 'CRITICO') target.criticos += 1;
  }
  function finalize(arr){
    arr.forEach(function(a){
      a.marg = a.fat > 0 ? (a.lucro/a.fat*100) : 0;
      a.markup = a.vl_est_custo > 0 ? ((a.vl_est_preco - a.vl_est_custo)/a.vl_est_custo*100) : 0;
    });
  }

  const dMap = new Map();
  const sByD = new Map();
  const cBySD = new Map();

  produtos.forEach(function(p){
    const dCod = (p.depto && p.depto.cod) || 0;
    const dNm  = (p.depto && p.depto.nome) || '?';
    if(dNm === 'INATIVO') return;
    const sCod = (p.secao && p.secao.cod) || 0;
    const sNm  = (p.secao && p.secao.nome) || '(sem seção)';
    const cCod = (p.categoria && p.categoria.cod) || 0;
    const cNm  = (p.categoria && p.categoria.nome) || '(sem categoria)';

    // Vendas do período pra esse SKU (se não tiver, é zero)
    const vendas = vSku.get(p.cod) || {fat:0, lucro:0, qt:0};

    if(!dMap.has(dCod)) dMap.set(dCod, Object.assign({cod:dCod, nome:dNm}, emptyAgg()));
    pushAgg(dMap.get(dCod), p, vendas);

    if(!sByD.has(dCod)) sByD.set(dCod, new Map());
    const sm = sByD.get(dCod);
    if(!sm.has(sCod)) sm.set(sCod, Object.assign({cod:sCod, nome:sNm}, emptyAgg()));
    pushAgg(sm.get(sCod), p, vendas);

    const sdKey = dCod+'/'+sCod;
    if(!cBySD.has(sdKey)) cBySD.set(sdKey, new Map());
    const cm = cBySD.get(sdKey);
    if(!cm.has(cCod)) cm.set(cCod, Object.assign({cod:cCod, nome:cNm}, emptyAgg()));
    pushAgg(cm.get(cCod), p, vendas);
  });

  const deptos = Array.from(dMap.values());
  finalize(deptos);
  deptos.sort(function(a,b){return b.fat-a.fat;});

  const secoesPorDepto = new Map();
  sByD.forEach(function(m, dCod){
    const arr = Array.from(m.values());
    finalize(arr);
    arr.sort(function(a,b){return b.fat-a.fat;});
    secoesPorDepto.set(dCod, arr);
  });

  const categoriasPorSec = new Map();
  cBySD.forEach(function(m, key){
    const arr = Array.from(m.values());
    finalize(arr);
    arr.sort(function(a,b){return b.fat-a.fat;});
    categoriasPorSec.set(key, arr);
  });

  _deptosCache = {deptos:deptos, secoesPorDepto:secoesPorDepto, categoriasPorSec:categoriasPorSec};
  return _deptosCache;
}

function renderDeptosNovo(){
  const cont = document.getElementById('page-deptos');
  if(!cont || !E) return;
  _deptosAgregar();

  // Reset estado ao re-entrar na página (igual o D legado fazia)
  if(_deptosNivel !== 'depto'){
    _deptosNivel = 'depto';
    _deptosPath = {};
  }

  // Meses 2026 disponíveis pelo cubo
  const ymsTodos = _deptosYms2026();
  const usarFiltro = ymsTodos.length > 0;
  const mesesAtivos = (Array.isArray(_deptosFiltroMeses) && _deptosFiltroMeses.length)
    ? _deptosFiltroMeses.filter(function(y){return ymsTodos.indexOf(y)>=0;})
    : ymsTodos.slice();
  const mesesSet = new Set(mesesAtivos);
  const filtroAtivo = usarFiltro && _deptosFiltroMeses !== null && mesesAtivos.length !== ymsTodos.length;

  let html = '<div class="ph"><div class="pk">Hierarquia</div><h2>Análise por <em>departamento</em></h2></div>'
           + '<div class="ph-sep"></div>'
           + '<div class="page-body">';

  // Filtro de meses (modelo CV)
  if(usarFiltro){
    const labelMes = filtroAtivo
      ? mesesAtivos.length+' de '+ymsTodos.length+' meses de 2026'
      : 'todos os meses de 2026';
    html += '<div class="cc" style="padding:12px 14px;margin-bottom:14px;">';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">';
    html += '<span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Período:</span>';
    ymsTodos.forEach(function(ym){
      const ativo = mesesSet.has(ym);
      html += '<button class="dn-mes-btn" data-ym="'+esc(ym)+'" style="padding:5px 10px;font-size:11.5px;border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;'
           +   (ativo?'background:var(--accent);color:white;':'background:var(--surface);color:var(--text);')
           + 'font-weight:600;">'+esc(_ymToLabel(ym))+'</button>';
    });
    if(filtroAtivo){
      html += '<button id="dn-meses-clear" style="padding:5px 8px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Limpar</button>';
    }
    html += '<button id="dn-meses-12m" style="padding:5px 10px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Últimos 12 meses</button>';
    html += '</div>';
    html += '<div style="margin-top:8px;font-size:11.5px;color:var(--text-dim);">'
         +   _deptosFiltroMeses === null
              ? 'Acumulado dos últimos 12 meses (modo padrão).'
              : 'Acumulado de '+esc(labelMes)+' (vendas reagregadas pelo cubo). Estoque e markup permanecem da posição atual.'
         + '</div>';
    html += '</div>';
  }

  // Banner
  const meta = E.meta || {};
  const periodoTxt = (meta.periodo_vendas && meta.periodo_vendas.meses) ? meta.periodo_vendas.meses+' meses' : '?';
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);line-height:1.5;">'
       + '<strong>'+fI(_deptosCache.deptos.length)+'</strong> departamentos · '
       + 'Drill: clique no nome para ver seções → categorias'
       + '</div>';

  // Legenda dos status
  html += '<div style="display:flex;gap:14px;flex-wrap:wrap;font-size:11px;background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:8px 12px;margin-bottom:14px;">'
       +   '<span style="color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;font-size:10px;">Legenda dos status:</span>'
       +   '<span><span class="kg-tag" style="background:#dcfce7;color:#15803d;border:1px solid #86efac;">ATIVO</span> vende com boa rotação (cobertura ≤ 90d)</span>'
       +   '<span><span class="kg-tag wn">CRÍTICO</span> vende mas com cobertura alta (&gt; 90d)</span>'
       +   '<span><span class="kg-tag wn">PARADO</span> sem venda nos últimos 90 dias</span>'
       +   '<span><span class="kg-tag dn">MORTO</span> sem venda nos últimos 180 dias ou sem estoque</span>'
       + '</div>';

  // Charts removidos a pedido do usuário (mantida só a tabela com drill)

  // Tabela com drill
  html += '<div class="cc">'
       +    '<div class="cch">'
       +      '<div><div class="cct">Tabela detalhada</div>'
       +        '<div class="ccs" id="dn-bc-txt">Clique em um departamento para ver as seções</div></div>'
       +      '<button id="dn-bc-back" style="display:none;padding:6px 14px;border-radius:6px;background:var(--accent-bg);color:var(--accent-text);border:none;font-weight:700;cursor:pointer;font-size:12px;">← Voltar</button>'
       +    '</div>'
       +    '<div class="tscroll" style="margin-top:8px;">'
       +      '<table class="t" id="t-dn">'
       +        '<thead><tr>'
       +          '<th class="L">Nome</th>'
       +          '<th>SKUs</th>'
       +          '<th>Faturamento</th>'
       +          '<th>Lucro</th>'
       +          '<th>Margem %</th>'
       +          '<th>Estoque (custo)</th>'
       +          '<th>Ativos</th>'
       +          '<th>Parados</th>'
       +          '<th>Mortos</th>'
       +        '</tr></thead>'
       +        '<tbody id="tb-dn"></tbody>'
       +      '</table>'
       +    '</div>'
       + '</div>';

  html += '</div>';
  cont.innerHTML = html;

  _deptosRender();

  // Listener do botão voltar
  const back = document.getElementById('dn-bc-back');
  if(back){
    back.addEventListener('click', function(){
      if(_deptosNivel === 'categoria'){
        _deptosNivel = 'secao';
        _deptosPath.secaoCod = null;
        _deptosPath.secaoNome = null;
      } else if(_deptosNivel === 'secao'){
        _deptosNivel = 'depto';
        _deptosPath = {};
      }
      _deptosRender();
    });
  }

  // Filtro de meses
  document.querySelectorAll('.dn-mes-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const ym = btn.getAttribute('data-ym');
      const atual = (_deptosFiltroMeses && _deptosFiltroMeses.length) ? _deptosFiltroMeses.slice() : ymsTodos.slice();
      const i = atual.indexOf(ym);
      if(i >= 0) atual.splice(i, 1);
      else atual.push(ym);
      _deptosFiltroMeses = atual.length === 0 ? null : atual;
      _deptosCache = null; // invalida cache pra recalcular
      renderDeptosNovo();
    });
  });
  const btnClearD = document.getElementById('dn-meses-clear');
  if(btnClearD) btnClearD.addEventListener('click', function(){
    _deptosFiltroMeses = null;
    _deptosCache = null;
    renderDeptosNovo();
  });
  const btn12m = document.getElementById('dn-meses-12m');
  if(btn12m) btn12m.addEventListener('click', function(){
    _deptosFiltroMeses = null; // 12m é o cache padrão (sem filtro)
    _deptosCache = null;
    renderDeptosNovo();
  });
}

function _deptosRender(){
  const c = _deptosCache;
  let items, bcTxt, chartTitle1, chartTitle2;

  if(_deptosNivel === 'depto'){
    items = c.deptos;
    bcTxt = 'Clique em um departamento para ver as seções';
    chartTitle1 = 'Faturamento × Estoque (a custo) por departamento';
    chartTitle2 = 'Margem por departamento';
  } else if(_deptosNivel === 'secao'){
    items = c.secoesPorDepto.get(_deptosPath.deptoCod) || [];
    bcTxt = 'Seções de: '+(_deptosPath.deptoNome||'?');
    chartTitle1 = 'Faturamento × Estoque · seções de '+(_deptosPath.deptoNome||'?');
    chartTitle2 = 'Margem · seções de '+(_deptosPath.deptoNome||'?');
  } else {
    items = c.categoriasPorSec.get(_deptosPath.deptoCod+'/'+_deptosPath.secaoCod) || [];
    bcTxt = 'Categorias de: '+(_deptosPath.secaoNome||'?')+' · '+(_deptosPath.deptoNome||'?');
    chartTitle1 = 'Faturamento × Estoque · categorias de '+(_deptosPath.secaoNome||'?');
    chartTitle2 = 'Margem · categorias de '+(_deptosPath.secaoNome||'?');
  }

  // Atualiza textos (charts foram removidos, então ct1/ct2 podem ser null)
  const bcEl = document.getElementById('dn-bc-txt');
  if(!bcEl){
    // HTML de página não foi renderizado ainda — abortar silenciosamente
    return;
  }
  bcEl.textContent = bcTxt;
  // Títulos dos charts são opcionais (charts foram removidos a pedido)
  const ct1 = document.getElementById('dn-chart-title-1');
  const ct2 = document.getElementById('dn-chart-title-2');
  if(ct1) ct1.textContent = chartTitle1;
  if(ct2) ct2.textContent = chartTitle2;
  const back = document.getElementById('dn-bc-back');
  if(back) back.style.display = (_deptosNivel === 'depto') ? 'none' : 'inline-block';

  // Tabela
  const tb = document.getElementById('tb-dn');
  if(!tb) return;
  if(!items.length){
    tb.innerHTML = '<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:14px;">Nenhum item neste nível.</td></tr>';
  } else {
    let html = '';
    items.forEach(function(it){
      const margCls = it.marg<0?'dn':it.marg<5?'wn':it.marg<10?'':'ok';
      const clickable = (_deptosNivel !== 'categoria');
      const cursor = clickable ? 'cursor:pointer;' : '';
      const titleAttr = clickable ? ('title="Clique para ver '+(_deptosNivel==='depto'?'seções':'categorias')+'"') : '';
      html += '<tr style="'+cursor+'" data-cod="'+it.cod+'" data-nome="'+escAttr(it.nome||'')+'" '+titleAttr+'>'
           +    '<td class="L"><strong>'+esc(it.nome||'')+'</strong>'+(clickable?' <span style="color:var(--text-muted);font-size:10px;">→</span>':'')+'</td>'
           +    '<td>'+fI(it.skus||0)+'</td>'
           +    '<td class="val-strong">'+fK(it.fat||0)+'</td>'
           +    '<td>'+fK(it.lucro||0)+'</td>'
           +    '<td><span class="kg-tag '+margCls+'">'+fP(it.marg||0)+'</span></td>'
           +    '<td>'+fK(it.vl_est_custo||0)+'</td>'
           +    '<td>'+fI(it.ativos||0)+'</td>'
           +    '<td>'+(it.parados>0?'<span class="kg-tag wn">'+fI(it.parados)+'</span>':fI(it.parados))+'</td>'
           +    '<td>'+(it.mortos>0?'<span class="kg-tag dn">'+fI(it.mortos)+'</span>':fI(it.mortos))+'</td>'
           +  '</tr>';
    });
    tb.innerHTML = html;

    // Click handlers para drill (apenas se não for categoria)
    if(_deptosNivel !== 'categoria'){
      tb.querySelectorAll('tr[data-cod]').forEach(function(tr){
        tr.addEventListener('click', function(){
          const cod = parseInt(tr.dataset.cod, 10);
          const nm  = tr.dataset.nome;
          if(_deptosNivel === 'depto'){
            _deptosPath = {deptoCod:cod, deptoNome:nm};
            _deptosNivel = 'secao';
          } else if(_deptosNivel === 'secao'){
            _deptosPath.secaoCod = cod;
            _deptosPath.secaoNome = nm;
            _deptosNivel = 'categoria';
          }
          _deptosRender();
        });
      });
    }
  }

  // Charts
  const top = items.slice(0, 12);
  // Chart 1: Faturamento × Estoque a custo (lado a lado)
  mkC('c-dn-vc',{type:'bar',
    data:{labels:top.map(function(x){return (x.nome||'').length>20?(x.nome||'').substring(0,20)+'…':(x.nome||'');}),
          datasets:[
            {label:'Faturamento',data:top.map(function(x){return x.fat;}),backgroundColor:_PAL.hl+'CC',borderRadius:4},
            {label:'Estoque a custo',data:top.map(function(x){return x.vl_est_custo;}),backgroundColor:_PAL.ac+'CC',borderRadius:4}
          ]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
      plugins:{legend:{position:'bottom',labels:{padding:8,usePointStyle:true,boxWidth:8,font:{size:10}}},
               tooltip:{callbacks:{label:function(ctx){return ctx.dataset.label+': '+fK(ctx.raw);}}}},
      scales:{x:{ticks:{callback:function(v){return fAbbr(v);}}},y:{grid:{display:false},ticks:{font:{size:10}}}}}});

  // Chart 2: Margem (cor por valor)
  mkC('c-dn-marg',{type:'bar',
    data:{labels:top.map(function(x){return (x.nome||'').length>20?(x.nome||'').substring(0,20)+'…':(x.nome||'');}),
          datasets:[{label:'Margem %',data:top.map(function(x){return x.marg;}),
                     backgroundColor:top.map(function(x){return x.marg<0?_PAL.dn+'CC':x.marg<5?_PAL.wn+'CC':x.marg<10?_PAL.hl+'CC':_PAL.ok+'CC';}),
                     borderRadius:4}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},
               tooltip:{callbacks:{label:function(ctx){return fP(ctx.raw);}}}},
      scales:{x:{beginAtZero:false,ticks:{callback:function(v){return fP(v);}}},y:{grid:{display:false},ticks:{font:{size:10}}}}}});
}

// ════════════════════════════════════════════════════════════════════════
// ALERTAS DE COMPRAS NOVO · usa estoque_atp.json (E) · sub-etapa 4n · 30/abr/2026
// 7 categorias de alerta calculadas client-side a partir de E.produtos.
// ════════════════════════════════════════════════════════════════════════
let _alertasCache = null;     // {categorias: [{k, items}], deptosUnicos: []}
let _alertasFiltroDepto = ''; // '' = todos, ou nome do depto

function _alertasCalcular(){
  if(_alertasCache) return _alertasCache;
  const produtos = (E && E.produtos) || [];

  // Determina o último mês fechado e os 2 anteriores para growth/decline
  const ultMes = E.meta && E.meta.ultimo_mes_vendas;
  let ymComp = null, ymPrev1 = null, ymPrev2 = null;
  if(ultMes && ultMes.ym){
    // Se aberto, mês comparativo é o anterior
    const ym = ultMes.ym;
    const [y, m] = ym.split('-').map(Number);
    let dy = y, dm = m;
    if(ultMes.aberto){ dm -= 1; if(dm < 1){ dm = 12; dy -= 1; } }
    ymComp = dy+'-'+String(dm).padStart(2,'0');
    let p1y = dy, p1m = dm - 1; if(p1m < 1){ p1m = 12; p1y -= 1; }
    let p2y = p1y, p2m = p1m - 1; if(p2m < 1){ p2m = 12; p2y -= 1; }
    ymPrev1 = p1y+'-'+String(p1m).padStart(2,'0');
    ymPrev2 = p2y+'-'+String(p2m).padStart(2,'0');
  }

  // Buckets por categoria
  // Removidos a pedido: ruptura, mk_baixo, dev_forn, crescendo.
  const buckets = {
    excesso_compra: [],
    parado: [],
    queda: []
  };

  produtos.forEach(function(p){
    const e   = p.estoque || {};
    const vds = p.vendas || {};
    const c12 = p.compras_12m || {};

    const fat   = vds.valor || 0;
    const qtV   = vds.qt    || 0;
    const qtC   = c12.qt    || 0;
    const qtE   = e.qt      || 0;
    const vlE   = e.vl_custo || 0;
    const giro  = p.giro_dias;

    // 1. Excesso de compras: comprou >> vendeu e tem muito estoque
    if(qtC > 0 && qtV > 0 && qtC > qtV * 1.3 && qtE > qtV * 0.5 && vlE > 1000){
      buckets.excesso_compra.push(p);
    }

    // 2. Estoque parado: cobertura > 120 dias e estoque > R$2.000
    if(giro != null && giro > 120 && vlE > 2000){
      buckets.parado.push(p);
    }

    // 3. Queda brusca: precisa de comparativo mensal
    if(ymComp && ymPrev1 && ymPrev2 && p.vendas_por_mes && p.vendas_por_mes.length){
      const mp = {};
      p.vendas_por_mes.forEach(function(m){ mp[m.ym] = m.qt || 0; });
      const c = mp[ymComp]   || 0;
      const a = mp[ymPrev1]  || 0;
      const b = mp[ymPrev2]  || 0;
      const med = (a + b) / 2;
      if(med >= 20){
        const g = (c - med) / med * 100;
        p._growth = g;
        p._growth_ym = ymComp;
        if(g <= -50 && fat > 10000) buckets.queda.push(p);
      }
    }
  });

  // Ordena cada bucket por faturamento desc
  Object.keys(buckets).forEach(function(k){
    buckets[k].sort(function(a,b){
      return ((b.vendas&&b.vendas.valor)||0) - ((a.vendas&&a.vendas.valor)||0);
    });
  });

  // Lista única de deptos para o filtro
  const setD = new Set();
  produtos.forEach(function(p){ if(p.depto && p.depto.nome) setD.add(p.depto.nome); });
  const deptos = Array.from(setD).sort();

  _alertasCache = {buckets:buckets, deptos:deptos, ymComp:ymComp, ymPrev1:ymPrev1, ymPrev2:ymPrev2};
  return _alertasCache;
}

function renderAlertasNovo(){
  const cont = document.getElementById('page-alertas');
  if(!cont || !E) return;
  _alertasCalcular();

  let html = '<div class="ph"><div class="pk">Alertas comerciais</div><h2><em>Alertas</em> e oportunidades</h2></div>'
           + '<div class="ph-sep"></div>'
           + '<div class="page-body">';

  // Banner com contadores agregados + filtro
  const c = _alertasCache;
  const totGeral = Object.keys(c.buckets).reduce(function(s,k){return s+c.buckets[k].length;},0);
  // Atualiza o badge do menu lateral com contagem real
  _atualizarBadgeAlertas(totGeral);
  const periodoComp = c.ymComp ? _ymToLabel(c.ymComp)+' vs '+_ymToLabel(c.ymPrev2)+'-'+_ymToLabel(c.ymPrev1) : 'sem comparativo';
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);display:flex;align-items:center;gap:14px;flex-wrap:wrap;">'
       +   '<div><strong>'+fI(totGeral)+'</strong> alertas detectados · análise de '+fI((E.produtos||[]).length)+' SKUs · comparativo de tendência: '+esc(periodoComp)+'</div>'
       +   '<div style="margin-left:auto;display:flex;align-items:center;gap:8px;">'
       +     '<label style="font-size:11px;color:var(--text-muted);">Filtrar depto:</label>'
       +     '<select id="al-novo-dept" style="padding:5px 10px;border:1px solid var(--border-strong);border-radius:6px;font-size:12px;background:var(--surface);color:var(--text);">'
       +       '<option value="">Todos os departamentos</option>'
       +       c.deptos.map(function(d){return '<option value="'+escAttr(d)+'">'+esc(d)+'</option>';}).join('')
       +     '</select>'
       +   '</div>'
       + '</div>';

  // Container dos cards (vai ser populado pela _alertasRender)
  html += '<div id="al-novo-cards"></div>';

  html += '</div>';
  cont.innerHTML = html;

  // Listener do filtro
  const sel = document.getElementById('al-novo-dept');
  if(sel){
    sel.addEventListener('change', function(){
      _alertasFiltroDepto = sel.value || '';
      _alertasRenderCards();
    });
  }

  _alertasRenderCards();

  // Atualiza badge no menu lateral
  const badge = document.querySelector('.sb-link[data-p="alertas"] .sb-cnt');
  if(badge) badge.textContent = totGeral;
}

function _alertasRenderCards(){
  const cont = document.getElementById('al-novo-cards');
  if(!cont) return;
  const c = _alertasCache;

  // Configuração visual de cada categoria
  // Removidos a pedido do usuário: ruptura, mk_baixo (markup estreito), dev_forn (alta devolução), crescendo (crescimento forte).
  // Mantidos: excesso_compra, parado, queda.
  const CFGS = [
    {k:'excesso_compra', ico:'▣', tt:'Excesso de compras', sb:'Comprou muito acima da venda com estoque alto', cls:'wn',
     fn:function(p){var c12=p.compras_12m||{};var vds=p.vendas||{};var e=p.estoque||{};return 'Comprou '+fI(c12.qt||0)+' un · vendeu '+fI(vds.qt||0)+' un · estoque atual '+fI(e.qt||0)+' un';}},
    {k:'parado', ico:'⏸', tt:'Estoque parado', sb:'Cobertura > 120 dias e estoque > R$ 2.000', cls:'wn',
     fn:function(p){var e=p.estoque||{};return (p.giro_dias||0).toFixed(0)+' dias de cobertura · '+fK(e.vl_custo||0)+' imobilizado';}},
    {k:'queda', ico:'▼', tt:'Queda brusca', sb:'-50% no mês comparativo vs média dos 2 meses anteriores · faturamento > R$ 10k', cls:'dn',
     fn:function(p){return fP(p._growth||0)+' no '+_ymToLabel(p._growth_ym||'');}},
  ];
  const icoBg = {dn:'background:var(--danger-bg);color:var(--danger-text)',
                 wn:'background:var(--warning-bg);color:var(--warning)',
                 ok:'background:var(--success-bg);color:var(--success-text)'};

  let html = '';
  CFGS.forEach(function(cfg){
    let items = c.buckets[cfg.k] || [];
    if(_alertasFiltroDepto){
      items = items.filter(function(p){return p.depto && p.depto.nome === _alertasFiltroDepto;});
    }
    const tcls = cfg.cls === 'dn' ? 'dn' : cfg.cls === 'wn' ? 'wn' : cfg.cls === 'ok' ? 'ok' : '';

    html += '<div class="cc" style="margin-bottom:14px;">'
         +    '<div class="cch">'
         +      '<div style="display:flex;align-items:center;gap:10px;">'
         +        '<div style="width:34px;height:34px;border-radius:8px;'+icoBg[cfg.cls]+';display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;">'+cfg.ico+'</div>'
         +        '<div>'
         +          '<div class="cct" style="margin-bottom:0;">'+esc(cfg.tt)+' <span class="kg-tag '+tcls+'" style="margin-left:6px;font-size:10px;padding:2px 8px;">'+fI(items.length)+'</span></div>'
         +          '<div class="ccs">'+esc(cfg.sb)+'</div>'
         +        '</div>'
         +      '</div>'
         +    '</div>';

    if(items.length === 0){
      html += '<div style="padding:14px 0;font-size:12px;color:var(--text-muted);">Nenhum item neste alerta'+(_alertasFiltroDepto?' para '+esc(_alertasFiltroDepto):'')+'.</div>';
    } else {
      const top = items.slice(0, 50);
      html += '<div class="tscroll" style="max-height:360px;overflow-y:auto;margin-top:8px;"><table class="t"><thead><tr>'
           +    '<th class="L">Produto</th>'
           +    '<th class="L">Detalhe</th>'
           +    '<th>Faturamento</th>'
           +    '<th>Margem</th>'
           +    '<th class="L">Depto</th>'
           +  '</tr></thead><tbody>';
      top.forEach(function(p){
        const vds = p.vendas || {};
        const margCls = (vds.marg||0)<0?'dn':(vds.marg||0)<5?'wn':(vds.marg||0)<10?'':'ok';
        html += '<tr style="cursor:pointer;" onclick="if(typeof openProd===\'function\')openProd('+p.cod+');">'
             +    '<td class="L">'
             +      '<div style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--text-muted);">#'+esc(p.cod)+'</div>'
             +      '<div style="font-weight:600;">'+esc((p.desc||'').substring(0,40))+'</div>'
             +    '</td>'
             +    '<td class="L" style="font-size:11px;color:var(--text-dim);">'+esc(cfg.fn(p))+'</td>'
             +    '<td class="val-strong">'+fK(vds.valor||0)+'</td>'
             +    '<td><span class="kg-tag '+margCls+'">'+fP(vds.marg||0)+'</span></td>'
             +    '<td class="L"><span style="font-size:10px;color:var(--text-muted);">'+esc((p.depto&&p.depto.nome)||'')+'</span></td>'
             +  '</tr>';
      });
      if(items.length > 50) html += '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);font-size:11px;padding:8px;">... e mais '+(items.length-50)+' itens. Clique em <em>'+esc(cfg.tt)+'</em> ou use o filtro de depto para refinar.</td></tr>';
      html += '</tbody></table></div>';
    }

    html += '</div>';
  });

  cont.innerHTML = html;
}

// ════════════════════════════════════════════════════════════════════════
// DIAGNÓSTICO DE FORNECEDOR NOVO · usa estoque_atp.json (E) · sub-etapa 4o
// Reusa _fornAgregar() já existente (sub-etapa 4j) + cruza com E.produtos
// ════════════════════════════════════════════════════════════════════════
let _diagFornIdxByCod  = null;  // Map(fornCod → fornAgg)
let _diagFornListaOrd  = null;  // Lista ordenada por compra desc
let _diagFornBoundProd = false; // Flag pra não bindar listeners 2x

function _diagFornBuildIdx(){
  if(_diagFornIdxByCod) return;
  _fornAgregar();
  _diagFornIdxByCod = new Map();
  _diagFornListaOrd = (_fornAggCache || []).slice();
  _diagFornListaOrd.forEach(function(f){ _diagFornIdxByCod.set(f.cod, f); });
  // Ordena por compra desc (mais relevantes primeiro nas buscas)
  _diagFornListaOrd.sort(function(a,b){return b.v_compra - a.v_compra;});
}

function renderDiagFornNovo(){
  const cont = document.getElementById('page-diag-forn');
  if(!cont || !E) return;

  // Bloqueio: diagnóstico só faz sentido por loja específica
  if(typeof _filialAtual === 'undefined' || !_filialAtual || !_filialAtual.base_sigla){
    _renderDiagAvisoConsolidado('page-diag-forn', 'Diagnóstico de Fornecedor');
    return;
  }

  _diagFornBuildIdx();

  const empty = document.getElementById('diag-forn-empty');
  const dcnt  = document.getElementById('diag-forn-content');
  if(empty) empty.style.display = '';
  if(dcnt){ dcnt.style.display = 'none'; dcnt.innerHTML = ''; }

  if(_diagFornBoundProd) return;
  _diagFornBoundProd = true;

  const inp = document.getElementById('forn-diag-srch');
  const drp = document.getElementById('forn-diag-drop');
  if(!inp || !drp) return;

  // Clona pra remover handlers legados
  const inpNew = inp.cloneNode(true);
  inp.parentNode.replaceChild(inpNew, inp);

  let timer = null;
  inpNew.addEventListener('input', function(){
    clearTimeout(timer);
    timer = setTimeout(function(){ _diagFornDoSearch(inpNew.value); }, 120);
  });
  inpNew.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ drp.classList.remove('show'); inpNew.blur(); }
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('#forn-diag-srch') && !e.target.closest('#forn-diag-drop')){
      drp.classList.remove('show');
    }
  });
}

function _diagFornDoSearch(q){
  q = (q||'').trim().toLowerCase();
  const drp = document.getElementById('forn-diag-drop');
  if(!drp) return;
  if(q.length < 2){ drp.classList.remove('show'); return; }

  const tokens = q.split(/\s+/).filter(function(t){return t.length>0;});
  const achados = _diagFornListaOrd.filter(function(f){
    const nm = (f.nome||'').toLowerCase();
    return tokens.every(function(t){return nm.indexOf(t)>=0;});
  });

  const top = achados.slice(0, 25);
  if(!top.length){
    drp.innerHTML = '<div style="padding:18px;text-align:center;color:var(--text-muted);font-size:13px;">Nenhum fornecedor encontrado para &quot;'+esc(q)+'&quot;</div>';
    drp.classList.add('show');
    return;
  }

  // Score visual baseado em margem
  function scoreCls(m){return m>=10?'g':m>=5?'m':'b';}
  function scoreIco(m){return m>=10?'▲':m>=5?'●':'▼';}

  let html = '<div class="drp-hdr">'+achados.length+' resultado'+(achados.length!==1?'s':'')+' para "'+esc(q)+'"';
  if(achados.length > 25) html += ' · mostrando top 25';
  html += '</div>';

  top.forEach(function(f){
    html += '<div class="sri" data-cod="'+f.cod+'" style="grid-template-columns:auto 1fr auto;">'
         +    '<span class="sc-b '+scoreCls(f.marg)+'" style="font-size:10px;">'+scoreIco(f.marg)+' '+fP(f.marg||0)+'</span>'
         +    '<div>'
         +      '<div class="sm">'+_diagHighlight(f.nome, tokens)+'</div>'
         +      '<div class="ss">'+fI(f.skus||0)+' SKUs · vendas '+fK(f.v_venda||0)+' · compras '+fK(f.v_compra||0)+'</div>'
         +    '</div>'
         +    '<div class="sv">'+fK(f.lucro||0)+'</div>'
         +  '</div>';
  });

  drp.innerHTML = html;
  drp.querySelectorAll('.sri').forEach(function(el){
    el.addEventListener('click', function(){
      _openFornNovo(parseInt(el.dataset.cod, 10));
      drp.classList.remove('show');
      const inp = document.getElementById('forn-diag-srch');
      if(inp) inp.value = '';
    });
  });
  drp.classList.add('show');
}

window._openFornNovo = function(cod){
  _diagFornBuildIdx();
  const f = _diagFornIdxByCod.get(cod);
  if(!f){ console.warn('[_openFornNovo] fornecedor não encontrado:', cod); return; }

  // Garante ativo na navegação
  document.querySelectorAll('.sb-link').forEach(function(x){x.classList.remove('active');});
  const link = document.querySelector('.sb-link[data-p="diag-forn"]');
  if(link) link.classList.add('active');
  if(typeof _expandirGrupoDaPaginaAtiva==='function') _expandirGrupoDaPaginaAtiva();
  document.querySelectorAll('.page').forEach(function(x){x.classList.remove('active');});
  document.getElementById('page-diag-forn').classList.add('active');

  const empty = document.getElementById('diag-forn-empty');
  if(empty) empty.style.display = 'none';
  const cont = document.getElementById('diag-forn-content');
  if(!cont) return;
  cont.style.display = 'block';

  // Filtra SKUs do fornecedor
  const skus = (E.produtos || []).filter(function(p){
    return p.fornecedor && p.fornecedor.cod === cod;
  }).sort(function(a,b){
    return ((b.vendas&&b.vendas.valor)||0) - ((a.vendas&&a.vendas.valor)||0);
  });

  // Agrega vendas_por_mes de todos os SKUs do fornecedor
  const vpmAcc = {};
  skus.forEach(function(p){
    (p.vendas_por_mes||[]).forEach(function(m){
      if(!vpmAcc[m.ym]) vpmAcc[m.ym] = 0;
      vpmAcc[m.ym] += m.qt || 0;
    });
  });
  const vpmYms = Object.keys(vpmAcc).sort();

  // Tags automáticas
  const tags = [];
  if(f.marg < 0) tags.push({l:'Margem negativa', c:'dn'});
  else if(f.marg > 15) tags.push({l:'Alta margem', c:'ok'});
  else if(f.marg < 5) tags.push({l:'Margem baixa', c:'wn'});

  if(f.dev_valor > 5000) tags.push({l:'Devoluções altas', c:'wn'});
  if(f.pct_devol > 5) tags.push({l:'Pct devolução crítica', c:'dn'});
  if(f.skus_paralisados > 5) tags.push({l:f.skus_paralisados+' SKUs parados', c:'wn'});
  if(f.v_compra > 1000000) tags.push({l:'Fornecedor estratégico', c:'ac'});
  if(f.v_compra === 0 && f.v_venda > 0) tags.push({l:'Sem compras 12m', c:'wn'});

  // Concentração nos top 3 SKUs
  const top3Fat = skus.slice(0, 3).reduce(function(s,p){return s+((p.vendas&&p.vendas.valor)||0);},0);
  const totalFat = f.v_venda || 1;
  const concPct = totalFat > 0 ? (top3Fat/totalFat*100) : 0;

  let html = '';

  // Hero
  html += '<div class="prod-hero">'
       +    '<div class="ph-nav">Diag. Fornecedor</div>'
       +    '<div class="ph-code">#'+esc(f.cod)+' · '+fI(f.skus||0)+' SKUs · '+fI(skus.filter(function(p){return p.status==='ATIVO';}).length)+' ativos</div>'
       +    '<h2>'+esc(f.nome||'')+'</h2>'
       +    '<div class="ph-tags">'
       +      tags.map(function(t){return '<span class="kg-tag '+t.c+'" style="font-size:11px;">'+esc(t.l)+'</span>';}).join('')
       +    '</div>'
       + '</div>';

  // KPIs (8) — em duas linhas de 4
  html += '<div class="kg" style="grid-template-columns:repeat(4,1fr);" id="kp-diag-forn-novo"></div>';

  // Histórico mensal: vendas (R$) vs compras (R$) — usa cubo OLAP
  const histVend = _diagFornVendasPorMes(cod);
  const extratoComp = _diagFornExtratoCompras(cod);
  const todosYms = new Set();
  histVend.linhas.forEach(function(l){todosYms.add(l.ym);});
  extratoComp.linhas.forEach(function(l){todosYms.add(l.ym);});
  const ymsOrd = Array.from(todosYms).sort();

  if(ymsOrd.length > 0){
    html += '<div class="ds">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico" style="background:var(--accent-bg);color:var(--accent-text);">'
         +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>'
         +      '</div>'
         +      '<div><div class="ds-title">Histórico mensal · vendas vs compras (R$)</div>'
         +        '<div class="ds-sub">'+ymsOrd.length+' meses · vendas '+fK(histVend.totalValor)+' · compras '+fK(extratoComp.totalValor)+'</div>'
         +      '</div>'
         +    '</div>'
         +    '<div class="ds-body" style="padding:14px;"><div style="height:260px;"><canvas id="c-df-hist"></canvas></div></div>'
         + '</div>';
  } else if(vpmYms.length > 0){
    // Fallback: se cubo não tá carregado, mostra só qt como antes
    html += '<div class="ds">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico" style="background:var(--accent-bg);color:var(--accent-text);">'
         +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>'
         +      '</div>'
         +      '<div><div class="ds-title">Histórico de vendas</div><div class="ds-sub">Quantidade total vendida por mês · '+vpmYms.length+' meses</div></div>'
         +    '</div>'
         +    '<div class="ds-body" style="padding:14px;"><div style="height:220px;"><canvas id="c-df-hist"></canvas></div></div>'
         + '</div>';
  }

  // Top 12 SKUs em chart
  const top12 = skus.filter(function(p){return p.vendas && p.vendas.valor>0;}).slice(0, 12);

  // Gráfico de margem mensal (linha laranja, % sobre vendas) — só se cubo OLAP traz lucro mensal
  const margMensal = histVend.linhas.filter(function(l){return l.valor > 0;});
  if(margMensal.length >= 2){
    html += '<div class="ds">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico" style="background:var(--highlight-bg);color:var(--highlight-text);">'
         +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
         +      '</div>'
         +      '<div><div class="ds-title">Margem bruta por mês</div>'
         +        '<div class="ds-sub">% sobre o faturamento gerado pelos produtos do fornecedor</div>'
         +      '</div>'
         +    '</div>'
         +    '<div class="ds-body" style="padding:14px;"><div style="height:220px;"><canvas id="c-df-marg"></canvas></div></div>'
         + '</div>';
  }

  if(top12.length > 0){
    html += '<div class="cc"><div class="cct">Top 12 SKUs por faturamento</div>'
         +    '<div class="ccs">Concentração nos top 3 SKUs: <strong>'+fP(concPct)+'</strong> do faturamento</div>'
         +    '<div style="height:300px;margin-top:8px;"><canvas id="c-df-skus"></canvas></div>'
         + '</div>';
  }

  // Tabela de SKUs do fornecedor
  html += '<div class="cc">'
       +    '<div class="cch">'
       +      '<div><div class="cct">SKUs do fornecedor</div>'
       +        '<div class="ccs">'+fI(skus.length)+' produtos cadastrados · clique numa linha para ver detalhes</div></div>'
       +    '</div>'
       +    '<div class="tscroll" style="margin-top:8px;max-height:520px;overflow-y:auto;">'
       +      '<table class="t"><thead><tr>'
       +        '<th class="L" style="width:24px;">#</th>'
       +        '<th class="L">Produto</th>'
       +        '<th class="L">Depto</th>'
       +        '<th>Faturamento</th>'
       +        '<th>Margem</th>'
       +        '<th>Lucro</th>'
       +        '<th>Estoque (custo)</th>'
       +        '<th>Cobertura</th>'
       +        '<th>Status</th>'
       +      '</tr></thead><tbody>';
  skus.forEach(function(p, i){
    const vds = p.vendas || {};
    const e = p.estoque || {};
    const margCls = (vds.marg||0)<0?'dn':(vds.marg||0)<5?'wn':(vds.marg||0)<10?'':'ok';
    const stCls = p.status==='ATIVO'?'ok':p.status==='CRITICO'?'wn':p.status==='PARADO'?'wn':p.status==='MORTO'?'dn':'';
    // Cobertura: estoque atual ÷ venda diária média
    let cobTxt = '—', cobCls = '';
    if(e.qt > 0 && vds.qt > 0 && vds.meses > 0){
      const vDia = vds.qt / (vds.meses * 30);
      if(vDia > 0){
        const dias = e.qt / vDia;
        cobTxt = dias.toFixed(0)+' dias';
        cobCls = dias > 180 ? 'dn' : dias > 90 ? 'wn' : '';
      }
    } else if(e.qt > 0 && (!vds.qt || vds.qt === 0)){
      cobTxt = 'sem venda'; cobCls = 'dn';
    }
    const lucroVal = vds.lucro || 0;
    const lucroCls = lucroVal < 0 ? 'dn' : '';
    html += '<tr>'
         +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
         +    '<td class="L" data-prod-cod="'+esc(p.cod)+'" title="Clique para ver diagnóstico do produto"><strong>'+esc((p.desc||'').substring(0,40))+'</strong></td>'
         +    '<td>'+esc((p.depto&&p.depto.nome)||'-')+'</td>'
         +    '<td class="val-strong">'+fK(vds.valor||0)+'</td>'
         +    '<td><span class="kg-tag '+margCls+'">'+fP(vds.marg||0)+'</span></td>'
         +    '<td><span class="'+lucroCls+'" style="font-weight:600;">'+fK(lucroVal)+'</span></td>'
         +    '<td>'+fK(e.vl_custo||0)+'</td>'
         +    '<td>'+(cobCls?'<span class="kg-tag '+cobCls+'">'+esc(cobTxt)+'</span>':esc(cobTxt))+'</td>'
         +    '<td><span class="kg-tag '+stCls+'">'+esc(p.status||'-')+'</span></td>'
         +  '</tr>';
  });
  html += '</tbody></table></div></div>';

  // ─── SEÇÃO: Itens em excesso ───
  const skusExcesso = skus.filter(function(p){
    const st = p.status;
    return st === 'PARADO' || st === 'MORTO' || st === 'CRITICO';
  }).sort(function(a,b){
    return ((b.estoque&&b.estoque.vl_custo)||0) - ((a.estoque&&a.estoque.vl_custo)||0);
  });
  if(skusExcesso.length > 0){
    const totExcesso = skusExcesso.reduce(function(s,p){return s + ((p.estoque&&p.estoque.vl_custo)||0);}, 0);
    html += '<div class="cc" style="margin-top:14px;">'
         +    '<div class="cct">⚠ Itens em excesso · '+fI(skusExcesso.length)+' SKUs</div>'
         +    '<div class="ccs"><strong>'+fK(totExcesso)+'</strong> imobilizado em SKUs com status PARADO, MORTO ou CRÍTICO</div>'
         +    '<div class="tscroll" style="margin-top:8px;max-height:320px;overflow-y:auto;">'
         +      '<table class="t"><thead><tr>'
         +        '<th class="L" style="width:24px;">#</th>'
         +        '<th class="L">Produto</th>'
         +        '<th>Qt estoque</th>'
         +        '<th>Vl custo</th>'
         +        '<th>Última entrada</th>'
         +        '<th>Status</th>'
         +      '</tr></thead><tbody>';
    skusExcesso.slice(0, 50).forEach(function(p, i){
      const e = p.estoque || {};
      const stCls = p.status==='CRITICO'?'wn':p.status==='PARADO'?'wn':p.status==='MORTO'?'dn':'';
      html += '<tr>'
           +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
           +    '<td class="L" data-prod-cod="'+esc(p.cod)+'" title="Clique para ver diagnóstico do produto"><strong>'+esc((p.desc||'').substring(0,40))+'</strong></td>'
           +    '<td>'+fI(e.qt||0)+'</td>'
           +    '<td class="val-strong">'+fK(e.vl_custo||0)+'</td>'
           +    '<td>'+esc(e.dt_ult_entrada||'-')+'</td>'
           +    '<td><span class="kg-tag '+stCls+'">'+esc(p.status||'-')+'</span></td>'
           +  '</tr>';
    });
    if(skusExcesso.length > 50){
      html += '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);font-size:11px;padding:8px;">'
           +  '... e mais '+fI(skusExcesso.length - 50)+' SKUs em excesso'
           +  '</td></tr>';
    }
    html += '</tbody></table></div></div>';
  }

  // ─── SEÇÃO: Extrato de entradas (compras mensais via cubo) ───
  const extrato = _diagFornExtratoCompras(cod);
  if(extrato.linhas.length > 0){
    html += '<div class="cc" style="margin-top:14px;">'
         +    '<div class="cct">Extrato de entradas · compras mensais</div>'
         +    '<div class="ccs">Movimento de compras detalhado por mês · <strong>'+fI(extrato.linhas.length)+'</strong> meses · <strong>'+fK(extrato.totalValor)+'</strong> em '+fI(extrato.totalNFs)+' NFs · prazo médio '+fI(extrato.prazoMedio)+'d</div>'
         +    '<div class="tscroll" style="margin-top:8px;max-height:280px;overflow-y:auto;">'
         +      '<table class="t"><thead><tr>'
         +        '<th class="L">Mês</th>'
         +        '<th>Valor</th>'
         +        '<th>Quantidade</th>'
         +        '<th>NFs</th>'
         +        '<th>Prazo médio</th>'
         +      '</tr></thead><tbody>';
    extrato.linhas.forEach(function(l){
      html += '<tr>'
           +    '<td class="L"><strong>'+_ymToLabel(l.ym)+'</strong></td>'
           +    '<td class="val-strong">'+fK(l.valor)+'</td>'
           +    '<td>'+fI(l.qt)+'</td>'
           +    '<td>'+fI(l.nfs)+'</td>'
           +    '<td>'+(l.prazo>0?fI(l.prazo)+'d':'-')+'</td>'
           +  '</tr>';
    });
    html += '</tbody></table></div></div>';
  } else if(typeof Cu === 'undefined' || !Cu){
    html += '<div class="cc" style="margin-top:14px;background:#fef3c7;border:1px solid #d97706;">'
         +    '<div style="padding:14px;color:#92400e;font-size:12px;">'
         +      '<strong>Extrato de entradas não disponível.</strong> O cubo OLAP não está carregado nesta sessão. '
         +      'Visite a página <a href="javascript:void(0)" onclick="document.querySelector(\'.sb-link[data-p=cubo]\').click()" style="color:#92400e;text-decoration:underline;font-weight:700;">Análise Dinâmica</a> uma vez para carregar o cubo, depois volte aqui.'
         +    '</div>'
         + '</div>';
  }

  // ─── SEÇÃO: Posição financeira (títulos abertos) ───
  const finPos = _diagFornFinanceiroPosicao(cod);
  if(finPos.titulos.length > 0){
    const buckets = ['A_VENCER','HOJE','VENCIDO_1_7','VENCIDO_8_30','VENCIDO_31_90','VENCIDO_90_PLUS'];
    const bucketLbl = {
      A_VENCER: 'A vencer', HOJE: 'Vence hoje',
      VENCIDO_1_7: 'Atraso 1-7d', VENCIDO_8_30: 'Atraso 8-30d',
      VENCIDO_31_90: 'Atraso 31-90d', VENCIDO_90_PLUS: 'Atraso 90+d'
    };
    const bucketCls = {
      A_VENCER:'', HOJE:'wn',
      VENCIDO_1_7:'wn', VENCIDO_8_30:'wn',
      VENCIDO_31_90:'dn', VENCIDO_90_PLUS:'dn'
    };
    html += '<div class="cc" style="margin-top:14px;">'
         +    '<div class="cct">Posição financeira · títulos em aberto</div>'
         +    '<div class="ccs"><strong>'+fI(finPos.titulos.length)+'</strong> títulos · <strong>'+fK(finPos.total)+'</strong> em aberto · <strong>'+fK(finPos.vencido)+'</strong> vencidos</div>'
         +    '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-top:10px;font-size:11px;">';
    buckets.forEach(function(b){
      const v = (finPos.aging[b] || {valor:0, titulos:0});
      html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:5px;padding:8px;text-align:center;">'
           +    '<div style="color:var(--text-muted);font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;">'+bucketLbl[b]+'</div>'
           +    '<div class="kg-tag '+bucketCls[b]+'" style="margin-top:4px;">'+fK(v.valor)+'</div>'
           +    '<div style="color:var(--text-muted);font-size:10px;margin-top:3px;">'+fI(v.titulos)+' tít.</div>'
           +  '</div>';
    });
    html += '</div>';
    // Separa títulos em "a vencer" e "vencidos"
    const titAVencer = finPos.titulos.filter(function(t){return (t.dias_atraso||0) <= 0;});
    const titVencidos = finPos.titulos.filter(function(t){return (t.dias_atraso||0) > 0;});

    function renderTabelaTit(titulos, titulo, max){
      if(!titulos.length) return '';
      let h = '<div style="margin-top:10px;">';
      h += '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:6px;">'+esc(titulo)+' · '+fI(titulos.length)+' NFs</div>';
      h += '<div class="tscroll" style="max-height:240px;overflow-y:auto;">'
        +    '<table class="t"><thead><tr>'
        +      '<th class="L">Vencimento</th>'
        +      '<th class="L">NF</th>'
        +      '<th>Valor</th>'
        +      '<th>'+(titulo.indexOf('Venc')>=0?'Atraso':'Prazo')+'</th>'
        +      '<th class="L">Conta</th>'
        +    '</tr></thead><tbody>';
      titulos.slice(0, max).forEach(function(t){
        const da = t.dias_atraso || 0;
        const dCls = da > 30 ? 'dn' : da > 0 ? 'wn' : '';
        const dTxt = da > 0 ? '+'+fI(da)+'d' : (da < 0 ? fI(Math.abs(da))+'d' : 'hoje');
        h += '<tr>'
          +    '<td class="L">'+fDt(t.data_venc)+'</td>'
          +    '<td class="L">'+esc(t.num_nota||'-')+'</td>'
          +    '<td class="val-strong">'+fK(t.valor||t.valor_dup||0)+'</td>'
          +    '<td><span class="kg-tag '+dCls+'">'+esc(dTxt)+'</span></td>'
          +    '<td class="L"><span style="font-size:10px;color:var(--text-muted);">'+esc(t.conta||'')+(t.conta_desc?' · '+esc(t.conta_desc):'')+'</span></td>'
          +  '</tr>';
      });
      if(titulos.length > max){
        h += '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);font-size:11px;padding:8px;">'
          +  '... e mais '+fI(titulos.length - max)+' NFs'
          +  '</td></tr>';
      }
      h += '</tbody></table></div></div>';
      return h;
    }

    html += renderTabelaTit(titVencidos, '⚠ NFs vencidas', 50);
    html += renderTabelaTit(titAVencer, '📅 NFs a vencer', 50);
    html += '</div>';
  }

  // ─── SEÇÃO: Financeiro do fornecedor (KPIs grandes + barra de progresso pago/aberto) ───
  const finPagas = _diagFornFinanceiroPagas(cod);
  const finPosForBar = _diagFornFinanceiroPosicao(cod);
  const fTotPago = (finPagas && finPagas.pago) || 0;
  const fTotAberto = (finPosForBar && finPosForBar.total) || 0;
  const fTotComprado = fTotPago + fTotAberto;
  const fPctPago = fTotComprado > 0 ? (fTotPago / fTotComprado * 100) : 0;
  const fPctAberto = 100 - fPctPago;

  if(fTotComprado > 0){
    html += '<div class="ds" style="margin-top:14px;">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico" style="background:var(--accent-bg);color:var(--accent-text);">'
         +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>'
         +      '</div>'
         +      '<div><div class="ds-title">Financeiro do fornecedor</div><div class="ds-sub">Status das duplicatas de todas as NFs</div></div>'
         +    '</div>'
         +    '<div class="ds-body" style="padding:14px;">'
         +      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:14px;">'
         +        '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:14px;border-top:3px solid #94a3b8;">'
         +          '<div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Total Comprado (líq.)</div>'
         +          '<div style="font-size:24px;font-weight:800;color:var(--text);margin-top:6px;">'+fK(fTotComprado)+'</div>'
         +        '</div>'
         +        '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:14px;border-top:3px solid #15803d;">'
         +          '<div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Já Pago</div>'
         +          '<div style="font-size:24px;font-weight:800;color:#15803d;margin-top:6px;">'+fK(fTotPago)+'</div>'
         +          '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">'+fP(fPctPago,1)+'</div>'
         +        '</div>'
         +        '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:14px;border-top:3px solid #f58634;">'
         +          '<div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Em Aberto</div>'
         +          '<div style="font-size:24px;font-weight:800;color:#f58634;margin-top:6px;">'+fK(fTotAberto)+'</div>'
         +          '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">'+fP(fPctAberto,1)+'</div>'
         +        '</div>'
         +      '</div>'
         +      '<div style="height:8px;background:var(--surface-2);border-radius:4px;overflow:hidden;display:flex;">'
         +        '<div style="width:'+fPctPago.toFixed(1)+'%;background:#15803d;"></div>'
         +        '<div style="width:'+fPctAberto.toFixed(1)+'%;background:#f58634;"></div>'
         +      '</div>'
         +      '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-dim);margin-top:6px;">'
         +        '<span><span style="color:#15803d;">●</span> Pago: '+fP(fPctPago,1)+' ('+fK(fTotPago)+')</span>'
         +        '<span><span style="color:#f58634;">●</span> Em aberto: '+fP(fPctAberto,1)+' ('+fK(fTotAberto)+')</span>'
         +      '</div>';
    if(finPagas && (finPagas.juros > 0 || finPagas.desc > 0)){
      html += '<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);display:flex;gap:14px;font-size:11.5px;">';
      if(finPagas.juros > 0){
        html += '<div><span style="color:var(--text-muted);">Juros pagos:</span> <strong style="color:#dc2626;">'+fK(finPagas.juros)+'</strong></div>';
      }
      if(finPagas.desc > 0){
        html += '<div><span style="color:var(--text-muted);">Descontos:</span> <strong style="color:#15803d;">'+fK(finPagas.desc)+'</strong></div>';
      }
      if(finPagas.titulos){
        html += '<div><span style="color:var(--text-muted);">Títulos pagos:</span> <strong>'+fI(finPagas.titulos)+'</strong></div>';
      }
      html += '</div>';
    }
    html += '</div></div>';
  }

  // Observações automáticas
  const obs = _diagFornGerarObservacoes(f, skus);
  if(obs.length){
    html += '<div class="ds">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico" style="background:var(--highlight-bg);color:var(--highlight-text);">'
         +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
         +      '</div>'
         +      '<div><div class="ds-title">Observações automáticas</div><div class="ds-sub">'+obs.length+' ponto'+(obs.length!==1?'s':'')+' identificado'+(obs.length!==1?'s':'')+'</div></div>'
         +    '</div>'
         +    '<div class="ds-body" style="padding:14px;">'
         +      '<ul style="margin:0;padding-left:20px;line-height:1.7;font-size:13px;color:var(--text);">'
         +      obs.map(function(o){return '<li><strong style="color:'+o.color+';">'+esc(o.tag)+'</strong> '+esc(o.msg)+'</li>';}).join('')
         +      '</ul>'
         +    '</div>'
         + '</div>';
  }

  cont.innerHTML = html;

  // KPIs (8) — alinhados com a referência: Faturamento · Margem · Lucro · Compras · % Pago · Em Aberto · Custo Atraso · SKUs c/ Prejuízo
  const finPagasPreview = _diagFornFinanceiroPagas(cod);
  const finPosPreview   = _diagFornFinanceiroPosicao(cod);
  const totalPago = (finPagasPreview && finPagasPreview.pago) || 0;
  const totalAberto = (finPosPreview && finPosPreview.total) || 0;
  const totalComprado = totalPago + totalAberto;
  const pctPago = totalComprado > 0 ? (totalPago / totalComprado * 100) : 0;
  const custoAtraso = (finPagasPreview && finPagasPreview.juros) || 0;
  const skusComPrejuizo = skus.filter(function(p){return (p.vendas && p.vendas.lucro && p.vendas.lucro < 0);}).length;
  const pctCobertura = (f.v_compra > 0 && f.v_venda > 0) ? (f.v_compra / f.v_venda * 100) : 0;

  document.getElementById('kp-diag-forn-novo').innerHTML = kgHtml([
    {l:'Faturamento gerado', v:fK(f.v_venda||0), s:'Vendas dos SKUs cadastrados'},
    {l:'Margem bruta', v:fP(f.marg||0), s:'Lucro '+fK(f.lucro||0), cls:f.marg>10?'ok':f.marg<5?'wn':''},
    {l:'Lucro líquido', v:fK((f.lucro||0) - custoAtraso), s:custoAtraso>0?'Lucro − custo de atraso':'Sem juros pagos'},
    {l:'Compras líquidas', v:fK(f.v_compra||0), s:f.v_venda>0?fP(pctCobertura)+' do fat.':fI(f.nfs_compra||0)+' NFs'},
    {l:'% Pago', v:totalComprado>0?fP(pctPago):'—', s:totalPago>0?fK(totalPago)+' quitado':'sem pagamentos no período'},
    {l:'Em aberto', v:fK(totalAberto), s:totalComprado>0?fP(100-pctPago)+' das compras':'sem títulos'},
    {l:'Custo de atraso', v:fK(custoAtraso), s:'Juros pagos', cls:custoAtraso>0?'dn':''},
    {l:'SKUs c/ prejuízo', v:fI(skusComPrejuizo), s:f.skus>0?'De '+fI(f.skus)+' SKUs ativos':'sem SKUs', cls:skusComPrejuizo>0?'wn':''}
  ]);

  // Chart histórico mensal: vendas R$ vs compras R$ (ou qt como fallback)
  if(ymsOrd.length > 0){
    const vendasMap = {};
    histVend.linhas.forEach(function(l){vendasMap[l.ym] = l.valor;});
    const comprasMap = {};
    extratoComp.linhas.forEach(function(l){comprasMap[l.ym] = l.valor;});
    mkC('c-df-hist', {
      type: 'bar',
      data: {
        labels: ymsOrd.map(function(ym){return _ymToLabel(ym);}),
        datasets: [
          {label:'Vendas (R$)', data: ymsOrd.map(function(ym){return vendasMap[ym] || 0;}),
            backgroundColor: _PAL.ok+'CC', borderRadius: 3, order: 2},
          {label:'Compras (R$)', data: ymsOrd.map(function(ym){return comprasMap[ym] || 0;}),
            backgroundColor: _PAL.ac+'80', borderColor: _PAL.ac, borderWidth: 1.5,
            type: 'line', tension: 0.3, fill: false, pointRadius: 3, order: 1}
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {position: 'top', labels: {boxWidth: 12, font: {size: 10}, padding: 8}},
          tooltip: {callbacks: {label: function(ctx){return ctx.dataset.label + ': ' + fK(ctx.raw);}}}
        },
        scales: {
          x: {grid: {display: false}, ticks: {font: {size: 10}}},
          y: {ticks: {callback: function(v){return fAbbr(v);}}}
        }
      }
    });
  } else if(vpmYms.length > 0){
    // Fallback: histórico só de qt (cubo não carregado)
    mkC('c-df-hist', {type:'bar',
      data:{labels:vpmYms.map(function(ym){return _ymToLabel(ym);}),
            datasets:[{label:'Qtde vendida', data:vpmYms.map(function(ym){return vpmAcc[ym];}),
                       backgroundColor:_PAL.ac+'CC', borderRadius:4}]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false},
                 tooltip:{callbacks:{label:function(ctx){return fI(ctx.raw)+' un';}}}},
        scales:{x:{grid:{display:false},ticks:{font:{size:10}}},
                y:{ticks:{callback:function(v){return fI(v);}}}}}});
  }

  // Chart de margem mensal (% sobre vendas)
  if(margMensal.length >= 2){
    const margValores = margMensal.map(function(l){
      return l.valor > 0 ? (l.lucro / l.valor * 100) : 0;
    });
    mkC('c-df-marg', {type:'line',
      data:{labels:margMensal.map(function(l){return _ymToLabel(l.ym);}),
            datasets:[{label:'Margem (%)', data:margValores,
                       borderColor:'#f58634', backgroundColor:'rgba(245,134,52,0.12)',
                       borderWidth:2.5, tension:0.35, fill:true,
                       pointRadius:4, pointBackgroundColor:'#f58634'}]},
      options:{responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:false},
                 tooltip:{callbacks:{label:function(ctx){return fP(ctx.raw,1);}}}},
        scales:{x:{grid:{display:false}, ticks:{font:{size:10}}},
                y:{ticks:{callback:function(v){return fP(v,0);}, font:{size:10}}}}}});
  }

  // Chart top 12 SKUs
  if(top12.length > 0){
    mkC('c-df-skus', {type:'bar',
      data:{labels:top12.map(function(p){return (p.desc||'').length>26?(p.desc||'').substring(0,26)+'…':(p.desc||'');}),
            datasets:[{label:'Faturamento', data:top12.map(function(p){return p.vendas.valor;}),
                       backgroundColor:top12.map(function(p){var m=p.vendas.marg||0;return m<5?_PAL.dn+'CC':m<10?_PAL.wn+'CC':_PAL.ok+'CC';}),
                       borderRadius:4}]},
      options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false},
                 tooltip:{callbacks:{label:function(ctx){var p=top12[ctx.dataIndex];return fK(ctx.raw)+' · margem '+fP(p.vendas.marg||0);}}}},
        scales:{x:{ticks:{callback:function(v){return fAbbr(v);}}},y:{grid:{display:false},ticks:{font:{size:10}}}}}});
  }

  cont.scrollTop = 0;
  window.scrollTo({top:0, behavior:'smooth'});

  // Se o cubo ainda não está carregado, dispara em background e re-renderiza ao chegar.
  // Assim o extrato de entradas aparece automaticamente sem precisar visitar Análise Dinâmica.
  if((typeof Cu === 'undefined' || !Cu) && typeof _carregarCuboLazy === 'function'){
    _carregarCuboLazy().then(function(){
      // Re-renderiza só se ainda estamos na mesma tela
      const stillHere = document.getElementById('page-diag-forn');
      if(stillHere && stillHere.classList.contains('active')){
        window._openFornNovo(cod);
      }
    }).catch(function(e){
      console.warn('[_openFornNovo] cubo não pôde ser carregado:', e.message);
    });
  }
};

// ─── Helpers do diagnóstico de fornecedor ──────────────────
// Extrato de entradas: agrega compras do cubo por mês
// Vendas mensais em valor para um fornecedor (cruza com fato_vendas do cubo)
function _diagFornVendasPorMes(fornCod){
  const result = {linhas:[], totalValor:0, totalLucro:0, totalQt:0};
  if(typeof Cu === 'undefined' || !Cu) return result;
  let vendasFato = null;
  let campos = null;
  if(Cu.fatos && Cu.fatos.vendas){
    vendasFato = Cu.fatos.vendas.linhas || [];
    campos = Cu.fatos.vendas.campos || [];
  } else if(Cu.fato_vendas){
    vendasFato = Cu.fato_vendas.linhas || Cu.fato_vendas || [];
    campos = (Cu.fato_vendas.campos || []);
  }
  if(!vendasFato || !vendasFato.length) return result;

  const idxYm = campos.indexOf('ym');
  const idxForn = campos.indexOf('forn');
  const idxLiq = campos.indexOf('v_liq') >= 0 ? campos.indexOf('v_liq') : campos.indexOf('valor');
  const idxLuc = campos.indexOf('v_luc') >= 0 ? campos.indexOf('v_luc') : campos.indexOf('lucro');
  const idxQt = campos.indexOf('v_qt') >= 0 ? campos.indexOf('v_qt') : campos.indexOf('qt');
  if(idxForn < 0 || idxYm < 0) return result;

  const map = new Map();
  vendasFato.forEach(function(linha){
    if(linha[idxForn] !== fornCod) return;
    const ym = linha[idxYm];
    const valor = idxLiq >= 0 ? (linha[idxLiq] || 0) : 0;
    const lucro = idxLuc >= 0 ? (linha[idxLuc] || 0) : 0;
    const qt = idxQt >= 0 ? (linha[idxQt] || 0) : 0;
    if(!map.has(ym)) map.set(ym, {ym:ym, valor:0, lucro:0, qt:0});
    const e = map.get(ym);
    e.valor += valor;
    e.lucro += lucro;
    e.qt += qt;
    result.totalValor += valor;
    result.totalLucro += lucro;
    result.totalQt += qt;
  });
  result.linhas = Array.from(map.values()).sort(function(a,b){return a.ym.localeCompare(b.ym);});
  return result;
}

function _diagFornExtratoCompras(fornCod){
  const result = {linhas:[], totalValor:0, totalNFs:0, prazoMedio:0};
  if(typeof Cu === 'undefined' || !Cu) return result;
  // Cu pode ser cubo_atp ou cubo_cp; estrutura varia. Tenta extrair compras.
  let comprasFato = null;
  let campos = null;
  if(Cu.fatos && Cu.fatos.compras){
    comprasFato = Cu.fatos.compras.linhas || [];
    campos = Cu.fatos.compras.campos || [];
  } else if(Cu.fato_compras){
    comprasFato = Cu.fato_compras.linhas || Cu.fato_compras || [];
    campos = (Cu.fato_compras.campos || ['filial','ym','forn','valor','qt','nfs']);
  }
  if(!comprasFato || !comprasFato.length) return result;

  // Acha índices dos campos relevantes
  const idxYm = campos.indexOf('ym');
  const idxForn = campos.indexOf('forn');
  const idxValor = campos.indexOf('c_val') >= 0 ? campos.indexOf('c_val') : campos.indexOf('valor');
  const idxQt = campos.indexOf('c_qt') >= 0 ? campos.indexOf('c_qt') : campos.indexOf('qt');
  const idxNfs = campos.indexOf('c_nfs') >= 0 ? campos.indexOf('c_nfs') : campos.indexOf('nfs');
  const idxPrz = campos.indexOf('c_prz');
  if(idxForn < 0 || idxYm < 0) return result;

  // Agrega por mês
  const map = new Map();
  let totalPrz = 0;
  let totalPrzNFs = 0;
  comprasFato.forEach(function(linha){
    if(linha[idxForn] !== fornCod) return;
    const ym = linha[idxYm];
    const valor = idxValor >= 0 ? (linha[idxValor]||0) : 0;
    const qt = idxQt >= 0 ? (linha[idxQt]||0) : 0;
    const nfs = idxNfs >= 0 ? (linha[idxNfs]||0) : 0;
    const prazo = idxPrz >= 0 ? (linha[idxPrz]||0) : 0;
    if(!map.has(ym)){
      map.set(ym, {ym:ym, valor:0, qt:0, nfs:0, prazo:0, prazoSum:0, prazoCount:0});
    }
    const e = map.get(ym);
    e.valor += valor;
    e.qt += qt;
    e.nfs += nfs;
    if(prazo > 0 && nfs > 0){
      e.prazoSum += prazo * nfs;
      e.prazoCount += nfs;
      totalPrz += prazo * nfs;
      totalPrzNFs += nfs;
    }
    result.totalValor += valor;
    result.totalNFs += nfs;
  });
  // Finaliza prazo médio por mês e geral
  result.linhas = Array.from(map.values()).map(function(e){
    if(e.prazoCount > 0) e.prazo = e.prazoSum / e.prazoCount;
    return e;
  }).sort(function(a,b){return b.ym.localeCompare(a.ym);});
  result.prazoMedio = totalPrzNFs > 0 ? (totalPrz / totalPrzNFs) : 0;
  return result;
}

// Posição financeira do fornecedor: títulos abertos + aging
function _diagFornFinanceiroPosicao(fornCod){
  const result = {titulos:[], total:0, vencido:0, aging:{}};
  if(typeof F === 'undefined' || !F) return result;
  const titulosAll = (F.aberto && F.aberto.titulos) || [];
  // Filtra só conta de mercadorias e do fornecedor escolhido
  const titulos = titulosAll.filter(function(t){
    if(typeof _ehContaMercadoria === 'function' && !_ehContaMercadoria(t.conta)) return false;
    if(!t.parceiro) return false;
    // cod pode vir como string em F e number em E
    return String(t.parceiro.cod) === String(fornCod);
  });
  titulos.sort(function(a,b){
    return (a.data_venc||'').localeCompare(b.data_venc||'');
  });
  result.titulos = titulos;
  result.total = titulos.reduce(function(s,t){return s+(t.valor||t.valor_dup||0);}, 0);
  result.vencido = titulos.reduce(function(s,t){
    const v = t.valor || t.valor_dup || 0;
    return (t.dias_atraso||0) > 0 ? s+v : s;
  }, 0);
  // Aging
  if(typeof _agingDeTitulos === 'function'){
    result.aging = _agingDeTitulos(titulos);
  }
  return result;
}

// Resumo de notas pagas do fornecedor
function _diagFornFinanceiroPagas(fornCod){
  if(typeof F === 'undefined' || !F) return null;
  const porForn = (F.pagas && F.pagas.por_fornecedor) || [];
  // cod string vs number — comparar como string
  const f = porForn.find(function(p){return String(p.cod) === String(fornCod);});
  return f || null;
}

function _diagFornGerarObservacoes(f, skus){
  const obs = [];

  if(f.marg < 0){
    obs.push({tag:'⚠ Margem negativa.', color:'#d92d20', msg:'fornecedor está gerando prejuízo. Reavalie precificação ou condições comerciais.'});
  } else if(f.marg < 5){
    obs.push({tag:'Margem baixa:', color:'#b45309', msg:fP(f.marg)+' está abaixo de 5%. Espaço estreito para descontos ou promoções.'});
  } else if(f.marg > 20){
    obs.push({tag:'Excelente margem:', color:'#109854', msg:fP(f.marg)+' acima de 20%. Fornecedor rentável.'});
  }

  if(f.pct_devol > 10){
    obs.push({tag:'⚠ Devoluções críticas:', color:'#d92d20', msg:fP(f.pct_devol)+' das compras 12m foram devolvidas. Pode indicar problemas de qualidade ou recebimento.'});
  } else if(f.pct_devol > 3){
    obs.push({tag:'Devoluções relevantes:', color:'#b45309', msg:fP(f.pct_devol)+' das compras 12m foram devolvidas.'});
  }

  if(f.skus_paralisados >= 5){
    const pctPar = f.skus > 0 ? (f.skus_paralisados/f.skus*100) : 0;
    obs.push({tag:'SKUs paralisados:', color:'#b45309', msg:fI(f.skus_paralisados)+' de '+fI(f.skus)+' SKUs parados/mortos ('+fP(pctPar)+'). Avalie ajustar mix de compras.'});
  }

  if(f.v_compra > 0 && f.v_venda === 0){
    obs.push({tag:'⚠ Comprou mas não vendeu:', color:'#d92d20', msg:'fornecedor recebeu compras nos últimos 12m mas as vendas estão zeradas. Possível encalhe.'});
  }

  if(f.v_compra === 0 && f.v_venda > 0){
    obs.push({tag:'Sem compras 12m:', color:'#b45309', msg:'continua vendendo mas sem novas compras. Verifique se foi descontinuado ou se há substituto.'});
  }

  // Concentração nos top 3 SKUs
  const top3 = skus.filter(function(p){return p.vendas&&p.vendas.valor>0;}).slice(0, 3);
  const top3Fat = top3.reduce(function(s,p){return s+p.vendas.valor;},0);
  const concPct = f.v_venda > 0 ? (top3Fat/f.v_venda*100) : 0;
  if(concPct > 80 && skus.length > 5){
    obs.push({tag:'Alta concentração:', color:'#b45309', msg:'Top 3 SKUs concentram '+fP(concPct)+' do faturamento. Risco caso algum desses produtos seja descontinuado.'});
  } else if(concPct < 30 && skus.length > 10){
    obs.push({tag:'Mix bem distribuído:', color:'#109854', msg:'faturamento bem distribuído entre os SKUs ('+fP(concPct)+' nos top 3).'});
  }

  // Análise de tendência: cresceu ou caiu nos últimos meses
  const ultMes = E.meta && E.meta.ultimo_mes_vendas;
  if(ultMes && ultMes.ym){
    const ym = ultMes.ym;
    const [y, m] = ym.split('-').map(Number);
    let dy = y, dm = m;
    if(ultMes.aberto){ dm -= 1; if(dm < 1){ dm = 12; dy -= 1; } }
    const ymComp = dy+'-'+String(dm).padStart(2,'0');
    let p1y = dy, p1m = dm - 1; if(p1m < 1){ p1m = 12; p1y -= 1; }
    let p2y = p1y, p2m = p1m - 1; if(p2m < 1){ p2m = 12; p2y -= 1; }
    const ymPrev1 = p1y+'-'+String(p1m).padStart(2,'0');
    const ymPrev2 = p2y+'-'+String(p2m).padStart(2,'0');

    let qComp = 0, qP1 = 0, qP2 = 0;
    skus.forEach(function(p){
      (p.vendas_por_mes||[]).forEach(function(vm){
        if(vm.ym === ymComp) qComp += vm.qt||0;
        else if(vm.ym === ymPrev1) qP1 += vm.qt||0;
        else if(vm.ym === ymPrev2) qP2 += vm.qt||0;
      });
    });
    const med = (qP1+qP2)/2;
    if(med >= 50){
      const g = (qComp-med)/med*100;
      if(g >= 30){
        obs.push({tag:'▲ Crescimento:', color:'#109854', msg:'+'+fP(g)+' em '+_ymToLabel(ymComp)+' vs média dos 2 meses anteriores.'});
      } else if(g <= -30){
        obs.push({tag:'▼ Queda:', color:'#d92d20', msg:fP(g)+' em '+_ymToLabel(ymComp)+' vs média dos 2 meses anteriores.'});
      }
    }
  }

  if(obs.length === 0){
    obs.push({tag:'✓ Sem alertas.', color:'#109854', msg:'fornecedor sem indicadores críticos.'});
  }
  return obs;
}

// ════════════════════════════════════════════════════════════════════════
// VENCIDOS NOVO · usa financeiro_atp.json (F) · sub-etapa 4p · 30/abr/2026
// Foco em títulos vencidos de F.aberto.titulos com filtros avançados
// ════════════════════════════════════════════════════════════════════════
let _vencCache = null;            // {vencidos, futuros, gruposUnicos, fornUnicos}
let _vencFiltros = {aging:'todos', grupo:'todos', forn:''};

function _vencCalcular(){
  if(_vencCache) return _vencCache;
  const titulosAll = (F && F.aberto && F.aberto.titulos) || [];
  // Filtra só conta de mercadorias (10001 + 99912)
  const titulos = titulosAll.filter(function(t){return _ehContaMercadoria(t.conta);});
  const hojeStr = new Date().toISOString().substring(0,10);

  const vencidos = [];
  const futuros = [];
  titulos.forEach(function(t){
    if(!t.data_venc) return;
    if(t.data_venc < hojeStr) vencidos.push(t);
    else futuros.push(t);
  });

  // Lista única de fornecedores nos vencidos (grupos não é mais necessário porque já vem filtrado)
  const setF = new Set();
  vencidos.forEach(function(t){
    if(t.parceiro && t.parceiro.nome) setF.add(t.parceiro.nome);
  });
  const forns = Array.from(setF).sort();

  _vencCache = {vencidos:vencidos, futuros:futuros, grupos:[], forns:forns};
  return _vencCache;
}

function _vencAplicarFiltros(){
  const c = _vencCache;
  if(!c) return [];
  const f = _vencFiltros;
  const fornQ = (f.forn||'').toLowerCase();
  return c.vencidos.filter(function(t){
    // Aging
    if(f.aging !== 'todos'){
      const da = t.dias_atraso || 0;
      if(f.aging === '1-7'   && (da < 1 || da > 7)) return false;
      if(f.aging === '8-30'  && (da < 8 || da > 30)) return false;
      if(f.aging === '31-90' && (da < 31 || da > 90)) return false;
      if(f.aging === '91+'   && da < 91) return false;
    }
    // Filtro de grupo removido (já vem filtrado por conta de mercadorias)
    // Fornecedor
    if(fornQ){
      const nm = ((t.parceiro && t.parceiro.nome) || '').toLowerCase();
      if(nm.indexOf(fornQ) < 0) return false;
    }
    return true;
  });
}

function renderVencidosNovo(){
  const cont = document.getElementById('page-vencidos');
  if(!cont || !F) return;
  _vencCalcular();
  // Reseta filtros ao re-entrar
  _vencFiltros = {aging:'todos', grupo:'todos', forn:''};

  const c = _vencCache;
  const totVenc = c.vencidos.reduce(function(s,t){return s+(t.valor||0);},0);
  const totFut  = c.futuros.reduce(function(s,t){return s+(t.valor||0);},0);
  const totAberto = totVenc + totFut;
  const pctVencido = totAberto>0 ? (totVenc/totAberto*100) : 0;

  let html = '<div class="ph"><div class="pk">Financeiro</div><h2>Vencidos <em>a pagar</em></h2></div>'
           + '<div class="ph-sep"></div>'
           + '<div class="page-body">';

  // Banner de filtro fixo
  html += '<div style="background:#dbeafe;border:1px solid #93c5fd;border-radius:8px;padding:9px 14px;margin-bottom:10px;font-size:11.5px;color:#1e40af;">'
       +   '<strong>Filtro ativo:</strong> mostrando apenas contas relacionadas a fornecedores de mercadorias '
       +   '(10001 · COMPRA DE MERCADORIAS, 99912 · MULTA E JUROS DE MORA).'
       + '</div>';

  // Banner
  const hojeStr = new Date().toISOString().substring(0,10);
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       + '<strong>Referência:</strong> '+esc(hojeStr.split('-').reverse().join('/'))+' · '
       + '<strong>'+fI(c.vencidos.length)+'</strong> títulos vencidos · '
       + '<strong>'+fK(totVenc)+'</strong> em atraso ('+fP(pctVencido)+' do total em aberto)'
       + '</div>';

  // KPIs
  html += '<div id="kg-venc-novo"></div>';

  // Filtros interativos
  html += '<div class="cc" style="margin-bottom:14px;">'
       +    '<div class="cct">Filtros</div>'
       +    '<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin-top:10px;">'
       +      '<div>'
       +        '<label style="display:block;font-size:11px;color:var(--text-muted);margin-bottom:4px;">Faixa de atraso</label>'
       +        '<div id="vn-aging-chips" style="display:flex;gap:5px;flex-wrap:wrap;">'
       +          ['todos','1-7','8-30','31-90','91+'].map(function(k){
                    const lbl = k==='todos'?'Todos':k==='91+'?'91+ d':k+' d';
                    return '<button class="vn-chip'+(k==='todos'?' active':'')+'" data-k="'+k+'" style="padding:5px 12px;border:1px solid var(--border-strong);background:'+(k==='todos'?'var(--accent)':'#fff')+';color:'+(k==='todos'?'#fff':'var(--text)')+';border-radius:14px;cursor:pointer;font-size:11px;font-weight:600;">'+lbl+'</button>';
                  }).join('')
       +        '</div>'
       +      '</div>'
       +      '<div style="min-width:240px;flex:1;">'
       +        '<label style="display:block;font-size:11px;color:var(--text-muted);margin-bottom:4px;">Buscar fornecedor</label>'
       +        '<input id="vn-forn-srch" type="text" placeholder="Digite parte do nome..." style="width:100%;padding:6px 10px;border:1px solid var(--border-strong);border-radius:6px;font-size:12px;background:#fff;">'
       +      '</div>'
       +      '<div>'
       +        '<button id="vn-clear" style="padding:6px 12px;border:1px solid var(--border-strong);background:var(--surface);color:var(--text);border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;">Limpar</button>'
       +      '</div>'
       +    '</div>'
       +    '<div id="vn-status" style="margin-top:10px;font-size:11px;color:var(--text-muted);"></div>'
       + '</div>';

  // Charts
  html += '<div class="row2">'
       +    '<div class="cc"><div class="cct">Aging dos vencidos</div>'
       +      '<div class="ccs">Distribuição do valor por faixa de atraso</div>'
       +      '<div style="height:240px;margin-top:8px;"><canvas id="c-vn-aging"></canvas></div>'
       +    '</div>'
       +    '<div class="cc"><div class="cct">Vencidos por semana</div>'
       +      '<div class="ccs">Quando os títulos perderam vencimento</div>'
       +      '<div style="height:240px;margin-top:8px;"><canvas id="c-vn-semana"></canvas></div>'
       +    '</div>'
       + '</div>';

  // Top fornecedores vencidos
  html += '<div class="cc" style="margin-top:14px;"><div class="cct">Top 15 fornecedores · valor vencido</div>'
       +    '<div class="ccs" id="vn-top-cap">Concentração e maior atraso por parceiro</div>'
       +    '<div class="tscroll" style="margin-top:8px;"><table class="t" id="t-vn-top"><thead><tr>'
       +      '<th class="L" style="width:24px;">#</th>'
       +      '<th class="L">Fornecedor</th>'
       +      '<th>Títulos</th>'
       +      '<th>Valor vencido</th>'
       +      '<th>Maior atraso</th>'
       +      '<th>% do filtro</th>'
       +    '</tr></thead><tbody id="tb-vn-top"></tbody></table></div>'
       + '</div>';

  // Tabela detalhada de títulos
  html += '<div class="cc" style="margin-top:14px;"><div class="cct">Títulos vencidos · detalhe</div>'
       +    '<div class="ccs" id="vn-tit-cap">Lista completa com aplicação dos filtros</div>'
       +    '<div class="tscroll" style="margin-top:8px;max-height:560px;overflow-y:auto;"><table class="t"><thead><tr>'
       +      '<th class="L" style="width:24px;">#</th>'
       +      '<th class="L">Vencimento</th>'
       +      '<th class="L">Fornecedor</th>'
       +      '<th class="L">Conta</th>'
       +      '<th>NF</th>'
       +      '<th>Valor</th>'
       +      '<th>Atraso</th>'
       +    '</tr></thead><tbody id="tb-vn-tit"></tbody></table></div>'
       + '</div>';

  // A vencer (sumário separado, para contexto)
  html += '<div class="cc" style="margin-top:14px;background:var(--surface-2);">'
       +    '<div class="cct" style="opacity:0.85;">A vencer · '+fI(c.futuros.length)+' títulos · '+fK(totFut)+'</div>'
       +    '<div class="ccs">Próximos vencimentos por mês (não afetados pelos filtros acima)</div>'
       +    '<div id="vn-fut-cont" style="margin-top:8px;"></div>'
       + '</div>';

  html += '</div>';
  cont.innerHTML = html;

  // Listeners dos filtros
  document.querySelectorAll('.vn-chip').forEach(function(b){
    b.addEventListener('click', function(){
      _vencFiltros.aging = b.dataset.k;
      // Re-estiliza chips
      document.querySelectorAll('.vn-chip').forEach(function(x){
        const active = x.dataset.k === _vencFiltros.aging;
        x.style.background = active ? 'var(--accent)' : '#fff';
        x.style.color = active ? '#fff' : 'var(--text)';
        x.classList.toggle('active', active);
      });
      _vencRender();
    });
  });
  let timerSrch = null;
  document.getElementById('vn-forn-srch').addEventListener('input', function(e){
    clearTimeout(timerSrch);
    timerSrch = setTimeout(function(){
      _vencFiltros.forn = e.target.value || '';
      _vencRender();
    }, 200);
  });
  document.getElementById('vn-clear').addEventListener('click', function(){
    _vencFiltros = {aging:'todos', grupo:'todos', forn:''};
    document.getElementById('vn-forn-srch').value = '';
    document.querySelectorAll('.vn-chip').forEach(function(x){
      const active = x.dataset.k === 'todos';
      x.style.background = active ? 'var(--accent)' : '#fff';
      x.style.color = active ? '#fff' : 'var(--text)';
    });
    _vencRender();
  });

  // KPIs (uma vez, com totais brutos)
  const maxDia = c.vencidos.length>0 ? c.vencidos.reduce(function(m,t){return Math.max(m, t.dias_atraso||0);},0) : 0;
  const fmap = {};
  c.vencidos.forEach(function(t){
    const cod = t.parceiro && t.parceiro.cod;
    const nm  = (t.parceiro && t.parceiro.nome) || '?';
    if(!fmap[cod]) fmap[cod] = {nome:nm, val:0, n:0};
    fmap[cod].val += t.valor || 0;
    fmap[cod].n   += 1;
  });
  const top1Forn = Object.values(fmap).sort(function(a,b){return b.val-a.val;})[0];
  document.getElementById('kg-venc-novo').innerHTML = kgHtml([
    {l:'Total vencido', v:fK(totVenc), s:fI(c.vencidos.length)+' títulos · '+fP(pctVencido)+' do aberto', cls:'dn'},
    {l:'Maior atraso', v:fI(maxDia)+' dias', s:'Caso mais antigo em aberto', cls:maxDia>90?'dn':maxDia>30?'wn':''},
    {l:'A vencer', v:fK(totFut), s:fI(c.futuros.length)+' títulos no futuro'},
    {l:'Top fornecedor', v:top1Forn?(top1Forn.nome||'').substring(0,18):'—', s:top1Forn?fK(top1Forn.val):'-'},
    {l:'Fornecedores', v:fI(Object.keys(fmap).length), s:'Distintos com vencidos'},
    {l:'Bucket 91+ d', v:fI(c.vencidos.filter(function(t){return (t.dias_atraso||0)>=91;}).length), s:fK(c.vencidos.filter(function(t){return (t.dias_atraso||0)>=91;}).reduce(function(s,t){return s+(t.valor||0);},0))+' em risco', cls:'dn'},
  ]);

  // A vencer mensal (estático, não reage ao filtro)
  const futPorMes = {};
  c.futuros.forEach(function(t){
    const mes = (t.data_venc||'').substring(0,7);
    if(!futPorMes[mes]) futPorMes[mes] = {n:0, val:0};
    futPorMes[mes].n   += 1;
    futPorMes[mes].val += t.valor || 0;
  });
  const futOrdenado = Object.keys(futPorMes).sort();
  let futHtml = '<div class="tscroll"><table class="t"><thead><tr><th class="L">Mês</th><th>Títulos</th><th>Valor total</th><th>Ticket médio</th></tr></thead><tbody>';
  futOrdenado.forEach(function(mes){
    const f = futPorMes[mes];
    const tkt = f.n>0 ? f.val/f.n : 0;
    futHtml += '<tr><td class="L"><strong>'+_ymToLabel(mes)+'</strong></td><td>'+fI(f.n)+'</td><td class="val-strong">'+fK(f.val)+'</td><td>'+fK(tkt)+'</td></tr>';
  });
  futHtml += '</tbody></table></div>';
  document.getElementById('vn-fut-cont').innerHTML = futHtml;

  // Render dos charts e tabelas dependentes do filtro
  _vencRender();
}

function _vencRender(){
  const filtrados = _vencAplicarFiltros();
  const totFiltrado = filtrados.reduce(function(s,t){return s+(t.valor||0);},0);
  const c = _vencCache;

  // Status
  let stTxt;
  const f = _vencFiltros;
  const aplicaAlgum = f.aging!=='todos' || f.grupo!=='todos' || f.forn;
  if(aplicaAlgum){
    stTxt = fI(filtrados.length)+' de '+fI(c.vencidos.length)+' títulos · '+fK(totFiltrado)+' filtrado de '+fK(c.vencidos.reduce(function(s,t){return s+(t.valor||0);},0));
  } else {
    stTxt = 'Mostrando todos os '+fI(filtrados.length)+' títulos vencidos';
  }
  document.getElementById('vn-status').textContent = stTxt;

  // Chart aging
  const buckets = {'1-7':0, '8-30':0, '31-90':0, '91+':0};
  const bcount  = {'1-7':0, '8-30':0, '31-90':0, '91+':0};
  filtrados.forEach(function(t){
    const da = t.dias_atraso || 0;
    let k;
    if(da <= 7) k = '1-7';
    else if(da <= 30) k = '8-30';
    else if(da <= 90) k = '31-90';
    else k = '91+';
    buckets[k] += t.valor || 0;
    bcount[k]++;
  });
  const agOrd = ['1-7','8-30','31-90','91+'];
  const agCol = {'1-7':_PAL.wn,'8-30':'#ea580c','31-90':_PAL.dn,'91+':'#7f1d1d'};
  mkC('c-vn-aging',{type:'bar',
    data:{labels:agOrd.map(function(k){return k+' dias';}),
          datasets:[{label:'Valor', data:agOrd.map(function(k){return buckets[k];}),
                     backgroundColor:agOrd.map(function(k){return agCol[k]+'CC';}), borderRadius:4}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},
               tooltip:{callbacks:{label:function(ctx){return fK(ctx.raw)+' · '+fI(bcount[agOrd[ctx.dataIndex]])+' títulos';}}}},
      scales:{x:{grid:{display:false}},y:{ticks:{callback:function(v){return fAbbr(v);}}}}}});

  // Chart por semana
  const semMap = {};
  filtrados.forEach(function(t){
    const d = new Date(t.data_venc+'T00:00:00Z');
    const dia = d.getUTCDay();
    const diff = (dia === 0 ? -6 : 1-dia);
    const mon = new Date(d); mon.setUTCDate(d.getUTCDate()+diff);
    const key = mon.toISOString().slice(0,10);
    if(!semMap[key]) semMap[key] = {v:0, n:0};
    semMap[key].v += t.valor || 0;
    semMap[key].n += 1;
  });
  const semOrd = Object.keys(semMap).sort();
  mkC('c-vn-semana',{type:'bar',
    data:{labels:semOrd.map(function(k){return k.substring(8)+'/'+k.substring(5,7);}),
          datasets:[{label:'Valor', data:semOrd.map(function(k){return semMap[k].v;}),
                     backgroundColor:_PAL.hl+'CC', borderRadius:3}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},
               tooltip:{callbacks:{title:function(ctx){return 'Semana de '+semOrd[ctx[0].dataIndex];},
                                   label:function(ctx){var k=semOrd[ctx.dataIndex];return fK(ctx.raw)+' · '+fI(semMap[k].n)+' títulos';}}}},
      scales:{x:{grid:{display:false},ticks:{font:{size:9}}},y:{ticks:{callback:function(v){return fAbbr(v);}}}}}});

  // Tabela top fornecedores
  const fmap = {};
  filtrados.forEach(function(t){
    const cod = t.parceiro && t.parceiro.cod;
    const nm  = (t.parceiro && t.parceiro.nome) || '?';
    if(!fmap[cod]) fmap[cod] = {cod:cod, nome:nm, val:0, n:0, maxd:0};
    fmap[cod].val  += t.valor || 0;
    fmap[cod].n    += 1;
    if((t.dias_atraso||0) > fmap[cod].maxd) fmap[cod].maxd = t.dias_atraso || 0;
  });
  const top15 = Object.values(fmap).sort(function(a,b){return b.val-a.val;}).slice(0, 15);
  let topHtml = '';
  if(top15.length === 0){
    topHtml = '<tr><td colspan="6" style="text-align:center;padding:14px;color:var(--text-muted);font-size:12px;">Nenhum fornecedor para o filtro atual.</td></tr>';
  } else {
    top15.forEach(function(x, i){
      const pct = totFiltrado>0 ? (x.val/totFiltrado*100) : 0;
      const dCls = x.maxd > 90 ? 'dn' : x.maxd > 30 ? 'wn' : '';
      topHtml += '<tr>'
              +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
              +    '<td class="L"><strong>'+esc((x.nome||'').substring(0,42))+'</strong></td>'
              +    '<td>'+fI(x.n)+'</td>'
              +    '<td class="val-strong">'+fK(x.val)+'</td>'
              +    '<td><span class="kg-tag '+dCls+'">'+fI(x.maxd)+' d</span></td>'
              +    '<td>'+fP(pct)+'</td>'
              +  '</tr>';
    });
  }
  document.getElementById('tb-vn-top').innerHTML = topHtml;
  document.getElementById('vn-top-cap').textContent = top15.length+' parceiros distintos · ranking sobre o filtro atual';

  // Tabela de títulos (limita a 200 pra não estourar)
  const titulosOrdenados = filtrados.slice().sort(function(a,b){return b.valor - a.valor;});
  const visivel = titulosOrdenados.slice(0, 200);
  let titHtml = '';
  if(visivel.length === 0){
    titHtml = '<tr><td colspan="7" style="text-align:center;padding:14px;color:var(--text-muted);font-size:12px;">Nenhum título para o filtro atual.</td></tr>';
  } else {
    visivel.forEach(function(t, i){
      const dCls = (t.dias_atraso||0) > 90 ? 'dn' : (t.dias_atraso||0) > 30 ? 'wn' : '';
      titHtml += '<tr>'
              +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
              +    '<td class="L">'+fDt(t.data_venc)+'</td>'
              +    '<td class="L"><strong>'+esc(((t.parceiro&&t.parceiro.nome)||'').substring(0,32))+'</strong></td>'
              +    '<td class="L">'+esc((t.conta_desc||'').substring(0,28))+'</td>'
              +    '<td><span style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--text-muted);">'+esc(t.num_nota||'')+'</span></td>'
              +    '<td class="val-strong">'+fK(t.valor||0)+'</td>'
              +    '<td><span class="kg-tag '+dCls+'">'+fI(t.dias_atraso||0)+' d</span></td>'
              +  '</tr>';
    });
    if(filtrados.length > 200){
      titHtml += '<tr><td colspan="7" style="text-align:center;padding:10px;color:var(--text-muted);font-size:11px;">... e mais '+fI(filtrados.length-200)+' títulos. Refine os filtros para ver tudo.</td></tr>';
    }
  }
  document.getElementById('tb-vn-tit').innerHTML = titHtml;
  document.getElementById('vn-tit-cap').textContent = (filtrados.length>200)
    ? 'Mostrando os 200 maiores · '+fI(filtrados.length)+' resultados no filtro'
    : 'Lista completa · '+fI(filtrados.length)+' resultados no filtro';
}

// ════════════════════════════════════════════════════════════════════════
// FORNECEDORES GPC NOVO · usa E + F.aberto · sub-etapa 4q · 30/abr/2026
// Filtra fornecedores intragrupo (lista configurável via getGpcSuppliers).
// Cruza compras+vendas (E) com a posição financeira (F.aberto.titulos).
// ════════════════════════════════════════════════════════════════════════
function renderFornGPCNovo(){
  const cont = document.getElementById('page-forn-gpc');
  if(!cont || !E) return;

  // Filtro de meses 2026 (modelo CV)
  const ymsTodos = _fornYmsDisponiveis2026();
  const usarPeriodo = ymsTodos.length > 0;
  const mesesAtivos = usarPeriodo
    ? ((Array.isArray(_fornFiltroMeses) && _fornFiltroMeses.length)
        ? _fornFiltroMeses.filter(function(y){return ymsTodos.indexOf(y)>=0;})
        : ymsTodos)
    : [];
  const mesesSet = new Set(mesesAtivos);

  const fornAggBase = usarPeriodo ? _fornAgregarPorPeriodo(mesesSet) : _fornAgregar();

  // Lista intragrupo (configurável; usa getGpcSuppliers se existir, senão fallback)
  let nomesGpc;
  try{
    nomesGpc = (typeof getGpcSuppliers === 'function') ? getGpcSuppliers() : null;
  }catch(e){ nomesGpc = null; }
  if(!nomesGpc || !nomesGpc.length){
    nomesGpc = ['COMERCIAL PINTO DE CERQUEIRA LTDA','A P CERQUEIRA','MARIA DAS GRACAS PINTO CERQUEIRA','JOAO DANIEL PINTO CERQUEIRA'];
  }

  // Match flexível: nome do fornecedor agregado vs lista (case-insensitive, sem cedilha)
  function norm(s){return (s||'').toLowerCase().replace(/[^\w\s]/g,'').trim();}
  const setGpc = new Set(nomesGpc.map(norm));
  const fornsGpc = (fornAggBase||[]).filter(function(f){return setGpc.has(norm(f.nome));});

  // Totais agregados
  const tot = {skus:0, v_compra:0, v_venda:0, lucro:0, vl_est:0, dev_valor:0,
               nfs_compra:0, skus_paralisados:0, skus_ativos:0};
  fornsGpc.forEach(function(f){
    tot.skus       += f.skus||0;
    tot.v_compra   += f.v_compra||0;
    tot.v_venda    += f.v_venda||0;
    tot.lucro      += f.lucro||0;
    tot.vl_est     += f.vl_est_custo||0;
    tot.dev_valor  += f.dev_valor||0;
    tot.nfs_compra += f.nfs_compra||0;
    tot.skus_paralisados += f.skus_paralisados||0;
    tot.skus_ativos += f.skus_ativos||0;
  });
  const margGpc = tot.v_venda > 0 ? (tot.lucro/tot.v_venda*100) : 0;

  // % do total da filial
  const totFatGeral = (fornAggBase||[]).reduce(function(s,f){return s+(f.v_venda||0);},0);
  const totComGeral = (fornAggBase||[]).reduce(function(s,f){return s+(f.v_compra||0);},0);
  const pctFat = totFatGeral > 0 ? (tot.v_venda/totFatGeral*100) : 0;
  const pctCom = totComGeral > 0 ? (tot.v_compra/totComGeral*100) : 0;

  // Cruzamento com F.aberto: títulos vencidos/abertos dos GPC
  let aPagar = 0, vencido = 0, vencCount = 0, maxAtraso = 0;
  if(F && F.aberto && F.aberto.titulos){
    const hojeStr = new Date().toISOString().substring(0,10);
    F.aberto.titulos.forEach(function(t){
      const nm = (t.parceiro && t.parceiro.nome) || '';
      if(!setGpc.has(norm(nm))) return;
      aPagar += t.valor || 0;
      if(t.data_venc && t.data_venc < hojeStr){
        vencido += t.valor || 0;
        vencCount++;
        if((t.dias_atraso||0) > maxAtraso) maxAtraso = t.dias_atraso || 0;
      }
    });
  }

  // SKUs do grupo
  const skusGpc = (E.produtos||[]).filter(function(p){
    return p.fornecedor && setGpc.has(norm(p.fornecedor.nome));
  }).sort(function(a,b){
    return ((b.vendas&&b.vendas.valor)||0) - ((a.vendas&&a.vendas.valor)||0);
  });

  // Evolução mensal somando todos os SKUs do grupo
  const vpmAcc = {};
  skusGpc.forEach(function(p){
    (p.vendas_por_mes||[]).forEach(function(m){
      if(!vpmAcc[m.ym]) vpmAcc[m.ym] = 0;
      vpmAcc[m.ym] += m.qt || 0;
    });
  });
  const vpmYms = Object.keys(vpmAcc).sort();

  // Build HTML
  let html = '<div class="ph"><div class="pk">Hierarquia · Intragrupo</div><h2><em>Fornecedores GPC</em> · Pinto Cerqueira</h2></div>'
           + '<div class="ph-sep"></div>'
           + '<div class="page-body">';

  // Filtro de meses (modelo CV) — só se cubo disponível
  if(usarPeriodo){
    const labelMes = (mesesAtivos.length === ymsTodos.length)
      ? 'todos os meses de 2026'
      : mesesAtivos.length+' de '+ymsTodos.length+' meses';
    html += '<div class="cc" style="padding:12px 14px;margin-bottom:14px;">';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">';
    html += '<span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Período:</span>';
    ymsTodos.forEach(function(ym){
      const ativo = mesesSet.has(ym);
      html += '<button class="fgpc-mes-btn" data-ym="'+esc(ym)+'" style="padding:5px 10px;font-size:11.5px;border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;'
           +   (ativo?'background:var(--accent);color:white;':'background:var(--surface);color:var(--text);')
           + 'font-weight:600;">'+esc(_ymToLabel(ym))+'</button>';
    });
    if(mesesAtivos.length !== ymsTodos.length){
      html += '<button id="fgpc-meses-clear" style="padding:5px 8px;font-size:11px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:transparent;color:var(--text-muted);">Limpar</button>';
    }
    html += '</div>';
    html += '<div style="margin-top:8px;font-size:11.5px;color:var(--text-dim);">Acumulado de '+esc(labelMes)+'.</div>';
    html += '</div>';
  }

  // Banner
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>'+fI(fornsGpc.length)+'</strong> fornecedores intragrupo encontrados (de '+fI(nomesGpc.length)+' configurados) · '
       +   '<strong>'+fI(tot.skus)+'</strong> SKUs cadastrados ('+fI(tot.skus_ativos)+' ativos) · '
       +   'Lista configurável em <strong>Administração</strong>'
       + '</div>';

  // KPIs
  html += '<div id="kg-fgpc-novo"></div>';

  // Charts: evolução mensal + composição por fornecedor
  html += '<div class="row2">';
  if(vpmYms.length > 0){
    html += '<div class="cc"><div class="cct">Histórico de vendas · agregado intragrupo</div>'
         +   '<div class="ccs">Soma de quantidade vendida de todos os SKUs Cerqueira</div>'
         +   '<div style="height:240px;margin-top:8px;"><canvas id="c-fgpc-hist"></canvas></div>'
         + '</div>';
  }
  if(fornsGpc.length > 0){
    html += '<div class="cc"><div class="cct">Composição · faturamento por fornecedor</div>'
         +   '<div class="ccs">Distribuição entre os parceiros do grupo</div>'
         +   '<div style="height:240px;margin-top:8px;"><canvas id="c-fgpc-comp"></canvas></div>'
         + '</div>';
  }
  html += '</div>';

  // Tabela por fornecedor (rica, com cruzamento financeiro)
  html += '<div class="cc" style="margin-top:14px;"><div class="cct">Detalhamento por fornecedor intragrupo</div>'
       +   '<div class="ccs">Compras + vendas + margem + posição financeira</div>'
       +   '<div class="tscroll" style="margin-top:8px;"><table class="t"><thead><tr>'
       +     '<th class="L">Fornecedor</th>'
       +     '<th>SKUs</th>'
       +     '<th>Compras 12m</th>'
       +     '<th>Vendas</th>'
       +     '<th>Lucro</th>'
       +     '<th>Margem</th>'
       +     '<th>A pagar</th>'
       +     '<th>Vencido</th>'
       +     '<th>Estoque</th>'
       +   '</tr></thead><tbody>';
  fornsGpc.slice().sort(function(a,b){return b.v_venda-a.v_venda;}).forEach(function(f){
    // Cruza com F.aberto
    let aPg = 0, vc = 0;
    if(F && F.aberto && F.aberto.titulos){
      const hojeStr = new Date().toISOString().substring(0,10);
      const nrm = norm(f.nome);
      F.aberto.titulos.forEach(function(t){
        const nm = (t.parceiro && t.parceiro.nome) || '';
        if(norm(nm) !== nrm) return;
        aPg += t.valor || 0;
        if(t.data_venc && t.data_venc < hojeStr) vc += t.valor || 0;
      });
    }
    const margCls = f.marg<0?'dn':f.marg<5?'wn':f.marg<10?'':'ok';
    const vcCls = vc > 100000 ? 'dn' : vc > 0 ? 'wn' : '';
    html += '<tr>'
         +    '<td class="L" data-forn-cod="'+esc(f.cod)+'" title="Clique para ver diagnóstico do fornecedor"><strong>'+esc((f.nome||'').substring(0,42))+'</strong></td>'
         +    '<td>'+fI(f.skus)+'</td>'
         +    '<td>'+fK(f.v_compra)+'</td>'
         +    '<td class="val-strong">'+fK(f.v_venda)+'</td>'
         +    '<td>'+fK(f.lucro)+'</td>'
         +    '<td><span class="kg-tag '+margCls+'">'+fP(f.marg)+'</span></td>'
         +    '<td>'+fK(aPg)+'</td>'
         +    '<td>'+(vc > 0 ? '<span class="kg-tag '+vcCls+'">'+fK(vc)+'</span>' : '<span style="color:var(--text-muted);">—</span>')+'</td>'
         +    '<td>'+fK(f.vl_est_custo)+'</td>'
         +  '</tr>';
  });
  html += '</tbody></table></div></div>';

  // Top 15 SKUs intragrupo
  const top15Sku = skusGpc.filter(function(p){return p.vendas&&p.vendas.valor>0;}).slice(0, 15);
  if(top15Sku.length > 0){
    html += '<div class="cc" style="margin-top:14px;"><div class="cct">Top 15 SKUs intragrupo · faturamento</div>'
         +   '<div class="ccs">Click numa linha para abrir o Diagnóstico do produto</div>'
         +   '<div class="tscroll" style="margin-top:8px;"><table class="t"><thead><tr>'
         +     '<th class="L" style="width:24px;">#</th>'
         +     '<th class="L">Produto</th>'
         +     '<th class="L">Fornecedor</th>'
         +     '<th>Faturamento</th>'
         +     '<th>Margem</th>'
         +     '<th>Estoque</th>'
         +     '<th>Status</th>'
         +   '</tr></thead><tbody>';
    top15Sku.forEach(function(p, i){
      const vds = p.vendas || {};
      const e = p.estoque || {};
      const margCls = (vds.marg||0)<0?'dn':(vds.marg||0)<5?'wn':(vds.marg||0)<10?'':'ok';
      const stCls = p.status==='ATIVO'?'ok':p.status==='CRITICO'?'wn':p.status==='PARADO'?'wn':p.status==='MORTO'?'dn':'';
      html += '<tr style="cursor:pointer;" onclick="if(typeof openProd===\'function\')openProd('+p.cod+');">'
           +    '<td class="L" style="color:var(--text-muted);font-weight:700;">'+(i+1)+'</td>'
           +    '<td class="L"><strong>'+esc((p.desc||'').substring(0,38))+'</strong></td>'
           +    '<td class="L">'+esc(((p.fornecedor&&p.fornecedor.nome)||'').substring(0,24))+'</td>'
           +    '<td class="val-strong">'+fK(vds.valor||0)+'</td>'
           +    '<td><span class="kg-tag '+margCls+'">'+fP(vds.marg||0)+'</span></td>'
           +    '<td>'+fK(e.vl_custo||0)+'</td>'
           +    '<td><span class="kg-tag '+stCls+'">'+esc(p.status||'-')+'</span></td>'
           +  '</tr>';
    });
    html += '</tbody></table></div></div>';
  }

  html += '</div>'; // page-body
  cont.innerHTML = html;

  // KPIs
  document.getElementById('kg-fgpc-novo').innerHTML = kgHtml([
    {l:'Faturamento', v:fK(tot.v_venda), s:fP(pctFat)+' do total da filial'},
    {l:'Margem', v:fP(margGpc), s:'Lucro '+fK(tot.lucro), cls:margGpc<5?'wn':margGpc>15?'ok':''},
    {l:'Compras 12m', v:fK(tot.v_compra), s:fP(pctCom)+' das compras da filial'},
    {l:'A pagar', v:fK(aPagar), s:'Posição em aberto'},
    {l:'Vencido', v:fK(vencido), s:fI(vencCount)+' títulos · max '+fI(maxAtraso)+'d', cls:vencido>100000?'dn':vencido>0?'wn':''},
    {l:'SKUs paralisados', v:fI(tot.skus_paralisados), s:'Parados ou mortos no grupo', cls:tot.skus_paralisados>20?'wn':''},
  ]);

  // Chart histórico mensal
  if(vpmYms.length > 0){
    mkC('c-fgpc-hist',{type:'bar',
      data:{labels:vpmYms.map(function(ym){return _ymToLabel(ym);}),
            datasets:[{label:'Qtde vendida', data:vpmYms.map(function(ym){return vpmAcc[ym];}),
                       backgroundColor:_PAL.hl+'CC', borderRadius:4}]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false},
                 tooltip:{callbacks:{label:function(ctx){return fI(ctx.raw)+' un';}}}},
        scales:{x:{grid:{display:false},ticks:{font:{size:10}}},
                y:{ticks:{callback:function(v){return fI(v);}}}}}});
  }

  // Chart composição por fornecedor (doughnut)
  if(fornsGpc.length > 0){
    const ord = fornsGpc.slice().sort(function(a,b){return b.v_venda-a.v_venda;});
    const cores = [_PAL.ac, _PAL.hl, _PAL.ok, _PAL.vi, _PAL.wn, _PAL.dn];
    mkC('c-fgpc-comp',{type:'doughnut',
      data:{labels:ord.map(function(f){return (f.nome||'').length>22?(f.nome||'').substring(0,22)+'…':(f.nome||'');}),
            datasets:[{data:ord.map(function(f){return f.v_venda;}),
                       backgroundColor:ord.map(function(_, i){return cores[i % cores.length];}),
                       borderWidth:2, borderColor:'#fff'}]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{position:'right',labels:{padding:8,usePointStyle:true,boxWidth:8,font:{size:10}}},
                 tooltip:{callbacks:{label:function(ctx){var pct=tot.v_venda>0?(ctx.raw/tot.v_venda*100):0;return ctx.label+': '+fK(ctx.raw)+' ('+fP(pct)+')';}}}}}});
  }

  // Handlers do filtro de meses (mesma var _fornFiltroMeses compartilhada com Fornecedores)
  document.querySelectorAll('.fgpc-mes-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const ym = btn.getAttribute('data-ym');
      const atual = (_fornFiltroMeses && _fornFiltroMeses.length) ? _fornFiltroMeses.slice() : ymsTodos.slice();
      const i = atual.indexOf(ym);
      if(i >= 0) atual.splice(i, 1);
      else atual.push(ym);
      _fornFiltroMeses = atual.length === 0 ? null : atual;
      renderFornGPCNovo();
    });
  });
  const btnClearGPC = document.getElementById('fgpc-meses-clear');
  if(btnClearGPC) btnClearGPC.addEventListener('click', function(){
    _fornFiltroMeses = null;
    renderFornGPCNovo();
  });
}

function renderPage(pg){
  // Cleanup ao sair da Análise Dinâmica: destrói chart e cancela debounce
  if(pg !== 'cubo'){
    if(typeof _pvChart !== 'undefined' && _pvChart){
      try { _pvChart.destroy(); } catch(e){}
      _pvChart = null;
    }
    if(typeof _pvDebounceTimer !== 'undefined' && _pvDebounceTimer){
      clearTimeout(_pvDebounceTimer);
      _pvDebounceTimer = null;
    }
  }
  // ─── Páginas com dados modulares (V/C/E/F/R/Vb) ───
  // Se o JSON estiver carregado → render Novo. Senão → aviso de indisponibilidade.
  // (As versões legadas foram removidas em v4.2; o sistema agora opera só em modo modular.)
  if(pg==='estoque'){ return E ? renderEstoqueNovo() : _renderComprasIndisponivel(pg); }
  if(pg==='excesso'){ return E ? renderExcessoNovo() : _renderComprasIndisponivel(pg); }
  if(pg==='abc'){ return E ? renderABCNovo() : _renderComprasIndisponivel(pg); }
  if(pg==='fornecedores'){ return E ? renderFornecedoresNovo() : _renderComprasIndisponivel(pg); }
  if(pg==='diagnostico'){ return E ? renderDiagNovo() : _renderComprasIndisponivel(pg); }
  if(pg==='financeiro'){ return F ? renderFinanceiroNovo() : _renderComprasIndisponivel(pg); }
  if(pg==='deptos'){ return E ? renderDeptosNovo() : _renderComprasIndisponivel(pg); }
  if(pg==='alertas'){ return E ? renderAlertasNovo() : _renderComprasIndisponivel(pg); }
  if(pg==='diag-forn'){ return E ? renderDiagFornNovo() : _renderComprasIndisponivel(pg); }
  if(pg==='vencidos'){ return F ? renderVencidosNovo() : _renderComprasIndisponivel(pg); }
  if(pg==='forn-gpc'){ return E ? renderFornGPCNovo() : _renderComprasIndisponivel(pg); }

  // ─── Páginas independentes ───
  if(pg==='home')renderHome();
  else if(pg==='executivo')renderExecutivo();
  else if(pg==='cv')renderCV();
  else if(pg==='recebimentos')renderRecebimentos();
  else if(pg==='verbas')renderVerbas();
  else if(pg==='cubo')renderCubo();
  else if(pg==='admin')renderAdmin();
  else if(pg==='proc')renderProc();
  else if(pg==='historico')renderHistorico();
  else if(pg==='ajuda')renderAjuda();
  else if(pg && pg.indexOf('v-') === 0){
    // Se V (dados de Vendas) existir → render real; senão → placeholder
    if(V) renderVendasReal(pg);
    else renderVendasStruct(pg);
  }
}

// ==== Render Home ============================================
// Já é estática (HTML embutido). Só reativa visibilidade ao navegar.
function renderHome(){
  // Renderiza a seção de pins do usuário
  if(typeof _pinRenderHome === 'function'){
    _pinRenderHome();
  }
}

// ================================================================
// VENDAS · CONFIG ESTRUTURAL (Etapa 4)
