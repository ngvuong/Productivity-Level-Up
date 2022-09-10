import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';

export default NextAuth({
  session: {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 * 4,
  },
  database: process.env.DATABASE_URL,
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    session: async ({ session, user }) => {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          tasks: { include: { project: true, tags: true } },
          projects: true,
          settings: true,
          pomos: true,
        },
      });

      if (!currentUser.settings) {
        await prisma.settings.create({
          data: {
            userId: currentUser.id,
          },
        });
      }

      session.user = currentUser;

      return session;
    },
  },
});
