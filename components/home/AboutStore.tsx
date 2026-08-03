import { MapPin, Clock, Store } from "lucide-react";

export function AboutStore() {
  return (
    <section className="bg-zinc-900 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        <div>

          <span className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
            Conheça a Guiart
          </span>

          <h2 className="mt-4 text-5xl font-black">
            Uma loja feita por apaixonados por videogames.
          </h2>

          <p className="mt-8 text-lg leading-8 text-zinc-400">
            A Guiart Games e Colecionáveis é especializada na compra, venda e
            troca de games, consoles e itens colecionáveis. Nossa missão é
            oferecer produtos bem avaliados, atendimento transparente e fotos
            reais de cada item anunciado.
          </p>

          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-4">
              <Store className="text-yellow-400" />
              <span>Loja física em São Paulo</span>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-yellow-400" />
              <span>Ao lado do Metrô Jabaquara</span>
            </div>

            <div className="flex items-center gap-4">
              <Clock className="text-yellow-400" />
              <span>Atendimento rápido pelo WhatsApp</span>
            </div>

          </div>

        </div>

        <div>

          <div className="flex h-[450px] items-center justify-center rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-800 to-black">

            <div className="text-center">

              <div className="text-7xl">
                🏪
              </div>

              <p className="mt-6 text-zinc-500">
                Futuramente
                <br />
                foto da fachada
                <br />
                da Guiart
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}