'use client';

import { use, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

export default function Page({ params }: { params: Promise<{ condoId: string }> }) {
  const { condoId } = use(params);
  const [form, setForm] = useState({
    tipo: 'oferta' as 'oferta' | 'procura',
    origem: '',
    destino: '',
    data_partida: '',
    horario: '',
    vagas: 1,
    recorrente: false,
    valor: '',
    observacoes: '',
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
    setEnviando(true);
    try {
      const r = await fetch(`${API_URL}/publico/condominios/${condoId}/caronas`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          tipo: form.tipo,
          origem: form.origem.trim(),
          destino: form.destino.trim(),
          data_partida: form.data_partida,
          horario: form.horario,
          vagas: form.vagas,
          recorrente: form.recorrente,
          valor: form.valor ? Number(form.valor) : undefined,
          observacoes: form.observacoes.trim() || undefined,
          autor_nome: form.autor_nome.trim() || undefined,
          autor_unidade: form.autor_unidade.trim() || undefined,
          autor_contato: form.autor_contato.trim() || undefined,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || 'Erro');
      setOk(true);
    } catch (e) { setErro((e as Error).message); }
    finally { setEnviando(false); }
  }

  if (ok) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <div className="text-5xl mb-3">🚗</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Publicado!</h1>
          <Link href={`/c/${condoId}/caronas`} className="block bg-slate-900 text-white font-semibold rounded-lg py-3 mt-4">
            Ver caronas
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Nova carona</h1>

        <form onSubmit={enviar} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex gap-2">
            {(['oferta', 'procura'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, tipo: t }))}
                className={`flex-1 text-sm px-3 py-2 rounded-lg border ${
                  form.tipo === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {t === 'oferta' ? '🚗 Estou oferecendo' : '🙋 Estou procurando'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Origem</label>
              <input
                value={form.origem} required maxLength={200}
                onChange={(e) => setForm((f) => ({ ...f, origem: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destino</label>
              <input
                value={form.destino} required maxLength={200}
                onChange={(e) => setForm((f) => ({ ...f, destino: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
              <input
                type="date" value={form.data_partida} required
                onChange={(e) => setForm((f) => ({ ...f, data_partida: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Horário</label>
              <input
                type="time" value={form.horario} required
                onChange={(e) => setForm((f) => ({ ...f, horario: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vagas</label>
              <input
                type="number" min="1" value={form.vagas}
                onChange={(e) => setForm((f) => ({ ...f, vagas: Number(e.target.value) }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valor R$ (opcional)</label>
              <input
                type="number" min="0" step="0.01" value={form.valor}
                onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox" checked={form.recorrente}
              onChange={(e) => setForm((f) => ({ ...f, recorrente: e.target.checked }))}
            />
            Carona recorrente (ex: ida diária ao trabalho)
          </label>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
            <textarea
              value={form.observacoes} rows={3} maxLength={2000}
              onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <input
              placeholder="Seu nome"
              value={form.autor_nome} maxLength={120}
              onChange={(e) => setForm((f) => ({ ...f, autor_nome: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
            <input
              placeholder="Unidade"
              value={form.autor_unidade} maxLength={50}
              onChange={(e) => setForm((f) => ({ ...f, autor_unidade: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
            <input
              placeholder="WhatsApp ou email"
              value={form.autor_contato} maxLength={120}
              onChange={(e) => setForm((f) => ({ ...f, autor_contato: e.target.value }))}
              className="sm:col-span-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </div>

          {erro && <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-3 text-sm">{erro}</div>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-slate-900 text-white font-semibold rounded-lg py-3 hover:bg-slate-800 disabled:opacity-50"
          >
            {enviando ? 'Publicando…' : 'Publicar'}
          </button>
        </form>
      </div>
    </main>
  );
}
