import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[^A-Za-z0-9]/, "Must include a special character");

const register_schema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: passwordSchema,
});
const login_schema = z.object({
  email: z.email(),
  password: passwordSchema,
});
const reset_req = z.object({
  email: z.email(),
});
const mediaSchema = z.object({
  url: z.string().url(),
  altText: z.string().optional(),
  rank: z.number().int().default(0),
});

// Create Product Schema
const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  basePrice: z.string().or(z.number()), // Decimal handled as string/number
  userId: z.string().uuid(),
  media: z.array(mediaSchema).min(1, "At least one image is required"),
});

// Update Product Schema (all fields optional)
const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  basePrice: z.string().or(z.number()).optional(),
  media: z.array(mediaSchema).optional(),
});
const otpSchema = z.object({
  userId: z.string().uuid("Invalid User ID format"),
  code: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
const change_password_schema = z.object({
  email: z.email(),
  password: passwordSchema,
  code: otpSchema,
});
export {
  register_schema,
  login_schema,
  reset_req,
  change_password_schema,
  otpSchema,
  updateProductSchema,
  createProductSchema,
};
