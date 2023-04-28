import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import type { ISessionUser } from '@/types/server';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });
        const { data } = await res.json();
        // If no error and we have user data, return it
        if (res.ok && data) return { ...data };
        // Return null if user data could not be retrieved
        throw new Error('Invalid Credentials');
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/register',
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // eslint-disable-next-line no-param-reassign
      session.user = token as ISessionUser;
      return session;
    },
  },
};

export default NextAuth(authOptions);
