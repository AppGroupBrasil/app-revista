'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

interface Carona {
  id: string; codigo: string; tipo: 'oferta' | 'procura';
  origem: string; destino: string; data_partida: string; horario: string;
  vagas: number; recorrente: boolean; valor: string | null;
  observacoes: string | null;
  autor_nome: string | null; autor_unidade: string | null; autor_contato: string | null;
}

export default function Page({ params }: { params: Promise<{ condoId: string }> }) {
  const { condoId } = use(params);
  const [items, setItems] = useState<Carona[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'oferta' | 'procura'>('todos');

  useEffect(() => {
    fetch(`${API_URL}/publico/condominios/${condoId}/caronas`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems);
  }, [condoId]);

  const visiveis = filtro === 'todos' ? items : items.filter((c) => c.tipo === filtro);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Caronas</h1>
          <Link href={`/c/${condoId}/caronas/novo`} className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg">
            + Oferecer / procurar
          </Link>
        </div>

        <div className="flex gap-2 mb-4">
          {(['todos', 'oferta', 'procura'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`text-sm px-3 py-1.5 rounded-full border ${
                filtro === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              {f === 'oferta' ? '🚗 Ofertas' : f === 'procura' ? '🙋 Procuras' : 'Todas'}
            </button>
          ))}
        </div>

        {visiveis.length === 0 && <p className="text-slate-500">Nenhuma carona.</p>}

        <div className="space-y-3">
          {visiveis.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">
                  {c.tipo === 'oferta' ? '🚗 Oferta' : '🙋 Procura'}
                  {c.recorrente && ' · 🔁 Recorrente'}
                </span>
                <span className="text-xs text-slate-400 font-mono">{c.codigo}</span>
              </div>
              <p className="font-semibold text-slate-900">{c.origem} → {c.destino}</p>
              <p className="text-sm text-slate-600">
                {new Date(c.data_partida).toLocaleDateString('pt-BR')} às {c.horario} · {c.vagas} vaga(s)
                {c.valor && ` · R$ ${Number(c.valor).toFixed(2)}`}
              </p>
              {c.observacoes && <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{c.observacoes}</p>}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-500">
                  {c.autor_nome || 'Anônimo'}{c.autor_unidade && ` · Unid. ${c.autor_unidade}`}
                </p>
                {c.autor_contato && (
                  <a
                    href={c.autor_contato.includes('@') ? `mailto:${c.autor_contato}` : `https://wa.me/${c.autor_contato.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-emerald-700 font-medium"
                  >
                    Contatar →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
