import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./app/lib/prisma";

const allowedEmails = [
  "linkon.step@gmail.com",
  "linkontripura@gmail.com",
  "skabir@agni.com",
];

// Admin-tier users — always notified on new posts and comments.
const ADMIN_EMAILS = ["linkon.step@gmail.com", "skabir@agni.com"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      if (!allowedEmails.includes(user.email)) return false;

      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
            // role deliberately omitted — manual changes in Prisma Studio persist
          },
          create: {
            email: user.email,
            name: user.name ?? user.email,
            image: user.image ?? null,
            role: ADMIN_EMAILS.includes(user.email) ? "ADMIN" : "USER",
          },
        });
      } catch (err) {
        console.error("User upsert failed during sign-in:", err);
        return false;
      }

      return true;
    },
  },
});