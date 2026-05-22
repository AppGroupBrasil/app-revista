-- ============================================================
-- Fase 4 — Chamados (kanban + abertura via QR Code)
-- ============================================================

CREATE TYPE chamado_status AS ENUM ('aberto', 'em_andamento', 'resolvido', 'problema');
CREATE TYPE chamado_prioridade AS ENUM ('baixa', 'media', 'alta', 'urgente');

CREATE TABLE chamados (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominio_id   UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  codigo          VARCHAR(20) NOT NULL UNIQUE,              -- nanoid público para tracking
  categoria       VARCHAR(50) NOT NULL,                     -- manutencao, limpeza, seguranca, infra, outro
  titulo          VARCHAR(200) NOT NULL,
  descricao       TEXT,
  status          chamado_status NOT NULL DEFAULT 'aberto',
  prioridade      chamado_prioridade NOT NULL DEFAULT 'media',
  autor_nome      VARCHAR(120),
  autor_unidade   VARCHAR(50),
  autor_contato   VARCHAR(120),                             -- telefone/email opcional
  fotos           JSONB NOT NULL DEFAULT '[]'::jsonb,
  resposta        TEXT,                                     -- atualização visível ao morador
  resolvido_em    TIMESTAMP,
  ip_origem       VARCHAR(50),
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_chamados_condo ON chamados(condominio_id, criado_em DESC);
CREATE INDEX idx_chamados_status ON chamados(condominio_id, status);
CREATE INDEX idx_chamados_codigo ON chamados(codigo);
CREATE TRIGGER chamados_atualizado_em BEFORE UPDATE ON chamados
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
