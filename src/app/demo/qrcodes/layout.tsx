import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Codes do Condomínio",
  description: "Acesse os QR Codes do condomínio para revista digital, área do morador, chamados e muito mais. Escaneie e tenha tudo na palma da mão.",
  openGraph: {
    title: "QR Codes - APP REVISTA",
    description: "QR Codes inteligentes para acesso rápido aos serviços do condomínio.",
  },
};

export default function QRCodesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
