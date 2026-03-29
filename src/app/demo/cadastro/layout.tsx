import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Cadastre-se como Síndico ou Administradora no APP REVISTA. Crie sua revista digital para condomínios em minutos.",
  openGraph: {
    title: "Cadastro - APP REVISTA",
    description: "Crie sua conta e comece a publicar revistas digitais para o seu condomínio.",
  },
};

export default function CadastroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
