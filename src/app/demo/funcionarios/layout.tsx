import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestão de Funcionários",
  description: "Gerencie funcionários do condomínio com tarefas via QR Code, checklists, vistorias, rastreamento GPS e relatórios detalhados.",
  openGraph: {
    title: "Gestão de Funcionários - APP REVISTA",
    description: "Sistema completo de gestão de funcionários para condomínios com QR Code e GPS.",
  },
};

export default function FuncionariosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
