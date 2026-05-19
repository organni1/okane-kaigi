"use server";

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";
import { walletTransactionSchema } from "@/lib/validations/wallet";

export async function adjustWalletBalance(formData: FormData) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const parsed = walletTransactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/parent/wallet?error=${encodeURIComponent("入力内容を確認してください")}`);

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("child_profile_id", parsed.data.child_profile_id)
    .eq("parent_user_id", user.id)
    .single();

  if (!wallet) redirect(`/parent/wallet?error=${encodeURIComponent("walletが見つかりません")}`);

  const current = Number(wallet.balance);
  const isDecrease = parsed.data.transaction_type === "spending" || parsed.data.transaction_type === "adjustment";
  const nextBalance = isDecrease ? current - parsed.data.amount : current + parsed.data.amount;
  if (nextBalance < 0) redirect(`/parent/wallet?error=${encodeURIComponent("今あるお金は0未満にできません")}`);

  await supabase.from("wallets").update({ balance: nextBalance }).eq("id", wallet.id);
  await supabase.from("wallet_transactions").insert({
    parent_user_id: user.id,
    child_profile_id: parsed.data.child_profile_id,
    wallet_id: wallet.id,
    transaction_type: parsed.data.transaction_type,
    amount: parsed.data.amount,
    category: parsed.data.category,
    memo: parsed.data.memo,
    created_by_role: "parent",
  });

  redirect("/parent/wallet?saved=1");
}
