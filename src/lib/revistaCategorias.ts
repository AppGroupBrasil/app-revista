export type Categoria =
  // existentes
  | 'mensagem_sindico' | 'realizacoes' | 'aquisicoes' | 'comunicados'
  | 'dicas' | 'telefones_uteis' | 'eventos' | 'galeria_imagens'
  | 'ocorrencias_finalizadas' | 'manutencoes_finalizadas'
  | 'sugestoes_reclamacoes_elogios'
  // novas
  | 'achados_perdidos' | 'agendamento_mudancas' | 'agendamento_reformas'
  | 'antes_depois' | 'avaliacoes' | 'boas_vindas' | 'benfeitorias'
  | 'capa_revista' | 'caronas_coletivas' | 'classificados'
  | 'conheca_sindico' | 'editorial' | 'enquetes_pesquisas'
  | 'espaco_morador' | 'espaco_kids' | 'financeiro' | 'gestao_funcionarios'
  | 'links' | 'mural_qrcodes' | 'mural_recados' | 'nossa_equipe'
  | 'obras_manutencao' | 'parceiros_convenios' | 'pets'
  | 'prestadores_servico' | 'publicidade_local' | 'qrcodes_publicos'
  | 'regras_regulamento' | 'saude_bemestar' | 'seguranca'
  | 'semana_condominio' | 'sustentabilidade';

