const highlights = [
  {
    value: "Loja física",
    label: "Atendimento presencial",
  },
  {
    value: "Fotos reais",
    label: "Dos produtos anunciados",
  },
  {
    value: "Retrô",
    label: "Consoles de várias gerações",
  },
  {
    value: "Suporte",
    label: "Atendimento especializado",
  },
];

export function Numbers() {
  return (
    <section className="border-y border-zinc-800 bg-zinc-950 py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 text-center md:grid-cols-4">
        {highlights.map((item) => (
          <div key={item.value}>
            <h3 className="text-3xl font-black text-yellow-400 sm:text-4xl">
              {item.value}
            </h3>

            <p className="mt-3 text-zinc-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
