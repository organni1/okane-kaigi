"use client";

import Link from "next/link";
import { useState } from "react";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { cn } from "@/lib/utils/cn";
import { signUpAction } from "@/server/actions/auth";

type Props = {
  email?: string;
  error?: string;
};

export function SignupForm({ email = "", error }: Props) {
  const [emailValue, setEmailValue] = useState(email);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [agreed, setAgreed] = useState(false);

  const canSubmit = emailValue.trim().length > 0 && password.length > 0 && passwordConfirmation.length > 0 && agreed;

  return (
    <form action={signUpAction} className="soft-card grid gap-5 rounded-[2rem] p-6">
      <div>
        <h1 className="text-3xl font-black">無料ではじめる</h1>
        <p className="mt-2 text-sm font-bold text-gray-500">親アカウントを作成します。</p>
      </div>

      <ErrorMessage message={error} />

      <label className="grid gap-2 text-sm font-bold text-gray-700">
        メールアドレス
        <input
          name="email"
          type="email"
          value={emailValue}
          onChange={(event) => setEmailValue(event.target.value)}
          autoComplete="email"
          required
          className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4 text-base font-bold outline-none ring-orange-200 focus:ring-4"
        />
      </label>

      <div className="grid gap-3">
        <label className="grid gap-2 text-sm font-bold text-gray-700">
          パスワード
          <input
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
            className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4 text-base font-bold outline-none ring-orange-200 focus:ring-4"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-gray-700">
          パスワード（確認）
          <input
            name="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            autoComplete="new-password"
            required
            className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4 text-base font-bold outline-none ring-orange-200 focus:ring-4"
          />
        </label>

        <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold leading-6 text-gray-600">
          パスワードは8文字以上で、英字と数字を含めてください。
          <br />
          例: okane2026
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm font-bold leading-6 text-gray-600">
        <input
          name="terms_agreed"
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          required
          className="mt-1"
        />
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

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "inline-flex min-h-12 w-full items-center justify-center rounded-2xl px-5 py-3 text-base font-bold transition",
          canSubmit
            ? "bg-orange-500 text-white shadow-lg shadow-orange-200 hover:bg-orange-600"
            : "cursor-not-allowed bg-orange-200 text-white opacity-60 shadow-none",
        )}
      >
        登録する
      </button>

      <Link href="/login" className="text-center text-sm font-bold text-orange-600">
        ログインはこちら
      </Link>
    </form>
  );
}
