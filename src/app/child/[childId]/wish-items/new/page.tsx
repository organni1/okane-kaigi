export const dynamic = "force-dynamic";

import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Field } from "@/components/common/Field";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppShell } from "@/components/layout/AppShell";
import { isChildModeVerified } from "@/lib/auth/childMode";
import { CATEGORIES } from "@/lib/constants/categories";
import { getSessionUser } from "@/lib/supabase/server";
import { createWishItem } from "@/server/actions/wishItems";

export default async function NewWishItemPage({ params, searchParams }: { params: Promise<{ childId: string }>; searchParams: Promise<{ error?: string }> }) {
  const { childId } = await params;
  const query = await searchParams;
  const { supabase, user } = await getSessionUser();
  if (!user) redirect("/login");
  if (!(await isChildModeVerified(childId))) redirect(`/child/${childId}/pin`);

  const { data: child } = await supabase.from("child_profiles").select("id").eq("id", childId).eq("parent_user_id", user.id).single();
  if (!child) redirect("/child/select");

  return (
    <AppShell>
      <PageHeader title="ほしいものを登録" backHref={`/child/${childId}/home`} />
      <form action={createWishItem} className="grid gap-5">
        <input type="hidden" name="child_profile_id" value={childId} />
        <ErrorMessage message={query.error} />
        <section className="soft-card grid gap-4 rounded-3xl p-5">
          <div className="flex items-start gap-4">
            <span className="grid size-14 place-items-center rounded-full bg-blue-100 text-3xl font-black text-blue-600">?</span>
            <Field label="何がほしい？" name="title" placeholder="ゲームのアイテム" required />
          </div>
        </section>
        <section className="soft-card grid gap-4 rounded-3xl p-5">
          <Field label="いくら？" name="price" type="number" placeholder="500" required />
        </section>
        <section className="soft-card grid gap-4 rounded-3xl p-5">
          <h2 className="text-lg font-black">どんなもの？</h2>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.slice(1, 7).map((category) => (
              <label key={category.value} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-orange-100 bg-white p-2 font-black">
                <input type="radio" name="category" value={category.value} required />
                {"image" in category ? <Image src={category.image} alt="" width={32} height={32} /> : <span>{category.emoji}</span>}
                {category.label}
              </label>
            ))}
          </div>
        </section>
        <section className="soft-card grid gap-4 rounded-3xl p-5">
          <Field label="どうしてほしい？" name="reason" placeholder="友だちが持っている" />
          <Field label="どこで見つけた？" name="found_place" placeholder="お店、ゲームの中など" />
        </section>
        <section className="soft-card grid gap-4 rounded-3xl p-5">
          <h2 className="text-lg font-black">どれくらいほしい？</h2>
          <select name="desire_level" defaultValue="4" className="min-h-12 rounded-2xl border border-orange-100 bg-white p-3">
            {[1, 2, 3, 4, 5].map((level) => <option key={level} value={level}>{"★".repeat(level)}</option>)}
          </select>
          <Button type="submit" className="w-full text-xl">次へ</Button>
        </section>
      </form>
    </AppShell>
  );
}
