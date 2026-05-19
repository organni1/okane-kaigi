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
    .maybeSingle();

  if (!wallet) redirect(`/parent/wallet?error=${encodeURIComponent("この子どものwalletが見つかりません。子どもプロフィールを作り直すか、初期設定を確認してください。")}`);

  const current = Number(wallet.balance);
  const isDecrease = parsed.data.transaction_type === "spending";
  const nextBalance = isDecrease ? current - parsed.data.amount : current + parsed.data.amount;
  if (nextBalance < 0) redirect(`/parent/wallet?error=${encodeURIComponent("今あるお金より大きい金額は減らせません")}`);

  const { error: walletError } = await supabase.from("wallets").update({ balance: nextBalance }).eq("id", wallet.id).eq("parent_user_id", user.id);
  if (walletError) redirect(`/parent/wallet?error=${encodeURIComponent("残高の更新に失敗しました。少し時間をおいて再度お試しください。")}`);

  const { error: transactionError } = await supabase.from("wallet_transactions").insert({
    parent_user_id: user.id,
    child_profile_id: parsed.data.child_profile_id,
    wallet_id: wallet.id,
    transaction_type: parsed.data.transaction_type,
    amount: parsed.data.amount,
    category: parsed.data.category,
    memo: parsed.data.memo,
    created_by_role: "parent",
  });
  if (transactionError) redirect(`/parent/wallet?error=${encodeURIComponent("お金のきろく保存に失敗しました。残高を確認してください。")}`);

  redirect("/parent/wallet?saved=1");
}

export async function markWishItemPurchased(formData: FormData) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const wishItemId = String(formData.get("wish_item_id") ?? "");
  const consultationId = String(formData.get("consultation_id") ?? "");

  const { data: item } = await supabase.from("wish_items").select("*").eq("id", wishItemId).eq("parent_user_id", user.id).maybeSingle();
  if (!item) redirect(`/parent/consultations/${consultationId}?error=${encodeURIComponent("ほしいものが見つかりません")}`);
  if (item.status !== "approved") {
    redirect(`/parent/consultations/${consultationId}?error=${encodeURIComponent("OKになった相談だけ購入済みにできます")}`);
  }

  const { data: wallet } = await supabase.from("wallets").select("*").eq("child_profile_id", item.child_profile_id).eq("parent_user_id", user.id).maybeSingle();
  if (!wallet) redirect(`/parent/consultations/${consultationId}?error=${encodeURIComponent("この子どものwalletが見つかりません")}`);

  const price = Number(item.price);
  const nextBalance = Number(wallet.balance) - price;
  if (nextBalance < 0) redirect(`/parent/consultations/${consultationId}?error=${encodeURIComponent("今あるお金が足りません")}`);

  const { error: walletError } = await supabase.from("wallets").update({ balance: nextBalance }).eq("id", wallet.id).eq("parent_user_id", user.id);
  if (walletError) redirect(`/parent/consultations/${consultationId}?error=${encodeURIComponent("残高の更新に失敗しました")}`);

  const { error: transactionError } = await supabase.from("wallet_transactions").insert({
    parent_user_id: user.id,
    child_profile_id: item.child_profile_id,
    wallet_id: wallet.id,
    transaction_type: "spending",
    amount: price,
    category: item.category,
    memo: `${item.title}を購入`,
    related_wish_item_id: item.id,
    created_by_role: "parent",
  });
  if (transactionError) redirect(`/parent/consultations/${consultationId}?error=${encodeURIComponent("購入のきろく保存に失敗しました")}`);

  await supabase
    .from("wish_items")
    .update({ status: "purchased", purchased_at: new Date().toISOString() })
    .eq("id", item.id)
    .eq("parent_user_id", user.id);

  redirect(`/parent/consultations/${consultationId}?saved=1`);
}
