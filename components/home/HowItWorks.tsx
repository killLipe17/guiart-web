type HowItWorksProps = {
  storeName: string;
  pickupNotice: string;
};

export function HowItWorks({
  storeName,
  pickupNotice,
}: HowItWorksProps) {
  const pickupText =
    pickupNotice.trim() ||
    "Retirada disponível na loja física.";

  const steps = [
    {
      number: "01",
      title: "Escolha um produto",
      text: "Navegue pelo catálogo e encontre sua próxima raridade.",
    },
    {
      number: "02",
      title: "Entre em contato",
      text: "Fale conosco pelo WhatsApp para tirar dúvidas e solicitar mais fotos.",
    },
    {
      number: "03",
      title: "Confirme a compra",
      text: "Receba todas as informações antes de finalizar o pedido.",
    },
    {
      number: "04",
      title: "Receba ou retire",
      text: `Enviamos para todo o Brasil. ${pickupText}`,
    },
  ];

  return (
    <section className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
            Como funciona
          </span>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Comprar na {storeName} é simples
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400"
            >
              <div className="mb-6 text-5xl font-black text-yellow-400">
                {step.number}
              </div>

              <h3 className="mb-4 text-2xl font-bold">
                {step.title}
              </h3>

              <p className="leading-7 text-zinc-400">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
