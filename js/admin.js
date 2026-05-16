// ════════════════════════════════════════════════════════════════════════════
// GPC Comercial · admin.js
// ════════════════════════════════════════════════════════════════════════════
// Gerado pela divisão do index.html em v4.6 (etapa #3 da auditoria)
// Carregado via <script src="js/admin.js"> no index.html
// IMPORTANTE: ordem de carregamento importa — ver comentário no index.html
// ════════════════════════════════════════════════════════════════════════════

// ================================================================
let deptMode='dept',deptFilter=null,secFilter=null;

// Histórico de navegação para botão "Voltar" nas páginas de Raio-X
let navHistory = [];
window.goBack = function(){
  if(navHistory.length===0) return;
  const pg = navHistory.pop();
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-'+pg).classList.add('active');
  document.querySelectorAll('.sb-link').forEach(x=>x.classList.remove('active'));
  const sbLink = document.querySelector('.sb-link[data-p="'+pg+'"]');
  if(sbLink) sbLink.classList.add('active');
  if(typeof _expandirGrupoDaPaginaAtiva==='function') _expandirGrupoDaPaginaAtiva();
  if(!renderedPages.has(pg)){renderPage(pg);renderedPages.add(pg);}
  // Esconder o botão se histórico vazio
  updateBackBtn();
};
function updateBackBtn(){
  document.querySelectorAll('.back-btn-wrap').forEach(el=>{
    el.style.display = navHistory.length>0 ? 'block' : 'none';
  });
}
function pushNav(){
  const active = document.querySelector('.page.active');
  if(active){
    const pg = active.id.replace('page-','');
    // Só empilha se for uma página "normal" (não Raio-X)
    if(pg!=='diagnostico' && pg!=='diag-forn'){
      navHistory.push(pg);
    }
  }
}
// [legado] renderDeptos removido em v4.2 — substituído por renderDeptosNovo


// Agregar dados por categoria (3º nível: dept > secao > categoria)
function aggregateCategorias(dept, sec){
  const prods = D.produtos.filter(function(p){ return p.dp===dept && p.sc===sec; });
  const catMap = {};
  prods.forEach(function(p){
    const ct = p.ct || 'SEM CATEGORIA';
    if(!catMap[ct]) catMap[ct]={n:ct,vdo:0,luc:0,com:0,pag:0,abr:0,dvf:0,jr:0,eq:0,ev:0,ni:0,nip:0,dvc:0,tl:0};
    const c=catMap[ct];
    c.vdo+=(p.tv||0); c.luc+=(p.tl||0); c.tl+=(p.tl||0);
    c.com+=(p.vc||0); c.pag+=(p.fp||0); c.abr+=(p.fa||0);
    c.dvf+=(p.vdf||0); c.jr+=(p.jr||0);
    c.eq+=(p.eq||0); c.ev+=(p.ev||0); c.ni+=1;
    if((p.tl||0)<0) c.nip+=1;
    c.dvc+=(p.sv||[]).reduce(function(s,sv){return s+(sv[2]||0);},0);
  });
  const cats=Object.values(catMap);
  cats.forEach(function(c){
    c.marg=c.vdo>0?c.luc/c.vdo*100:0;
    c.pp=c.com>0?c.pag/c.com*100:0;
    c.ns=0; c.nf=0;
  });
  return cats.sort(function(a,b){return b.vdo-a.vdo;});
}

// [legado] renderDeptTable removido em v4.2 — substituído por renderDeptosNovo

// Listener do botão "voltar" do drilldown legado (template HTML em page-deptos).
// Como renderDeptos/renderDeptTable foram removidas em v4.2, o caminho legado
// não funciona mais — quando E está carregado, renderDeptosNovo sobrescreve o
// template antes do user ver. Mas mantemos o listener defensivo:
const _btnDeptBack = document.getElementById('dept-bc-back');
if(_btnDeptBack){
  _btnDeptBack.addEventListener('click', function(){
    // Tenta usar renderDeptosNovo; se não existir, ignora silenciosamente
    if(typeof renderDeptosNovo === 'function'){
      // Reset do estado de drilldown e re-render
      try { secFilter = null; deptFilter = null; } catch(e){}
      renderDeptosNovo();
    }
  });
}

// ================================================================
// ESTOQUE
// ================================================================
// [legado] renderEstoque removido em v4.2 — substituído por renderEstoqueNovo

// ================================================================
// FINANCEIRO
// ================================================================
// [legado] renderFinanceiro removido em v4.2 — substituído por renderFinanceiroNovo

// [legado] renderJrFornTable removido em v4.2 — substituído pelo render Novo do Financeiro
// Stub silencioso: se o template HTML estático ainda for visível antes de F carregar,
// o onchange do select não derruba a página
function renderJrFornTable(_mesFiltro){
  // noop — renderFinanceiroNovo reescreve o HTML completamente quando F carrega
}
window.renderJrFornTable = renderJrFornTable;


// ================================================================
// FORNECEDORES
// ================================================================
// Em modo modular D é null no boot — `D && D.fornecedores` evita
// abortar admin.js (que travaria a inicialização de GPC_DEFAULTS).
let allForn = (typeof D !== 'undefined' && D && D.fornecedores) ? D.fornecedores : [];
// [legado] renderFornecedores removido em v4.2 — substituído por renderFornecedoresNovo

// [legado] renderFornTable removido em v4.2 — substituído por renderFornTableNovo

// ================================================================
// ALERTAS
// ================================================================
// [legado] renderAlertas removido em v4.2 — substituído por renderAlertasNovo

// ================================================================
// DIAGNÓSTICO — BUSCA INTELIGENTE (item 3)
// ================================================================
// diagChart eliminada — agora os 3 charts do diagnóstico passam por mkC() (autocleanup via CH[])
function initDiag(){}

const srchInp=document.getElementById('prod-srch');
const srchDrp=document.getElementById('srch-drop');
let srchTmr=null;

// Defesa: se o elemento de busca não existir no DOM no momento do load
// (ex: HTML modificado, diagnóstico desabilitado), pula os addEventListener
// pra não abortar a execução de admin.js (o que travaria toda a Administração
// por causa do TDZ no const GPC_DEFAULTS abaixo).
if(srchInp){
  srchInp.addEventListener('input',()=>{clearTimeout(srchTmr);srchTmr=setTimeout(()=>doSearch(srchInp.value),120);});
  srchInp.addEventListener('keydown',e=>{if(e.key==='Escape'){if(srchDrp) srchDrp.classList.remove('show'); srchInp.blur();}});
}
if(srchDrp){
  document.addEventListener('click',e=>{
    if(!e.target.closest('#prod-srch')&&!e.target.closest('#srch-drop'))srchDrp.classList.remove('show');
  });
}

// Item 3: busca por múltiplos tokens
function doSearch(q){
  q=(q||'').trim();
  if(q.length<2){srchDrp.classList.remove('show');return;}

  const tokens=q.toLowerCase().split(/\s+/).filter(t=>t.length>0);
  const qNum=tokens.length===1&&!isNaN(q.trim())?parseInt(q.trim()):null;

  const found=D.produtos.filter(p=>{
    // Busca exata por código
    if(qNum!==null&&p.c===qNum)return true;
    // Busca por EAN
    if(qNum===null&&tokens.length===1&&String(p.ea)===q.trim())return true;
    // Busca por todos os tokens na descrição (AND)
    const desc=(p.d||'').toLowerCase();
    return tokens.every(t=>desc.includes(t));
  });

  // Ordenar: exatos primeiro, depois por faturamento
  found.sort((a,b)=>{
    const dA=(a.d||'').toLowerCase();
    const dB=(b.d||'').toLowerCase();
    const firstTok=tokens[0];
    const startsA=dA.startsWith(firstTok)?0:1;
    const startsB=dB.startsWith(firstTok)?0:1;
    if(startsA!==startsB)return startsA-startsB;
    return b.tv-a.tv;
  });

  const top=found.slice(0,30);
  if(!top.length){
    srchDrp.innerHTML='<div style="padding:18px;text-align:center;color:var(--text-muted);font-size:13px;">Nenhum produto encontrado para "'+q+'"</div>';
    srchDrp.classList.add('show');return;
  }

  srchDrp.innerHTML=`<div class="drp-hdr">${found.length} resultado${found.length!==1?'s':''} para "${q}"${found.length>30?' · mostrando top 30':''}</div>`+
    top.map(p=>`<div class="sri" data-cod="${escAttr(p.c)}">
      <div class="si">${esc(p.ab||'')}</div>
      <div>
        <div class="sm">${highlightTokens(p.d,tokens)}</div>
        <div class="ss">#${esc(p.c)}${p.ea?' · EAN '+esc(p.ea):''} · ${esc(p.dp||'?')} › ${esc(p.ct||'?')}</div>
      </div>
      <div class="sv">${fK(p.tv)}</div>
    </div>`).join('');

  srchDrp.querySelectorAll('.sri').forEach(el=>{
    el.addEventListener('click',()=>{openProd(parseInt(el.dataset.cod));srchDrp.classList.remove('show');srchInp.value='';});
  });
  srchDrp.classList.add('show');
}

function highlightTokens(text,tokens){
  if(!text||!tokens.length)return text||'';
  let h=text;
  tokens.forEach(t=>{
    const re=new RegExp('('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')', 'gi');
    h=h.replace(re,'<mark style="background:rgba(245,134,52,.25);border-radius:2px;padding:0 1px;">$1</mark>');
  });
  return h;
}

// ================================================================
// RAIO-X DO PRODUTO
// ================================================================
const TAG_LABELS={
  abc_a:{l:'Curva A',c:'tag abc-a'},abc_b:{l:'Curva B',c:'tag abc-b'},abc_c:{l:'Curva C',c:'tag abc-c'},
  fora_linha:{l:'Fora de linha',c:'tag dnd'},prejuizo:{l:'Prejuízo recorrente',c:'tag dnd'},
  margem_alta:{l:'Margem alta',c:'tag grn'},alta_dev_cli:{l:'Dev.cliente alta',c:'tag dnd'},
  alta_dev_forn:{l:'Dev.forn. alta',c:'tag ori'},crescendo:{l:'Crescendo',c:'tag grn'},
  caindo:{l:'Queda',c:'tag dnd'},sem_ean:{l:'Sem EAN',c:'tag'},
  estoque_alto:{l:'Estoque alto',c:'tag ori'},estoque_baixo:{l:'Estoque baixo',c:'tag dnd'},
  sem_estoque:{l:'Sem estoque',c:'tag'},markup_baixo:{l:'Markup baixo',c:'tag ori'},
};


// ================================================================
// EXTRATO DO PRODUTO — visão mensal de entradas + saídas
// ================================================================
function buildExtrato(p){
  const PERS=['2026-01','2026-02','2026-03','2026-04'];
  const MESES_FULL=['Janeiro','Fevereiro','Março','Abril'];

  // Agrupar entradas por mês (dt no formato AAAA-MM-DD)
  const entMes={'2026-01':[],'2026-02':[],'2026-03':[],'2026-04':[]};
  (p.en||[]).forEach(function(e){
    if(!e.dt) return;
    const mes=e.dt.slice(0,7);
    if(entMes[mes]) entMes[mes].push(e);
  });

  // Agrupar devoluções a fornecedor por mês
  const devMes={'2026-01':[],'2026-02':[],'2026-03':[],'2026-04':[]};
  (p.dv||[]).forEach(function(d){
    if(!d.dt) return;
    const mes=d.dt.slice(0,7);
    if(devMes[mes]) devMes[mes].push(d);
  });

  let html='';
  let saldoAcum=0;

  // Header de colunas
  html+='<div class="ext-header"><span>Tipo</span><span>Data</span><span>Fornecedor / Item</span><span style="text-align:right">NF</span><span style="text-align:right">Qtde</span><span style="text-align:right">P. Unit</span><span style="text-align:right">Total</span><span style="text-align:right">Status</span></div>';

  PERS.forEach(function(per,i){
    const sv=p.sv[i]||[0,0,0,0];
    const qtv=sv[3], vdo=sv[0], luc=sv[1], dvc=sv[2];
    const ents=entMes[per]||[];
    const devs=devMes[per]||[];

    const qtEntrada = ents.reduce(function(s,e){return s+e.q;},0);
    const vlEntrada = ents.reduce(function(s,e){return s+e.vlc;},0);
    const vlDevForn = devs.reduce(function(s,d){return s+d.v;},0);
    const qtDevForn = devs.reduce(function(s,d){return s+d.q;},0);

    // Pular meses sem movimento
    if(!ents.length && !qtv && !devs.length) return;

    const saldoMes = qtEntrada - qtDevForn - qtv;
    saldoAcum += saldoMes;

    html += `<div class="ext-mes">
      <div class="ext-mes-hdr">
        <span class="ext-mes-nome">${MESES_FULL[i]}</span>
        <span class="ext-mes-ano">2026</span>
        ${ents.length>0?`<span class="ext-mes-stat ent">${ents.length} entrada${ents.length>1?'s':''}</span>`:''}
        ${qtv>0?`<span class="ext-mes-stat sai">saída mês</span>`:''}
        ${devs.length>0?`<span class="ext-mes-stat dev">${devs.length} dev. forn.</span>`:''}
      </div>`;

    // Entradas (ordenadas por data)
    const entsOrdenadas=[...ents].sort(function(a,b){return(a.dt||'').localeCompare(b.dt||'');});
    entsOrdenadas.forEach(function(e){
      const stBadge = e.vla>0
        ? `<span class="tag ori" style="font-size:9px;padding:2px 6px;">R$${fN(e.vla,0)} aberto</span>`
        : `<span class="tag grn" style="font-size:9px;padding:2px 6px;">Pago</span>`;
      html += `<div class="ext-linha ent">
        <div class="ext-tipo ent">⬇ ENTRADA</div>
        <div class="ext-data">${fDt(e.dt)}</div>
        <div class="ext-forn">${esc(e.fo||"")}</div>
        <div class="ext-nf"><span class="cod" style="font-size:9px;">${e.nf}</span></div>
        <div class="ext-qtd">${fN(e.q,2)} un</div>
        <div class="ext-pu">${fB(e.pu,2)}<span style="color:var(--text-muted);font-size:9px;">/un</span></div>
        <div class="ext-total">${fB(e.vlc,0)}</div>
        <div>${stBadge}</div>
      </div>`;
    });

    // Devoluções ao fornecedor
    const devsOrd=[...devs].sort(function(a,b){return(a.dt||'').localeCompare(b.dt||'');});
    devsOrd.forEach(function(d){
      html += `<div class="ext-linha dev">
        <div class="ext-tipo dev">⟲ DEV.FORN.</div>
        <div class="ext-data">${fDt(d.dt)}</div>
        <div class="ext-forn">${esc(d.fo||"")}</div>
        <div class="ext-nf"><span class="tag dnd" style="font-size:9px;padding:2px 5px;">${d.mo||'—'}</span></div>
        <div class="ext-qtd">${fN(d.q,2)} un</div>
        <div class="ext-pu">—</div>
        <div class="ext-total val-neg">−${fB(d.v,0)}</div>
        <div></div>
      </div>`;
    });

    // Saída do mês (vendas mensais)
    if(qtv>0){
      const puMedio = qtv>0?vdo/qtv:0;
      const margPct = vdo>0?luc/vdo*100:0;
      html += `<div class="ext-linha sai">
        <div class="ext-tipo sai">⬆ SAÍDA MÊS</div>
        <div class="ext-data" style="color:var(--text-muted);font-size:10px;">${MESES_FULL[i].slice(0,3)}/2026</div>
        <div class="ext-forn" style="color:var(--text-muted);font-style:italic;font-size:11px;">Período completo</div>
        <div class="ext-nf"></div>
        <div class="ext-qtd">${fN(qtv,0)} un</div>
        <div class="ext-pu">${fB(puMedio,2)}<span style="color:var(--text-muted);font-size:9px;">/un</span></div>
        <div class="ext-total val-pos">${fB(vdo,0)}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-muted);">Lucro ${fP(margPct,1)} · ${fB(luc,0)}</div>
      </div>`;
      // Devolução de clientes (se houver)
      if(dvc>0){
        html += `<div class="ext-linha dev" style="opacity:.75;">
          <div class="ext-tipo dev" style="font-size:9px;">↩ DEV.CLIENTE</div>
          <div class="ext-data" style="color:var(--text-muted);font-size:10px;">${MESES_FULL[i].slice(0,3)}/2026</div>
          <div class="ext-forn" style="color:var(--text-muted);font-size:11px;">Período completo</div>
          <div class="ext-nf"></div>
          <div class="ext-qtd">—</div>
          <div class="ext-pu">—</div>
          <div class="ext-total val-neg">−${fB(dvc,0)}</div>
          <div></div>
        </div>`;
      }
    }

    // Resumo do mês
    const sldCls = saldoMes>=0?'':'val-neg';
    html += `<div class="ext-resumo">
      ${qtEntrada>0?`<span>Entrou: <strong>${fN(qtEntrada,0)} un &nbsp;/&nbsp; ${fB(vlEntrada,0)}</strong></span><span class="ext-sep">·</span>`:''}
      ${qtDevForn>0?`<span class="val-neg">Dev. forn: <strong>${fN(qtDevForn,0)} un &nbsp;/&nbsp; −${fB(vlDevForn,0)}</strong></span><span class="ext-sep">·</span>`:''}
      ${qtv>0?`<span>Vendido: <strong>${fN(qtv,0)} un &nbsp;/&nbsp; ${fB(vdo,0)}</strong></span><span class="ext-sep">·</span>`:''}
      <span>Saldo mês: <strong class="${sldCls}">${saldoMes>=0?'+':''}${fN(saldoMes,0)} un</strong></span>
    </div>`;

    html += '</div>';
  });

  // Nota sobre limite de entradas
  const totalEnts = (p.en||[]).length;
  if(totalEnts>=30){
    html += `<div style="padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);text-align:center;border-top:1px solid var(--border);">
      ℹ Exibindo as 30 entradas mais recentes. Entradas anteriores não constam neste extrato.
    </div>`;
  }

  return html || `<div style="padding:30px;text-align:center;color:var(--text-muted);font-size:12px;">Sem movimentação registrada neste período.</div>`;
}

