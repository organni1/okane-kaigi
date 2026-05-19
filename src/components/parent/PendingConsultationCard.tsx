import { Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/common/Button";

export function PendingConsultationCard({ count }: { count: number }) {
  return (
    <section className="soft-card grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-3xl p-4">
      <div className="grid size-16 place-items-center rounded-full bg-white text-orange-500 shadow-sm">
        <Bell />
      </div>
      <div>
        <p className="font-black text-orange-600">未対応の相談</p>
        <p className="text-3xl font-black">{count}件あります</p>
      </div>
      <Button href="/parent/consultations" variant="outline" className="px-3">
        見る <ChevronRight size={18} />
      </Button>
    </section>
  );
}
