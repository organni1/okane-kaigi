export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { ParentShell } from "@/components/layout/ParentShell";
import { ConsultationListItem } from "@/components/parent/ConsultationListItem";
import { getSessionUser } from "@/lib/supabase/server";
import { cn } from "@/lib/utils/cn";

const filters = [
  { value: "all", label: "すべて" },
  { value: "open", label: "未対応" },
  { value: "closed", label: "対応済み" },
  { value: "approved", label: "OK" },
  { value: "wait", label: "待とう" },
  { value: "rejected", label: "見送り" },
] as const;

export default async function ParentConsultationsPage({ searchParams }: { searchParams: Promise<{ filter?: string; error?: string }> }) {
  const { filter = "all", error } = await searchParams;
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  let query = supabase
    .from("consultations")
    .select("id,status,parent_decision,wish_items(title,price,category,status)")
    .eq("parent_user_id", user.id)
    .order("created_at", { ascending: false });

  if (filter === "open" || filter === "closed") {
    query = query.eq("status", filter);
  } else if (["approved", "wait", "rejected"].includes(filter)) {
    query = query.eq("parent_decision", filter);
  }

  const { data: consultations } = await query;

  return (
    <ParentShell>
      <div className="grid gap-5">
        <h1 className="text-3xl font-black text-orange-500">相談一覧</h1>
        <ErrorMessage message={error} />
        <div className="flex gap-2 overflow-x-auto pb-1 text-sm font-bold">
          {filters.map((item) => (
            <Link
              key={item.value}
              href={`/parent/consultations?filter=${item.value}`}
              className={cn("whitespace-nowrap rounded-full px-4 py-2 shadow-sm", filter === item.value ? "bg-orange-500 text-white" : "bg-white text-gray-700")}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {consultations?.length ? (
          consultations.map((consultation) => <ConsultationListItem key={consultation.id} consultation={consultation} />)
        ) : (
          <EmptyState title="相談はまだありません" body="相談が届くとここに表示されます。" />
        )}
      </div>
    </ParentShell>
  );
}
