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
export { register_schema, login_schema };
