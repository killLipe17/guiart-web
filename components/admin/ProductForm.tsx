"use client";

import { useActionState } from "react";
import {
  AlertCircle,
  Loader2,
  PackagePlus,
  Pencil,
  Save,
} from "lucide-react";

import {
  createProductAction,
  updateProductAction,
  type ProductActionState,
} from "@/actions/products";

type CategoryOption = {
  id: string;
  name: string;
};

export type ProductFormValues = {
  id: string;
  title: string;
  description: string;
  price: string;
  console: string;
  condition: string;
  stock: number;
  categoryId: string;
  hasBox: boolean;
  hasManual: boolean;
  featured: boolean;
  rarity: boolean;
};

type ProductFormProps = {
  categories: CategoryOption[];
  mode?: "create" | "edit";
  product?: ProductFormValues;
};

const initialState: ProductActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-60";

export function ProductForm({
  categories,
  mode = "create",
  product,
}: ProductFormProps) {
  const isEditing = mode === "edit";

  const boundUpdateProductAction = updateProductAction.bind(
    null,
    product?.id ?? ""
  );

  const selectedAction = isEditing
    ? boundUpdateProductAction
    : createProductAction;

  const [state, formAction, pending] = useActionState<
    ProductActionState,
    FormData
  >(selectedAction, initialState);

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-black">
          {isEditing ? (
            <Pencil size={22} />
          ) : (
            <PackagePlus size={22} />
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            {isEditing
              ? "Editar informações"
              : "Informações do produto"}
          </h2>

          <p className="text-sm text-zinc-500">
            {isEditing
              ? "Atualize os dados exibidos no catálogo."
              : "Preencha os dados usados no catálogo."}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-zinc-300"
          >
            Nome do produto
          </label>

          <input
            id="title"
            name="title"
            type="text"
            required
            disabled={pending}
            defaultValue={product?.title}
            placeholder="Ex.: Resident Evil 2"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="text-sm font-medium text-zinc-300"
          >
            Categoria
          </label>

          <select
            id="categoryId"
            name="categoryId"
            required
            disabled={pending}
            defaultValue={product?.categoryId ?? ""}
            className={inputClassName}
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="console"
            className="text-sm font-medium text-zinc-300"
          >
            Console ou plataforma
          </label>

          <input
            id="console"
            name="console"
            type="text"
            required
            disabled={pending}
            defaultValue={product?.console}
            placeholder="Ex.: PlayStation 2"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="text-sm font-medium text-zinc-300"
          >
            Preço
          </label>

          <input
            id="price"
            name="price"
            type="text"
            inputMode="decimal"
            required
            disabled={pending}
            defaultValue={product?.price}
            placeholder="199,90"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="stock"
            className="text-sm font-medium text-zinc-300"
          >
            Estoque
          </label>

          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            required
            disabled={pending}
            defaultValue={product?.stock ?? 1}
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="condition"
            className="text-sm font-medium text-zinc-300"
          >
            Estado de conservação
          </label>

          <select
            id="condition"
            name="condition"
            required
            disabled={pending}
            defaultValue={product?.condition ?? ""}
            className={inputClassName}
          >
            <option value="" disabled>
              Selecione o estado
            </option>

            <option value="Novo">Novo</option>
            <option value="Excelente">Excelente</option>
            <option value="Muito bom">Muito bom</option>
            <option value="Bom">Bom</option>
            <option value="Regular">Regular</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-zinc-300"
          >
            Descrição
          </label>

          <textarea
            id="description"
            name="description"
            rows={6}
            required
            disabled={pending}
            defaultValue={product?.description}
            placeholder="Descreva o produto, estado, detalhes e observações importantes."
            className={`${inputClassName} resize-y`}
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-white">
          Características
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <CheckboxField
            name="hasBox"
            label="Possui caixa"
            disabled={pending}
            defaultChecked={product?.hasBox}
          />

          <CheckboxField
            name="hasManual"
            label="Possui manual"
            disabled={pending}
            defaultChecked={product?.hasManual}
          />

          <CheckboxField
            name="featured"
            label="Produto em destaque"
            disabled={pending}
            defaultChecked={product?.featured}
          />

          <CheckboxField
            name="rarity"
            label="Marcar como raridade"
            disabled={pending}
            defaultChecked={product?.rarity}
          />
        </div>
      </div>

      {state.message && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={18} />
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending || categories.length === 0}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2
              size={19}
              className="animate-spin"
            />

            {isEditing
              ? "Salvando alterações..."
              : "Cadastrando..."}
          </>
        ) : (
          <>
            <Save size={19} />

            {isEditing
              ? "Salvar alterações"
              : "Cadastrar produto"}
          </>
        )}
      </button>
    </form>
  );
}

type CheckboxFieldProps = {
  name: string;
  label: string;
  disabled: boolean;
  defaultChecked?: boolean;
};

function CheckboxField({
  name,
  label,
  disabled,
  defaultChecked = false,
}: CheckboxFieldProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 transition hover:border-zinc-700">
      <input
        name={name}
        type="checkbox"
        disabled={disabled}
        defaultChecked={defaultChecked}
        className="h-5 w-5 accent-yellow-400"
      />

      <span className="text-sm font-medium text-zinc-300">
        {label}
      </span>
    </label>
  );
}