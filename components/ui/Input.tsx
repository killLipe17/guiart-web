type InputProps = {
  placeholder?: string;
  className?: string;
};

export function Input({
  placeholder,
  className = "",
}: InputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-yellow-400 ${className}`}
    />
  );
}