'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InstallPromptProps {
  /** Trigger to show the prompt (e.g., after completing a task) */
  show: boolean;
  onDismiss: () => void;
  /** Context message: 'chamado' | 'tarefa' | 'geral' */
  context?: 'chamado' | 'tarefa' | 'geral';
}

// Store the deferred prompt globally so it persists across renders
let deferredPrompt: BeforeInstallPromptEvent | null = null;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt({ show, onDismiss, context = 'geral' }: InstallPromptProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS (no beforeinstallprompt support)
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
    setIsIOS(ios);

    // Listen for the install prompt event (Chrome/Edge/Samsung)
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    // If prompt was already captured before this component mounted
    if (deferredPrompt) setCanInstall(true);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        deferredPrompt = null;
      }
    }
    onDismiss();
  }, [onDismiss]);

  const handleDismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  // Don't show if already installed or not triggered
  if (isInstalled || !show) return null;

  const messages = {
    chamado: {
      title: '📲 Acompanhe seus chamados de casa!',
      body: 'Adicione o App Revista na sua tela inicial e consulte o status dos seus chamados a qualquer momento, sem precisar escanear o QR Code novamente.',
    },
    tarefa: {
      title: '📲 Acesso rápido às suas tarefas!',
      body: 'Adicione o App Revista na sua tela inicial e receba suas tarefas direto no celular. Mais prático que escanear o QR Code toda vez.',
    },
    geral: {
      title: '📲 Tenha o App Revista no seu celular!',
      body: 'Adicione na sua tela inicial para acessar a revista, chamados e serviços do condomínio com um toque. Sem precisar do QR Code.',
    },
  };

  const msg = messages[context];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] p-4 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E2E8F0]">
              {/* Header gradient */}
              <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A5F] to-[#D4AF37] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">AR</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{msg.title}</h3>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-sm text-[#475569] leading-relaxed mb-5">{msg.body}</p>

                {/* iOS instructions */}
                {isIOS && !canInstall && (
                  <div className="bg-[#F8FAFC] rounded-xl p-4 mb-5 border border-[#E2E8F0]">
                    <p className="text-xs font-semibold text-[#1E293B] mb-2">Como adicionar no iPhone/iPad:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#475569]">
                        <span className="w-5 h-5 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                        Toque no botão <span className="inline-flex items-center px-1.5 py-0.5 bg-[#E2E8F0] rounded text-[10px]">⬆️ Compartilhar</span> na barra inferior
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#475569]">
                        <span className="w-5 h-5 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                        Role e toque em <span className="inline-flex items-center px-1.5 py-0.5 bg-[#E2E8F0] rounded text-[10px]">➕ Tela de Início</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#475569]">
                        <span className="w-5 h-5 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                        Toque em <span className="inline-flex items-center px-1.5 py-0.5 bg-[#E2E8F0] rounded text-[10px]">Adicionar</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Benefits */}
                <div className="flex items-center gap-4 text-[10px] text-[#94A3B8] mb-5">
                  <span className="flex items-center gap-1">✅ Gratuito</span>
                  <span className="flex items-center gap-1">⚡ Acesso rápido</span>
                  <span className="flex items-center gap-1">📴 Sem login</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  {canInstall ? (
                    <button
                      onClick={handleInstall}
                      className="flex-1 py-3 bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#1E3A5F]/30 transition-all text-sm"
                    >
                      📲 Adicionar à Tela Inicial
                    </button>
                  ) : isIOS ? (
                    <button
                      onClick={handleDismiss}
                      className="flex-1 py-3 bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
                    >
                      Entendi!
                    </button>
                  ) : (
                    <button
                      onClick={handleDismiss}
                      className="flex-1 py-3 bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
                    >
                      📲 Adicionar à Tela Inicial
                    </button>
                  )}
                  <button
                    onClick={handleDismiss}
                    className="px-5 py-3 bg-[#F1F5F9] text-[#64748B] font-medium rounded-xl hover:bg-[#E2E8F0] transition-all text-sm"
                  >
                    Agora não
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
