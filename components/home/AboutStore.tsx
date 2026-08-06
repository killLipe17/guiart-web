import Image from "next/image";
import {
  Clock3,
  Gamepad2,
  MapPin,
  ShieldCheck,
  Store,
} from "lucide-react";

type AboutStoreProps = {
  storeName: string;
  addressReference: string;
  businessHours: string;
};

export function AboutStore({
  storeName,
  addressReference,
  businessHours,
}: AboutStoreProps) {
  const locationText =
    addressReference.trim() ||
    "Consulte a localização no rodapé";

  const hoursText =
    businessHours.trim() ||
    "Consulte o horário pelo WhatsApp";

  return (
    <section
      id="sobre"
      className="relative scroll-mt-28 overflow-hidden border-y border-purple-500/10 bg-[#0b0910] py-14 sm:py-16 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 20%, rgba(245,196,0,.11), transparent 26rem), radial-gradient(circle at 88% 72%, rgba(111,44,255,.15), transparent 30rem)",
        }}
      />

      <div
        aria-hidden="true"
        className="guiart-pixel-line absolute inset-x-0 top-0 h-px"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-yellow-300">
            <Gamepad2 size={17} />
            Conheça a {storeName}
          </span>

          <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            Uma loja feita por quem realmente
            ama videogames.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            A {storeName} é especializada na
            compra, venda e troca de games,
            consoles e itens colecionáveis.
            Trabalhamos com avaliação cuidadosa,
            atendimento transparente e fotos
            reais de cada item anunciado.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-white/[0.025] p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                  <Store size={19} />
                </span>

                <div>
                  <p className="font-bold text-white">
                    Loja física
                  </p>

                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    Atendimento presencial e
                    próximo.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-white/[0.025] p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-purple-300">
                  <ShieldCheck size={19} />
                </span>

                <div>
                  <p className="font-bold text-white">
                    Compra segura
                  </p>

                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    Produtos avaliados e fotos
                    reais.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-black/20 px-4 py-3.5">
              <MapPin
                size={19}
                className="mt-0.5 shrink-0 text-yellow-300"
              />

              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-600">
                  Localização
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-300">
                  {locationText}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-black/20 px-4 py-3.5">
              <Clock3
                size={19}
                className="mt-0.5 shrink-0 text-purple-300"
              />

              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-600">
                  Horário
                </p>

                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-300">
                  {hoursText}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-[48px] bg-purple-600/15 blur-3xl"
          />

          <div className="guiart-surface relative overflow-hidden rounded-[32px] p-3 sm:p-4">
            <div className="relative overflow-hidden rounded-[24px] border border-yellow-300/20 bg-[#eee8d8] px-6 pb-7 pt-7 sm:px-8 sm:pb-8 sm:pt-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(74,46,31,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(74,46,31,.35) 1px, transparent 1px)",
                  backgroundSize:
                    "20px 20px",
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-800">
                      Experiência Guiart
                    </p>

                    <p className="mt-3 max-w-[230px] text-2xl font-black leading-tight text-[#18121d] sm:text-3xl">
                      Mais que uma loja: um ponto
                      de encontro para gamers.
                    </p>
                  </div>

                  <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36">
                    <Image
                      src="/brand/mascote-guiart.png"
                      alt="Mascote da Guiart Games"
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 112px, 144px"
                      className="object-contain"
                      style={{
                        imageRendering:
                          "pixelated",
                      }}
                    />
                  </div>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    ["COMPRA", "Itens selecionados"],
                    ["VENDA", "Negociação clara"],
                    ["TROCA", "Avaliação justa"],
                  ].map(([title, text]) => (
                    <div
                      key={title}
                      className="rounded-xl border border-[#3b2b22]/15 bg-white/60 px-3 py-3 text-center shadow-sm"
                    >
                      <p className="text-xs font-black tracking-[0.12em] text-purple-800">
                        {title}
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-[#5b4b42]">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-[#3b2b22]/15 bg-[#171018] px-4 py-4 text-center">
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-yellow-300">
                    Games • Consoles • Colecionáveis
                  </p>

                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    Atendimento especializado para
                    quem valoriza cada detalhe.
                  </p>
                </div>
              </div>
            </div>

            <div className="guiart-wood-line mt-3 h-1.5 rounded-full opacity-85" />
          </div>
        </div>
      </div>
    </section>
  );
}
