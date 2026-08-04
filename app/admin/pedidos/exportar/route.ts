import {
  OrderStatus,
  Prisma,
} from "@prisma/client";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const validStatuses = new Set<OrderStatus>(
  Object.values(OrderStatus)
);

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PAID: "Pago",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

const dateFormatter = new Intl.DateTimeFormat(
  "pt-BR",
  {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }
);

function getSingleSearchParam(
  value: string | null
) {
  return value?.trim() ?? "";
}

function formatDecimal(
  value: Prisma.Decimal | number
) {
  return Number(value)
    .toFixed(2)
    .replace(".", ",");
}

function sanitizeSpreadsheetCell(
  value: unknown
) {
  let text =
    value === null || value === undefined
      ? ""
      : String(value);

  text = text
    .replace(/\r\n/g, " ")
    .replace(/\n/g, " ")
    .replace(/\r/g, " ");

  /*
   * Evita que textos enviados por clientes
   * sejam interpretados como fórmulas pelo
   * Excel ou Google Planilhas.
   */
  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return text;
}

function escapeCsvCell(value: unknown) {
  const text =
    sanitizeSpreadsheetCell(value);

  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  await requireAdmin();

  const url = new URL(request.url);

  const searchQuery =
    getSingleSearchParam(
      url.searchParams.get("q")
    );

  const statusQuery =
    getSingleSearchParam(
      url.searchParams.get("status")
    );

  const selectedStatus:
    | OrderStatus
    | "ALL" =
    validStatuses.has(
      statusQuery as OrderStatus
    )
      ? (statusQuery as OrderStatus)
      : "ALL";

  const where: Prisma.OrderWhereInput = {};

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

    if (/^\d+$/.test(possibleOrderNumber)) {
      const orderNumber = Number(
        possibleOrderNumber
      );

      if (
        Number.isSafeInteger(orderNumber)
      ) {
        searchFilters.push({
          number: orderNumber,
        });
      }
    }

    where.OR = searchFilters;
  }

  const orders =
    await prisma.order.findMany({
      where,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        number: true,
        customerName: true,
        status: true,
        total: true,
        notes: true,
        createdAt: true,

        items: {
          select: {
            title: true,
            console: true,
            quantity: true,
            price: true,
            subtotal: true,
          },
        },
      },
    });

  const header = [
    "Número do pedido",
    "Data",
    "Cliente",
    "Status",
    "Produto",
    "Plataforma",
    "Quantidade",
    "Valor unitário",
    "Subtotal do produto",
    "Total do pedido",
    "Observações",
  ];

  const rows = orders.flatMap((order) => {
    if (order.items.length === 0) {
      return [
        [
          order.number,
          dateFormatter.format(
            order.createdAt
          ),
          order.customerName,
          statusLabels[order.status],
          "",
          "",
          "",
          "",
          "",
          formatDecimal(order.total),
          order.notes ?? "",
        ],
      ];
    }

    return order.items.map((item) => [
      order.number,
      dateFormatter.format(
        order.createdAt
      ),
      order.customerName,
      statusLabels[order.status],
      item.title,
      item.console ?? "",
      item.quantity,
      formatDecimal(item.price),
      formatDecimal(item.subtotal),
      formatDecimal(order.total),
      order.notes ?? "",
    ]);
  });

  const csvContent =
    "\uFEFF" +
    [header, ...rows]
      .map((row) =>
        row
          .map(escapeCsvCell)
          .join(";")
      )
      .join("\r\n");

  const fileDate = new Date()
    .toISOString()
    .slice(0, 10);

  return new Response(csvContent, {
    status: 200,

    headers: {
      "Content-Type":
        "text/csv; charset=utf-8",

      "Content-Disposition":
        `attachment; filename="pedidos-guiart-${fileDate}.csv"`,

      "Cache-Control":
        "no-store, max-age=0",
    },
  });
}