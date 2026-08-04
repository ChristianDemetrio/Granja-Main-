-- =============================================================================
-- GranjaControl — Atualização: Rentabilidade por Lote
-- =============================================================================
-- Permite vincular uma despesa (ração, vacina, etc.) a um lote específico.
-- Despesas sem lote_id continuam sendo tratadas como custo geral da granja
-- e são rateadas proporcionalmente entre os lotes na tela de Lotes.
--
-- Como usar:
--   1. Acesse seu projeto no Supabase
--   2. Vá em SQL Editor → New query
--   3. Cole este conteúdo e clique em "Run"
-- =============================================================================

ALTER TABLE IF EXISTS despesas
ADD COLUMN IF NOT EXISTS lote_id BIGINT REFERENCES lotes(id) ON DELETE SET NULL;

COMMENT ON COLUMN despesas.lote_id IS 'Lote ao qual a despesa pertence (opcional); NULL = despesa geral da granja, rateada entre os lotes';

CREATE INDEX IF NOT EXISTS idx_despesas_lote_id ON despesas(lote_id);
