"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";

export function CartButton() {
  const {
    totalItems,
    isHydrated,
    openCart,
  } = useCart();

  const visibleTotal =
    totalItems > 99 ? "99+" : totalItems;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrinho com ${totalItems} itens`}
      className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-white transition hover:border-yellow-400 hover:text-yellow-400"
    >
      <ShoppingCart size={20} />

      {isHydrated && totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-black text-black">
          {visibleTotal}
        </span>
      )}
    </button>
  );
}