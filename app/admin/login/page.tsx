import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/admin/LoginForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL
    ?.trim()
    .toLowerCase();

  const loggedUserEmail = user?.email
    ?.trim()
    .toLowerCase();

  if (
    adminEmail &&
    loggedUserEmail === adminEmail
  ) {
    redirect("/admin/produtos");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white sm:px-6">
      <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="absolute bottom-[-220px] right-[-180px] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center">
        <Link
          href="/"
          className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-zinc-500 transition hover:text-yellow-400"
        >
          <ArrowLeft size={18} />
          Voltar para a loja
        </Link>

        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck size={21} />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Ambiente protegido
            </p>

            <p className="text-xs text-zinc-500">
              Área exclusiva da administração
            </p>
          </div>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-xs text-zinc-700">
          Guiart Games e Colecionáveis
        </p>
      </div>
    </main>
  );
}