import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-app px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-[#D4AF37] mb-2">404</div>
        <h1 className="text-2xl font-bold text-primary mb-2">Página não encontrada</h1>
        <p className="text-gray-600 mb-6">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors"
          >
            Página Inicial
          </Link>
          <Link
            href="/demo"
            className="px-6 py-3 border-2 border-[#1E3A5F] text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors"
          >
            Ver Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
