'use client';

import { useRef, useState } from 'react';
import { tokens } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export default function PhotoUpload({ value, onChange, max = 6 }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const upload = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const t = tokens.access;
    const r = await fetch(`${API_URL}/uploads`, {
      method: 'POST',
      headers: t ? { Authorization: `Bearer ${t}` } : {},
      body: fd,
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({ message: 'Erro no upload' }));
      throw new Error(e.message || 'Erro no upload');
    }
    const data = await r.json();
    // API devolve URL relativa /api/v1/uploads/... — prefixar com host da API
    if (data.url.startsWith('http')) return data.url;
    const apiHost = API_URL.replace(/\/api\/v1\/?$/, '');
    return `${apiHost}${data.url}`;
  };

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true); setErro(null);
    try {
      const slots = max - value.length;
      const toUpload = files.slice(0, slots);
      const urls = await Promise.all(toUpload.map(upload));
      onChange([...value, ...urls]);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro no upload');
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = '';
    }
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <input
        ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        multiple onChange={handle} className="hidden"
      />

      <div className="grid grid-cols-3 gap-2">
        {value.map((url, i) => (
          <div key={i} className="relative aspect-square bg-surface-alt rounded-lg overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button" onClick={() => remove(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
              aria-label="Remover"
            >×</button>
          </div>
        ))}

        {value.length < max && (
          <button
            type="button" onClick={() => ref.current?.click()} disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary text-text-light hover:text-primary transition flex flex-col items-center justify-center gap-1 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px]">Enviando…</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Adicionar foto</span>
              </>
            )}
          </button>
        )}
      </div>

      {erro && <p className="text-xs text-red-600 mt-2">{erro}</p>}
      <p className="text-xs text-text-muted mt-2">
        JPG, PNG, WebP ou GIF · até 5MB · máximo {max} fotos
      </p>
    </div>
  );
}
