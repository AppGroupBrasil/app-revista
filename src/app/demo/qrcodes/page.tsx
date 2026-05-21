'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

// Dados de exemplo — em produção viriam do backend/contexto do condomínio
const qrCodesExemplo = [
  { titulo: 'Acessar a Revista Digital', descricao: 'Leia a edição mais recente da revista do condomínio', url: 'https://apprevista.com.br/demo/revista', icone: '📖' },
  { titulo: 'Área do Morador', descricao: 'Acesse sua área exclusiva de morador', url: 'https://apprevista.com.br/demo/morador', icone: '🏠' },
  { titulo: 'Acompanhar Chamado', descricao: 'Veja o status do seu chamado aberto', url: 'https://apprevista.com.br/demo/acompanhar/COND2024', icone: '🔧' },
  { titulo: 'Enquete do Mês', descricao: 'Participe da enquete e dê sua opinião', url: 'https://apprevista.com.br/enquete', icone: '📋' },
  { titulo: 'Regulamento do Condomínio', descricao: 'Consulte as regras e normas vigentes', url: 'https://apprevista.com.br/regulamento', icone: '📢' },
];

export default function QRCodesPage() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selected = selectedIdx !== null ? qrCodesExemplo[selectedIdx] : null;

  return (
    <div className="min-h-screen bg-app">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] text-white">
        <div className="max-w-lg mx-auto px-4 pt-4 flex items-center justify-between">
          <Link href="/demo" className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Voltar
          </Link>
          <Link href="/" className="px-3 py-1 text-xs font-medium text-white/70 bg-white/10 rounded-lg hover:bg-white/20 hover:text-white transition-all">
            Sair
          </Link>
        </div>
        <div className="max-w-lg mx-auto px-4 py-4 text-center">
          <div className="text-3xl mb-2">📱</div>
          <h1 className="text-xl font-bold tracking-tight">QR Codes do Condomínio</h1>
          <p className="text-sm text-white/80 mt-1">Selecione um QR Code para visualizar e acessar</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-3.5 bg-white rounded-xl border border-border shadow-sm flex items-center justify-between hover:border-[#6D28D9]/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{selected ? selected.icone : '📱'}</span>
              <span className={`text-sm font-medium ${selected ? 'text-text' : 'text-text-muted'}`}>
                {selected ? selected.titulo : 'Selecione um QR Code...'}
              </span>
            </div>
            <motion.span
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-text-muted"
            >
              ▾
            </motion.span>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 w-full mt-2 bg-white rounded-xl border border-border shadow-xl overflow-hidden"
              >
                {qrCodesExemplo.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedIdx(idx); setDropdownOpen(false); }}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-surface-alt transition-colors border-b border-[#F1F5F9] last:border-0 ${selectedIdx === idx ? 'bg-[#6D28D9]/5' : ''}`}
                  >
                    <span className="text-lg flex-shrink-0">{qr.icone}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text truncate">{qr.titulo}</p>
                      <p className="text-xs text-text-light truncate">{qr.descricao}</p>
                    </div>
                    {selectedIdx === idx && <span className="ml-auto text-[#6D28D9] flex-shrink-0">✓</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* QR Code Display */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selectedIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden"
            >
              {/* QR Code */}
              <div className="flex flex-col items-center py-8 px-6 bg-gradient-to-b from-[#FAFAFE] to-white">
                <div className="bg-white p-4 rounded-2xl shadow-md border border-border">
                  <QRCodeSVG value={selected.url} size={200} bgColor="#ffffff" fgColor="#1E293B" level="M" />
                </div>
              </div>

              {/* Info */}
              <div className="px-6 pb-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selected.icone}</span>
                  <h2 className="text-lg font-bold text-text">{selected.titulo}</h2>
                </div>
                {selected.descricao && (
                  <p className="text-sm text-text-light leading-relaxed">{selected.descricao}</p>
                )}

                {/* Botão Acessar */}
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] text-white text-center text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#6D28D9]/25 transition-all active:scale-[0.98]"
                >
                  🔗 Acessar
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-border p-12 text-center"
            >
              <div className="text-5xl mb-4">📱</div>
              <p className="text-sm text-text-muted font-medium">Selecione um QR Code acima para visualizar</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista rápida de todos */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">Todos os QR Codes</h3>
          {qrCodesExemplo.map((qr, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedIdx(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`w-full p-3 bg-white rounded-xl border text-left flex items-center gap-3 transition-all ${selectedIdx === idx ? 'border-[#6D28D9]/40 shadow-md shadow-[#6D28D9]/5' : 'border-border hover:border-border-light'}`}
            >
              <span className="text-lg flex-shrink-0">{qr.icone}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text truncate">{qr.titulo}</p>
                <p className="text-xs text-text-light truncate">{qr.descricao}</p>
              </div>
              <span className="text-xs text-[#6D28D9] font-medium flex-shrink-0">Ver →</span>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-text-muted">Powered by <span className="font-semibold text-[#6D28D9]">APP REVISTA</span></p>
        </div>
      </main>
    </div>
  );
}
