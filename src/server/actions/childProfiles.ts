"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { markChildModeVerified } from "@/lib/auth/childMode";
import { getSessionUser } from "@/lib/supabase/server";
import { childProfileSchema, pinSchema } from "@/lib/validations/child";

function firstValidationMessage(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? "入力内容を確認してください";
}

function setupChildRedirect(formData: FormData, error: string): never {
  const params = new URLSearchParams({
    error,
    nickname: String(formData.get("nickname") ?? ""),
    age_group: String(formData.get("age_group") ?? "age_6_8"),
    currency_label: String(formData.get("currency_label") ?? "円"),
    initial_balance: String(formData.get("initial_balance") ?? "0"),
  });

  redirect(`/setup/child?${params.toString()}`);
}

function childCreateErrorMessage(message?: string) {
  if (!message) return "子どもプロフィールの作成に失敗しました。入力内容を確認してください。";
  if (message.includes("child_profiles_age_group_check")) {
    return "この年齢グループはDB側でまだ許可されていません。Supabase SQLの年齢グループ制約を更新してください。";
  }
  if (message.includes("child_profiles_nickname_check")) {
    return "ニックネームは30文字以内で入力してください。";
  }
  return "子どもプロフィールの作成に失敗しました。入力内容を確認してください。";
}

export async function createChildProfileWithWallet(formData: FormData) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const parsed = childProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) setupChildRedirect(formData, firstValidationMessage(parsed.error));

  const nextAction = formData.get("next_action") === "add_another" ? "add_another" : "dashboard";
  const pinHash = parsed.data.pin ? await bcrypt.hash(parsed.data.pin, 10) : null;
  const { data: child, error: childError } = await supabase
    .from("child_profiles")
    .insert({
      parent_user_id: user.id,
      nickname: parsed.data.nickname,
      age_group: parsed.data.age_group,
      avatar_id: parsed.data.avatar_id,
      currency_label: parsed.data.currency_label,
      pin_hash: pinHash,
      is_active: true,
    })
    .select("*")
    .single();

  if (childError || !child) {
    setupChildRedirect(formData, childCreateErrorMessage(childError?.message));
  }

  const { data: wallet, error: walletError } = await supabase
    .from("wallets")
    .insert({ child_profile_id: child.id, parent_user_id: user.id, balance: parsed.data.initial_balance })
    .select("*")
    .single();

  if (walletError || !wallet) {
    setupChildRedirect(formData, "お金の入れものを作成できませんでした。子どもプロフィールを確認してください。");
  }

  if (parsed.data.initial_balance > 0) {
    await supabase.from("wallet_transactions").insert({
      parent_user_id: user.id,
      child_profile_id: child.id,
      wallet_id: wallet.id,
      transaction_type: "income",
      amount: parsed.data.initial_balance,
      category: "initial",
      memo: "最初にあるお金",
      created_by_role: "parent",
    });
  }

  await supabase.from("parent_profiles").upsert(
    {
      user_id: user.id,
      display_name: user.email?.split("@")[0] ?? null,
      onboarding_completed: true,
    },
    { onConflict: "user_id" },
  );

  if (nextAction === "add_another") redirect("/setup/child?created=1");
  redirect("/parent/dashboard");
}

export async function verifyChildPin(childId: string, formData: FormData) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const parsed = pinSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/child/${childId}/pin?error=${encodeURIComponent(firstValidationMessage(parsed.error))}`);

  const { data: child } = await supabase
    .from("child_profiles")
    .select("id,pin_hash")
    .eq("id", childId)
    .eq("parent_user_id", user.id)
    .maybeSingle();

  if (!child) redirect("/child/select");
  if (!child.pin_hash) redirect(`/child/${childId}/home`);

  const ok = await bcrypt.compare(parsed.data.pin, child.pin_hash);
  if (!ok) redirect(`/child/${childId}/pin?error=${encodeURIComponent("PINが違います")}`);

  await markChildModeVerified(childId);
  redirect(`/child/${childId}/home`);
}
