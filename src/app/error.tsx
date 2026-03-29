'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-[#1E3A5F] mb-2">Algo deu errado</h1>
        <p className="text-gray-600 mb-6">
          Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#1E3A5F] text-white rounded-xl font-semibold hover:bg-[#16304D] transition-colors"
          >
            Tentar Novamente
          </button>
          <a
            href="/"
            className="px-6 py-3 border-2 border-[#1E3A5F] text-[#1E3A5F] rounded-xl font-semibold hover:bg-[#1E3A5F]/5 transition-colors"
          >
            Página Inicial
          </a>
        </div>
      </div>
    </div>
  );
}
