import Link from "next/link";
import {
  ArrowRight,
  Gem,
  ImageIcon,
  Star,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      stock: {
        gt: 0,
      },
    },

    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take: 6,

    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      console: true,
      condition: true,
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

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-black px-4 py-16 text-white sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              Seleção Guiart
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Produtos em destaque
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
              Games, consoles e colecionáveis disponíveis na loja.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 font-semibold text-yellow-400 transition hover:text-yellow-300"
          >
            Ver catálogo completo
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const coverImage = product.images[0];

            return (
              <Link
                key={product.id}
                href={`/produto/${product.slug}`}
                className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-yellow-400/5"
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
                        size={44}
                        className="mx-auto text-zinc-700"
                      />

                      <p className="mt-3 text-sm text-zinc-600">
                        Imagem em breve
                      </p>
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {product.featured && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black">
                        <Star
                          size={13}
                          fill="currentColor"
                        />
                        Destaque
                      </span>
                    )}

                    {product.rarity && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1.5 text-xs font-bold text-white">
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

                  <h3 className="mt-3 text-xl font-black leading-tight transition group-hover:text-yellow-400">
                    {product.title}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    {product.console} • {product.condition}
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-zinc-900 pt-5">
                    <div>
                      <p className="text-xs text-zinc-600">
                        Preço
                      </p>

                      <p className="mt-1 text-2xl font-black">
                        {currencyFormatter.format(
                          Number(product.price)
                        )}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 text-sm font-bold text-yellow-400">
                      Ver produto
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}