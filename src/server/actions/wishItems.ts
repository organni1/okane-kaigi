"use server";

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";
import { wishItemSchema } from "@/lib/validations/wishItem";

export async function createWishItem(formData: FormData) {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const parsed = wishItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    redirect(`/child/${formData.get("child_profile_id")}/wish-items/new?error=${encodeURIComponent("入力内容を確認してください")}`);
  }

  const { data, error } = await supabase
    .from("wish_items")
    .insert({
      parent_user_id: user.id,
      child_profile_id: parsed.data.child_profile_id,
      title: parsed.data.title,
      price: parsed.data.price,
      category: parsed.data.category,
      category_note: parsed.data.category_note,
      reason: parsed.data.reason,
      found_place: parsed.data.found_place,
      desire_level: parsed.data.desire_level,
      status: "checking",
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/child/${parsed.data.child_profile_id}/wish-items/new?error=${encodeURIComponent("ほしいものの登録に失敗しました。入力内容を確認して再度お試しください。")}`);
  }

  redirect(`/child/${parsed.data.child_profile_id}/wish-items/${data.id}/check`);
}
