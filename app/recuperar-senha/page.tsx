import {
  AlertCircle,
  ArrowLeft,
  CircleCheckBig,
  KeyRound,
  Mail,
} from "lucide-react";
import Link from "next/link";

import { requestPasswordResetAction } from "@/app/recuperar-senha/actions";

export const dynamic = "force-dynamic";

type RecoverPasswordPageProps = {
  searchParams: Promise<{
    sent?: string | string[];
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
  if (errorCode === "email-invalido") {
    return "Informe um endereço de e-mail válido.";
  }

  if (errorCode === "envio") {
    return "Não foi possível enviar o e-mail agora. Aguarde alguns minutos e tente novamente.";
  }

  return "";
}

export default async function RecoverPasswordPage({
  searchParams,
}: RecoverPasswordPageProps) {
  const resolvedSearchParams =
    await searchParams;

  const sent =
    getSingleSearchParam(
      resolvedSearchParams.sent
    ) === "1";

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
        <Link
          href="/admin/login"
          className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-zinc-500 transition hover:text-yellow-400"
        >
          <ArrowLeft size={18} />
          Voltar para o login
        </Link>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black">
            <KeyRound size={27} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            Guiart Games
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Recuperar senha
          </h1>

          <p className="mt-3 leading-7 text-zinc-400">
            Informe o e-mail administrativo.
            Você receberá um link para criar
            uma nova senha.
          </p>

          {sent && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-emerald-300">
              <CircleCheckBig
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm leading-6">
                Se o e-mail estiver autorizado,
                o link foi enviado. Verifique
                também a caixa de spam.
              </p>
            </div>
          )}

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
            action={requestPasswordResetAction}
            className="mt-7"
          >
            <label
              htmlFor="recovery-email"
              className="text-sm font-medium text-zinc-300"
            >
              E-mail
            </label>

            <div className="relative mt-2">
              <Mail
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                id="recovery-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="seuemail@exemplo.com"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300"
            >
              <Mail size={19} />
              Enviar link
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
