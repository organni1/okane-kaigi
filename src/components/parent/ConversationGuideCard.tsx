import { Lightbulb } from "lucide-react";
import type { ConversationGuide } from "@/types/database";

export function ConversationGuideCard({ guide }: { guide: ConversationGuide | null }) {
  return (
    <section className="rounded-3xl border border-orange-200 bg-orange-50 p-4">
      <div className="flex items-center gap-3 font-black text-orange-600">
        <Lightbulb />
        声かけヒント
      </div>
      <p className="mt-2 text-sm font-bold">{guide?.recommended_example ?? "「何日くらい楽しめそう？」と聞いてみましょう。"}</p>
    </section>
  );
}
