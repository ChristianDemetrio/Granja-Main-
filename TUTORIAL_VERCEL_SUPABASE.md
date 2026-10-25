# 🚀 Tutorial Completo — Hospedar o GranjaControl (Vercel + Supabase)

Este tutorial cobre a configuração de um **projeto novo, do zero**. Se você
já tem um projeto Supabase antigo e só quer atualizar, veja a tabela da
[Parte 1.3](#13-qual-arquivo-sql-rodar) antes de continuar.

---

## Parte 1 — Banco de dados (Supabase)

### 1.1 Criar o projeto
1. Acesse **https://supabase.com** → **Start your project** → crie conta (GitHub ou e-mail)
2. Clique em **New project**
3. Escolha um nome (ex: `GranjaControl_v3`), uma senha forte para o banco e a região mais próxima (ex: São Paulo)
4. Aguarde ~2 minutos até o projeto ficar pronto

### 1.2 Criar as tabelas
1. No painel do projeto, vá em **SQL Editor** (menu lateral) → **New query**
2. Abra o arquivo `banco.sql` deste projeto, copie todo o conteúdo e cole no editor
3. Clique em **Run** (▶) — deve aparecer "Success" em verde

`banco.sql` já cria tudo atualizado: as 5 tabelas (`lotes`, `producao`,
`saidas`, `despesas`, `mortalidade`), o campo `lote_id` em despesas
(rentabilidade por lote), as políticas de segurança exigindo login, e a
view pública `rastreio_publico` usada pelo QR Code.

### 1.3 Qual arquivo SQL rodar?

| Situação | O que rodar |
|---|---|
| Projeto Supabase **novo**, começando do zero | Só o `banco.sql` — já tem tudo |
| Banco **já existia** antes de "documentos e informações do lote" | + `ATUALIZACAO_BANCO_DADOS.sql` |
| Banco **já existia** antes do login obrigatório | + `ATUALIZACAO_AUTH_RLS.sql` |
| Banco **já existia** antes da rentabilidade por lote | + `ATUALIZACAO_RENTABILIDADE_LOTE.sql` |
| Banco **já existia** antes do QR Code de rastreabilidade | + `ATUALIZACAO_RASTREABILIDADE_QR.sql` |

Para um projeto novo (como este tutorial assume), ignore a tabela acima —
o `banco.sql` sozinho já resolve.

### 1.4 Criar o bucket de documentos dos lotes
O cadastro de lote permite anexar um documento (nota fiscal, laudo, etc.).
Isso usa o **Storage** do Supabase, que precisa ser criado manualmente:

1. No painel, vá em **Storage** (menu lateral) → **New bucket**
2. Nome: `documentos-lotes`
3. Marque **Public bucket** → **Create bucket**

Sem esse passo, o cadastro de lote funciona normalmente — só o upload de
documento anexo que vai falhar.

### 1.5 Criar seu usuário de login
O app exige login (Supabase Auth) antes de mostrar qualquer dado:

1. Vá em **Authentication** → **Users** → **Add user** → **Create new user**
2. Preencha e-mail e senha
3. Marque **Auto Confirm User** (evita precisar confirmar por e-mail)
4. **Create user**

Repita esse passo para cada pessoa que for usar o sistema.

### 1.6 Copiar as credenciais
1. Vá em **Project Settings** (ícone de engrenagem) → **API**
2. Copie:
   - **Project URL** → algo como `https://xxxxx.supabase.co`
   - **anon public key** → uma string longa começando com `eyJ...`

Guarde esses dois valores — você vai usar no próximo passo.

---

## Parte 2 — Configurar as credenciais no projeto

1. Abra o arquivo `supabase.config.js` (na pasta do projeto)
2. Substitua os valores:

```js
const SUPABASE_URL  = 'https://xxxxx.supabase.co';   // ← sua Project URL
const SUPABASE_KEY  = 'eyJhbGciOi...';                // ← sua anon public key
```

3. Salve o arquivo

> A chave `anon` é feita para ficar pública no frontend — quem protege os
> dados são as políticas de RLS que o `banco.sql` já configurou (só
> usuários logados leem/gravam).

---

## Parte 3 — Subir o código para o GitHub

No terminal, dentro da pasta do projeto:

```bash
cd "D:\Trabalhos Claude\Granja-main - V2"
git add -A
git commit -m "Configuração inicial GranjaControl_v3"
git push origin main
```

Se pedir identidade, configure antes:
```bash
git config --global user.email "seu-email@exemplo.com"
git config --global user.name "Seu Nome"
```

Se `git push` pedir usuário/senha do GitHub, lembre que o GitHub não aceita
mais senha normal — use um **Personal Access Token** (Settings → Developer
settings → Personal access tokens, no próprio GitHub) no lugar da senha, ou
faça login pela janela do Git Credential Manager quando ela abrir.

---

## Parte 4 — Hospedar na Vercel

### 4.1 Criar conta
1. Acesse **https://vercel.com** → **Sign Up** → **Continue with GitHub**

### 4.2 Importar o projeto
1. No painel, clique em **Add New → Project**
2. Em **Import Git Repository**, selecione o repositório do GranjaControl
   *(se não aparecer, clique em "Adjust GitHub App Permissions" e libere o repositório)*
3. Em **Project Name**, dê um nome novo e claro, ex: `granjacontrol-v3`
   *(isso evita confundir com projetos antigos no seu painel)*
4. **Framework Preset**: deixe **Other** — é HTML/JS puro, sem build.
   Não precisa mexer em Build Command nem Output Directory; o `vercel.json`
   do projeto já configura tudo
5. Clique em **Deploy** e aguarde ~30 segundos

### 4.3 Testar
Você recebe uma URL como `https://granjacontrol-v3.vercel.app`. Acesse e:
- Faça login com o e-mail/senha criados na Parte 1.5
- Cadastre um lote de teste
- Na página Lotes, gere uma etiqueta QR e escaneie com o celular para
  conferir se a página `rastreio.html` abre corretamente

> A partir de agora, todo `git push origin main` gera um novo deploy
> automático — não precisa repetir os passos da Parte 4 depois.

---

## Parte 5 — Domínio próprio (opcional)

1. Registre um domínio (ex: **registro.br** para `.com.br`, ~R$40/ano, ou
   Namecheap/GoDaddy para `.com`)
2. No projeto na Vercel → **Settings → Domains → Add** → digite o domínio
3. A Vercel mostra os registros DNS que faltam (A record ou CNAME)
4. No painel do registrador → **DNS / Zona DNS** → adicione exatamente
   esses registros
5. Aguarde a propagação (minutos a algumas horas) — a Vercel emite HTTPS
   automaticamente

> Depois de trocar de domínio, gere as próximas etiquetas QR já com o
> domínio final — o link fica gravado no QR no momento em que ele é criado.

---

## Parte 6 — Referência rápida dos arquivos

| Arquivo | Para que serve | Precisa no deploy? |
|---|---|---|
| `index.html` | App principal | ✅ Sim |
| `granja.css` | Estilos visuais | ✅ Sim |
| `granja.js` | Lógica da aplicação | ✅ Sim |
| `supabase.config.js` | Credenciais do banco | ✅ Sim |
| `vercel.json` | Configuração da Vercel | ✅ Sim |
| `rastreio.html` / `rastreio.js` | Página pública do QR Code | ✅ Sim |
| `banco.sql` | Cria o banco do zero | ℹ️ Só no Supabase (SQL Editor), não no deploy |
| `ATUALIZACAO_*.sql` | Migrações incrementais (bancos antigos) | ℹ️ Só no Supabase, se aplicável |
| `README.md`, `DEPLOY.md`, outros `.md` | Documentação | ❌ Não |

---

## ✅ Checklist final

- [ ] Projeto Supabase criado e `banco.sql` executado
- [ ] Bucket `documentos-lotes` criado como público
- [ ] Usuário de login criado em Authentication → Users
- [ ] `supabase.config.js` com URL e anon key corretos
- [ ] Código enviado para o GitHub (`git push`)
- [ ] Projeto importado na Vercel com deploy concluído
- [ ] Login testado na URL da Vercel
- [ ] QR Code de um lote testado no celular
- [ ] (Opcional) Domínio próprio configurado
