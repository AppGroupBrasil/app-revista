'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import Container from '@/components/ui/Container';
import { api } from '@/lib/api';

interface Condominio {
  id: string;
  perfil: 'sindico' | 'administradora';
  nome: string;
  endereco: string | null;
  cnpj: string | null;
  status_assinatura: string;
  bloqueado: boolean;
  bloqueado_motivo: string | null;
  criado_em: string;
}

export default function CondoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RequireAuth><Detail id={id} /></RequireAuth>;
}

function Detail({ id }: { id: string }) {
  const [c, setC] = useState<Condominio | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api.get<Condominio>(`/condominios/${id}`)
      .then(setC)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-app">
      <Container size="4xl" className="py-10">
        <Link href="/painel" className="text-sm text-text-light hover:text-primary mb-6 inline-block">← Painel</Link>
        {loading && <div className="text-text-light">Carregando…</div>}
        {erro && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erro}</div>}
        {c && (
          <>
            <h1 className="text-2xl font-bold text-text mb-1">{c.nome}</h1>
            <p className="text-sm text-text-light mb-6">
              {c.perfil === 'sindico' ? 'Síndico' : 'Administradora'} · Status: {c.status_assinatura}
            </p>
            {c.bloqueado && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="font-semibold text-red-700">⛔ Condomínio bloqueado</div>
                {c.bloqueado_motivo && <div className="text-sm text-red-600 mt-1">{c.bloqueado_motivo}</div>}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <Section title="Revista Digital" desc="Edições, seções e conteúdo" href="#" disabled />
              <Section title="Chamados" desc="Solicitações dos moradores" href="#" disabled />
              <Section title="Classificados" desc="Anúncios dos moradores" href="#" disabled />
              <Section title="Caronas" desc="Caronas compartilhadas" href="#" disabled />
              <Section title="Funcionários" desc="Tarefas, checklists, vistorias" href="#" disabled />
              <Section title="QR Codes" desc="Pontos de acesso impressos" href="#" disabled />
            </div>
            <p className="text-xs text-text-muted mt-6 text-center">
              Módulos chegam nas próximas fases. Por enquanto, condomínio cadastrado e persistido no banco.
            </p>
          </>
        )}
      </Container>
    </div>
  );
}

function Section({ title, desc, href, disabled }: { title: string; desc: string; href: string; disabled?: boolean }) {
  const cls = 'bg-white border border-border rounded-2xl p-5 block transition';
  if (disabled) {
    return (
      <div className={`${cls} opacity-50 cursor-not-allowed`}>
        <h3 className="font-bold text-text mb-1">{title}</h3>
        <p className="text-sm text-text-light">{desc}</p>
        <span className="text-xs text-text-muted mt-2 inline-block">Em breve</span>
      </div>
    );
  }
  return (
    <Link href={href} className={`${cls} hover:shadow-md card-hover`}>
      <h3 className="font-bold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-light">{desc}</p>
    </Link>
  );
}
