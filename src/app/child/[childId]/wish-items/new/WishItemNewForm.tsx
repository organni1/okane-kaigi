"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/common/Button";
import { Field } from "@/components/common/Field";
import { CHILD_WISH_CATEGORIES } from "@/lib/constants/categories";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { createWishItem } from "@/server/actions/wishItems";

const desireLevels = [
  { value: 5, label: "★★★★★ すごくほしい" },
  { value: 4, label: "★★★★ かなりほしい" },
  { value: 3, label: "★★★ できればほしい" },
  { value: 2, label: "★★ ちょっと気になる" },
  { value: 1, label: "★ まよっている" },
];

export function WishItemNewForm({ childId, balance, currencyLabel }: { childId: string; balance: number; currencyLabel: string }) {
  const [price, setPrice] = useState("");
  const numericPrice = Number(price || 0);
  const isOverBalance = price.trim() !== "" && numericPrice > balance;
  const balanceLabel = useMemo(() => formatCurrency(balance, currencyLabel), [balance, currencyLabel]);

  return (
    <form action={createWishItem} className="grid gap-5">
      <input type="hidden" name="child_profile_id" value={childId} />
      <section className="soft-card grid gap-4 rounded-3xl p-5">
        <div className="flex items-start gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-blue-100 text-3xl font-black text-blue-600">?</span>
          <Field label="なにがほしい？" name="title" placeholder="ゲームのアイテム" required />
        </div>
      </section>

      <section className="soft-card grid gap-4 rounded-3xl p-5">
        <label className="grid gap-2 text-sm font-bold text-gray-800">
          いくら？
          <input
            name="price"
            type="number"
            min={0}
            inputMode="decimal"
            placeholder="500"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
            className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4 text-base outline-none ring-orange-200 focus:ring-4"
          />
        </label>
        {isOverBalance ? (
          <p className="rounded-2xl bg-yellow-50 px-4 py-3 text-sm font-black leading-6 text-yellow-800">
            今あるお金（{balanceLabel}）より高いよ。おとうさん・おかあさんに相談はできるよ。
          </p>
        ) : null}
      </section>

      <section className="soft-card grid gap-4 rounded-3xl p-5">
        <h2 className="text-lg font-black">どんなもの？</h2>
        <div className="grid grid-cols-2 gap-3">
          {CHILD_WISH_CATEGORIES.map((category) => (
            <label
              key={category.value}
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-orange-100 bg-white p-2 text-center font-black"
            >
              <input type="radio" name="category" value={category.value} required />
              {"image" in category ? <Image src={category.image} alt="" width={32} height={32} /> : null}
              <span>{category.label}</span>
            </label>
          ))}
        </div>
        <Field label="くわしく書く（任意）" name="category_note" placeholder="色、名前、どんなアイテムかなど" />
      </section>

      <section className="soft-card grid gap-4 rounded-3xl p-5">
        <Field label="どうしてほしい？" name="reason" placeholder="友だちがもっている" />
        <Field label="どこで見つけた？" name="found_place" placeholder="お店、ゲームの中など" />
      </section>

      <section className="soft-card grid gap-4 rounded-3xl p-5">
        <h2 className="text-lg font-black">どれくらいほしい？</h2>
        <select name="desire_level" defaultValue="4" className="min-h-12 rounded-2xl border border-orange-100 bg-white p-3 font-bold">
          {desireLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        <Button type="submit" className="w-full text-xl">
          つぎへ
        </Button>
      </section>
    </form>
  );
}
