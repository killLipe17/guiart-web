import { Prisma } from "@prisma/client";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Gem,
  ImageIcon,
  Images,
  LayoutDashboard,
  PackageCheck,
  PackageOpen,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PRODUCTS_PER_PAGE = 12;

type StockFilter =
  | "ALL"
  | "AVAILABLE"
  | "OUT";

type RarityFilter =
  | "ALL"
  | "RARE"
  | "NORMAL";

type SortOption =
  | "NEWEST"
  | "TITLE"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "STOCK_ASC";

type AdminProductsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    stock?: string | string[];
    rarity?: string | string[];
    order?: string | string[];
    page?: string | string[];
  }>;
};

const currencyFormatter =
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const validStockFilters =
  new Set<StockFilter>([
    "ALL",
    "AVAILABLE",
    "OUT",
  ]);

const validRarityFilters =
  new Set<RarityFilter>([
    "ALL",
    "RARE",
    "NORMAL",
  ]);

const validSortOptions =
  new Set<SortOption>([
    "NEWEST",
    "TITLE",
    "PRICE_ASC",
    "PRICE_DESC",
    "STOCK_ASC",
  ]);

function getSingleSearchParam(
  value: string | string[] | undefined
) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function parsePage(value: string) {
  const parsedPage = Number(value);

  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1
  ) {
    return 1;
  }

  return parsedPage;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  await requireAdmin();

  const resolvedSearchParams =
    await searchParams;

  const searchQuery =
    getSingleSearchParam(
      resolvedSearchParams.q
    ).trim();

  const stockQuery =
    getSingleSearchParam(
      resolvedSearchParams.stock
    ).trim();

  const rarityQuery =
    getSingleSearchParam(
      resolvedSearchParams.rarity
    ).trim();

  const orderQuery =
    getSingleSearchParam(
      resolvedSearchParams.order
    ).trim();

  const requestedPage = parsePage(
    getSingleSearchParam(
      resolvedSearchParams.page
    )
  );

  const stockFilter: StockFilter =
    validStockFilters.has(
      stockQuery as StockFilter
    )
      ? (stockQuery as StockFilter)
      : "ALL";

  const rarityFilter: RarityFilter =
    validRarityFilters.has(
      rarityQuery as RarityFilter
    )
      ? (rarityQuery as RarityFilter)
      : "ALL";

  const sortOption: SortOption =
    validSortOptions.has(
      orderQuery as SortOption
    )
      ? (orderQuery as SortOption)
      : "NEWEST";

  const where: Prisma.ProductWhereInput =
    {};

  if (searchQuery) {
    where.OR = [
      {
        title: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        console: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        condition: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        category: {
          is: {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  if (stockFilter === "AVAILABLE") {
    where.stock = {
      gt: 0,
    };
  }

  if (stockFilter === "OUT") {
    where.stock = {
      lte: 0,
    };
  }

  if (rarityFilter === "RARE") {
    where.rarity = true;
  }

  if (rarityFilter === "NORMAL") {
    where.rarity = false;
  }

  const orderBy:
    Prisma.ProductOrderByWithRelationInput =
    sortOption === "TITLE"
      ? {
          title: "asc",
        }
      : sortOption === "PRICE_ASC"
        ? {
            price: "asc",
          }
        : sortOption === "PRICE_DESC"
          ? {
              price: "desc",
            }
          : sortOption === "STOCK_ASC"
            ? {
                stock: "asc",
              }
            : {
                createdAt: "desc",
              };

  const [
    productSummary,
    rarityCount,
    outOfStockCount,
    filteredProductsCount,
  ] = await Promise.all([
    prisma.product.aggregate({
      _count: {
        _all: true,
      },

      _sum: {
        stock: true,
      },
    }),

    prisma.product.count({
      where: {
        rarity: true,
      },
    }),

    prisma.product.count({
      where: {
        stock: {
          lte: 0,
        },
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProductsCount /
        PRODUCTS_PER_PAGE
    )
  );

  const currentPage = Math.min(
    requestedPage,
    totalPages
  );

  const products =
    await prisma.product.findMany({
      where,
      orderBy,

      skip:
        (currentPage - 1) *
        PRODUCTS_PER_PAGE,

      take: PRODUCTS_PER_PAGE,

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

  const productCount =
    productSummary._count._all;

  const stockCount =
    productSummary._sum.stock ?? 0;

  const hasActiveFilters =
    Boolean(searchQuery) ||
    stockFilter !== "ALL" ||
    rarityFilter !== "ALL" ||
    sortOption !== "NEWEST";

  const firstVisibleProduct =
    filteredProductsCount === 0
      ? 0
      : (currentPage - 1) *
          PRODUCTS_PER_PAGE +
        1;

  const lastVisibleProduct = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    filteredProductsCount
  );

  function buildProductsHref(
    page: number
  ) {
    const queryParams =
      new URLSearchParams();

    if (searchQuery) {
      queryParams.set(
        "q",
        searchQuery
      );
    }

    if (stockFilter !== "ALL") {
      queryParams.set(
        "stock",
        stockFilter
      );
    }

    if (rarityFilter !== "ALL") {
      queryParams.set(
        "rarity",
        rarityFilter
      );
    }

    if (sortOption !== "NEWEST") {
      queryParams.set(
        "order",
        sortOption
      );
    }

    if (page > 1) {
      queryParams.set(
        "page",
        String(page)
      );
    }

    const query =
      queryParams.toString();

    return `/admin/produtos${
      query ? `?${query}` : ""
    }`;
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-yellow-400">
              Painel administrativo
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Produtos
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Gerencie produtos, preços,
              estoque, condições e imagens da
              Guiart Games.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <LayoutDashboard size={18} />
              Painel
            </Link>

            <Link
              href="/admin/pedidos"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <ClipboardList size={18} />
              Pedidos
            </Link>

            <LogoutButton />

            <Link
              href="/admin/produtos/novo"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-black text-black transition hover:bg-yellow-300"
            >
              <Plus size={19} />
              Novo produto
            </Link>
          </nav>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<Boxes size={22} />}
            label="Produtos cadastrados"
            value={String(productCount)}
          />

          <SummaryCard
            icon={
              <PackageCheck size={22} />
            }
            label="Unidades em estoque"
            value={String(stockCount)}
            tone="green"
          />

          <SummaryCard
            icon={<Gem size={22} />}
            label="Raridades"
            value={String(rarityCount)}
            tone="purple"
          />

          <SummaryCard
            icon={
              <PackageOpen size={22} />
            }
            label="Produtos sem estoque"
            value={String(
              outOfStockCount
            )}
            tone={
              outOfStockCount > 0
                ? "red"
                : "default"
            }
          />
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={20}
              className="text-yellow-400"
            />

            <h2 className="font-black">
              Buscar e filtrar
            </h2>
          </div>

          <form
            action="/admin/produtos"
            method="get"
            className="mt-5 grid gap-3 xl:grid-cols-[minmax(260px,1fr)_190px_190px_210px_auto]"
          >
            <div className="relative">
              <label
                htmlFor="product-search"
                className="sr-only"
              >
                Buscar produto
              </label>

              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              />

              <input
                id="product-search"
                type="search"
                name="q"
                defaultValue={searchQuery}
                placeholder="Nome, console, categoria ou condição"
                className="h-12 w-full rounded-xl border border-zinc-800 bg-black pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            <select
              name="stock"
              defaultValue={stockFilter}
              aria-label="Filtrar por estoque"
              className="h-12 rounded-xl border border-zinc-800 bg-black px-4 text-sm font-semibold text-white outline-none transition focus:border-yellow-400"
            >
              <option value="ALL">
                Todo o estoque
              </option>

              <option value="AVAILABLE">
                Disponíveis
              </option>

              <option value="OUT">
                Sem estoque
              </option>
            </select>

            <select
              name="rarity"
              defaultValue={rarityFilter}
              aria-label="Filtrar por raridade"
              className="h-12 rounded-xl border border-zinc-800 bg-black px-4 text-sm font-semibold text-white outline-none transition focus:border-yellow-400"
            >
              <option value="ALL">
                Todos os produtos
              </option>

              <option value="RARE">
                Apenas raridades
              </option>

              <option value="NORMAL">
                Sem raridades
              </option>
            </select>

            <select
              name="order"
              defaultValue={sortOption}
              aria-label="Ordenar produtos"
              className="h-12 rounded-xl border border-zinc-800 bg-black px-4 text-sm font-semibold text-white outline-none transition focus:border-yellow-400"
            >
              <option value="NEWEST">
                Mais recentes
              </option>

              <option value="TITLE">
                Nome de A a Z
              </option>

              <option value="PRICE_ASC">
                Menor preço
              </option>

              <option value="PRICE_DESC">
                Maior preço
              </option>

              <option value="STOCK_ASC">
                Menor estoque
              </option>
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                <Search size={18} />
                Aplicar
              </button>

              {hasActiveFilters && (
                <Link
                  href="/admin/produtos"
                  title="Limpar filtros"
                  aria-label="Limpar filtros"
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                >
                  <RotateCcw size={18} />
                </Link>
              )}
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4 text-sm">
            <p className="text-zinc-500">
              {filteredProductsCount === 0
                ? "Nenhum produto encontrado"
                : `${firstVisibleProduct}–${lastVisibleProduct} de ${filteredProductsCount} produtos`}
            </p>

            {hasActiveFilters && (
              <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400">
                Filtros ativos
              </span>
            )}
          </div>
        </section>

        <section className="mt-8">
          {products.length === 0 ? (
            <div className="flex min-h-96 items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 px-6">
              <div className="max-w-md text-center">
                <PackageOpen
                  size={52}
                  className="mx-auto text-zinc-700"
                />

                <h2 className="mt-5 text-xl font-black">
                  {hasActiveFilters
                    ? "Nenhum produto encontrado"
                    : "Nenhum produto cadastrado"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {hasActiveFilters
                    ? "Altere os termos ou filtros utilizados para encontrar outros produtos."
                    : "Cadastre o primeiro produto para começar a montar o catálogo da Guiart Games."}
                </p>

                {hasActiveFilters ? (
                  <Link
                    href="/admin/produtos"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-black transition hover:bg-yellow-300"
                  >
                    <RotateCcw size={18} />
                    Limpar filtros
                  </Link>
                ) : (
                  <Link
                    href="/admin/produtos/novo"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-black transition hover:bg-yellow-300"
                  >
                    <Plus size={18} />
                    Cadastrar produto
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const coverImage =
                  product.images[0];

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

                        {product.stock <= 0 && (
                          <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                            Sem estoque
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                            {
                              product.category
                                .name
                            }

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
                            Number(
                              product.price
                            )
                          )}
                        </p>

                        <p className="flex shrink-0 items-center gap-1 text-xs text-zinc-500">
                          <Images size={14} />

                          {
                            product._count
                              .images
                          }{" "}
                          {product._count
                            .images === 1
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
                            <Pencil
                              size={17}
                            />
                          </Link>

                          <Link
                            href={`/admin/produtos/${product.slug}/imagens`}
                            title="Gerenciar imagens"
                            aria-label={`Gerenciar imagens de ${product.title}`}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400 text-black transition hover:bg-yellow-300"
                          >
                            <Images
                              size={17}
                            />
                          </Link>
                        </div>
                      </div>

                      <DeleteProductButton
                        productId={product.id}
                        productTitle={
                          product.title
                        }
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {filteredProductsCount > 0 &&
          totalPages > 1 && (
            <nav
              aria-label="Paginação dos produtos"
              className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:flex-row"
            >
              <p className="text-sm text-zinc-500">
                Página{" "}
                <strong className="text-white">
                  {currentPage}
                </strong>{" "}
                de{" "}
                <strong className="text-white">
                  {totalPages}
                </strong>
              </p>

              <div className="flex gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={buildProductsHref(
                      currentPage - 1
                    )}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    <ChevronLeft
                      size={18}
                    />
                    Anterior
                  </Link>
                ) : (
                  <span className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm font-bold text-zinc-700">
                    <ChevronLeft
                      size={18}
                    />
                    Anterior
                  </span>
                )}

                {currentPage <
                totalPages ? (
                  <Link
                    href={buildProductsHref(
                      currentPage + 1
                    )}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 text-sm font-black text-black transition hover:bg-yellow-300"
                  >
                    Próxima
                    <ChevronRight
                      size={18}
                    />
                  </Link>
                ) : (
                  <span className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-black text-zinc-700">
                    Próxima
                    <ChevronRight
                      size={18}
                    />
                  </span>
                )}
              </div>
            </nav>
          )}
      </div>
    </main>
  );
}

type SummaryCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  tone?:
    | "default"
    | "green"
    | "purple"
    | "red";
};

function SummaryCard({
  icon,
  label,
  value,
  tone = "default",
}: SummaryCardProps) {
  const iconStyle =
    tone === "green"
      ? "bg-emerald-500/10 text-emerald-400"
      : tone === "purple"
        ? "bg-purple-500/10 text-purple-400"
        : tone === "red"
          ? "bg-red-500/10 text-red-400"
          : "bg-yellow-400/10 text-yellow-400";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyle}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>
    </div>
  );
}