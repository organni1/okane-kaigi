export const dynamic = "force-dynamic";

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

  const { data: children } = await supabase.from("child_profiles").select("*").eq("parent_user_id", user.id).eq("is_active", true).order("created_at");
  if (!children?.length) redirect("/setup/child");

  const child = children[0];
  const { data: wallet } = await supabase.from("wallets").select("*").eq("child_profile_id", child.id).single();
  const { data: consultations } = await supabase
    .from("consultations")
    .select("id,status,parent_decision,wish_items(title,price,category,status)")
    .eq("parent_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const pendingCount = consultations?.filter((consultation) => consultation.status === "open").length ?? 0;

  return (
    <ParentShell>
      <div className="grid gap-5">
        <ChildSummaryCard child={child} wallet={wallet} />
        <PendingConsultationCard count={pendingCount} />
        <section className="grid gap-3">
          <h2 className="border-l-4 border-blue-500 pl-3 text-2xl font-black">最近の相談</h2>
          {consultations?.length ? consultations.map((consultation) => <ConsultationListItem key={consultation.id} consultation={consultation} />) : <EmptyState title="まだ相談はありません" body="子ども画面からほしいものを登録してみましょう。" />}
        </section>
        <Button href="/parent/wallet" variant="secondary" className="w-full">残高を調整する</Button>
        <Button href="/child/select" className="w-full">お金会議を始める</Button>
      </div>
    </ParentShell>
  );
}
