import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acompanhar Solicitação",
  description: "Acompanhe o status do seu chamado ou solicitação no condomínio em tempo real. Veja o histórico, envie mensagens e receba atualizações.",
  openGraph: {
    title: "Acompanhar Solicitação - APP REVISTA",
    description: "Tracking de chamados e solicitações do condomínio em tempo real.",
  },
};

export default function AcompanharLayout({ children }: { children: React.ReactNode }) {
  return children;
}
