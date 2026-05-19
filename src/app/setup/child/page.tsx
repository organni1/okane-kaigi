export const dynamic = "force-dynamic";

import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/supabase/server";
import { createChildProfileWithWallet } from "@/server/actions/childProfiles";

const ageGroups = [
  { value: "age_3_5", label: "3〜5歳" },
  { value: "age_6_8", label: "6〜8歳" },
  { value: "age_9_12", label: "9〜12歳" },
  { value: "age_12_15", label: "12〜15歳" },
  { value: "other", label: "その他" },
] as const;

export default async function SetupChildPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    nickname?: string;
    age_group?: string;
    currency_label?: string;
    initial_balance?: string;
  }>;
}) {
  const params = await searchParams;
  const { user } = await getSessionUser();
  if (!user) redirect("/login");

  const selectedAgeGroup = ageGroups.some((group) => group.value === params.age_group) ? params.age_group : "age_6_8";
  const selectedCurrency = params.currency_label === "ポイント" ? "ポイント" : "円";
  const initialBalance = params.initial_balance && Number(params.initial_balance) >= 0 ? params.initial_balance : "0";

  return (
    <AppShell showLogout>
      <form action={createChildProfileWithWallet} className="soft-card grid gap-5 rounded-[2rem] p-6">
        <Image src="/assets/images/mascot-shiba-normal.png" alt="" width={140} height={140} className="mx-auto" />
        <div>
          <h1 className="text-3xl font-black">子どもプロフィール</h1>
          <p className="mt-2 text-sm font-bold text-gray-500">本名ではなく、呼びやすいニックネームで登録します。</p>
        </div>

        <ErrorMessage message={params.error} />

        <label className="grid gap-2 text-sm font-bold text-gray-800">
          ニックネーム
          <input
            name="nickname"
            placeholder="はる"
            defaultValue={params.nickname ?? ""}
            maxLength={30}
            required
            className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4 text-base outline-none ring-orange-200 focus:ring-4"
          />
          <span className="text-xs text-gray-500">30文字まで入力できます。</span>
        </label>

        <label className="grid gap-2 text-sm font-bold text-gray-800">
          年齢グループ
          <select
            name="age_group"
            defaultValue={selectedAgeGroup}
            className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4"
          >
            {ageGroups.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </label>

        <input type="hidden" name="avatar_id" value="shiba" />

        <label className="grid gap-2 text-sm font-bold text-gray-800">
          お金の単位
          <select
            name="currency_label"
            defaultValue={selectedCurrency}
            className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4"
          >
            <option value="円">円</option>
            <option value="ポイント">ポイント</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold text-gray-800">
          最初にあるお金
          <input
            name="initial_balance"
            type="number"
            min={0}
            inputMode="decimal"
            defaultValue={initialBalance}
            required
            className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4 text-base outline-none ring-orange-200 focus:ring-4"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-gray-800">
          子ども用PIN（任意）
          <input
            name="pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            placeholder="1234"
            className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4 text-base outline-none ring-orange-200 focus:ring-4"
          />
          <span className="text-xs leading-5 text-gray-500">設定する場合は4桁の数字だけ入力できます。未入力でも作成できます。</span>
        </label>

        <Button type="submit" className="w-full">
          作成する
        </Button>
      </form>
    </AppShell>
  );
}
