import { ArrowRight, MessageCircle } from "lucide-react";

export function CallToAction() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="rounded-[40px] border border-yellow-500/20 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 p-12 text-center">

          <span className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
            Estoque atualizado
          </span>

          <h2 className="mt-6 text-5xl font-black leading-tight">
            Procurando um game específico?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Nosso estoque muda diariamente.
            Se você não encontrou o produto desejado,
            fale conosco pelo WhatsApp.
            Podemos ter exatamente o que você procura.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">

            <a
              href="https://wa.me/5511962222045"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-yellow-400 px-7 py-4 font-bold text-black transition hover:scale-105"
            >
              <MessageCircle size={20} />
              Falar no WhatsApp
            </a>

            <a
              href="#produtos"
              className="inline-flex items-center gap-3 rounded-xl border border-zinc-700 px-7 py-4 transition hover:border-yellow-400"
            >
              Ver Produtos
              <ArrowRight size={18} />
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}