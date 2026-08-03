type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({
  title,
  subtitle,
}: SectionTitleProps) {
  return (
    <div className="mb-12">

      <span className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
        Guiart Games
      </span>

      <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 max-w-2xl text-zinc-400">
          {subtitle}
        </p>
      )}

    </div>
  );
}