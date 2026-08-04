import {
  Boxes,
  CircleCheckBig,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Package,
  Plus,
  Save,
  Tag,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  createCategoryAction,
  updateCategoryAction,
} from "@/app/admin/categorias/actions";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminCategoriesPageProps = {
  searchParams: Promise<{
    success?: string | string[];
    error?: string | string[];
  }>;
};

function getSingleSearchParam(
  value: string | string[] | undefined
) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  await requireAdmin();

  const resolvedSearchParams =
    await searchParams;

  const successMessage =
    getSingleSearchParam(
      resolvedSearchParams.success
    );

  const errorMessage =
    getSingleSearchParam(
      resolvedSearchParams.error
    );

  const categories =
    await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,

        _count: {
          select: {
            products: true,
          },
        },
      },
    });

  const linkedProductsCount =
    categories.reduce(
      (total, category) =>
        total +
        category._count.products,
      0
    );

  const emptyCategoriesCount =
    categories.filter(
      (category) =>
        category._count.products === 0
    ).length;

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-yellow-400">
              Painel administrativo
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Categorias
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Organize os jogos e itens
              colecionáveis exibidos no catálogo.
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

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<FolderKanban size={22} />}
            label="Categorias cadastradas"
            value={String(categories.length)}
          />

          <SummaryCard
            icon={<Boxes size={22} />}
            label="Produtos vinculados"
            value={String(
              linkedProductsCount
            )}
            tone="purple"
          />

          <SummaryCard
            icon={<Tag size={22} />}
            label="Categorias vazias"
            value={String(
              emptyCategoriesCount
            )}
            tone="green"
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="h-fit rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 lg:sticky lg:top-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
              <Plus size={24} />
            </div>

            <h2 className="mt-5 text-xl font-black">
              Nova categoria
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Crie uma categoria para organizar
              os produtos no cadastro e no
              catálogo público.
            </p>

            <form
              action={createCategoryAction}
              className="mt-6"
            >
              <label
                htmlFor="new-category-name"
                className="text-sm font-bold text-zinc-300"
              >
                Nome da categoria
              </label>

              <input
                id="new-category-name"
                type="text"
                name="name"
                required
                minLength={2}
                maxLength={60}
                autoComplete="off"
                placeholder="Ex.: Jogos de PlayStation"
                className="mt-2 h-12 w-full rounded-xl border border-zinc-800 bg-black px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />

              <button
                type="submit"
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                <Plus size={18} />
                Criar categoria
              </button>
            </form>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 px-5 py-5 sm:px-6">
              <h2 className="text-xl font-black">
                Categorias cadastradas
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Renomeie categorias ou exclua
                aquelas que não possuem produtos.
              </p>
            </div>

            {categories.length === 0 ? (
              <div className="flex min-h-80 items-center justify-center px-6 py-10 text-center">
                <div>
                  <FolderKanban
                    size={48}
                    className="mx-auto text-zinc-700"
                  />

                  <h3 className="mt-5 text-lg font-black">
                    Nenhuma categoria cadastrada
                  </h3>

                  <p className="mt-2 text-sm text-zinc-600">
                    Use o formulário para criar a
                    primeira categoria.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {categories.map(
                  (category) => {
                    const productCount =
                      category._count
                        .products;

                    return (
                      <article
                        key={category.id}
                        className="p-5 sm:p-6"
                      >
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                <FolderKanban
                                  size={21}
                                />
                              </div>

                              <div>
                                <p className="font-black">
                                  {
                                    category.name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-zinc-600">
                                  {productCount}{" "}
                                  {productCount ===
                                  1
                                    ? "produto vinculado"
                                    : "produtos vinculados"}
                                </p>
                              </div>
                            </div>

                            <span
                              className={
                                productCount >
                                0
                                  ? "rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400"
                                  : "rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400"
                              }
                            >
                              {productCount >
                              0
                                ? "Em uso"
                                : "Disponível para exclusão"}
                            </span>
                          </div>

                          <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
                            <form
                              action={
                                updateCategoryAction
                              }
                              className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row"
                            >
                              <input
                                type="hidden"
                                name="categoryId"
                                value={
                                  category.id
                                }
                              />

                              <div className="min-w-0 flex-1">
                                <label
                                  htmlFor={`category-${category.id}`}
                                  className="sr-only"
                                >
                                  Nome da categoria
                                </label>

                                <input
                                  id={`category-${category.id}`}
                                  type="text"
                                  name="name"
                                  required
                                  minLength={2}
                                  maxLength={60}
                                  defaultValue={
                                    category.name
                                  }
                                  className="h-11 w-full rounded-xl border border-zinc-800 bg-black px-4 text-sm text-white outline-none transition focus:border-yellow-400"
                                />
                              </div>

                              <button
                                type="submit"
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 text-sm font-black text-black transition hover:bg-yellow-300"
                              >
                                <Save
                                  size={17}
                                />
                                Salvar
                              </button>
                            </form>

                            <DeleteCategoryButton
                              categoryId={
                                category.id
                              }
                              categoryName={
                                category.name
                              }
                              productCount={
                                productCount
                              }
                            />
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </section>
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
    | "purple"
    | "green";
};

function SummaryCard({
  icon,
  label,
  value,
  tone = "default",
}: SummaryCardProps) {
  const iconStyle =
    tone === "purple"
      ? "bg-purple-500/10 text-purple-400"
      : tone === "green"
        ? "bg-emerald-500/10 text-emerald-400"
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