'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import { api } from '@/lib/api';

interface CondoMaster {
  id: string;
  dono_id: string;
  perfil: string;
  nome: string;
  endereco: string | null;
  status_assinatura: 'trial' | 'ativa' | 'inadimplente' | 'cancelada';
  bloqueado: boolean;
  bloqueado_motivo: string | null;
  criado_em: string;
}

const statusBadge: Record<CondoMaster['status_assinatura'], string> = {
  trial:        'bg-blue-50 text-blue-700 border-blue-200',
  ativa:        'bg-green-50 text-green-700 border-green-200',
  inadimplente: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelada:    'bg-gray-100 text-gray-600 border-gray-200',
};

export default function MasterPage() {
  return <RequireAuth requireSuperAdmin><Master /></RequireAuth>;
}

function Master() {
  const [condos, setCondos] = useState<CondoMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');

  const carregar = () => {
    setLoading(true);
    api.get<CondoMaster[]>('/master/condominios')
      .then(setCondos)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(carregar, []);

  const toggleBloqueio = async (c: CondoMaster) => {
    const motivo = c.bloqueado ? undefined : prompt('Motivo do bloqueio (ex: inadimplência)') || undefined;
    if (!c.bloqueado && !motivo) return;
    try {
      await api.patch(`/master/condominios/${c.id}/bloqueio`, { bloqueado: !c.bloqueado, motivo });
      carregar();
    } catch (e) { alert(e instanceof Error ? e.message : 'Erro'); }
  };

  const mudarStatus = async (c: CondoMaster, status: string) => {
    try {
      await api.patch(`/master/condominios/${c.id}/assinatura`, { status });
      carregar();
    } catch (e) { alert(e instanceof Error ? e.message : 'Erro'); }
  };

  const filtrados = condos.filter(c =>
    !filtro || c.nome.toLowerCase().includes(filtro.toLowerCase()) || c.endereco?.toLowerCase().includes(filtro.toLowerCase())
  );

  const totais = {
    total: condos.length,
    ativos: condos.filter(c => c.status_assinatura === 'ativa').length,
    trial: condos.filter(c => c.status_assinatura === 'trial').length,
    inadimplentes: condos.filter(c => c.status_assinatura === 'inadimplente').length,
    bloqueados: condos.filter(c => c.bloqueado).length,
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      <AppHeader subtitle="Gestão Master" />

      <div className="pt-20">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">
                🛡
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Gestão Master</h1>
                <p className="text-white/70 text-sm">Controle de licenças, assinaturas e bloqueios.</p>
              </div>
              <Link href="/painel" className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-lg transition">
                ← Voltar ao Painel
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { l: 'Total',         v: totais.total,        c: 'from-primary to-primary-light' },
            { l: 'Ativos',        v: totais.ativos,       c: 'from-green-500 to-emerald-600' },
            { l: 'Trial',         v: totais.trial,        c: 'from-blue-500 to-blue-600' },
            { l: 'Inadimplentes', v: totais.inadimplentes,c: 'from-amber-500 to-amber-600' },
            { l: 'Bloqueados',    v: totais.bloqueados,   c: 'from-red-500 to-red-600' },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-gradient-to-br ${s.c} text-white rounded-2xl p-4`}
            >
              <div className="text-2xl font-bold">{s.v}</div>
              <div className="text-xs text-white/80 uppercase tracking-wide">{s.l}</div>
            </motion.div>
          ))}
        </div>

        {/* Busca */}
        <div className="bg-white border border-border rounded-2xl p-4 mb-4">
          <input
            type="search" placeholder="Buscar por nome ou endereço…"
            value={filtro} onChange={e => setFiltro(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
          />
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{erro}</div>
        )}

        {/* Tabela */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-alt text-text-light text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Condomínio</th>
                  <th className="text-left px-4 py-3 font-semibold">Perfil</th>
                  <th className="text-left px-4 py-3 font-semibold">Assinatura</th>
                  <th className="text-left px-4 py-3 font-semibold">Bloqueio</th>
                  <th className="text-right px-4 py-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-text-light">Carregando…</td></tr>
                )}
                {!loading && filtrados.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-text-muted">
                    {filtro ? 'Nenhum condomínio encontrado.' : 'Nenhum condomínio cadastrado ainda.'}
                  </td></tr>
                )}
                {filtrados.map(c => (
                  <tr key={c.id} className="border-t border-border hover:bg-surface-alt/50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text">{c.nome}</div>
                      {c.endereco && <div className="text-xs text-text-light">{c.endereco}</div>}
                    </td>
                    <td className="px-4 py-3 text-text-light capitalize">
                      {c.perfil === 'sindico' ? '👤 Síndico' : '🏛 Administradora'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={c.status_assinatura} onChange={e => mudarStatus(c, e.target.value)}
                        className={`text-xs border rounded-full px-3 py-1 font-medium ${statusBadge[c.status_assinatura]}`}
                      >
                        <option value="trial">Trial</option>
                        <option value="ativa">Ativa</option>
                        <option value="inadimplente">Inadimplente</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {c.bloqueado ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                          ⛔ {c.bloqueado_motivo || 'Bloqueado'}
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">Liberado</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleBloqueio(c)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                          c.bloqueado
                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                            : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        }`}
                      >
                        {c.bloqueado ? '✓ Liberar' : '⛔ Bloquear'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
