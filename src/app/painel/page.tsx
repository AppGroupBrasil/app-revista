'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import Container from '@/components/ui/Container';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';

interface Condominio {
  id: string;
  perfil: 'sindico' | 'administradora';
  nome: string;
  endereco: string | null;
  cnpj: string | null;
  status_assinatura: 'trial' | 'ativa' | 'inadimplente' | 'cancelada';
  bloqueado: boolean;
  criado_em: string;
}

const statusLabel: Record<Condominio['status_assinatura'], string> = {
  trial: 'Trial',
  ativa: 'Ativa',
  inadimplente: 'Inadimplente',
  cancelada: 'Cancelada',
};
const statusColor: Record<Condominio['status_assinatura'], string> = {
  trial: 'bg-blue-50 text-blue-700 border-blue-200',
  ativa: 'bg-green-50 text-green-700 border-green-200',
  inadimplente: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelada: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function PainelPage() {
  return (
    <RequireAuth>
      <PainelContent />
    </RequireAuth>
  );
}

function PainelContent() {
  const { user, isSuperAdmin, logout } = useAuth();
  const [condos, setCondos] = useState<Condominio[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api.get<Condominio[]>('/condominios')
      .then(setCondos)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-app">
      <header className="bg-white border-b border-border">
        <Container size="7xl" className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold gradient-text">APP REVISTA</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-alt text-text-light">Painel</span>
          </div>
          <div className="flex items-center gap-3">
            {isSuperAdmin && (
              <Link href="/master" className="text-sm font-medium text-primary hover:underline">
                Master
              </Link>
            )}
            <span className="text-sm text-text-light hidden sm:inline">{user?.nome}</span>
            <button onClick={logout} className="text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
              Sair
            </button>
          </div>
        </Container>
      </header>

      <Container size="7xl" className="py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text">Meus Condomínios</h1>
            <p className="text-sm text-text-light mt-1">Gerencie as revistas e o conteúdo de cada condomínio.</p>
          </div>
          <Link
            href="/painel/novo"
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover"
          >
            + Novo Condomínio
          </Link>
        </div>

        {loading && <div className="text-text-light text-sm">Carregando condomínios…</div>}
        {erro && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {erro}
          </div>
        )}

        {!loading && !erro && condos.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <div className="text-5xl mb-3">🏢</div>
            <h2 className="text-lg font-semibold text-text mb-1">Nenhum condomínio ainda</h2>
            <p className="text-sm text-text-light mb-5">Cadastre seu primeiro condomínio para começar.</p>
            <Link href="/painel/novo" className="inline-block px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover">
              + Criar Condomínio
            </Link>
          </div>
        )}

        {condos.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {condos.map(c => (
              <Link
                key={c.id}
                href={`/painel/${c.id}`}
                className="bg-white border border-border rounded-2xl p-5 hover:shadow-md transition card-hover block"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs uppercase tracking-wide text-text-muted font-semibold">
                    {c.perfil === 'sindico' ? '👤 Síndico' : '🏛 Administradora'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[c.status_assinatura]}`}>
                    {statusLabel[c.status_assinatura]}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text mb-1">{c.nome}</h3>
                {c.endereco && <p className="text-sm text-text-light line-clamp-2">{c.endereco}</p>}
                {c.bloqueado && (
                  <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                    ⛔ Bloqueado
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
