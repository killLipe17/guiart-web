import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="mb-12 flex items-end justify-between">

        <SectionTitle
          title="Produtos em destaque"
          subtitle="Confira algumas raridades disponíveis na Guiart Games."
        />

        <Button variant="secondary">
          Ver catálogo
          <ArrowRight size={18} />
        </Button>

      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}