window.openProd=function(cod){
  const p=byC.get(cod);
  if(!p)return;
  pushNav();
  document.querySelectorAll('.sb-link').forEach(x=>x.classList.remove('active'));
  document.querySelector('.sb-link[data-p="diagnostico"]').classList.add('active');
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-diagnostico').classList.add('active');
  document.getElementById('diag-empty').style.display='none';
  const cnt=document.getElementById('diag-content');
  cnt.style.display='block';
  // cleanup automático via mkC(): CH['c-diag-v'], CH['c-diag-ce'], CH['c-diag-pc']

  const tagsHtml=(p.tg||[]).map(t=>{const m=TAG_LABELS[t];return m?`<span class="${m.c}">${m.l}</span>`:''}).join('');
  const nav=[p.dp,p.sc,p.ct].filter(Boolean).join(' › ');
  // Item 8: compra líquida do produto
  const vcLiq=p.vc-p.vdf;

  cnt.innerHTML=`
    <div class="back-btn-wrap" style="margin-bottom:12px;display:${navHistory.length>0?'block':'none'};">
      <button onclick="goBack()" style="background:var(--surface-2);border:1px solid var(--border-strong);color:var(--text);padding:7px 14px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;font-family:inherit;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        Voltar
      </button>
    </div>
    <div class="prod-hero">
      <div class="ph-nav">${nav}</div>
      <div class="ph-code">#${esc(p.c)}${p.ea?' · EAN '+esc(p.ea):''} · ${esc(p.e||'—')}</div>
      <h2>${esc(p.d||"")}</h2>
      <div class="ph-meta">
        <div class="ph-mi"><div class="pml">Fornecedor</div><div class="pmv">${p.f||'—'}</div></div>
        <!-- Item 2: datas em DD/MM/AAAA -->
        <div class="ph-mi"><div class="pml">Cadastrado</div><div class="pmv">${fDt(p.dc)}</div></div>
        <div class="ph-mi"><div class="pml">P.venda cad.</div><div class="pmv">${p.ep>0?fB(p.ep):'—'}</div></div>
        <div class="ph-mi"><div class="pml">Custo atual</div><div class="pmv">${p.ec>0?fB(p.ec):'—'}</div></div>
      </div>
      <div class="ph-tags">${tagsHtml}</div>
    </div>

    <div class="kg c5" id="kp-main"></div>

    <div class="ds">
      <div class="ds-hdr">
        <div class="ds-ico" style="background:var(--accent-bg);color:var(--accent-text);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        <div>
          <div class="ds-title">Extrato do produto</div>
          <div class="ds-sub">Entradas e saídas organizadas por mês · jan–abr/2026</div>
        </div>
      </div>
      <div class="ds-body" id="ds-extrato" style="padding:0 14px 6px;"></div>
    </div>

    <div class="ds" id="sec-diag">
      <div class="ds-hdr"><div class="ds-ico" style="background:var(--highlight-bg);color:var(--highlight-text);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
      <div><div class="ds-title">Diagnóstico automático</div><div class="ds-sub" id="da-cnt"></div></div></div>
      <div class="ds-body" id="da-body"></div>
    </div>

    <div class="row2">
      <div class="ds">
        <div class="ds-hdr"><div class="ds-ico"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></svg></div>
        <div><div class="ds-title">Vendas</div><div class="ds-sub">Jan–Abr/2026 (líquido)</div></div></div>
        <div class="ds-body"><div style="height:200px;"><canvas id="c-diag-v"></canvas></div></div>
      </div>
      <div class="ds">
        <div class="ds-hdr"><div class="ds-ico" style="background:var(--highlight-bg);color:var(--highlight-text);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></div>
        <div><div class="ds-title">Compras × Vendas</div><div class="ds-sub">Comparativo mensal</div></div></div>
        <div class="ds-body"><div style="height:200px;"><canvas id="c-diag-ce"></canvas></div></div>
      </div>
    </div>

    <div class="ds">
      <div class="ds-hdr"><div class="ds-ico" style="background:var(--highlight-bg);color:var(--highlight-text);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
      <div><div class="ds-title">Evolução do preço de compra</div><div class="ds-sub">Histórico de entradas vs preço de venda</div></div></div>
      <div class="ds-body">
        <div class="kg c5" id="kp-c"></div>
        ${(p.ph||[]).length>0?'<div style="height:180px;margin-bottom:14px;"><canvas id="c-diag-pc"></canvas></div>':'<div style="padding:12px 0;font-size:12px;color:var(--text-muted);">Sem histórico de preços disponível.</div>'}
        <div class="tscroll"><table class="t">
          <thead><tr><th class="L">Data</th><th class="L">Fornecedor</th><th class="L">NF</th><th>Qtde</th><th>P.Unit</th><th>Total</th><th class="L">Status</th></tr></thead>
          <tbody id="tb-ent"></tbody>
        </table></div>
      </div>
    </div>

    <div class="row2">
      <div class="ds">
        <div class="ds-hdr"><div class="ds-ico" style="background:var(--violet-bg,rgba(124,58,237,.1));color:var(--violet-text,#6d28d9);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
        <div><div class="ds-title">Estoque</div><div class="ds-sub">Posição em 21/04/2026</div></div></div>
        <div class="ds-body" id="est-body"></div>
      </div>
      <div class="ds">
        <div class="ds-hdr"><div class="ds-ico" style="background:var(--success-bg);color:var(--success-text);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
        <div><div class="ds-title">Financeiro</div><div class="ds-sub">Status das duplicatas deste item</div></div></div>
        <div class="ds-body" id="fin-body"></div>
      </div>
    </div>

    ${(p.fi||[]).length>0?`<div class="ds">
      <div class="ds-hdr"><div class="ds-ico" style="background:var(--warning-bg);color:var(--warning);">👥</div>
      <div><div class="ds-title">Fornecedores do item</div><div class="ds-sub">Quem vendeu e por quanto</div></div></div>
      <div class="ds-body" id="forn-item-body"></div>
    </div>`:''}

    ${(p.dv||[]).length>0?`<div class="ds">
      <div class="ds-hdr" style="background:var(--danger-bg);border-color:rgba(217,45,32,.2);">
        <div class="ds-ico" style="background:rgba(217,45,32,.15);color:var(--danger-text);">↲</div>
        <div><div class="ds-title">Devoluções ao fornecedor</div><div class="ds-sub">${esc(p.ndf)} devolução(ões) · ${fB(p.vdf,0)}</div></div>
      </div>
      <div class="ds-body np"><div class="tscroll"><table class="t">
        <thead><tr><th class="L">Data</th><th class="L">Fornecedor</th><th class="L">NF</th><th>Qtde</th><th>Valor</th><th class="L">Motivo</th><th class="L">Forma</th></tr></thead>
        <tbody>${(p.dv||[]).map(d=>`<tr>
          <td class="L">${fDt(d.dt)}</td><td class="L" style="font-size:11px;">${d.fo||'—'}</td>
          <td class="L"><span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);">${d.nf||'—'}</span></td>
          <td>${fN(d.q,2)}</td><td class="val-neg">${fB(d.v,2)}</td>
          <td class="L"><span class="tag dnd" style="font-size:9px;">${d.mo||'—'}</span></td>
          <td class="L" style="font-size:11px;">${d.fp||'—'}</td>
        </tr>`).join('')}</tbody>
      </table></div></div>
    </div>`:''}
  `;

  // KPI principal
  const dcLbl=p.eq>0?cobLabelPlain(p):'—';
  document.getElementById('kp-main').innerHTML=kgHtml([
    {l:'Vendas líquidas',v:fK(p.tv),s:fI(p.tq)+' unidades'},
    {l:'Margem bruta',v:fP(p.mp),s:'Lucro '+fK(p.tl),cls:p.mp<0?'dn':p.mp>20?'up':''},
    {l:'Compras líquidas',v:fK(vcLiq),s:fI(p.qc)+' un · '+p.ne+' entradas'},
    {l:'Estoque atual',v:fI(p.eq)+' un',s:p.eq>0?fK(p.eq>0?(p.ep>0?p.ep*p.eq:p.ev*1.38):0)+' p/ venda':'Sem estoque'},
    {l:'Cobertura',v:cobLabel(p),s:cobSubLabel(p),cls:p.edc<7&&p.eq>0?'dn':p.edc>90&&p.eq>0?'hl':''},
  ]);

  // Extrato mensal
  const extratoEl=document.getElementById('ds-extrato');
  if(extratoEl) extratoEl.innerHTML=buildExtrato(p);

  // KPI compras
  const phPrices=(p.ph||[]).filter(x=>x.pu>0).map(x=>x.pu);
  const pVar=phPrices.length>1?(Math.max(...phPrices)-Math.min(...phPrices))/Math.min(...phPrices)*100:0;
  document.getElementById('kp-c').innerHTML=kgHtml([
    {l:'P.médio compra',v:p.pmc>0?fB(p.pmc,2):'—',s:'Ponderado por volume'},
    {l:'P.médio venda',v:p.pmv>0?fB(p.pmv,2):'—',s:'No período'},
    {l:'Markup',v:p.mk>0?'+'+fP(p.mk,1):'—',s:'Venda vs compra',cls:p.mk<5?'dn':p.mk>20?'up':''},
    {l:'Variação de preço',v:pVar>0?fP(pVar,1):'—',s:'Min→Max no período',cls:pVar>15?'dn':''},
    {l:'Desc. financeiro',v:p.df>0?fB(p.df,2):'—',s:p.df>0?fP(p.df/p.vc*100)+' neg.':'Sem desconto',cls:p.df>0?'up':''},
  ]);

  // Diagnóstico automático
  const diags=[];
  if(p.ab==='A')diags.push({c:'if',t:`<strong>Item estratégico (Curva A).</strong> Uma das linhas mais importantes do faturamento. Decisões de preço, negociação e ruptura têm impacto direto no resultado.`});
  else if(p.ab==='C')diags.push({c:'if',t:`<strong>Item cauda longa (Curva C).</strong> Baixa participação. Avalie se compensa manter no mix.`});
  if(p.mp<0)diags.push({c:'bd',t:`<strong>Venda com prejuízo</strong> (${fP(p.mp)}). Possíveis causas: preço desatualizado, custo subiu sem repasse, quebra ou promoção agressiva.`});
  else if(p.mp<5&&p.tv>1000)diags.push({c:'wn',t:`<strong>Margem apertada</strong> (${fP(p.mp)}). Verifique espaço para recomposição.`});
  if(p.mk>0&&p.mk<8&&p.tv>5000)diags.push({c:'wn',t:`<strong>Markup estreito:</strong> preço de venda é apenas ${fP(p.mk,1)} acima do custo médio (R$${fN(p.pmc,2)} → R$${fN(p.pmv,2)}).`});
  if(p.eq>0){
    if(p.edc>=90)diags.push({c:'wn',t:`<strong>Estoque elevado:</strong> ${p.edc.toFixed(0)} dias de cobertura (${fI(p.eq)} un · R$${fN(p.ev,0)}). Avaliar redução no próximo pedido.`});
    else if(p.edc<7)diags.push({c:'bd',t:`<strong>Risco de ruptura:</strong> ${p.edc.toFixed(1)} dia(s) restante. Repor urgente.`});
    else{
    const nota=(p.ebc===2)?' <em>(giro baseado em abr/26 parcial)</em>':'';
    diags.push({c:'ok',t:`Estoque adequado: ${p.edc.toFixed(0)} dias de cobertura (${fI(p.eq)} un · R$${fN(p.ev,0)}).`+nota});
  }
  }else if(p.tq>0)diags.push({c:'bd',t:`<strong>Sem estoque</strong> em 21/04/2026.`});
  if(p.fa>0)diags.push({c:'if',t:`<strong>Financeiro:</strong> ${fP(p.pp)} pago (R$${fN(p.fp,0)}). Em aberto: R$${fN(p.fa,0)} (${fP(p.pa)}).`});
  else if(p.vc>0)diags.push({c:'ok',t:`100% das compras deste item já foram pagas.`});
  if(p.tdc>5)diags.push({c:'bd',t:`<strong>Devolução de cliente elevada</strong> (${fP(p.tdc)}). Investigar qualidade ou PDV.`});
  else if(p.tdc>2)diags.push({c:'wn',t:`Devolução cliente acima do ideal (${fP(p.tdc)}).`});
  if(p.vdf>2000)diags.push({c:'wn',t:`<strong>R$${fN(p.vdf,0)} devolvidos ao fornecedor</strong> em ${p.ndf} operação(ões).`});
  if(p.g>50)diags.push({c:'ok',t:`<strong>Crescimento forte</strong> (+${fP(p.g,1)} em mar/26 vs média jan/fev). Garantir reposição.`});
  else if(p.g<-50)diags.push({c:'wn',t:`<strong>Queda expressiva</strong> (${fP(p.g,1)} em mar/26). Investigar causa.`});
  if(pVar>15)diags.push({c:'wn',t:`<strong>Variação de preço de compra:</strong> de R$${fN(Math.min(...phPrices),2)} a R$${fN(Math.max(...phPrices),2)} (${fP(pVar,1)}).`});
  if(!p.ea||p.ea===0)diags.push({c:'if',t:`Sem EAN cadastrado.`});
  if(!diags.length)diags.push({c:'ok',t:'Comportamento estável. Nenhum alerta relevante identificado.'});

  document.getElementById('da-cnt').textContent=diags.length+' ponto(s)';
  document.getElementById('da-body').innerHTML=`<div class="diag-auto"><div class="da-ttl">⚡ Análise automática</div>
    <ul class="da-ul">${diags.map(d=>`<li class="da-li ${d.c}">${d.t}</li>`).join('')}</ul></div>`;

  // Estoque
  document.getElementById('est-body').innerHTML=p.eq>0?`
    <div class="kg c3">
      <div class="kc"><div class="kl">Disponível</div><div class="kv">${fN(p.eq,2)}</div><div class="ks">unidades</div></div>
      <div class="kc"><div class="kl">Valor custo</div><div class="kv">${fK(p.ev)}</div><div class="ks">imobilizado</div></div>
      <div class="kc ${p.edc<7?'dn':p.edc>90?'hl':'up'}"><div class="kl">Cobertura</div><div class="kv">${cobLabel(p)}</div><div class="ks">${cobSubLabel(p)}</div></div>
    </div>
    <div class="kg c3">
      <div class="kc"><div class="kl">Custo real unit.</div><div class="kv">${p.ec>0?fB(p.ec,2):'—'}</div></div>
      <div class="kc"><div class="kl">Preço venda cad.</div><div class="kv">${p.ep>0?fB(p.ep,2):'—'}</div></div>
      <div class="kc"><div class="kl">Markup cadastro</div><div class="kv">${p.emk>0?'+'+fP(p.emk,1):'—'}</div></div>
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);">Última entrada: <strong style="color:var(--text);">${fDt(p.edt)}</strong></div>
  `:'<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px;">Sem estoque em 21/04/2026.</div>';

  // Financeiro
  document.getElementById('fin-body').innerHTML=p.vc>0?`
    <div class="kg c3">
      <div class="kc"><div class="kl">Total comprado</div><div class="kv">${fB(p.vc,0)}</div></div>
      <div class="kc up"><div class="kl">Já pago</div><div class="kv">${fB(p.fp,0)}</div><div class="ks">${fP(p.pp)}</div></div>
      <div class="kc ${p.fa>0?'hl':''}"><div class="kl">Em aberto</div><div class="kv">${fB(p.fa,0)}</div><div class="ks">${fP(p.pa)}</div></div>
    </div>
    <div class="fin-bar"><div class="sp" style="width:${p.pp}%"></div><div class="sa" style="width:${p.pa}%"></div></div>
    <div class="fbl">
      <div><span class="dot" style="background:var(--success);"></span>Pago: <strong>${fP(p.pp)} (${fB(p.fp,0)})</strong></div>
      <div><span class="dot" style="background:var(--highlight);"></span>Em aberto: <strong>${fP(p.pa)} (${fB(p.fa,0)})</strong></div>
      ${p.df>0?`<div><span class="dot" style="background:var(--success-text);"></span>Desc.fin.: <strong>${fB(p.df,2)}</strong></div>`:''}
      ${p.jr>0?`<div><span class="dot" style="background:var(--danger);"></span>Juros: <strong>${fB(p.jr,2)}</strong></div>`:''}
    </div>
  `:'<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px;">Sem compras no período.</div>';

  // Fornecedores do item
  const fibEl=document.getElementById('forn-item-body');
  if(fibEl)(p.fi||[]).forEach(f=>{
    fibEl.innerHTML+=`<div class="forn-row">
      <div><div style="font-weight:600;font-size:13px;">${esc(f.n||"")}</div><div style="font-size:10px;color:var(--text-muted);font-family:'JetBrains Mono',monospace;">${f.ne} entrada(s) · ${fI(f.q)} un</div></div>
      <div style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;">${fB(f.v,0)}</div>
      <div style="text-align:right;"><div style="font-size:9px;color:var(--text-muted);font-family:'JetBrains Mono',monospace;">PAGO</div><div style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--success-text);">${fB(f.p,0)}</div></div>
      <div style="text-align:right;"><div style="font-size:9px;color:var(--text-muted);font-family:'JetBrains Mono',monospace;">ABERTO</div><div style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${f.a>0?'var(--highlight-text)':'var(--text-muted)'};">${fB(f.a,0)}</div></div>
    </div>`;
  });

  // Entradas tabela (item 2: datas DD/MM/AAAA)
  document.getElementById('tb-ent').innerHTML=(p.en||[]).map(e=>{
    const stBadge=e.vla>0?`<span class="tag ori">R$${fN(e.vla,0)} aberto</span>`:e.vlp>0?'<span class="tag grn">Pago</span>':'<span class="tag">—</span>';
    return`<tr><td class="L">${fDt(e.dt)}</td><td class="L" style="max-width:180px;">${esc(e.fo||"")}</td>
    <td class="L"><span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);">${e.nf}</span></td>
    <td>${fN(e.q,2)}</td><td>${fB(e.pu,4)}</td><td class="val-strong">${fB(e.vlc,2)}</td><td class="L">${stBadge}</td></tr>`;
  }).join('');

  // Gráficos
  setTimeout(()=>{
    mkC('c-diag-v',{
      data:{labels:PLBL,datasets:[
        {type:'bar',label:'Vendas líq.',data:p.sv.map(x=>x[0]),backgroundColor:'#2E476F',borderRadius:5},
        {type:'bar',label:'Lucro',data:p.sv.map(x=>x[1]),backgroundColor:'#F58634',borderRadius:5},
      ]},options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{position:'bottom',labels:{padding:8,usePointStyle:true,boxWidth:7,font:{size:10}}},tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': '+fB(ctx.raw)}}},
        scales:{y:{beginAtZero:true,ticks:{callback:v=>fAbbr(v)}},x:{grid:{display:false}}}}
    });
    mkC('c-diag-ce',{
      data:{labels:PLBL,datasets:[
        {type:'bar',label:'Vendas líq.',data:p.sv.map(x=>x[0]),backgroundColor:'#F58634CC',borderRadius:5},
        {type:'bar',label:'Compras líq.',data:p.sc2.map((v,i)=>Math.max(0,v-(p.vdf/(p.ne||1)))),backgroundColor:'#2E476FCC',borderRadius:5},
      ]},options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{position:'bottom',labels:{padding:8,usePointStyle:true,boxWidth:7,font:{size:10}}},tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': '+fB(ctx.raw)}}},
        scales:{y:{beginAtZero:true,ticks:{callback:v=>fAbbr(v)}},x:{grid:{display:false}}}}
    });
    const pcEl=document.getElementById('c-diag-pc');
    if(pcEl&&(p.ph||[]).length>0){
      const phD=(p.ph||[]).filter(x=>x.pu>0);
      mkC('c-diag-pc',{type:'line',data:{labels:phD.map(x=>fDt(x.dt)),datasets:[
        {label:'Preço compra',data:phD.map(x=>x.pu),borderColor:'#F58634',backgroundColor:'rgba(245,134,52,.12)',fill:true,tension:.3,pointRadius:4,pointBackgroundColor:'#F58634'},
        {label:'Preço venda',data:phD.map(()=>p.pmv),borderColor:'#2E476F',borderDash:[6,3],pointRadius:0,tension:0},
      ]},options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{position:'bottom',labels:{padding:8,usePointStyle:true,boxWidth:7,font:{size:10}}},tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': R$'+ctx.raw.toFixed(2)}}},
        scales:{y:{beginAtZero:false,ticks:{callback:v=>'R$'+v.toFixed(2)}},x:{grid:{display:false},ticks:{maxTicksLimit:8,font:{size:10}}}}}
      });
    }
  },60);
  cnt.scrollIntoView({behavior:'smooth',block:'start'});
};

