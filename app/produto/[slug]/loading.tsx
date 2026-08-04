import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function ProductLoading() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white">
        <section className="border-b border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="h-5 w-44 animate-pulse rounded bg-zinc-900" />
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <div>
            <div className="aspect-square animate-pulse rounded-3xl border border-zinc-800 bg-zinc-950" />

            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square animate-pulse rounded-xl border border-zinc-800 bg-zinc-950"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex gap-2">
              <div className="h-8 w-28 animate-pulse rounded-full bg-yellow-400/20" />
              <div className="h-8 w-24 animate-pulse rounded-full bg-zinc-900" />
            </div>

            <div className="mt-6 h-12 w-4/5 animate-pulse rounded-xl bg-zinc-900" />

            <div className="mt-4 h-6 w-40 animate-pulse rounded bg-zinc-900" />

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="h-4 w-16 animate-pulse rounded bg-zinc-900" />

              <div className="mt-3 h-11 w-48 animate-pulse rounded bg-zinc-800" />

              <div className="mt-5 h-9 w-44 animate-pulse rounded-full bg-zinc-900" />

              <div className="mt-6 flex gap-3">
                <div className="h-12 flex-1 animate-pulse rounded-xl bg-emerald-500/20" />
                <div className="h-12 w-12 animate-pulse rounded-xl bg-zinc-900" />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950"
                />
              ))}
            </div>

            <div className="mt-8 h-28 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}