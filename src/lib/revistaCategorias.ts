export type Categoria =
  | 'mensagem_sindico' | 'realizacoes' | 'aquisicoes' | 'comunicados'
  | 'dicas' | 'telefones_uteis' | 'eventos' | 'galeria_imagens'
  | 'ocorrencias_finalizadas' | 'manutencoes_finalizadas'
  | 'sugestoes_reclamacoes_elogios';

export const CATEGORIAS: { id: Categoria; label: string; icone: string; cor: string }[] = [
  { id: 'mensagem_sindico',        label: 'Mensagem do Síndico',           icone: '📢', cor: 'from-[#1E3A5F] to-[#2A5A8F]' },
  { id: 'realizacoes',             label: 'Realizações',                   icone: '🏆', cor: 'from-[#10B981] to-[#0D9488]' },
  { id: 'aquisicoes',              label: 'Aquisições',                    icone: '🛒', cor: 'from-[#0EA5E9] to-[#0284C7]' },
  { id: 'ocorrencias_finalizadas', label: 'Ocorrências Finalizadas',       icone: '✅', cor: 'from-[#14B8A6] to-[#0F766E]' },
  { id: 'manutencoes_finalizadas', label: 'Manutenções Finalizadas',       icone: '🔧', cor: 'from-[#06B6D4] to-[#0891B2]' },
  { id: 'comunicados',             label: 'Comunicados',                   icone: '📣', cor: 'from-[#F59E0B] to-[#D97706]' },
  { id: 'dicas',                   label: 'Dicas',                         icone: '💡', cor: 'from-[#EAB308] to-[#CA8A04]' },
  { id: 'telefones_uteis',         label: 'Telefones Úteis',               icone: '📞', cor: 'from-[#8B5CF6] to-[#7C3AED]' },
  { id: 'eventos',                 label: 'Eventos',                       icone: '🎉', cor: 'from-[#EC4899] to-[#DB2777]' },
  { id: 'galeria_imagens',         label: 'Galeria de Imagens',            icone: '🖼️', cor: 'from-[#F97316] to-[#EA580C]' },
  { id: 'sugestoes_reclamacoes_elogios', label: 'Sugestões, Reclamações e Elogios', icone: '💬', cor: 'from-[#3B82F6] to-[#2563EB]' },
];

export const categoriaMap = Object.fromEntries(CATEGORIAS.map(c => [c.id, c])) as Record<Categoria, typeof CATEGORIAS[0]>;
