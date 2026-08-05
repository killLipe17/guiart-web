import {
  AtSign,
  MapPin,
  MessageCircle,
  Smartphone,
} from "lucide-react";

import { getStoreSettings } from "@/lib/store-settings";

export async function Footer() {
  const settings =
    await getStoreSettings();

  const whatsappUrl =
    `https://wa.me/${settings.whatsappNumber}` +
    `?text=${encodeURIComponent(
      settings.whatsappMessage
    )}`;

  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <h2 className="text-3xl font-black text-yellow-400">
            {settings.storeName}
          </h2>

          <p className="mt-4 text-zinc-400">
            Compra, venda e troca de games,
            consoles e colecionáveis.
          </p>

          {settings.pickupNotice && (
            <p className="mt-4 text-sm leading-6 text-zinc-500">
              {settings.pickupNotice}
            </p>
          )}
        </div>

        <div>
          <h3 className="mb-5 font-bold text-white">
            Contato
          </h3>

          <div className="space-y-4 text-zinc-400">
            <div className="flex items-center gap-3">
              <MessageCircle size={18} />

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-yellow-400"
              >
                {settings.whatsappDisplay}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <AtSign size={18} />

              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-yellow-400"
              >
                {settings.instagramHandle}
              </a>
            </div>

            {settings.tiktokUrl && (
              <div className="flex items-center gap-3">
                <Smartphone size={18} />

                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-yellow-400"
                >
                  {settings.tiktokHandle ||
                    "TikTok"}
                </a>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-bold text-white">
            Endereço
          </h3>

          <div className="flex items-start gap-3 text-zinc-400">
            <MapPin
              size={18}
              className="mt-1 shrink-0"
            />

            <div>
              <p className="whitespace-pre-line leading-7">
                {settings.address}
              </p>

              {settings.addressReference && (
                <p className="mt-3 text-sm text-zinc-500">
                  {settings.addressReference}
                </p>
              )}

              {settings.businessHours && (
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-500">
                  {settings.businessHours}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()}{" "}
        {settings.storeName}. Todos os
        direitos reservados.
      </div>
    </footer>
  );
}
