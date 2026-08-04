import { Search } from "lucide-react";

export function FilterBar() {
  return (
    <section className="mb-10 rounded-2xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur">
      <div className="grid gap-4 lg:grid-cols-4">

        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />

          <input
            placeholder="Buscar produtos..."
            className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-12 pr-4 outline-none transition focus:border-yellow-400"
          />
        </div>

        <select className="h-12 rounded-xl border border-zinc-700 bg-zinc-950 px-4">
          <option>Todos os consoles</option>
          <option>PlayStation</option>
          <option>Xbox</option>
          <option>Nintendo</option>
          <option>Sega</option>
        </select>

        <select className="h-12 rounded-xl border border-zinc-700 bg-zinc-950 px-4">
          <option>Todas categorias</option>
          <option>Jogos</option>
          <option>Consoles</option>
          <option>Colecionáveis</option>
          <option>Acessórios</option>
        </select>

        <select className="h-12 rounded-xl border border-zinc-700 bg-zinc-950 px-4">
          <option>Mais recentes</option>
          <option>Menor preço</option>
          <option>Maior preço</option>
          <option>Raridades</option>
        </select>

      </div>
    </section>
  );
}