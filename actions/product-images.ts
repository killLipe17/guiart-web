"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { deleteProductImage, uploadProductImage } from "@/lib/storage";

export type ProductImageActionState = {
  success: boolean;
  message: string;
};

export async function createProductImageAction(
  _previousState: ProductImageActionState,
  formData: FormData
): Promise<ProductImageActionState> {
  const productId = String(formData.get("productId") ?? "");
  const alt = String(formData.get("alt") ?? "").trim();
  const image = formData.get("image");

  if (!productId) {
    return {
      success: false,
      message: "Produto não informado.",
    };
  }

  if (!(image instanceof File) || image.size === 0) {
    return {
      success: false,
      message: "Selecione uma imagem.",
    };
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      images: {
        select: {
          isCover: true,
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

  let uploadedImage: { url: string; storagePath: string };

  try {
    uploadedImage = await uploadProductImage({
      file: image,
      productId: product.id,
    });
  } catch (error) {
    console.error("Erro no upload da imagem:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a imagem.",
    };
  }

  try {
    const lastImage = await prisma.productImage.findFirst({
      where: {
        productId: product.id,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const hasCover = product.images.some(
      (productImage) => productImage.isCover
    );

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: uploadedImage.url,
        storagePath: uploadedImage.storagePath,
        alt: alt || `${product.title} - Guiart Games`,
        order: (lastImage?.order ?? -1) + 1,
        isCover: !hasCover,
      },
    });
  } catch (error) {
    await deleteProductImage(uploadedImage.storagePath);
    console.error("Erro ao salvar imagem no banco:", error);
    return {
      success: false,
      message: "Não foi possível salvar a imagem no banco.",
    };
  }

  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath(`/produto/${product.slug}`);
  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${product.slug}/imagens`);

  return {
    success: true,
    message: "Imagem enviada com sucesso.",
  };
}

export async function setProductImageCoverAction(
  formData: FormData
): Promise<void> {
  const imageId = String(formData.get("imageId") ?? "");

  if (!imageId) {
    return;
  }

  const image = await prisma.productImage.findUnique({
    where: {
      id: imageId,
    },
    select: {
      id: true,
      productId: true,
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
        productId: image.productId,
      },
      data: {
        isCover: false,
      },
    }),
    prisma.productImage.update({
      where: {
        id: image.id,
      },
      data: {
        isCover: true,
      },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath(`/produto/${image.product.slug}`);
  revalidatePath(`/admin/produtos/${image.product.slug}/imagens`);
}

export async function deleteProductImageAction(
  formData: FormData
): Promise<void> {
  const imageId = String(formData.get("imageId") ?? "");

  if (!imageId) {
    return;
  }

  const image = await prisma.productImage.findUnique({
    where: {
      id: imageId,
    },
    select: {
      id: true,
      storagePath: true,
      isCover: true,
      productId: true,
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

  await prisma.$transaction(async (transaction) => {
    await transaction.productImage.delete({
      where: {
        id: image.id,
      },
    });

    if (image.isCover) {
      const nextImage = await transaction.productImage.findFirst({
        where: {
          productId: image.productId,
        },
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
        },
      });

      if (nextImage) {
        await transaction.productImage.update({
          where: {
            id: nextImage.id,
          },
          data: {
            isCover: true,
          },
        });
      }
    }
  });

  try {
    await deleteProductImage(image.storagePath);
  } catch (error) {
    console.error(
      "A imagem foi removida do banco, mas não do Storage:",
      error
    );
  }

  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath(`/produto/${image.product.slug}`);
  revalidatePath(`/admin/produtos/${image.product.slug}/imagens`);
}
