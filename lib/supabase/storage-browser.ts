"use client";

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

let storageClient:
  | SupabaseClient
  | null = null;

export function getStorageBrowserClient() {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey
  ) {
    throw new Error(
      "As configurações públicas do Supabase não estão disponíveis."
    );
  }

  if (!storageClient) {
    storageClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }

  return storageClient;
}
