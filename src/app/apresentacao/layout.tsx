import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apresentação Comercial — APP REVISTA",
  description: "Apresentação comercial do APP REVISTA — Plataforma de Revistas Digitais para Condomínios. 40+ categorias, 8 layouts, gestão completa.",
  openGraph: {
    title: "Apresentação Comercial — APP REVISTA",
    description: "Conheça o APP REVISTA: revista digital profissional para condomínios com 40+ categorias, 4 perfis de acesso e gestão completa.",
  },
};

export default function ApresentacaoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
