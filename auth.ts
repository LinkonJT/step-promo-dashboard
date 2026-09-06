import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./app/lib/prisma";

const allowedEmails = [
  "linkon.step@gmail.com",
  "linkontripura@gmail.com",
  "skabir@agni.com",
  "shamim.stepbd@gmail.com"
];

// Admin-tier users — always notified on new posts and comments.
const ADMIN_EMAILS = ["linkon.step@gmail.com", "skabir@agni.com", "shamim.stepbd@gmail.com"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Google can return mixed case; normalise before comparing
      const email = user.email.toLowerCase().trim();

      if (!allowedEmails.map((e) => e.toLowerCase()).includes(email)) {
        console.warn("[auth] Sign-in rejected — not on allowlist:", email);
        return false;
      }

      try {
        await prisma.user.upsert({
          where: { email },
          update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          },
          create: {
            email,
            name: user.name ?? email,
            image: user.image ?? null,
            role: ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email)
              ? "ADMIN"
              : "USER",
          },
        });
      } catch (err) {
        console.error("[auth] User upsert failed:", email, err);
        return false;
      }

      return true;
    },
  },
});