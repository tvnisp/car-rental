import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/userSignin`,
          {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const { data } = await res.json();
        // If no error and we have user data, return it
        if (data && data.isValid)
          return {
            ...data.user,
          };
        // Return null if user data could not be retrieved
        throw new Error('Invalid Credentials');
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    jwt(params) {
      // update token
      // if (params.user?.role) {
      //   params.token.role = params.user.role;
      // }
      // return final_token
      return params.token;
    },
  },
};

export default NextAuth(authOptions);
