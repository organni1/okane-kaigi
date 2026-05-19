import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Gift, Lock } from "lucide-react";
import { Button } from "@/components/common/Button";

const values = [
  { title: "買う前に考える", body: "ほしいものを登録して、買う価値があるかを考えよう。", image: "/assets/images/coin-jar.png" },
  { title: "親子で相談する", body: "ゲームやガチャなどの相談を、親子で一緒に。", image: "/assets/images/game-controller.png" },
  { title: "使った後にふりかえる", body: "使ったお金を記録して、次に活かそう。", image: "/assets/images/star-character.png" },
];

export default function Home() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] overflow-hidden bg-orange-50 px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-black text-orange-500">おかね会議</h1>
        <div className="grid size-14 place-items-center rounded-full bg-white shadow-md">☰</div>
      </header>
      <section>
        <p className="text-5xl font-black leading-tight">
          <span className="text-orange-500">「買っていい？」</span>を、親子で学ぶ時間に。
        </p>
        <p className="mt-5 text-lg font-bold leading-8 text-gray-700">
          子どもの“欲しい！”を、お金の使い方を考えるきっかけに変えるWebアプリです。
        </p>
        <Image src="/assets/images/hero-family-money.png" alt="親子でお金について話しているイラスト" width={760} height={570} priority className="mt-5 rounded-[2rem]" />
        <div className="mt-6 grid gap-3">
          <Button href="/signup" className="w-full text-xl">
            <Gift />
            無料ではじめる <ChevronRight />
          </Button>
          <Button href="/login" variant="outline" className="w-full text-xl">
            <Lock />
            ログイン <ChevronRight />
          </Button>
        </div>
      </section>
      <section className="mt-8 grid gap-4">
        {values.map((value) => (
          <article key={value.title} className="soft-card grid grid-cols-[84px_1fr_auto] items-center gap-4 rounded-3xl p-4">
            <Image src={value.image} alt="" width={84} height={84} className="rounded-full bg-yellow-50 p-2" />
            <div>
              <h2 className="text-xl font-black">{value.title}</h2>
              <p className="text-sm font-bold leading-6 text-gray-600">{value.body}</p>
            </div>
            <ChevronRight className="text-gray-400" />
          </article>
        ))}
      </section>
      <footer className="mt-8 flex justify-center gap-4 text-sm font-bold text-gray-500">
        <Link href="/terms" className="underline underline-offset-4">利用規約</Link>
        <Link href="/privacy" className="underline underline-offset-4">プライバシーポリシー</Link>
      </footer>
    </main>
  );
}
