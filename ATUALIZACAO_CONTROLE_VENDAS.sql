-- =============================================================================
-- GranjaControl — Atualização: Controle de Vendas (clientes + vendas)
-- =============================================================================
-- Cria o cadastro de clientes e uma tabela de vendas de verdade (com status
-- pago/pendente), substituindo o antigo hack de registrar receita dentro de
-- "despesas" com o prefixo "Receita:". Esse hack continua funcionando para
-- dados antigos (não é apagado), mas novas vendas passam a usar esta tabela.
--
-- Como usar:
--   1. Acesse seu projeto no Supabase
--   2. Vá em SQL Editor → New query
--   3. Cole este conteúdo e clique em "Run"
-- =============================================================================

-- ============================================================
-- TABELA: clientes
-- ============================================================
CREATE TABLE IF NOT EXISTS clientes (
  id         BIGSERIAL   PRIMARY KEY,
  nome       TEXT        NOT NULL,
  contato    TEXT,
  tipo       TEXT        NOT NULL DEFAULT 'Avulso',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: vendas
-- ============================================================
CREATE TABLE IF NOT EXISTS vendas (
  id              BIGSERIAL     PRIMARY KEY,
  data            DATE          NOT NULL,
  cliente_id      BIGINT        REFERENCES clientes(id) ON DELETE SET NULL,
  qtd             INTEGER       NOT NULL CHECK (qtd > 0),
  preco_duzia     NUMERIC(10,2),
  valor_total     NUMERIC(10,2) NOT NULL CHECK (valor_total >= 0),
  forma_pagamento TEXT          NOT NULL DEFAULT 'Dinheiro',
  status          TEXT          NOT NULL DEFAULT 'pago' CHECK (status IN ('pago','pendente')),
  descricao       TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "acesso_autenticado_clientes" ON clientes;
DROP POLICY IF EXISTS "acesso_autenticado_vendas" ON vendas;

CREATE POLICY "acesso_autenticado_clientes" ON clientes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "acesso_autenticado_vendas"   ON vendas   FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_vendas_data       ON vendas(data);
CREATE INDEX IF NOT EXISTS idx_vendas_cliente_id ON vendas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_vendas_status     ON vendas(status);
CREATE INDEX IF NOT EXISTS idx_clientes_nome     ON clientes(nome);
