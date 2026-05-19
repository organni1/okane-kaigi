export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { EmptyState } from "@/components/common/EmptyState";
import { ParentShell } from "@/components/layout/ParentShell";
import { ConsultationListItem } from "@/components/parent/ConsultationListItem";
import { getSessionUser } from "@/lib/supabase/server";

export default async function ParentConsultationsPage() {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const { data: consultations } = await supabase
    .from("consultations")
    .select("id,status,parent_decision,wish_items(title,price,category,status)")
    .eq("parent_user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <ParentShell>
      <div className="grid gap-5">
        <h1 className="text-3xl font-black text-orange-500">相談一覧</h1>
        <div className="flex gap-2 overflow-x-auto pb-1 text-sm font-bold">
          {["すべて", "未対応", "対応済み", "OK", "待とう", "見送り"].map((label) => (
            <span key={label} className="whitespace-nowrap rounded-full bg-white px-4 py-2 shadow-sm">{label}</span>
          ))}
        </div>
        {consultations?.length ? consultations.map((consultation) => <ConsultationListItem key={consultation.id} consultation={consultation} />) : <EmptyState title="相談はまだありません" body="相談が届くとここに表示されます。" />}
      </div>
    </ParentShell>
  );
}
