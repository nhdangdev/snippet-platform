import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
  },
  {
    id: '2',
    name: 'Test User 2',
    email: 'test2@example.com',
    password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
  },
  {
    id: '3',
    name: 'Test User 3',
    email: 'test3@example.com',
    password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
  },
];

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
        console.log('🚀 ~ [AUTH] Authorize called');
        console.log('🚀 ~ Email:', credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log('🚀 ~ [AUTH] Missing credentials');
          throw new Error('Missing credentials');
        }

        const user = users.find((user) => user.email === credentials.email);

        if (!user) {
          console.log('🚀 ~ [AUTH] User not found');
          throw new Error('Invalid email or password');
        }

        console.log('🚀 ~ [AUTH] User found');

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        console.log('🚀 ~ [AUTH] Password match:', passwordMatch);

        if (!passwordMatch) {
          console.log('🚀 ~ [AUTH] Wrong password');
          throw new Error('Invalid email or password');
        }

        console.log('🚀 ~ [AUTH] Login successful');

        return {
          id: user.id,
          email: user.email,
          name: user.name,
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
        console.log('🚀 ~ [JWT] Token created:', { id: user.id, email: user.email });
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        console.log('🚀 ~ [SESSION] Session created:', session.user.email);
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  trustHost: true,
};
