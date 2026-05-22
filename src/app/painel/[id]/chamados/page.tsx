'use client';

import { use, useEffect, useMemo, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import { api } from '@/lib/api';

type Status = 'aberto' | 'em_andamento' | 'resolvido' | 'problema';
type Prioridade = 'baixa' | 'media' | 'alta' | 'urgente';

interface Chamado {
  id: string;
  codigo: string;
  categoria: string;
  titulo: string;
  descricao: string | null;
  status: Status;
  prioridade: Prioridade;
  autor_nome: string | null;
  autor_unidade: string | null;
  autor_contato: string | null;
  resposta: string | null;
  resolvido_em: string | null;
  criado_em: string;
}

const COLS: { id: Status; label: string; cls: string }[] = [
  { id: 'aberto',       label: 'Aberto',        cls: 'bg-amber-50 border-amber-200' },
  { id: 'em_andamento', label: 'Em andamento',  cls: 'bg-blue-50 border-blue-200' },
  { id: 'resolvido',    label: 'Resolvido',     cls: 'bg-emerald-50 border-emerald-200' },
  { id: 'problema',     label: 'Problema',      cls: 'bg-red-50 border-red-200' },
];

const PRIORIDADE_CLS: Record<Prioridade, string> = {
  urgente: 'bg-red-500',
  alta:    'bg-orange-500',
  media:   'bg-amber-400',
  baixa:   'bg-slate-300',
};

const CATEGORIA_LABEL: Record<string, string> = {
  manutencao: '🔧 Manutenção',
  limpeza:    '🧹 Limpeza',
  seguranca:  '🛡 Segurança',
  infra:      '🏗 Infra',
  outro:      '📌 Outro',
};

export default function ChamadosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RequireAuth><Chamados condoId={id} /></RequireAuth>;
}

function Chamados({ condoId }: { condoId: string }) {
  const [items, setItems] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [sel, setSel] = useState<Chamado | null>(null);
  const [resposta, setResposta] = useState('');

  async function carregar() {
    setLoading(true);
    try {
      const data = await api.get<Chamado[]>(`/condominios/${condoId}/chamados`);
      setItems(data);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [condoId]);

  const cols = useMemo(() => {
    const map: Record<Status, Chamado[]> = { aberto: [], em_andamento: [], resolvido: [], problema: [] };
    for (const it of items) map[it.status].push(it);
    return map;
  }, [items]);

  async function mover(ch: Chamado, status: Status) {
    setItems((curr) => curr.map((c) => (c.id === ch.id ? { ...c, status } : c)));
    try {
      await api.patch(`/condominios/${condoId}/chamados/${ch.id}`, { status });
    } catch (e) {
      setErro((e as Error).message);
      carregar();
    }
  }

  async function salvarResposta() {
    if (!sel) return;
    try {
      const atualizado = await api.patch<Chamado>(
        `/condominios/${condoId}/chamados/${sel.id}`,
        { resposta },
      );
      setItems((curr) => curr.map((c) => (c.id === atualizado.id ? atualizado : c)));
      setSel(atualizado);
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function excluir(ch: Chamado) {
    if (!confirm('Excluir este chamado?')) return;
    try {
      await api.delete(`/condominios/${condoId}/chamados/${ch.id}`);
      setItems((curr) => curr.filter((c) => c.id !== ch.id));
      if (sel?.id === ch.id) setSel(null);
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/c/${condoId}/chamados/novo`
    : '';

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader subtitle="Chamados" />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Chamados</h1>
            <p className="text-sm text-slate-600">Solicitações dos moradores via QR Code</p>
          </div>
          <a
            href={qrUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800"
          >
            🔗 Link público de abertura
          </a>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-3 mb-4 text-sm">
            {erro}
          </div>
        )}

        {loading ? (
          <p className="text-slate-500">Carregando…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLS.map((col) => (
              <div key={col.id} className={`rounded-xl border ${col.cls} p-3`}>
                <h2 className="font-semibold text-slate-800 mb-3 flex items-center justify-between">
                  <span>{col.label}</span>
                  <span className="text-xs bg-white/70 rounded-full px-2 py-0.5">{cols[col.id].length}</span>
                </h2>
                <div className="space-y-2 min-h-[100px]">
                  {cols[col.id].map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => { setSel(ch); setResposta(ch.resposta || ''); }}
                      className="w-full text-left bg-white rounded-lg p-3 border border-slate-200 hover:border-slate-400 transition"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs text-slate-500">{CATEGORIA_LABEL[ch.categoria] || ch.categoria}</span>
                        <span className={`w-2 h-2 rounded-full ${PRIORIDADE_CLS[ch.prioridade]}`} title={ch.prioridade} />
                      </div>
                      <p className="font-medium text-slate-900 text-sm line-clamp-2">{ch.titulo}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                        <span className="font-mono">{ch.codigo}</span>
                        {ch.autor_unidade && <span>Unid. {ch.autor_unidade}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {sel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-slate-500 font-mono">{sel.codigo}</p>
                <h3 className="text-lg font-bold text-slate-900">{sel.titulo}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {CATEGORIA_LABEL[sel.categoria] || sel.categoria} · prioridade {sel.prioridade}
                </p>
              </div>
              <button onClick={() => setSel(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>

            {sel.descricao && <p className="text-sm text-slate-700 mb-3 whitespace-pre-wrap">{sel.descricao}</p>}

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
              <div><span className="text-slate-400">Autor:</span> {sel.autor_nome || '—'}</div>
              <div><span className="text-slate-400">Unidade:</span> {sel.autor_unidade || '—'}</div>
              <div className="col-span-2"><span className="text-slate-400">Contato:</span> {sel.autor_contato || '—'}</div>
            </div>

            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <div className="flex flex-wrap gap-1 mb-4">
              {COLS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => mover(sel, c.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    sel.status === c.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <label className="block text-sm font-medium text-slate-700 mb-1">Resposta ao morador</label>
            <textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              maxLength={4000}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 mb-3"
            />

            <div className="flex justify-between gap-2">
              <button
                onClick={() => excluir(sel)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Excluir
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSel(null)}
                  className="text-sm px-4 py-2 rounded-lg border border-slate-300 text-slate-700"
                >
                  Fechar
                </button>
                <button
                  onClick={salvarResposta}
                  className="text-sm px-4 py-2 rounded-lg bg-slate-900 text-white"
                >
                  Salvar resposta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
