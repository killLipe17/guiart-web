import {
  ArrowRight,
  Check,
  Gamepad2,
  MapPin,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

type HeroProps = {
  addressReference: string;
  whatsappUrl: string;
};

export function Hero({
  addressReference,
  whatsappUrl,
}: HeroProps) {
  const locationText =
    addressReference.trim() ||
    "Atendimento presencial";

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-80px] h-[420px] w-[420px] max-w-full -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-400/15 via-yellow-300/10 to-purple-500/15 blur-3xl sm:h-[650px] sm:w-[650px]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="min-w-0 max-w-full">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-xs leading-5 text-yellow-400 sm:px-5 sm:text-sm">
            <MapPin
              className="shrink-0"
              size={16}
            />

            <span>
              Loja física • {locationText}
            </span>
          </div>

          <h1 className="mt-7 max-w-full break-words text-4xl font-black leading-[1.08] tracking-tight text-white sm:mt-9 sm:text-5xl lg:text-6xl">
            Games, consoles e{" "}
            <span className="text-yellow-400">
              colecionáveis
            </span>{" "}
            para quem ama videogames.
          </h1>

          <p className="mt-6 max-w-2xl break-words text-base leading-7 text-zinc-400 sm:mt-8 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
            Compra, venda e troca de games
            retrô, consoles clássicos e itens
            colecionáveis com atendimento
            especializado.
          </p>

          <div className="mt-8 grid w-full gap-3 sm:mt-10 sm:flex sm:flex-wrap sm:gap-4">
            <Link
              href="/catalogo"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-yellow-300 sm:w-auto"
            >
              Ver catálogo
              <ArrowRight size={18} />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-800 sm:w-auto"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>

          <div className="mt-9 grid gap-3 text-sm text-zinc-500 sm:mt-12 sm:flex sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
            <span className="inline-flex items-center gap-2">
              <Check
                size={16}
                className="text-yellow-400"
              />
              Loja física
            </span>

            <span className="inline-flex items-center gap-2">
              <Check
                size={16}
                className="text-yellow-400"
              />
              Fotos reais
            </span>

            <span className="inline-flex items-center gap-2">
              <Check
                size={16}
                className="text-yellow-400"
              />
              Atendimento especializado
            </span>
          </div>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-110 rounded-full bg-gradient-to-r from-yellow-400/30 via-purple-500/20 to-yellow-400/20 blur-3xl"
            />

            <div className="relative flex h-[450px] w-[450px] items-center justify-center rounded-full border border-yellow-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black shadow-2xl">
              <div className="text-center">
                <Gamepad2
                  size={72}
                  strokeWidth={1.4}
                  className="mx-auto mb-6 text-yellow-400"
                />

                <p className="text-lg leading-7 text-zinc-500">
                  Em breve
                  <br />
                  fotos reais
                  <br />
                  da Guiart
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
