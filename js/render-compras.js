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
  'deptos','estoque','excesso','financeiro',
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
    'financeiro':   {alt:'recebimentos', altLabel:'Recebimentos', altDesc:'Arquivo financeiro_atp.json não encontrado. Para vendas a prazo veja Recebimentos.'}
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
       + '<button class="ebtn" style="background:var(--surface);border:1px solid var(--border-strong);color:var(--text);padding:8px 14px;border-radius:7px;font-weight:600;cursor:pointer;font-size:11px;" onclick="document.querySelector(\'.sb-link[data-p=executivo]\').click()">← Voltar para Visão Executiva</button>'
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

  // v4.76 fix23: gráfico 'Distribuição por status' removido a pedido do usuário.

  // Estoque por departamento · tabela hierárquica drill-down
  // Estrutura: agregar por (depto.cod) → (secao.cod) → (categoria.cod)
  // a partir de E.produtos. Mostra Estoque a custo + Estoque a preço de venda.
  // O usuário expande um depto pra ver suas seções e cada seção pra ver categorias.
  html += '<div class="cc">'
       +    '<div class="cch">'
       +      '<div><div class="cct">Estoque por departamento</div>'
       +        '<div class="ccs" id="est-hier-bc">Clique em um departamento para ver as seções, depois categorias. Valor em <strong>custo</strong> e em <strong>preço de venda</strong>.</div></div>'
       +      '<button id="est-hier-back" style="display:none;padding:6px 14px;border-radius:6px;background:var(--accent-bg);color:var(--accent-text);border:none;font-weight:700;cursor:pointer;font-size:12px;">← Voltar</button>'
       +    '</div>'
       +    '<div class="tscroll" style="margin-top:10px;-webkit-overflow-scrolling:touch;"><div id="est-hier-table"></div></div>'
       + '</div>';

  // Quadro Vendas × Departamento (v4.69, drill-down em v4.71)
  html += '<div class="cc">'
       +    '<div class="cch">'
       +      '<div><div class="cct">Vendas × Departamento</div>'
       +        '<div class="ccs" id="est-vd-bc">Clique em um departamento para ver as seções, depois categorias. <strong>Média de venda</strong> = média mensal dos últimos 3 meses fechados em R$. <strong>Estoque</strong> em preço de venda. <strong>Dias de estoque</strong> = (estoque ÷ média) × 30.</div></div>'
       +      '<button id="est-vd-back" style="display:none;padding:6px 14px;border-radius:6px;background:var(--accent-bg);color:var(--accent-text);border:none;font-weight:700;cursor:pointer;font-size:12px;">← Voltar</button>'
       +    '</div>'
       +    '<div class="tscroll" style="margin-top:10px;-webkit-overflow-scrolling:touch;"><div id="est-vd-table"></div></div>'
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
    {l:'SKUs parados/mortos',v:fI(((r.por_status&&r.por_status.PARADO&&r.por_status.PARADO.skus)||0)+((r.por_status&&r.por_status.MORTO&&r.por_status.MORTO.skus)||0)),s:'Sem giro',cls:'dn'},
  ]);

  // v4.76 fix23: bloco do doughnut 'Distribuição por status' removido a pedido do usuário.

  // ─── Tabela "Estoque por departamento" (drill-down · v4.71) ────────
  // Modelo igual ao Departamentos: nível depto → seção → categoria, com
  // botão "← Voltar". Click na linha desce um nível.
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

  if(!window._estHierState) window._estHierState = {nivel:'depto', path:{}};
  // Reset ao re-entrar na página
  window._estHierState = {nivel:'depto', path:{}};

  function _renderEstHier(){
    const st = window._estHierState;
    let items = [], bcTxt = '';
    if(st.nivel === 'depto'){
      items = _hier;
      bcTxt = 'Clique em um departamento para ver as seções';
    } else if(st.nivel === 'secao'){
      const d = _hier.find(function(x){return x.cod === st.path.deptoCod;});
      items = d ? Array.from(d.secoes.values()).sort(function(a,b){return b.vl_custo-a.vl_custo;}) : [];
      bcTxt = 'Seções de: '+esc(st.path.deptoNome||'?');
    } else {
      const d = _hier.find(function(x){return x.cod === st.path.deptoCod;});
      const s = d ? d.secoes.get(st.path.secaoCod) : null;
      items = s ? Array.from(s.cats.values()).sort(function(a,b){return b.vl_custo-a.vl_custo;}) : [];
      bcTxt = 'Categorias de: '+esc(st.path.secaoNome||'?')+' · '+esc(st.path.deptoNome||'?');
    }
    const bcEl = document.getElementById('est-hier-bc');
    if(bcEl) bcEl.innerHTML = bcTxt;
    const back = document.getElementById('est-hier-back');
    if(back) back.style.display = (st.nivel === 'depto') ? 'none' : 'inline-block';

    let h = '<table class="t" style="font-size:12px;"><thead><tr>'
          + '<th class="L">'+(st.nivel==='depto'?'Departamento':st.nivel==='secao'?'Seção':'Categoria')+'</th>'
          + '<th>SKUs</th>'
          + '<th>Estoque (custo)</th>'
          + '<th>Estoque (preço venda)</th>'
          + '<th>Markup</th>'
          + '</tr></thead><tbody>';
    if(!items.length){
      h += '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:14px;">Nenhum item neste nível.</td></tr>';
    } else {
      items.forEach(function(it){
        const mk = it.vl_custo>0 ? ((it.vl_preco-it.vl_custo)/it.vl_custo*100) : 0;
        const clickable = (st.nivel !== 'categoria');
        const cursor = clickable ? 'cursor:pointer;' : '';
        const titleAttr = clickable ? ' title="Clique para ver '+(st.nivel==='depto'?'seções':'categorias')+'"' : '';
        h += '<tr style="'+cursor+'" data-cod="'+esc(it.cod)+'" data-nome="'+escAttr(it.nome||'')+'"'+titleAttr+'>'
          +    '<td class="L"><strong>'+esc(it.nome||'')+'</strong>'+(clickable?' <span style="color:var(--text-muted);font-size:10px;">→</span>':'')+'</td>'
          +    '<td>'+fI(it.skus)+'</td>'
          +    '<td class="val-strong">'+fK(it.vl_custo)+'</td>'
          +    '<td>'+fK(it.vl_preco)+'</td>'
          +    '<td>'+fP(mk)+'</td>'
          +  '</tr>';
      });
    }
    h += '</tbody></table>';
    const cont = document.getElementById('est-hier-table');
    if(!cont) return;
    cont.innerHTML = h;
    if(st.nivel !== 'categoria'){
      cont.querySelectorAll('tr[data-cod]').forEach(function(tr){
        tr.addEventListener('click', function(){
          const cod = tr.dataset.cod;
          const nm  = tr.dataset.nome;
          if(st.nivel === 'depto'){
            st.path = {deptoCod:cod, deptoNome:nm};
            st.nivel = 'secao';
          } else if(st.nivel === 'secao'){
            st.path.secaoCod = cod;
            st.path.secaoNome = nm;
            st.nivel = 'categoria';
          }
          _renderEstHier();
        });
      });
    }
  }
  _renderEstHier();
  const backHier = document.getElementById('est-hier-back');
  if(backHier){
    backHier.addEventListener('click', function(){
      const st = window._estHierState;
      if(st.nivel === 'categoria'){ st.nivel = 'secao'; st.path.secaoCod = null; st.path.secaoNome = null; }
      else if(st.nivel === 'secao'){ st.nivel = 'depto'; st.path = {}; }
      _renderEstHier();
    });
  }

  // ─── v4.69: Quadro Vendas × Departamento ───────────────────────────
  // Mostra média de venda 3 meses (R$), valor estoque (preço venda) e dias
  // de estoque por departamento, expansível para seções e categorias.
  // Drilldown indexa SKUs de E.produtos × V.vendas_por_sku (cross-ref por cod).
  // Vendas mensais em R$ aproximadas: avgPrice = fat_total/qt_total · fat_ym ≈ avgPrice × qt_ym.
  (function(){
    if(!E || !Array.isArray(E.produtos) || !V || !Array.isArray(V.vendas_por_sku)) return;
    const cont = document.getElementById('est-vd-table');
    if(!cont) return;

    // Determina os 3 últimos meses fechados a partir de V.meta.ultimo_mes
    function _ymPrev(ym, n){
      const a = parseInt(ym.substring(0,4),10);
      let m = parseInt(ym.substring(5,7),10) - n;
      let y = a;
      while(m <= 0){ m += 12; y -= 1; }
      return y+'-'+(m<10?'0':'')+m;
    }
    let ultYm = null, ultAberto = true;
    if(V.meta && V.meta.ultimo_mes && V.meta.ultimo_mes.ym){
      ultYm = V.meta.ultimo_mes.ym;
      ultAberto = V.meta.ultimo_mes.aberto !== false;
    } else if(V.mensal && V.mensal.length){
      ultYm = V.mensal.reduce(function(mx,r){return r.ym>mx?r.ym:mx;}, '');
    }
    if(!ultYm){ cont.innerHTML = '<div style="padding:12px;color:var(--text-muted);font-size:12px;">Sem dados de vendas mensais para calcular média.</div>'; return; }
    const ymsRef = ultAberto
      ? [_ymPrev(ultYm,1), _ymPrev(ultYm,2), _ymPrev(ultYm,3)]
      : [ultYm, _ymPrev(ultYm,1), _ymPrev(ultYm,2)];
    const ymsRefSet = new Set(ymsRef);

    // Index SKU → vendas (avgPrice × qt soma nos 3 meses)
    const vIdx = new Map();
    V.vendas_por_sku.forEach(function(s){
      if(!s || s.cod == null) return;
      const qtTot = s.qt || 0;
      const fatTot = s.fat_liq || 0;
      const avgPrice = qtTot > 0 ? (fatTot / qtTot) : 0;
      let qt3 = 0;
      if(Array.isArray(s.por_mes)){
        s.por_mes.forEach(function(pm){
          if(ymsRefSet.has(pm.ym)) qt3 += pm.qt || 0;
        });
      }
      vIdx.set(s.cod, {fat3: avgPrice * qt3, qt3: qt3});
    });

    // Constrói hierarquia depto → secao → categoria a partir de E.produtos.
    // Para cada nó, soma estoque PV (vl_preco) e vendas 3M (fat3 do vIdx).
    const deptos = new Map();
    (E.produtos || []).forEach(function(p){
      if(!p.estoque) return;
      const d = p.depto || {cod:'?',nome:'(sem depto)'};
      const s = p.secao || {cod:'?',nome:'(sem seção)'};
      const c = p.categoria || {cod:'?',nome:'(sem categoria)'};
      const ven = vIdx.get(p.cod) || {fat3:0, qt3:0};
      function _ensure(map, cod, base){
        if(!map.has(cod)) map.set(cod, Object.assign({fat3:0, vlEstoquePV:0, skus:0}, base));
        return map.get(cod);
      }
      const dN = _ensure(deptos, d.cod, {cod:d.cod, nome:d.nome, secoes:new Map()});
      const sN = _ensure(dN.secoes, s.cod, {cod:s.cod, nome:s.nome, cats:new Map()});
      const cN = _ensure(sN.cats,   c.cod, {cod:c.cod, nome:c.nome});
      [dN, sN, cN].forEach(function(n){
        n.fat3        += ven.fat3 || 0;
        n.vlEstoquePV += p.estoque.vl_preco || 0;
        n.skus        += 1;
      });
    });
    const deptosArr = Array.from(deptos.values()).sort(function(a,b){return b.vlEstoquePV - a.vlEstoquePV;});

    // v4.71: drill-down (igual Departamentos)
    window._estVDState = {nivel:'depto', path:{}};

    function _dias(estoquePV, media){
      if(!media || media <= 0) return null;
      return (estoquePV / media) * 30;
    }
    function _diasFmt(d){
      if(d == null) return '<span style="color:var(--text-muted);">—</span>';
      if(d > 365) return '<span style="color:#dc2626;font-weight:600;">'+fI(Math.round(d))+'</span>';
      if(d > 90)  return '<span style="color:#b45309;font-weight:600;">'+fI(Math.round(d))+'</span>';
      return fI(Math.round(d));
    }

    function _render(){
      const st = window._estVDState;
      let items = [], bcTxt = '';
      if(st.nivel === 'depto'){
        items = deptosArr;
        bcTxt = 'Clique em um departamento para ver as seções';
      } else if(st.nivel === 'secao'){
        const d = deptosArr.find(function(x){return x.cod === st.path.deptoCod;});
        items = d ? Array.from(d.secoes.values()).sort(function(a,b){return b.vlEstoquePV - a.vlEstoquePV;}) : [];
        bcTxt = 'Seções de: '+esc(st.path.deptoNome||'?');
      } else {
        const d = deptosArr.find(function(x){return x.cod === st.path.deptoCod;});
        const s = d ? d.secoes.get(st.path.secaoCod) : null;
        items = s ? Array.from(s.cats.values()).sort(function(a,b){return b.vlEstoquePV - a.vlEstoquePV;}) : [];
        bcTxt = 'Categorias de: '+esc(st.path.secaoNome||'?')+' · '+esc(st.path.deptoNome||'?');
      }
      const bcEl = document.getElementById('est-vd-bc');
      if(bcEl) bcEl.innerHTML = bcTxt;
      const back = document.getElementById('est-vd-back');
      if(back) back.style.display = (st.nivel === 'depto') ? 'none' : 'inline-block';

      let h = '<table class="t" style="font-size:12px;"><thead><tr>'
            + '<th class="L">'+(st.nivel==='depto'?'Departamento':st.nivel==='secao'?'Seção':'Categoria')+'</th>'
            + '<th>SKUs</th>'
            + '<th>Média venda (3 meses)</th>'
            + '<th>Estoque (preço venda)</th>'
            + '<th>Dias de estoque</th>'
            + '</tr></thead><tbody>';
      if(!items.length){
        h += '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:14px;">Nenhum item neste nível.</td></tr>';
      } else {
        items.forEach(function(it){
          const media = (it.fat3 || 0) / 3;
          const clickable = (st.nivel !== 'categoria');
          const cursor = clickable ? 'cursor:pointer;' : '';
          const titleAttr = clickable ? ' title="Clique para ver '+(st.nivel==='depto'?'seções':'categorias')+'"' : '';
          h += '<tr style="'+cursor+'" data-cod="'+esc(it.cod)+'" data-nome="'+escAttr(it.nome||'')+'"'+titleAttr+'>'
            +    '<td class="L"><strong>'+esc(it.nome||'')+'</strong>'+(clickable?' <span style="color:var(--text-muted);font-size:10px;">→</span>':'')+'</td>'
            +    '<td>'+fI(it.skus)+'</td>'
            +    '<td>'+fK(media)+'</td>'
            +    '<td class="val-strong">'+fK(it.vlEstoquePV||0)+'</td>'
            +    '<td>'+_diasFmt(_dias(it.vlEstoquePV||0, media))+'</td>'
            +  '</tr>';
        });
      }
      h += '</tbody></table>';
      cont.innerHTML = h;
      if(st.nivel !== 'categoria'){
        cont.querySelectorAll('tr[data-cod]').forEach(function(tr){
          tr.addEventListener('click', function(){
            const cod = tr.dataset.cod;
            const nm  = tr.dataset.nome;
            if(st.nivel === 'depto'){
              st.path = {deptoCod:cod, deptoNome:nm};
              st.nivel = 'secao';
            } else if(st.nivel === 'secao'){
              st.path.secaoCod = cod;
              st.path.secaoNome = nm;
              st.nivel = 'categoria';
            }
            _render();
          });
        });
      }
    }
    _render();
    const backVD = document.getElementById('est-vd-back');
    if(backVD){
      backVD.addEventListener('click', function(){
        const st = window._estVDState;
        if(st.nivel === 'categoria'){ st.nivel = 'secao'; st.path.secaoCod = null; st.path.secaoNome = null; }
        else if(st.nivel === 'secao'){ st.nivel = 'depto'; st.path = {}; }
        _render();
      });
    }
  })();
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

  // v4.74: limite de cobertura agora vem da configuração 'Dias ideais de estoque'
  // (default 180). Permite o admin calibrar quando a base mudar de perfil.
  const _limCobertura = (typeof getEstoqueIdeal === 'function') ? getEstoqueIdeal() : 180;
  const excessos = produtos.filter(function(p){
    const st = _status(p);
    if(['PARADO','MORTO','CRITICO'].indexOf(st)>=0) return true;
    const g = _giro(p);
    if(g && g > _limCobertura) return true;
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
         +    '<div class="cch"><div>'
         +      '<div class="cct">Excesso por fornecedor · top 50</div>'
         +      '<div class="ccs">'+fI(fornMap.size)+' fornecedores com SKUs em excesso · ordenados por valor imobilizado</div>'
         +    '</div>'
         +    _exportBtns('exc-fornecedores', 'Excesso · fornecedores top 50')
         +    '</div>'
         +    '<div class="tscroll" style="margin-top:8px;"><table class="t"><thead><tr>'
         +      '<th class="L" style="width:24px;">#</th>'
         +      '<th class="L">Fornecedor</th>'
         +      '<th>SKUs em excesso</th>'
         +      '<th>Valor estoque (em excesso)</th>'
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
  html += '<div class="cc">'
       +    '<div class="cch"><div>'
       +      '<div class="cct">Top 100 · maior valor imobilizado</div>'
       +      '<div class="ccs">'+fI(excessos.length)+' SKUs em excesso · '+fK(totVlCusto)+' a custo</div>'
       +    '</div>'
       +    _exportBtns('exc-top100', 'Excesso · top 100 SKUs')
       +    '</div>'
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

  // ─── v4.69: registra datasets para exportação PDF/XLSX ────────────
  const _excDsForn = {
    titulo: 'Excesso · fornecedores top 50',
    cols: ['#','Fornecedor','SKUs em excesso','Valor estoque (em excesso)','Vl em preço de venda','Críticos','Parados','Mortos'],
    rows: fornsExc.map(function(f, i){
      return [i+1, f.nome||'', f.skus||0, f.vl_custo||0, f.vl_preco||0, f.criticos||0, f.parados||0, f.mortos||0];
    }),
    numericCols: [2,3,4,5,6,7]
  };
  const _excDsTop = {
    titulo: 'Excesso · top 100 SKUs',
    cols: ['#','Código','Produto','Departamento','Qt estoque','Vl custo','Dias p/ consumir','Última entrada','Status'],
    rows: top.map(function(p, i){
      const e = p.estoque || {};
      const g = _giro(p);
      return [i+1, p.cod, p.desc||'', (p.depto&&p.depto.nome)||'-', e.qt||0, e.vl_custo||0, (g!=null && g>0)?Math.round(g):'-', e.dt_ult_entrada||'-', _status(p)||'-'];
    }),
    numericCols: [4,5,6]
  };
  window._excExportDatasets = {
    'exc-fornecedores': _excDsForn,
    'exc-top100': _excDsTop
  };

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
    {l:'Valor estoque (em excesso)',v:fK(totVlCusto),s:(pctVl!==null?fP(pctVl)+' do estoque total':'estoque total não disponível'),cls:'dn'},
    {l:'Vl em preço de venda',v:fK(totVlPreco),s:'Se desovasse a preço cheio'},
    {l:'Status PARADO',v:fI(excessos.filter(function(p){return _status(p)==='PARADO';}).length),s:'Sem venda > 90 dias',cls:'wn'},
    {l:'Status MORTO',v:fI(excessos.filter(function(p){return _status(p)==='MORTO';}).length),s:'Sem venda > 180 dias',cls:'dn'},
    {l:'Status CRÍTICO',v:fI(excessos.filter(function(p){return _status(p)==='CRITICO';}).length),s:'Risco iminente',cls:'wn'},
  ]);

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
    ? _abcMesesSel.filter(function(ym){return ymsSet[ym];})
    : ymsTodos;
  const mesesSet = new Set(mesesAtivos.length ? mesesAtivos : ymsTodos);

  // Calcula ranking. Sempre por VALOR (faturamento estimado a partir de qt do período × markup do agregado)
  const comVenda = produtos.map(function(p){
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
  const ordenado = comVenda.slice().sort(function(a,b){return b._valEstimado - a._valEstimado;});
  const totalGeral = ordenado.reduce(function(t,x){return t + x._valEstimado;}, 0);
  let acum = 0;
  ordenado.forEach(function(x){
    acum += x._valEstimado;
    x._pctAcum = totalGeral>0?(acum/totalGeral*100):0;
    x._pctIndiv = totalGeral>0?(x._valEstimado/totalGeral*100):0;
    x._classe = x._pctAcum<=80?'A':x._pctAcum<=95?'B':'C';
  });

  // Filtro de classe: window._abcClasseSel ('Todas'|'A'|'B'|'C')
  if(typeof window._abcClasseSel === 'undefined') window._abcClasseSel = 'Todas';
  const classeSel = window._abcClasseSel;
  const filtrados = classeSel === 'Todas' ? ordenado : ordenado.filter(function(x){return x._classe === classeSel;});

  const labelMes = (mesesAtivos.length === ymsTodos.length)
    ? 'todos os meses de 2026'
    : mesesAtivos.length+' de '+ymsTodos.length+' meses de 2026';

  // ── Header da página ──
  let html = '<div class="ph"><div class="pk">Compras</div><h2>Curva <em>ABC</em><span style="font-size:11px;color:var(--text-muted);font-weight:400;display:block;margin-top:2px;">'+fI(comVenda.length)+' SKUs com venda · '+esc(labelMes)+'</span></h2></div>'
           + '<div class="ph-sep"></div>'
           + '<div class="page-body">';

  // ── Filtro de meses (linha enxuta no topo) ──
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">';
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

  // ── Card único: ranking de SKUs ──
  html += '<div class="cc" style="padding:0;overflow:hidden;">';

  // Header do card com filtro de classe à direita
  html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border);">';
  html += '<div style="display:flex;align-items:center;gap:10px;">';
  html += '<div style="width:28px;height:28px;border-radius:6px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;color:var(--text-muted);">'
       +    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
       +  '</div>';
  html += '<div>';
  html += '<div style="font-size:14px;font-weight:700;color:var(--text);">Ranking de SKUs</div>';
  const totalExibir = Math.min(filtrados.length, 1000);
  html += '<div style="font-size:11px;color:var(--text-muted);">Mostrando '+(filtrados.length>0?'1-'+fI(totalExibir):'0')+' de '+fI(filtrados.length)+' itens · ordenado por faturamento</div>';
  html += '</div></div>';

  // Botões de filtro de classe (estilo segmented)
  html += '<div style="display:inline-flex;border:1px solid var(--border-strong);border-radius:6px;overflow:hidden;">';
  ['Todas','A','B','C'].forEach(function(c){
    const isAtivo = c === classeSel;
    let bg = 'transparent', cor = 'var(--text)';
    if(isAtivo){
      if(c === 'Todas') { bg = 'var(--surface-2)'; cor = 'var(--text)'; }
      else if(c === 'A') { bg = '#dcfce7'; cor = '#166534'; }
      else if(c === 'B') { bg = '#fef3c7'; cor = '#92400e'; }
      else if(c === 'C') { bg = '#fee2e2'; cor = '#991b1b'; }
    }
    html += '<button class="abc-classe-btn" data-classe="'+esc(c)+'" style="padding:6px 14px;font-size:12px;border:none;cursor:pointer;background:'+bg+';color:'+cor+';font-weight:600;'+(c!=='Todas'?'border-left:1px solid var(--border-strong);':'')+'">'+esc(c)+'</button>';
  });
  html += '</div>';
  html += '</div>';

  // Tabela
  html += '<div class="tscroll" style="max-height:calc(100vh - 280px);overflow:auto;"><table class="t" style="margin:0;">'
       +    '<thead style="position:sticky;top:0;background:var(--surface-2);z-index:1;"><tr>'
       +      '<th style="width:64px;text-align:center;">CLASSE</th>'
       +      '<th style="width:80px;">SKU</th>'
       +      '<th class="L">PRODUTO</th>'
       +      '<th>DEPT</th>'
       +      '<th>SEÇÃO</th>'
       +      '<th>FATURADO</th>'
       +      '<th>% INDIV</th>'
       +      '<th>% ACUM</th>'
       +      '<th>QTD VENDIDA</th>'
       +    '</tr></thead><tbody>';

  filtrados.slice(0, 1000).forEach(function(x){
    const p = x.p;
    const dep = (p.depto && p.depto.nome) || '-';
    const sec = (p.secao && p.secao.nome) || (p.categoria && p.categoria.nome) || '-';
    let bgClasse = '#dcfce7', corClasse = '#166534';
    if(x._classe === 'B'){ bgClasse = '#fef3c7'; corClasse = '#92400e'; }
    else if(x._classe === 'C'){ bgClasse = '#fee2e2'; corClasse = '#991b1b'; }
    html += '<tr>'
         +    '<td style="text-align:center;"><span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:5px;background:'+bgClasse+';color:'+corClasse+';font-size:11px;font-weight:800;">'+x._classe+'</span></td>'
         +    '<td style="font-family:JetBrains Mono,monospace;color:var(--text-dim);font-size:11.5px;">'+esc(p.cod)+'</td>'
         +    '<td class="L" data-prod-cod="'+esc(p.cod)+'" title="Clique para abrir o diagnóstico"><strong>'+esc(p.desc||'')+'</strong></td>'
         +    '<td>'+esc(dep)+'</td>'
         +    '<td>'+esc(sec)+'</td>'
         +    '<td class="val-strong">'+fK(x._valEstimado)+'</td>'
         +    '<td>'+fP(x._pctIndiv,1)+'</td>'
         +    '<td>'+fP(x._pctAcum,1)+'</td>'
         +    '<td>'+fI(x._qtPeriodo)+'</td>'
         +  '</tr>';
  });
  if(filtrados.length > 1000){
    html += '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);font-size:11px;padding:10px;">... e mais '+fI(filtrados.length-1000)+' SKUs. Use a Análise Dinâmica para ver tudo.</td></tr>';
  }
  html += '</tbody></table></div>';
  html += '</div>'; // fim card

  html += '</div>'; // fim page-body
  cont.innerHTML = html;

  // Bind toggle classe
  document.querySelectorAll('.abc-classe-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      window._abcClasseSel = btn.getAttribute('data-classe');
      renderABCNovo();
    });
  });

  // Bind toggle de mês
  document.querySelectorAll('.abc-mes-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const ym = btn.getAttribute('data-ym');
      const atual = (_abcMesesSel && _abcMesesSel.length) ? _abcMesesSel.slice() : ymsTodos.slice();
      const idx = atual.indexOf(ym);
      if(idx >= 0) atual.splice(idx, 1);
      else atual.push(ym);
      _abcMesesSel = atual.length === 0 ? null : atual;
      renderABCNovo();
    });
  });
  const btnClear = document.getElementById('abc-meses-clear');
  if(btnClear) btnClear.addEventListener('click', function(){ _abcMesesSel = null; renderABCNovo(); });

  // Bind clique no nome do produto pra abrir diagnóstico (v4.66: via nav stack)
  document.querySelectorAll('[data-prod-cod]').forEach(function(td){
    td.style.cursor = 'pointer';
    td.addEventListener('click', function(){
      const cod = parseInt(td.getAttribute('data-prod-cod'), 10);
      if(typeof window._navOpenProd === 'function'){
        window._navOpenProd(cod, 'abc', null);
      } else if(typeof window._openProdNovo === 'function'){
        window._openProdNovo(cod);
      }
    });
  });
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

  // v4.70: filtro de meses usa o padrão global (activePers · PERS=2026-01..04).
  // Se o cubo ainda não foi carregado, dispara o lazy load e mostra placeholder.
  const ymsTodos = _fornYmsDisponiveis2026();
  if(ymsTodos.length === 0){
    // Spinner customizado pra indicar loading do cubo (ícone diferente da lupa default)
    var _spinnerSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="animation:dlSpin 1s linear infinite;"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>';
    cont.innerHTML = '<div class="ph"><div class="pk">Compras</div><h2>Análise de <em>fornecedores</em></h2></div>'
                   + '<div class="ph-sep"></div><div class="page-body">'
                   + '<div class="cc">'+_emptyState('Carregando dados de 2026…','O cubo OLAP é carregado sob demanda (≈10 MB). A página será preenchida automaticamente em alguns segundos.', _spinnerSvg)+'</div></div>';
    if(typeof _carregarCuboLazy === 'function'){
      _carregarCuboLazy().then(function(){
        if(typeof renderedPages !== 'undefined') renderedPages.delete('fornecedores');
        renderFornecedoresNovo();
      }).catch(function(){});
    }
    return;
  }

  // Filtra apenas os meses que estão ativos em activePers (2026-only)
  const _activeSet = (typeof activePers !== 'undefined' && activePers && activePers.has)
    ? activePers
    : new Set(ymsTodos);
  const mesesAtivos = ymsTodos.filter(function(ym){return _activeSet.has(ym);});
  const mesesSet = new Set(mesesAtivos.length ? mesesAtivos : ymsTodos);

  const fornAll = _fornAgregarPorPeriodo(mesesSet);
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

  // v4.70: slot pra pfb padrão (injeta após render)
  html += '<div id="forn-pfb-slot"></div>';

  // Banner do período (resumo do que está sendo mostrado)
  const labelMes = (mesesAtivos.length === ymsTodos.length || mesesAtivos.length === 0)
    ? 'todos os meses ativos de 2026'
    : mesesAtivos.length+' de '+ymsTodos.length+' meses de 2026';
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);line-height:1.5;">'
       + '<strong>Período:</strong> '+esc(labelMes)+' · '
       + '<strong>'+fI(fornAll.length)+'</strong> fornecedores · '
       + '<strong>'+fI(fornAtivos.length)+'</strong> com compras · '
       + 'Retrato estoque: '+fDt(E.meta && E.meta.data_referencia)
       + '</div>';

  html += '<div id="kg-forn-novo"></div>';

  // 2 charts lado a lado
  html += '<div class="cc"><div class="cct">Top 12 · Compras 2026</div>'
       +    '<div class="ccs">Cor por margem real das vendas (verde >10%, amarelo 5-10%, vermelho &lt;5%)</div>'
       +    '<div style="height:280px;margin-top:8px;"><canvas id="c-forn-compra"></canvas></div>'
       +  '</div>';

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

  // KPIs (v4.70: 2026-only)
  const totCompraLiq = fornAtivos.reduce(function(s,f){return s+f.v_compra_liq;},0);
  const top1Nome = top1 ? (top1.nome||'').substring(0, 22) : '—';
  const _qDevForn = fornAll.filter(function(f){return f.dev_valor>0;}).length;
  document.getElementById('kg-forn-novo').innerHTML = kgHtml([
    {l:'Fornecedores ativos', v:fI(fornAtivos.length), s:'Com compras no período · de '+fI(fornAll.length)+' cadastrados'},
    {l:'Líder em compras',    v:top1Nome,              s:top1?fK(top1.v_compra_liq||top1.v_compra)+' líquidas no período':'-'},
    {l:'Concentração top 10', v:fP(concTop10),         s:'do total de compras'},
    {l:'Compras líquidas',    v:fK(totCompraLiq),      s:'Brutas '+fK(totCompra)+' − devoluções '+fK(totDev)},
    {l:'Margem global',       v:fP(margGlob),          s:'Lucro/Vendas com produtos desses fornecedores',cls:margGlob>10?'ok':margGlob>5?'':'wn'},
    {l:'Devoluções',          v:fK(totDev),            s:fI(_qDevForn)+' fornecedores · '+fP(totCompra>0?totDev/totCompra*100:0)+' das compras',cls:'dn'},
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

  // v4.70: injeta a pfb padrão (mesma de Compras × Vendas)
  if(typeof buildFilterBar === 'function'){
    const slot = document.getElementById('forn-pfb-slot');
    if(slot){
      slot.innerHTML = '';
      slot.appendChild(buildFilterBar('fornecedores'));
    }
  }
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

// v4.65: invalida todos os caches dos diagnósticos.
// Chamado por _loadDadosModulares (core.js) sempre que troca de base.
// Sem isso, os índices ficavam congelados com os dados da base antiga
// e os listeners de busca não eram re-bindados.
function _invalidarCachesDiag(){
  // Diag. Produto
  _diagIdxByC = null;
  _diagIdxByE = null;
  _diagListaOrd = null;
  _diagBoundProd = false;
  // Diag. Fornecedor
  if(typeof _diagFornIdxByCod !== 'undefined'){
    _diagFornIdxByCod = null;
    _diagFornListaOrd = null;
    _diagFornBoundProd = false;
  }
  // Cache de agregação de fornecedores (usado por _diagFornBuildIdx via _fornAgregar)
  if(typeof _fornAggCache !== 'undefined'){
    _fornAggCache = null;
  }
  try { console.log('[diag] caches invalidados (troca de base)'); } catch(e){}
}

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
  // Filtra: tira placeholders e tira consolidados (raiz/base com filhos), pois
  // diagnóstico só faz sentido em loja específica. Restam: ATP, CP1, CP3, CP5, CP40.
  const filiaisDispon = (_filiaisDisponiveis || []).filter(function(f){
    if(f.placeholder) return false;
    if(f.tipo === 'raiz') return false;       // GPC Consolidado
    // 'base' que tem filhos é consolidado também (ex: cp tem cp1/cp3/cp5/cp40)
    if(f.tipo === 'base'){
      const temFilhos = (_filiaisDisponiveis || []).some(function(g){return g.parent === f.sigla;});
      if(temFilhos) return false;
    }
    return true;
  });
  let html = '<div class="ph"><div class="pk">'+esc(tituloPagina)+'</div><h2>Escolha uma <em>base</em> para diagnosticar</h2></div>'
    + '<div class="ph-sep"></div>'
    + '<div class="page-body" style="padding:40px 20px;">'
    + '<div style="max-width:560px;margin:20px auto;text-align:center;">'
    + '<div style="width:64px;height:64px;background:var(--accent-bg);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;">'
    +   '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    + '</div>'
    + '<h3 style="font-size:18px;font-weight:800;margin-bottom:10px;color:var(--text);">Escolha uma base para diagnosticar</h3>'
    + '<p style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:24px;">'
    +   'O diagnóstico precisa de uma base com cadastro único de itens e fornecedores. '
    +   'No GPC Consolidado, ATP e Comercial Pinto têm cadastros distintos: o mesmo fornecedor '
    +   '(ex: Nestlé) aparece com códigos diferentes em cada base, e o mesmo SKU pode existir '
    +   'em duas listas separadas. Pra evitar trazer informação parcial ou misturada, '
    +   'selecione uma das bases abaixo.'
    + '</p>'
    + '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:10px;">Selecione a base:</div>'
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

  // Bloqueio: diagnóstico só faz sentido em base com cadastro único de
  // itens/fornecedores. ATP e Comercial Pinto têm cadastros diferentes —
  // no GPC Consolidado o mesmo "Nestlé" pode aparecer com 2 códigos
  // distintos, e o sistema sugeriria só o de uma base. Pra evitar
  // confusão, bloqueamos a tela em GPC Consolidado e pedimos ao usuário
  // pra escolher uma base (ATP, CP, ou loja-folha).
  const sigAtual = (typeof _filialAtual !== 'undefined' && _filialAtual && _filialAtual.sigla)
    ? _filialAtual.sigla.toLowerCase() : 'grupo';
  const tipoAtual = (typeof _filialAtual !== 'undefined' && _filialAtual && _filialAtual.tipo)
    ? _filialAtual.tipo.toLowerCase() : null;
  const ehGpcConsolidado = (sigAtual === 'grupo') || (tipoAtual === 'raiz') || (tipoAtual === 'consolidado');
  if(ehGpcConsolidado){
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
  // v4.65: handler nomeado pra poder remover antes de re-adicionar
  // (evita acumular listeners no document a cada troca de base)
  if(typeof window._diagProdDocClick === 'function'){
    document.removeEventListener('click', window._diagProdDocClick);
  }
  window._diagProdDocClick = function(e){
    const drpRef = document.getElementById('srch-drop');
    if(!drpRef) return;
    if(!e.target.closest('#prod-srch') && !e.target.closest('#srch-drop')){
      drpRef.classList.remove('show');
    }
  };
  document.addEventListener('click', window._diagProdDocClick);
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
  // EAN: campo opcional. Aparece se o JSON trouxer p.ean (ETL futuro).
  // Fallback: campos alternativos (codigo_barras, ean13) caso o ETL use outro nome.
  const eanProd = p.ean || p.codigo_barras || p.ean13 || null;
  html += '<div class="prod-hero">'
       +    '<div class="ph-nav">'+esc(nav)+'</div>'
       +    '<div class="ph-code">#'+esc(p.cod)
       +      (eanProd ? ' · EAN '+esc(eanProd) : '')
       +      (p.embalagem?' · '+esc(p.embalagem):'')+' · '+esc(p.unidade||'—')+'</div>'
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

  // ─── Extrato do produto (entradas detalhadas + saídas mensais) ───
  // Agrupa entradas_detalhadas por ym e mostra cada NF individualmente, junto
  // com a saída mensal e a devolução do mês.
  const ent = (p.entradas_detalhadas || []).slice();
  const vmes = (p.vendas_por_mes || []).slice();

  if(ent.length || vmes.length){
    // Agrupa entradas por ym
    const entPorYm = {};
    ent.forEach(function(x){
      const ym = (x.data||'').substring(0,7);
      if(!ym) return;
      if(!entPorYm[ym]) entPorYm[ym] = [];
      entPorYm[ym].push(x);
    });
    // Vendas por ym
    const vendPorYm = {};
    vmes.forEach(function(v){ vendPorYm[v.ym] = v; });
    // Set de meses, ordenados desc
    const ymsSet = new Set();
    Object.keys(entPorYm).forEach(function(y){ ymsSet.add(y); });
    Object.keys(vendPorYm).forEach(function(y){ ymsSet.add(y); });
    const yms = Array.from(ymsSet).filter(function(y){return y >= '2026-01';}).sort().reverse();

    if(yms.length){
      html += '<div class="ds">'
           +    '<div class="ds-hdr">'
           +      '<div class="ds-ico" style="background:var(--accent-bg);color:var(--accent-text);">'
           +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
           +      '</div>'
           +      '<div><div class="ds-title">Extrato do produto</div><div class="ds-sub">Entradas e saídas organizadas por mês · jan-abr/2026</div></div>'
           +    '</div>'
           +    '<div class="ds-body" style="padding:14px;">'
           +      '<table class="t" style="margin:0;font-size:11.5px;">'
           +        '<thead><tr>'
           +          '<th class="L" style="width:90px;">Tipo</th>'
           +          '<th class="L" style="width:90px;">Data</th>'
           +          '<th class="L">Fornecedor / Item</th>'
           +          '<th style="width:80px;">NF</th>'
           +          '<th style="width:100px;">Qtde</th>'
           +          '<th style="width:90px;">P. Unit</th>'
           +          '<th style="width:110px;">Total</th>'
           +          '<th style="width:120px;">Status</th>'
           +        '</tr></thead><tbody>';

      // Função pra renderizar status badge
      function statusBadge(st, dtPagto){
        if(st === 'pago')    return '<span class="kg-tag ok" style="font-size:10px;" title="'+(dtPagto?'Pago em '+fDt(dtPagto):'Pago')+'">Pago</span>';
        if(st === 'aberto')  return '<span class="kg-tag wn" style="font-size:10px;">Aberto</span>';
        if(st === 'parcial') return '<span class="kg-tag" style="font-size:10px;background:#fef3c7;color:#92400e;" title="'+(dtPagto?'Último pagamento em '+fDt(dtPagto):'Parcialmente pago')+'">Parcial</span>';
        // desconhecido: NF não está em pagas (grupo 100) nem em aberto. Pode ser
        // pagamento por outra conta, intragrupo, cancelamento, ou ETL incompleto.
        return '<span style="font-size:10px;color:var(--text-muted);" title="Status não identificado nas tabelas de pagas (grupo 100) nem em aberto">—</span>';
      }

      yms.forEach(function(ym){
        const entradasMes = (entPorYm[ym] || []).slice().sort(function(a,b){return (a.data||'').localeCompare(b.data||'');});
        const vendaMes = vendPorYm[ym];
        const ano = ym.substring(0,4);
        const lblMes = _ymToLabel(ym).split('/')[0];
        const lblMesPt = ({Jan:'Janeiro',Fev:'Fevereiro',Mar:'Março',Abr:'Abril',Mai:'Maio',Jun:'Junho',Jul:'Julho',Ago:'Agosto',Set:'Setembro',Out:'Outubro',Nov:'Novembro',Dez:'Dezembro'})[lblMes] || lblMes;

        // Cabeçalho do mês
        const totQtEnt = entradasMes.reduce(function(s,x){return s+(x.qt||0);}, 0);
        const totValEnt = entradasMes.reduce(function(s,x){return s+(x.valor||0);}, 0);
        html += '<tr style="background:var(--surface-2);"><td colspan="8" class="L" style="padding:10px 12px;">'
             +    '<strong style="font-size:13px;color:var(--text);">'+esc(lblMesPt)+'</strong> '
             +    '<span style="color:var(--text-muted);font-size:11px;">'+esc(ano)+'</span>'
             +    ' <span class="kg-tag ok" style="font-size:10px;margin-left:8px;">'+fI(entradasMes.length)+' entrada'+(entradasMes.length!==1?'s':'')+'</span>'
             +    ' <span class="kg-tag" style="font-size:10px;background:var(--surface);color:var(--text-dim);">Saída mês</span>'
             +  '</td></tr>';

        // Linhas de entrada
        entradasMes.forEach(function(x){
          html += '<tr>'
               +    '<td class="L"><span style="color:var(--ok);font-weight:600;font-size:10px;">↓ ENTRADA</span></td>'
               +    '<td class="L" style="font-family:JetBrains Mono,monospace;color:var(--text-dim);font-size:11px;">'+fDt(x.data)+'</td>'
               +    '<td class="L">'+esc((x.fornecedor||'').substring(0,40))+(x.nf?' <span style="color:var(--text-muted);font-size:10px;">·#'+esc(x.nf)+'</span>':'')+'</td>'
               +    '<td>'+esc(x.nf||'')+'</td>'
               +    '<td>'+fI(x.qt||0)+' un</td>'
               +    '<td>R$ '+(x.preco_unit?x.preco_unit.toFixed(4).replace('.', ','):'—')+'/un</td>'
               +    '<td class="val-strong">'+fK(x.valor||0)+'</td>'
               +    '<td>'+statusBadge(x.status, x.dt_pagto)+(x.status==='parcial'&&x.valor_aberto>0?' <span style="font-size:10px;color:var(--text-muted);">'+fK(x.valor_aberto)+' aberto</span>':(x.status==='aberto'?' <span style="font-size:10px;color:var(--text-muted);">'+fK(x.valor_aberto||x.valor||0)+'</span>':''))+'</td>'
               +  '</tr>';
        });

        // Linha de saída do mês (vendas)
        if(vendaMes){
          // Estimar valor pela proporção qt/qt12m × valor12m
          const vds = p.vendas || {};
          const valEstSaida = (vds.qt > 0 && vds.valor > 0) ? vds.valor * (vendaMes.qt / vds.qt) : 0;
          const margemAprox = vds.marg || 0;
          const lucroAprox = valEstSaida * margemAprox / 100;
          const precoMedSaida = vendaMes.qt > 0 ? valEstSaida / vendaMes.qt : 0;
          html += '<tr>'
               +    '<td class="L"><span style="color:var(--text-dim);font-weight:600;font-size:10px;">↑ SAÍDA MÊS</span></td>'
               +    '<td class="L" style="font-family:JetBrains Mono,monospace;color:var(--text-muted);font-size:11px;">'+_ymToLabel(ym)+'</td>'
               +    '<td class="L" style="color:var(--text-dim);font-style:italic;">Período completo</td>'
               +    '<td>—</td>'
               +    '<td>'+fI(vendaMes.qt||0)+' un</td>'
               +    '<td>'+(precoMedSaida>0?'R$ '+precoMedSaida.toFixed(2).replace('.',',')+'/un':'—')+'</td>'
               +    '<td class="val-strong">'+fK(valEstSaida)+'</td>'
               +    '<td><span style="font-size:10px;color:var(--text-muted);">Lucro '+fP(margemAprox)+' · '+fK(lucroAprox)+'</span></td>'
               +  '</tr>';
        }

        // Resumo do mês
        const saldo = (totQtEnt) - ((vendaMes && vendaMes.qt) || 0);
        const saldoCor = saldo >= 0 ? 'var(--ok)' : 'var(--dn)';
        html += '<tr style="background:var(--surface);"><td colspan="8" class="L" style="padding:6px 12px;font-size:10.5px;color:var(--text-dim);font-family:JetBrains Mono,monospace;">'
             +    'Entrou: <strong>'+fI(totQtEnt)+' un</strong> / <strong>'+fK(totValEnt)+'</strong>'
             +    ' &nbsp;·&nbsp; Vendido: <strong>'+fI((vendaMes&&vendaMes.qt)||0)+' un</strong>'
             +    ' &nbsp;·&nbsp; Saldo mês: <strong style="color:'+saldoCor+';">'+(saldo>=0?'+':'')+fI(saldo)+' un</strong>'
             +  '</td></tr>';
      });

      html += '</tbody></table></div></div>';
    }
  }

  // ─── Estoque + Financeiro lado a lado (estilo da referência) ───
  // Calcula totais financeiros agregando entradas_detalhadas. Para entradas
  // com status 'desconhecido' (NF não bate em pagas grupo 100 nem em aberto),
  // somamos como "outros" — exibido separado, sem inflar pago nem aberto.
  let finTotal = 0, finPago = 0, finAberto = 0, finOutros = 0;
  ent.forEach(function(x){
    finTotal += (x.valor || 0);
    if(x.status === 'desconhecido'){
      finOutros += (x.valor || 0);
    } else {
      finPago   += (x.valor_pago  || 0);
      finAberto += (x.valor_aberto|| 0);
    }
  });
  const finPagoPct   = finTotal > 0 ? (finPago/finTotal*100)   : 0;
  const finAbertoPct = finTotal > 0 ? (finAberto/finTotal*100) : 0;
  const finOutrosPct = finTotal > 0 ? (finOutros/finTotal*100) : 0;

  html += '<div class="row2eq">';

  // Card Estoque (visual estilo referência: KPIs em grid)
  html += '<div class="cc">'
       +    '<div class="cct" style="display:flex;align-items:center;gap:8px;">'
       +      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>'
       +      'Estoque <span style="font-size:11px;color:var(--text-muted);font-weight:400;">· Posição em '+esc(e.dt_ult_entrada||'—')+'</span>'
       +    '</div>'
       +    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:12px;">'
       +      '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
       +        '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Disponível</div>'
       +        '<div style="font-size:18px;font-weight:800;color:var(--text);margin-top:3px;">'+fI(e.qt||0)+'</div>'
       +        '<div style="font-size:10px;color:var(--text-muted);">unidades</div>'
       +      '</div>'
       +      '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
       +        '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Valor custo</div>'
       +        '<div style="font-size:18px;font-weight:800;color:var(--text);margin-top:3px;">'+fK(e.vl_custo||0)+'</div>'
       +        '<div style="font-size:10px;color:var(--text-muted);">imobilizado</div>'
       +      '</div>'
       +      '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
       +        '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Cobertura</div>'
       +        '<div style="font-size:18px;font-weight:800;color:var(--text);margin-top:3px;">'+esc(coberturaTxt)+'</div>'
       +        '<div style="font-size:10px;color:var(--text-muted);">'+(coberturaDias!=null?fI((vds.qt||0)/((vds.meses||1)*30)).toString().replace(/(\d+)/, function(m){return parseFloat(m).toFixed(1).replace('.',',');})+' un/dia':'sem dados')+'</div>'
       +      '</div>'
       +      '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
       +        '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Custo real unit.</div>'
       +        '<div style="font-size:16px;font-weight:800;color:var(--text);margin-top:3px;">'+(e.custo>0?'R$ '+e.custo.toFixed(2).replace('.', ','):'—')+'</div>'
       +      '</div>'
       +      '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
       +        '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Preço venda cad.</div>'
       +        '<div style="font-size:16px;font-weight:800;color:var(--text);margin-top:3px;">'+(e.preco>0?'R$ '+e.preco.toFixed(2).replace('.', ','):'—')+'</div>'
       +      '</div>'
       +      '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
       +        '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Markup cadastro</div>'
       +        '<div style="font-size:16px;font-weight:800;color:var(--text);margin-top:3px;">'+(margPot>0?'+':'')+fP(margPot,1)+'</div>'
       +      '</div>'
       +    '</div>'
       +    '<div style="margin-top:10px;font-size:11px;color:var(--text-muted);">Última entrada: <strong>'+esc(e.dt_ult_entrada||'—')+'</strong></div>'
       +  '</div>';

  // Card Financeiro com TOTAL/PAGO/ABERTO + barra
  if(finTotal > 0){
    html += '<div class="cc">'
         +    '<div class="cct" style="display:flex;align-items:center;gap:8px;">'
         +      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>'
         +      'Financeiro <span style="font-size:11px;color:var(--text-muted);font-weight:400;">· Status das duplicatas deste item</span>'
         +    '</div>'
         +    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:12px;">'
         +      '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
         +        '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Total comprado</div>'
         +        '<div style="font-size:16px;font-weight:800;color:var(--text);margin-top:3px;">'+fK(finTotal)+'</div>'
         +      '</div>'
         +      '<div style="background:#dcfce7;border-radius:6px;padding:10px;">'
         +        '<div style="font-size:10px;color:#166534;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Já pago</div>'
         +        '<div style="font-size:16px;font-weight:800;color:#166534;margin-top:3px;">'+fK(finPago)+'</div>'
         +        '<div style="font-size:10px;color:#166534;">'+fP(finPagoPct,1)+'</div>'
         +      '</div>'
         +      '<div style="background:#fef3c7;border-radius:6px;padding:10px;">'
         +        '<div style="font-size:10px;color:#92400e;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Em aberto</div>'
         +        '<div style="font-size:16px;font-weight:800;color:#92400e;margin-top:3px;">'+fK(finAberto)+'</div>'
         +        '<div style="font-size:10px;color:#92400e;">'+fP(finAbertoPct,1)+'</div>'
         +      '</div>'
         +    '</div>'
         +    '<div style="margin-top:14px;height:8px;border-radius:4px;overflow:hidden;background:var(--surface-2);display:flex;">'
         +      '<div style="width:'+finPagoPct.toFixed(2)+'%;background:#16a34a;" title="Pago"></div>'
         +      '<div style="width:'+finAbertoPct.toFixed(2)+'%;background:#f59e0b;" title="Em aberto"></div>'
         +      (finOutrosPct > 0 ? '<div style="width:'+finOutrosPct.toFixed(2)+'%;background:#9ca3af;" title="Status não identificado"></div>' : '')
         +    '</div>'
         +    '<div style="margin-top:6px;font-size:11px;color:var(--text-muted);">'
         +      '● <span style="color:#16a34a;font-weight:600;">Pago: '+fP(finPagoPct,1)+'</span> ('+fK(finPago)+') &nbsp;'
         +      '● <span style="color:#92400e;font-weight:600;">Em aberto: '+fP(finAbertoPct,1)+'</span> ('+fK(finAberto)+')'
         +      (finOutrosPct > 0 ? ' &nbsp;● <span style="color:#6b7280;font-weight:600;">Outros: '+fP(finOutrosPct,1)+'</span> ('+fK(finOutros)+')' : '')
         +    '</div>'
         +    (finOutrosPct > 0 ? '<div style="margin-top:6px;font-size:10px;color:var(--text-muted);font-style:italic;line-height:1.4;">Outros: NFs que não constam nas tabelas de pagas (grupo 100) nem em aberto. Podem ser pagamentos por outras contas, intragrupo ou cancelamentos.</div>' : '')
         +  '</div>';
  } else {
    // Fallback: card com aviso de dados não disponíveis
    html += '<div class="cc"><div class="cct">Financeiro</div>'
         +    '<div style="padding:14px;color:var(--text-muted);font-size:12px;text-align:center;">Sem entradas detalhadas neste produto no período.</div>'
         +  '</div>';
  }

  html += '</div>'; // fim row2eq

  // ─── Evolução do preço de compra ───
  if(ent.length >= 2){
    // Preço médio compra ponderado por volume
    const totQt = ent.reduce(function(s,x){return s+(x.qt||0);},0);
    const totVal = ent.reduce(function(s,x){return s+(x.valor||0);},0);
    const precoMedCompra = totQt > 0 ? totVal/totQt : 0;
    const precoMedVenda = e.preco || 0;
    const markup = precoMedCompra > 0 ? ((precoMedVenda - precoMedCompra)/precoMedCompra*100) : 0;

    // Min e max preço
    const precos = ent.map(function(x){return x.preco_unit || 0;}).filter(function(v){return v > 0;});
    const precoMin = Math.min.apply(null, precos);
    const precoMax = Math.max.apply(null, precos);
    const variacao = precoMin > 0 ? ((precoMax - precoMin)/precoMin*100) : 0;

    html += '<div class="ds">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico" style="background:var(--accent-bg);color:var(--accent-text);">'
         +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'
         +      '</div>'
         +      '<div><div class="ds-title">Evolução do preço de compra</div><div class="ds-sub">Histórico de entradas vs preço de venda</div></div>'
         +    '</div>'
         +    '<div class="ds-body" style="padding:14px;">'
         +      '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:14px;">'
         +        '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
         +          '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;font-weight:700;">P. médio compra</div>'
         +          '<div style="font-size:16px;font-weight:800;margin-top:3px;">R$ '+precoMedCompra.toFixed(2).replace('.',',')+'</div>'
         +          '<div style="font-size:10px;color:var(--text-muted);">Ponderado por volume</div>'
         +        '</div>'
         +        '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
         +          '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;font-weight:700;">P. médio venda</div>'
         +          '<div style="font-size:16px;font-weight:800;margin-top:3px;">'+(precoMedVenda>0?'R$ '+precoMedVenda.toFixed(2).replace('.',','):'—')+'</div>'
         +          '<div style="font-size:10px;color:var(--text-muted);">No período</div>'
         +        '</div>'
         +        '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
         +          '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Markup</div>'
         +          '<div style="font-size:16px;font-weight:800;margin-top:3px;color:'+(markup<10?'var(--wn)':markup>20?'var(--ok)':'var(--text)')+';">'+(markup>=0?'+':'')+fP(markup,1)+'</div>'
         +          '<div style="font-size:10px;color:var(--text-muted);">Venda vs compra</div>'
         +        '</div>'
         +        '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
         +          '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Variação de preço</div>'
         +          '<div style="font-size:16px;font-weight:800;margin-top:3px;">'+fP(variacao,1)+'</div>'
         +          '<div style="font-size:10px;color:var(--text-muted);">Min→Max no período</div>'
         +        '</div>'
         +        '<div style="background:var(--surface-2);border-radius:6px;padding:10px;">'
         +          '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Desc. financeiro</div>'
         +          '<div style="font-size:16px;font-weight:800;margin-top:3px;color:var(--text-muted);">—</div>'
         +          '<div style="font-size:10px;color:var(--text-muted);">Sem desconto</div>'
         +        '</div>'
         +      '</div>'
         +      '<div style="height:240px;"><canvas id="c-diag-precos"></canvas></div>'
         +    '</div>'
         +  '</div>';
  }

  // Diagnóstico automático (mantido)
  const obs = _diagGerarObservacoes(p);
  if(obs.length){
    html += '<div class="ds">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico" style="background:var(--highlight-bg);color:var(--highlight-text);">'
         +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
         +      '</div>'
         +      '<div><div class="ds-title">Diagnóstico automático</div><div class="ds-sub">'+obs.length+' ponto'+(obs.length!==1?'s':'')+'</div></div>'
         +    '</div>'
         +    '<div class="ds-body" style="padding:14px;">'
         +      '<ul style="margin:0;padding-left:20px;line-height:1.7;font-size:13px;color:var(--text);">'
         +      obs.map(function(o){return '<li><strong style="color:'+o.color+';">'+esc(o.tag)+'</strong> '+esc(o.msg)+'</li>';}).join('')
         +      '</ul>'
         +    '</div>'
         + '</div>';
  }

  // Fornecedores do item — agora detalhado por fornecedor cruzando entradas
  if(ent.length){
    const porForn = {};
    ent.forEach(function(x){
      const k = x.fornecedor_cod;
      if(!porForn[k]) porForn[k] = {cod:x.fornecedor_cod, nome:x.fornecedor, qt:0, valor:0, pago:0, aberto:0, nfs:new Set()};
      porForn[k].qt    += (x.qt||0);
      porForn[k].valor += (x.valor||0);
      porForn[k].pago  += (x.valor_pago||0);
      porForn[k].aberto+= (x.valor_aberto||0);
      if(x.nf) porForn[k].nfs.add(x.nf);
    });
    const fornsList = Object.values(porForn).sort(function(a,b){return b.valor - a.valor;});
    html += '<div class="ds">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico" style="background:var(--surface-2);color:var(--text-muted);">'
         +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg>'
         +      '</div>'
         +      '<div><div class="ds-title">Fornecedores do item</div><div class="ds-sub">Quem vendeu e por quanto</div></div>'
         +    '</div>'
         +    '<table class="t" style="margin:0;font-size:11.5px;">'
         +      '<thead><tr><th class="L">Fornecedor</th><th>Entradas</th><th>Quantidade</th><th>Total</th><th>Pago</th><th>Aberto</th></tr></thead><tbody>';
    fornsList.forEach(function(f){
      html += '<tr>'
           +    '<td class="L"><strong>'+esc(f.nome||'')+'</strong>'+(f.cod?' <span style="color:var(--text-muted);font-size:10px;">#'+esc(f.cod)+'</span>':'')+'</td>'
           +    '<td>'+fI(f.nfs.size)+'</td>'
           +    '<td>'+fI(f.qt)+' un</td>'
           +    '<td class="val-strong">'+fK(f.valor)+'</td>'
           +    '<td style="color:#16a34a;font-weight:600;">'+fK(f.pago)+'</td>'
           +    '<td style="color:#92400e;font-weight:600;">'+fK(f.aberto)+'</td>'
           +  '</tr>';
    });
    html += '</tbody></table></div>';
  }

  cont.innerHTML = html;

  // KPIs (5) — Vendas Líq · Margem · Compras Líq · Estoque · Cobertura
  const totVendas = vds.valor || 0;
  const lucro = vds.lucro || 0;

  // Fallback: quando o ETL não populou compras_12m mas temos entradas_detalhadas
  // (caso comum em CP3 com produtos que entram só via transferência intragrupo
  // — cod_oper ET/EB/ER), derivamos os totais das entradas. Separamos compras
  // reais (cod_oper E) de transferências (ET/EB/ER) pra mostrar info honesta.
  let c12Eff = c12;
  let kpiSubCompras = fI(c12.qt||0)+' '+esc(p.unidade||'un')+' · '+fI(c12.nfs||0)+' NFs';
  if(!c12.valor && ent.length){
    let qtCompra=0, valCompra=0, nfsCompra=new Set();
    let qtTransf=0, valTransf=0, nfsTransf=new Set();
    ent.forEach(function(x){
      const op = (x.cod_oper||'').toUpperCase();
      const ehTransf = (op === 'ET' || op === 'EB' || op === 'ER');
      if(ehTransf){
        qtTransf  += x.qt    || 0;
        valTransf += x.valor || 0;
        if(x.nf) nfsTransf.add(x.nf);
      } else {
        qtCompra  += x.qt    || 0;
        valCompra += x.valor || 0;
        if(x.nf) nfsCompra.add(x.nf);
      }
    });
    c12Eff = {qt:qtCompra, valor:valCompra, nfs:nfsCompra.size, _derivado:true,
              _qtTransf:qtTransf, _valTransf:valTransf, _nfsTransf:nfsTransf.size};
    if(qtTransf > 0 && qtCompra === 0){
      // Caso CP3 cod 22681: tudo entra via transferência intragrupo
      kpiSubCompras = 'só transferência intragrupo · '+fI(qtTransf)+' '+esc(p.unidade||'un')+' · '+fK(valTransf);
    } else if(qtTransf > 0){
      kpiSubCompras = fI(qtCompra)+' '+esc(p.unidade||'un')+' · '+fI(nfsCompra.size)+' NFs · +'+fK(valTransf)+' transf.';
    } else {
      kpiSubCompras = fI(qtCompra)+' '+esc(p.unidade||'un')+' · '+fI(nfsCompra.size)+' NFs (derivado)';
    }
  }

  document.getElementById('kp-diag-novo').innerHTML = kgHtml([
    {l:'Vendas líquidas', v:fK(totVendas), s:fI(vds.qt||0)+' '+esc(p.unidade||'un')+' · '+(vds.meses||0)+' meses'},
    {l:'Margem bruta', v:fP(margReal), s:'Lucro '+fK(lucro), cls:margReal>10?'ok':margReal<5?'wn':''},
    {l:'Compras líquidas', v:fK(c12Eff.valor||0), s:kpiSubCompras},
    {l:'Estoque atual', v:fI(e.qt||0)+' '+esc(p.unidade||''), s:'R$ '+fK(e.vl_preco||0)+' p/ venda'},
    {l:'Cobertura', v:coberturaTxt, s:coberturaDias!=null?'base: '+(mesesVend)+' meses de venda':'sem cálculo possível', cls:coberturaCls},
  ]);

  // Chart: Evolução do preço de compra (linha cronológica das entradas)
  if(ent.length >= 2){
    const ordCron = ent.slice().sort(function(a,b){return (a.data||'').localeCompare(b.data||'');});
    const labels = ordCron.map(function(x){return fDt(x.data);});
    const dadosPreco = ordCron.map(function(x){return x.preco_unit||0;});
    const precoVendaCad = e.preco || 0;
    const dadosLinhaVenda = ordCron.map(function(){return precoVendaCad;});

    mkC('c-diag-precos', {type:'line',
      data:{labels:labels, datasets:[
        {label:'Preço compra', data:dadosPreco,
         borderColor:_PAL.ac, backgroundColor:_PAL.ac+'22',
         tension:0.2, pointRadius:3, fill:true, borderWidth:2},
        {label:'Preço venda (cadastro)', data:dadosLinhaVenda,
         borderColor:_PAL.ok, backgroundColor:'transparent',
         tension:0, pointRadius:0, borderDash:[5,3], borderWidth:1.5}
      ]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{
          legend:{position:'bottom', labels:{padding:8, usePointStyle:true, boxWidth:8, font:{size:10}}},
          tooltip:{callbacks:{
            title:function(ctx){var i=ctx[0].dataIndex; return labels[i]+' · NF '+(ordCron[i].nf||'—');},
            label:function(ctx){
              if(ctx.datasetIndex===0){
                var x = ordCron[ctx.dataIndex];
                return 'Preço: R$ '+ctx.raw.toFixed(4).replace('.',',')+'/un · '+fI(x.qt||0)+' un · '+fK(x.valor||0);
              }
              return ctx.dataset.label+': R$ '+ctx.raw.toFixed(2).replace('.',',');
            }}}
        },
        scales:{
          x:{grid:{display:false},ticks:{font:{size:9}, maxRotation:45, minRotation:45}},
          y:{ticks:{callback:function(v){return 'R$'+v.toFixed(2).replace('.',',');}, font:{size:10}}}
        }}});
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
    // Verifica se há entradas detalhadas — se sim, é só transferência intragrupo
    const entCheck = p.entradas_detalhadas || [];
    const temTransfRecente = entCheck.some(function(x){
      const op = (x.cod_oper||'').toUpperCase();
      return (op === 'ET' || op === 'EB' || op === 'ER');
    });
    const temCompraReal = entCheck.some(function(x){
      const op = (x.cod_oper||'').toUpperCase();
      return op && op !== 'ET' && op !== 'EB' && op !== 'ER';
    });
    if(temTransfRecente && !temCompraReal){
      obs.push({tag:'Reposição via transferência:', color:'#0891b2', msg:'todo o estoque entrou via transferência intragrupo (ET/EB/ER), sem compra direta de fornecedor.'});
    } else if(!entCheck.length){
      obs.push({tag:'Sem compras 12m:', color:'#b45309', msg:'tem estoque mas não houve compra nos últimos 12 meses. Possível encalhe.'});
    }
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
      if(_diagIdxByC.has(cod)){
        // v4.66: usa nav stack pra mostrar botão "Voltar" se origem ≠ diagnostico
        if(typeof window._navOpenProd === 'function'){
          return window._navOpenProd(cod);
        }
        return _openProdNovo(cod);
      }
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
       + 'Retrato a pagar gerado em '+esc(fDt((meta.geradoEm||'').substring(0,10)))
       + '</div>';

  // KPIs · v4.76 fix31: grid 5-col (eram 5 KPIs em 6 colunas, deixava 1 vazia)
  html += '<div class="kg" style="grid-template-columns:repeat(5,1fr);margin-bottom:14px;" id="kg-fin-novo"></div>';

  // Gráficos removidos a pedido do usuário (Pagamentos por mês, Aging, Performance, Top grupos)

  // Títulos abertos: usado pelo calendário (10001) e por outros blocos
  const titulos = abr.titulos || [];
  const hoje = new Date();
  const hojeStr = hoje.toISOString().substring(0,10);
  const venc = titulos.filter(function(t){return t.data_venc && t.data_venc < hojeStr;});

  // v4.76 fix31: layout 5fr/4fr — calendário um pouco menor, tops com mais ar
  html += '<div style="display:grid;grid-template-columns:minmax(0,5fr) minmax(0,4fr);gap:14px;margin-bottom:14px;align-items:stretch;">'
       +   '<div class="cc" style="margin-bottom:0;">'
       +     '<div class="cch">'
       +       '<div><div class="cct">Calendário de pagamentos · COMPRA DE MERCADORIAS (10001)</div>'
       +         '<div class="ccs">Valor a pagar por dia · sáb/dom somam na seg · cor mais escura = maior valor</div></div>'
       +       '<div style="display:flex;align-items:center;gap:6px;">'
       +         '<button id="cal-pg-prev" type="button" style="padding:5px 10px;border:1px solid var(--border-strong);border-radius:6px;background:var(--surface);cursor:pointer;font-weight:700;">‹</button>'
       +         '<span id="cal-pg-label" style="font-size:12px;font-weight:700;min-width:96px;text-align:center;"></span>'
       +         '<button id="cal-pg-next" type="button" style="padding:5px 10px;border:1px solid var(--border-strong);border-radius:6px;background:var(--surface);cursor:pointer;font-weight:700;">›</button>'
       +         '<button id="cal-pg-hoje" type="button" style="padding:5px 10px;border:1px solid var(--border-strong);border-radius:6px;background:var(--surface);cursor:pointer;font-size:11px;font-weight:600;">Hoje</button>'
       +       '</div>'
       +     '</div>'
       +     '<div id="cal-pg-wrap" style="margin-top:10px;"></div>'
       +   '</div>'
       +   '<div class="cc" style="margin-bottom:0;display:flex;flex-direction:column;">'
       +     '<div class="cct">Top datas · valor a pagar</div>'
       +     '<div class="ccs">Calculado sobre o mês exibido no calendário</div>'
       +     '<div id="cal-pg-tops" style="margin-top:10px;flex:1;display:flex;flex-direction:column;gap:14px;"></div>'
       +   '</div>'
       + '</div>';

  // v4.69: Quadro 99912 + 99907 por mês em 2026
  html += '<div class="cc">'
       +   '<div class="cch"><div>'
       +     '<div class="cct">Multa e Juros (99912) + Encargos Conta Garantida (99907) · 2026</div>'
       +     '<div class="ccs" id="fin-mj-obs">Pago mensalmente por conta · totais ao final</div>'
       +   '</div>'
       +   _exportBtns('fin-multa-juros', 'Multa Juros e Encargos · 2026')
       +   '</div>'
       +   '<div id="fin-mj-wrap" style="margin-top:10px;"></div>'
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

  // KPIs (sem "Próximos 30 dias" — substituído pelo calendário diário)
  document.getElementById('kg-fin-novo').innerHTML = kgHtml([
    {l:'Pago no período',v:fK(resPago.total||0),s:fI(resPago.titulos||0)+' títulos · '+fI(resPago.fornecedores||0)+' fornecedores'},
    {l:'A pagar (aberto)',v:fK(resAbr.total_pagar||0),s:fI(resAbr.titulos||0)+' títulos · '+fI(resAbr.fornecedores||0)+' fornecedores'},
    {l:'Vencido hoje',v:fK(vencidoTotal),s:fI(vencidoTit)+' títulos · '+fP(pctVencido)+' do aberto · inclui hoje + atrasados',cls:vencidoTotal>0?'dn':''},
    {l:'A vencer',v:fK(aVencer),s:fI((aging.A_VENCER||{titulos:0}).titulos)+' títulos no futuro'},
    {l:'Juros pagos',v:fK(resPago.juros||0),s:fP((resPago.total>0?resPago.juros/resPago.total*100:0))+' do total · custo de atraso',cls:resPago.juros>50000?'wn':''},
  ]);

  // v4.69: Calendário pagamentos conta 10001
  _renderCalendarioPagamentos(titulos);

  // v4.69: Quadro 99912 + 99907 mensal 2026
  _renderQuadroMultaJuros();

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

}

// ════════════════════════════════════════════════════════════════════════
// v4.69: Calendário de pagamentos da conta 10001 (COMPRA DE MERCADORIAS)
// Mostra grid mensal com valor a vencer/atrasado por dia. Sábado/domingo
// são somados ao próximo dia útil (segunda-feira). Heatmap por intensidade
// de valor. Navegação por mês (← →) e botão "Hoje". Default: mês atual.
// ════════════════════════════════════════════════════════════════════════
let _calPagState = null;

function _renderCalendarioPagamentos(titulosAbertos){
  const wrap = document.getElementById('cal-pg-wrap');
  if(!wrap) return;
  // Estado: mês exibido (Date no dia 1). Persiste em window pra navegação.
  if(!_calPagState){
    const t = new Date();
    _calPagState = {ano: t.getFullYear(), mes: t.getMonth()};
  }

  // Filtra apenas títulos da conta 10001
  const tit10001 = (titulosAbertos || []).filter(function(t){
    return t && (String(t.conta) === '10001') && t.data_venc;
  });

  // Agrupa valor por dia (data_venc original)
  const porDiaRaw = Object.create(null);
  tit10001.forEach(function(t){
    if(!porDiaRaw[t.data_venc]) porDiaRaw[t.data_venc] = {valor:0, titulos:0};
    porDiaRaw[t.data_venc].valor   += t.valor || t.valor_dup || 0;
    porDiaRaw[t.data_venc].titulos += 1;
  });

  // Sábado (6) e domingo (0) somam no próximo dia útil (segunda)
  function _addDays(yyyymmdd, n){
    const d = new Date(yyyymmdd + 'T12:00:00');
    d.setDate(d.getDate() + n);
    return d.toISOString().substring(0,10);
  }
  function _proxDiaUtil(yyyymmdd){
    let s = yyyymmdd;
    let dow = new Date(s + 'T12:00:00').getDay();
    while(dow === 6 || dow === 0){
      s = _addDays(s, 1);
      dow = new Date(s + 'T12:00:00').getDay();
    }
    return s;
  }
  const porDia = Object.create(null);
  Object.keys(porDiaRaw).forEach(function(diaSrc){
    const destino = _proxDiaUtil(diaSrc);
    if(!porDia[destino]) porDia[destino] = {valor:0, titulos:0};
    porDia[destino].valor   += porDiaRaw[diaSrc].valor;
    porDia[destino].titulos += porDiaRaw[diaSrc].titulos;
  });

  function _draw(){
    const ano = _calPagState.ano, mes = _calPagState.mes;
    const primeiro = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes+1, 0).getDate();
    const nomes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const lbl = document.getElementById('cal-pg-label');
    if(lbl) lbl.textContent = nomes[mes]+'/'+String(ano).substring(2);

    // Valores do mês (pra escala de heatmap)
    const dias = [];
    let maxVal = 0, totalMes = 0;
    for(let d=1; d<=ultimoDia; d++){
      const key = ano+'-'+String(mes+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
      const v = porDia[key] || {valor:0, titulos:0};
      dias.push({d:d, key:key, valor:v.valor, titulos:v.titulos});
      if(v.valor > maxVal) maxVal = v.valor;
      totalMes += v.valor;
    }

    function _intensidade(v){
      if(!v || v <= 0 || maxVal <= 0) return 0;
      return Math.min(1, v / maxVal);
    }
    function _bg(v){
      const i = _intensidade(v);
      if(i === 0) return 'var(--surface-2)';
      // v4.73: gradiente azul claro → azul navy (cor _PAL.ac = #2E476F = 46,71,111)
      const alpha = 0.15 + i * 0.75;
      return 'rgba(46,71,111,'+alpha.toFixed(2)+')';
    }

    const diasSemanaLbl = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const hojeStr = (new Date()).toISOString().substring(0,10);

    let h = '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--text-muted);margin-bottom:6px;flex-wrap:wrap;gap:6px;">'
         +    '<span>Total no mês: <strong style="color:var(--text);">'+fB(totalMes,2)+'</strong></span>'
         +    '<span>Sáb/Dom somam na seg seguinte · azul mais escuro = dia com maior valor</span>'
         +  '</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';
    diasSemanaLbl.forEach(function(s){
      h += '<div style="text-align:center;font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;padding:4px 0;">'+s+'</div>';
    });
    // Padding inicial até o dia da semana do dia 1
    const padInicio = primeiro.getDay();
    for(let i=0; i<padInicio; i++){
      h += '<div></div>';
    }
    dias.forEach(function(d){
      const dt = new Date(ano, mes, d.d);
      const dow = dt.getDay();
      const ehFds = (dow === 6 || dow === 0);
      const ehHoje = (d.key === hojeStr);
      const bg = ehFds ? 'repeating-linear-gradient(45deg,var(--surface-2),var(--surface-2) 6px,rgba(0,0,0,.04) 6px,rgba(0,0,0,.04) 12px)' : _bg(d.valor);
      const borda = ehHoje ? '2px solid var(--accent)' : '1px solid var(--border)';
      // v4.73: texto branco quando fundo azul fica escuro
      const corTxt = d.valor > 0 && _intensidade(d.valor) > 0.45 ? '#fff' : 'var(--text)';
      // v4.76 fix31: células compactas com fAbbr (k/M) pra evitar overflow horizontal
      h += '<div title="'+esc(d.key)+(d.valor>0?(' · '+fB(d.valor,2)+' · '+fI(d.titulos)+' títulos'):' · sem títulos')+(ehFds?' · fim de semana':'')+'" '
         + 'style="aspect-ratio:1.4/1;min-height:54px;background:'+bg+';border:'+borda+';border-radius:5px;'
         + 'padding:4px 6px;display:flex;flex-direction:column;justify-content:space-between;'
         + 'font-size:11px;color:'+corTxt+';overflow:hidden;">'
         +   '<div style="font-weight:700;font-size:11.5px;line-height:1;">'+d.d+'</div>'
         +   (d.valor > 0 ? '<div style="font-size:12px;font-weight:800;line-height:1.1;text-align:right;white-space:nowrap;">'+fAbbr(d.valor)+'</div>' : (ehFds?'<div style="font-size:9.5px;color:var(--text-muted);">—</div>':''))
         + '</div>';
    });
    h += '</div>';
    wrap.innerHTML = h;

    // v4.76 fix23: renderiza painel Top datas (maior / menor valor) do mês exibido
    const tops = document.getElementById('cal-pg-tops');
    if(tops){
      const comValor = dias.filter(function(x){return x.valor > 0;});
      const top5Maior = comValor.slice().sort(function(a,b){return b.valor - a.valor;}).slice(0, 5);
      const top5Menor = comValor.slice().sort(function(a,b){return a.valor - b.valor;}).slice(0, 5);
      const _diaSemAbrev = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
      function _renderTopList(titulo, lista, corBarra){
        if(!lista.length){
          return '<div><div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:6px;">'+titulo+'</div>'
               + '<div style="font-size:11px;color:var(--text-muted);padding:6px 0;">— Sem títulos no mês —</div></div>';
        }
        const maxVal = lista[0].valor;
        let h2 = '<div><div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:6px;">'+titulo+'</div>';
        h2 += '<div style="display:flex;flex-direction:column;gap:4px;">';
        lista.forEach(function(d,i){
          const dt = new Date(ano, mes, d.d);
          const pct = maxVal>0 ? (d.valor/maxVal*100) : 0;
          h2 += '<div style="display:grid;grid-template-columns:18px 88px 1fr auto;gap:8px;align-items:center;font-size:12px;padding:3px 0;border-bottom:1px solid var(--border);">'
              +   '<div style="font-weight:700;color:var(--text-muted);">'+(i+1)+'</div>'
              +   '<div><strong>'+fDt(d.key)+'</strong><br><span style="font-size:10px;color:var(--text-muted);">'+_diaSemAbrev[dt.getDay()]+'</span></div>'
              +   '<div style="background:var(--surface-2);height:6px;border-radius:3px;overflow:hidden;"><div style="width:'+pct.toFixed(1)+'%;height:100%;background:'+corBarra+';"></div></div>'
              +   '<div style="font-weight:800;text-align:right;font-family:JetBrains Mono,monospace;font-size:12px;">'+fK(d.valor)+'</div>'
              + '</div>';
        });
        h2 += '</div></div>';
        return h2;
      }
      tops.innerHTML =
          _renderTopList('🔺 Maior valor a pagar (top 5)', top5Maior, _PAL.dn+'CC')
        + _renderTopList('🔻 Menor valor a pagar (top 5)', top5Menor, _PAL.ok+'CC');
    }
  }

  _draw();

  // Bind navegação (só uma vez por render — cont é refeito)
  const btnPrev = document.getElementById('cal-pg-prev');
  const btnNext = document.getElementById('cal-pg-next');
  const btnHoje = document.getElementById('cal-pg-hoje');
  if(btnPrev) btnPrev.onclick = function(){
    let m = _calPagState.mes - 1, y = _calPagState.ano;
    if(m < 0){ m = 11; y -= 1; }
    _calPagState.mes = m; _calPagState.ano = y;
    _draw();
  };
  if(btnNext) btnNext.onclick = function(){
    let m = _calPagState.mes + 1, y = _calPagState.ano;
    if(m > 11){ m = 0; y += 1; }
    _calPagState.mes = m; _calPagState.ano = y;
    _draw();
  };
  if(btnHoje) btnHoje.onclick = function(){
    const t = new Date();
    _calPagState.ano = t.getFullYear();
    _calPagState.mes = t.getMonth();
    _draw();
  };
}

// ════════════════════════════════════════════════════════════════════════
// v4.69: Quadro Multa/Juros (99912) + Encargos Conta Garantida (99907) 2026
// Meses como linhas, contas como colunas. Total na última coluna e linha.
//
// IMPORTANTE: o JSON financeiro atual não traz dados mensais por conta
// individual (só anuais em pagas.por_conta, e mensais só por grupo de 3 dígitos).
// Quando o ETL não tiver pagas.por_conta_mensal (ou pagas.titulos[]),
// renderizamos zerado com aviso. A doc ETL é INTEGRACAO_ETL_v4.69.md.
// ════════════════════════════════════════════════════════════════════════
function _renderQuadroMultaJuros(){
  const wrap = document.getElementById('fin-mj-wrap');
  if(!wrap || !F) return;

  const contas = [
    {cod:'99912', nome:'Multa e Juros'},
    {cod:'99907', nome:'Encargos Conta Garantida'}
  ];
  const meses = [];
  for(let m=1; m<=12; m++){
    meses.push('2026-'+(m<10?'0':'')+m);
  }

  // Tenta extrair valores mensais por conta de várias fontes possíveis:
  //  1. F.pagas.por_conta_mensal[] = [{ym, cod, pago, ...}]  (ideal · ETL futuro)
  //  2. F.pagas.titulos[]          = [{conta, data_pgto, valor}]  (ETL futuro)
  //  3. Senão: zerado + aviso
  let temDadoMensal = false;
  const matriz = {}; // matriz[cod][ym] = valor
  contas.forEach(function(c){ matriz[c.cod] = {}; meses.forEach(function(ym){ matriz[c.cod][ym]=0; }); });

  if(F.pagas && Array.isArray(F.pagas.por_conta_mensal)){
    F.pagas.por_conta_mensal.forEach(function(r){
      const cod = String(r.cod || r.conta_cod || r.conta || '');
      const ym = r.ym || '';
      if(!matriz[cod] || !ym || ym.substring(0,4) !== '2026') return;
      matriz[cod][ym] = (matriz[cod][ym] || 0) + (r.pago || r.valor || 0);
      temDadoMensal = true;
    });
  }
  if(!temDadoMensal && F.pagas && Array.isArray(F.pagas.titulos)){
    F.pagas.titulos.forEach(function(t){
      const cod = String(t.conta || t.conta_cod || '');
      const dt  = t.data_pgto || t.data_pagto || t.data_pag || '';
      if(!matriz[cod] || !dt || dt.substring(0,4) !== '2026') return;
      const ym = dt.substring(0,7);
      if(matriz[cod][ym] == null) return;
      matriz[cod][ym] = (matriz[cod][ym] || 0) + (t.valor || t.valor_dup || 0);
      temDadoMensal = true;
    });
  }

  // Header com aviso se ETL ainda não trouxe dado mensal
  const obs = document.getElementById('fin-mj-obs');
  if(obs){
    if(!temDadoMensal){
      obs.innerHTML = '<span style="color:#b45309;">Aguardando ETL · o JSON financeiro atual não traz quebra mensal por conta individual. Quadro renderiza zerado até o pipeline incluir <code>pagas.por_conta_mensal</code> ou <code>pagas.titulos[]</code>. Detalhes em <code>INTEGRACAO_ETL_v4.69.md</code>.</span>';
    } else {
      obs.textContent = 'Pago mensalmente por conta · totais ao final';
    }
  }

  // Render tabela
  const nomesMes = {'01':'Jan','02':'Fev','03':'Mar','04':'Abr','05':'Mai','06':'Jun','07':'Jul','08':'Ago','09':'Set','10':'Out','11':'Nov','12':'Dez'};
  let h = '<table class="t" style="font-size:12px;"><thead><tr>'
        + '<th class="L">Mês</th>';
  contas.forEach(function(c){
    h += '<th>'+esc(c.cod)+' — '+esc(c.nome)+'</th>';
  });
  h += '<th>Total</th></tr></thead><tbody>';

  const colTot = {}; contas.forEach(function(c){ colTot[c.cod] = 0; });
  let grandTotal = 0;

  meses.forEach(function(ym){
    const mLbl = nomesMes[ym.substring(5,7)]+'/26';
    let linhaTotal = 0;
    h += '<tr><td class="L"><strong>'+esc(mLbl)+'</strong></td>';
    contas.forEach(function(c){
      const v = matriz[c.cod][ym] || 0;
      colTot[c.cod] += v;
      linhaTotal += v;
      h += '<td>'+(v>0 ? fK(v) : '<span style="color:var(--text-muted);">—</span>')+'</td>';
    });
    grandTotal += linhaTotal;
    h += '<td class="val-strong">'+(linhaTotal>0 ? fK(linhaTotal) : '<span style="color:var(--text-muted);">—</span>')+'</td></tr>';
  });

  h += '<tr style="background:var(--surface-2);font-weight:700;border-top:2px solid var(--border-strong);">'
     + '<td class="L">Total</td>';
  contas.forEach(function(c){
    h += '<td class="val-strong">'+fK(colTot[c.cod])+'</td>';
  });
  h += '<td class="val-strong">'+fK(grandTotal)+'</td></tr>';
  h += '</tbody></table>';
  wrap.innerHTML = h;

  // Dataset pra export
  const exportRows = meses.map(function(ym){
    const mLbl = nomesMes[ym.substring(5,7)]+'/26';
    const row = [mLbl];
    let lt = 0;
    contas.forEach(function(c){
      const v = matriz[c.cod][ym] || 0;
      row.push(v);
      lt += v;
    });
    row.push(lt);
    return row;
  });
  const totalRow = ['Total'];
  contas.forEach(function(c){ totalRow.push(colTot[c.cod]); });
  totalRow.push(grandTotal);
  exportRows.push(totalRow);
  window._finExportDatasets = window._finExportDatasets || {};
  window._finExportDatasets['fin-multa-juros'] = {
    titulo: 'Multa Juros e Encargos · 2026',
    cols: ['Mês'].concat(contas.map(function(c){return c.cod+' '+c.nome;})).concat(['Total']),
    rows: exportRows,
    numericCols: [1,2,3]
  };
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

  // Bloqueio: cadastros de fornecedor de ATP e CP são distintos (mesmo nome,
  // códigos diferentes) — em GPC Consolidado o "Nestlé" pode aparecer como
  // 2 fornecedores e o sistema mostraria dados só de uma das bases.
  const sigAtual = (typeof _filialAtual !== 'undefined' && _filialAtual && _filialAtual.sigla)
    ? _filialAtual.sigla.toLowerCase() : 'grupo';
  const tipoAtual = (typeof _filialAtual !== 'undefined' && _filialAtual && _filialAtual.tipo)
    ? _filialAtual.tipo.toLowerCase() : null;
  const ehGpcConsolidado = (sigAtual === 'grupo') || (tipoAtual === 'raiz') || (tipoAtual === 'consolidado');
  if(ehGpcConsolidado){
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
  // v4.65: handler nomeado pra poder remover antes de re-adicionar
  // (evita acumular listeners no document a cada troca de base)
  if(typeof window._diagFornDocClick === 'function'){
    document.removeEventListener('click', window._diagFornDocClick);
  }
  window._diagFornDocClick = function(e){
    const drpRef = document.getElementById('forn-diag-drop');
    if(!drpRef) return;
    if(!e.target.closest('#forn-diag-srch') && !e.target.closest('#forn-diag-drop')){
      drpRef.classList.remove('show');
    }
  };
  document.addEventListener('click', window._diagFornDocClick);
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

  // ─── SEÇÃO: Financeiro do fornecedor (cabeçalho do extrato) ───
  // v4.66: header com Total Comprado · Já Pago · Em Aberto + barra de progresso
  const extDet = _diagFornExtratoDetalhado(cod);
  if(extDet.totalNFs > 0){
    const pctPagoBar = extDet.totalGeral > 0 ? (extDet.totalPagoGeral / extDet.totalGeral * 100) : 0;
    const pctAbertoBar = 100 - pctPagoBar;
    html += '<div class="ds" style="margin-top:14px;">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico" style="background:var(--success-bg);color:var(--success-text);">'
         +        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'
         +      '</div>'
         +      '<div><div class="ds-title">Financeiro do fornecedor</div>'
         +        '<div class="ds-sub">Status das duplicatas de todas as NFs</div></div>'
         +    '</div>'
         +    '<div class="ds-body" style="padding:14px;">'
         +      '<div class="fin-cards" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">'
         +        '<div class="fin-card" style="background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:14px;">'
         +          '<div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;">Total comprado (líq.)</div>'
         +          '<div class="fin-card-val" style="font-size:22px;font-weight:700;margin-top:6px;">'+fK(extDet.totalGeral)+'</div>'
         +        '</div>'
         +        '<div class="fin-card" style="background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:14px;">'
         +          '<div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;">Já pago</div>'
         +          '<div class="fin-card-val" style="font-size:22px;font-weight:700;margin-top:6px;color:#15803d;">'+fK(extDet.totalPagoGeral)+'</div>'
         +          '<div style="color:var(--text-muted);font-size:11px;margin-top:3px;">'+fP(pctPagoBar,1)+'</div>'
         +        '</div>'
         +        '<div class="fin-card" style="background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:14px;">'
         +          '<div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;">Em aberto</div>'
         +          '<div class="fin-card-val" style="font-size:22px;font-weight:700;margin-top:6px;color:#d97706;">'+fK(extDet.totalAbertoGeral)+'</div>'
         +          '<div style="color:var(--text-muted);font-size:11px;margin-top:3px;">'+fP(pctAbertoBar,1)+'</div>'
         +        '</div>'
         +      '</div>'
         +      '<div style="margin-top:14px;height:8px;background:#fed7aa;border-radius:4px;overflow:hidden;display:flex;">'
         +        '<div style="background:#15803d;width:'+pctPagoBar.toFixed(2)+'%;height:100%;"></div>'
         +      '</div>'
         +      '<div class="fin-legend" style="margin-top:6px;display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);">'
         +        '<span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#15803d;margin-right:5px;"></span>Pago: '+fP(pctPagoBar,1)+' ('+fK(extDet.totalPagoGeral)+')</span>'
         +        '<span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#d97706;margin-right:5px;"></span>Em aberto: '+fP(pctAbertoBar,1)+' ('+fK(extDet.totalAbertoGeral)+')</span>'
         +      '</div>'
         +    '</div>'
         + '</div>';

    // ─── EXTRATO detalhado por mês com NFs individuais ───
    html += '<div class="ds" style="margin-top:14px;">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg></div>'
         +      '<div><div class="ds-title">Extrato de compras</div>'
         +        '<div class="ds-sub">'+fI(extDet.totalNFs)+' NFs · '+fI(extDet.totalUn)+' un · '+fK(extDet.totalGeral)+' · clique no produto para ver diagnóstico</div></div>'
         +    '</div>'
         +    '<div class="ds-body" style="padding:0;">'
         +      '<div class="ext-wrap" style="max-height:600px;overflow-y:auto;">';

    extDet.meses.forEach(function(mes){
      const mesLabel = _ymToLabel(mes.ym);
      const anoFull = mes.ym.slice(0,4);
      const pctPagoMes = mes.totalValor > 0 ? (mes.totalPago / mes.totalValor * 100) : 0;
      // Header do mês
      html += '<div class="ext-mes-hdr" style="background:var(--surface-2);padding:10px 14px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;font-size:11.5px;position:sticky;top:0;z-index:1;">'
           +    '<div><strong style="font-size:13px;">'+esc(mesLabel.split('/')[0])+'</strong> <span style="color:var(--text-muted);">'+anoFull+'</span> '
           +      '<span class="kg-tag" style="margin-left:8px;font-size:10px;background:var(--success-bg);color:var(--success-text);border:1px solid #d1fae5;">'+fI(mes.nfs.length)+' NFs · '+fI(mes.totalQt)+' UN · '+fK(mes.totalValor)+'</span>'
           +    '</div>'
           +    '<div style="color:var(--text-muted);">'+fP(pctPagoMes,1)+' pago</div>'
           +  '</div>';
      // Linhas das NFs do mês
      mes.nfs.forEach(function(nf){
        const stMap = {
          'pago':         {cls:'ok', txt:'Pago'},
          'aberto':       {cls:'wn', txt:'Em aberto'},
          'parcial':      {cls:'wn', txt:'Parcial'},
          'desconhecido': {cls:'',   txt:'—'}
        };
        const stInfo = stMap[nf.status] || stMap['desconhecido'];
        const stCls = stInfo.cls;
        const stTxt = stInfo.txt;
        // Lista de produtos: até 3 visíveis + "+N produto(s)"
        const prodsMax = 3;
        const prodsVis = nf.produtos.slice(0, prodsMax);
        const prodsRest = nf.produtos.length - prodsMax;
        let prodsHtml = '';
        prodsVis.forEach(function(pp){
          prodsHtml += '<div style="font-size:11.5px;line-height:1.5;">'
                    +    '<span style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--text-muted);">#'+esc(pp.cod)+'</span> '
                    +    '<a href="javascript:void(0)" onclick="_navOpenProd('+pp.cod+', \'diag-forn\', '+cod+')" '
                    +       'style="color:inherit;text-decoration:none;border-bottom:1px dotted var(--border);cursor:pointer;" '
                    +       'title="Ver diagnóstico do produto">'
                    +      esc((pp.desc||'').substring(0,55))
                    +    '</a>'
                    +  '</div>';
        });
        if(prodsRest > 0){
          prodsHtml += '<div style="font-size:10.5px;color:var(--text-muted);margin-top:3px;cursor:pointer;" '
                    +   'onclick="_extToggleNfProds(this)" '
                    +   'data-cod="'+cod+'" data-nfkey="'+esc(nf.data+'_'+nf.nf)+'">'
                    +   '▶ +'+prodsRest+' produto'+(prodsRest>1?'s':'')+'</div>';
          // Lista escondida com os restantes
          prodsHtml += '<div class="ext-nf-rest" style="display:none;margin-top:4px;padding-left:12px;border-left:2px solid var(--border);">';
          nf.produtos.slice(prodsMax).forEach(function(pp){
            prodsHtml += '<div style="font-size:11px;line-height:1.5;color:var(--text-muted);">'
                      +    '<span style="font-family:JetBrains Mono,monospace;font-size:9.5px;">#'+esc(pp.cod)+'</span> '
                      +    '<a href="javascript:void(0)" onclick="_navOpenProd('+pp.cod+', \'diag-forn\', '+cod+')" '
                      +       'style="color:inherit;text-decoration:none;border-bottom:1px dotted var(--border);cursor:pointer;">'
                      +      esc((pp.desc||'').substring(0,55))
                      +    '</a>'
                      +  '</div>';
          });
          prodsHtml += '</div>';
        }

        const dataFmt = nf.data ? fDt(nf.data) : '—';
        html += '<div class="ext-nf-row" style="padding:10px 14px;border-bottom:1px solid var(--border);display:grid;grid-template-columns:70px 90px 1fr 110px 90px 80px 70px;gap:10px;align-items:start;font-size:11.5px;">'
             +    '<div><span class="kg-tag" style="font-size:10px;background:var(--surface-2);border:1px solid var(--border);">↓ NF</span></div>'
             +    '<div>'+esc(dataFmt)+'</div>'
             +    '<div>'+prodsHtml+'</div>'
             +    '<div style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--text-muted);text-align:right;">*'+esc(nf.nf||'-')+'</div>'
             +    '<div style="text-align:right;">'+fI(nf.qt)+' un</div>'
             +    '<div style="text-align:right;font-weight:600;">'+fK(nf.valor)+'</div>'
             +    '<div style="text-align:center;"><span class="kg-tag '+stCls+'" style="font-size:10px;">'+stTxt+'</span></div>'
             +  '</div>';
      });
    });

    html += '</div></div></div>';

    // v4.68: aviso se houver NFs ignoradas pra este fornecedor
    if(extDet.nfIgnoradas && extDet.nfIgnoradas.count > 0){
      html += '<div class="cc" style="margin-top:8px;background:#fef3c7;border:1px solid #f59e0b;">'
           +    '<div style="padding:10px 14px;color:#92400e;font-size:12px;display:flex;align-items:center;gap:10px;">'
           +      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
           +      '<div style="flex:1;"><strong>'+fI(extDet.nfIgnoradas.count)+' lançamentos de NF</strong> ('+fK(extDet.nfIgnoradas.valor)+') foram excluídos deste extrato por estarem marcados em NF Fechamento.</div>'
           +    '</div>'
           + '</div>';
    }

  } else if(typeof E === 'undefined' || !E || !E.produtos){
    html += '<div class="cc" style="margin-top:14px;background:#fef3c7;border:1px solid #d97706;">'
         +    '<div style="padding:14px;color:#92400e;font-size:12px;">'
         +      '<strong>Extrato de entradas não disponível.</strong> Dados de estoque/entradas não carregados.'
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

  // v4.66: bind clique no nome do produto (tabela SKUs e Itens em excesso) pra abrir
  // diagnóstico via _navOpenProd, empilhando a origem para o botão "Voltar".
  cont.querySelectorAll('[data-prod-cod]').forEach(function(td){
    td.style.cursor = 'pointer';
    td.addEventListener('click', function(){
      const pcod = parseInt(td.getAttribute('data-prod-cod'), 10);
      if(typeof window._navOpenProd === 'function'){
        window._navOpenProd(pcod, 'diag-forn', cod);
      } else if(typeof window._openProdNovo === 'function'){
        window._openProdNovo(pcod);
      }
    });
  });

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

// v4.66: Extrato DETALHADO com NF individual.
// Lê E.produtos[].entradas_detalhadas (que tem nf, data, qt, valor, status pago/aberto)
// e agrupa por NF (mesma nf+data+fornecedor_cod = uma NF) e depois por mês.
// Retorna: {meses: [{ym, totalValor, totalQt, totalSkus, nfs:[{nf,data,valor,qt,status,produtos:[...]}], totalPago, totalAberto}], totalGeral, totalPagoGeral, totalAbertoGeral}
function _diagFornExtratoDetalhado(fornCod){
  const result = {
    meses: [],
    totalGeral: 0, totalPagoGeral: 0, totalAbertoGeral: 0,
    totalNFs: 0, totalUn: 0
  };
  if(typeof E === 'undefined' || !E || !E.produtos) return result;

  // Junta todas as entradas_detalhadas do fornecedor, indexando por NF.
  // Chave da NF: data + nf + fornecedor_cod (mesma NF aparece em N produtos).
  // v4.68: aplica filtro de NFs ignoradas — exclui NFs que o usuário marcou
  // pra fechamento (mais um aviso no rodapé do extrato).
  const nfMap = new Map();
  const baseSlugCur = (typeof _getBaseSlug === 'function') ? _getBaseSlug() : 'atp';
  const filialCur = (_filialAtual && _filialAtual.sigla) || '';
  let _nfIgnExcluidasCount = 0;
  let _nfIgnExcluidasValor = 0;
  E.produtos.forEach(function(p){
    const eds = p.entradas_detalhadas || [];
    eds.forEach(function(ed){
      if(ed.fornecedor_cod !== fornCod) return;
      // Pula se a NF está marcada como ignorada
      if(typeof _isNfIgnorada === 'function' && _isNfIgnorada(baseSlugCur, filialCur, ed.nf, ed.fornecedor_cod, ed.data)){
        _nfIgnExcluidasCount++;
        _nfIgnExcluidasValor += ed.valor || 0;
        return;
      }
      const key = (ed.data||'') + '|' + (ed.nf||'') + '|' + ed.fornecedor_cod;
      if(!nfMap.has(key)){
        nfMap.set(key, {
          nf: ed.nf,
          data: ed.data,
          ym: (ed.data||'').slice(0,7),
          fornecedor: ed.fornecedor,
          status: ed.status,           // herdada do 1o item; vamos refinar
          valor: 0, qt: 0,
          valor_pago: 0, valor_aberto: 0,
          dt_pagto: ed.dt_pagto || null,
          produtos: []                  // [{cod, desc, depto, qt, valor, preco_unit}]
        });
      }
      const e = nfMap.get(key);
      e.valor += ed.valor || 0;
      e.qt += ed.qt || 0;
      // valor_pago / valor_aberto vêm DA NF (mesmo número repetido em cada item) —
      // NÃO somar, pegar apenas uma vez quando criamos a entrada da NF.
      // Como o map.set acima só ocorre na primeira ocorrência, e ali não setamos
      // esses campos, fazemos isso aqui pegando o maior valor (idempotente).
      if((ed.valor_pago || 0) > e.valor_pago) e.valor_pago = ed.valor_pago || 0;
      if((ed.valor_aberto || 0) > e.valor_aberto) e.valor_aberto = ed.valor_aberto || 0;
      if(ed.dt_pagto && !e.dt_pagto) e.dt_pagto = ed.dt_pagto;
      // Refina status: ordem de prioridade aberto > parcial > desconhecido > pago
      // (a NF como um todo é classificada pelo pior status entre seus itens)
      const sNew = ed.status;
      const sCur = e.status;
      const ord = {aberto:4, parcial:3, desconhecido:2, pago:1};
      if((ord[sNew]||0) > (ord[sCur]||0)) e.status = sNew;
      e.produtos.push({
        cod: p.cod,
        desc: p.desc || '',
        depto: (p.depto && p.depto.nome) || '',
        qt: ed.qt || 0,
        valor: ed.valor || 0,
        preco_unit: ed.preco_unit || 0
      });
    });
  });

  if(nfMap.size === 0) return result;

  // Agrupa NFs por mês.
  const mesMap = new Map();
  nfMap.forEach(function(nfData){
    const ym = nfData.ym;
    if(!ym) return;
    if(!mesMap.has(ym)){
      mesMap.set(ym, {
        ym: ym, nfs: [],
        totalValor: 0, totalQt: 0,
        totalPago: 0, totalAberto: 0,
        totalSkus: new Set()
      });
    }
    const m = mesMap.get(ym);
    m.nfs.push(nfData);
    m.totalValor += nfData.valor;
    m.totalQt += nfData.qt;
    m.totalPago += nfData.valor_pago;
    m.totalAberto += nfData.valor_aberto;
    nfData.produtos.forEach(function(pp){ m.totalSkus.add(pp.cod); });
    result.totalGeral += nfData.valor;
    result.totalPagoGeral += nfData.valor_pago;
    result.totalAbertoGeral += nfData.valor_aberto;
    result.totalUn += nfData.qt;
    result.totalNFs += 1;
  });

  // Ordena meses asc, NFs de cada mês por data asc
  result.meses = Array.from(mesMap.values()).map(function(m){
    m.nfs.sort(function(a,b){return (a.data||'').localeCompare(b.data||'');});
    m.totalSkusCount = m.totalSkus.size;
    delete m.totalSkus;
    return m;
  }).sort(function(a,b){return a.ym.localeCompare(b.ym);});

  // v4.68: estatística de NFs ignoradas
  result.nfIgnoradas = {
    count: _nfIgnExcluidasCount,
    valor: _nfIgnExcluidasValor
  };

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
// FORNECEDORES GPC NOVO · usa E + F.aberto · sub-etapa 4q · 30/abr/2026
// Filtra fornecedores intragrupo (lista configurável via getGpcSuppliers).
// Cruza compras+vendas (E) com a posição financeira (F.aberto.titulos).
// ════════════════════════════════════════════════════════════════════════
function renderFornGPCNovo(){
  const cont = document.getElementById('page-forn-gpc');
  if(!cont || !E) return;

  // v4.70: 2026-only via activePers (igual a Fornecedores)
  const ymsTodos = _fornYmsDisponiveis2026();
  if(ymsTodos.length === 0){
    var _spinnerSvg2 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="animation:dlSpin 1s linear infinite;"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>';
    cont.innerHTML = '<div class="ph"><div class="pk">Hierarquia · Intragrupo</div><h2><em>Fornecedores GPC</em> · Pinto Cerqueira</h2></div>'
                   + '<div class="ph-sep"></div><div class="page-body">'
                   + '<div class="cc">'+_emptyState('Carregando dados de 2026…','O cubo OLAP é carregado sob demanda. A página será preenchida automaticamente.', _spinnerSvg2)+'</div></div>';
    if(typeof _carregarCuboLazy === 'function'){
      _carregarCuboLazy().then(function(){
        if(typeof renderedPages !== 'undefined') renderedPages.delete('forn-gpc');
        renderFornGPCNovo();
      }).catch(function(){});
    }
    return;
  }
  const _activeSet = (typeof activePers !== 'undefined' && activePers && activePers.has)
    ? activePers
    : new Set(ymsTodos);
  const mesesAtivos = ymsTodos.filter(function(ym){return _activeSet.has(ym);});
  const mesesSet = new Set(mesesAtivos.length ? mesesAtivos : ymsTodos);
  const fornAggBase = _fornAgregarPorPeriodo(mesesSet);

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

  // v4.70: slot pra pfb padrão (mesma de Compras × Vendas)
  html += '<div id="fgpc-pfb-slot"></div>';

  // Banner
  html += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-dim);">'
       +   '<strong>'+fI(fornsGpc.length)+'</strong> fornecedores intragrupo encontrados (de '+fI(nomesGpc.length)+' configurados) · '
       +   '<strong>'+fI(tot.skus)+'</strong> SKUs cadastrados ('+fI(tot.skus_ativos)+' ativos) · '
       +   'Lista configurável em <strong>Administração</strong>'
       + '</div>';

  // KPIs
  html += '<div id="kg-fgpc-novo"></div>';

  // Chart histórico (Composição faturamento removida em v4.70)
  if(vpmYms.length > 0){
    html += '<div class="cc"><div class="cct">Histórico de vendas · agregado intragrupo</div>'
         +   '<div class="ccs">Soma de quantidade vendida de todos os SKUs Cerqueira</div>'
         +   '<div style="height:240px;margin-top:8px;"><canvas id="c-fgpc-hist"></canvas></div>'
         + '</div>';
  }

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

  // KPIs (v4.70: 2026-only)
  document.getElementById('kg-fgpc-novo').innerHTML = kgHtml([
    {l:'Faturamento', v:fK(tot.v_venda), s:fP(pctFat)+' do total da filial'},
    {l:'Margem', v:fP(margGpc), s:'Lucro '+fK(tot.lucro), cls:margGpc<5?'wn':margGpc>15?'ok':''},
    {l:'Compras 2026', v:fK(tot.v_compra), s:fP(pctCom)+' das compras da filial'},
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

  // v4.70: gráfico "Composição faturamento por fornecedor" removido

  // v4.70: injeta a pfb padrão (mesma de Compras × Vendas)
  if(typeof buildFilterBar === 'function'){
    const slot = document.getElementById('fgpc-pfb-slot');
    if(slot){
      slot.innerHTML = '';
      slot.appendChild(buildFilterBar('forn-gpc'));
    }
  }
}

function renderPage(pg){
  // Home oculta nesta versão — qualquer chamada cai em Visão Executiva
  if(pg === 'home') pg = 'executivo';
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
  else if(pg==='nf-fechamento')renderNfFechamento();
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
function renderHome(){}

// ================================================================
// VENDAS · CONFIG ESTRUTURAL (Etapa 4)

// ════════════════════════════════════════════════════════════════════════════
// v4.67-comercial: CSS responsivo do Extrato Detalhado e Cabeçalho Financeiro
// (Diag. Fornecedor). Injetado uma única vez no DOM. Como o HTML inline-style
// não cobre mobile, este CSS sobrescreve via @media queries.
// ════════════════════════════════════════════════════════════════════════════
(function(){
  if(document.getElementById('forn-extrato-mobile-css')) return;
  const st = document.createElement('style');
  st.id = 'forn-extrato-mobile-css';
  st.textContent = ''
    // Defaults (override de seleção/touch) — válido em todos os tamanhos
    + '.ext-nf-row a, .ext-nf-row [onclick]{-webkit-tap-highlight-color:rgba(245,134,52,.18);}'
    + '.ext-mes-hdr{position:sticky;top:0;z-index:1;}'
    // ════ Tablet (≤ 900px) ════
    + '@media(max-width:900px){'
    +   '.fin-cards{grid-template-columns:1fr 1fr !important;}'
    +   '.fin-cards .fin-card:first-child{grid-column:1 / -1 !important;}'
    +   '.fin-card-val{font-size:18px !important;}'
    +   '.ext-nf-row{grid-template-columns:60px 70px 1fr 80px 70px !important;}'
    +   '.ext-nf-row > div:nth-child(4){display:none !important;}' // NF número
    +   '.ext-nf-row > div:nth-child(6){display:none !important;}' // valor (vai pra mobile pill)
    + '}'
    // ════ Mobile (≤ 720px) — layout vertical empilhado ════
    + '@media(max-width:720px){'
    +   '.fin-cards{grid-template-columns:1fr !important;gap:8px !important;}'
    +   '.fin-cards .fin-card:first-child{grid-column:auto !important;}'
    +   '.fin-card{padding:10px !important;}'
    +   '.fin-card-val{font-size:17px !important;}'
    +   '.fin-legend{flex-direction:column !important;gap:4px !important;align-items:flex-start !important;}'
    // Extrato em mobile: vira "cartão por NF" empilhado
    +   '.ext-wrap{max-height:none !important;}'
    +   '.ext-nf-row{'
    +     'display:block !important;'
    +     'grid-template-columns:none !important;'
    +     'padding:10px 12px !important;'
    +     'position:relative;'
    +   '}'
    +   '.ext-nf-row > div{margin-bottom:4px;text-align:left !important;}'
    // Linha do topo do cartão (NF + data + valor) numa flex única
    +   '.ext-nf-row > div:nth-child(1){' // ↓ NF tag
    +     'display:inline-block;margin-right:8px;'
    +   '}'
    +   '.ext-nf-row > div:nth-child(2){' // data
    +     'display:inline-block;color:var(--text-muted);font-size:11px;'
    +   '}'
    +   '.ext-nf-row > div:nth-child(4){' // num NF
    +     'display:inline-block;float:right;margin-top:-26px;'
    +   '}'
    +   '.ext-nf-row > div:nth-child(3){' // produtos
    +     'margin:6px 0 4px 0 !important;'
    +   '}'
    +   '.ext-nf-row > div:nth-child(5){' // qtde
    +     'display:inline-block;margin-right:10px;font-size:11px;color:var(--text-muted);'
    +   '}'
    +   '.ext-nf-row > div:nth-child(6){' // valor
    +     'display:inline-block;font-size:13px !important;color:var(--text);'
    +   '}'
    +   '.ext-nf-row > div:nth-child(7){' // status
    +     'display:inline-block;float:right;'
    +   '}'
    +   '.ext-mes-hdr{padding:8px 12px !important;font-size:11px !important;}'
    +   '.ext-mes-hdr > div:first-child .kg-tag{display:block;margin:4px 0 0 0 !important;}'
    + '}'
    // ════ Mobile pequeno (≤ 380px) ════
    + '@media(max-width:380px){'
    +   '.fin-card-val{font-size:15px !important;}'
    +   '.ext-nf-row{padding:8px 10px !important;font-size:11px !important;}'
    + '}';
  document.head.appendChild(st);
})();

// ════════════════════════════════════════════════════════════════════════════
// v4.68-comercial: PÁGINA NF FECHAMENTO
// ════════════════════════════════════════════════════════════════════════════
// Permite que usuários admin/gestor marquem NFs específicas para serem
// IGNORADAS em todas as análises de compra (extrato, KPIs, gráficos, cubo).
// A marca é compartilhada via Firestore (canônico) com cache localStorage.
// ════════════════════════════════════════════════════════════════════════════

// Estado interno da página (filtros, lista, busca)
let _nfFechFiltros = {
  ymIni: '', ymFim: '',     // YYYY-MM
  filial: '',                // sigla
  forn_cod: '',              // cod ou '' (todos)
  busca_nf: '',              // texto livre no número da NF
  mostrar: 'todas'           // 'todas' | 'ignoradas' | 'ativas'
};

async function renderNfFechamento(){
  const cont = document.getElementById('page-nf-fechamento');
  if(!cont) return;

  // Verifica permissão
  if(!_podeMarcarNfs()){
    cont.innerHTML = ''
      + '<div class="page-head"><h1>NF Fechamento</h1></div>'
      + '<div class="cc" style="margin-top:14px;background:#fef3c7;border:1px solid #d97706;">'
      +   '<div style="padding:18px;color:#92400e;font-size:13px;">'
      +     '<strong>Acesso restrito.</strong> Esta página é destinada a usuários com perfil Admin ou Gestor.'
      +   '</div>'
      + '</div>';
    return;
  }

  // Loading state
  cont.innerHTML = '<div class="page-head"><h1>NF Fechamento</h1><div class="desc">Carregando dados…</div></div>';

  // Garante NFs ignoradas carregadas
  await _carregarNfsIgnoradas();

  // Verifica fonte de dados
  if(typeof E === 'undefined' || !E || !E.produtos){
    cont.innerHTML = ''
      + '<div class="page-head"><h1>NF Fechamento</h1></div>'
      + '<div class="cc" style="margin-top:14px;background:#fef3c7;border:1px solid #d97706;">'
      +   '<div style="padding:18px;color:#92400e;font-size:13px;">'
      +     '<strong>Dados de estoque não carregados.</strong> Esta página depende das entradas detalhadas (E.produtos[].entradas_detalhadas). Aguarde o carregamento ou troque de base.'
      +   '</div>'
      + '</div>';
    return;
  }

  // Setup inicial dos filtros: período = últimos 4 meses
  if(!_nfFechFiltros.ymIni){
    const ymsDisp = _nfFechColetarYms();
    if(ymsDisp.length){
      _nfFechFiltros.ymFim = ymsDisp[ymsDisp.length - 1];
      _nfFechFiltros.ymIni = ymsDisp[Math.max(0, ymsDisp.length - 4)];
    }
  }
  if(!_nfFechFiltros.filial){
    _nfFechFiltros.filial = (_filialAtual && _filialAtual.sigla) || '';
  }

  _nfFechRender();
}

function _nfFechColetarYms(){
  // Lista todos os YMs presentes nas entradas_detalhadas dos produtos
  const set = new Set();
  E.produtos.forEach(function(p){
    (p.entradas_detalhadas || []).forEach(function(ed){
      if(ed.data) set.add(ed.data.slice(0,7));
    });
  });
  return Array.from(set).sort();
}

function _nfFechColetarFornecedores(){
  // Retorna [{cod, nome}] dos fornecedores presentes nas entradas, ordenados por nome
  const map = new Map();
  E.produtos.forEach(function(p){
    (p.entradas_detalhadas || []).forEach(function(ed){
      if(ed.fornecedor_cod && !map.has(ed.fornecedor_cod)){
        map.set(ed.fornecedor_cod, ed.fornecedor || ('#'+ed.fornecedor_cod));
      }
    });
  });
  return Array.from(map.entries()).map(function(e){
    return {cod: e[0], nome: e[1]};
  }).sort(function(a,b){return (a.nome||'').localeCompare(b.nome||'');});
}

function _nfFechAgregarNFs(){
  // Aplica filtros e retorna lista de NFs únicas com produtos agregados.
  // Mesma chave usada no Diag. Fornecedor: data + nf + forn_cod.
  const nfMap = new Map();
  const f = _nfFechFiltros;
  const baseSlug = (typeof _getBaseSlug === 'function') ? _getBaseSlug() : 'atp';
  const filialSig = f.filial || (_filialAtual && _filialAtual.sigla) || '';

  E.produtos.forEach(function(p){
    (p.entradas_detalhadas || []).forEach(function(ed){
      const ym = (ed.data || '').slice(0,7);
      if(f.ymIni && ym < f.ymIni) return;
      if(f.ymFim && ym > f.ymFim) return;
      if(f.forn_cod && String(ed.fornecedor_cod) !== String(f.forn_cod)) return;
      if(f.busca_nf){
        const q = f.busca_nf.toLowerCase();
        if(String(ed.nf || '').toLowerCase().indexOf(q) === -1) return;
      }
      const key = _mkNfKey(baseSlug, filialSig, ed.nf, ed.fornecedor_cod, ed.data);
      if(!nfMap.has(key)){
        nfMap.set(key, {
          key: key,
          base: baseSlug,
          filial: filialSig,
          num_nota: ed.nf,
          forn_cod: ed.fornecedor_cod,
          forn_nome: ed.fornecedor,
          data: ed.data,
          ym: ym,
          valor: 0,
          qt: 0,
          status: ed.status,
          produtos: []
        });
      }
      const n = nfMap.get(key);
      n.valor += ed.valor || 0;
      n.qt += ed.qt || 0;
      if(ed.status === 'aberto') n.status = 'aberto';
      n.produtos.push({cod: p.cod, desc: p.desc || '', qt: ed.qt || 0, valor: ed.valor || 0});
    });
  });

  let lista = Array.from(nfMap.values());

  // Filtro mostrar
  if(f.mostrar === 'ignoradas'){
    lista = lista.filter(function(n){ return _nfsIgnCache && _nfsIgnCache.nfs && _nfsIgnCache.nfs[n.key]; });
  } else if(f.mostrar === 'ativas'){
    lista = lista.filter(function(n){ return !(_nfsIgnCache && _nfsIgnCache.nfs && _nfsIgnCache.nfs[n.key]); });
  }

  // Ordena por data desc
  lista.sort(function(a,b){return (b.data||'').localeCompare(a.data||'');});
  return lista;
}

function _nfFechRender(){
  const cont = document.getElementById('page-nf-fechamento');
  if(!cont) return;

  const ymsDisp = _nfFechColetarYms();
  const fornecedores = _nfFechColetarFornecedores();
  const lista = _nfFechAgregarNFs();
  const f = _nfFechFiltros;

  // Totais (na lista filtrada)
  let totIgn = 0, totAtv = 0, valIgn = 0, valAtv = 0;
  lista.forEach(function(n){
    const ign = _nfsIgnCache && _nfsIgnCache.nfs && _nfsIgnCache.nfs[n.key];
    if(ign){ totIgn++; valIgn += n.valor; }
    else { totAtv++; valAtv += n.valor; }
  });
  const totalNfs = lista.length;
  const totalIgnGeral = _nfsIgnCache && _nfsIgnCache.nfs ? Object.keys(_nfsIgnCache.nfs).length : 0;

  // Limita lista exibida pra não travar (paginação simples)
  const MAX_EXIBIR = 500;
  const listaExib = lista.slice(0, MAX_EXIBIR);
  const truncada = lista.length > MAX_EXIBIR;

  let html = ''
    + '<div class="page-head">'
    +   '<h1>NF Fechamento</h1>'
    +   '<div class="desc">Marque NFs de entrada para serem ignoradas nas análises de compra. Filtre por período, filial, fornecedor ou número de NF. As marcações ficam visíveis no extrato detalhado do Diag. Fornecedor imediatamente; para os KPIs agregados, cubo e demais análises, o efeito é aplicado no próximo processamento ETL (que lê a lista de NFs ignoradas e as exclui durante a agregação). Marcações são compartilhadas com todos os usuários.</div>'
    + '</div>'

    // Filtros
    + '<div class="cc" style="margin-top:14px;">'
    +   '<div class="cct">Filtros</div>'
    +   '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:10px;font-size:12px;" class="nff-filt-grid">';

  // YM ini/fim
  html += '<div><label style="display:block;color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;font-weight:700;">Período (início)</label>'
       +   '<select id="nff-ymi" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);font-size:12px;">';
  ymsDisp.forEach(function(y){
    html += '<option value="'+esc(y)+'"'+(f.ymIni===y?' selected':'')+'>'+esc(_ymToLabel(y))+'</option>';
  });
  html += '</select></div>';

  html += '<div><label style="display:block;color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;font-weight:700;">Período (fim)</label>'
       +   '<select id="nff-ymf" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);font-size:12px;">';
  ymsDisp.forEach(function(y){
    html += '<option value="'+esc(y)+'"'+(f.ymFim===y?' selected':'')+'>'+esc(_ymToLabel(y))+'</option>';
  });
  html += '</select></div>';

  // Filial (somente leitura — segue base atual)
  html += '<div><label style="display:block;color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;font-weight:700;">Filial</label>'
       +   '<input value="'+esc(f.filial || '(consolidado)')+'" disabled style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;background:var(--surface-2);font-size:12px;color:var(--text-muted);"></div>';

  // Fornecedor
  html += '<div><label style="display:block;color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;font-weight:700;">Fornecedor</label>'
       +   '<select id="nff-forn" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);font-size:12px;">'
       +     '<option value="">— Todos —</option>';
  fornecedores.forEach(function(fr){
    html += '<option value="'+esc(fr.cod)+'"'+(String(f.forn_cod)===String(fr.cod)?' selected':'')+'>'+esc(fr.nome)+'</option>';
  });
  html += '</select></div>';

  // Mostrar
  html += '<div><label style="display:block;color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;font-weight:700;">Mostrar</label>'
       +   '<select id="nff-show" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);font-size:12px;">'
       +     '<option value="todas"'+(f.mostrar==='todas'?' selected':'')+'>Todas</option>'
       +     '<option value="ativas"'+(f.mostrar==='ativas'?' selected':'')+'>Apenas ativas</option>'
       +     '<option value="ignoradas"'+(f.mostrar==='ignoradas'?' selected':'')+'>Apenas ignoradas</option>'
       +   '</select></div>';
  html += '</div>'; // fecha grid

  // Busca + KPIs resumidos
  html += '<div style="margin-top:10px;display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end;" class="nff-second-row">'
       +   '<div><label style="display:block;color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;font-weight:700;">Buscar número da NF</label>'
       +     '<input id="nff-busca" value="'+esc(f.busca_nf||'')+'" placeholder="Ex: 4836230" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);font-size:12px;">'
       +   '</div>'
       +   '<div style="display:flex;gap:8px;">'
       +     '<button id="nff-aplicar" class="ebtn" style="background:var(--accent);color:white;border:none;padding:8px 14px;font-size:12px;font-weight:600;border-radius:4px;cursor:pointer;">Aplicar filtros</button>'
       +     '<button id="nff-limpar" class="ebtn" style="background:var(--surface-2);border:1px solid var(--border);padding:8px 14px;font-size:12px;border-radius:4px;cursor:pointer;">Limpar</button>'
       +   '</div>'
       + '</div>';
  html += '</div>'; // fecha cc

  // KPIs resumo
  html += '<div style="margin-top:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;" class="nff-kpis">'
       +   '<div class="fin-card" style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:14px;">'
       +     '<div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;">NFs na seleção</div>'
       +     '<div class="fin-card-val" style="font-size:22px;font-weight:700;margin-top:6px;">'+fI(totalNfs)+'</div>'
       +     (truncada ? '<div style="color:var(--text-muted);font-size:10.5px;margin-top:3px;">Exibindo '+MAX_EXIBIR+' · refine filtros</div>' : '')
       +   '</div>'
       +   '<div class="fin-card" style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:14px;">'
       +     '<div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;">Ativas (entram nas análises)</div>'
       +     '<div class="fin-card-val" style="font-size:22px;font-weight:700;margin-top:6px;color:#15803d;">'+fI(totAtv)+'</div>'
       +     '<div style="color:var(--text-muted);font-size:10.5px;margin-top:3px;">'+fK(valAtv)+'</div>'
       +   '</div>'
       +   '<div class="fin-card" style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:14px;">'
       +     '<div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;">Ignoradas (excluídas das análises)</div>'
       +     '<div class="fin-card-val" style="font-size:22px;font-weight:700;margin-top:6px;color:#d97706;">'+fI(totIgn)+'</div>'
       +     '<div style="color:var(--text-muted);font-size:10.5px;margin-top:3px;">'+fK(valIgn)+'</div>'
       +   '</div>'
       +   '<div class="fin-card" style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:14px;">'
       +     '<div style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;">Total ignorado (sistema)</div>'
       +     '<div class="fin-card-val" style="font-size:22px;font-weight:700;margin-top:6px;">'+fI(totalIgnGeral)+'</div>'
       +     '<div style="color:var(--text-muted);font-size:10.5px;margin-top:3px;">NFs marcadas em todas as bases</div>'
       +   '</div>'
       + '</div>';

  // Tabela
  if(!listaExib.length){
    html += '<div class="cc" style="margin-top:14px;">'
         +   _emptyState('Nenhuma NF encontrada','Tente limpar ou ajustar os filtros aplicados no cabeçalho.')
         + '</div>';
  } else {
    html += '<div class="ds" style="margin-top:14px;">'
         +    '<div class="ds-hdr">'
         +      '<div class="ds-ico"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>'
         +      '<div><div class="ds-title">NFs no período</div><div class="ds-sub">Marque a coluna "Ignorar" para excluir uma NF das análises. Clique nela para expandir os produtos.</div></div>'
         +    '</div>'
         +    '<div class="ds-body" style="padding:0;">'
         +      '<div class="tscroll" style="max-height:600px;overflow-y:auto;">'
         +      '<table class="t nff-tbl"><thead><tr>'
         +        '<th class="L" style="width:38px;">Ign.</th>'
         +        '<th class="L">Data</th>'
         +        '<th class="L">Nº NF</th>'
         +        '<th class="L">Fornecedor</th>'
         +        '<th>Qtde</th>'
         +        '<th>Valor</th>'
         +        '<th class="L">Status</th>'
         +        '<th class="L">Motivo</th>'
         +        '<th class="L">Marcado por</th>'
         +      '</tr></thead><tbody>';

    listaExib.forEach(function(n){
      const ign = (_nfsIgnCache && _nfsIgnCache.nfs && _nfsIgnCache.nfs[n.key]) || null;
      const dataFmt = n.data ? fDt(n.data) : '—';
      const stMap = {pago:{cls:'ok',txt:'Pago'},aberto:{cls:'wn',txt:'Em aberto'},parcial:{cls:'wn',txt:'Parcial'},desconhecido:{cls:'',txt:'—'}};
      const stInfo = stMap[n.status] || stMap['desconhecido'];

      html += '<tr class="nff-row'+(ign?' nff-row-ign':'')+'" data-key="'+esc(n.key)+'" style="'+(ign?'background:#fef3c7;':'')+'">'
           +    '<td class="L"><input type="checkbox" class="nff-chk" data-key="'+esc(n.key)+'"'+(ign?' checked':'')+' style="cursor:pointer;width:18px;height:18px;"></td>'
           +    '<td class="L">'+esc(dataFmt)+'</td>'
           +    '<td class="L"><span style="font-family:JetBrains Mono,monospace;font-size:11px;">'+esc(n.num_nota||'-')+'</span></td>'
           +    '<td class="L"><span style="font-size:11.5px;">'+esc((n.forn_nome||'#'+n.forn_cod).substring(0,40))+'</span><div style="font-size:10px;color:var(--text-muted);">#'+esc(n.forn_cod||'')+' · '+fI(n.produtos.length)+' SKUs</div></td>'
           +    '<td>'+fI(n.qt)+' un</td>'
           +    '<td style="font-weight:600;">'+fK(n.valor)+'</td>'
           +    '<td class="L"><span class="kg-tag '+stInfo.cls+'" style="font-size:10px;">'+stInfo.txt+'</span></td>'
           +    '<td class="L"><input type="text" class="nff-motivo" data-key="'+esc(n.key)+'" value="'+esc((ign && ign.motivo)||'')+'" placeholder="opcional" style="width:140px;padding:4px 6px;border:1px solid var(--border);border-radius:3px;font-size:11px;background:var(--surface);"></td>'
           +    '<td class="L" style="font-size:10.5px;color:var(--text-muted);">'+(ign?esc(ign.marcado_por_email||ign.marcado_por_nome||'')+'<br><span style="font-size:9.5px;">'+esc(fDt((ign.marcado_em||'').substring(0,10)))+'</span>':'-')+'</td>'
           +  '</tr>';
    });

    html += '</tbody></table>'
         + '</div>'  // fecha tscroll
         + '</div>'  // fecha ds-body
         + '</div>'; // fecha ds
  }

  cont.innerHTML = html;
  _nfFechBindHandlers();
}

function _nfFechBindHandlers(){
  const cont = document.getElementById('page-nf-fechamento');
  if(!cont) return;

  // Filtros
  const btnApl = cont.querySelector('#nff-aplicar');
  if(btnApl){
    btnApl.onclick = function(){
      _nfFechFiltros.ymIni = (cont.querySelector('#nff-ymi') || {}).value || '';
      _nfFechFiltros.ymFim = (cont.querySelector('#nff-ymf') || {}).value || '';
      _nfFechFiltros.forn_cod = (cont.querySelector('#nff-forn') || {}).value || '';
      _nfFechFiltros.busca_nf = (cont.querySelector('#nff-busca') || {}).value || '';
      _nfFechFiltros.mostrar = (cont.querySelector('#nff-show') || {}).value || 'todas';
      _nfFechRender();
    };
  }
  const btnLim = cont.querySelector('#nff-limpar');
  if(btnLim){
    btnLim.onclick = function(){
      const yms = _nfFechColetarYms();
      _nfFechFiltros = {
        ymIni: yms[Math.max(0, yms.length - 4)] || '',
        ymFim: yms[yms.length - 1] || '',
        filial: _nfFechFiltros.filial,
        forn_cod: '', busca_nf: '', mostrar: 'todas'
      };
      _nfFechRender();
    };
  }

  // Enter no campo de busca = aplicar
  const inpBusca = cont.querySelector('#nff-busca');
  if(inpBusca){
    inpBusca.onkeydown = function(e){
      if(e.key === 'Enter'){ if(btnApl) btnApl.click(); }
    };
  }

  // Checkboxes
  cont.querySelectorAll('.nff-chk').forEach(function(chk){
    chk.onchange = async function(){
      const key = chk.getAttribute('data-key');
      const tr = chk.closest('tr');
      const motivoInp = cont.querySelector('.nff-motivo[data-key="'+key+'"]');
      const motivo = motivoInp ? motivoInp.value : '';

      // Coleta payload a partir do estado atual
      const lista = _nfFechAgregarNFs();
      const nf = lista.find(function(n){return n.key === key;});
      if(!nf){
        console.warn('[nff] NF não encontrada para chave', key);
        chk.checked = !chk.checked;
        return;
      }

      chk.disabled = true;
      try {
        if(chk.checked){
          const r = await _marcarNfIgnorada({
            base: nf.base, filial: nf.filial, num_nota: nf.num_nota,
            forn_cod: nf.forn_cod, forn_nome: nf.forn_nome,
            data: nf.data, valor: nf.valor, motivo: motivo
          });
          if(!r.ok){
            alert('Falha ao marcar NF: ' + (r.erro || 'erro desconhecido'));
            chk.checked = false;
            return;
          }
        } else {
          const r = await _desmarcarNfIgnorada(nf.base, nf.filial, nf.num_nota, nf.forn_cod, nf.data);
          if(!r.ok){
            alert('Falha ao desmarcar NF: ' + (r.erro || 'erro desconhecido'));
            chk.checked = true;
            return;
          }
        }
        // Re-render mais leve: só atualiza a linha
        _nfFechRender();
      } finally {
        chk.disabled = false;
      }
    };
  });

  // Inputs de motivo: salva ao perder foco se a NF está marcada
  cont.querySelectorAll('.nff-motivo').forEach(function(inp){
    inp.onblur = async function(){
      const key = inp.getAttribute('data-key');
      const chk = cont.querySelector('.nff-chk[data-key="'+key+'"]');
      if(!chk || !chk.checked) return; // só salva motivo se NF está ignorada
      const novoMotivo = inp.value;
      if(_nfsIgnCache && _nfsIgnCache.nfs && _nfsIgnCache.nfs[key]){
        if(_nfsIgnCache.nfs[key].motivo === novoMotivo) return; // sem mudança
        // Re-marca pra atualizar motivo
        const nf = _nfsIgnCache.nfs[key];
        await _marcarNfIgnorada({
          base: nf.base, filial: nf.filial, num_nota: nf.num_nota,
          forn_cod: nf.forn_cod, forn_nome: nf.forn_nome,
          data: nf.data, valor: nf.valor, motivo: novoMotivo
        });
      }
    };
  });
}

// CSS responsivo da página NF Fechamento
(function(){
  if(document.getElementById('nff-css')) return;
  const st = document.createElement('style');
  st.id = 'nff-css';
  st.textContent = ''
    + '.nff-row-ign td{color:#92400e;}'
    + '.nff-row:hover{background:var(--surface-2) !important;}'
    + '.nff-row-ign:hover{background:#fde68a !important;}'
    // Tablet
    + '@media(max-width:900px){'
    +   '.nff-filt-grid{grid-template-columns:repeat(2,1fr) !important;}'
    +   '.nff-kpis{grid-template-columns:repeat(2,1fr) !important;}'
    + '}'
    // Mobile
    + '@media(max-width:720px){'
    +   '.nff-filt-grid{grid-template-columns:1fr !important;}'
    +   '.nff-kpis{grid-template-columns:1fr !important;}'
    +   '.nff-second-row{grid-template-columns:1fr !important;}'
    +   '.nff-tbl th:nth-child(7),.nff-tbl td:nth-child(7),'  // status
    +     '.nff-tbl th:nth-child(9),.nff-tbl td:nth-child(9){display:none;}' // marcado por
    + '}';
  document.head.appendChild(st);
})();
