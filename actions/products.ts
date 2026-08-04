"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import { deleteProductImage } from "@/lib/storage";

export type ProductActionState = {
  success: boolean;
  message: string;
};

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePrice(value: string) {
  const normalizedValue = value.includes(",")
    ? value.replace(/\./g, "").replace(",", ".")
    : value;

  const price = Number(normalizedValue);

  if (!Number.isFinite(price) || price <= 0) {
    return null;
  }

  return price;
}

function parseStock(value: string) {
  const stock = Number(value);

  if (!Number.isInteger(stock) || stock < 0) {
    return null;
  }

  return stock;
}

async function createUniqueSlug(
  title: string,
  currentProductId?: string
) {
  const baseSlug = createSlug(title) || "produto";

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existingProduct = await prisma.product.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (
      !existingProduct ||
      existingProduct.id === currentProductId
    ) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

function getProductFormData(formData: FormData) {
  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const consoleName = String(
    formData.get("console") ?? ""
  ).trim();

  const condition = String(
    formData.get("condition") ?? ""
  ).trim();

  const categoryId = String(
    formData.get("categoryId") ?? ""
  ).trim();

  const priceValue = String(
    formData.get("price") ?? ""
  ).trim();

  const stockValue = String(
    formData.get("stock") ?? ""
  ).trim();

  return {
    title,
    description,
    consoleName,
    condition,
    categoryId,
    price: parsePrice(priceValue),
    stock: parseStock(stockValue),
    hasBox: formData.get("hasBox") === "on",
    hasManual: formData.get("hasManual") === "on",
    featured: formData.get("featured") === "on",
    rarity: formData.get("rarity") === "on",
  };
}

function validateProductData(
  productData: ReturnType<typeof getProductFormData>
) {
  if (productData.title.length < 2) {
    return "Digite um nome válido para o produto.";
  }

  if (productData.description.length < 5) {
    return "Digite uma descrição mais completa.";
  }

  if (!productData.consoleName) {
    return "Informe o console ou a plataforma.";
  }

  if (!productData.condition) {
    return "Informe o estado de conservação.";
  }

  if (!productData.categoryId) {
    return "Selecione uma categoria.";
  }

  if (productData.price === null) {
    return "Informe um preço válido e maior que zero.";
  }

  if (productData.stock === null) {
    return "Informe uma quantidade válida para o estoque.";
  }

  return null;
}

export async function createProductAction(
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  await requireAdmin();

  const productData = getProductFormData(formData);
  const validationError = validateProductData(productData);

  if (validationError) {
    return {
      success: false,
      message: validationError,
    };
  }

  let createdProductSlug = "";

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: productData.categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      return {
        success: false,
        message: "A categoria selecionada não existe.",
      };
    }

    const slug = await createUniqueSlug(
      productData.title
    );

    const product = await prisma.product.create({
      data: {
        title: productData.title,
        slug,
        description: productData.description,
        price: productData.price!,
        console: productData.consoleName,
        condition: productData.condition,
        stock: productData.stock!,
        hasBox: productData.hasBox,
        hasManual: productData.hasManual,
        featured: productData.featured,
        rarity: productData.rarity,
        categoryId: productData.categoryId,
      },
      select: {
        slug: true,
      },
    });

    createdProductSlug = product.slug;
  } catch (error) {
    console.error(
      "Erro ao cadastrar produto:",
      error
    );

    return {
      success: false,
      message:
        "Não foi possível cadastrar o produto. Tente novamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/admin/produtos");

  redirect(
    `/admin/produtos/${createdProductSlug}/imagens`
  );
}

export async function updateProductAction(
  productId: string,
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  await requireAdmin();

  const normalizedProductId = productId.trim();

  if (!normalizedProductId) {
    return {
      success: false,
      message: "Produto não identificado.",
    };
  }

  const productData = getProductFormData(formData);
  const validationError = validateProductData(productData);

  if (validationError) {
    return {
      success: false,
      message: validationError,
    };
  }

  let oldSlug = "";
  let newSlug = "";

  try {
    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: normalizedProductId,
        },
        select: {
          id: true,
          slug: true,
        },
      });

    if (!existingProduct) {
      return {
        success: false,
        message: "Produto não encontrado.",
      };
    }

    const category = await prisma.category.findUnique({
      where: {
        id: productData.categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      return {
        success: false,
        message: "A categoria selecionada não existe.",
      };
    }

    const slug = await createUniqueSlug(
      productData.title,
      normalizedProductId
    );

    await prisma.product.update({
      where: {
        id: normalizedProductId,
      },
      data: {
        title: productData.title,
        slug,
        description: productData.description,
        price: productData.price!,
        console: productData.consoleName,
        condition: productData.condition,
        stock: productData.stock!,
        hasBox: productData.hasBox,
        hasManual: productData.hasManual,
        featured: productData.featured,
        rarity: productData.rarity,
        categoryId: productData.categoryId,
      },
    });

    oldSlug = existingProduct.slug;
    newSlug = slug;
  } catch (error) {
    console.error(
      "Erro ao atualizar produto:",
      error
    );

    return {
      success: false,
      message:
        "Não foi possível atualizar o produto. Tente novamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/admin/produtos");
  revalidatePath(`/produto/${oldSlug}`);
  revalidatePath(`/produto/${newSlug}`);

  redirect("/admin/produtos");
}

export async function deleteProductAction(
  productIdOrFormData: string | FormData,
  receivedFormData?: FormData
): Promise<void> {
  await requireAdmin();

  let productId = "";

  if (typeof productIdOrFormData === "string") {
    productId = productIdOrFormData.trim();
  } else {
    productId = String(
      productIdOrFormData.get("productId") ??
        productIdOrFormData.get("id") ??
        ""
    ).trim();
  }

  if (!productId && receivedFormData) {
    productId = String(
      receivedFormData.get("productId") ??
        receivedFormData.get("id") ??
        ""
    ).trim();
  }

  if (!productId) {
    return;
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        slug: true,
        images: {
          select: {
            storagePath: true,
          },
        },
      },
    });

    if (!product) {
      return;
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    await Promise.allSettled(
      product.images.map((image) =>
        deleteProductImage(image.storagePath)
      )
    );

    revalidatePath("/");
    revalidatePath("/catalogo");
    revalidatePath("/admin/produtos");
    revalidatePath(`/produto/${product.slug}`);
  } catch (error) {
    console.error(
      "Erro ao excluir produto:",
      error
    );

    throw new Error(
      "Não foi possível excluir o produto."
    );
  }
}