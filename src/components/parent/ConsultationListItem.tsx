import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { categoryImage } from "@/lib/constants/categories";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type ConsultationListRow = {
  id: string;
  status: string;
  parent_decision: string | null;
  wish_items: { title: string; price: number; category: string; status: string } | { title: string; price: number; category: string; status: string }[] | null;
};

export function ConsultationListItem({ consultation }: { consultation: ConsultationListRow }) {
  const item = Array.isArray(consultation.wish_items) ? consultation.wish_items[0] : consultation.wish_items;
  return (
    <Link href={`/parent/consultations/${consultation.id}`} className="soft-card grid grid-cols-[74px_1fr_auto] items-center gap-4 rounded-3xl p-4">
      <Image src={categoryImage(item?.category)} alt="" width={70} height={70} className="rounded-full bg-blue-50 p-2" />
      <div>
        <p className="text-lg font-black">{item?.title ?? "相談"}</p>
        <p className="font-bold">{formatCurrency(item?.price)}</p>
        <StatusBadge status={item?.status ?? "consulting"} />
      </div>
      <ChevronRight className="text-gray-400" />
    </Link>
  );
}
