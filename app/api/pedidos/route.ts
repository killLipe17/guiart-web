import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type CheckoutRequestBody = {
  customerName?: unknown;
  notes?: unknown;
  items?: unknown;
};

type CheckoutItemInput = {
  productId?: unknown;
  quantity?: unknown;
};

function createErrorResponse(
  error: string,
  status: number
) {
  return NextResponse.json(
    {
      error,
    },
    {
      status,
    }
  );
}

export async function POST(request: Request) {
  let body: CheckoutRequestBody;

  try {
    const parsedBody: unknown =
      await request.json();

    if (
      typeof parsedBody !== "object" ||
      parsedBody === null ||
      Array.isArray(parsedBody)
    ) {
      return createErrorResponse(
        "Os dados do pedido são inválidos.",
        400
      );
    }

    body = parsedBody as CheckoutRequestBody;
  } catch {
    return createErrorResponse(
      "Não foi possível ler os dados do pedido.",
      400
    );
  }

  const customerName =
    typeof body.customerName === "string"
      ? body.customerName.trim()
      : "";

  const notes =
    typeof body.notes === "string"
      ? body.notes.trim()
      : "";

  if (!customerName) {
    return createErrorResponse(
      "Digite seu nome para finalizar o pedido.",
      400
    );
  }

  if (customerName.length > 80) {
    return createErrorResponse(
      "O nome informado é muito longo.",
      400
    );
  }

  if (notes.length > 500) {
    return createErrorResponse(
      "As observações devem possuir no máximo 500 caracteres.",
      400
    );
  }

  if (
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return createErrorResponse(
      "O carrinho está vazio.",
      400
    );
  }

  const groupedItems =
    new Map<string, number>();

  for (const rawItem of body.items) {
    if (
      typeof rawItem !== "object" ||
      rawItem === null ||
      Array.isArray(rawItem)
    ) {
      return createErrorResponse(
        "Um dos produtos do carrinho é inválido.",
        400
      );
    }

    const item =
      rawItem as CheckoutItemInput;

    const productId =
      typeof item.productId === "string"
        ? item.productId.trim()
        : "";

    const quantity = item.quantity;

    if (!productId) {
      return createErrorResponse(
        "Um dos produtos não possui identificação.",
        400
      );
    }

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return createErrorResponse(
        "Uma das quantidades informadas é inválida.",
        400
      );
    }

    const currentQuantity =
      groupedItems.get(productId) ?? 0;

    groupedItems.set(
      productId,
      currentQuantity + quantity
    );
  }

  const normalizedItems = Array.from(
    groupedItems,
    ([productId, quantity]) => ({
      productId,
      quantity,
    })
  );

  if (normalizedItems.length > 20) {
    return createErrorResponse(
      "O pedido possui produtos demais.",
      400
    );
  }

  try {
    const productIds = normalizedItems.map(
      (item) => item.productId
    );

    const products =
      await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },

        select: {
          id: true,
          title: true,
          slug: true,
          console: true,
          price: true,
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
            },
          },
        },
      });

    if (
      products.length !==
      normalizedItems.length
    ) {
      return createErrorResponse(
        "Um ou mais produtos não foram encontrados.",
        409
      );
    }

    const productsById = new Map(
      products.map((product) => [
        product.id,
        product,
      ])
    );

    const orderItems = [];
    let total = new Prisma.Decimal(0);

    for (const item of normalizedItems) {
      const product = productsById.get(
        item.productId
      );

      if (!product) {
        return createErrorResponse(
          "Um dos produtos não foi encontrado.",
          409
        );
      }

      if (product.stock <= 0) {
        return createErrorResponse(
          `O produto "${product.title}" não está mais disponível.`,
          409
        );
      }

      if (item.quantity > product.stock) {
        return createErrorResponse(
          `A quantidade solicitada de "${product.title}" é maior que o estoque disponível.`,
          409
        );
      }

      const subtotal = product.price.mul(
        item.quantity
      );

      total = total.add(subtotal);

      orderItems.push({
        productId: product.id,
        title: product.title,
        slug: product.slug,
        console: product.console,
        imageUrl:
          product.images[0]?.url ?? null,
        price: product.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        notes: notes || null,
        total,

        items: {
          create: orderItems.map(
            ({
              productId,
              ...orderItem
            }) => ({
              ...orderItem,

              product: {
                connect: {
                  id: productId,
                },
              },
            })
          ),
        },
      },

      select: {
        id: true,
        number: true,
        total: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        order: {
          id: order.id,
          number: order.number,
          status: order.status,
          total: Number(order.total),
          createdAt:
            order.createdAt.toISOString(),

          items: orderItems.map(
            (orderItem) => ({
              productId:
                orderItem.productId,
              title: orderItem.title,
              slug: orderItem.slug,
              console: orderItem.console,
              imageUrl:
                orderItem.imageUrl,
              price: Number(
                orderItem.price
              ),
              quantity:
                orderItem.quantity,
              subtotal: Number(
                orderItem.subtotal
              ),
            })
          ),
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Erro ao registrar pedido:",
      error
    );

    return createErrorResponse(
      "Não foi possível registrar o pedido. Tente novamente.",
      500
    );
  }
}