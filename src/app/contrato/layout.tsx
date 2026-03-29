import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contrato de Prestação de Serviços",
  description: "Contrato de prestação de serviços de software APP REVISTA - Revista Digital para Condomínios. Conheça nossos termos e condições.",
  openGraph: {
    title: "Contrato - APP REVISTA",
    description: "Modelo de contrato de prestação de serviços do APP REVISTA.",
  },
};

export default function ContratoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
