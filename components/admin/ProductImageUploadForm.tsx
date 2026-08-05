"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useRef,
  useState,
} from "react";

import {
  prepareProductImageUploadAction,
  registerProductImageAction,
} from "@/actions/product-images";
import { getStorageBrowserClient } from "@/lib/supabase/storage-browser";

const MAX_FILES_PER_BATCH = 12;
const MAX_SOURCE_BYTES =
  25 * 1024 * 1024;
const MAX_UPLOAD_BYTES =
  6 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2000;

type UploadStatus =
  | "ready"
  | "optimizing"
  | "uploading"
  | "saving"
  | "success"
  | "error";

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  message: string;
};

type ProductImageUploadFormProps = {
  productId: string;
  productTitle: string;
};

function createSelectedImage(
  file: File,
  index: number
): SelectedImage {
  return {
    id:
      `${file.name}-` +
      `${file.lastModified}-` +
      `${file.size}-${index}`,
    file,
    previewUrl:
      URL.createObjectURL(file),
    status: "ready",
    message:
      "Aguardando envio.",
  };
}

function formatFileSize(
  size: number
) {
  if (
    size >=
    1024 * 1024
  ) {
    return `${(
      size /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  return `${Math.ceil(
    size / 1024
  )} KB`;
}

function isAcceptedImage(
  file: File
) {
  const acceptedTypes =
    new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ]);

  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  return (
    acceptedTypes.has(
      file.type
    ) ||
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "png" ||
    extension === "webp" ||
    extension === "heic" ||
    extension === "heif"
  );
}

function isHeicImage(
  file: File
) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  return (
    file.type ===
      "image/heic" ||
    file.type ===
      "image/heif" ||
    extension === "heic" ||
    extension === "heif"
  );
}

async function loadImage(
  file: File
) {
  const objectUrl =
    URL.createObjectURL(file);

  try {
    const image =
      new Image();

    image.decoding = "async";

    await new Promise<void>(
      (resolve, reject) => {
        image.onload = () =>
          resolve();

        image.onerror = () =>
          reject(
            new Error(
              "O navegador não conseguiu abrir essa foto."
            )
          );

        image.src =
          objectUrl;
      }
    );

    return image;
  } finally {
    URL.revokeObjectURL(
      objectUrl
    );
  }
}

async function canvasToBlob(
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
                "Não foi possível otimizar a imagem."
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

async function optimizeImage(
  file: File
) {
  if (
    !isAcceptedImage(file)
  ) {
    throw new Error(
      "Formato não aceito. Selecione JPG, PNG, WEBP, HEIC ou HEIF."
    );
  }

  if (
    file.size >
    MAX_SOURCE_BYTES
  ) {
    throw new Error(
      "A foto original deve ter no máximo 25 MB."
    );
  }

  let image:
    | HTMLImageElement
    | null = null;

  try {
    image =
      await loadImage(file);
  } catch (error) {
    if (
      !isHeicImage(file) &&
      file.size <=
        MAX_UPLOAD_BYTES &&
      [
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      return file;
    }

    if (isHeicImage(file)) {
      throw new Error(
        "Este celular enviou a foto em HEIC e o navegador não conseguiu convertê-la. No iPhone, use Câmera > Formatos > Mais Compatível e tire a foto novamente."
      );
    }

    throw error;
  }

  const largestDimension =
    Math.max(
      image.naturalWidth,
      image.naturalHeight
    );

  const scale =
    largestDimension >
    MAX_IMAGE_DIMENSION
      ? MAX_IMAGE_DIMENSION /
        largestDimension
      : 1;

  const width =
    Math.max(
      1,
      Math.round(
        image.naturalWidth *
          scale
      )
    );

  const height =
    Math.max(
      1,
      Math.round(
        image.naturalHeight *
          scale
      )
    );

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Não foi possível preparar a imagem neste navegador."
    );
  }

  context.fillStyle =
    "#ffffff";

  context.fillRect(
    0,
    0,
    width,
    height
  );

  context.drawImage(
    image,
    0,
    0,
    width,
    height
  );

  const qualityOptions = [
    0.88,
    0.82,
    0.74,
    0.66,
  ];

  let optimizedBlob:
    | Blob
    | null = null;

  for (const quality of qualityOptions) {
    optimizedBlob =
      await canvasToBlob(
        canvas,
        quality
      );

    if (
      optimizedBlob.size <=
      MAX_UPLOAD_BYTES
    ) {
      break;
    }
  }

  if (
    !optimizedBlob ||
    optimizedBlob.size >
      MAX_UPLOAD_BYTES
  ) {
    throw new Error(
      "A imagem continuou muito grande após a otimização."
    );
  }

  const baseName =
    file.name
      .replace(/\.[^.]+$/, "")
      .trim() ||
    "produto";

  return new File(
    [optimizedBlob],
    `${baseName}.jpg`,
    {
      type: "image/jpeg",
      lastModified:
        Date.now(),
    }
  );
}

function getStatusText(
  status: UploadStatus
) {
  switch (status) {
    case "optimizing":
      return "Otimizando...";
    case "uploading":
      return "Enviando...";
    case "saving":
      return "Cadastrando...";
    case "success":
      return "Enviada";
    case "error":
      return "Erro";
    default:
      return "Pronta";
  }
}

export function ProductImageUploadForm({
  productId,
  productTitle,
}: ProductImageUploadFormProps) {
  const router = useRouter();

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    selectedImages,
    setSelectedImages,
  ] = useState<
    SelectedImage[]
  >([]);

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    summaryMessage,
    setSummaryMessage,
  ] = useState("");

  const [
    isUploading,
    setIsUploading,
  ] = useState(false);

  function updateImage(
    id: string,
    update: Partial<SelectedImage>
  ) {
    setSelectedImages(
      (current) =>
        current.map(
          (image) =>
            image.id === id
              ? {
                  ...image,
                  ...update,
                }
              : image
        )
    );
  }

  function clearSelection() {
    selectedImages.forEach(
      (image) =>
        URL.revokeObjectURL(
          image.previewUrl
        )
    );

    setSelectedImages([]);
    setSummaryMessage("");

    if (inputRef.current) {
      inputRef.current.value =
        "";
    }
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files =
      Array.from(
        event.target.files ?? []
      );

    selectedImages.forEach(
      (image) =>
        URL.revokeObjectURL(
          image.previewUrl
        )
    );

    if (
      files.length === 0
    ) {
      setSelectedImages([]);
      setSummaryMessage("");
      return;
    }

    const acceptedFiles =
      files
        .filter(
          isAcceptedImage
        )
        .slice(
          0,
          MAX_FILES_PER_BATCH
        );

    setSelectedImages(
      acceptedFiles.map(
        createSelectedImage
      )
    );

    const ignoredCount =
      files.length -
      acceptedFiles.length;

    if (ignoredCount > 0) {
      setSummaryMessage(
        `${ignoredCount} arquivo(s) não foram adicionados por formato inválido ou por exceder o limite de ${MAX_FILES_PER_BATCH} fotos.`
      );
    } else {
      setSummaryMessage(
        `${acceptedFiles.length} foto(s) selecionada(s).`
      );
    }
  }

  function removeImage(
    id: string
  ) {
    setSelectedImages(
      (current) => {
        const image =
          current.find(
            (item) =>
              item.id === id
          );

        if (image) {
          URL.revokeObjectURL(
            image.previewUrl
          );
        }

        return current.filter(
          (item) =>
            item.id !== id
        );
      }
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const pendingImages =
      selectedImages.filter(
        (image) =>
          image.status !==
          "success"
      );

    if (
      pendingImages.length === 0
    ) {
      setSummaryMessage(
        "Selecione pelo menos uma foto."
      );

      return;
    }

    setIsUploading(true);
    setSummaryMessage("");

    let successCount = 0;
    let errorCount = 0;

    try {
      const supabase =
        getStorageBrowserClient();

      for (
        let index = 0;
        index <
        pendingImages.length;
        index += 1
      ) {
        const selectedImage =
          pendingImages[index];

        try {
          updateImage(
            selectedImage.id,
            {
              status:
                "optimizing",
              message:
                "Preparando a foto para o site.",
            }
          );

          const optimizedFile =
            await optimizeImage(
              selectedImage.file
            );

          const prepared =
            await prepareProductImageUploadAction(
              {
                productId,
                fileName:
                  optimizedFile.name,
                contentType:
                  optimizedFile.type,
                size:
                  optimizedFile.size,
              }
            );

          if (!prepared.success) {
            throw new Error(
              prepared.message
            );
          }

          updateImage(
            selectedImage.id,
            {
              status:
                "uploading",
              message:
                `Enviando ${formatFileSize(
                  optimizedFile.size
                )}.`,
            }
          );

          const {
            error:
              uploadError,
          } =
            await supabase.storage
              .from(
                prepared.bucketName
              )
              .uploadToSignedUrl(
                prepared.storagePath,
                prepared.token,
                optimizedFile,
                {
                  cacheControl:
                    "3600",
                  contentType:
                    optimizedFile.type,
                }
              );

          if (uploadError) {
            throw new Error(
              `Falha no envio: ${uploadError.message}`
            );
          }

          updateImage(
            selectedImage.id,
            {
              status: "saving",
              message:
                "Registrando a imagem no produto.",
            }
          );

          const itemDescription =
            description.trim()
              ? pendingImages.length >
                1
                ? `${description.trim()} - foto ${
                    index + 1
                  }`
                : description.trim()
              : pendingImages.length >
                  1
                ? `${productTitle} - foto ${
                    index + 1
                  }`
                : productTitle;

          const registered =
            await registerProductImageAction(
              {
                productId,
                storagePath:
                  prepared.storagePath,
                alt:
                  itemDescription,
              }
            );

          if (!registered.success) {
            throw new Error(
              registered.message
            );
          }

          successCount += 1;

          updateImage(
            selectedImage.id,
            {
              status:
                "success",
              message:
                "Imagem enviada com sucesso.",
            }
          );
        } catch (error) {
          errorCount += 1;

          updateImage(
            selectedImage.id,
            {
              status: "error",
              message:
                error instanceof Error
                  ? error.message
                  : "Não foi possível enviar esta imagem.",
            }
          );
        }
      }
    } catch (error) {
      setSummaryMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar o envio."
      );
    } finally {
      setIsUploading(false);
    }

    if (successCount > 0) {
      router.refresh();
    }

    if (
      successCount > 0 &&
      errorCount === 0
    ) {
      setSummaryMessage(
        `${successCount} imagem(ns) enviada(s) com sucesso.`
      );
    } else if (
      successCount > 0
    ) {
      setSummaryMessage(
        `${successCount} enviada(s) e ${errorCount} com erro. As imagens com erro podem ser reenviadas.`
      );
    } else if (
      errorCount > 0
    ) {
      setSummaryMessage(
        "Nenhuma imagem foi enviada. Confira os erros abaixo."
      );
    }
  }

  const hasRetryableImages =
    selectedImages.some(
      (image) =>
        image.status !==
        "success"
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6"
    >
      <div>
        <h2 className="text-xl font-bold text-white">
          Adicionar imagens
        </h2>

        <p className="mt-1 text-sm leading-6 text-zinc-400">
          Selecione até{" "}
          {MAX_FILES_PER_BATCH} fotos de{" "}
          {productTitle}. Elas serão
          otimizadas e enviadas uma por
          vez.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="product-images"
          className="block text-sm font-medium text-zinc-300"
        >
          Fotos do produto
        </label>

        <label
          htmlFor="product-images"
          className="mt-2 flex min-h-40 cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900 px-5 py-8 text-center transition hover:border-yellow-400"
        >
          <div>
            <ImagePlus
              size={40}
              className="mx-auto text-yellow-400"
            />

            <p className="mt-4 font-medium text-white">
              Selecionar várias fotos
            </p>

            <p className="mt-1 text-sm leading-6 text-zinc-500">
              JPG, PNG, WEBP, HEIC ou
              HEIF. Até 25 MB por foto
              original.
            </p>
          </div>
        </label>

        <input
          ref={inputRef}
          id="product-images"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          multiple
          disabled={isUploading}
          onChange={
            handleImageChange
          }
          className="sr-only"
        />
      </div>

      {selectedImages.length >
        0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {selectedImages.map(
            (image) => (
              <article
                key={image.id}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-black"
              >
                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-zinc-900">
                  <img
                    src={
                      image.previewUrl
                    }
                    alt={
                      image.file.name
                    }
                    className="h-full w-full object-contain"
                  />

                  <div className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[10px] font-bold text-zinc-200">
                    {getStatusText(
                      image.status
                    )}
                  </div>

                  {!isUploading &&
                    image.status !==
                      "success" && (
                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            image.id
                          )
                        }
                        aria-label={`Remover ${image.file.name}`}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/80 text-zinc-300 transition hover:bg-red-500 hover:text-white"
                      >
                        <Trash2
                          size={15}
                        />
                      </button>
                    )}

                  {[
                    "optimizing",
                    "uploading",
                    "saving",
                  ].includes(
                    image.status
                  ) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Loader2
                        size={30}
                        className="animate-spin text-yellow-400"
                      />
                    </div>
                  )}

                  {image.status ===
                    "success" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/60">
                      <CheckCircle2
                        size={38}
                        className="text-emerald-400"
                      />
                    </div>
                  )}

                  {image.status ===
                    "error" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-950/60">
                      <AlertCircle
                        size={38}
                        className="text-red-400"
                      />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <FileImage
                      size={16}
                      className="mt-0.5 shrink-0 text-zinc-500"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-zinc-300">
                        {
                          image.file
                            .name
                        }
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-600">
                        {formatFileSize(
                          image.file
                            .size
                        )}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`mt-2 text-xs leading-5 ${
                      image.status ===
                      "error"
                        ? "text-red-400"
                        : image.status ===
                            "success"
                          ? "text-emerald-400"
                          : "text-zinc-500"
                    }`}
                  >
                    {image.message}
                  </p>
                </div>
              </article>
            )
          )}
        </div>
      )}

      <div className="mt-5">
        <label
          htmlFor="image-description"
          className="block text-sm font-medium text-zinc-300"
        >
          Descrição das imagens
        </label>

        <input
          id="image-description"
          type="text"
          value={description}
          disabled={isUploading}
          maxLength={180}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
          placeholder={`${productTitle} - fotos do produto`}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <p className="mt-2 text-xs leading-5 text-zinc-600">
          Para várias fotos, o sistema
          adicionará “foto 1”, “foto 2”
          e assim por diante.
        </p>
      </div>

      {summaryMessage && (
        <div
          aria-live="polite"
          className="mt-5 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm leading-6 text-zinc-300"
        >
          {summaryMessage}
        </div>
      )}

      <div className="mt-6 grid gap-3">
        <button
          type="submit"
          disabled={
            isUploading ||
            selectedImages.length ===
              0 ||
            !hasRetryableImages
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Enviando fotos...
            </>
          ) : selectedImages.some(
              (image) =>
                image.status ===
                "error"
            ) ? (
            <>
              <RefreshCw
                size={18}
              />
              Tentar novamente
            </>
          ) : (
            <>
              <Upload size={18} />
              Enviar imagens
            </>
          )}
        </button>

        {selectedImages.length >
          0 &&
          !isUploading && (
            <button
              type="button"
              onClick={
                clearSelection
              }
              className="w-full rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
            >
              Limpar seleção
            </button>
          )}
      </div>
    </form>
  );
}
