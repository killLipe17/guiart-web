"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import {
  createProductImageUploadTicket,
  deleteProductImage,
  getProductImagePublicUrl,
  productImageExists,
  validateProductImage,
} from "@/lib/storage";

type PrepareUploadInput = {
  productId: string;
  fileName: string;
  contentType: string;
  size: number;
};

export type PrepareUploadResult =
  | {
      success: true;
      bucketName: string;
      storagePath: string;
      token: string;
    }
  | {
      success: false;
      message: string;
    };

type RegisterImageInput = {
  productId: string;
  storagePath: string;
  alt: string;
};

export type RegisterImageResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

export async function prepareProductImageUploadAction(
  input: PrepareUploadInput
): Promise<PrepareUploadResult> {
  await requireAdmin();

  const productId =
    String(
      input?.productId ?? ""
    ).trim();

  const fileName =
    String(
      input?.fileName ?? ""
    ).trim();

  const contentType =
    String(
      input?.contentType ?? ""
    ).trim();

  const size =
    Number(input?.size ?? 0);

  if (!productId) {
    return {
      success: false,
      message:
        "Produto não identificado.",
    };
  }

  if (!fileName) {
    return {
      success: false,
      message:
        "Nome da imagem não informado.",
    };
  }

  try {
    validateProductImage({
      size,
      contentType,
    });
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Imagem inválida.",
    };
  }

  const product =
    await prisma.product.findUnique({
      where: {
        id: productId,
      },

      select: {
        id: true,
      },
    });

  if (!product) {
    return {
      success: false,
      message:
        "Produto não encontrado.",
    };
  }

  try {
    const ticket =
      await createProductImageUploadTicket({
        productId:
          product.id,
        fileName,
        contentType,
      });

    return {
      success: true,
      ...ticket,
    };
  } catch (error) {
    console.error(
      "Erro ao preparar upload de imagem:",
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível preparar o envio.",
    };
  }
}

export async function registerProductImageAction(
  input: RegisterImageInput
): Promise<RegisterImageResult> {
  await requireAdmin();

  const productId =
    String(
      input?.productId ?? ""
    ).trim();

  const storagePath =
    String(
      input?.storagePath ?? ""
    ).trim();

  const alt =
    String(
      input?.alt ?? ""
    )
      .trim()
      .slice(0, 250);

  if (
    !productId ||
    !storagePath
  ) {
    return {
      success: false,
      message:
        "Dados da imagem incompletos.",
    };
  }

  if (
    !storagePath.startsWith(
      `${productId}/`
    )
  ) {
    return {
      success: false,
      message:
        "O caminho da imagem é inválido.",
    };
  }

  const product =
    await prisma.product.findUnique({
      where: {
        id: productId,
      },

      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

  if (!product) {
    return {
      success: false,
      message:
        "Produto não encontrado.",
    };
  }

  const existingImage =
    await prisma.productImage.findUnique({
      where: {
        storagePath,
      },

      select: {
        id: true,
        productId: true,
      },
    });

  if (existingImage) {
    if (
      existingImage.productId ===
      product.id
    ) {
      return {
        success: true,
        message:
          "Imagem já cadastrada.",
      };
    }

    return {
      success: false,
      message:
        "Essa imagem já pertence a outro produto.",
    };
  }

  try {
    const existsInStorage =
      await productImageExists(
        storagePath
      );

    if (!existsInStorage) {
      return {
        success: false,
        message:
          "O arquivo não foi encontrado no Storage.",
      };
    }

    const imageCount =
      await prisma.productImage.count({
        where: {
          productId:
            product.id,
        },
      });

    await prisma.productImage.create({
      data: {
        productId:
          product.id,
        url:
          getProductImagePublicUrl(
            storagePath
          ),
        storagePath,
        alt:
          alt ||
          product.title,
        order: imageCount,
        isCover:
          imageCount === 0,
      },
    });

    revalidateProductImagePaths(
      product.slug
    );

    return {
      success: true,
      message:
        "Imagem cadastrada com sucesso.",
    };
  } catch (error) {
    console.error(
      "Erro ao cadastrar imagem enviada:",
      error
    );

    try {
      await deleteProductImage(
        storagePath
      );
    } catch (cleanupError) {
      console.error(
        "Erro ao remover imagem após falha no cadastro:",
        cleanupError
      );
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar a imagem.",
    };
  }
}

export async function setProductImageCoverAction(
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const imageId =
    String(
      formData.get(
        "imageId"
      ) ?? ""
    ).trim();

  const productId =
    String(
      formData.get(
        "productId"
      ) ?? ""
    ).trim();

  if (
    !imageId ||
    !productId
  ) {
    return;
  }

  try {
    const image =
      await prisma.productImage.findFirst({
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

    revalidateProductImagePaths(
      image.product.slug
    );
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

  const imageId =
    String(
      formData.get(
        "imageId"
      ) ?? ""
    ).trim();

  const productId =
    String(
      formData.get(
        "productId"
      ) ?? ""
    ).trim();

  if (
    !imageId ||
    !productId
  ) {
    return;
  }

  try {
    const image =
      await prisma.productImage.findFirst({
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
              createdAt:
                "asc",
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
      await deleteProductImage(
        image.storagePath
      );
    } catch (storageError) {
      console.error(
        "Imagem removida do banco, mas ocorreu um erro no Storage:",
        storageError
      );
    }

    revalidateProductImagePaths(
      image.product.slug
    );
  } catch (error) {
    console.error(
      "Erro ao excluir imagem:",
      error
    );

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
  revalidatePath(
    "/admin/produtos"
  );

  revalidatePath(
    `/admin/produtos/${productSlug}/imagens`
  );

  revalidatePath(
    `/produto/${productSlug}`
  );
}
