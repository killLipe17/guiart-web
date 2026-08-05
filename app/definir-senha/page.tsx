import {
  AlertCircle,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { redirect } from "next/navigation";

import { setPasswordAction } from "@/app/definir-senha/actions";
import { isAllowedAdminEmail } from "@/lib/auth/admin-emails";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SetPasswordPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

function getSingleSearchParam(
  value: string | string[] | undefined
) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function getErrorMessage(
  errorCode: string
) {
  if (errorCode === "senha-curta") {
    return "A senha precisa ter pelo menos 8 caracteres.";
  }

  if (
    errorCode ===
    "senhas-diferentes"
  ) {
    return "As duas senhas digitadas não são iguais.";
  }

  if (errorCode === "atualizacao") {
    return "Não foi possível definir a senha. Use uma senha diferente e tente novamente.";
  }

  return "";
}

export default async function SetPasswordPage({
  searchParams,
}: SetPasswordPageProps) {
  const supabase =
    await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (
    error ||
    !user ||
    !isAllowedAdminEmail(user.email)
  ) {
    redirect(
      "/admin/login?error=sessao-invalida"
    );
  }

  const resolvedSearchParams =
    await searchParams;

  const errorMessage =
    getErrorMessage(
      getSingleSearchParam(
        resolvedSearchParams.error
      )
    );

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white sm:px-6">
      <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="absolute bottom-[-220px] right-[-180px] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center">
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck size={21} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Identidade confirmada
            </p>

            <p className="text-xs text-zinc-500">
              {user.email}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black">
            <KeyRound size={27} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            Guiart Games
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Definir nova senha
          </h1>

          <p className="mt-3 leading-7 text-zinc-400">
            Crie uma senha com pelo menos
            8 caracteres para acessar o painel.
          </p>

          {errorMessage && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-red-300">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm leading-6">
                {errorMessage}
              </p>
            </div>
          )}

          <form
            action={setPasswordAction}
            className="mt-7"
          >
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-zinc-300"
            >
              Nova senha
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                id="new-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Pelo menos 8 caracteres"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            <label
              htmlFor="password-confirmation"
              className="mt-5 block text-sm font-medium text-zinc-300"
            >
              Confirmar nova senha
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                id="password-confirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Digite a senha novamente"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            <button
              type="submit"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300"
            >
              <KeyRound size={19} />
              Salvar nova senha
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
