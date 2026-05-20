import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/common/Button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { ChildProfile, Wallet } from "@/types/database";

export function ChildSummaryCard({ child, wallet }: { child: ChildProfile; wallet: Wallet | null }) {
  const childHref = child.pin_hash ? `/child/${child.id}/pin` : `/child/${child.id}/home`;

  return (
    <section className="soft-card rounded-[2rem] p-5">
      <div className="grid grid-cols-[76px_1fr] items-center gap-3">
        <Image src="/assets/images/mascot-shiba-normal.png" alt="" width={76} height={76} className="rounded-full bg-yellow-50" />
        <div className="min-w-0">
          <p className="truncate text-2xl font-black">{child.nickname}さん</p>
          <p className="font-bold text-gray-500">今あるお金</p>
          <p className="text-4xl font-black">{formatCurrency(wallet?.balance, child.currency_label)}</p>
          {!wallet ? <p className="mt-1 text-xs font-bold text-red-600">お金の入れものが見つかりません。残高画面で確認してください。</p> : null}
        </div>
      </div>
      <Button href={childHref} className="mt-5 w-full">
        <ExternalLink />
        子ども画面を開く
      </Button>
    </section>
  );
}
