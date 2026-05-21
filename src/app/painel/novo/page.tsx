'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import Container from '@/components/ui/Container';
import { api } from '@/lib/api';

export default function NovoCondominio() {
  return <RequireAuth><Form /></RequireAuth>;
}

function Form() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<'sindico' | 'administradora'>('sindico');
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    try {
      const novo = await api.post<{ id: string }>('/condominios', {
        perfil,
        nome,
        endereco: endereco || undefined,
        cnpj: perfil === 'administradora' ? cnpj : undefined,
      });
      router.push(`/painel/${novo.id}`);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao criar');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-app">
      <Container size="2xl" className="py-10">
        <Link href="/painel" className="text-sm text-text-light hover:text-primary mb-6 inline-block">← Painel</Link>
        <h1 className="text-2xl font-bold text-text mb-1">Novo Condomínio</h1>
        <p className="text-sm text-text-light mb-6">Cadastre um condomínio que você administra.</p>

        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Perfil</label>
            <div className="grid grid-cols-2 gap-3">
              {(['sindico', 'administradora'] as const).map(p => (
                <button key={p} type="button" onClick={() => setPerfil(p)}
                  className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition ${
                    perfil === p ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-light hover:border-border-light'
                  }`}>
                  {p === 'sindico' ? '👤 Síndico' : '🏛 Administradora'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              {perfil === 'sindico' ? 'Nome do condomínio' : 'Razão social'}
            </label>
            <input required minLength={3} value={nome} onChange={e => setNome(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Endereço (opcional)</label>
            <input value={endereco} onChange={e => setEndereco(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>

          {perfil === 'administradora' && (
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">CNPJ</label>
              <input required value={cnpj} onChange={e => setCnpj(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
          )}

          {erro && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erro}</div>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover disabled:opacity-60">
            {loading ? 'Criando…' : 'Criar Condomínio'}
          </button>
        </form>
      </Container>
    </div>
  );
}
