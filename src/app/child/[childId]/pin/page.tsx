export const dynamic = "force-dynamic";

import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { NumericPinInput } from "@/components/common/NumericPinInput";
import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/supabase/server";
import { verifyChildPin } from "@/server/actions/childProfiles";

export default async function ChildPinPage({
  params,
  searchParams,
}: {
  params: Promise<{ childId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { childId } = await params;
  const query = await searchParams;
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const { data: child } = await supabase
    .from("child_profiles")
    .select("*")
    .eq("id", childId)
    .eq("parent_user_id", user.id)
    .maybeSingle();
  if (!child) redirect("/child/select");
  if (!child.pin_hash) redirect(`/child/${childId}/home`);

  const action = verifyChildPin.bind(null, childId);

  return (
    <AppShell>
      <form action={action} className="soft-card grid gap-5 rounded-[2rem] p-6 text-center">
        <Image src="/assets/images/mascot-shiba-normal.png" alt="" width={150} height={150} className="mx-auto" />
        <div>
          <h1 className="text-3xl font-black">{child.nickname}さん</h1>
          <p className="mt-2 font-bold text-gray-500">4けたのPINを入れてね</p>
        </div>
        <ErrorMessage message={query.error} />
        <NumericPinInput
          name="pin"
          required
          className="mx-auto min-h-16 w-44 rounded-3xl border border-orange-100 bg-white text-center text-4xl font-black tracking-[0.35em] outline-none ring-orange-200 focus:ring-4"
        />
        <Button type="submit" className="w-full">
          開く
        </Button>
      </form>
    </AppShell>
  );
}
