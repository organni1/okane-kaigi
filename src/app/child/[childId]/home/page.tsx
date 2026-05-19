export const dynamic = "force-dynamic";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { BigChildButton } from "@/components/child/BigChildButton";
import { ChildMoneyCard } from "@/components/child/ChildMoneyCard";
import { WishItemCard } from "@/components/child/WishItemCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ChildShell } from "@/components/layout/ChildShell";
import { getSessionUser } from "@/lib/supabase/server";
import type { WishItem } from "@/types/database";

export default async function ChildHomePage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const { data: child } = await supabase.from("child_profiles").select("*").eq("id", childId).eq("parent_user_id", user.id).single();
  if (!child) redirect("/child/select");

  const { data: wallet } = await supabase.from("wallets").select("*").eq("child_profile_id", childId).single();
  const { data: wishItemsData } = await supabase
    .from("wish_items")
    .select("*")
    .eq("child_profile_id", childId)
    .eq("parent_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);
  const wishItems = (wishItemsData ?? []) as WishItem[];

  const replied = wishItems?.find((item) => ["approved", "wait", "discuss", "saving", "rejected"].includes(item.status));
  const consulting = wishItems?.find((item) => item.status === "consulting");

  return (
    <ChildShell childId={childId}>
      <div className="grid gap-5">
        <ChildMoneyCard nickname={child.nickname} balance={Number(wallet?.balance ?? 0)} currencyLabel={child.currency_label} />
        <BigChildButton href={`/child/${childId}/wish-items/new`}>ほしいものを登録する</BigChildButton>
        {replied ? (
          <section className="soft-card grid grid-cols-[70px_1fr_auto] items-center gap-4 rounded-3xl p-4">
            <Image src="/assets/images/gacha-machine.png" alt="" width={70} height={70} />
            <div>
              <p className="text-lg font-black">親からの返事</p>
              <p className="font-bold text-green-700">{replied.title}</p>
            </div>
            <a href={`/child/${childId}/wish-items/${replied.id}/result`} className="rounded-2xl border border-orange-300 px-4 py-2 font-black text-orange-600">見る</a>
          </section>
        ) : null}
        {consulting ? (
          <section className="rounded-3xl border border-blue-200 bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xl font-black text-blue-700"><MessageCircle />相談中</div>
            <WishItemCard item={consulting} childId={childId} />
          </section>
        ) : null}
        <section className="grid gap-3">
          <h2 className="text-2xl font-black">ほしいものリスト</h2>
          {wishItems?.length ? wishItems.map((item) => <WishItemCard key={item.id} item={item} childId={childId} />) : <EmptyState title="まだありません" body="ほしいものを登録してみよう。" />}
        </section>
      </div>
    </ChildShell>
  );
}
