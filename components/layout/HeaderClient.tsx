"use client";

import {
  Menu,
  MessageCircle,
  ShieldCheck,
  ShoppingCart,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

type HeaderClientProps = {
  whatsappUrl: string;
};

export function HeaderClient({
  whatsappUrl,
}: HeaderClientProps) {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const {
    totalItems,
    isHydrated,
    openCart,
  } = useCart();

  const visibleTotal =
    totalItems > 99
      ? "99+"
      : totalItems;

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleOpenCart() {
    setMobileMenuOpen(false);
    openCart();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-black/90 text-white backdrop-blur-2xl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-20 items-center justify-between gap-2 py-3">
          <Link
            href="/"
            onClick={closeMobileMenu}
            aria-label="Voltar para a página inicial"
            className="min-w-0 shrink"
          >
            <div className="max-w-[150px] overflow-hidden min-[380px]:max-w-[190px] sm:max-w-none">
              <Logo />

              <p className="mt-1 hidden text-[9px] font-medium uppercase leading-4 tracking-[0.18em] text-zinc-500 min-[400px]:block sm:text-[10px] sm:tracking-[0.22em]">
                Games • Consoles • Colecionáveis
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
            <Link
              href="/"
              className="transition hover:text-yellow-400"
            >
              Início
            </Link>

            <Link
              href="/catalogo"
              className="transition hover:text-yellow-400"
            >
              Catálogo
            </Link>

            <Link
              href="/#sobre"
              className="transition hover:text-yellow-400"
            >
              Sobre
            </Link>

            <Link
              href="/#contato"
              className="transition hover:text-yellow-400"
            >
              Contato
            </Link>
          </nav>

          <div className="hidden min-w-0 flex-1 md:block lg:max-w-sm xl:max-w-md">
            <Input
              placeholder="Buscar jogos, consoles e colecionáveis..."
              className="w-full shadow-lg shadow-black/20"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleOpenCart}
              aria-label={`Abrir carrinho com ${totalItems} itens`}
              className="relative flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-white transition hover:border-yellow-400 hover:text-yellow-400"
            >
              <ShoppingCart size={20} />

              <span className="hidden text-sm font-semibold sm:inline">
                Carrinho
              </span>

              {isHydrated &&
                totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-black text-black">
                    {visibleTotal}
                  </span>
                )}
            </button>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/admin/login"
                className="flex h-10 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm font-medium text-zinc-200 transition hover:border-yellow-400/60 hover:text-yellow-400"
              >
                <ShieldCheck size={17} />

                <span className="hidden xl:inline">
                  Painel
                </span>
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 shrink-0 items-center gap-2 rounded-md bg-zinc-800 px-4 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>

            <button
              type="button"
              aria-label={
                mobileMenuOpen
                  ? "Fechar menu"
                  : "Abrir menu"
              }
              aria-expanded={
                mobileMenuOpen
              }
              aria-controls="mobile-navigation"
              onClick={() =>
                setMobileMenuOpen(
                  (current) =>
                    !current
                )
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-white transition hover:border-yellow-400 hover:text-yellow-400 md:hidden"
            >
              {mobileMenuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-zinc-800 pb-4 pt-4 md:hidden"
          >
            <div className="mb-4">
              <Input
                placeholder="Buscar jogos e consoles..."
                className="w-full"
              />
            </div>

            <nav className="grid gap-2">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-zinc-900 hover:text-yellow-400"
              >
                Início
              </Link>

              <Link
                href="/catalogo"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-zinc-900 hover:text-yellow-400"
              >
                Catálogo
              </Link>

              <button
                type="button"
                onClick={handleOpenCart}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition hover:bg-zinc-900 hover:text-yellow-400"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Abrir carrinho
                </span>

                {isHydrated &&
                  totalItems > 0 && (
                    <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-black text-black">
                      {visibleTotal}
                    </span>
                  )}
              </button>

              <Link
                href="/#sobre"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-zinc-900 hover:text-yellow-400"
              >
                Sobre a loja
              </Link>

              <Link
                href="/#contato"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-zinc-900 hover:text-yellow-400"
              >
                Contato
              </Link>

              <Link
                href="/admin/login"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-yellow-400"
              >
                <ShieldCheck size={18} />
                Área administrativa
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={
                  closeMobileMenu
                }
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
              >
                <MessageCircle size={18} />
                Falar pelo WhatsApp
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
