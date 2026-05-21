'use client';

import { use, useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIAS, categoriaMap, Categoria } from '@/lib/revistaCategorias';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

interface Secao {
  id: string;
  categoria: Categoria;
  titulo: string;
  conteudo: string | null;
  fotos: string[];
  ordem: number;
  visivel: boolean;
}
interface Parceiro {
  id: string;
  tipo: 'fornecedor' | 'parceiro' | 'prestador';
  nome: string;
  descricao: string | null;
  categoria: string | null;
  logo_url: string | null;
  telefone: string | null;
  whatsapp: string | null;
  link: string | null;
}
interface Revista {
  condominio: { nome: string; theme_color: string; accent_color: string };
  edicao: null | {
    id: string; numero: number; titulo: string; mes: string | null; ano: number | null;
    capa_url: string | null; theme_color: string; accent_color: string;
    secoes: Secao[];
  };
  parceiros: Parceiro[];
}

type Modo = 'stories' | 'scroll' | 'pagina';

export default function RevistaPublica({ params }: { params: Promise<{ condoId: string }> }) {
  const { condoId } = use(params);
  const [data, setData] = useState<Revista | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [modo, setModo] = useState<Modo>('pagina');

  useEffect(() => {
    fetch(`${API_URL}/publico/condominios/${condoId}/revista/atual`)
      .then(async r => { if (!r.ok) throw new Error('Revista não disponível'); return r.json(); })
      .then(setData)
      .catch(e => setErro(e.message));
  }, [condoId]);

  if (erro) return <Center>{erro}</Center>;
  if (!data) return <Center>Carregando…</Center>;
  if (!data.edicao) return <Center>Este condomínio ainda não publicou nenhuma edição.</Center>;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0F172A' }}>
      <TopBar modo={modo} setModo={setModo} edicao={data.edicao} condo={data.condominio} />
      <AnimatePresence mode="wait">
        {modo === 'stories' && <StoriesMode key="s" data={data} />}
        {modo === 'scroll' && <ScrollMode key="r" data={data} />}
        {modo === 'pagina' && <PaginaMode key="p" data={data} />}
      </AnimatePresence>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white/70 text-sm">{children}</div>;
}

