'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import PhotoUpload from '@/components/PhotoUpload';
import { api } from '@/lib/api';
import { CATEGORIAS, categoriaMap, Categoria } from '@/lib/revistaCategorias';

interface Edicao {
  id: string;
  numero: number;
  titulo: string;
  mes: string | null;
  ano: number | null;
  capa_url: string | null;
  publicada: boolean;
  secoes: Secao[];
}
interface Secao {
  id: string;
  categoria: Categoria;
  titulo: string;
  conteudo: string | null;
  fotos: string[];
  dados: Record<string, unknown>;
  ordem: number;
  visivel: boolean;
}

export default function EdicaoEditor({ params }: { params: Promise<{ id: string; edicaoId: string }> }) {
  const p = use(params);
  return <RequireAuth><Editor condoId={p.id} edicaoId={p.edicaoId} /></RequireAuth>;
}

function Editor({ condoId, edicaoId }: { condoId: string; edicaoId: string }) {
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [secaoEdit, setSecaoEdit] = useState<{ categoria: Categoria; secao?: Secao } | null>(null);

  const carregar = () => {
    setLoading(true);
    api.get<Edicao>(`/condominios/${condoId}/edicoes/${edicaoId}`)
      .then(setEdicao)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(carregar, [condoId, edicaoId]);

  const togglePublicada = async () => {
    if (!edicao) return;
    try {
      await api.patch(`/condominios/${condoId}/edicoes/${edicaoId}`, { publicada: !edicao.publicada });
      carregar();
    } catch (e) { alert(e instanceof Error ? e.message : 'Erro'); }
  };

  const removerSecao = async (id: string) => {
    if (!confirm('Remover esta seção?')) return;
    try {
      await api.delete(`/condominios/${condoId}/edicoes/${edicaoId}/secoes/${id}`);
      carregar();
    } catch (e) { alert(e instanceof Error ? e.message : 'Erro'); }
  };

  const toggleVisivel = async (s: Secao) => {
    try {
      await api.patch(`/condominios/${condoId}/edicoes/${edicaoId}/secoes/${s.id}`, { visivel: !s.visivel });
      carregar();
    } catch (e) { alert(e instanceof Error ? e.message : 'Erro'); }
  };

  const secoesPorCategoria = (cat: Categoria) => edicao?.secoes.filter(s => s.categoria === cat) || [];

  return (
    <div className="min-h-screen bg-surface-alt">
      <AppHeader subtitle="Editor de Edição" />

      <div className="pt-20">
        <div className="bg-gradient-to-r from-primary to-primary-light text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href={`/painel/${condoId}/revista`} className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1 mb-3">← Edições</Link>
            {loading && <div className="text-white/70">Carregando…</div>}
            {edicao && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs text-white/60 uppercase tracking-wide mb-1">Edição #{edicao.numero} · {edicao.mes} {edicao.ano}</div>
                  <h1 className="text-2xl font-bold">{edicao.titulo}</h1>
                </div>
                <button onClick={togglePublicada}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition ${
                    edicao.publicada ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-green-500 text-white hover:bg-green-600'
                  }`}>
                  {edicao.publicada ? '↓ Despublicar' : '✓ Publicar Edição'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {erro && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{erro}</div>}

        {CATEGORIAS.map(cat => {
          const secoes = secoesPorCategoria(cat.id);
          return (
            <section key={cat.id} className="bg-white border border-border rounded-2xl overflow-hidden">
              <header className={`px-5 py-4 bg-gradient-to-r ${cat.cor} text-white flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icone}</span>
                  <div>
                    <h2 className="font-bold">{cat.label}</h2>
                    <p className="text-xs text-white/70">{secoes.length} {secoes.length === 1 ? 'seção' : 'seções'}</p>
                  </div>
                </div>
                <button onClick={() => setSecaoEdit({ categoria: cat.id })}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-lg transition">
                  + Adicionar
                </button>
              </header>

              {secoes.length === 0 && (
                <div className="p-5 text-sm text-text-muted text-center">Nenhuma seção desta categoria nesta edição.</div>
              )}

              <div className="divide-y divide-border">
                {secoes.map(s => (
                  <div key={s.id} className={`p-5 flex items-start gap-4 ${!s.visivel ? 'opacity-50' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text mb-1">{s.titulo}</h3>
                      {s.conteudo && <p className="text-sm text-text-light line-clamp-2">{s.conteudo}</p>}
                      {s.fotos.length > 0 && <span className="inline-block mt-2 text-xs text-text-muted">📷 {s.fotos.length} foto{s.fotos.length > 1 ? 's' : ''}</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleVisivel(s)} className="px-2 py-1 text-xs text-text-light hover:bg-surface-alt rounded" title={s.visivel ? 'Ocultar' : 'Mostrar'}>
                        {s.visivel ? '👁' : '🚫'}
                      </button>
                      <button onClick={() => setSecaoEdit({ categoria: s.categoria, secao: s })} className="px-2 py-1 text-xs text-text-light hover:bg-surface-alt rounded">✏</button>
                      <button onClick={() => removerSecao(s.id)} className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <AnimatePresence>
        {secaoEdit && (
          <SecaoModal
            condoId={condoId} edicaoId={edicaoId}
            categoria={secaoEdit.categoria}
            secao={secaoEdit.secao}
            onClose={() => setSecaoEdit(null)}
            onSaved={() => { setSecaoEdit(null); carregar(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SecaoModal({ condoId, edicaoId, categoria, secao, onClose, onSaved }: {
  condoId: string; edicaoId: string; categoria: Categoria; secao?: Secao;
  onClose: () => void; onSaved: () => void;
}) {
  const cat = categoriaMap[categoria];
  const [titulo, setTitulo] = useState(secao?.titulo || '');
  const [conteudo, setConteudo] = useState(secao?.conteudo || '');
  const [fotos, setFotos] = useState<string[]>(secao?.fotos || []);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErro(null);
    const body = { categoria, titulo, conteudo: conteudo || undefined, fotos };
    try {
      if (secao) await api.patch(`/condominios/${condoId}/edicoes/${edicaoId}/secoes/${secao.id}`, body);
      else await api.post(`/condominios/${condoId}/edicoes/${edicaoId}/secoes`, body);
      onSaved();
    } catch (e) { setErro(e instanceof Error ? e.message : 'Erro'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.form onSubmit={submit} onClick={e => e.stopPropagation()}
        initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl w-full max-w-xl my-8 overflow-hidden">
        <div className={`px-6 py-4 bg-gradient-to-r ${cat.cor} text-white flex items-center gap-3`}>
          <span className="text-2xl">{cat.icone}</span>
          <div>
            <h2 className="font-bold text-lg">{secao ? 'Editar' : 'Nova'} seção</h2>
            <p className="text-xs text-white/80">{cat.label}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Título</label>
            <input required minLength={3} value={titulo} onChange={e => setTitulo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Conteúdo</label>
            <textarea rows={6} value={conteudo} onChange={e => setConteudo(e.target.value)}
              placeholder={hintPorCategoria(categoria)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Fotos</label>
            <PhotoUpload value={fotos} onChange={setFotos} max={categoria === 'galeria_imagens' ? 20 : 6} />
          </div>

          {erro && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erro}</div>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border text-text-light rounded-xl hover:bg-surface-alt">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover disabled:opacity-60">
              {loading ? 'Salvando…' : secao ? 'Salvar' : 'Adicionar à edição'}
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

function hintPorCategoria(c: Categoria): string {
  return ({
    mensagem_sindico: 'Escreva a mensagem mensal do síndico aos moradores.',
    realizacoes:      'Descreva o que foi realizado neste período (obras, projetos, melhorias).',
    aquisicoes:       'Equipamentos, mobiliário, serviços contratados — o que foi comprado.',
    comunicados:      'Avisos importantes para os moradores.',
    dicas:            'Dicas de economia, segurança, convivência, manutenção.',
    telefones_uteis:  'Lista de contatos úteis (zelador, portaria, emergência).',
    eventos:          'Eventos agendados ou realizados (festa, assembleia, mutirão).',
    galeria_imagens:  'Galeria livre de fotos do mês.',
  } as const)[c];
}
