-- ============================================================
-- Fase 4 — Funcionários, tarefas e vistorias com QR Code
-- ============================================================

CREATE TABLE funcionarios (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominio_id   UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  nome            VARCHAR(150) NOT NULL,
  cargo           VARCHAR(120),
  contato         VARCHAR(120),
  foto_url        VARCHAR(500),
  ativo           BOOLEAN NOT NULL DEFAULT true,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_funcionarios_condo ON funcionarios(condominio_id, ativo);
CREATE TRIGGER funcionarios_atualizado_em BEFORE UPDATE ON funcionarios
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TYPE tarefa_tipo AS ENUM ('tarefa', 'checklist', 'vistoria');
CREATE TYPE tarefa_freq AS ENUM ('unica', 'diaria', 'semanal', 'mensal');

CREATE TABLE tarefas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominio_id   UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  funcionario_id  UUID REFERENCES funcionarios(id) ON DELETE SET NULL,
  tipo            tarefa_tipo NOT NULL DEFAULT 'tarefa',
  titulo          VARCHAR(200) NOT NULL,
  descricao       TEXT,
  local           VARCHAR(200),
  frequencia      tarefa_freq NOT NULL DEFAULT 'unica',
  checklist       JSONB NOT NULL DEFAULT '[]'::jsonb,       -- ["item 1","item 2"]
  qr_token        VARCHAR(32) NOT NULL UNIQUE,              -- nanoid público para scan
  proximo_em      TIMESTAMP,
  ativo           BOOLEAN NOT NULL DEFAULT true,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tarefas_condo ON tarefas(condominio_id, ativo);
CREATE INDEX idx_tarefas_qr ON tarefas(qr_token);
CREATE TRIGGER tarefas_atualizado_em BEFORE UPDATE ON tarefas
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TABLE tarefa_execucoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarefa_id       UUID NOT NULL REFERENCES tarefas(id) ON DELETE CASCADE,
  condominio_id   UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
  funcionario_id  UUID REFERENCES funcionarios(id) ON DELETE SET NULL,
  executor_nome   VARCHAR(150),                             -- caso preenchimento manual
  itens_marcados  JSONB NOT NULL DEFAULT '[]'::jsonb,       -- [0,2,3] índices marcados do checklist
  fotos           JSONB NOT NULL DEFAULT '[]'::jsonb,
  observacoes     TEXT,
  executado_em    TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_origem       VARCHAR(50)
);
CREATE INDEX idx_execucoes_tarefa ON tarefa_execucoes(tarefa_id, executado_em DESC);
CREATE INDEX idx_execucoes_condo ON tarefa_execucoes(condominio_id, executado_em DESC);
