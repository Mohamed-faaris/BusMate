import { type DefaultSession, type NextAuthConfig, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { accounts, users } from "@/server/db/schema";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import { env } from "@/env";

export const authConfig = {
  trustHost: true, // Add this to trust the host
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (
          !credentials?.email ||
          typeof credentials.email !== "string" ||
          !credentials?.password ||
          typeof credentials.password !== "string"
        )
          return null;
        const [user] = await db
          .select()
          .from(users)
          .leftJoin(accounts, eq(users.id, accounts.userId))
          .where(eq(users.email, credentials.email))
          .limit(1);
        if (!user) return null;
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.account!.password,
        );
        if (!isPasswordValid) return null;
        // console.log("isPasswordValid", isPasswordValid);
        return {
          id: user.user.id,
          email: user.user.email,
          name: user.user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("JWT Callback", { token, user });
      if (user && "id" in user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }): Promise<DefaultSession> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email!;
        session.user.name = token.name!;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      // Allow only URLs on the same origin
      if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      // Allow only safe external URLs (optional security)
      if (url.startsWith(baseUrl)) return url;
      // Default to baseUrl (home page) if invalid
      return baseUrl;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },
} satisfies NextAuthConfig;
