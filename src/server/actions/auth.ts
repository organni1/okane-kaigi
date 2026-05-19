"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authSchema } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/server";

const resendSchema = z.object({
  email: z.string().email("メールアドレスを入力してください"),
});

function authErrorMessage(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("email not confirmed")) {
    return "確認メールのリンクを開いてからログインしてください";
  }
  if (normalized.includes("invalid login credentials")) {
    return "メールアドレスまたはパスワードが違います";
  }
  if (normalized.includes("rate limit")) {
    return "短時間にメールを送りすぎています。少し待ってから再度お試しください";
  }
  if (normalized.includes("password")) {
    return "パスワードの条件を確認してください";
  }
  return message;
}

function firstValidationMessage(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? "入力内容を確認してください";
}

async function currentOrigin() {
  const headerStore = await headers();
  return headerStore.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signUpAction(formData: FormData) {
  const parsed = authSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/signup?error=${encodeURIComponent(firstValidationMessage(parsed.error))}`);

  const supabase = await createClient();
  const origin = await currentOrigin();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/setup/child`,
    },
  });
  if (error || !data.user) redirect(`/signup?error=${encodeURIComponent(authErrorMessage(error?.message ?? "登録に失敗しました"))}`);

  if (data.session) {
    await supabase.from("parent_profiles").upsert(
      {
        user_id: data.user.id,
        display_name: parsed.data.email.split("@")[0],
        onboarding_completed: false,
      },
      { onConflict: "user_id" },
    );
  }

  redirect(`/signup/check-email?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function resendConfirmationEmail(formData: FormData) {
  const parsed = resendSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    redirect(`/signup/check-email?error=${encodeURIComponent(firstValidationMessage(parsed.error))}`);
  }

  const supabase = await createClient();
  const origin = await currentOrigin();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/setup/child`,
    },
  });

  if (error) {
    redirect(`/signup/check-email?email=${encodeURIComponent(parsed.data.email)}&error=${encodeURIComponent(authErrorMessage(error.message))}`);
  }

  redirect(`/signup/check-email?email=${encodeURIComponent(parsed.data.email)}&resent=1`);
}

export async function loginAction(formData: FormData) {
  const parsed = authSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/login?error=${encodeURIComponent("メールアドレスとパスワードを入力してください")}`);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) redirect(`/login?error=${encodeURIComponent(authErrorMessage(error.message))}`);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { count } = await supabase
    .from("child_profiles")
    .select("id", { count: "exact", head: true })
    .eq("parent_user_id", user.id)
    .eq("is_active", true);

  redirect(count ? "/parent/dashboard" : "/setup/child");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
