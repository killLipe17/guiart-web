import "server-only";

import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const STORE_SETTINGS_ID =
  "main";

export const DEFAULT_STORE_SETTINGS = {
  id: STORE_SETTINGS_ID,
  storeName:
    "Guiart Games e Colecionáveis",
  whatsappNumber: "5511962222045",
  whatsappDisplay: "(11) 96222-2045",
  instagramUrl:
    "https://www.instagram.com/guiart_games/",
  instagramHandle: "@guiart_games",
  tiktokUrl: "",
  tiktokHandle: "@Guiart_Games",
  address:
    "Rua dos Buritis, 54, Loja 9 - Jardim Oriental, São Paulo - SP, 04321-000",
  addressReference:
    "Próximo ao Metrô Jabaquara",
  businessHours:
    "Consulte o horário pelo WhatsApp",
  whatsappMessage:
    "Olá! Vim pelo site da Guiart Games.",
  pickupNotice:
    "Retirada disponível na loja física.",
};

async function loadStoreSettings() {
  const existingSettings =
    await prisma.storeSettings.findUnique({
      where: {
        id: STORE_SETTINGS_ID,
      },
    });

  if (existingSettings) {
    return existingSettings;
  }

  try {
    return await prisma.storeSettings.create({
      data: DEFAULT_STORE_SETTINGS,
    });
  } catch {
    return prisma.storeSettings.findUniqueOrThrow({
      where: {
        id: STORE_SETTINGS_ID,
      },
    });
  }
}

export const getStoreSettings =
  cache(loadStoreSettings);
