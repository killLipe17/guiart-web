const services = [
  {
    value: "Compra",
    label: "Games, consoles e colecionáveis",
  },
  {
    value: "Venda",
    label: "Produtos selecionados e testados",
  },
  {
    value: "Troca",
    label: "Avaliação transparente dos itens",
  },
  {
    value: "Raridades",
    label: "Peças especiais para colecionadores",
  },
];

export function Stats() {
  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-4">
        {services.map((item) => (
          <div
            key={item.value}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400"
          >
            <div className="text-3xl font-black text-yellow-400 sm:text-4xl">
              {item.value}
            </div>

            <p className="mt-4 leading-6 text-zinc-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
