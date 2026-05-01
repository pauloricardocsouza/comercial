# GPC · Dashboard de Análise Comercial

Sistema BI completo do Grupo Pinto Cerqueira (GPC) com integração Firebase.

## Visão geral

- **Bases**: ATP (Atacado Pinto) + Comercial Pinto (CP1, CP3, CP5, CP40)
- **Visão consolidada**: GRUPO (ATP + CP) é o default
- **Auth**: Firebase Authentication (email/senha)
- **Persistência**: Firestore para usuários, perfis, metas, audit log
- **Frontend**: HTML monolítico (`index.html`) com 30 páginas e 16k linhas

## Compressão Gzip

Os arquivos JSON > 1 MB foram pré-comprimidos como `.json.gz` pra reduzir tamanho:

| Arquivo | Original | Gzipado | Razão |
|---|---|---|---|
| cubo_cp.json | 119 MB | 23 MB | 5,2× |
| cubo_atp.json | 45 MB | 11 MB | 4,3× |
| estoque_grupo.json | 29 MB | 4,1 MB | 6,9× |
| vendas_grupo.json | 23 MB | 3,5 MB | 6,5× |
| ... | ... | ... | ~5× total |

**Total**: 333 MB → 63 MB (5,3× menor).

O front (`index.html`) descompacta automaticamente via:
1. **DecompressionStream nativo** (Chrome/Edge/Firefox/Safari 16.4+)
2. **pako.js** como fallback (Safari iOS antigo, browsers legados)
3. `.json` puro como último fallback (caso `.gz` não exista)

## Stack

- HTML/CSS/JS puro (sem build step)
- Chart.js 4.4.0
- Pako 2.1.0 (descompressão gzip no cliente)
- Firebase 10.12.0 (compat SDK)
- Hospedagem: GitHub Pages com CNAME `dash.solucoesr2.com.br`

## Setup inicial

Veja `CHECKLIST_PUBLICACAO.md` pra setup completo do Firebase Console.

## Estrutura

```
.
├── index.html                  # sistema completo (1 MB)
├── filiais.json                # árvore de bases/filiais
├── metas.json                  # esqueleto de metas (preenchido pelo user)
├── firestore.rules             # security rules
├── CHECKLIST_PUBLICACAO.md     # passos pra publicar
├── *.json                      # arquivos pequenos (< 1 MB) sem compressão
├── *.json.gz                   # arquivos grandes pré-comprimidos
└── ... (54 arquivos no total)
```

## Ambiente local

```bash
# Servir localmente (precisa de servidor por causa do fetch)
cd dist_github
python3 -m http.server 8000
# Abrir http://localhost:8000
```

⚠️ **Atenção pra dev local**: alguns servidores básicos não enviam `Content-Type: application/gzip` correto.
Se algum arquivo não carregar, force a descompressão usando o fallback pako (já está ativo no front).

## Versão atual

- Build: maio/2026
- Inclui: integração CP completa, seletor de árvore (GRUPO/ATP/CP),
  página Metas com editor inline, Firebase ativo, Firestore Rules,
  compressão gzip estática.
