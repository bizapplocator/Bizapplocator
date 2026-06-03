import type { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums.js";
export interface TokenInfo extends JwtPayload {
  role: string;
}
export interface UserInfo {
  email: string;
  name: string;
  id: string;
  password: string | null;
  role: Role;
  createdAt: Date;
  signInMethod: string;
}
