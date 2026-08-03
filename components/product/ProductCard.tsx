import { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { ProductBadge } from "./ProductBadge";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition-all duration-500 hover:-translate-y-3 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/10">

      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">

        <div className="absolute h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl transition duration-500 group-hover:scale-125" />

        <span className="relative text-6xl opacity-70 transition duration-500 group-hover:scale-110">
          🎮
        </span>

      </div>

      <div className="space-y-5 p-6">

        <span className="inline-flex rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400">
          {product.console}
        </span>

        <h3 className="text-2xl font-black leading-tight">
          {product.title}
        </h3>

        <div className="flex flex-wrap gap-2">

          {product.hasBox && (
            <ProductBadge text="Caixa" />
          )}

          {product.hasManual && (
            <ProductBadge text="Manual" />
          )}

          <ProductBadge text={product.condition} />

        </div>

        <p className="text-3xl font-black text-yellow-400">
          {product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>

        <Button>
          Ver detalhes
        </Button>

      </div>

    </article>
  );
}