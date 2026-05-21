-- ============================================================
-- APP REVISTA — schema inicial (Fase 1)
-- Banco: apprevista (no supabase-db)
-- ============================================================
-- IDs de usuário (UUID) vem do auth-central — NÃO duplicar tabela usuarios aqui.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── ENUMs ───────────────────────────────────────────────────
CREATE TYPE perfil_condo AS ENUM ('sindico', 'administradora');
CREATE TYPE status_assinatura AS ENUM ('trial', 'ativa', 'inadimplente', 'cancelada');

-- ── CONDOMÍNIOS ─────────────────────────────────────────────
-- Cada cadastro de síndico/administradora cria um (ou vários) condomínios.
CREATE TABLE condominios (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dono_id           UUID NOT NULL,                     -- usuarios.id do auth-central
  perfil            perfil_condo NOT NULL,
  nome              VARCHAR(180) NOT NULL,
  endereco          TEXT,
  cnpj              VARCHAR(20),
  logo_url          VARCHAR(500),
  theme_color       VARCHAR(20) DEFAULT '#1E3A5F',
  accent_color      VARCHAR(20) DEFAULT '#D4AF37',
  status_assinatura status_assinatura NOT NULL DEFAULT 'trial',
  bloqueado         BOOLEAN NOT NULL DEFAULT false,    -- master controla
  bloqueado_motivo  TEXT,
  criado_em         TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_condominios_dono ON condominios(dono_id);
CREATE INDEX idx_condominios_status ON condominios(status_assinatura, bloqueado);

-- ── ADMINISTRADORAS (quando perfil = administradora, este registro detalha empresa) ─
CREATE TABLE administradoras (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dono_id           UUID NOT NULL UNIQUE,              -- usuarios.id
  razao_social      VARCHAR(180) NOT NULL,
  cnpj              VARCHAR(20) NOT NULL UNIQUE,
  logo_url          VARCHAR(500),
  criado_em         TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── VÍNCULO administradora ↔ condomínios geridos ────────────
CREATE TABLE administradora_condominios (
  administradora_id UUID NOT NULL REFERENCES administradoras(id) ON DELETE CASCADE,
  condominio_id     UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  criado_em         TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (administradora_id, condominio_id)
);

-- ── PROVISIONING LOG (auditoria de webhooks vindos do auth-central) ─
CREATE TABLE provisioning_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento            VARCHAR(50) NOT NULL,              -- licenca_criada, licenca_revogada, etc.
  usuario_id        UUID NOT NULL,
  payload           JSONB NOT NULL,
  processado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_provisioning_usuario ON provisioning_log(usuario_id);

-- ── trigger updated_at ──────────────────────────────────────
CREATE OR REPLACE FUNCTION set_atualizado_em() RETURNS TRIGGER AS $$
BEGIN NEW.atualizado_em = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER condominios_atualizado_em BEFORE UPDATE ON condominios
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
