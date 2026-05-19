import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(request: NextRequest) {
  const rawNext = request.nextUrl.searchParams.get("next") ?? "/setup/child";
  try {
    const parsed = new URL(rawNext, request.nextUrl.origin);
    if (parsed.origin !== request.nextUrl.origin) return "/setup/child";
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return "/setup/child";
  }
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(request);

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/login?error=確認リンクが正しくありません", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("確認リンクの有効期限が切れているか、すでに使用されています")}`, request.url),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("parent_profiles").upsert(
      {
        user_id: user.id,
        display_name: user.email?.split("@")[0] ?? null,
        onboarding_completed: false,
      },
      { onConflict: "user_id" },
    );
  }

  return NextResponse.redirect(new URL(next, request.url));
}
