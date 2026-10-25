-- =============================================================================
-- GranjaControl — Atualização: Controle de Ração (estoque + consumo diário)
-- =============================================================================
-- 1. A despesa de categoria "Ração" ganha campos extras: tipo (Inicial,
--    Crescimento ou Poedeira), peso comprado (kg) e valor por quilo — isso
--    funciona como "entrada" no estoque de ração.
-- 2. Uma nova tabela registra o fornecimento diário de ração por lote — isso
--    funciona como "saída" do estoque de ração, e permite calcular a
--    conversão alimentar (kg de ração por dúzia de ovos) e o custo real de
--    ração por lote.
-- 3. A data de nascimento/eclosão do lote é usada para calcular idade e
--    estimar a necessidade diária de ração.
--
-- Como usar:
--   1. Acesse seu projeto no Supabase
--   2. Vá em SQL Editor → New query
--   3. Cole este conteúdo e clique em "Run"
-- =============================================================================

ALTER TABLE IF EXISTS despesas
  ADD COLUMN IF NOT EXISTS racao_tipo     TEXT,
  ADD COLUMN IF NOT EXISTS racao_peso_kg  NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS racao_valor_kg NUMERIC(10,4);

ALTER TABLE IF EXISTS lotes
  ADD COLUMN IF NOT EXISTS data_nascimento DATE;

COMMENT ON COLUMN lotes.data_nascimento IS 'Data de nascimento/eclosão das aves, usada no cálculo da idade e necessidade diária de ração';

COMMENT ON COLUMN despesas.racao_tipo IS 'Tipo de ração comprada: Inicial, Crescimento ou Poedeira (só quando cat = Ração)';
COMMENT ON COLUMN despesas.racao_peso_kg IS 'Peso total comprado em kg (entrada no estoque de ração)';
COMMENT ON COLUMN despesas.racao_valor_kg IS 'Valor pago por quilo nessa compra';

CREATE TABLE IF NOT EXISTS racao_consumo (
  id            BIGSERIAL     PRIMARY KEY,
  data          DATE          NOT NULL,
  lote_id       BIGINT        NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  tipo          TEXT          NOT NULL CHECK (tipo IN ('Inicial','Crescimento','Poedeira')),
  quantidade_kg NUMERIC(10,2) NOT NULL CHECK (quantidade_kg > 0),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

ALTER TABLE racao_consumo ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "acesso_autenticado_racao_consumo" ON racao_consumo;
CREATE POLICY "acesso_autenticado_racao_consumo" ON racao_consumo FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_racao_consumo_data     ON racao_consumo(data);
CREATE INDEX IF NOT EXISTS idx_racao_consumo_lote_id  ON racao_consumo(lote_id);
CREATE INDEX IF NOT EXISTS idx_racao_consumo_tipo     ON racao_consumo(tipo);
