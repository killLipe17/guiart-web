"use client";

import {
  Loader2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  prepareProductImageUploadAction,
  replaceProductImageAction,
} from "@/actions/product-images";
import { getStorageBrowserClient } from "@/lib/supabase/storage-browser";

const MAX_UPLOAD_BYTES =
  6 * 1024 * 1024;

type RotationDirection =
  | "left"
  | "right";

type ProductImageRotationControlsProps = {
  imageId: string;
  productId: string;
  imageUrl: string;
  imageAlt: string;
};

async function loadRemoteImage(
  imageUrl: string
) {
  const response = await fetch(
    `${imageUrl}${
      imageUrl.includes("?")
        ? "&"
        : "?"
    }rotatePreview=${Date.now()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível baixar a imagem atual."
    );
  }

  const blob = await response.blob();
  const objectUrl =
    URL.createObjectURL(blob);

  try {
    const image = new Image();
    image.decoding = "async";

    await new Promise<void>(
      (resolve, reject) => {
        image.onload = () =>
          resolve();

        image.onerror = () =>
          reject(
            new Error(
              "O navegador não conseguiu abrir a imagem."
            )
          );

        image.src = objectUrl;
      }
    );

    return {
      image,
      release: () =>
        URL.revokeObjectURL(
          objectUrl
        ),
    };
  } catch (error) {
    URL.revokeObjectURL(
      objectUrl
    );

    throw error;
  }
}

function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number
) {
  return new Promise<Blob>(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Não foi possível preparar a imagem girada."
              )
            );

            return;
          }

          resolve(blob);
        },
        "image/jpeg",
        quality
      );
    }
  );
}

async function createRotatedFile({
  imageUrl,
  direction,
}: {
  imageUrl: string;
  direction: RotationDirection;
}) {
  const {
    image,
    release,
  } = await loadRemoteImage(
    imageUrl
  );

  try {
    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      image.naturalHeight;

    canvas.height =
      image.naturalWidth;

    const context =
      canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Não foi possível preparar a rotação neste navegador."
      );
    }

    context.fillStyle =
      "#ffffff";

    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.translate(
      canvas.width / 2,
      canvas.height / 2
    );

    context.rotate(
      direction === "left"
        ? -Math.PI / 2
        : Math.PI / 2
    );

    context.drawImage(
      image,
      -image.naturalWidth / 2,
      -image.naturalHeight / 2
    );

    const qualityOptions = [
      0.9,
      0.82,
      0.74,
      0.66,
    ];

    let rotatedBlob:
      | Blob
      | null = null;

    for (const quality of qualityOptions) {
      rotatedBlob =
        await canvasToJpegBlob(
          canvas,
          quality
        );

      if (
        rotatedBlob.size <=
        MAX_UPLOAD_BYTES
      ) {
        break;
      }
    }

    if (
      !rotatedBlob ||
      rotatedBlob.size >
        MAX_UPLOAD_BYTES
    ) {
      throw new Error(
        "A imagem girada continuou maior que 6 MB."
      );
    }

    return new File(
      [rotatedBlob],
      `produto-girado-${Date.now()}.jpg`,
      {
        type: "image/jpeg",
        lastModified:
          Date.now(),
      }
    );
  } finally {
    release();
  }
}

export function ProductImageRotationControls({
  imageId,
  productId,
  imageUrl,
  imageAlt,
}: ProductImageRotationControlsProps) {
  const router = useRouter();

  const [
    rotatingDirection,
    setRotatingDirection,
  ] = useState<
    RotationDirection | null
  >(null);

  const [
    message,
    setMessage,
  ] = useState("");

  async function handleRotate(
    direction: RotationDirection
  ) {
    if (rotatingDirection) {
      return;
    }

    setRotatingDirection(
      direction
    );

    setMessage(
      "Preparando imagem..."
    );

    try {
      const rotatedFile =
        await createRotatedFile({
          imageUrl,
          direction,
        });

      setMessage(
        "Preparando envio..."
      );

      const prepared =
        await prepareProductImageUploadAction(
          {
            productId,
            fileName:
              rotatedFile.name,
            contentType:
              rotatedFile.type,
            size:
              rotatedFile.size,
          }
        );

      if (!prepared.success) {
        throw new Error(
          prepared.message
        );
      }

      setMessage(
        "Enviando imagem girada..."
      );

      const supabase =
        getStorageBrowserClient();

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from(
            prepared.bucketName
          )
          .uploadToSignedUrl(
            prepared.storagePath,
            prepared.token,
            rotatedFile,
            {
              cacheControl:
                "3600",
              contentType:
                rotatedFile.type,
            }
          );

      if (uploadError) {
        throw new Error(
          `Falha no envio: ${uploadError.message}`
        );
      }

      setMessage(
        "Salvando alteração..."
      );

      const replaced =
        await replaceProductImageAction(
          {
            imageId,
            productId,
            storagePath:
              prepared.storagePath,
          }
        );

      if (!replaced.success) {
        throw new Error(
          replaced.message
        );
      }

      setMessage(
        direction === "left"
          ? "Imagem girada para a esquerda."
          : "Imagem girada para a direita."
      );

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível girar a imagem."
      );
    } finally {
      setRotatingDirection(
        null
      );
    }
  }

  const isRotating =
    rotatingDirection !== null;

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
        Girar fotografia
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isRotating}
          onClick={() =>
            handleRotate("left")
          }
          aria-label={`Girar ${imageAlt} para a esquerda`}
          className="flex items-center justify-center gap-2 rounded-xl border border-purple-500/35 px-3 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {rotatingDirection ===
          "left" ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <RotateCcw
              size={15}
            />
          )}

          Esquerda
        </button>

        <button
          type="button"
          disabled={isRotating}
          onClick={() =>
            handleRotate("right")
          }
          aria-label={`Girar ${imageAlt} para a direita`}
          className="flex items-center justify-center gap-2 rounded-xl border border-purple-500/35 px-3 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {rotatingDirection ===
          "right" ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <RotateCw
              size={15}
            />
          )}

          Direita
        </button>
      </div>

      {message && (
        <p
          aria-live="polite"
          className="mt-2 text-xs leading-5 text-zinc-500"
        >
          {message}
        </p>
      )}
    </div>
  );
}
