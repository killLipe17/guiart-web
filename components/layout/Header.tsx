import { HeaderClient } from "@/components/layout/HeaderClient";
import { getStoreSettings } from "@/lib/store-settings";

export async function Header() {
  const settings =
    await getStoreSettings();

  const whatsappUrl =
    `https://wa.me/${settings.whatsappNumber}` +
    `?text=${encodeURIComponent(
      settings.whatsappMessage
    )}`;

  return (
    <HeaderClient
      whatsappUrl={whatsappUrl}
    />
  );
}
