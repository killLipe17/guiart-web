"use server";

import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

const validStatuses = new Set<OrderStatus>(
  Object.values(OrderStatus)
);

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

  await prisma.order.update({
    where: {
      id: orderId,
    },

    data: {
      status: status as OrderStatus,
    },
  });

  revalidatePath("/admin/pedidos");

  revalidatePath(
    `/admin/pedidos/${orderId}`
  );
}