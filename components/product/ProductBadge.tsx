type ProductBadgeProps = {
  text: string;
};

export function ProductBadge({
  text,
}: ProductBadgeProps) {
  return (
    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
      {text}
    </span>
  );
}