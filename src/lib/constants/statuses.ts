export const STATUS_LABELS: Record<string, string> = {
  draft: "下書き",
  checking: "買う前チェック中",
  consulting: "親に相談中だよ",
  approved: "買ってもいいよ",
  wait: "もう少し待ってみよう",
  discuss: "一緒に話してみよう",
  saving: "貯めてから買おう",
  rejected: "今回は見送り",
  purchased: "買ったもの",
  archived: "アーカイブ",
};

export const DECISION_TO_STATUS: Record<string, string> = {
  approved: "approved",
  wait: "wait",
  discuss: "discuss",
  save: "saving",
  rejected: "rejected",
};

export const DECISIONS = [
  { value: "approved", label: "OK", tone: "bg-orange-500 text-white" },
  { value: "wait", label: "もう少し待とう", tone: "bg-green-50 text-green-700 border-green-200" },
  { value: "discuss", label: "一緒に考えよう", tone: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "save", label: "貯めてから買おう", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "rejected", label: "今回は見送り", tone: "bg-gray-50 text-gray-700 border-gray-200" },
] as const;
