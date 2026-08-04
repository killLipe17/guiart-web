"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  MessageCircle,
  ShieldCheck,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

const whatsappUrl = "https://wa.me/5511962222045";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-black/90 text-white backdrop-blur-2xl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-20 items-center justify-between gap-3 py-3">
          <Link
            href="/"
            onClick={closeMobileMenu}
            aria-label="Voltar para a página inicial"
            className="min-w-0 shrink"
          >
            <div className="max-w-[210px] overflow-hidden sm:max-w-none">
              <Logo />

              <p className="mt-1 hidden text-[9px] font-medium uppercase leading-4 tracking-[0.18em] text-zinc-500 min-[380px]:block sm:text-[10px] sm:tracking-[0.22em]">
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

          <div className="hidden shrink-0 items-center gap-2 md:flex">
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
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() =>
              setMobileMenuOpen((current) => !current)
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
                onClick={closeMobileMenu}
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