'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { demoRequests } from '@/data/demo';
import InstallPrompt from '@/components/InstallPrompt';

export default function AcompanharPage({ params }: { params: Promise<{ code: string }> }) {
  const [newMessage, setNewMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [messages, setMessages] = useState(demoRequests[0]?.messages || []);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowInstall(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Demo: always show the first request for demo purposes
  const request = demoRequests[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      author: request.residentName,
      authorRole: 'morador' as const,
      content: newMessage,
      createdAt: new Date().toISOString(),
    }]);
    setNewMessage('');
  };

  const handleEdit = () => {
    setEditTitle(request.title);
    setEditDesc(request.description);
    setEditing(true);
  };

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    'aberto': { bg: 'bg-red-100', text: 'text-red-700', label: '🔴 Aberto' },
    'em-andamento': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🟡 Em andamento' },
    'resolvido': { bg: 'bg-green-100', text: 'text-green-700', label: '🟢 Resolvido' },
    'fechado': { bg: 'bg-gray-100', text: 'text-gray-700', label: '⚫ Fechado' },
  };

  const status = statusColors[request.status] || statusColors['aberto'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] text-white">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/demo/morador" className="text-white/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <Image src="/images/logo.png" alt="App Revista" width={32} height={32} className="rounded-md" />
          </div>
          <h1 className="text-lg font-bold">Acompanhar Solicitação</h1>
          <p className="text-xs text-white/60">Código: {request.trackingCode}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
            <span className="text-xs text-[#94A3B8]">
              {new Date(request.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {editing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              />
              <textarea
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-[#1E3A5F] text-white text-xs font-medium rounded-lg"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-[#64748B] text-xs font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-[#1E293B] mb-2">{request.title}</h2>
              <p className="text-sm text-[#64748B] mb-4">{request.description}</p>
              <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                <span>👤 {request.residentName}</span>
                <span>🏠 Apto {request.residentUnit}</span>
              </div>
              <button
                onClick={handleEdit}
                className="mt-3 text-xs text-[#1E3A5F] font-medium hover:underline"
              >
                ✏️ Editar informações
              </button>
            </>
          )}
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
        >
          <h3 className="text-sm font-semibold text-[#1E293B] mb-4">Histórico</h3>
          <div className="space-y-4">
            {/* Creation event */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center text-sm">📝</div>
                <div className="w-px h-full bg-[#E2E8F0] mt-1" />
              </div>
              <div className="pb-4">
                <div className="text-sm font-medium text-[#1E293B]">Chamado aberto</div>
                <div className="text-xs text-[#94A3B8]">{new Date(request.createdAt).toLocaleString('pt-BR')}</div>
              </div>
            </div>

            {/* Messages */}
            {messages.map(msg => (
              <div key={msg.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    msg.authorRole === 'sindico' ? 'bg-[#10B981]' : 'bg-[#8B5CF6]'
                  }`}>
                    {msg.author.charAt(0)}
                  </div>
                  <div className="w-px h-full bg-[#E2E8F0] mt-1" />
                </div>
                <div className="pb-4">
                  <div className="text-sm font-medium text-[#1E293B]">{msg.author}</div>
                  <div className="text-xs text-[#94A3B8] mb-1">
                    {msg.authorRole === 'sindico' ? 'Síndico' : 'Morador'} · {new Date(msg.createdAt).toLocaleString('pt-BR')}
                  </div>
                  <div className="bg-[#F8FAFC] rounded-lg p-3 text-sm text-[#475569]">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply */}
          <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-[#E2E8F0]">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Escreva uma mensagem..."
                className="flex-1 px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1E3A5F] text-white text-sm font-medium rounded-lg hover:bg-[#2A5A8F] transition-all"
              >
                Enviar
              </button>
            </div>
          </form>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigator.clipboard?.writeText(`www.apprevista.com.br/acompanhar/${request.trackingCode}`)}
            className="text-xs text-[#64748B] hover:text-[#1E3A5F] flex items-center gap-1"
          >
            🔗 Copiar link
          </button>
          <span className="text-[#E2E8F0]">|</span>
          <Link href="/demo/morador" className="text-xs text-[#64748B] hover:text-[#1E3A5F]">
            ← Voltar
          </Link>
        </div>
      </div>

      <InstallPrompt show={showInstall} onDismiss={() => setShowInstall(false)} context="chamado" />
    </div>
  );
}
