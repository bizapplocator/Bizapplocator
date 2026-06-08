import { Prisma } from "../../generated/prisma/client.ts"; // Adjust path if needed
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

export interface ProductSearchResult {
  id: string;
  name: string;
  basePrice: Prisma.Decimal;
  user: {
    businessOwnerAuth: {
      businessName: string;
      phoneNumber: string;
      emailAddress: string;
      businessAddress: string;
    } | null;
  };
  media: {
    url: string;
    altText: string | null;
    rank: number;
  }[];
}
