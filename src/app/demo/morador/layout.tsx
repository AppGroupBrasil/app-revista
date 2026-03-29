import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Área do Morador",
  description: "Abra chamados, publique classificados e ofereça caronas no seu condomínio. Tudo pelo celular, com acompanhamento em tempo real.",
  openGraph: {
    title: "Área do Morador - APP REVISTA",
    description: "Portal do morador: chamados, classificados e caronas coletivas.",
  },
};

export default function MoradorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
