export const dynamic = "force-dynamic";

import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Field } from "@/components/common/Field";
import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/supabase/server";
import { createChildProfileWithWallet } from "@/server/actions/childProfiles";

export default async function SetupChildPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const { user } = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <AppShell showLogout>
      <form action={createChildProfileWithWallet} className="soft-card grid gap-5 rounded-[2rem] p-6">
        <Image src="/assets/images/mascot-shiba-normal.png" alt="" width={140} height={140} className="mx-auto" />
        <div>
          <h1 className="text-3xl font-black">子どもプロフィール</h1>
          <p className="mt-2 text-sm font-bold text-gray-500">本名ではなく、呼びやすいニックネームで登録します。</p>
        </div>
        <ErrorMessage message={params.error} />
        <Field label="ニックネーム" name="nickname" placeholder="はる" required />
        <Field label="年齢グループ" name="age_group">
          <select name="age_group" className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4">
            <option value="age_6_8">6〜8歳</option>
            <option value="age_9_12">9〜12歳</option>
            <option value="other">その他</option>
          </select>
        </Field>
        <input type="hidden" name="avatar_id" value="shiba" />
        <Field label="お金の単位" name="currency_label">
          <select name="currency_label" className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4">
            <option value="円">円</option>
            <option value="ポイント">ポイント</option>
          </select>
        </Field>
        <Field label="最初にあるお金" name="initial_balance" type="number" defaultValue={0} required />
        <Field label="子ども用PIN（4桁）" name="pin" type="password" placeholder="1234" required />
        <p className="text-xs font-bold text-gray-500">PINは子ども画面を開くために使います。4桁の数字だけ入力できます。</p>
        <Button type="submit" className="w-full">
          作成する
        </Button>
      </form>
    </AppShell>
  );
}
