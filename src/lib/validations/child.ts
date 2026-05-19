import { z } from "zod";

export const childProfileSchema = z.object({
  nickname: z.string().min(1, "ニックネームを入力してください").max(30),
  age_group: z.enum(["age_6_8", "age_9_12", "other"]),
  avatar_id: z.string().optional().default("shiba"),
  currency_label: z.enum(["円", "ポイント"]),
  initial_balance: z.coerce.number().min(0),
  pin: z.string().regex(/^\d{4}$/, "PINは4桁の数字です"),
});

export const pinSchema = z.object({
  pin: z.string().regex(/^\d{4}$/, "PINは4桁の数字です"),
});
