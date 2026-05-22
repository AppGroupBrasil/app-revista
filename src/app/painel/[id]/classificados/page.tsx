'use client';

import { use, useEffect, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import { api } from '@/lib/api';

type Tipo = 'venda' | 'aluguel' | 'doacao' | 'servico' | 'outro';

interface Classificado {
  id: string;
  codigo: string;
  tipo: Tipo;
  titulo: string;
  descricao: string | null;
  preco: string | null;
  fotos: string[];
  autor_nome: string | null;
  autor_unidade: string | null;
  autor_contato: string | null;
  publicado: boolean;
  ativo: boolean;
  expira_em: string;
  criado_em: string;
}

const TIPO_LABEL: Record<Tipo, string> = {
  venda: '💰 Venda', aluguel: '🏠 Aluguel', doacao: '🎁 Doação', servico: '🛠 Serviço', outro: '📌 Outro',
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RequireAuth><Classificados condoId={id} /></RequireAuth>;
}

function Classificados({ condoId }: { condoId: string }) {
  const [items, setItems] = useState<Classificado[]>([]);
  const [filtro, setFiltro] = useState<'pendentes' | 'publicados' | 'todos'>('pendentes');
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    try { setItems(await api.get<Classificado[]>(`/condominios/${condoId}/classificados`)); }
    catch (e) { setErro((e as Error).message); }
  }

  useEffect(() => { carregar(); }, [condoId]);

  const visiveis = items.filter((c) =>
    filtro === 'pendentes' ? !c.publicado :
    filtro === 'publicados' ? c.publicado : true,
  );

  async function patch(id: string, body: Partial<Classificado>) {
    try {
      const it = await api.patch<Classificado>(`/condominios/${condoId}/classificados/${id}`, body);
      setItems((curr) => curr.map((c) => (c.id === id ? it : c)));
    } catch (e) { setErro((e as Error).message); }
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este anúncio?')) return;
    try {
      await api.delete(`/condominios/${condoId}/classificados/${id}`);
      setItems((curr) => curr.filter((c) => c.id !== id));
    } catch (e) { setErro((e as Error).message); }
  }

  const pubUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/c/${condoId}/classificados`
    : '';

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader subtitle="Classificados" />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Classificados</h1>
            <p className="text-sm text-slate-600">Modere e publique anúncios dos moradores</p>
          </div>
          <a href={pubUrl} target="_blank" rel="noreferrer" className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800">
            🔗 Página pública
          </a>
        </div>

        <div className="flex gap-2 mb-4">
          {(['pendentes', 'publicados', 'todos'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`text-sm px-3 py-1.5 rounded-full border ${
                filtro === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {erro && <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-3 mb-4 text-sm">{erro}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visiveis.length === 0 && <p className="text-slate-500">Nenhum anúncio.</p>}
          {visiveis.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs text-slate-500">{TIPO_LABEL[c.tipo]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  c.publicado ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {c.publicado ? 'Publicado' : 'Pendente'}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{c.titulo}</h3>
              {c.preco && <p className="text-emerald-700 font-bold mb-1">R$ {Number(c.preco).toFixed(2)}</p>}
              {c.descricao && <p className="text-sm text-slate-600 mb-2 line-clamp-3 whitespace-pre-wrap">{c.descricao}</p>}
              <div className="text-xs text-slate-500 mb-3">
                {c.autor_nome || 'Anônimo'}{c.autor_unidade && ` · Unid. ${c.autor_unidade}`}
                {c.autor_contato && ` · ${c.autor_contato}`}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => patch(c.id, { publicado: !c.publicado })}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-white"
                >
                  {c.publicado ? 'Despublicar' : 'Publicar'}
                </button>
                <button
                  onClick={() => patch(c.id, { ativo: !c.ativo })}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700"
                >
                  {c.ativo ? 'Desativar' : 'Reativar'}
                </button>
                <button
                  onClick={() => excluir(c.id)}
                  className="text-xs px-3 py-1.5 rounded-lg text-red-600 hover:text-red-700 ml-auto"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
