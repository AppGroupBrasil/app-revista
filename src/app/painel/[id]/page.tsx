'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import { api } from '@/lib/api';

interface Condominio {
  id: string;
  perfil: 'sindico' | 'administradora';
  nome: string;
  endereco: string | null;
  cnpj: string | null;
  status_assinatura: string;
  bloqueado: boolean;
  bloqueado_motivo: string | null;
  criado_em: string;
}

interface Modulo { titulo: string; desc: string; icon: string; cor: string; href: (id: string) => string | null }
const modulos: Modulo[] = [
  { titulo: 'Diário do Condomínio',  desc: 'Obras, manutenções, eventos do dia-a-dia',  icon: '📔', cor: 'from-[#10B981] to-[#0D9488]', href: id => `/painel/${id}/diario` },
  { titulo: 'KPIs em Destaque', desc: 'Indicadores que provam o valor entregue',   icon: '📊', cor: 'from-[#F59E0B] to-[#D97706]', href: id => `/painel/${id}/kpis` },
  { titulo: 'Avaliações & NPS', desc: 'Mural de agradecimentos e moderação',       icon: '⭐', cor: 'from-[#EC4899] to-[#DB2777]', href: id => `/painel/${id}/avaliacoes` },
  { titulo: 'Revista Digital',  desc: 'Edições, seções e conteúdo',                icon: '📖', cor: 'from-[#1E3A5F] to-[#2A5A8F]', href: () => null },
  { titulo: 'Chamados',         desc: 'Solicitações dos moradores',                icon: '🔧', cor: 'from-[#0EA5E9] to-[#0284C7]', href: () => null },
  { titulo: 'Classificados',    desc: 'Anúncios dos moradores',                    icon: '🏷️', cor: 'from-[#F97316] to-[#EA580C]', href: () => null },
  { titulo: 'Caronas',          desc: 'Caronas compartilhadas',                    icon: '🚗', cor: 'from-[#8B5CF6] to-[#7C3AED]', href: () => null },
  { titulo: 'Funcionários',     desc: 'Tarefas, checklists, vistorias',            icon: '👷', cor: 'from-[#14B8A6] to-[#0D9488]', href: () => null },
];

export default function CondoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RequireAuth><Detail id={id} /></RequireAuth>;
}

function Detail({ id }: { id: string }) {
  const [c, setC] = useState<Condominio | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api.get<Condominio>(`/condominios/${id}`)
      .then(setC)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const iniciais = (c?.nome || '?').split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-surface-alt">
      <AppHeader subtitle="Painel do Síndico" />

      <div className="pt-20">
        <div className="bg-gradient-to-r from-primary to-primary-light text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/painel" className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1 mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </Link>
            {loading && <div className="text-white/70">Carregando…</div>}
            {c && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border border-white/20">
                  {iniciais}
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold">{c.nome}</h1>
                  {c.endereco && <p className="text-white/70 text-sm">{c.endereco}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs capitalize">
                    {c.perfil === 'sindico' ? '👤 Síndico' : '🏛 Administradora'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    c.status_assinatura === 'ativa' ? 'bg-green-500/20 text-green-100' :
                    c.status_assinatura === 'inadimplente' ? 'bg-amber-500/20 text-amber-100' :
                    c.status_assinatura === 'cancelada' ? 'bg-red-500/20 text-red-100' :
                    'bg-white/10 text-white'
                  }`}>
                    {c.status_assinatura}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
            {erro}
          </div>
        )}

        {c?.bloqueado && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white"
          >
            <div className="font-bold text-lg mb-1">⛔ Condomínio bloqueado</div>
            {c.bloqueado_motivo && <div className="text-white/90 text-sm">{c.bloqueado_motivo}</div>}
            <p className="text-xs text-white/70 mt-2">Entre em contato com o administrador para regularizar.</p>
          </motion.div>
        )}

        <h2 className="text-xl font-bold text-text mb-1">Módulos</h2>
        <p className="text-sm text-text-light mb-6">Acesse os recursos disponíveis para este condomínio.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulos.map((m, i) => {
            const href = m.href(id);
            const inner = (
              <>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.cor} flex items-center justify-center text-xl text-white mb-3`}>
                  {m.icon}
                </div>
                <h3 className="font-bold text-text mb-1">{m.titulo}</h3>
                <p className="text-sm text-text-light">{m.desc}</p>
                {!href && <span className="text-xs text-text-muted mt-3 inline-block px-2 py-0.5 bg-surface-alt rounded-full">Em breve</span>}
              </>
            );
            return (
              <motion.div
                key={m.titulo}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              >
                {href ? (
                  <Link href={href} className="block bg-white border border-border rounded-2xl p-5 card-hover hover:shadow-md transition">{inner}</Link>
                ) : (
                  <div className="bg-white border border-border rounded-2xl p-5 opacity-60 cursor-not-allowed">{inner}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
