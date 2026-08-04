"use client";

import { MessageCircle } from "lucide-react";

import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { CartProduct } from "@/components/cart/CartProvider";
import { FavoriteButton } from "@/components/product/FavoriteButton";

type ProductPurchaseActionsProps = {
  product: CartProduct;
  whatsappUrl: string;
};

export function ProductPurchaseActions({
  product,
  whatsappUrl,
}: ProductPurchaseActionsProps) {
  const isAvailable = product.stock > 0;

  return (
    <>
      <div className="mt-6 flex gap-3">
        {isAvailable ? (
          <AddToCartButton product={product} />
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex min-h-12 flex-1 cursor-not-allowed items-center justify-center rounded-xl bg-zinc-800 px-5 py-3 font-bold text-zinc-500"
          >
            Produto indisponível
          </button>
        )}

        <FavoriteButton productId={product.id} />
      </div>

      {isAvailable && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
        >
          <MessageCircle size={19} />
          Comprar somente este produto
        </a>
      )}
    </>
  );
}