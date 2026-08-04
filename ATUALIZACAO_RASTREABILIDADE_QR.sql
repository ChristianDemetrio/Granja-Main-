-- =============================================================================
-- GranjaControl — Atualização: Rastreabilidade por QR Code ("do ninho à mesa")
-- =============================================================================
-- Cria uma VIEW pública somente leitura com os dados que podem ser mostrados
-- para o consumidor final ao escanear o QR Code na caixa de ovos: nome do
-- lote, raça, data de entrada do lote, informações de criação e o total
-- coletado/quebrado em uma data específica.
--
-- Importante: a view NÃO expõe despesas, mortalidade, e-mail/usuários ou
-- qualquer outro dado sensível — só os campos abaixo. As tabelas originais
-- (lotes, producao, despesas, mortalidade, saidas) continuam protegidas por
-- RLS e exigindo login, como configurado em ATUALIZACAO_AUTH_RLS.sql.
--
-- Como usar:
--   1. Acesse seu projeto no Supabase
--   2. Vá em SQL Editor → New query
--   3. Cole este conteúdo e clique em "Run"
-- =============================================================================

CREATE OR REPLACE VIEW rastreio_publico AS
SELECT
  l.id                          AS lote_id,
  l.nome                        AS lote_nome,
  l.raca,
  l.data                        AS lote_data_entrada,
  l.informacoes,
  p.data                        AS producao_data,
  COALESCE(SUM(p.ovos), 0)      AS ovos_coletados,
  COALESCE(SUM(p.quebrados), 0) AS ovos_quebrados
FROM lotes l
LEFT JOIN producao p ON p.lote_id = l.id
GROUP BY l.id, l.nome, l.raca, l.data, l.informacoes, p.data;

-- Libera leitura da view (não das tabelas) para visitantes não autenticados
-- e também para usuários logados.
GRANT SELECT ON rastreio_publico TO anon;
GRANT SELECT ON rastreio_publico TO authenticated;
