import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guiart Games e Colecionáveis",
  description:
    "Compra, venda e troca de games, consoles e colecionáveis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body
        className={`${spaceGrotesk.className} min-h-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}