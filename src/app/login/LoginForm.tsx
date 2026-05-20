"use client";

import Link from "next/link";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { loginAction } from "@/server/actions/auth";

type Props = {
  error?: string;
};

export function LoginForm({ error }: Props) {
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
        <Link href="/signup" className="text-orange-600">
          はじめての方はこちら
        </Link>
      </div>
    </form>
  );
}
