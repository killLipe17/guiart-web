"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  isAllowedAdminEmail,
  normalizeEmail,
} from "@/lib/auth/admin-emails";
import { createClient } from "@/lib/supabase/server";

function getRequestOrigin(
  requestHeaders: Headers
) {
  const forwardedHost =
    requestHeaders.get(
      "x-forwarded-host"
    );

  const host =
    forwardedHost ??
    requestHeaders.get("host");

  if (!host) {
    return "http://localhost:3000";
  }

  const forwardedProtocol =
    requestHeaders.get(
      "x-forwarded-proto"
    );

  const protocol =
    forwardedProtocol ??
    (host.includes("localhost")
      ? "http"
      : "https");

  return `${protocol}://${host}`;
}

export async function requestPasswordResetAction(
  formData: FormData
) {
  const email = normalizeEmail(
    String(formData.get("email") ?? "")
  );

  if (!email) {
    redirect(
      "/recuperar-senha?error=email-invalido"
    );
  }

  /*
   * Não informa publicamente se o e-mail
   * pertence ou não a um administrador.
   */
  if (!isAllowedAdminEmail(email)) {
    redirect(
      "/recuperar-senha?sent=1"
    );
  }

  const requestHeaders =
    await headers();

  const origin =
    getRequestOrigin(requestHeaders);

  const supabase =
    await createClient();

  const { error } =
    await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          `${origin}/auth/confirm?next=/definir-senha`,
      }
    );

  if (error) {
    console.error(
      "Erro ao enviar recuperação de senha:",
      error
    );

    redirect(
      "/recuperar-senha?error=envio"
    );
  }

  redirect(
    "/recuperar-senha?sent=1"
  );
}
