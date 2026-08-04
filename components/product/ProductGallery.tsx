"use client";

import { useState } from "react";
import { ImageIcon, Maximize2, X } from "lucide-react";

type ProductGalleryImage = {
  id: string;
  url: string;
  alt: string | null;
};

type ProductGalleryProps = {
  images: ProductGalleryImage[];
  productTitle: string;
};

export function ProductGallery({
  images,
  productTitle,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const selectedImage = images[selectedIndex];

  if (!selectedImage) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950">
        <div className="text-center">
          <ImageIcon
            size={56}
            className="mx-auto text-zinc-700"
          />

          <p className="mt-4 text-zinc-500">
            Imagem em breve
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950"
          aria-label="Ampliar imagem"
        >
          <img
            src={selectedImage.url}
            alt={
              selectedImage.alt ??
              `${productTitle} - Guiart Games`
            }
            className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
          />

          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-black/80 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            <Maximize2 size={17} />
            Ampliar
          </span>
        </button>

        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Selecionar imagem ${index + 1}`}
                className={`aspect-square overflow-hidden rounded-xl border bg-zinc-950 transition ${
                  selectedIndex === index
                    ? "border-yellow-400 ring-2 ring-yellow-400/20"
                    : "border-zinc-800 hover:border-zinc-600"
                }`}
              >
                <img
                  src={image.url}
                  alt={
                    image.alt ??
                    `${productTitle} - imagem ${index + 1}`
                  }
                  className="h-full w-full object-contain p-2"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada de ${productTitle}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-white transition hover:border-yellow-400 hover:text-yellow-400"
            aria-label="Fechar imagem ampliada"
          >
            <X size={24} />
          </button>

          <img
            src={selectedImage.url}
            alt={
              selectedImage.alt ??
              `${productTitle} - imagem ampliada`
            }
            className="max-h-[90vh] max-w-[95vw] object-contain"
          />
        </div>
      )}
    </>
  );
}