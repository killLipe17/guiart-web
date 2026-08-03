import {
  ShieldCheck,
  Gamepad2,
  Store,
  Trophy,
} from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Compra segura",
    text: "Produtos revisados e descrição transparente.",
  },
  {
    icon: Gamepad2,
    title: "Especialistas em retrô",
    text: "Games e consoles de diversas gerações.",
  },
  {
    icon: Store,
    title: "Loja física",
    text: "Visite nossa unidade ao lado do Metrô Jabaquara.",
  },
  {
    icon: Trophy,
    title: "Peças raras",
    text: "Itens difíceis de encontrar no mercado.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-zinc-900 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">

          <h2 className="text-4xl font-black">
            Por que comprar na
            <span className="text-yellow-400">
              {" "}
              Guiart?
            </span>
          </h2>

          <p className="mt-4 text-zinc-400">
            Muito mais do que uma loja.
            Somos apaixonados por videogames.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400"
              >
                <Icon
                  size={36}
                  className="mb-6 text-yellow-400"
                />

                <h3 className="mb-3 text-xl font-bold">
                  {item.title}
                </h3>

                <p className="text-zinc-400">
                  {item.text}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}