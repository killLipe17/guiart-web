"use server";

import { redirect } from "next/navigation";

import { isAllowedAdminEmail } from "@/lib/auth/admin-emails";
import { createClient } from "@/lib/supabase/server";

const MIN_PASSWORD_LENGTH = 8;

export async function setPasswordAction(
  formData: FormData
) {
  const password = String(
    formData.get("password") ?? ""
  );

  const passwordConfirmation = String(
    formData.get(
      "passwordConfirmation"
    ) ?? ""
  );

  if (
    password.length <
    MIN_PASSWORD_LENGTH
  ) {
    redirect(
      "/definir-senha?error=senha-curta"
    );
  }

  if (
    password !==
    passwordConfirmation
  ) {
    redirect(
      "/definir-senha?error=senhas-diferentes"
    );
  }

  const supabase =
    await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (
    userError ||
    !user ||
    !isAllowedAdminEmail(user.email)
  ) {
    await supabase.auth.signOut();

    redirect(
      "/admin/login?error=sessao-invalida"
    );
  }

  const { error } =
    await supabase.auth.updateUser({
      password,
    });

  if (error) {
    console.error(
      "Erro ao definir nova senha:",
      error
    );

    redirect(
      "/definir-senha?error=atualizacao"
    );
  }

  await supabase.auth.signOut();

  redirect(
    "/admin/login?passwordUpdated=1"
  );
}
