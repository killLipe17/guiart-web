import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import type { Prisma } from "@prisma/client";
import {
  ChevronLeft,
  ChevronRight,
  Gem,
  ImageIcon,
  PackageCheck,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo | Guiart Games",
  description:
    "Games, consoles, acessórios e colecionáveis disponíveis na Guiart Games.",
};

const PRODUCTS_PER_PAGE = 9;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type CatalogOrder =
  | "recent"
  | "price-asc"
  | "price-desc"
  | "name";

type CatalogSearchParams = {
  search?: string | string[];
  category?: string | string[];
  console?: string | string[];
  order?: string | string[];
  page?: string | string[];
};

type CatalogPageProps = {
  searchParams: Promise<CatalogSearchParams>;
};

type CatalogFilters = {
  search: string;
  category: string;
  consoleFilter: string;
  order: CatalogOrder;
};

function getStringParam(
  value: string | string[] | undefined
) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function getPageParam(
  value: string | string[] | undefined
) {
  const parsedPage = Number(getStringParam(value));

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
}

function getCatalogOrder(value: string): CatalogOrder {
  const acceptedOrders: CatalogOrder[] = [
    "recent",
    "price-asc",
    "price-desc",
    "name",
  ];

  if (acceptedOrders.includes(value as CatalogOrder)) {
    return value as CatalogOrder;
  }

  return "recent";
}

function getOrderBy(
  order: CatalogOrder
): Prisma.ProductOrderByWithRelationInput[] {
  switch (order) {
    case "price-asc":
      return [
        {
          price: "asc",
        },
        {
          createdAt: "desc",
        },
      ];

    case "price-desc":
      return [
        {
          price: "desc",
        },
        {
          createdAt: "desc",
        },
      ];

    case "name":
      return [
        {
          title: "asc",
        },
      ];

    default:
      return [
        {
          createdAt: "desc",
        },
      ];
  }
}

function createCatalogHref(
  filters: CatalogFilters,
  page: number
) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.consoleFilter) {
    params.set("console", filters.consoleFilter);
  }

  if (filters.order !== "recent") {
    params.set("order", filters.order);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return queryString
    ? `/catalogo?${queryString}`
    : "/catalogo";
}

