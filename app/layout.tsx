import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { getStoreSettings } from "@/lib/store-settings";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await getStoreSettings();

  return {
    title: settings.storeName,
    description:
      "Compra, venda e troca de games, consoles e colecionáveis.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const settings =
    await getStoreSettings();

  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body
        className={`${spaceGrotesk.className} flex min-h-full flex-col`}
      >
        <CartProvider>
          {children}

          <CartDrawer
            storeName={
              settings.storeName
            }
            whatsappNumber={
              settings.whatsappNumber
            }
            whatsappMessage={
              settings.whatsappMessage
            }
            pickupNotice={
              settings.pickupNotice
            }
            address={
              settings.address
            }
            addressReference={
              settings.addressReference
            }
          />
        </CartProvider>
      </body>
    </html>
  );
}
