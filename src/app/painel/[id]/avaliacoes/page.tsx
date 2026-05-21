'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import { api } from '@/lib/api';

interface Avaliacao {
  id: string;
  autor_nome: string | null;
  autor_unidade: string | null;
  contexto: string;
  nota: number;
  comentario: string | null;
  publicada: boolean;
  destaque: boolean;
  criado_em: string;
}

interface Stats { total: number; media: number | null; promotores: number; detratores: number; nps: number }

export default function AvaliacoesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RequireAuth><Avaliacoes condoId={id} /></RequireAuth>;
}

function Avaliacoes({ condoId }: { condoId: string }) {
  const [items, setItems] = useState<Avaliacao[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'todas' | 'pendentes' | 'publicadas'>('pendentes');

  const carregar = () => {
    setLoading(true);
    Promise.all([
      api.get<Avaliacao[]>(`/condominios/${condoId}/avaliacoes`),
      api.get<Stats>(`/condominios/${condoId}/avaliacoes/stats`),
    ])
    .then(([a, s]) => { setItems(a); setStats(s); })
    .catch(e => setErro(e.message))
    .finally(() => setLoading(false));
  };
  useEffect(carregar, [condoId]);

  const moderar = async (id: string, patch: Partial<Avaliacao>) => {
    try { await api.patch(`/condominios/${condoId}/avaliacoes/${id}`, patch); carregar(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Erro'); }
  };

  const filtrados = items.filter(a =>
    filtro === 'todas' ? true :
    filtro === 'pendentes' ? !a.publicada :
    a.publicada
  );

  const nps = stats?.nps ?? 0;
  const npsCor = nps > 50 ? 'from-green-500 to-emerald-600' : nps > 0 ? 'from-amber-500 to-orange-600' : 'from-red-500 to-rose-600';

  return (
    <div className="min-h-screen bg-surface-alt">
      <AppHeader subtitle="Avaliações & NPS" />

      <div className="pt-20">
        <div className="bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href={`/painel/${condoId}`} className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1 mb-3">
              ← Voltar ao condomínio
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">⭐</div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Avaliações & NPS</h1>
                <p className="text-white/80 text-sm">Modere o mural de agradecimentos e acompanhe a satisfação.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br ${npsCor} text-white rounded-2xl p-4`}>
              <div className="text-3xl font-bold">{nps}</div>
              <div className="text-xs text-white/80 uppercase tracking-wide">NPS</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white border border-border rounded-2xl p-4">
              <div className="text-3xl font-bold text-text">{stats.media || '–'}<span className="text-base text-text-muted"> /5</span></div>
              <div className="text-xs text-text-light uppercase tracking-wide">Nota média</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white border border-border rounded-2xl p-4">
              <div className="text-3xl font-bold text-green-600">{stats.promotores}</div>
              <div className="text-xs text-text-light uppercase tracking-wide">Promotores (4-5)</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white border border-border rounded-2xl p-4">
              <div className="text-3xl font-bold text-text">{stats.total}</div>
              <div className="text-xs text-text-light uppercase tracking-wide">Total de respostas</div>
            </motion.div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 mb-4">
          {(['pendentes', 'publicadas', 'todas'] as const).map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                filtro === f ? 'bg-primary text-white' : 'bg-white border border-border text-text-light hover:border-primary'
              }`}>
              {f} {f === 'pendentes' && <span className="ml-1 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px]">{items.filter(i => !i.publicada).length}</span>}
            </button>
          ))}
        </div>

        {erro && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{erro}</div>}

        {loading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-white border border-border rounded-2xl animate-pulse" />)}</div>}

        {!loading && filtrados.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <div className="text-5xl mb-3">⭐</div>
            <h2 className="text-lg font-bold text-text mb-1">Nenhuma avaliação {filtro !== 'todas' && filtro}</h2>
            <p className="text-sm text-text-light">As avaliações dos moradores aparecerão aqui para moderação.</p>
          </div>
        )}

        <div className="space-y-3">
          {filtrados.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              className="bg-white border border-border rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} className={n <= a.nota ? 'text-amber-400' : 'text-gray-200'}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-text-muted">
                    {a.autor_nome || 'Anônimo'}{a.autor_unidade && ` · ${a.autor_unidade}`}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-alt text-text-light capitalize">{a.contexto}</span>
                </div>
                <time className="text-xs text-text-muted">{new Date(a.criado_em).toLocaleDateString('pt-BR')}</time>
              </div>

              {a.comentario && <p className="text-sm text-text mb-3">{a.comentario}</p>}

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => moderar(a.id, { publicada: !a.publicada })}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                    a.publicada ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}>
                  {a.publicada ? '↓ Ocultar' : '✓ Publicar no mural'}
                </button>
                {a.publicada && (
                  <button
                    onClick={() => moderar(a.id, { destaque: !a.destaque })}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                      a.destaque ? 'bg-yellow-50 text-yellow-700' : 'bg-surface-alt text-text-light hover:bg-surface-hover'
                    }`}>
                    {a.destaque ? '★ Em destaque' : '☆ Destacar'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
