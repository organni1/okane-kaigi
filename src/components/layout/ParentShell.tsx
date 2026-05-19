import Link from "next/link";
import { Home, MessageCircle, Wallet, Settings } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

const nav = [
  { href: "/parent/dashboard", label: "ホーム", icon: Home },
  { href: "/parent/consultations", label: "相談", icon: MessageCircle },
  { href: "/parent/wallet", label: "お金", icon: Wallet },
  { href: "/parent/settings", label: "設定", icon: Settings },
];

export function ParentShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell showLogout>
      <div className="flex-1 pb-24">{children}</div>
      <nav className="fixed bottom-0 left-1/2 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-4 rounded-t-3xl bg-white px-3 py-3 shadow-2xl">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="grid justify-items-center gap-1 text-xs font-bold text-gray-600">
              <Icon size={24} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </AppShell>
  );
}
