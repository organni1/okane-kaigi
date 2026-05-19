import Link from "next/link";
import { logoutAction } from "@/server/actions/auth";

export function AppShell({ children, showLogout = false }: { children: React.ReactNode; showLogout?: boolean }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-orange-50/50 px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-3xl font-black tracking-wide text-orange-500">
          おかね会議
        </Link>
        {showLogout ? (
          <form action={logoutAction}>
            <button className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm">ログアウト</button>
          </form>
        ) : null}
      </header>
      {children}
    </main>
  );
}
