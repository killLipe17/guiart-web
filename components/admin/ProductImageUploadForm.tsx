"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Upload,
} from "lucide-react";

import {
  createProductImageAction,
  type ProductImageActionState,
} from "@/actions/product-images";

const initialProductImageActionState: ProductImageActionState = {
  success: false,
  message: "",
};

type ProductImageUploadFormProps = {
  productId: string;
  productTitle: string;
};

export function ProductImageUploadForm({
  productId,
  productTitle,
}: ProductImageUploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    null
  );

  const [state, formAction, pending] = useActionState(
    createProductImageAction,
    initialProductImageActionState
  );

  useEffect(() => {
    if (!state.success) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    formRef.current?.reset();
    setPreviewUrl(null);
  }, [state.success]);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const temporaryUrl = URL.createObjectURL(file);
    setPreviewUrl(temporaryUrl);
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
    >
      <input type="hidden" name="productId" value={productId} />

      <div>
        <h2 className="text-xl font-bold text-white">
          Adicionar imagem
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Envie uma foto de {productTitle}.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-zinc-300"
        >
          Imagem do produto
        </label>

        <label
          htmlFor="image"
          className="mt-2 flex min-h-56 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-700 bg-zinc-900 transition hover:border-yellow-400"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Prévia da imagem selecionada"
              className="h-56 w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <ImagePlus size={40} className="text-yellow-400" />
              <p className="mt-4 font-medium text-white">
                Clique para selecionar uma imagem
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                JPG, PNG ou WEBP — máximo de 10 MB
              </p>
            </div>
          )}
        </label>

        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          disabled={pending}
          onChange={handleImageChange}
          className="sr-only"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="alt"
          className="block text-sm font-medium text-zinc-300"
        >
          Descrição da imagem
        </label>
        <input
          id="alt"
          name="alt"
          type="text"
          disabled={pending}
          placeholder={`${productTitle} - foto principal`}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
        />
      </div>

      {state.message && (
        <div
          className={`mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            state.success
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {state.success ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Upload size={18} />
            Enviar imagem
          </>
        )}
      </button>
    </form>
  );
}
