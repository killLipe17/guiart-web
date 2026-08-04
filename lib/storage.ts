import "server-only";

import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET_NAME =
  process.env.SUPABASE_STORAGE_BUCKET ?? "products";

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
}

type UploadProductImageParams = {
  file: File;
  productId: string;
};

export async function uploadProductImage({
  file,
  productId,
}: UploadProductImageParams) {
  if (!file || file.size === 0) {
    throw new Error("Nenhuma imagem foi enviada.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("O arquivo enviado não é uma imagem.");
  }

  const maximumSize = 10 * 1024 * 1024;

  if (file.size > maximumSize) {
    throw new Error("A imagem deve ter no máximo 10 MB.");
  }

  const safeName = sanitizeFileName(file.name);
  const storagePath = `${productId}/${randomUUID()}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Erro ao enviar imagem: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  return {
    url: data.publicUrl,
    storagePath,
  };
}

export async function deleteProductImage(storagePath: string) {
  if (!storagePath) {
    return;
  }

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) {
    throw new Error(`Erro ao excluir imagem: ${error.message}`);
  }
}