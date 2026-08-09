import { betterAuth } from "better-auth";
import { admin, bearer } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "../prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    // requireEmailVerification: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      firstname: {
        type: "string",
      },
      lastname: {
        type: "string",
      },
    },
  },

  plugins: [
    bearer(),
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});
