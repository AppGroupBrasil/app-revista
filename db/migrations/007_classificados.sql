-- ============================================================
-- Fase 4 — Classificados (anúncios dos moradores com moderação)
-- ============================================================

CREATE TYPE classificado_tipo AS ENUM ('venda', 'aluguel', 'doacao', 'servico', 'outro');

CREATE TABLE classificados (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominio_id   UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  codigo          VARCHAR(20) NOT NULL UNIQUE,
  tipo            classificado_tipo NOT NULL DEFAULT 'venda',
  titulo          VARCHAR(200) NOT NULL,
  descricao       TEXT,
  preco           NUMERIC(12,2),
  fotos           JSONB NOT NULL DEFAULT '[]'::jsonb,
  autor_nome      VARCHAR(120),
  autor_unidade   VARCHAR(50),
  autor_contato   VARCHAR(120),                             -- whatsapp/email
  publicado       BOOLEAN NOT NULL DEFAULT false,           -- síndico modera
  ativo           BOOLEAN NOT NULL DEFAULT true,            -- morador pode desativar
  expira_em       TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  ip_origem       VARCHAR(50),
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_classificados_condo ON classificados(condominio_id, criado_em DESC);
CREATE INDEX idx_classificados_publico ON classificados(condominio_id, publicado, ativo, expira_em);
CREATE TRIGGER classificados_atualizado_em BEFORE UPDATE ON classificados
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
