import { STATUS_LABELS } from "@/lib/constants/statuses";

export function statusLabel(status: string | null | undefined) {
  return STATUS_LABELS[status ?? ""] ?? "未設定";
}
