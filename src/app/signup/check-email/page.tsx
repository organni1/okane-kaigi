import Link from "next/link";
import { MailCheck, Send } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { resendConfirmationEmail } from "@/server/actions/auth";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string; resent?: string }>;
}) {
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

        <ErrorMessage message={params.error} />
        {params.resent ? (
          <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
            確認メールを再送しました。数分待ってから受信箱を確認してください。
          </p>
        ) : null}

        <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold leading-6 text-blue-700">
          メールが見つからない場合は、迷惑メールフォルダ、プロモーション、すべてのメールも確認してください。
        </p>

        <form action={resendConfirmationEmail} className="grid gap-3 rounded-3xl border border-orange-100 bg-orange-50 p-4 text-left">
          <label className="grid gap-2 text-sm font-bold text-gray-700">
            確認メールを再送する
            <input
              name="email"
              type="email"
              defaultValue={params.email ?? ""}
              placeholder="mail@example.com"
              required
              className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4 text-base outline-none ring-orange-200 focus:ring-4"
            />
          </label>
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 font-black text-white">
            <Send size={18} />
            再送する
          </button>
        </form>

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
