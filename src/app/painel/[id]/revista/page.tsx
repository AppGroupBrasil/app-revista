'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import { api } from '@/lib/api';

interface Edicao {
  id: string;
  numero: number;
  titulo: string;
  mes: string | null;
  ano: number | null;
  capa_url: string | null;
  publicada: boolean;
  publicada_em: string | null;
  criado_em: string;
}

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function RevistaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RequireAuth><Revista condoId={id} /></RequireAuth>;
}

function Revista({ condoId }: { condoId: string }) {
  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const carregar = () => {
    setLoading(true);
    api.get<Edicao[]>(`/condominios/${condoId}/edicoes`)
      .then(setEdicoes)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(carregar, [condoId]);

  return (
    <div className="min-h-screen bg-surface-alt">
      <AppHeader subtitle="Revista Digital" />

      <div className="pt-20">
        <div className="bg-gradient-to-r from-primary to-primary-light text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href={`/painel/${condoId}`} className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1 mb-3">← Voltar ao condomínio</Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">📖</div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Revista Digital</h1>
                <p className="text-white/80 text-sm">Gerencie edições mensais com mensagens, conquistas, comunicados e mais.</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/painel/${condoId}/parceiros`}
                  className="px-4 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition">
                  🤝 Parceiros
                </Link>
                <button onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 bg-white text-primary text-sm font-semibold rounded-xl hover:shadow-lg transition">
                  + Nova Edição
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {erro && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{erro}</div>}

        {loading && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="bg-white border border-border rounded-2xl h-64 animate-pulse" />)}</div>}

        {!loading && edicoes.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <div className="text-5xl mb-3">📖</div>
            <h2 className="text-lg font-bold text-text mb-1">Nenhuma edição ainda</h2>
            <p className="text-sm text-text-light mb-5">Crie a primeira edição da revista do seu condomínio.</p>
            <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover">
              + Criar Primeira Edição
            </button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {edicoes.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link href={`/painel/${condoId}/revista/${e.id}`}
                className="block bg-white border border-border rounded-2xl overflow-hidden card-hover group">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary to-primary-light relative overflow-hidden">
                  {e.capa_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.capa_url} alt={e.titulo} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 text-white text-xs font-bold tracking-wider opacity-80">EDIÇÃO #{e.numero}</div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      e.publicada ? 'bg-green-500 text-white' : 'bg-white/20 text-white border border-white/30'
                    }`}>
                      {e.publicada ? '✓ Publicada' : 'Rascunho'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs opacity-80">{e.mes} {e.ano}</div>
                    <div className="font-bold text-lg leading-tight line-clamp-2">{e.titulo}</div>
                  </div>
                </div>
                <div className="p-3 text-xs text-text-light flex items-center justify-between">
                  <span>{new Date(e.criado_em).toLocaleDateString('pt-BR')}</span>
                  <span className="text-primary font-medium group-hover:translate-x-1 transition">Editar →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showForm && <NovaEdicaoModal condoId={condoId} proximoNumero={(edicoes[0]?.numero || 0) + 1}
          onClose={() => setShowForm(false)} onCreated={(id) => { window.location.href = `/painel/${condoId}/revista/${id}`; }} />}
      </AnimatePresence>
    </div>
  );
}

function NovaEdicaoModal({ condoId, proximoNumero, onClose, onCreated }: { condoId: string; proximoNumero: number; onClose: () => void; onCreated: (id: string) => void }) {
  const now = new Date();
  const [numero, setNumero] = useState(proximoNumero);
  const [titulo, setTitulo] = useState('');
  const [mes, setMes] = useState(MESES[now.getMonth()]);
  const [ano, setAno] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErro(null);
    try {
      const r = await api.post<{ id: string }>(`/condominios/${condoId}/edicoes`, { numero, titulo, mes, ano });
      onCreated(r.id);
    } catch (e) { setErro(e instanceof Error ? e.message : 'Erro'); setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.form onSubmit={submit} onClick={e => e.stopPropagation()}
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-text">Nova Edição</h2>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-text mb-1.5">Nº</label>
            <input type="number" required min={1} value={numero} onChange={e => setNumero(+e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-text mb-1.5">Título</label>
            <input required minLength={3} value={titulo} onChange={e => setTitulo(e.target.value)}
              placeholder="Ex: Revista de Maio"
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-text mb-1.5">Mês</label>
            <select value={mes} onChange={e => setMes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none">
              {MESES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Ano</label>
            <input type="number" required min={2020} max={2100} value={ano} onChange={e => setAno(+e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
          </div>
        </div>

        {erro && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erro}</div>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border text-text-light rounded-xl hover:bg-surface-alt">Cancelar</button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover disabled:opacity-60">
            {loading ? 'Criando…' : 'Criar e Editar'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
