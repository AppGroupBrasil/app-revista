'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import Container from '@/components/ui/Container';
import { api } from '@/lib/api';

interface CondoMaster {
  id: string;
  dono_id: string;
  perfil: string;
  nome: string;
  endereco: string | null;
  status_assinatura: string;
  bloqueado: boolean;
  bloqueado_motivo: string | null;
  criado_em: string;
}

export default function MasterPage() {
  return <RequireAuth requireSuperAdmin><Master /></RequireAuth>;
}

function Master() {
  const [condos, setCondos] = useState<CondoMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-app">
      <header className="bg-white border-b border-border">
        <Container size="7xl" className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold gradient-text">APP REVISTA</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold">MASTER</span>
          </div>
          <Link href="/painel" className="text-sm text-text-light hover:text-primary">← Painel</Link>
        </Container>
      </header>

      <Container size="7xl" className="py-10">
        <h1 className="text-2xl font-bold text-text mb-1">Gestão Master</h1>
        <p className="text-sm text-text-light mb-6">Todos os condomínios cadastrados na plataforma.</p>

        {loading && <div className="text-text-light">Carregando…</div>}
        {erro && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erro}</div>}

        {!loading && !erro && (
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-alt text-text-light text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Condomínio</th>
                  <th className="text-left px-4 py-3">Perfil</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Bloqueio</th>
                  <th className="text-right px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {condos.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">Nenhum condomínio cadastrado ainda.</td></tr>
                )}
                {condos.map(c => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text">{c.nome}</div>
                      {c.endereco && <div className="text-xs text-text-light">{c.endereco}</div>}
                    </td>
                    <td className="px-4 py-3 text-text-light">{c.perfil}</td>
                    <td className="px-4 py-3">
                      <select value={c.status_assinatura} onChange={e => mudarStatus(c, e.target.value)}
                        className="text-xs border border-border rounded px-2 py-1 bg-white">
                        <option value="trial">Trial</option>
                        <option value="ativa">Ativa</option>
                        <option value="inadimplente">Inadimplente</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {c.bloqueado ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                          ⛔ {c.bloqueado_motivo || 'Bloqueado'}
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">Liberado</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => toggleBloqueio(c)}
                        className={`text-xs px-3 py-1 rounded font-medium ${c.bloqueado ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                        {c.bloqueado ? 'Liberar' : 'Bloquear'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </div>
  );
}
