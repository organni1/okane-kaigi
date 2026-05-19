import Image from "next/image";
import { Button } from "@/components/common/Button";
import { submitPrePurchaseCheckAndConsultation } from "@/server/actions/consultations";
import type { WishItem, Wallet } from "@/types/database";

export function CheckStepCard({ item, wallet, childId }: { item: WishItem; wallet: Wallet | null; childId: string }) {
  const remaining = Number(wallet?.balance ?? 0) - Number(item.price);

  return (
    <form action={submitPrePurchaseCheckAndConsultation} className="soft-card grid gap-5 rounded-[2rem] p-6">
      <input type="hidden" name="child_profile_id" value={childId} />
      <input type="hidden" name="wish_item_id" value={item.id} />
      <input type="hidden" name="remaining_balance_after_purchase" value={remaining} />
      <Image src="/assets/images/coin-jar.png" alt="" width={190} height={190} className="mx-auto" />
      <h2 className="text-center text-4xl font-black">これはどっち?</h2>
      <div className="grid gap-3">
        <label className="rounded-3xl border border-green-200 bg-green-50 p-4 text-xl font-black">
          <input className="mr-3" type="radio" name="need_or_want" value="need" required /> 必要なもの
        </label>
        <label className="rounded-3xl border border-orange-200 bg-orange-50 p-4 text-xl font-black">
          <input className="mr-3" type="radio" name="need_or_want" value="want" required /> ほしいもの
        </label>
        <label className="rounded-3xl border border-blue-200 bg-blue-50 p-4 text-xl font-black">
          <input className="mr-3" type="radio" name="need_or_want" value="unsure" required /> まだ分からない
        </label>
      </div>
      <textarea name="reason_text" placeholder="どうしてほしい？" className="min-h-24 rounded-2xl border border-orange-100 p-4" />
      <select name="already_have_similar" className="min-h-12 rounded-2xl border border-orange-100 p-3">
        <option value="false">似たものは持っていない</option>
        <option value="true">似たものを持っている</option>
      </select>
      <select name="wait_choice" className="min-h-12 rounded-2xl border border-orange-100 p-3" defaultValue="wait_1_day">
        <option value="wait_now">今すぐほしい</option>
        <option value="wait_1_day">1日待って考える</option>
        <option value="wait_1_week">1週間待って考える</option>
      </select>
      <select name="expected_usage" className="min-h-12 rounded-2xl border border-orange-100 p-3" defaultValue="often">
        <option value="often">よく使う</option>
        <option value="sometimes">ときどき使う</option>
        <option value="rarely">あまり使わない</option>
        <option value="unknown">まだ分からない</option>
      </select>
      <input type="hidden" name="child_payment_ratio" value="100" />
      <Button type="submit" className="w-full text-xl">親に相談する</Button>
    </form>
  );
}
