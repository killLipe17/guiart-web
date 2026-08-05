import "server-only";

import { randomUUID } from "crypto";

import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET_NAME =
  process.env
    .SUPABASE_STORAGE_BUCKET ??
  "products";

export const MAX_PRODUCT_IMAGE_BYTES =
  6 * 1024 * 1024;

export const ALLOWED_PRODUCT_IMAGE_TYPES =
  [
    "image/jpeg",
    "image/png",
    "image/webp",
  ] as const;

function sanitizeFileName(
  fileName: string
) {
  return fileName
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9.-]/g,
      "-"
    )
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFileExtension(
  contentType: string
) {
  if (contentType === "image/png") {
    return "png";
  }

  if (
    contentType === "image/webp"
  ) {
    return "webp";
  }

  return "jpg";
}

function buildStoragePath({
  productId,
  fileName,
  contentType,
}: {
  productId: string;
  fileName: string;
  contentType: string;
}) {
  const safeFileName =
    sanitizeFileName(fileName);

  const nameWithoutExtension =
    safeFileName
      .replace(/\.[^.]+$/, "")
      .slice(0, 80) || "produto";

  const extension =
    getFileExtension(contentType);

  return (
    `${productId}/` +
    `${randomUUID()}-` +
    `${nameWithoutExtension}.` +
    extension
  );
}

export function validateProductImage({
  size,
  contentType,
}: {
  size: number;
  contentType: string;
}) {
  if (
    !Number.isFinite(size) ||
    size <= 0
  ) {
    throw new Error(
      "A imagem selecionada está vazia."
    );
  }

  if (
    size >
    MAX_PRODUCT_IMAGE_BYTES
  ) {
    throw new Error(
      "A imagem otimizada deve ter no máximo 6 MB."
    );
  }

  if (
    !ALLOWED_PRODUCT_IMAGE_TYPES.includes(
      contentType as
        (typeof ALLOWED_PRODUCT_IMAGE_TYPES)[number]
    )
  ) {
    throw new Error(
      "Formato não aceito. Use JPG, PNG ou WEBP."
    );
  }
}

export async function createProductImageUploadTicket({
  productId,
  fileName,
  contentType,
}: {
  productId: string;
  fileName: string;
  contentType: string;
}) {
  const storagePath =
    buildStoragePath({
      productId,
      fileName,
      contentType,
    });

  const { data, error } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(
        storagePath
      );

  if (
    error ||
    !data?.token
  ) {
    throw new Error(
      `Não foi possível preparar o envio da imagem: ${
        error?.message ??
        "token não gerado"
      }`
    );
  }

  return {
    bucketName: BUCKET_NAME,
    storagePath,
    token: data.token,
  };
}

export async function productImageExists(
  storagePath: string
) {
  const lastSeparator =
    storagePath.lastIndexOf("/");

  if (lastSeparator < 1) {
    return false;
  }

  const folder =
    storagePath.slice(
      0,
      lastSeparator
    );

  const fileName =
    storagePath.slice(
      lastSeparator + 1
    );

  const { data, error } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        search: fileName,
      });

  if (error) {
    throw new Error(
      `Não foi possível confirmar o upload: ${error.message}`
    );
  }

  return data.some(
    (item) =>
      item.name === fileName
  );
}

export function getProductImagePublicUrl(
  storagePath: string
) {
  const { data } =
    supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

  return data.publicUrl;
}

type UploadProductImageParams = {
  file: File;
  productId: string;
};

export async function uploadProductImage({
  file,
  productId,
}: UploadProductImageParams) {
  if (
    !file ||
    file.size === 0
  ) {
    throw new Error(
      "Nenhuma imagem foi enviada."
    );
  }

  validateProductImage({
    size: file.size,
    contentType: file.type,
  });

  const storagePath =
    buildStoragePath({
      productId,
      fileName: file.name,
      contentType: file.type,
    });

  const arrayBuffer =
    await file.arrayBuffer();

  const buffer =
    Buffer.from(arrayBuffer);

  const { error } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(
        storagePath,
        buffer,
        {
          contentType:
            file.type,
          cacheControl: "3600",
          upsert: false,
        }
      );

  if (error) {
    throw new Error(
      `Erro ao enviar imagem: ${error.message}`
    );
  }

  return {
    url:
      getProductImagePublicUrl(
        storagePath
      ),
    storagePath,
  };
}

export async function deleteProductImage(
  storagePath: string
) {
  if (!storagePath) {
    return;
  }

  const { error } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

  if (error) {
    throw new Error(
      `Erro ao excluir imagem: ${error.message}`
    );
  }
}
