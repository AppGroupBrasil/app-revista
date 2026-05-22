'use client';

import { use, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

const CONTEXTOS = [
  { v: 'geral', l: 'Gestão geral' },
  { v: 'chamado', l: 'Atendimento de chamado' },
  { v: 'evento', l: 'Evento' },
  { v: 'funcionario', l: 'Funcionário' },
] as const;

interface MuralItem {
  id: string;
  autor_nome: string | null;
  autor_unidade: string | null;
  contexto: string;
  nota: number;
  comentario: string | null;
  destaque: boolean;
  criado_em: string;
}

export default function AvaliarPage({ params }: { params: Promise<{ condoId: string }> }) {
  const { condoId } = use(params);
  const [nota, setNota] = useState(0);
  const [contexto, setContexto] = useState<typeof CONTEXTOS[number]['v']>('geral');
  const [autorNome, setAutorNome] = useState('');
  const [autorUnidade, setAutorUnidade] = useState('');
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mural, setMural] = useState<MuralItem[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/publico/condominios/${condoId}/avaliacoes/mural`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setMural)
      .catch(() => null);
  }, [condoId, ok]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (nota < 1) {
      setErro('Escolha uma nota de 1 a 5.');
      return;
    }
    setEnviando(true);
    try {
      const r = await fetch(`${API_URL}/publico/condominios/${condoId}/avaliacoes`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          nota,
          contexto,
          autor_nome: autorNome || undefined,
          autor_unidade: autorUnidade || undefined,
          comentario: comentario || undefined,
        }),
      });
      const j = await r.json();
      if (!r.ok || j.ok === false) throw new Error(j.message || 'Erro ao enviar');
      setOk(j.message || 'Obrigado pela avaliação!');
      setNota(0);
      setComentario('');
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Avaliar gestão</h1>
        <p className="text-slate-600 mb-8">Sua opinião nos ajuda a melhorar.</p>

        {ok ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-6 mb-8">
            <p className="font-semibold mb-2">{ok}</p>
            <button
              onClick={() => setOk(null)}
              className="text-sm underline text-emerald-700"
            >
              Enviar outra avaliação
            </button>
          </div>
        ) : (
          <form
            onSubmit={enviar}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nota</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNota(n)}
                    className={`w-12 h-12 rounded-lg border-2 text-xl font-bold transition ${
                      nota >= n
                        ? 'bg-amber-400 border-amber-500 text-white'
                        : 'bg-white border-slate-300 text-slate-400 hover:border-amber-300'
                    }`}
                    aria-label={`${n} estrelas`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contexto</label>
              <select
                value={contexto}
                onChange={(e) => setContexto(e.target.value as typeof CONTEXTOS[number]['v'])}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              >
                {CONTEXTOS.map((c) => (
                  <option key={c.v} value={c.v}>
                    {c.l}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seu nome <span className="text-slate-400">(opcional)</span>
                </label>
                <input
                  value={autorNome}
                  onChange={(e) => setAutorNome(e.target.value)}
                  maxLength={120}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Unidade <span className="text-slate-400">(opcional)</span>
                </label>
                <input
                  value={autorUnidade}
                  onChange={(e) => setAutorUnidade(e.target.value)}
                  maxLength={50}
                  placeholder="Ex: 302B"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Comentário <span className="text-slate-400">(opcional)</span>
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                maxLength={1000}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">{comentario.length}/1000</p>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-3 text-sm">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-slate-900 text-white font-semibold rounded-lg py-3 hover:bg-slate-800 disabled:opacity-50"
            >
              {enviando ? 'Enviando…' : 'Enviar avaliação'}
            </button>
          </form>
        )}

        {mural.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Mural de avaliações</h2>
            <div className="space-y-3">
              {mural.map((m) => (
                <div
                  key={m.id}
                  className={`bg-white rounded-xl border p-4 ${
                    m.destaque ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">{'★'.repeat(m.nota)}</span>
                      <span className="text-slate-400 text-sm">{'★'.repeat(5 - m.nota)}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(m.criado_em).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {m.comentario && <p className="text-slate-800 mb-2">{m.comentario}</p>}
                  <p className="text-xs text-slate-500">
                    {m.autor_nome || 'Anônimo'}
                    {m.autor_unidade && ` · Unid. ${m.autor_unidade}`} · {m.contexto}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
