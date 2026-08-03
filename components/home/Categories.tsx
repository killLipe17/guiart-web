import {
  Gamepad2,
  MonitorSmartphone,
  Package,
  Trophy,
} from "lucide-react";

const categories = [
  {
    title: "Games",
    icon: Gamepad2,
    description: "Jogos para todas as gerações.",
  },
  {
    title: "Consoles",
    icon: MonitorSmartphone,
    description: "Do Atari ao PlayStation 5.",
  },
  {
    title: "Colecionáveis",
    icon: Trophy,
    description: "Action figures, edições especiais e muito mais.",
  },
  {
    title: "Acessórios",
    icon: Package,
    description: "Controles, cabos, fontes e periféricos.",
  },
];

export function Categories() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <span className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
            Especialidades
          </span>

          <h2 className="mt-4 text-5xl font-black">
            Tudo para quem ama videogames
          </h2>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <article
                key={category.title}
                className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/10 transition group-hover:scale-110">

                  <Icon
                    size={34}
                    className="text-yellow-400"
                  />

                </div>

                <h3 className="text-2xl font-black">
                  {category.title}
                </h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  {category.description}
                </p>

              </article>
            );
          })}

        </div>

      </div>
    </section>
  );
}