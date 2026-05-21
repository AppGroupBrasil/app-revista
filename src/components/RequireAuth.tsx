'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

interface Props {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

export default function RequireAuth({ children, requireSuperAdmin = false }: Props) {
  const { user, loading, isAuthenticated, isSuperAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (requireSuperAdmin && !isSuperAdmin) {
      router.replace('/painel');
    }
  }, [loading, isAuthenticated, isSuperAdmin, requireSuperAdmin, router, pathname]);

  if (loading || !isAuthenticated || (requireSuperAdmin && !isSuperAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-soft">
        <div className="text-text-light text-sm">Carregando…</div>
      </div>
    );
  }

  return <>{children}</>;
}
