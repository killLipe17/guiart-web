import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

import { isAllowedAdminEmail } from "@/lib/auth/admin-emails";

function copyCookies(
  sourceResponse: NextResponse,
  targetResponse: NextResponse
) {
  sourceResponse.cookies
    .getAll()
    .forEach((cookie) => {
      targetResponse.cookies.set(cookie);
    });

  return targetResponse;
}

export async function updateSession(
  request: NextRequest
) {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "A variável NEXT_PUBLIC_SUPABASE_URL não foi configurada."
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "A variável NEXT_PUBLIC_SUPABASE_ANON_KEY não foi configurada."
    );
  }

  let supabaseResponse =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({ name, value }) => {
                request.cookies.set(
                  name,
                  value
                );
              }
            );

            supabaseResponse =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                supabaseResponse.cookies.set(
                  name,
                  value,
                  options
                );
              }
            );
          },
        },
      }
    );

  const { data, error } =
    await supabase.auth.getClaims();

  const claims = data?.claims as
    | {
        email?: string;
      }
    | undefined;

  const isAuthorizedAdmin =
    !error &&
    isAllowedAdminEmail(
      claims?.email
    );

  const pathname =
    request.nextUrl.pathname;

  const isAdminRoute =
    pathname.startsWith("/admin");

  const isLoginRoute =
    pathname === "/admin/login";

  if (
    isAdminRoute &&
    !isLoginRoute &&
    !isAuthorizedAdmin
  ) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname =
      "/admin/login";

    loginUrl.search = "";

    return copyCookies(
      supabaseResponse,
      NextResponse.redirect(loginUrl)
    );
  }

  if (
    isLoginRoute &&
    isAuthorizedAdmin
  ) {
    const adminUrl =
      request.nextUrl.clone();

    adminUrl.pathname = "/admin";
    adminUrl.search = "";

    return copyCookies(
      supabaseResponse,
      NextResponse.redirect(adminUrl)
    );
  }

  return supabaseResponse;
}