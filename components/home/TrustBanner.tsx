import {
  ShieldCheck,
  BadgeCheck,
  Truck,
  Store,
} from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Fotos Reais",
  },
  {
    icon: BadgeCheck,
    title: "Produtos Avaliados",
  },
  {
    icon: Store,
    title: "Loja Física",
  },
  {
    icon: Truck,
    title: "Envio para Todo Brasil",
  },
];

export function TrustBanner() {
  return (
    <section className="border-y border-zinc-800 bg-black">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 md:grid-cols-2 lg:grid-cols-4">

        {items.map((item) => {

          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-4"
            >
              <div className="rounded-xl bg-yellow-500/10 p-3">
                <Icon
                  size={26}
                  className="text-yellow-400"
                />
              </div>

              <span className="font-semibold">
                {item.title}
              </span>
            </div>
          );
        })}

      </div>
    </section>
  );
}