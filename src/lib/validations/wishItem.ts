import { z } from "zod";

export const wishItemSchema = z.object({
  child_profile_id: z.string().uuid(),
  title: z.string().min(1).max(50),
  price: z.coerce.number().min(0),
  category: z.string().min(1),
  category_note: z.string().max(100).optional(),
  reason: z.string().max(200).optional(),
  found_place: z.string().max(100).optional(),
  desire_level: z.coerce.number().min(1).max(5).optional(),
});
