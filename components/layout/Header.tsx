import { Input } from "@/components/ui/Input"; 
import { Logo } from "@/components/ui/Logo"; 
import { MessageCircle } from "lucide-react"; 

export function Header() { 
  return ( 
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/80 backdrop-blur-2xl"> 
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-6"> 
        <div> 
          <Logo /> 
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
            Games • Consoles • Colecionáveis
          </p> 
        </div> 

        {/* Menu de Navegação adicionado */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <a
            href="/"
            className="transition hover:text-yellow-400"
          >
            Início
          </a>
          <a
            href="/catalogo"
            className="transition hover:text-yellow-400"
          >
            Catálogo
          </a>
          <a
            href="#sobre"
            className="transition hover:text-yellow-400"
          >
            Sobre
          </a>
          <a
            href="#contato"
            className="transition hover:text-yellow-400"
          >
            Contato
          </a>
        </nav>

        <div className="flex-1"> 
          <Input placeholder="Buscar jogos, consoles e colecionáveis..." className="shadow-lg shadow-black/20" /> 
        </div> 

        {/* Link direto estilizado com as classes de botão do Tailwind */} 
        <a 
          href="https://wa.me" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 shrink-0 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors" 
        > 
          <MessageCircle size={18} /> WhatsApp 
        </a> 
      </div> 
    </header> 
  ); 
}
