import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../prisma/generated/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = String(process.env.DATABASE_URL);
const adapter = new PrismaNeon({ connectionString });

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
