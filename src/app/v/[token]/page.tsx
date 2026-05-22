'use client';

import { use, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

interface Execucao {
  id: string; executor_nome: string | null; observacoes: string | null;
  executado_em: string; fotos: string[]; itens_marcados: number[];
}
interface Tarefa {
  id: string; condominio_id: string; tipo: 'tarefa' | 'checklist' | 'vistoria';
  titulo: string; descricao: string | null; local: string | null;
  frequencia: string; checklist: string[];
  condominio_nome: string;
  execucoes_recentes: Execucao[];
}

export default function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [t, setT] = useState<Tarefa | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [executorNome, setExecutorNome] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [marcados, setMarcados] = useState<Set<number>>(new Set());
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/publico/vistorias/${token}`);
      if (!r.ok) throw new Error('Tarefa não encontrada');
      setT(await r.json());
    } catch (e) { setErro((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { carregar(); }, [token]);

  function toggle(i: number) {
    setMarcados((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  async function registrar() {
    if (!t) return;
    setEnviando(true);
    try {
      const r = await fetch(`${API_URL}/publico/vistorias/${token}/registro`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          executor_nome: executorNome.trim() || undefined,
          observacoes: observacoes.trim() || undefined,
          itens_marcados: Array.from(marcados),
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || 'Erro');
      setOk(true);
      setMarcados(new Set()); setObservacoes(''); setExecutorNome('');
      carregar();
      setTimeout(() => setOk(false), 4000);
    } catch (e) { setErro((e as Error).message); }
    finally { setEnviando(false); }
  }

  if (loading) return <main className="min-h-screen flex items-center justify-center text-slate-500">Carregando…</main>;
  if (erro || !t)
    return (
      <main className="min-h-screen flex items-center justify-center px-4 text-center">
        <div>
          <div className="text-5xl mb-3">⚠️</div>
          <p className="text-slate-700 font-medium">{erro || 'Tarefa indisponível'}</p>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.condominio_nome}</p>
        <p className="text-xs text-slate-500">{t.tipo} · {t.frequencia}</p>
        <h1 className="text-2xl font-bold text-slate-900 mt-1 mb-2">{t.titulo}</h1>
        {t.local && <p className="text-sm text-slate-600">📍 {t.local}</p>}
        {t.descricao && <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{t.descricao}</p>}

        {ok && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg p-3 mt-4 text-sm">
            ✅ Execução registrada!
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-5 mt-5 space-y-3">
          <h2 className="font-semibold text-slate-900">Registrar execução</h2>

          {t.checklist.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Checklist</p>
              <div className="space-y-1">
                {t.checklist.map((item, i) => (
                  <label key={i} className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={marcados.has(i)} onChange={() => toggle(i)} className="mt-0.5" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Seu nome (opcional)</label>
            <input
              value={executorNome}
              onChange={(e) => setExecutorNome(e.target.value)}
              maxLength={150}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              maxLength={4000}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>

          <button
            onClick={registrar}
            disabled={enviando}
            className="w-full bg-slate-900 text-white font-semibold rounded-lg py-3 hover:bg-slate-800 disabled:opacity-50"
          >
            {enviando ? 'Registrando…' : 'Confirmar execução'}
          </button>
        </div>

        {t.execucoes_recentes.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-slate-900 mb-2">Últimas execuções</h2>
            <div className="space-y-2">
              {t.execucoes_recentes.map((e) => (
                <div key={e.id} className="bg-white rounded-xl border border-slate-200 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{e.executor_nome || 'Anônimo'}</span>
                    <span className="text-xs text-slate-500">{new Date(e.executado_em).toLocaleString('pt-BR')}</span>
                  </div>
                  {e.observacoes && <p className="text-slate-600 mt-1 whitespace-pre-wrap">{e.observacoes}</p>}
                  {e.itens_marcados.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">{e.itens_marcados.length}/{t.checklist.length} itens marcados</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
