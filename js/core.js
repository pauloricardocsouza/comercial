// ════════════════════════════════════════════════════════════════════════════
// GPC Comercial · core.js
// ════════════════════════════════════════════════════════════════════════════
// Gerado pela divisão do index.html em v4.6 (etapa #3 da auditoria)
// Carregado via <script src="js/core.js"> no index.html
// IMPORTANTE: ordem de carregamento importa — ver comentário no index.html
// ════════════════════════════════════════════════════════════════════════════



// ================================================================
// GESTÃO DE BASES (ATP, Comercial Pinto, etc)
// ================================================================
let _basesDisponiveis = []; // preenchido ao carregar filiais.json
let _baseAdminSelecionada = null; // base atual escolhida na tela de Administração

function _getBaseFilialAtual(){
  if(!_filialAtual) return null; // consolidado: sem base única
  return _filialAtual.base_sigla || null;
}

function _getBaseAtivaParaConfig(){
  // Retorna a base que deve ser usada para leitura de configurações
  // - Dentro de uma filial: usa a base dessa filial
  // - Consolidado: usa null (leitura retorna apenas da primeira base ou defaults)
  const bf = _getBaseFilialAtual();
  if(bf) return bf;
  // Consolidado: retorna null (lê de todas as bases como união na leitura)
  return null;
}

function _getBasesUsuario(){
  // Quais bases o usuário pode administrar (baseado nas filiais que pode ver)
  const perfil = _getPerfilUsuario();
  if(!perfil) return [];
  const podeVerTodas = !perfil.filiaisPermitidas || perfil.filiaisPermitidas.includes('__todas__');
  const filPermitidas = podeVerTodas ? _filiaisDisponiveis : _filiaisDisponiveis.filter(f => perfil.filiaisPermitidas.includes(f.sigla));
  const basesSet = new Set(filPermitidas.map(f => f.base_sigla).filter(Boolean));
  return _basesDisponiveis.filter(b => basesSet.has(b.sigla));
}


