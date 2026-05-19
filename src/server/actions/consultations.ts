"use server";

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";
import { prePurchaseCheckSchema, consultationDecisionSchema } from "@/lib/validations/consultation";
import { DECISION_TO_STATUS } from "@/lib/constants/statuses";

export async function submitPrePurchaseCheckAndConsultation(formData: FormData) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const parsed = prePurchaseCheckSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/child/${formData.get("child_profile_id")}/wish-items/${formData.get("wish_item_id")}/check?error=${encodeURIComponent("入力内容を確認してください")}`);

  const payload = {
    parent_user_id: user.id,
    child_profile_id: parsed.data.child_profile_id,
    wish_item_id: parsed.data.wish_item_id,
    need_or_want: parsed.data.need_or_want,
    reason_text: parsed.data.reason_text,
    already_have_similar: parsed.data.already_have_similar ?? false,
    wait_choice: parsed.data.wait_choice,
    expected_usage: parsed.data.expected_usage,
    child_payment_ratio: parsed.data.child_payment_ratio ?? 100,
    remaining_balance_after_purchase: parsed.data.remaining_balance_after_purchase,
    completed_at: new Date().toISOString(),
  };

  const { error: checkError } = await supabase.from("pre_purchase_checks").upsert(payload, { onConflict: "wish_item_id" });
  if (checkError) redirect(`/child/${parsed.data.child_profile_id}/wish-items/${parsed.data.wish_item_id}/check?error=${encodeURIComponent(checkError.message)}`);

  await supabase.from("wish_items").update({ status: "consulting" }).eq("id", parsed.data.wish_item_id);
  await supabase.from("consultations").insert({
    parent_user_id: user.id,
    child_profile_id: parsed.data.child_profile_id,
    wish_item_id: parsed.data.wish_item_id,
    status: "open",
  });

  redirect(`/child/${parsed.data.child_profile_id}/wish-items/${parsed.data.wish_item_id}/result`);
}

export async function decideConsultation(formData: FormData) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const parsed = consultationDecisionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/parent/consultations/${formData.get("consultation_id")}?error=${encodeURIComponent("入力内容を確認してください")}`);

  const { data: consultation, error } = await supabase
    .from("consultations")
    .update({
      parent_decision: parsed.data.parent_decision,
      parent_comment: parsed.data.parent_comment,
      status: "closed",
      decided_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.consultation_id)
    .eq("parent_user_id", user.id)
    .select("wish_item_id")
    .single();

  if (error || !consultation) redirect(`/parent/consultations/${parsed.data.consultation_id}?error=${encodeURIComponent(error?.message ?? "保存に失敗しました")}`);

  await supabase
    .from("wish_items")
    .update({ status: DECISION_TO_STATUS[parsed.data.parent_decision] })
    .eq("id", consultation.wish_item_id)
    .eq("parent_user_id", user.id);

  redirect(`/parent/consultations/${parsed.data.consultation_id}?saved=1`);
}
