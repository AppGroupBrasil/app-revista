-- Adiciona 2 novas categorias ao enum existente
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'ocorrencias_finalizadas';
ALTER TYPE secao_categoria ADD VALUE IF NOT EXISTS 'manutencoes_finalizadas';
