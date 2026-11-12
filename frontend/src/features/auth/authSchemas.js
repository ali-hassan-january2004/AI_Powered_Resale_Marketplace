import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address");
export const passwordSchema = z.string().min(8, "Use at least 8 characters").max(72, "Password is too long");

const passwordsMatch = (v) => v.password === v.confirm;
const mismatch = { path: ["confirm"], message: "Passwords do not match" };

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name").max(60),
    email: emailSchema,
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine(passwordsMatch, mismatch);

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({ password: passwordSchema, confirm: z.string() })
  .refine(passwordsMatch, mismatch);

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(60),
  phone: z.string().trim().max(20).optional(),
  bio: z.string().trim().max(300).optional(),
  avatarUrl: z.string().trim().url("Enter a valid image URL").or(z.literal("")).optional(),
});