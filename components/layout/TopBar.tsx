import { Clock3, MapPin, Phone } from "lucide-react";

export function TopBar() {
  return (
    <div className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-2 text-xs text-zinc-400">

        <div className="flex items-center gap-5">

          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-yellow-400" />
            <span>Jabaquara • São Paulo</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Clock3 size={14} className="text-yellow-400" />
            <span>Seg a Sáb</span>
          </div>

        </div>

        <div className="flex items-center gap-2">
          <Phone size={14} className="text-yellow-400" />
          <span>(11) 96222-2045</span>
        </div>

      </div>
    </div>
  );
}