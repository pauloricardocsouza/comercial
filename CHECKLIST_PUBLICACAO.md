# Checklist de Publicação · GPC Comercial

Sistema agora rodando em modo **Firebase** (auth + persistência). Antes de publicar em produção, siga os passos abaixo na ordem.

---

## 1 · Estado do código (já aplicado)

- [x] Scripts Firebase descomentados (linhas 14-17 do `index.html`)
- [x] `AUTH_MODE = 'firebase'` (linha 1957)
- [x] Bypass de login removido do `_bootstrapComAuth()`
- [x] `console.error` quando SDK não carregar
- [x] Sync de metas com Firestore (`config/metas_gpc`)
- [x] Seletor de filial em árvore (GRUPO → ATP/CP → CP1/CP3/CP5/CP40)

---

## 2 · Setup do Firebase Console

### 2.1 · Habilitar Authentication
1. Acesse [Firebase Console](https://console.firebase.google.com/project/comercial-3029f)
2. Vá em **Authentication** → **Sign-in method**
3. Habilite o provider **Email/Password**

### 2.2 · Habilitar Firestore
1. **Firestore Database** → **Create database** (se ainda não existe)
2. Modo: **production mode** (regras serão aplicadas no passo 4)
3. Localização: **southamerica-east1** (São Paulo) — recomendado pra latência

### 2.3 · Habilitar Storage (opcional)
Só precisa se for usar upload de arquivos (avatares, anexos). Deixe pra depois se ainda não usa.

---

## 3 · Criar admin inicial

⚠️ **PROBLEMA**: as Firestore Rules exigem que JÁ exista um admin pra criar outro. Pra resolver, faça assim:

### Opção A · Pelo Firebase Console (recomendado)
1. **Authentication** → **Users** → **Add user**
   - Email: `r2@solucoesr2.com.br` (ou o que preferir)
   - Senha: defina uma senha forte (≥ 6 chars)
2. Copie o **UID** gerado
3. **Firestore** → coleção `usuarios` → **Add document**
   - Document ID: cole o UID copiado
   - Campos:
     - `uid` (string): mesmo UID
     - `email` (string): `r2@solucoesr2.com.br`
     - `nome` (string): `Administrador R2`
     - `perfil` (string): `admin`
     - `ativo` (boolean): `true`
     - `senha_temp` (boolean): `false`
     - `criado_em` (string): data ISO atual
     - `filial_padrao` (null)

### Opção B · Pelo `firebase_seed.html` (temporário)
1. Abra o arquivo `firebase_seed.html` num servidor web (ex.: GitHub Pages temporário ou local)
2. **Antes**, no Firebase Console → **Firestore** → **Rules**, cole rules permissivas temporárias:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
3. Acesse a página, preencha email/senha/nome, clique em **Criar admin + perfis**
4. **DEPOIS**: aplique as rules definitivas (passo 4)
5. **APAGUE** `firebase_seed.html` do servidor

---

## 4 · Aplicar Firestore Security Rules

1. **Firestore Database** → **Rules**
2. Copie o conteúdo de `firestore.rules` (deste pacote)
3. Cole na aba e clique em **Publish**

Essas rules garantem:
- Usuários comuns só leem/editam o próprio doc (campos `senha_temp` e `ultimo_acesso`)
- Admins podem CRUD em `usuarios`, `perfisTemplate`, `config`
- Qualquer user autenticado pode ler `config/metas_gpc` e gravar logs em `auditLog`
- Tudo que não foi declarado é **negado por padrão**

---

## 5 · Hospedar arquivos

### 5.1 · Onde colocar
Os 50 arquivos do `dist_gpc.zip` precisam ficar todos no MESMO diretório web. Opções:

- **Firebase Hosting** (recomendado, integra com Auth/Firestore)
- **GitHub Pages** (já tem CNAME `dash.solucoesr2.com.br` em uso)
- **Wix** (pasta de hospedagem estática)
- Servidor próprio (Apache/Nginx)

### 5.2 · Caminhos
- `index.html` → raiz do diretório
- `filiais.json`, `metas.json`, `vendas_*.json`, etc → mesmo nível do `index.html`
- O `cubo_cp.json` (118 MB) é grande mas só carrega lazy

### 5.3 · CORS
Firebase Auth não exige CORS especial. Se hospedar fora do projeto Firebase, garanta que o `authDomain` (linha 25 do init) esteja configurado em **Authentication → Settings → Authorized domains**.

### 5.4 · Domínio personalizado
Adicione `dash.solucoesr2.com.br` (ou outro) em **Authentication → Settings → Authorized domains** pra evitar erros de redirect no login.

---

## 6 · Testar primeiro acesso

1. Abra a URL no navegador
2. Tela de login deve aparecer (não bypass mais)
3. Faça login com o admin criado
4. No console (F12) deve mostrar `[Firebase] SDK carregado e inicializado`
5. Navegue até **Metas** (sidebar) e teste edição
6. Salvar metas → confira no Firestore Console que `config/metas_gpc` apareceu

---

## 7 · Pós-publicação

### 7.1 · Apagar `firebase_seed.html`
Se usou a Opção B do passo 3, **apague esse arquivo do servidor** depois.

### 7.2 · Backup do Firestore
Configure backups automáticos em **Firestore → Backups** pra não perder dados.

### 7.3 · Audit log
Acompanhe periodicamente a coleção `auditLog` no Firestore Console pra ver tentativas de login, alterações de perfil, etc.

### 7.4 · Limites do Firestore (free tier)
- 50k reads/dia, 20k writes/dia, 1 GiB de armazenamento.
- Se crescer, ative o **Blaze plan** (paga só o que usa).

---

## 8 · Troubleshooting

### "Firebase não carregou"
- Verifique conexão com `gstatic.com`
- Recarregue (F5 ou Ctrl+Shift+R) com cache limpo

### "Email ou senha incorretos"
- Confira se o user existe em **Authentication → Users**
- Confira se o doc `usuarios/{uid}` existe e tem `ativo: true`

### "Permission denied" no console
- Rules muito restritivas, ou o user não é admin
- Veja em **Firestore → Rules → simulate** o que está bloqueando

### Metas não sincronizam
- Verifique o `auditLog` se há erros
- F12 → console: deve aparecer `[metas] sync Firebase OK` ao salvar
- Confira em **Firestore → config → metas_gpc** se o doc atualiza

---

## Arquivos no pacote final

```
dist/
├── index.html                       (1.083 KB · sistema completo)
├── filiais.json                     (3 KB · árvore de filiais)
├── metas.json                       (vazio · será preenchido pelo usuário)
├── firestore.rules                  (regras de segurança)
├── firebase_seed.html               (TEMPORÁRIO · apagar após setup)
├── CHECKLIST_PUBLICACAO.md          (este documento)
├── vendas_*.json                    (7 arquivos: atp, cp1, cp3, cp5, cp40, cp, grupo)
├── estoque_*.json                   (7 arquivos)
├── financeiro_*.json                (7 arquivos)
├── recebimentos_*.json              (7 arquivos)
├── compras_*.json                   (7 arquivos)
├── devolucoes_*.json                (7 arquivos)
├── verbas_*.json                    (3 arquivos: cp1, cp3, cp40)
├── cubo_atp.json                    (47 MB · OLAP ATP, lazy)
└── cubo_cp.json                     (118 MB · OLAP CP, lazy)
```
