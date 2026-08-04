"use server";

import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

const statusesAllowedForDeletion =
  new Set<OrderStatus>([
    OrderStatus.PENDING,
    OrderStatus.CANCELLED,
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

          if (stockRelease.count === 1) {
            for (const item of order.items) {
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

  revalidateOrderPages(
    orderId,
    productSlugs
  );
}

export async function deleteOrderAction(
  formData: FormData
) {
  await requireAdmin();

  const orderIdValue =
    formData.get("orderId");

  const orderId =
    typeof orderIdValue === "string"
      ? orderIdValue.trim()
      : "";

  if (!orderId) {
    throw new Error(
      "O pedido informado é inválido."
    );
  }

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
              number: true,
              status: true,
              stockDeducted: true,

              items: {
                select: {
                  productId: true,
                  slug: true,
                  title: true,
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

        if (
          !statusesAllowedForDeletion.has(
            order.status
          )
        ) {
          throw new Error(
            `O pedido #${order.number} não pode ser excluído enquanto estiver com o status "${order.status}". Cancele o pedido primeiro.`
          );
        }

        /*
         * Pedidos pendentes ou cancelados
         * normalmente não possuem estoque
         * descontado.
         *
         * Esta verificação protege o estoque
         * caso exista alguma inconsistência.
         */
        if (order.stockDeducted) {
          for (const item of order.items) {
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
        }

        await transaction.order.delete({
          where: {
            id: orderId,
          },
        });

        return order.items.map(
          (item) => item.slug
        );
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    );

  revalidateOrderPages(
    orderId,
    productSlugs
  );

  redirect("/admin/pedidos");
}

function revalidateOrderPages(
  orderId: string,
  productSlugs: string[]
) {
  revalidatePath("/admin/pedidos");

  revalidatePath(
    `/admin/pedidos/${orderId}`
  );

  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
  revalidatePath("/");

  const uniqueSlugs =
    new Set(productSlugs);

  for (const slug of uniqueSlugs) {
    revalidatePath(
      `/produto/${slug}`
    );
  }
}