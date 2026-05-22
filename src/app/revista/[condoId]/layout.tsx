import type { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';
const SITE_URL = 'https://apprevista.com.br';

interface RevistaData {
  condominio?: { nome?: string };
  edicao?: {
    numero?: number;
    titulo?: string;
    mes?: string | null;
    ano?: number | null;
    capa_url?: string | null;
  } | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ condoId: string }>;
}): Promise<Metadata> {
  const { condoId } = await params;
  let data: RevistaData | null = null;
  try {
    const r = await fetch(`${API_URL}/publico/condominios/${condoId}/revista/atual`, {
      next: { revalidate: 300 },
    });
    if (r.ok) data = await r.json();
  } catch {
    /* ignore */
  }

  const nome = data?.condominio?.nome || 'Revista do Condomínio';
  const edicao = data?.edicao;
  const titulo = edicao
    ? `${nome} — Edição ${edicao.numero}${edicao.titulo ? ': ' + edicao.titulo : ''}`
    : `${nome} — Revista Digital`;
  const desc = edicao
    ? `Edição ${edicao.numero}${edicao.mes ? ' · ' + edicao.mes : ''}${edicao.ano ? '/' + edicao.ano : ''} da revista digital de ${nome}.`
    : `Revista digital de ${nome}.`;
  const capa = edicao?.capa_url || `${SITE_URL}/og-image.png`;
  const url = `${SITE_URL}/revista/${condoId}`;

  return {
    title: titulo,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: titulo,
      description: desc,
      url,
      siteName: 'APP REVISTA',
      images: [{ url: capa, width: 1200, height: 630, alt: titulo }],
      locale: 'pt_BR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: desc,
      images: [capa],
    },
  };
}

export default function RevistaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
