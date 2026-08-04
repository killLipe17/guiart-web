import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Box,
  Check,
  Gem,
  ImageIcon,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { ProductGallery } from "@/components/product/ProductGallery";
import { prisma } from "@/lib/prisma";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    select: {
      title: true,
      description: true,
      images: {
        orderBy: [
          {
            isCover: "desc",
          },
          {
            order: "asc",
          },
        ],
        take: 1,
        select: {
          url: true,
        },
      },
    },
  });

  if (!product) {
    return {
      title: "Produto não encontrado | Guiart Games",
    };
  }

  return {
    title: `${product.title} | Guiart Games`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.images[0]?.url
        ? [
            {
              url: product.images[0].url,
            },
          ]
        : [],
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      price: true,
      console: true,
      condition: true,
      stock: true,
      hasBox: true,
      hasManual: true,
      featured: true,
      rarity: true,
      categoryId: true,

      category: {
        select: {
          name: true,
        },
      },

      images: {
        orderBy: [
          {
            isCover: "desc",
          },
          {
            order: "asc",
          },
        ],
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: {
        not: product.id,
      },
      categoryId: product.categoryId,
      stock: {
        gt: 0,
      },
    },
    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      console: true,
      rarity: true,
      images: {
        orderBy: [
          {
            isCover: "desc",
          },
          {
            order: "asc",
          },
        ],
        take: 1,
        select: {
          url: true,
          alt: true,
        },
      },
    },
  });

  const price = currencyFormatter.format(
    Number(product.price)
  );

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no produto "${product.title}" por ${price}. Ele ainda está disponível?`
  );

  const whatsappUrl =
    `https://wa.me/5511962222045?text=${whatsappMessage}`;

  const isAvailable = product.stock > 0;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white">
        <section className="border-b border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-yellow-400"
            >
              <ArrowLeft size={18} />
              Voltar para o catálogo
            </Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <ProductGallery
            images={product.images}
            productTitle={product.title}
          />

          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-yellow-400">
                {product.category.name}
              </span>

              {product.featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
                  <Star size={14} fill="currentColor" />
                  Destaque
                </span>
              )}

              {product.rarity && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                  <Gem size={14} />
                  Raridade
                </span>
              )}
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">
              {product.title}
            </h1>

            <p className="mt-4 text-lg text-zinc-400">
              {product.console}
            </p>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="text-sm text-zinc-500">
                Preço
              </p>

              <p className="mt-2 text-4xl font-black text-white">
                {price}
              </p>

              <div
                className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                  isAvailable
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {isAvailable ? (
                  <PackageCheck size={18} />
                ) : (
                  <X size={18} />
                )}

                {isAvailable
                  ? "Disponível na loja"
                  : "Produto indisponível"}
              </div>

              <div className="mt-6 flex gap-3">
                {isAvailable ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white transition hover:bg-emerald-400"
                  >
                    <MessageCircle size={20} />
                    Comprar pelo WhatsApp
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex min-h-12 flex-1 cursor-not-allowed items-center justify-center rounded-xl bg-zinc-800 px-5 py-3 font-bold text-zinc-500"
                  >
                    Produto indisponível
                  </button>
                )}

                <FavoriteButton productId={product.id} />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <ProductInfo
                icon={<ShieldCheck size={20} />}
                label="Conservação"
                value={product.condition}
                positive
              />

              <ProductInfo
                icon={<Box size={20} />}
                label="Possui caixa"
                value={product.hasBox ? "Sim" : "Não"}
                positive={product.hasBox}
              />

              <ProductInfo
                icon={<PackageCheck size={20} />}
                label="Possui manual"
                value={product.hasManual ? "Sim" : "Não"}
                positive={product.hasManual}
              />
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <MapPin
                size={22}
                className="mt-0.5 shrink-0 text-yellow-400"
              />

              <div>
                <p className="font-bold">
                  Retirada na loja física
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Rua dos Buritis, 54, Loja 9 — Jardim Oriental,
                  São Paulo. Próximo ao Metrô Jabaquara.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-900 bg-zinc-950/50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <h2 className="text-2xl font-black">
              Sobre este produto
            </h2>

            <p className="mt-5 max-w-4xl whitespace-pre-line text-base leading-8 text-zinc-400">
              {product.description}
            </p>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
                Veja também
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Produtos relacionados
              </h2>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => {
                const relatedImage =
                  relatedProduct.images[0];

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/produto/${relatedProduct.slug}`}
                    className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition hover:-translate-y-1 hover:border-yellow-400/40"
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center bg-zinc-900">
                      {relatedImage ? (
                        <img
                          src={relatedImage.url}
                          alt={
                            relatedImage.alt ??
                            relatedProduct.title
                          }
                          className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <ImageIcon
                          size={42}
                          className="text-zinc-700"
                        />
                      )}

                      {relatedProduct.rarity && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold">
                          <Gem size={13} />
                          Raridade
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-yellow-400">
                        {relatedProduct.console}
                      </p>

                      <h3 className="mt-2 text-lg font-bold transition group-hover:text-yellow-400">
                        {relatedProduct.title}
                      </h3>

                      <p className="mt-4 text-xl font-black">
                        {currencyFormatter.format(
                          Number(relatedProduct.price)
                        )}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

type ProductInfoProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive: boolean;
};

function ProductInfo({
  icon,
  label,
  value,
  positive,
}: ProductInfoProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <div
        className={
          positive
            ? "text-emerald-400"
            : "text-zinc-600"
        }
      >
        {icon}
      </div>

      <p className="mt-3 text-xs text-zinc-600">
        {label}
      </p>

      <p className="mt-1 flex items-center gap-1.5 font-bold">
        {positive ? (
          <Check size={15} className="text-emerald-400" />
        ) : (
          <X size={15} className="text-zinc-600" />
        )}

        {value}
      </p>
    </div>
  );
}