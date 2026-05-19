"use server";

import { redirect } from "next/navigation";
import { DECISION_TO_STATUS } from "@/lib/constants/statuses";
import { getSessionUser } from "@/lib/supabase/server";
import { consultationDecisionSchema, prePurchaseCheckSchema } from "@/lib/validations/consultation";

export async function submitPrePurchaseCheckAndConsultation(formData: FormData) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const parsed = prePurchaseCheckSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    redirect(`/child/${formData.get("child_profile_id")}/wish-items/${formData.get("wish_item_id")}/check?error=${encodeURIComponent("入力内容を確認してください")}`);
  }

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
  if (checkError) {
    redirect(`/child/${parsed.data.child_profile_id}/wish-items/${parsed.data.wish_item_id}/check?error=${encodeURIComponent("買う前チェックの保存に失敗しました")}`);
  }

  const { data: existingConsultation, error: existingError } = await supabase
    .from("consultations")
    .select("id,status")
    .eq("parent_user_id", user.id)
    .eq("wish_item_id", parsed.data.wish_item_id)
    .maybeSingle();

  if (existingError) {
    redirect(`/child/${parsed.data.child_profile_id}/wish-items/${parsed.data.wish_item_id}/check?error=${encodeURIComponent("相談状況の確認に失敗しました")}`);
  }

  if (!existingConsultation) {
    const { error: insertError } = await supabase.from("consultations").insert({
      parent_user_id: user.id,
      child_profile_id: parsed.data.child_profile_id,
      wish_item_id: parsed.data.wish_item_id,
      status: "open",
    });
    if (insertError) {
      redirect(`/child/${parsed.data.child_profile_id}/wish-items/${parsed.data.wish_item_id}/check?error=${encodeURIComponent("親への相談作成に失敗しました")}`);
    }
    await supabase.from("wish_items").update({ status: "consulting" }).eq("id", parsed.data.wish_item_id).eq("parent_user_id", user.id);
  } else if (existingConsultation.status === "open") {
    await supabase.from("wish_items").update({ status: "consulting" }).eq("id", parsed.data.wish_item_id).eq("parent_user_id", user.id);
  }

  redirect(`/child/${parsed.data.child_profile_id}/wish-items/${parsed.data.wish_item_id}/result`);
}

export async function decideConsultation(formData: FormData) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const parsed = consultationDecisionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    redirect(`/parent/consultations/${formData.get("consultation_id")}?error=${encodeURIComponent("入力内容を確認してください")}`);
  }

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
    .maybeSingle();

  if (error || !consultation) {
    redirect(`/parent/consultations/${parsed.data.consultation_id}?error=${encodeURIComponent("保存に失敗しました。相談が存在するか確認してください。")}`);
  }

  const { error: wishError } = await supabase
    .from("wish_items")
    .update({ status: DECISION_TO_STATUS[parsed.data.parent_decision] })
    .eq("id", consultation.wish_item_id)
    .eq("parent_user_id", user.id);

  if (wishError) {
    redirect(`/parent/consultations/${parsed.data.consultation_id}?error=${encodeURIComponent("判断は保存されましたが、ほしいものの状態更新に失敗しました")}`);
  }

  redirect(`/parent/consultations/${parsed.data.consultation_id}?saved=1`);
}
