import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel do Síndico",
  description: "Gerencie o conteúdo do seu condomínio: ative categorias, edite a revista, acompanhe chamados e personalize tudo pelo painel administrativo.",
  openGraph: {
    title: "Painel do Síndico - APP REVISTA",
    description: "Painel administrativo completo para síndicos. Gerencie categorias, chamados e revista digital.",
  },
};

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
