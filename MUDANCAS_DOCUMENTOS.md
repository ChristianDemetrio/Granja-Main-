# 📄 Mudanças — Sistema de Documentos para Lotes

## 🎯 Resumo das Alterações

Foi implementado um novo sistema de anexação de documentos e informações nos lotes com os seguintes recursos:

### ✨ Novas Funcionalidades

1. **Campo de Informações Adicionais**
   - Novo campo de texto para armazenar observações sobre o lote
   - Exibido em destaque (label informativa) ao visualizar os lotes

2. **Anexação de Documentos**
   - Upload de arquivos (PDF, DOCX, JPG, PNG) ao criar um novo lote
   - Armazenamento em Supabase Storage
   - Link clicável para visualizar/baixar o documento

3. **Nova Label de Informações**
   - Exibição de informações adicionais em destaque no card do lote
   - Ícone ℹ️ para identificar a seção

---

## 📝 Arquivos Modificados

### 1. **banco.sql**
```sql
-- Adicionadas duas novas colunas à tabela 'lotes':
documento_url   TEXT,      -- URL pública do documento armazenado
informacoes     TEXT       -- Campo de informações adicionais
```

**Como aplicar:**
```sql
ALTER TABLE lotes ADD COLUMN documento_url TEXT;
ALTER TABLE lotes ADD COLUMN informacoes TEXT;
```

### 2. **index.html**
- Adicionados dois novos campos no modal "Novo Lote":
  - **Input de Informações**: Campo texto para observações
  - **Input de Documento**: File input para upload de arquivo
  - Feedback visual ao selecionar o arquivo

### 3. **granja.js**

#### Função `DB.insertLote()`
- Agora inclui `documento_url` e `informacoes` no insert

#### Função `openLoteModal()`
- Limpa o campo de documento e informações ao abrir

#### Função `salvarLote()`
- Captura o arquivo selecionado
- Faz upload para Supabase Storage (bucket: `documentos-lotes`)
- Obtém URL pública do arquivo
- Salva as informações no banco de dados

#### Função `renderLotes()`
- Exibe label com informações adicionais
- Mostra botão clicável "📎 Ver Documento" quando há anexo

---

## ⚙️ Configuração Necessária no Supabase

### 1. Criar Bucket no Storage

**Acesse:**
- Seu projeto Supabase → Storage → Buckets

**Crie um novo bucket:**
- Nome: `documentos-lotes`
- Privacidade: Público (para permitir acesso aos documentos)

### 2. Configurar RLS (Row Level Security) do Bucket

Caso o seu projeto use RLS, adicione as seguintes policies:

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
```

### 3. Atualizar banco SQL

Execute um dos comandos abaixo no SQL Editor do Supabase:

**Se a tabela já existe:**
```sql
ALTER TABLE lotes 
ADD COLUMN IF NOT EXISTS documento_url TEXT,
ADD COLUMN IF NOT EXISTS informacoes TEXT;
```

**Se estiver criando pela primeira vez:**
Use o arquivo `banco.sql` atualizado.

---

## 🎨 Interface

### Modal de Novo Lote (Screenshot de structure)

```
┌─────────────────────────────────────────┐
│  Novo Lote                              │
│───────────────────────────────────────────
│  Nome do Lote: [_________________]      │
│  Nº de Galinhas: [___________]          │
│  Data de Entrada: [__________]          │
│  Raça / Tipo: [_________________]       │
│  Informações Adicionais: [___________]  │
│  Anexar Documento: [Escolher arquivo]   │
│                    ✓ tipo.pdf           │
│                                         │
│  [Cancelar]  [💾 Salvar]                │
└─────────────────────────────────────────┘
```

### Card do Lote (com informações)

```
╔═════════════════════════════╗
║ 🐔 Lote A                   ║
║ Hy-Line Brown              ║
├─────────────────────────────┤
║ Galinhas     │ Entrada      ║
║ 2.000        │ 24/03/2026   ║
├─────────────────────────────┤
║ Total produzido            ║
║ 5.420 ovos                 ║
║ Mortalidade                ║
║ 12 aves                    ║
├─────────────────────────────┤
║ ℹ️ Informações:             ║
║ Lote saudável, boa         ║
║ produtividade              ║
├─────────────────────────────┤
║ 📎 Ver Documento           ║
│ ✏️ Editar Mortalidade       │
│ 🗑 Remover                  │
╚═════════════════════════════╝
```

---

## 🔒 Segurança e Considerações

1. **Tipos de arquivo aceitos**: PDF, DOCX, JPG, PNG
2. **Limite de arquivo**: Gerenciado pelo Supabase (padrão: 50MB)
3. **Nomeação**: Arquivos renomeados automaticamente com timestamp para evitar conflitos
4. **Acesso**: URLs públicas - qualquer pessoa com o link pode acessar

---

## 📱 Como Usar

### Para o Usuário Final

1. **Criar novo lote:**
   - Clique em "＋ Novo Lote"
   
2. **Preencher formulário:**
   - Nome, quantidade de galinhas, data, raça
   - *(Novo)* Adicione informações sobre o lote
   - *(Novo)* Anexe um documento (opcional)

3. **Salvar:**
   - Clique em "💾 Salvar"
   - Documento será enviado para a nuvem automaticamente

4. **Visualizar:**
   - No card do lote, basta clicar em "📎 Ver Documento"

---

## 🚀 Próximas Melhorias (Sugestões)

- [ ] Permitir múltiplos documentos por lote
- [ ] Editar informações e documentos de lotes existentes
- [ ] Visualização prévia de documentos no navegador
- [ ] Histórico de versões de documentos
- [ ] Integração com assinatura digital

---

## ✅ Checklist de Implementação

- [x] Adicionar colunas no banco de dados
- [x] Atualizar stored procedures/inserts
- [x] Criar interface de upload
- [x] Integrar com Supabase Storage
- [x] Exibir informações nos cards
- [ ] Criar bucket no Supabase (fazer manualmente)
- [ ] Executar querys SQL (fazer manualmente)
- [ ] Testar com dados reais

---

**Data:** 24/03/2026  
**Versão:** 2.1  
**Status:** Pronto para publicação
