-- ============================================================
-- Cache local de usuários (id, email, nome) populado a partir do JWT.
-- Necessário para notificações por email, já que dados do usuário
-- vivem no auth-central e não temos cross-database aqui.
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios_cache (
  id              UUID PRIMARY KEY,                       -- usuarios.id do auth-central
  email           VARCHAR(180) NOT NULL,
  nome            VARCHAR(180) NOT NULL,
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_usuarios_cache_email ON usuarios_cache(email);
