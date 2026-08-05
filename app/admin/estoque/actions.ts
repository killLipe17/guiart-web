"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

const MAX_STOCK = 999999;

function readFormText(
  formData: FormData,
  field: string
) {
  return String(
    formData.get(field) ?? ""
  ).trim();
}

function parseStock(value: string) {
  const stock = Number(value);

  if (
    !Number.isInteger(stock) ||
    stock < 0 ||
    stock > MAX_STOCK
  ) {
    return null;
  }

  return stock;
}

function getReturnTo(formData: FormData) {
  const returnTo = readFormText(
    formData,
    "returnTo"
  );

  if (
    returnTo === "/admin/estoque" ||
    returnTo.startsWith(
      "/admin/estoque?"
    )
  ) {
    return returnTo;
  }

  return "/admin/estoque";
}

function redirectWithMessage(
  returnTo: string,
  type: "success" | "error",
  message: string
): never {
  const [pathname, search = ""] =
    returnTo.split("?");

  const searchParams =
    new URLSearchParams(search);

  searchParams.delete("success");
  searchParams.delete("error");
  searchParams.set(type, message);

  redirect(
    `${pathname}?${searchParams.toString()}`
  );
}

function revalidateStockPages(
  productSlug: string
) {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
  revalidatePath("/admin/estoque");
  revalidatePath(
    `/produto/${productSlug}`
  );
}

export async function updateStockAction(
  formData: FormData
) {
  await requireAdmin();

  const returnTo =
    getReturnTo(formData);

  const productId = readFormText(
    formData,
    "productId"
  );

  const stock = parseStock(
    readFormText(formData, "stock")
  );

  if (!productId) {
    redirectWithMessage(
      returnTo,
      "error",
      "Produto não identificado."
    );
  }

  if (stock === null) {
    redirectWithMessage(
      returnTo,
      "error",
      `Informe uma quantidade inteira entre 0 e ${MAX_STOCK}.`
    );
  }

  let product:
    | {
        slug: string;
      }
    | null = null;

  try {
    product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },

        select: {
          slug: true,
        },
      });
  } catch (error) {
    console.error(
      "Erro ao localizar produto:",
      error
    );

    redirectWithMessage(
      returnTo,
      "error",
      "Não foi possível localizar o produto."
    );
  }

  if (!product) {
    redirectWithMessage(
      returnTo,
      "error",
      "Produto não encontrado."
    );
  }

  try {
    await prisma.product.update({
      where: {
        id: productId,
      },

      data: {
        stock,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao atualizar estoque:",
      error
    );

    redirectWithMessage(
      returnTo,
      "error",
      "Não foi possível atualizar o estoque."
    );
  }

  revalidateStockPages(product.slug);

  redirectWithMessage(
    returnTo,
    "success",
    "Estoque atualizado com sucesso."
  );
}

export async function adjustStockAction(
  formData: FormData
) {
  await requireAdmin();

  const returnTo =
    getReturnTo(formData);

  const productId = readFormText(
    formData,
    "productId"
  );

  const adjustment = Number(
    readFormText(
      formData,
      "adjustment"
    )
  );

  if (!productId) {
    redirectWithMessage(
      returnTo,
      "error",
      "Produto não identificado."
    );
  }

  if (
    adjustment !== -1 &&
    adjustment !== 1
  ) {
    redirectWithMessage(
      returnTo,
      "error",
      "Ajuste de estoque inválido."
    );
  }

  let product:
    | {
        slug: string;
        stock: number;
      }
    | null = null;

  try {
    product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },

        select: {
          slug: true,
          stock: true,
        },
      });
  } catch (error) {
    console.error(
      "Erro ao localizar produto:",
      error
    );

    redirectWithMessage(
      returnTo,
      "error",
      "Não foi possível localizar o produto."
    );
  }

  if (!product) {
    redirectWithMessage(
      returnTo,
      "error",
      "Produto não encontrado."
    );
  }

  const nextStock = Math.min(
    MAX_STOCK,
    Math.max(
      0,
      product.stock + adjustment
    )
  );

  try {
    await prisma.product.update({
      where: {
        id: productId,
      },

      data: {
        stock: nextStock,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao ajustar estoque:",
      error
    );

    redirectWithMessage(
      returnTo,
      "error",
      "Não foi possível ajustar o estoque."
    );
  }

  revalidateStockPages(product.slug);

  redirectWithMessage(
    returnTo,
    "success",
    `Estoque ajustado para ${nextStock}.`
  );
}
