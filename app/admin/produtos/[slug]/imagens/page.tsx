import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Images, Star, Trash2 } from "lucide-react";
import { ProductImageUploadForm } from "@/components/admin/ProductImageUploadForm";
import { prisma } from "@/lib/prisma";
import {
  deleteProductImageAction,
  setProductImageCoverAction,
} from "@/actions/product-images";

type ProductImagesPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ProductImagesPage({
  params,
}: ProductImagesPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      console: true,
      images: {
        orderBy: [
          {
            isCover: "desc",
          },
          {
            order: "asc",
          },
        ],
        select: {
          id: true,
          url: true,
          alt: true,
          order: true,
          isCover: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-yellow-400"
        >
          <ArrowLeft size={18} /> Voltar para produtos
        </Link>

        <div className="mt-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-black">
            <Images size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
              Painel administrative
            </p>
            <h1 className="mt-2 text-3xl font-black">Imagens do produto</h1>
            <p className="mt-2 text-zinc-400">
              {product.title} — {product.console}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Imagens cadastradas</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {product.images.length} imagem{" "}
                  {product.images.length === 1 ? "" : "ns"}
                </p>
              </div>
            </div>

            {product.images.length === 0 ? (
              <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950">
                <div className="text-center">
                  <Images size={42} className="mx-auto text-zinc-700" />
                  <p className="mt-4 font-medium text-zinc-300">
                    Nenhuma imagem cadastrada
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Use o formulário ao lado para enviar a primeira foto.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {product.images.map((image) => (
                  <article
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
                  >
                    <div className="relative flex aspect-square items-center justify-center bg-zinc-900">
                      <img
                        src={image.url}
                        alt={
                          image.alt ?? `${product.title} - imagem do produto`
                        }
                        className="h-full w-full object-contain"
                      />
                      {image.isCover && (
                        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black shadow-lg">
                          <Star size={14} fill="currentColor" /> Capa
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="line-clamp-2 text-sm text-zinc-300">
                        {image.alt || "Imagem sem descrição"}
                      </p>
                      <p className="mt-2 text-xs text-zinc-600">
                        Ordem: {image.order}
                      </p>

                      {!image.isCover && (
                        <form
                          action={setProductImageCoverAction}
                          className="mt-4"
                        >
                          <input type="hidden" name="imageId" value={image.id} />
                          <input type="hidden" name="productSlug" value={product.slug} />
                          <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-400/40 px-4 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
                          >
                            <Star size={16} /> Definir como capa
                          </button>
                        </form>
                      )}

                      <form action={deleteProductImageAction} className="mt-3">
                        <input type="hidden" name="imageId" value={image.id} />
                        <input type="hidden" name="productSlug" value={product.slug} />
                        <button
                          type="submit"
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={16} />
                          Excluir imagem
                        </button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside>
            <ProductImageUploadForm
              productId={product.id}
              productTitle={product.title}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
