"use server";

import { redirect } from "next/navigation";

import {
  getAllowedAdminEmails,
  isAllowedAdminEmail,
  normalizeEmail,
} from "@/lib/auth/admin-emails";
import { createClient } from "@/lib/supabase/server";

export type LoginActionState = {
  success: boolean;
  message: string;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = normalizeEmail(
    String(formData.get("email") ?? "")
  );

  const password = String(
    formData.get("password") ?? ""
  );

  if (!email || !password) {
    return {
      success: false,
      message:
        "Informe o e-mail e a senha.",
    };
  }

  const allowedAdminEmails =
    getAllowedAdminEmails();

  if (allowedAdminEmails.size === 0) {
    return {
      success: false,
      message:
        "Nenhum e-mail administrativo foi configurado.",
    };
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error || !data.user) {
    return {
      success: false,
      message:
        "E-mail ou senha incorretos.",
    };
  }

  if (
    !isAllowedAdminEmail(
      data.user.email
    )
  ) {
    await supabase.auth.signOut();

    return {
      success: false,
      message:
        "Este usuário não possui acesso administrativo.",
    };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase =
    await createClient();

  const { error } =
    await supabase.auth.signOut();

  if (error) {
    console.error(
      "Erro ao encerrar sessão:",
      error
    );
  }

  redirect("/admin/login");
}