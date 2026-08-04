"use client";

import { useActionState, useState } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

import {
  loginAction,
  type LoginActionState,
} from "@/actions/auth";

const initialState: LoginActionState = {
  success: false,
  message: "",
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black">
        <LockKeyhole size={27} />
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
          Guiart Games
        </p>

        <h1 className="mt-3 text-3xl font-black text-white">
          Acesso administrativo
        </h1>

        <p className="mt-3 leading-7 text-zinc-400">
          Entre com o e-mail e a senha cadastrados para gerenciar os
          produtos da loja.
        </p>
      </div>

      <div className="mt-8">
        <label
          htmlFor="email"
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
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={pending}
            placeholder="admin@guiartgames.com.br"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-zinc-300"
        >
          Senha
        </label>

        <div className="relative mt-2">
          <LockKeyhole
            size={19}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            disabled={pending}
            placeholder="Digite sua senha"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-12 pr-12 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            disabled={pending}
            onClick={() => setShowPassword((current) => !current)}
            aria-label={
              showPassword ? "Ocultar senha" : "Mostrar senha"
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-yellow-400 disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>
      </div>

      {state.message && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{state.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2
              size={19}
              className="animate-spin"
            />
            Entrando...
          </>
        ) : (
          <>
            <LogIn size={19} />
            Entrar no painel
          </>
        )}
      </button>

      <p className="mt-6 text-center text-xs leading-5 text-zinc-600">
        Área restrita aos administradores da Guiart Games.
      </p>
    </form>
  );
}