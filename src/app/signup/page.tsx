import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Field } from "@/components/common/Field";
import { signUpAction } from "@/server/actions/auth";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <AppShell>
      <form action={signUpAction} className="soft-card grid gap-5 rounded-[2rem] p-6">
        <div>
          <h1 className="text-3xl font-black">無料ではじめる</h1>
          <p className="mt-2 text-sm font-bold text-gray-500">親アカウントを作成します。</p>
        </div>
        <ErrorMessage message={params.error} />
        <Field label="メールアドレス" name="email" type="email" required />
        <div className="grid gap-2">
          <Field label="パスワード" name="password" type="password" required />
          <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold leading-6 text-gray-600">
            パスワードは8文字以上で、英字と数字を含めてください。
            <br />
            例: okane2026
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm font-bold leading-6 text-gray-600">
          <input type="checkbox" required className="mt-1" />
          <span>
            <Link href="/terms" className="text-orange-600 underline underline-offset-4">
              利用規約
            </Link>
            と
            <Link href="/privacy" className="text-orange-600 underline underline-offset-4">
              プライバシーポリシー
            </Link>
            に同意します
          </span>
        </label>
        <Button type="submit" className="w-full">登録する</Button>
        <Link href="/login" className="text-center text-sm font-bold text-orange-600">ログインはこちら</Link>
      </form>
    </AppShell>
  );
}
