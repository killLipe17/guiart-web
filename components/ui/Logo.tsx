import Image from "next/image";

type LogoProps = {
  className?: string;
  priority?: boolean;
  variant?: "color" | "white" | "mascot";
};

export function Logo({
  className = "",
  priority = true,
  variant = "color",
}: LogoProps) {
  if (variant === "white") {
    return (
      <span
        className={[
          "relative block h-16 w-52 shrink-0",
          className,
        ].join(" ")}
      >
        <Image
          src="/brand/logo-guiart-branca.png"
          alt="Guiart Games e Colecionáveis"
          fill
          priority={priority}
          unoptimized
          sizes="208px"
          className="object-contain object-left"
        />
      </span>
    );
  }

  const mascotBadge = (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-yellow-300/35 bg-[#f7f7f2] shadow-[2px_2px_0_rgba(109,40,217,0.75)]">
      <Image
        src="/brand/favicon-guiart.png"
        alt="Mascote da Guiart Games"
        fill
        priority={priority}
        unoptimized
        sizes="48px"
        className="object-contain p-1.5"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </span>
  );

  if (variant === "mascot") {
    return (
      <span className={className}>
        {mascotBadge}
      </span>
    );
  }

  return (
    <span
      className={[
        "flex h-16 shrink-0 items-center gap-2",
        className,
      ].join(" ")}
    >
      <span className="min-w-0 leading-none">
        <span
          className="block text-[25px] font-black uppercase tracking-[0.08em] text-yellow-400 sm:text-[28px]"
          style={{
            textShadow:
              "2px 2px 0 #6d28d9",
          }}
        >
          GUIART
        </span>

        <span className="mt-1 block whitespace-nowrap text-[7px] font-black uppercase tracking-[0.14em] text-white sm:text-[8px]">
          Games e Colecionáveis
        </span>
      </span>

      {mascotBadge}
    </span>
  );
}