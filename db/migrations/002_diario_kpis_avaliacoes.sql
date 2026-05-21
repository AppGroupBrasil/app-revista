-- ============================================================
-- Fase 3 — Diário de bordo, KPIs e Avaliações (NPS)
-- ============================================================

-- ── DIÁRIO DE BORDO ─────────────────────────────────────────
-- Posts cronológicos do dia-a-dia do condomínio (obras, manutenções, eventos).
CREATE TYPE post_categoria AS ENUM ('obra', 'manutencao', 'evento', 'aviso', 'conquista');

CREATE TABLE posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominio_id   UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  autor_id        UUID NOT NULL,                          -- usuarios.id do auth-central
  categoria       post_categoria NOT NULL DEFAULT 'aviso',
  titulo          VARCHAR(200) NOT NULL,
  descricao       TEXT,
  fotos           JSONB NOT NULL DEFAULT '[]'::jsonb,     -- ["url1","url2"]
  antes_depois    BOOLEAN NOT NULL DEFAULT false,         -- true = primeira foto = antes, segunda = depois
  publicado       BOOLEAN NOT NULL DEFAULT true,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_posts_condo ON posts(condominio_id, criado_em DESC);
CREATE INDEX idx_posts_categoria ON posts(categoria);
CREATE TRIGGER posts_atualizado_em BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- ── KPIS EM DESTAQUE ────────────────────────────────────────
-- Indicadores manuais que síndico/admin destaca na revista pública.
CREATE TABLE kpis (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominio_id   UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  rotulo          VARCHAR(100) NOT NULL,                  -- ex: "Chamados resolvidos em 48h"
  valor           VARCHAR(50) NOT NULL,                   -- ex: "92%", "12", "R$ 8.500"
  descricao       VARCHAR(200),                           -- subtítulo opcional
  icone           VARCHAR(10),                            -- emoji
  cor             VARCHAR(20) DEFAULT 'primary',          -- primary, success, warning, accent
  ordem           INTEGER NOT NULL DEFAULT 0,
  visivel         BOOLEAN NOT NULL DEFAULT true,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_kpis_condo ON kpis(condominio_id, ordem);
CREATE TRIGGER kpis_atualizado_em BEFORE UPDATE ON kpis
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- ── AVALIAÇÕES (NPS + mural de agradecimentos) ──────────────
-- Avaliações públicas após interação. Síndico modera antes de publicar no mural.
CREATE TYPE avaliacao_contexto AS ENUM ('chamado', 'evento', 'geral', 'funcionario');

CREATE TABLE avaliacoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominio_id   UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  autor_nome      VARCHAR(120),                           -- opcional (pode ser anônima)
  autor_unidade   VARCHAR(50),                            -- ex: "Apto 304"
  contexto        avaliacao_contexto NOT NULL DEFAULT 'geral',
  referencia_id   UUID,                                   -- id do chamado/evento se aplicável
  nota            SMALLINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario      TEXT,
  publicada       BOOLEAN NOT NULL DEFAULT false,         -- só aparece no mural após moderação
  destaque        BOOLEAN NOT NULL DEFAULT false,         -- aparece em posição privilegiada
  ip_origem       VARCHAR(50),                            -- anti-spam
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  moderado_em     TIMESTAMP,
  moderado_por    UUID                                    -- usuarios.id
);
CREATE INDEX idx_avaliacoes_condo ON avaliacoes(condominio_id, criado_em DESC);
CREATE INDEX idx_avaliacoes_publicada ON avaliacoes(condominio_id, publicada, destaque);
