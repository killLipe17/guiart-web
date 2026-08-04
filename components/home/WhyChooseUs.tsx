export function WhyChooseUs() {
  const items = [
    {
      icon: "🎮",
      title: "Games Originais",
      description: "Trabalhamos com jogos originais para colecionadores e jogadores.",
    },
    {
      icon: "🕹️",
      title: "Consoles Testados",
      description: "Todos os consoles são revisados e testados antes da venda.",
    },
    {
      icon: "📦",
      title: "Envio Seguro",
      description: "Embalagem reforçada para proteger cada item durante o transporte.",
    },
    {
      icon: "🤝",
      title: "Loja Física",
      description: "Mais segurança para comprar, vender e trocar seus games.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-white">
          Por que comprar na <span className="text-yellow-400"> Guiart?</span>
        </h2>
        <p className="mt-4 text-zinc-400">
          Há anos conectando apaixonados por videogames e colecionáveis.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400"
          >
            <div className="mb-5 text-5xl">{item.icon}</div>
            <h3 className="mb-3 text-xl font-bold text-white">
              {item.title}
            </h3>
            <p className="text-sm leading-7 text-zinc-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
