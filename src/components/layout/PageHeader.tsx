import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageHeader({ title, backHref }: { title: string; backHref?: string }) {
  return (
    <div className="mb-6 grid grid-cols-[48px_1fr_48px] items-center">
      {backHref ? (
        <Link href={backHref} className="grid size-12 place-items-center rounded-full text-orange-500">
          <ChevronLeft size={34} />
        </Link>
      ) : (
        <span />
      )}
      <h1 className="text-center text-2xl font-black text-orange-500">{title}</h1>
      <span />
    </div>
  );
}
