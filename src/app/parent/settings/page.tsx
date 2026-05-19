export const dynamic = "force-dynamic";

import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/common/Button";
import { ParentShell } from "@/components/layout/ParentShell";
import { logoutAction } from "@/server/actions/auth";
import { getSessionUser } from "@/lib/supabase/server";

export default async function ParentSettingsPage() {
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("parent_profiles").select("*").eq("user_id", user.id).maybeSingle();
  const { data: children } = await supabase
    .from("child_profiles")
    .select("*")
    .eq("parent_user_id", user.id)
    .eq("is_active", true)
    .order("created_at");

  return (
    <ParentShell>
      <div className="grid gap-5">
        <section className="soft-card rounded-3xl p-6">
          <h1 className="text-3xl font-black text-orange-500">設定</h1>
          <p className="mt-3 font-bold text-gray-600">親アカウントと子どもプロフィールを確認できます。</p>
        </section>

        <section className="soft-card rounded-3xl p-5">
          <h2 className="text-xl font-black">親アカウント</h2>
          <div className="mt-3 grid gap-2 text-sm font-bold text-gray-600">
            <p>メール: {user.email}</p>
            <p>表示名: {profile?.display_name ?? "未設定"}</p>
          </div>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-black">子どもプロフィール</h2>
          {children?.map((child) => (
            <div key={child.id} className="soft-card grid grid-cols-[64px_1fr] items-center gap-4 rounded-3xl p-4">
              <Image src="/assets/images/mascot-shiba-normal.png" alt="" width={64} height={64} className="rounded-full bg-yellow-50" />
              <div>
                <p className="text-lg font-black">{child.nickname}</p>
                <p className="text-sm font-bold text-gray-500">{child.currency_label}で管理中</p>
              </div>
            </div>
          ))}
          <Button href="/setup/child" variant="outline" className="w-full">
            子どもを追加する
          </Button>
        </section>

        <form action={logoutAction}>
          <button className="min-h-12 w-full rounded-2xl border border-red-200 bg-white px-5 py-3 font-black text-red-600">
            ログアウト
          </button>
        </form>
      </div>
    </ParentShell>
  );
}
