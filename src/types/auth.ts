import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["owner", "admin", "member"]),
  orgId: z.string(),
  orgName: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
