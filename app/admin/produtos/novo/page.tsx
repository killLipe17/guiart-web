import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-yellow-400"
        >
          <ArrowLeft size={18} /> Voltar para produtos
        </Link>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            Painel administrativo
          </p>
          <h1 className="mt-3 text-4xl font-black"> Novo produto </h1>
          <p className="mt-3 text-zinc-400">
            Cadastre um novo item no catálogo da Guiart.
          </p>
        </header>

        {categories.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
            Nenhuma categoria foi encontrada. Execute novamente o seed ou cadastre uma categoria no banco.
          </div>
        ) : (
          <div className="mt-10">
            <ProductForm categories={categories} />
          </div>
        )}
      </div>
    </main>
  );
}
