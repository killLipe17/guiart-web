import {
  OrderStatus,
  Prisma,
} from "@prisma/client";
import {
  ClipboardList,
  Download,
  Eye,
  Filter,
  FolderKanban,
  House,
  LayoutDashboard,
  Package,
  RotateCcw,
  Save,
  Search,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

import { updateOrderStatusAction } from "@/app/admin/pedidos/actions";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    status?: string | string[];
  }>;
};

const currencyFormatter =
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const dateFormatter =
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  });

const statusOptions: Array<{
  value: OrderStatus;
  label: string;
}> = [
  {
    value: OrderStatus.PENDING,
    label: "Pendente",
  },
  {
    value: OrderStatus.CONFIRMED,
    label: "Confirmado",
  },
  {
    value: OrderStatus.PAID,
    label: "Pago",
  },
  {
    value: OrderStatus.COMPLETED,
    label: "Concluído",
  },
  {
    value: OrderStatus.CANCELLED,
    label: "Cancelado",
  },
];

const validStatuses =
  new Set<OrderStatus>(
    Object.values(OrderStatus)
  );

const statusLabels: Record<
  OrderStatus,
  string
> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PAID: "Pago",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

const statusStyles: Record<
  OrderStatus,
  string
> = {
  PENDING:
    "border-yellow-400/30 bg-yellow-400/10 text-yellow-400",

  CONFIRMED:
    "border-blue-400/30 bg-blue-400/10 text-blue-400",

  PAID:
    "border-purple-400/30 bg-purple-400/10 text-purple-400",

  COMPLETED:
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",

  CANCELLED:
    "border-red-400/30 bg-red-400/10 text-red-400",
};

