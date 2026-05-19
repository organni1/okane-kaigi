export const dynamic = "force-dynamic";

import Image from "next/image";
import { Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { ResultCard } from "@/components/child/ResultCard";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { categoryImage } from "@/lib/constants/categories";
import { getSessionUser } from "@/lib/supabase/server";

export default async function ResultPage({ params }: { params: Promise<{ childId: string; id: string }> }) {
  const { childId, id } = await params;
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const { data: item } = await supabase.from("wish_items").select("*").eq("id", id).eq("child_profile_id", childId).eq("parent_user_id", user.id).single();
  if (!item) redirect(`/child/${childId}/wish-items`);
  const { data: consultation } = await supabase
    .from("consultations")
    .select("*")
    .eq("wish_item_id", id)
    .eq("child_profile_id", childId)
    .eq("parent_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <AppShell>
      <PageHeader title="相談結果" backHref={`/child/${childId}/home`} />
      <div className="grid gap-5">
        <section className="grid grid-cols-[110px_1fr] items-center gap-4">
          <Image src={categoryImage(item.category)} alt="" width={110} height={110} className="rounded-full bg-blue-50 p-3" />
          <div>
            <h1 className="text-3xl font-black">{item.title}</h1>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-500 shadow-sm">
              <Clock size={18} />
              相談した日: {consultation ? new Date(consultation.created_at).toLocaleString("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "相談中"}
            </p>
          </div>
        </section>
        <ResultCard item={item} consultation={consultation} childId={childId} />
      </div>
    </AppShell>
  );
}