// ================================================================
// DIAGNÓSTICO DO FORNECEDOR
// ================================================================

let suppIdx = null;  // índice lazy: nome → {fObj, prods, ents, devs}

function buildSuppIdx(){
  if(suppIdx) return;
  suppIdx = new Map();
  D.fornecedores.forEach(f=>{
    suppIdx.set(f.n,{fObj:f, prods:[], ents:[], devs:[]});
  });
  D.produtos.forEach(function(p){
    // produtos cujo fornecedor principal é este
    if(p.f && suppIdx.has(p.f)) suppIdx.get(p.f).prods.push(p);
    // entradas onde o fo da NF bate com o fornecedor
    (p.en||[]).forEach(function(e){
      if(e.fo && suppIdx.has(e.fo))
        suppIdx.get(e.fo).ents.push({dt:e.dt,nf:e.nf,q:e.q,pu:e.pu,vlc:e.vlc,vlp:e.vlp,vla:e.vla,pc:p.c,pd:p.d,pdp:p.dp});
    });
    // devoluções ao fornecedor
    (p.dv||[]).forEach(function(d){
      if(d.fo && suppIdx.has(d.fo))
        suppIdx.get(d.fo).devs.push({dt:d.dt,q:d.q,v:d.v,mo:d.mo,fp:d.fp,pc:p.c,pd:p.d});
    });
  });
}

function initDiagForn(){
  buildSuppIdx();
  const inp=document.getElementById('forn-diag-srch');
  const drp=document.getElementById('forn-diag-drop');
  if(!inp||inp._initialized) return;
  inp._initialized=true;
  let tmr=null;
  inp.addEventListener('input',function(){
    clearTimeout(tmr);
    tmr=setTimeout(function(){doFornSearch(inp.value);},120);
  });
  inp.addEventListener('keydown',function(e){
    if(e.key==='Escape'){drp.classList.remove('show');inp.blur();}
  });
  document.addEventListener('click',function(e){
    if(!e.target.closest('#forn-diag-srch')&&!e.target.closest('#forn-diag-drop'))
      drp.classList.remove('show');
  });
}

function doFornSearch(q){
  const inp=document.getElementById('forn-diag-srch');
  const drp=document.getElementById('forn-diag-drop');
  q=(q||'').trim().toLowerCase();
  if(q.length<2){drp.classList.remove('show');return;}
  const found=D.fornecedores.filter(f=>(f.n||'').toLowerCase().includes(q))
    .sort((a,b)=>b.vdo-a.vdo).slice(0,20);
  if(!found.length){
    drp.innerHTML='<div style="padding:14px;text-align:center;color:var(--text-muted);font-size:12px;">Nenhum fornecedor encontrado</div>';
    drp.classList.add('show'); return;
  }
  const scCls=s=>s>=65?'g':s>=40?'m':'b';
  const scIco=s=>s>=65?'▲':s>=40?'●':'▼';
  drp.innerHTML=`<div class="drp-hdr">${found.length} resultado${found.length>1?'s':''} para "${q}"</div>`+
    found.map(f=>`<div class="sri" data-fn="${encodeURIComponent(f.n)}" style="grid-template-columns:auto 1fr auto;">
      <span class="sc-b ${scCls(f.score)}" style="font-size:10px;">${scIco(f.score)} ${f.score}</span>
      <div>
        <div class="sm">${esc(f.n||"")}</div>
        <div class="ss">${fI(f.ni)} SKUs · Faturamento: ${fK(f.vdo)}</div>
      </div>
      <div class="sv">${fP(f.marg)} marg.</div>
    </div>`).join('');
  drp.querySelectorAll('.sri').forEach(el=>{
    el.addEventListener('click',function(){
      openForn(decodeURIComponent(el.dataset.fn));
      drp.classList.remove('show');
      document.getElementById('forn-diag-srch').value='';
    });
  });
  drp.classList.add('show');
}

// Chamada de produto → abre fornecedor
window.openFornByName = function(nome){
  pushNav();
  // navegar para a página
  document.querySelectorAll('.sb-link').forEach(x=>x.classList.remove('active'));
  const lnk=document.querySelector('.sb-link[data-p="diag-forn"]');
  if(lnk) lnk.classList.add('active');
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-diag-forn').classList.add('active');
  if(!renderedPages.has('diag-forn')){renderPage('diag-forn');renderedPages.add('diag-forn');}
  openForn(nome);
};

