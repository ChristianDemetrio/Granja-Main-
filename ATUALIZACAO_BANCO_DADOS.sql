-- =============================================================================
-- GranjaControl — Atualização de Banco de Dados
-- Adicionar suporte a Documentos e Informações nos Lotes
-- =============================================================================
-- Como usar:
--   1. Acesse seu projeto no Supabase
--   2. Vá em: SQL Editor → New query
--   3. Cole este conteúdo e clique em "Run"
-- =============================================================================

-- ============================================================
-- Adicionar colunas à tabela lotes (se não existirem)
-- ============================================================
ALTER TABLE IF EXISTS lotes
ADD COLUMN IF NOT EXISTS documento_url TEXT,
ADD COLUMN IF NOT EXISTS informacoes TEXT;

-- ============================================================
-- Comentários descritivos das colunas
-- ============================================================
COMMENT ON COLUMN lotes.documento_url IS 'URL pública do documento armazenado em Supabase Storage';
COMMENT ON COLUMN lotes.informacoes IS 'Informações adicionais sobre o lote';

-- ============================================================
-- Verificar que as colunas foram adicionadas com sucesso
-- ============================================================
-- Descomente a linha abaixo para verificar a estrutura da tabela:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'lotes' ORDER BY ordinal_position;
