import Link from "next/link";
import {
  Gem,
  ImageIcon,
  PackageCheck,
  Search,
  Star,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo | Guiart Games",
  description:
    "Games, consoles, acessórios e colecionáveis disponíveis na Guiart Games.",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    where: {
      stock: {
        gt: 0,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      price: true,
      console: true,
      condition: true,
      stock: true,
      hasBox: true,
      hasManual: true,
      featured: true,
      rarity: true,

      category: {
  select: {
    name: true,
  },
},

      images: {
        orderBy: [
          {
            isCover: "desc",
          },
          {
            order: "asc",
          },
        ],

        take: 1,

        select: {
          url: true,
          alt: true,
        },
      },
    },
  });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white">
        <section className="relative overflow-hidden border-b border-zinc-900">
          <div className="absolute left-1/2 top-[-250px] h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
              Guiart Games e Colecionáveis
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
              Catálogo de games, consoles e colecionáveis
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Produtos reais disponíveis na loja física, com informações
              detalhadas sobre conservação, caixa, manual e estoque.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
              <PackageCheck size={17} className="text-emerald-400" />

              {products.length}{" "}
              {products.length === 1
                ? "produto disponível"
                : "produtos disponíveis"}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          {products.length === 0 ? (
            <div className="flex min-h-96 items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 px-6">
              <div className="max-w-md text-center">
                <Search
                  size={48}
                  className="mx-auto text-zinc-700"
                />

                <h2 className="mt-5 text-2xl font-bold">
                  Nenhum produto disponível
                </h2>

                <p className="mt-3 leading-7 text-zinc-500">
                  Os produtos cadastrados aparecerão aqui quando tiverem
                  estoque disponível.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const coverImage = product.images[0];

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-yellow-400/5"
                  >
                    <Link
                      href={`/produto/${product.slug}`}
                      className="block"
                    >
                      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-zinc-900">
                        {coverImage ? (
                          <img
                            src={coverImage.url}
                            alt={
                              coverImage.alt ??
                              `${product.title} - Guiart Games`
                            }
                            className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-center">
                            <ImageIcon
                              size={46}
                              className="mx-auto text-zinc-700"
                            />

                            <p className="mt-3 text-sm text-zinc-600">
                              Imagem em breve
                            </p>
                          </div>
                        )}

                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                          {product.featured && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black shadow-lg">
                              <Star
                                size={13}
                                fill="currentColor"
                              />
                              Destaque
                            </span>
                          )}

                          {product.rarity && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                              <Gem size={13} />
                              Raridade
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 sm:p-6">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-400">
                          {product.category.name}
                        </p>

                        <h2 className="mt-3 text-xl font-black leading-tight text-white transition group-hover:text-yellow-400">
                          {product.title}
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                          {product.console} • {product.condition}
                        </p>

                        <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-zinc-400">
                          {product.description}
                        </p>

                        <div className="mt-5 flex items-end justify-between gap-4 border-t border-zinc-900 pt-5">
                          <div>
                            <p className="text-xs text-zinc-600">
                              Preço
                            </p>

                            <p className="mt-1 text-2xl font-black text-white">
                              {currencyFormatter.format(
                                Number(product.price)
                              )}
                            </p>
                          </div>

                          <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                            Disponível
                          </span>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center text-zinc-400">
                            Caixa:{" "}
                            <strong className="text-white">
                              {product.hasBox ? "Sim" : "Não"}
                            </strong>
                          </div>

                          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center text-zinc-400">
                            Manual:{" "}
                            <strong className="text-white">
                              {product.hasManual ? "Sim" : "Não"}
                            </strong>
                          </div>
                        </div>

                        <div className="mt-5 flex w-full items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition group-hover:bg-yellow-300">
                          Ver detalhes
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}