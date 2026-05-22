'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import Onboarding from '@/components/Onboarding';
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

const statusBadge: Record<Condominio['status_assinatura'], { label: string; cls: string }> = {
  trial:        { label: 'Trial',        cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  ativa:        { label: 'Ativa',        cls: 'bg-green-50 text-green-700 border-green-200' },
  inadimplente: { label: 'Inadimplente', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  cancelada:    { label: 'Cancelada',    cls: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export default function PainelPage() {
  return <RequireAuth><PainelContent /></RequireAuth>;
}

function PainelContent() {
  const { user } = useAuth();
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
    <div className="min-h-screen bg-surface-alt">
      <AppHeader subtitle="Painel" />

      {/* Hero gradiente */}
      <div className="pt-20">
        <div className="bg-gradient-to-r from-primary to-primary-light text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">
                🏢
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Bem-vindo, {user?.nome.split(' ')[0]}</h1>
                <p className="text-white/70 text-sm">Gerencie suas revistas, condomínios e moradores.</p>
              </div>
              <Link
                href="/painel/novo"
                className="px-5 py-2.5 bg-white text-primary text-sm font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                + Novo Condomínio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-text">Meus Condomínios</h2>
            <p className="text-sm text-text-light">{condos.length} {condos.length === 1 ? 'condomínio cadastrado' : 'condomínios cadastrados'}</p>
          </div>
        </div>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5 animate-pulse h-40" />
            ))}
          </div>
        )}

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {erro}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!loading && !erro && condos.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-border rounded-2xl p-12 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-4xl mx-auto mb-4">
                🏢
              </div>
              <h2 className="text-lg font-bold text-text mb-1">Nenhum condomínio ainda</h2>
              <p className="text-sm text-text-light mb-5">Cadastre seu primeiro condomínio para começar a publicar.</p>
              <Link
                href="/painel/novo"
                className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                + Criar Primeiro Condomínio
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {condos.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {condos.map((c, i) => {
              const badge = statusBadge[c.status_assinatura];
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/painel/${c.id}`}
                    className="block bg-white border border-border rounded-2xl p-5 card-hover group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-xl">
                        {c.perfil === 'sindico' ? '👤' : '🏛'}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-text mb-1 group-hover:text-primary transition-colors">{c.nome}</h3>
                    <p className="text-xs uppercase tracking-wide text-text-muted font-semibold mb-2">
                      {c.perfil === 'sindico' ? 'Síndico' : 'Administradora'}
                    </p>
                    {c.endereco && <p className="text-sm text-text-light line-clamp-2">{c.endereco}</p>}
                    {c.bloqueado && (
                      <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-2 py-1 font-medium">
                        ⛔ Bloqueado
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                      Gerenciar
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      {!loading && <Onboarding primeiroCondoId={condos[0]?.id} totalCondos={condos.length} />}
    </div>
  );
}
