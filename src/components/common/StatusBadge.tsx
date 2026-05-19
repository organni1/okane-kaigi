import { statusLabel } from "@/lib/utils/statusLabel";

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "consulting" ? "bg-blue-50 text-blue-700" : status === "approved" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700";
  return <span className={`rounded-full px-3 py-1 text-sm font-bold ${tone}`}>{statusLabel(status)}</span>;
}
