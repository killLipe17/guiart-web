"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import {
  deleteProductImage,
  uploadProductImage,
} from "@/lib/storage";

export type ProductImageActionState = {
  success: boolean;
  message: string;
};

export async function createProductImageAction(
  _previousState: ProductImageActionState,
  formData: FormData
): Promise<ProductImageActionState> {
  await requireAdmin();

  const productId = String(
    formData.get("productId") ?? ""
  ).trim();

  const alt = String(formData.get("alt") ?? "").trim();

  const file = formData.get("file");

  if (!productId) {
    return {
      success: false,
      message: "Produto não identificado.",
    };
  }

  if (!(file instanceof File) || file.size === 0) {
    return {
      success: false,
      message: "Selecione uma imagem para enviar.",
    };
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      _count: {
        select: {
          images: true,
        },
      },
    },
  });

  if (!product) {
    return {
      success: false,
      message: "Produto não encontrado.",
    };
  }

  let uploadedStoragePath: string | null = null;

  try {
    const uploadedImage = await uploadProductImage({
      file,
      productId: product.id,
    });

    uploadedStoragePath = uploadedImage.storagePath;

    const imageCount = product._count.images;

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: uploadedImage.url,
        storagePath: uploadedImage.storagePath,
        alt: alt || product.title,
        order: imageCount,
        isCover: imageCount === 0,
      },
    });

    revalidateProductImagePaths(product.slug);

    return {
      success: true,
      message: "Imagem enviada com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao enviar imagem:", error);

    if (uploadedStoragePath) {
      try {
        await deleteProductImage(uploadedStoragePath);
      } catch (cleanupError) {
        console.error(
          "Erro ao remover upload incompleto:",
          cleanupError
        );
      }
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a imagem.",
    };
  }
}

export async function setProductImageCoverAction(
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const imageId = String(
    formData.get("imageId") ?? ""
  ).trim();

  const productId = String(
    formData.get("productId") ?? ""
  ).trim();

  if (!imageId || !productId) {
    return;
  }

  try {
    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
      select: {
        id: true,
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!image) {
      return;
    }

    await prisma.$transaction([
      prisma.productImage.updateMany({
        where: {
          productId,
          isCover: true,
        },
        data: {
          isCover: false,
        },
      }),

      prisma.productImage.update({
        where: {
          id: imageId,
        },
        data: {
          isCover: true,
        },
      }),
    ]);

    revalidateProductImagePaths(image.product.slug);
  } catch (error) {
    console.error(
      "Erro ao definir imagem de capa:",
      error
    );

    throw new Error(
      "Não foi possível definir a imagem como capa."
    );
  }
}

export async function deleteProductImageAction(
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const imageId = String(
    formData.get("imageId") ?? ""
  ).trim();

  const productId = String(
    formData.get("productId") ?? ""
  ).trim();

  if (!imageId || !productId) {
    return;
  }

  try {
    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
      select: {
        id: true,
        storagePath: true,
        isCover: true,
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!image) {
      return;
    }

    await prisma.productImage.delete({
      where: {
        id: image.id,
      },
    });

    if (image.isCover) {
      const nextImage =
        await prisma.productImage.findFirst({
          where: {
            productId,
          },
          orderBy: [
            {
              order: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
          select: {
            id: true,
          },
        });

      if (nextImage) {
        await prisma.productImage.update({
          where: {
            id: nextImage.id,
          },
          data: {
            isCover: true,
          },
        });
      }
    }

    try {
      await deleteProductImage(image.storagePath);
    } catch (storageError) {
      console.error(
        "Imagem removida do banco, mas ocorreu um erro no Storage:",
        storageError
      );
    }

    revalidateProductImagePaths(image.product.slug);
  } catch (error) {
    console.error("Erro ao excluir imagem:", error);

    throw new Error(
      "Não foi possível excluir a imagem."
    );
  }
}

function revalidateProductImagePaths(
  productSlug: string
) {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/admin/produtos");

  revalidatePath(
    `/admin/produtos/${productSlug}/imagens`
  );

  revalidatePath(`/produto/${productSlug}`);
}