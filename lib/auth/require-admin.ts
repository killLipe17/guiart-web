import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const adminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const userEmail =
    user?.email?.trim().toLowerCase();

  const isAuthorizedAdmin =
    !error &&
    Boolean(user) &&
    Boolean(adminEmail) &&
    userEmail === adminEmail;

  if (!isAuthorizedAdmin) {
    redirect("/admin/login");
  }

  return user;
}