function openForn(nome){
  buildSuppIdx();
  const data=suppIdx.get(nome);
  if(!data){return;}
  const f=data.fObj;
  const prods=data.prods.sort((a,b)=>b.tv-a.tv);
  const ents=data.ents.sort((a,b)=>(a.dt||'').localeCompare(b.dt||''));
  const devs=data.devs.sort((a,b)=>(a.dt||'').localeCompare(b.dt||''));

  document.getElementById('diag-forn-empty').style.display='none';
  const cnt=document.getElementById('diag-forn-content');
  cnt.style.display='block';

  // --- Dados derivados ---
  const tl=f.tl||0, jr=f.jr||0;
  const lucLiq=tl-jr; // lucro descontando custo de atraso
  const scCls2=f.score>=65?'good':f.score>=40?'mid':'bad';
  const scIco2=f.score>=65?'▲':f.score>=40?'●':'▼';

  // Deptos atendidos
  const depts=[...new Set(prods.map(p=>p.dp).filter(Boolean))];

  // Tags automáticas
  const tags=[];
  if(jr>tl&&tl>0) tags.push({l:'Juros > Lucro',c:'tag dnd'});
  if(lucLiq<0) tags.push({l:'Resultado líq. negativo',c:'tag dnd'});
  if(f.marg<0) tags.push({l:'Margem negativa',c:'tag dnd'});
  if(f.marg>15) tags.push({l:'Alta margem',c:'tag grn'});
  if(jr>10000) tags.push({l:'Alto custo de atraso',c:'tag ori'});
  if(f.nip>3) tags.push({l:f.nip+' SKUs c/ prejuízo',c:'tag ori'});
  if(f.pp>85) tags.push({l:'Ótimo pagamento',c:'tag grn'});
  if(f.pp<50) tags.push({l:'Baixo % pago',c:'tag ori'});
  if(f.tdc>2) tags.push({l:'Dev. cliente alta',c:'tag ori'});
  if(f.dvf>5000) tags.push({l:'Dev. forn. alta',c:'tag ori'});
  const tagsHtml=tags.map(t=>`<span class="${t.c}">${t.l}</span>`).join('');

  // Evolução mensal a partir dos produtos do fornecedor
  const evo=PERS.map(function(per,i){
    const vdo=prods.reduce(function(s,p){return s+(p.sv[i]?p.sv[i][0]:0);},0);
    const luc=prods.reduce(function(s,p){return s+(p.sv[i]?p.sv[i][1]:0);},0);
    // compras: entradas deste mês
    const com=ents.filter(function(e){return e.dt&&e.dt.slice(0,7)===per;})
      .reduce(function(s,e){return s+e.vlc;},0);
    return{m:per,vdo:vdo,luc:luc,com:com,marg:vdo>0?luc/vdo*100:0};
  });

  // Concentração nos top 3 SKUs
  const top3vdo=prods.slice(0,3).reduce((s,p)=>s+p.tv,0);
  const concPct=f.vdo>0?top3vdo/f.vdo*100:0;

  // Crescimento jan→mar
  const g=(evo[2].vdo>0&&evo[0].vdo>0)?((evo[2].vdo/evo[0].vdo)-1)*100:0;

  cnt.innerHTML=`
    <div class="back-btn-wrap" style="margin-bottom:12px;display:${navHistory.length>0?'block':'none'};">
      <button onclick="goBack()" style="background:var(--surface-2);border:1px solid var(--border-strong);color:var(--text);padding:7px 14px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;font-family:inherit;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        Voltar
      </button>
    </div>
    
  <div class="forn-hero-card">
    <div class="fhc-score">
      <span class="sc-b ${scCls2}" style="font-size:13px;">${scIco2} ${f.score}</span>
    </div>
    <div style="flex:1;">
      <div class="fhc-name">${esc(f.n||"")}</div>
      <div class="fhc-meta">
        <span>${fI(f.ni)} SKUs</span>
        <span class="ext-sep">·</span>
        <span>${depts.join(', ')||'—'}</span>
        ${f.n!==nome?`<span class="ext-sep">·</span><span style="cursor:pointer;color:var(--accent-text);text-decoration:underline;" onclick="openFornByName('${escJs(nome)}')">Ver pelo nome original</span>`:''}
      </div>
      <div class="fhc-tags" style="margin-top:10px;">${tagsHtml}</div>
    </div>
  </div>

  <div class="kg c8" id="kf-kpis"></div>

  <div class="ds" id="fds-diag">
    <div class="ds-hdr">
      <div class="ds-ico" style="background:var(--highlight-bg);color:var(--highlight-text);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      </div>
      <div><div class="ds-title">Diagnóstico do fornecedor</div><div class="ds-sub" id="fds-diag-cnt"></div></div>
    </div>
    <div class="ds-body" id="fds-diag-body"></div>
  </div>

  <div class="row2">
    <div class="cc">
      <div class="cct">Vendas geradas × Compras × Pagamentos</div>
      <div class="ccs">Vendas = receita dos produtos deste fornecedor · Compras = entradas via NFs</div>
      <div style="height:230px;"><canvas id="cf-evo"></canvas></div>
    </div>
    <div class="cc">
      <div class="cct">Margem bruta por mês</div>
      <div class="ccs">% sobre o faturamento gerado pelos produtos do fornecedor</div>
      <div style="height:230px;"><canvas id="cf-marg"></canvas></div>
    </div>
  </div>

  <div class="ds">
    <div class="ds-hdr">
      <div class="ds-ico" style="background:var(--success-bg);color:var(--success-text);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      </div>
      <div><div class="ds-title">Financeiro do fornecedor</div>
      <div class="ds-sub">Status das duplicatas de todas as NFs</div></div>
    </div>
    <div class="ds-body" id="fds-fin"></div>
  </div>


  <div class="ds">
    <div class="ds-hdr">
      <div class="ds-ico"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg></div>
      <div><div class="ds-title">Extrato de compras</div>
      <div class="ds-sub">NFs recebidas + receita gerada por mês · últimas 30 entradas por produto</div></div>
    </div>
    <div class="ds-body" id="fds-extrato" style="padding:0 14px 6px;"></div>
  </div>

  <div class="ds">
    <div class="ds-hdr">
      <div class="ds-ico" style="background:var(--warning-bg);color:var(--warning);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></svg>
      </div>
      <div><div class="ds-title">SKUs deste fornecedor</div>
      <div class="ds-sub">${fI(prods.length)} produtos · Clique para abrir o diagnóstico</div></div>
    </div>
    <div class="ds-body np">
      <div class="tscroll" style="max-height:520px;">
        <table class="t" id="tf-skus">
          <thead><tr>
            <th class="L">Produto</th><th>Faturamento</th><th>Margem</th>
            <th>Lucro</th><th>Compras líq.</th><th>% Pago</th>
            <th>Custo atraso</th><th>Estoque</th><th>Cobertura</th>
          </tr></thead>
          <tbody id="tfb-skus"></tbody>
        </table>
      </div>
    </div>
  </div>

  ${devs.length>0?`<div class="ds">
    <div class="ds-hdr" style="background:var(--danger-bg);">
      <div class="ds-ico" style="background:rgba(217,45,32,.15);color:var(--danger-text);">⟲</div>
      <div><div class="ds-title">Devoluções a este fornecedor</div>
      <div class="ds-sub">${fI(devs.length)} devolução(ões)</div></div>
    </div>
    <div class="ds-body np"><div class="tscroll"><table class="t">
      <thead><tr><th class="L">Data</th><th class="L">Produto</th><th>Qtde</th><th>Valor</th><th class="L">Motivo</th></tr></thead>
      <tbody>${devs.map(d=>`<tr>
        <td class="L">${fDt(d.dt)}</td>
        <td class="L" style="font-size:11px;" onclick="openProd(${escJs(d.pc)})" style="cursor:pointer;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-muted);">#${esc(d.pc)}</span>
          <span style="font-weight:600;"> ${esc(d.pd||"")}</span>
        </td>
        <td>${fN(d.q,1)} un</td>
        <td class="val-neg">${fB(d.v,0)}</td>
        <td class="L"><span class="tag dnd" style="font-size:9px;">${d.mo||'—'}</span></td>
      </tr>`).join('')}</tbody>
    </table></div></div>
  </div>`:''}

  `;

  // ── KPIs ──
  document.getElementById('kf-kpis').innerHTML=kgHtml([
    {l:'Faturamento gerado', v:fK(f.vdo), s:'Vendas dos SKUs cadastrados'},
    {l:'Margem bruta',       v:fP(f.marg), s:'Lucro '+fK(tl), cls:f.marg<0?'dn':f.marg>12?'up':''},
    {l:'Lucro líquido',      v:fK(lucLiq), s:'Lucro − Custo de atraso', cls:lucLiq<0?'dn':lucLiq>0?'up':''},
    {l:'Compras líquidas',   v:fK(comLiq(f.com,f.dvf)), s:fP(f.com>0?comLiq(f.com,f.dvf)/f.vdo*100:0)+' do fat.'},
    {l:'% Pago',             v:fP(f.pp), s:fK(f.pag||0)+' quitado', cls:f.pp>85?'up':f.pp<50?'':''},
    {l:'Em aberto',          v:fK(f.abr||0), s:fP(f.com>0?(f.abr||0)/f.com*100:0)+' das compras', cls:(f.abr||0)>100000?'hl':''},
    {l:'Custo de atraso',    v:fK(jr), s:jr>tl&&tl>0?'⚠ Maior que o lucro':'Juros pagos', cls:jr>tl&&tl>0?'dn':jr>10000?'hl':''},
    {l:'SKUs c/ prejuízo',   v:fI(f.nip), s:'De '+fI(f.ni)+' SKUs ativos', cls:f.nip>5?'dn':f.nip>2?'hl':''},
  ]);

  // ── Diagnóstico automático ──
  const diags=[];
  if(f.marg<0) diags.push({c:'bd',t:`<strong>Margem negativa</strong> (${fP(f.marg)}). A relação comercial como um todo está gerando prejuízo operacional. Rever pricing dos produtos ou negociar melhores preços de compra.`});
  else if(f.marg<5) diags.push({c:'wn',t:`<strong>Margem baixa</strong> (${fP(f.marg)}). Relação pouco lucrativa. Verificar se é fornecedor puxador de fluxo de clientes ou se há espaço para reajuste.`});
  else if(f.marg>15) diags.push({c:'ok',t:`<strong>Boa margem</strong> (${fP(f.marg)}). Relação comercial saudável. Lucro bruto de ${fK(tl)} no período.`});
  if(jr>tl&&tl>0) diags.push({c:'bd',t:`<strong>Custo de atraso supera o lucro:</strong> pagou R$${fN(jr,0)} em juros contra R$${fN(tl,0)} de lucro bruto → resultado líquido <strong class="val-neg">${fK(lucLiq)}</strong>. Principal causa de alerta no score deste fornecedor.`});
  else if(jr>20000) diags.push({c:'wn',t:`<strong>Alto custo de atraso:</strong> R$${fN(jr,0)} em juros no período. Representa ${fP(tl>0?jr/tl*100:100)} do lucro bruto. Priorizar pontualidade nos pagamentos deste fornecedor.`});
  if(f.nip>0) diags.push({c:'wn',t:`<strong>${f.nip} SKU(s) com prejuízo recorrente</strong> de ${f.ni} ativos. Avaliar manutenção no mix ou renegociar preços unitários.`});
  if(concPct>70) diags.push({c:'wn',t:`<strong>Alta concentração:</strong> top 3 SKUs respondem por ${fP(concPct)} do faturamento (${fK(top3vdo)}). Risco de exposição caso algum item entre em ruptura ou perca competitividade.`});
  if(f.tdc>2) diags.push({c:'wn',t:`<strong>Taxa de devolução de clientes:</strong> ${fP(f.tdc)} da receita. Investigar problemas de qualidade, embalagem ou validade nos produtos deste fornecedor.`});
  if(f.dvf>5000) diags.push({c:'wn',t:`<strong>Devoluções ao fornecedor:</strong> R$${fN(f.dvf,0)} no período. Avaliar causas (desacordo de pedido, avaria, prazo).`});
  if(f.pp>85) diags.push({c:'ok',t:`<strong>Excelente relacionamento financeiro:</strong> ${fP(f.pp)} das compras já pagas. Pode ser base para negociar desconto por antecipação.`});
  else if(f.pp<50) diags.push({c:'wn',t:`<strong>Baixo percentual pago:</strong> ${fP(f.pp)}. Verificar se há duplicatas em atraso ou se é prazo negociado.`});
  if(g>30) diags.push({c:'ok',t:`<strong>Crescimento expressivo:</strong> +${fP(g)} em mar/26 vs jan/26. Garantir estoque e cobertura financeira.`});
  else if(g<-30) diags.push({c:'wn',t:`<strong>Queda nas vendas:</strong> ${fP(g)} em mar/26 vs jan/26. Verificar se houve redução de pedidos, ruptura ou saída de produtos.`});
  if(!diags.length) diags.push({c:'ok',t:'Fornecedor com comportamento estável no período. Nenhum alerta crítico identificado.'});

  document.getElementById('fds-diag-cnt').textContent=diags.length+' ponto(s)';
  document.getElementById('fds-diag-body').innerHTML=`<div class="diag-auto"><div class="da-ttl">⚡ Análise automática</div>
    <ul class="da-ul">${diags.map(d=>`<li class="da-li ${d.c}">${d.t}</li>`).join('')}</ul></div>`;

  // ── Charts ──
  const lbl=PERS.map((_,i)=>PLBL[i]);
  setTimeout(function(){
    mkC('cf-evo',{data:{labels:lbl,datasets:[
      {type:'bar',label:'Compras NFs',data:evo.map(e=>e.com),backgroundColor:_PAL.ac+'CC',borderRadius:5},
      {type:'bar',label:'Vendas geradas',data:evo.map(e=>e.vdo),backgroundColor:_PAL.hl+'CC',borderRadius:5},
    ]},options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{position:'bottom',labels:{padding:10,usePointStyle:true,boxWidth:8}},
               tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': '+fB(ctx.raw)}}},
      scales:{y:{beginAtZero:true,ticks:{callback:v=>fAbbr(v)}},x:{grid:{display:false}}}}});

    mkC('cf-marg',{type:'line',data:{labels:lbl,datasets:[
      {label:'Margem %',data:evo.map(e=>e.marg),borderColor:_PAL.hl,backgroundColor:'rgba(245,134,52,.15)',fill:true,tension:.4,pointRadius:5,pointBackgroundColor:_PAL.hl}
    ]},options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>fP(ctx.raw)}}},
      scales:{y:{ticks:{callback:v=>fP(v)},beginAtZero:false},x:{grid:{display:false}}}}});
  },60);

  // ── Extrato ──
  document.getElementById('fds-extrato').innerHTML=buildFornExtrato(evo,ents,devs,prods);

  // ── SKUs tabela ──
  document.getElementById('tfb-skus').innerHTML=prods.map(function(p){
    const vcLiq=p.vc-p.vdf;
    return`<tr onclick="openProd(${escJs(String(p.c))})" style="cursor:pointer;">
      <td class="L">
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-muted);">#${p.c} <span class="tag abc-${p.ab.toLowerCase()}">${p.ab}</span></div>
        <div style="font-weight:600;font-size:12px;">${esc(p.d||"")}</div>
        <div style="font-size:10px;color:var(--text-muted);font-family:'JetBrains Mono',monospace;">${esc(p.dp||"")}</div>
      </td>
      <td>${fB(p.tv,0)}</td>
      <td class="${mc(p.mp)}">${fP(p.mp)}</td>
      <td class="${p.tl<0?'val-neg':p.tl>0?'val-pos':''}">${fB(p.tl,0)}</td>
      <td>${fB(vcLiq,0)}</td>
      <td class="val-pos">${fP(p.pp)}</td>
      <td class="${(p.jr||0)>2000?'val-neg':'val-dim'}">${(p.jr||0)>0?fB(p.jr,0):'—'}</td>
      <td class="val-dim">${p.eq>0?fI(p.eq)+' un':'—'}</td>
      <td class="val-dim">${cobLabel(p)}</td>
    </tr>`;
  }).join('');
  makeSortable('tf-skus');

  // ── Financeiro ──
  const pp=f.pp||0, pa=100-pp;
  const com=comLiq(f.com,f.dvf)||0;
  document.getElementById('fds-fin').innerHTML=`
    <div class="kg c3" style="margin-bottom:12px;">
      <div class="kc"><div class="kl">Total comprado (líq.)</div><div class="kv">${fB(com,0)}</div></div>
      <div class="kc up"><div class="kl">Já pago</div><div class="kv">${fB(f.pag||0,0)}</div><div class="ks">${fP(pp)}</div></div>
      <div class="kc ${(f.abr||0)>50000?'hl':''}"><div class="kl">Em aberto</div><div class="kv">${fB(f.abr||0,0)}</div><div class="ks">${fP(pa)}</div></div>
    </div>
    <div class="fin-bar"><div class="sp" style="width:${pp}%"></div><div class="sa" style="width:${pa}%"></div></div>
    <div class="fbl">
      <div><span class="dot" style="background:var(--success);"></span>Pago: <strong>${fP(pp)} (${fB(f.pag||0,0)})</strong></div>
      <div><span class="dot" style="background:var(--highlight);"></span>Em aberto: <strong>${fP(pa)} (${fB(f.abr||0,0)})</strong></div>
      ${jr>0?`<div><span class="dot" style="background:var(--danger);"></span>Custo de atraso: <strong class="val-neg">${fB(jr,0)}</strong></div>`:''}
      ${(f.df||0)>0?`<div><span class="dot" style="background:var(--success-text);"></span>Desc. financeiro: <strong>${fB(f.df,0)}</strong></div>`:''}
    </div>`;

  cnt.scrollIntoView({behavior:'smooth',block:'start'});
}

