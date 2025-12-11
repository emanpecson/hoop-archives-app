import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createPrismaClient } from "./utils/prisma-client";

const prisma = createPrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),

      // always include refresh token
      accessType: "offline",
      prompt: "select_account",
    },
  },

  session: {
    expiresIn: 60 * 30, // exp: 30min
    updateAge: 60 * 29, // auto-refresh @ 29min

    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // cache: 5min
    },
  },
});
