"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

const CATEGORY_NAME_MAX_LENGTH = 60;

function readFormText(
  formData: FormData,
  field: string
) {
  return String(
    formData.get(field) ?? ""
  );
}

function normalizeCategoryName(
  value: string
) {
  return value
    .trim()
    .replace(/\s+/g, " ");
}

function redirectToCategories(
  type: "success" | "error",
  message: string
): never {
  const searchParams =
    new URLSearchParams({
      [type]: message,
    });

  redirect(
    `/admin/categorias?${searchParams.toString()}`
  );
}

function revalidateCategoryPages() {
  revalidatePath("/admin");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
  revalidatePath("/admin/produtos/novo");
  revalidatePath("/catalogo");
}

export async function createCategoryAction(
  formData: FormData
) {
  await requireAdmin();

  const name = normalizeCategoryName(
    readFormText(formData, "name")
  );

  if (name.length < 2) {
    redirectToCategories(
      "error",
      "O nome da categoria precisa ter pelo menos 2 caracteres."
    );
  }

  if (
    name.length >
    CATEGORY_NAME_MAX_LENGTH
  ) {
    redirectToCategories(
      "error",
      `O nome da categoria pode ter no máximo ${CATEGORY_NAME_MAX_LENGTH} caracteres.`
    );
  }

  const existingCategory =
    await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },

      select: {
        id: true,
      },
    });

  if (existingCategory) {
    redirectToCategories(
      "error",
      "Já existe uma categoria com esse nome."
    );
  }

  try {
    await prisma.category.create({
      data: {
        name,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao criar categoria:",
      error
    );

    redirectToCategories(
      "error",
      "Não foi possível criar a categoria."
    );
  }

  revalidateCategoryPages();

  redirectToCategories(
    "success",
    "Categoria criada com sucesso."
  );
}

export async function updateCategoryAction(
  formData: FormData
) {
  await requireAdmin();

  const categoryId = readFormText(
    formData,
    "categoryId"
  ).trim();

  const name = normalizeCategoryName(
    readFormText(formData, "name")
  );

  if (!categoryId) {
    redirectToCategories(
      "error",
      "Categoria inválida."
    );
  }

  if (name.length < 2) {
    redirectToCategories(
      "error",
      "O nome da categoria precisa ter pelo menos 2 caracteres."
    );
  }

  if (
    name.length >
    CATEGORY_NAME_MAX_LENGTH
  ) {
    redirectToCategories(
      "error",
      `O nome da categoria pode ter no máximo ${CATEGORY_NAME_MAX_LENGTH} caracteres.`
    );
  }

  const category =
    await prisma.category.findUnique({
      where: {
        id: categoryId,
      },

      select: {
        id: true,
        name: true,
      },
    });

  if (!category) {
    redirectToCategories(
      "error",
      "Categoria não encontrada."
    );
  }

  const duplicatedCategory =
    await prisma.category.findFirst({
      where: {
        id: {
          not: categoryId,
        },

        name: {
          equals: name,
          mode: "insensitive",
        },
      },

      select: {
        id: true,
      },
    });

  if (duplicatedCategory) {
    redirectToCategories(
      "error",
      "Já existe outra categoria com esse nome."
    );
  }

  try {
    await prisma.category.update({
      where: {
        id: categoryId,
      },

      data: {
        name,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao atualizar categoria:",
      error
    );

    redirectToCategories(
      "error",
      "Não foi possível atualizar a categoria."
    );
  }

  revalidateCategoryPages();

  redirectToCategories(
    "success",
    "Categoria atualizada com sucesso."
  );
}

export async function deleteCategoryAction(
  formData: FormData
) {
  await requireAdmin();

  const categoryId = readFormText(
    formData,
    "categoryId"
  ).trim();

  if (!categoryId) {
    redirectToCategories(
      "error",
      "Categoria inválida."
    );
  }

  const category =
    await prisma.category.findUnique({
      where: {
        id: categoryId,
      },

      select: {
        id: true,
        name: true,

        _count: {
          select: {
            products: true,
          },
        },
      },
    });

  if (!category) {
    redirectToCategories(
      "error",
      "Categoria não encontrada."
    );
  }

  if (category._count.products > 0) {
    redirectToCategories(
      "error",
      "Essa categoria possui produtos vinculados e não pode ser excluída."
    );
  }

  try {
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao excluir categoria:",
      error
    );

    redirectToCategories(
      "error",
      "Não foi possível excluir a categoria."
    );
  }

  revalidateCategoryPages();

  redirectToCategories(
    "success",
    "Categoria excluída com sucesso."
  );
}