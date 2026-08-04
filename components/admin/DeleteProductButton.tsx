"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";

import { deleteProductAction } from "@/actions/products";

type DeleteProductButtonProps = {
  productId: string;
  productTitle: string;
};

export function DeleteProductButton({
  productId,
  productTitle,
}: DeleteProductButtonProps) {
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${productTitle}"?\n\nAs imagens desse produto também serão excluídas.`
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form
      action={deleteProductAction}
      onSubmit={handleSubmit}
      className="mt-3"
    >
      <input
        type="hidden"
        name="productId"
        value={productId}
      />

      <DeleteButton />
    </form>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2
            size={16}
            className="animate-spin"
          />
          Excluindo...
        </>
      ) : (
        <>
          <Trash2 size={16} />
          Excluir produto
        </>
      )}
    </button>
  );
}