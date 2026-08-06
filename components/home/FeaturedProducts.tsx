import Link from "next/link";
import {
  ArrowRight,
  Gem,
  ImageIcon,
  Sparkles,
  Star,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

const currencyFormatter =
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

type FeaturedProductsProps = {
  storeName: string;
};

export async function FeaturedProducts({
  storeName,
}: FeaturedProductsProps) {
  const products =
    await prisma.product.findMany({
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
    <section
      id="produtos"
      className="relative scroll-mt-28 overflow-hidden border-y border-purple-500/10 bg-[#08070b] px-4 py-16 text-white sm:px-6 sm:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle at 8% 22%, rgba(245,196,0,.10), transparent 25rem), radial-gradient(circle at 92% 70%, rgba(111,44,255,.12), transparent 28rem)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-yellow-300">
              <Sparkles size={17} />
              Seleção da loja
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Produtos em destaque
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
              Games, consoles e colecionáveis
              disponíveis agora na Guiart.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-500/10 px-4 py-3 text-sm font-bold text-purple-200 transition hover:border-yellow-400/35 hover:text-yellow-300"
          >
            Ver catálogo completo
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const coverImage =
              product.images[0];

            return (
              <Link
                key={product.id}
                href={`/produto/${product.slug}`}
                className="group relative overflow-hidden rounded-[26px] border border-zinc-800 bg-[#111016] transition duration-300 hover:-translate-y-1.5 hover:border-yellow-400/35 hover:shadow-[0_24px_70px_rgba(0,0,0,.38)]"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-zinc-800 bg-gradient-to-br from-[#18131e] via-[#111016] to-[#0b090d]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-35"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
                      backgroundSize:
                        "22px 22px",
                    }}
                  />

                  {coverImage ? (
                    <img
                      src={coverImage.url}
                      alt={
                        coverImage.alt ??
                        `${product.title} - ${storeName}`
                      }
                      className="relative h-full w-full object-contain p-5 transition duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="relative text-center">
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
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200/30 bg-yellow-400 px-3 py-1.5 text-xs font-black text-black shadow-lg">
                        <Star
                          size={13}
                          fill="currentColor"
                        />
                        Destaque
                      </span>
                    )}

                    {product.rarity && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-300/20 bg-purple-600 px-3 py-1.5 text-xs font-black text-white shadow-lg">
                        <Gem size={13} />
                        Raridade
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                    {product.category.name}
                  </p>

                  <h3 className="mt-3 text-xl font-black leading-tight transition group-hover:text-yellow-300">
                    {product.title}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    {product.console} •{" "}
                    {product.condition}
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-zinc-800 pt-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-zinc-600">
                        Preço
                      </p>

                      <p className="mt-1 text-2xl font-black text-white">
                        {currencyFormatter.format(
                          Number(
                            product.price
                          )
                        )}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-400/10 px-3 py-2 text-sm font-black text-yellow-300 transition group-hover:bg-yellow-400 group-hover:text-black">
                      Ver produto
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="guiart-pixel-line absolute inset-x-0 bottom-0 h-px opacity-70"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
