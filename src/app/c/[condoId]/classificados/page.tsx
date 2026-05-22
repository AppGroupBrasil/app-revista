'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

type Tipo = 'venda' | 'aluguel' | 'doacao' | 'servico' | 'outro';
interface Item {
  id: string; codigo: string; tipo: Tipo; titulo: string; descricao: string | null;
  preco: string | null; fotos: string[];
  autor_nome: string | null; autor_unidade: string | null; autor_contato: string | null;
  criado_em: string;
}
const TIPO_LABEL: Record<Tipo, string> = {
  venda: '💰 Venda', aluguel: '🏠 Aluguel', doacao: '🎁 Doação', servico: '🛠 Serviço', outro: '📌 Outro',
};

export default function Page({ params }: { params: Promise<{ condoId: string }> }) {
  const { condoId } = use(params);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/publico/condominios/${condoId}/classificados`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems)
      .finally(() => setLoading(false));
  }, [condoId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Classificados</h1>
          <Link
            href={`/c/${condoId}/classificados/novo`}
            className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800"
          >
            + Anunciar
          </Link>
        </div>

        {loading && <p className="text-slate-500">Carregando…</p>}
        {!loading && items.length === 0 && (
          <p className="text-slate-500">Ainda não há anúncios. Seja o primeiro!</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{TIPO_LABEL[c.tipo]}</span>
                <span className="text-xs text-slate-400 font-mono">{c.codigo}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{c.titulo}</h3>
              {c.preco && <p className="text-emerald-700 font-bold mb-1">R$ {Number(c.preco).toFixed(2)}</p>}
              {c.descricao && <p className="text-sm text-slate-600 mb-3 whitespace-pre-wrap">{c.descricao}</p>}
              <div className="text-xs text-slate-500 mb-2">
                {c.autor_nome || 'Anônimo'}{c.autor_unidade && ` · Unid. ${c.autor_unidade}`}
              </div>
              {c.autor_contato && (
                <a
                  href={c.autor_contato.includes('@') ? `mailto:${c.autor_contato}` : `https://wa.me/${c.autor_contato.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-sm text-emerald-700 font-medium"
                >
                  Falar com anunciante →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
