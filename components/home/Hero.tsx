import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react";

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
    <section className="relative w-full overflow-hidden border-b border-purple-500/10 bg-[#08070b]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 16% 18%, rgba(245,196,0,.15), transparent 28rem), radial-gradient(circle at 84% 26%, rgba(111,44,255,.20), transparent 30rem)",
        }}
      />

      <div
        aria-hidden="true"
        className="guiart-pixel-line absolute inset-x-0 bottom-0 h-px opacity-80"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:py-24">
        <div className="min-w-0 max-w-full">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-yellow-400/35 bg-yellow-400/10 px-4 py-2 text-xs font-semibold leading-5 text-yellow-300 sm:px-5 sm:text-sm">
            <MapPin
              className="shrink-0"
              size={16}
            />

            <span>
              Loja física • {locationText}
            </span>
          </div>

          <h1 className="mt-7 max-w-3xl break-words text-4xl font-black leading-[1.05] tracking-tight text-white sm:mt-9 sm:text-5xl lg:text-6xl">
            Games, consoles e{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
              colecionáveis
            </span>{" "}
            para quem ama videogames.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8 lg:text-xl">
            Compra, venda e troca de games retrô,
            consoles clássicos e itens especiais
            com fotos reais e atendimento
            especializado.
          </p>

          <div className="mt-8 grid w-full gap-3 sm:mt-10 sm:flex sm:flex-wrap sm:gap-4">
            <Link
              href="/catalogo"
              className="guiart-button-primary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black transition sm:w-auto"
            >
              Ver catálogo
              <ArrowRight size={18} />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="guiart-button-secondary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition sm:w-auto"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>

          <div className="mt-9 grid gap-3 text-sm text-zinc-400 sm:mt-11 sm:flex sm:flex-wrap sm:gap-x-7 sm:gap-y-3">
            {[
              "Loja física",
              "Fotos reais",
              "Atendimento especializado",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-md border border-yellow-400/30 bg-yellow-400/10">
                  <Check
                    size={13}
                    className="text-yellow-300"
                  />
                </span>

                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-[48px] bg-purple-600/15 blur-3xl"
          />

          <div className="guiart-surface relative overflow-hidden rounded-[34px] p-3 sm:p-4">
            <div className="relative overflow-hidden rounded-[26px] border border-yellow-300/20 bg-[#eee8d8] px-6 pb-7 pt-8 sm:px-9 sm:pb-9 sm:pt-10">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.16]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(74,46,31,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(74,46,31,.35) 1px, transparent 1px)",
                  backgroundSize:
                    "20px 20px",
                }}
              />

              <div className="relative flex items-start justify-between gap-5">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-purple-700/20 bg-purple-700/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-purple-800">
                    <Sparkles size={14} />
                    Universo Guiart
                  </span>

                  <p className="mt-4 max-w-[210px] text-2xl font-black leading-tight text-[#18121d] sm:text-3xl">
                    Retrô, raridades e muita história.
                  </p>
                </div>

                <div className="relative h-32 w-32 shrink-0 sm:h-44 sm:w-44">
                  <Image
                    src="/brand/mascote-guiart.png"
                    alt="Mascote da Guiart Games"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 640px) 128px, 176px"
                    className="object-contain"
                    style={{
                      imageRendering: "pixelated",
                    }}
                  />
                </div>
              </div>

              <div className="relative mt-7 grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  ["COMPRA", "Itens selecionados"],
                  ["VENDA", "Fotos reais"],
                  ["TROCA", "Avaliação transparente"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-xl border border-[#3b2b22]/15 bg-white/55 px-2 py-3 text-center shadow-sm backdrop-blur-sm sm:px-3"
                  >
                    <p className="text-[11px] font-black tracking-[0.12em] text-purple-800 sm:text-xs">
                      {title}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#5b4b42] sm:text-[11px]">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="guiart-wood-line mt-3 h-1.5 rounded-full opacity-85" />
          </div>
        </div>
      </div>
    </section>
  );
}
