'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import ShareButton from '@/components/ShareButton';
import PhotoUpload from '@/components/PhotoUpload';
import { api } from '@/lib/api';

type Categoria = 'obra' | 'manutencao' | 'evento' | 'aviso' | 'conquista';
interface Post {
  id: string;
  categoria: Categoria;
  titulo: string;
  descricao: string | null;
  fotos: string[];
  antes_depois: boolean;
  publicado: boolean;
  criado_em: string;
}

const catLabel: Record<Categoria, { l: string; c: string }> = {
  obra:        { l: '🏗 Obra',         c: 'from-blue-500 to-blue-600' },
  manutencao:  { l: '🔧 Manutenção',   c: 'from-cyan-500 to-teal-600' },
  evento:      { l: '🎉 Evento',       c: 'from-purple-500 to-pink-600' },
  aviso:       { l: '📢 Aviso',        c: 'from-amber-500 to-orange-600' },
  conquista:   { l: '🏆 Conquista',    c: 'from-green-500 to-emerald-600' },
};

export default function DiarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RequireAuth><Diario condoId={id} /></RequireAuth>;
}

function Diario({ condoId }: { condoId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filtro, setFiltro] = useState<Categoria | 'todos'>('todos');

  const carregar = () => {
    setLoading(true);
    api.get<Post[]>(`/condominios/${condoId}/posts`)
      .then(setPosts)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(carregar, [condoId]);

  const filtrados = filtro === 'todos' ? posts : posts.filter(p => p.categoria === filtro);

  return (
    <div className="min-h-screen bg-surface-alt">
      <AppHeader subtitle="Diário do Condomínio" />

      <div className="pt-20">
        <div className="bg-gradient-to-r from-[#10B981] to-[#0D9488] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href={`/painel/${condoId}`} className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1 mb-3">
              ← Voltar ao condomínio
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">📔</div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Diário do Condomínio</h1>
                <p className="text-white/80 text-sm">Documente obras, manutenções e eventos do condomínio.</p>
              </div>
              <button onClick={() => setShowForm(true)}
                className="px-5 py-2.5 bg-white text-emerald-700 text-sm font-semibold rounded-xl hover:shadow-lg transition">
                + Novo Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
          {(['todos', 'obra', 'manutencao', 'evento', 'aviso', 'conquista'] as const).map(c => (
            <button key={c} onClick={() => setFiltro(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                filtro === c ? 'bg-primary text-white' : 'bg-white border border-border text-text-light hover:border-primary'
              }`}>
              {c === 'todos' ? 'Todos' : catLabel[c].l}
            </button>
          ))}
        </div>

        {erro && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{erro}</div>}

        {loading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white border border-border rounded-2xl p-5 h-32 animate-pulse" />)}</div>}

        {!loading && filtrados.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <div className="text-5xl mb-3">📔</div>
            <h2 className="text-lg font-bold text-text mb-1">Diário vazio</h2>
            <p className="text-sm text-text-light mb-5">Comece a documentar o trabalho realizado no condomínio.</p>
            <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover">
              + Criar Primeiro Post
            </button>
          </div>
        )}

        <div className="space-y-4">
          {filtrados.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-white border border-border rounded-2xl overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r ${catLabel[p.categoria].c}`}>
                    {catLabel[p.categoria].l}
                  </span>
                  <time className="text-xs text-text-muted">
                    {new Date(p.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </time>
                </div>
                <h3 className="text-lg font-bold text-text mb-1">{p.titulo}</h3>
                {p.descricao && <p className="text-sm text-text-light whitespace-pre-line">{p.descricao}</p>}
              </div>

              {p.fotos.length > 0 && (
                <div className={p.antes_depois && p.fotos.length >= 2 ? 'grid grid-cols-2 gap-1' : 'grid grid-cols-2 sm:grid-cols-3 gap-1'}>
                  {p.fotos.slice(0, p.antes_depois ? 2 : 6).map((src, idx) => (
                    <div key={idx} className="relative aspect-square bg-surface-alt overflow-hidden">
                      {p.antes_depois && (
                        <span className="absolute top-2 left-2 z-10 text-xs px-2 py-0.5 rounded bg-black/60 text-white font-medium">
                          {idx === 0 ? 'Antes' : 'Depois'}
                        </span>
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`${p.titulo} ${idx+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3 border-t border-border flex items-center justify-between bg-surface-alt/50">
                <span className="text-xs text-text-muted">{p.publicado ? '✓ Publicado' : '○ Rascunho'}</span>
                <ShareButton
                  url={`/painel/${condoId}/diario#${p.id}`}
                  title={p.titulo}
                  text={`${catLabel[p.categoria].l} — ${p.titulo}`}
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showForm && <NovoPostModal condoId={condoId} onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); carregar(); }} />}
      </AnimatePresence>
    </div>
  );
}

function NovoPostModal({ condoId, onClose, onSuccess }: { condoId: string; onClose: () => void; onSuccess: () => void }) {
  const [categoria, setCategoria] = useState<Categoria>('obra');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [antesDepois, setAntesDepois] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErro(null);
    try {
      await api.post(`/condominios/${condoId}/posts`, { categoria, titulo, descricao: descricao || undefined, fotos, antes_depois: antesDepois });
      onSuccess();
    } catch (e) { setErro(e instanceof Error ? e.message : 'Erro'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit} onClick={e => e.stopPropagation()}
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl border border-border p-6 w-full max-w-lg my-8 space-y-4"
      >
        <h2 className="text-xl font-bold text-text">Novo Post no Diário</h2>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Categoria</label>
          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(catLabel) as Categoria[]).map(c => (
              <button key={c} type="button" onClick={() => setCategoria(c)}
                className={`px-2 py-2 rounded-lg text-xs font-medium border-2 transition ${
                  categoria === c ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-light'
                }`}>
                {catLabel[c].l.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Título</label>
          <input required minLength={3} value={titulo} onChange={e => setTitulo(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Descrição</label>
          <textarea rows={3} value={descricao} onChange={e => setDescricao(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Fotos</label>
          <PhotoUpload value={fotos} onChange={setFotos} max={6} />
        </div>

        {fotos.length >= 2 && (
          <label className="flex items-center gap-2 text-sm text-text-light">
            <input type="checkbox" checked={antesDepois} onChange={e => setAntesDepois(e.target.checked)} />
            Comparativo &quot;Antes / Depois&quot; (primeira = antes, segunda = depois)
          </label>
        )}

        {erro && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erro}</div>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border text-text-light rounded-xl hover:bg-surface-alt">Cancelar</button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover disabled:opacity-60">
            {loading ? 'Publicando…' : 'Publicar'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
