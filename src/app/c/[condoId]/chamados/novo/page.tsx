'use client';

import { use, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

const CATEGORIAS = [
  { v: 'manutencao', l: '🔧 Manutenção' },
  { v: 'limpeza',    l: '🧹 Limpeza' },
  { v: 'seguranca',  l: '🛡 Segurança' },
  { v: 'infra',      l: '🏗 Infraestrutura' },
  { v: 'outro',      l: '📌 Outro' },
] as const;

const PRIORIDADES = [
  { v: 'baixa',   l: 'Baixa' },
  { v: 'media',   l: 'Média' },
  { v: 'alta',    l: 'Alta' },
  { v: 'urgente', l: 'Urgente' },
] as const;

export default function NovoChamado({ params }: { params: Promise<{ condoId: string }> }) {
  const { condoId } = use(params);
  const [form, setForm] = useState({
    categoria: 'manutencao' as typeof CATEGORIAS[number]['v'],
    titulo: '',
    descricao: '',
    prioridade: 'media' as typeof PRIORIDADES[number]['v'],
    autor_nome: '',
    autor_unidade: '',
    autor_contato: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (form.titulo.trim().length < 3) { setErro('Descreva o assunto em pelo menos 3 caracteres.'); return; }
    setEnviando(true);
    try {
      const r = await fetch(`${API_URL}/publico/condominios/${condoId}/chamados`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          categoria: form.categoria,
          titulo: form.titulo.trim(),
          descricao: form.descricao.trim() || undefined,
          prioridade: form.prioridade,
          autor_nome: form.autor_nome.trim() || undefined,
          autor_unidade: form.autor_unidade.trim() || undefined,
          autor_contato: form.autor_contato.trim() || undefined,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || 'Erro ao abrir chamado');
      setCodigo(j.codigo);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  if (codigo) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Chamado aberto!</h1>
          <p className="text-slate-600 mb-4">Anote seu código de acompanhamento:</p>
          <div className="bg-slate-100 rounded-lg py-4 px-6 mb-5">
            <span className="text-3xl font-mono font-bold text-slate-900 tracking-wider">{codigo}</span>
          </div>
          <Link
            href={`/c/chamados/${codigo}`}
            className="block w-full bg-slate-900 text-white font-semibold rounded-lg py-3 hover:bg-slate-800 mb-2"
          >
            Acompanhar chamado
          </Link>
          <button
            onClick={() => { setCodigo(null); setForm((f) => ({ ...f, titulo: '', descricao: '' })); }}
            className="text-sm text-slate-600 underline"
          >
            Abrir outro chamado
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Abrir chamado</h1>
        <p className="text-slate-600 mb-6">Conte para a gestão o que precisa de atenção.</p>

        <form onSubmit={enviar} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <select
              value={form.categoria}
              onChange={(e) => set('categoria', e.target.value as typeof form.categoria)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            >
              {CATEGORIAS.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assunto</label>
            <input
              value={form.titulo}
              onChange={(e) => set('titulo', e.target.value)}
              maxLength={200}
              required
              placeholder="Ex.: Lâmpada queimada no corredor 3º andar"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={(e) => set('descricao', e.target.value)}
              maxLength={4000}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
            <div className="flex gap-2">
              {PRIORIDADES.map((p) => (
                <button
                  key={p.v}
                  type="button"
                  onClick={() => set('prioridade', p.v)}
                  className={`flex-1 text-sm px-3 py-2 rounded-lg border ${
                    form.prioridade === p.v
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {p.l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Seu nome <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                value={form.autor_nome}
                onChange={(e) => set('autor_nome', e.target.value)}
                maxLength={120}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Unidade <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                value={form.autor_unidade}
                onChange={(e) => set('autor_unidade', e.target.value)}
                maxLength={50}
                placeholder="302B"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Telefone/email <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                value={form.autor_contato}
                onChange={(e) => set('autor_contato', e.target.value)}
                maxLength={120}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-3 text-sm">{erro}</div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-slate-900 text-white font-semibold rounded-lg py-3 hover:bg-slate-800 disabled:opacity-50"
          >
            {enviando ? 'Enviando…' : 'Abrir chamado'}
          </button>
        </form>
      </div>
    </main>
  );
}
