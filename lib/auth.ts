import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { anonymous } from "better-auth/plugins";
import { prisma } from "./db"; // Imports your custom Edge Prisma client

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        // We must access the nested .user.id property
        await prisma.invoice.updateMany({
          where: { userId: anonymousUser.user.id },
          data: { userId: newUser.user.id },
        });
      },
    }),
  ],
});
