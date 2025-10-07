import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authEdgeConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 [AUTH-EDGE] Called authorize");

        if (
          credentials?.email === "demo@example.com" &&
          credentials?.password === "123456"
        ) {
          return {
            id: "demo-id",
            email: credentials.email,
            name: "Demo User",
            image: "https://i.pravatar.cc/100?u=demo",
          };
        }

        console.log("❌ Invalid edge credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) Object.assign(token, user);
      return token;
    },
    async session({ session, token }) {
      if (session.user) Object.assign(session.user, token);
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "edge-fallback-secret",
};
  