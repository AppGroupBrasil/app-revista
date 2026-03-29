'use client';

import Image from 'next/image';
import Link from 'next/link';

/* ─── helpers ─── */
const copiarLink = () => {
  navigator.clipboard.writeText(globalThis.location.href);
  alert('Link copiado!');
};
const compartilharWhatsApp = () => {
  globalThis.open(
    `https://wa.me/?text=${encodeURIComponent('Conheça o APP REVISTA — Revista Digital para Condomínios: ' + globalThis.location.href)}`,
    '_blank',
  );
};

/* ─── data ─── */
const funcionalidades = [
  { icon: '📖', title: 'Revista Digital', items: ['8 layouts interativos (Flip, Scroll, Grid, Stories, Jornal, Slides, Timeline, Editorial)', 'Personalização total com logo e cores do condomínio', '8 temas de cores profissionais'] },
  { icon: '📱', title: 'Acesso via QR Code', items: ['Moradores acessam a revista pelo celular', 'QR Codes públicos para áreas comuns', 'PWA — instala como app no celular'] },
  { icon: '📋', title: 'Painel do Síndico', items: ['38+ categorias prontas para ativar', 'CRUD completo: criar, editar, ativar, prévia', 'Gestão de chamados e solicitações'] },
  { icon: '👷', title: 'Gestão de Funcionários', items: ['4 tipos de tarefa: antes-depois, checklist, tarefa, vistoria', 'Geolocalização GPS em tempo real', 'QR Code individual por funcionário'] },
  { icon: '🔔', title: 'Sistema de Chamados', items: ['Reclamações, manutenção e ocorrências', 'Tracking em tempo real com código', 'Histórico completo de acompanhamento'] },
  { icon: '🏠', title: 'Área do Morador', items: ['Classificados entre moradores', 'Caronas coletivas', 'Abertura e acompanhamento de chamados'] },
];

const categorias = [
  'Achados e Perdidos', 'Agendamento de Mudanças', 'Agendamento de Reformas',
  'Antes e Depois', 'Aquisições do Condomínio', 'Avaliações',
  'Boas-Vindas', 'Benfeitorias', 'Calendário de Eventos',
  'Capa da Revista', 'Caronas Coletivas', 'Classificados',
  'Comunicados Oficiais', 'Conheça o Síndico', 'Dicas do Síndico',
  'Editorial', 'Enquetes e Pesquisas', 'Espaço do Morador',
  'Espaço Kids', 'Financeiro', 'Galeria de Imagens',
  'Gestão de Funcionários', 'Links', 'Mural de QR Codes',
  'Mural de Recados', 'Nossa Equipe', 'Obras e Manutenção',
  'Parceiros e Convênios', 'Pets', 'Prestadores de Serviço',
  'Publicidade Local', 'QR Codes Públicos', 'Realizações',
  'Regras e Regulamento', 'Saúde e Bem-estar', 'Segurança',
  'Semana do Condomínio', 'Sustentabilidade', 'Telefones Úteis',
];

const perfis = [
  { role: 'Administradora', icon: '🏢', desc: 'Gerencia múltiplos condomínios, cria edições, supervisiona síndicos e acessa relatórios gerais da plataforma.' },
  { role: 'Síndico', icon: '🏠', desc: 'Alimenta conteúdo da revista, ativa categorias, gerencia chamados, configura identidade visual e controla funcionários.' },
  { role: 'Funcionário', icon: '👷', desc: 'Recebe tarefas via QR Code, executa checklists e vistorias, registra manutenções com fotos antes/depois e GPS.' },
  { role: 'Morador', icon: '👤', desc: 'Lê a revista via QR Code, abre e acompanha chamados, acessa classificados e caronas coletivas.' },
];

const diferenciais = [
  { icon: '⚡', title: 'Sem Fidelidade', desc: 'Cancele quando quiser, sem multa de rescisão' },
  { icon: '🎯', title: '7 Dias Grátis', desc: 'Teste todas as funcionalidades sem compromisso' },
  { icon: '🔒', title: 'LGPD Compliant', desc: 'Dados protegidos em conformidade com a lei' },
  { icon: '☁️', title: 'SaaS na Nuvem', desc: 'Sem instalação, acesso de qualquer dispositivo' },
  { icon: '📲', title: 'PWA Instalável', desc: 'Instale como app nativo no celular' },
  { icon: '💬', title: 'Suporte WhatsApp', desc: 'Atendimento em horário comercial' },
  { icon: '🔄', title: 'Atualizações Grátis', desc: 'Melhorias contínuas sem custo adicional' },
  { icon: '💾', title: 'Backup Diário', desc: 'Seus dados sempre seguros e protegidos' },
];

