export function StoreSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">

      <div className="grid items-center gap-12 lg:grid-cols-2">

        <div>

          <div className="flex h-96 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900">

            <span className="text-zinc-500">
              FOTO DA LOJA
            </span>

          </div>

        </div>

        <div>

          <span className="text-red-500 font-semibold">
            LOJA FÍSICA
          </span>

          <h2 className="mt-4 text-5xl font-black">
            Conheça a Guiart Games
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Somos especialistas em games, consoles e colecionáveis.
            Trabalhamos com produtos usados, raridades e itens
            selecionados, sempre com fotos reais e descrição completa.
          </p>

          <p className="mt-6 text-zinc-500">
            Rua dos Buritis, 54 – Loja 9
            <br />
            Jardim Oriental
            <br />
            São Paulo – SP
          </p>

        </div>

      </div>

    </section>
  );
}