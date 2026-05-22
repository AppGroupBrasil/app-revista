'use client';

import { use, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

type Status = 'aberto' | 'em_andamento' | 'resolvido' | 'problema';

interface Chamado {
  codigo: string;
  categoria: string;
  titulo: string;
  descricao: string | null;
  status: Status;
  prioridade: string;
  resposta: string | null;
  resolvido_em: string | null;
  criado_em: string;
  atualizado_em: string;
  condominio_nome: string;
}

const STATUS_CLS: Record<Status, { l: string; c: string }> = {
  aberto:       { l: 'Aberto',         c: 'bg-amber-100 text-amber-900 border-amber-300' },
  em_andamento: { l: 'Em andamento',   c: 'bg-blue-100 text-blue-900 border-blue-300' },
  resolvido:    { l: 'Resolvido',      c: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  problema:     { l: 'Problema',       c: 'bg-red-100 text-red-900 border-red-300' },
};

export default function Acompanhar({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params);
  const [ch, setCh] = useState<Chamado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/publico/chamados/${codigo.toUpperCase()}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Chamado não encontrado');
        return r.json();
      })
      .then(setCh)
      .catch((e) => setErro((e as Error).message))
      .finally(() => setLoading(false));
  }, [codigo]);

  if (loading) return <main className="min-h-screen flex items-center justify-center text-slate-500">Carregando…</main>;
  if (erro || !ch)
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-slate-700 font-medium">{erro || 'Chamado não encontrado'}</p>
          <p className="text-slate-500 text-sm mt-2">Verifique o código.</p>
        </div>
      </main>
    );

  const s = STATUS_CLS[ch.status];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{ch.condominio_nome}</p>
        <p className="text-xs text-slate-500 font-mono">Código {ch.codigo}</p>

        <h1 className="text-2xl font-bold text-slate-900 mt-2 mb-3">{ch.titulo}</h1>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`text-xs px-3 py-1 rounded-full border ${s.c}`}>{s.l}</span>
          <span className="text-xs px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-700">
            {ch.categoria}
          </span>
          <span className="text-xs px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-700">
            Prioridade {ch.prioridade}
          </span>
        </div>

        {ch.descricao && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
            <p className="text-sm text-slate-500 mb-1">Descrição</p>
            <p className="text-slate-800 whitespace-pre-wrap">{ch.descricao}</p>
          </div>
        )}

        {ch.resposta && (
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 mb-4">
            <p className="text-sm text-emerald-700 font-medium mb-1">Resposta da gestão</p>
            <p className="text-emerald-900 whitespace-pre-wrap">{ch.resposta}</p>
          </div>
        )}

        <div className="text-xs text-slate-500 space-y-1">
          <p>Aberto em {new Date(ch.criado_em).toLocaleString('pt-BR')}</p>
          <p>Última atualização {new Date(ch.atualizado_em).toLocaleString('pt-BR')}</p>
          {ch.resolvido_em && <p>Resolvido em {new Date(ch.resolvido_em).toLocaleString('pt-BR')}</p>}
        </div>
      </div>
    </main>
  );
}
