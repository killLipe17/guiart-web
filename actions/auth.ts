"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginActionState = {
  success: boolean;
  message: string;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      success: false,
      message: "Informe o e-mail e a senha.",
    };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail) {
    return {
      success: false,
      message: "O e-mail administrativo não foi configurado.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      success: false,
      message: "E-mail ou senha incorretos.",
    };
  }

  const loggedUserEmail = data.user.email?.trim().toLowerCase();

  if (loggedUserEmail !== adminEmail) {
    await supabase.auth.signOut();
    return {
      success: false,
      message: "Este usuário não possui acesso administrativo.",
    };
  }

  redirect("/admin/produtos");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Erro ao encerrar sessão:", error);
  }

  redirect("/admin/login");
}
