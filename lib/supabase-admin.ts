import "server-only";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "A variável NEXT_PUBLIC_SUPABASE_URL não foi configurada."
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "A variável SUPABASE_SERVICE_ROLE_KEY não foi configurada."
  );
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);