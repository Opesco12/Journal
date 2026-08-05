import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstname: z.string().trim().min(1, "First name is required"),
    lastname: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().email("Email must be valid"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Email must be valid"),
    password: z.string().min(1, "Password is required"),
  }),
});