export const CATEGORIAS: { id: Categoria; label: string; icone: string; cor: string }[] = [
  // Editorial / institucional
  { id: 'capa_revista',                  label: 'Capa da Revista',                icone: '📕', cor: 'from-[#1E3A5F] to-[#2A5A8F]' },
  { id: 'editorial',                     label: 'Editorial',                      icone: '✍️', cor: 'from-[#475569] to-[#334155]' },
  { id: 'mensagem_sindico',              label: 'Mensagem do Síndico',            icone: '📢', cor: 'from-[#1E3A5F] to-[#2A5A8F]' },
  { id: 'conheca_sindico',               label: 'Conheça o Síndico',              icone: '🤝', cor: 'from-[#0891B2] to-[#0E7490]' },
  { id: 'dicas',                         label: 'Dicas do Síndico',               icone: '💡', cor: 'from-[#EAB308] to-[#CA8A04]' },
  { id: 'boas_vindas',                   label: 'Boas-Vindas',                    icone: '👋', cor: 'from-[#10B981] to-[#059669]' },
  { id: 'nossa_equipe',                  label: 'Nossa Equipe',                   icone: '👥', cor: 'from-[#6366F1] to-[#4F46E5]' },

  // Gestão e operação
  { id: 'realizacoes',                   label: 'Realizações',                    icone: '🏆', cor: 'from-[#10B981] to-[#0D9488]' },
  { id: 'aquisicoes',                    label: 'Aquisições do Condomínio',       icone: '🛒', cor: 'from-[#0EA5E9] to-[#0284C7]' },
  { id: 'benfeitorias',                  label: 'Benfeitorias',                   icone: '🧱', cor: 'from-[#84CC16] to-[#65A30D]' },
  { id: 'obras_manutencao',              label: 'Obras e Manutenção',             icone: '🚧', cor: 'from-[#F97316] to-[#EA580C]' },
  { id: 'ocorrencias_finalizadas',       label: 'Ocorrências Finalizadas',        icone: '✅', cor: 'from-[#14B8A6] to-[#0F766E]' },
  { id: 'manutencoes_finalizadas',       label: 'Manutenções Finalizadas',        icone: '🔧', cor: 'from-[#06B6D4] to-[#0891B2]' },
  { id: 'antes_depois',                  label: 'Antes e Depois',                 icone: '🔄', cor: 'from-[#0EA5E9] to-[#0284C7]' },
  { id: 'financeiro',                    label: 'Financeiro',                     icone: '💰', cor: 'from-[#16A34A] to-[#15803D]' },
  { id: 'gestao_funcionarios',           label: 'Gestão de Funcionários',         icone: '👷', cor: 'from-[#14B8A6] to-[#0D9488]' },

  // Comunicação
  { id: 'comunicados',                   label: 'Comunicados Oficiais',           icone: '📣', cor: 'from-[#F59E0B] to-[#D97706]' },
  { id: 'mural_recados',                 label: 'Mural de Recados',               icone: '📌', cor: 'from-[#EF4444] to-[#DC2626]' },
  { id: 'sugestoes_reclamacoes_elogios', label: 'Sugestões, Reclamações e Elogios', icone: '💬', cor: 'from-[#3B82F6] to-[#2563EB]' },
  { id: 'avaliacoes',                    label: 'Avaliações',                     icone: '⭐', cor: 'from-[#FBBF24] to-[#F59E0B]' },
  { id: 'enquetes_pesquisas',            label: 'Enquetes e Pesquisas',           icone: '📊', cor: 'from-[#6366F1] to-[#4F46E5]' },

  // Convivência e eventos
  { id: 'eventos',                       label: 'Calendário de Eventos',          icone: '🎉', cor: 'from-[#EC4899] to-[#DB2777]' },
  { id: 'semana_condominio',             label: 'Semana do Condomínio',           icone: '🗓️', cor: 'from-[#A855F7] to-[#9333EA]' },
  { id: 'espaco_morador',                label: 'Espaço do Morador',              icone: '🏠', cor: 'from-[#0EA5E9] to-[#0284C7]' },
  { id: 'espaco_kids',                   label: 'Espaço Kids',                    icone: '🧒', cor: 'from-[#F472B6] to-[#EC4899]' },
  { id: 'pets',                          label: 'Pets',                           icone: '🐾', cor: 'from-[#F59E0B] to-[#D97706]' },
  { id: 'galeria_imagens',               label: 'Galeria de Imagens',             icone: '🖼️', cor: 'from-[#F97316] to-[#EA580C]' },

  // Serviços e parcerias
  { id: 'classificados',                 label: 'Classificados',                  icone: '🏷️', cor: 'from-[#F97316] to-[#EA580C]' },
  { id: 'caronas_coletivas',             label: 'Caronas Coletivas',              icone: '🚗', cor: 'from-[#8B5CF6] to-[#7C3AED]' },
  { id: 'parceiros_convenios',           label: 'Parceiros e Convênios',          icone: '🤝', cor: 'from-[#0891B2] to-[#0E7490]' },
  { id: 'prestadores_servico',           label: 'Prestadores de Serviço',         icone: '🛠️', cor: 'from-[#64748B] to-[#475569]' },
  { id: 'publicidade_local',             label: 'Publicidade Local',              icone: '📰', cor: 'from-[#F43F5E] to-[#E11D48]' },

  // Utilidades / suporte
  { id: 'telefones_uteis',               label: 'Telefones Úteis',                icone: '📞', cor: 'from-[#8B5CF6] to-[#7C3AED]' },
  { id: 'links',                         label: 'Links',                          icone: '🔗', cor: 'from-[#06B6D4] to-[#0891B2]' },
  { id: 'mural_qrcodes',                 label: 'Mural de QR Codes',              icone: '🔳', cor: 'from-[#1E293B] to-[#0F172A]' },
  { id: 'qrcodes_publicos',              label: 'QR Codes Públicos',              icone: '📱', cor: 'from-[#334155] to-[#1E293B]' },
  { id: 'achados_perdidos',              label: 'Achados e Perdidos',             icone: '🔍', cor: 'from-[#A3A3A3] to-[#737373]' },
  { id: 'agendamento_mudancas',          label: 'Agendamento de Mudanças',        icone: '📦', cor: 'from-[#FB923C] to-[#F97316]' },
  { id: 'agendamento_reformas',          label: 'Agendamento de Reformas',        icone: '🔨', cor: 'from-[#FB7185] to-[#F43F5E]' },

  // Diretrizes
  { id: 'regras_regulamento',            label: 'Regras e Regulamento',           icone: '📋', cor: 'from-[#475569] to-[#334155]' },
  { id: 'seguranca',                     label: 'Segurança',                      icone: '🛡️', cor: 'from-[#DC2626] to-[#B91C1C]' },
  { id: 'saude_bemestar',                label: 'Saúde e Bem-estar',              icone: '🩺', cor: 'from-[#22C55E] to-[#16A34A]' },
  { id: 'sustentabilidade',              label: 'Sustentabilidade',               icone: '🌱', cor: 'from-[#10B981] to-[#059669]' },
];

export const categoriaMap = Object.fromEntries(CATEGORIAS.map(c => [c.id, c])) as Record<Categoria, typeof CATEGORIAS[0]>;
