-- ============================================================
-- Fase 4 — Caronas (oferta/procura compartilhada entre moradores)
-- ============================================================

CREATE TYPE carona_tipo AS ENUM ('oferta', 'procura');

CREATE TABLE caronas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominio_id   UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  codigo          VARCHAR(20) NOT NULL UNIQUE,
  tipo            carona_tipo NOT NULL DEFAULT 'oferta',
  origem          VARCHAR(200) NOT NULL,
  destino         VARCHAR(200) NOT NULL,
  data_partida    DATE NOT NULL,
  horario         VARCHAR(10) NOT NULL,                     -- ex: "07:30"
  vagas           SMALLINT NOT NULL DEFAULT 1,
  recorrente      BOOLEAN NOT NULL DEFAULT false,           -- ex: ida diária ao trabalho
  valor           NUMERIC(10,2),                            -- divisão do combustível
  observacoes     TEXT,
  autor_nome      VARCHAR(120),
  autor_unidade   VARCHAR(50),
  autor_contato   VARCHAR(120),
  ativo           BOOLEAN NOT NULL DEFAULT true,
  publicado       BOOLEAN NOT NULL DEFAULT true,            -- síndico pode esconder se necessário
  ip_origem       VARCHAR(50),
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_caronas_condo ON caronas(condominio_id, data_partida);
CREATE INDEX idx_caronas_publico ON caronas(condominio_id, publicado, ativo, data_partida);
CREATE TRIGGER caronas_atualizado_em BEFORE UPDATE ON caronas
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
