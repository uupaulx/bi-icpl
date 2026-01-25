import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Handle error from OAuth provider
  const errorFromUrl = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (errorFromUrl) {
    console.error("OAuth error:", errorFromUrl, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=oauth_error&message=${encodeURIComponent(errorDescription || errorFromUrl)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange code error:", error.message);
      return NextResponse.redirect(
        `${origin}/login?error=auth_callback_error&message=${encodeURIComponent(error.message)}`
      );
    }

    // Successfully exchanged code for session
    console.log("Auth successful for:", data.user?.email);

    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // No code provided
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
