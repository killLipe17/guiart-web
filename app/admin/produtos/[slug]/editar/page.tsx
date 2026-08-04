import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Images } from "lucide-react";

import {
  ProductForm,
  type ProductFormValues,
} from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

type EditProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { slug } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        console: true,
        condition: true,
        stock: true,
        categoryId: true,
        hasBox: true,
        hasManual: true,
        featured: true,
        rarity: true,
      },
    }),

    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const productValues: ProductFormValues = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price.toFixed(2).replace(".", ","),
    console: product.console,
    condition: product.condition,
    stock: product.stock,
    categoryId: product.categoryId,
    hasBox: product.hasBox,
    hasManual: product.hasManual,
    featured: product.featured,
    rarity: product.rarity,
  };

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin/produtos"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-yellow-400"
          >
            <ArrowLeft size={18} />
            Voltar para produtos
          </Link>

          <Link
            href={`/admin/produtos/${slug}/imagens`}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400"
          >
            <Images size={17} />
            Gerenciar imagens
          </Link>
        </div>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            Painel administrativo
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Editar produto
          </h1>

          <p className="mt-3 text-zinc-400">
            Atualize as informações de {product.title}.
          </p>
        </header>

        <div className="mt-10">
          <ProductForm
            mode="edit"
            categories={categories}
            product={productValues}
          />
        </div>
      </div>
    </main>
  );
}