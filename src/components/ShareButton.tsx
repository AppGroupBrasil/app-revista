'use client';

import { useState } from 'react';

interface Props {
  url: string;
  title?: string;
  text?: string;
  label?: string;
  className?: string;
}

export default function ShareButton({ url, title = 'App Revista', text, label = 'Compartilhar', className = '' }: Props) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleShare = async () => {
    const absolute = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    const fullText = text || title;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: fullText, url: absolute });
        return;
      } catch { /* user cancel */ }
    }

    try {
      await navigator.clipboard.writeText(absolute);
      setFeedback('Link copiado!');
      setTimeout(() => setFeedback(null), 2000);
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${fullText}\n${absolute}`)}`, '_blank');
    }
  };

  const wa = (() => {
    const absolute = url.startsWith('http') ? url : (typeof window !== 'undefined' ? `${window.location.origin}${url}` : url);
    return `https://wa.me/?text=${encodeURIComponent(`${text || title}\n${absolute}`)}`;
  })();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary-hover transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-5.464-2.684m5.464 2.684L9.316 14.658m6.368-9.342L9.316 9.342" />
        </svg>
        {label}
      </button>
      <a
        href={wa} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"
        title="Compartilhar no WhatsApp"
        aria-label="Compartilhar no WhatsApp"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
      </a>
      {feedback && <span className="text-xs text-green-600 font-medium">{feedback}</span>}
    </div>
  );
}
