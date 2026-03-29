'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { categories, plans } from '@/data/categories';

const ecosystemApps = [
  {
    name: 'Portaria X',
    domain: 'portariax.com.br',
    logoSrc: '/images/systems/portaria-x.png',
  },
  {
    name: 'Gestão e Limpeza',
    domain: 'gestaoelimpeza.com.br',
    logoSrc: '/images/systems/gestao-e-limpeza.png',
  },
  {
    name: 'App Correspondência',
    domain: 'appcorrespondencia.com.br',
    logoSrc: '/images/systems/app-correspondencia.png',
  },
  {
    name: 'Manutenção X',
    domain: 'manutencaox.com.br',
    logoSrc: '/images/systems/manutencao-x.png',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-start gap-2">
              <Image src="/images/logo.png" alt="App Revista" width={36} height={36} className="rounded-lg" />
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text leading-none">APP REVISTA</span>
                <span className="mt-1 block text-[14px] font-bold uppercase tracking-[0.3em] text-[#1E3A5F] leading-none">Condominio</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#funcionalidades" className="text-sm text-[#64748B] hover:text-[#1E3A5F] transition-colors">Funcionalidades</a>
              <a href="#categorias" className="text-sm text-[#64748B] hover:text-[#1E3A5F] transition-colors">Categorias</a>
              <a href="#planos" className="text-sm text-[#64748B] hover:text-[#1E3A5F] transition-colors">Planos</a>
              <Link href="/demo" className="text-sm text-[#64748B] hover:text-[#1E3A5F] transition-colors">Demo</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/demo"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-[#1E3A5F] border border-[#1E3A5F] rounded-lg hover:bg-[#1E3A5F] hover:text-white transition-all"
              >
                Ver Demo
              </Link>
              <Link
                href="/demo/cadastro"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] rounded-lg hover:shadow-lg transition-all"
              >
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-white to-[#EEF2FF]" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1E3A5F]/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 text-[#CA8A04] text-xs font-semibold rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
                Plataforma de Revistas Digitais
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E293B] leading-tight mb-6">
                Sua administração em uma{' '}
                <span className="gradient-text">revista digital</span>{' '}
                profissional
              </h1>
              <p className="text-lg text-[#64748B] leading-relaxed mb-4 max-w-lg">
                Os moradores sabem o que você faz pelo condomínio? Não basta fazer — mostre tudo o que você realiza!
              </p>
              <p className="text-base text-[#94A3B8] leading-relaxed mb-8 max-w-lg">
                Crie revistas digitais personalizadas para o seu condomínio. Mostre o trabalho da sua gestão com elegância e transparência.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/demo/revista"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] rounded-xl hover:shadow-xl hover:shadow-[#1E3A5F]/20 transition-all"
                >
                  Ver Revista Demo
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link
                  href="/demo/painel"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-[#1E3A5F] bg-white border-2 border-[#E2E8F0] rounded-xl hover:border-[#1E3A5F] transition-all"
                >
                  Painel Administrativo
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-[#E2E8F0]">
                <div>
                  <div className="text-2xl font-bold text-[#1E293B]">38+</div>
                  <div className="text-xs text-[#64748B]">Categorias</div>
                </div>
                <div className="w-px h-10 bg-[#E2E8F0]" />
                <div>
                  <div className="text-2xl font-bold text-[#1E293B]">4</div>
                  <div className="text-xs text-[#64748B]">Perfis de acesso</div>
                </div>
                <div className="w-px h-10 bg-[#E2E8F0]" />
                <div>
                  <div className="text-2xl font-bold text-[#1E293B]">∞</div>
                  <div className="text-xs text-[#64748B]">Edições</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#1E3A5F]/10 to-[#D4AF37]/10 rounded-3xl blur-xl" />
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E2E8F0]">
                  <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">JF</div>
                        <div>
                          <div className="font-bold">Residencial Jardim das Flores</div>
                          <div className="text-xs text-white/70">Edição #3 · Março 2026</div>
                        </div>
                      </div>
                      <Image src="/images/logo.png" alt="App Revista" width={40} height={40} className="rounded-lg" />
                    </div>
                    <div className="text-2xl font-bold mb-1">Condomínio em Destaque</div>
                    <div className="text-sm text-white/80">Confira as novidades e realizações deste mês</div>
                  </div>
                  <div className="p-6 space-y-4">
                    {['Prestação de Contas', 'Obras em Andamento', 'Eventos do Mês', 'Classificados'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A5F] to-[#D4AF37] flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{i + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-[#1E293B]">{item}</span>
                        <svg className="ml-auto w-4 h-4 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              Funcionalidades pensadas para facilitar a comunicação entre administração e moradores
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: '📖', title: 'Revista Digital', desc: '8 layouts elegantes com efeito flip, stories, timeline e muito mais' },
              { icon: '🎨', title: 'Personalização Total', desc: '8 temas de cores, logo e identidade visual do seu condomínio' },
              { icon: '📱', title: 'QR Code', desc: 'Moradores acessam revista e fazem solicitações via QR Code' },
              { icon: '📋', title: '38 Categorias', desc: 'Cards pré-configurados que o síndico ativa com um clique' },
              { icon: '👷', title: 'Gestão de Funcionários', desc: 'Crie tarefas, checklists, vistorias e acompanhe em tempo real' },
              { icon: '🔧', title: 'Manutenções', desc: 'Preventiva, corretiva e emergencial com controle completo' },
              { icon: '🔔', title: 'Chamados', desc: 'Reclamações, manutenção e ocorrências com acompanhamento' },
              { icon: '🚗', title: 'Caronas Coletivas', desc: 'Moradores oferecem carona aos vizinhos pela plataforma' },
              { icon: '📌', title: 'Classificados', desc: 'Moradores anunciam produtos e serviços entre si' },
              { icon: '📊', title: 'Relatórios', desc: 'Antes e depois, checklists, inspeções e produtividade' },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white p-6 rounded-xl border border-[#E2E8F0] card-hover"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-[#1E293B] mb-2">{item.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section id="categorias" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-4">
              38 Categorias Prontas
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              O síndico ou administradora seleciona os cards que deseja e alimenta com suas informações
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group relative bg-white p-4 rounded-xl border border-[#E2E8F0] card-hover cursor-pointer text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold transition-transform group-hover:scale-110"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name.charAt(0)}
                </div>
                <h3 className="text-sm font-semibold text-[#1E293B] mb-1">{cat.name}</h3>
                <p className="text-xs text-[#94A3B8] line-clamp-2">{cat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfis */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-4">
              4 Perfis de Acesso
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              Cada perfil tem seu nível de acesso e funcionalidades específicas
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'Administradora', icon: '🏢', color: '#1E3A5F', features: ['Múltiplos condomínios', 'Criar revistas', 'Gerenciar síndicos', 'Relatórios gerais'] },
              { role: 'Síndico', icon: '🏠', color: '#10B981', features: ['Alimentar conteúdo', 'Ativar categorias', 'Gerenciar chamados', 'Gestão de funcionários'] },
              { role: 'Funcionário', icon: '👷', color: '#F59E0B', features: ['Receber tarefas via QR', 'Checklists e vistorias', 'Registro de manutenções', 'Antes e depois com fotos'] },
              { role: 'Morador', icon: '👤', color: '#8B5CF6', features: ['Ler revista via QR Code', 'Abrir chamados', 'Classificados e caronas', 'Acompanhar solicitações'] },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden card-hover"
              >
                <div className="p-1.5" style={{ backgroundColor: item.color }}>
                  <div className="text-center text-white text-xs font-medium py-1">{item.role}</div>
                </div>
                <div className="p-6">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-[#1E293B] mb-4">{item.role}</h3>
                  <ul className="space-y-2">
                    {item.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-[#64748B]">
                        <svg className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-4">
              Planos Simples e Transparentes
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              Escolha o plano ideal para o seu perfil
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.type}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`relative bg-white rounded-2xl border-2 overflow-hidden card-hover ${
                  plan.type === 'administradora'
                    ? 'border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10'
                    : 'border-[#E2E8F0]'
                }`}
              >

                <div className="p-8">
                  <h3 className="text-xl font-bold text-[#1E293B] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-sm text-[#64748B]">R$</span>
                    <span className="text-5xl font-bold text-[#1E293B]">{plan.price}</span>
                    <span className="text-sm text-[#64748B]">/mês</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-[#475569]">
                        <svg className="w-5 h-5 flex-shrink-0 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/demo/cadastro"
                    className={`block w-full py-3 rounded-xl font-semibold transition-all text-center ${
                      plan.type === 'administradora'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#CA8A04] text-white hover:shadow-lg hover:shadow-[#D4AF37]/30'
                        : 'bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] text-white hover:shadow-lg hover:shadow-[#1E3A5F]/30'
                    }`}
                  >
                    Começar Agora
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecossistema */}
      <section className="py-20 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-4">
              Conheça o ecossistema APP REVISTA
            </h2>
            <p className="text-[#64748B] max-w-3xl mx-auto">
              No final da sua jornada na home, mostramos outros sistemas da rede e a proposta comercial para parceiros que querem escalar conosco.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-12">
            {ecosystemApps.map((app, index) => (
              <motion.div
                key={app.name}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group rounded-[28px] border border-[#E2E8F0] bg-white px-6 py-7 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
              >
                <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_100%)] p-2 shadow-[inset_0_2px_0_rgba(255,255,255,0.85),0_12px_30px_rgba(15,23,42,0.12)]">
                  <div className="relative h-full w-full overflow-hidden rounded-[24px]">
                    <Image
                      src={app.logoSrc}
                      alt={app.name}
                      fill
                      sizes="112px"
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-[28px] font-bold tracking-[-0.03em] text-[#0F3F84] group-hover:text-[#1E3A5F]">
                  {app.name}
                </h3>
                <p className="mt-2 text-lg text-[#64748B]">{app.domain}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Apresentação Comercial */}
      <section className="py-20 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold rounded-full mb-6">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
              Apresentação Comercial
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Conheça o sistema <span className="text-[#D4AF37]">completo</span>
            </h2>
            <p className="text-lg text-[#94A3B8] mb-8">
              Veja nossa apresentação comercial com todas as funcionalidades, categorias, perfis de acesso e planos. Ideal para compartilhar com a diretoria ou gerar um PDF profissional.
            </p>
            <div className="inline-flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/apresentacao"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#CA8A04] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                Ver Apresentação
              </Link>
              <div className="flex items-center gap-6 text-sm text-[#94A3B8]">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  10 slides
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Gera PDF
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Compartilhável
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conheça Nosso Contrato */}
      <section className="py-20 bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-4">
              Conheça nosso <span className="gradient-text">contrato</span>
            </h2>
            <p className="text-lg text-[#64748B] mb-8">
              Transparência total. Sem fidelidade, sem multa, sem letra miúda.
              Leia nosso contrato completo antes de contratar.
            </p>
            <div className="inline-flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/contrato"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1E3A5F]/30 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Ler Contrato Completo
              </Link>
              <div className="flex items-center gap-6 text-sm text-[#64748B]">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Sem fidelidade
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Sem multa
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  7 dias grátis
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/images/logo.png" alt="App Revista" width={36} height={36} className="rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">APP REVISTA</span>
                  <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#94A3B8] leading-none">Condomínio</span>
                </div>
              </div>
              <p className="text-sm text-[#94A3B8] max-w-sm">
                Plataforma de revistas digitais para condomínios, escolas, hospitais e empresas.
                Mostre o trabalho da sua gestão com elegância e profissionalismo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li><a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#categorias" className="hover:text-white transition-colors">Categorias</a></li>
                <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/apresentacao" className="hover:text-white transition-colors">Apresentação</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li>www.apprevista.com.br</li>
                <li>contato@apprevista.com.br</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-[#64748B]">
            © 2026 APP REVISTA. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
