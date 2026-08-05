import {
  Clock,
  MapPin,
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
  return (
    <section
      id="sobre"
      className="scroll-mt-28 bg-zinc-900 py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
            Conheça a {storeName}
          </span>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Uma loja feita por apaixonados por
            videogames.
          </h2>

          <p className="mt-8 text-lg leading-8 text-zinc-400">
            A {storeName} é especializada na
            compra, venda e troca de games,
            consoles e itens colecionáveis.
            Nossa missão é oferecer produtos bem
            avaliados, atendimento transparente
            e fotos reais de cada item anunciado.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <Store className="shrink-0 text-yellow-400" />

              <span>
                Loja física em São Paulo
              </span>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="shrink-0 text-yellow-400" />

              <span>
                {addressReference ||
                  "Próximo ao Metrô Jabaquara"}
              </span>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="mt-0.5 shrink-0 text-yellow-400" />

              <span className="whitespace-pre-line">
                {businessHours ||
                  "Consulte o horário pelo WhatsApp"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex h-[450px] items-center justify-center rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-800 to-black">
            <div className="text-center">
              <Store
                size={72}
                strokeWidth={1.4}
                className="mx-auto text-yellow-400"
              />

              <p className="mt-6 text-zinc-500">
                Futuramente
                <br />
                foto da fachada
                <br />
                da {storeName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
