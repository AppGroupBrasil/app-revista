'use client';

import { use, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

const TIPOS = [
  { v: 'venda',    l: '💰 Venda' },
  { v: 'aluguel',  l: '🏠 Aluguel' },
  { v: 'doacao',   l: '🎁 Doação' },
  { v: 'servico',  l: '🛠 Serviço' },
  { v: 'outro',    l: '📌 Outro' },
] as const;

export default function Page({ params }: { params: Promise<{ condoId: string }> }) {
  const { condoId } = use(params);
  const [form, setForm] = useState({
    tipo: 'venda' as typeof TIPOS[number]['v'],
    titulo: '',
    descricao: '',
    preco: '',
    autor_nome: '',
    autor_unidade: '',
    autor_contato: '',
  });
  const [ok, setOk] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (form.titulo.trim().length < 3) { setErro('Título muito curto.'); return; }
    setEnviando(true);
    try {
      const r = await fetch(`${API_URL}/publico/condominios/${condoId}/classificados`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          tipo: form.tipo,
          titulo: form.titulo.trim(),
          descricao: form.descricao.trim() || undefined,
          preco: form.preco ? Number(form.preco) : undefined,
          autor_nome: form.autor_nome.trim() || undefined,
          autor_unidade: form.autor_unidade.trim() || undefined,
          autor_contato: form.autor_contato.trim() || undefined,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || 'Erro ao enviar');
      setOk(true);
    } catch (e) { setErro((e as Error).message); }
    finally { setEnviando(false); }
  }

  if (ok) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <div className="text-5xl mb-3">📬</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Anúncio recebido!</h1>
          <p className="text-slate-600 mb-5">Será publicado após a moderação do síndico.</p>
          <Link href={`/c/${condoId}/classificados`} className="block bg-slate-900 text-white font-semibold rounded-lg py-3">
            Ver classificados
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Anunciar</h1>
        <p className="text-slate-600 mb-6">Seu anúncio passa por moderação antes de ser publicado.</p>

        <form onSubmit={enviar} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <div className="flex flex-wrap gap-2">
              {TIPOS.map((t) => (
                <button
                  key={t.v}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, tipo: t.v }))}
                  className={`text-sm px-3 py-2 rounded-lg border ${
                    form.tipo === t.v ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
            <input
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              maxLength={200}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              maxLength={4000}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preço (opcional)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.preco}
              onChange={(e) => setForm((f) => ({ ...f, preco: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Seu nome</label>
              <input
                value={form.autor_nome}
                onChange={(e) => setForm((f) => ({ ...f, autor_nome: e.target.value }))}
                maxLength={120}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
              <input
                value={form.autor_unidade}
                onChange={(e) => setForm((f) => ({ ...f, autor_unidade: e.target.value }))}
                maxLength={50}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp ou email</label>
              <input
                value={form.autor_contato}
                onChange={(e) => setForm((f) => ({ ...f, autor_contato: e.target.value }))}
                maxLength={120}
                placeholder="(11) 99999-9999"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          {erro && <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-3 text-sm">{erro}</div>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-slate-900 text-white font-semibold rounded-lg py-3 hover:bg-slate-800 disabled:opacity-50"
          >
            {enviando ? 'Enviando…' : 'Enviar para moderação'}
          </button>
        </form>
      </div>
    </main>
  );
}
