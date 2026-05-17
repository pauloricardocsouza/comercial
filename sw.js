/*
 * Service Worker · Comercial GPC
 * v4.82.3 · 2026-05
 *
 * Estratégias:
 * - Shell (HTML/JS/CSS/imagens locais) → cache-first com revalidação em background.
 *   1ª visita baixa da rede; visitas seguintes carregam instantâneo do cache, com
 *   uma request paralela atualizando o cache (stale-while-revalidate).
 * - JSONs de dados (vendas_, compras_, estoque_, etc.) → network-first com
 *   fallback pro cache. Quer dados frescos quando online; se offline, mostra o
 *   último snapshot conhecido em vez de quebrar.
 * - CDN externos (chart.js, lucide, xlsx, jspdf, pako) → cache-first com TTL
 *   implícito via versionamento da própria URL.
 *
 * Versionamento:
 * - Cache name = 'gpc-shell-vX.Y.Z'. Quando APP_VERSION sobe, o caller atualiza
 *   a query ?v= em sw.js, que muda CACHE_NAME → cache antigo é varrido em activate.
 */

const CACHE_NAME = 'gpc-shell-v4.84.1';
const PRECACHE = [
  '/',
  '/index.html',
  '/assets/gpc-color.png',
  '/assets/gpc-white.png',
  '/assets/r2-color.png',
  '/assets/r2-white.png',
  '/assets/favicon.svg',
];

// --- Install: precache shell mínimo (não bloqueia se algum 404) ---
self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return Promise.all(PRECACHE.map(function(url){
        return cache.add(url).catch(function(){ /* missing asset, ok */ });
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

// --- Activate: limpa caches de versões antigas ---
self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.map(function(name){
        if(name.indexOf('gpc-shell-') === 0 && name !== CACHE_NAME){
          return caches.delete(name);
        }
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

// --- Helpers de estratégia ---
function staleWhileRevalidate(request, cache){
  return cache.match(request).then(function(cached){
    const fetchPromise = fetch(request).then(function(resp){
      if(resp && resp.ok && resp.type !== 'opaque'){
        // Clone porque o body é consumido só uma vez
        cache.put(request, resp.clone()).catch(function(){});
      }
      return resp;
    }).catch(function(){ return cached; });
    return cached || fetchPromise;
  });
}

function networkFirst(request, cache){
  return fetch(request).then(function(resp){
    if(resp && resp.ok){
      cache.put(request, resp.clone()).catch(function(){});
    }
    return resp;
  }).catch(function(){
    return cache.match(request);
  });
}

// --- Fetch: roteia por padrão de URL ---
self.addEventListener('fetch', function(event){
  const req = event.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);

  // Ignora cross-origin não-CDN (Firebase, Google APIs etc.)
  const cdnHosts = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
  const isSameOrigin = url.origin === self.location.origin;
  const isCdn = cdnHosts.indexOf(url.hostname) >= 0;
  if(!isSameOrigin && !isCdn) return;

  // Ignora endpoints dinâmicos (Firebase Auth, Firestore)
  if(url.pathname.indexOf('/__/') === 0) return;
  if(url.hostname.indexOf('firestore') >= 0 || url.hostname.indexOf('googleapis') >= 0) return;

  event.respondWith(caches.open(CACHE_NAME).then(function(cache){
    // JSONs de dados: network-first (dados frescos quando online, cache offline)
    if(url.pathname.endsWith('.json') || url.pathname.endsWith('.json.gz')){
      return networkFirst(req, cache);
    }
    // Manifest .json (configuração) também network-first
    if(url.pathname.indexOf('manifest') >= 0){
      return networkFirst(req, cache);
    }
    // Shell e libs: stale-while-revalidate (carrega instantâneo do cache)
    return staleWhileRevalidate(req, cache);
  }));
});

// --- Mensagens (skipWaiting forçado se a app pedir) ---
self.addEventListener('message', function(event){
  if(event.data && event.data.type === 'SKIP_WAITING'){
    self.skipWaiting();
  }
});
