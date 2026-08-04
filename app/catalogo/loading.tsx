import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function CatalogLoading() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white">
        <section className="border-b border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="h-4 w-56 animate-pulse rounded bg-yellow-400/20" />

            <div className="mt-5 h-12 max-w-3xl animate-pulse rounded-xl bg-zinc-900" />

            <div className="mt-4 h-6 max-w-2xl animate-pulse rounded-lg bg-zinc-900" />

            <div className="mt-8 h-9 w-48 animate-pulse rounded-full bg-zinc-900" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 animate-pulse rounded-xl bg-zinc-900" />

              <div>
                <div className="h-5 w-40 animate-pulse rounded bg-zinc-800" />
                <div className="mt-2 h-4 w-64 animate-pulse rounded bg-zinc-900" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />

                  <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-zinc-900" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <div className="h-8 w-64 animate-pulse rounded bg-zinc-900" />
              <div className="mt-2 h-4 w-28 animate-pulse rounded bg-zinc-900" />
            </div>

            <div className="hidden h-4 w-28 animate-pulse rounded bg-zinc-900 sm:block" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <article
                key={index}
                className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950"
              >
                <div className="aspect-[4/3] animate-pulse bg-zinc-900" />

                <div className="p-5 sm:p-6">
                  <div className="h-3 w-28 animate-pulse rounded bg-yellow-400/20" />

                  <div className="mt-4 h-7 w-4/5 animate-pulse rounded bg-zinc-800" />

                  <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-zinc-900" />

                  <div className="mt-5 space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-zinc-900" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-900" />
                  </div>

                  <div className="mt-6 border-t border-zinc-900 pt-5">
                    <div className="h-3 w-14 animate-pulse rounded bg-zinc-900" />
                    <div className="mt-2 h-8 w-32 animate-pulse rounded bg-zinc-800" />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="h-10 animate-pulse rounded-xl bg-zinc-900" />
                    <div className="h-10 animate-pulse rounded-xl bg-zinc-900" />
                  </div>

                  <div className="mt-5 h-12 animate-pulse rounded-xl bg-yellow-400/20" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}