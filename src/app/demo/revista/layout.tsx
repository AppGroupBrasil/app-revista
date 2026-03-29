import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revista Digital do Condomínio",
  description: "Leia a revista digital do seu condomínio com layout personalizado. 8 modos de visualização: flip, scroll, grid, stories, newspaper, slides, timeline e elegante.",
  openGraph: {
    title: "Revista Digital - APP REVISTA",
    description: "Revista digital interativa do condomínio com 8 layouts incríveis.",
  },
};

export default function RevistaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
