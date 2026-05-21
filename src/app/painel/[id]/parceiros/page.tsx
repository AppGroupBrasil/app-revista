'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import PhotoUpload from '@/components/PhotoUpload';
import { api } from '@/lib/api';

type Tipo = 'fornecedor' | 'parceiro' | 'prestador';
interface Parceiro {
  id: string;
  tipo: Tipo;
  nome: string;
  descricao: string | null;
  categoria: string | null;
  logo_url: string | null;
  telefone: string | null;
  whatsapp: string | null;
  link: string | null;
  destaque: boolean;
  ativo: boolean;
  ordem: number;
}

const tipoLabel: Record<Tipo, { l: string; c: string }> = {
  fornecedor: { l: '📦 Fornecedor', c: 'bg-blue-50 text-blue-700 border-blue-200' },
  parceiro:   { l: '🤝 Parceiro',   c: 'bg-purple-50 text-purple-700 border-purple-200' },
  prestador:  { l: '🔧 Prestador',  c: 'bg-green-50 text-green-700 border-green-200' },
};

export default function ParceirosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RequireAuth><Parceiros condoId={id} /></RequireAuth>;
}

function Parceiros({ condoId }: { condoId: string }) {
  const [items, setItems] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [editing, setEditing] = useState<Parceiro | null>(null);
  const [showForm, setShowForm] = useState(false);

  const carregar = () => {
    setLoading(true);
    api.get<Parceiro[]>(`/condominios/${condoId}/parceiros`)
      .then(setItems)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(carregar, [condoId]);

  const remover = async (id: string) => {
    if (!confirm('Remover este parceiro?')) return;
    try { await api.delete(`/condominios/${condoId}/parceiros/${id}`); carregar(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Erro'); }
  };

  const toggle = async (p: Parceiro, field: 'ativo' | 'destaque') => {
    try { await api.patch(`/condominios/${condoId}/parceiros/${p.id}`, { [field]: !p[field] }); carregar(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Erro'); }
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      <AppHeader subtitle="Parceiros & Fornecedores" />

      <div className="pt-20">
        <div className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href={`/painel/${condoId}/revista`} className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1 mb-3">← Revista</Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">🤝</div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Parceiros & Fornecedores</h1>
                <p className="text-white/80 text-sm">Empresas que prestam serviço ao condomínio. Aparecem no início de toda edição.</p>
              </div>
              <button onClick={() => { setEditing(null); setShowForm(true); }}
                className="px-5 py-2.5 bg-white text-purple-700 text-sm font-semibold rounded-xl hover:shadow-lg transition">
                + Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {erro && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{erro}</div>}

        {loading && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-40 bg-white border border-border rounded-2xl animate-pulse" />)}</div>}

        {!loading && items.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <div className="text-5xl mb-3">🤝</div>
            <h2 className="text-lg font-bold text-text mb-1">Nenhum parceiro ainda</h2>
            <p className="text-sm text-text-light mb-5">Adicione fornecedores, parceiros e prestadores de serviço — eles ganham visibilidade na revista.</p>
            <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover">
              + Adicionar Primeiro
            </button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`bg-white border border-border rounded-2xl p-5 ${!p.ativo ? 'opacity-50' : ''} ${p.destaque ? 'ring-2 ring-amber-300' : ''}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-surface-alt flex items-center justify-center overflow-hidden border border-border">
                  {p.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo_url} alt={p.nome} className="w-full h-full object-cover" />
                  ) : <span className="text-2xl">🏢</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-text truncate">{p.nome}</h3>
                  {p.categoria && <p className="text-xs text-text-light truncate">{p.categoria}</p>}
                </div>
              </div>

              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium ${tipoLabel[p.tipo].c}`}>
                {tipoLabel[p.tipo].l}
              </span>

              {p.descricao && <p className="text-sm text-text-light mt-2 line-clamp-2">{p.descricao}</p>}

              <div className="mt-3 space-y-1 text-xs text-text-light">
                {p.telefone && <div>📞 {p.telefone}</div>}
                {p.whatsapp && <div>💬 {p.whatsapp}</div>}
                {p.link && <div>🔗 <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate inline-block max-w-full align-bottom">{p.link}</a></div>}
              </div>

              <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border">
                <button onClick={() => toggle(p, 'destaque')} className={`text-[11px] px-2 py-1 rounded-md font-medium ${p.destaque ? 'bg-amber-50 text-amber-700' : 'text-text-muted hover:bg-surface-alt'}`}>
                  {p.destaque ? '★ Destaque' : '☆ Destacar'}
                </button>
                <button onClick={() => toggle(p, 'ativo')} className={`text-[11px] px-2 py-1 rounded-md font-medium ${p.ativo ? 'text-text-light hover:bg-surface-alt' : 'bg-gray-100 text-gray-500'}`}>
                  {p.ativo ? '👁 Ativo' : '🚫 Inativo'}
                </button>
                <div className="flex-1" />
                <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-[11px] px-2 py-1 text-text-light hover:bg-surface-alt rounded">✏</button>
                <button onClick={() => remover(p.id)} className="text-[11px] px-2 py-1 text-red-500 hover:bg-red-50 rounded">×</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showForm && <ParceiroForm condoId={condoId} initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); carregar(); }} />}
      </AnimatePresence>
    </div>
  );
}

function ParceiroForm({ condoId, initial, onClose, onSaved }: { condoId: string; initial: Parceiro | null; onClose: () => void; onSaved: () => void }) {
  const [tipo, setTipo] = useState<Tipo>(initial?.tipo || 'parceiro');
  const [nome, setNome] = useState(initial?.nome || '');
  const [categoria, setCategoria] = useState(initial?.categoria || '');
  const [descricao, setDescricao] = useState(initial?.descricao || '');
  const [telefone, setTelefone] = useState(initial?.telefone || '');
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp || '');
  const [link, setLink] = useState(initial?.link || '');
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url || '');
  const [destaque, setDestaque] = useState(initial?.destaque || false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErro(null);
    const body = {
      tipo, nome,
      categoria: categoria || undefined,
      descricao: descricao || undefined,
      telefone: telefone || undefined,
      whatsapp: whatsapp || undefined,
      link: link || undefined,
      logo_url: logoUrl || undefined,
      destaque,
    };
    try {
      if (initial) await api.patch(`/condominios/${condoId}/parceiros/${initial.id}`, body);
      else await api.post(`/condominios/${condoId}/parceiros`, body);
      onSaved();
    } catch (e) { setErro(e instanceof Error ? e.message : 'Erro'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.form onSubmit={submit} onClick={e => e.stopPropagation()}
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md my-8 space-y-4">
        <h2 className="text-xl font-bold text-text">{initial ? 'Editar' : 'Adicionar'} parceiro</h2>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Tipo</label>
          <div className="grid grid-cols-3 gap-2">
            {(['fornecedor', 'parceiro', 'prestador'] as const).map(t => (
              <button key={t} type="button" onClick={() => setTipo(t)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition ${
                  tipo === t ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-light'
                }`}>
                {tipoLabel[t].l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Nome</label>
          <input required minLength={2} value={nome} onChange={e => setNome(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Categoria/Serviço</label>
          <input value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ex: Eletricista, Padaria, Limpeza…"
            className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Descrição</label>
          <textarea rows={2} value={descricao} onChange={e => setDescricao(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Telefone</label>
            <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 99999-9999"
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">WhatsApp</label>
            <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999"
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Site/Link</label>
          <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://…"
            className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Logo</label>
          <PhotoUpload value={logoUrl ? [logoUrl] : []} onChange={u => setLogoUrl(u[0] || '')} max={1} />
        </div>

        <label className="flex items-center gap-2 text-sm text-text-light">
          <input type="checkbox" checked={destaque} onChange={e => setDestaque(e.target.checked)} />
          Marcar como destaque (aparece primeiro na lista)
        </label>

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
