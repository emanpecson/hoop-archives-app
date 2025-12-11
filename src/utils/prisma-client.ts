import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../prisma/generated";

export const createPrismaClient = () => {
  const connectionString = String(process.env.DATABASE_URL);
  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  return prisma;
};
