"use server";

import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

const validStatuses = new Set<OrderStatus>(
  Object.values(OrderStatus)
);

const statusesWithDeductedStock =
  new Set<OrderStatus>([
    OrderStatus.CONFIRMED,
    OrderStatus.PAID,
    OrderStatus.COMPLETED,
  ]);

export async function updateOrderStatusAction(
  formData: FormData
) {
  await requireAdmin();

  const orderIdValue =
    formData.get("orderId");

  const statusValue =
    formData.get("status");

  const orderId =
    typeof orderIdValue === "string"
      ? orderIdValue.trim()
      : "";

  const status =
    typeof statusValue === "string"
      ? statusValue.trim()
      : "";

  if (!orderId) {
    throw new Error(
      "O pedido informado é inválido."
    );
  }

  if (
    !validStatuses.has(
      status as OrderStatus
    )
  ) {
    throw new Error(
      "O status informado é inválido."
    );
  }

  const newStatus =
    status as OrderStatus;

  const shouldDeductStock =
    statusesWithDeductedStock.has(
      newStatus
    );

  const productSlugs =
    await prisma.$transaction(
      async (transaction) => {
        const order =
          await transaction.order.findUnique({
            where: {
              id: orderId,
            },

            select: {
              id: true,
              status: true,
              stockDeducted: true,

              items: {
                select: {
                  productId: true,
                  title: true,
                  slug: true,
                  quantity: true,
                },
              },
            },
          });

        if (!order) {
          throw new Error(
            "Pedido não encontrado."
          );
        }

        /*
         * O novo status precisa manter
         * o estoque descontado.
         */
        if (shouldDeductStock) {
          const stockClaim =
            await transaction.order.updateMany({
              where: {
                id: orderId,
                stockDeducted: false,
              },

              data: {
                status: newStatus,
                stockDeducted: true,
              },
            });

          /*
           * count === 1 significa que este
           * pedido ainda não havia alterado
           * o estoque.
           */
          if (stockClaim.count === 1) {
            for (const item of order.items) {
              if (!item.productId) {
                throw new Error(
                  `O produto "${item.title}" foi removido do catálogo e não pode ter o estoque descontado.`
                );
              }

              const updatedProduct =
                await transaction.product.updateMany({
                  where: {
                    id: item.productId,

                    stock: {
                      gte: item.quantity,
                    },
                  },

                  data: {
                    stock: {
                      decrement:
                        item.quantity,
                    },
                  },
                });

              if (
                updatedProduct.count !== 1
              ) {
                throw new Error(
                  `Estoque insuficiente para o produto "${item.title}".`
                );
              }
            }
          } else {
            /*
             * O estoque já estava descontado.
             * Apenas altera o status.
             */
            await transaction.order.update({
              where: {
                id: orderId,
              },

              data: {
                status: newStatus,
              },
            });
          }
        } else {
          /*
           * PENDING e CANCELLED não devem
           * manter o estoque descontado.
           */
          const stockRelease =
            await transaction.order.updateMany({
              where: {
                id: orderId,
                stockDeducted: true,
              },

              data: {
                status: newStatus,
                stockDeducted: false,
              },
            });

          /*
           * Se o estoque estava descontado,
           * devolve as unidades.
           */
          if (stockRelease.count === 1) {
            for (const item of order.items) {
              /*
               * O produto pode ter sido
               * excluído depois do pedido.
               * Nesse caso não existe um
               * registro para receber o estoque.
               */
              if (!item.productId) {
                continue;
              }

              await transaction.product.update({
                where: {
                  id: item.productId,
                },

                data: {
                  stock: {
                    increment:
                      item.quantity,
                  },
                },
              });
            }
          } else {
            /*
             * O pedido ainda não havia
             * descontado estoque.
             */
            await transaction.order.update({
              where: {
                id: orderId,
              },

              data: {
                status: newStatus,
              },
            });
          }
        }

        return order.items.map(
          (item) => item.slug
        );
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    );

  revalidatePath("/admin/pedidos");

  revalidatePath(
    `/admin/pedidos/${orderId}`
  );

  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
  revalidatePath("/");

  for (const slug of productSlugs) {
    revalidatePath(
      `/produto/${slug}`
    );
  }
}