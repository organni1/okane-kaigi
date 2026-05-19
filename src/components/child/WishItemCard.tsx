import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { categoryImage } from "@/lib/constants/categories";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { WishItem } from "@/types/database";

export function WishItemCard({ item, childId }: { item: WishItem; childId: string }) {
  return (
    <Link href={`/child/${childId}/wish-items/${item.id}/result`} className="soft-card grid grid-cols-[74px_1fr_auto] items-center gap-4 rounded-3xl p-4">
      <div className="grid size-[74px] place-items-center rounded-full bg-blue-50">
        <Image src={categoryImage(item.category)} alt="" width={58} height={58} />
      </div>
      <div>
        <p className="text-lg font-black">{item.title}</p>
        <p className="font-bold">{formatCurrency(item.price)}</p>
        <StatusBadge status={item.status} />
      </div>
      <ChevronRight className="text-gray-400" />
    </Link>
  );
}
