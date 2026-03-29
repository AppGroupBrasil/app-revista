import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://apprevista.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "APP REVISTA - Revista Digital para Condomínios",
    template: "%s | APP REVISTA",
  },
  description: "Crie revistas digitais profissionais para condomínios. Gerencie chamados, classificados, caronas e mostre tudo o que sua gestão realiza. Planos a partir de R$99/mês.",
  keywords: [
    "revista digital condomínio",
    "gestão condominial",
    "administradora de condomínios",
    "síndico",
    "chamados condomínio",
    "revista para condomínio",
    "app para condomínio",
    "comunicação condominial",
    "QR code condomínio",
    "classificados condomínio",
  ],
  authors: [{ name: "APP REVISTA" }],
  creator: "APP REVISTA",
  publisher: "APP REVISTA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "APP REVISTA",
    title: "APP REVISTA - Revista Digital para Condomínios",
    description: "Sua administração em uma revista digital profissional. Chamados, classificados, caronas, QR Code e muito mais.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "APP REVISTA - Revista Digital para Condomínios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "APP REVISTA - Revista Digital para Condomínios",
    description: "Sua administração em uma revista digital profissional. Mostre tudo o que você realiza pelo condomínio.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E3A5F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="App Revista" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "APP REVISTA",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description: "Plataforma de revistas digitais para condomínios. Gerencie chamados, classificados, caronas e comunicação condominial.",
              url: siteUrl,
              offers: [
                {
                  "@type": "Offer",
                  name: "Plano Síndico",
                  price: "99.00",
                  priceCurrency: "BRL",
                  description: "1 condomínio, até 25 categorias, revista digital personalizada",
                },
                {
                  "@type": "Offer",
                  name: "Plano Administradora",
                  price: "199.00",
                  priceCurrency: "BRL",
                  description: "Condomínios ilimitados, todas as categorias, relatórios e analytics",
                },
              ],

            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
