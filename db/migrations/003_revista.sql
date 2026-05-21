-- ============================================================
-- Fase 4 — Revista Digital
-- ============================================================

CREATE TYPE secao_categoria AS ENUM (
  'mensagem_sindico',
  'realizacoes',
  'aquisicoes',
  'comunicados',
  'dicas',
  'telefones_uteis',
  'eventos',
  'galeria_imagens'
);

-- ── EDIÇÕES da revista (por condomínio + mês/ano) ──────────────
CREATE TABLE edicoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominio_id   UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  numero          INTEGER NOT NULL,                       -- sequencial por condomínio
  titulo          VARCHAR(180) NOT NULL,
  mes             VARCHAR(20),                            -- "Maio"
  ano             INTEGER,
  capa_url        VARCHAR(500),
  theme_color     VARCHAR(20) DEFAULT '#1E3A5F',
  accent_color    VARCHAR(20) DEFAULT '#D4AF37',
  publicada       BOOLEAN NOT NULL DEFAULT false,
  publicada_em    TIMESTAMP,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(condominio_id, numero)
);
CREATE INDEX idx_edicoes_condo ON edicoes(condominio_id, criado_em DESC);
CREATE INDEX idx_edicoes_publicada ON edicoes(condominio_id, publicada);
CREATE TRIGGER edicoes_atualizado_em BEFORE UPDATE ON edicoes
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- ── SEÇÕES de cada edição ──────────────────────────────────────
CREATE TABLE secoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edicao_id       UUID NOT NULL REFERENCES edicoes(id) ON DELETE CASCADE,
  categoria       secao_categoria NOT NULL,
  titulo          VARCHAR(200) NOT NULL,
  conteudo        TEXT,
  fotos           JSONB NOT NULL DEFAULT '[]'::jsonb,
  dados           JSONB DEFAULT '{}'::jsonb,              -- campos extras (telefones, datas de eventos, etc.)
  ordem           INTEGER NOT NULL DEFAULT 0,
  visivel         BOOLEAN NOT NULL DEFAULT true,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_secoes_edicao ON secoes(edicao_id, ordem);
CREATE INDEX idx_secoes_categoria ON secoes(categoria);
CREATE TRIGGER secoes_atualizado_em BEFORE UPDATE ON secoes
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- ── PARCEIROS / fornecedores / prestadores ─────────────────────
-- Vinculados ao condomínio (não à edição) — aparecem em todas as edições.
CREATE TYPE parceiro_tipo AS ENUM ('fornecedor', 'parceiro', 'prestador');

CREATE TABLE parceiros (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominio_id   UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  tipo            parceiro_tipo NOT NULL DEFAULT 'parceiro',
  nome            VARCHAR(150) NOT NULL,
  descricao       VARCHAR(300),
  categoria       VARCHAR(80),                            -- texto livre: "Eletricista", "Padaria", etc.
  logo_url        VARCHAR(500),
  telefone        VARCHAR(30),
  whatsapp        VARCHAR(30),
  link            VARCHAR(500),
  destaque        BOOLEAN NOT NULL DEFAULT false,
  ordem           INTEGER NOT NULL DEFAULT 0,
  ativo           BOOLEAN NOT NULL DEFAULT true,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_parceiros_condo ON parceiros(condominio_id, ativo, ordem);
CREATE TRIGGER parceiros_atualizado_em BEFORE UPDATE ON parceiros
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
