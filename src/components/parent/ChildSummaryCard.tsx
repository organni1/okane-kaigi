import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/common/Button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { ChildProfile, Wallet } from "@/types/database";

export function ChildSummaryCard({ child, wallet }: { child: ChildProfile; wallet: Wallet | null }) {
  return (
    <section className="soft-card rounded-[2rem] p-5">
      <div className="grid grid-cols-[90px_1fr_90px] items-center gap-3">
        <Image src="/assets/images/mascot-shiba-normal.png" alt="" width={90} height={90} className="rounded-full bg-yellow-50" />
        <div>
          <p className="text-2xl font-black">{child.nickname}さん</p>
          <p className="font-bold text-gray-500">今あるお金</p>
          <p className="text-4xl font-black">{formatCurrency(wallet?.balance, child.currency_label)}</p>
        </div>
        <Image src="/assets/images/coin-jar.png" alt="" width={90} height={90} />
      </div>
      <Button href={`/child/${child.id}/pin`} className="mt-5 w-full">
        <ExternalLink />
        子ども画面を開く
      </Button>
    </section>
  );
}
