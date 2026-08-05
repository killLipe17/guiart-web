"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_STORE_SETTINGS,
  STORE_SETTINGS_ID,
} from "@/lib/store-settings";

const MAX_LENGTHS = {
  storeName: 100,
  whatsappDisplay: 40,
  instagramUrl: 300,
  instagramHandle: 60,
  tiktokUrl: 300,
  tiktokHandle: 60,
  address: 400,
  addressReference: 160,
  businessHours: 500,
  whatsappMessage: 800,
  pickupNotice: 500,
};

function readFormText(
  formData: FormData,
  field: string
) {
  return String(
    formData.get(field) ?? ""
  );
}

function normalizeSingleLine(
  value: string
) {
  return value
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeMultiline(
  value: string
) {
  return value
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n");
}

function normalizeWhatsappNumber(
  value: string
) {
  return value.replace(/\D/g, "");
}

function normalizeHandle(
  value: string
) {
  const normalized =
    value.trim().replace(/\s+/g, "");

  if (!normalized) {
    return "";
  }

  return normalized.startsWith("@")
    ? normalized
    : `@${normalized}`;
}

function normalizeOptionalUrl(
  value: string
) {
  const normalized = value.trim();

  if (!normalized) {
    return "";
  }

  try {
    const url = new URL(normalized);

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function redirectToSettings(
  type: "success" | "error",
  message: string
): never {
  const searchParams =
    new URLSearchParams({
      [type]: message,
    });

  redirect(
    `/admin/configuracoes?${searchParams.toString()}`
  );
}

function revalidateSettingsPages() {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/admin");
  revalidatePath("/admin/configuracoes");
}

export async function updateStoreSettingsAction(
  formData: FormData
) {
  await requireAdmin();

  const storeName = normalizeSingleLine(
    readFormText(formData, "storeName")
  );

  const whatsappNumber =
    normalizeWhatsappNumber(
      readFormText(
        formData,
        "whatsappNumber"
      )
    );

  const whatsappDisplay =
    normalizeSingleLine(
      readFormText(
        formData,
        "whatsappDisplay"
      )
    );

  const instagramUrl =
    normalizeOptionalUrl(
      readFormText(
        formData,
        "instagramUrl"
      )
    );

  const instagramHandle =
    normalizeHandle(
      readFormText(
        formData,
        "instagramHandle"
      )
    );

  const tiktokUrl =
    normalizeOptionalUrl(
      readFormText(
        formData,
        "tiktokUrl"
      )
    );

  const tiktokHandle =
    normalizeHandle(
      readFormText(
        formData,
        "tiktokHandle"
      )
    );

  const address = normalizeMultiline(
    readFormText(formData, "address")
  );

  const addressReference =
    normalizeSingleLine(
      readFormText(
        formData,
        "addressReference"
      )
    );

  const businessHours =
    normalizeMultiline(
      readFormText(
        formData,
        "businessHours"
      )
    );

  const whatsappMessage =
    normalizeMultiline(
      readFormText(
        formData,
        "whatsappMessage"
      )
    );

  const pickupNotice =
    normalizeMultiline(
      readFormText(
        formData,
        "pickupNotice"
      )
    );

  if (storeName.length < 2) {
    redirectToSettings(
      "error",
      "Informe um nome válido para a loja."
    );
  }

  if (
    storeName.length >
    MAX_LENGTHS.storeName
  ) {
    redirectToSettings(
      "error",
      `O nome da loja pode ter no máximo ${MAX_LENGTHS.storeName} caracteres.`
    );
  }

  if (
    whatsappNumber.length < 10 ||
    whatsappNumber.length > 15
  ) {
    redirectToSettings(
      "error",
      "Informe o WhatsApp com DDI, DDD e número. Exemplo: 5511962222045."
    );
  }

  if (!whatsappDisplay) {
    redirectToSettings(
      "error",
      "Informe como o WhatsApp deve aparecer no site."
    );
  }

  if (
    whatsappDisplay.length >
    MAX_LENGTHS.whatsappDisplay
  ) {
    redirectToSettings(
      "error",
      "O WhatsApp de exibição está muito longo."
    );
  }

  if (!instagramUrl) {
    redirectToSettings(
      "error",
      "Informe uma URL válida do Instagram."
    );
  }

  if (
    instagramUrl.length >
    MAX_LENGTHS.instagramUrl
  ) {
    redirectToSettings(
      "error",
      "A URL do Instagram está muito longa."
    );
  }

  if (!instagramHandle) {
    redirectToSettings(
      "error",
      "Informe o usuário do Instagram."
    );
  }

  if (
    instagramHandle.length >
    MAX_LENGTHS.instagramHandle
  ) {
    redirectToSettings(
      "error",
      "O usuário do Instagram está muito longo."
    );
  }

  if (tiktokUrl === null) {
    redirectToSettings(
      "error",
      "Informe uma URL válida do TikTok ou deixe o campo vazio."
    );
  }

  if (
    tiktokUrl.length >
    MAX_LENGTHS.tiktokUrl
  ) {
    redirectToSettings(
      "error",
      "A URL do TikTok está muito longa."
    );
  }

  if (
    tiktokHandle.length >
    MAX_LENGTHS.tiktokHandle
  ) {
    redirectToSettings(
      "error",
      "O usuário do TikTok está muito longo."
    );
  }

  if (address.length < 5) {
    redirectToSettings(
      "error",
      "Informe o endereço completo da loja."
    );
  }

  if (
    address.length >
    MAX_LENGTHS.address
  ) {
    redirectToSettings(
      "error",
      "O endereço está muito longo."
    );
  }

  if (
    addressReference.length >
    MAX_LENGTHS.addressReference
  ) {
    redirectToSettings(
      "error",
      "A referência do endereço está muito longa."
    );
  }

  if (
    businessHours.length >
    MAX_LENGTHS.businessHours
  ) {
    redirectToSettings(
      "error",
      "O horário de funcionamento está muito longo."
    );
  }

  if (
    whatsappMessage.length < 3 ||
    whatsappMessage.length >
      MAX_LENGTHS.whatsappMessage
  ) {
    redirectToSettings(
      "error",
      "Informe uma mensagem padrão válida para o WhatsApp."
    );
  }

  if (
    pickupNotice.length >
    MAX_LENGTHS.pickupNotice
  ) {
    redirectToSettings(
      "error",
      "O aviso de retirada está muito longo."
    );
  }

  try {
    await prisma.storeSettings.upsert({
      where: {
        id: STORE_SETTINGS_ID,
      },

      create: {
        ...DEFAULT_STORE_SETTINGS,
        storeName,
        whatsappNumber,
        whatsappDisplay,
        instagramUrl,
        instagramHandle,
        tiktokUrl,
        tiktokHandle,
        address,
        addressReference,
        businessHours,
        whatsappMessage,
        pickupNotice,
      },

      update: {
        storeName,
        whatsappNumber,
        whatsappDisplay,
        instagramUrl,
        instagramHandle,
        tiktokUrl,
        tiktokHandle,
        address,
        addressReference,
        businessHours,
        whatsappMessage,
        pickupNotice,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao atualizar configurações da loja:",
      error
    );

    redirectToSettings(
      "error",
      "Não foi possível salvar as configurações da loja."
    );
  }

  revalidateSettingsPages();

  redirectToSettings(
    "success",
    "Configurações salvas com sucesso."
  );
}
