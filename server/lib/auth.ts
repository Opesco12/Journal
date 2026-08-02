import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "../prisma";

export const auth = betterAuth({
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

  plugins: [bearer()],
});
