import { z } from "zod";

export const walletTransactionSchema = z.object({
  child_profile_id: z.string().uuid(),
  transaction_type: z.enum(["income", "spending", "adjustment", "refund"]),
  amount: z.coerce.number().positive(),
  category: z.string().max(50).optional(),
  memo: z.string().max(200).optional(),
});
