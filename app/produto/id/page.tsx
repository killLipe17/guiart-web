type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-yellow-400">
        Produto:
      </p>

      <h1 className="mt-2 text-5xl font-black">
        {id}
      </h1>

      <p className="mt-8 text-zinc-400">
        Em breve esta página terá todas as informações do produto.
      </p>
    </main>
  );
}