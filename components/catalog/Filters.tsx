export function Filters() {
  return (
    <aside className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="mb-6 text-xl font-bold">
        Filtros
      </h2>

      <div className="space-y-5">

        <div>

          <label className="mb-2 block">
            Console
          </label>

          <select className="w-full rounded-lg bg-zinc-800 p-3">

            <option>Todos</option>

            <option>Super Nintendo</option>

            <option>PlayStation</option>

            <option>Mega Drive</option>

          </select>

        </div>

        <div>

          <label className="mb-2 block">
            Condição
          </label>

          <select className="w-full rounded-lg bg-zinc-800 p-3">

            <option>Todas</option>

            <option>Excelente</option>

            <option>Muito Bom</option>

            <option>Bom</option>

          </select>

        </div>

      </div>

    </aside>
  );
}