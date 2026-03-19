# 🚀 Como hospedar o GranjaControl online — Grátis

---

## ✅ Opção 1 — Vercel (Recomendado)
> Gratuito, rápido, URL automática tipo `granja-control.vercel.app`

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
├── index.html          ✅ obrigatório
├── granja.css          ✅ obrigatório
├── granja.js           ✅ obrigatório
├── supabase.config.js  ✅ obrigatório (com suas credenciais)
├── vercel.json         ✅ necessário para Vercel
└── banco.sql           ℹ️  opcional (já foi executado no Supabase)
```

---

## 🔒 Segurança do Supabase

A chave `anon` do Supabase é **segura para ficar no frontend** pois:
- O Supabase controla o acesso via **Row Level Security (RLS)**
- Já configuramos as policies no `banco.sql`
- A chave `anon` só tem as permissões que você definiu

---

## 🌐 Domínio personalizado (opcional, gratuito)

Tanto Vercel quanto Netlify permitem adicionar domínio próprio grátis:
- **Vercel:** Settings → Domains → Add
- **Netlify:** Site settings → Domain management → Add custom domain

Você pode registrar um domínio `.com.br` por ~R$40/ano em registros como
**registro.br** (https://registro.br).

---

*GranjaControl — pronto para produção 🥚*
