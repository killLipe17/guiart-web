import {
  Clock3,
  MapPin,
  Phone,
} from "lucide-react";

type TopBarProps = {
  addressReference: string;
  businessHours: string;
  whatsappDisplay: string;
  whatsappUrl: string;
};

export function TopBar({
  addressReference,
  businessHours,
  whatsappDisplay,
  whatsappUrl,
}: TopBarProps) {
  const locationText =
    addressReference.trim() ||
    "Loja física";

  const hoursText =
    businessHours
      .replace(/\s*\n+\s*/g, " • ")
      .trim();

  return (
    <div className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs text-zinc-400 sm:px-6">
        <div className="flex min-w-0 items-center gap-5">
          <div className="flex min-w-0 items-center gap-2">
            <MapPin
              size={14}
              className="shrink-0 text-yellow-400"
            />

            <span className="truncate">
              {locationText}
            </span>
          </div>

          {hoursText && (
            <div className="hidden items-center gap-2 md:flex">
              <Clock3
                size={14}
                className="shrink-0 text-yellow-400"
              />

              <span>
                {hoursText}
              </span>
            </div>
          )}
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 transition hover:text-yellow-400"
        >
          <Phone
            size={14}
            className="text-yellow-400"
          />

          <span>
            {whatsappDisplay}
          </span>
        </a>
      </div>
    </div>
  );
}
