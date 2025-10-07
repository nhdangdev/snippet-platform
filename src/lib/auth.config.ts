import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log(' [AUTH] Authorize called');
        console.log(' Email:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log(' Missing credentials');
          return null;
        }

        // Find user in mock database
        const user = await db.user.findByEmail(credentials.email as string);

        if (!user) {
          console.log(' User not found');
          return null;
        }

        console.log(' User found:', user.email);

        // TODO: Use bcrypt.compare when integrating real database
        const isValid = credentials.password === user.password;

        console.log('🔑 Password match:', isValid);

        if (!isValid) {
          console.log(' Invalid password');
          return null;
        }

        console.log(' Login successful!');

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        // console.log('JWT created for:', user.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        // console.log(' Session created for:', session.user.email);
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development-only',
  debug: true,
  trustHost: true,
};
