type SectionTitleProps = {
  title: string;
  subtitle: string;
};

export function SectionTitle({
  title,
  subtitle,
}: SectionTitleProps) {
  return (
    <div className="mb-14 text-center">

      <span className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
        GUIART GAMES
      </span>

      <h2 className="mt-4 text-5xl font-black">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-400">
        {subtitle}
      </p>

    </div>
  );
}