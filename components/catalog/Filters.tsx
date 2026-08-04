import { Input } from "@/components/ui/Input";

export function Filters() {
  return (
    <section className="mb-10 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur">
      <div className="grid gap-4 md:grid-cols-4">

        <Input
          placeholder="Buscar jogos..."
        />

        <select className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3">
          <option>Todos os consoles</option>
          <option>PlayStation</option>
          <option>Xbox</option>
          <option>Nintendo</option>
          <option>Sega</option>
        </select>

        <select className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3">
          <option>Todas categorias</option>
          <option>Jogos</option>
          <option>Consoles</option>
          <option>Colecionáveis</option>
          <option>Acessórios</option>
        </select>

        <select className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3">
          <option>Mais recentes</option>
          <option>Menor preço</option>
          <option>Maior preço</option>
          <option>Raridades</option>
        </select>

      </div>
    </section>
  );
}