// Extrato mensal do fornecedor
function buildFornExtrato(evo, ents, devs, prods){
  const MESES=['Janeiro','Fevereiro','Março','Abril'];
  let html='';

  // Header de colunas
  html+='<div class="ext-header"><span>Tipo</span><span>Data</span><span>Produto(s)</span><span style="text-align:right">NF</span><span style="text-align:right">Qtde</span><span style="text-align:right">SKUs</span><span style="text-align:right">Total</span><span style="text-align:right">Status</span></div>';

  PERS.forEach(function(per,i){
    const ev=evo[i];
    const entsMes=ents.filter(function(e){return e.dt&&e.dt.slice(0,7)===per;});
    const devsMes=devs.filter(function(d){return d.dt&&d.dt.slice(0,7)===per;});

    const qtEnt=entsMes.reduce(function(s,e){return s+e.q;},0);
    const vlEnt=entsMes.reduce(function(s,e){return s+e.vlc;},0);
    const vlDev=devsMes.reduce(function(s,d){return s+d.v;},0);

    if(!entsMes.length&&ev.vdo===0&&!devsMes.length) return;

    // Agrupar entradas por NF (pode ter vários produtos na mesma NF)
    const nfMap=new Map();
    entsMes.forEach(function(e){
      if(!nfMap.has(e.nf)) nfMap.set(e.nf,{nf:e.nf,dt:e.dt,itens:[],vlTotal:0,vlPago:0,vlAberto:0});
      const nf=nfMap.get(e.nf);
      nf.itens.push(e);
      nf.vlTotal+=e.vlc; nf.vlPago+=e.vlp; nf.vlAberto+=e.vla;
    });
    const nfs=[...nfMap.values()].sort(function(a,b){return(a.dt||'').localeCompare(b.dt||'');});

    html+=`<div class="ext-mes">
      <div class="ext-mes-hdr">
        <span class="ext-mes-nome">${MESES[i]}</span>
        <span class="ext-mes-ano">2026</span>
        ${nfs.length>0?`<span class="ext-mes-stat ent">${nfs.length} NF${nfs.length>1?'s':''} · ${fI(qtEnt)} un · ${fB(vlEnt,0)}</span>`:''}
        ${ev.vdo>0?`<span class="ext-mes-stat sai">Receita ${fK(ev.vdo)}</span>`:''}
        ${devsMes.length>0?`<span class="ext-mes-stat dev">${devsMes.length} dev.</span>`:''}
      </div>`;

    // NFs deste mês (com seus produtos)
    nfs.forEach(function(nf){
      const stBadge=nf.vlAberto>0
        ?`<span class="tag ori" style="font-size:9px;">R$${fN(nf.vlAberto,0)} aberto</span>`
        :`<span class="tag grn" style="font-size:9px;">Pago</span>`;

      const nfHiddenId='h'+Math.random().toString(36).slice(2,8);
      const hiddenCount=Math.max(0,nf.itens.length-3);
      html+=`<div class="ext-linha ent">
        <div class="ext-tipo ent">⬇ NF</div>
        <div class="ext-data">${fDt(nf.dt)}</div>
        <div class="ext-forn" style="display:flex;flex-direction:column;gap:2px;">
          ${nf.itens.slice(0,3).map(function(e){
            return`<span style="font-size:11px;"><span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-muted);">#${esc(e.pc)}</span> ${esc(e.pd||"")}</span>`;
          }).join('')}
          ${hiddenCount>0?`<div id="${nfHiddenId}" style="display:none;margin-top:2px;">${nf.itens.slice(3).map(function(e){return`<span style="font-size:11px;"><span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-muted);">#${esc(e.pc)}</span> ${esc(e.pd||"")}</span>`;}).join('')}</div><button onclick="toggleNfItems('${escJs(nfHiddenId)}',this,${hiddenCount})" style="background:none;border:none;padding:2px 0;cursor:pointer;font-size:10px;font-family:inherit;text-align:left;"><span style="color:var(--accent-text);">▶ +${hiddenCount} produto(s)</span></button>`:''}
        </div>
        <div class="ext-nf"><span class="cod" style="font-size:9px;">${nf.nf}</span></div>
        <div class="ext-qtd">${fI(nf.itens.reduce(function(s,e){return s+e.q;},0))} un</div>
        <div class="ext-pu" style="color:var(--text-muted);font-size:10px;">${nf.itens.length} sku${nf.itens.length>1?'s':''}</div>
        <div class="ext-total">${fB(nf.vlTotal,0)}</div>
        <div class="ext-status">${stBadge}</div>
      </div>`;
    });

    // Devoluções do mês
    devsMes.forEach(function(d){
      html+=`<div class="ext-linha dev">
        <div class="ext-tipo dev">⟲ DEV.</div>
        <div class="ext-data">${fDt(d.dt)}</div>
        <div class="ext-forn"><span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-muted);">#${esc(d.pc)}</span> ${esc(d.pd||"")}</div>
        <div class="ext-nf"><span class="tag dnd" style="font-size:9px;">${d.mo||'—'}</span></div>
        <div class="ext-qtd">${fN(d.q,0)} un</div>
        <div class="ext-pu">—</div>
        <div class="ext-total val-neg">−${fB(d.v,0)}</div>
        <div class="ext-status"></div>
      </div>`;
    });

    // Saída mensal
    if(ev.vdo>0){
      const margPct=ev.vdo>0?ev.luc/ev.vdo*100:0;
      html+=`<div class="ext-linha sai">
        <div class="ext-tipo sai">⬆ RECEITA MÊS</div>
        <div class="ext-data" style="color:var(--text-muted);font-size:10px;">${MESES[i].slice(0,3)}/2026</div>
        <div class="ext-forn" style="color:var(--text-muted);font-style:italic;font-size:11px;">Todos os SKUs deste fornecedor</div>
        <div class="ext-nf"></div>
        <div class="ext-qtd" style="color:var(--text-muted);">${fI(prods.reduce(function(s,p){return s+(p.sv[i]?p.sv[i][3]:0);},0))} un</div>
        <div class="ext-pu" style="color:var(--text-muted);font-size:10px;">${fI(prods.filter(function(p){return p.sv[i]&&p.sv[i][0]>0;}).length)} SKUs</div>
        <div class="ext-total val-pos">${fB(ev.vdo,0)}</div>
        <div class="ext-status" style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-muted);text-align:right;">Marg ${fP(margPct,1)}<br>${fB(ev.luc,0)}</div>
      </div>`;
    }

    // Resumo do mês
    const saldo=vlEnt-vlDev;
    html+=`<div class="ext-resumo">
      ${vlEnt>0?`<span>Entradas: <strong>${nfs.length} NFs / ${fB(vlEnt,0)}</strong></span><span class="ext-sep">·</span>`:''}
      ${vlDev>0?`<span class="val-neg">Dev.: <strong>−${fB(vlDev,0)}</strong></span><span class="ext-sep">·</span>`:''}
      ${ev.vdo>0?`<span>Receita gerada: <strong>${fB(ev.vdo,0)}</strong></span><span class="ext-sep">·</span>`:''}
      ${ev.luc!==0?`<span>Lucro: <strong class="${ev.luc<0?'val-neg':'val-pos'}">${fB(ev.luc,0)}</strong></span>`:''}
    </div>`;

    html+='</div>';
  });

  return html||`<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:12px;">Sem movimentação registrada.</div>`;
}



// Toggle expand/collapse de produtos numa NF do extrato
window.toggleNfItems = function(id, btn, count){
  const el = document.getElementById(id);
  if(!el) return;
  const expanded = el.style.display !== 'none';
  if(expanded){
    el.style.display = 'none';
    btn.innerHTML = '<span style="color:var(--accent-text);">▶ +'+count+' produto(s)</span>';
  } else {
    el.style.display = 'block';
    btn.innerHTML = '<span style="color:var(--text-muted);">▲ Recolher</span>';
  }
};




// ================================================================
// VENCIDOS — análise por título individual (dados reais, 818 títulos)
// Base: D.titulos_aberto · Referência: 21/04/2026
// Filtro: ignora títulos com menos de 5 dias de atraso
// ================================================================
const VENC_DATA_REF_STR = '21/04/2026';
const VENC_MIN_DIAS = 5; // Atrasos menores não são considerados vencidos relevantes

function computeVencidos(){
  const venc = (D.titulos_aberto||[]).filter(function(t){ return t.da>=VENC_MIN_DIAS; });
  return {
    total: venc.reduce(function(s,t){ return s+t.v; }, 0),
    nTitulos: venc.length,
    titulos: venc
  };
}

// ================================================================
// EXCESSO DE ESTOQUE (ideal: 45 dias)
// ================================================================
const EXC_DIAS_PERIODO = 110; // Jan(31)+Fev(28)+Mar(31)+Abr parcial(~20)

function computeExcesso(deptFiltro, secFiltro, cadAte){
  const DIAS_IDEAL = getEstoqueIdeal();
  const items=[];
  D.produtos.forEach(function(p){
    if(deptFiltro && p.dp!==deptFiltro) return;
    if(secFiltro && p.sc!==secFiltro) return;
    // Excluir itens cadastrados depois da data de corte.
    // Comparação lexicográfica funciona com strings ISO (AAAA-MM-DD).
    if(cadAte && p.dc && p.dc > cadAte) return;
    const eq=p.eq||0, tq=p.tq||0, ev=p.ev||0;
    if(eq<=0) return;
    let diasCob, excessoQt, excessoValor, diasExcesso, vendaDiaria, tier;
    if(tq<=0){
      // Sem venda: todo estoque é excesso
      diasCob=999; excessoQt=eq; excessoValor=ev;
      diasExcesso=999; vendaDiaria=0; tier='sem-venda';
    } else {
      vendaDiaria=tq/EXC_DIAS_PERIODO;
      diasCob=eq/vendaDiaria;
      if(diasCob<=DIAS_IDEAL) return;
      excessoQt=eq-vendaDiaria*DIAS_IDEAL;
      excessoValor=ev*(excessoQt/eq);
      diasExcesso=diasCob-DIAS_IDEAL;
      if(diasExcesso<=30) tier='leve';
      else if(diasExcesso<=60) tier='medio';
      else if(diasExcesso<=120) tier='alto';
      else tier='critico';
    }
    items.push({
      c:p.c, d:p.d, f:p.f||'', dp:p.dp||'', sc:p.sc||'', dc:p.dc||'',
      eq:eq, ev:ev, pmv:p.pmv||0,
      vendaDiaria:vendaDiaria, diasCob:diasCob,
      diasExcesso:diasExcesso, excessoQt:excessoQt,
      excessoValor:excessoValor, tier:tier
    });
  });
  return items.sort((a,b)=>b.excessoValor-a.excessoValor);
}

let excDeptFiltro = null;
let excSecaoFiltro = null;
let excCadAte;  // undefined até o primeiro render; depois: string ISO 'AAAA-MM-DD' ou null

// [legado] renderExcesso removido em v4.2 — substituído por renderExcessoNovo

// [legado] renderExcessoBody removido em v4.2 — substituído por renderExcessoBodyNovo


// ================================================================
// EXPORT — Excesso de estoque (XLSX e PDF)
// Usa os filtros atuais (depto + seção) e exporta TODOS os itens
// com excesso, não apenas os 100 que aparecem na tela.
// ================================================================
function _excExportarXLSX(){
  const items = computeExcesso(excDeptFiltro, excSecaoFiltro, excCadAte);
  if(!items.length){ _toast('Sem itens com excesso para exportar.', 'aviso'); return; }
  const tierLbl = {leve:'LEVE',medio:'MEDIO',alto:'ALTO',critico:'CRITICO','sem-venda':'SEM VENDA'};
  const totalExcesso = items.reduce((s,i)=>s+i.excessoValor,0);
  const totalEstoque = D.produtos.reduce((s,p)=>{
    if(excDeptFiltro && p.dp!==excDeptFiltro) return s;
    if(excSecaoFiltro && p.sc!==excSecaoFiltro) return s;
    if(excCadAte && p.dc && p.dc > excCadAte) return s;
    return s + (p.ev||0);
  }, 0);
  const dtFmt = (D.meta && D.meta.data_estoque) ? D.meta.data_estoque : _dataLocal();
  const filialTxt = (D.meta && D.meta.filial_nome) || (D.meta && D.meta.filial) || 'ATP';
  const resumo = [
    ['Excesso de estoque - GPC'],
    [],
    ['Filial', filialTxt],
    ['Data do estoque', dtFmt],
    ['Ideal de cobertura (dias)', getEstoqueIdeal()],
    ['Departamento', excDeptFiltro || 'Todos'],
    ['Se\u00e7\u00e3o', excSecaoFiltro || 'Todas'],
    ['Cadastrado at\u00e9', excCadAte ? fDt(excCadAte) : 'Sem filtro'],
    [],
    ['Total de itens em excesso', items.length],
    ['Valor em excesso (R$)', totalExcesso],
    ['Total do estoque no escopo (R$)', totalEstoque],
    ['% do estoque em excesso', totalEstoque>0 ? (totalExcesso/totalEstoque*100) : 0]
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumo), 'Resumo');

  const header = ['C\u00f3digo','Produto','Departamento','Se\u00e7\u00e3o','Fornecedor',
                  'Dt.Cadastro','Estoque (qt)','Venda/dia (qt)','Dias cobertura','Dias excesso',
                  'Qt excesso','Valor estoque (R$)','Valor excesso (R$)',
                  'Pre\u00e7o venda unit.','Classifica\u00e7\u00e3o'];
  const rows = items.map(i => [
    i.c, i.d, i.dp, i.sc, i.f,
    i.dc ? fDt(i.dc) : '',
    i.eq, i.vendaDiaria, i.diasCob>=999?'sem venda':Number(i.diasCob.toFixed(1)),
    i.diasExcesso>=999?'sem venda':Number(i.diasExcesso.toFixed(1)),
    Number(i.excessoQt.toFixed(3)), Number(i.ev.toFixed(2)),
    Number(i.excessoValor.toFixed(2)), i.pmv, tierLbl[i.tier]||i.tier
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([header].concat(rows)), 'Itens em excesso');

  const arq = 'GPC_Excesso_' + (excDeptFiltro? (excDeptFiltro+'_').replace(/\s+/g,'_') : '')
            + (excSecaoFiltro? (excSecaoFiltro+'_').replace(/\s+/g,'_') : '')
            + _dataLocal() + '.xlsx';
  XLSX.writeFile(wb, arq);
  _auditLog('export_xlsx', {arquivo: arq, pagina: 'excesso', n_itens: items.length, depto: excDeptFiltro, secao: excSecaoFiltro});
}

