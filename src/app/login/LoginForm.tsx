"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { loginAction } from "@/server/actions/auth";

type Props = {
  error?: string;
};

export function LoginForm({ error }: Props) {
  const [email, setEmail] = useState("");
  const resendHref = useMemo(() => {
    const trimmed = email.trim();
    return trimmed ? `/signup/check-email?email=${encodeURIComponent(trimmed)}` : "";
  }, [email]);

  return (
    <form action={loginAction} className="soft-card grid gap-5 rounded-[2rem] p-6">
      <div>
        <h1 className="text-3xl font-black">ログイン</h1>
        <p className="mt-2 text-sm font-bold text-gray-500">親アカウントで入ります。</p>
      </div>

      <ErrorMessage message={error} />

      <label className="grid gap-2 text-sm font-bold text-gray-800">
        メールアドレス
        <input
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4 text-base outline-none ring-orange-200 focus:ring-4"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-gray-800">
        パスワード
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4 text-base outline-none ring-orange-200 focus:ring-4"
        />
      </label>

      <Button type="submit" className="w-full">
        ログイン
      </Button>

      <div className="grid gap-2 text-center text-sm font-bold">
        {resendHref ? (
          <Link href={resendHref} className="text-blue-600">
            確認メールが届かない場合
          </Link>
        ) : (
          <span className="cursor-not-allowed text-gray-400">確認メールが届かない場合</span>
        )}
        {!resendHref ? <p className="text-xs text-gray-500">先にメールアドレスを入力してください。</p> : null}
        <Link href="/signup" className="text-orange-600">
          はじめての方はこちら
        </Link>
      </div>
    </form>
  );
}
