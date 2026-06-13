'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tokens, decodeJwt } from '../../lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

// Recebe ?token=<JWT curto da central>, troca por sessão local e entra direto.
export default function SsoPage() {
  const router = useRouter();
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) { setErro(true); return; }
    (async () => {
      try {
        const r = await fetch(`${API_URL}/sso`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        if (!r.ok) throw new Error('sso');
        const data = await r.json();
        tokens.set(data.access_token, data.refresh_token || '');
        const u = decodeJwt(data.access_token);
        router.replace(u?.role_global === 'superadmin' ? '/master' : '/painel');
      } catch {
        setErro(true);
      }
    })();
  }, [router]);

  if (erro) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 }}>
        <p>Não foi possível entrar pelo login único.</p>
        <button onClick={() => router.replace('/login')} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>Ir para o login</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #eee', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}
