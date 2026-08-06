"use client";

import {
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useId,
  useState,
} from "react";

type ProductSuggestion = {
  id: string;
  title: string;
  slug: string;
  console: string;
  category: string;
  price: number;
  imageUrl: string | null;
};

type HeaderSearchProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

const currencyFormatter =
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export function HeaderSearch({
  mobile = false,
  onNavigate,
}: HeaderSearchProps) {
  const router = useRouter();
  const listId = useId();

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    suggestions,
    setSuggestions,
  ] = useState<
    ProductSuggestion[]
  >([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const normalizedSearch =
    searchTerm.trim();

  useEffect(() => {
    if (
      normalizedSearch.length < 2
    ) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller =
      new AbortController();

    const timeout =
      window.setTimeout(
        async () => {
          setIsLoading(true);

          try {
            const response =
              await fetch(
                `/api/produtos/busca?q=${encodeURIComponent(
                  normalizedSearch
                )}`,
                {
                  signal:
                    controller.signal,
                  cache: "no-store",
                }
              );

            if (!response.ok) {
              throw new Error(
                "Não foi possível buscar os produtos."
              );
            }

            const data =
              (await response.json()) as {
                products:
                  ProductSuggestion[];
              };

            setSuggestions(
              data.products
            );

            setIsOpen(true);
          } catch (error) {
            if (
              error instanceof DOMException &&
              error.name ===
                "AbortError"
            ) {
              return;
            }

            setSuggestions([]);
          } finally {
            if (
              !controller.signal
                .aborted
            ) {
              setIsLoading(false);
            }
          }
        },
        250
      );

    return () => {
      window.clearTimeout(
        timeout
      );

      controller.abort();
    };
  }, [normalizedSearch]);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!normalizedSearch) {
      return;
    }

    setIsOpen(false);
    onNavigate?.();

    router.push(
      `/catalogo?search=${encodeURIComponent(
        normalizedSearch
      )}`
    );
  }

  function handleSuggestionClick() {
    setIsOpen(false);
    onNavigate?.();
  }

  const shouldShowDropdown =
    isOpen &&
    normalizedSearch.length >= 2;

  return (
    <div className="relative w-full">
      <form
        action="/catalogo"
        method="get"
        role="search"
        onSubmit={handleSubmit}
        className="relative"
      >
        <Search
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-zinc-500"
        />

        <input
          name="search"
          type="search"
          value={searchTerm}
          autoComplete="off"
          aria-label="Buscar produtos"
          aria-expanded={
            shouldShowDropdown
          }
          aria-controls={listId}
          placeholder={
            mobile
              ? "Buscar jogos e consoles..."
              : "Buscar jogos, consoles e colecionáveis..."
          }
          onFocus={() => {
            if (
              normalizedSearch.length >=
              2
            ) {
              setIsOpen(true);
            }
          }}
          onBlur={() => {
            window.setTimeout(
              () =>
                setIsOpen(false),
              160
            );
          }}
          onChange={(event) => {
            setSearchTerm(
              event.target.value
            );

            if (
              event.target.value
                .trim().length >= 2
            ) {
              setIsOpen(true);
            }
          }}
          className={[
            "w-full rounded-xl border py-3 pl-11 pr-11 text-white outline-none transition placeholder:text-zinc-600",
            mobile
              ? "border-purple-500/20 bg-black/45 focus:border-yellow-400"
              : "border-purple-500/20 bg-[#100d16]/90 shadow-[0_10px_30px_rgba(0,0,0,0.2)] focus:border-yellow-400",
          ].join(" ")}
        />

        <button
          type="submit"
          aria-label="Pesquisar"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-yellow-400/10 hover:text-yellow-300"
        >
          {isLoading ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <Search size={16} />
          )}
        </button>
      </form>

      {shouldShowDropdown && (
        <div
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-[80] mt-2 overflow-hidden rounded-2xl border border-purple-500/25 bg-[#0c0a10] shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        >
          {isLoading &&
          suggestions.length === 0 ? (
            <div className="flex items-center gap-3 px-4 py-4 text-sm text-zinc-400">
              <Loader2
                size={17}
                className="animate-spin text-yellow-300"
              />

              Buscando produtos...
            </div>
          ) : suggestions.length >
            0 ? (
            <>
              <div className="max-h-[390px] overflow-y-auto p-2">
                {suggestions.map(
                  (product) => (
                    <Link
                      key={product.id}
                      href={`/produto/${product.slug}`}
                      role="option"
                      onMouseDown={(event) =>
                        event.preventDefault()
                      }
                      onClick={
                        handleSuggestionClick
                      }
                      className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-purple-500/10"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                        {product.imageUrl ? (
                          <img
                            src={
                              product.imageUrl
                            }
                            alt=""
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <Search
                            size={20}
                            className="text-zinc-700"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-white">
                          {product.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-zinc-500">
                          {
                            product.category
                          }{" "}
                          • {product.console}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-black text-yellow-300">
                        {currencyFormatter.format(
                          product.price
                        )}
                      </p>
                    </Link>
                  )
                )}
              </div>

              <Link
                href={`/catalogo?search=${encodeURIComponent(
                  normalizedSearch
                )}`}
                onMouseDown={(event) =>
                  event.preventDefault()
                }
                onClick={
                  handleSuggestionClick
                }
                className="flex items-center justify-center gap-2 border-t border-zinc-800 px-4 py-3 text-sm font-bold text-yellow-300 transition hover:bg-yellow-400/10"
              >
                <Search size={16} />
                Ver todos os resultados
              </Link>
            </>
          ) : (
            <div className="px-4 py-4">
              <p className="text-sm font-semibold text-white">
                Nenhum produto encontrado
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Tente outro nome, console
                ou categoria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
