'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import { useAuth } from '@/lib/AuthContext';

interface Props {
  subtitle?: string;
  rightExtras?: ReactNode;
}

export default function AppHeader({ subtitle = 'Painel do Síndico', rightExtras }: Props) {
  const { user, isSuperAdmin, logout } = useAuth();
  const iniciais = (user?.nome || '?').split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <Link href="/painel" className="flex items-start gap-2">
              <Image src="/images/logo.png" alt="App Revista" width={32} height={32} className="rounded-lg" />
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-bold gradient-text leading-none">APP REVISTA</span>
                <span className="mt-1 block text-[12px] font-bold uppercase tracking-[0.22em] text-primary leading-none">Condominio</span>
              </div>
            </Link>
            <span className="text-border-light hidden sm:inline">|</span>
            <span className="text-sm text-text-light hidden sm:inline">{subtitle}</span>
          </div>
          <div className="flex items-center gap-3">
            {rightExtras}
            {isSuperAdmin && (
              <Link
                href="/master"
                className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all"
              >
                🛡 Master
              </Link>
            )}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold">
              {iniciais}
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
