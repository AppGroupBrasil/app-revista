'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';

interface Props {
  primeiroCondoId?: string | null;
  totalCondos: number;
}

const STEPS = [
  {
    icone: '👋',
    titulo: 'Bem-vindo ao App Revista!',
    texto: 'Tudo o que sua gestão entrega, agora em uma revista digital profissional. Vamos começar?',
    cta: null,
  },
  {
    icone: '🏠',
    titulo: 'Crie seu primeiro condomínio',
    texto: 'Cadastre nome, endereço e personalize cores. Você pode fazer isso pelo botão "+ Novo condomínio" no painel.',
    cta: { href: '/painel/novo', label: 'Criar condomínio' },
  },
  {
    icone: '📔',
    titulo: 'Alimente o diário de bordo',
    texto: 'Registre obras, eventos, manutenções. Cada post fica disponível para virar seção na revista.',
    cta: null,
  },
  {
    icone: '📖',
    titulo: 'Monte sua revista digital',
    texto: 'Escolha entre 43 categorias prontas. Personalize ordem, cores e capa por edição.',
    cta: null,
  },
  {
    icone: '🔗',
    titulo: 'Compartilhe com os moradores',
    texto: 'Cada condomínio ganha link público + QR Code. Imprima e cole no elevador.',
    cta: null,
  },
] as const;

export default function Onboarding({ primeiroCondoId, totalCondos }: Props) {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !user) return;
    const key = `apprevista:onboarded:${user.sub}`;
    if (!localStorage.getItem(key)) setShow(true);
  }, [user]);

  function fechar() {
    if (user && typeof window !== 'undefined') {
      localStorage.setItem(`apprevista:onboarded:${user.sub}`, '1');
    }
    setShow(false);
  }

  const s = STEPS[step];
  const ultimo = step === STEPS.length - 1;

  // Ajustar CTA do step 1 quando já tem condomínio
  const cta = step === 1 && totalCondos > 0 && primeiroCondoId
    ? { href: `/painel/${primeiroCondoId}`, label: 'Abrir condomínio' }
    : s.cta;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={fechar}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-1">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === step ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={fechar}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="text-5xl mb-3 text-center">{s.icone}</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">{s.titulo}</h2>
            <p className="text-slate-600 text-center mb-6">{s.texto}</p>

            <div className="flex flex-col gap-2">
              {cta && (
                <Link
                  href={cta.href}
                  onClick={fechar}
                  className="block w-full bg-slate-900 text-white font-semibold rounded-lg py-3 text-center hover:bg-slate-800"
                >
                  {cta.label}
                </Link>
              )}
              {ultimo ? (
                <button
                  onClick={fechar}
                  className="w-full text-sm font-medium text-slate-700 py-2"
                >
                  Começar
                </button>
              ) : (
                <button
                  onClick={() => setStep((n) => Math.min(n + 1, STEPS.length - 1))}
                  className={`w-full text-sm font-medium py-2 ${
                    cta ? 'text-slate-500' : 'text-slate-900 underline'
                  }`}
                >
                  {cta ? 'Pular' : 'Próximo →'}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
