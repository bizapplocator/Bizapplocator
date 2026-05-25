import type { JwtPayload } from "jsonwebtoken";

export interface TokenInfo extends JwtPayload {
  role: string;
}
