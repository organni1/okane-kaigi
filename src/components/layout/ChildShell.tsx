import Link from "next/link";
import { Home, Settings, Star } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export function ChildShell({ childId, children }: { childId: string; children: React.ReactNode }) {
  const nav = [
    { href: `/child/${childId}/home`, label: "ホーム", icon: Home },
    { href: `/child/${childId}/wish-items`, label: "ほしいもの", icon: Star },
    { href: "/child/select", label: "せってい", icon: Settings },
  ];

  return (
    <AppShell>
      <div className="flex-1 pb-24">{children}</div>
      <nav className="fixed bottom-0 left-1/2 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-3 rounded-t-3xl bg-white px-3 py-3 shadow-2xl">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={`${item.label}-${item.href}`} href={item.href} className="grid justify-items-center gap-1 text-xs font-bold text-gray-600">
              <Icon size={25} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </AppShell>
  );
}
