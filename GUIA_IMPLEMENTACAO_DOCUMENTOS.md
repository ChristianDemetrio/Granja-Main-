# 📚 GUIA DE IMPLEMENTAÇÃO — Sistema de Documentos

## 🎯 Objetivo
Ativar o novo sistema de anexação de documentos e informações nos lotes da GranjaControl.

---

## ✅ PASSO 1: Fazer Backup (IMPORTANTE!)

Antes de qualquer mudança, faça um backup do seu banco de dados Supabase:

1. Acesse seu projeto em [supabase.com](https://supabase.com)
2. Vá em **Database Backups**
3. Clique em **Create a manual backup**
4. Aguarde a conclusão

**Tempo estimado:** 1-2 minutos

---

## 📊 PASSO 2: Atualizar o Banco de Dados

### Opção A: Se você JÁ tem dados no banco

1. Acesse seu projeto Supabase
2. Clique em **SQL Editor** (no menu lateral)
3. Clique em **New Query**
4. Cole o conteúdo do arquivo `ATUALIZACAO_BANCO_DADOS.sql`
5. Clique em **Run** ▶️

**O que acontece:** As novas colunas `documento_url` e `informacoes` serão adicionadas à tabela `lotes` sem perder dados existentes.

### Opção B: Se você está criando do zero

1. Use o arquivo `banco.sql` atualizado
2. Siga o procedimento padrão de criação de banco

---

## 📁 PASSO 3: Criar Bucket de Storage

O Supabase precisa de um "pasta segura" para armazenar os documentos. Vamos criar:

1. **Acesse o painel Supabase** → seu projeto
2. No menu lateral, clique em **Storage**
3. Clique em **Create a new bucket**

### Configuração do Bucket:

| Campo | Valor |
|-------|-------|
| **Name** | `documentos-lotes` |
| **Public bucket** | ✅ SIM (marque esta opção) |

4. Clique em **Create bucket**

**Resultado esperado:** Você verá a pasta `documentos-lotes` na lista de buckets.

---

## 🔒 PASSO 4: Configurar Segurança (RLS) — IMPORTANTE!

Se sua conta Supabase tem **Row Level Security (RLS)** ativado, você precisa permitir uploads.

### Como verificar se precisa fazer isso:

1. Vá em **Authentication** → **Policies**
2. Procure por policies relacionadas a "storage"
3. Se houver muitas policies, você provavelmente tem RLS ativo

### Caso tenha RLS ativo:

1. Vá em **SQL Editor** → **New Query**
2. Cole o código abaixo:

```sql
-- Permitir uploads (INSERT)
CREATE POLICY "Permitir upload de documentos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'documentos-lotes');

-- Permitir leitura pública (SELECT)
CREATE POLICY "Permitir leitura pública"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'documentos-lotes');

-- Permitir deleção (DELETE) - opcional
CREATE POLICY "Permitir deleção de documentos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'documentos-lotes');
```

3. Clique em **Run** ▶️

---

## 🔄 PASSO 5: Fazer Deploy do Código

1. Atualize seus arquivos locais:
   - `banco.sql` ✅ (já atualizado)
   - `granja.js` ✅ (já atualizado)
   - `index.html` ✅ (já atualizado)

2. Faça commit e push para seu repositório:
```bash
git add .
git commit -m "feat: adicionar sistema de documentos para lotes"
git push
```

3. **Se usa Vercel:** Deploy automático a partir do Git
4. **Se hospeda localmente:** Atualize os arquivos no servidor

---

## 🧪 PASSO 6: Testar

### Teste de Criação:

1. Abra a aplicação em seu navegador
2. Clique em **🐔 Lotes** (menu lateral)
3. Clique em **＋ Novo Lote**
4. Preencha os dados:
   - Nome: "Lote Teste"
   - Galinhas: "100"
   - Data: Hoje
   - Raça: "Hy-Line"
   - **Informações:** "Este é um lote de teste"
   - **Documento:** Selecione um PDF ou imagem

5. Clique em **💾 Salvar**

### Esperado:
- ✅ Mensagem de sucesso "Lote criado!"
- ✅ Novo lote aparece na lista
- ✅ Card mostra as informações
- ✅ Botão "📎 Ver Documento" está clicável

### Se algo não funcionar:

**Erro ao fazer upload:**
- Verifique se o bucket "documentos-lotes" foi criado ✓
- Verifique se o bucket está como "Public" ✓

**Documentos não aparecem depois de atualizar:**
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Tente incógnito (Ctrl+Shift+P)

**Erro de permissão:**
- Verifique se as policies de RLS foram criadas
- Tente criar o bucket sem RLS primeiro

---

## 📱 Instruções de Uso para Usuários Finais

Compartilhe com sua equipe:

> **Como anexar documentos aos lotes:**
> 
> 1. Clique em "🐔 Lotes"
> 2. Clique em "＋ Novo Lote"
> 3. Preencha os campos normalmente
> 4. No campo "Anexar Documento", selecione um arquivo (PDF, imagem, etc.)
> 5. Clique em "💾 Salvar"
> 6. Pronto! Seus documentos estarão seguros na nuvem
> 
> Para visualizar: Clique no botão "📎 Ver Documento" no card do lote

---

## 🚨 Troubleshooting

| Problema | Solução |
|----------|---------|
| "Erro ao fazer upload" | Verifique se bucket existe e é público |
| "Arquivo não aparece" | Limpe cache (Ctrl+Shift+Del) |
| "Botão 'Ver Documento' cinzento" | Nenhum documento foi anexado (normal) |
| Erro 401/403 | Verifique as policies de RLS |
| Erro de tamanho | Arquivo > 50MB (padrão do Supabase) |

---

## ✨ Próximos Passos

Após implementado com sucesso:

- [ ] Testar com 5-10 documentos
- [ ] Treinar equipe sobre a funcionalidade
- [ ] Monitorar uso de storage (Supabase oferece 1GB grátis)
- [ ] Considerar plano pago se espaço ficar limitado

---

## 📞 Suporte

Para dúvidas:
- Consulte a [Documentação Supabase Storage](https://supabase.com/docs/guides/storage)
- Verifique logs do navegador (F12 → Console)
- Consulte o arquivo `MUDANCAS_DOCUMENTOS.md` para mais detalhes técnicos

---

**Versão:** 1.0  
**Data:** 24/03/2026  
**Status:** Pronto para implementação
