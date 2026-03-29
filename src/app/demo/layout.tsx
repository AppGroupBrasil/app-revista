import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo - Explore a Plataforma",
  description: "Explore todas as funcionalidades do APP REVISTA: revista digital, painel do síndico, área do morador, chamados, classificados e caronas.",
  openGraph: {
    title: "Demo APP REVISTA - Explore a Plataforma",
    description: "Veja na prática como funciona a plataforma de revistas digitais para condomínios.",
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
