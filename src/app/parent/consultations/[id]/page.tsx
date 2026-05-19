export const dynamic = "force-dynamic";

import Image from "next/image";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ParentShell } from "@/components/layout/ParentShell";
import { ConversationGuideCard } from "@/components/parent/ConversationGuideCard";
import { ConsultationDecisionForm } from "@/components/parent/ConsultationDecisionForm";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { StatusBadge } from "@/components/common/StatusBadge";
import { categoryImage, categoryLabel } from "@/lib/constants/categories";
import { getSessionUser } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { markWishItemPurchased } from "@/server/actions/wallet";

export default async function ConsultationDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const { data: consultation } = await supabase
    .from("consultations")
    .select("*, child_profiles(*), wish_items(*), pre_purchase_checks(*)")
    .eq("id", id)
    .eq("parent_user_id", user.id)
    .single();
  if (!consultation) redirect("/parent/consultations");

  const item = consultation.wish_items;
  const child = consultation.child_profiles;
  const check = Array.isArray(consultation.pre_purchase_checks) ? consultation.pre_purchase_checks[0] : consultation.pre_purchase_checks;
  const { data: wallet } = await supabase.from("wallets").select("*").eq("child_profile_id", consultation.child_profile_id).single();
  const { data: guide } = await supabase
    .from("conversation_guides")
    .select("*")
    .eq("is_active", true)
    .or(`category.eq.${item?.category ?? "other"},category.is.null`)
    .order("sort_order")
    .limit(1)
    .maybeSingle();

  return (
    <ParentShell>
      <PageHeader title="相談詳細" backHref="/parent/consultations" />
      <div className="grid gap-5">
        <ErrorMessage message={query.error} />
        {query.saved ? <p className="rounded-2xl bg-green-50 px-4 py-3 font-bold text-green-700">保存しました</p> : null}
        <p className="flex items-center gap-3 text-xl font-black">
          <Image src="/assets/images/mascot-shiba-normal.png" alt="" width={56} height={56} className="rounded-full bg-yellow-50" />
          {child?.nickname}さんの相談
        </p>
        <section className="soft-card grid gap-4 rounded-[2rem] p-5">
          <div className="grid grid-cols-[110px_1fr] gap-4">
            <Image src={categoryImage(item?.category)} alt="" width={110} height={110} className="rounded-full bg-blue-50 p-3" />
            <div>
              <h1 className="text-3xl font-black">{item?.title}</h1>
              <p className="text-4xl font-black">{formatCurrency(item?.price)}</p>
              <p className="font-bold text-gray-600">カテゴリ: {categoryLabel(item?.category)}</p>
              <p className="font-bold text-gray-600">理由: {item?.reason || "未入力"}</p>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center rounded-3xl bg-orange-50 p-4 text-center">
            <div><p className="font-bold text-gray-500">今あるお金</p><p className="text-3xl font-black">{formatCurrency(wallet?.balance)}</p></div>
            <span className="text-3xl font-black text-orange-500">→</span>
            <div><p className="font-bold text-gray-500">買った後</p><p className="text-3xl font-black">{formatCurrency(check?.remaining_balance_after_purchase)}</p></div>
          </div>
          <StatusBadge status={item?.status ?? "consulting"} />
        </section>
        <section className="soft-card rounded-3xl p-5">
          <h2 className="mb-3 text-xl font-black">買う前チェック</h2>
          <div className="grid gap-2 font-bold">
            <p>どっち？: {check?.need_or_want === "need" ? "必要なもの" : check?.need_or_want === "want" ? "ほしいもの" : "まだ分からない"}</p>
            <p>理由: {check?.reason_text || "未入力"}</p>
            <p>似たもの: {check?.already_have_similar ? "持っている" : "持っていない"}</p>
            <p>使いそう？: {check?.expected_usage || "未入力"}</p>
          </div>
        </section>
        <ConversationGuideCard guide={guide} />
        {item?.status === "approved" ? (
          <form action={markWishItemPurchased} className="soft-card grid gap-3 rounded-3xl p-5">
            <input type="hidden" name="consultation_id" value={consultation.id} />
            <input type="hidden" name="wish_item_id" value={item.id} />
            <p className="font-bold text-gray-600">購入したら、子どもの今あるお金から金額を引いて「買ったもの」にできます。</p>
            <button className="min-h-12 rounded-2xl bg-blue-600 px-4 py-3 text-lg font-black text-white">
              購入済みにして残高から引く
            </button>
          </form>
        ) : null}
        <ConsultationDecisionForm consultationId={consultation.id} />
      </div>
    </ParentShell>
  );
}
