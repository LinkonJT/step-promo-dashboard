import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Only these emails can sign in. Add/remove people by editing this list.
const ALLOWED_EMAILS = [
  "linkon.step@gmail.com",
  "linkontripura@gmail.com",
  "skabir@agni.com",
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // Runs after Google verifies identity, before a session is created.
    // Returning false blocks the sign-in.
    signIn({ profile }) {
      const email = profile?.email?.toLowerCase();
      return !!email && ALLOWED_EMAILS.includes(email);
    },
  },
  pages: {
    signIn: "/login",
  },
});