import Image from "next/image";
import { Button } from "@/components/common/Button";
import { statusLabel } from "@/lib/utils/statusLabel";
import type { Consultation, WishItem } from "@/types/database";

export function ResultCard({ item, consultation, childId }: { item: WishItem; consultation: Consultation | null; childId: string }) {
  const isApproved = item.status === "approved";
  return (
    <div className="grid gap-5">
      <section className="soft-card grid justify-items-center gap-4 rounded-[2rem] p-6 text-center">
        <p className="text-xl font-black text-orange-500">{isApproved ? "うれしいお返事!" : "おとうさん・おかあさんからのお返事"}</p>
        <h2 className="text-5xl font-black text-orange-500">{statusLabel(item.status)}</h2>
        <Image src={isApproved ? "/assets/images/mascot-shiba-happy.png" : "/assets/images/mascot-shiba-normal.png"} alt="" width={190} height={190} />
      </section>
      <section className="soft-card rounded-3xl p-5">
        <p className="mb-2 font-black">おとうさん・おかあさんからのメッセージ</p>
        <p className="text-lg">{consultation?.parent_comment || "まだメッセージはありません"}</p>
      </section>
      <Button href={`/child/${childId}/home`} variant="outline" className="w-full">
        ホームにもどる
      </Button>
    </div>
  );
}
