import { z } from "zod";

const emailSchema = z.string().email("メールアドレスを入力してください");

const passwordSchema = z
  .string()
  .min(8, "パスワードは8文字以上で入力してください")
  .regex(/[A-Za-z]/, "パスワードには英字を含めてください")
  .regex(/[0-9]/, "パスワードには数字を含めてください");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "パスワードを入力してください"),
});

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    password_confirmation: z.string().min(1, "確認用パスワードを入力してください"),
    terms_agreed: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "パスワードが一致しません",
    path: ["password_confirmation"],
  })
  .refine((data) => data.terms_agreed === "on", {
    message: "利用規約とプライバシーポリシーに同意してください",
    path: ["terms_agreed"],
  });

export const resendEmailSchema = z.object({
  email: emailSchema,
});