function TopBar({ modo, setModo, edicao, condo }: { modo: Modo; setModo: (m: Modo) => void; edicao: Revista['edicao']; condo: Revista['condominio'] }) {
  if (!edicao) return null;
  const modos: { id: Modo; label: string; icone: string }[] = [
    { id: 'pagina',  label: 'Página',  icone: '📖' },
    { id: 'scroll',  label: 'Rolagem', icone: '📜' },
    { id: 'stories', label: 'Stories', icone: '📱' },
  ];
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-30">
      <div className="text-white text-sm">
        <div className="font-bold leading-tight">{condo.nome}</div>
        <div className="text-[10px] text-white/50">Ed. #{edicao.numero} · {edicao.mes} {edicao.ano}</div>
      </div>
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
        {modos.map(m => {
          const active = modo === m.id;
          return (
            <button key={m.id} onClick={() => setModo(m.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${active ? 'text-white' : 'text-white/40 hover:text-white/70'}`}>
              {active && <motion.div layoutId="modeTab" className="absolute inset-0 rounded-lg" style={{ backgroundColor: `${edicao.accent_color}44`, border: `1px solid ${edicao.accent_color}66` }} />}
              <span className="relative">{m.icone}</span>
              <span className="relative hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

// ─────────── helpers compartilhados ───────────

function ordenarComParceiros(data: Revista) {
  if (!data.edicao) return [];
  const secoes = data.edicao.secoes.filter(s => s.visivel).sort((a, b) => a.ordem - b.ordem || a.categoria.localeCompare(b.categoria));
  return secoes;
}

function ParceirosBloco({ parceiros, accent }: { parceiros: Parceiro[]; accent: string }) {
  if (parceiros.length === 0) return null;
  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
      <div className="text-xs uppercase tracking-widest mb-3" style={{ color: accent }}>🤝 Parceiros & Fornecedores</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {parceiros.map(p => (
          <a key={p.id} href={p.link || (p.whatsapp ? `https://wa.me/${p.whatsapp.replace(/\D/g, '')}` : '#')}
             target={p.link ? '_blank' : undefined} rel="noopener noreferrer"
             className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {p.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logo_url} alt={p.nome} className="w-full h-full object-cover" />
                ) : <span className="text-lg">🏢</span>}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{p.nome}</div>
                {p.categoria && <div className="text-[10px] text-white/50 truncate">{p.categoria}</div>}
              </div>
            </div>
            {(p.telefone || p.whatsapp) && (
              <div className="mt-2 text-[10px] text-white/60">
                {p.whatsapp ? `💬 ${p.whatsapp}` : `📞 ${p.telefone}`}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─────────── MODO PÁGINA (page flip 3D) ───────────

function PaginaMode({ data }: { data: Revista }) {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const secoes = ordenarComParceiros(data);
  const totalPages = 1 /* capa */ + 1 /* parceiros */ + secoes.length;

  const go = (d: 1 | -1) => {
    const next = page + d;
    if (next < 0 || next >= totalPages) return;
    setDir(d); setPage(next);
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, totalPages]);

  return (
    <motion.div className="flex-1 flex items-center justify-center p-4 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button onClick={() => go(-1)} disabled={page === 0}
        className="absolute left-2 sm:left-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed">‹</button>
      <button onClick={() => go(1)} disabled={page === totalPages - 1}
        className="absolute right-2 sm:right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed">›</button>

      <div className="w-full max-w-3xl" style={{ perspective: 2000 }}>
        <AnimatePresence mode="popLayout" custom={dir} initial={false}>
          <motion.div
            key={page} custom={dir}
            initial={{ rotateY: dir > 0 ? 90 : -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: dir > 0 ? -90 : 90, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: dir > 0 ? 'left center' : 'right center', transformStyle: 'preserve-3d' }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[60vh]"
          >
            <PageContent page={page} data={data} secoes={secoes} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs">
        {page + 1} / {totalPages}
      </div>
    </motion.div>
  );
}

function PageContent({ page, data, secoes }: { page: number; data: Revista; secoes: Secao[] }) {
  const ed = data.edicao!;
  if (page === 0) {
    return (
      <div className="aspect-[3/4] sm:aspect-auto relative flex flex-col items-center justify-center p-10 text-white text-center"
           style={{ background: `linear-gradient(180deg, ${ed.theme_color}, ${ed.theme_color}cc, #000)` }}>
        {ed.capa_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ed.capa_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.3em] opacity-70 mb-3">Edição #{ed.numero}</div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-3">{ed.titulo}</h1>
          <div className="text-sm opacity-80">{ed.mes} · {ed.ano}</div>
          <div className="text-xs opacity-50 mt-6">{data.condominio.nome}</div>
        </div>
      </div>
    );
  }
  if (page === 1) {
    return (
      <div className="p-8 sm:p-12 bg-slate-900 text-white min-h-[60vh]">
        <ParceirosBloco parceiros={data.parceiros} accent={ed.accent_color} />
        <p className="text-xs text-white/40 text-center mt-6">
          Apoie quem apoia o seu condomínio.
        </p>
      </div>
    );
  }
  const sec = secoes[page - 2];
  const cat = categoriaMap[sec.categoria];
  return (
    <article className="p-8 sm:p-12">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{cat.icone}</span>
        <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: ed.theme_color }}>{cat.label}</span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">{sec.titulo}</h2>
      {sec.conteudo && <p className="text-slate-700 whitespace-pre-line leading-relaxed mb-6">{sec.conteudo}</p>}
      {sec.fotos.length > 0 && (
        <div className={`grid gap-2 ${sec.fotos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {sec.fotos.map((f, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={f} alt="" className="w-full rounded-lg object-cover aspect-[4/3]" />
          ))}
        </div>
      )}
    </article>
  );
}

// ─────────── MODO SCROLL (PDF estilo) ───────────

function ScrollMode({ data }: { data: Revista }) {
  const ed = data.edicao!;
  const secoes = ordenarComParceiros(data);
  return (
    <motion.div className="flex-1 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-6">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="relative aspect-[3/4] sm:aspect-[16/9] flex items-center justify-center text-white text-center p-10"
               style={{ background: `linear-gradient(180deg, ${ed.theme_color}, #000)` }}>
            {ed.capa_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ed.capa_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            )}
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.3em] opacity-70 mb-3">Edição #{ed.numero}</div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-3">{ed.titulo}</h1>
              <div className="text-sm opacity-80">{ed.mes} · {ed.ano}</div>
            </div>
          </div>
        </div>

        <ParceirosBloco parceiros={data.parceiros} accent={ed.accent_color} />

        {secoes.map(s => {
          const cat = categoriaMap[s.categoria];
          return (
            <article key={s.id} className="bg-white rounded-2xl p-8 sm:p-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{cat.icone}</span>
                <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: ed.theme_color }}>{cat.label}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{s.titulo}</h2>
              {s.conteudo && <p className="text-slate-700 whitespace-pre-line leading-relaxed mb-5">{s.conteudo}</p>}
              {s.fotos.length > 0 && (
                <div className={`grid gap-2 ${s.fotos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {s.fotos.map((f, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={f} alt="" className="w-full rounded-lg object-cover aspect-[4/3]" />
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─────────── MODO STORIES ───────────

function StoriesMode({ data }: { data: Revista }) {
  const ed = data.edicao!;
  const secoes = ordenarComParceiros(data);
  const stories = [
    { type: 'cover' as const },
    { type: 'parceiros' as const },
    ...secoes.map(s => ({ type: 'section' as const, secao: s })),
  ];
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const DUR = 8000, TICK = 50;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setIdx(i => Math.min(stories.length - 1, i + 1)), [stories.length]);
  const prev = useCallback(() => setIdx(i => Math.max(0, i - 1)), []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setProgress(p => {
        const nx = p + (TICK / DUR) * 100;
        if (nx >= 100) { next(); return 0; }
        return nx;
      });
    }, TICK);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused, idx, next]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(0);
  }, [idx]);

  const tap = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (e.clientX - r.left < r.width * 0.3) prev(); else next();
  };

  const s = stories[idx];

  return (
    <motion.div className="flex-1 flex items-center justify-center p-2 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative w-full max-w-md bg-black rounded-2xl overflow-hidden shadow-2xl" style={{ height: 'min(85vh, 750px)' }}>
        <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 p-2 px-3">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-white" style={{ width: i < idx ? '100%' : i === idx ? `${progress}%` : '0%' }} />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-10" onClick={tap}
             onMouseDown={() => setPaused(true)} onMouseUp={() => setPaused(false)}
             onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)} />

        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="absolute inset-0">
            {s.type === 'cover' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white text-center"
                   style={{ background: `linear-gradient(180deg, ${ed.theme_color}, ${ed.theme_color}bb, #000)` }}>
                {ed.capa_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ed.capa_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <div className="relative">
                  <div className="text-xs uppercase tracking-[0.3em] opacity-70 mb-3">Edição #{ed.numero}</div>
                  <h1 className="text-3xl font-bold mb-2">{ed.titulo}</h1>
                  <div className="text-sm opacity-80">{ed.mes} · {ed.ano}</div>
                </div>
              </div>
            )}
            {s.type === 'parceiros' && (
              <div className="w-full h-full p-6 bg-slate-900 text-white overflow-y-auto">
                <ParceirosBloco parceiros={data.parceiros} accent={ed.accent_color} />
              </div>
            )}
            {s.type === 'section' && (() => {
              const sec = s.secao;
              const cat = categoriaMap[sec.categoria];
              return (
                <div className="w-full h-full flex flex-col relative" style={{ background: `linear-gradient(180deg, ${ed.theme_color}33, #0F172A)` }}>
                  {sec.fotos[0] && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sec.fotos[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                    </>
                  )}
                  <div className="relative mt-auto p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{cat.icone}</span>
                      <span className="text-[10px] uppercase tracking-widest opacity-70">{cat.label}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 leading-tight">{sec.titulo}</h2>
                    {sec.conteudo && <p className="text-sm opacity-90 line-clamp-6 leading-relaxed">{sec.conteudo}</p>}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
