import {
  AtSign,
  Clock3,
  MapPin,
  MessageCircle,
} from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { getStoreSettings } from "@/lib/store-settings";

function TikTokIcon({
  size = 18,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14.5 4.2c.8 1.8 2.1 2.9 4 3.2v3.2c-1.5-.1-2.8-.6-4-1.4v6.2a5.8 5.8 0 1 1-5-5.8v3.3a2.6 2.6 0 1 0 1.8 2.5V3.2h3.2v1z"
        fill="currentColor"
      />
    </svg>
  );
}

export async function Footer() {
  const settings =
    await getStoreSettings();

  const whatsappUrl =
    `https://wa.me/${settings.whatsappNumber}` +
    `?text=${encodeURIComponent(
      settings.whatsappMessage
    )}`;

  return (
    <footer className="relative overflow-hidden border-t border-purple-500/15 bg-[#070609]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 10%, rgba(245,196,0,.10), transparent 24rem), radial-gradient(circle at 90% 20%, rgba(111,44,255,.13), transparent 28rem)",
        }}
      />

      <div
        aria-hidden="true"
        className="guiart-pixel-line absolute inset-x-0 top-0 h-px"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.25fr_.8fr_1fr] lg:gap-14 lg:py-16">
        <div>
          <Logo />

          <p className="mt-5 max-w-md leading-7 text-zinc-400">
            Compra, venda e troca de games,
            consoles e colecionáveis com
            atendimento próximo e fotos reais.
          </p>

          {settings.pickupNotice && (
            <div className="mt-5 rounded-2xl border border-yellow-400/15 bg-yellow-400/[0.06] px-4 py-3 text-sm leading-6 text-zinc-400">
              {settings.pickupNotice}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
            Contato
          </h3>

          <div className="mt-5 space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-white/[0.025] px-4 py-3 text-sm text-zinc-300 transition hover:border-yellow-400/35 hover:text-yellow-300"
            >
              <MessageCircle
                size={18}
                className="text-yellow-300"
              />
              {settings.whatsappDisplay}
            </a>

            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-white/[0.025] px-4 py-3 text-sm text-zinc-300 transition hover:border-purple-400/35 hover:text-purple-300"
            >
              <AtSign
                size={18}
                className="text-purple-300"
              />
              {settings.instagramHandle}
            </a>

            {settings.tiktokUrl && (
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-white/[0.025] px-4 py-3 text-sm text-zinc-300 transition hover:border-cyan-300/35 hover:text-cyan-200"
              >
                <span className="text-cyan-200">
                  <TikTokIcon />
                </span>

                {settings.tiktokHandle ||
                  "TikTok"}
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
            Visite a loja
          </h3>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-white/[0.025] p-4">
            <div className="flex items-start gap-3">
              <MapPin
                size={19}
                className="mt-0.5 shrink-0 text-yellow-300"
              />

              <div>
                <p className="whitespace-pre-line text-sm leading-6 text-zinc-300">
                  {settings.address}
                </p>

                {settings.addressReference && (
                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    {settings.addressReference}
                  </p>
                )}
              </div>
            </div>

            {settings.businessHours && (
              <div className="mt-4 flex items-start gap-3 border-t border-zinc-800 pt-4">
                <Clock3
                  size={18}
                  className="mt-0.5 shrink-0 text-purple-300"
                />

                <p className="whitespace-pre-line text-sm leading-6 text-zinc-500">
                  {settings.businessHours}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative border-t border-zinc-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-center text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()}{" "}
            {settings.storeName}. Todos os
            direitos reservados.
          </p>

          <p className="uppercase tracking-[0.14em]">
            Games • Consoles • Colecionáveis
          </p>
        </div>
      </div>
    </footer>
  );
}
