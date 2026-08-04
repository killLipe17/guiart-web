import { OrderStatus } from "@prisma/client";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  ClipboardList,
  Clock3,
  DollarSign,
  House,
  ImageIcon,
  Package,
  Plus,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

import { LogoutButton } from "@/components/admin/LogoutButton";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    productSummary,
    pendingOrdersCount,
    validRevenueSummary,
    outOfStockCount,
    outOfStockProducts,
    latestOrders,
  ] = await Promise.all([
    prisma.product.aggregate({
      _count: {
        _all: true,
      },

      _sum: {
        stock: true,
      },
    }),

    prisma.order.count({
      where: {
        status: OrderStatus.PENDING,
      },
    }),

    prisma.order.aggregate({
      where: {
        status: {
          not: OrderStatus.CANCELLED,
        },
      },

      _sum: {
        total: true,
      },
    }),

    prisma.product.count({
      where: {
        stock: {
          lte: 0,
        },
      },
    }),

    prisma.product.findMany({
      where: {
        stock: {
          lte: 0,
        },
      },

      orderBy: {
        updatedAt: "desc",
      },

      take: 5,

      select: {
        id: true,
        title: true,
        slug: true,
        console: true,
        stock: true,

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

    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 5,

      select: {
        id: true,
        number: true,
        customerName: true,
        status: true,
        total: true,
        createdAt: true,

        _count: {
          select: {
            items: true,
          },
        },
      },
    }),
  ]);

  const productCount =
    productSummary._count._all;

  const stockCount =
    productSummary._sum.stock ?? 0;

  const validRevenue = Number(
    validRevenueSummary._sum.total ?? 0
  );

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-yellow-400">
              Guiart Games
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Painel administrativo
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Visão geral dos produtos, estoque e pedidos
              registrados no site.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <House size={18} />
              Ver loja
            </Link>

            <LogoutButton />
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Produtos cadastrados"
            value={String(productCount)}
            description={`${stockCount} unidades em estoque`}
            icon={<Boxes size={23} />}
            href="/admin/produtos"
          />

          <SummaryCard
            title="Pedidos pendentes"
            value={String(pendingOrdersCount)}
            description="Aguardando atendimento"
            icon={<ShoppingBag size={23} />}
            href="/admin/pedidos?status=PENDING"
            warning={pendingOrdersCount > 0}
          />

          <SummaryCard
            title="Total válido"
            value={currencyFormatter.format(
              validRevenue
            )}
            description="Não inclui pedidos cancelados"
            icon={<DollarSign size={23} />}
            href="/admin/pedidos"
          />

          <SummaryCard
            title="Produtos sem estoque"
            value={String(outOfStockCount)}
            description="Itens indisponíveis no catálogo"
            icon={<AlertTriangle size={23} />}
            href="/admin/produtos"
            danger={outOfStockCount > 0}
          />
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
                Acesso rápido
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Gerenciamento
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <QuickAccessCard
              href="/admin/produtos"
              icon={<Package size={25} />}
              title="Produtos"
              description="Gerencie preços, estoque, condições e imagens."
            />

            <QuickAccessCard
              href="/admin/pedidos"
              icon={<ClipboardList size={25} />}
              title="Pedidos"
              description="Acompanhe clientes, status e movimentações de estoque."
            />

            <QuickAccessCard
              href="/admin/produtos/novo"
              icon={<Plus size={25} />}
              title="Novo produto"
              description="Cadastre um novo jogo ou item colecionável."
              highlighted
            />
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-5 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <Clock3
                    size={20}
                    className="text-yellow-400"
                  />

                  <h2 className="text-xl font-black">
                    Últimos pedidos
                  </h2>
                </div>

                <p className="mt-2 text-sm text-zinc-500">
                  Pedidos registrados mais recentemente.
                </p>
              </div>

              <Link
                href="/admin/pedidos"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
              >
                Ver todos
                <ArrowRight size={16} />
              </Link>
            </div>

            {latestOrders.length === 0 ? (
              <EmptyState
                icon={<ClipboardList size={40} />}
                title="Nenhum pedido"
                description="Os novos pedidos aparecerão aqui."
              />
            ) : (
              <div className="divide-y divide-zinc-800">
                {latestOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/pedidos/${order.id}`}
                    className="flex flex-col gap-4 px-5 py-5 transition hover:bg-zinc-900/70 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black">
                          Pedido #{order.number}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                            statusStyles[order.status]
                          }`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>

                      <p className="mt-2 truncate text-sm font-semibold text-zinc-300">
                        {order.customerName}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        {dateFormatter.format(
                          order.createdAt
                        )}
                        {" • "}
                        {order._count.items}{" "}
                        {order._count.items === 1
                          ? "produto"
                          : "produtos"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-4 sm:block sm:text-right">
                      <p className="text-xs uppercase tracking-wider text-zinc-600">
                        Total
                      </p>

                      <p className="mt-1 font-black text-yellow-400">
                        {currencyFormatter.format(
                          Number(order.total)
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-5 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    size={20}
                    className="text-red-400"
                  />

                  <h2 className="text-xl font-black">
                    Produtos sem estoque
                  </h2>
                </div>

                <p className="mt-2 text-sm text-zinc-500">
                  Produtos que estão indisponíveis na loja.
                </p>
              </div>

              <Link
                href="/admin/produtos"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
              >
                Ver produtos
                <ArrowRight size={16} />
              </Link>
            </div>

            {outOfStockProducts.length === 0 ? (
              <EmptyState
                icon={<Package size={40} />}
                title="Estoque em dia"
                description="Nenhum produto está sem estoque."
              />
            ) : (
              <div className="divide-y divide-zinc-800">
                {outOfStockProducts.map((product) => {
                  const coverImage =
                    product.images[0];

                  return (
                    <Link
                      key={product.id}
                      href={`/admin/produtos/${product.slug}/editar`}
                      className="flex items-center gap-4 px-5 py-4 transition hover:bg-zinc-900/70 sm:px-6"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black">
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
                            size={26}
                            className="text-zinc-700"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold">
                          {product.title}
                        </h3>

                        <p className="mt-1 text-sm text-zinc-500">
                          {product.console ||
                            "Plataforma não informada"}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                        Sem estoque
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  warning?: boolean;
  danger?: boolean;
};

function SummaryCard({
  title,
  value,
  description,
  icon,
  href,
  warning = false,
  danger = false,
}: SummaryCardProps) {
  const iconStyle = danger
    ? "bg-red-500/10 text-red-400"
    : warning
      ? "bg-yellow-400/10 text-yellow-400"
      : "bg-yellow-400/10 text-yellow-400";

  return (
    <Link
      href={href}
      className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-yellow-400/40 hover:bg-zinc-900"
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyle}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-2 break-words text-2xl font-black">
        {value}
      </p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs leading-5 text-zinc-600">
          {description}
        </p>

        <ArrowRight
          size={17}
          className="shrink-0 text-zinc-700 transition group-hover:translate-x-1 group-hover:text-yellow-400"
        />
      </div>
    </Link>
  );
}

type QuickAccessCardProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlighted?: boolean;
};

function QuickAccessCard({
  href,
  icon,
  title,
  description,
  highlighted = false,
}: QuickAccessCardProps) {
  return (
    <Link
      href={href}
      className={
        highlighted
          ? "group rounded-2xl border border-yellow-400 bg-yellow-400 p-6 text-black transition hover:bg-yellow-300"
          : "group rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-yellow-400/40 hover:bg-zinc-900"
      }
    >
      <div
        className={
          highlighted
            ? "flex h-12 w-12 items-center justify-center rounded-xl bg-black text-yellow-400"
            : "flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400"
        }
      >
        {icon}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <h3 className="text-xl font-black">
          {title}
        </h3>

        <ArrowRight
          size={19}
          className="transition group-hover:translate-x-1"
        />
      </div>

      <p
        className={
          highlighted
            ? "mt-3 text-sm leading-6 text-black/70"
            : "mt-3 text-sm leading-6 text-zinc-500"
        }
      >
        {description}
      </p>
    </Link>
  );
}

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-64 items-center justify-center px-6 py-10 text-center">
      <div>
        <div className="mx-auto text-zinc-700">
          {icon}
        </div>

        <h3 className="mt-4 font-bold">
          {title}
        </h3>

        <p className="mt-2 text-sm text-zinc-600">
          {description}
        </p>
      </div>
    </div>
  );
}