import { Prisma } from "@prisma/client";
import {
  AlertTriangle,
  Boxes,
  CircleCheckBig,
  ClipboardList,
  FolderKanban,
  ImageIcon,
  LayoutDashboard,
  Minus,
  Package,
  PackageCheck,
  PackageOpen,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  TriangleAlert,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  adjustStockAction,
  updateStockAction,
} from "@/app/admin/estoque/actions";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type StockFilter =
  | "ALL"
  | "OUT"
  | "LOW"
  | "OK";

type AdminStockPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    status?: string | string[];
    success?: string | string[];
    error?: string | string[];
  }>;
};

const validStockFilters =
  new Set<StockFilter>([
    "ALL",
    "OUT",
    "LOW",
    "OK",
  ]);

function getSingleSearchParam(
  value: string | string[] | undefined
) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function AdminStockPage({
  searchParams,
}: AdminStockPageProps) {
  await requireAdmin();

  const resolvedSearchParams =
    await searchParams;

  const searchQuery =
    getSingleSearchParam(
      resolvedSearchParams.q
    ).trim();

  const statusQuery =
    getSingleSearchParam(
      resolvedSearchParams.status
    ).trim();

  const successMessage =
    getSingleSearchParam(
      resolvedSearchParams.success
    );

  const errorMessage =
    getSingleSearchParam(
      resolvedSearchParams.error
    );

  const stockFilter: StockFilter =
    validStockFilters.has(
      statusQuery as StockFilter
    )
      ? (statusQuery as StockFilter)
      : "ALL";

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
        console: {
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

  if (stockFilter === "OUT") {
    where.stock = {
      lte: 0,
    };
  }

  if (stockFilter === "LOW") {
    where.stock = {
      gte: 1,
      lte: 2,
    };
  }

  if (stockFilter === "OK") {
    where.stock = {
      gte: 3,
    };
  }

  const [
    productSummary,
    outOfStockCount,
    lowStockCount,
    products,
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
        stock: {
          lte: 0,
        },
      },
    }),

    prisma.product.count({
      where: {
        stock: {
          gte: 1,
          lte: 2,
        },
      },
    }),

    prisma.product.findMany({
      where,

      orderBy: [
        {
          stock: "asc",
        },
        {
          title: "asc",
        },
      ],

      select: {
        id: true,
        title: true,
        slug: true,
        console: true,
        stock: true,

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
    }),
  ]);

  const productCount =
    productSummary._count._all;

  const stockCount =
    productSummary._sum.stock ?? 0;

  const hasActiveFilters =
    Boolean(searchQuery) ||
    stockFilter !== "ALL";

  const returnSearchParams =
    new URLSearchParams();

  if (searchQuery) {
    returnSearchParams.set(
      "q",
      searchQuery
    );
  }

  if (stockFilter !== "ALL") {
    returnSearchParams.set(
      "status",
      stockFilter
    );
  }

  const returnQuery =
    returnSearchParams.toString();

  const returnTo =
    `/admin/estoque${
      returnQuery
        ? `?${returnQuery}`
        : ""
    }`;

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-yellow-400">
              Painel administrativo
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Controle de estoque
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Localize produtos e ajuste rapidamente as
              quantidades disponíveis na loja.
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
              href="/admin/produtos"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <Package size={18} />
              Produtos
            </Link>

            <Link
              href="/admin/pedidos"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <ClipboardList size={18} />
              Pedidos
            </Link>

            <Link
              href="/admin/categorias"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <FolderKanban size={18} />
              Categorias
            </Link>

            <LogoutButton />
          </nav>
        </header>

        {successMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-emerald-300">
            <CircleCheckBig
              size={21}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-semibold">
              {successMessage}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-red-300">
            <TriangleAlert
              size={21}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-semibold">
              {errorMessage}
            </p>
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<Boxes size={22} />}
            label="Produtos cadastrados"
            value={String(productCount)}
          />

          <SummaryCard
            icon={<Warehouse size={22} />}
            label="Unidades em estoque"
            value={String(stockCount)}
            tone="green"
          />

          <SummaryCard
            icon={<AlertTriangle size={22} />}
            label="Estoque baixo"
            value={String(lowStockCount)}
            tone={
              lowStockCount > 0
                ? "yellow"
                : "default"
            }
          />

          <SummaryCard
            icon={<PackageOpen size={22} />}
            label="Sem estoque"
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
            <Search
              size={20}
              className="text-yellow-400"
            />

            <h2 className="font-black">
              Buscar e filtrar
            </h2>
          </div>

          <form
            action="/admin/estoque"
            method="get"
            className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px_auto]"
          >
            <div className="relative">
              <label
                htmlFor="stock-search"
                className="sr-only"
              >
                Buscar produto
              </label>

              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              />

              <input
                id="stock-search"
                type="search"
                name="q"
                defaultValue={searchQuery}
                placeholder="Nome, console ou categoria"
                className="h-12 w-full rounded-xl border border-zinc-800 bg-black pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            <select
              name="status"
              defaultValue={stockFilter}
              aria-label="Filtrar situação do estoque"
              className="h-12 rounded-xl border border-zinc-800 bg-black px-4 text-sm font-semibold text-white outline-none transition focus:border-yellow-400"
            >
              <option value="ALL">
                Todos os produtos
              </option>

              <option value="OUT">
                Sem estoque
              </option>

              <option value="LOW">
                Estoque baixo: 1 ou 2
              </option>

              <option value="OK">
                Estoque normal: 3 ou mais
              </option>
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-black text-black transition hover:bg-yellow-300 lg:flex-none"
              >
                <Search size={18} />
                Aplicar
              </button>

              {hasActiveFilters && (
                <Link
                  href="/admin/estoque"
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
              {products.length === 1
                ? "1 produto encontrado"
                : `${products.length} produtos encontrados`}
            </p>

            {hasActiveFilters && (
              <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400">
                Filtros ativos
              </span>
            )}
          </div>
        </section>

        {products.length === 0 ? (
          <section className="mt-8 flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-8 text-center">
            <div>
              <PackageCheck
                size={52}
                className="mx-auto text-zinc-700"
              />

              <h2 className="mt-5 text-xl font-black">
                Nenhum produto encontrado
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                Altere a busca ou o filtro para visualizar
                outros produtos.
              </p>

              <Link
                href="/admin/estoque"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-black transition hover:bg-yellow-300"
              >
                <RotateCcw size={18} />
                Limpar filtros
              </Link>
            </div>
          </section>
        ) : (
          <section className="mt-8 grid gap-5 lg:grid-cols-2">
            {products.map((product) => {
              const coverImage =
                product.images[0];

              const stockStatus =
                getStockStatus(
                  product.stock
                );

              return (
                <article
                  key={product.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-zinc-700 sm:p-6"
                >
                  <div className="flex gap-4">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black sm:h-28 sm:w-28">
                      {coverImage ? (
                        <img
                          src={coverImage.url}
                          alt={
                            coverImage.alt ??
                            product.title
                          }
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <ImageIcon
                          size={34}
                          className="text-zinc-700"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                            {product.category.name}
                          </p>

                          <h2 className="mt-2 line-clamp-2 text-lg font-black">
                            {product.title}
                          </h2>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${stockStatus.className}`}
                        >
                          {stockStatus.label}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-zinc-500">
                        {product.console}
                      </p>

                      <Link
                        href={`/admin/produtos/${product.slug}/editar`}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 transition hover:text-yellow-400"
                      >
                        <Pencil size={14} />
                        Editar produto
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-zinc-800 pt-5 sm:grid-cols-[auto_minmax(0,1fr)]">
                    <form
                      action={adjustStockAction}
                      className="flex items-center"
                    >
                      <input
                        type="hidden"
                        name="productId"
                        value={product.id}
                      />

                      <input
                        type="hidden"
                        name="returnTo"
                        value={returnTo}
                      />

                      <button
                        type="submit"
                        name="adjustment"
                        value="-1"
                        disabled={
                          product.stock <= 0
                        }
                        title="Remover uma unidade"
                        aria-label={`Remover uma unidade de ${product.title}`}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-l-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400 disabled:cursor-not-allowed disabled:text-zinc-700"
                      >
                        <Minus size={19} />
                      </button>

                      <div className="flex h-12 min-w-20 items-center justify-center border-y border-zinc-700 bg-black px-4 text-xl font-black">
                        {product.stock}
                      </div>

                      <button
                        type="submit"
                        name="adjustment"
                        value="1"
                        title="Adicionar uma unidade"
                        aria-label={`Adicionar uma unidade a ${product.title}`}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-r-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                      >
                        <Plus size={19} />
                      </button>
                    </form>

                    <form
                      action={updateStockAction}
                      className="flex min-w-0 gap-2"
                    >
                      <input
                        type="hidden"
                        name="productId"
                        value={product.id}
                      />

                      <input
                        type="hidden"
                        name="returnTo"
                        value={returnTo}
                      />

                      <label
                        htmlFor={`stock-${product.id}`}
                        className="sr-only"
                      >
                        Quantidade exata de {product.title}
                      </label>

                      <input
                        id={`stock-${product.id}`}
                        type="number"
                        name="stock"
                        min={0}
                        max={999999}
                        step={1}
                        required
                        defaultValue={
                          product.stock
                        }
                        className="h-12 min-w-0 flex-1 rounded-xl border border-zinc-800 bg-black px-4 text-sm font-bold text-white outline-none transition focus:border-yellow-400"
                      />

                      <button
                        type="submit"
                        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 text-sm font-black text-black transition hover:bg-yellow-300"
                      >
                        <Save size={17} />
                        Salvar
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

type StockStatus = {
  label: string;
  className: string;
};

function getStockStatus(
  stock: number
): StockStatus {
  if (stock <= 0) {
    return {
      label: "Sem estoque",
      className:
        "border-red-500/30 bg-red-500/10 text-red-400",
    };
  }

  if (stock <= 2) {
    return {
      label: "Estoque baixo",
      className:
        "border-yellow-400/30 bg-yellow-400/10 text-yellow-400",
    };
  }

  return {
    label: "Disponível",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  };
}

type SummaryCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  tone?:
    | "default"
    | "green"
    | "yellow"
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
      : tone === "yellow"
        ? "bg-yellow-400/10 text-yellow-400"
        : tone === "red"
          ? "bg-red-500/10 text-red-400"
          : "bg-purple-500/10 text-purple-400";

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
