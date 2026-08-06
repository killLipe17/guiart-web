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

const desktopLinkClass =
  "relative py-2 text-sm font-semibold text-zinc-300 transition " +
  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 " +
  "after:bg-gradient-to-r after:from-yellow-400 after:to-purple-500 " +
  "after:transition-all hover:text-white hover:after:w-full";

const mobileLinkClass =
  "rounded-xl border border-transparent px-4 py-3 text-sm font-semibold " +
  "text-zinc-200 transition hover:border-purple-500/25 hover:bg-purple-500/10 " +
  "hover:text-yellow-300";

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
    <header className="sticky top-0 z-50 w-full border-b border-yellow-400/15 bg-black text-white shadow-[0_14px_45px_rgba(0,0,0,0.34)]">
      <div
        aria-hidden="true"
        className="guiart-pixel-line absolute inset-x-0 bottom-0 h-px opacity-75"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-20 items-center justify-between gap-3 py-2.5">
          <Link
            href="/"
            onClick={closeMobileMenu}
            aria-label="Voltar para a página inicial"
            className="min-w-0 shrink-0 rounded-lg focus-visible:outline-yellow-400"
          >
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              href="/"
              className={desktopLinkClass}
            >
              Início
            </Link>

            <Link
              href="/catalogo"
              className={desktopLinkClass}
            >
              Catálogo
            </Link>

            <Link
              href="/#sobre"
              className={desktopLinkClass}
            >
              Sobre
            </Link>

            <Link
              href="/#contato"
              className={desktopLinkClass}
            >
              Contato
            </Link>
          </nav>

          <div className="hidden min-w-0 flex-1 md:block lg:max-w-xs xl:max-w-sm">
            <Input
              placeholder="Buscar jogos, consoles e colecionáveis..."
              className="w-full border-purple-500/20 bg-[#100d16]/90 shadow-[0_10px_30px_rgba(0,0,0,0.2)] focus:border-yellow-400"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleOpenCart}
              aria-label={`Abrir carrinho com ${totalItems} itens`}
              className="guiart-button-secondary relative flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 transition"
            >
              <ShoppingCart size={20} />

              <span className="hidden text-sm font-bold sm:inline">
                Carrinho
              </span>

              {isHydrated &&
                totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full border border-black/40 bg-yellow-400 px-1 text-[10px] font-black text-black shadow-[0_0_16px_rgba(245,196,0,0.45)]">
                    {visibleTotal}
                  </span>
                )}
            </button>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/admin/login"
                className="flex h-10 items-center gap-2 rounded-xl border border-zinc-700/80 bg-[#121018] px-3 text-sm font-semibold text-zinc-300 transition hover:border-purple-400/45 hover:text-purple-200"
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
                className="guiart-button-primary flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-black transition"
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
              className="guiart-button-secondary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition md:hidden"
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
            className="border-t border-purple-500/15 pb-4 pt-4 md:hidden"
          >
            <div className="guiart-surface rounded-2xl p-3">
              <div className="mb-3">
                <Input
                  placeholder="Buscar jogos e consoles..."
                  className="w-full border-purple-500/20 bg-black/45 focus:border-yellow-400"
                />
              </div>

              <nav className="grid gap-1">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className={mobileLinkClass}
                >
                  Início
                </Link>

                <Link
                  href="/catalogo"
                  onClick={closeMobileMenu}
                  className={mobileLinkClass}
                >
                  Catálogo
                </Link>

                <button
                  type="button"
                  onClick={handleOpenCart}
                  className="flex items-center justify-between rounded-xl border border-transparent px-4 py-3 text-left text-sm font-semibold text-zinc-200 transition hover:border-purple-500/25 hover:bg-purple-500/10 hover:text-yellow-300"
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
                  className={mobileLinkClass}
                >
                  Sobre a loja
                </Link>

                <Link
                  href="/#contato"
                  onClick={closeMobileMenu}
                  className={mobileLinkClass}
                >
                  Contato
                </Link>

                <Link
                  href="/admin/login"
                  onClick={closeMobileMenu}
                  className="mt-1 flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-purple-500/35 hover:bg-purple-500/10 hover:text-purple-200"
                >
                  <ShieldCheck size={18} />
                  Área administrativa
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="guiart-button-primary mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition"
                >
                  <MessageCircle size={18} />
                  Falar pelo WhatsApp
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
