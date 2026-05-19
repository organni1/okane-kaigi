import Image from "next/image";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export function ChildMoneyCard({ nickname, balance, currencyLabel }: { nickname: string; balance: number; currencyLabel: string }) {
  return (
    <section className="soft-card relative overflow-hidden rounded-[2rem] p-6">
      <Image src="/assets/images/mascot-shiba-happy.png" alt="" width={120} height={120} className="absolute -right-1 -top-6" />
      <p className="text-2xl font-black">{nickname}さんのページ</p>
      <div className="mt-8 grid grid-cols-[120px_1fr] items-center gap-4">
        <Image src="/assets/images/coin-jar.png" alt="" width={130} height={130} />
        <div>
          <p className="font-bold text-gray-500">今あるお金</p>
          <p className="text-5xl font-black">{formatCurrency(balance, currencyLabel)}</p>
        </div>
      </div>
    </section>
  );
}
