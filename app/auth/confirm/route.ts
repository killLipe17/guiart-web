import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function getSafeNextPath(
  value: string | null
) {
  if (
    value &&
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/definir-senha";
}

function buildRedirectUrl(
  request: Request,
  pathname: string
) {
  const requestUrl =
    new URL(request.url);

  const forwardedHost =
    request.headers.get(
      "x-forwarded-host"
    );

  const forwardedProtocol =
    request.headers.get(
      "x-forwarded-proto"
    );

  if (forwardedHost) {
    const protocol =
      forwardedProtocol ?? "https";

    return `${protocol}://${forwardedHost}${pathname}`;
  }

  return new URL(
    pathname,
    requestUrl.origin
  ).toString();
}

export async function GET(
  request: Request
) {
  const requestUrl =
    new URL(request.url);

  const code =
    requestUrl.searchParams.get(
      "code"
    );

  const tokenHash =
    requestUrl.searchParams.get(
      "token_hash"
    );

  const type =
    requestUrl.searchParams.get(
      "type"
    );

  const next = getSafeNextPath(
    requestUrl.searchParams.get(
      "next"
    )
  );

  const supabase =
    await createClient();

  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(
        code
      );

    if (!error) {
      return NextResponse.redirect(
        buildRedirectUrl(
          request,
          next
        )
      );
    }

    console.error(
      "Erro ao trocar código por sessão:",
      error
    );
  }

  if (tokenHash && type) {
    const { error } =
      await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as EmailOtpType,
      });

    if (!error) {
      return NextResponse.redirect(
        buildRedirectUrl(
          request,
          next
        )
      );
    }

    console.error(
      "Erro ao verificar token de autenticação:",
      error
    );
  }

  return NextResponse.redirect(
    buildRedirectUrl(
      request,
      "/admin/login?error=link-invalido"
    )
  );
}
