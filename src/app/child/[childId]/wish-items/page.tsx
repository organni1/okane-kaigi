export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { BigChildButton } from "@/components/child/BigChildButton";
import { WishItemCard } from "@/components/child/WishItemCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ChildShell } from "@/components/layout/ChildShell";
import { isChildModeVerified } from "@/lib/auth/childMode";
import { getSessionUser } from "@/lib/supabase/server";
import type { WishItem } from "@/types/database";

export default async function ChildWishItemsPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");
  if (!(await isChildModeVerified(childId))) redirect(`/child/${childId}/pin`);

  const { data: child } = await supabase
    .from("child_profiles")
    .select("id")
    .eq("id", childId)
    .eq("parent_user_id", user.id)
    .maybeSingle();
  if (!child) redirect("/child/select");

  const { data: wishItemsData } = await supabase
    .from("wish_items")
    .select("*")
    .eq("child_profile_id", childId)
    .eq("parent_user_id", user.id)
    .order("created_at", { ascending: false });
  const wishItems = (wishItemsData ?? []) as WishItem[];

  return (
    <ChildShell childId={childId}>
      <div className="grid gap-5">
        <h1 className="text-3xl font-black">ほしいものリスト</h1>
        <BigChildButton href={`/child/${childId}/wish-items/new`}>ほしいものを登録する</BigChildButton>
        {wishItems.length ? (
          wishItems.map((item) => <WishItemCard key={item.id} item={item} childId={childId} />)
        ) : (
          <EmptyState title="まだありません" body="最初のほしいものを登録してみよう。" />
        )}
      </div>
    </ChildShell>
  );
}
