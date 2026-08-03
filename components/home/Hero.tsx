import { Button } from "@/components/ui/Button";
import { MapPin, MessageCircle, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950">

      {/* brilho de fundo */}
      <div className="absolute left-1/2 top-[-120px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-400/15 via-yellow-300/10 to-purple-500/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-28 lg:grid-cols-2">

        {/* TEXTO */}

        <div>

          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-5 py-2 text-sm text-yellow-400">
            <MapPin size={16} />
            Loja física ao lado do Metrô Jabaquara
          </div>

          <h1 className="mt-10 text-6xl font-black leading-tight">

            Games, consoles e

            <span className="block text-yellow-400">
              colecionáveis
            </span>

            para quem ama videogames.

          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-zinc-400">
            Compra, venda e troca de games retrô, consoles clássicos e itens
            colecionáveis com atendimento especializado.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">

            <Button>
              <span className="flex items-center gap-2">
                Ver catálogo
                <ArrowRight size={18} />
              </span>
            </Button>

            <Button variant="secondary">
              <span className="flex items-center gap-2">
                <MessageCircle size={18} />
                WhatsApp
              </span>
            </Button>

          </div>

        </div>

        {/* LADO DIREITO */}

        <div className="hidden lg:flex items-center justify-center">

          <div className="relative">

            <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-r from-yellow-400/30 via-purple-500/20 to-yellow-400/20 blur-3xl" />

            <div className="relative flex h-[450px] w-[450px] items-center justify-center rounded-full border border-yellow-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black shadow-2xl">

              <div className="text-center">

                <div className="mb-6 text-7xl">
                  🎮
                </div>

                <p className="text-lg text-zinc-500">
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