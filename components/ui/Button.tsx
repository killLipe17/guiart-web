import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base = `
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-xl
    px-6
    py-3
    font-semibold
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-1
    focus:outline-none
    focus:ring-2
    focus:ring-red-500
    focus:ring-offset-2
    focus:ring-offset-zinc-950
    disabled:opacity-50
    disabled:cursor-not-allowed
  `;

  const variants = {
    primary:
      "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20 hover:shadow-red-500/40",

    secondary:
      "border border-zinc-700 text-white hover:border-red-500",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}