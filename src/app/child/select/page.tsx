export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/common/EmptyState";
import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/supabase/server";

export default async function ChildSelectPage() {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const { data: children } = await supabase
    .from("child_profiles")
    .select("*")
    .eq("parent_user_id", user.id)
    .eq("is_active", true)
    .order("created_at");

  return (
    <AppShell>
      <div className="grid gap-5">
        <h1 className="text-3xl font-black">だれのページ？</h1>
        {children?.length ? (
          children.map((child) => {
            const href = child.pin_hash ? `/child/${child.id}/pin` : `/child/${child.id}/home`;
            return (
              <Link key={child.id} href={href} className="soft-card grid grid-cols-[78px_1fr_auto] items-center gap-4 rounded-3xl p-4">
                <Image src="/assets/images/mascot-shiba-normal.png" alt="" width={78} height={78} className="rounded-full bg-yellow-50" />
                <div>
                  <p className="text-2xl font-black">{child.nickname}さん</p>
                  <p className="text-sm font-bold text-gray-500">{child.pin_hash ? "PINを入れて開きます" : "そのまま開きます"}</p>
                </div>
                <ChevronRight className="text-gray-400" />
              </Link>
            );
          })
        ) : (
          <EmptyState title="プロフィールがありません" body="親画面で子どもプロフィールを作成してください。" href="/setup/child" action="作成する" />
        )}
        <Link href="/parent/dashboard" className="text-center text-sm font-bold text-orange-600">
          親画面にもどる
        </Link>
      </div>
    </AppShell>
  );
}
