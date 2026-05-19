import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { WalletTransaction } from "@/types/database";

export function TransactionList({ transactions }: { transactions: WalletTransaction[] }) {
  return (
    <div className="grid gap-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="soft-card rounded-2xl p-4">
          <div className="flex justify-between gap-3">
            <p className="font-black">{transaction.memo || transaction.category || "お金のきろく"}</p>
            <p className="font-black text-orange-600">{formatCurrency(transaction.amount)}</p>
          </div>
          <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleString("ja-JP")}</p>
        </div>
      ))}
    </div>
  );
}
