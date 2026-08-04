"use client";

import {
  Check,
  ShoppingCart,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  type CartProduct,
  useCart,
} from "@/components/cart/CartProvider";

type AddToCartButtonProps = {
  product: CartProduct;
};

export function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  const [added, setAdded] = useState(false);

  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleAddToCart() {
    addItem(product, 1);
    setAdded(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
    >
      {added ? (
        <>
          <Check size={20} />
          Adicionado
        </>
      ) : (
        <>
          <ShoppingCart size={20} />
          Adicionar ao carrinho
        </>
      )}
    </button>
  );
}