import Link from "next/link";
import {
  Boxes,
  Gem,
  House,
  ImageIcon,
  Images,
  PackageOpen,
  Pencil,
  Plus,
  Star,
  Store,
} from "lucide-react";

import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      console: true,
      condition: true,
      stock: true,
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

      _count: {
        select: {
          images: true,
        },
      },
    },
  });

  const rarityCount = products.filter(
    (product) => product.rarity
  ).length;

  const stockCount = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
                Painel administrativo
              </p>

              <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                Produtos
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                Gerencie os produtos, preços, estoque e imagens da
                Guiart Games.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-end">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-yellow-400 hover:text-yellow-400"
              >
                <House size={18} />
                Voltar para a loja
              </Link>

              <Link
                href="/catalogo"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-yellow-400 hover:text-yellow-400"
              >
                <Store size={18} />
                Ver catálogo
              </Link>

              <LogoutButton />

              <Link
                href="/admin/produtos/novo"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
              >
                <Plus size={19} />
                Novo produto
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                <Boxes size={22} />
              </div>

              <div>
                <p className="text-sm text-zinc-500">
                  Produtos cadastrados
                </p>

                <p className="text-2xl font-black">
                  {products.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Gem size={22} />
              </div>

              <div>
                <p className="text-sm text-zinc-500">
                  Raridades
                </p>

                <p className="text-2xl font-black">
                  {rarityCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <PackageOpen size={22} />
              </div>

              <div>
                <p className="text-sm text-zinc-500">
                  Unidades em estoque
                </p>

                <p className="text-2xl font-black">
                  {stockCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          {products.length === 0 ? (
            <div className="flex min-h-96 items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 px-6">
              <div className="max-w-sm text-center">
                <PackageOpen
                  size={48}
                  className="mx-auto text-zinc-700"
                />

                <h2 className="mt-5 text-xl font-bold">
                  Nenhum produto cadastrado
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Cadastre o primeiro produto para começar a montar o
                  catálogo da Guiart.
                </p>

                <Link
                  href="/admin/produtos/novo"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300"
                >
                  <Plus size={18} />
                  Cadastrar produto
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const coverImage = product.images[0];

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition hover:border-zinc-700"
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-zinc-900">
                      {coverImage ? (
                        <img
                          src={coverImage.url}
                          alt={
                            coverImage.alt ??
                            `${product.title} - Guiart Games`
                          }
                          className="h-full w-full object-contain transition duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon
                            size={42}
                            className="mx-auto text-zinc-700"
                          />

                          <p className="mt-3 text-sm text-zinc-600">
                            Sem imagem
                          </p>
                        </div>
                      )}

                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        {product.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
                            <Star
                              size={13}
                              fill="currentColor"
                            />
                            Destaque
                          </span>
                        )}

                        {product.rarity && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500 px-3 py-1 text-xs font-bold text-white">
                            <Gem size={13} />
                            Raridade
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                            {product.category.name}
                            {product.console
                              ? ` • ${product.console}`
                              : ""}
                          </p>

                          <h2 className="mt-2 truncate text-xl font-bold leading-tight">
                            {product.title}
                          </h2>
                        </div>

                        <span className="shrink-0 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs font-medium text-zinc-400">
                          {product.condition}
                        </span>
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-4">
                        <p className="text-2xl font-black text-white">
                          {currencyFormatter.format(
                            Number(product.price)
                          )}
                        </p>

                        <p className="flex shrink-0 items-center gap-1 text-xs text-zinc-500">
                          <Images size={14} />

                          {product._count.images}{" "}
                          {product._count.images === 1
                            ? "foto"
                            : "fotos"}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-zinc-900 pt-4">
                        <p className="text-sm text-zinc-400">
                          Estoque:{" "}
                          <span
                            className={
                              product.stock > 0
                                ? "font-bold text-white"
                                : "font-bold text-red-400"
                            }
                          >
                            {product.stock} un.
                          </span>
                        </p>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/produtos/${product.slug}/editar`}
                            title="Editar produto"
                            aria-label={`Editar ${product.title}`}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-yellow-400 hover:text-yellow-400"
                          >
                            <Pencil size={17} />
                          </Link>

                          <Link
                            href={`/admin/produtos/${product.slug}/imagens`}
                            title="Gerenciar imagens"
                            aria-label={`Gerenciar imagens de ${product.title}`}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400 text-black transition hover:bg-yellow-300"
                          >
                            <Images size={17} />
                          </Link>
                        </div>
                      </div>

                      <DeleteProductButton
                        productId={product.id}
                        productTitle={product.title}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}