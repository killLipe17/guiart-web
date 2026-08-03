const stats = [
  {
    value: "+1000",
    label: "Games e consoles",
  },
  {
    value: "+500",
    label: "Colecionáveis",
  },
  {
    value: "Loja Física",
    label: "São Paulo",
  },
  {
    value: "100%",
    label: "Fotos reais",
  },
];

export function Stats() {
  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-4">

        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400"
          >
            <div className="text-5xl font-black text-yellow-400">
              {item.value}
            </div>

            <p className="mt-4 text-zinc-400">
              {item.label}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}