import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("メールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .regex(/[A-Za-z]/, "パスワードには英字を含めてください")
    .regex(/[0-9]/, "パスワードには数字を含めてください"),
});
