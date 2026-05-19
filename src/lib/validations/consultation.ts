import { z } from "zod";

export const prePurchaseCheckSchema = z.object({
  child_profile_id: z.string().uuid(),
  wish_item_id: z.string().uuid(),
  need_or_want: z.enum(["need", "want", "unsure"]),
  reason_text: z.string().max(200).optional(),
  already_have_similar: z.coerce.boolean().optional(),
  wait_choice: z.enum(["wait_now", "wait_1_day", "wait_1_week"]),
  expected_usage: z.enum(["often", "sometimes", "rarely", "unknown"]),
  child_payment_ratio: z.coerce.number().min(0).max(100).optional(),
  remaining_balance_after_purchase: z.coerce.number().optional(),
});

export const consultationDecisionSchema = z.object({
  consultation_id: z.string().uuid(),
  parent_decision: z.enum(["approved", "wait", "discuss", "save", "rejected"]),
  parent_comment: z.string().max(300).optional(),
});
