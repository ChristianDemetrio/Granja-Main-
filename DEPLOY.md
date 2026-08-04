# 🚀 Como hospedar o GranjaControl online — Grátis

---

## 🎯 Deploy deste projeto (repositório já existe no GitHub)

Este projeto já está versionado em
`https://github.com/ChristianDemetrio/Granja-Main-.git`. Como ainda não foi
publicado na Vercel, o caminho mais simples é conectar esse repositório
direto — assim todo `git push` futuro atualiza o site sozinho.

### Passo 1 — Enviar as mudanças para o GitHub
No terminal, dentro da pasta do projeto (no seu computador, não precisa ser
aqui no chat):
```bash
git add -A
git commit -m "Login, rastreabilidade por QR e rentabilidade por lote"
git push origin main
```

### Passo 2 — Criar o projeto na Vercel
1. Acesse **https://vercel.com** e entre com **Continue with GitHub**
2. Clique em **Add New → Project**
3. Em **Import Git Repository**, selecione `Granja-Main-`
   *(se não aparecer, clique em "Adjust GitHub App Permissions" e libere o repositório)*
4. Framework Preset: deixe **Other** (é HTML/JS puro — o `vercel.json` já
   configura tudo, não precisa mexer em Build Command nem Output Directory)
5. Clique em **Deploy** e aguarde ~30 segundos
6. ✅ Você recebe uma URL como `https://granja-main-xxxx.vercel.app`

Teste nessa URL: faça login, cadastre algo e gere uma etiqueta QR para
confirmar que tudo funciona antes de configurar o domínio final.

> A partir de agora, todo `git push origin main` gera um novo deploy
> automático — não precisa repetir esses passos depois.

---

## ✅ Opção alternativa — Vercel sem GitHub (arrastar pasta)
> Sobe os arquivos direto, sem versionamento — útil só para testes rápidos

### Passo 1 — Criar conta
1. Acesse **https://vercel.com**
2. Clique em **Sign Up**
3. Escolha **Continue with GitHub** (mais fácil) ou e-mail

---

### Passo 2 — Subir os arquivos (sem precisar de GitHub)
1. No painel do Vercel, clique em **Add New → Project**
2. Na tela seguinte, procure o link **"deploy without a Git repository"**
   *(ou clique direto em https://vercel.com/new)*
3. Arraste a **pasta inteira do projeto** para a área indicada
   *(a pasta deve conter: index.html, granja.css, granja.js, supabase.config.js, vercel.json)*
4. Clique em **Deploy**
5. Aguarde ~30 segundos
6. ✅ Pronto! Você receberá uma URL como `https://granja-xxx.vercel.app`

---

### ⚠️ Importante — Variáveis de ambiente (segurança)
O arquivo `supabase.config.js` contém suas chaves e ficará público.
Para proteger, use **Environment Variables** do Vercel:

1. No projeto Vercel → **Settings → Environment Variables**
2. Adicione:
   - `SUPABASE_URL` = `https://seu-projeto.supabase.co`
   - `SUPABASE_KEY` = `sua-anon-key`
3. No `supabase.config.js`, deixe os placeholders — as chaves reais
   ficam protegidas no servidor.

> **Nota:** para projetos pessoais/testes, manter no arquivo é OK,
> pois a chave `anon` do Supabase já é pública por design.

---

## ✅ Opção 2 — Netlify (Alternativa)
> Também gratuito, arrastar e soltar

### Passo a passo
1. Acesse **https://netlify.com** e crie uma conta
2. No painel, localize a área **"Deploy manually"**
3. **Arraste a pasta do projeto** direto para essa área
4. Aguarde o upload
5. ✅ URL gerada automaticamente: `https://granja-xxxxx.netlify.app`

### Atualizar depois
- Basta arrastar a pasta novamente — o Netlify faz novo deploy

---

## ✅ Opção 3 — GitHub Pages (com GitHub)
> Gratuito, integrado com repositório

### Passo a passo
1. Acesse **https://github.com** e crie uma conta
2. Crie um repositório novo (ex: `granja-control`)
3. Faça upload dos arquivos clicando em **Add file → Upload files**
4. Vá em **Settings → Pages**
5. Em **Source**, selecione **Deploy from a branch → main → / (root)**
6. Clique em **Save**
7. ✅ URL: `https://seu-usuario.github.io/granja-control`

---

## 📁 Arquivos necessários para o deploy

```
granja/
├── index.html          ✅ obrigatório — app principal
├── granja.css          ✅ obrigatório
├── granja.js           ✅ obrigatório
├── supabase.config.js  ✅ obrigatório (com suas credenciais)
├── vercel.json         ✅ necessário para Vercel
├── rastreio.html        ✅ obrigatório — página pública do QR Code
├── rastreio.js          ✅ obrigatório — página pública do QR Code
└── banco.sql, ATUALIZACAO_*.sql   ℹ️  opcional (já executados no Supabase)
```

---

## 🔒 Segurança do Supabase

A chave `anon` do Supabase é **segura para ficar no frontend** pois:
- O Supabase controla o acesso via **Row Level Security (RLS)**
- Já configuramos as policies no `banco.sql`
- A chave `anon` só tem as permissões que você definiu

---

## 🌐 Domínio personalizado (passo a passo)

### Passo 1 — Registrar o domínio
Registre em qualquer registrador, por exemplo:
- **registro.br** (https://registro.br) para `.com.br` — ~R$40/ano
- **Namecheap**, **GoDaddy** ou **Google Domains** para `.com`

### Passo 2 — Adicionar o domínio na Vercel
1. No projeto na Vercel → **Settings → Domains → Add**
2. Digite seu domínio (ex: `granjaovosdaserra.com.br`)
3. A Vercel mostra os registros DNS que faltam (normalmente um **A record**
   apontando para `76.76.21.21`, ou um **CNAME** `cname.vercel-dns.com` para
   o `www`)

### Passo 3 — Configurar o DNS no registrador
1. Entre no painel do registrador → **DNS / Zona DNS**
2. Adicione exatamente os registros que a Vercel mostrou no passo anterior
3. Salve — a propagação leva de alguns minutos até algumas horas
4. A Vercel emite o certificado HTTPS automaticamente assim que detectar o DNS correto

### ⚠️ Depois de trocar de domínio, regenere as etiquetas QR
O link gravado em cada QR Code usa o domínio de quando ele foi gerado
(`abrirEtiquetaModal` → `getBaseUrl()`). Etiquetas já impressas com a URL
`.vercel.app` continuam funcionando (a Vercel não desativa o subdomínio),
mas para novas caixas prefira gerar as etiquetas já com o domínio final
configurado, evitando ter dois links diferentes circulando.

---

*GranjaControl — pronto para produção 🥚*
