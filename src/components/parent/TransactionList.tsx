import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { WalletTransaction } from "@/types/database";

const typeLabels: Record<string, string> = {
  income: "追加",
  spending: "減少",
  adjustment: "調整",
  refund: "返金",
};

export function TransactionList({ transactions }: { transactions: WalletTransaction[] }) {
  return (
    <div className="grid gap-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="soft-card rounded-2xl p-4">
          <div className="flex justify-between gap-3">
            <div>
              <p className="font-black">{transaction.memo || transaction.category || "お金のきろく"}</p>
              <p className="text-xs font-bold text-gray-500">{typeLabels[transaction.transaction_type] ?? "記録"}</p>
            </div>
            <p className="font-black text-orange-600">{formatCurrency(transaction.amount)}</p>
          </div>
          <p className="mt-2 text-sm text-gray-500">{new Date(transaction.created_at).toLocaleString("ja-JP")}</p>
        </div>
      ))}
    </div>
  );
}
