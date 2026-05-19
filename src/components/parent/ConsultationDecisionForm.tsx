import { DECISIONS } from "@/lib/constants/statuses";
import { decideConsultation } from "@/server/actions/consultations";

export function ConsultationDecisionForm({ consultationId }: { consultationId: string }) {
  return (
    <form action={decideConsultation} className="grid gap-3">
      <input type="hidden" name="consultation_id" value={consultationId} />
      <label className="grid gap-2 text-lg font-black">
        コメント
        <textarea
          name="parent_comment"
          placeholder="気づいたことや伝えたいことをメモしましょう（任意）"
          className="min-h-24 rounded-2xl border border-orange-100 bg-white p-4 text-base font-normal outline-none"
        />
      </label>
      {DECISIONS.map((decision) => (
        <button key={decision.value} name="parent_decision" value={decision.value} className={`min-h-12 rounded-2xl border px-4 py-3 text-lg font-black ${decision.tone}`}>
          {decision.label}
        </button>
      ))}
    </form>
  );
}
