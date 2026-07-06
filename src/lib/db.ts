import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const connectionString = `${process.env.DATABASE_URL}`;
// console.log("Prisma env content", connectionString);
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
// console.log("PRISMA ACCOUNTS:", prisma.accounts);

export { prisma };
