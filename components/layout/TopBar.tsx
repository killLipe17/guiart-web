import {
  Clock3,
  MapPin,
  Phone,
} from "lucide-react";

import { getStoreSettings } from "@/lib/store-settings";

export async function TopBar() {
  const settings =
    await getStoreSettings();

  const whatsappUrl =
    `https://wa.me/${settings.whatsappNumber}` +
    `?text=${encodeURIComponent(
      settings.whatsappMessage
    )}`;

  const businessHours =
    settings.businessHours
      .replace(/\s*\n+\s*/g, " • ")
      .trim();

  return (
    <div className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-2 text-xs text-zinc-400">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <MapPin
              size={14}
              className="text-yellow-400"
            />

            <span>
              {settings.addressReference ||
                "Jabaquara • São Paulo"}
            </span>
          </div>

          {businessHours && (
            <div className="hidden items-center gap-2 md:flex">
              <Clock3
                size={14}
                className="text-yellow-400"
              />

              <span>
                {businessHours}
              </span>
            </div>
          )}
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition hover:text-yellow-400"
        >
          <Phone
            size={14}
            className="text-yellow-400"
          />

          <span>
            {settings.whatsappDisplay}
          </span>
        </a>
      </div>
    </div>
  );
}
