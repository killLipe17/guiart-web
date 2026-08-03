import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { MessageCircle } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <div>
          <Logo />
          <p className="text-xs text-zinc-400">
            Games & Colecionáveis
          </p>
        </div>
        
        <div className="flex-1">
          <Input
  placeholder="Buscar jogos, consoles e colecionáveis..."
  className="shadow-lg shadow-black/20"
/>
        </div>

        {/* Link direto estilizado com as classes de botão do Tailwind */}
        <a
          href="https://wa.me/5511962222045"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 shrink-0 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
      </div>
    </header>
  );
}
