import { HeaderClient } from "@/components/layout/HeaderClient";
import { TopBar } from "@/components/layout/TopBar";
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
    <>
      <TopBar
        addressReference={
          settings.addressReference
        }
        businessHours={
          settings.businessHours
        }
        whatsappDisplay={
          settings.whatsappDisplay
        }
        whatsappUrl={whatsappUrl}
      />

      <HeaderClient
        whatsappUrl={whatsappUrl}
      />
    </>
  );
}
