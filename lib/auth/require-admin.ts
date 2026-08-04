import "server-only";

import { redirect } from "next/navigation";

import { isAllowedAdminEmail } from "@/lib/auth/admin-emails";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase =
    await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isAuthorizedAdmin =
    !error &&
    Boolean(user) &&
    isAllowedAdminEmail(user?.email);

  if (!isAuthorizedAdmin) {
    redirect("/admin/login");
  }

  return user;
}