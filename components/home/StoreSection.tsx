type StoreSectionProps = {
  storeName: string;
  address: string;
  addressReference: string;
};

export function StoreSection({
  storeName,
  address,
  addressReference,
}: StoreSectionProps) {
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
          <span className="font-semibold text-yellow-400">
            LOJA FÍSICA
          </span>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Conheça a {storeName}
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Somos especialistas em games,
            consoles e colecionáveis.
            Trabalhamos com produtos usados,
            raridades e itens selecionados,
            sempre com fotos reais e descrição
            completa.
          </p>

          <p className="mt-6 whitespace-pre-line leading-7 text-zinc-500">
            {address}
          </p>

          {addressReference && (
            <p className="mt-3 text-sm text-zinc-500">
              {addressReference}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
