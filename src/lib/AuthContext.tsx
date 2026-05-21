'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { tokens, decodeJwt, hasAccess, logout as doLogout, JwtPayload } from './auth';

interface AuthCtx {
  user: JwtPayload | null;
  loading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  refresh: () => void;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = useCallback(() => {
    const t = tokens.access;
    setUser(t ? decodeJwt(t) : null);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const logout = useCallback(async () => {
    await doLogout();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <Ctx.Provider value={{
      user,
      loading,
      isAuthenticated: hasAccess(user),
      isSuperAdmin: user?.role_global === 'superadmin',
      refresh: load,
      logout,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return v;
}
