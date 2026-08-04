"use client";

import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { deleteOrderAction } from "@/app/admin/pedidos/actions";

type DeleteOrderButtonProps = {
  orderId: string;
  orderNumber: number;
};

export function DeleteOrderButton({
  orderId,
  orderNumber,
}: DeleteOrderButtonProps) {
  const [isConfirming, setIsConfirming] =
    useState(false);

  if (!isConfirming) {
    return (
      <button
        type="button"
        onClick={() =>
          setIsConfirming(true)
        }
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 font-bold text-red-400 transition hover:border-red-500/50 hover:bg-red-500/20"
      >
        <Trash2 size={18} />
        Excluir pedido
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={22}
          className="mt-0.5 shrink-0 text-red-400"
        />

        <div>
          <p className="font-bold text-red-300">
            Excluir o pedido #
            {orderNumber}?
          </p>

          <p className="mt-1 text-sm leading-6 text-red-200/70">
            O pedido e todos os produtos
            registrados nele serão removidos
            definitivamente. Essa ação não
            poderá ser desfeita.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            setIsConfirming(false)
          }
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-black px-4 text-sm font-bold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
        >
          <X size={17} />
          Não excluir
        </button>

        <form
          action={deleteOrderAction}
          className="flex-1"
        >
          <input
            type="hidden"
            name="orderId"
            value={orderId}
          />

          <ConfirmDeleteButton />
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 text-sm font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Trash2 size={17} />

      {pending
        ? "Excluindo..."
        : "Sim, excluir definitivamente"}
    </button>
  );
}