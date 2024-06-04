import * as z from "zod";

export const signInFormSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const mailPostSchema = z.object({
  subject: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  toRecipients: z.string().email({
    message: "Invalid email address.",
  }),
  body: z.string().min(1, {
    message: "Message cannot be empty.",
  }),
});