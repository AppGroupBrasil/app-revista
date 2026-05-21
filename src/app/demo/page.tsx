'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';

export default function DemoPage() {
  const demoLinks = [
    {
      title: 'Revista Digital',
      desc: 'Veja como a revista fica para o morador — visual elegante com navegação fluida',
      href: '/demo/revista',
      icon: '📖',
      color: '#1E3A5F',
    },
    {
      title: 'Painel do Síndico',
      desc: 'Gerencie conteúdo, ative categorias e personalize a revista',
      href: '/demo/painel',
      icon: '🏠',
      color: '#10B981',
    },
    {
      title: 'Área do Morador',
      desc: 'Abra chamados, classificados e caronas via QR Code',
      href: '/demo/morador',
      icon: '👤',
      color: '#8B5CF6',
    },
    {
      title: 'Acompanhar Solicitação',
      desc: 'Acompanhe suas solicitações pelo link de tracking',
      href: '/demo/acompanhar/JF-2026-0001',
      icon: '🔍',
      color: '#F59E0B',
    },
    {
      title: 'Gestão de Funcionários',
      desc: 'Tarefas, checklists, vistorias com QR Code, GPS e relatórios',
      href: '/demo/funcionarios',
      icon: '👷',
      color: '#0D9488',
    },
    {
      title: 'Cadastro',
      desc: 'Crie sua conta como Síndico ou Administradora',
      href: '/demo/cadastro',
      icon: '📝',
      color: '#D4AF37',
    },
  ];

  return (
    <div className="min-h-screen bg-app-soft">
      <Container size="4xl" className="py-16">
        <PageHeader backHref="/" backLabel="Voltar ao início" exitHref="/" className="mb-12" />

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 text-[#CA8A04] text-xs font-semibold rounded-full mb-4">
            VERSÃO DEMO
          </div>
          <h1 className="text-4xl font-bold text-text mb-4">
            Explore o <span className="gradient-text">APP REVISTA</span>
          </h1>
          <p className="text-text-light max-w-lg mx-auto">
            Navegue pelas diferentes áreas da plataforma e veja como funciona na prática
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {demoLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={link.href}
                className="block bg-white rounded-2xl border border-border p-6 card-hover group"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${link.color}15` }}
                >
                  {link.icon}
                </div>
                <h3 className="text-lg font-bold text-text mb-2">{link.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{link.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-sm font-medium" style={{ color: link.color }}>
                  Acessar
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-border text-sm text-text-light">
            <Image src="/images/logo.png" alt="App Revista" width={24} height={24} className="rounded-md" />
            Condomínio Demo: Residencial Jardim das Flores
          </div>
        </div>
      </Container>
    </div>
  );
}
