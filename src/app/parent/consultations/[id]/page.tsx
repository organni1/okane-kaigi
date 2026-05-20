export const dynamic = "force-dynamic";

import Image from "next/image";
import { redirect } from "next/navigation";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import { ParentShell } from "@/components/layout/ParentShell";
import { ConsultationDecisionForm } from "@/components/parent/ConsultationDecisionForm";
import { ConversationGuideCard } from "@/components/parent/ConversationGuideCard";
import { categoryImage, categoryLabel } from "@/lib/constants/categories";
import { getSessionUser } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { markWishItemPurchased } from "@/server/actions/wallet";
import type { ChildProfile, WishItem } from "@/types/database";

type ConsultationDetail = {
  id: string;
  child_profile_id: string;
  wish_item_id: string;
  wish_items: WishItem | WishItem[] | null;
  child_profiles: ChildProfile | ChildProfile[] | null;
};

function firstOrNull<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

function needOrWantLabel(value?: string | null) {
  if (value === "need") return "必要なもの";
  if (value === "want") return "ほしいもの";
  return "まだ分からない";
}

function expectedUsageLabel(value?: string | null) {
  if (value === "often") return "よく使う";
  if (value === "sometimes") return "ときどき使う";
  if (value === "rarely") return "あまり使わない";
  return "未入力";
}

export default async function ConsultationDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const { data: consultation } = await supabase
    .from("consultations")
    .select("*, child_profiles(*), wish_items(*)")
    .eq("id", id)
    .eq("parent_user_id", user.id)
    .maybeSingle();
  if (!consultation) redirect(`/parent/consultations?error=${encodeURIComponent("相談が見つかりません")}`);

  const detail = consultation as ConsultationDetail;
  const item = firstOrNull(detail.wish_items);
  const child = firstOrNull(detail.child_profiles);
  if (!item || !child) redirect(`/parent/consultations?error=${encodeURIComponent("相談に必要なデータが見つかりません")}`);

  const { data: wallet } = await supabase.from("wallets").select("*").eq("child_profile_id", detail.child_profile_id).eq("parent_user_id", user.id).maybeSingle();
  const { data: check } = await supabase
    .from("pre_purchase_checks")
    .select("*")
    .eq("wish_item_id", detail.wish_item_id)
    .eq("parent_user_id", user.id)
    .maybeSingle();
  const { data: guide } = await supabase
    .from("conversation_guides")
    .select("*")
    .eq("is_active", true)
    .or(`category.eq.${item.category ?? "other"},category.is.null`)
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
          {child.nickname}さんの相談
        </p>
        <section className="soft-card grid gap-4 rounded-[2rem] p-5">
          <div className="grid grid-cols-[110px_1fr] gap-4">
            <Image src={categoryImage(item.category)} alt="" width={110} height={110} className="rounded-full bg-blue-50 p-3" />
            <div>
              <h1 className="text-3xl font-black">{item.title}</h1>
              <p className="text-4xl font-black">{formatCurrency(item.price)}</p>
              <p className="font-bold text-gray-600">カテゴリ: {categoryLabel(item.category)}</p>
              <p className="font-bold text-gray-600">理由: {item.reason || "未入力"}</p>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center rounded-3xl bg-orange-50 p-4 text-center">
            <div>
              <p className="font-bold text-gray-500">今あるお金</p>
              <p className="text-3xl font-black">{formatCurrency(wallet?.balance)}</p>
            </div>
            <span className="text-3xl font-black text-orange-500">→</span>
            <div>
              <p className="font-bold text-gray-500">買った後</p>
              <p className="text-3xl font-black">{formatCurrency(check?.remaining_balance_after_purchase)}</p>
            </div>
          </div>
          <StatusBadge status={item.status ?? "consulting"} />
        </section>
        <section className="soft-card rounded-3xl p-5">
          <h2 className="mb-3 text-xl font-black">買う前チェック</h2>
          <div className="grid gap-2 font-bold">
            <p>これはどっち？: {needOrWantLabel(check?.need_or_want)}</p>
            <p>理由: {check?.reason_text || "未入力"}</p>
            <p>似たもの: {check?.already_have_similar ? "持っている" : "持っていない"}</p>
            <p>使いそう？: {expectedUsageLabel(check?.expected_usage)}</p>
          </div>
        </section>
        <ConversationGuideCard guide={guide} />
        {item.status === "approved" ? (
          <form action={markWishItemPurchased} className="soft-card grid gap-3 rounded-3xl p-5">
            <input type="hidden" name="consultation_id" value={detail.id} />
            <input type="hidden" name="wish_item_id" value={item.id} />
            <p className="font-bold text-gray-600">購入したら、子どもの今あるお金から金額を引いて「買ったもの」にできます。</p>
            <button className="min-h-12 rounded-2xl bg-blue-600 px-4 py-3 text-lg font-black text-white">
              購入済みにして残高から引く
            </button>
          </form>
        ) : null}
        <ConsultationDecisionForm consultationId={detail.id} />
      </div>
    </ParentShell>
  );
}
