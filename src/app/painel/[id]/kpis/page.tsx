'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import { api } from '@/lib/api';

interface Kpi {
  id: string;
  rotulo: string;
  valor: string;
  descricao: string | null;
  icone: string | null;
  cor: string;
  ordem: number;
  visivel: boolean;
}

const cores: Record<string, string> = {
  primary: 'from-[#1E3A5F] to-[#2A5A8F]',
  success: 'from-green-500 to-emerald-600',
  warning: 'from-amber-500 to-orange-600',
  accent:  'from-[#D4AF37] to-[#CA8A04]',
  rose:    'from-rose-500 to-pink-600',
  sky:     'from-sky-500 to-cyan-600',
};

export default function KpisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RequireAuth><Kpis condoId={id} /></RequireAuth>;
}

function Kpis({ condoId }: { condoId: string }) {
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [editing, setEditing] = useState<Kpi | null>(null);
  const [showForm, setShowForm] = useState(false);

  const carregar = () => {
    setLoading(true);
    api.get<Kpi[]>(`/condominios/${condoId}/kpis`)
      .then(setKpis)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(carregar, [condoId]);

  const remover = async (id: string) => {
    if (!confirm('Remover este KPI?')) return;
    try { await api.delete(`/condominios/${condoId}/kpis/${id}`); carregar(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Erro'); }
  };

  const toggleVisivel = async (k: Kpi) => {
    try { await api.patch(`/condominios/${condoId}/kpis/${k.id}`, { visivel: !k.visivel }); carregar(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Erro'); }
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      <AppHeader subtitle="KPIs em Destaque" />

      <div className="pt-20">
        <div className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href={`/painel/${condoId}`} className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1 mb-3">
              ← Voltar ao condomínio
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">📊</div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">KPIs em Destaque</h1>
                <p className="text-white/80 text-sm">Indicadores que aparecem na revista e provam o valor entregue.</p>
              </div>
              <button onClick={() => { setEditing(null); setShowForm(true); }}
                className="px-5 py-2.5 bg-white text-amber-700 text-sm font-semibold rounded-xl hover:shadow-lg transition">
                + Novo KPI
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {erro && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{erro}</div>}

        {loading && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-white border border-border rounded-2xl animate-pulse" />)}</div>}

        {!loading && kpis.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <div className="text-5xl mb-3">📊</div>
            <h2 className="text-lg font-bold text-text mb-1">Nenhum KPI ainda</h2>
            <p className="text-sm text-text-light mb-5">Crie indicadores como "92% chamados resolvidos em 48h" ou "12 obras este ano".</p>
            <button onClick={() => { setEditing(null); setShowForm(true); }}
              className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover">
              + Criar Primeiro KPI
            </button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((k, i) => (
            <motion.div
              key={k.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`relative rounded-2xl p-5 text-white bg-gradient-to-br ${cores[k.cor] || cores.primary} ${!k.visivel ? 'opacity-50' : ''}`}
            >
              {k.icone && <div className="text-2xl mb-2">{k.icone}</div>}
              <div className="text-3xl font-bold mb-1">{k.valor}</div>
              <div className="text-sm font-semibold">{k.rotulo}</div>
              {k.descricao && <div className="text-xs text-white/80 mt-1">{k.descricao}</div>}
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => toggleVisivel(k)} className="w-7 h-7 rounded-md bg-white/20 hover:bg-white/30 text-xs" title={k.visivel ? 'Ocultar' : 'Mostrar'}>
                  {k.visivel ? '👁' : '🚫'}
                </button>
                <button onClick={() => { setEditing(k); setShowForm(true); }} className="w-7 h-7 rounded-md bg-white/20 hover:bg-white/30 text-xs">✏</button>
                <button onClick={() => remover(k.id)} className="w-7 h-7 rounded-md bg-white/20 hover:bg-red-500/80 text-xs">×</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <KpiForm
            condoId={condoId}
            initial={editing}
            onClose={() => setShowForm(false)}
            onSuccess={() => { setShowForm(false); carregar(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function KpiForm({ condoId, initial, onClose, onSuccess }: { condoId: string; initial: Kpi | null; onClose: () => void; onSuccess: () => void }) {
  const [rotulo, setRotulo] = useState(initial?.rotulo || '');
  const [valor, setValor] = useState(initial?.valor || '');
  const [descricao, setDescricao] = useState(initial?.descricao || '');
  const [icone, setIcone] = useState(initial?.icone || '');
  const [cor, setCor] = useState(initial?.cor || 'primary');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErro(null);
    try {
      const body = { rotulo, valor, descricao: descricao || undefined, icone: icone || undefined, cor };
      if (initial) await api.patch(`/condominios/${condoId}/kpis/${initial.id}`, body);
      else await api.post(`/condominios/${condoId}/kpis`, body);
      onSuccess();
    } catch (e) { setErro(e instanceof Error ? e.message : 'Erro'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.form onSubmit={submit} onClick={e => e.stopPropagation()}
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-text">{initial ? 'Editar KPI' : 'Novo KPI'}</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Valor</label>
            <input required value={valor} onChange={e => setValor(e.target.value)} placeholder="92%"
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none font-bold text-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Ícone (emoji)</label>
            <input value={icone} onChange={e => setIcone(e.target.value)} placeholder="⚡" maxLength={4}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none text-center text-xl" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Rótulo</label>
          <input required value={rotulo} onChange={e => setRotulo(e.target.value)} placeholder="Chamados resolvidos em 48h"
            className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Descrição (opcional)</label>
          <input value={descricao} onChange={e => setDescricao(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Cor</label>
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(cores).map(([k, c]) => (
              <button key={k} type="button" onClick={() => setCor(k)}
                className={`aspect-square rounded-lg bg-gradient-to-br ${c} ${cor === k ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                aria-label={k} />
            ))}
          </div>
        </div>

        {erro && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erro}</div>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border text-text-light rounded-xl hover:bg-surface-alt">Cancelar</button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover disabled:opacity-60">
            {loading ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
