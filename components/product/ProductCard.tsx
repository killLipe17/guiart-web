import { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { ProductBadge } from "./ProductBadge";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition-all duration-500 hover:-translate-y-3 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/10">
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.08),transparent_70%)]" />
        <div className="flex h-full items-center justify-center transition duration-500 group-hover:scale-105">
          <span className="text-sm tracking-[0.4em] text-zinc-600"> FOTO </span>
        </div>
      </div>
      <div className="space-y-5 p-6">
        {/* Bloco Atualizado */}
        <span className="inline-flex w-fit rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-400">
          {product.console}
        </span>
        <h3 className="line-clamp-2 text-xl font-extrabold tracking-tight">
          {product.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {product.hasBox && <ProductBadge text="Caixa" />}
          {product.hasManual && <ProductBadge text="Manual" />}
          <ProductBadge text={product.condition} />
        </div>
        <p className="text-3xl font-black text-yellow-400">
          {product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        {/* Bloco substituído */}
        <div className="pt-2">
          <Link href={`/produto/${product.id}`}>
            <Button className="w-full">
              Ver detalhes →
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
