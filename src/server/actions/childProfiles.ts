"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";
import { childProfileSchema, pinSchema } from "@/lib/validations/child";

export async function createChildProfileWithWallet(formData: FormData) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const parsed = childProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/setup/child?error=${encodeURIComponent("入力内容を確認してください")}`);

  const pinHash = await bcrypt.hash(parsed.data.pin, 10);
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

  if (childError || !child) redirect(`/setup/child?error=${encodeURIComponent(childError?.message ?? "作成に失敗しました")}`);

  const { data: wallet, error: walletError } = await supabase
    .from("wallets")
    .insert({ child_profile_id: child.id, parent_user_id: user.id, balance: parsed.data.initial_balance })
    .select("*")
    .single();

  if (walletError || !wallet) redirect(`/setup/child?error=${encodeURIComponent(walletError?.message ?? "wallet作成に失敗しました")}`);

  if (parsed.data.initial_balance > 0) {
    await supabase.from("wallet_transactions").insert({
      parent_user_id: user.id,
      child_profile_id: child.id,
      wallet_id: wallet.id,
      transaction_type: "income",
      amount: parsed.data.initial_balance,
      category: "initial",
      memo: "初期残高",
      created_by_role: "parent",
    });
  }

  await supabase
    .from("parent_profiles")
    .upsert({ user_id: user.id, onboarding_completed: true }, { onConflict: "user_id" });

  redirect("/parent/dashboard");
}

export async function verifyChildPin(childId: string, formData: FormData) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const parsed = pinSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/child/${childId}/pin?error=${encodeURIComponent("PINは4桁の数字です")}`);

  const { data: child } = await supabase
    .from("child_profiles")
    .select("id,pin_hash")
    .eq("id", childId)
    .eq("parent_user_id", user.id)
    .single();

  if (!child?.pin_hash) redirect(`/child/${childId}/pin?error=${encodeURIComponent("PINが設定されていません")}`);

  const ok = await bcrypt.compare(parsed.data.pin, child.pin_hash);
  if (!ok) redirect(`/child/${childId}/pin?error=${encodeURIComponent("PINが違います")}`);

  redirect(`/child/${childId}/home`);
}
