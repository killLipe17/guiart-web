import { MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <h2 className="text-3xl font-black text-yellow-400"> Guiart Games </h2>
          <p className="mt-4 text-zinc-400">
            Compra, venda e troca de games, consoles e colecionáveis.
          </p>
        </div>
        <div>
          <h3 className="mb-5 font-bold text-white"> Contato </h3>
          <div className="space-y-4 text-zinc-400">
            <div className="flex items-center gap-3">
              <MessageCircle size={18} />
              <a
  href="https://wa.me/5511962222045"
  target="_blank"
  rel="noopener noreferrer"
  className="transition hover:text-yellow-400"
>
  (11) 96222-2045
</a>
            </div>
            <div className="flex items-center gap-3">
              {/* SVG nativo do Instagram para evitar o erro de importação */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <a
  href="https://www.instagram.com/guiart_games/"
  target="_blank"
  rel="noopener noreferrer"
  className="transition hover:text-yellow-400"
>
  @guiart_games
</a>
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-5 font-bold text-white"> Endereço </h3>
          <div className="flex items-start gap-3 text-zinc-400">
            <MapPin size={18} className="mt-1" />
            <span>
              Rua dos Buritis, 54 <br /> Loja 9 <br /> Jardim Oriental <br /> São Paulo - SP
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Guiart Games e Colecionáveis. Todos os direitos reservados.
      </div>
    </footer>
  );
}
