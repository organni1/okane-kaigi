import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Field } from "@/components/common/Field";
import { loginAction } from "@/server/actions/auth";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <AppShell>
      <form action={loginAction} className="soft-card grid gap-5 rounded-[2rem] p-6">
        <div>
          <h1 className="text-3xl font-black">ログイン</h1>
          <p className="mt-2 text-sm font-bold text-gray-500">親アカウントで入ります。</p>
        </div>
        <ErrorMessage message={params.error} />
        <Field label="メールアドレス" name="email" type="email" required />
        <Field label="パスワード" name="password" type="password" required />
        <Button type="submit" className="w-full">ログイン</Button>
        <div className="grid gap-2 text-center text-sm font-bold">
          <Link href="/signup/check-email" className="text-blue-600">
            確認メールが届かない場合
          </Link>
          <Link href="/signup" className="text-orange-600">
            はじめての方はこちら
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
