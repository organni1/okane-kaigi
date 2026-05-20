export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { isChildModeVerified } from "@/lib/auth/childMode";
import { getSessionUser } from "@/lib/supabase/server";
import { WishItemNewForm } from "./WishItemNewForm";

export default async function NewWishItemPage({ params, searchParams }: { params: Promise<{ childId: string }>; searchParams: Promise<{ error?: string }> }) {
  const { childId } = await params;
  const query = await searchParams;
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");
  if (!(await isChildModeVerified(childId))) redirect(`/child/${childId}/pin`);

  const { data: child } = await supabase
    .from("child_profiles")
    .select("id,currency_label")
    .eq("id", childId)
    .eq("parent_user_id", user.id)
    .maybeSingle();
  if (!child) redirect("/child/select");

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("child_profile_id", childId)
    .eq("parent_user_id", user.id)
    .maybeSingle();

  return (
    <AppShell>
      <PageHeader title="ほしいものをいれる" backHref={`/child/${childId}/home`} />
      <div className="grid gap-5">
        <ErrorMessage message={query.error} />
        <WishItemNewForm childId={childId} balance={Number(wallet?.balance ?? 0)} currencyLabel={child.currency_label} />
      </div>
    </AppShell>
  );
}
