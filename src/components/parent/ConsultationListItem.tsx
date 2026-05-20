import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { categoryImage } from "@/lib/constants/categories";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type WishItemSummary = { title: string; price: number; category: string; status: string };
type ChildSummary = { nickname: string };

type ConsultationListRow = {
  id: string;
  status: string;
  parent_decision: string | null;
  child_profiles?: ChildSummary | ChildSummary[] | null;
  wish_items: WishItemSummary | WishItemSummary[] | null;
};

function firstOrNull<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export function ConsultationListItem({ consultation }: { consultation: ConsultationListRow }) {
  const item = firstOrNull(consultation.wish_items);
  const child = firstOrNull(consultation.child_profiles);

  return (
    <Link href={`/parent/consultations/${consultation.id}`} className="soft-card grid grid-cols-[74px_1fr_auto] items-center gap-4 rounded-3xl p-4">
      <Image src={categoryImage(item?.category)} alt="" width={70} height={70} className="rounded-full bg-blue-50 p-2" />
      <div className="min-w-0">
        {child ? <p className="text-xs font-bold text-gray-500">{child.nickname}さんの相談</p> : null}
        <p className="truncate text-lg font-black">{item?.title ?? "相談"}</p>
        <p className="font-bold">{formatCurrency(item?.price)}</p>
        <StatusBadge status={item?.status ?? "consulting"} />
      </div>
      <ChevronRight className="text-gray-400" />
    </Link>
  );
}
