export const dynamic = "force-dynamic";

import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { ParentShell } from "@/components/layout/ParentShell";
import { ChildSummaryCard } from "@/components/parent/ChildSummaryCard";
import { ConsultationListItem } from "@/components/parent/ConsultationListItem";
import { PendingConsultationCard } from "@/components/parent/PendingConsultationCard";
import { getSessionUser } from "@/lib/supabase/server";

export default async function ParentDashboardPage() {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const { data: children } = await supabase
    .from("child_profiles")
    .select("*")
    .eq("parent_user_id", user.id)
    .eq("is_active", true)
    .order("created_at");
  if (!children?.length) redirect("/setup/child");

  const childIds = children.map((child) => child.id);
  const { data: wallets } = await supabase.from("wallets").select("*").in("child_profile_id", childIds);
  const walletByChildId = new Map((wallets ?? []).map((wallet) => [wallet.child_profile_id, wallet]));

  const { count: pendingCount } = await supabase
    .from("consultations")
    .select("id", { count: "exact", head: true })
    .eq("parent_user_id", user.id)
    .eq("status", "open");

  const { data: consultations } = await supabase
    .from("consultations")
    .select("id,status,parent_decision,child_profiles(nickname),wish_items(title,price,category,status)")
    .eq("parent_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <ParentShell>
      <div className="grid gap-5">
        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-black">子どもプロフィール</h1>
            <Button href="/setup/child" variant="outline" className="min-h-10 px-3 py-2 text-sm">
              <Plus size={16} />
              追加
            </Button>
          </div>
          {children.map((child) => (
            <ChildSummaryCard key={child.id} child={child} wallet={walletByChildId.get(child.id) ?? null} />
          ))}
        </section>

        <PendingConsultationCard count={pendingCount ?? 0} />
        <section className="grid gap-3">
          <h2 className="border-l-4 border-blue-500 pl-3 text-2xl font-black">最近の相談</h2>
          {consultations?.length ? (
            consultations.map((consultation) => <ConsultationListItem key={consultation.id} consultation={consultation} />)
          ) : (
            <EmptyState title="まだ相談はありません" body="子ども画面からほしいものを登録してみましょう。" />
          )}
        </section>
        <Button href="/parent/wallet" variant="secondary" className="w-full">
          残高を調整する
        </Button>
        <Button href="/child/select" className="w-full">
          お金会議を始める
        </Button>
      </div>
    </ParentShell>
  );
}
