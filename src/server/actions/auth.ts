"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authSchema } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/server";

function authErrorMessage(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("email not confirmed")) {
    return "確認メールのリンクを開いてからログインしてください";
  }
  if (normalized.includes("invalid login credentials")) {
    return "メールアドレスまたはパスワードが違います";
  }
  return message;
}

export async function signUpAction(formData: FormData) {
  const parsed = authSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/signup?error=${encodeURIComponent("入力内容を確認してください")}`);

  const supabase = await createClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/setup/child`,
    },
  });
  if (error || !data.user) redirect(`/signup?error=${encodeURIComponent(error?.message ?? "登録に失敗しました")}`);

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

export async function loginAction(formData: FormData) {
  const parsed = authSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/login?error=${encodeURIComponent("入力内容を確認してください")}`);

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
