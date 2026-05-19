export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { CheckProgress } from "@/components/child/CheckProgress";
import { CheckStepCard } from "@/components/child/CheckStepCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { isChildModeVerified } from "@/lib/auth/childMode";
import { getSessionUser } from "@/lib/supabase/server";

export default async function CheckPage({ params, searchParams }: { params: Promise<{ childId: string; id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { childId, id } = await params;
  const query = await searchParams;
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");
  if (!(await isChildModeVerified(childId))) redirect(`/child/${childId}/pin`);

  const { data: item } = await supabase
    .from("wish_items")
    .select("*")
    .eq("id", id)
    .eq("child_profile_id", childId)
    .eq("parent_user_id", user.id)
    .maybeSingle();
  if (!item) redirect(`/child/${childId}/wish-items`);

  const { data: wallet } = await supabase.from("wallets").select("*").eq("child_profile_id", childId).eq("parent_user_id", user.id).maybeSingle();

  return (
    <AppShell>
      <PageHeader title="買う前チェック" backHref={`/child/${childId}/wish-items/new`} />
      <div className="grid gap-6">
        <ErrorMessage message={query.error} />
        <CheckProgress />
        <CheckStepCard item={item} wallet={wallet} childId={childId} />
      </div>
    </AppShell>
  );
}