// ================================================================
// SISTEMA DE AUTENTICAÇÃO E PERMISSÕES (MOCK - será substituído por Firebase)
// AVISO: Enquanto AUTH_MODE === 'mock', senhas ficam em localStorage em texto puro.
//        NÃO usar com dados reais de usuários até substituir por Firebase Auth.
// ================================================================
// Escape HTML — previne XSS ao interpolar dados em HTML
const esc = (s) => {
  if(s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
};
// Escape para atributos HTML (value="..." etc.) — mais restritivo
const escAttr = (s) => esc(s);
// Escape para strings dentro de JavaScript embutido em onclick/etc.
const escJs = (s) => {
  if(s === null || s === undefined) return '';
  return String(s)
    .replace(/\\/g,'\\\\')
    .replace(/'/g,"\\'")
    .replace(/"/g,'\\"')
    .replace(/\n/g,'\\n')
    .replace(/\r/g,'\\r')
    .replace(/</g,'\\u003c');
};
// Escape para URLs em href/src - bloqueia esquemas perigosos (javascript:, data:, vbscript:)
const escUrl = (s) => {
  if(s === null || s === undefined || s === '') return '#';
  const str = String(s).trim();
  if(!str) return '#';
  // Blacklist de esquemas perigosos (case-insensitive)
  if(/^(javascript|data|vbscript|file|blob):/i.test(str)){
    return '#';
  }
  // Permite URLs seguras: http/https, mailto, tel, #, ?, /, e paths relativos sem ':'
  if(/^(https?:|mailto:|tel:|#|\?|\/)/i.test(str) || !/:/.test(str)){
    return escAttr(str);
  }
  return '#';
};


// ================================================================
// TOAST E CONFIRM CUSTOMIZADOS · UX consistente em mobile + identidade R2
// ================================================================
// _toast(msg, tipo): mostra notificação não-bloqueante no canto, auto-some em 4.5s
//   tipo: 'erro' | 'aviso' | 'sucesso' | 'info' (default)
// _confirm(msg, opts): retorna Promise<boolean>; modal centralizado, ESC/clique-fora cancelam
//   opts: {titulo, btnOk, btnCancel, perigo:bool}

// Garante que o container e os estilos existam (idempotente)
function _ensureToastInfra(){
  if(document.getElementById('_r2_toast_styles')) return;
  const style = document.createElement('style');
  style.id = '_r2_toast_styles';
  style.textContent = ''
    + '#_r2_toast_wrap{position:fixed;top:18px;right:18px;z-index:99999;display:flex;flex-direction:column;gap:8px;max-width:calc(100vw - 36px);pointer-events:none;}'
    + '@media (max-width:560px){#_r2_toast_wrap{top:auto;bottom:18px;left:18px;right:18px;}}'
    + '.r2-toast{pointer-events:auto;background:var(--surface,#fff);border-left:4px solid var(--accent,#2E476F);border:1px solid var(--border,#e4e8ee);border-left-width:4px;box-shadow:0 6px 24px rgba(0,0,0,.12);border-radius:8px;padding:11px 14px 11px 12px;display:flex;align-items:flex-start;gap:10px;min-width:240px;max-width:380px;font-family:"Archivo",sans-serif;animation:r2tIn .25s ease-out;}'
    + '.r2-toast.fade{animation:r2tOut .35s ease-in forwards;}'
    + '.r2-toast.erro{border-left-color:var(--danger-text,#c33);}'
    + '.r2-toast.aviso{border-left-color:var(--warning,#d97706);}'
    + '.r2-toast.sucesso{border-left-color:var(--success-text,#0a7c4a);}'
    + '.r2-toast .r2t-ico{width:18px;height:18px;flex-shrink:0;margin-top:1px;}'
    + '.r2-toast.erro .r2t-ico{color:var(--danger-text,#c33);}'
    + '.r2-toast.aviso .r2t-ico{color:var(--warning,#d97706);}'
    + '.r2-toast.sucesso .r2t-ico{color:var(--success-text,#0a7c4a);}'
    + '.r2-toast.info .r2t-ico{color:var(--accent,#2E476F);}'
    + '.r2-toast .r2t-msg{flex:1;font-size:13px;line-height:1.4;color:var(--text,#1a1a1a);word-break:break-word;}'
    + '.r2-toast .r2t-x{background:transparent;border:none;cursor:pointer;color:var(--text-muted,#6b7280);font-size:18px;line-height:1;padding:0;width:18px;height:18px;flex-shrink:0;}'
    + '.r2-toast .r2t-x:hover{color:var(--text,#1a1a1a);}'
    + '@keyframes r2tIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}'
    + '@keyframes r2tOut{to{opacity:0;transform:translateX(20px);}}'
    + '@media (max-width:560px){@keyframes r2tIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}@keyframes r2tOut{to{opacity:0;transform:translateY(20px);}}}'
    + '#_r2_modal_wrap{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99998;display:flex;align-items:center;justify-content:center;padding:20px;animation:r2mFade .2s ease-out;}'
    + '@keyframes r2mFade{from{opacity:0;}to{opacity:1;}}'
    + '.r2-modal{background:var(--surface,#fff);border-radius:12px;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3);overflow:hidden;font-family:"Archivo",sans-serif;}'
    + '.r2-modal .r2m-hdr{padding:16px 20px 4px;font-size:15px;font-weight:700;color:var(--text,#1a1a1a);}'
    + '.r2-modal .r2m-msg{padding:8px 20px 18px;font-size:13px;line-height:1.5;color:var(--text-dim,#444);white-space:pre-wrap;}'
    + '.r2-modal .r2m-foot{padding:12px 20px;background:var(--surface-2,#f6f7f8);border-top:1px solid var(--border,#e4e8ee);display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;}'
    + '.r2-modal .r2m-btn{padding:8px 16px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;border:1px solid var(--border-strong,#d1d5db);background:var(--surface,#fff);color:var(--text,#1a1a1a);}'
    + '.r2-modal .r2m-btn:hover{background:var(--surface-2,#f6f7f8);}'
    + '.r2-modal .r2m-btn.primary{background:var(--accent,#2E476F);color:#fff;border-color:var(--accent,#2E476F);}'
    + '.r2-modal .r2m-btn.primary:hover{filter:brightness(.92);}'
    + '.r2-modal .r2m-btn.danger{background:var(--danger-text,#c33);color:#fff;border-color:var(--danger-text,#c33);}'
    + '.r2-modal .r2m-btn.danger:hover{filter:brightness(.92);}';
  document.head.appendChild(style);

  let wrap = document.getElementById('_r2_toast_wrap');
  if(!wrap){
    wrap = document.createElement('div');
    wrap.id = '_r2_toast_wrap';
    document.body.appendChild(wrap);
  }
}

const _R2_ICONS = {
  erro:    '<svg class="r2t-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  aviso:   '<svg class="r2t-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  sucesso: '<svg class="r2t-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  info:    '<svg class="r2t-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
};

function _toast(msg, tipo){
  _ensureToastInfra();
  if(!tipo || !_R2_ICONS[tipo]) tipo = 'info';
  const wrap = document.getElementById('_r2_toast_wrap');
  const t = document.createElement('div');
  t.className = 'r2-toast ' + tipo;
  t.innerHTML = _R2_ICONS[tipo]
    + '<div class="r2t-msg">' + esc(msg) + '</div>'
    + '<button class="r2t-x" aria-label="Fechar">&times;</button>';
  const close = function(){
    if(t._closed) return;
    t._closed = true;
    t.classList.add('fade');
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 350);
  };
  t.querySelector('.r2t-x').addEventListener('click', close);
  wrap.appendChild(t);
  setTimeout(close, tipo === 'erro' ? 6000 : 4500); // erros ficam um pouco mais
  return t;
}

function _confirm(msg, opts){
  _ensureToastInfra();
  opts = opts || {};
  return new Promise(function(resolve){
    const wrap = document.createElement('div');
    wrap.id = '_r2_modal_wrap';
    const m = document.createElement('div');
    m.className = 'r2-modal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    const titulo = opts.titulo || 'Confirmação';
    const btnOk = opts.btnOk || 'Confirmar';
    const btnCancel = opts.btnCancel || 'Cancelar';
    const okClass = opts.perigo ? 'danger' : 'primary';
    m.innerHTML = ''
      + '<div class="r2m-hdr">' + esc(titulo) + '</div>'
      + '<div class="r2m-msg">' + esc(msg) + '</div>'
      + '<div class="r2m-foot">'
      +   '<button type="button" class="r2m-btn" data-act="cancel">' + esc(btnCancel) + '</button>'
      +   '<button type="button" class="r2m-btn ' + okClass + '" data-act="ok">' + esc(btnOk) + '</button>'
      + '</div>';
    wrap.appendChild(m);
    const close = function(result){
      if(wrap._closed) return;
      wrap._closed = true;
      document.removeEventListener('keydown', escHandler);
      if(wrap.parentNode) wrap.parentNode.removeChild(wrap);
      resolve(result);
    };
    const escHandler = function(e){ if(e.key === 'Escape') close(false); };
    document.addEventListener('keydown', escHandler);
    wrap.addEventListener('click', function(e){ if(e.target === wrap) close(false); });
    m.querySelector('[data-act="cancel"]').addEventListener('click', function(){ close(false); });
    m.querySelector('[data-act="ok"]').addEventListener('click', function(){ close(true); });
    document.body.appendChild(wrap);
    // Foca no botão OK por padrão (UX: enter confirma)
    setTimeout(function(){ const ok = m.querySelector('[data-act="ok"]'); if(ok) ok.focus(); }, 50);
  });
}


const AUTH_MODE = 'firebase'; // 'mock' | 'firebase'

// ================================================================
// VERSÃO DO SISTEMA
// ================================================================
// Convenção:
//   X.x → alteração grande (quebra de compatibilidade, nova feature grande)
//   x.X → alteração suave (fix, ajuste visual, pequeno refinamento)
const APP_VERSION = '4.58-comercial';

// ================================================================
// HELPERS DE CHART.JS — compatíveis com Safari/iOS (sem spread ops)
// ================================================================
// tt(opts): retorna opts como estão (era usado para mesclar configs sem spread)
// Hoje funciona como passthrough mantendo compatibilidade com chamadas existentes
function tt(opts){ return opts || {}; }

// scalesXY(scales): retorna o objeto de scales como está
// Centraliza ponto de extensão futura caso precise normalizar opções
function scalesXY(scales){ return scales || {}; }

// ================================================================
// CONFIGURAÇÃO FIREBASE
// ================================================================
// Inicializado no HTML via SDK compat (firebase-app-compat.js, firebase-auth-compat.js, firebase-firestore-compat.js)
// Em AUTH_MODE === 'firebase', window.fbAuth e window.fbDb já estão prontos
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD4MtSGGCR5AolDgj8xH6gmdDvNqDLjuOA",
  authDomain: "gpcomercial-7816f.firebaseapp.com",
  projectId: "gpcomercial-7816f",
  storageBucket: "gpcomercial-7816f.firebasestorage.app",
  messagingSenderId: "1038933221657",
  appId: "1:1038933221657:web:c32120afd954f482186588"
};

// Cache em memória de usuarios/perfis (reduz queries ao Firestore)
const _fbCache = {
  usuarios: null,         // array
  usuariosTs: 0,
  perfis: null,           // object {admin, gestor, visualizador}
  perfisTs: 0,
  ttlMs: 30000            // 30s
};
function _fbCacheInvalidate(){
  _fbCache.usuarios = null;
  _fbCache.perfis = null;
}

// Audit log: mock -> só console; firebase -> escreve em auditLog
// Fire-and-forget: não bloqueia UI
function _auditLog(tipo, detalhes, identidadeOverride){
  try {
    const ident = identidadeOverride || _getSessao();
    const log = {
      timestamp: new Date().toISOString(),
      uid: ident ? ident.uid : 'anonymous',
      email: ident ? ident.email : null,
      nome: ident ? ident.nome : null,
      tipo: tipo,
      detalhes: detalhes || null,
      contexto: {
        filial: _filialAtual ? _filialAtual.sigla : null,
        snapshot: _snapshotCarregado ? _snapshotCarregado.data : null,
        url: window.location.pathname + window.location.search
      }
    };
    if(window.console && console.debug) console.debug('[AUDIT]', tipo, detalhes||'', log);
    if(AUTH_MODE === 'firebase' && window.fbDb){
      // Fire-and-forget (não await)
      window.fbDb.collection('auditLog').add(log).catch(function(e){
        console.warn('Falha ao registrar audit log:', e);
      });
    }
  } catch(e){
    console.warn('_auditLog erro:', e);
  }
}


// ================================================================
// SUPERVISORES IGNORADOS POR PÁGINA · service layer v2 (v4.37)
// ================================================================
// Estrutura no Firestore: config/supervisores_loja_v2
//   { paginas: { 'v-diarias': { 'CP1': [9, 11], 'ATP-V': [] }, ... } }
// Estrutura no localStorage: chave 'supervisores_ignorados_v2'
//
// Uso nas páginas: _isSupervisorIgnorado(pagina, loja, codSup) → bool
//                  Filtros.vendedoresAtivos(cad, pagina) → array filtrado
//
// IMPORTANTE: agora exige passar a página como primeiro parâmetro.
// Cada página define se quer aplicar o filtro chamando com seu próprio id.
// Páginas que NÃO chamam o filtro consideram TODOS os supervisores.
//
// Catálogo de páginas que podem ter o filtro aplicado (pra UI do admin):
// IMPORTANTE: o `id` deve bater com o id usado nas chamadas de _isSupervisorIgnorado
// e Filtros.vendedoresAtivos dentro de cada página.
//
// Campo `aplicaFiltro`:
//   - true: a página já consulta a configuração e respeita os supervisores ignorados
//   - false: a configuração é salva mas não tem efeito ainda (página não chama o filtro)
//
// Páginas com `aplicaFiltro: false` aparecem no admin pra você poder pré-configurar
// caso o comportamento da página mude no futuro. Hoje, marcar supervisor ali não muda nada.
//
// IMPORTANTE: o catálogo lista APENAS páginas que efetivamente aplicam o filtro
// (aplicaFiltro:true). Páginas que não consultam o filtro foram removidas do catálogo
// pra não criar a impressão errada de que marcar lá tem efeito.
//
// Hoje só 3 páginas filtram supervisores ignorados:
//   - recebimentos (Inadimplência)
//   - v-benchmarking (RCA)
//   - v-drilldown (Drill-Down por Vendedor)
//
// Quando uma página nova começar a aplicar o filtro, basta adicioná-la aqui.
//
// A ORDEM aqui segue a ordem do menu lateral (index.html). Mantenha sincronizado.
//
// DUAS CATEGORIAS de aplicação do filtro:
//
// 1) DIRETO (_isSupervisorIgnorado): páginas que iteram V.vendedores e excluem
//    linhas individuais. Ex: RCA, Drill-Down, Inadimplência.
//
// 2) AGREGADO (Filtros.fatLiqIgnoradoPorLojaYm): páginas que usam V.mensal
//    (agregado sem cod_supervisor). Subtraímos a parcela de venda dos
//    supervisores ignorados via cruzamento com V.vendedores.mensal.
//
// IMPORTANTE: só inclua aqui páginas onde o filtro REALMENTE aplica no
// resultado visível. Páginas baseadas em E.produtos (Estoque, Excesso,
// Departamentos por SKU, Curva ABC, Fornecedores) NÃO têm como descontar
// supervisor — o ETL não traz vendedor por SKU. Não inclua essas.
// Páginas baseadas em V.diario (Vendas Diárias, Dias C&P) também não.
const _SUP_IGN_PAGINAS_CATALOGO = [
  // Compras (cv consome via getEvo + V.mensal)
  {id:'cv',             label:'Compras × Vendas',        grupo:'Compras',      aplicaFiltro:true},
  // Vendas (todas usam V.mensal via _vendasMensalPor com pagina, ou aplicaFiltroSupVMensalRow)
  {id:'executivo',      label:'Visão executiva',         grupo:'Vendas',       aplicaFiltro:true},
  {id:'v-visao-grupo',  label:'Visão Consolidada',       grupo:'Vendas',       aplicaFiltro:true},
  {id:'v-evolucao',     label:'Evolução Mensal',         grupo:'Vendas',       aplicaFiltro:true},
  {id:'recebimentos',   label:'Inadimplência',           grupo:'Vendas',       aplicaFiltro:true},
  {id:'v-benchmarking', label:'RCA',                     grupo:'Vendas',       aplicaFiltro:true},
  {id:'v-ano2026',      label:'Análise 2026',            grupo:'Vendas',       aplicaFiltro:true},
  {id:'v-drilldown',    label:'Drill-Down por Vendedor', grupo:'Vendas',       aplicaFiltro:true},
];

let _supIgnoradosCache = null;     // {paginas: {pagina: {loja: [cod, ...]}}}
let _supIgnoradosLoading = null;
const SUP_IGN_LS_KEY = 'supervisores_ignorados_v2';

async function _carregarSupervisoresIgnorados(){
  if(_supIgnoradosCache) return _supIgnoradosCache;
  if(_supIgnoradosLoading) return _supIgnoradosLoading;

  _supIgnoradosLoading = (async function(){
    // Tenta Firestore primeiro
    if(AUTH_MODE === 'firebase' && window.fbDb){
      try {
        const doc = await window.fbDb.collection('config').doc('supervisores_loja_v2').get();
        if(doc.exists){
          const data = doc.data();
          _supIgnoradosCache = {paginas: (data && data.paginas) || {}};
          // Sincroniza localStorage
          try { localStorage.setItem(SUP_IGN_LS_KEY, JSON.stringify(_supIgnoradosCache)); } catch(e){}
          return _supIgnoradosCache;
        }
      } catch(e){
        console.warn('[supIgn] erro ao ler Firestore, caindo pro cache local:', e.message);
      }
    }
    // Fallback: localStorage
    try {
      const raw = localStorage.getItem(SUP_IGN_LS_KEY);
      _supIgnoradosCache = raw ? JSON.parse(raw) : {paginas:{}};
      // Garante shape
      if(!_supIgnoradosCache.paginas) _supIgnoradosCache.paginas = {};
    } catch(e){
      _supIgnoradosCache = {paginas:{}};
    }
    return _supIgnoradosCache;
  })();

  return _supIgnoradosLoading;
}

async function _salvarSupervisoresIgnorados(novoMapa){
  // novoMapa esperado: {paginas: {pagina: {loja: [cods]}}}
  if(!novoMapa) novoMapa = {paginas:{}};
  if(!novoMapa.paginas) novoMapa.paginas = {};
  _supIgnoradosCache = novoMapa;
  // Invalida cache do helper agregado, que indexa por (pagina, cfg snapshot)
  if(typeof Filtros !== 'undefined'){
    Filtros._fatIgnCache = null;
    Filtros._fatIgnCacheKey = null;
  }
  // Invalida cache do evo, que depende de V/C/F mas também do filtro aplicado
  _evoCache = null;
  _evoCacheKey = null;
  // localStorage sempre
  try { localStorage.setItem(SUP_IGN_LS_KEY, JSON.stringify(_supIgnoradosCache)); } catch(e){}
  // Firestore se disponível
  if(AUTH_MODE === 'firebase' && window.fbDb){
    // Força refresh do token antes de salvar pra garantir que as regras
    // mais recentes valham (token velho pode trazer decisões obsoletas).
    try {
      if(window.fbAuth && window.fbAuth.currentUser){
        await window.fbAuth.currentUser.getIdToken(true);
      }
    } catch(eRefresh){
      console.warn('[supIgn] aviso: falha ao refrescar token, segue com token atual:', eRefresh.message);
    }
    try {
      await window.fbDb.collection('config').doc('supervisores_loja_v2').set({
        paginas: _supIgnoradosCache.paginas,
        atualizado_em: new Date().toISOString(),
        atualizado_por: (_getSessao() || {}).email || 'desconhecido'
      });
      _auditLog('config_save', {tipo:'supervisores_loja_v2', mapa:_supIgnoradosCache});
      return {ok:true};
    } catch(e){
      // Se erro de permissão, tenta forçar reload do token uma vez e refazer
      if(e && e.code === 'permission-denied' && window.fbAuth && window.fbAuth.currentUser){
        try {
          await window.fbAuth.currentUser.getIdToken(true);
          await window.fbDb.collection('config').doc('supervisores_loja_v2').set({
            paginas: _supIgnoradosCache.paginas,
            atualizado_em: new Date().toISOString(),
            atualizado_por: (_getSessao() || {}).email || 'desconhecido'
          });
          _auditLog('config_save', {tipo:'supervisores_loja_v2', mapa:_supIgnoradosCache, retry:true});
          return {ok:true, retry:true};
        } catch(e2){
          console.error('[supIgn] erro ao salvar no Firestore (após retry):', e2);
          return {ok:false, erro:e2.message+' (token foi refrescado e ainda assim falhou — verifique as regras Firestore)'};
        }
      }
      console.error('[supIgn] erro ao salvar no Firestore:', e);
      return {ok:false, erro:e.message};
    }
  }
  return {ok:true, modo:'local'};
}

/**
 * Verifica se supervisor está marcado como ignorado naquela página + loja.
 * @param {string} pagina  - id da página (ex: 'v-diarias'). Páginas que não chamam essa função consideram TODOS os supervisores.
 * @param {string} loja    - código da loja (ex: 'CP1', 'ATP-V')
 * @param {number|string} codSup - código do supervisor
 * @returns {boolean} true se está ignorado
 *
 * Função primitiva — em código novo, prefira `Filtros.vendedorEhValido(cad, pagina)`.
 */
function _isSupervisorIgnorado(pagina, loja, codSup){
  if(!_supIgnoradosCache || !pagina || !loja || codSup == null) return false;
  const paginas = _supIgnoradosCache.paginas || {};
  const cfgPag = paginas[pagina];
  if(!cfgPag) return false;
  const lst = cfgPag[loja];
  if(!Array.isArray(lst) || lst.length === 0) return false;
  return lst.indexOf(Number(codSup)) >= 0;
}

/** Extrai supervisores únicos por loja a partir de V.vendedores.cadastro. */
function _getSupervisoresPorLoja(){
  if(!V || !V.vendedores || !V.vendedores.cadastro) return {};
  const por_loja = {};
  V.vendedores.cadastro.forEach(function(v){
    if(!v.loja || v.cod_supervisor == null) return;
    if(!por_loja[v.loja]) por_loja[v.loja] = new Map();
    por_loja[v.loja].set(Number(v.cod_supervisor), v.supervisor || '');
  });
  // Converte Map em array ordenado
  const out = {};
  Object.keys(por_loja).forEach(function(l){
    out[l] = Array.from(por_loja[l].entries())
      .map(function(e){ return {cod: e[0], nome: e[1]}; })
      .sort(function(a,b){ return a.cod - b.cod; });
  });
  return out;
}

/** Igual _getSupervisoresPorLoja mas carrega vendas_grupo.json (todas as bases)
 *  pra retornar supervisores de TODAS as filiais (ATP-V, ATP-A, CP1, CP3, CP5, CP40),
 *  independente da base atual da sessão.
 *
 *  Prioriza o campo `supervisores_por_filial` (novo, gerado a partir do FATO de vendas)
 *  que mostra TODAS as combinações filial×supervisor que efetivamente existem nos dados.
 *  Esse campo cobre o caso de RCAs cadastrados em CP1 mas que vendem majoritariamente
 *  em CP40 (situação comum no WinThor) — o cubo registra a venda na filial real,
 *  então o admin precisa listar o supervisor naquela filial.
 *
 *  Fallback: se o JSON antigo não tiver `supervisores_por_filial`, agrega do cadastro
 *  como antes (limitação: cada RCA só aparece na sua loja cadastrada).
 *
 *  Cacheia em _supLojaCompletoCache. Usado pela UI de supervisores ignorados em Admin.
 */
let _supLojaCompletoCache = null;
let _supLojaCompletoLoading = null;
async function _getSupervisoresPorLojaCompleto(){
  if(_supLojaCompletoCache) return _supLojaCompletoCache;
  if(_supLojaCompletoLoading) return _supLojaCompletoLoading;

  _supLojaCompletoLoading = (async function(){
    let dados = null;
    try {
      const data = await _fetchJsonComGz('vendas_grupo.json');
      if(data && data.vendedores){
        dados = data.vendedores;
      }
    } catch(e){
      console.warn('[supervisores] vendas_grupo.json não disponível, caindo no V atual:', e.message);
    }

    // Fallback: usa V atual se vendas_grupo não estiver disponível
    if(!dados && V && V.vendedores){
      dados = V.vendedores;
    }
    if(!dados){
      _supLojaCompletoCache = {};
      return _supLojaCompletoCache;
    }

    // Prioriza supervisores_por_filial (gerado do FATO — mais completo)
    if(dados.supervisores_por_filial){
      const out = {};
      Object.keys(dados.supervisores_por_filial).forEach(function(fil){
        out[fil] = dados.supervisores_por_filial[fil].map(function(s){
          return {cod: Number(s.cod), nome: s.nome || ''};
        });
        out[fil].sort(function(a,b){ return a.cod - b.cod; });
      });
      _supLojaCompletoCache = out;
      return _supLojaCompletoCache;
    }

    // Fallback antigo: agrega do cadastro
    const cad = dados.cadastro || [];
    const por_loja = {};
    cad.forEach(function(v){
      if(!v.loja || v.cod_supervisor == null) return;
      if(!por_loja[v.loja]) por_loja[v.loja] = new Map();
      por_loja[v.loja].set(Number(v.cod_supervisor), v.supervisor || '');
    });
    const out = {};
    Object.keys(por_loja).forEach(function(l){
      out[l] = Array.from(por_loja[l].entries())
        .map(function(e){ return {cod: e[0], nome: e[1]}; })
        .sort(function(a,b){ return a.cod - b.cod; });
    });
    _supLojaCompletoCache = out;
    return _supLojaCompletoCache;
  })();

  return _supLojaCompletoLoading;
}

// ================================================================
// FILTROS · regras de domínio centralizadas (etapa #5 da auditoria)
// ================================================================
// Centraliza filtros aplicados em múltiplas páginas pra evitar duplicação
// e facilitar adicionar novas regras (ex: ignorar departamentos específicos).
//
// Uso:
//   Filtros.vendedoresAtivos(V.vendedores.cadastro, 'v-diarias')  → array filtrado
//   Filtros.mensalVendedoresAtivos(V.vendedores, 'v-diarias')     → mensal filtrado
//   Filtros.deptosValidos(V.deptos)                                → sem INATIVO
//   Filtros.vendedorEhValido(cad, 'v-diarias')                     → bool
//   Filtros.codsValidos(cad, 'v-diarias')                          → Set<cod>
//
// IMPORTANTE: o parâmetro `pagina` é OPCIONAL. Se não passado, ignora o filtro
// de supervisores e mantém todos. Cada página decide se quer aplicar.

const Filtros = {
  /**
   * Vendedor é válido se:
   * - tem cod_supervisor (não é null)
   * - tem loja
   * - se `pagina` foi passada: o (pagina, loja, supervisor) NÃO está marcado como ignorado
   *   se `pagina` for null/undefined: ignora a regra de supervisores e considera todos
   */
  vendedorEhValido: function(cad, pagina){
    if(!cad) return false;
    if(cad.cod_supervisor == null) return false;
    if(!cad.loja) return false;
    if(pagina && _isSupervisorIgnorado(pagina, cad.loja, cad.cod_supervisor)) return false;
    return true;
  },

  /**
   * Filtra V.vendedores.cadastro removendo vendedores cujo (pagina, loja, supervisor)
   * está marcado como ignorado, ou que não têm cod_supervisor.
   * Se `pagina` for omitida, retorna todos os com cod_supervisor não-nulo.
   */
  vendedoresAtivos: function(cadastro, pagina){
    if(!Array.isArray(cadastro)) return [];
    return cadastro.filter(function(c){ return Filtros.vendedorEhValido(c, pagina); });
  },

  /**
   * Retorna Set<cod> dos vendedores ativos (útil pra cruzar com .mensal).
   * Aceita V.vendedores ou um cadastro direto.
   */
  codsValidos: function(vendedoresOuCadastro, pagina){
    const cad = vendedoresOuCadastro && vendedoresOuCadastro.cadastro
              ? vendedoresOuCadastro.cadastro
              : vendedoresOuCadastro;
    return new Set(Filtros.vendedoresAtivos(cad, pagina).map(function(v){ return v.cod; }));
  },

  /**
   * Filtra .mensal mantendo apenas linhas de vendedores ativos.
   * Aceita V.vendedores ({cadastro, mensal}) ou um par direto.
   */
  mensalVendedoresAtivos: function(vendedores, pagina){
    if(!vendedores || !Array.isArray(vendedores.mensal)) return [];
    const cods = Filtros.codsValidos(vendedores.cadastro || [], pagina);
    return vendedores.mensal.filter(function(r){ return cods.has(r.cod); });
  },

  /**
   * Filtra V.deptos removendo o departamento "INATIVO" (cod=11)
   * que é usado pra agrupamento administrativo no WinThor mas não
   * representa venda real.
   */
  deptosValidos: function(deptos){
    if(!Array.isArray(deptos)) return [];
    return deptos.filter(function(d){
      if(d.nome === 'INATIVO') return false;
      return true;
    });
  },

  /**
   * Helper auxiliar: filtra qualquer linha de vendedor cruzando com cadastro.
   * Útil quando o array de mensal vem solto e você tem o cadIdx pronto.
   * @param {object} cadIdx - mapa { cod → cadastro }
   * @returns true se vendedor existe no cadastro E é válido
   */
  cruzaComCadastroValido: function(cod, cadIdx){
    const cad = cadIdx && cadIdx[cod];
    return Filtros.vendedorEhValido(cad);
  },

  /**
   * Calcula o agregado de fat_liq, lucro, devol, qt e nfs dos supervisores
   * IGNORADOS na página `pagina`, indexado por (loja, ym).
   *
   * Usado por agregados que não têm cod_supervisor (V.mensal, V.deptos etc):
   * basta SUBTRAIR esse delta do total agregado.
   *
   * Ambiguidade: V.vendedores.mensal não traz `loja`, e ~12 cods aparecem em
   * mais de uma loja. Estratégia:
   *   - cods com loja única no cadastro: atribuição direta
   *   - cods em múltiplas lojas: rateamos proporcionalmente ao fat_liq dessas
   *     lojas em V.mensal naquele ym (o fat agregado da loja é a verdade).
   *   - se TODAS as lojas onde o cod aparece tiverem o supervisor ignorado:
   *     subtrai 100%. Se NENHUMA: 0%.
   *
   * FONTE AUTORITATIVA: V.vendedores.supervisores_por_filial[loja][cod].fat_liq
   * traz o TOTAL real do supervisor (gerado direto do FATO de vendas, mais
   * confiável que cruzar cadastro × mensal — porque o cadastro só lista RCAs
   * ATIVOS, deixando supervisores como INATIVOS sem nenhum vendedor associado).
   *
   * Como `supervisores_por_filial` traz só o total acumulado e precisamos
   * ratear por ym, distribuímos proporcionalmente ao perfil de venda da loja
   * (V.mensal[loja].fat_liq por ym ÷ total da loja).
   *
   * Cacheado por (pagina, snapshot do cfg) — recalcula quando user muda admin.
   *
   * @param {string} pagina - id da página (ex: 'cv', 'deptos')
   * @returns {Map<string, {fat_liq, lucro, devol, qt, nfs}>}
   *           chave = "loja|ym"
   */
  fatLiqIgnoradoPorLojaYm: function(pagina){
    if(!pagina || !V || !V.vendedores) return new Map();

    // Cache por (pagina + cfg snapshot)
    const cfgSnap = JSON.stringify(_supIgnoradosCache && _supIgnoradosCache.paginas || {});
    const cacheKey = pagina + '||' + cfgSnap;
    if(Filtros._fatIgnCache && Filtros._fatIgnCacheKey === cacheKey){
      return Filtros._fatIgnCache;
    }

    const out = new Map();
    function getOrInit(k){
      if(!out.has(k)) out.set(k, {fat_liq:0, lucro:0, devol:0, qt:0, nfs:0});
      return out.get(k);
    }

    const spf = V.vendedores.supervisores_por_filial || {};
    const vmensal = V.mensal || [];

    // Pra cada loja, calcular o perfil mensal: pesoLojaYm = fat_liq(loja,ym) / total(loja)
    // (usado pra ratear o total do supervisor pelos ym da loja)
    const pesoLojaYm = new Map();    // "loja|ym" → 0..1
    const totalLoja  = new Map();    // "loja" → total fat_liq
    vmensal.forEach(function(r){
      totalLoja.set(r.loja, (totalLoja.get(r.loja)||0) + (r.fat_liq||0));
    });
    vmensal.forEach(function(r){
      const tot = totalLoja.get(r.loja) || 0;
      pesoLojaYm.set(r.loja+'|'+r.ym, tot>0 ? (r.fat_liq||0)/tot : 0);
    });

    // Pra cada (loja, supervisor) ignorado, distribuir o total pelos ym da loja
    Object.keys(spf).forEach(function(loja){
      const sups = spf[loja] || [];
      sups.forEach(function(s){
        const cod = Number(s.cod);
        if(!_isSupervisorIgnorado(pagina, loja, cod)) return;
        const fat = s.fat_liq || 0;
        if(fat <= 0) return;
        // Distribui pelos ym da loja
        const ymsDaLoja = vmensal.filter(function(r){return r.loja === loja;});
        ymsDaLoja.forEach(function(r){
          const peso = pesoLojaYm.get(r.loja+'|'+r.ym) || 0;
          if(peso <= 0) return;
          const k = r.loja+'|'+r.ym;
          const acc = getOrInit(k);
          acc.fat_liq += fat * peso;
          // Lucro/qt/nfs: aproximamos pela margem média da loja naquele ym
          const margemYm = (r.fat_liq||0) > 0 ? (r.lucro||0)/(r.fat_liq||0) : 0;
          acc.lucro   += fat * peso * margemYm;
          // qt/nfs: rateio proporcional ao fat_liq da loja no ym (aproximação)
          if((r.fat_liq||0) > 0){
            acc.qt    += (r.qt||0)  * (fat * peso) / (r.fat_liq||0);
            acc.nfs   += Math.round((r.nfs||0) * (fat * peso) / (r.fat_liq||0));
          }
        });
      });
    });

    Filtros._fatIgnCache = out;
    Filtros._fatIgnCacheKey = cacheKey;
    return out;
  },

  /**
   * Soma o delta a subtrair em todas as lojas/ym, dado um filtro de pagina.
   * Útil pra um total agregado simples.
   * @returns {{fat_liq, lucro, devol, qt, nfs}}
   */
  fatLiqIgnoradoTotal: function(pagina, lojaFilter, ymSet){
    const m = Filtros.fatLiqIgnoradoPorLojaYm(pagina);
    const acc = {fat_liq:0, lucro:0, devol:0, qt:0, nfs:0};
    m.forEach(function(v, k){
      const parts = k.split('|');
      const loja = parts[0], ym = parts[1];
      if(lojaFilter && loja !== lojaFilter) return;
      if(ymSet && !ymSet.has(ym)) return;
      acc.fat_liq += v.fat_liq;
      acc.lucro   += v.lucro;
      acc.devol   += v.devol;
      acc.qt      += v.qt;
      acc.nfs     += v.nfs;
    });
    return acc;
  },
};

// Expor pra console pra debug
window._supIgnDebug = function(){ return _supIgnoradosCache; };

/**
 * Helper de uso geral pelas páginas de Vendas: aplica desconto de supervisores
 * ignorados em uma linha de V.mensal (ou similar com {loja, ym, fat_liq, lucro, qt, nfs}).
 *
 * @param {object} r - linha original com {loja, ym, fat_liq, lucro, qt, nfs}
 * @param {string} pagina - id da página
 * @returns {object} cópia da linha com valores descontados (não-negativos)
 */
function aplicaFiltroSupVMensalRow(r, pagina){
  if(!pagina || !r) return r;
  const m = Filtros.fatLiqIgnoradoPorLojaYm(pagina);
  if(!m || !m.size) return r;
  const d = m.get((r.loja||'')+'|'+(r.ym||''));
  if(!d) return r;
  return {
    loja: r.loja, ym: r.ym,
    fat_brt: r.fat_brt,  // não temos como descontar, mantém
    fat_liq: Math.max(0, (r.fat_liq||0) - d.fat_liq),
    devol:   r.devol,    // sem quebra por vendedor; mantém
    lucro:   (r.lucro||0) - d.lucro,
    marg:    null,       // recalcular fora se precisar
    qt:      Math.max(0, (r.qt||0) - d.qt),
    nfs:     Math.max(0, (r.nfs||0) - d.nfs),
    clientes_pdv: r.clientes_pdv,
    skus: r.skus,
    vendedores_ativos: r.vendedores_ativos,
    cmv: r.cmv,
    qt_dev: r.qt_dev
  };
}
window.aplicaFiltroSupVMensalRow = aplicaFiltroSupVMensalRow;


// ================================================================
// AUTH ADAPTER — unifica mock e firebase
// ================================================================
async function _getUsuarios(){
  if(AUTH_MODE === 'firebase') return await _getUsuariosFirebase();
  return _getUsuariosMock();
}
async function _getPerfis(){
  if(AUTH_MODE === 'firebase') return await _getPerfisFirebase();
  return _getPerfisCustom();
}
async function _savePerfil(key, perfil){
  if(AUTH_MODE === 'firebase') return await _savePerfilFirebase(key, perfil);
  const atual = _getPerfisCustom();
  atual[key] = perfil;
  _savePerfisCustom(atual);
  return {ok:true};
}
async function _saveUsuario(u){
  if(AUTH_MODE === 'firebase') return await _saveUsuarioFirebase(u);
  const arr = _getUsuariosMock();
  const idx = arr.findIndex(x => x.uid === u.uid);
  if(idx >= 0) arr[idx] = u; else arr.push(u);
  _saveUsuariosMock(arr);
  return {ok:true};
}
async function _doLogin(email, senha){
  if(AUTH_MODE === 'firebase') return await _doLoginFirebase(email, senha);
  return await _doLoginMock(email, senha);
}
async function _trocarSenha(uid, novaSenha){
  if(AUTH_MODE === 'firebase') return await _trocarSenhaFirebase(uid, novaSenha);
  return await _trocarSenhaMock(uid, novaSenha);
}

// ================================================================
// IMPLEMENTAÇÃO FIREBASE
// ================================================================
async function _doLoginFirebase(email, senha){
  if(!window.fbAuth || !window.fbDb){
    return {ok:false, erro:'Firebase não inicializado. Recarregue a página.'};
  }
  // Aguarda setPersistence(LOCAL) completar antes de logar.
  // Sem esse await, em conexões rápidas a sessão pode ficar com persistência
  // SESSION (em memória) em vez de LOCAL, e o user é deslogado ao fechar a aba.
  if(window.fbAuthReady) await window.fbAuthReady;
  try {
    const cred = await window.fbAuth.signInWithEmailAndPassword(email.trim(), senha);
    const uid = cred.user.uid;
    const docSnap = await window.fbDb.collection('usuarios').doc(uid).get();
    if(!docSnap.exists){
      await window.fbAuth.signOut();
      return {ok:false, erro:'Usuário autenticado mas não cadastrado no sistema. Contate o administrador.'};
    }
    const u = Object.assign({uid}, docSnap.data());
    if(!u.ativo){
      await window.fbAuth.signOut();
      return {ok:false, erro:'Usuário inativo. Contate o administrador.'};
    }
    // Atualizar último acesso
    try {
      await window.fbDb.collection('usuarios').doc(uid).update({
        ultimo_acesso: new Date().toISOString()
      });
    } catch(e){ console.warn('Falha ao atualizar ultimo_acesso:', e); }
    _saveSessao(u.uid, u.email, u.nome, u.perfil);
    _fbCacheInvalidate();
    _auditLog('login_ok', {senha_temp: !!u.senha_temp});
    return {ok:true, usuario:u, precisa_trocar_senha: !!u.senha_temp};
  } catch(e){
    let erro = 'Erro de autenticação';
    if(e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') erro = 'Email ou senha incorretos';
    else if(e.code === 'auth/user-not-found') erro = 'Email não encontrado';
    else if(e.code === 'auth/too-many-requests') erro = 'Muitas tentativas falhadas. Aguarde alguns minutos.';
    else if(e.code === 'auth/network-request-failed') erro = 'Sem conexão com o servidor';
    else if(e.code === 'auth/user-disabled') erro = 'Usuário desativado';
    else if(e.code === 'auth/invalid-email') erro = 'Email inválido';
    _auditLog('login_fail', {email: email, motivo: erro, code: e.code||'unknown'});
    return {ok:false, erro: erro};
  }
}

async function _trocarSenhaFirebase(uid, novaSenha){
  if(!novaSenha || novaSenha.length < 6) return {ok:false, erro:'Senha precisa ter pelo menos 6 caracteres'};
  if(!window.fbAuth || !window.fbAuth.currentUser) return {ok:false, erro:'Sessão expirada. Faça login novamente.'};
  // Passo 1: trocar a senha no Firebase Auth (o que realmente importa)
  try {
    await window.fbAuth.currentUser.updatePassword(novaSenha);
  } catch(e){
    let erro = 'Erro ao trocar senha';
    if(e.code === 'auth/weak-password') erro = 'Senha muito fraca';
    else if(e.code === 'auth/requires-recent-login') erro = 'Sessão expirou. Faça login novamente para trocar a senha.';
    return {ok:false, erro: erro};
  }
  // Passo 2: tentar limpar a flag senha_temp no Firestore.
  // Se falhar (permissão), NÃO reverte o passo 1; a senha já foi trocada.
  // A flag será limpa automaticamente no próximo login bem-sucedido
  // (veja _doLoginFirebase, que detecta discrepância e corrige).
  try {
    await window.fbDb.collection('usuarios').doc(uid).update({ senha_temp: false });
  } catch(e){
    console.warn('[trocarSenha] Senha trocada com sucesso, mas falhou ao limpar flag no Firestore:', e && e.message);
    // Não é erro fatal. Continua.
  }
  _fbCacheInvalidate();
  return {ok:true};
}

async function _getUsuariosFirebase(){
  const now = Date.now();
  if(_fbCache.usuarios && (now - _fbCache.usuariosTs) < _fbCache.ttlMs){
    return _fbCache.usuarios;
  }
  if(!window.fbDb) return [];
  try {
    const snap = await window.fbDb.collection('usuarios').get();
    const arr = snap.docs.map(d => Object.assign({uid: d.id}, d.data()));
    _fbCache.usuarios = arr;
    _fbCache.usuariosTs = now;
    return arr;
  } catch(e){
    console.error('Erro ao buscar usuários:', e);
    return _fbCache.usuarios || [];
  }
}

async function _saveUsuarioFirebase(u){
  if(!window.fbDb) return {ok:false, erro:'Firestore não inicializado'};
  try {
    const uid = u.uid;
    if(!uid) return {ok:false, erro:'UID obrigatório'};
    const dados = Object.assign({}, u);
    delete dados.uid; // uid é o ID do documento
    delete dados._senha_mock; // não levar senha mock para firestore
    await window.fbDb.collection('usuarios').doc(uid).set(dados, {merge:true});
    _fbCacheInvalidate();
    return {ok:true};
  } catch(e){
    console.error('Erro ao salvar usuário:', e);
    return {ok:false, erro: e.message || 'Erro desconhecido'};
  }
}

async function _getPerfisFirebase(){
  const now = Date.now();
  if(_fbCache.perfis && (now - _fbCache.perfisTs) < _fbCache.ttlMs){
    return _fbCache.perfis;
  }
  if(!window.fbDb){
    return JSON.parse(JSON.stringify(PERFIS_DEFAULT_TEMPLATE));
  }
  try {
    const snap = await window.fbDb.collection('perfisTemplate').get();
    const obj = {};
    snap.docs.forEach(d => { obj[d.id] = d.data(); });
    // Se algum perfil não existe no Firestore, fallback pro default
    const defaults = PERFIS_DEFAULT_TEMPLATE;
    Object.keys(defaults).forEach(k => {
      if(!obj[k]) obj[k] = JSON.parse(JSON.stringify(defaults[k]));
    });
    _fbCache.perfis = obj;
    _fbCache.perfisTs = now;
    return obj;
  } catch(e){
    console.error('Erro ao buscar perfis:', e);
    return _fbCache.perfis || JSON.parse(JSON.stringify(PERFIS_DEFAULT_TEMPLATE));
  }
}

async function _savePerfilFirebase(key, perfil){
  if(!window.fbDb) return {ok:false, erro:'Firestore não inicializado'};
  try {
    await window.fbDb.collection('perfisTemplate').doc(key).set(perfil);
    _fbCacheInvalidate();
    return {ok:true};
  } catch(e){
    console.error('Erro ao salvar perfil:', e);
    return {ok:false, erro: e.message || 'Erro desconhecido'};
  }
}

// Logout Firebase
async function _logoutFirebase(){
  try {
    if(window.fbAuth) await window.fbAuth.signOut();
  } catch(e){ console.warn('Erro no signOut:', e); }
}

// Catálogo de páginas do sistema (usado pela tela de permissões)
const PAGINAS_CATALOGO = [
  {id:'home',         nome:'Home',                grupo:'Início'},
  {id:'executivo',    nome:'Visão executiva',     grupo:'Compras'},
  {id:'cv',           nome:'Compras × Vendas',    grupo:'Compras'},
  {id:'deptos',       nome:'Departamentos',       grupo:'Compras'},
  {id:'estoque',      nome:'Estoque',             grupo:'Compras'},
  {id:'excesso',      nome:'Excesso de estoque',  grupo:'Compras'},
  {id:'financeiro',   nome:'Financeiro',          grupo:'Compras'},
  {id:'vencidos',     nome:'Vencidos',            grupo:'Compras'},
  {id:'fornecedores', nome:'Fornecedores',        grupo:'Compras'},
  {id:'forn-gpc',     nome:'GPC',                 grupo:'Compras'},
  {id:'abc',          nome:'Curva ABC',           grupo:'Compras'},
  {id:'alertas',      nome:'Alertas',             grupo:'Compras'},
  {id:'diagnostico',  nome:'Diag. Produto',       grupo:'Compras'},
  {id:'diag-forn',    nome:'Diag. Fornecedor',    grupo:'Compras'},
  {id:'v-visao-grupo',    nome:'Visão Consolidada',   grupo:'Vendas'},
  {id:'v-evolucao',       nome:'Evolução Mensal',     grupo:'Vendas'},
  // [removido em v4.13] páginas individuais de loja (v-atp-varejo, v-atp-atacado, v-cestao, v-inh)
  {id:'v-itens',          nome:'Itens & Deptos',      grupo:'Vendas'},
  {id:'v-vendas-diarias', nome:'Vendas Diárias',      grupo:'Vendas'},
  {id:'v-dias-cp',        nome:'Dias C & P',          grupo:'Vendas'},
  {id:'v-metas',          nome:'Metas',               grupo:'Vendas'},
  {id:'v-benchmarking',   nome:'RCA',        grupo:'Vendas'},
  {id:'v-ano2026',        nome:'Análise 2026',        grupo:'Vendas'},
  {id:'cubo',             nome:'Análise Dinâmica',    grupo:'Análise'},
  {id:'historico',    nome:'Histórico',           grupo:'Configuração'},
  {id:'admin',        nome:'Administração',       grupo:'Configuração'},
  {id:'proc',         nome:'Upload de relatórios',grupo:'Processamento'},
  {id:'ajuda',        nome:'Ajuda',               grupo:'Configuração'},
];

// Defaults dos 3 perfis (template inicial — admin pode customizar)
const PERFIS_DEFAULT_TEMPLATE = {
  admin: {
    nome: 'Admin',
    descricao: 'Acesso total ao sistema',
    paginas: PAGINAS_CATALOGO.map(p => p.id),
    filiais: ['__todas__'],
    pode_consolidado: true,
    pode_gerenciar_usuarios: true
  },
  gestor: {
    nome: 'Gestor',
    descricao: 'Vê todas análises, sem gerenciar usuários',
    paginas: PAGINAS_CATALOGO.filter(p => p.id !== 'admin').map(p => p.id),
    filiais: ['__todas__'],
    pode_consolidado: true,
    pode_gerenciar_usuarios: false
  },
  visualizador: {
    nome: 'Visualizador',
    descricao: 'Vê apenas painéis principais',
    paginas: ['executivo','deptos','estoque','fornecedores','v-visao-grupo','v-evolucao','ajuda'],
    filiais: ['__todas__'],
    pode_consolidado: true,
    pode_gerenciar_usuarios: false
  }
};

// MOCK: usuários e perfis em localStorage
function _getPerfisCustom(){
  try {
    const v = localStorage.getItem('perfisTemplate');
    if(v) return JSON.parse(v);
  } catch(e){}
  return JSON.parse(JSON.stringify(PERFIS_DEFAULT_TEMPLATE));
}
function _savePerfisCustom(p){
  try { localStorage.setItem('perfisTemplate', JSON.stringify(p)); } catch(e){}
}

function _getUsuariosMock(){
  try {
    const v = localStorage.getItem('usuariosMock');
    if(v) return JSON.parse(v);
  } catch(e){}
  // Default: admin inicial
  const defaults = [
    {
      uid: 'admin-001',
      email: 'admin@r2.com.br',
      nome: 'Administrador',
      perfil: 'admin',
      paginas_permitidas: null, // null = usa as do perfil
      filiais_permitidas: null,
      ativo: true,
      criado_em: new Date().toISOString(),
      ultimo_acesso: null,
      senha_temp: false,
      // MOCK SOMENTE: senha em texto puro (em produção será hash do Firebase)
      _senha_mock: 'admin123'
    }
  ];
  _saveUsuariosMock(defaults);
  return defaults;
}
function _saveUsuariosMock(u){
  try { localStorage.setItem('usuariosMock', JSON.stringify(u)); } catch(e){}
}

function _getSessao(){
  try {
    const s = localStorage.getItem('sessaoAtual');
    if(s){
      const sess = JSON.parse(s);
      // Verificar expiração (30 dias)
      if(sess.expira_em && new Date(sess.expira_em) > new Date()){
        return sess;
      } else {
        localStorage.removeItem('sessaoAtual');
      }
    }
  } catch(e){}
  return null;
}
function _saveSessao(uid, email, nome, perfil){
  const exp = new Date();
  exp.setDate(exp.getDate() + 30);
  const sess = {
    uid: uid, email: email, nome: nome, perfil: perfil,
    iniciada_em: new Date().toISOString(),
    expira_em: exp.toISOString()
  };
  try { localStorage.setItem('sessaoAtual', JSON.stringify(sess)); } catch(e){}
  return sess;
}
async function _logout(){
  try { _auditLog('logout'); } catch(e){}
  try { localStorage.removeItem('sessaoAtual'); } catch(e){}
  if(AUTH_MODE === 'firebase' && window.fbAuth){
    try {
      await window.fbAuth.signOut();
    } catch(e){
      console.warn('Firebase signOut falhou:', e);
    }
  }
  // Pequeno delay para garantir que o audit foi enviado antes do reload
  setTimeout(function(){ window.location.reload(); }, 100);
}
// Expor em window para que onclick inline (em HTML) consiga chamar
window._logout = _logout;

// Atualiza o _getPerfilUsuario (substituindo o mock anterior)
// Cache do perfil do usuário em memória (populado após login Firebase)
let _perfilCache = null;

function _getPerfilUsuario(){
  const sess = _getSessao();
  if(!sess) return null;
  if(_perfilCache && _perfilCache.uid === sess.uid) return _perfilCache;
  if(AUTH_MODE === 'firebase'){
    // Cache não populado ainda: retorna perfil mínimo defensivo
    // O bootstrap popula antes de renderizar páginas
    return {
      uid: sess.uid,
      nome: sess.nome,
      email: sess.email,
      perfil: sess.perfil,
      perfilNome: sess.perfil,
      paginasPermitidas: null,
      filiaisPermitidas: null,
      podeVerConsolidado: true,
      podeGerenciarUsuarios: sess.perfil === 'admin'
    };
  }
  // Mock: síncrono
  const usuarios = _getUsuariosMock();
  const u = usuarios.find(x => x.uid === sess.uid);
  if(!u || !u.ativo) return null;
  const perfis = _getPerfisCustom();
  const tplPerfil = perfis[u.perfil] || perfis.visualizador;
  return {
    uid: u.uid,
    nome: u.nome,
    email: u.email,
    perfil: u.perfil,
    perfilNome: tplPerfil.nome,
    paginasPermitidas: u.paginas_permitidas || tplPerfil.paginas,
    filiaisPermitidas: u.filiais_permitidas || tplPerfil.filiais,
    podeVerConsolidado: tplPerfil.pode_consolidado,
    podeGerenciarUsuarios: tplPerfil.pode_gerenciar_usuarios
  };
}

async function _populatePerfilCache(){
  const sess = _getSessao();
  if(!sess){ _perfilCache = null; return null; }
  const usuarios = await _getUsuarios();
  const u = usuarios.find(x => x.uid === sess.uid);
  if(!u || !u.ativo){ _perfilCache = null; return null; }
  const perfis = await _getPerfis();
  const tplPerfil = perfis[u.perfil] || perfis.visualizador;
  _perfilCache = {
    uid: u.uid,
    nome: u.nome,
    email: u.email,
    perfil: u.perfil,
    perfilNome: tplPerfil.nome,
    paginasPermitidas: u.paginas_permitidas || tplPerfil.paginas,
    filiaisPermitidas: u.filiais_permitidas || tplPerfil.filiais,
    podeVerConsolidado: tplPerfil.pode_consolidado,
    podeGerenciarUsuarios: tplPerfil.pode_gerenciar_usuarios
  };
  return _perfilCache;
}

// Login mock
async function _doLoginMock(email, senha){
  const usuarios = _getUsuariosMock();
  const u = usuarios.find(x => x.email.toLowerCase() === email.toLowerCase().trim());
  if(!u) return {ok:false, erro:'Email não encontrado'};
  if(!u.ativo) return {ok:false, erro:'Usuário inativo'};
  if(u._senha_mock !== senha){
    _auditLog('login_fail', {motivo:'Senha incorreta'}, {uid:u.uid, email:u.email, nome:u.nome});
    return {ok:false, erro:'Senha incorreta'};
  }
  // Atualizar último acesso
  u.ultimo_acesso = new Date().toISOString();
  _saveUsuariosMock(usuarios);
  // Salvar sessão
  _saveSessao(u.uid, u.email, u.nome, u.perfil);
  _auditLog('login_ok', {senha_temp: !!u.senha_temp});
  return {ok:true, usuario:u, precisa_trocar_senha: u.senha_temp};
}

// Trocar senha (mock)
async function _trocarSenhaMock(uid, novaSenha){
  if(!novaSenha || novaSenha.length < 6) return {ok:false, erro:'Senha precisa ter pelo menos 6 caracteres'};
  const usuarios = _getUsuariosMock();
  const u = usuarios.find(x => x.uid === uid);
  if(!u) return {ok:false, erro:'Usuário não encontrado'};
  u._senha_mock = novaSenha;
  u.senha_temp = false;
  _saveUsuariosMock(usuarios);
  return {ok:true};
}

// ================================================================
// TELA DE LOGIN (renderiza antes do dashboard)
// ================================================================
function _renderTelaLogin(precisaTrocarSenha){
  const root = document.body;
  // Limpar tudo e mostrar só login
  const overlay = document.createElement('div');
  overlay.id = 'loginOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:linear-gradient(135deg,#1a2f5c 0%,#0d1b3d 100%);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;';

  const trocarSenhaUid = precisaTrocarSenha ? (precisaTrocarSenha.uid || precisaTrocarSenha) : null;

  const html = trocarSenhaUid ? `
    <div style="background:white;border-radius:14px;padding:40px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3);">
      <div style="text-align:center;margin-bottom:20px;">
        <img src="data:image/png;base64,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" alt="GPC - Grupo Pinto Cerqueira" style="max-width:130px;width:100%;height:auto;display:block;margin:0 auto 8px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#666;letter-spacing:.2em;text-transform:uppercase;margin-top:8px;">Sistema Analítico</div>
      </div>
      <h2 style="font-size:18px;font-weight:800;color:#1a1a1a;margin-bottom:6px;">Definir nova senha</h2>
      <p style="font-size:13px;color:#666;margin-bottom:24px;line-height:1.5;">Você está usando uma senha temporária. Defina uma senha pessoal para continuar.</p>
      <div id="trocaErr" style="display:none;background:#fee;color:#c33;padding:10px 12px;border-radius:7px;font-size:12px;margin-bottom:14px;"></div>
      <label style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:6px;">Nova senha</label>
      <input id="loginNovaSenha" type="password" placeholder="Mínimo 6 caracteres" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:7px;font-size:14px;margin-bottom:14px;box-sizing:border-box;">
      <label style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:6px;">Confirmar senha</label>
      <input id="loginConfSenha" type="password" placeholder="Repita a nova senha" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:7px;font-size:14px;margin-bottom:20px;box-sizing:border-box;">
      <button id="loginBtnTrocar" style="width:100%;padding:13px;background:#1a2f5c;color:white;border:none;border-radius:7px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">Definir senha e entrar</button>
    </div>
  ` : `
    <div style="background:white;border-radius:14px;padding:40px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3);">
      <div style="text-align:center;margin-bottom:20px;">
        <img src="data:image/png;base64,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" alt="GPC - Grupo Pinto Cerqueira" style="max-width:150px;width:100%;height:auto;display:block;margin:0 auto 8px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#666;letter-spacing:.2em;text-transform:uppercase;margin-top:8px;">Comercial GPC</div>
      </div>

      <div id="loginErr" style="display:none;background:#fee;color:#c33;padding:10px 12px;border-radius:7px;font-size:12px;margin-bottom:14px;"></div>
      <label style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:6px;">Email</label>
      <input id="loginEmail" type="email" placeholder="seu@email.com" autocomplete="email" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:7px;font-size:14px;margin-bottom:14px;box-sizing:border-box;">
      <label style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:6px;">Senha</label>
      <input id="loginSenha" type="password" placeholder="••••••••" autocomplete="current-password" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:7px;font-size:14px;margin-bottom:20px;box-sizing:border-box;">
      <button id="loginBtnEntrar" style="width:100%;padding:13px;background:#1a2f5c;color:white;border:none;border-radius:7px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">Entrar</button>
      ${AUTH_MODE === 'mock' ? '<div style="text-align:center;margin-top:16px;padding:8px;background:#fee;color:#c33;border-radius:5px;font-size:10px;font-family:monospace;">⚠ MODO MOCK · dados de teste em localStorage</div>' : ''}
      <div style="text-align:center;margin-top:20px;font-size:10px;color:#999;font-family:'JetBrains Mono',monospace;letter-spacing:.1em;text-transform:uppercase;border-top:1px solid #eee;padding-top:14px;">
        Desenvolvido por R2 Soluções Empresariais
        <div style="font-size:9px;color:#bbb;margin-top:4px;letter-spacing:.15em;">v${APP_VERSION}</div>
      </div>
    </div>
  `;

  overlay.innerHTML = html;
  root.appendChild(overlay);

  if(trocarSenhaUid){
    document.getElementById('loginBtnTrocar').addEventListener('click', async function(){
      const ns = document.getElementById('loginNovaSenha').value;
      const cs = document.getElementById('loginConfSenha').value;
      const errEl = document.getElementById('trocaErr');
      if(ns !== cs){
        errEl.textContent = 'As senhas não coincidem';
        errEl.style.display = 'block';
        return;
      }
      const r = await _trocarSenha(trocarSenhaUid, ns);
      if(!r.ok){
        errEl.textContent = r.erro;
        errEl.style.display = 'block';
        return;
      }
      // OK: fechar overlay, carregar dados e iniciar sistema
      overlay.remove();
      // Carga de Compras é OPCIONAL — segue o mesmo padrão do bootstrap principal
      try {
        await _loadDados();
      } catch(e){
        console.warn('[login-troca] Compras indisponível:', e.message);
        window._dadosComprasError = e.message || String(e);
      }
      try {
        await _initSistema();
      } catch(e){
        console.error('[login-troca] Falha crítica em _initSistema:', e);
        location.reload();
      }
    });
  } else {
    const tryLogin = async function(){
      const email = document.getElementById('loginEmail').value;
      const senha = document.getElementById('loginSenha').value;
      const errEl = document.getElementById('loginErr');
      if(!email || !senha){
        errEl.textContent = 'Preencha email e senha';
        errEl.style.display = 'block';
        return;
      }
      const btn = document.getElementById('loginBtnEntrar');
      btn.disabled = true; btn.textContent = 'Entrando...';
      const r = await _doLogin(email, senha);
      btn.disabled = false; btn.textContent = 'Entrar';
      if(!r.ok){
        errEl.textContent = r.erro;
        errEl.style.display = 'block';
        return;
      }
      if(r.precisa_trocar_senha){
        overlay.remove();
        _renderTelaLogin({uid: r.usuario.uid});
        return;
      }
      overlay.remove();
      // Carga de Compras é OPCIONAL — segue o mesmo padrão do bootstrap principal
      try {
        await _loadDados();
      } catch(e){
        console.warn('[login] Compras indisponível:', e.message);
        window._dadosComprasError = e.message || String(e);
      }
      try {
        await _initSistema();
      } catch(e){
        console.error('[login] Falha crítica em _initSistema:', e);
        location.reload();
      }
    };
    document.getElementById('loginBtnEntrar').addEventListener('click', tryLogin);
    document.getElementById('loginSenha').addEventListener('keydown', function(e){ if(e.key==='Enter') tryLogin(); });
    // Focus no email
    setTimeout(()=>document.getElementById('loginEmail').focus(), 100);
  }
}

// ================================================================
// BOOTSTRAP COM AUTENTICAÇÃO
// ================================================================
async function _bootstrapComAuth(){
  // Validação do SDK Firebase no modo firebase
  if(AUTH_MODE === 'firebase'){
    if(!window.fbAuth || !window.fbDb){
      const loader = document.getElementById('dataLoader');
      if(loader){
        loader.innerHTML = '<div style="background:#fee;color:#c33;padding:20px;border-radius:8px;text-align:center;max-width:480px;margin:40px auto;">'
          +'<h3 style="margin:0 0 10px;">Firebase não carregou</h3>'
          +'<p style="margin:0 0 10px;font-size:13px;">O SDK do Firebase não foi carregado. Verifique sua conexão e recarregue a página.</p>'
          +'<button onclick="location.reload()" style="background:#c33;color:white;border:none;padding:9px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">Recarregar</button>'
          +'</div>';
      }
      return;
    }
    // Nota: onAuthStateChanged era usado para detectar logout externo, mas causava
    // race condition com _logout() manual. Hoje _logout() é a fonte de verdade única.
  }

  const sess = _getSessao();
  if(!sess){
    const loader = document.getElementById('dataLoader');
    if(loader) loader.style.display = 'none';
    _renderTelaLogin();
    return;
  }

  // Sessão válida: carregar dados normalmente
  // Carga de Compras é OPCIONAL — se falhar, sistema sobe parcialmente
  // (Vendas, Home, Histórico, Admin, Ajuda continuam funcionando)
  try {
    await _loadDados();
  } catch(e){
    console.warn('[bootstrap] Compras indisponível (continua sem dados):', e.message);
    window._dadosComprasError = e.message || String(e);
    // D fica undefined — o dispatcher renderPage detecta e mostra mensagem amigável
  }
  try {
    await _initSistema();
  } catch(e){
    console.error('[bootstrap] Falha crítica em _initSistema:', e);
    const loader = document.getElementById('dataLoader');
    if(loader){
      loader.style.display = 'flex';
      loader.innerHTML = '<div style="background:#fee;color:#c33;padding:20px;border-radius:8px;text-align:center;max-width:560px;margin:40px auto;">'
        +'<h3 style="margin:0 0 10px;">Erro ao iniciar sistema</h3>'
        +'<p style="font-size:12px;color:#666;margin:10px 0;font-family:monospace;text-align:left;background:#fff;padding:10px;border-radius:5px;border:1px solid #fcc;">'+(e.message||String(e))+'</p>'
        +'<button onclick="location.reload()" style="background:#c33;color:white;border:none;padding:9px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">Recarregar</button>'
        +'</div>';
    }
  }
}

// Multi-filial: carrega consolidado por padrao ou filial especifica via ?filial=sigla
// Suporte a snapshots: ?snapshot=AAAA-MM-DD para versoes antigas
let _snapshotCarregado = null;
let _filialAtual = null;     // {sigla, nome, arquivo} ou null se consolidado
let _filiaisDisponiveis = []; // [{sigla, nome, arquivo, ativa}]
let _consolidadoData = null;  // cache do consolidado (filiais_resumo, etc)
let D;
let V = null;                 // dados de Vendas (null = não carregado/indisponível, objeto = pronto)

// ─── Globais dos novos JSONs modulares (refatoração 30/abr/2026) ─────
// Cada uma corresponde a um JSON gerado pelos ETLs Python.
// null = não carregado ainda ou indisponível (página deve mostrar placeholder).
// Carregamento eager (paralelo no boot): V, C, E, Dev, F, R, Vb
// Carregamento lazy (sob demanda na página de Análise Dinâmica): Cu
let C   = null;   // compras_<base>.json     · entradas WinThor
let E   = null;   // estoque_<base>.json     · retrato atual + vendas_por_mes
let Dev = null;   // devolucoes_<base>.json  · devoluções ao fornecedor
let F   = null;   // financeiro_<base>.json  · contas pagas + a vencer + aging
let R   = null;   // recebimentos_<base>.json · vendas a prazo (parcelas vencidas)
let Vb  = null;   // verbas_<base>.json      · bonificações de fornecedor
let Cu  = null;   // cubo_<base>.json        · cubo OLAP (lazy-load, ~10MB gzip)
let _cuLoading = null; // promessa pendente de carregamento do cubo

// Base ativa para construir nome do arquivo. Default ATP.
// Quando ?filial=xxx vier no URL, base é derivada do _filialAtual.
function _getBaseSlug(){
  if(_filialAtual && _filialAtual.base_sigla) return _filialAtual.base_sigla.toLowerCase();
  return 'atp'; // default
}

/**
 * Manifesto leve: lista os arquivos disponíveis no servidor (com/sem .gz).
 * Carregado uma vez no boot, evita 404 cosméticos no console.
 * Se o manifest não existir, _MANIFEST fica null e o sistema cai no comportamento
 * antigo (tenta .gz, fallback .json) — funciona, só polui o console.
 */
let _MANIFEST = null;
let _manifestLoading = null;

function _carregarManifest(){
  if(_MANIFEST) return Promise.resolve(_MANIFEST);
  if(_manifestLoading) return _manifestLoading;
  _manifestLoading = fetch('manifest.json', {cache:'default'})
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(j){
      _MANIFEST = j || {arquivos:{}, _ausente:true};
      return _MANIFEST;
    })
    .catch(function(){
      _MANIFEST = {arquivos:{}, _ausente:true};
      return _MANIFEST;
    });
  return _manifestLoading;
}

/** Verifica se um arquivo existe no manifest. Se manifest está ausente, retorna 'unknown'. */
function _temArquivo(nome){
  if(!_MANIFEST || _MANIFEST._ausente) return 'unknown';
  return _MANIFEST.arquivos && _MANIFEST.arquivos[nome] ? _MANIFEST.arquivos[nome] : null;
}

/**
 * Fetch de JSON com suporte a gzip estático.
 * Manifest-aware: se o manifest indica que .gz não existe, vai direto pro .json
 * sem tentar (zero 404 cosméticos no console).
 *
 * Uso: _fetchJsonComGz('vendas_cp.json').then(j => ...)
 */
function _fetchJsonComGz(url){
  return _carregarManifest().then(function(){
    const info = _temArquivo(url);
    // Manifest ausente: comportamento antigo (tenta .gz, fallback .json)
    if(info === 'unknown') return _fetchJsonComGzLegacy(url);
    // Arquivo não existe (nem .gz nem .json): retorna null sem barulho
    if(info === null) return null;
    // .gz disponível: usa fluxo gzip
    if(info.gz) return _fetchGz(url);
    // Só .json puro disponível: fetch direto (com cache-bust)
    if(info.json) {
      const bust = (url.indexOf('?') >= 0 ? '&' : '?') + 'v=' + (typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'na');
      return fetch(url + bust, {cache:'default'}).then(function(r){
        return r.ok ? r.json() : null;
      });
    }
    return null;
  });
}

function _fetchGz(url){
  // Cache-bust com APP_VERSION pra evitar JSON antigo no navegador
  const sep = url.indexOf('?') >= 0 ? '&' : '?';
  const bust = sep + 'v=' + (typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'na');
  return fetch(url + '.gz' + bust, {cache:'default'})
    .then(function(r){
      if(!r.ok) throw new Error('gz não disponível');
      if(typeof DecompressionStream !== 'undefined'){
        const ds = new DecompressionStream('gzip');
        const decompressed = r.body.pipeThrough(ds);
        return new Response(decompressed).text();
      }
      if(typeof pako !== 'undefined'){
        return r.arrayBuffer().then(function(buf){
          return pako.ungzip(new Uint8Array(buf), {to: 'string'});
        });
      }
      return r.text();
    })
    .then(function(txt){
      try { return JSON.parse(txt); }
      catch(e){
        console.warn('[_fetchGz] JSON.parse falhou para '+url+', tentando fallback .json puro:', e.message);
        throw e; // dispara o .catch abaixo
      }
    })
    .catch(function(){
      // Fallback final: .json puro (também com cache-bust)
      const bustJ = sep + 'v=' + (typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'na');
      return fetch(url + bustJ, {cache:'default'}).then(function(r){
        return r.ok ? r.json() : null;
      });
    });
}

/** Comportamento antigo (manifest ausente): tenta .gz, cai pra .json. */
function _fetchJsonComGzLegacy(url){
  return _fetchGz(url);
}

/** Normaliza a estrutura do cubo CP (formato antigo: dim/fato_vendas)
 *  para o formato ATP (dimensoes/fatos.vendas) que a UI espera. */
function _normalizarCubo(c){
  if(!c) return c;
  // Se já tem fatos.vendas no formato esperado, não mexe
  if(c.fatos && c.fatos.vendas && c.fatos.vendas.linhas) return c;

  // Cubo CP: dim={dep,sec,cat,forn,sup,rca,sku} + fato_vendas={campos,linhas}
  if(c.dim && c.fato_vendas){
    // Mapeamento COMPLETO: nomes do formato antigo (CP) → schema novo 2.0 (ATP)
    // Usado tanto pra remapear chaves de dim/dimensoes quanto pra remapear
    // os campos do array `fato_vendas.campos` (que viram colunas de cada linha).
    const mapCampos = {
      // Dimensões antigas → novas
      'dep':    'dep',    // mantém ('dep' é o esperado em schema 2.0)
      'sec':    'sec',    // schema 2.0 usa 'sec' (não tem em ATP, mas mantém)
      'cat':    'cat',
      'forn':   'forn',
      'sup':    'sup',
      'rca':    'vend',   // ⚠ schema 2.0 chama de 'vend'
      'sku':    'sku',
      'filial': 'lj',     // ⚠ schema 2.0 chama de 'lj'
      'ym':     'ym',
      // Métricas antigas → novas
      'fat_brt':'v_brt',
      'fat_liq':'v_liq',
      'devol':  'v_dev',
      'cmv':    'v_cmv',
      'lucro':  'v_luc',
      'qt':     'v_qt',
      // Schema antigo não tem v_nfs, v_cli; deixa como undefined que vira 0 nas somas
    };
    // Mapeamento de nomes de chaves de dimensoes (formato exposto pra UI)
    const mapDim = {
      'dep':'depto', 'sec':'secao', 'cat':'categoria',
      'forn':'fornecedor', 'sup':'supervisor', 'rca':'vendedor', 'sku':'sku_vendas'
    };
    const dimensoes = {};
    Object.keys(c.dim).forEach(function(k){
      const nomeNovo = mapDim[k] || k;
      dimensoes[nomeNovo] = { items: c.dim[k] || [] };
    });

    // Construir dimensão tempo a partir dos meses presentes em fato_vendas
    const fv = c.fato_vendas;
    const camposFv = fv.campos || [];
    const idxYm = camposFv.indexOf('ym');
    if(idxYm >= 0){
      const ymsSet = new Set();
      (fv.linhas || []).forEach(function(linha){
        if(linha[idxYm]) ymsSet.add(linha[idxYm]);
      });
      const ymsOrdenados = Array.from(ymsSet).sort();
      dimensoes.tempo = {
        items: ymsOrdenados.map(function(ym){
          return { cod: ym, nome: ym.substring(5,7)+'/'+ym.substring(2,4) };
        })
      };
    }

    // Construir dimensão loja a partir das filiais do meta
    // Cruza com valores reais que aparecem no fato pra garantir que
    // todas as filiais com dados sejam listadas (defensivo contra
    // meta.filiais incompleto ou desordenado).
    const idxFilForVendas = camposFv.indexOf('filial');
    const filiaisNoFato = new Set();
    if(idxFilForVendas >= 0){
      (fv.linhas || []).forEach(function(linha){
        if(linha[idxFilForVendas]) filiaisNoFato.add(String(linha[idxFilForVendas]));
      });
    }

    if(c.meta && Array.isArray(c.meta.filiais)){
      // Começa com o que está em meta.filiais (na ordem certa)
      const itemsFromMeta = c.meta.filiais.map(function(f){
        return { cod: f.slug || f.cod, nome: f.nome };
      });
      const codsMeta = new Set(itemsFromMeta.map(function(it){return String(it.cod);}));
      // Adiciona qualquer filial que apareça no fato mas não esteja em meta
      filiaisNoFato.forEach(function(slug){
        if(!codsMeta.has(String(slug))){
          itemsFromMeta.push({cod: slug, nome: slug});
          console.warn('[_normalizarCubo] filial '+slug+' aparece no fato mas não está em meta.filiais — adicionada como cod='+slug);
        }
      });
      dimensoes.loja = { items: itemsFromMeta };
    } else {
      // Fallback total: extrair só do fato
      dimensoes.loja = {
        items: Array.from(filiaisNoFato).sort().map(function(l){
          return { cod: l, nome: l };
        })
      };
    }

    // Reordena os campos do fato_vendas para o schema novo (lj, v_brt, etc.)
    // ATENÇÃO: este map afeta as chaves usadas pelo _agregarPivot
    const camposNorm = camposFv.map(function(cmp){ return mapCampos[cmp] || cmp; });

    // Mapeia fato_compras se existir (CP tem este; ATP usa fatos.compras direto)
    const fatos_out = {
      vendas: {
        campos: camposNorm,
        linhas: fv.linhas || []
      }
    };
    if(c.fato_compras && c.fato_compras.campos && c.fato_compras.linhas){
      const camposComp = c.fato_compras.campos.map(function(cmp){
        // Mapeamento adicional pra compras (CP usa 'valor', 'qt', 'nfs')
        const mapComp = {
          'filial':'lj',  // CP usa filial em vez de lj
          'valor':'c_val', 'val':'c_val',
          'qt':'c_qt', 'nfs':'c_nfs',
          'fat_brt':'c_val', 'cnt':'c_nfs'
        };
        return mapCampos[cmp] || mapComp[cmp] || cmp;
      });
      fatos_out.compras = {
        campos: camposComp,
        linhas: c.fato_compras.linhas
      };
    }

    // Constrói o cubo normalizado
    return Object.assign({}, c, {
      dimensoes: dimensoes,
      fatos: fatos_out,
      _formato_origem: 'cp'
    });
  }
  return c;
}

/** Mescla dois cubos normalizados num só. Útil pra GRUPO que precisa
 *  ver CP + ATP juntos na Análise Dinâmica.
 *  - Concatena linhas de cada fato (vendas, compras, financeiro)
 *  - União de items por dimensão (deduplicado por cod)
 *  - Meta combinada com info dos dois.
 */
function _mesclarCubos(c1, c2){
  if(!c1) return c2;
  if(!c2) return c1;

  // Mescla dimensões (união por cod)
  const dimsOut = {};
  const todasDims = new Set([
    ...Object.keys((c1.dimensoes||{})),
    ...Object.keys((c2.dimensoes||{}))
  ]);
  todasDims.forEach(function(dimKey){
    const items1 = ((c1.dimensoes||{})[dimKey]||{}).items || [];
    const items2 = ((c2.dimensoes||{})[dimKey]||{}).items || [];
    const seen = new Set();
    const merged = [];
    items1.concat(items2).forEach(function(it){
      const k = String(it.cod);
      if(seen.has(k)) return;
      seen.add(k);
      merged.push(it);
    });
    dimsOut[dimKey] = { items: merged };
  });

  // Mescla fatos (concatena linhas se os campos são compatíveis)
  const fatosOut = {};
  const todosFatos = new Set([
    ...Object.keys((c1.fatos||{})),
    ...Object.keys((c2.fatos||{}))
  ]);
  todosFatos.forEach(function(fatoKey){
    const f1 = (c1.fatos||{})[fatoKey];
    const f2 = (c2.fatos||{})[fatoKey];
    if(!f1 && !f2) return;
    if(!f1){ fatosOut[fatoKey] = f2; return; }
    if(!f2){ fatosOut[fatoKey] = f1; return; }
    // Os dois existem — checa compatibilidade dos campos
    const campos1 = f1.campos || [];
    const campos2 = f2.campos || [];
    const camposOut = Array.from(new Set(campos1.concat(campos2)));
    // Reposiciona linhas pra ordem padrão de camposOut
    function reposLinhas(linhas, camposOrig){
      const idxMap = camposOut.map(function(c){
        const i = camposOrig.indexOf(c);
        return i;
      });
      return linhas.map(function(lin){
        return idxMap.map(function(i){ return i >= 0 ? lin[i] : null; });
      });
    }
    fatosOut[fatoKey] = {
      campos: camposOut,
      linhas: reposLinhas(f1.linhas||[], campos1).concat(reposLinhas(f2.linhas||[], campos2))
    };
  });

  // Meta combinada
  const meta1 = c1.meta || {};
  const meta2 = c2.meta || {};
  const filiais1 = meta1.filiais || (meta1.lojas ? meta1.lojas.map(function(l){return {slug:l, nome:l, cod:l};}) : []);
  const filiais2 = meta2.filiais || (meta2.lojas ? meta2.lojas.map(function(l){return {slug:l, nome:l, cod:l};}) : []);
  const filiaisCombinadas = [];
  const filSeen = new Set();
  filiais1.concat(filiais2).forEach(function(f){
    const k = String(f.slug || f.cod);
    if(filSeen.has(k)) return;
    filSeen.add(k);
    filiaisCombinadas.push(f);
  });
  const metaOut = Object.assign({}, meta1, meta2, {
    base: 'GRUPO (CP + ATP)',
    filiais: filiaisCombinadas,
    _mesclado_de: [meta1.base, meta2.base].filter(Boolean)
  });

  return {
    meta: metaOut,
    dimensoes: dimsOut,
    fatos: fatosOut,
    _formato_origem: 'merged'
  };
}

/** Carrega o cubo OLAP sob demanda. Idempotente: se já carregou ou está carregando,
 *  retorna a promessa em andamento.
 *  Em GRUPO consolidado, carrega CP e ATP em paralelo e mescla os dois.
 *  Tem timeout de 60s pra evitar tela travada. */
function _carregarCuboLazy(){
  if(Cu) return Promise.resolve(Cu);
  if(_cuLoading) return _cuLoading;
  const slug = _getBaseSlug();

  // Em GRUPO: carrega CP + ATP em paralelo e mescla
  if(slug === 'grupo'){
    const timeoutPromise = new Promise(function(_, reject){
      setTimeout(function(){
        reject(new Error('Timeout (60s) ao carregar cubos CP + ATP'));
      }, 60000);
    });
    _cuLoading = Promise.race([
      Promise.all([
        _fetchJsonComGz('cubo_cp.json').catch(function(e){
          console.warn('[_carregarCuboLazy] cubo_cp falhou:', e.message);
          return null;
        }),
        _fetchJsonComGz('cubo_atp.json').catch(function(e){
          console.warn('[_carregarCuboLazy] cubo_atp falhou:', e.message);
          return null;
        })
      ]),
      timeoutPromise
    ])
      .then(function(arr){
        const cpRaw = arr[0], atpRaw = arr[1];
        const cpNorm = cpRaw ? _normalizarCubo(cpRaw) : null;
        const atpNorm = atpRaw ? _normalizarCubo(atpRaw) : null;
        if(!cpNorm && !atpNorm){
          console.warn('[_carregarCuboLazy] nenhum dos cubos disponível em GRUPO');
          return Cu;
        }
        if(cpNorm && !atpNorm){
          Cu = cpNorm;
          Cu._slug_efetivo = 'cp';
          Cu._fallback_de = 'cp';
          console.warn('[_carregarCuboLazy] em GRUPO, só cubo_cp disponível — ATP não vai aparecer');
        } else if(atpNorm && !cpNorm){
          Cu = atpNorm;
          Cu._slug_efetivo = 'atp';
          Cu._fallback_de = 'atp';
          console.warn('[_carregarCuboLazy] em GRUPO, só cubo_atp disponível — CP não vai aparecer');
        } else {
          Cu = _mesclarCubos(cpNorm, atpNorm);
          Cu._slug_efetivo = 'merged';
          Cu._fallback_de = null;
          console.info('[_carregarCuboLazy] cubos CP + ATP mesclados pra GRUPO');
        }
        return Cu;
      })
      .catch(function(e){
        console.error('[_carregarCuboLazy] erro:', e.message);
        _cuLoading = null;
        throw e;
      });
    return _cuLoading;
  }

  // Caso normal: carrega só o cubo da base atual
  const timeoutPromise = new Promise(function(_, reject){
    setTimeout(function(){
      reject(new Error('Timeout (45s) ao carregar cubo_'+slug+'.json — arquivo pode ser muito grande'));
    }, 45000);
  });

  _cuLoading = Promise.race([
    _fetchJsonComGz('cubo_'+slug+'.json'),
    timeoutPromise
  ])
    .then(function(j){
      if(j){
        Cu = _normalizarCubo(j);
        Cu._slug_efetivo = slug;
        Cu._fallback_de = null;
      } else {
        console.warn('[_carregarCuboLazy] cubo_'+slug+'.json indisponível.');
      }
      return Cu;
    })
    .catch(function(e){
      console.error('[_carregarCuboLazy] erro:', e.message);
      _cuLoading = null;
      throw e;
    });
  return _cuLoading;
}

/** Helper de diagnóstico: imprime no console o estado dos JSONs modulares.
 *  Use no DevTools para conferir o que carregou. */
window._gpcStatus = function(){
  const fmt = function(o, nome){
    if(o === null || o === undefined) return '  '+nome+': ✗ null';
    const meta = o.meta || {};
    // Detecta vários formatos de período conforme o ETL gerou
    let periodo = '';
    if(meta.periodo && meta.periodo.inicio){
      periodo = meta.periodo.inicio+' a '+meta.periodo.fim;
    } else if(meta.periodo_vencimento && meta.periodo_vencimento.inicio){
      periodo = 'venc: '+meta.periodo_vencimento.inicio+' a '+meta.periodo_vencimento.fim;
    } else if(meta.data_referencia){
      periodo = 'ref: '+meta.data_referencia;
    } else if(meta.data_estoque){
      periodo = 'estoque: '+meta.data_estoque;
    }
    const linhas = meta.linhas_processadas;
    return '  '+nome+': ✓ '+(periodo || '(sem período)')+(linhas ? ' · '+linhas.toLocaleString('pt-BR')+' linhas' : '');
  };
  console.log('=== GPC · estado dos JSONs ===');
  console.log(fmt(V,   'V   (vendas)        '));
  console.log(fmt(C,   'C   (compras)       '));
  console.log(fmt(E,   'E   (estoque)       '));
  console.log(fmt(Dev, 'Dev (devoluções)    '));
  console.log(fmt(F,   'F   (financeiro)    '));
  console.log(fmt(R,   'R   (recebimentos)  '));
  console.log(fmt(Vb,  'Vb  (verbas)        '));
  console.log(fmt(Cu,  'Cu  (cubo OLAP)     '));
  console.log('  D   (legado)         '+(D ? '✓ presente' : '✗ null (modo novo)'));
};

// _getPerfilUsuario foi movido para o sistema de auth (acima)

async function _carregarFiliaisIndex(){
  try {
    const r = await fetch('filiais.json', {cache:'no-cache'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const idx = await r.json();
    _filiaisDisponiveis = (idx.filiais||[]).filter(f => f.ativa);
    _basesDisponiveis = idx.bases || [{sigla:'atp', nome:'ATP'}];
    return idx;
  } catch(e){
    console.warn('Sem filiais.json, usando modo legado (single):', e.message);
    _filiaisDisponiveis = [{sigla:'atp', nome:'ATP', arquivo:'dados.json', ativa:true, base_sigla:'atp'}];
    _basesDisponiveis = [{sigla:'atp', nome:'ATP'}];
    return null;
  }
}

function _decidirOqueCarregar(){
  const urlParams = new URLSearchParams(window.location.search);
  const filialParam = urlParams.get('filial');
  const perfil = _getPerfilUsuario();
  // '__todas__' significa todas as filiais; senão filtra pelas siglas listadas
  const podeVerTodas = !perfil || !perfil.filiaisPermitidas || perfil.filiaisPermitidas.includes('__todas__');
  const filiaisVisiveis = podeVerTodas
    ? _filiaisDisponiveis
    : _filiaisDisponiveis.filter(f => perfil.filiaisPermitidas.includes(f.sigla));

  // Retrato tem prioridade absoluta
  const snapParam = urlParams.get('snapshot');
  if(snapParam && /^\d{4}-\d{2}-\d{2}$/.test(snapParam)){
    // Suporta ?snapshot=AAAA-MM-DD (genérico) e ?snapshot=AAAA-MM-DD&filial=sigla
    const filSnap = filialParam && filiaisVisiveis.find(x => x.sigla === filialParam);
    const arq = filSnap
      ? 'dados-'+filSnap.sigla+'-'+snapParam+'.json'
      : 'dados-'+snapParam+'.json';
    _snapshotCarregado = {data: snapParam, arquivo: arq, filialSigla: filSnap ? filSnap.sigla : null};
    if(filSnap) _filialAtual = filSnap;  // preserva base da filial
    return {tipo: 'snapshot', arquivo: arq, filial: filSnap || null};
  }

  // Filial via URL: ?filial=atp
  if(filialParam){
    const f = filiaisVisiveis.find(x => x.sigla === filialParam);
    if(f){
      _filialAtual = f;
      return {tipo: 'filial', arquivo: f.arquivo, filial: f};
    }
  }

  // Sem URL: comportamento depende do perfil
  if(filiaisVisiveis.length === 1){
    // Usuario com 1 filial so: vai direto pra ela
    _filialAtual = filiaisVisiveis[0];
    return {tipo: 'filial', arquivo: _filialAtual.arquivo, filial: _filialAtual};
  }

  // Multiplas filiais e pode ver consolidado: carrega GRUPO (default)
  if(perfil.podeVerConsolidado){
    const grupo = filiaisVisiveis.find(f => f.sigla === 'grupo' || f.tipo === 'raiz');
    if(grupo){
      _filialAtual = grupo;
      return {tipo: 'filial', arquivo: grupo.arquivo, filial: grupo};
    }
    // Fallback para legado
    return {tipo: 'consolidado', arquivo: 'consolidado.json'};
  }

  // Multiplas filiais mas nao ve consolidado: pega a primeira
  _filialAtual = filiaisVisiveis[0];
  return {tipo: 'filial', arquivo: _filialAtual.arquivo, filial: _filialAtual};
}

async function _loadDados(){
  const dlMsg = document.getElementById('dlMsg');
  const dlProg = document.getElementById('dlProg');

  // ─── Vendas (V) ────────────────────────────────────────────────
  // Tenta novo formato `vendas_<base>.json` primeiro; cai pra `vendas.json` legado.
  // Fetch silencioso. Se não existir, V continua null e o dispatcher cai em placeholder.
  // Não bloqueia o fluxo principal.
  // (Carregado em _loadDadosModulares mais abaixo, depois que sabemos a base.)

  // 1. Carregar indice de filiais
  if(dlMsg) dlMsg.textContent = 'Carregando indice de filiais...';
  await _carregarFiliaisIndex();

  // 2. Decidir o que carregar
  const decisao = _decidirOqueCarregar();

  // 3. Disparar carregamento dos JSONs modulares NOVOS em paralelo (não bloqueante)
  //    Dispara antes do fetch principal pra ganhar tempo. Se chegar antes, ótimo;
  //    se chegar depois, as páginas que dependem deles re-renderizam.
  _loadDadosModulares(_getBaseSlug());

  // 4. Cache do consolidado para acesso futuro (só se o manifest indicar que existe)
  if(decisao.tipo !== 'consolidado'){
    _carregarManifest().then(function(){
      if(_temArquivo('consolidado.json')){
        fetch('consolidado.json', {cache:'default'}).then(r => r.ok ? r.json() : null).then(j => {
          if(j) _consolidadoData = j.D || j;
        }).catch(()=>{});
      }
    });
  }

  // 5. Carregar o arquivo principal LEGADO (D) — transicional.
  //    Se o arquivo não existir, D fica null e as páginas antigas mostram placeholder
  //    via renderAvisoConsolidado(). As páginas novas (V/C/E/F/R/Vb) funcionam normal.
  try {
    const t0 = performance.now();
    let labelMsg;
    if(decisao.tipo === 'snapshot') labelMsg = 'Carregando retrato de '+_snapshotCarregado.data+'...';
    else if(decisao.tipo === 'filial') labelMsg = 'Carregando '+decisao.filial.nome+'...';
    else labelMsg = 'Carregando GPC consolidado...';
    if(dlMsg) dlMsg.textContent = labelMsg;

    // Manifest-aware: se o arquivo legado D não existe no pacote, pula direto pro modo novo.
    // O schema modular (V/C/E/F/R/Vb) cobre todas as páginas; D é só pra retrocompat.
    await _carregarManifest();
    const arqInfo = _temArquivo(decisao.arquivo);
    // Só tentamos fetch se o manifest:
    //   (a) está ausente (modo legacy, comportamento antigo), OU
    //   (b) indica que o arquivo existe E é especificamente consolidado.json (schema D antigo)
    const ehConsolidadoLegado = decisao.arquivo === 'consolidado.json';
    const manifestSemArquivo = _MANIFEST && !_MANIFEST._ausente && !arqInfo;
    if(manifestSemArquivo || (!ehConsolidadoLegado && _MANIFEST && !_MANIFEST._ausente)){
      // Modo novo modular: D = null, páginas modulares funcionam, páginas antigas mostram aviso
      D = null;
      if(dlProg) dlProg.textContent = 'modo modular';
      return;
    }

    const resp = await fetch(decisao.arquivo, {cache:'default'});
    if(!resp.ok){
      // Arquivo legado não existe — modo "novo" puro (sem D antigo).
      if(resp.status === 404){
        D = null;
        if(dlProg){
          dlProg.textContent = 'modo novo · sem '+decisao.arquivo;
        }
        return;
      }
      throw new Error('HTTP '+resp.status+' ('+decisao.arquivo+')');
    }
    if(dlMsg) dlMsg.textContent = 'Processando...';
    const json = await resp.json();
    D = json.D || json;

    if(decisao.tipo === 'consolidado'){
      _consolidadoData = D;
    }

    // Se carregou snapshot sem filial especifica mas os dados tem uma base (ex: meta.base='ATP'),
    // tentar achar a filial correspondente para preservar contexto de base
    if(decisao.tipo === 'snapshot' && !_filialAtual && D && D.meta && D.meta.base){
      const baseDados = D.meta.base;
      const filial = _filiaisDisponiveis.find(function(f){
        return (f.base || '').toLowerCase() === baseDados.toLowerCase()
            || (f.nome || '').toLowerCase() === baseDados.toLowerCase();
      });
      if(filial) _filialAtual = filial;
    }

    const t1 = performance.now();
    if(dlProg){
      const tag = decisao.tipo === 'consolidado' ? 'CONSOLIDADO' : (_filialAtual ? _filialAtual.sigla.toUpperCase() : 'SNAPSHOT');
      dlProg.textContent = '['+tag+'] '+(((t1-t0)/1000).toFixed(1))+'s';
    }
  } catch(err) {
    if(dlMsg){
      let msgUsuario = 'Erro ao carregar dados';
      const errStr = String(err.message || '');
      if(/HTTP 404/.test(errStr)){
        if(decisao.tipo === 'snapshot') msgUsuario = 'Retrato não encontrado no servidor';
        else if(decisao.tipo === 'filial') msgUsuario = 'Arquivo de dados da filial não encontrado';
        else msgUsuario = 'Arquivo consolidado.json não encontrado';
      } else if(/HTTP 5\d\d/.test(errStr)){
        msgUsuario = 'Servidor indisponível';
      } else if(/Failed to fetch|NetworkError/i.test(errStr)){
        msgUsuario = 'Sem conexão com o servidor';
      } else if(/JSON|SyntaxError|Unexpected/i.test(errStr)){
        msgUsuario = 'Arquivo de dados corrompido';
      }
      dlMsg.textContent = msgUsuario;
      dlMsg.style.color = 'var(--danger-text)';
    }
    if(dlProg) dlProg.textContent = 'Detalhe técnico: ' + (err.message || 'desconhecido');
    throw err;
  }
}

// ────────────────────────────────────────────────────────────────────
// CARREGAMENTO MODULAR DOS JSONS NOVOS (refatoração 30/abr/2026)
// Cada JSON é carregado em paralelo, falha silenciosamente se não existir,
// e re-renderiza páginas dependentes quando termina.
// ────────────────────────────────────────────────────────────────────
// ================================================================
// SCHEMA · validações de sanidade no boot (etapa #2 da auditoria)
// ================================================================
// Roda sobre cada JSON carregado e reporta divergências do schema esperado.
// O objetivo é detectar problemas no ETL ANTES do usuário descobrir num print.
//
// Uso:
//   - Console.warn pra cada inconsistência encontrada (sempre)
//   - window._schemaIssues guarda a lista pra debug (window._schemaIssues)
//   - window._schemaResumo() imprime tabela amigável
//
// Categorias:
//   ❌ ERRO  : invariante quebrada — bug do ETL
//   ⚠️ WARN  : situação suspeita — pode ser dado real
//
// As regras aqui são intencionalmente um SUBSET das do validar.py (Python).
// O Python roda no dist completo; aqui rodamos no que está em memória.

window._schemaIssues = [];
window._schemaJaValidou = {};  // varName → true (evita validar 2× quando mesmo JSON é recarregado)

function _schemaWarn(varName, mensagem, detalhe){
  window._schemaIssues.push({tipo:'WARN', varName:varName, msg:mensagem, det:detalhe||''});
  console.warn('[schema] ⚠️ '+varName+': '+mensagem+(detalhe?' · '+detalhe:''));
}
function _schemaErro(varName, mensagem, detalhe){
  window._schemaIssues.push({tipo:'ERRO', varName:varName, msg:mensagem, det:detalhe||''});
  console.error('[schema] ❌ '+varName+': '+mensagem+(detalhe?' · '+detalhe:''));
}

/** Imprime resumo no console em formato amigável. Chama via window._schemaResumo(). */
window._schemaResumo = function(){
  const issues = window._schemaIssues || [];
  console.log('━━━━━━━━━━ SCHEMA · resumo ━━━━━━━━━━');
  if(issues.length === 0){
    console.log('  ✅ Nenhum problema detectado nos JSONs carregados.');
    return;
  }
  const erros = issues.filter(function(i){return i.tipo==='ERRO';});
  const warns = issues.filter(function(i){return i.tipo==='WARN';});
  console.log('  ❌ Erros: '+erros.length+'  ⚠️ Warnings: '+warns.length);
  console.table(issues);
};

/** Valida o JSON de Vendas. */
function _schemaValidarV(j){
  if(window._schemaJaValidou.V) return;
  window._schemaJaValidou.V = true;
  if(!j) return;

  if(!Array.isArray(j.mensal)){
    _schemaErro('V', 'mensal não é array', 'esperado: array de {loja,ym,fat_liq,...}');
    return;
  }

  // Schema mínimo de uma linha mensal
  if(j.mensal.length > 0){
    const m0 = j.mensal[0];
    const obrigatorios = ['loja', 'ym', 'fat_liq', 'lucro'];
    obrigatorios.forEach(function(c){
      if(!(c in m0)) _schemaErro('V', 'mensal[0]: campo "'+c+'" ausente');
    });
  }

  // Período: deve ser de 2025-01 em diante (decisão do projeto)
  const yms = j.mensal.map(function(m){return m.ym||'';});
  const com2024 = yms.filter(function(y){return y.startsWith('2024');});
  if(com2024.length > 0){
    _schemaErro('V', 'há '+com2024.length+' linhas de 2024 em mensal',
                'ETL deveria filtrar >= 2025-01');
  }

  // Lojas esperadas (depende da base)
  const lojas = new Set(yms.length ? j.mensal.map(function(m){return m.loja;}) : []);
  if(lojas.size === 0){
    _schemaWarn('V', 'mensal vazio');
  }

  // resumo.grupo.total deve bater com soma do mensal (tolerância de R$ 1)
  const soma = j.mensal.reduce(function(s,m){return s+(m.fat_liq||0);}, 0);
  const resumoTotal = (j.resumo && j.resumo.grupo && j.resumo.grupo.total &&
                       j.resumo.grupo.total.fat_liq) || 0;
  if(soma > 0 && resumoTotal > 0){
    const diff = Math.abs(soma - resumoTotal);
    if(diff > 1){
      _schemaWarn('V', 'resumo.grupo.total.fat_liq != sum(mensal)',
                  'resumo R$ '+resumoTotal.toFixed(2)+' vs mensal R$ '+soma.toFixed(2));
    }
  }
}

/** Valida o JSON de Compras. */
function _schemaValidarC(j){
  if(window._schemaJaValidou.C) return;
  window._schemaJaValidou.C = true;
  if(!j) return;

  if(!Array.isArray(j.mensal)){
    _schemaErro('C', 'mensal não é array');
    return;
  }

  // Bug histórico: resumo.grupo.total.valor pode estar zerado
  const soma = j.mensal.reduce(function(s,m){return s+(m.valor||0);}, 0);
  const resumoTotal = (j.resumo && j.resumo.grupo && j.resumo.grupo.total &&
                       j.resumo.grupo.total.valor) || 0;
  if(soma > 0 && resumoTotal === 0){
    _schemaErro('C', 'resumo.grupo.total.valor = 0 mas mensal soma R$ '+soma.toFixed(2),
                'bug do ETL — front usa mensal mas relatórios podem confundir');
  } else if(soma > 0 && resumoTotal > 0){
    const diff = Math.abs(soma - resumoTotal);
    const diffPct = diff / resumoTotal * 100;
    if(diffPct > 0.5){
      _schemaWarn('C', 'resumo divergente de sum(mensal) em '+diffPct.toFixed(1)+'%');
    }
  }
}

/** Valida o JSON de Estoque. */
function _schemaValidarE(j){
  if(window._schemaJaValidou.E) return;
  window._schemaJaValidou.E = true;
  if(!j) return;

  const r = j.resumo || {};
  const produtos = j.produtos || [];

  // Skus por status deve somar igual ao total
  if(r.por_status && r.skus_total){
    let soma = 0;
    Object.keys(r.por_status).forEach(function(k){
      soma += (r.por_status[k] && r.por_status[k].skus) || 0;
    });
    if(soma !== r.skus_total){
      _schemaErro('E', 'por_status.skus.sum ('+soma+') != skus_total ('+r.skus_total+')');
    }
  }

  // vl_venda_total = 0 com produtos com preço → bug ETL conhecido
  if(r.vl_venda_total === 0 && produtos.length > 0){
    const comPreco = produtos.filter(function(p){
      return p.estoque && p.estoque.preco > 0;
    }).length;
    if(comPreco > 0){
      _schemaErro('E', 'vl_venda_total = 0 com '+comPreco+' produtos com preço',
                  'bug do ETL — front tem fallback (mostra "—")');
    }
  }

  // markup_pct = null mas há vendas
  if(r.vl_venda_total > 0 && r.markup_pct == null){
    _schemaWarn('E', 'markup_pct = null mas vl_venda_total > 0',
                'ETL não calculou — front tem fallback');
  }
}

/** Valida o JSON de Financeiro. */
function _schemaValidarF(j){
  if(window._schemaJaValidou.F) return;
  window._schemaJaValidou.F = true;
  if(!j) return;
  // Apenas checa estrutura mínima
  if(!j.resumo) _schemaWarn('F', 'sem campo "resumo"');
  if(!j.aberto) _schemaWarn('F', 'sem campo "aberto"');
}

/** Valida o JSON de Recebimentos. */
function _schemaValidarR(j){
  if(window._schemaJaValidou.R) return;
  window._schemaJaValidou.R = true;
  if(!j) return;

  // por_cliente_top deve estar ordenado
  const cli = j.por_cliente_top || [];
  if(cli.length >= 2){
    if((cli[0].valor || 0) < (cli[1].valor || 0)){
      _schemaErro('R', 'por_cliente_top fora de ordem decrescente');
    }
    // Pendência conhecida: nome do cliente
    if(!('nome' in cli[0])){
      _schemaWarn('R', 'clientes sem campo "nome"',
                  'pendência conhecida — front mostra "—" (precisa cruzar com PCCLIENT)');
    }
  }
}

/** Dispatcher. Chama o validador específico de cada tipo. */
function _schemaValidar(varName, j){
  try {
    if(varName === 'V') _schemaValidarV(j);
    else if(varName === 'C') _schemaValidarC(j);
    else if(varName === 'E') _schemaValidarE(j);
    else if(varName === 'F') _schemaValidarF(j);
    else if(varName === 'R') _schemaValidarR(j);
  } catch(e){
    console.warn('[schema] erro inesperado validando '+varName+':', e.message);
  }
}

function _loadDadosModulares(baseSlug){
  baseSlug = baseSlug || 'atp';
  // Reset do cache de validação de schema (vai re-validar pra base nova)
  window._schemaJaValidou = {};
  window._schemaIssues = [];

  // Helper: fetch silencioso + rerender condicional
  // Tenta .gz primeiro (descompactando no cliente), com fallback pro .json normal.
  function _fetchModular(arquivo, varName, paginasQueDependem, fallbackArquivos){
    fallbackArquivos = fallbackArquivos || [];
    const tentar = [arquivo].concat(fallbackArquivos);
    let promiseChain = Promise.resolve(null);
    tentar.forEach(function(arq){
      promiseChain = promiseChain.then(function(j){
        if(j) return j; // já achou em uma tentativa anterior
        return _fetchJsonComGz(arq).catch(function(){ return null; });
      });
    });
    return promiseChain.then(function(j){
      if(j){
        // atribuir à variável global correspondente
        switch(varName){
          case 'V':   V   = j; break;
          case 'C':   C   = j; break;
          case 'E':   E   = j; break;
          case 'Dev': Dev = j; break;
          case 'F':   F   = j; break;
          case 'R':   R   = j; break;
          case 'Vb':  Vb  = j; break;
        }
        // Validar schema (não-bloqueante; apenas reporta no console)
        _schemaValidar(varName, j);
        // Aplica filtro de SKUs ocultos em E.produtos baseado na base ativa
        if(varName === 'E' && typeof _aplicarHiddenFilterE === 'function'){
          _aplicarHiddenFilterE();
        }
        // Pré-calcular badge de alertas quando E (estoque) carrega
        if(varName === 'E' && typeof _preCalcularBadgeAlertas === 'function'){
          setTimeout(_preCalcularBadgeAlertas, 100);
        }
        // Atualizar freshness no header (qualquer JSON pode trazer data)
        if(typeof _atualizarSnapshotHeader === 'function'){
          setTimeout(_atualizarSnapshotHeader, 50);
        }
        // Re-renderizar páginas dependentes se alguma estiver ativa
        const active = document.querySelector('.page.active');
        if(active && paginasQueDependem && paginasQueDependem.length){
          const pgId = active.id.replace('page-','');
          const dep = paginasQueDependem.some(function(p){
            return pgId === p || pgId.indexOf(p) === 0;
          });
          if(dep && typeof renderPage === 'function'){
            if(typeof renderedPages !== 'undefined') renderedPages.delete(pgId);
            renderPage(pgId);
          }
        }
      } else {
      }
      return j;
    });
  }

  // Disparos paralelos. Cada um roda independente. Cubo é lazy (sob demanda).
  // Vendas: tenta vendas_<base>.json primeiro, com fallback para vendas.json (legado).
  _fetchModular('vendas_'+baseSlug+'.json',       'V',   ['v-'], ['vendas.json']);
  _fetchModular('compras_'+baseSlug+'.json',      'C',   ['cv','deptos','fornecedores','executivo','home']);
  _fetchModular('estoque_'+baseSlug+'.json',      'E',   ['estoque','excesso','vencidos','abc','executivo','home']);
  _fetchModular('devolucoes_'+baseSlug+'.json',   'Dev', ['fornecedores','diag-forn']);
  _fetchModular('financeiro_'+baseSlug+'.json',   'F',   ['financeiro','executivo','home']);
  _fetchModular('recebimentos_'+baseSlug+'.json', 'R',   ['recebimentos','financeiro','executivo']);
  _fetchModular('verbas_'+baseSlug+'.json',       'Vb',  ['verbas','fornecedores']);
  // Cubo NÃO é carregado aqui — só sob demanda em _carregarCuboLazy().
}

function _renderSnapshotBanner(){
  // Banner de snapshot
  if(_snapshotCarregado && !document.getElementById('snapBanner')){
    const banner = document.createElement('div');
    banner.id = 'snapBanner';
    banner.style.cssText = 'background:var(--warning);color:#1a1a1a;padding:6px 14px;font-size:11px;font-weight:700;text-align:center;font-family:JetBrains Mono,monospace;letter-spacing:.05em;display:flex;align-items:center;justify-content:center;gap:10px;z-index:60;position:relative;';
    banner.innerHTML = '⚠ MODO RETRATO · Visualizando dados de '+esc(_snapshotCarregado.data)+' &nbsp;·&nbsp; <a href="'+escUrl(window.location.pathname)+'" style="color:#1a1a1a;text-decoration:underline;">Voltar a versao atual</a>';
    const topbar = document.querySelector('.topbar');
    if(topbar && topbar.parentNode){
      topbar.parentNode.insertBefore(banner, topbar);
    }
  }
}

// Renderizar seletor de filial em ÁRVORE no topbar (GPC > ATP / CP > CP1, CP3...)
function _renderSeletorFilial(){
  const perfil = _getPerfilUsuario();
  if(!perfil) return;
  const podeVerTodas = !perfil.filiaisPermitidas || perfil.filiaisPermitidas.includes('__todas__');
  const filiaisVisiveis = podeVerTodas
    ? _filiaisDisponiveis
    : _filiaisDisponiveis.filter(f => perfil.filiaisPermitidas.includes(f.sigla));

  // Se so tem 1 filial visivel, nao mostrar seletor (perfil restrito)
  if(filiaisVisiveis.length <= 1) return;

  // Local: dentro de .brand depois de .brand-text
  const brand = document.querySelector('.brand');
  if(!brand || document.getElementById('filialSeletor')) return;

  // Determina sigla atual (filial selecionada ou raiz)
  const siglaAtual = _filialAtual ? _filialAtual.sigla : (filiaisVisiveis[0]?.sigla || 'grupo');
  const filAtualObj = filiaisVisiveis.find(f => f.sigla === siglaAtual) || filiaisVisiveis[0];
  const labelAtual = filAtualObj ? filAtualObj.nome : 'GPC';

  // Container do seletor
  const wrap = document.createElement('div');
  wrap.id = 'filialSeletor';
  wrap.style.cssText = 'position:relative;display:flex;align-items:center;gap:6px;margin-left:18px;padding-left:18px;border-left:1px solid rgba(255,255,255,.18);';

  wrap.innerHTML = ''
    + '<span style="font-family:JetBrains Mono,monospace;font-size:9px;color:#c9d0da;text-transform:uppercase;letter-spacing:.1em;">VISÃO</span>'
    + '<button id="filialBtn" type="button" style="background:rgba(255,255,255,.1);color:white;border:1px solid rgba(255,255,255,.2);padding:5px 10px;border-radius:5px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;">'
    +   '<span id="filialBtnLabel">' + esc(labelAtual) + '</span>'
    +   '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4l3 3 3-3"/></svg>'
    + '</button>'
    + '<div id="filialDropdown" style="display:none;position:absolute;top:calc(100% + 6px);left:0;background:#fff;color:#111;border:1px solid #d0d4dc;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.18);min-width:280px;max-height:480px;overflow-y:auto;z-index:1000;padding:6px;"></div>';

  brand.appendChild(wrap);

  // Constrói a árvore como lista hierárquica
  function _buildTreeHTML(){
    // Indexar filiais por sigla
    const idx = {};
    filiaisVisiveis.forEach(f => { idx[f.sigla] = f; });
    // Pegar raízes (sem parent, ou cujo parent não está visível)
    const raizes = filiaisVisiveis.filter(f => !f.parent || !idx[f.parent]);
    let expandidos;
    try { expandidos = JSON.parse(localStorage.getItem('_filialTreeExpandidos') || '["grupo","cp"]'); }
    catch(e){ expandidos = ["grupo","cp"]; }

    function nodeHTML(f, nivel){
      const filhos = filiaisVisiveis.filter(c => c.parent === f.sigla);
      const isExpandido = expandidos.includes(f.sigla);
      const isAtual = f.sigla === siglaAtual;
      const temFilhos = filhos.length > 0;
      const padding = nivel * 16 + 6;

      let html = '<div class="fil-tree-row" data-sigla="' + escAttr(f.sigla) + '" '
        + 'style="display:flex;align-items:center;gap:6px;padding:7px 8px 7px '+padding+'px;border-radius:6px;cursor:pointer;'
        + (isAtual ? 'background:#e8f0ff;font-weight:600;' : '')
        + '">';

      if(temFilhos){
        html += '<button class="fil-tree-toggle" data-toggle="' + escAttr(f.sigla) + '" type="button" '
          + 'style="background:transparent;border:0;padding:0;cursor:pointer;color:#566;width:14px;height:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
          + (isExpandido
            ? '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 4l3 3 3-3"/></svg>'
            : '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 2l3 3-3 3"/></svg>')
          + '</button>';
      } else {
        html += '<span style="width:14px;flex-shrink:0;"></span>';
      }

      // Ícone de tipo
      let icon = '•';
      if(f.tipo === 'raiz') icon = '⌂';
      else if(f.tipo === 'base') icon = '◆';
      else if(f.tipo_negocio === 'atacado') icon = '⚙';
      else if(f.tipo_negocio === 'varejo') icon = '🏪';

      html += '<span style="font-size:13px;width:14px;text-align:center;">' + icon + '</span>';
      html += '<span style="flex:1;font-size:13px;">' + esc(f.nome) + '</span>';

      if(isAtual){
        html += '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#1e6cd9" stroke-width="2"><path d="M3 7l3 3 5-6"/></svg>';
      }

      html += '</div>';

      if(temFilhos && isExpandido){
        filhos.forEach(c => { html += nodeHTML(c, nivel + 1); });
      }
      return html;
    }

    return raizes.map(r => nodeHTML(r, 0)).join('');
  }

  function _refreshTree(){
    const dd = document.getElementById('filialDropdown');
    if(dd) dd.innerHTML = _buildTreeHTML();
  }

  _refreshTree();

  const btn = document.getElementById('filialBtn');
  const dd = document.getElementById('filialDropdown');

  btn.addEventListener('click', function(e){
    e.stopPropagation();
    const willOpen = dd.style.display === 'none';
    dd.style.display = willOpen ? 'block' : 'none';
    // Se abriu, fecha o dropdown de usuário (menu manager)
    if(willOpen){
      const ud = document.getElementById('userDrop');
      if(ud) ud.style.display = 'none';
    }
  });

  // Click fora fecha
  document.addEventListener('click', function(e){
    if(!wrap.contains(e.target)) dd.style.display = 'none';
  });

  // Delegação dentro da árvore
  dd.addEventListener('click', function(e){
    const toggleBtn = e.target.closest('.fil-tree-toggle');
    if(toggleBtn){
      e.stopPropagation();
      const sigla = toggleBtn.getAttribute('data-toggle');
      let expandidos;
      try { expandidos = JSON.parse(localStorage.getItem('_filialTreeExpandidos') || '["grupo","cp"]'); }
      catch(e){ expandidos = ["grupo","cp"]; }
      const idx = expandidos.indexOf(sigla);
      if(idx >= 0) expandidos.splice(idx, 1);
      else expandidos.push(sigla);
      localStorage.setItem('_filialTreeExpandidos', JSON.stringify(expandidos));
      _refreshTree();
      return;
    }
    const row = e.target.closest('.fil-tree-row');
    if(row){
      const sigla = row.getAttribute('data-sigla');
      _auditLog('filial_change', {de: _filialAtual ? _filialAtual.sigla : 'consolidado', para: sigla});
      const url = new URL(window.location);
      if(sigla && sigla !== 'grupo') url.searchParams.set('filial', sigla);
      else url.searchParams.delete('filial');
      url.searchParams.delete('snapshot');
      window.location = url.toString();
    }
  });
}

// Bootstrap: verificar autenticação primeiro
// Adiado pra DOMContentLoaded pra garantir que todos os arquivos JS estejam carregados
// (core.js, render-compras.js, render-vendas.js, render-outros.js, admin.js)
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', _bootstrapComAuth);
} else {
  _bootstrapComAuth();
}

// ════════════════════════════════════════════════════════════════════════
// Drill-through global · clique em elementos com data-prod-cod ou data-forn-cod
// abre a página de diagnóstico correspondente. Funciona em qualquer tabela
// ou card que marque o elemento com esses atributos.
// Adicionado em v4.29 (etapa 6 da reformulação)
// ════════════════════════════════════════════════════════════════════════
document.addEventListener('click', function(e){
  // Procura o ancestral mais próximo com data-prod-cod ou data-forn-cod
  const elProd = e.target.closest('[data-prod-cod]');
  const elForn = e.target.closest('[data-forn-cod]');
  // Ignora se o elemento pai for um botão/link normal pra não interferir
  if(elProd && typeof window._openProdNovo === 'function'){
    const cod = parseInt(elProd.getAttribute('data-prod-cod'), 10);
    if(cod){
      e.preventDefault();
      e.stopPropagation();
      window._openProdNovo(cod);
    }
    return;
  }
  if(elForn && typeof window._openFornNovo === 'function'){
    const cod = parseInt(elForn.getAttribute('data-forn-cod'), 10);
    if(cod){
      e.preventDefault();
      e.stopPropagation();
      window._openFornNovo(cod);
    }
    return;
  }
});


// Renderiza widget de usuário/logout no canto direito do topbar
function _renderUserWidget(){
  const sess = _getSessao();
  const perfil = _getPerfilUsuario();
  if(!sess || !perfil) return;
  if(document.getElementById('userWidget')) return;

  const right = document.querySelector('.topbar > div:last-child');
  if(!right) return;

  const wrap = document.createElement('div');
  wrap.id = 'userWidget';
  wrap.style.cssText = 'position:relative;display:flex;align-items:center;gap:8px;margin-left:14px;padding-left:14px;border-left:1px solid rgba(255,255,255,.18);';
  const inicial = esc((perfil.nome || perfil.email || '?').trim().charAt(0).toUpperCase());
  const nomeEsc = esc(perfil.nome||perfil.email||'');
  const emailEsc = esc(perfil.email||'');
  const perfilNomeEsc = esc(perfil.perfilNome||'');
  wrap.innerHTML = '<button id="userMenuBtn" style="display:flex;align-items:center;gap:8px;background:transparent;border:none;cursor:pointer;color:white;font-family:inherit;padding:4px;border-radius:6px;">'
    +'<div style="width:30px;height:30px;background:rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;">'+inicial+'</div>'
    +'<div style="text-align:left;line-height:1.2;">'
    +'<div style="font-size:11px;font-weight:600;">'+nomeEsc+'</div>'
    +'<div style="font-size:9px;color:#c9d0da;text-transform:uppercase;letter-spacing:.05em;">'+perfilNomeEsc+'</div>'
    +'</div>'
    +'<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>'
    +'</button>'
    +'<div id="userDrop" style="display:none;position:absolute;top:100%;right:0;margin-top:6px;background:white;color:var(--text);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.18);min-width:240px;z-index:100;overflow:hidden;">'
    +'<div style="padding:14px 16px;border-bottom:1px solid #eee;">'
    +'<div style="font-weight:700;font-size:13px;color:#1a1a1a;">'+nomeEsc+'</div>'
    +'<div style="font-size:11px;color:#666;margin-top:2px;">'+emailEsc+'</div>'
    +'<div style="margin-top:6px;display:inline-block;background:#1a2f5c;color:white;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">'+perfilNomeEsc+'</div>'
    +'</div>'
    +'<button onclick="_alterarSenhaUI()" style="width:100%;text-align:left;padding:11px 16px;background:transparent;border:none;cursor:pointer;font-size:13px;color:#1a1a1a;display:flex;align-items:center;gap:8px;font-family:inherit;border-bottom:1px solid #eee;" onmouseover="this.style.background=\'#f5f5f5\'" onmouseout="this.style.background=\'transparent\'">'
    +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>'
    +'Alterar senha</button>'
    +'<button onclick="_logout()" style="width:100%;text-align:left;padding:11px 16px;background:transparent;border:none;cursor:pointer;font-size:13px;color:#1a1a1a;display:flex;align-items:center;gap:8px;font-family:inherit;" onmouseover="this.style.background=\'#f5f5f5\'" onmouseout="this.style.background=\'transparent\'">'
    +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
    +'Sair</button>'
    + (AUTH_MODE === 'mock' && perfil.podeGerenciarUsuarios ? '<div style="padding:8px 16px;background:#fee;color:#c33;font-size:10px;font-family:JetBrains Mono,monospace;border-top:1px solid #eee;">⚠ MODO MOCK · senhas em localStorage</div>' : '')
    + '</div>';
  right.appendChild(wrap);

  document.getElementById('userMenuBtn').addEventListener('click', function(e){
    e.stopPropagation();
    const drp = document.getElementById('userDrop');
    const willOpen = drp.style.display === 'none';
    drp.style.display = willOpen ? 'block' : 'none';
    // Se abriu, fecha o dropdown de filial (menu manager)
    if(willOpen){
      const fd = document.getElementById('filialDropdown');
      if(fd) fd.style.display = 'none';
    }
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('#userWidget')){
      const drp = document.getElementById('userDrop');
      if(drp) drp.style.display = 'none';
    }
  });
}

// Aplicar permissões de página: esconder no sidebar páginas não permitidas
function _aplicarPermissoesPaginas(){
  const perfil = _getPerfilUsuario();
  if(!perfil) return;
  const pp = perfil.paginasPermitidas;
  // null/undefined/array vazio = sem restrição (admin/super-usuário pode tudo)
  // Só restringe quando há um array com páginas listadas
  if(!pp || !Array.isArray(pp) || pp.length === 0){
    return;
  }
  const permitidas = new Set(pp);
  document.querySelectorAll('.sb-link[data-p]').forEach(function(btn){
    const pg = btn.dataset.p;
    if(!permitidas.has(pg)){
      btn.style.display = 'none';
    } else {
      btn.style.display = '';
    }
  });
  // Esconder labels de seções vazias (incluindo grupos recolhíveis)
  document.querySelectorAll('.sb-sec, .sb-group').forEach(function(sec){
    const visiveis = sec.querySelectorAll('.sb-link:not([style*="display: none"])').length;
    if(visiveis === 0) sec.style.display = 'none';
    else sec.style.display = '';
  });
}

// Sidebar accordion: abre o grupo clicado e fecha os outros (uma seção por vez)
function _toggleSbGroup(nome){
  const alvo = document.querySelector('.sb-group[data-group="'+nome+'"]');
  if(!alvo) return;
  const jaAberto = alvo.classList.contains('is-open');
  document.querySelectorAll('.sb-group').forEach(function(g){ g.classList.remove('is-open'); });
  if(!jaAberto){
    alvo.classList.add('is-open');
    try { localStorage.setItem('sb_aberta', nome); } catch(e){}
  } else {
    try { localStorage.removeItem('sb_aberta'); } catch(e){}
  }
}
window._toggleSbGroup = _toggleSbGroup;

// Abre automaticamente o grupo que contém a página ativa
function _expandirGrupoDaPaginaAtiva(){
  const ativo = document.querySelector('.sb-link.active[data-p]');
  if(!ativo) return;
  const grupo = ativo.closest('.sb-group');
  if(!grupo) return; // página ativa é link direto, não está em grupo
  document.querySelectorAll('.sb-group').forEach(function(g){ g.classList.remove('is-open'); });
  grupo.classList.add('is-open');
  try { localStorage.setItem('sb_aberta', grupo.dataset.group); } catch(e){}
}
window._expandirGrupoDaPaginaAtiva = _expandirGrupoDaPaginaAtiva;

// ================================================================
// NOVIDADES · modal com CHANGELOG renderizado (etapa #8 da auditoria)
// ================================================================
// Carrega o arquivo CHANGELOG.md (relativo à raiz do dist) e renderiza
// num modal flutuante. Renderização markdown bem básica — cobre o que
// usamos: ## headers, **bold**, *italic*, listas com -, parágrafos, ---.
// Não dependemos de biblioteca externa.

function _renderMarkdownSimples(md){
  // Escape HTML primeiro
  let html = md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // Bloco de código (` `) inline
  html = html.replace(/`([^`]+)`/g, '<code style="background:var(--surface-2);padding:1px 5px;border-radius:3px;font-size:11px;">$1</code>');

  // Headers
  html = html.replace(/^## (.+)$/gm, '<h3 style="font-size:14px;margin:18px 0 8px;color:var(--accent);font-weight:700;">$1</h3>');
  html = html.replace(/^# (.+)$/gm, '<h2 style="font-size:18px;margin:0 0 12px;font-weight:800;">$1</h2>');

  // Linha horizontal
  html = html.replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:14px 0;">');

  // Negrito e itálico
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

  // Listas: linhas começando com "- "
  // Estratégia: marcar primeiro, depois agrupar
  const linhas = html.split('\n');
  const out = [];
  let inList = false;
  for(let i = 0; i < linhas.length; i++){
    const ln = linhas[i];
    const m = ln.match(/^- (.+)$/);
    if(m){
      if(!inList){ out.push('<ul style="margin:6px 0;padding-left:18px;">'); inList = true; }
      out.push('<li style="margin:3px 0;">'+m[1]+'</li>');
    } else {
      if(inList){ out.push('</ul>'); inList = false; }
      out.push(ln);
    }
  }
  if(inList) out.push('</ul>');
  html = out.join('\n');

  // Parágrafos: linhas em branco viram quebra. Linhas simples viram <p>
  // Faz uma passada simples
  html = html.split(/\n\n+/).map(function(bloco){
    bloco = bloco.trim();
    if(!bloco) return '';
    // Se já é tag block, preserva
    if(/^<(h[123]|ul|hr|p)/i.test(bloco)) return bloco;
    return '<p style="margin:6px 0;line-height:1.5;">'+bloco.replace(/\n/g,'<br>')+'</p>';
  }).join('\n');

  return html;
}

let _changelogCache = null;
async function _abrirNovidades(){
  // Modal overlay
  let overlay = document.getElementById('novidades-overlay');
  if(overlay){ overlay.style.display = 'flex'; return; }

  overlay = document.createElement('div');
  overlay.id = 'novidades-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = '<div style="background:var(--surface);border-radius:12px;max-width:720px;width:100%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 50px rgba(0,0,0,.3);">'
    +   '<div style="padding:16px 22px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">'
    +     '<h2 style="margin:0;font-size:16px;font-weight:800;letter-spacing:.05em;">Novidades · Comercial GPC</h2>'
    +     '<button id="novidades-fechar" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-muted);line-height:1;padding:0 6px;">×</button>'
    +   '</div>'
    +   '<div id="novidades-corpo" style="padding:18px 22px;overflow-y:auto;font-family:\'Inter\',sans-serif;font-size:13px;color:var(--text);">'
    +     '<div style="text-align:center;color:var(--text-muted);padding:30px;">Carregando…</div>'
    +   '</div>'
    + '</div>';
  document.body.appendChild(overlay);

  // Fechar
  function fechar(){ overlay.style.display = 'none'; }
  overlay.querySelector('#novidades-fechar').addEventListener('click', fechar);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) fechar(); });
  document.addEventListener('keydown', function escFechar(e){
    if(e.key === 'Escape' && overlay.style.display !== 'none'){
      fechar();
      document.removeEventListener('keydown', escFechar);
    }
  });

  // Carregar e renderizar
  const corpo = overlay.querySelector('#novidades-corpo');
  try {
    if(!_changelogCache){
      const r = await fetch('CHANGELOG.md', {cache:'default'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      _changelogCache = await r.text();
    }
    corpo.innerHTML = _renderMarkdownSimples(_changelogCache);
  } catch(e){
    corpo.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:30px;">'
      +   'Não foi possível carregar o histórico de versões.<br>'
      +   '<span style="font-size:11px;">'+(e.message||'')+'</span>'
      + '</div>';
  }
}
window._abrirNovidades = _abrirNovidades;

async function _initSistema(){
  const tagVer = document.getElementById('app-version-tag');
  if(tagVer) tagVer.textContent = 'v'+APP_VERSION;
  // Plugar link Novidades do rodapé (abre modal com CHANGELOG)
  const linkNov = document.getElementById('link-novidades');
  if(linkNov){
    linkNov.addEventListener('click', function(e){
      e.preventDefault();
      _abrirNovidades();
    });
  }
  // Popular cache do perfil (async p/ Firebase, instantâneo p/ mock)
  try {
    await _populatePerfilCache();
  } catch(e){
    console.warn('[_initSistema] Erro ao popular perfil:', e);
  }
  // Carrega config de supervisores ignorados ANTES de iniciar as páginas
  // pra evitar race condition: as páginas que filtram (RCA, Drill-Down, Inadimplência)
  // chamam _isSupervisorIgnorado, que retorna false se o cache ainda for null,
  // ignorando a config do usuário e mostrando dados que deveriam estar filtrados.
  try {
    await _carregarSupervisoresIgnorados();
  } catch(e){
    console.warn('[_initSistema] erro supervisores ignorados:', e);
  }
  _renderSnapshotBanner();
  _renderSeletorFilial();
  _renderUserWidget();
  const loader = document.getElementById('dataLoader');
  if(loader) loader.style.display = 'none';
  _initRunApp();
  // Aplicar permissões depois do _initRunApp pois ele monta o sidebar
  setTimeout(_aplicarPermissoesPaginas, 50);
  // Restaurar estado do accordion da sidebar
  setTimeout(function(){
    // Se a página ativa está dentro de um grupo, abre esse grupo
    const ativo = document.querySelector('.sb-link.active[data-p]');
    const grupoDoAtivo = ativo ? ativo.closest('.sb-group') : null;
    if(grupoDoAtivo){
      grupoDoAtivo.classList.add('is-open');
      return;
    }
    // Senão, restaura o que estava aberto antes (se houver)
    let salvo = null;
    try { salvo = localStorage.getItem('sb_aberta'); } catch(e){}
    if(salvo){
      const g = document.querySelector('.sb-group[data-group="'+salvo+'"]');
      if(g) g.classList.add('is-open');
    }
    // Default: ambas recolhidas (não faz nada)
  }, 60);
  // Restaurar página persistida (quando o user troca de visão de empresa, voltar pra mesma página)
  setTimeout(_restaurarPaginaPersistida, 80);
}

/**
 * Restaura a página onde o usuário estava antes da troca de filial/base.
 * Lê _paginaAtual do localStorage e simula o click no menu correspondente.
 * Tolera: página inexistente para a base atual, sem permissão, ou sem dados.
 */
function _restaurarPaginaPersistida(){
  let pg = null;
  try { pg = localStorage.getItem('_paginaAtual'); } catch(e){}
  if(!pg || pg === 'home') return; // sem persistência ou já é home

  // Página existe no DOM?
  const pageEl = document.getElementById('page-'+pg);
  if(!pageEl) return;
  // Botão do menu existe e está visível?
  const sbBtn = document.querySelector('.sb-link[data-p="'+pg+'"]');
  if(!sbBtn) return;
  // Foi escondido por permissões?
  const ocultoPorPerm = sbBtn.style.display === 'none';
  if(ocultoPorPerm) return;
  // Permissão do perfil
  try {
    const perfil = _getPerfilUsuario();
    if(perfil && perfil.paginasPermitidas && !perfil.paginasPermitidas.includes(pg)) return;
  } catch(e){}

  // Simula click no menu (já tem toda a lógica certa de troca de página)
  try { sbBtn.click(); } catch(e){
    console.warn('[_restaurarPaginaPersistida] Falha ao restaurar página:', e);
  }
}

function _initRunApp(){
  // Em modo modular, D fica null por design — as páginas consomem V/C/E/F/R/Vb/Dev
  // diretamente. D só é usado por código legado que checa _placeholder.
  if(typeof D === 'undefined' || D === null){
    // Cria objeto mínimo para impedir erros em código que toca D antes do render
    D = {produtos:[], departamentos:[], fornecedores:[], meta:{}, _placeholder:true};
  }
  // Aplicar filtros depois que D está pronto
  if(typeof _applyHiddenFilterDeferred === 'function') _applyHiddenFilterDeferred();
}


// ================================================================
// HELPERS
// ================================================================
const fB=(n,d=2)=>'R$ '+(n||0).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});
const fAbbr=n=>{n=n||0;if(Math.abs(n)>=1e6)return'R$'+(n/1e6).toFixed(2)+'M';if(Math.abs(n)>=1e3)return'R$'+(n/1e3).toFixed(1)+'k';return fB(n,0);};
const fK=n=>fB(n,0);
const fP=(n,d=1)=>((n||0).toFixed(d))+'%';
const fI=n=>Math.round(n||0).toLocaleString('pt-BR');
const fN=(n,d=0)=>(n||0).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});
// Item 2: datas em DD/MM/AAAA
const fD=d=>d?d.slice(8)+'/'+d.slice(5,7)+'/'+d.slice(0,4):'—';
// fDt: formato preferido pelo usuário em DD-MM-AAAA (com traço, padrão do sistema)
// Aceita 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS' ou Date.
const fDt=d=>{
  if(!d) return '—';
  if(typeof d === 'string'){
    // pega só os 10 primeiros caracteres se vier datetime
    const s = d.slice(0, 10);
    if(s.length !== 10 || s.charAt(4) !== '-') return d;
    return s.slice(8) + '-' + s.slice(5, 7) + '-' + s.slice(0, 4);
  }
  if(d instanceof Date){
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return dd + '-' + m + '-' + y;
  }
  return '—';
};
// _dataLocal(): retorna 'YYYY-MM-DD' no timezone do usuário (não UTC)
// Diferente de new Date().toISOString().slice(0,10) que usa UTC e pode estar
// 1 dia "à frente" para usuários no Brasil (UTC-3) após as 21h locais.
function _dataLocal(d){
  const dt = d || new Date();
  return dt.getFullYear()
    + '-' + String(dt.getMonth()+1).padStart(2,'0')
    + '-' + String(dt.getDate()).padStart(2,'0');
}
const mc=m=>m<0?'val-neg':(m>15?'val-pos':'');

// Item 7: nova lógica de cobertura — OK ≤ 80%, Atenção 80-100%, Excesso >100%
const cobCls=c=>c>100?_PAL.dn+'CC':c>80?_PAL.wn+'CC':_PAL.ok+'CC';
const cobTag=c=>c>100?'<span class="tag dnd">Excesso</span>':c>80?'<span class="tag ori">Atenção</span>':'<span class="tag grn">OK</span>';
const cobClsText=c=>c>100?'val-neg':c>80?'':'val-pos';

// Item 8: valores líquidos
const comLiq=(com,dvf)=>(com||0)-(dvf||0);

const _PAL={ac:'#2E476F',hl:'#F58634',ok:'#109854',dn:'#d92d20',vi:'#7c3aed',wn:'#b45309'};
const PERS=['2026-01','2026-02','2026-03','2026-04'];
const PLBL=['Jan/26','Fev/26','Mar/26','Abr/26'];

Chart.defaults.font.family="'Archivo',sans-serif";
Chart.defaults.font.size=11;
Chart.defaults.color='#6b7280';
Chart.defaults.borderColor='#e4e8ee';

const CH={};
function mkC(id,cfg){
  const ctx=document.getElementById(id);
  if(!ctx)return null;
  if(CH[id])CH[id].destroy();
  CH[id]=new Chart(ctx,cfg);
  // Força resize após o layout estabilizar — evita gráficos cortados
  // (especialmente donuts/pizzas que dependem de medir o container).
  // 2 ticks: um pro próximo frame, outro pra qualquer reflow tardio.
  requestAnimationFrame(function(){
    if(CH[id]) CH[id].resize();
    setTimeout(function(){ if(CH[id]) CH[id].resize(); }, 100);
  });
  return CH[id];
}

// Índices de produtos (só existe em modo filial, não em consolidado)
const byC=new Map(),byE=new Map();
if(D && D.produtos && Array.isArray(D.produtos)){
  D.produtos.forEach(p=>{
    byC.set(p.c,p);
    if(p.ea&&p.ea!==0)byE.set(String(p.ea),p);
  });
}



// ================================================================
// HISTORICO - snapshots de versoes anteriores
// ================================================================
async function renderHistorico(){
  const cont = document.getElementById('page-historico');
  cont.innerHTML = '<div class="ph"><div class="pk">Configuração</div><h2>Histórico <em>de versões</em></h2></div>'
    +'<div class="ph-sep"></div>'
    +'<div class="page-body">'
    +'<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-top:10px;margin-bottom:14px;font-size:12px;color:var(--text-dim);display:flex;align-items:start;gap:10px;">'
    +'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-top:2px;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
    +'<div>Cada retrato é uma fotografia dos dados em uma data específica. Clique em <strong>Carregar</strong> para navegar pelo sistema com os dados daquele dia. Para voltar à versão atual, clique em <strong>Voltar à versão atual</strong>.</div>'
    +'</div>'
    +'<div id="hist-loading" style="text-align:center;padding:40px;color:var(--text-muted);">'
    +'<div style="width:32px;height:32px;border:3px solid var(--surface-3);border-top-color:var(--accent);border-radius:50%;animation:dlSpin 0.8s linear infinite;margin:0 auto 12px;"></div>'
    +'Buscando retratos disponíveis...'
    +'</div>'
    +'<div id="hist-content" style="display:none;"></div>'
    +'</div>';

  try {
    const resp = await fetch('snapshots.json', {cache:'no-cache'});
    if(!resp.ok) throw new Error('HTTP '+resp.status);
    const idx = await resp.json();
    document.getElementById('hist-loading').style.display = 'none';
    const inner = document.getElementById('hist-content');
    inner.style.display = 'block';
    const snaps = (idx.snapshots||[]).sort((a,b)=>b.data.localeCompare(a.data));

    let bannerSnap = '';
    if(_snapshotCarregado){
      bannerSnap = '<div style="background:var(--warning-bg);border:1px solid var(--warning);border-radius:8px;padding:14px 16px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">'
        +'<div style="font-size:13px;color:var(--warning);font-weight:600;">⚠ Você está visualizando o retrato de <strong>'+_snapshotCarregado.data+'</strong></div>'
        +'<a href="'+escUrl(window.location.pathname)+'" class="ebtn" style="background:var(--accent);color:white;border:none;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">'
        +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>'
        +'Voltar à versão atual</a></div>';
    }

    const linhas = snaps.map(function(s,i){
      const dt = s.data.split('-').reverse().join('/');
      const isAtual = (i===0);
      const isCarregado = _snapshotCarregado && _snapshotCarregado.data===s.data;
      let tags = '';
      if(isAtual) tags += ' <span class="tag grn" style="font-size:9px;margin-left:4px;">ATUAL</span>';
      if(isCarregado) tags += ' <span class="tag ori" style="font-size:9px;margin-left:4px;">CARREGADO</span>';
      let acao;
      if(isCarregado){
        acao = '<span style="color:var(--text-muted);font-size:11px;">— em uso —</span>';
      } else {
        acao = '<a href="?snapshot='+encodeURIComponent(s.data)+'" class="ebtn" style="background:var(--surface-2);border:1px solid var(--border-strong);color:var(--text);text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-size:11px;padding:4px 10px;">'
          +'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Carregar</a>';
      }
      const bg = isCarregado ? 'style="background:var(--warning-bg);"' : '';
      return '<tr '+bg+'>'
        +'<td class="L" style="font-family:JetBrains Mono,monospace;font-weight:700;">'+dt+tags+'</td>'
        +'<td class="L val-dim" style="font-family:JetBrains Mono,monospace;font-size:11px;">'+esc(s.arquivo)+'</td>'
        +'<td class="L">'+(s.label || '—')+'</td>'
        +'<td class="L">'+acao+'</td></tr>';
    }).join('');

    const dataAtualizacao = idx.atualizado_em ? new Date(idx.atualizado_em).toLocaleDateString('pt-BR') : '—';
    inner.innerHTML = bannerSnap
      +'<div class="ds"><div class="ds-hdr">'
      +'<div class="ds-ico" style="background:var(--accent-bg);color:var(--accent-text);">'
      +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
      +'</div><div>'
      +'<div class="ds-title">Retratos disponíveis</div>'
      +'<div class="ds-sub">'+snaps.length+' versão'+(snaps.length===1?'':'es')+' salva'+(snaps.length===1?'':'s')+' · Índice atualizado em '+dataAtualizacao+'</div>'
      +'</div></div>'
      +'<div class="ds-body np"><div class="tscroll"><table class="t">'
      +'<thead><tr><th class="L">Data</th><th class="L">Arquivo</th><th class="L">Descrição</th><th class="L">Ação</th></tr></thead>'
      +'<tbody>'+linhas+'</tbody></table></div></div></div>';

  } catch(err){
    document.getElementById('hist-loading').style.display = 'none';
    const inner = document.getElementById('hist-content');
    inner.style.display = 'block';
    // Se snapshots.json simplesmente não existe (404), mostra "em construção"
    // em vez de tela de erro vermelha (a feature não está implementada ainda).
    const eh404 = err && err.message && err.message.indexOf('404') >= 0;
    if(eh404){
      inner.innerHTML = '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:30px 24px;text-align:center;color:var(--text-muted);">'
        +'<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:12px;opacity:.5;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
        +'<div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;">Histórico em construção</div>'
        +'<div style="font-size:12px;line-height:1.5;max-width:480px;margin:0 auto;">A funcionalidade de retratos de versão ainda não está disponível para esta base. '
        +'Quando o ETL gerar fotografias periódicas dos dados, elas aparecerão aqui para você navegar entre versões.</div>'
        +'</div>';
    } else {
      inner.innerHTML = '<div style="background:var(--danger-bg);border:1px solid var(--danger-text);border-radius:8px;padding:14px 16px;color:var(--danger-text);font-size:13px;">'
        +'<strong>Erro ao carregar retratos.json</strong><br>'+esc(err.message)+'<br><br>'
        +'Verifique se o arquivo <code>snapshots.json</code> está presente no servidor.</div>';
    }
  }
}



// ================================================================
// ADMIN - Gestão de usuários (mock)
// ================================================================
async function renderAdmUsuarios(){
  const el = document.getElementById('adm-usuarios-list');
  if(!el) return;
  el.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px;">Carregando usuários...</div>';
  const usuarios = await _getUsuarios();
  const perfis = await _getPerfis();

  el.innerHTML = '<div style="display:flex;flex-direction:column;gap:8px;">' + usuarios.map(function(u){
    const tplPerfil = perfis[u.perfil] || {nome: u.perfil};
    const ult = u.ultimo_acesso ? new Date(u.ultimo_acesso).toLocaleDateString('pt-BR') + ' ' + new Date(u.ultimo_acesso).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}) : 'Nunca';
    const statusBadge = u.ativo
      ? '<span class="tag grn" style="font-size:9px;">ATIVO</span>'
      : '<span class="tag" style="font-size:9px;background:#ddd;color:#666;">INATIVO</span>';
    const senhaTempBadge = u.senha_temp ? ' <span class="tag ori" style="font-size:9px;">SENHA TEMP</span>' : '';

    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border:1px solid var(--border);border-radius:8px;background:var(--surface-2);gap:12px;flex-wrap:wrap;">'
      +'<div style="flex:1;min-width:240px;">'
      +'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'
      +'<strong style="font-size:13px;">'+esc(u.nome)+'</strong>'
      +'<span style="font-size:11px;color:var(--text-muted);font-family:JetBrains Mono,monospace;">'+esc(u.email)+'</span>'
      +statusBadge+senhaTempBadge
      +'</div>'
      +'<div style="font-size:10px;color:var(--text-muted);font-family:JetBrains Mono,monospace;margin-top:4px;text-transform:uppercase;letter-spacing:.05em;">'
      +'PERFIL: '+esc(tplPerfil.nome)+' · ÚLTIMO ACESSO: '+esc(ult)
      +'</div>'
      +'</div>'
      +'<div style="display:flex;gap:6px;flex-wrap:wrap;">'
      +'<button onclick="abrirEditarUsuario(\''+escJs(u.uid)+'\')" style="background:var(--surface);border:1px solid var(--border-strong);color:var(--text);padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;font-family:inherit;">Editar</button>'
      +(u.senha_temp ? '<button onclick="limparFlagSenhaTemp(\''+escJs(u.uid)+'\')" title="Marcar como senha definitiva (corrige tag zumbi para usuários que já trocaram a senha)" style="background:transparent;border:1px solid #d97706;color:#d97706;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;font-family:inherit;">Limpar SENHA TEMP</button>' : '')
      +(u.uid !== (_getSessao()||{}).uid ? '<button onclick="toggleAtivoUsuario(\''+escJs(u.uid)+'\')" style="background:transparent;border:1px solid '+(u.ativo?'var(--danger)':'var(--success)')+';color:'+(u.ativo?'var(--danger-text)':'var(--success-text)')+';padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;font-family:inherit;">'+(u.ativo?'Desativar':'Ativar')+'</button>' : '')
      +'</div></div>';
  }).join('') + '</div>';

  // Handler do botão "Novo usuário"
  const btnNovo = document.getElementById('btnNovoUsuario');
  if(btnNovo && !btnNovo._handled){
    btnNovo._handled = true;
    btnNovo.addEventListener('click', function(){ abrirEditarUsuario(null); });
  }
}

window.toggleAtivoUsuario = async function(uid){
  const usuarios = await _getUsuarios();
  const u = usuarios.find(x => x.uid === uid);
  if(!u) return;
  // Proteção contra auto lock-out: usuário não pode desativar a si mesmo
  // (se desativasse, seria expulso na próxima ação e não conseguiria mais entrar)
  const sess = _getSessao();
  if(u.ativo && sess && sess.uid === uid){
    _toast('Você não pode desativar seu próprio usuário. Peça para outro administrador fazê-lo.', 'aviso');
    return;
  }
  const acao = u.ativo ? 'Desativar' : 'Ativar';
  const ok = await _confirm(acao+' o usuário '+u.nome+'?', {titulo: acao+' usuário', perigo: u.ativo, btnOk: acao});
  if(!ok) return;
  u.ativo = !u.ativo;
  const r = await _saveUsuario(u);
  if(!r.ok){ _toast('Erro ao salvar: '+(r.erro||'desconhecido'), 'erro'); return; }
  _auditLog('admin_user_toggle', {alvo_email: u.email, ativo: u.ativo});
  await renderAdmUsuarios();
};

// Limpar a flag senha_temp de um usuário (usado para corrigir casos onde
// a flag ficou zumbi porque o update do Firestore falhava por regra
// antes da correção da v2.0).
window.limparFlagSenhaTemp = async function(uid){
  const usuarios = await _getUsuarios();
  const u = usuarios.find(x => x.uid === uid);
  if(!u) return;
  const okSenha = await _confirm(
    'Marcar a senha de '+u.nome+' como definitiva?\n\nIsso remove a tag SENHA TEMP e assume que o usuário já trocou a senha temporária. Use somente se ele já consegue entrar com uma senha que não é a temporária cadastrada por você.',
    {titulo: 'Marcar senha como definitiva', btnOk: 'Marcar definitiva'}
  );
  if(!okSenha) return;
  try {
    if(AUTH_MODE === 'firebase'){
      await window.fbDb.collection('usuarios').doc(uid).update({ senha_temp: false });
    } else {
      u.senha_temp = false;
      await _saveUsuario(u);
    }
    _fbCacheInvalidate && _fbCacheInvalidate();
    _auditLog('admin_clear_senha_temp', {alvo_email: u.email});
    await renderAdmUsuarios();
  } catch(e){
    _toast('Erro ao limpar flag: '+(e.message||e), 'erro');
  }
};

window.abrirEditarUsuario = async function(uid){
  const novo = !uid;
  const usuarios = await _getUsuarios();
  const u = novo ? {uid:'', nome:'', email:'', perfil:'visualizador', ativo:true, paginas_permitidas:null, filiais_permitidas:null, _senha_mock:'', senha_temp:true} : usuarios.find(x => x.uid === uid);
  if(!u) return;
  const perfis = await _getPerfis();

  // Modal
  const overlay = document.createElement('div');
  overlay.id = 'usrEditOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';

  // Render multi-select de páginas e filiais
  const usaCustomPag = u.paginas_permitidas !== null && u.paginas_permitidas !== undefined;
  const usaCustomFil = u.filiais_permitidas !== null && u.filiais_permitidas !== undefined;
  const pagAtuais = usaCustomPag ? u.paginas_permitidas : (perfis[u.perfil] || {paginas:[]}).paginas;
  const filAtuais = usaCustomFil ? u.filiais_permitidas : (perfis[u.perfil] || {filiais:[]}).filiais;

  const pagsByGrupo = {};
  PAGINAS_CATALOGO.forEach(function(p){
    if(!pagsByGrupo[p.grupo]) pagsByGrupo[p.grupo] = [];
    pagsByGrupo[p.grupo].push(p);
  });

  const pagHtml = Object.entries(pagsByGrupo).map(function(g){
    const [grupoNome, pags] = g;
    return '<div style="margin-bottom:10px;"><div style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;">'+grupoNome+'</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:5px;">'
      +pags.map(function(p){
        const checked = pagAtuais.includes(p.id);
        return '<label style="display:inline-flex;align-items:center;gap:5px;background:var(--surface-2);padding:5px 10px;border-radius:5px;font-size:11px;cursor:pointer;border:1px solid '+(checked?'var(--accent)':'var(--border)')+';"><input type="checkbox" class="usr-pag-cb" value="'+escAttr(p.id)+'" '+(checked?'checked':'')+' style="margin:0;"> '+esc(p.nome)+'</label>';
      }).join('')
      +'</div></div>';
  }).join('');

  const filHtml = '<div style="display:flex;flex-wrap:wrap;gap:5px;">'
    +'<label style="display:inline-flex;align-items:center;gap:5px;background:var(--surface-2);padding:5px 10px;border-radius:5px;font-size:11px;cursor:pointer;border:1px solid '+(filAtuais.includes('__todas__')?'var(--accent)':'var(--border)')+';"><input type="checkbox" class="usr-fil-cb" value="__todas__" '+(filAtuais.includes('__todas__')?'checked':'')+' style="margin:0;"> <strong>Todas as filiais</strong></label>'
    +_filiaisDisponiveis.map(function(f){
      const checked = filAtuais.includes(f.sigla);
      return '<label style="display:inline-flex;align-items:center;gap:5px;background:var(--surface-2);padding:5px 10px;border-radius:5px;font-size:11px;cursor:pointer;border:1px solid '+(checked?'var(--accent)':'var(--border)')+';"><input type="checkbox" class="usr-fil-cb" value="'+escAttr(f.sigla)+'" '+(checked?'checked':'')+' style="margin:0;"> '+esc(f.nome)+'</label>';
    }).join('')
    +'</div>';

  overlay.innerHTML = '<div style="background:var(--surface);border-radius:12px;max-width:680px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.3);">'
    +'<div style="padding:18px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">'
    +'<div><div style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">'+(novo?'Novo usuário':'Editar usuário')+'</div>'
    +'<div style="font-weight:800;font-size:18px;margin-top:2px;">'+(novo ? 'Adicionar acesso ao sistema' : esc(u.nome))+'</div></div>'
    +'<button onclick="document.getElementById(\'usrEditOverlay\').remove()" style="background:transparent;border:none;cursor:pointer;color:var(--text-muted);font-size:22px;padding:0 8px;">×</button>'
    +'</div>'
    +'<div style="padding:18px 22px;">'
    +'<div id="usrEditErr" style="display:none;background:var(--danger-bg);color:var(--danger-text);padding:10px 12px;border-radius:7px;font-size:12px;margin-bottom:12px;"></div>'

    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">'
    +'<div><label style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:5px;">Nome</label>'
    +'<input id="usrNome" type="text" value="'+escAttr(u.nome)+'" style="width:100%;padding:9px 12px;border:1px solid var(--border-strong);border-radius:6px;font-size:13px;box-sizing:border-box;"></div>'
    +'<div><label style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:5px;">Email</label>'
    +'<input id="usrEmail" type="email" value="'+escAttr(u.email)+'" '+(novo?'':'readonly')+' style="width:100%;padding:9px 12px;border:1px solid var(--border-strong);border-radius:6px;font-size:13px;box-sizing:border-box;'+(novo?'':'background:var(--surface-2);')+'"></div>'
    +'</div>'

    +(novo ? (AUTH_MODE === 'firebase'
      ? '<div style="margin-bottom:14px;padding:12px 14px;background:#eff6ff;border:1px solid #93c5fd;border-radius:7px;">'
        +'<div style="font-size:11px;color:#1e40af;font-weight:700;margin-bottom:8px;">⚠ PASSO 1: Criar usuário no Firebase Console</div>'
        +'<ol style="font-size:11px;color:#1e3a8a;line-height:1.6;padding-left:20px;margin:0 0 10px 0;">'
        +'<li>Abra <a href="https://console.firebase.google.com" target="_blank" style="color:#1d4ed8;text-decoration:underline;">Firebase Console</a> → Authentication → Users</li>'
        +'<li>Clique em <strong>Add user</strong>, preencha email e senha temporária</li>'
        +'<li>Copie o <strong>User UID</strong> gerado e cole no campo abaixo</li>'
        +'</ol>'
        +'<label style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:5px;margin-top:8px;">User UID (do Firebase)</label>'
        +'<input id="usrUid" type="text" value="" placeholder="ex: xYz1ABc2dEfGhIjKlMnOpQrStUvWx" style="width:100%;padding:9px 12px;border:1px solid var(--border-strong);border-radius:6px;font-size:12px;font-family:JetBrains Mono,monospace;box-sizing:border-box;">'
        +'</div>'
      : '<div style="margin-bottom:14px;"><label style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:5px;">Senha temporária</label>'
        +'<input id="usrSenha" type="text" value="'+_gerarSenhaTemp()+'" style="width:100%;padding:9px 12px;border:1px solid var(--border-strong);border-radius:6px;font-size:13px;font-family:JetBrains Mono,monospace;box-sizing:border-box;">'
        +'<div style="font-size:10px;color:var(--text-muted);margin-top:5px;">O usuário será obrigado a trocar no primeiro login.</div></div>'
    ) : '')

    +'<div style="margin-bottom:14px;"><label style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:5px;">Perfil</label>'
    +'<select id="usrPerfil" style="width:100%;padding:9px 12px;border:1px solid var(--border-strong);border-radius:6px;font-size:13px;background:var(--surface);">'
    +Object.keys(perfis).map(function(p){ return '<option value="'+escAttr(p)+'" '+(u.perfil===p?'selected':'')+'>'+esc(perfis[p].nome)+' — '+esc(perfis[p].descricao)+'</option>'; }).join('')
    +'</select></div>'

    +'<div style="margin-bottom:14px;padding:12px;background:var(--surface-2);border-radius:7px;">'
    +'<label style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;cursor:pointer;"><input type="checkbox" id="usrCustomPag" '+(usaCustomPag?'checked':'')+'> Customizar páginas (sobrescreve padrão do perfil)</label>'
    +'<div id="usrPagBox" style="margin-top:10px;'+(usaCustomPag?'':'display:none;')+'">'+pagHtml+'</div>'
    +'</div>'

    +'<div style="margin-bottom:14px;padding:12px;background:var(--surface-2);border-radius:7px;">'
    +'<label style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;cursor:pointer;"><input type="checkbox" id="usrCustomFil" '+(usaCustomFil?'checked':'')+'> Customizar filiais (sobrescreve padrão do perfil)</label>'
    +'<div id="usrFilBox" style="margin-top:10px;'+(usaCustomFil?'':'display:none;')+'">'+filHtml+'</div>'
    +'</div>'

    +'</div>'
    +'<div style="padding:14px 22px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end;background:var(--surface-2);">'
    +'<button onclick="document.getElementById(\'usrEditOverlay\').remove()" style="background:transparent;border:1px solid var(--border-strong);color:var(--text);padding:8px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;">Cancelar</button>'
    +'<button onclick="salvarUsuario(\''+escJs(u.uid)+'\','+novo+')" style="background:#1a2f5c;color:white;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:700;font-family:inherit;">Salvar</button>'
    +'</div>'
    +'</div>';

  document.body.appendChild(overlay);

  // Toggle dos checkboxes "Customizar"
  document.getElementById('usrCustomPag').addEventListener('change', function(e){
    document.getElementById('usrPagBox').style.display = e.target.checked ? 'block' : 'none';
  });
  document.getElementById('usrCustomFil').addEventListener('change', function(e){
    document.getElementById('usrFilBox').style.display = e.target.checked ? 'block' : 'none';
  });

  // Borda dinâmica nos checkboxes de páginas/filiais
  overlay.querySelectorAll('.usr-pag-cb, .usr-fil-cb').forEach(function(cb){
    cb.addEventListener('change', function(){
      cb.parentElement.style.borderColor = cb.checked ? 'var(--accent)' : 'var(--border)';
    });
  });
};

function _gerarSenhaTemp(){
  // Usa crypto.getRandomValues (criptograficamente seguro) se disponivel, fallback Math.random
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const len = 10; // 10 chars = ~47 bits de entropia
  let s = '';
  if(window.crypto && window.crypto.getRandomValues){
    const arr = new Uint32Array(len);
    window.crypto.getRandomValues(arr);
    for(let i=0;i<len;i++) s += chars.charAt(arr[i] % chars.length);
  } else {
    for(let i=0;i<len;i++) s += chars.charAt(Math.floor(Math.random()*chars.length));
  }
  return s;
}

window.salvarUsuario = async function(uid, novo){
  const errEl = document.getElementById('usrEditErr');
  const nome = document.getElementById('usrNome').value.trim();
  const email = document.getElementById('usrEmail').value.trim();
  const perfil = document.getElementById('usrPerfil').value;
  const customPag = document.getElementById('usrCustomPag').checked;
  const customFil = document.getElementById('usrCustomFil').checked;

  if(!nome || !email){
    errEl.textContent = 'Preencha nome e email';
    errEl.style.display = 'block'; return;
  }
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    errEl.textContent = 'Email inválido';
    errEl.style.display = 'block'; return;
  }

  const usuarios = await _getUsuarios();
  if(novo && usuarios.some(x => (x.email||'').toLowerCase() === email.toLowerCase())){
    errEl.textContent = 'Já existe usuário com este email';
    errEl.style.display = 'block'; return;
  }

  let pagsCustom = null;
  if(customPag){
    pagsCustom = Array.from(document.querySelectorAll('.usr-pag-cb:checked')).map(cb => cb.value);
    if(pagsCustom.length === 0){
      errEl.textContent = 'Selecione pelo menos 1 página';
      errEl.style.display = 'block'; return;
    }
  }
  let filsCustom = null;
  if(customFil){
    filsCustom = Array.from(document.querySelectorAll('.usr-fil-cb:checked')).map(cb => cb.value);
    if(filsCustom.length === 0){
      errEl.textContent = 'Selecione pelo menos 1 filial';
      errEl.style.display = 'block'; return;
    }
  }

  let userObj;
  if(novo){
    if(AUTH_MODE === 'firebase'){
      // No Firebase, o admin cria usuário via Console (Authentication → Add user)
      // e cola aqui o UID + email. Verificar UID preenchido.
      const uidInput = document.getElementById('usrUid');
      const uidNovo = uidInput ? uidInput.value.trim() : '';
      if(!uidNovo){
        errEl.textContent = 'UID obrigatório: crie o usuário primeiro em Firebase Console → Authentication → Add user, depois cole o UID aqui.';
        errEl.style.display = 'block'; return;
      }
      if(usuarios.some(x => x.uid === uidNovo)){
        errEl.textContent = 'Já existe usuário com este UID';
        errEl.style.display = 'block'; return;
      }
      userObj = {
        uid: uidNovo,
        email: email, nome: nome, perfil: perfil,
        paginas_permitidas: pagsCustom, filiais_permitidas: filsCustom,
        ativo: true, criado_em: new Date().toISOString(), ultimo_acesso: null,
        senha_temp: true
      };
    } else {
      const senhaTemp = (document.getElementById('usrSenha')||{}).value || _gerarSenhaTemp();
      userObj = {
        uid: 'u-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
        email: email, nome: nome, perfil: perfil,
        paginas_permitidas: pagsCustom, filiais_permitidas: filsCustom,
        ativo: true, criado_em: new Date().toISOString(), ultimo_acesso: null,
        senha_temp: true, _senha_mock: senhaTemp
      };
    }
  } else {
    const u = usuarios.find(x => x.uid === uid);
    if(u){
      u.nome = nome; u.perfil = perfil;
      u.paginas_permitidas = pagsCustom;
      u.filiais_permitidas = filsCustom;
      userObj = u;
    }
  }

  if(!userObj){ errEl.textContent = 'Erro: usuário não encontrado'; errEl.style.display='block'; return; }

  const r = await _saveUsuario(userObj);
  if(!r.ok){
    errEl.textContent = 'Erro ao salvar: '+(r.erro||'desconhecido');
    errEl.style.display = 'block'; return;
  }
  _auditLog('admin_user_save', {alvo_email: email, alvo_nome: nome, perfil: perfil, novo: novo});
  const ov = document.getElementById('usrEditOverlay');
  if(ov) ov.remove();
  await renderAdmUsuarios();
};

// ================================================================
// ADMIN - Customização de perfis (defaults dos perfis)
// ================================================================
async function renderAdmPerfis(){
  const el = document.getElementById('adm-perfis-list');
  if(!el) return;
  el.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px;">Carregando perfis...</div>';
  const perfis = await _getPerfis();

  el.innerHTML = '<div style="display:flex;flex-direction:column;gap:10px;">' + Object.entries(perfis).map(function(p){
    const [key, perfil] = p;
    const nPag = (perfil.paginas||[]).length;
    const nFil = (perfil.filiais||[]).includes('__todas__') ? 'Todas' : (perfil.filiais||[]).length;
    return '<div style="border:1px solid var(--border);border-radius:8px;padding:12px 14px;background:var(--surface-2);">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:8px;">'
      +'<div><strong style="font-size:13px;">'+esc(perfil.nome)+'</strong>'
      +'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">'+esc(perfil.descricao)+'</div></div>'
      +'<button onclick="abrirEditarPerfil(\''+escJs(key)+'\')" style="background:var(--surface);border:1px solid var(--border-strong);color:var(--text);padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;font-family:inherit;">Editar permissões padrão</button>'
      +'</div>'
      +'<div style="display:flex;gap:14px;font-size:11px;color:var(--text-dim);font-family:JetBrains Mono,monospace;">'
      +'<span>📄 '+nPag+' página'+(nPag===1?'':'s')+'</span>'
      +'<span>🏢 '+nFil+' filia'+(nFil==='Todas'||nFil>1?'is':'l')+'</span>'
      +'<span>'+(perfil.pode_consolidado?'✓':'✗')+' Consolidado</span>'
      +'<span>'+(perfil.pode_gerenciar_usuarios?'✓':'✗')+' Gerenciar usuários</span>'
      +'</div></div>';
  }).join('') + '</div>';
}

window.abrirEditarPerfil = async function(key){
  const perfis = await _getPerfis();
  const p = perfis[key];
  if(!p) return;

  const pagsByGrupo = {};
  PAGINAS_CATALOGO.forEach(function(pg){
    if(!pagsByGrupo[pg.grupo]) pagsByGrupo[pg.grupo] = [];
    pagsByGrupo[pg.grupo].push(pg);
  });
  const pagHtml = Object.entries(pagsByGrupo).map(function(g){
    const [grupoNome, pags] = g;
    return '<div style="margin-bottom:10px;"><div style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;">'+grupoNome+'</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:5px;">'
      +pags.map(function(pg){
        const checked = p.paginas.includes(pg.id);
        return '<label style="display:inline-flex;align-items:center;gap:5px;background:var(--surface-2);padding:5px 10px;border-radius:5px;font-size:11px;cursor:pointer;border:1px solid '+(checked?'var(--accent)':'var(--border)')+';"><input type="checkbox" class="prf-pag-cb" value="'+escAttr(pg.id)+'" '+(checked?'checked':'')+' style="margin:0;"> '+esc(pg.nome)+'</label>';
      }).join('')
      +'</div></div>';
  }).join('');

  const filHtml = '<div style="display:flex;flex-wrap:wrap;gap:5px;">'
    +'<label style="display:inline-flex;align-items:center;gap:5px;background:var(--surface-2);padding:5px 10px;border-radius:5px;font-size:11px;cursor:pointer;border:1px solid '+(p.filiais.includes('__todas__')?'var(--accent)':'var(--border)')+';"><input type="checkbox" class="prf-fil-cb" value="__todas__" '+(p.filiais.includes('__todas__')?'checked':'')+' style="margin:0;"> <strong>Todas as filiais</strong></label>'
    +_filiaisDisponiveis.map(function(f){
      const checked = p.filiais.includes(f.sigla);
      return '<label style="display:inline-flex;align-items:center;gap:5px;background:var(--surface-2);padding:5px 10px;border-radius:5px;font-size:11px;cursor:pointer;border:1px solid '+(checked?'var(--accent)':'var(--border)')+';"><input type="checkbox" class="prf-fil-cb" value="'+escAttr(f.sigla)+'" '+(checked?'checked':'')+' style="margin:0;"> '+esc(f.nome)+'</label>';
    }).join('')
    +'</div>';

  const overlay = document.createElement('div');
  overlay.id = 'prfEditOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = '<div style="background:var(--surface);border-radius:12px;max-width:680px;width:100%;max-height:90vh;overflow:auto;">'
    +'<div style="padding:18px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">'
    +'<div><div style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Editar perfil</div>'
    +'<div style="font-weight:800;font-size:18px;margin-top:2px;">'+esc(p.nome)+'</div></div>'
    +'<button onclick="document.getElementById(\'prfEditOverlay\').remove()" style="background:transparent;border:none;cursor:pointer;color:var(--text-muted);font-size:22px;padding:0 8px;">×</button>'
    +'</div>'
    +'<div style="padding:18px 22px;">'
    +'<div style="margin-bottom:14px;"><div style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Páginas permitidas</div>'+pagHtml+'</div>'
    +'<div style="margin-bottom:14px;"><div style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Filiais permitidas</div>'+filHtml+'</div>'
    +'<div style="display:flex;gap:14px;flex-wrap:wrap;">'
    +'<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;"><input type="checkbox" id="prfConsolid" '+(p.pode_consolidado?'checked':'')+'> Pode ver Consolidado</label>'
    +'<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;"><input type="checkbox" id="prfGerenciar" '+(p.pode_gerenciar_usuarios?'checked':'')+'> Pode gerenciar usuários</label>'
    +'</div>'
    +'</div>'
    +'<div style="padding:14px 22px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end;background:var(--surface-2);">'
    +'<button onclick="document.getElementById(\'prfEditOverlay\').remove()" style="background:transparent;border:1px solid var(--border-strong);color:var(--text);padding:8px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;">Cancelar</button>'
    +'<button onclick="salvarPerfil(\''+escJs(key)+'\')" style="background:#1a2f5c;color:white;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:700;font-family:inherit;">Salvar</button>'
    +'</div>'
    +'</div>';
  document.body.appendChild(overlay);

  overlay.querySelectorAll('.prf-pag-cb, .prf-fil-cb').forEach(function(cb){
    cb.addEventListener('change', function(){
      cb.parentElement.style.borderColor = cb.checked ? 'var(--accent)' : 'var(--border)';
    });
  });
};

window.salvarPerfil = async function(key){
  const perfis = await _getPerfis();
  if(!perfis[key]) return;
  const pags = Array.from(document.querySelectorAll('.prf-pag-cb:checked')).map(cb => cb.value);
  const fils = Array.from(document.querySelectorAll('.prf-fil-cb:checked')).map(cb => cb.value);
  if(pags.length === 0){ _toast('Selecione pelo menos 1 página', 'aviso'); return; }
  if(fils.length === 0){ _toast('Selecione pelo menos 1 filial', 'aviso'); return; }
  const perfilNovo = Object.assign({}, perfis[key], {
    paginas: pags,
    filiais: fils,
    pode_consolidado: document.getElementById('prfConsolid').checked,
    pode_gerenciar_usuarios: document.getElementById('prfGerenciar').checked
  });
  const r = await _savePerfil(key, perfilNovo);
  if(!r.ok){ _toast('Erro ao salvar: '+(r.erro||'desconhecido'), 'erro'); return; }
  _auditLog('admin_perfil_save', {perfil: key, n_paginas: pags.length, n_filiais: fils.length});
  const ov = document.getElementById('prfEditOverlay');
  if(ov) ov.remove();
  await renderAdmPerfis();
};


// ================================================================
// AUDITORIA - logs de eventos (placeholder, sera Firestore)
// ================================================================
const AUDIT_TIPOS = {
  'login_ok':        {label:'Login realizado',         icone:'login',  cor:'green'},
  'login_fail':      {label:'Login falhou',            icone:'alert',  cor:'red'},
  'logout':          {label:'Logout',                  icone:'logout', cor:'gray'},
  'page_view':       {label:'Pagina aberta',           icone:'page',   cor:'blue'},
  'export_xlsx':     {label:'Export XLSX',             icone:'down',   cor:'orange'},
  'export_pdf':      {label:'Export PDF',              icone:'down',   cor:'orange'},
  'admin_user_save': {label:'Usuario salvo',           icone:'user',   cor:'purple'},
  'admin_user_toggle':{label:'Usuario ativado/desativado',icone:'user',cor:'purple'},
  'admin_perfil_save':{label:'Perfil alterado',        icone:'shield', cor:'purple'},
  'admin_estoque':   {label:'Dias ideais alterado',    icone:'cfg',    cor:'purple'},
  'admin_gpc_add':   {label:'Fornecedor GPC adicionado',icone:'cfg',   cor:'purple'},
  'admin_gpc_rem':   {label:'Fornecedor GPC removido', icone:'cfg',    cor:'purple'},
  'admin_gpc_reset': {label:'Lista GPC restaurada',    icone:'cfg',    cor:'purple'},
  'admin_sku_add':   {label:'SKU oculto adicionado',   icone:'cfg',    cor:'purple'},
  'admin_sku_rem':   {label:'SKU oculto removido',     icone:'cfg',    cor:'purple'},
  'admin_sku_reset': {label:'Lista SKU ocultos restaurada', icone:'cfg', cor:'purple'},
  'filial_change':   {label:'Filial trocada',          icone:'shop',   cor:'blue'},
  'smoke_test_run':  {label:'Diagnóstico executado',    icone:'check',  cor:'gray'}
};

// Mock: gera eventos de exemplo para visualizacao da UI
function _gerarLogsMock(){
  const usuarios = _getUsuariosMock();
  const sess = _getSessao();
  const agora = Date.now();
  const exemplos = [];
  const tipos = ['page_view','export_xlsx','login_ok','admin_sku_add','admin_user_save','page_view','page_view','export_pdf','filial_change','admin_estoque','login_fail','logout'];
  const paginas = ['executivo','departamentos','fornecedores','vencidos','excesso','financeiro','forn-gpc','admin'];
  const usrPool = usuarios.length > 0 ? usuarios : [{uid:'admin-001',nome:'Administrador',email:'admin@r2.com.br'}];

  for(let i=0; i<28; i++){
    const u = usrPool[Math.floor(Math.random()*usrPool.length)];
    const t = tipos[Math.floor(Math.random()*tipos.length)];
    const minutos = Math.floor(Math.random()*60*24*5); // ate 5 dias atras
    const ts = new Date(agora - minutos*60000).toISOString();
    let det = null;
    if(t === 'page_view') det = {pagina: paginas[Math.floor(Math.random()*paginas.length)]};
    else if(t === 'export_xlsx'){
      const baseTagAud = _filialAtual ? _filialAtual.sigla.toUpperCase() : 'CONSOLIDADO';
      det = {arquivo: 'Comercial_GPC_'+baseTagAud+'_'+ts.slice(0,10)+'.xlsx'};
    }
    else if(t === 'export_pdf') det = {pagina: paginas[Math.floor(Math.random()*paginas.length)]};
    else if(t === 'admin_sku_add') det = {sku: 30000 + Math.floor(Math.random()*9999)};
    else if(t === 'admin_user_save') det = {alvo: 'gerente@gpc.com.br'};
    else if(t === 'admin_estoque') det = {valor: 30 + Math.floor(Math.random()*30)};
    else if(t === 'filial_change') det = {de: 'consolidado', para: 'atp'};
    else if(t === 'login_fail') det = {motivo: 'Senha incorreta'};
    exemplos.push({
      timestamp: ts, uid: u.uid, email: u.email, nome: u.nome,
      tipo: t, detalhes: det,
      contexto: {filial: Math.random()>0.5 ? 'atp' : null}
    });
  }
  return exemplos.sort((a,b) => b.timestamp.localeCompare(a.timestamp));
}

// Cache de logs
let _auditCache = null;
let _auditCacheTs = 0;
const _auditCacheTtlMs = 15000; // 15s
async function _getAuditLogs(){
  const now = Date.now();
  if(AUTH_MODE === 'firebase' && window.fbDb){
    if(_auditCache && (now - _auditCacheTs) < _auditCacheTtlMs) return _auditCache;
    try {
      const snap = await window.fbDb.collection('auditLog')
        .orderBy('timestamp', 'desc')
        .limit(500)
        .get();
      _auditCache = snap.docs.map(d => Object.assign({id: d.id}, d.data()));
      _auditCacheTs = now;
      return _auditCache;
    } catch(e){
      console.error('Falha ao buscar auditLog:', e);
      return _auditCache || [];
    }
  }
  // Mock
  if(!_auditCache) _auditCache = _gerarLogsMock();
  return _auditCache;
}

// ================================================================
// AUDITORIA - render do card na pagina Administracao
// ================================================================
async function renderAdmAuditoria(){
  const el = document.getElementById('adm-auditoria-list');
  if(!el) return;
  el.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px;">Carregando auditoria...</div>';
  const logs = await _getAuditLogs();

  // Calcular contadores
  const agora = new Date();
  const hoje0 = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).toISOString();
  const semanaInicio = new Date(agora.getTime() - 7*24*60*60000).toISOString();
  const mesInicio = new Date(agora.getTime() - 30*24*60*60000).toISOString();

  const usrAtivos = function(desde){
    const set = new Set();
    logs.filter(l => l.timestamp >= desde && l.tipo === 'login_ok').forEach(l => set.add(l.uid));
    return set.size;
  };
  const ativosHoje = usrAtivos(hoje0);
  const ativosSemana = usrAtivos(semanaInicio);
  const ativosMes = usrAtivos(mesInicio);

  // Render: contadores + filtros + tabela
  el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-bottom:14px;">'
    + '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:12px 14px;">'
    + '<div style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Ativos hoje</div>'
    + '<div style="font-size:22px;font-weight:800;margin-top:4px;">'+ativosHoje+'</div>'
    + '</div>'
    + '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:12px 14px;">'
    + '<div style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Ativos na semana</div>'
    + '<div style="font-size:22px;font-weight:800;margin-top:4px;">'+ativosSemana+'</div>'
    + '</div>'
    + '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:12px 14px;">'
    + '<div style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Ativos no mes</div>'
    + '<div style="font-size:22px;font-weight:800;margin-top:4px;">'+ativosMes+'</div>'
    + '</div>'
    + '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:12px 14px;">'
    + '<div style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Total eventos</div>'
    + '<div style="font-size:22px;font-weight:800;margin-top:4px;">'+logs.length+'</div>'
    + '</div>'
    + '</div>';

  // Filtros
  const usuariosUnicos = [...new Set(logs.map(l => l.uid))].map(uid => {
    const l = logs.find(x => x.uid === uid);
    return {uid: uid, nome: l ? (l.nome || l.email) : uid};
  });
  const tiposUnicos = [...new Set(logs.map(l => l.tipo))];

  el.innerHTML += '<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:12px 14px;margin-bottom:10px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">'
    + '<div style="display:flex;align-items:center;gap:6px;">'
    + '<span style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Usuario:</span>'
    + '<select id="aud-fil-usr" style="padding:5px 8px;border:1px solid var(--border-strong);border-radius:5px;font-size:11px;background:var(--surface);">'
    + '<option value="">Todos</option>'
    + usuariosUnicos.map(u => '<option value="'+escAttr(u.uid)+'">'+esc(u.nome)+'</option>').join('')
    + '</select></div>'
    + '<div style="display:flex;align-items:center;gap:6px;">'
    + '<span style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Tipo:</span>'
    + '<select id="aud-fil-tipo" style="padding:5px 8px;border:1px solid var(--border-strong);border-radius:5px;font-size:11px;background:var(--surface);">'
    + '<option value="">Todos</option>'
    + tiposUnicos.map(t => '<option value="'+escAttr(t)+'">'+esc(AUDIT_TIPOS[t]?AUDIT_TIPOS[t].label:t)+'</option>').join('')
    + '</select></div>'
    + '<div style="display:flex;align-items:center;gap:6px;">'
    + '<span style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Periodo:</span>'
    + '<input type="date" id="aud-fil-dt-ini" style="padding:5px 8px;border:1px solid var(--border-strong);border-radius:5px;font-size:11px;background:var(--surface);">'
    + '<span style="font-size:10px;color:var(--text-muted);">ate</span>'
    + '<input type="date" id="aud-fil-dt-fim" style="padding:5px 8px;border:1px solid var(--border-strong);border-radius:5px;font-size:11px;background:var(--surface);">'
    + '</div>'
    + '<button id="aud-fil-clear" style="padding:5px 12px;background:transparent;border:1px solid var(--border-strong);border-radius:5px;font-size:11px;cursor:pointer;color:var(--text);font-family:inherit;">Limpar</button>'
    + '<div style="margin-left:auto;font-size:11px;color:var(--text-muted);font-family:JetBrains Mono,monospace;" id="aud-count">'+logs.length+' eventos</div>'
    + '</div>';

  el.innerHTML += '<div class="tscroll" style="max-height:500px;overflow:auto;border:1px solid var(--border);border-radius:8px;">'
    + '<table class="t" id="aud-tbl"><thead><tr>'
    + '<th class="L">Data/Hora</th>'
    + '<th class="L">Usuario</th>'
    + '<th class="L">Evento</th>'
    + '<th class="L">Detalhes</th>'
    + '<th class="L">Contexto</th>'
    + '</tr></thead><tbody></tbody></table></div>';

  function _renderTabela(filtros){
    const tbody = document.querySelector('#aud-tbl tbody');
    let f = logs.slice();
    if(filtros.usr) f = f.filter(l => l.uid === filtros.usr);
    if(filtros.tipo) f = f.filter(l => l.tipo === filtros.tipo);
    if(filtros.dtIni) f = f.filter(l => l.timestamp.slice(0,10) >= filtros.dtIni);
    if(filtros.dtFim) f = f.filter(l => l.timestamp.slice(0,10) <= filtros.dtFim);

    tbody.innerHTML = f.map(function(l){
      const dt = new Date(l.timestamp);
      const dtStr = dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      const tipoInfo = AUDIT_TIPOS[l.tipo] || {label:l.tipo, cor:'gray'};
      const corMap = {green:'var(--success-text,#0a7c4a)', red:'var(--danger-text,#c33)', orange:'#d97706', purple:'#7c3aed', blue:'#2563eb', gray:'var(--text-muted)'};
      const det = l.detalhes ? Object.entries(l.detalhes).map(function(p){
        return '<span style="background:var(--surface-2);padding:1px 6px;border-radius:3px;font-family:JetBrains Mono,monospace;font-size:10px;margin-right:4px;">'+esc(p[0])+': '+esc(p[1])+'</span>';
      }).join('') : '<span style="color:var(--text-muted);">--</span>';
      const ctxParts = [];
      if(l.contexto && l.contexto.filial) ctxParts.push('filial: '+esc(l.contexto.filial));
      if(l.contexto && l.contexto.snapshot) ctxParts.push('snap: '+esc(l.contexto.snapshot));
      const ctx = ctxParts.length ? '<span style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--text-muted);">'+ctxParts.join(' / ')+'</span>' : '<span style="color:var(--text-muted);font-size:10px;">--</span>';
      return '<tr>'
        + '<td class="L" style="font-family:JetBrains Mono,monospace;font-size:11px;white-space:nowrap;">'+esc(dtStr)+'</td>'
        + '<td class="L"><strong style="font-size:12px;">'+esc(l.nome||'')+'</strong><br><span style="font-size:10px;color:var(--text-muted);">'+esc(l.email||'')+'</span></td>'
        + '<td class="L"><span style="display:inline-block;padding:2px 8px;border-radius:4px;background:var(--surface-2);color:'+corMap[tipoInfo.cor]+';font-size:11px;font-weight:700;">'+esc(tipoInfo.label)+'</span></td>'
        + '<td class="L">'+det+'</td>'
        + '<td class="L">'+ctx+'</td>'
        + '</tr>';
    }).join('') || '<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-muted);">Nenhum evento encontrado para os filtros selecionados.</td></tr>';

    document.getElementById('aud-count').textContent = f.length + ' eventos';
  }

  function _atualizarFiltros(){
    _renderTabela({
      usr: document.getElementById('aud-fil-usr').value,
      tipo: document.getElementById('aud-fil-tipo').value,
      dtIni: document.getElementById('aud-fil-dt-ini').value,
      dtFim: document.getElementById('aud-fil-dt-fim').value
    });
  }

  document.getElementById('aud-fil-usr').addEventListener('change', _atualizarFiltros);
  document.getElementById('aud-fil-tipo').addEventListener('change', _atualizarFiltros);
  document.getElementById('aud-fil-dt-ini').addEventListener('change', _atualizarFiltros);
  document.getElementById('aud-fil-dt-fim').addEventListener('change', _atualizarFiltros);
  document.getElementById('aud-fil-clear').addEventListener('click', function(){
    document.getElementById('aud-fil-usr').value = '';
    document.getElementById('aud-fil-tipo').value = '';
    document.getElementById('aud-fil-dt-ini').value = '';
    document.getElementById('aud-fil-dt-fim').value = '';
    _atualizarFiltros();
  });

  _renderTabela({});
}





// ================================================================
// CURVA ABC — classificação por faturamento (A=80%, B=15%, C=5%)
// ================================================================
const ABC_STATE = {
  tipo: 'item',              // 'item' | 'fornecedor'
  fornBase: 'nf',            // 'nf' = entrada.fo | 'cad' = produto.f
  pers: new Set(['2026-01','2026-02','2026-03','2026-04']),
  dept: null,
  secao: null,
  categoria: null,
  page: 1,                   // paginação
  pageSize: 100,             // itens por página (celular-friendly)
  filtroClasse: 'TODAS'      // classe filtrada na tabela
};

// [legado] renderABC removido em v4.2 — substituído por renderABCNovo

function _abcAplicarTipo(){
  const btnI = document.getElementById('abc-t-item');
  const btnF = document.getElementById('abc-t-forn');
  if(ABC_STATE.tipo === 'item'){
    btnI.style.background = 'var(--surface)';
    btnF.style.background = 'transparent';
    document.getElementById('abc-forn-box').style.display = 'none';
  } else {
    btnI.style.background = 'transparent';
    btnF.style.background = 'var(--surface)';
    document.getElementById('abc-forn-box').style.display = 'inline';
  }
}

function _abcPrencherFiltros(){
  // Períodos (checkboxes toggle)
  const persDiv = document.getElementById('abc-pers');
  const ms = {'2026-01':'Jan/26','2026-02':'Fev/26','2026-03':'Mar/26','2026-04':'Abr/26'};
  persDiv.innerHTML = Object.entries(ms).map(function(p){
    const [k,lbl] = p;
    const ativo = ABC_STATE.pers.has(k);
    return '<button data-per="'+escAttr(k)+'" class="abc-per-btn" style="padding:6px 12px;border:1px solid '+(ativo?'var(--accent)':'var(--border-strong)')+';background:'+(ativo?'var(--accent-bg)':'var(--surface)')+';color:'+(ativo?'var(--accent-text)':'var(--text)')+';border-radius:5px;cursor:pointer;font-size:11px;font-weight:600;font-family:inherit;">'+lbl+'</button>';
  }).join('');
  persDiv.querySelectorAll('.abc-per-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const p = this.dataset.per;
      if(ABC_STATE.pers.has(p)) ABC_STATE.pers.delete(p);
      else ABC_STATE.pers.add(p);
      if(ABC_STATE.pers.size === 0) ABC_STATE.pers.add(p); // pelo menos 1
      _abcPrencherFiltros();
      _abcCalcularERender();
    });
  });

  // Departamentos
  const deps = [...new Set(D.produtos.map(function(p){return p.dp;}).filter(Boolean))].sort();
  const selDep = document.getElementById('abc-dep');
  selDep.innerHTML = '<option value="">Todos</option>' + deps.map(function(d){ return '<option value="'+escAttr(d)+'" '+(ABC_STATE.dept===d?'selected':'')+'>'+esc(d)+'</option>'; }).join('');
  _abcPrencherSecoes();
  _abcPrencherCategorias();
}

function _abcPrencherSecoes(){
  const selSec = document.getElementById('abc-sec');
  if(!ABC_STATE.dept){
    selSec.innerHTML = '<option value="">(selecione um departamento)</option>';
    selSec.disabled = true;
    return;
  }
  selSec.disabled = false;
  const secs = [...new Set(D.produtos.filter(function(p){return p.dp===ABC_STATE.dept;}).map(function(p){return p.sc;}).filter(Boolean))].sort();
  selSec.innerHTML = '<option value="">Todas</option>' + secs.map(function(s){ return '<option value="'+escAttr(s)+'" '+(ABC_STATE.secao===s?'selected':'')+'>'+esc(s)+'</option>'; }).join('');
}

function _abcPrencherCategorias(){
  const selCat = document.getElementById('abc-cat');
  if(!ABC_STATE.dept || !ABC_STATE.secao){
    selCat.innerHTML = '<option value="">(selecione departamento e se\u00e7\u00e3o)</option>';
    selCat.disabled = true;
    return;
  }
  selCat.disabled = false;
  const cats = [...new Set(D.produtos.filter(function(p){return p.dp===ABC_STATE.dept && p.sc===ABC_STATE.secao;}).map(function(p){return p.ct;}).filter(Boolean))].sort();
  selCat.innerHTML = '<option value="">Todas</option>' + cats.map(function(c){ return '<option value="'+escAttr(c)+'" '+(ABC_STATE.categoria===c?'selected':'')+'>'+esc(c)+'</option>'; }).join('');
}

// Calcular valor vendido de um produto nos períodos selecionados
function _abcVendaProduto(p){
  const idxs = ['2026-01','2026-02','2026-03','2026-04']
    .map(function(k,i){return ABC_STATE.pers.has(k)?i:-1;})
    .filter(function(i){return i>=0;});
  let v = 0, q = 0;
  idxs.forEach(function(i){
    const sv = p.sv && p.sv[i];
    if(sv){ v += sv[0]||0; q += sv[3]||0; }
  });
  return {v:v, q:q};
}

// Calcular vendas por fornecedor da NF (distribuindo venda do item proporcionalmente)
function _abcVendasPorFornecedorNF(produtosFiltrados){
  // Para cada produto, distribuir suas vendas proporcionalmente pelos fornecedores que apareceram nas NFs do período
  const mapa = {}; // {nomeForn: {v, n_skus:Set, q}}
  const idxs = ['2026-01','2026-02','2026-03','2026-04']
    .map(function(k,i){return ABC_STATE.pers.has(k)?i:-1;})
    .filter(function(i){return i>=0;});
  const persSet = new Set([...ABC_STATE.pers]);

  produtosFiltrados.forEach(function(p){
    const venda = _abcVendaProduto(p);
    if(venda.v <= 0) return;

    // Fornecedores distintos das NFs no período (proporcional ao valor comprado)
    const comprasPorForn = {};
    let somaCompras = 0;
    (p.en || []).forEach(function(e){
      const mes = e.dt ? e.dt.slice(0,7) : null;
      if(!mes || !persSet.has(mes)) return;
      const vlc = e.vlc || 0;
      comprasPorForn[e.fo] = (comprasPorForn[e.fo] || 0) + vlc;
      somaCompras += vlc;
    });

    // Se não houve compras via NF no período mas há venda, atribuir ao fornecedor cadastrado
    if(somaCompras === 0){
      const fn = p.f || '(sem fornecedor)';
      if(!mapa[fn]) mapa[fn] = {v:0, n:new Set(), q:0};
      mapa[fn].v += venda.v;
      mapa[fn].n.add(p.c);
      mapa[fn].q += venda.q;
      return;
    }

    // Distribuir proporcionalmente pelos fornecedores da NF
    Object.entries(comprasPorForn).forEach(function(pair){
      const fn = pair[0], comp = pair[1];
      const frac = comp / somaCompras;
      if(!mapa[fn]) mapa[fn] = {v:0, n:new Set(), q:0};
      mapa[fn].v += venda.v * frac;
      mapa[fn].n.add(p.c);
      mapa[fn].q += venda.q * frac;
    });
  });
  return Object.entries(mapa).map(function(pair){
    return {nome:pair[0], v:pair[1].v, n:pair[1].n.size, q:pair[1].q};
  });
}

function _abcCalcularERender(){
  // Filtrar produtos por dept/secao/categoria
  let produtos = D.produtos.slice();
  if(ABC_STATE.dept) produtos = produtos.filter(function(p){return p.dp===ABC_STATE.dept;});
  if(ABC_STATE.secao) produtos = produtos.filter(function(p){return p.sc===ABC_STATE.secao;});
  if(ABC_STATE.categoria) produtos = produtos.filter(function(p){return p.ct===ABC_STATE.categoria;});

  let items;
  if(ABC_STATE.tipo === 'item'){
    items = produtos.map(function(p){
      const vq = _abcVendaProduto(p);
      return {nome: p.d || ('SKU '+p.c), cod: p.c, dep: p.dp, sec: p.sc, cat: p.ct, forn: p.f || '', v: vq.v, q: vq.q};
    }).filter(function(x){return x.v > 0;});
  } else if(ABC_STATE.fornBase === 'cad'){
    // Fornecedor cadastrado (p.f)
    const mapa = {};
    produtos.forEach(function(p){
      const vq = _abcVendaProduto(p);
      if(vq.v <= 0) return;
      const fn = p.f || '(sem fornecedor)';
      if(!mapa[fn]) mapa[fn] = {v:0, n:new Set(), q:0};
      mapa[fn].v += vq.v;
      mapa[fn].n.add(p.c);
      mapa[fn].q += vq.q;
    });
    items = Object.entries(mapa).map(function(pair){
      return {nome: pair[0], v: pair[1].v, n: pair[1].n.size, q: pair[1].q};
    });
  } else {
    // Fornecedor da NF
    items = _abcVendasPorFornecedorNF(produtos).filter(function(x){return x.v > 0;});
  }

  // Ordenar por valor desc
  items.sort(function(a,b){return b.v - a.v;});

  // Classificar ABC
  const total = items.reduce(function(s,x){return s + x.v;}, 0);
  let acum = 0;
  items.forEach(function(x){
    acum += x.v;
    const pctAcum = total>0 ? (acum/total*100) : 0;
    x.pctAcum = pctAcum;
    x.pctInd = total>0 ? (x.v/total*100) : 0;
    if(pctAcum <= 80) x.classe = 'A';
    else if(pctAcum <= 95) x.classe = 'B';
    else x.classe = 'C';
  });

  // Resumo
  const classes = {A:{v:0,n:0}, B:{v:0,n:0}, C:{v:0,n:0}};
  items.forEach(function(x){
    classes[x.classe].v += x.v;
    classes[x.classe].n += 1;
  });

  // Cards
  const titulo = ABC_STATE.tipo === 'item' ? 'SKUs' : 'Fornecedores';
  const totalN = items.length;
  const subLbl = ABC_STATE.tipo === 'fornecedor' ? (ABC_STATE.fornBase === 'nf' ? 'por fornecedor da NF' : 'por fornecedor cadastrado') : 'por SKU';
  document.getElementById('abc-resumo-titulo').textContent = 'Curva ABC ' + (ABC_STATE.tipo === 'item' ? 'de itens' : 'de fornecedores');
  document.getElementById('abc-resumo-sub').textContent = 'Classifica\u00e7\u00e3o por faturamento acumulado \u00b7 ' + subLbl;
  document.getElementById('abc-tbl-titulo').textContent = 'Ranking de ' + titulo.toLowerCase();

  document.getElementById('abc-cards').innerHTML = kgHtml([
    {l:'Total faturado',     v:fK(total),              s:fI(totalN)+' '+titulo.toLowerCase()},
    {l:'Classe A (80%)',     v:fK(classes.A.v),        s:fI(classes.A.n)+' '+titulo.toLowerCase()+' \u00b7 '+(totalN>0?(classes.A.n/totalN*100).toFixed(1):'0')+'%', cls:'up'},
    {l:'Classe B (15%)',     v:fK(classes.B.v),        s:fI(classes.B.n)+' '+titulo.toLowerCase()+' \u00b7 '+(totalN>0?(classes.B.n/totalN*100).toFixed(1):'0')+'%', cls:'hl'},
    {l:'Classe C (5%)',      v:fK(classes.C.v),        s:fI(classes.C.n)+' '+titulo.toLowerCase()+' \u00b7 '+(totalN>0?(classes.C.n/totalN*100).toFixed(1):'0')+'%', cls:'dn'},
  ]);

  // Guarda items pro filtro de tabela e export
  ABC_STATE._items = items;
  ABC_STATE._titulo = titulo;
  ABC_STATE._classes = classes;
  ABC_STATE._total = total;
  ABC_STATE.page = 1; // reset pagina ao recalcular
  ABC_STATE.filtroClasse = 'TODAS';

  // Reset botão de classe ativa visual
  const btnsClasse = document.querySelectorAll('.abc-filtro-classe');
  btnsClasse.forEach(function(b){
    b.style.background = b.dataset.c === 'TODAS' ? 'var(--surface)' : 'transparent';
  });

  _abcRenderChart(items, classes, total);
  _abcRenderTabela('TODAS');
}

function _abcRenderChart(items, classes, total){
  const ctx = document.getElementById('abc-chart');
  if(!ctx) return; // canvas removido — função fica como no-op

  if(ABC_STATE._chart) ABC_STATE._chart.destroy();

  // Amostragem: até 200 pontos para não pesar
  const n = items.length;
  const step = Math.max(1, Math.floor(n/200));
  const labels = [];
  const curva = [];
  const cores = [];
  for(let i=0; i<n; i+=step){
    labels.push(i+1);
    curva.push(items[i].pctAcum);
    cores.push(items[i].classe === 'A' ? '#0a7c4a' : items[i].classe === 'B' ? '#d97706' : '#c33');
  }
  // Garantir que o último ponto está
  if(labels[labels.length-1] !== n){
    labels.push(n);
    curva.push(items[n-1].pctAcum);
    cores.push(items[n-1].classe === 'A' ? '#0a7c4a' : items[n-1].classe === 'B' ? '#d97706' : '#c33');
  }

  ABC_STATE._chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: '% Acumulado',
        data: curva,
        borderColor: '#1a2f5c',
        backgroundColor: 'rgba(26,47,92,0.08)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.1,
        fill: true
      }]
    },
    options: tt({
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {display: false},
        tooltip: {
          callbacks: {
            title: function(items){ return 'Posi\u00e7\u00e3o '+items[0].label; },
            label: function(i){ return '% acumulado: '+i.raw.toFixed(2)+'%'; }
          }
        },
        annotation: {
          annotations: {
            linha80: {type:'line', yMin:80, yMax:80, borderColor:'#0a7c4a', borderDash:[5,5], borderWidth:1, label:{enabled:false}},
            linha95: {type:'line', yMin:95, yMax:95, borderColor:'#d97706', borderDash:[5,5], borderWidth:1, label:{enabled:false}}
          }
        }
      },
      scales: scalesXY({
        x: {title:{display:true, text:'Posi\u00e7\u00e3o no ranking', font:{size:10}}, ticks:{font:{size:9}}},
        y: {title:{display:true, text:'% acumulado', font:{size:10}}, min:0, max:100, ticks:{callback:function(v){return v+'%';}, font:{size:9}}}
      })
    })
  });
}

function _abcRenderTabela(filtro){
  // Atualizar state
  if(filtro !== undefined) ABC_STATE.filtroClasse = filtro;
  const items = ABC_STATE._items || [];
  const filtrados = ABC_STATE.filtroClasse === 'TODAS' ? items : items.filter(function(x){return x.classe === ABC_STATE.filtroClasse;});

  // Paginação
  const total = filtrados.length;
  const totalPages = Math.max(1, Math.ceil(total / ABC_STATE.pageSize));
  if(ABC_STATE.page > totalPages) ABC_STATE.page = totalPages;
  if(ABC_STATE.page < 1) ABC_STATE.page = 1;
  const ini = (ABC_STATE.page - 1) * ABC_STATE.pageSize;
  const fim = Math.min(ini + ABC_STATE.pageSize, total);
  const pagItems = filtrados.slice(ini, fim);

  const thead = document.querySelector('#abc-tbl thead');
  const tbody = document.querySelector('#abc-tbl tbody');

  if(ABC_STATE.tipo === 'item'){
    thead.innerHTML = '<tr><th style="text-align:center;">Classe</th><th class="L">SKU</th><th class="L">Produto</th><th class="L">Dept</th><th class="L">Se\u00e7\u00e3o</th><th>Faturado</th><th>% indiv</th><th>% acum</th><th>Qtd vendida</th></tr>';
    tbody.innerHTML = pagItems.map(function(x,i){
      const cor = x.classe==='A'?'#0a7c4a':x.classe==='B'?'#d97706':'#c33';
      const bg = x.classe==='A'?'#dcfce7':x.classe==='B'?'#fef3c7':'#fee';
      return '<tr><td style="text-align:center;"><span style="display:inline-block;min-width:22px;padding:2px 6px;background:'+bg+';color:'+cor+';border-radius:4px;font-weight:800;font-size:11px;">'+x.classe+'</span></td>'
        +'<td class="L" style="font-family:JetBrains Mono,monospace;font-size:11px;">'+esc(x.cod)+'</td>'
        +'<td class="L" style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+escAttr(x.nome)+'">'+esc(x.nome)+'</td>'
        +'<td class="L val-dim" style="font-size:11px;">'+esc(x.dep||'-')+'</td>'
        +'<td class="L val-dim" style="font-size:11px;">'+esc(x.sec||'-')+'</td>'
        +'<td>'+fB(x.v,0)+'</td>'
        +'<td class="val-dim">'+fP(x.pctInd)+'</td>'
        +'<td>'+fP(x.pctAcum)+'</td>'
        +'<td class="val-dim">'+fI(x.q)+'</td>'
        +'</tr>';
    }).join('') || '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-muted);">Nenhum item encontrado.</td></tr>';
  } else {
    thead.innerHTML = '<tr><th style="text-align:center;">Classe</th><th class="L">Fornecedor</th><th>SKUs</th><th>Faturado</th><th>% indiv</th><th>% acum</th></tr>';
    tbody.innerHTML = pagItems.map(function(x){
      const cor = x.classe==='A'?'#0a7c4a':x.classe==='B'?'#d97706':'#c33';
      const bg = x.classe==='A'?'#dcfce7':x.classe==='B'?'#fef3c7':'#fee';
      return '<tr><td style="text-align:center;"><span style="display:inline-block;min-width:22px;padding:2px 6px;background:'+bg+';color:'+cor+';border-radius:4px;font-weight:800;font-size:11px;">'+x.classe+'</span></td>'
        +'<td class="L" style="font-weight:600;">'+esc(x.nome)+'</td>'
        +'<td class="val-dim">'+fI(x.n)+'</td>'
        +'<td>'+fB(x.v,0)+'</td>'
        +'<td class="val-dim">'+fP(x.pctInd)+'</td>'
        +'<td>'+fP(x.pctAcum)+'</td>'
        +'</tr>';
    }).join('') || '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted);">Nenhum fornecedor encontrado.</td></tr>';
  }

  // Render de paginacao
  _abcRenderPaginacao(total, ini, fim, totalPages);

  // Descricao no topo da tabela
  const clsLbl = ABC_STATE.filtroClasse === 'TODAS'
    ? (ABC_STATE.tipo==='item'?'itens':'fornecedores')
    : 'itens classe '+ABC_STATE.filtroClasse;
  document.getElementById('abc-tbl-sub').textContent = 'Mostrando '+fI(ini+1)+'\u2013'+fI(fim)+' de '+fI(total)+' '+clsLbl+' \u00b7 Ordenado por faturamento';
}

function _abcRenderPaginacao(total, ini, fim, totalPages){
  // Cria ou atualiza o controle de paginacao abaixo da tabela
  let pagEl = document.getElementById('abc-paginacao');
  if(!pagEl){
    pagEl = document.createElement('div');
    pagEl.id = 'abc-paginacao';
    pagEl.style.cssText = 'padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;border-top:1px solid var(--border);background:var(--surface-2);';
    const wrap = document.getElementById('abc-tbl').closest('.ds-body');
    if(wrap) wrap.appendChild(pagEl);
  }

  if(total === 0){
    pagEl.innerHTML = '';
    pagEl.style.display = 'none';
    return;
  }
  pagEl.style.display = 'flex';

  const p = ABC_STATE.page;
  const podeVoltar = p > 1;
  const podeAvancar = p < totalPages;

  pagEl.innerHTML = '<div style="display:flex;align-items:center;gap:8px;font-size:11px;color:var(--text-muted);font-family:JetBrains Mono,monospace;">'
    + '<span>P\u00e1g '+esc(p)+' de '+esc(totalPages)+'</span>'
    + '<span>\u00b7</span>'
    + '<label style="display:flex;align-items:center;gap:4px;"><span>Por p\u00e1gina:</span>'
    + '<select id="abc-pagesize" style="padding:3px 6px;border:1px solid var(--border-strong);border-radius:4px;background:var(--surface);font-size:11px;font-family:inherit;">'
    + ['50','100','200','500'].map(function(v){ return '<option value="'+escAttr(v)+'" '+(ABC_STATE.pageSize==parseInt(v)?'selected':'')+'>'+v+'</option>'; }).join('')
    + '</select></label>'
    + '</div>'
    + '<div style="display:flex;gap:4px;">'
    + '<button id="abc-pg-first" '+(podeVoltar?'':'disabled')+' style="padding:5px 10px;border:1px solid var(--border-strong);background:'+(podeVoltar?'var(--surface)':'var(--surface-2)')+';cursor:'+(podeVoltar?'pointer':'not-allowed')+';border-radius:4px;font-size:11px;opacity:'+(podeVoltar?'1':'0.5')+';font-family:inherit;">\u00ab</button>'
    + '<button id="abc-pg-prev" '+(podeVoltar?'':'disabled')+' style="padding:5px 10px;border:1px solid var(--border-strong);background:'+(podeVoltar?'var(--surface)':'var(--surface-2)')+';cursor:'+(podeVoltar?'pointer':'not-allowed')+';border-radius:4px;font-size:11px;opacity:'+(podeVoltar?'1':'0.5')+';font-family:inherit;">\u2039 Anterior</button>'
    + '<button id="abc-pg-next" '+(podeAvancar?'':'disabled')+' style="padding:5px 10px;border:1px solid var(--border-strong);background:'+(podeAvancar?'var(--surface)':'var(--surface-2)')+';cursor:'+(podeAvancar?'pointer':'not-allowed')+';border-radius:4px;font-size:11px;opacity:'+(podeAvancar?'1':'0.5')+';font-family:inherit;">Pr\u00f3xima \u203a</button>'
    + '<button id="abc-pg-last" '+(podeAvancar?'':'disabled')+' style="padding:5px 10px;border:1px solid var(--border-strong);background:'+(podeAvancar?'var(--surface)':'var(--surface-2)')+';cursor:'+(podeAvancar?'pointer':'not-allowed')+';border-radius:4px;font-size:11px;opacity:'+(podeAvancar?'1':'0.5')+';font-family:inherit;">\u00bb</button>'
    + '</div>';

  const goto = function(newPage){
    ABC_STATE.page = Math.max(1, Math.min(totalPages, newPage));
    _abcRenderTabela();
    // Rolar para topo da tabela
    const tbl = document.getElementById('abc-tbl');
    if(tbl) tbl.scrollIntoView({behavior:'smooth', block:'nearest'});
  };
  if(podeVoltar){
    document.getElementById('abc-pg-first').addEventListener('click', function(){ goto(1); });
    document.getElementById('abc-pg-prev').addEventListener('click', function(){ goto(p-1); });
  }
  if(podeAvancar){
    document.getElementById('abc-pg-next').addEventListener('click', function(){ goto(p+1); });
    document.getElementById('abc-pg-last').addEventListener('click', function(){ goto(totalPages); });
  }
  document.getElementById('abc-pagesize').addEventListener('change', function(e){
    ABC_STATE.pageSize = parseInt(e.target.value);
    ABC_STATE.page = 1;
    _abcRenderTabela();
  });
}

function _abcExportarXLSX(){
  const items = ABC_STATE._items || [];
  if(!items.length){ _toast('Sem dados para exportar.', 'aviso'); return; }
  const titulo = ABC_STATE._titulo || 'Ranking';
  const wb = XLSX.utils.book_new();

  // Aba 1: Resumo
  const c = ABC_STATE._classes;
  const tot = ABC_STATE._total;
  const totalN = items.length;
  const resumo = [
    ['Curva ABC — '+(ABC_STATE.tipo==='item'?'Itens':'Fornecedores')],
    [],
    ['Per\u00edodo', Array.from(ABC_STATE.pers).sort().join(', ')],
    ['Departamento', ABC_STATE.dept || 'Todos'],
    ['Se\u00e7\u00e3o', ABC_STATE.secao || 'Todas'],
    ['Categoria', ABC_STATE.categoria || 'Todas'],
    ['Base de fornecedor', ABC_STATE.tipo==='fornecedor' ? (ABC_STATE.fornBase==='nf'?'Nota fiscal':'Cadastro do item') : '-'],
    [],
    ['Classe','Itens','% itens','Faturado','% faturado'],
    ['A', c.A.n, (totalN>0?(c.A.n/totalN*100).toFixed(2):'0')+'%', c.A.v, (tot>0?(c.A.v/tot*100).toFixed(2):'0')+'%'],
    ['B', c.B.n, (totalN>0?(c.B.n/totalN*100).toFixed(2):'0')+'%', c.B.v, (tot>0?(c.B.v/tot*100).toFixed(2):'0')+'%'],
    ['C', c.C.n, (totalN>0?(c.C.n/totalN*100).toFixed(2):'0')+'%', c.C.v, (tot>0?(c.C.v/tot*100).toFixed(2):'0')+'%'],
    ['TOTAL', totalN, '100%', tot, '100%']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumo), 'Resumo');

  // Aba 2: Ranking
  let header, rows;
  if(ABC_STATE.tipo === 'item'){
    header = ['Classe','SKU','Produto','Departamento','Se\u00e7\u00e3o','Categoria','Fornecedor cadastro','Faturado','% individual','% acumulado','Qtd vendida'];
    rows = items.map(function(x){return [x.classe, x.cod, x.nome, x.dep||'', x.sec||'', x.cat||'', x.forn||'', x.v, x.pctInd, x.pctAcum, x.q];});
  } else {
    header = ['Classe','Fornecedor','SKUs','Faturado','% individual','% acumulado','Qtd vendida'];
    rows = items.map(function(x){return [x.classe, x.nome, x.n, x.v, x.pctInd, x.pctAcum, x.q];});
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([header].concat(rows)), 'Ranking');

  const arq = 'GPC_CurvaABC_'+(ABC_STATE.tipo==='item'?'itens':'fornecedores')+'_'+_dataLocal()+'.xlsx';
  XLSX.writeFile(wb, arq);
  _auditLog('export_xlsx', {arquivo: arq, pagina: 'abc'});
}


// ================================================================
// AJUDA / SOBRE — glossário de KPIs e informações do sistema
// ================================================================
function renderAjuda(){
  const cont = document.getElementById('page-ajuda');
  cont.innerHTML = '<div class="ph"><div class="pk">Ajuda</div><h2>Sobre <em>o sistema</em></h2></div>'
    +'<div class="ph-sep"></div>'
    +'<div class="page-body">'

    // Bloco: sobre o sistema
    +'<div class="ds" style="margin-top:14px;">'
    +'<div class="ds-hdr"><div class="ds-ico" style="background:#1a2f5c;color:white;">'
    +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>'
    +'</div><div><div class="ds-title">Sobre o GPC Sistema Analítico</div><div class="ds-sub">Plataforma de business intelligence para compras, estoque e financeiro</div></div></div>'
    +'<div class="ds-body" style="padding:14px 18px;">'
    +'<p style="font-size:13px;line-height:1.6;color:var(--text);">Sistema desenvolvido pela <strong>R2 Soluções Empresariais</strong> para análise integrada de compras do <strong>Grupo Pinto Cerqueira (GPC)</strong>. Lê dados extraídos do ERP TOTVS WinThor e os transforma em painéis executivos para CFO, donos e gestores de filial.</p>'
    +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-top:14px;">'
    +'<div style="background:var(--surface-2);padding:10px 12px;border-radius:7px;"><div style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Dados do período</div><div id="aj-info-periodo" style="font-size:13px;font-weight:700;margin-top:3px;">--</div></div>'
    +'<div style="background:var(--surface-2);padding:10px 12px;border-radius:7px;"><div style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Filial atual</div><div id="aj-info-filial" style="font-size:13px;font-weight:700;margin-top:3px;">--</div></div>'
    +'<div style="background:var(--surface-2);padding:10px 12px;border-radius:7px;"><div style="font-family:JetBrains Mono,monospace;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Suporte</div><div style="font-size:12px;font-weight:600;margin-top:3px;">contato@solucoesr2.com.br</div></div>'
    +'</div>'
    +'</div></div>'

    // Bloco: glossario de KPIs
    +'<div class="ds" style="margin-top:14px;">'
    +'<div class="ds-hdr"><div class="ds-ico" style="background:#0a7c4a;color:white;">'
    +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    +'</div><div><div class="ds-title">Glossário de KPIs</div><div class="ds-sub">O que cada indicador significa e como é calculado</div></div></div>'
    +'<div class="ds-body" style="padding:0;">'
    +'<div id="aj-glossario"></div>'
    +'</div></div>'

    // Bloco: páginas do sistema
    +'<div class="ds" style="margin-top:14px;">'
    +'<div class="ds-hdr"><div class="ds-ico" style="background:#7c3aed;color:white;">'
    +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
    +'</div><div><div class="ds-title">Páginas do sistema</div><div class="ds-sub">Para que serve cada análise no menu</div></div></div>'
    +'<div class="ds-body" style="padding:0;">'
    +'<div id="aj-paginas"></div>'
    +'</div></div>'

    // Bloco: dúvidas frequentes
    +'<div class="ds" style="margin-top:14px;">'
    +'<div class="ds-hdr"><div class="ds-ico" style="background:#d97706;color:white;">'
    +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    +'</div><div><div class="ds-title">Dúvidas frequentes</div><div class="ds-sub">Perguntas comuns sobre o uso do sistema</div></div></div>'
    +'<div class="ds-body" style="padding:0;">'
    +'<div id="aj-faq"></div>'
    +'</div></div>'

    +'</div>';

  // Preencher info do sistema
  const m = D.meta || {};
  document.getElementById('aj-info-periodo').textContent = (m.per_ini && m.per_fim)
    ? (m.per_ini.split('-').reverse().join('/') + ' até ' + m.per_fim.split('-').reverse().join('/'))
    : 'Período não disponível';
  document.getElementById('aj-info-filial').textContent = _filialAtual ? _filialAtual.nome : 'GPC Consolidado';

  // Glossário
  const glossario = [
    {kpi:'Faturamento',cor:'#0a7c4a',formula:'Σ vendas líquidas do período',oque:'Total de vendas, já descontadas as devoluções de cliente.'},
    {kpi:'Lucro bruto',cor:'#0a7c4a',formula:'Faturamento − Custo de mercadoria vendida',oque:'Quanto a empresa ganhou em mercadoria vendida.'},
    {kpi:'Margem',cor:'#0a7c4a',formula:'(Lucro / Faturamento) × 100',oque:'% de lucro sobre cada real vendido. Acima de 12% é saudável; abaixo de 6%, crítico.'},
    {kpi:'Compras líquidas',cor:'#2563eb',formula:'Total comprado − Devoluções de fornecedor',oque:'Valor real comprado de fornecedores, descontando o que foi devolvido. Sempre líquido.'},
    {kpi:'Cobertura',cor:'#2563eb',formula:'(Compras líquidas / Faturamento) × 100',oque:'Quanto do faturamento está sendo gasto em compras. Até 80% = OK; 80-100% = atenção; acima = excesso.'},
    {kpi:'% Pago',cor:'#7c3aed',formula:'(Pagamentos comerciais / Compras líquidas) × 100',oque:'% das compras já quitadas. Não inclui juros (subtrai do valor pago).'},
    {kpi:'Em aberto',cor:'#d97706',formula:'Compras líquidas − Total pago',oque:'Quanto ainda falta pagar a fornecedores no período.'},
    {kpi:'Vencidos',cor:'#c33',formula:'Σ títulos com 5+ dias de atraso',oque:'Títulos atrasados por 5 dias ou mais. Atrasos pequenos (1-4 dias) são considerados operacionais e ignorados.'},
    {kpi:'Custo de atraso (juros)',cor:'#c33',formula:'Σ juros pagos no período',oque:'Total de juros gastos por pagar fornecedores em atraso. Custo financeiro evitável.'},
    {kpi:'Estoque atual',cor:'#2563eb',formula:'Σ (qtd_estoque × preço_venda)',oque:'Capital parado em estoque, calculado a preço de venda (valor de mercado).'},
    {kpi:'Cobertura de estoque',cor:'#2563eb',formula:'qtd_estoque / venda_diária_média',oque:'Quantos dias o estoque atual cobre. Padrão ideal: 45 dias (ajustável).'},
    {kpi:'Excesso de estoque',cor:'#d97706',formula:'SKUs com cobertura > dias_ideais',oque:'Produtos com mais estoque que o ideal — capital parado desnecessariamente.'},
    {kpi:'Score de fornecedor',cor:'#7c3aed',formula:'Combinação ponderada de margem (35%), pontualidade (25%), volume (15%), diversidade (10%) e penalidade por vencidos (15%)',oque:'Nota 0-100 do desempenho do fornecedor. A: ≥75; B: 60-75; C: 45-60; D: <45.'},
  ];
  document.getElementById('aj-glossario').innerHTML = '<div style="display:flex;flex-direction:column;">' + glossario.map(function(g){
    return '<div style="border-bottom:1px solid var(--border);padding:14px 18px;display:grid;grid-template-columns:200px 1fr;gap:16px;align-items:start;">'
      +'<div><div style="display:inline-block;width:6px;height:24px;background:'+g.cor+';border-radius:3px;vertical-align:middle;margin-right:8px;"></div><strong style="font-size:13px;vertical-align:middle;">'+esc(g.kpi)+'</strong></div>'
      +'<div><div style="font-size:12px;color:var(--text);line-height:1.5;margin-bottom:6px;">'+g.oque+'</div>'
      +'<div style="font-family:JetBrains Mono,monospace;font-size:10px;background:var(--surface-2);padding:5px 9px;border-radius:4px;color:var(--text-muted);display:inline-block;">'+esc(g.formula)+'</div></div>'
      +'</div>';
  }).join('') + '</div>';

  // Páginas
  const paginasInfo = [
    {grupo:'Dashboard',pgs:[
      {n:'Visão executiva',d:'Painel principal: KPIs do grupo, evolução mensal, alertas resumidos. Ponto de partida para tomada de decisão.'},
      {n:'Compras × Vendas',d:'Comparação direta entre o que foi comprado e vendido em cada período. Útil para identificar descompasso.'},
      {n:'Departamentos',d:'Análise por departamento, com drill-down para seção e categoria. Permite identificar quais áreas geram mais resultado.'},
      {n:'Estoque',d:'Posição de estoque atual com cobertura por SKU. Identifica produtos com excesso ou risco de ruptura.'},
      {n:'Excesso de estoque',d:'Lista de SKUs com cobertura acima do ideal. Mostra capital parado e oportunidades de promoção.'},
      {n:'Financeiro',d:'Detalhe completo dos pagamentos: % pago, em aberto, juros, agenda de vencimentos por mês.'},
      {n:'Vencidos',d:'Títulos individuais em atraso (5+ dias). Lista para ação imediata. Bloco especial para fornecedores GPC.'},
      {n:'Fornecedores',d:'Ranking de todos os fornecedores com score, margem, % pago e indicadores de risco.'},
      {n:'GPC',d:'Análise específica de fornecedores do grupo (Pinto Cerqueira, A P Cerqueira, etc.). Operações intercompanhia.'},
      {n:'Alertas',d:'9 categorias de alertas automáticos: SKUs sem giro, juros excessivos, anomalias de margem, etc.'}
    ]},
    {grupo:'Diagnóstico',pgs:[
      {n:'Diagnóstico produto',d:'Raio-X de um SKU específico: histórico de vendas, compras, lucro, cobertura. Útil para investigar problemas.'},
      {n:'Diagnóstico fornecedor',d:'Raio-X de um fornecedor: todos os SKUs vendidos, histórico de pagamento, score detalhado.'}
    ]},
    {grupo:'Configuração',pgs:[
      {n:'Histórico',d:'Lista de retratos disponíveis (versões antigas dos dados). Permite navegar pelo sistema com dados de uma data anterior.'},
      {n:'Administração',d:'Gestão de usuários, perfis, configurações por base, auditoria e diagnóstico do sistema (apenas admins).'},
      {n:'Ajuda',d:'Esta página: glossário de KPIs, dúvidas frequentes e informações do sistema.'}
    ]}
  ];
  document.getElementById('aj-paginas').innerHTML = paginasInfo.map(function(g){
    return '<div style="border-bottom:1px solid var(--border);padding:14px 18px;">'
      +'<div style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">'+esc(g.grupo)+'</div>'
      +g.pgs.map(function(p){
        return '<div style="display:grid;grid-template-columns:160px 1fr;gap:16px;padding:6px 0;align-items:start;">'
          +'<strong style="font-size:12px;">'+esc(p.n)+'</strong>'
          +'<span style="font-size:12px;color:var(--text);line-height:1.5;">'+esc(p.d)+'</span>'
          +'</div>';
      }).join('')
      +'</div>';
  }).join('');

  // FAQ
  const faqs = [
    {q:'Por que algumas páginas pedem para selecionar uma filial?',a:'A visão consolidada agrega KPIs de todas as filiais, mas não tem dados granulares (SKUs individuais, títulos individuais). Para análises detalhadas como Excesso de Estoque ou Vencidos, é necessário entrar numa filial específica.'},
    {q:'Onde fica o seletor de filial?',a:'No topo da tela, ao lado do logo "GPC". Aparece se você tem permissão para ver mais de 1 filial. Se você só tem acesso a 1, ela carrega direto.'},
    {q:'Como exporto os dados?',a:'Em qualquer página, use os botões XLSX (planilha Excel) ou PDF (impressão) no canto superior direito. O XLSX exporta toda a tabela visível; o PDF é a versão para impressão.'},
    {q:'Por que minha sessão expirou?',a:'Sessões duram 30 dias. Após esse período, é necessário fazer login novamente. Você também pode sair manualmente pelo menu do seu nome no topo.'},
    {q:'Posso ver os dados de um dia anterior?',a:'Sim, na página Histórico (menu lateral, seção Configuração). Selecione um retrato e o sistema inteiro passa a mostrar dados daquela data. Banner amarelo indica modo histórico.'},
    {q:'Por que alguns KPIs estão diferentes do meu ERP?',a:'O sistema aplica decisões de cálculo específicas: compras sempre líquidas (descontando devoluções de fornecedor), % pago sem juros, vencidos só com 5+ dias de atraso. Veja a aba Glossário acima para detalhes.'},
    {q:'Quem pode alterar as configurações (SKUs ocultos, fornecedores GPC)?',a:'Apenas usuários com perfil Admin. Configurações são por base (ATP, Comercial Pinto). Mudanças no ATP não afetam Comercial Pinto.'},
    {q:'O sistema funciona offline?',a:'Não. Como os dados são carregados via fetch HTTP, é necessário conexão com a internet. Após carregado, navegação entre páginas funciona até a sessão expirar.'},
    {q:'Encontrei um erro ou tenho uma sugestão. O que faço?',a:'Entre em contato com a R2 Soluções Empresariais (contato@solucoesr2.com.br). Se possível, descreva os passos para reproduzir o erro e qual filial/página estava usando.'}
  ];
  document.getElementById('aj-faq').innerHTML = faqs.map(function(f, i){
    return '<details style="border-bottom:1px solid var(--border);padding:0;">'
      +'<summary style="padding:14px 18px;cursor:pointer;font-weight:600;font-size:13px;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:10px;">'
      +'<span>'+esc(f.q)+'</span>'
      +'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><polyline points="6 9 12 15 18 9"/></svg>'
      +'</summary>'
      +'<div style="padding:0 18px 14px;font-size:12px;color:var(--text);line-height:1.6;">'+esc(f.a)+'</div>'
      +'</details>';
  }).join('');
}


// ================================================================
// SMOKE TESTS - validação de integridade do sistema
// ================================================================
const SMOKE_TESTS_DEF = [
  {
    grupo: 'Integridade dos dados',
    cor: '#2563eb',
    testes: [
      {
        id: 'd-json-valid',
        nome: 'D existe e tem chaves esperadas',
        run: function(){
          if(!D || typeof D !== 'object') return {status:'FAIL', msg:'D não está definido'};
          const reqKeys = isConsolidado() ? ['meta','departamentos','filiais_resumo'] : ['meta','produtos','departamentos','fornecedores'];
          const faltando = reqKeys.filter(k => !D[k]);
          if(faltando.length) return {status:'FAIL', msg:'Faltam chaves: '+faltando.join(', ')};
          return {status:'OK', msg:'Estrutura OK ('+Object.keys(D).length+' chaves)'};
        }
      },
      {
        id: 'd-meta-valid',
        nome: 'Meta tem KPIs principais',
        run: function(){
          if(!D || !D.meta) return {status:'FAIL', msg:'D.meta ausente'};
          const reqMeta = ['tv','tl','tc'];
          const ausentes = reqMeta.filter(k => typeof D.meta[k] === 'undefined');
          if(ausentes.length) return {status:'FAIL', msg:'Faltam KPIs: '+ausentes.join(', ')};
          return {status:'OK', msg:'Vendido: '+fK(D.meta.tv)+' · Lucro: '+fK(D.meta.tl)+' · Comprado: '+fK(D.meta.tc)};
        }
      },
      {
        id: 'd-no-nan',
        nome: 'Nenhum KPI principal é NaN/Infinity',
        run: function(){
          if(!D || !D.meta) return {status:'SKIP', msg:'D.meta ausente'};
          const ks = Object.keys(D.meta);
          const ruins = [];
          ks.forEach(function(k){
            const v = D.meta[k];
            if(typeof v === 'number' && (isNaN(v) || !isFinite(v))) ruins.push(k);
          });
          if(ruins.length) return {status:'FAIL', msg:ruins.length+' KPI(s) inválidos: '+ruins.slice(0,5).join(', ')};
          return {status:'OK', msg:ks.filter(k=>typeof D.meta[k]==='number').length+' KPIs numéricos válidos'};
        }
      },
      {
        id: 'd-produtos-count',
        nome: 'Produtos: lista não vazia (filial) ou ausente (consolidado)',
        run: function(){
          if(isConsolidado()){
            if(D.produtos && D.produtos.length > 0) return {status:'WARN', msg:'Consolidado não deveria ter produtos individuais ('+D.produtos.length+' encontrados)'};
            return {status:'OK', msg:'Sem produtos (esperado em consolidado)'};
          }
          if(!D.produtos || D.produtos.length === 0) return {status:'FAIL', msg:'D.produtos vazio'};
          if(D.produtos.length < 100) return {status:'WARN', msg:'Apenas '+D.produtos.length+' produtos (esperado > 100)'};
          return {status:'OK', msg:fI(D.produtos.length)+' produtos'};
        }
      },
      {
        id: 'd-fornecedores-count',
        nome: 'Fornecedores: pelo menos 10',
        run: function(){
          if(!D.fornecedores) return {status:'FAIL', msg:'D.fornecedores ausente'};
          if(D.fornecedores.length < 10) return {status:'WARN', msg:'Apenas '+D.fornecedores.length+' fornecedores'};
          return {status:'OK', msg:D.fornecedores.length+' fornecedores'};
        }
      },
      {
        id: 'd-deps-count',
        nome: 'Departamentos: lista não vazia',
        run: function(){
          if(!D.departamentos || D.departamentos.length === 0) return {status:'FAIL', msg:'D.departamentos vazio'};
          return {status:'OK', msg:D.departamentos.length+' departamentos'};
        }
      }
    ]
  },
  {
    grupo: 'Cálculos consistentes',
    cor: '#7c3aed',
    testes: [
      {
        id: 'c-marg-range',
        nome: 'Margem entre 0 e 100%',
        run: function(){
          if(!D.meta || typeof D.meta.tv === 'undefined' || typeof D.meta.tl === 'undefined') return {status:'SKIP', msg:'Faltam dados de venda/lucro'};
          if(D.meta.tv <= 0) return {status:'WARN', msg:'Faturamento zero, sem margem para validar'};
          const m = D.meta.tl / D.meta.tv * 100;
          if(m < -50 || m > 100) return {status:'FAIL', msg:'Margem '+m.toFixed(1)+'% fora do intervalo razoável'};
          if(m < 0) return {status:'WARN', msg:'Margem negativa: '+m.toFixed(1)+'%'};
          return {status:'OK', msg:'Margem: '+m.toFixed(2)+'%'};
        }
      },
      {
        id: 'c-pp-pa',
        nome: '% Pago + % Aberto ≈ 100%',
        run: function(){
          if(!D.meta) return {status:'SKIP', msg:'D.meta ausente'};
          const pp = D.meta.pp || 0, pa = D.meta.pa || 0;
          if(pp === 0 && pa === 0) return {status:'WARN', msg:'Sem dados de pagamento'};
          const total = pp + pa;
          const diff = Math.abs(total - 100);
          if(diff > 1) return {status:'FAIL', msg:'Soma '+total.toFixed(1)+'% diverge de 100%'};
          return {status:'OK', msg:pp.toFixed(1)+'% + '+pa.toFixed(1)+'% ≈ '+total.toFixed(1)+'%'};
        }
      },
      {
        id: 'c-deps-sum',
        nome: 'Soma de vendas dos departamentos ≈ total geral',
        run: function(){
          if(!D.departamentos || !D.meta) return {status:'SKIP', msg:'Dados ausentes'};
          const sum = D.departamentos.reduce(function(s,d){ return s + (d.vdo||0); }, 0);
          const total = D.meta.tv || 0;
          if(total === 0) return {status:'WARN', msg:'Total zero'};
          const diff = Math.abs(sum - total) / total * 100;
          if(diff > 5) return {status:'FAIL', msg:'Diferença '+diff.toFixed(1)+'%: deps='+fK(sum)+' vs meta='+fK(total)};
          if(diff > 1) return {status:'WARN', msg:'Diferença '+diff.toFixed(2)+'%'};
          return {status:'OK', msg:'Diferença '+diff.toFixed(2)+'% (deps='+fK(sum)+', meta='+fK(total)+')'};
        }
      },
      {
        id: 'c-forn-sum',
        nome: 'Soma compras fornecedores ≈ total comprado',
        run: function(){
          if(!D.fornecedores || !D.meta) return {status:'SKIP', msg:'Dados ausentes'};
          const sum = D.fornecedores.reduce(function(s,f){ return s + (f.com||0); }, 0);
          const total = D.meta.tc || 0;
          if(total === 0) return {status:'WARN', msg:'Total zero'};
          const diff = Math.abs(sum - total) / total * 100;
          if(diff > 5) return {status:'FAIL', msg:'Diferença '+diff.toFixed(1)+'%'};
          if(diff > 1) return {status:'WARN', msg:'Diferença '+diff.toFixed(2)+'%'};
          return {status:'OK', msg:'Diferença '+diff.toFixed(2)+'%'};
        }
      },
      {
        id: 'c-prod-sum',
        nome: 'Soma vendas produtos ≈ total geral (filial apenas)',
        run: function(){
          if(isConsolidado()) return {status:'SKIP', msg:'Não aplicável em consolidado'};
          if(!D.produtos || !D.meta) return {status:'SKIP', msg:'Dados ausentes'};
          let sum = 0;
          D.produtos.forEach(function(p){
            if(p.sv){
              p.sv.forEach(function(per){ if(per && per[0]) sum += per[0]; });
            }
          });
          const total = D.meta.tv || 0;
          if(total === 0) return {status:'WARN', msg:'Total zero'};
          const diff = Math.abs(sum - total) / total * 100;
          if(diff > 5) return {status:'FAIL', msg:'Diferença '+diff.toFixed(1)+'%: prod='+fK(sum)+' vs meta='+fK(total)};
          if(diff > 1) return {status:'WARN', msg:'Diferença '+diff.toFixed(2)+'%'};
          return {status:'OK', msg:'Diferença '+diff.toFixed(2)+'%'};
        }
      },
      {
        id: 'c-evo-presence',
        nome: 'Evolução mensal: pelo menos 1 mês',
        run: function(){
          if(!D.evo_mensal || D.evo_mensal.length === 0) return {status:'FAIL', msg:'D.evo_mensal vazio'};
          return {status:'OK', msg:D.evo_mensal.length+' meses'};
        }
      }
    ]
  },
  {
    grupo: 'Páginas renderizam',
    cor: '#0a7c4a',
    testes: [] // preenchido dinamicamente
  },
  {
    grupo: 'Configurações e ambiente',
    cor: '#d97706',
    testes: [
      {
        id: 'e-filiais-loaded',
        nome: 'filiais.json carregado',
        run: function(){
          if(!_filiaisDisponiveis || _filiaisDisponiveis.length === 0) return {status:'FAIL', msg:'_filiaisDisponiveis vazio'};
          return {status:'OK', msg:_filiaisDisponiveis.length+' filia'+(_filiaisDisponiveis.length===1?'l':'is')+' ativa(s)'};
        }
      },
      {
        id: 'e-bases-loaded',
        nome: 'Bases configuradas',
        run: function(){
          if(!_basesDisponiveis || _basesDisponiveis.length === 0) return {status:'WARN', msg:'_basesDisponiveis vazio'};
          return {status:'OK', msg:_basesDisponiveis.length+' base(s): '+_basesDisponiveis.map(function(b){return b.sigla;}).join(', ')};
        }
      },
      {
        id: 'e-cons-disponivel',
        nome: 'Consolidado acessível',
        run: async function(){
          // Manifest-aware: se o pacote não tem consolidado.json, é por design (modo novo modular)
          await _carregarManifest();
          if(_MANIFEST && !_MANIFEST._ausente && !_temArquivo('consolidado.json')){
            return {status:'INFO', msg:'modo novo modular (sem consolidado.json)'};
          }
          try {
            const r = await fetch('consolidado.json', {cache:'no-cache'});
            if(!r.ok) return {status:'INFO', msg:'sem consolidado.json (modo novo)'};
            const j = await r.json();
            if(!j || (!j.D && !j.meta)) return {status:'FAIL', msg:'JSON sem estrutura esperada'};
            return {status:'OK', msg:'consolidado.json OK'};
          } catch(e){
            return {status:'FAIL', msg:e.message};
          }
        }
      },
      {
        id: 'e-snaps-acessivel',
        nome: 'snapshots.json acessível',
        run: async function(){
          try {
            const r = await fetch('snapshots.json', {cache:'no-cache'});
            if(!r.ok) return {status:'WARN', msg:'HTTP '+r.status+' (snapshots opcionais)'};
            const j = await r.json();
            const n = (j.snapshots||[]).length;
            return {status:'OK', msg:n+' snapshot(s) disponível(eis)'};
          } catch(e){
            return {status:'WARN', msg:'Sem snapshots: '+e.message};
          }
        }
      },
      {
        id: 'e-sess-valid',
        nome: 'Sessão válida e usuário existe',
        run: function(){
          const sess = _getSessao();
          if(!sess) return {status:'FAIL', msg:'Sem sessão ativa'};
          const perfil = _getPerfilUsuario();
          if(!perfil) return {status:'FAIL', msg:'Perfil do usuário não resolveu'};
          const exp = new Date(sess.expira_em);
          const dias = Math.round((exp - new Date()) / (24*3600*1000));
          return {status:'OK', msg:perfil.nome+' ('+perfil.perfilNome+') · expira em '+dias+' dia(s)'};
        }
      },
      {
        id: 'e-localstorage',
        nome: 'localStorage funcionando',
        run: function(){
          try {
            const k = '__smoke_test__';
            localStorage.setItem(k, '1');
            const v = localStorage.getItem(k);
            localStorage.removeItem(k);
            if(v !== '1') return {status:'FAIL', msg:'Read não bateu com write'};
            return {status:'OK', msg:'Read/write OK'};
          } catch(e){
            return {status:'FAIL', msg:e.message};
          }
        }
      },
      {
        id: 'e-chart-lib',
        nome: 'Chart.js carregado',
        run: function(){
          if(typeof Chart === 'undefined') return {status:'FAIL', msg:'Chart não disponível'};
          return {status:'OK', msg:'Chart.js v'+(Chart.version||'desconhecida')};
        }
      },
      {
        id: 'e-xlsx-lib',
        nome: 'XLSX (SheetJS) carregado',
        run: function(){
          if(typeof XLSX === 'undefined') return {status:'FAIL', msg:'XLSX não disponível'};
          return {status:'OK', msg:'SheetJS '+(XLSX.version||'OK')};
        }
      }
    ]
  }
];

// Preencher testes do grupo "Páginas renderizam" dinamicamente
(function(){
  const paginasParaTestar = ['executivo','cv','deptos','estoque','financeiro','fornecedores','alertas','abc'];
  const grupoPgs = SMOKE_TESTS_DEF.find(g => g.grupo === 'Páginas renderizam');

  // Registry: resolve funcao render no momento de rodar (nao no load do arquivo)
  // As funções legadas (renderDeptos, renderEstoque, etc) foram removidas em v4.2.
  // Em modo modular novo (sempre o caso em produção), apontamos para as Novo.
  function _getRenderFn(pg){
    const reg = {
      'executivo':    function(){return typeof renderExecutivo       !== 'undefined' ? renderExecutivo       : null;},
      'cv':           function(){return typeof renderCV              !== 'undefined' ? renderCV              : null;},
      'deptos':       function(){return typeof renderDeptosNovo      !== 'undefined' ? renderDeptosNovo      : null;},
      'estoque':      function(){return typeof renderEstoqueNovo     !== 'undefined' ? renderEstoqueNovo     : null;},
      'financeiro':   function(){return typeof renderFinanceiroNovo  !== 'undefined' ? renderFinanceiroNovo  : null;},
      'fornecedores': function(){return typeof renderFornecedoresNovo!== 'undefined' ? renderFornecedoresNovo: null;},
      'alertas':      function(){return typeof renderAlertasNovo     !== 'undefined' ? renderAlertasNovo     : null;},
      'abc':          function(){return typeof renderABCNovo         !== 'undefined' ? renderABCNovo         : null;}
    };
    const getter = reg[pg];
    return getter ? getter() : null;
  }

  paginasParaTestar.forEach(function(pg){
    grupoPgs.testes.push({
      id: 'p-render-'+pg,
      nome: 'Página: '+pg,
      run: async function(){
        const perfil = _getPerfilUsuario();
        if(perfil && perfil.paginasPermitidas && !perfil.paginasPermitidas.includes(pg)){
          return {status:'SKIP', msg:'Sem permissão para esta página'};
        }
        const el = document.getElementById('page-'+pg);
        if(!el) return {status:'FAIL', msg:'Elemento page-'+pg+' não existe'};
        try {
          const t0 = performance.now();
          const renderFn = _getRenderFn(pg);
          if(!renderFn) return {status:'FAIL', msg:'Função render '+pg+' não encontrada'};
          renderFn();
          const t1 = performance.now();
          if(!el.innerHTML || el.innerHTML.trim().length < 50){
            return {status:'FAIL', msg:'Renderizou conteúdo vazio'};
          }
          return {status:'OK', msg:'Renderizou em '+(t1-t0).toFixed(0)+'ms ('+Math.round(el.innerHTML.length/1024)+'KB)'};
        } catch(e){
          return {status:'FAIL', msg:(e.message||'erro desconhecido').slice(0, 80)};
        }
      }
    });
  });
})();

let _smokeRodando = false;

async function _runSmokeTests(){
  if(_smokeRodando) return;
  _smokeRodando = true;
  const cont = document.getElementById('adm-smoke-list');
  if(!cont) return;

  // Total de testes
  let totalTestes = 0;
  SMOKE_TESTS_DEF.forEach(function(g){ totalTestes += g.testes.length; });

  cont.innerHTML = '<div id="smoke-resumo" style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:12px;">'
    + '<div style="display:flex;align-items:center;gap:10px;">'
    + '<div style="width:32px;height:32px;border:3px solid var(--surface-3);border-top-color:var(--accent);border-radius:50%;animation:dlSpin 0.8s linear infinite;"></div>'
    + '<div><div style="font-size:13px;font-weight:700;">Executando testes...</div>'
    + '<div id="smoke-prog" style="font-size:11px;color:var(--text-muted);font-family:JetBrains Mono,monospace;">0 / '+totalTestes+'</div></div>'
    + '</div></div>'
    + '<div id="smoke-grupos"></div>';

  const grupos = document.getElementById('smoke-grupos');
  const resultadosGlobais = {OK:0, FAIL:0, WARN:0, SKIP:0};
  let executados = 0;
  const t0Global = performance.now();

  for(let gi = 0; gi < SMOKE_TESTS_DEF.length; gi++){
    const grupo = SMOKE_TESTS_DEF[gi];
    const grupoEl = document.createElement('div');
    grupoEl.id = 'smoke-g-'+gi;
    grupoEl.style.cssText = 'border:1px solid var(--border);border-radius:8px;margin-bottom:10px;overflow:hidden;';
    grupoEl.innerHTML = '<div style="background:var(--surface-2);padding:10px 14px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;border-left:4px solid '+grupo.cor+';" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display===\'none\' ? \'block\' : \'none\'">'
      + '<div style="display:flex;align-items:center;gap:10px;"><strong style="font-size:13px;">'+esc(grupo.grupo)+'</strong> <span id="smoke-g-'+gi+'-counter" style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--text-muted);">aguardando...</span></div>'
      + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>'
      + '</div>'
      + '<div style="padding:0;display:block;"><table class="t" style="margin:0;"><tbody id="smoke-g-'+gi+'-body"></tbody></table></div>';
    grupos.appendChild(grupoEl);

    const tbody = document.getElementById('smoke-g-'+gi+'-body');
    const counterEl = document.getElementById('smoke-g-'+gi+'-counter');
    const grupoStats = {OK:0, FAIL:0, WARN:0, SKIP:0};

    for(let ti = 0; ti < grupo.testes.length; ti++){
      const t = grupo.testes[ti];
      const tr = document.createElement('tr');
      tr.innerHTML = '<td class="L" style="width:42px;text-align:center;"><div style="width:18px;height:18px;border:2px solid var(--surface-3);border-top-color:var(--accent);border-radius:50%;animation:dlSpin 0.6s linear infinite;display:inline-block;"></div></td>'
        + '<td class="L" style="font-weight:600;font-size:12px;">'+esc(t.nome)+'</td>'
        + '<td class="L" style="color:var(--text-muted);font-size:11px;">Executando...</td>'
        + '<td class="L" style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--text-muted);width:60px;">--</td>';
      tbody.appendChild(tr);

      const tStart = performance.now();
      let res;
      try {
        const r = t.run();
        res = (r && typeof r.then === 'function') ? await r : r;
      } catch(e){
        res = {status:'FAIL', msg:'Exceção: '+e.message.slice(0, 80)};
      }
      const tEnd = performance.now();
      const dur = (tEnd - tStart).toFixed(0);

      const statusEl = {
        'OK':   {bg:'#dcfce7', cor:'#0a7c4a', ico:'✓'},
        'FAIL': {bg:'#fee', cor:'#c33', ico:'✗'},
        'WARN': {bg:'#fef3c7', cor:'#d97706', ico:'!'},
        'SKIP': {bg:'#f3f4f6', cor:'#6b7280', ico:'·'}
      }[res.status] || {bg:'#f3f4f6', cor:'#6b7280', ico:'?'};

      tr.cells[0].innerHTML = '<div style="width:22px;height:22px;border-radius:50%;background:'+statusEl.bg+';color:'+statusEl.cor+';display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;">'+statusEl.ico+'</div>';
      tr.cells[2].innerHTML = '<span style="color:'+statusEl.cor+';font-weight:600;font-size:11px;">'+esc(res.status)+'</span> <span style="color:var(--text-muted);font-size:11px;">· '+esc(res.msg)+'</span>';
      tr.cells[3].textContent = dur+'ms';

      grupoStats[res.status] = (grupoStats[res.status]||0) + 1;
      resultadosGlobais[res.status] = (resultadosGlobais[res.status]||0) + 1;
      executados++;

      const partes = [];
      if(grupoStats.OK)   partes.push(grupoStats.OK+' OK');
      if(grupoStats.WARN) partes.push(grupoStats.WARN+' WARN');
      if(grupoStats.FAIL) partes.push(grupoStats.FAIL+' FAIL');
      if(grupoStats.SKIP) partes.push(grupoStats.SKIP+' SKIP');
      counterEl.textContent = partes.join(' · ');

      const prog = document.getElementById('smoke-prog');
      if(prog) prog.textContent = executados+' / '+totalTestes;
    }
  }

  const t1Global = performance.now();
  const durTotal = ((t1Global - t0Global) / 1000).toFixed(1);
  const resumo = document.getElementById('smoke-resumo');
  const tudoOk = (resultadosGlobais.FAIL || 0) === 0;
  const corResumo = tudoOk ? '#0a7c4a' : '#c33';
  const icoResumo = tudoOk ? '✓' : '✗';
  resumo.innerHTML = '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">'
    + '<div style="width:44px;height:44px;border-radius:50%;background:'+(tudoOk?'#dcfce7':'#fee')+';color:'+corResumo+';display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;">'+icoResumo+'</div>'
    + '<div style="flex:1;"><div style="font-size:14px;font-weight:800;color:'+corResumo+';">'+(tudoOk?'Todos os testes passaram':'Falhas detectadas')+'</div>'
    + '<div style="font-size:11px;color:var(--text-muted);font-family:JetBrains Mono,monospace;margin-top:3px;">'
    + (resultadosGlobais.OK||0)+' OK · '+(resultadosGlobais.WARN||0)+' WARN · '+(resultadosGlobais.FAIL||0)+' FAIL · '+(resultadosGlobais.SKIP||0)+' SKIP · executado em '+durTotal+'s</div></div>'
    + '<button onclick="_runSmokeTests()" style="background:var(--surface);border:1px solid var(--border-strong);color:var(--text);padding:8px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-family:inherit;font-weight:600;">Executar novamente</button>'
    + '</div>';

  _auditLog('smoke_test_run', {ok:resultadosGlobais.OK, fail:resultadosGlobais.FAIL, warn:resultadosGlobais.WARN, skip:resultadosGlobais.SKIP, duracao_s:parseFloat(durTotal)});
  _smokeRodando = false;
}
window._runSmokeTests = _runSmokeTests;

function renderAdmSmoke(){
  const el = document.getElementById('adm-smoke-list');
  if(!el) return;
  el.innerHTML = '<div style="text-align:center;padding:24px;background:var(--surface-2);border:1px dashed var(--border);border-radius:8px;">'
    + '<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Clique em <strong>Executar diagnóstico</strong> para validar a integridade do sistema.</div>'
    + '<button onclick="_runSmokeTests()" style="background:var(--accent);color:white;border:none;padding:10px 22px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:700;font-family:inherit;display:inline-flex;align-items:center;gap:6px;">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
    + 'Executar diagnóstico</button>'
    + '</div>';
}


// ================================================================
// ================================================================
// SKUs OCULTOS — itens ignorados em todas as análises
// Configurado por base (cada loja tem sua própria lista)
// ================================================================
const HIDDEN_SKUS_DEFAULTS = []; // sem ocultos por padrão; admin configura por base

function getHiddenSkus(base){
  // Se base for explicitamente passado, usa ele.
  // Se for undefined/null, usa a base ativa (filial atual).
  // Se for explicitamente null E estamos no consolidado, faz união.
  if(typeof base === 'undefined') base = _getBaseAtivaParaConfig();
  try{
    if(base){
      const v = localStorage.getItem('hiddenSkus:'+base);
      if(v) return JSON.parse(v);
      // Sem cadastro pra esta base: vazio (não usa default global)
      return [];
    } else {
      // Consolidado: união de ocultos de todas as bases
      const uniao = new Set();
      (_basesDisponiveis||[]).forEach(function(b){
        try{
          const v = localStorage.getItem('hiddenSkus:'+b.sigla);
          if(v) JSON.parse(v).forEach(c => uniao.add(c));
        }catch(e){}
      });
      return [...uniao];
    }
  }catch(e){}
  return [];
}
function saveHiddenSkus(list, base){
  base = base || _getBaseAtivaParaConfig() || 'default';
  try{ localStorage.setItem('hiddenSkus:'+base, JSON.stringify(list)); }catch(e){}
}
function isHiddenSku(cod){
  return getHiddenSkus().includes(cod);
}

// Aplica o filtro aos produtos e reindexa
function applyHiddenFilter(){
  if(!D._origProdutos) D._origProdutos = D.produtos;
  const hid = new Set(getHiddenSkus());
  D.produtos = D._origProdutos.filter(function(p){ return !hid.has(p.c); });
  byC.clear(); byE.clear();
  D.produtos.forEach(function(p){
    byC.set(p.c, p);
    if(p.ea && p.ea !== 0) byE.set(String(p.ea), p);
  });
}

// Aplica filtro de SKUs ocultos em E.produtos (módulo novo)
// Chamado após E carregar e quando a base ativa muda
function _aplicarHiddenFilterE(){
  if(typeof E === 'undefined' || !E || !E.produtos) return;
  // Salva versão original na primeira chamada
  if(!E._origProdutos) E._origProdutos = E.produtos;

  // Determina lista de ocultos baseada na base ativa
  // Se está em consolidado (sem _filialAtual), faz união de TODAS as bases
  // Se está em uma filial específica, usa só os ocultos da base dessa filial
  let ocultos;
  if(typeof _filialAtual !== 'undefined' && _filialAtual && _filialAtual.base_sigla){
    // Filial específica: lê só dela
    try {
      const v = localStorage.getItem('hiddenSkus:'+_filialAtual.base_sigla);
      ocultos = v ? JSON.parse(v) : [];
    } catch(e){ ocultos = []; }
  } else {
    // Consolidado: união
    ocultos = getHiddenSkus(null) || [];
  }

  const hid = new Set(ocultos.map(function(c){return parseInt(c,10);}));
  if(hid.size === 0){
    // Sem ocultos: restaura
    E.produtos = E._origProdutos;
    return;
  }
  E.produtos = E._origProdutos.filter(function(p){ return !hid.has(p.cod); });
}
window._aplicarHiddenFilterE = _aplicarHiddenFilterE;

window.addHiddenSku = function(cod){
  const c = parseInt(cod);
  if(isNaN(c)) return;
  const list = getHiddenSkus(_baseAdminSelecionada);
  if(!list.includes(c)){
    list.push(c);
    saveHiddenSkus(list,_baseAdminSelecionada);
    _auditLog('admin_sku_add',{base:_baseAdminSelecionada, sku:c});
    applyHiddenFilter();
    if(typeof _aplicarHiddenFilterE === 'function') _aplicarHiddenFilterE();
    renderedPages.clear();
    const active = document.querySelector('.page.active');
    if(active){
      const pg = active.id.replace('page-','');
      renderPage(pg); renderedPages.add(pg);
    }
    if(document.getElementById('adm-hid-list')) renderHidList();
  }
};
window.removeHiddenSku = function(cod){
  const c = parseInt(cod);
  const list = getHiddenSkus(_baseAdminSelecionada).filter(x => x !== c);
  saveHiddenSkus(list,_baseAdminSelecionada);
  _auditLog('admin_sku_rem',{base:_baseAdminSelecionada, sku:c});
  applyHiddenFilter();
  if(typeof _aplicarHiddenFilterE === 'function') _aplicarHiddenFilterE();
  renderedPages.clear();
  const active = document.querySelector('.page.active');
  if(active){
    const pg = active.id.replace('page-','');
    renderPage(pg); renderedPages.add(pg);
  }
  if(document.getElementById('adm-hid-list')) renderHidList();
};
window.resetHiddenSkus = async function(){
  const ok = await _confirm('Restaurar a lista padrão de SKUs ocultos para esta base?', {titulo:'Restaurar SKUs ocultos', btnOk:'Restaurar padrão', perigo:true});
  if(!ok) return;
  saveHiddenSkus([...HIDDEN_SKUS_DEFAULTS],_baseAdminSelecionada);
  _auditLog('admin_sku_reset',{base:_baseAdminSelecionada});
  applyHiddenFilter();
  if(typeof _aplicarHiddenFilterE === 'function') _aplicarHiddenFilterE();
  renderedPages.clear();
  const active = document.querySelector('.page.active');
  if(active){
    const pg = active.id.replace('page-','');
    renderPage(pg); renderedPages.add(pg);
  }
  renderHidList();
};

function renderHidList(){
  const list = getHiddenSkus(_baseAdminSelecionada);
  const el = document.getElementById('adm-hid-list');
  const cntEl = document.getElementById('adm-hid-count');
  if(!el) return;
  if(cntEl) cntEl.textContent = list.length;
  if(!list.length){
    el.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px;">Nenhum SKU oculto.</div>';
    return;
  }
  el.innerHTML = list.map(function(c){
    const p = (D._origProdutos||D.produtos).find(x => x.c === c);
    const info = p ? esc(p.d||'')+' <span style="color:var(--text-muted);font-family:\'JetBrains Mono\',monospace;">· '+esc(p.dp||'')+'</span>' : '<span style="color:var(--text-muted);">Produto não encontrado na base</span>';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border:1px solid var(--border);border-radius:7px;margin-bottom:6px;background:var(--surface-2);">'
      +'<div><div style="font-family:\'JetBrains Mono\',monospace;font-weight:700;font-size:13px;color:var(--accent);">#'+esc(c)+'</div>'
      +'<div style="font-size:12px;margin-top:2px;">'+info+'</div></div>'
      +'<button onclick="removeHiddenSku('+c+')" style="background:transparent;border:1px solid var(--danger);color:var(--danger-text);padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px;font-family:inherit;">Remover</button>'
      +'</div>';
  }).join('');
}

// Aplicar filtro de SKUs ocultos depois que o sistema inicializa
// (chamado pelo bootstrap depois de _initSistema)
function _applyHiddenFilterDeferred(){
  if(typeof D !== 'undefined' && D && D.produtos) applyHiddenFilter();
}

// ================================================================

// Helper: estamos no modo consolidado (sem dados de produtos/titulos individuais)?
function isConsolidado(){
  return !_filialAtual && D && (!D.produtos || D.produtos.length === 0);
}

// Renderiza um banner de aviso quando uma pagina precisa de dados que nao existem no consolidado
function renderAvisoConsolidado(containerId, mensagem){
  const cont = document.getElementById(containerId);
  if(!cont) return;
  const filiaisDisponiveis = _filiaisDisponiveis.map(function(f){
    return '<a href="?filial='+encodeURIComponent(f.sigla)+'" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:var(--accent);color:white;text-decoration:none;border-radius:6px;font-size:12px;font-weight:600;margin-right:8px;">'
      +'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>'
      +f.nome+'</a>';
  }).join('');
  cont.innerHTML = '<div class="ph"><div class="pk">Visão consolidada</div><h2>Análise <em>não disponível</em></h2></div>'
    +'<div class="ph-sep"></div>'
    +'<div class="page-body" style="padding:40px 20px;">'
    +'<div style="max-width:600px;margin:40px auto;text-align:center;">'
    +'<div style="width:64px;height:64px;background:var(--warning-bg);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">'
    +'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    +'</div>'
    +'<h3 style="font-size:20px;font-weight:800;margin-bottom:10px;">Análise disponível apenas por filial</h3>'
    +'<p style="font-size:14px;color:var(--text-muted);line-height:1.6;margin-bottom:24px;">'+esc(mensagem)+'</p>'
    +'<div style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">Selecione uma filial</div>'
    +'<div>'+filiaisDisponiveis+'</div>'
    +'</div></div>';
}


// FILTROS (estado global)
// ================================================================
let activePers=new Set(PERS);
let activeDept='';

/**
 * Cache do evo_mensal montado a partir dos JSONs modulares novos (V, C, F).
 * Reseta quando V/C/F mudam (controlado por _evoCacheKey).
 */
let _evoCache = null;
let _evoCacheKey = null;

/**
 * Monta um array no formato D.evo_mensal a partir dos JSONs novos:
 *   - V (vendas): traz vdo, luc, marg, dvc
 *   - C (compras): traz com, dvf, ni
 *   - F (financeiro): traz pag, abr
 *
 * Filtrado nos meses presentes em V.mensal (jan/2025 a abr/2026).
 * Reaproveitado por todas as funções de Compras (renderCV, renderDeptos, etc).
 *
 * @param {string} pagina - id da página (opcional). Se passado e estiver no
 *   catálogo de filtro de supervisor, subtrai a parcela ignorada.
 */
function _construirEvoFromNovo(pagina){
  // Cache key baseada em quais JSONs estão carregados E na pagina+cfg.
  // Cada página tem seu próprio cache (mas todas apontam pro mesmo storage).
  const cfgSnap = (typeof _supIgnoradosCache !== 'undefined' && _supIgnoradosCache)
    ? JSON.stringify(_supIgnoradosCache.paginas || {}) : '';
  const key = (V?'V':'')+(C?'C':'')+(F?'F':'')+'||'+(pagina||'')+'||'+cfgSnap;
  if(_evoCache && _evoCacheKey === key) return _evoCache;

  if(!V || !V.mensal){
    _evoCache = [];
    _evoCacheKey = key;
    return _evoCache;
  }

  // Mapa pra subtrair de cada (loja, ym) — vazio se nenhuma página passada
  const ignDelta = pagina ? Filtros.fatLiqIgnoradoPorLojaYm(pagina) : null;

  // Agregar V.mensal por ym (somando ATP-V + ATP-A) e descontando supervisores ignorados
  const m = new Map();
  V.mensal.forEach(function(r){
    if(!m.has(r.ym)) m.set(r.ym, {m:r.ym, vdo:0, luc:0, dvc:0, ni_v:0});
    const x = m.get(r.ym);
    let fat = r.fat_liq||0, luc = r.lucro||0, qtNfs = r.nfs||0;
    if(ignDelta){
      const d = ignDelta.get(r.loja+'|'+r.ym);
      if(d){
        fat   = Math.max(0, fat - d.fat_liq);
        luc   = luc - d.lucro;
        qtNfs = Math.max(0, qtNfs - d.nfs);
      }
    }
    x.vdo += fat;
    x.luc += luc;
    x.dvc += r.devol||0;
    x.ni_v += qtNfs;
  });

  // Agregar compras por ym (de C.mensal)
  if(C && C.mensal){
    C.mensal.forEach(function(r){
      if(!m.has(r.ym)) m.set(r.ym, {m:r.ym, vdo:0, luc:0, dvc:0, ni_v:0});
      const x = m.get(r.ym);
      x.com = (x.com||0) + (r.valor||0);
      x.ni  = (x.ni||0) + (r.nfs||0);
    });
  }

  // Devoluções a fornecedor (Dev) — opcional
  if(typeof Dev !== 'undefined' && Dev && Dev.mensal){
    Dev.mensal.forEach(function(r){
      if(!m.has(r.ym)) return;
      const x = m.get(r.ym);
      x.dvf = (x.dvf||0) + (r.valor||0);
    });
  }

  // Pago (de F.pagas.mensal) — schema real do financeiro_etl
  if(F && F.pagas && F.pagas.mensal){
    F.pagas.mensal.forEach(function(r){
      if(!m.has(r.ym)) return;
      const x = m.get(r.ym);
      x.pag = (x.pag||0) + (r.pago||0);
    });
  }

  // Em aberto: idealmente F traria isso por mês de emissão; usa por_dia se existir
  // somando agrupado por mês (data de vencimento).
  if(F && F.aberto && F.aberto.por_dia){
    F.aberto.por_dia.forEach(function(r){
      if(!r.data) return;
      const ym = r.data.substring(0, 7);
      if(!m.has(ym)) return;
      const x = m.get(ym);
      x.abr = (x.abr||0) + (r.valor||0);
    });
  }

  // Calcular margem
  const out = Array.from(m.values()).map(function(x){
    x.com = x.com || 0;
    x.dvf = x.dvf || 0;
    x.pag = x.pag || 0;
    x.abr = x.abr || 0;
    x.ni  = x.ni  || 0;
    x.marg = x.vdo > 0 ? (x.luc/x.vdo)*100 : 0;
    return x;
  }).sort(function(a,b){return a.m<b.m?-1:1;});

  _evoCache = out;
  _evoCacheKey = key;
  return out;
}

function getEvo(pagina){
  // Se temos D legado, usa ele. Se não, monta a partir dos JSONs novos.
  // Quando `pagina` é passada, aplica filtro de supervisores ignorados
  // dessa página (subtraindo o agregado dos vendedores).
  const fonte = (D && D.evo_mensal) ? D.evo_mensal : _construirEvoFromNovo(pagina);
  return fonte.filter(function(e){return activePers.has(e.m);});
}

function getSem(){
  // Semanas ainda só vêm do D legado (dado não disponível nos JSONs novos)
  if(D && D.semanas) return D.semanas.filter(function(s){return activePers.has(s.m);});
  return [];
}

function getDepts(){
  // Departamentos: prioriza D legado; senão, monta de V.deptos
  if(D && D.departamentos){
    let d = D.departamentos;
    if(activeDept) d = d.filter(function(x){return x.n === activeDept;});
    return d;
  }
  if(V && V.deptos){
    // Agregar V.deptos por nome (todos meses, todas lojas)
    const m = new Map();
    Filtros.deptosValidos(V.deptos).forEach(function(r){
      if(!m.has(r.nome)) m.set(r.nome, {n:r.nome, cod:r.cod, vdo:0, luc:0, qt:0});
      const x = m.get(r.nome);
      x.vdo += r.fat_liq||0;
      x.luc += r.lucro||0;
      x.qt  += r.qt||0;
    });
    let arr = Array.from(m.values()).map(function(d){
      d.marg = d.vdo>0 ? d.luc/d.vdo*100 : 0;
      return d;
    }).sort(function(a,b){return b.vdo - a.vdo;});
    if(activeDept) arr = arr.filter(function(x){return x.n === activeDept;});
    return arr;
  }
  return [];
}

function sumE(f){return getEvo().reduce(function(s,e){return s+(e[f]||0);}, 0);}

// Criar filter-bar para cada página
function buildFilterBar(pageId){
  const bar=document.createElement('div');
  bar.className='pfb';
  // Em modo modular D é null. Lista de deptos vem de V.deptos quando disponível.
  let deptosList = [];
  if(typeof D !== 'undefined' && D && D.meta && Array.isArray(D.meta.deptos)){
    deptosList = D.meta.deptos;
  } else if(typeof V !== 'undefined' && V && Array.isArray(V.deptos)){
    // Extrai nomes únicos de deptos a partir do JSON modular
    const set = new Set();
    V.deptos.forEach(function(d){ if(d && d.nome && d.nome !== 'INATIVO') set.add(d.nome); });
    deptosList = Array.from(set).sort();
  }
  bar.innerHTML=`
    <div class="pfb-inner">
      <div class="pfb-label">Período</div>
      <div class="pfb-periods">
        <button class="pfb-per on" data-per="2026-01" data-pg="${pageId}">Jan/26</button>
        <button class="pfb-per on" data-per="2026-02" data-pg="${pageId}">Fev/26</button>
        <button class="pfb-per on" data-per="2026-03" data-pg="${pageId}">Mar/26</button>
        <button class="pfb-per on" data-per="2026-04" data-pg="${pageId}">Abr/26*</button>
      </div>
      <div class="pfb-sep"></div>
      <div class="pfb-label">Departamento</div>
      <select class="pfb-dept">
        <option value="">Todos</option>
        ${deptosList.map(d=>`<option value="${d}">${d}</option>`).join('')}
      </select>
      <button class="pfb-apply">Aplicar</button>
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-muted);margin-top:4px;padding:0 2px;">* Parcial até 20/04</div>
  `;

  // Sync estado global → botões
  syncFilterBar(bar);

  bar.querySelectorAll('.pfb-per').forEach(btn=>{
    btn.addEventListener('click',()=>{
      btn.classList.toggle('on');
      const per=btn.dataset.per;
      btn.classList.contains('on')?activePers.add(per):activePers.delete(per);
      // Sync todas as outras filterbars
      document.querySelectorAll('.pfb-per[data-per="'+per+'"]').forEach(b=>{
        b.className=btn.className;
      });
    });
  });

  bar.querySelector('.pfb-apply').addEventListener('click',()=>{
    activeDept=bar.querySelector('.pfb-dept').value;
    // Sync todos os selects
    document.querySelectorAll('.pfb-dept').forEach(s=>s.value=activeDept);
    updateFilterSummary();
    renderedPages.forEach(pg=>renderPage(pg));
  });

  return bar;
}

function syncFilterBar(bar){
  bar.querySelectorAll('.pfb-per').forEach(btn=>{
    btn.className='pfb-per'+(activePers.has(btn.dataset.per)?' on':'');
  });
  const sel=bar.querySelector('.pfb-dept');
  if(sel)sel.value=activeDept;
}

function updateFilterSummary(){
  const ps=[...activePers].sort().map(p=>PLBL[PERS.indexOf(p)]||p).join(', ');
  const el=document.getElementById('fil-sum');
  if(el)el.textContent=ps+(activeDept?' · '+activeDept:'');
}
updateFilterSummary();

// ================================================================
// NAVEGAÇÃO
// ================================================================
let renderedPages=new Set();

document.querySelectorAll('.sb-link[data-p]').forEach(a=>{
  a.addEventListener('click',()=>{
    const pg=a.dataset.p;
    // Verificar permissão antes de navegar
    const perfilUsr = _getPerfilUsuario();
    if(perfilUsr && perfilUsr.paginasPermitidas && !perfilUsr.paginasPermitidas.includes(pg)){
      _toast('Você não tem permissão para acessar esta página.', 'aviso');
      return;
    }
    document.querySelectorAll('.sb-link').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
    if(typeof _expandirGrupoDaPaginaAtiva==='function') _expandirGrupoDaPaginaAtiva();
    navHistory = []; // reset ao usar o menu
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById('page-'+pg).classList.add('active');
    if(!renderedPages.has(pg)){renderPage(pg);renderedPages.add(pg);}
    document.getElementById('sidebar').classList.remove('open');
    // Persistir pra restaurar após troca de filial
    try { localStorage.setItem('_paginaAtual', pg); } catch(e){}
    _auditLog('page_view', {pagina: pg});
  });
});

document.getElementById('mobBtn').addEventListener('click',()=>{
  document.getElementById('sidebar').classList.toggle('open');
});
document.getElementById('mainContent').addEventListener('click',e=>{
  if(!e.target.closest('#sidebar'))
    document.getElementById('sidebar').classList.remove('open');
});

// =====================================================================
// PROCESSAMENTO — upload, parsing e gravação de relatórios Winthor
// =====================================================================
// Catálogo dos 7 relatórios que alimentam o sistema. Cada card contém:
//  - rotina: número Winthor
//  - nome: label
//  - finalidade: texto curto para o subtitulo
//  - formato: xlsx, xls ou ambos
//  - escopo: 'base' (serve para ATP ou Comercial Pinto inteira) ou 'filial'
//  - instrucoes: passos literais que o usuário escreveu
//  - periodo_obrigatorio: se o formulário deve pedir período
const PROC_RELATORIOS = [
  {
    rotina: '203', nome: 'Cadastro de Itens', escopo: 'base', formato: 'xlsx',
    finalidade: 'Cadastro completo dos produtos · base para EAN, departamento, seção e categoria',
    periodo_obrigatorio: false,
    instrucoes: [
      'Acessar a rotina 203 no WinThor',
      'Selecionar TODOS os itens',
      'Exportar em formato XLSX',
      'A data do envio é considerada a data da exportação',
      'Informar no formulário qual a base: ATP ou COMERCIAL PINTO',
      'Chave = código do item (pode se repetir entre bases com produtos diferentes)',
      'Itens com EAN "0" ou vazio são aceitos e tratados internamente'
    ],
    colunas_esperadas: ['Código','Descrição','Fornecedor','Nome do fornecedor','Departamento','Descrição do departamento','Seção','Descrição da seção','Categoria','Nome da categoria','EAN Unid. Tributável','Dt.Cadastro']
  },
  {
    rotina: '218', nome: 'Entrada de Itens', escopo: 'base', formato: 'xlsx',
    finalidade: 'Todas as entradas de NF do período · lista analítica por nota fiscal',
    periodo_obrigatorio: true,
    instrucoes: [
      'Acessar a rotina 218 no WinThor',
      'Selecionar TODAS as filiais',
      'Selecionar TODOS os tipos de entradas',
      'Informar o período de entradas',
      'Deixar EM BRANCO o campo "Período de emissão de NF"',
      'Manter os demais campos em branco',
      'Na aba Opções, selecionar "Analítico - por nota fiscal"',
      'Imprimir o relatório padrão (exportar em XLSX)',
      'Observação: o relatório lista cada entrada; o mesmo item pode entrar várias vezes'
    ],
    colunas_esperadas: ['Dt. Entrada','NF','Código','Descrição','Quantidade','Cód. Oper.']
  },
  {
    rotina: '1328', nome: 'Devolução a Fornecedor', escopo: 'base', formato: 'xlsx',
    finalidade: 'Produtos que entraram e foram devolvidos ao fornecedor no período',
    periodo_obrigatorio: true,
    instrucoes: [
      'Acessar a rotina 1328 no WinThor',
      'Informar TODAS as filiais',
      'Informar o período',
      'Tipo Devolução: Todos',
      'Tipo de relatório: Analítico',
      'Forma de pagamento: Todos',
      'Manter os demais campos em branco',
      'Exportar em XLSX'
    ],
    colunas_esperadas: ['Cod.Prod.','Descrição','Quantidade','Valor']
  },
  {
    rotina: '717', nome: 'Contas a Pagar (em aberto)', escopo: 'base', formato: 'xlsx',
    finalidade: 'Lançamentos financeiros em aberto · quando quitados saem daqui e vão para 718',
    periodo_obrigatorio: true,
    instrucoes: [
      'Acessar a rotina 717 no WinThor',
      'Selecionar TODAS as filiais',
      'Conta: 10001',
      'Informar o período de lançamento',
      'Manter os demais campos vazios',
      'Tipo de parceiro: Todos',
      'Emitir o relatório Analítico Completo (XLSX)',
      'Observação: esse relatório substitui o anterior sempre que enviado (mantém sempre a fotografia atual)'
    ],
    substitui: true,
    colunas_esperadas: ['Lanc.','Dt.Emis.NF','Cod.Forn.','Num.Nota','Vl.Duplicata']
  },
  {
    rotina: '718', nome: 'Contas Pagas', escopo: 'base', formato: 'xlsx',
    finalidade: 'Lançamentos já quitados no período · fonte do % pago, juros pagos e forma de pagamento',
    periodo_obrigatorio: true,
    instrucoes: [
      'Acessar a rotina 718 no WinThor',
      'Selecionar TODAS as filiais',
      'Informar o período no campo "Período de pagamento"',
      'Conta: 10001',
      'Manter os demais campos em branco',
      'Parceiro: T - Todos',
      'Clicar em Pesquisar',
      'Selecionar o relatório Analítico',
      'Emitir o relatório padrão (XLSX)'
    ],
    colunas_esperadas: ['Lanc.','Grupo','Cod.Forn.','Num.Nota','Vl.Dev.','Juros']
  },
  {
    rotina: '111', nome: 'Faturamento por Produto', escopo: 'base', formato: 'xls',
    finalidade: 'Vendas mensais por item · deduzindo devoluções · fonte do histórico de faturamento',
    periodo_obrigatorio: true,
    instrucoes: [
      'Acessar a rotina 111 no WinThor',
      'Informar o período de vendas',
      'Selecionar "Deduzir Devol."',
      'Selecionar a aba lateral "Produto"',
      'Exportar em XLS',
      'Envia um arquivo por mês para acompanhar a evolução'
    ],
    colunas_esperadas: ['Código','Descrição','Qt.Vendida','Vl.Total']
  },
  {
    rotina: '105', nome: 'Posição do Estoque', escopo: 'filial', formato: 'xlsx',
    finalidade: 'Retrato do estoque com quantidade, custo unitário e preço de venda',
    periodo_obrigatorio: false,
    substitui: true,
    instrucoes: [
      'Acessar a rotina 105 no WinThor',
      'Escolher a filial desejada',
      'Colocar a região de preço (em ATP: Filial 1 · Região 1)',
      'Deixar os demais campos em branco',
      'Na aba Outros Filtros, selecionar: Estoque: Atual; Obs: Ativos; Considerar: Disponível; Produtos: Com estoque > 0',
      'Exportar em XLSX',
      'Observação: substitui o estoque anterior (sempre a foto atual)'
    ],
    colunas_esperadas: ['Codigo','Descrição','Embalagem','Qt.Est.','C. Real','P. Venda']
  }
];

// Parser genérico de XLSX via SheetJS. Retorna array de linhas (cada linha = array de células).
async function _procLerXlsx(file){
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, {type:'array', cellDates:true});
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, {header:1, defval:null, raw:true});
  return {sheetName, rows, nRows: rows.length, nCols: Math.max(...rows.map(r=>r.length||0),0)};
}

// Valida se o arquivo parece ser da rotina esperada — procura colunas-chave no cabeçalho
function _procValidarLayout(rows, relatorio){
  const chaves = (relatorio.colunas_esperadas||[]).map(c=>c.toLowerCase().trim());
  if(chaves.length===0) return {ok:true, achadas:[]};
  // Procura nas primeiras 50 linhas uma que contenha várias das chaves (headers podem estar em linhas variadas)
  let melhor = {score:0, linha:-1, achadas:[]};
  const scanLim = Math.min(50, rows.length);
  for(let i=0;i<scanLim;i++){
    const r = rows[i]||[];
    const vals = r.map(v=>String(v==null?'':v).toLowerCase().trim());
    const achadas = chaves.filter(k => vals.some(v => v.indexOf(k)>=0));
    if(achadas.length>melhor.score){melhor={score:achadas.length, linha:i, achadas};}
  }
  const pctAchadas = melhor.score/chaves.length;
  return {ok: pctAchadas>=0.5, pct:pctAchadas, linha:melhor.linha, achadas:melhor.achadas, esperadas:chaves.length};
}

// Calcula hash SHA-256 curto do arquivo para deduplicação
async function _procHash(file){
  const buf = await file.arrayBuffer();
  const h = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(h)).slice(0,8).map(b=>b.toString(16).padStart(2,'0')).join('');
}

// Faz upload do arquivo para o Firebase Storage e grava metadados no Firestore
async function _procGravarUpload(file, relatorio, base, filial, periodoIni, periodoFim, observacoes, hash, detected){
  const user = firebase.auth().currentUser;
  if(!user) throw new Error('Não autenticado');
  const storage = firebase.storage();
  const db = firebase.firestore();
  const ts = Date.now();
  const nomeSafe = file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
  const path = `uploads/${base}/${relatorio.rotina}/${ts}_${nomeSafe}`;
  const ref = storage.ref().child(path);
  const snap = await ref.put(file, {contentType: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const url = await snap.ref.getDownloadURL();
  const docRef = await db.collection('uploads').add({
    rotina: relatorio.rotina,
    rotina_nome: relatorio.nome,
    base: base,
    filial: filial || null,
    periodo_ini: periodoIni || null,
    periodo_fim: periodoFim || null,
    observacoes: observacoes || '',
    arquivo_nome: file.name,
    arquivo_tamanho: file.size,
    arquivo_hash: hash,
    storage_path: path,
    storage_url: url,
    detectadas: detected || null,
    substitui: !!relatorio.substitui,
    uploaded_at: firebase.firestore.FieldValue.serverTimestamp(),
    uploaded_by: user.uid,
    uploaded_by_email: user.email || null
  });
  try{ _auditLog('upload_relatorio', {rotina: relatorio.rotina, base, id: docRef.id, tamanho: file.size}); }catch(e){}
  return {id: docRef.id, path, url};
}

// Busca os últimos uploads de um determinado relatório/base para mostrar histórico no card.
// Query simplificada (sem orderBy composto) para não exigir criação manual de índice.
// A ordenação é feita no cliente, já que são no máximo 5-20 registros.
async function _procListarUltimos(rotina, base, limite){
  try{
    const db = firebase.firestore();
    const snap = await db.collection('uploads')
      .where('rotina','==',rotina)
      .where('base','==',base)
      .get();
    const docs = snap.docs.map(d=>({id:d.id, ...d.data()}));
    // Ordenar por uploaded_at desc (pode ser serverTimestamp pendente em uploads recentes)
    docs.sort((a,b)=>{
      const ta = a.uploaded_at && a.uploaded_at.toMillis ? a.uploaded_at.toMillis() : 0;
      const tb = b.uploaded_at && b.uploaded_at.toMillis ? b.uploaded_at.toMillis() : 0;
      return tb - ta;
    });
    return docs.slice(0, limite||5);
  }catch(e){
    console.warn('[proc] Falha listar uploads', rotina, base, e);
    return [];
  }
}

// ID do card (ex: 'proc-card-218') usado para seletores DOM
function _procCardId(rot){ return 'proc-card-'+rot; }

// Template HTML de um card de relatório
function _procCardHtml(rel){
  const id = _procCardId(rel.rotina);
  const escopoLabel = rel.escopo==='base' ? 'Escopo: Base' : 'Escopo: Filial';
  const fmt = rel.formato==='xls' ? '.xls' : '.xlsx';
  const instrucoesHtml = rel.instrucoes.map((p,i)=>`<li><span class="proc-step-n">${i+1}</span><span class="proc-step-t">${esc(p)}</span></li>`).join('');
  const subLabel = rel.substitui ? '<span class="proc-badge-sub" title="Substitui o último upload deste relatório">substitui</span>' : '<span class="proc-badge-acc" title="Acumula com uploads anteriores">acumula</span>';
  return `
    <div class="proc-card" id="${id}" data-rotina="${rel.rotina}">
      <div class="proc-card-head">
        <div class="proc-card-title">
          <span class="proc-rotina-badge">${rel.rotina}</span>
          <div class="proc-card-names">
            <div class="proc-card-n">${esc(rel.nome)}</div>
            <div class="proc-card-s">${esc(rel.finalidade)}</div>
          </div>
        </div>
        <div class="proc-card-meta">
          <span class="proc-meta-pill">${escopoLabel}</span>
          <span class="proc-meta-pill">${fmt.toUpperCase()}</span>
          ${subLabel}
        </div>
      </div>
      <div class="proc-card-body">
        <div class="proc-inst">
          <div class="proc-inst-title">Instruções de exportação</div>
          <ol class="proc-steps">${instrucoesHtml}</ol>
        </div>
        <div class="proc-form">
          <div class="proc-form-row">
            <label class="proc-lbl">Base</label>
            <select class="proc-inp" id="${id}-base">
              <option value="ATP">ATP</option>
              <option value="COMERCIAL_PINTO">COMERCIAL PINTO</option>
            </select>
          </div>
          ${rel.escopo==='filial' ? `
          <div class="proc-form-row">
            <label class="proc-lbl">Filial</label>
            <input type="text" class="proc-inp" id="${id}-filial" placeholder="Ex: Filial 1 (obrigatório)">
          </div>` : ''}
          ${rel.periodo_obrigatorio ? `
          <div class="proc-form-row-2">
            <div><label class="proc-lbl">Período início</label><input type="date" class="proc-inp" id="${id}-per-ini"></div>
            <div><label class="proc-lbl">Período fim</label><input type="date" class="proc-inp" id="${id}-per-fim"></div>
          </div>` : ''}
          <div class="proc-form-row">
            <label class="proc-lbl">Observações (opcional)</label>
            <textarea class="proc-inp" id="${id}-obs" rows="2" placeholder="Ex: Envio mensal de abril/2026"></textarea>
          </div>
          <div class="proc-drop" id="${id}-drop">
            <input type="file" class="proc-file" id="${id}-file" accept="${fmt}">
            <label for="${id}-file" class="proc-drop-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span class="proc-drop-t">Clique para selecionar o arquivo ${fmt}</span>
              <span class="proc-drop-s">ou arraste aqui</span>
            </label>
          </div>
          <div class="proc-file-info" id="${id}-info" style="display:none"></div>
          <div class="proc-actions">
            <button class="btn-ac proc-btn-proc" id="${id}-btn" disabled>Processar e enviar</button>
          </div>
          <div class="proc-status" id="${id}-status"></div>
        </div>
      </div>
      <div class="proc-card-hist">
        <div class="proc-hist-title">Últimos envios</div>
        <div class="proc-hist-list" id="${id}-hist"><div class="proc-hist-empty">Carregando...</div></div>
      </div>
    </div>`;
}

// Monta tudo e liga os handlers da página Processamento
async function renderProc(){
  const container = document.getElementById('page-proc');
  if(!container) return;

  // Admin e gestor podem acessar; visualizador não
  const perfil = _getPerfilUsuario();
  const perfilTipo = perfil && (perfil.perfil || perfil.id || perfil.nome);
  const podeProc = perfil && (
    perfil.podeGerenciarUsuarios === true ||
    perfil.pode_gerenciar_usuarios === true ||
    perfilTipo === 'admin' ||
    perfilTipo === 'gestor' ||
    (Array.isArray(perfil.paginasPermitidas) && perfil.paginasPermitidas.indexOf('proc') >= 0) ||
    (Array.isArray(perfil.paginas) && perfil.paginas.indexOf('proc') >= 0)
  );
  if(!podeProc){
    container.innerHTML = `
      <div class="ph"><div class="pk">Processamento</div><h2>Upload de <em>relatórios Winthor</em></h2></div>
      <div class="ph-sep"></div>
      <div class="page-body">
        <div class="empty-state"><p>Esta página está disponível apenas para administradores e gestores.</p></div>
      </div>`;
    return;
  }

  const cardsHtml = PROC_RELATORIOS.map(_procCardHtml).join('');
  container.innerHTML = `
    <div class="ph">
      <div class="pk">Processamento</div>
      <h2>Upload de <em>relatórios Winthor</em></h2>
    </div>
    <div class="ph-sep"></div>
    <div class="page-body">
      <div class="proc-intro">
        Cada card abaixo corresponde a uma rotina do WinThor. Siga as instruções para exportar o arquivo e anexe-o no campo indicado. O arquivo é validado antes do envio e gravado com todos os metadados para rastreabilidade.
        <div class="proc-intro-note"><strong>Importante:</strong> Firebase Storage armazena os arquivos XLSX; Firestore guarda os metadados. Relatórios marcados como <em>substitui</em> apagam a versão anterior ao receber uma nova; os <em>acumula</em> mantêm histórico.</div>
      </div>
      <div class="proc-grid">${cardsHtml}</div>
    </div>`;

  // Configurar cada card
  PROC_RELATORIOS.forEach(rel => _procWireCard(rel));
}


// Conecta os eventos de um card (file input, drop zone, botão processar)
function _procWireCard(rel){
  const id = _procCardId(rel.rotina);
  const fileInput = document.getElementById(id+'-file');
  const drop = document.getElementById(id+'-drop');
  const info = document.getElementById(id+'-info');
  const btn = document.getElementById(id+'-btn');
  const status = document.getElementById(id+'-status');
  const histDiv = document.getElementById(id+'-hist');
  let arquivoSelecionado = null;
  let layoutValidado = null;

  function limparInfo(){
    info.style.display='none';
    info.innerHTML='';
    btn.disabled = true;
    arquivoSelecionado = null;
    layoutValidado = null;
    status.innerHTML = '';
  }

  async function onFileChosen(file){
    if(!file) return;
    const fmtOk = rel.formato==='xls' ? /\.xls$/i.test(file.name) : /\.xlsx$/i.test(file.name);
    if(!fmtOk){
      info.style.display='block';
      info.innerHTML = `<div class="proc-info-err">Formato inválido. Esperado: .${rel.formato}</div>`;
      btn.disabled = true; return;
    }
    arquivoSelecionado = file;
    info.style.display='block';
    info.innerHTML = `<div class="proc-info-ok"><strong>${esc(file.name)}</strong> (${(file.size/1024/1024).toFixed(2)} MB) · analisando layout...</div>`;
    try{
      const parsed = await _procLerXlsx(file);
      const v = _procValidarLayout(parsed.rows, rel);
      layoutValidado = {parsed, validacao: v};
      const linhas = parsed.nRows;
      let html = `<div class="proc-info-ok"><strong>${esc(file.name)}</strong> (${(file.size/1024/1024).toFixed(2)} MB)</div>`;
      html += `<div class="proc-info-detail">Aba: <code>${esc(parsed.sheetName)}</code> · ${linhas.toLocaleString('pt-BR')} linhas · ${parsed.nCols} colunas</div>`;
      if(v.ok){
        html += `<div class="proc-info-detail proc-ok">Layout reconhecido (${v.achadas.length}/${v.esperadas} colunas-chave encontradas na linha ${v.linha+1})</div>`;
        btn.disabled = false;
      } else {
        html += `<div class="proc-info-detail proc-warn">Layout não reconhecido com segurança (${v.achadas.length}/${v.esperadas}). O envio continua permitido, mas confira se o relatório é o correto.</div>`;
        btn.disabled = false;
      }
      info.innerHTML = html;
    }catch(e){
      info.innerHTML = `<div class="proc-info-err">Erro lendo o arquivo: ${esc(e.message||String(e))}</div>`;
      btn.disabled = true;
    }
  }

  fileInput.addEventListener('change', e => onFileChosen(e.target.files[0]));

  ['dragenter','dragover'].forEach(ev => drop.addEventListener(ev, e=>{e.preventDefault();drop.classList.add('proc-drop-over');}));
  ['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e=>{e.preventDefault();drop.classList.remove('proc-drop-over');}));
  drop.addEventListener('drop', e=>{
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if(f){fileInput.files = e.dataTransfer.files; onFileChosen(f);}
  });

  btn.addEventListener('click', async ()=>{
    if(!arquivoSelecionado){return;}
    const base = document.getElementById(id+'-base').value;
    const filial = rel.escopo==='filial' ? (document.getElementById(id+'-filial').value||'').trim() : null;
    const perIni = rel.periodo_obrigatorio ? document.getElementById(id+'-per-ini').value : null;
    const perFim = rel.periodo_obrigatorio ? document.getElementById(id+'-per-fim').value : null;
    const obs = (document.getElementById(id+'-obs').value||'').trim();

    if(rel.escopo==='filial' && !filial){
      status.innerHTML = `<div class="proc-info-err">Informe a filial antes de enviar.</div>`; return;
    }
    if(rel.periodo_obrigatorio && (!perIni || !perFim)){
      status.innerHTML = `<div class="proc-info-err">Informe o período (início e fim) antes de enviar.</div>`; return;
    }
    if(rel.periodo_obrigatorio && perIni && perFim && perIni > perFim){
      status.innerHTML = `<div class="proc-info-err">Período inválido: data de início é posterior à data fim.</div>`; return;
    }

    btn.disabled = true;
    status.innerHTML = `<div class="proc-info-detail">Calculando checksum...</div>`;
    try{
      const hash = await _procHash(arquivoSelecionado);
      status.innerHTML = `<div class="proc-info-detail">Enviando para Firebase Storage...</div>`;
      const detected = layoutValidado && layoutValidado.parsed ? {n_linhas: layoutValidado.parsed.nRows, n_colunas: layoutValidado.parsed.nCols, sheet: layoutValidado.parsed.sheetName, layout_ok: layoutValidado.validacao.ok, chaves_achadas: layoutValidado.validacao.achadas.length, chaves_esperadas: layoutValidado.validacao.esperadas} : null;
      const res = await _procGravarUpload(arquivoSelecionado, rel, base, filial, perIni, perFim, obs, hash, detected);
      status.innerHTML = `<div class="proc-info-ok">Envio concluído. ID: <code>${esc(res.id)}</code></div>`;
      limparInfo();
      fileInput.value = '';
      // Recarregar histórico do card
      _procRenderHist(id, rel, base);
    }catch(e){
      console.error('[proc] erro no envio', e);
      status.innerHTML = `<div class="proc-info-err">Falha no envio: ${esc(e.message||String(e))}</div>`;
      btn.disabled = false;
    }
  });

  // Ao mudar a base, recarregar o histórico
  const baseSel = document.getElementById(id+'-base');
  baseSel.addEventListener('change', ()=>_procRenderHist(id, rel, baseSel.value));

  // Carregar histórico inicial
  _procRenderHist(id, rel, baseSel.value);
}

async function _procRenderHist(id, rel, base){
  const histDiv = document.getElementById(id+'-hist');
  if(!histDiv) return;
  histDiv.innerHTML = '<div class="proc-hist-empty">Carregando...</div>';
  const list = await _procListarUltimos(rel.rotina, base, 5);
  if(!list || list.length===0){
    histDiv.innerHTML = '<div class="proc-hist-empty">Nenhum envio registrado ainda para essa base.</div>';
    return;
  }
  histDiv.innerHTML = list.map(u=>{
    const dt = u.uploaded_at && u.uploaded_at.toDate ? u.uploaded_at.toDate() : null;
    const dtTxt = dt ? dt.toLocaleDateString('pt-BR')+' '+dt.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}) : '—';
    const per = (u.periodo_ini && u.periodo_fim) ? (u.periodo_ini.split('-').reverse().join('/')+' a '+u.periodo_fim.split('-').reverse().join('/')) : '';
    const tamanho = u.arquivo_tamanho ? (u.arquivo_tamanho/1024/1024).toFixed(2)+' MB' : '';
    const quem = u.uploaded_by_email || '';
    const detParts = [];
    if(per) detParts.push(per);
    if(tamanho) detParts.push(tamanho);
    if(u.filial) detParts.push('Filial: '+u.filial);
    return `<div class="proc-hist-item">
      <div class="proc-hist-l"><strong>${esc(dtTxt)}</strong>${quem?' · '+esc(quem):''}</div>
      <div class="proc-hist-r">${esc(detParts.join(' · '))}</div>
    </div>`;
  }).join('');
}



// ================================================================
// TabelaPlus · sort + filtro automático em qualquer <table class="t">
// ================================================================
// Click no <th> ordena ASC/DESC. Detecta tipo (número/R$/%/texto) auto.
// Filtro: input acima de tabelas com 6+ linhas; busca em todas colunas.

const TabelaPlus = {
  _instalada: new WeakSet(),

  _parseValor: function(s){
    if(s == null) return 0;
    const t = String(s).trim();
    if(!t || t === '—' || t === '-') return -Infinity;
    let n = t.replace(/R\$\s*/g,'').replace(/%/g,'').replace(/\s/g,'');
    if(/^-?\d{1,3}(\.\d{3})*(,\d+)?$/.test(n) || /,\d+$/.test(n)){
      n = n.replace(/\./g,'').replace(',', '.');
    }
    const num = parseFloat(n);
    return isNaN(num) ? -Infinity : num;
  },

  _ehNumerico: function(s){
    if(!s) return false;
    const t = String(s).trim().replace(/[R$%\s]/g,'');
    return /^-?[\d.,]+$/.test(t);
  },

  aplicar: function(table){
    if(!table || TabelaPlus._instalada.has(table)) return;
    TabelaPlus._instalada.add(table);
    const tbody = table.querySelector('tbody');
    if(!tbody) return;
    const headerRow = table.querySelector('thead tr');
    if(!headerRow) return;
    const headers = Array.from(headerRow.children);
    if(!headers.length) return;

    // Filtro
    const linhas = tbody.querySelectorAll('tr');
    if(linhas.length >= 6){
      const scrollEl = table.closest('.tscroll');
      const refEl = scrollEl || table;
      const anchorParent = refEl.parentElement;
      if(anchorParent && !anchorParent.querySelector('.tplus-filter')){
        const inp = document.createElement('input');
        inp.className = 'tplus-filter';
        inp.type = 'text';
        inp.placeholder = '🔍 Filtrar (busca em todas as colunas)…';
        inp.style.cssText = 'width:100%;max-width:340px;padding:6px 10px;border:1px solid var(--border);border-radius:5px;font-size:12px;background:var(--surface);color:var(--text);margin-bottom:8px;font-family:inherit;display:block;';
        inp.addEventListener('input', function(){
          const termo = inp.value.toLowerCase().trim();
          tbody.querySelectorAll('tr').forEach(function(tr){
            if(!termo){ tr.style.display = ''; return; }
            tr.style.display = tr.textContent.toLowerCase().indexOf(termo) >= 0 ? '' : 'none';
          });
        });
        anchorParent.insertBefore(inp, refEl);
      }
    }

    // Sort
    headers.forEach(function(th, idx){
      const txtTh = (th.textContent || '').trim();
      if(txtTh === '#') return;
      th.style.cursor = 'pointer';
      th.style.userSelect = 'none';
      if(!th.querySelector('.tplus-sort-arrow')){
        const span = document.createElement('span');
        span.className = 'tplus-sort-arrow';
        span.style.cssText = 'opacity:.3;margin-left:4px;font-size:9px;';
        span.textContent = '⇅';
        th.appendChild(span);
      }
      let asc = true;
      th.addEventListener('click', function(){
        const linhas2 = Array.from(tbody.querySelectorAll('tr'));
        if(!linhas2.length) return;
        let ehNum = false;
        for(let i = 0; i < Math.min(5, linhas2.length); i++){
          const cel = linhas2[i].children[idx];
          if(cel && cel.textContent.trim()){
            ehNum = TabelaPlus._ehNumerico(cel.textContent);
            break;
          }
        }
        linhas2.sort(function(a, b){
          const ca = (a.children[idx] && a.children[idx].textContent) || '';
          const cb = (b.children[idx] && b.children[idx].textContent) || '';
          if(ehNum){
            return asc ? (TabelaPlus._parseValor(ca) - TabelaPlus._parseValor(cb))
                       : (TabelaPlus._parseValor(cb) - TabelaPlus._parseValor(ca));
          }
          return asc ? ca.localeCompare(cb, 'pt-BR') : cb.localeCompare(ca, 'pt-BR');
        });
        linhas2.forEach(function(tr){ tbody.appendChild(tr); });
        headers.forEach(function(h){
          const a = h.querySelector('.tplus-sort-arrow');
          if(a){ a.textContent = '⇅'; a.style.opacity = '.3'; }
        });
        const arr = th.querySelector('.tplus-sort-arrow');
        if(arr){ arr.textContent = asc ? '▲' : '▼'; arr.style.opacity = '1'; }
        asc = !asc;
      });
    });
  },

  aplicarTodas: function(){
    const ativa = document.querySelector('.page.active');
    if(!ativa) return;
    ativa.querySelectorAll('table.t').forEach(function(t){
      TabelaPlus.aplicar(t);
    });
  }
};
window.TabelaPlus = TabelaPlus;

// Reaplica TabelaPlus a cada troca de página
(function(){
  const reaplicar = function(){
    setTimeout(function(){ TabelaPlus.aplicarTodas(); }, 150);
  };
  document.addEventListener('click', function(e){
    if(e.target && e.target.closest && e.target.closest('.sb-link[data-p]')){
      reaplicar();
    }
  });
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', reaplicar);
  } else {
    setTimeout(reaplicar, 500);
  }
})();

// ================================================================
// Badge de alertas no menu lateral · contagem dinâmica
// ================================================================
function _atualizarBadgeAlertas(total){
  const el = document.getElementById('sb-cnt-alertas');
  if(!el) return;
  if(total && total > 0){
    // Formato compacto: 9 → "9", 3878 → "3,9k"
    let txt;
    if(total >= 1000) txt = (total/1000).toFixed(1).replace(/\.0$/,'') + 'k';
    else txt = String(total);
    el.textContent = txt;
    el.style.display = '';
    el.title = total + ' alertas detectados';
  } else {
    el.textContent = '';
    el.style.display = 'none';
  }
}
window._atualizarBadgeAlertas = _atualizarBadgeAlertas;

// Pré-calcula contagem de alertas quando E carrega (sem precisar entrar na página)
async function _preCalcularBadgeAlertas(){
  if(typeof E === 'undefined' || !E) return;
  if(typeof _alertasCalcular !== 'function') return;
  try {
    const c = _alertasCalcular();
    if(!c) return;
    const tot = Object.keys(c.buckets).reduce(function(s,k){return s+c.buckets[k].length;},0);
    _atualizarBadgeAlertas(tot);
  } catch(e){
    // Silencioso — alertas calcula on-demand quando user entrar na página
  }
}
window._preCalcularBadgeAlertas = _preCalcularBadgeAlertas;

// ================================================================
// Indicador de freshness no header · "Retrato: 29/04/2026"
// ================================================================
function _atualizarSnapshotHeader(){
  const el = document.getElementById('snapshot-info');
  if(!el) return;
  // Tenta achar a data mais recente entre os JSONs carregados
  let dataRef = null;
  try {
    if(typeof E !== 'undefined' && E && E.meta && E.meta.data_referencia) dataRef = E.meta.data_referencia;
    else if(typeof E !== 'undefined' && E && E.resumo && E.resumo.data_ref) dataRef = E.resumo.data_ref;
    else if(typeof F !== 'undefined' && F && F.meta && F.meta.data_referencia) dataRef = F.meta.data_referencia;
    else if(typeof V !== 'undefined' && V && V.meta && V.meta.data_referencia) dataRef = V.meta.data_referencia;
    else if(typeof V !== 'undefined' && V && V.meta && V.meta.geradoEm) dataRef = String(V.meta.geradoEm).substring(0,10);
  } catch(e){ return; }
  if(!dataRef) return;
  // Formata YYYY-MM-DD → DD/MM/YYYY
  let txt = dataRef;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dataRef);
  if(m) txt = m[3]+'/'+m[2]+'/'+m[1];
  el.textContent = '📅 ' + txt;
  el.style.display = '';
}
window._atualizarSnapshotHeader = _atualizarSnapshotHeader;

// ================================================================
// Alterar senha · UI simples no menu do usuário
// ================================================================
async function _alterarSenhaUI(){
  const drp = document.getElementById('userDrop');
  if(drp) drp.style.display = 'none';
  if(AUTH_MODE !== 'firebase' || !window.fbAuth || !window.fbAuth.currentUser){
    alert('Alteração de senha disponível apenas no modo de autenticação Firebase.');
    return;
  }
  const u = window.fbAuth.currentUser;
  const novaSenha = prompt('Digite a nova senha (mínimo 6 caracteres):');
  if(!novaSenha) return;
  if(novaSenha.length < 6){
    alert('A senha precisa ter pelo menos 6 caracteres.');
    return;
  }
  const conf = prompt('Confirme a nova senha:');
  if(novaSenha !== conf){
    alert('As senhas não coincidem.');
    return;
  }
  try {
    await u.updatePassword(novaSenha);
    // Marca senha_temp como false no Firestore
    if(window.fbDb){
      try {
        await window.fbDb.collection('usuarios').doc(u.uid).update({
          senha_temp: false,
          ultimo_acesso: new Date().toISOString()
        });
      } catch(e){ /* não bloqueia se falhar */ }
    }
    alert('Senha alterada com sucesso.');
  } catch(e){
    if(e && e.code === 'auth/requires-recent-login'){
      alert('Por segurança, faça logout e login novamente antes de alterar a senha.');
    } else {
      alert('Erro ao alterar senha: '+(e.message||e.code||'desconhecido'));
    }
  }
}
window._alterarSenhaUI = _alterarSenhaUI;

// ────────────────────────────────────────────────────────────────────
// DRILL-THROUGH GLOBAL · v4.29
// Qualquer elemento com data-prod-cod ou data-forn-cod abre o diagnóstico.
// Se cursor não estiver "pointer", também aplica.
// ────────────────────────────────────────────────────────────────────
document.addEventListener('click', function(e){
  // Encontra ancestor com data-prod-cod ou data-forn-cod
  const el = e.target.closest('[data-prod-cod], [data-forn-cod]');
  if(!el) return;
  // Não interferir com elementos interativos genuínos
  if(e.target.matches('input, button, select, textarea, a[href]')) return;
  // Não rouba clique se for um link/botão dentro
  if(e.target.closest('a[href], button')) return;
  // Não disparar se algum ancestor já tem handler onclick (fallback antigo)
  let n = el;
  while(n && n !== document.body){
    if(n.hasAttribute && n.hasAttribute('onclick')) return;
    n = n.parentElement;
  }
  e.preventDefault();
  e.stopPropagation();
  if(el.dataset.prodCod){
    const cod = parseInt(el.dataset.prodCod, 10);
    if(typeof window._openProdNovo === 'function'){
      window._openProdNovo(cod);
    }
  } else if(el.dataset.fornCod){
    const cod = parseInt(el.dataset.fornCod, 10);
    if(typeof window._openFornNovo === 'function'){
      window._openFornNovo(cod);
    }
  }
});

// CSS visual: elementos com data-prod-cod/data-forn-cod ganham hover sutil
(function(){
  const css = '[data-prod-cod], [data-forn-cod] { cursor: pointer; transition: background .12s; }'
            + '[data-prod-cod]:hover, [data-forn-cod]:hover { background: rgba(245,134,52,.08) !important; }';
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
})();


// ════════════════════════════════════════════════════════════════════════
// SISTEMA DE PINS · v4.31
// Permite que o usuário "fixe" elementos em sua home pessoal, com ordem
// customizável. Os pins são salvos no Firestore por usuário.
//
// Cada pin tem:
//   id        → identificador único do elemento (ex: 'kpi-fat-liq')
//   titulo    → texto exibido no card
//   pagina    → página de origem (pra link "Ver completo")
//   ordem     → ordem na home
//   addedAt   → timestamp
//
// Cada elemento "pinável" tem uma função renderer registrada via
// _pinRegistrar(id, titulo, pagina, fn) onde fn(container) preenche o card.
// ════════════════════════════════════════════════════════════════════════

const _pinRegistry = new Map(); // id → {titulo, pagina, render}
let _pinAtivos = []; // [{id, titulo, pagina, ordem}]
let _pinFirestoreCarregado = false;

// Registra um elemento pinável. Cada chamada de render gera um card.
// Se o pin já está ativo (foi fixado pelo usuário), também salva uma snapshot
// no Firestore com o último valor visualizado, para que possa ser exibido na home
// mesmo que o usuário não tenha visitado a página de origem nesta sessão.
function _pinRegistrar(id, titulo, pagina, render){
  _pinRegistry.set(id, {titulo: titulo, pagina: pagina, render: render});

  // Se o usuário já fixou esse pin, atualiza o cache no Firestore
  // (rodando o render num container offscreen pra capturar o HTML).
  try {
    const ativo = _pinAtivos.find(function(p){return p.id === id;});
    if(!ativo) return;
    const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
    if(!auth || !auth.currentUser) return;
    // Render offscreen pra capturar valor atual
    const sandbox = document.createElement('div');
    sandbox.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
    document.body.appendChild(sandbox);
    try {
      render(sandbox);
      const snapshotHtml = sandbox.innerHTML;
      // Atualiza Firestore (não bloqueia)
      const db = firebase.firestore();
      db.collection('users').doc(auth.currentUser.uid).collection('pins').doc(id)
        .set({
          titulo: titulo,
          pagina: pagina,
          ordem: ativo.ordem,
          snapshotHtml: snapshotHtml,
          snapshotAt: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge: true}).catch(function(e){
          console.warn('[pin] erro ao atualizar snapshot:', e);
        });
      // Atualiza cache local também
      ativo.snapshotHtml = snapshotHtml;
    } catch(e){
      console.warn('[pin] erro no render offscreen:', id, e);
    }
    sandbox.remove();
  } catch(e){
    console.warn('[pin] erro ao snapshotar:', e);
  }
}
window._pinRegistrar = _pinRegistrar;

// Carrega pins do Firestore
async function _pinCarregarFirestore(){
  if(_pinFirestoreCarregado) return;
  try {
    const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
    if(!auth || !auth.currentUser){ _pinFirestoreCarregado = true; return; }
    const db = firebase.firestore();
    const ref = db.collection('users').doc(auth.currentUser.uid).collection('pins');
    const snap = await ref.orderBy('ordem').get();
    _pinAtivos = [];
    snap.forEach(function(doc){
      const d = doc.data();
      _pinAtivos.push({
        id: doc.id,
        titulo: d.titulo || '',
        pagina: d.pagina || '',
        ordem: d.ordem || 0,
        snapshotHtml: d.snapshotHtml || null
      });
    });
    _pinFirestoreCarregado = true;
  } catch(e){
    console.warn('[pin] erro ao carregar pins:', e);
    _pinFirestoreCarregado = true;
  }
}

// Salva um pin no Firestore (toggle).
// Ao fixar, tenta capturar um snapshot do HTML do pin (renderizando offscreen),
// pra que ele apareça na home mesmo se o usuário recarregar e for direto pra home
// sem visitar a página de origem (sessão sem o renderer registrado).
async function _pinToggle(id){
  try {
    const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
    if(!auth || !auth.currentUser){ alert('Faça login para usar pins.'); return; }
    const db = firebase.firestore();
    const ref = db.collection('users').doc(auth.currentUser.uid).collection('pins').doc(id);

    const idx = _pinAtivos.findIndex(function(p){return p.id === id;});
    if(idx >= 0){
      // Remover
      await ref.delete();
      _pinAtivos.splice(idx, 1);
      _pinToast('Pin removido', 'info');
    } else {
      // Adicionar — capturando snapshot do valor atual
      const reg = _pinRegistry.get(id);
      if(!reg){ console.warn('[pin] id não registrado:', id); return; }
      const ordem = _pinAtivos.length;

      // Renderiza num sandbox offscreen pra extrair HTML do valor atual
      let snapshotHtml = null;
      try {
        const sandbox = document.createElement('div');
        sandbox.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:280px;';
        document.body.appendChild(sandbox);
        try { reg.render(sandbox); snapshotHtml = sandbox.innerHTML; } catch(e){ console.warn('[pin] erro snapshot:', e); }
        sandbox.remove();
      } catch(e){
        console.warn('[pin] erro ao criar sandbox:', e);
      }

      const data = {
        titulo: reg.titulo,
        pagina: reg.pagina,
        ordem: ordem,
        addedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      if(snapshotHtml){
        data.snapshotHtml = snapshotHtml;
        data.snapshotAt = firebase.firestore.FieldValue.serverTimestamp();
      }
      await ref.set(data);
      _pinAtivos.push({id: id, titulo: reg.titulo, pagina: reg.pagina, ordem: ordem, snapshotHtml: snapshotHtml});
      _pinToast('Adicionado à home', 'ok');
    }
    // Atualiza visual dos botões de pin em todos os elementos
    _pinAtualizarBotoes();
  } catch(e){
    console.warn('[pin] erro ao toggle:', e);
    alert('Erro ao salvar pin: '+(e.message || 'desconhecido'));
  }
}
window._pinToggle = _pinToggle;

// Salva nova ordem dos pins (após drag-and-drop)
async function _pinSalvarOrdem(){
  try {
    const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
    if(!auth || !auth.currentUser) return;
    const db = firebase.firestore();
    const batch = db.batch();
    _pinAtivos.forEach(function(p, i){
      p.ordem = i;
      const ref = db.collection('users').doc(auth.currentUser.uid).collection('pins').doc(p.id);
      batch.update(ref, {ordem: i});
    });
    await batch.commit();
  } catch(e){
    console.warn('[pin] erro ao salvar ordem:', e);
  }
}

// Toast simples
function _pinToast(msg, tipo){
  const el = document.createElement('div');
  const cor = tipo === 'ok' ? '#15803d' : tipo === 'err' ? '#dc2626' : '#1f2937';
  el.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:'+cor+';color:white;padding:9px 18px;border-radius:6px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.2);transition:opacity .3s;';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(function(){ el.style.opacity = '0'; }, 1800);
  setTimeout(function(){ el.remove(); }, 2200);
}

// Cria botão de pin pra um elemento (chame ao construir o card pinável)
function _pinBotao(id){
  const ativo = _pinAtivos.some(function(p){return p.id === id;});
  return '<button class="pin-btn" data-pin-id="'+esc(id)+'" '
    + 'title="'+(ativo?'Remover da minha home':'Fixar na minha home')+'" '
    + 'style="background:'+(ativo?'rgba(245,134,52,.18)':'rgba(0,0,0,.06)')
    + ';border:1px solid '+(ativo?'rgba(245,134,52,.5)':'rgba(0,0,0,.10)')
    + ';cursor:pointer;font-size:14px;padding:3px 7px;border-radius:6px;color:'
    + (ativo?'#f58634':'rgba(0,0,0,.55)')+';line-height:1;" '
    + '>'+(ativo?'📌':'📍')+'</button>';
}
window._pinBotao = _pinBotao;

// Atualiza visual de todos os botões de pin na tela
function _pinAtualizarBotoes(){
  document.querySelectorAll('.pin-btn').forEach(function(btn){
    const id = btn.getAttribute('data-pin-id');
    const ativo = _pinAtivos.some(function(p){return p.id === id;});
    btn.textContent = ativo ? '📌' : '📍';
    btn.style.color = ativo ? '#f58634' : 'rgba(0,0,0,.55)';
    btn.style.background = ativo ? 'rgba(245,134,52,.18)' : 'rgba(0,0,0,.06)';
    btn.style.borderColor = ativo ? 'rgba(245,134,52,.5)' : 'rgba(0,0,0,.10)';
    btn.title = ativo ? 'Remover da minha home' : 'Fixar na minha home';
  });
}
window._pinAtualizarBotoes = _pinAtualizarBotoes;

// Listener global pra clicks em botões de pin
document.addEventListener('click', function(e){
  const btn = e.target.closest('.pin-btn');
  if(btn){
    e.preventDefault();
    e.stopPropagation();
    const id = btn.getAttribute('data-pin-id');
    if(id) _pinToggle(id);
  }
});

// Renderiza a área de pins na home
async function _pinRenderHome(){
  await _pinCarregarFirestore();
  const cont = document.getElementById('pin-home-section');
  if(!cont) return;

  if(!_pinAtivos.length){
    cont.innerHTML = '<div style="background:var(--surface-2);border:1px dashed var(--border);border-radius:10px;padding:30px;text-align:center;color:var(--text-muted);">'
      + '<div style="font-size:32px;margin-bottom:8px;opacity:.4;">📍</div>'
      + '<div style="font-size:13px;font-weight:600;margin-bottom:4px;">Sua home está vazia</div>'
      + '<div style="font-size:12px;line-height:1.4;">Navegue pelas páginas e clique no ícone <strong>📍</strong> que aparece em KPIs e gráficos para fixar os mais importantes aqui.</div>'
      + '</div>';
    return;
  }

  // Renderiza cada pin chamando seu render registrado
  let html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
    + '<div><div class="cct" style="margin:0;">Meus pins</div>'
    + '<div class="ccs">'+fI(_pinAtivos.length)+' iten'+(_pinAtivos.length!==1?'s':'')+' fixado'+(_pinAtivos.length!==1?'s':'')+' · arraste para reordenar</div></div>'
    + '<button id="pin-edit-btn" style="padding:5px 10px;background:transparent;border:1px solid var(--border-strong);border-radius:5px;cursor:pointer;font-size:11px;">⚙ Editar</button>'
    + '</div>';
  html += '<div id="pin-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:12px;margin-bottom:14px;">';
  _pinAtivos.forEach(function(p){
    const reg = _pinRegistry.get(p.id);
    const titulo = reg ? reg.titulo : p.titulo;
    const pagina = reg ? reg.pagina : p.pagina;
    html += '<div class="pin-card" data-pin-id="'+esc(p.id)+'" draggable="true" '
      + 'style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px;position:relative;cursor:grab;transition:box-shadow .15s, transform .15s;">'
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;gap:8px;">'
      +   '<div class="pin-card-titulo" style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:700;flex:1;">'+esc(titulo)+'</div>'
      +   '<button class="pin-btn" data-pin-id="'+esc(p.id)+'" title="Remover da home" '
      +     'style="background:transparent;border:none;cursor:pointer;font-size:14px;padding:0;color:#f58634;">📌</button>'
      + '</div>'
      + '<div class="pin-card-body" style="min-height:60px;"></div>'
      + (pagina ? '<div style="margin-top:8px;border-top:1px solid var(--border);padding-top:6px;">'
          + '<a href="javascript:void(0)" data-pin-pagina="'+esc(pagina)+'" '
          + 'style="font-size:11px;color:var(--accent);text-decoration:none;">→ Ver página completa</a>'
          + '</div>' : '')
      + '</div>';
  });
  html += '</div>';
  cont.innerHTML = html;

  // Renderiza o conteúdo de cada card
  _pinAtivos.forEach(function(p){
    const reg = _pinRegistry.get(p.id);
    const card = cont.querySelector('.pin-card[data-pin-id="'+p.id+'"] .pin-card-body');
    if(!card) return;
    if(!reg){
      // Sem renderer ativo nesta sessão. Tenta usar o snapshot salvo.
      if(p.snapshotHtml){
        card.innerHTML = p.snapshotHtml
          + '<div style="font-size:10px;color:var(--text-muted);margin-top:6px;font-style:italic;opacity:.7;">Valor salvo · visite a página para atualizar</div>';
      } else {
        card.innerHTML = '<div style="color:var(--text-muted);font-size:11px;font-style:italic;">Visite a página de origem ('+esc(p.pagina||'?')+') para carregar o valor.</div>';
      }
      return;
    }
    try {
      reg.render(card);
    } catch(e){
      console.warn('[pin] erro ao renderizar', p.id, e);
      // Em caso de erro de render, tenta o snapshot
      if(p.snapshotHtml){
        card.innerHTML = p.snapshotHtml
          + '<div style="font-size:10px;color:var(--text-muted);margin-top:6px;font-style:italic;opacity:.7;">Valor salvo (erro ao atualizar)</div>';
      } else {
        card.innerHTML = '<div style="color:#dc2626;font-size:11px;">Erro ao renderizar.</div>';
      }
    }
  });

  // Bind navegação de "Ver página completa"
  cont.querySelectorAll('[data-pin-pagina]').forEach(function(a){
    a.addEventListener('click', function(){
      const pg = a.getAttribute('data-pin-pagina');
      const link = document.querySelector('.sb-link[data-p="'+pg+'"]');
      if(link) link.click();
    });
  });

  // Bind drag-and-drop pra reordenar
  _pinBindDragDrop();
}
window._pinRenderHome = _pinRenderHome;

// Drag-and-drop para reordenar pins na home
function _pinBindDragDrop(){
  const grid = document.getElementById('pin-grid');
  if(!grid) return;
  let dragging = null;

  grid.querySelectorAll('.pin-card').forEach(function(card){
    card.addEventListener('dragstart', function(e){
      dragging = card;
      card.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', function(){
      card.style.opacity = '1';
      dragging = null;
      // Salva nova ordem baseada no DOM
      const novaOrdem = [];
      grid.querySelectorAll('.pin-card').forEach(function(c){
        const id = c.getAttribute('data-pin-id');
        const p = _pinAtivos.find(function(x){return x.id === id;});
        if(p) novaOrdem.push(p);
      });
      _pinAtivos = novaOrdem;
      _pinSalvarOrdem();
    });
    card.addEventListener('dragover', function(e){
      e.preventDefault();
      if(!dragging || dragging === card) return;
      const rect = card.getBoundingClientRect();
      const meio = rect.left + rect.width / 2;
      if(e.clientX < meio){
        card.parentNode.insertBefore(dragging, card);
      } else {
        card.parentNode.insertBefore(dragging, card.nextSibling);
      }
    });
  });
}

// Inicialização: carrega pins quando user logar
(function(){
  function tentar(){
    if(typeof firebase !== 'undefined' && firebase.auth){
      firebase.auth().onAuthStateChanged(function(u){
        if(u){
          _pinFirestoreCarregado = false;
          _pinCarregarFirestore().then(function(){
            _pinAtualizarBotoes();
            // Se o usuário está na home, re-renderiza pra refletir os pins
            const home = document.getElementById('page-home');
            if(home && home.classList.contains('active') && typeof _pinRenderHome === 'function'){
              _pinRenderHome();
            }
          });
        } else {
          _pinAtivos = [];
          _pinFirestoreCarregado = false;
        }
      });
    } else {
      setTimeout(tentar, 500);
    }
  }
  tentar();
})();

// CSS dos pins
(function(){
  const css = '.pin-btn:hover { background: rgba(245,134,52,.12) !important; transform: scale(1.15); }'
    + '.pin-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.08); }'
    + '.pin-card[draggable=true]:active { cursor: grabbing; }';
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
})();
