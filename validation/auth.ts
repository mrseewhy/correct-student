import { z } from "zod";

// Closed value-sets: role is only ever one of the platform roles, and signup
// can only self-assign student/tutor/signup-plan combos (server enforces both).
export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Add your full name.").max(100),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be at most 30 characters.")
    .regex(/^[a-zA-Z0-9._-]+$/, "Use letters, numbers, dots, dashes or underscores."),
  email: z.email("Add a valid email address.").max(254).transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8, "Use at least 8 characters.").max(72),
  confirmPassword: z.string(),
  role: z.enum(["student", "tutor"]),
  plan: z.enum(["free", "starter", "plus", "premium"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your email or username."),
  password: z.string().min(1, "Enter your password."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
