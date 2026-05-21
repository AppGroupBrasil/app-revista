import Link from 'next/link';
import { ReactNode } from 'react';

interface PageHeaderProps {
  backHref?: string;
  backLabel?: string;
  exitHref?: string;
  variant?: 'light' | 'dark';
  children?: ReactNode;
  className?: string;
}

export default function PageHeader({
  backHref = '/demo',
  backLabel = 'Voltar',
  exitHref = '/',
  variant = 'light',
  children,
  className = '',
}: PageHeaderProps) {
  const isDark = variant === 'dark';
  const backCls = isDark
    ? 'text-white/70 hover:text-white'
    : 'text-text-light hover:text-primary';
  const exitCls = isDark
    ? 'px-3 py-1.5 text-xs font-medium text-white/70 bg-white/10 rounded-lg hover:bg-white/20 hover:text-white'
    : 'px-4 py-2 text-sm font-medium text-red-500 bg-red-50 rounded-xl hover:bg-red-100';

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <Link href={backHref} className={`inline-flex items-center gap-2 transition-colors text-sm ${backCls}`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {backLabel}
      </Link>
      {children}
      <Link href={exitHref} className={`${exitCls} transition-all`}>Sair</Link>
    </div>
  );
}
