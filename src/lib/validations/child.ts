import { z } from "zod";

const optionalPinSchema = z
  .string()
  .optional()
  .transform((value) => value?.trim() ?? "")
  .refine((value) => value === "" || /^\d{4}$/.test(value), "PINは入力する場合、4けたの数字にしてください");

export const childProfileSchema = z.object({
  nickname: z.string().min(1, "ニックネームを入力してください").max(30, "ニックネームは30文字以内で入力してください"),
  age_group: z.enum(["age_3_5", "age_6_8", "age_9_12", "age_12_15", "other"], {
    message: "年齢グループを選んでください",
  }),
  avatar_id: z.string().optional().default("shiba"),
  currency_label: z.enum(["円", "ポイント"], {
    message: "お金の単位を選んでください",
  }),
  initial_balance: z.coerce
    .number({ message: "最初にあるお金は0以上の数字で入力してください" })
    .min(0, "最初にあるお金はマイナスにできません"),
  pin: optionalPinSchema,
});

export const pinSchema = z.object({
  pin: z.string().regex(/^\d{4}$/, "PINは4けたの数字です"),
});
