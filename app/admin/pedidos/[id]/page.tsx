import { OrderStatus } from "@prisma/client";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  ImageIcon,
  MessageSquareText,
  Package,
  Save,
  User,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateOrderStatusAction } from "@/app/admin/pedidos/actions";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type OrderDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const currencyFormatter =
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const dateFormatter =
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
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

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  await requireAdmin();

  const { id } = await params;

  const order =
    await prisma.order.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        number: true,
        customerName: true,
        notes: true,
        status: true,
        total: true,
        createdAt: true,
        updatedAt: true,

        items: {
          select: {
            id: true,
            title: true,
            slug: true,
            console: true,
            imageUrl: true,
            price: true,
            quantity: true,
            subtotal: true,
          },
        },
      },
    });

  if (!order) {
    notFound();
  }

  const totalQuantity =
    order.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-zinc-800 pb-6">
          <Link
            href="/admin/pedidos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-yellow-400"
          >
            <ArrowLeft size={18} />
            Voltar para os pedidos
          </Link>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
                Detalhes do pedido
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black sm:text-4xl">
                  Pedido #{order.number}
                </h1>

                <span
                  className={`rounded-full border px-4 py-2 text-xs font-bold ${statusStyles[order.status]}`}
                >
                  {
                    statusLabels[
                      order.status
                    ]
                  }
                </span>
              </div>
            </div>

            <form
              action={
                updateOrderStatusAction
              }
              className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"
            >
              <input
                type="hidden"
                name="orderId"
                value={order.id}
              />

              <select
                name="status"
                defaultValue={order.status}
                aria-label={`Status do pedido ${order.number}`}
                className="min-h-12 flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-white outline-none transition focus:border-yellow-400 lg:min-w-52"
              >
                {statusOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 font-bold text-black transition hover:bg-yellow-300"
              >
                <Save size={18} />
                Atualizar status
              </button>
            </form>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon={<User size={20} />}
            label="Cliente"
            value={order.customerName}
          />

          <InfoCard
            icon={
              <CalendarDays
                size={20}
              />
            }
            label="Criado em"
            value={dateFormatter.format(
              order.createdAt
            )}
          />

          <InfoCard
            icon={
              <ClipboardList
                size={20}
              />
            }
            label="Quantidade"
            value={`${totalQuantity} ${
              totalQuantity === 1
                ? "item"
                : "itens"
            }`}
          />

          <InfoCard
            icon={<Package size={20} />}
            label="Total"
            value={currencyFormatter.format(
              Number(order.total)
            )}
            highlighted
          />
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950">
          <div className="border-b border-zinc-800 px-5 py-5 sm:px-6">
            <h2 className="text-xl font-black">
              Produtos do pedido
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {order.items.length}{" "}
              {order.items.length === 1
                ? "produto registrado"
                : "produtos registrados"}
            </p>
          </div>

          <div className="divide-y divide-zinc-800">
            {order.items.map(
              (item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6"
                >
                  <Link
                    href={`/produto/${item.slug}`}
                    target="_blank"
                    className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ImageIcon
                        size={34}
                        className="text-zinc-700"
                      />
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/produto/${item.slug}`}
                      target="_blank"
                      className="text-lg font-bold transition hover:text-yellow-400"
                    >
                      {item.title}
                    </Link>

                    {item.console && (
                      <p className="mt-1 text-sm text-zinc-500">
                        {item.console}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-zinc-400">
                      {item.quantity} ×{" "}
                      {currencyFormatter.format(
                        Number(item.price)
                      )}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Subtotal
                    </p>

                    <p className="mt-2 text-xl font-black">
                      {currencyFormatter.format(
                        Number(
                          item.subtotal
                        )
                      )}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-zinc-800 bg-black px-5 py-5 sm:px-6">
            <span className="font-semibold text-zinc-400">
              Total do pedido
            </span>

            <strong className="text-2xl font-black text-yellow-400">
              {currencyFormatter.format(
                Number(order.total)
              )}
            </strong>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <MessageSquareText
              size={22}
              className="text-yellow-400"
            />

            <h2 className="text-xl font-black">
              Observações
            </h2>
          </div>

          <p className="mt-5 whitespace-pre-line leading-7 text-zinc-400">
            {order.notes?.trim()
              ? order.notes
              : "Nenhuma observação informada pelo cliente."}
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500 sm:p-6">
          <p>
            Pedido criado em{" "}
            {dateFormatter.format(
              order.createdAt
            )}
          </p>

          <p className="mt-2">
            Última atualização em{" "}
            {dateFormatter.format(
              order.updatedAt
            )}
          </p>
        </section>
      </div>
    </main>
  );
}

type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlighted?: boolean;
};

function InfoCard({
  icon,
  label,
  value,
  highlighted = false,
}: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
        {icon}
      </div>

      <p className="mt-4 text-xs uppercase tracking-wider text-zinc-600">
        {label}
      </p>

      <p
        className={`mt-2 break-words font-bold ${
          highlighted
            ? "text-xl text-yellow-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}