"use client";

import {
  LockKeyhole,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { deleteCategoryAction } from "@/app/admin/categorias/actions";

type DeleteCategoryButtonProps = {
  categoryId: string;
  categoryName: string;
  productCount: number;
};

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  productCount,
}: DeleteCategoryButtonProps) {
  const [isConfirming, setIsConfirming] =
    useState(false);

  if (productCount > 0) {
    return (
      <button
        type="button"
        disabled
        title="A categoria possui produtos vinculados"
        className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-700"
      >
        <LockKeyhole size={17} />
        Em uso
      </button>
    );
  }

  return (
    <form
      action={deleteCategoryAction}
      className="shrink-0"
    >
      <input
        type="hidden"
        name="categoryId"
        value={categoryId}
      />

      {!isConfirming ? (
        <button
          type="button"
          onClick={() =>
            setIsConfirming(true)
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 text-sm font-bold text-red-400 transition hover:bg-red-500/20"
        >
          <Trash2 size={17} />
          Excluir
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setIsConfirming(false)
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-600"
          >
            <X size={17} />
            Cancelar
          </button>

          <ConfirmDeleteButton
            categoryName={categoryName}
          />
        </div>
      )}
    </form>
  );
}

type ConfirmDeleteButtonProps = {
  categoryName: string;
};

function ConfirmDeleteButton({
  categoryName,
}: ConfirmDeleteButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title={`Excluir a categoria ${categoryName}`}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 text-sm font-black text-white transition hover:bg-red-400 disabled:cursor-wait disabled:opacity-60"
    >
      <Trash2 size={17} />

      {pending
        ? "Excluindo..."
        : "Confirmar"}
    </button>
  );
}