function getSingleSearchParam(
  value: string | string[] | undefined
) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
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

  const selectedStatus:
    | OrderStatus
    | "ALL" =
    validStatuses.has(
      statusQuery as OrderStatus
    )
      ? (statusQuery as OrderStatus)
      : "ALL";

  const where: Prisma.OrderWhereInput =
    {};

  if (selectedStatus !== "ALL") {
    where.status = selectedStatus;
  }

  if (searchQuery) {
    const searchFilters:
      Prisma.OrderWhereInput[] = [
      {
        customerName: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    ];

    const possibleOrderNumber =
      searchQuery
        .replace(/^#/, "")
        .trim();

    if (
      /^\d+$/.test(
        possibleOrderNumber
      )
    ) {
      const orderNumber = Number(
        possibleOrderNumber
      );

      if (
        Number.isSafeInteger(
          orderNumber
        )
      ) {
        searchFilters.push({
          number: orderNumber,
        });
      }
    }

    where.OR = searchFilters;
  }

  const [orders, ordersSummary] =
    await Promise.all([
      prisma.order.findMany({
        where,

        orderBy: {
          createdAt: "desc",
        },

        take: 100,

        select: {
          id: true,
          number: true,
          customerName: true,
          status: true,
          total: true,
          notes: true,
          createdAt: true,

          _count: {
            select: {
              items: true,
            },
          },

          items: {
            take: 1,

            select: {
              title: true,
            },
          },
        },
      }),

      prisma.order.findMany({
        select: {
          status: true,
          total: true,
        },
      }),
    ]);

  const pendingOrders =
    ordersSummary.filter(
      (order) =>
        order.status ===
        OrderStatus.PENDING
    ).length;

  const completedOrders =
    ordersSummary.filter(
      (order) =>
        order.status ===
        OrderStatus.COMPLETED
    ).length;

  const validTotal =
    ordersSummary
      .filter(
        (order) =>
          order.status !==
          OrderStatus.CANCELLED
      )
      .reduce(
        (total, order) =>
          total +
          Number(order.total),
        0
      );

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedStatus !== "ALL";

  const exportSearchParams =
    new URLSearchParams();

  if (searchQuery) {
    exportSearchParams.set(
      "q",
      searchQuery
    );
  }

  if (selectedStatus !== "ALL") {
    exportSearchParams.set(
      "status",
      selectedStatus
    );
  }

  const exportQuery =
    exportSearchParams.toString();

  const exportHref =
    `/admin/pedidos/exportar${
      exportQuery
        ? `?${exportQuery}`
        : ""
    }`;

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-zinc-800 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
              Painel administrativo
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              Pedidos
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Acompanhe os pedidos enviados
              pelo carrinho do site.
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
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <House size={18} />
              Voltar para a loja
            </Link>

            <Link
              href="/admin/produtos"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <Package size={18} />
              Produtos
            </Link>

            <Link
              href="/admin/categorias"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <FolderKanban size={18} />
              Categorias
            </Link>

            <a
              href={exportHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
            >
              <Download size={18} />
              Exportar CSV
            </a>
          </nav>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            label="Pedidos cadastrados"
            value={String(
              ordersSummary.length
            )}
            icon={
              <ClipboardList size={22} />
            }
          />

          <DashboardCard
            label="Pedidos pendentes"
            value={String(
              pendingOrders
            )}
            icon={
              <ShoppingBag size={22} />
            }
          />

          <DashboardCard
            label="Pedidos concluídos"
            value={String(
              completedOrders
            )}
            icon={
              <Package size={22} />
            }
          />

          <DashboardCard
            label="Total válido"
            value={currencyFormatter.format(
              validTotal
            )}
            description="Não inclui cancelados"
            icon={
              <ShoppingBag size={22} />
            }
          />
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
          <form
            action="/admin/pedidos"
            method="get"
            className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px_auto]"
          >
            <div className="relative">
              <label
                htmlFor="order-search"
                className="sr-only"
              >
                Buscar pedido
              </label>

              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              />

              <input
                id="order-search"
                type="search"
                name="q"
                defaultValue={
                  searchQuery
                }
                placeholder="Cliente ou número do pedido"
                className="h-12 w-full rounded-xl border border-zinc-800 bg-black pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            <div>
              <label
                htmlFor="order-status-filter"
                className="sr-only"
              >
                Filtrar por status
              </label>

              <select
                key={`filter-${selectedStatus}`}
                id="order-status-filter"
                name="status"
                defaultValue={
                  selectedStatus
                }
                className="h-12 w-full rounded-xl border border-zinc-800 bg-black px-4 text-sm font-semibold text-white outline-none transition focus:border-yellow-400"
              >
                <option value="ALL">
                  Todos os status
                </option>

                {statusOptions.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 text-sm font-bold text-black transition hover:bg-yellow-300 lg:flex-none"
              >
                <Filter size={18} />
                Filtrar
              </button>

              {hasActiveFilters && (
                <Link
                  href="/admin/pedidos"
                  title="Limpar filtros"
                  aria-label="Limpar filtros"
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                >
                  <RotateCcw size={18} />
                </Link>
              )}
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-4 text-sm">
            <p className="text-zinc-500">
              {orders.length === 1
                ? "1 pedido encontrado"
                : `${orders.length} pedidos encontrados`}
            </p>

            {hasActiveFilters && (
              <p className="text-yellow-400">
                Filtros ativos
              </p>
            )}
          </div>
        </section>

        {orders.length === 0 ? (
          <section className="mt-8 flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-8 text-center">
            <div>
              <ClipboardList
                size={52}
                className="mx-auto text-zinc-700"
              />

              <h2 className="mt-5 text-xl font-bold">
                {hasActiveFilters
                  ? "Nenhum pedido encontrado"
                  : "Nenhum pedido registrado"}
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                {hasActiveFilters
                  ? "Tente alterar o nome, número ou status utilizado no filtro."
                  : "Os pedidos criados pelo carrinho aparecerão aqui."}
              </p>

              {hasActiveFilters && (
                <Link
                  href="/admin/pedidos"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300"
                >
                  <RotateCcw size={18} />
                  Limpar filtros
                </Link>
              )}
            </div>
          </section>
        ) : (
          <section className="mt-8 space-y-4">
            {orders.map((order) => {
              const firstItem =
                order.items[0]?.title;

              return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-zinc-700 sm:p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-black text-white">
                          Pedido #{order.number}
                        </h2>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${
                            statusStyles[
                              order.status
                            ]
                          }`}
                        >
                          {
                            statusLabels[
                              order.status
                            ]
                          }
                        </span>
                      </div>

                      <p className="mt-3 font-semibold text-zinc-200">
                        {
                          order.customerName
                        }
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        {dateFormatter.format(
                          order.createdAt
                        )}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
                        <span>
                          <strong className="text-white">
                            {
                              order._count
                                .items
                            }
                          </strong>{" "}
                          {order._count
                            .items === 1
                            ? "produto"
                            : "produtos"}
                        </span>

                        <span>
                          Total:{" "}
                          <strong className="text-yellow-400">
                            {currencyFormatter.format(
                              Number(
                                order.total
                              )
                            )}
                          </strong>
                        </span>
                      </div>

                      {firstItem && (
                        <p className="mt-3 line-clamp-1 text-sm text-zinc-600">
                          {firstItem}

                          {order._count
                            .items > 1
                            ? ` e mais ${
                                order
                                  ._count
                                  .items - 1
                              }`
                            : ""}
                        </p>
                      )}

                      {order.notes && (
                        <p className="mt-3 line-clamp-2 text-sm italic text-zinc-500">
                          Observação:{" "}
                          {order.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-80">
                      <form
                        action={
                          updateOrderStatusAction
                        }
                        className="flex flex-col gap-2 sm:flex-row"
                      >
                        <input
                          type="hidden"
                          name="orderId"
                          value={order.id}
                        />

                        <select
                          key={`${order.id}-${order.status}`}
                          name="status"
                          defaultValue={
                            order.status
                          }
                          aria-label={`Status do pedido ${order.number}`}
                          className="min-h-11 flex-1 rounded-xl border border-zinc-800 bg-black px-3 text-sm font-semibold text-white outline-none transition focus:border-yellow-400"
                        >
                          {statusOptions.map(
                            (option) => (
                              <option
                                key={
                                  option.value
                                }
                                value={
                                  option.value
                                }
                              >
                                {
                                  option.label
                                }
                              </option>
                            )
                          )}
                        </select>

                        <button
                          type="submit"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 text-sm font-bold text-black transition hover:bg-yellow-300"
                        >
                          <Save size={17} />
                          Salvar
                        </button>
                      </form>

                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400"
                      >
                        <Eye size={18} />
                        Ver detalhes
                      </Link>
                    </div>
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

type DashboardCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
};

function DashboardCard({
  label,
  value,
  icon,
  description,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
        {icon}
      </div>

      <p className="mt-5 text-sm text-zinc-500">
        {label}
      </p>

      <p className="mt-2 break-words text-2xl font-black">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs text-zinc-600">
          {description}
        </p>
      )}
    </div>
  );
}