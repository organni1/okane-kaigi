export const dynamic = "force-dynamic";

import { ParentShell } from "@/components/layout/ParentShell";

export default function ParentSettingsPage() {
  return (
    <ParentShell>
      <section className="soft-card rounded-3xl p-6">
        <h1 className="text-3xl font-black text-orange-500">設定</h1>
        <p className="mt-3 font-bold text-gray-600">MVPではログアウトと子ども画面への切り替えを優先しています。</p>
      </section>
    </ParentShell>
  );
}
