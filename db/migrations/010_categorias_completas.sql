-- ============================================================
-- Fase 4 — Completar as 39 categorias prometidas no marketing
-- ============================================================
-- Adiciona ao enum secao_categoria as categorias ainda não suportadas.
-- ALTER TYPE ... ADD VALUE não pode rodar dentro de transação no PG <= 11
-- (no PG12+ rola, mas IF NOT EXISTS já é idempotente).

ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'achados_perdidos';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'agendamento_mudancas';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'agendamento_reformas';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'antes_depois';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'avaliacoes';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'boas_vindas';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'benfeitorias';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'capa_revista';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'caronas_coletivas';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'classificados';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'conheca_sindico';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'editorial';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'enquetes_pesquisas';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'espaco_morador';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'espaco_kids';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'financeiro';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'gestao_funcionarios';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'links';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'mural_qrcodes';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'mural_recados';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'nossa_equipe';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'obras_manutencao';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'parceiros_convenios';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'pets';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'prestadores_servico';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'publicidade_local';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'qrcodes_publicos';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'regras_regulamento';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'saude_bemestar';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'seguranca';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'semana_condominio';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'sustentabilidade';
