'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

type Perfil = null | 'sindico' | 'administradora';

export default function CadastroPage() {
  const [perfil, setPerfil] = useState<Perfil>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Síndico
    condoName: '',
    condoAddress: '',
    // Administradora
    companyName: '',
    companyLogo: '',
    cnpj: '',
  });
  const [created, setCreated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreated(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#EEF2FF]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 min-h-18 flex items-center justify-between">
          <Link href="/" className="flex items-start gap-2">
            <Image src="/images/logo.png" alt="App Revista" width={32} height={32} className="rounded-lg" />
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-[#1E3A5F] to-[#D4AF37] bg-clip-text text-transparent leading-none">APP REVISTA</span>
              <span className="mt-1 block text-[12px] font-bold uppercase tracking-[0.22em] text-[#1E3A5F] leading-none">Condominio</span>
            </div>
          </Link>
          <Link href="/demo" className="text-sm text-[#64748B] hover:text-[#1E3A5F] transition-colors">
            ← Voltar ao Demo
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* ============ SUCCESS ============ */}
          {created ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h1 className="text-2xl font-bold text-[#1E293B] mb-2">Cadastro Realizado!</h1>
              <p className="text-[#64748B] mb-8">
                {perfil === 'sindico'
                  ? 'Seu condomínio já está pronto. Acesse o painel para começar.'
                  : 'Sua conta de administradora foi criada. Gerencie seus condomínios no painel.'}
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href={perfil === 'administradora' ? '/demo/painel' : '/demo/painel'}
                  className="px-6 py-3 bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Acessar Painel
                </Link>
                <Link
                  href="/demo"
                  className="px-6 py-3 bg-white border-2 border-[#E2E8F0] text-[#1E3A5F] font-semibold rounded-xl hover:border-[#1E3A5F] transition-all"
                >
                  Ver Demo
                </Link>
              </div>
            </motion.div>
          ) : !perfil ? (
            /* ============ PROFILE SELECTION ============ */
            <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">Criar Conta</h1>
                <p className="text-[#64748B] text-lg">Selecione o tipo de cadastro</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* SÍNDICO */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPerfil('sindico')}
                  className="relative bg-white rounded-2xl border-2 border-[#E2E8F0] p-8 text-left hover:border-[#10B981] hover:shadow-xl hover:shadow-[#10B981]/10 transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center mb-5 shadow-lg shadow-[#10B981]/20">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1E293B] mb-2 group-hover:text-[#10B981] transition-colors">
                    CADASTRO SÍNDICO
                  </h2>
                  <p className="text-sm text-[#64748B] mb-5">
                    Para síndicos que administram um único condomínio
                  </p>
                  <ul className="space-y-2">
                    {[
                      '1 condomínio',
                      'Até 25 categorias',
                      'Revista digital personalizada',
                      'Módulo de chamados',
                      'QR Code público',
                    ].map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[#475569]">
                        <svg className="w-4 h-4 text-[#10B981] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-baseline gap-1">
                    <span className="text-xs text-[#64748B]">R$</span>
                    <span className="text-3xl font-bold text-[#1E293B]">99</span>
                    <span className="text-xs text-[#64748B]">/mês</span>
                  </div>
                </motion.button>

                {/* ADMINISTRADORA */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPerfil('administradora')}
                  className="relative bg-white rounded-2xl border-2 border-[#D4AF37] p-8 text-left hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all group shadow-lg shadow-[#D4AF37]/5"
                >

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2A5A8F] flex items-center justify-center mb-5 shadow-lg shadow-[#1E3A5F]/20">
                    <span className="text-3xl">🏢</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1E293B] mb-2 group-hover:text-[#1E3A5F] transition-colors">
                    CADASTRO ADMINISTRADORA
                  </h2>
                  <p className="text-sm text-[#64748B] mb-5">
                    Para administradoras que gerenciam múltiplos condomínios
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Condomínios ilimitados',
                      'Todas as categorias',
                      'Gestão de síndicos',
                      'Relatórios e analytics',
                      'Suporte prioritário',
                    ].map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[#475569]">
                        <svg className="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-baseline gap-1">
                    <span className="text-xs text-[#64748B]">R$</span>
                    <span className="text-3xl font-bold text-[#1E293B]">199</span>
                    <span className="text-xs text-[#64748B]">/mês</span>
                  </div>
                </motion.button>
              </div>

              {/* Login link */}
              <p className="text-center mt-8 text-sm text-[#64748B]">
                Já tem uma conta?{' '}
                <Link href="/demo/painel" className="text-[#1E3A5F] font-semibold hover:underline">
                  Entrar
                </Link>
              </p>
            </motion.div>
          ) : (
            /* ============ REGISTRATION FORM ============ */
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <button
                onClick={() => setPerfil(null)}
                className="flex items-center gap-1 text-sm text-[#64748B] hover:text-[#1E3A5F] mb-6 transition-colors"
              >
                ← Voltar à seleção
              </button>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl overflow-hidden">
                {/* Form header */}
                <div className={`p-6 ${perfil === 'sindico' ? 'bg-gradient-to-r from-[#10B981] to-[#059669]' : 'bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F]'} text-white`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{perfil === 'sindico' ? '🏠' : '🏢'}</span>
                    <div>
                      <h2 className="text-xl font-bold">
                        {perfil === 'sindico' ? 'Cadastro Síndico' : 'Cadastro Administradora'}
                      </h2>
                      <p className="text-sm text-white/80">
                        {perfil === 'sindico' ? 'Plano Síndico — R$ 99/mês' : 'Plano Administradora — R$ 199/mês'}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Personal data */}
                  <div>
                    <h3 className="text-sm font-bold text-[#1E293B] mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-xs font-bold text-[#1E3A5F]">1</span>
                      Dados Pessoais
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1">Nome Completo *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="Seu nome"
                          className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1">Telefone *</label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                          placeholder="(11) 99999-9999"
                          className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1">E-mail *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="seu@email.com"
                          className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1">Senha *</label>
                        <input
                          type="password"
                          required
                          value={form.password}
                          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Condominium data (síndico) */}
                  {perfil === 'sindico' && (
                    <div>
                      <h3 className="text-sm font-bold text-[#1E293B] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-xs font-bold text-[#10B981]">2</span>
                        Dados do Condomínio
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[#64748B] mb-1">Nome do Condomínio *</label>
                          <input
                            type="text"
                            required
                            value={form.condoName}
                            onChange={e => setForm(p => ({ ...p, condoName: e.target.value }))}
                            placeholder="Residencial Exemplo"
                            className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#64748B] mb-1">Endereço *</label>
                          <input
                            type="text"
                            required
                            value={form.condoAddress}
                            onChange={e => setForm(p => ({ ...p, condoAddress: e.target.value }))}
                            placeholder="Rua, número, bairro"
                            className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Company data (administradora) */}
                  {perfil === 'administradora' && (
                    <div>
                      <h3 className="text-sm font-bold text-[#1E293B] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-xs font-bold text-[#1E3A5F]">2</span>
                        Dados da Empresa
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[#64748B] mb-1">Nome da Empresa *</label>
                          <input
                            type="text"
                            required
                            value={form.companyName}
                            onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))}
                            placeholder="Administradora Exemplo Ltda."
                            className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#64748B] mb-1">CNPJ *</label>
                          <input
                            type="text"
                            required
                            value={form.cnpj}
                            onChange={e => setForm(p => ({ ...p, cnpj: e.target.value }))}
                            placeholder="00.000.000/0001-00"
                            className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-[#FEF3C7] rounded-xl border border-[#FDE68A]">
                        <p className="text-xs text-[#92400E]">
                          💡 Após o cadastro, você poderá adicionar seus condomínios no painel da administradora.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg ${
                      perfil === 'sindico'
                        ? 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:shadow-[#10B981]/30'
                        : 'bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] hover:shadow-[#1E3A5F]/30'
                    }`}
                  >
                    Criar Conta {perfil === 'sindico' ? 'Síndico' : 'Administradora'}
                  </button>

                  <p className="text-center text-xs text-[#94A3B8]">
                    Ao criar sua conta, você concorda com os Termos de Uso e a Política de Privacidade.
                  </p>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
