import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    plainPassword: 'password',
  },
  {
    id: '2',
    name: 'Test User 2',
    email: 'test2@example.com',
    plainPassword: 'password',
  },
  {
    id: '3',
    name: 'Test User 3',
    email: 'test3@example.com',
    plainPassword: 'password',
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('[AUTH] Authorize called');
        console.log('Email:', credentials?.email);
        console.log('Password provided:', !!credentials?.password);

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        const user = users.find((u) => u.email === credentials.email);

        if (!user) {
          console.log('User not found:', credentials.email);
          console.log('Available users:', users.map(u => u.email));
          return null;
        }

        console.log('User found:', user.email);

        const isValid = credentials.password === user.plainPassword;

        console.log('Password match:', isValid);
        console.log('Expected:', user.plainPassword);
        console.log('Received:', credentials.password);

        if (!isValid) {
          console.log('Invalid password');
          return null;
        }

        console.log('Login successfully');

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        // console.log("🚀 ~ JWT ~ user.email:", user.email)
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        // console.log("🚀 ~ session ~ session.user.email:", session.user.email)
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  debug: true,
});
