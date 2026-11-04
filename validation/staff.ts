import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().trim().min(2).max(100),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be at most 30 characters.")
    .regex(/^[a-zA-Z0-9._-]+$/, "Use letters, numbers, dots, dashes or underscores."),
  email: z.email("Add a valid email address.").max(254).transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8, "Use at least 8 characters.").max(72),
});

export const staffRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "super-admin"]),
});

export type StaffInput = z.infer<typeof staffSchema>;
