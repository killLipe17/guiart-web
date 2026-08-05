import {
  ArrowRight,
  MessageCircle,
} from "lucide-react";

type CallToActionProps = {
  whatsappUrl: string;
};

export function CallToAction({
  whatsappUrl,
}: CallToActionProps) {
  return (
    <section
      id="contato"
      className="scroll-mt-28 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[40px] border border-yellow-500/20 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 p-8 text-center sm:p-12">
          <span className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
            Estoque atualizado
          </span>

          <h2 className="mt-6 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Procurando um game específico?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
            Nosso estoque muda diariamente. Se
            você não encontrou o produto
            desejado, fale conosco pelo
            WhatsApp. Podemos ter exatamente o
            que você procura.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <a
              href={whatsappUrl}
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
              Ver produtos
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