export default async function CatalogPage({
  searchParams,
}: CatalogPageProps) {
  const params = await searchParams;

  const search = getStringParam(params.search).trim();
  const category = getStringParam(params.category).trim();
  const consoleFilter = getStringParam(
    params.console
  ).trim();

  const order = getCatalogOrder(
    getStringParam(params.order)
  );

  const requestedPage = getPageParam(params.page);

  const filters: CatalogFilters = {
    search,
    category,
    consoleFilter,
    order,
  };

  const where: Prisma.ProductWhereInput = {
    stock: {
      gt: 0,
    },

    ...(category
      ? {
          category: {
            is: {
              name: category,
            },
          },
        }
      : {}),

    ...(consoleFilter
      ? {
          console: consoleFilter,
        }
      : {}),

    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              console: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              condition: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              category: {
                is: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  const [
    totalProducts,
    categories,
    availableConsoles,
  ] = await Promise.all([
    prisma.product.count({
      where,
    }),

    prisma.category.findMany({
      where: {
        products: {
          some: {
            stock: {
              gt: 0,
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),

    prisma.product.findMany({
      where: {
        stock: {
          gt: 0,
        },
      },
      distinct: ["console"],
      orderBy: {
        console: "asc",
      },
      select: {
        console: true,
      },
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
  );

  const currentPage = Math.min(
    requestedPage,
    totalPages
  );

  const products = await prisma.product.findMany({
    where,

    orderBy: getOrderBy(order),

    skip: (currentPage - 1) * PRODUCTS_PER_PAGE,
    take: PRODUCTS_PER_PAGE,

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

  const hasActiveFilters = Boolean(
    search ||
      category ||
      consoleFilter ||
      order !== "recent"
  );

  const visiblePages = Array.from(
    new Set(
      [
        1,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        totalPages,
      ].filter(
        (page) => page >= 1 && page <= totalPages
      )
    )
  ).sort((firstPage, secondPage) => {
    return firstPage - secondPage;
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
              Consulte os produtos disponíveis na loja,
              pesquise por nome e filtre por categoria ou
              plataforma.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
              <PackageCheck
                size={17}
                className="text-emerald-400"
              />

              {totalProducts}{" "}
              {totalProducts === 1
                ? "produto encontrado"
                : "produtos encontrados"}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <form
            action="/catalogo"
            method="get"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                <SlidersHorizontal size={21} />
              </div>

              <div>
                <h2 className="font-bold">
                  Buscar e filtrar
                </h2>

                <p className="text-sm text-zinc-500">
                  Refine os produtos exibidos no catálogo.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
              <div>
                <label
                  htmlFor="search"
                  className="text-sm font-medium text-zinc-400"
                >
                  Busca
                </label>

                <div className="relative mt-2">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    id="search"
                    name="search"
                    type="search"
                    defaultValue={search}
                    placeholder="Nome, console, categoria..."
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-zinc-400"
                >
                  Categoria
                </label>

                <select
                  id="category"
                  name="category"
                  defaultValue={category}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
                >
                  <option value="">
                    Todas
                  </option>

                  {categories.map((categoryOption) => (
                    <option
                      key={categoryOption.id}
                      value={categoryOption.name}
                    >
                      {categoryOption.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="console"
                  className="text-sm font-medium text-zinc-400"
                >
                  Plataforma
                </label>

                <select
                  id="console"
                  name="console"
                  defaultValue={consoleFilter}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
                >
                  <option value="">
                    Todas
                  </option>

                  {availableConsoles.map(
                    (consoleOption) => (
                      <option
                        key={consoleOption.console}
                        value={consoleOption.console}
                      >
                        {consoleOption.console}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="order"
                  className="text-sm font-medium text-zinc-400"
                >
                  Ordenação
                </label>

                <select
                  id="order"
                  name="order"
                  defaultValue={order}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
                >
                  <option value="recent">
                    Mais recentes
                  </option>

                  <option value="price-asc">
                    Menor preço
                  </option>

                  <option value="price-desc">
                    Maior preço
                  </option>

                  <option value="name">
                    Nome A–Z
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300 lg:w-auto"
                >
                  <Search size={18} />
                  Aplicar
                </button>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-5 border-t border-zinc-900 pt-5">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-yellow-400"
                >
                  <RotateCcw size={16} />
                  Limpar busca e filtros
                </Link>
              </div>
            )}
          </form>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Produtos encontrados
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {totalProducts}{" "}
                {totalProducts === 1
                  ? "resultado"
                  : "resultados"}
              </p>
            </div>

            {totalProducts > 0 && (
              <p className="text-sm text-zinc-500">
                Página {currentPage} de {totalPages}
              </p>
            )}
          </div>

          {products.length === 0 ? (
            <div className="flex min-h-96 items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 px-6">
              <div className="max-w-md text-center">
                <Search
                  size={48}
                  className="mx-auto text-zinc-700"
                />

                <h2 className="mt-5 text-2xl font-bold">
                  Nenhum produto encontrado
                </h2>

                <p className="mt-3 leading-7 text-zinc-500">
                  Tente pesquisar outro nome ou remover
                  alguns filtros.
                </p>

                <Link
                  href="/catalogo"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300"
                >
                  <RotateCcw size={18} />
                  Limpar filtros
                </Link>
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
                          {product.console} •{" "}
                          {product.condition}
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
                              {product.hasBox
                                ? "Sim"
                                : "Não"}
                            </strong>
                          </div>

                          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center text-zinc-400">
                            Manual:{" "}
                            <strong className="text-white">
                              {product.hasManual
                                ? "Sim"
                                : "Não"}
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

          {totalPages > 1 && (
            <nav
              aria-label="Paginação do catálogo"
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
            >
              {currentPage > 1 ? (
                <Link
                  href={createCatalogHref(
                    filters,
                    currentPage - 1
                  )}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                >
                  <ChevronLeft size={18} />
                  Anterior
                </Link>
              ) : (
                <span className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm font-semibold text-zinc-700">
                  <ChevronLeft size={18} />
                  Anterior
                </span>
              )}

              {visiblePages.map((page, index) => {
                const previousPage =
                  visiblePages[index - 1];

                const hasGap =
                  previousPage !== undefined &&
                  page - previousPage > 1;

                return (
                  <Fragment key={page}>
                    {hasGap && (
                      <span className="flex h-11 w-8 items-center justify-center text-zinc-600">
                        …
                      </span>
                    )}

                    {page === currentPage ? (
                      <span
                        aria-current="page"
                        className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-yellow-400 px-3 font-bold text-black"
                      >
                        {page}
                      </span>
                    ) : (
                      <Link
                        href={createCatalogHref(
                          filters,
                          page
                        )}
                        className="flex h-11 min-w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 font-semibold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                      >
                        {page}
                      </Link>
                    )}
                  </Fragment>
                );
              })}

              {currentPage < totalPages ? (
                <Link
                  href={createCatalogHref(
                    filters,
                    currentPage + 1
                  )}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                >
                  Próxima
                  <ChevronRight size={18} />
                </Link>
              ) : (
                <span className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm font-semibold text-zinc-700">
                  Próxima
                  <ChevronRight size={18} />
                </span>
              )}
            </nav>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}