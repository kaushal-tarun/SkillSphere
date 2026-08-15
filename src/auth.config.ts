import type { NextAuthOptions } from "next-auth";

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "skillsphere-production-jwt-secret-2026",
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username || (user.email ? user.email.split("@")[0] : "builder");
        token.university = (user as { university?: string }).university || "Campus Builder";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { username?: string }).username = (token.username as string) || (session.user.email?.split("@")[0] ?? "builder");
        (session.user as { university?: string }).university = (token.university as string) || "Campus Builder";
      }
      return session;
    },
  },
  providers: [],
};
