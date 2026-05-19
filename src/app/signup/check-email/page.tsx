import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/common/Button";

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const params = await searchParams;

  return (
    <AppShell>
      <section className="soft-card grid gap-5 rounded-[2rem] p-6 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-orange-100 text-orange-600">
          <MailCheck size={42} />
        </div>
        <div>
          <h1 className="text-3xl font-black">確認メールを送りました</h1>
          <p className="mt-3 font-bold leading-7 text-gray-600">
            {params.email ? `${params.email} 宛に` : ""}
            届いたメールのリンクを開くと、子どもプロフィール作成へ進めます。
          </p>
        </div>
        <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
          メールが見つからない場合は、迷惑メールフォルダも確認してください。
        </p>
        <Button href="/login" variant="outline" className="w-full">
          確認後にログインする
        </Button>
        <Link href="/signup" className="text-sm font-bold text-orange-600">
          別のメールで登録する
        </Link>
      </section>
    </AppShell>
  );
}
