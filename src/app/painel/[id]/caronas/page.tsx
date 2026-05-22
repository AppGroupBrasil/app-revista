'use client';

import { use, useEffect, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import { api } from '@/lib/api';

interface Carona {
  id: string; codigo: string; tipo: 'oferta' | 'procura';
  origem: string; destino: string; data_partida: string; horario: string;
  vagas: number; recorrente: boolean; valor: string | null;
  observacoes: string | null;
  autor_nome: string | null; autor_unidade: string | null; autor_contato: string | null;
  ativo: boolean; publicado: boolean; criado_em: string;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RequireAuth><Caronas condoId={id} /></RequireAuth>;
}

function Caronas({ condoId }: { condoId: string }) {
  const [items, setItems] = useState<Carona[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    try { setItems(await api.get<Carona[]>(`/condominios/${condoId}/caronas`)); }
    catch (e) { setErro((e as Error).message); }
  }
  useEffect(() => { carregar(); }, [condoId]);

  async function patch(id: string, body: Partial<Carona>) {
    try {
      const it = await api.patch<Carona>(`/condominios/${condoId}/caronas/${id}`, body);
      setItems((c) => c.map((x) => (x.id === id ? it : x)));
    } catch (e) { setErro((e as Error).message); }
  }
  async function excluir(id: string) {
    if (!confirm('Excluir esta carona?')) return;
    try {
      await api.delete(`/condominios/${condoId}/caronas/${id}`);
      setItems((c) => c.filter((x) => x.id !== id));
    } catch (e) { setErro((e as Error).message); }
  }

  const pubUrl = typeof window !== 'undefined' ? `${window.location.origin}/c/${condoId}/caronas` : '';

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader subtitle="Caronas" />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Caronas</h1>
            <p className="text-sm text-slate-600">Caronas oferecidas e procuradas pelos moradores</p>
          </div>
          <a href={pubUrl} target="_blank" rel="noreferrer" className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800">
            🔗 Página pública
          </a>
        </div>

        {erro && <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-3 mb-4 text-sm">{erro}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.length === 0 && <p className="text-slate-500">Nenhuma carona.</p>}
          {items.map((c) => (
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
              <p className="text-xs text-slate-500 mt-2">
                {c.autor_nome || 'Anônimo'}{c.autor_unidade && ` · Unid. ${c.autor_unidade}`}
                {c.autor_contato && ` · ${c.autor_contato}`}
              </p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => patch(c.id, { publicado: !c.publicado })} className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-white">
                  {c.publicado ? 'Esconder' : 'Publicar'}
                </button>
                <button onClick={() => patch(c.id, { ativo: !c.ativo })} className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700">
                  {c.ativo ? 'Desativar' : 'Reativar'}
                </button>
                <button onClick={() => excluir(c.id)} className="text-xs px-3 py-1.5 rounded-lg text-red-600 ml-auto">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