function _excExportarPDF(){
  const items = computeExcesso(excDeptFiltro, excSecaoFiltro, excCadAte);
  if(!items.length){ _toast('Sem itens com excesso para exportar.', 'aviso'); return; }
  const totalExcesso = items.reduce((s,i)=>s+i.excessoValor,0);
  const totalEstoque = D.produtos.reduce((s,p)=>{
    if(excDeptFiltro && p.dp!==excDeptFiltro) return s;
    if(excSecaoFiltro && p.sc!==excSecaoFiltro) return s;
    if(excCadAte && p.dc && p.dc > excCadAte) return s;
    return s + (p.ev||0);
  }, 0);
  const pctExc = totalEstoque>0 ? totalExcesso/totalEstoque*100 : 0;
  const filialTxt = (D.meta && D.meta.filial_nome) || (D.meta && D.meta.filial) || 'ATP';
  const dtFmt = (D.meta && D.meta.data_estoque) ? D.meta.data_estoque : _dataLocal();
  const tierLbl = {leve:'LEVE',medio:'MEDIO',alto:'ALTO',critico:'CRITICO','sem-venda':'SEM VENDA'};

  const fmtBr = (n,d) => (typeof fB==='function') ? fB(n, d==null?0:d) : ('R$ '+Number(n||0).toFixed(d||0));
  const fmtInt = (n) => (typeof fI==='function') ? fI(n) : String(Math.round(n||0));
  const fmtPct = (n) => (typeof fP==='function') ? fP(n,1) : (Number(n||0).toFixed(1)+'%');

  const rowsHtml = items.map(i => `
    <tr>
      <td class="c">${i.c}</td>
      <td>${esc(i.d||'')}</td>
      <td class="dim">${esc(i.dp||'')}</td>
      <td class="dim">${esc(i.sc||'')}</td>
      <td class="dim">${esc(i.f||'')}</td>
      <td class="r">${fmtInt(i.eq)}</td>
      <td class="r dim">${i.vendaDiaria>0?i.vendaDiaria.toFixed(1):'-'}</td>
      <td class="r">${i.diasCob>=999?'\u221e':Math.round(i.diasCob)+' d'}</td>
      <td class="r neg">${i.diasExcesso>=999?'\u221e':Math.round(i.diasExcesso)+' d'}</td>
      <td class="r b">${fmtBr(i.excessoValor,0)}</td>
      <td class="t">${tierLbl[i.tier]||''}</td>
    </tr>`).join('');

  const hoje = fDtH(new Date());
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Excesso de estoque - GPC</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #111; margin: 0; font-size: 10px; }
  h1 { font-size: 18px; margin: 0 0 4px; color: #2E476F; }
  .sub { font-size: 11px; color: #555; margin-bottom: 10px; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
  .kpi { border: 1px solid #ddd; border-radius: 6px; padding: 8px 10px; }
  .kpi .l { font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: .05em; }
  .kpi .v { font-size: 15px; font-weight: 800; color: #111; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 9px; }
  thead th { background: #2E476F; color: #fff; padding: 5px 6px; text-align: left; font-weight: 600; }
  tbody td { padding: 4px 6px; border-bottom: 1px solid #eee; vertical-align: top; }
  tbody tr:nth-child(even) { background: #fafbfc; }
  td.r, th.r { text-align: right; }
  td.c { font-family: ui-monospace, Menlo, Consolas, monospace; color: #2E476F; font-weight: 700; }
  td.dim { color: #555; }
  td.neg { color: #b91c1c; font-weight: 600; }
  td.b { font-weight: 700; }
  td.t { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #555; }
  .rodape { margin-top: 8px; font-size: 8px; color: #888; }
  @media print { .noprint { display: none; } }
  .noprint { text-align: right; margin-bottom: 10px; }
  .noprint button { background: #2E476F; color: #fff; border: none; padding: 8px 14px; border-radius: 5px; font-size: 11px; cursor: pointer; font-weight: 600; }
</style>
</head><body>
  <div class="noprint"><button onclick="window.print()">Imprimir / Salvar PDF</button></div>
  <h1>Excesso de estoque - GPC</h1>
  <div class="sub">Filial: <strong>${esc(filialTxt)}</strong> \xb7 Estoque em ${esc(dtFmt)} \xb7 Ideal: ${getEstoqueIdeal()} dias \xb7 Departamento: <strong>${esc(excDeptFiltro||'Todos')}</strong> \xb7 Se\xe7\xe3o: <strong>${esc(excSecaoFiltro||'Todas')}</strong> \xb7 Cadastrado at\xe9: <strong>${esc(excCadAte? fDt(excCadAte) : 'Sem filtro')}</strong> \xb7 Gerado em ${esc(hoje)}</div>
  <div class="kpis">
    <div class="kpi"><div class="l">Valor em excesso</div><div class="v">${fmtBr(totalExcesso,0)}</div></div>
    <div class="kpi"><div class="l">% do estoque</div><div class="v">${fmtPct(pctExc)}</div></div>
    <div class="kpi"><div class="l">SKUs em excesso</div><div class="v">${fmtInt(items.length)}</div></div>
    <div class="kpi"><div class="l">Estoque total</div><div class="v">${fmtBr(totalEstoque,0)}</div></div>
  </div>
  <table>
    <thead><tr>
      <th>C\xf3digo</th><th>Produto</th><th>Depto</th><th>Se\xe7\xe3o</th><th>Fornecedor</th>
      <th class="r">Estoque</th><th class="r">Venda/dia</th><th class="r">Dias cob.</th>
      <th class="r">Dias excesso</th><th class="r">Valor excesso</th><th>Classif.</th>
    </tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <div class="rodape">GPC Sistema Anal\xedtico de Compras \xb7 R2 Solu\xe7\xf5es Empresariais \xb7 ${items.length} SKUs listados</div>
</body></html>`;
  const win = window.open('', '_blank');
  if(!win){ _toast('Bloqueador de pop-ups impediu a abertura do PDF. Permita pop-ups para este site e tente novamente.', 'aviso'); return; }
  win.document.open();
  win.document.write(html);
  win.document.close();
  _auditLog('export_pdf', {pagina:'excesso', n_itens: items.length, depto: excDeptFiltro, secao: excSecaoFiltro});
}


// ================================================================
// PÁGINA VENCIDOS — análise por título individual (dados reais)
// ================================================================
// [legado] renderVencidos removido em v4.2 — substituído por renderVencidosNovo

// ================================================================
// FORNECEDORES INTERNOS GPC
// ================================================================

// Parâmetros gerais configuráveis
function getEstoqueIdeal(base){
  base = base || _getBaseAtivaParaConfig() || 'default';
  try{
    // Primeiro tenta por base; se não houver, tenta o legado (sem base)
    const v = localStorage.getItem('estoqueIdeal:'+base) || localStorage.getItem('estoqueIdeal');
    if(v){ const n=parseInt(v); if(n>0&&n<=999) return n; }
  }catch(e){}
  return 180; // v4.74: default é o limite de excesso da página Excesso de estoque
}
function setEstoqueIdeal(n, base){
  base = base || _getBaseAtivaParaConfig() || 'default';
  try{ localStorage.setItem('estoqueIdeal:'+base, String(n)); }catch(e){}
}

// Sem defaults globais; cada base configura seus fornecedores internos
const GPC_DEFAULTS = [];

function getGpcSuppliers(base){
  // Se base for explicitamente passado, usa ele.
  // Se for undefined, usa a base ativa.
  // Se for null, faz união de todas (visão consolidada).
  if(typeof base === 'undefined') base = _getBaseAtivaParaConfig();
  try{
    if(base){
      // Chave por base
      const s = localStorage.getItem('gpcSuppliers:'+base);
      if(s) return JSON.parse(s);
      // Sem cadastro pra esta base: vazio (não usa default global)
      return [];
    } else {
      // Consolidado: união de todas as bases
      const uniao = new Set();
      (_basesDisponiveis||[]).forEach(function(b){
        try{
          const s = localStorage.getItem('gpcSuppliers:'+b.sigla);
          if(s) JSON.parse(s).forEach(n => uniao.add(n));
        }catch(e){}
      });
      return [...uniao];
    }
  }catch(e){}
  return [];
}
function saveGpcSuppliers(list, base){
  base = base || _getBaseAtivaParaConfig() || 'default';
  try{ localStorage.setItem('gpcSuppliers:'+base, JSON.stringify(list)); }catch(e){}
}
function isGpcSupplier(nome){
  return getGpcSuppliers().includes(nome);
}

// ================================================================
// ADMINISTRAÇÃO — gerenciar fornecedores internos do grupo
// ================================================================
function renderAdmin(){
  // Bloqueio: Administração não funciona em visão consolidada
  // Cada base tem suas próprias configurações (SKUs ocultos, fornecedores internos, etc).
  // Editar em consolidado é confuso e arriscado. Força o usuário a escolher uma loja.
  const _filAtual = (typeof _filialAtual !== 'undefined') ? _filialAtual : null;
  if(!_filAtual || !_filAtual.base_sigla){
    const filiaisDispon = _filiaisDisponiveis || [];
    let html = '<div class="ph"><div class="pk">Administração</div><h2>Escolha uma <em>loja</em> para configurar</h2></div>'
      + '<div class="ph-sep"></div>'
      + '<div class="page-body" style="padding:40px 20px;">'
      + '<div style="max-width:560px;margin:20px auto;text-align:center;">'
      + '<div style="width:64px;height:64px;background:var(--accent-bg);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;">'
      + '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
      + '</div>'
      + '<h3 style="font-size:18px;font-weight:800;margin-bottom:10px;color:var(--text);">Configurações são por loja</h3>'
      + '<p style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:24px;">'
      +   'A página de Administração gerencia SKUs ocultos, fornecedores internos, estoque ideal e outras configurações específicas de cada base. '
      +   'Para evitar confusão, ela só funciona dentro de uma loja específica.'
      + '</p>'
      + '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:10px;">Selecione a loja para configurar:</div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';
    filiaisDispon.forEach(function(f){
      if(f.placeholder) return;
      html += '<button class="adm-pick-loja" data-sigla="'+escAttr(f.sigla)+'" '
        + 'style="padding:9px 16px;background:var(--surface);border:1px solid var(--border-strong);border-radius:6px;cursor:pointer;font-size:12.5px;font-weight:700;color:var(--text);transition:background .12s;">'
        + esc(f.nome)
        + '</button>';
    });
    html += '</div></div></div>';
    document.getElementById('page-admin').innerHTML = html;

    // Hover effect inline (sem CSS extra)
    document.querySelectorAll('.adm-pick-loja').forEach(function(btn){
      btn.addEventListener('mouseenter', function(){ btn.style.background = 'var(--accent-bg)'; });
      btn.addEventListener('mouseleave', function(){ btn.style.background = 'var(--surface)'; });
      btn.addEventListener('click', function(){
        const sigla = btn.getAttribute('data-sigla');
        // Troca de filial via URL (mesmo mecanismo do seletor da sidebar)
        const url = new URL(window.location);
        if(sigla && sigla !== 'grupo') url.searchParams.set('filial', sigla);
        else url.searchParams.delete('filial');
        url.searchParams.delete('snapshot');
        if(typeof _auditLog === 'function'){
          _auditLog('filial_change', {de: 'consolidado', para: sigla, origem: 'admin'});
        }
        window.location = url.toString();
      });
    });
    return;
  }

  const list=getGpcSuppliers();
  const allForn=D.fornecedores.map(f=>f.n).sort();

  const perfil = _getPerfilUsuario();
  const podeGerenciarUsuarios = perfil && perfil.podeGerenciarUsuarios;
  // Determinar base para configurar
  const basesUsr = _getBasesUsuario();
  if(basesUsr.length === 0){
    document.getElementById('page-admin').innerHTML = '<div class="ph"><div class="pk">Administração</div><h2>Configuração <em>indisponível</em></h2></div>'
      +'<div class="ph-sep"></div>'
      +'<div class="page-body" style="padding:40px 20px;text-align:center;">'
      +'<div style="max-width:500px;margin:40px auto;">'
      +'<div style="width:64px;height:64px;background:var(--warning-bg);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">'
      +'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
      +'</div>'
      +'<h3 style="font-size:18px;font-weight:800;margin-bottom:8px;">Nenhuma base disponível</h3>'
      +'<p style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:20px;">Seu perfil não tem acesso a nenhuma base para configurar. Contate um administrador do sistema ou saia do sistema.</p>'
      +'<div style="display:flex;gap:8px;justify-content:center;">'
      +'<a href="mailto:contato@solucoesr2.com.br?subject=Acesso%20ao%20GPC%20Sistema" style="background:var(--surface-2);border:1px solid var(--border-strong);color:var(--text);padding:9px 16px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;">Contatar suporte</a>'
      +'<button onclick="_logout()" style="background:var(--danger,#c33);color:white;border:none;padding:9px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;">Sair do sistema</button>'
      +'</div></div></div>';
    return;
  }
  // Se _baseAdminSelecionada não está setada, usar a da filial atual ou a primeira
  if(!_baseAdminSelecionada || !basesUsr.find(b => b.sigla === _baseAdminSelecionada)){
    _baseAdminSelecionada = _getBaseFilialAtual() || basesUsr[0].sigla;
  }
  const baseAtual = basesUsr.find(b => b.sigla === _baseAdminSelecionada) || basesUsr[0];

  const html=`
    <div class="ph"><div class="pk">Administração</div><h2>Configurações <em>do sistema</em></h2></div>
    <div class="ph-sep"></div>
    <div class="page-body">

      ${basesUsr.length > 1 ? `
      <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:12px 16px;margin-top:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Configurando base:</span>
        </div>
        <select id="admBaseSelector" style="padding:6px 10px;border:1px solid var(--border-strong);border-radius:6px;font-size:13px;font-weight:700;background:var(--surface);color:var(--text);cursor:pointer;">
          ${basesUsr.map(b => `<option value="${escAttr(b.sigla)}" ${b.sigla===_baseAdminSelecionada?'selected':''}>${esc(b.nome)}${b.placeholder?' (em breve)':''}</option>`).join('')}
        </select>
        <span style="font-size:11px;color:var(--text-dim);">As configurações abaixo aplicam-se apenas a esta base.</span>
      </div>
      ` : `
      <div style="background:var(--accent-bg);border:1px solid var(--accent);border-radius:8px;padding:10px 14px;margin-top:14px;font-size:12px;color:var(--accent-text);">
        Configurando base: <strong>${baseAtual.nome}</strong>
      </div>
      `}

      ${podeGerenciarUsuarios ? `
      <div class="ds" style="margin-top:14px;">
        <div class="ds-hdr">
          <div class="ds-ico" style="background:#1a2f5c;color:white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>
          </div>
          <div>
            <div class="ds-title">Usuários</div>
            <div class="ds-sub">Cadastrar, editar e desativar acesso ao sistema</div>
          </div>
          <button id="btnNovoUsuario" class="ebtn" style="background:#1a2f5c;color:white;border:none;margin-left:auto;display:inline-flex;align-items:center;gap:6px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo usuário
          </button>
        </div>
        <div class="ds-body">
          <div id="adm-usuarios-list"></div>
        </div>
      </div>

      <div class="ds" style="margin-top:14px;">
        <div class="ds-hdr">
          <div class="ds-ico" style="background:var(--accent-bg);color:var(--accent-text);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="16" r="1"/><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <div>
            <div class="ds-title">Perfis e permissões</div>
            <div class="ds-sub">Defina quais páginas e filiais cada perfil acessa por padrão</div>
          </div>
        </div>
        <div class="ds-body">
          <div id="adm-perfis-list"></div>
        </div>
      </div>

      <div class="ds" style="margin-top:14px;">
        <div class="ds-hdr">
          <div class="ds-ico" style="background:#7c3aed;color:white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div>
            <div class="ds-title">Auditoria</div>
            <div class="ds-sub">Histórico de acessos e ações no sistema</div>
          </div>
          <div style="margin-left:auto;font-size:10px;color:var(--text-muted);font-family:JetBrains Mono,monospace;text-transform:uppercase;letter-spacing:.05em;">
            ${AUTH_MODE === 'firebase' ? 'Firestore · auditLog (últimos 500)' : '⚠ Mock — sem Firebase'}
          </div>
        </div>
        <div class="ds-body">
          <div id="adm-auditoria-list"></div>
        </div>
      </div>

      <div class="ds" style="margin-top:14px;">
        <div class="ds-hdr">
          <div class="ds-ico" style="background:#0a7c4a;color:white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div>
            <div class="ds-title">Diagnóstico do sistema</div>
            <div class="ds-sub">Smoke tests para validar integridade dos dados, cálculos, renderização e ambiente</div>
          </div>
        </div>
        <div class="ds-body">
          <div id="adm-smoke-list"></div>
        </div>
      </div>
      ` : ''}

      <div class="ds" style="margin-top:14px;">
        <div class="ds-hdr">
          <div class="ds-ico" style="background:var(--accent-bg);color:var(--accent-text);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </div>
          <div>
            <div class="ds-title">Parâmetros gerais</div>
            <div class="ds-sub">Configurações numéricas usadas pelas análises</div>
          </div>
        </div>
        <div class="ds-body">
          <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
            <div style="flex:1;min-width:260px;">
              <label style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:6px;">Limite de cobertura para considerar excesso (dias)</label>
              <div style="display:flex;align-items:center;gap:8px;">
                <input id="cfg-estoque-ideal" type="number" min="1" max="999" value="${getEstoqueIdeal(_baseAdminSelecionada)}"
                  style="width:100px;padding:9px 12px;border:1px solid var(--border-strong);border-radius:7px;font-size:14px;background:var(--surface);color:var(--text);font-family:'JetBrains Mono',monospace;font-weight:700;text-align:center;">
                <span style="font-size:13px;color:var(--text-muted);">dias</span>
                <button onclick="saveEstoqueIdeal()" class="ebtn" style="background:var(--accent);color:white;border:none;margin-left:8px;">Salvar</button>
                <span id="cfg-ei-msg" style="font-size:11px;color:var(--success-text);margin-left:4px;opacity:0;transition:opacity .3s;">✓ Salvo</span>
              </div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:6px;line-height:1.4;">
                Usado na página <strong>Excesso de Estoque</strong>: SKUs com cobertura acima deste valor entram na lista de excesso por giro. Default 180 dias (≈ 6 meses). Status PARADO/MORTO/CRÍTICO sempre entram independentemente.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ds" style="margin-top:14px;">
        <div class="ds-hdr">
          <div class="ds-ico" style="background:#0369a1;color:white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div>
            <div class="ds-title">Supervisores ignorados por loja</div>
            <div class="ds-sub">Marque supervisores que devem ser excluídos das análises de Vendas (todas as páginas)</div>
          </div>
          <span id="adm-sup-status" style="margin-left:auto;font-size:11px;color:var(--success-text);opacity:0;transition:opacity .3s;">✓ Salvo</span>
        </div>
        <div class="ds-body">
          <div id="adm-sup-list">
            <div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px;">Carregando supervisores...</div>
          </div>
          <div style="margin-top:14px;display:flex;gap:8px;align-items:center;">
            <button onclick="_salvarSupIgnUI()" class="ebtn" style="background:var(--accent);color:white;border:none;display:inline-flex;align-items:center;gap:6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Salvar configuração
            </button>
            <span style="font-size:11px;color:var(--text-muted);">Aplica em todas as páginas de Vendas após recarregar</span>
          </div>
        </div>
      </div>

      <div class="ds" style="margin-top:14px;">
        <div class="ds-hdr">
          <div class="ds-ico" style="background:var(--danger-bg);color:var(--danger-text);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </div>
          <div>
            <div class="ds-title">SKUs ocultos</div>
            <div class="ds-sub">Itens excluídos de todas as análises, tabelas e buscas. Permanecem no histórico original.</div>
          </div>
        </div>
        <div class="ds-body">
          <div style="margin-bottom:14px;">
            <label style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:6px;">Adicionar SKU oculto</label>
            <div style="display:flex;gap:8px;position:relative;">
              <input id="adm-hid-srch" type="text" placeholder="Digite código ou palavras do produto..." autocomplete="off"
                style="flex:1;padding:9px 12px;border:1px solid var(--border-strong);border-radius:7px;font-size:13px;background:var(--surface);color:var(--text);">
              <div id="adm-hid-drop" style="display:none;position:absolute;top:100%;left:0;right:0;margin-top:4px;background:var(--surface);border:1px solid var(--border-strong);border-radius:7px;max-height:280px;overflow-y:auto;z-index:10;box-shadow:0 6px 20px rgba(0,0,0,.12);"></div>
            </div>
          </div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Lista atual (<span id="adm-hid-count">0</span>)</div>
          <div id="adm-hid-list"></div>
          <div style="margin-top:14px;display:flex;gap:8px;">
            <button onclick="resetHiddenSkus()" class="ebtn" style="background:var(--surface-2);color:var(--text-dim);">Restaurar padrão</button>
          </div>
        </div>
      </div>

      <div class="ds" style="margin-top:14px;">
        <div class="ds-hdr">
          <div class="ds-ico" style="background:var(--highlight-bg);color:var(--highlight-text);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div>
            <div class="ds-title">Lista de fornecedores internos</div>
            <div class="ds-sub">Fornecedores que pertencem ao próprio grupo GPC. Usado na análise "Fornecedores GPC". Não afeta as demais análises.</div>
          </div>
        </div>
        <div class="ds-body">
          <div style="margin-bottom:14px;">
            <label style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:6px;">Adicionar fornecedor</label>
            <div style="display:flex;gap:8px;position:relative;">
              <input id="adm-srch" type="text" placeholder="Digite parte do nome..." autocomplete="off"
                style="flex:1;padding:9px 12px;border:1px solid var(--border-strong);border-radius:7px;font-size:13px;background:var(--surface);color:var(--text);">
              <div id="adm-drop" style="display:none;position:absolute;top:100%;left:0;right:90px;margin-top:4px;background:var(--surface);border:1px solid var(--border-strong);border-radius:7px;max-height:280px;overflow-y:auto;z-index:10;box-shadow:0 6px 20px rgba(0,0,0,.12);"></div>
            </div>
          </div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Lista atual (<span id="adm-count">${list.length}</span>)</div>
          <div id="adm-list"></div>
          <div style="margin-top:14px;display:flex;gap:8px;">
            <button onclick="resetGpcList()" class="ebtn" style="background:var(--surface-2);color:var(--text-dim);">Restaurar padrão</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('page-admin').innerHTML=html;

  renderAdmList();
  const srch=document.getElementById('adm-srch');
  const drp=document.getElementById('adm-drop');
  srch.addEventListener('input',function(){
    const q=srch.value.trim().toLowerCase();
    if(q.length<2){drp.style.display='none';return;}
    const cur=getGpcSuppliers(_baseAdminSelecionada);
    const found=allForn.filter(n=>n.toLowerCase().includes(q)&&!cur.includes(n)).slice(0,15);
    if(!found.length){drp.innerHTML='<div style="padding:12px;color:var(--text-muted);font-size:12px;text-align:center;">Nenhum fornecedor encontrado ou todos já adicionados.</div>';drp.style.display='block';return;}
    drp.innerHTML=found.map(n=>`<div class="adm-opt" data-n="${n.replace(/"/g,'&quot;')}" style="padding:9px 12px;cursor:pointer;font-size:12px;border-bottom:1px solid var(--border);">${n}</div>`).join('');
    drp.style.display='block';
    drp.querySelectorAll('.adm-opt').forEach(el=>{
      el.addEventListener('mouseenter',()=>el.style.background='var(--surface-2)');
      el.addEventListener('mouseleave',()=>el.style.background='');
      el.addEventListener('click',()=>{addGpcSupplier(el.dataset.n);srch.value='';drp.style.display='none';});
    });
  });
  document.addEventListener('click',function(e){
    if(!e.target.closest('#adm-srch')&&!e.target.closest('#adm-drop'))drp.style.display='none';
  });

  // Busca de SKUs para ocultar
  renderHidList();
  const hsrch = document.getElementById('adm-hid-srch');
  const hdrp  = document.getElementById('adm-hid-drop');
  hsrch.addEventListener('input', function(){
    const q = hsrch.value.trim().toLowerCase();
    if(q.length<2){ hdrp.style.display='none'; return; }
    const cur = new Set(getHiddenSkus(_baseAdminSelecionada));
    const base = D._origProdutos || D.produtos;
    let found;
    if(/^\d+$/.test(q)){
      found = base.filter(p => String(p.c).startsWith(q) && !cur.has(p.c)).slice(0, 15);
    } else {
      const tokens = q.split(/\s+/);
      found = base.filter(p => {
        const t = (p.d||'').toLowerCase();
        return tokens.every(tk => t.includes(tk)) && !cur.has(p.c);
      }).slice(0, 15);
    }
    if(!found.length){
      hdrp.innerHTML = '<div style="padding:12px;color:var(--text-muted);font-size:12px;text-align:center;">Nenhum produto encontrado ou todos já ocultos.</div>';
      hdrp.style.display = 'block';
      return;
    }
    hdrp.innerHTML = found.map(p => '<div class="adm-hid-opt" data-c="'+escAttr(p.c)+'" style="padding:9px 12px;cursor:pointer;font-size:12px;border-bottom:1px solid var(--border);">'
      +'<span style="font-family:\'JetBrains Mono\',monospace;font-weight:700;color:var(--accent);">#'+esc(p.c)+'</span> '
      +esc(p.d||'')+' <span style="color:var(--text-muted);">· '+esc(p.dp||'')+'</span></div>').join('');
    hdrp.style.display = 'block';
    hdrp.querySelectorAll('.adm-hid-opt').forEach(el => {
      el.addEventListener('mouseenter', ()=>el.style.background='var(--surface-2)');
      el.addEventListener('mouseleave', ()=>el.style.background='');
      el.addEventListener('click', ()=>{ addHiddenSku(el.dataset.c); hsrch.value=''; hdrp.style.display='none'; });
    });
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('#adm-hid-srch') && !e.target.closest('#adm-hid-drop')) hdrp.style.display='none';
  });

  // Renderizar UI de supervisores ignorados
  _renderSupIgnUI();

  // Renderizar usuários, perfis, auditoria e smoke tests (se admin)
  if(podeGerenciarUsuarios){
    renderAdmUsuarios();
    renderAdmPerfis();
    renderAdmAuditoria();
    renderAdmSmoke();
  }

  // Handler do seletor de base
  const selBase = document.getElementById('admBaseSelector');
  if(selBase){
    selBase.addEventListener('change', function(){
      _baseAdminSelecionada = this.value;
      renderAdmin();
    });
  }
}

// ────────────────────────────────────────────────────────────────────
// SUPERVISORES IGNORADOS · UI da Administração
// ────────────────────────────────────────────────────────────────────

function _renderSupIgnUI(){
  const cont = document.getElementById('adm-sup-list');
  if(!cont) return;

  // Carrega config + supervisores de todas as bases em paralelo
  Promise.all([
    _carregarSupervisoresIgnorados(),
    _getSupervisoresPorLojaCompleto()
  ]).then(function(arr){
    const cfg = arr[0];
    const supPorLoja = arr[1];
    const lojas = Object.keys(supPorLoja).sort(function(a,b){
      const ordem = ['ATP-V','ATP-A','CP1','CP3','CP5','CP40'];
      const ia = ordem.indexOf(a), ib = ordem.indexOf(b);
      if(ia >= 0 && ib >= 0) return ia - ib;
      if(ia >= 0) return -1;
      if(ib >= 0) return 1;
      return a.localeCompare(b);
    });

    if(lojas.length === 0){
      cont.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px;">Nenhuma loja ou supervisor encontrado nos dados de vendas.</div>';
      return;
    }

    const lojaLabel = {
      'ATP-V':'ATP Varejo', 'ATP-A':'ATP Atacado',
      'CP1':'Comercial Pinto 1', 'CP3':'Cestão Loja 1',
      'CP5':'Cestão Inhambupe', 'CP40':'Barros 40'
    };

    const catalogo = (typeof _SUP_IGN_PAGINAS_CATALOGO !== 'undefined') ? _SUP_IGN_PAGINAS_CATALOGO : [];
    if(!catalogo.length){
      cont.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px;">Nenhuma página configurável.</div>';
      return;
    }

    // Determina página selecionada (mantém escolha do usuário entre re-renders)
    if(!window._supIgnPaginaSel) window._supIgnPaginaSel = catalogo[0].id;
    const paginaSel = window._supIgnPaginaSel;
    const paginaInfo = catalogo.find(function(p){return p.id === paginaSel;}) || catalogo[0];

    // Configuração ativa pra essa página
    const cfgPag = (cfg.paginas && cfg.paginas[paginaSel]) || {};

    let html = '';

    // Seletor de página (dropdown) — segue a ordem do catálogo (que é a ordem do menu)
    html += '<div style="margin-bottom:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">';
    html += '<div style="flex:1;min-width:240px;">';
    html += '<label style="display:block;font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:4px;">Configurar página:</label>';
    html += '<select id="adm-sup-pagina" style="width:100%;padding:8px 10px;border:1px solid var(--border-strong);border-radius:5px;font-size:12.5px;background:var(--surface);">';
    // Agrupa MANTENDO ordem do catálogo: novo optgroup quando o grupo muda
    let grupoAtual = null;
    catalogo.forEach(function(p){
      if(p.grupo !== grupoAtual){
        if(grupoAtual !== null) html += '</optgroup>';
        html += '<optgroup label="'+esc(p.grupo)+'">';
        grupoAtual = p.grupo;
      }
      const cfgEsta = (cfg.paginas && cfg.paginas[p.id]) || {};
      const totIgn = Object.keys(cfgEsta).reduce(function(s,l){return s + (cfgEsta[l]||[]).length;}, 0);
      const prefixo = p.aplicaFiltro === false ? '○ ' : '';
      html += '<option value="'+escAttr(p.id)+'"'+(p.id===paginaSel?' selected':'')+'>'
        + prefixo + esc(p.label) + (totIgn>0 ? ' · '+totIgn+' ignorado(s)' : '')
        + '</option>';
    });
    if(grupoAtual !== null) html += '</optgroup>';
    html += '</select>';
    html += '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">'
      +    'Páginas com <strong>○</strong> aceitam configuração mas o filtro ainda não aplica (a fonte de dados não traz cod_supervisor).'
      +    '</div>';
    html += '</div>';
    // Atalhos
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    html += '<button id="adm-sup-limpar-pag" style="padding:7px 12px;background:white;color:var(--text);border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;font-size:11px;font-weight:600;" title="Desmarca todos os supervisores ignorados desta página">Limpar página</button>';
    html += '<button id="adm-sup-copiar-pag" style="padding:7px 12px;background:white;color:var(--text);border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;font-size:11px;font-weight:600;" title="Copia a configuração desta página para outras páginas">Copiar para...</button>';
    html += '</div>';
    html += '</div>';

    // Indicador da página selecionada
    const aplicaAgora = paginaInfo.aplicaFiltro !== false;
    const bgInd  = aplicaAgora ? 'var(--accent-bg)'   : '#fef3c7';
    const corInd = aplicaAgora ? 'var(--accent)'      : '#d97706';
    const tagInd = aplicaAgora
      ? '<span style="color:var(--text-dim);">Marque os supervisores que devem ser excluídos do cálculo nesta página.</span>'
      : '<span style="color:#92400e;">A configuração é salva, mas o filtro <strong>ainda não aplica</strong> nesta página (fonte de dados sem cod_supervisor por SKU/título). Será habilitado quando o ETL fornecer a quebra.</span>';
    html += '<div style="margin-bottom:12px;padding:10px 12px;background:'+bgInd+';border-left:3px solid '+corInd+';border-radius:5px;font-size:12px;">';
    html += '<strong style="color:var(--text);">'+esc(paginaInfo.label)+'</strong>';
    html += ' <span style="color:var(--text-muted);">·</span> ';
    html += tagInd;
    html += '</div>';

    // Cards por loja
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;">';
    lojas.forEach(function(loja){
      const sups = supPorLoja[loja];
      const ignorados = (cfgPag[loja] || []).map(Number);
      const totIgn = sups.filter(function(s){ return ignorados.indexOf(s.cod) >= 0; }).length;
      html += '<div style="border:1px solid var(--border);border-radius:8px;padding:10px;background:var(--surface);">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border);">';
      html += '<div style="font-weight:700;font-size:13px;">'+esc(lojaLabel[loja]||loja)+' <span style="color:var(--text-muted);font-weight:400;font-size:11px;">('+esc(loja)+')</span></div>';
      html += '<span style="font-size:10px;color:'+(totIgn>0?'#dc2626':'var(--text-muted)')+';font-weight:600;">'+totIgn+' ignorados</span>';
      html += '</div>';
      sups.forEach(function(s){
        const checked = ignorados.indexOf(s.cod) >= 0;
        html += '<label style="display:flex;align-items:center;gap:8px;padding:5px 4px;cursor:pointer;font-size:12px;border-radius:4px;'+(checked?'background:#fee2e2;':'')+'" onmouseover="this.style.background=\''+(checked?'#fecaca':'var(--surface-2)')+'\'" onmouseout="this.style.background=\''+(checked?'#fee2e2':'')+'\'">';
        html += '<input type="checkbox" data-loja="'+escAttr(loja)+'" data-cod="'+s.cod+'" '+(checked?'checked':'')+' class="sup-ign-chk" style="cursor:pointer;">';
        html += '<span style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text-muted);min-width:28px;">#'+s.cod+'</span>';
        html += '<span style="flex:1;'+(checked?'text-decoration:line-through;color:#991b1b;':'')+'">'+esc(s.nome)+'</span>';
        html += '</label>';
      });
      html += '</div>';
    });
    html += '</div>';

    const totAplicam   = catalogo.filter(function(p){return p.aplicaFiltro !== false;}).length;
    const totNaoAplicam = catalogo.length - totAplicam;
    html += '<div style="margin-top:10px;padding:8px 10px;background:var(--surface-2);border-left:3px solid var(--accent);border-radius:4px;font-size:11px;color:var(--text-dim);line-height:1.5;">';
    html += '<strong>Como funciona:</strong> a configuração é por página. Cada página da lista tem sua própria seleção. Útil para esconder grupos como INATIVOS, NEGOCIAÇÕES ESPECIAIS ou GPC INTRAGRUPO em algumas análises mas mantê-los visíveis em outras.';
    html += '<br><br><strong>'+catalogo.length+' páginas no catálogo</strong> ('+totAplicam+' aplicam o filtro hoje, '+totNaoAplicam+' aceitam pré-configuração). O sistema desconta os supervisores marcados dos totais agregados cruzando <code>V.vendedores.supervisores_por_filial</code> e rateando pelo perfil mensal de cada loja.';
    html += '<br><br><strong>Páginas com <code>○</code></strong> não aplicam o filtro hoje porque a fonte de dados (E.produtos, F.titulos, V.diario) não traz <code>cod_supervisor</code> no nível certo. Quando o ETL passar a fornecer essa quebra, basta mudar <code>aplicaFiltro:false → true</code> em <code>core.js</code>.';
    html += '<br><br><strong>Aviso ATP:</strong> os supervisores de ATP-V (VAREJO, GPC INTRAGRUPO) e ATP-A (ATACADO BALCÃO) aparecem na lista mas com <code>fat_liq=0</code> no ETL atual. Marcá-los aqui não tem efeito até esse bug ser corrigido no ETL.';
    html += '</div>';

    cont.innerHTML = html;

    // Bind do seletor
    document.getElementById('adm-sup-pagina').addEventListener('change', function(e){
      window._supIgnPaginaSel = e.target.value;
      _renderSupIgnUI();
    });

    // Limpar página
    document.getElementById('adm-sup-limpar-pag').addEventListener('click', async function(){
      const ok = await _confirm('Remover todos os supervisores ignorados de "'+paginaInfo.label+'"?', {titulo:'Limpar página', btnOk:'Limpar', perigo:true});
      if(!ok) return;
      const cfg = await _carregarSupervisoresIgnorados();
      if(cfg.paginas && cfg.paginas[paginaSel]){
        delete cfg.paginas[paginaSel];
      }
      const r = await _salvarSupervisoresIgnorados(cfg);
      if(r.ok){ _renderSupIgnUI(); }
      else { alert('Erro ao limpar: '+(r.erro||'desconhecido')); }
    });

    // Copiar para outras páginas
    document.getElementById('adm-sup-copiar-pag').addEventListener('click', function(){
      _supIgnAbrirCopiarUI(paginaSel, paginaInfo.label);
    });

  }).catch(function(e){
    cont.innerHTML = '<div style="padding:20px;text-align:center;color:#dc2626;font-size:12px;">Erro ao carregar configuração: '+esc(e.message||'')+'</div>';
  });
}

// Modal pra copiar config de uma página pra outras
function _supIgnAbrirCopiarUI(paginaOrigem, labelOrigem){
  const catalogo = (typeof _SUP_IGN_PAGINAS_CATALOGO !== 'undefined') ? _SUP_IGN_PAGINAS_CATALOGO : [];
  const outras = catalogo.filter(function(p){return p.id !== paginaOrigem;});
  if(!outras.length){
    alert('Não há outras páginas para copiar.');
    return;
  }

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
  let html = '<div style="background:white;border-radius:10px;max-width:480px;width:100%;padding:20px;box-shadow:0 10px 40px rgba(0,0,0,.3);">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">';
  html += '<h3 style="margin:0;font-size:16px;font-weight:700;">Copiar configuração</h3>';
  html += '<button id="sicp-close" style="background:transparent;border:none;cursor:pointer;font-size:18px;color:var(--text-muted);">✕</button>';
  html += '</div>';
  html += '<div style="font-size:12px;color:var(--text-muted);margin-bottom:14px;line-height:1.5;">Copiar a configuração de <strong style="color:var(--text);">'+esc(labelOrigem)+'</strong> para as páginas selecionadas. A configuração existente nessas páginas será <strong>substituída</strong>.</div>';
  html += '<div style="display:flex;flex-direction:column;gap:6px;max-height:280px;overflow-y:auto;border:1px solid var(--border);border-radius:6px;padding:8px;">';
  outras.forEach(function(p){
    html += '<label style="display:flex;align-items:center;gap:8px;padding:5px 4px;cursor:pointer;font-size:12.5px;">'
      + '<input type="checkbox" data-pagina-destino="'+escAttr(p.id)+'" class="sicp-chk" style="cursor:pointer;">'
      + '<span style="color:var(--text-muted);font-size:10.5px;text-transform:uppercase;min-width:54px;">'+esc(p.grupo)+'</span>'
      + '<span style="flex:1;">'+esc(p.label)+'</span>'
      + '</label>';
  });
  html += '</div>';
  html += '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">';
  html += '<button id="sicp-cancel" style="padding:8px 14px;background:white;color:var(--text);border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;font-size:12px;">Cancelar</button>';
  html += '<button id="sicp-aplicar" style="padding:8px 14px;background:var(--accent);color:white;border:none;border-radius:5px;cursor:pointer;font-size:12px;font-weight:700;">Copiar</button>';
  html += '</div>';
  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);

  document.getElementById('sicp-close').addEventListener('click', function(){overlay.remove();});
  document.getElementById('sicp-cancel').addEventListener('click', function(){overlay.remove();});
  document.getElementById('sicp-aplicar').addEventListener('click', async function(){
    const destinos = Array.from(overlay.querySelectorAll('.sicp-chk:checked')).map(function(c){return c.getAttribute('data-pagina-destino');});
    if(!destinos.length){ alert('Selecione ao menos uma página de destino.'); return; }
    const cfg = await _carregarSupervisoresIgnorados();
    const cfgOrig = (cfg.paginas && cfg.paginas[paginaOrigem]) || {};
    if(!cfg.paginas) cfg.paginas = {};
    destinos.forEach(function(d){
      cfg.paginas[d] = JSON.parse(JSON.stringify(cfgOrig));
      // Remove se vazio
      const tot = Object.keys(cfg.paginas[d]).reduce(function(s,l){return s + (cfg.paginas[d][l]||[]).length;}, 0);
      if(tot === 0) delete cfg.paginas[d];
    });
    const r = await _salvarSupervisoresIgnorados(cfg);
    overlay.remove();
    if(r.ok){
      _renderSupIgnUI();
      _toast('Copiado para '+destinos.length+' página(s)', 'ok');
    } else {
      alert('Erro ao copiar: '+(r.erro||'desconhecido'));
    }
  });
}

async function _salvarSupIgnUI(){
  const status = document.getElementById('adm-sup-status');
  const checkboxes = document.querySelectorAll('.sup-ign-chk');
  const paginaSel = window._supIgnPaginaSel;
  if(!paginaSel){ console.warn('[supIgn] página não selecionada'); return; }

  // Carrega config atual e atualiza só a página selecionada
  const cfg = await _carregarSupervisoresIgnorados();
  if(!cfg.paginas) cfg.paginas = {};

  const novoMapaPag = {};
  checkboxes.forEach(function(chk){
    const loja = chk.getAttribute('data-loja');
    const cod = Number(chk.getAttribute('data-cod'));
    if(chk.checked){
      if(!novoMapaPag[loja]) novoMapaPag[loja] = [];
      novoMapaPag[loja].push(cod);
    }
  });
  // Limpa lojas sem ignorados
  Object.keys(novoMapaPag).forEach(function(l){ if(!novoMapaPag[l].length) delete novoMapaPag[l]; });

  // Se ficou vazio, remove a página inteira pra manter o objeto enxuto
  if(Object.keys(novoMapaPag).length === 0){
    delete cfg.paginas[paginaSel];
  } else {
    cfg.paginas[paginaSel] = novoMapaPag;
  }

  const r = await _salvarSupervisoresIgnorados(cfg);
  if(status){
    status.style.opacity = '1';
    status.textContent = r.ok ? '✓ Salvo' : '✗ Erro';
    status.style.color = r.ok ? 'var(--success-text)' : '#dc2626';
    setTimeout(function(){ status.style.opacity = '0'; }, 2500);
  }
  if(r.ok){
    _renderSupIgnUI();
  } else {
    alert('Erro ao salvar: ' + (r.erro||'desconhecido'));
  }
}
window._salvarSupIgnUI = _salvarSupIgnUI;

function renderAdmList(){
  const list=getGpcSuppliers(_baseAdminSelecionada);
  document.getElementById('adm-count').textContent=list.length;
  const container=document.getElementById('adm-list');
  if(!list.length){
    container.innerHTML='<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px;">Nenhum fornecedor cadastrado. Use a busca acima.</div>';
    return;
  }
  container.innerHTML=list.map(function(n){
    const f=D.fornecedores.find(x=>x.n===n);
    const info=f?`<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);">${fK(f.vdo)} · ${f.ni} SKUs</span>`:'<span style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text-muted);">Sem atividade no período</span>';
    return`<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border:1px solid var(--border);border-radius:7px;margin-bottom:6px;background:var(--surface-2);">
      <div><div style="font-weight:600;font-size:13px;">${n}</div><div style="margin-top:2px;">${info}</div></div>
      <button onclick="removeGpcSupplier('${escJs(n)}')" style="background:transparent;border:1px solid var(--danger);color:var(--danger-text);padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px;font-family:inherit;">Remover</button>
    </div>`;
  }).join('');
}


window.saveEstoqueIdeal = function(){
  const v = parseInt(document.getElementById('cfg-estoque-ideal').value);
  if(!v || v<1 || v>999){ _toast('Informe um valor entre 1 e 999 dias.', 'aviso'); return; }
  setEstoqueIdeal(v, _baseAdminSelecionada);
  _auditLog('admin_estoque', {base: _baseAdminSelecionada, valor: v});
  const msg = document.getElementById('cfg-ei-msg');
  msg.style.opacity='1';
  setTimeout(()=>{ msg.style.opacity='0'; }, 2000);
};

window.addGpcSupplier=function(n){
  const list=getGpcSuppliers(_baseAdminSelecionada);
  if(!list.includes(n)){list.push(n);saveGpcSuppliers(list,_baseAdminSelecionada);_auditLog('admin_gpc_add',{base:_baseAdminSelecionada, fornecedor:n});renderAdmList();}
};
window.removeGpcSupplier=function(n){
  const list=getGpcSuppliers(_baseAdminSelecionada).filter(x=>x!==n);
  saveGpcSuppliers(list,_baseAdminSelecionada);_auditLog('admin_gpc_rem',{base:_baseAdminSelecionada, fornecedor:n});renderAdmList();
};
window.resetGpcList=async function(){
  const ok = await _confirm('Restaurar a lista padrão de fornecedores do grupo para esta base?', {titulo:'Restaurar fornecedores GPC', btnOk:'Restaurar padrão', perigo:true});
  if(!ok) return;
  saveGpcSuppliers([...GPC_DEFAULTS],_baseAdminSelecionada);
  _auditLog('admin_gpc_reset',{base:_baseAdminSelecionada});
  renderAdmList();
};

// ================================================================
// FORNECEDORES GPC — análise dos fornecedores internos
// ================================================================
// [legado] renderFornGPC removido em v4.2 — substituído por renderFornGPCNovo

// ================================================================
// EXPORTAÇÃO XLSX
// ================================================================
document.getElementById('btn-xlsx').addEventListener('click',()=>{
  // Guarda: se Compras não tem dados (D._placeholder=true), exportação não é possível
  if(!D || D._placeholder){
    _toast('Não há dados de Compras para exportar.', 'aviso');
    return;
  }
  const wb=XLSX.utils.book_new();
  const evo=getEvo();
  const tv=evo.reduce((s,e)=>s+e.vdo,0);
  const tl=evo.reduce((s,e)=>s+e.luc,0);
  const tc_liq=evo.reduce((s,e)=>s+comLiq(e.com,e.dvf),0);

  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([
    ['RESUMO EXECUTIVO — GPC ' + (_filialAtual ? _filialAtual.sigla.toUpperCase() : 'CONSOLIDADO')],
    ['Período',[...activePers].sort().join(', ')],['Filtro dept',activeDept||'Todos'],[''],
    ['INDICADOR','VALOR'],
    ['Faturamento líquido',tv],['Lucro bruto',tl],['Margem %',tv>0?tl/tv*100:0],
    ['Compras líquidas',tc_liq],['Cobertura %',tv>0?tc_liq/tv*100:0],
    ['Já pago',D.meta.total_pago],['Em aberto',D.meta.total_aberto],
    ['% Pago',D.meta.pct_pago],['Estoque',D.meta.total_est],['SKUs',D.meta.qt_skus],[''],
    ['EVOLUÇÃO MENSAL'],
    ['Mês','Vendas líq.','Lucro','Margem %','Compras líq.','Cob. %','Pago','Em aberto','Dev.cli.','Dev.forn.'],
    ...evo.map(e=>{const cl=comLiq(e.com,e.dvf);return[e.m,e.vdo,e.luc,e.marg,cl,e.vdo>0?cl/e.vdo*100:0,e.pag,e.abr,e.dvc,e.dvf];}),
  ]),'Resumo');

  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([
    ['DEPARTAMENTOS'],['Departamento','Faturamento líq.','Margem %','Compras líq.','Cob. %','% Pago','Estoque','Dev.cli.','Dev.forn.','SKUs','c/Prej.'],
    ...D.departamentos.map(d=>{const cl=comLiq(d.com,d.dvf);return[d.n,d.vdo,d.marg,cl,d.vdo>0?cl/d.vdo*100:0,d.pp,d.ev||0,d.dvc,d.dvf,d.ni,d.nip];}),
  ]),'Departamentos');

  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([
    ['FORNECEDORES'],['Fornecedor','Score','Faturamento','Margem %','Compras líq.','% Pago','Dev.cli.','Dev.forn.','SKUs','c/Prej.'],
    ...D.fornecedores.map(f=>[f.n,f.score,f.vdo,f.marg,comLiq(f.com,f.dvf),f.pp,f.dvc,f.dvf,f.ni,f.nip]),
  ]),'Fornecedores');

  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([
    ['AGENDA DE VENCIMENTOS'],['Mês','Valor a pagar','Nº duplicatas'],
    ...D.agenda_venc.map(a=>[a.m,a.vlr,a.n]),
  ]),'Vencimentos');

  const alNames={prejuizo:'Prejuízo',parado:'Est.Parado',ruptura:'Ruptura',mk_baixo:'Markup Baixo',dev_cli:'Dev.Cliente',dev_forn:'Dev.Forn.',crescendo:'Crescendo',queda:'Queda',excesso_compra:'Excesso'};
  Object.entries(D.alertas).forEach(([k,items])=>{
    if(!items.length)return;
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([
      [alNames[k]||k],['Cód.','Produto','Depto','Faturamento','Margem %','Compras líq.','Est.','Cob.dias','% Pago'],
      ...items.map(p=>[p.c,p.d,p.dp,p.tv,p.mp,p.vc-p.vdf,p.eq,p.edc,p.pp]),
    ]),(alNames[k]||k).slice(0,31));
  });

  const diagArea=document.getElementById('diag-content');
  if(diagArea.style.display!=='none'){
    const codEl=diagArea.querySelector('.ph-code');
    const _codTxt = codEl && codEl.textContent;
    const _codMatch = _codTxt && _codTxt.match(/#(\d+)/);
    const cod = _codMatch && _codMatch[1];
    if(cod){
      const p=byC.get(parseInt(cod));
      if(p){
        XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([
          ['RAIO-X: '+p.d],['Código',p.c,'EAN',p.ea||'—'],
          ['Depto',p.dp,'Seção',p.sc||'—'],['Categoria',p.ct||'—','Forn.',p.f||'—'],[''],
          ['VENDAS'],['Mês','Venda líq.','Lucro','Margem %','Qt.vendida'],
          ...PLBL.map((l,i)=>[l,p.sv[i][0],p.sv[i][1],p.sv[i][0]>0?p.sv[i][1]/p.sv[i][0]*100:0,p.sv[i][3]]),[''],
          ['COMPRAS'],['P.médio compra',p.pmc],['P.médio venda',p.pmv],['Markup %',p.mk],[''],
          ['ESTOQUE'],['Qtde',p.eq],['Valor custo',p.ev],['Dias cob.',p.edc],[''],
          ['FINANCEIRO'],['Pago',p.fp],['Em aberto',p.fa],['% Pago',p.pp],[''],
          ['ENTRADAS'],['Data','Fornecedor','NF','Qtde','P.Unit','Total','Pago','Aberto'],
          ...(p.en||[]).map(e=>[e.dt,e.fo,e.nf,e.q,e.pu,e.vlc,e.vlp,e.vla]),
        ]),('RX-'+p.c).slice(0,31));
      }
    }
  }
  const _baseTag = _filialAtual ? _filialAtual.sigla.toUpperCase() : 'CONSOLIDADO';
  const _arq = 'Comercial_GPC_'+_baseTag+'_'+_dataLocal()+'.xlsx';
  XLSX.writeFile(wb, _arq);
  _auditLog('export_xlsx', {arquivo: _arq});
});

document.getElementById('btn-pdf').addEventListener('click',function(){
  // Guarda: se Compras não tem dados, evitar imprimir tela vazia/quebrada
  if(!D || D._placeholder){
    _toast('Não há dados de Compras para exportar como PDF.', 'aviso');
    return;
  }
  const pgAtiva = document.querySelector('.page.active');
  _auditLog('export_pdf', {pagina: pgAtiva ? pgAtiva.id.replace('page-','') : 'desconhecida'});
  window.print();
});

// ================================================================
// INICIALIZAÇÃO
// ================================================================
injectFilterBars();
(function(){
  const perfilU = _getPerfilUsuario();
  // Home oculta nesta versão — abre direto Visão Executiva
  let pgInicial = 'executivo';
  if(perfilU && perfilU.paginasPermitidas && perfilU.paginasPermitidas.length){
    // respeita perfil restrito; se 'executivo' não permitido, usa primeira página permitida
    if(!perfilU.paginasPermitidas.includes('executivo')){
      pgInicial = perfilU.paginasPermitidas.find(function(p){return p !== 'home';}) || 'executivo';
    }
  }
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pageEl = document.getElementById('page-'+pgInicial);
  if(pageEl) pageEl.classList.add('active');
  document.querySelectorAll('.sb-link').forEach(x=>x.classList.remove('active'));
  const sbLink = document.querySelector('.sb-link[data-p="'+pgInicial+'"]');
  if(sbLink) sbLink.classList.add('active');
  renderPage(pgInicial);
  renderedPages.add(pgInicial);
})();