const ecosistema = [
  { nome: 'Portaria X', dominio: 'portariax.com.br', logo: '/images/systems/portaria-x.png' },
  { nome: 'Gestão e Limpeza', dominio: 'gestaoelimpeza.com.br', logo: '/images/systems/gestao-e-limpeza.png' },
  { nome: 'App Correspondência', dominio: 'appcorrespondencia.com.br', logo: '/images/systems/app-correspondencia.png' },
  { nome: 'Manutenção X', dominio: 'manutencaox.com.br', logo: '/images/systems/manutencao-x.png' },
];

/* ─── reusable slide wrapper ─── */
function Slide({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`print-slide relative bg-white ${className}`}>
      {children}
    </section>
  );
}

/* ─── page number ─── */
function PageNum({ n }: { n: number }) {
  return <div className="absolute bottom-6 right-8 text-xs text-[#94A3B8] print:bottom-4 print:right-6">{String(n).padStart(2, '0')}</div>;
}

/* ─── main ─── */
export default function ApresentacaoPage() {
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* ── Toolbar (hidden in print) ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-[#E2E8F0] print:hidden">
        <div className="max-w-[1100px] mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="App Revista" width={28} height={28} className="rounded-lg" />
            <span className="text-sm font-bold text-[#1E3A5F]">APP REVISTA</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => globalThis.print()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#64748B] bg-[#F1F5F9] rounded-lg hover:bg-[#E2E8F0] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Gerar PDF
            </button>
            <button onClick={copiarLink} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#64748B] bg-[#F1F5F9] rounded-lg hover:bg-[#E2E8F0] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              Copiar Link
            </button>
            <button onClick={compartilharWhatsApp} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#25D366] rounded-lg hover:bg-[#20BD5A] transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp
            </button>
          </div>
        </div>
      </header>

      {/* ── Slides Container ── */}
      <div className="max-w-[1100px] mx-auto py-8 px-4 space-y-8 print:p-0 print:space-y-0 print:max-w-none">

        {/* ═══════════ SLIDE 1 — CAPA ═══════════ */}
        <Slide className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#193352] to-[#0F172A]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2A5A8F]/20 rounded-full blur-[100px]" />
          <div className="relative flex flex-col items-center justify-center min-h-[700px] px-12 py-16 text-center print:min-h-0 print:py-[120px]">
            <Image src="/images/logo.png" alt="App Revista" width={100} height={100} className="rounded-2xl shadow-2xl mb-8" />
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 tracking-tight">APP REVISTA</h1>
            <p className="text-lg font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-8">Condomínio</p>
            <div className="w-20 h-0.5 bg-[#D4AF37] mb-8" />
            <p className="text-xl text-white/80 max-w-xl leading-relaxed mb-12">
              Plataforma de Revistas Digitais para Condomínios — Mostre tudo o que você realiza pela sua gestão
            </p>
            <div className="flex items-center gap-8 text-white/60 text-sm">
              <span>apprevista.com.br</span>
              <span className="w-1 h-1 bg-[#D4AF37] rounded-full" />
              <span>Apresentação Comercial</span>
              <span className="w-1 h-1 bg-[#D4AF37] rounded-full" />
              <span>2026</span>
            </div>
          </div>
        </Slide>

        {/* ═══════════ SLIDE 2 — PROBLEMA / SOLUÇÃO ═══════════ */}
        <Slide>
          <div className="px-12 py-14 print:py-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold">01</div>
              <h2 className="text-2xl font-bold text-[#1E293B]">O Problema e a Solução</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Problema */}
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-8">
                <div className="text-3xl mb-4">😔</div>
                <h3 className="text-lg font-bold text-[#991B1B] mb-4">O Problema</h3>
                <ul className="space-y-3 text-sm text-[#7F1D1D]">
                  {[
                    'Moradores não sabem o que o síndico faz pelo condomínio',
                    'Comunicação ineficiente: avisos em elevador, grupos de WhatsApp caóticos',
                    'Prestação de contas pouco transparente',
                    'Dificuldade em registrar e acompanhar manutenções',
                    'Sem controle de funcionários e tarefas',
                    'Falta de um canal profissional e organizado',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solução */}
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-8">
                <div className="text-3xl mb-4">🎉</div>
                <h3 className="text-lg font-bold text-[#166534] mb-4">A Solução — APP REVISTA</h3>
                <ul className="space-y-3 text-sm text-[#14532D]">
                  {[
                    'Revista digital profissional com 8 layouts elegantes',
                    'Moradores acessam tudo pelo celular via QR Code',
                    'Prestação de contas transparente e visual',
                    'Sistema de chamados com tracking em tempo real',
                    'Gestão completa de funcionários com GPS e fotos',
                    'Plataforma premium que valoriza a gestão',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-[#16A34A] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center">
              <p className="text-lg font-semibold text-[#1E293B]">
                &ldquo;Não basta fazer — <span className="text-[#1E3A5F] font-bold">mostre tudo o que você realiza!</span>&rdquo;
              </p>
            </div>
          </div>
          <PageNum n={2} />
        </Slide>

        {/* ═══════════ SLIDE 3 — FUNCIONALIDADES ═══════════ */}
        <Slide>
          <div className="px-12 py-14 print:py-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold">02</div>
              <h2 className="text-2xl font-bold text-[#1E293B]">Funcionalidades Principais</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funcionalidades.map(f => (
                <div key={f.title} className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-6">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="text-base font-bold text-[#1E293B] mb-3">{f.title}</h3>
                  <ul className="space-y-2">
                    {f.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-xs text-[#475569]">
                        <svg className="w-3.5 h-3.5 text-[#1E3A5F] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <PageNum n={3} />
        </Slide>

        {/* ═══════════ SLIDE 4 — LAYOUTS DA REVISTA ═══════════ */}
        <Slide>
          <div className="px-12 py-14 print:py-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold">03</div>
              <h2 className="text-2xl font-bold text-[#1E293B]">8 Layouts de Revista</h2>
            </div>
            <p className="text-[#64748B] mb-8 max-w-2xl">Cada condomínio pode escolher o estilo que mais combina com a sua identidade visual. Todos os layouts são responsivos e otimizados para mobile.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Flip', desc: 'Efeito virar página', icon: '📖', color: '#1E3A5F' },
                { name: 'Scroll', desc: 'Rolagem suave', icon: '📜', color: '#0891B2' },
                { name: 'Grid', desc: 'Cards em grade', icon: '📐', color: '#7C3AED' },
                { name: 'Stories', desc: 'Estilo Instagram', icon: '📱', color: '#E11D48' },
                { name: 'Jornal', desc: 'Layout clássico', icon: '📰', color: '#92400E' },
                { name: 'Slides', desc: 'Apresentação', icon: '🖥️', color: '#059669' },
                { name: 'Timeline', desc: 'Linha do tempo', icon: '⏱️', color: '#D97706' },
                { name: 'Editorial', desc: 'Magazine premium', icon: '✨', color: '#6D28D9' },
              ].map(l => (
                <div key={l.name} className="rounded-xl border border-[#E2E8F0] overflow-hidden bg-white">
                  <div className="h-2" style={{ backgroundColor: l.color }} />
                  <div className="p-5 text-center">
                    <div className="text-3xl mb-2">{l.icon}</div>
                    <h4 className="text-sm font-bold text-[#1E293B]">{l.name}</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">{l.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-4 gap-4">
              {['Azul', 'Verde', 'Roxo', 'Dourado', 'Vermelho', 'Rosa', 'Turquesa', 'Grafite'].map((tema, i) => {
                const cores = ['#1E3A5F', '#059669', '#7C3AED', '#D4AF37', '#DC2626', '#EC4899', '#0891B2', '#475569'];
                return (
                  <div key={tema} className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: cores[i] }} />
                    <span className="text-xs font-medium text-[#475569]">{tema}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <PageNum n={4} />
        </Slide>

        {/* ═══════════ SLIDE 5 — 38+ CATEGORIAS ═══════════ */}
        <Slide>
          <div className="px-12 py-14 print:py-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold">04</div>
              <h2 className="text-2xl font-bold text-[#1E293B]">38+ Categorias Prontas</h2>
            </div>
            <p className="text-[#64748B] mb-6">O síndico ativa apenas os cards que precisa — cada um com formulário específico, prévia em mockup celular e botão de ativar/desativar.</p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {categorias.map(cat => (
                <div key={cat} className="flex items-center gap-2 px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                  <svg className="w-3.5 h-3.5 text-[#1E3A5F] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span className="text-[11px] font-medium text-[#334155] leading-tight">{cat}</span>
                </div>
              ))}
            </div>
          </div>
          <PageNum n={5} />
        </Slide>

        {/* ═══════════ SLIDE 6 — PERFIS DE ACESSO ═══════════ */}
        <Slide>
          <div className="px-12 py-14 print:py-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold">05</div>
              <h2 className="text-2xl font-bold text-[#1E293B]">4 Perfis de Acesso</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {perfis.map(p => (
                <div key={p.role} className="flex gap-5 p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <div className="text-4xl shrink-0">{p.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1E293B] mb-2">{p.role}</h3>
                    <p className="text-sm text-[#475569] leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] rounded-xl p-8 text-white">
              <h3 className="text-lg font-bold mb-4">Fluxo Completo</h3>
              <div className="flex items-center justify-between text-center text-sm">
                {['Administradora\ncria o condomínio', 'Síndico\nalimenta conteúdo', 'Funcionário\nexecuta tarefas', 'Morador\nacessa via QR Code'].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div>
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold mb-2 mx-auto">{i + 1}</div>
                      <p className="whitespace-pre-line text-white/90 text-xs">{step}</p>
                    </div>
                    {i < 3 && <svg className="w-6 h-6 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <PageNum n={6} />
        </Slide>

        {/* ═══════════ SLIDE 7 — DIFERENCIAIS ═══════════ */}
        <Slide>
          <div className="px-12 py-14 print:py-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold">06</div>
              <h2 className="text-2xl font-bold text-[#1E293B]">Diferenciais</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {diferenciais.map(d => (
                <div key={d.title} className="text-center p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <div className="text-3xl mb-3">{d.icon}</div>
                  <h4 className="text-sm font-bold text-[#1E293B] mb-1">{d.title}</h4>
                  <p className="text-xs text-[#64748B]">{d.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-center">
                <div className="text-4xl font-bold text-[#D4AF37] mb-1">99,5%</div>
                <p className="text-sm text-[#92400E]">Disponibilidade garantida</p>
              </div>
              <div className="p-6 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl text-center">
                <div className="text-4xl font-bold text-[#1E3A5F] mb-1">38+</div>
                <p className="text-sm text-[#3730A3]">Categorias prontas</p>
              </div>
              <div className="p-6 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-center">
                <div className="text-4xl font-bold text-[#059669] mb-1">∞</div>
                <p className="text-sm text-[#166534]">Edições ilimitadas</p>
              </div>
            </div>
          </div>
          <PageNum n={7} />
        </Slide>

        {/* ═══════════ SLIDE 8 — PLANOS ═══════════ */}
        <Slide>
          <div className="px-12 py-14 print:py-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold">07</div>
              <h2 className="text-2xl font-bold text-[#1E293B]">Planos e Investimento</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Plano Síndico */}
              <div className="border-2 border-[#E2E8F0] rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2A5A8F] p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Plano Síndico</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm opacity-80">R$</span>
                    <span className="text-5xl font-bold">99</span>
                    <span className="text-sm opacity-80">/mês</span>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {['1 condomínio', 'Até 25 categorias', 'Edições ilimitadas', 'QR Code para moradores', 'Classificados', 'Caronas coletivas', 'Módulo de chamados', 'Personalização de cores e layout', 'Cabeçalho premium', 'Suporte por e-mail'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#475569]">
                        <svg className="w-4 h-4 text-[#10B981] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Plano Administradora */}
              <div className="border-2 border-[#D4AF37] rounded-2xl overflow-hidden shadow-xl shadow-[#D4AF37]/10">
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#CA8A04] p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Plano Administradora</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm opacity-80">R$</span>
                    <span className="text-5xl font-bold">299</span>
                    <span className="text-sm opacity-80">/mês</span>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {['Condomínios ilimitados', 'Todas as 25+ categorias', 'Edições ilimitadas', 'QR Code para moradores', 'Classificados e publicidade', 'Caronas coletivas', 'Módulo completo de chamados', 'Personalização total', 'Cabeçalho premium com logo', 'Relatórios e analytics', 'Gestão de síndicos', 'Suporte prioritário'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#475569]">
                        <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-8 text-sm text-[#64748B]">
              <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> 7 dias grátis</div>
              <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Sem fidelidade</div>
              <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Sem multa</div>
              <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Boleto, PIX ou cartão</div>
            </div>
          </div>
          <PageNum n={8} />
        </Slide>

        {/* ═══════════ SLIDE 9 — ECOSSISTEMA ═══════════ */}
        <Slide>
          <div className="px-12 py-14 print:py-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold">08</div>
              <h2 className="text-2xl font-bold text-[#1E293B]">Ecossistema APP GROUP</h2>
            </div>
            <p className="text-[#64748B] mb-8 max-w-2xl">O APP REVISTA faz parte de um ecossistema completo de soluções para condomínios, com integração nativa entre todos os sistemas.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {ecosistema.map(app => (
                <div key={app.nome} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-center shadow-sm">
                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden bg-[#F8FAFC]">
                    <Image src={app.logo} alt={app.nome} fill sizes="80px" className="object-contain p-2" />
                  </div>
                  <h4 className="text-base font-bold text-[#1E293B]">{app.nome}</h4>
                  <p className="text-xs text-[#64748B] mt-1">{app.dominio}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <h4 className="text-sm font-bold text-[#1E293B] mb-3">Sobre a Empresa</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-[#475569]">
                <div>
                  <p><strong>Razão Social:</strong> APP GROUP LTDA - ME</p>
                  <p><strong>CNPJ:</strong> 51.797.070/0001-53</p>
                </div>
                <div>
                  <p><strong>Endereço:</strong> Av. Paulista, 1106, Sala 01, Bela Vista</p>
                  <p><strong>Cidade:</strong> São Paulo/SP — CEP 01310-914</p>
                </div>
              </div>
            </div>
          </div>
          <PageNum n={9} />
        </Slide>

        {/* ═══════════ SLIDE 10 — CTA FINAL ═══════════ */}
        <Slide className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#193352] to-[#0F172A]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[120px]" />
          <div className="relative flex flex-col items-center justify-center min-h-[700px] px-12 py-16 text-center print:min-h-0 print:py-[100px]">
            <Image src="/images/logo.png" alt="App Revista" width={80} height={80} className="rounded-2xl shadow-2xl mb-8" />
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">Pronto para começar?</h2>
            <p className="text-lg text-white/70 max-w-lg mb-10 leading-relaxed">
              Experimente grátis por 7 dias. Sem compromisso, sem fidelidade, sem cartão de crédito.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 print:hidden">
              <Link href="/demo/cadastro" className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#CA8A04] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all">
                Começar Agora — Grátis
              </Link>
              <Link href="/demo" className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                Ver Demo Interativo
              </Link>
            </div>

            <div className="w-20 h-0.5 bg-[#D4AF37]/40 mb-8" />

            <div className="space-y-2 text-white/50 text-sm">
              <p className="font-semibold text-white/70">www.apprevista.com.br</p>
              <p>contato@apprevista.com.br</p>
              <p className="text-xs mt-4">APP GROUP LTDA - ME · CNPJ 51.797.070/0001-53</p>
              <p className="text-xs">Av. Paulista, 1106 · São Paulo/SP</p>
            </div>
          </div>
        </Slide>

      </div>

      {/* ── Print Styles (inline) ── */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .print-slide {
            page-break-after: always;
            break-after: page;
            page-break-inside: avoid;
            break-inside: avoid;
            min-height: 100vh;
            width: 100%;
            box-shadow: none !important;
            border-radius: 0 !important;
            border: none !important;
          }
          .print-slide:last-child {
            page-break-after: auto;
          }
          /* prevent orphan images */
          img, svg, div, section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          /* hide screen-only elements */
          header, .print\\:hidden {
            display: none !important;
          }
        }

        /* Screen styles for slides */
        @media screen {
          .print-slide {
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
            border: 1px solid #E2E8F0;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
}
