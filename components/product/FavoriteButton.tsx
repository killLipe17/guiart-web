"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

type FavoriteButtonProps = {
  productId: string;
};

const STORAGE_KEY = "guiart-favorite-products";

export function FavoriteButton({
  productId,
}: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const storedFavorites = localStorage.getItem(STORAGE_KEY);

    if (!storedFavorites) {
      return;
    }

    try {
      const favorites = JSON.parse(storedFavorites) as string[];
      setFavorite(favorites.includes(productId));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [productId]);

  function toggleFavorite() {
    const storedFavorites = localStorage.getItem(STORAGE_KEY);

    let favorites: string[] = [];

    if (storedFavorites) {
      try {
        favorites = JSON.parse(storedFavorites) as string[];
      } catch {
        favorites = [];
      }
    }

    const updatedFavorites = favorite
      ? favorites.filter((id) => id !== productId)
      : Array.from(new Set([...favorites, productId]));

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedFavorites)
    );

    setFavorite(!favorite);
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-pressed={favorite}
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition ${
        favorite
          ? "border-red-500 bg-red-500/10 text-red-400"
          : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-red-500 hover:text-red-400"
      }`}
      title={
        favorite
          ? "Remover dos favoritos"
          : "Adicionar aos favoritos"
      }
    >
      <Heart
        size={21}
        fill={favorite ? "currentColor" : "none"}
      />
    </button>
  );
}