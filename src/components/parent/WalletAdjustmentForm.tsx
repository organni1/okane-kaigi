import { Button } from "@/components/common/Button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { adjustWalletBalance } from "@/server/actions/wallet";
import type { ChildProfile, Wallet } from "@/types/database";

export function WalletAdjustmentForm({ childrenList, wallets }: { childrenList: ChildProfile[]; wallets: Wallet[] }) {
  const walletByChildId = new Map(wallets.map((wallet) => [wallet.child_profile_id, wallet]));

  return (
    <section className="grid gap-4">
      <div className="grid gap-3">
        {childrenList.map((child) => {
          const wallet = walletByChildId.get(child.id);
          return (
            <div key={child.id} className="soft-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black">{child.nickname}さん</p>
                  <p className="text-sm font-bold text-gray-500">現在の残高</p>
                </div>
                <p className="text-2xl font-black">{wallet ? formatCurrency(wallet.balance, child.currency_label) : "未作成"}</p>
              </div>
              {!wallet ? <p className="mt-2 text-sm font-bold text-red-600">walletが見つかりません。子どもプロフィール作成をやり直してください。</p> : null}
            </div>
          );
        })}
      </div>
      <form action={adjustWalletBalance} className="soft-card grid gap-4 rounded-3xl p-5">
        <label className="grid gap-2 text-sm font-bold text-gray-700">
          子ども
          <select name="child_profile_id" className="min-h-12 rounded-2xl border border-orange-100 p-3" required>
            {childrenList.map((child) => (
              <option key={child.id} value={child.id}>
                {child.nickname}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-gray-700">
          調整方法
          <select name="transaction_type" className="min-h-12 rounded-2xl border border-orange-100 p-3" defaultValue="income">
            <option value="income">追加する</option>
            <option value="spending">減らす</option>
            <option value="refund">返す</option>
          </select>
        </label>
        <input name="amount" type="number" min="1" placeholder="金額" className="min-h-12 rounded-2xl border border-orange-100 p-3" required />
        <input name="category" placeholder="理由カテゴリ（例: おこづかい）" className="min-h-12 rounded-2xl border border-orange-100 p-3" />
        <textarea name="memo" placeholder="メモ（例: 今週のお手伝い分）" className="min-h-20 rounded-2xl border border-orange-100 p-3" />
        <Button type="submit">保存する</Button>
      </form>
    </section>
  );
}
