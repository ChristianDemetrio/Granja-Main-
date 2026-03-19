-- =============================================================================
-- GranjaControl — Script de criação das tabelas no Supabase
-- =============================================================================
-- Como usar:
--   1. Acesse seu projeto no Supabase
--   2. Vá em: SQL Editor → New query
--   3. Cole todo este conteúdo e clique em "Run"
-- =============================================================================


-- ============================================================
-- TABELA: lotes
-- Cadastro dos lotes de galinhas
-- ============================================================
CREATE TABLE IF NOT EXISTS lotes (
  id         BIGSERIAL   PRIMARY KEY,
  nome       TEXT        NOT NULL,
  galinhas   INTEGER     NOT NULL CHECK (galinhas > 0),
  data       DATE        NOT NULL,
  raca       TEXT        NOT NULL DEFAULT 'Não informada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: producao
-- Registro diário de coleta de ovos por lote
-- ============================================================
CREATE TABLE IF NOT EXISTS producao (
  id         BIGSERIAL   PRIMARY KEY,
  data       DATE        NOT NULL,
  lote_id    BIGINT      NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  ovos       INTEGER     NOT NULL CHECK (ovos >= 0),
  quebrados  INTEGER     NOT NULL DEFAULT 0 CHECK (quebrados >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: saidas
-- Saídas do estoque de ovos (vendas, perdas, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS saidas (
  id         BIGSERIAL   PRIMARY KEY,
  data       DATE        NOT NULL,
  qtd        INTEGER     NOT NULL CHECK (qtd > 0),
  descricao  TEXT        NOT NULL DEFAULT 'Saída',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: despesas
-- Custos operacionais da granja
-- ============================================================
CREATE TABLE IF NOT EXISTS despesas (
  id         BIGSERIAL   PRIMARY KEY,
  data       DATE        NOT NULL,
  cat        TEXT        NOT NULL DEFAULT 'Outros',
  descricao  TEXT        NOT NULL,
  valor      NUMERIC(10,2) NOT NULL CHECK (valor > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: mortalidade
-- Registro de mortalidade de aves por lote
-- ============================================================
CREATE TABLE IF NOT EXISTS mortalidade (
  id         BIGSERIAL   PRIMARY KEY,
  lote_id    BIGINT      NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  data       DATE        NOT NULL,
  quantidade INTEGER     NOT NULL CHECK (quantidade > 0),
  motivo     TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Ativa segurança básica nas tabelas (acesso público de leitura
-- e escrita — sem autenticação, conforme configurado)
-- ============================================================
ALTER TABLE lotes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE producao    ENABLE ROW LEVEL SECURITY;
ALTER TABLE saidas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas    ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortalidade ENABLE ROW LEVEL SECURITY;

-- Permite SELECT, INSERT, UPDATE, DELETE para todos (anon)
-- Remove policies antigas se existirem
DROP POLICY IF EXISTS "acesso_publico_lotes" ON lotes;
DROP POLICY IF EXISTS "acesso_publico_producao" ON producao;
DROP POLICY IF EXISTS "acesso_publico_saidas" ON saidas;
DROP POLICY IF EXISTS "acesso_publico_despesas" ON despesas;
DROP POLICY IF EXISTS "acesso_publico_mortalidade" ON mortalidade;

-- Cria novas policies
CREATE POLICY "acesso_publico_lotes"        ON lotes        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acesso_publico_producao"     ON producao     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acesso_publico_saidas"       ON saidas       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acesso_publico_despesas"     ON despesas     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acesso_publico_mortalidade"  ON mortalidade  FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
-- ÍNDICES para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_producao_data       ON producao(data);
CREATE INDEX IF NOT EXISTS idx_producao_lote_id    ON producao(lote_id);
CREATE INDEX IF NOT EXISTS idx_saidas_data         ON saidas(data);
CREATE INDEX IF NOT EXISTS idx_despesas_data       ON despesas(data);
CREATE INDEX IF NOT EXISTS idx_mortalidade_lote_id ON mortalidade(lote_id);
CREATE INDEX IF NOT EXISTS idx_mortalidade_data    ON mortalidade(data);


-- ============================================================
-- DADOS DE EXEMPLO (opcional — remova se não quiser)
-- ============================================================
INSERT INTO lotes (nome, galinhas, data, raca) VALUES
  ('Lote A', 1800, '2025-06-01', 'Hy-Line Brown'),
  ('Lote B', 2100, '2025-08-15', 'Dekalb White'),
  ('Lote C', 1600, '2025-10-20', 'ISA Brown'),
  ('Lote D',  900, '2026-01-05', 'Hy-Line W-36')
ON CONFLICT DO NOTHING;
