-- =============================================================================
-- GranjaControl — Atualização de Segurança: Login obrigatório (Supabase Auth)
-- =============================================================================
-- Antes desta atualização, as tabelas estavam liberadas para qualquer pessoa
-- com a URL/chave do projeto (RLS com USING (true)). Isso foi corrigido: agora
-- só usuários autenticados podem ler/gravar dados.
--
-- Como usar:
--   1. Acesse seu projeto no Supabase
--   2. Vá em Authentication → Users → Add user, e crie um usuário
--      (e-mail + senha) para você (e para quem mais for usar o app)
--   3. Vá em SQL Editor → New query
--   4. Cole este conteúdo e clique em "Run"
--   5. Recomendado: gere uma nova "anon public key" em Project Settings → API
--      e atualize supabase.config.js, já que a chave antiga foi exposta
--      publicamente (README/repo) sem RLS restritivo.
-- =============================================================================

ALTER TABLE lotes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE producao    ENABLE ROW LEVEL SECURITY;
ALTER TABLE saidas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas    ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortalidade ENABLE ROW LEVEL SECURITY;

-- Remove as policies antigas de acesso público (e quaisquer versões já aplicadas)
DROP POLICY IF EXISTS "acesso_publico_lotes" ON lotes;
DROP POLICY IF EXISTS "acesso_publico_producao" ON producao;
DROP POLICY IF EXISTS "acesso_publico_saidas" ON saidas;
DROP POLICY IF EXISTS "acesso_publico_despesas" ON despesas;
DROP POLICY IF EXISTS "acesso_publico_mortalidade" ON mortalidade;
DROP POLICY IF EXISTS "acesso_autenticado_lotes" ON lotes;
DROP POLICY IF EXISTS "acesso_autenticado_producao" ON producao;
DROP POLICY IF EXISTS "acesso_autenticado_saidas" ON saidas;
DROP POLICY IF EXISTS "acesso_autenticado_despesas" ON despesas;
DROP POLICY IF EXISTS "acesso_autenticado_mortalidade" ON mortalidade;

-- Cria policies restritas a usuários logados
CREATE POLICY "acesso_autenticado_lotes"        ON lotes        FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "acesso_autenticado_producao"     ON producao     FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "acesso_autenticado_saidas"       ON saidas       FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "acesso_autenticado_despesas"     ON despesas     FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "acesso_autenticado_mortalidade"  ON mortalidade  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE (bucket "documentos-lotes", usado no upload de documentos de lote)
-- Se o bucket já existir e estiver com política pública de escrita,
-- ajuste manualmente em Storage → documentos-lotes → Policies para
-- exigir "authenticated" também no upload (o painel do Supabase
-- gera esse SQL automaticamente ao criar a policy pela interface).
-- ============================================================
