import NextAuth, { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      identifier: { label: "Username or Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.identifier || !credentials?.password) {
        throw new Error("Please enter your username and password.");
      }

      const cleanIdentifier = credentials.identifier.trim().toLowerCase();

      let user = null;
      try {
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: cleanIdentifier },
              { email: cleanIdentifier },
            ],
          },
        });
      } catch (error) {
        console.warn("Prisma query failed, checking fallback state", error);
      }


      if (!user || !user.password) {
        throw new Error("No user found with this username.");
      }

      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

      if (!isPasswordValid) {
        throw new Error("Invalid password.");
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username || undefined,
        university: user.university || undefined,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  ...authConfig,
  providers,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export async function auth() {
  return await getServerSession(authOptions);
}
