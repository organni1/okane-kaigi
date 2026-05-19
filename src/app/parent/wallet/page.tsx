export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { ParentShell } from "@/components/layout/ParentShell";
import { TransactionList } from "@/components/parent/TransactionList";
import { WalletAdjustmentForm } from "@/components/parent/WalletAdjustmentForm";
import { getSessionUser } from "@/lib/supabase/server";

export default async function ParentWalletPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const query = await searchParams;
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");

  const { data: children } = await supabase.from("child_profiles").select("*").eq("parent_user_id", user.id).eq("is_active", true).order("created_at");
  const { data: wallets } = await supabase.from("wallets").select("*").eq("parent_user_id", user.id);
  const { data: transactions } = await supabase.from("wallet_transactions").select("*").eq("parent_user_id", user.id).order("created_at", { ascending: false }).limit(20);

  return (
    <ParentShell>
      <div className="grid gap-5">
        <h1 className="text-3xl font-black text-orange-500">残高を調整する</h1>
        <ErrorMessage message={query.error} />
        {query.saved ? <p className="rounded-2xl bg-green-50 px-4 py-3 font-bold text-green-700">保存しました</p> : null}
        {children?.length ? (
          <WalletAdjustmentForm childrenList={children} wallets={wallets ?? []} />
        ) : (
          <EmptyState title="子どもプロフィールがありません" body="先にプロフィールを作成してください。" href="/setup/child" action="作成する" />
        )}
        <section className="grid gap-3">
          <h2 className="text-2xl font-black">お金のきろく</h2>
          {transactions?.length ? <TransactionList transactions={transactions} /> : <EmptyState title="記録はまだありません" body="残高を調整すると履歴が残ります。" />}
        </section>
      </div>
    </ParentShell>
  );
}
