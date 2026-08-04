import { OrderStatus } from "@prisma/client";
import {
  ClipboardList,
  Eye,
  House,
  Package,
  Save,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

import { updateOrderStatusAction } from "@/app/admin/pedidos/actions";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
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

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PAID: "Pago",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

const statusStyles: Record<OrderStatus, string> = {
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

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
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
  });

  const pendingOrders = orders.filter(
    (order) => order.status === OrderStatus.PENDING
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === OrderStatus.COMPLETED
  ).length;

  const totalRegistered = orders.reduce(
    (total, order) => total + Number(order.total),
    0
  );

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
              Acompanhe os pedidos enviados pelo carrinho do site.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
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
          </nav>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            label="Pedidos exibidos"
            value={String(orders.length)}
            icon={<ClipboardList size={22} />}
          />

          <DashboardCard
            label="Pedidos pendentes"
            value={String(pendingOrders)}
            icon={<ShoppingBag size={22} />}
          />

          <DashboardCard
            label="Pedidos concluídos"
            value={String(completedOrders)}
            icon={<Package size={22} />}
          />

          <DashboardCard
            label="Total registrado"
            value={currencyFormatter.format(totalRegistered)}
            icon={<ShoppingBag size={22} />}
          />
        </section>

        {orders.length === 0 ? (
          <section className="mt-8 flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-8 text-center">
            <div>
              <ClipboardList
                size={52}
                className="mx-auto text-zinc-700"
              />

              <h2 className="mt-5 text-xl font-bold">
                Nenhum pedido registrado
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                Os pedidos criados pelo carrinho aparecerão aqui.
              </p>
            </div>
          </section>
        ) : (
          <section className="mt-8 space-y-4">
            {orders.map((order) => {
              const firstItem = order.items[0]?.title;

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
                            statusStyles[order.status]
                          }`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>

                      <p className="mt-3 font-semibold text-zinc-200">
                        {order.customerName}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        {dateFormatter.format(order.createdAt)}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
                        <span>
                          <strong className="text-white">
                            {order._count.items}
                          </strong>{" "}
                          {order._count.items === 1
                            ? "produto"
                            : "produtos"}
                        </span>

                        <span>
                          Total:{" "}
                          <strong className="text-yellow-400">
                            {currencyFormatter.format(
                              Number(order.total)
                            )}
                          </strong>
                        </span>
                      </div>

                      {firstItem && (
                        <p className="mt-3 line-clamp-1 text-sm text-zinc-600">
                          {firstItem}

                          {order._count.items > 1
                            ? ` e mais ${order._count.items - 1}`
                            : ""}
                        </p>
                      )}

                      {order.notes && (
                        <p className="mt-3 line-clamp-2 text-sm italic text-zinc-500">
                          Observação: {order.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-80">
                      <form
                        action={updateOrderStatusAction}
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
                          defaultValue={order.status}
                          aria-label={`Status do pedido ${order.number}`}
                          className="min-h-11 flex-1 rounded-xl border border-zinc-800 bg-black px-3 text-sm font-semibold text-white outline-none transition focus:border-yellow-400"
                        >
                          {statusOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
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
};

function DashboardCard({
  label,
  value,
  icon,
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
    </div>
  );
}