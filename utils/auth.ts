import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prismaClient.ts";

export const isAuthDisabled = process.env.DISABLE_AUTH === 'true';

export const defaultUser = {
  id: 'default-user',
  name: 'Default User',
  email: 'default@localhost',
  emailVerified: true,
  image: null,
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const auth = isAuthDisabled ? null : betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin()
  ],
});

export async function validateSession(token: string) {
  if (isAuthDisabled) {
    return { session: null, user: defaultUser };
  }

  if (!auth) {
    throw new Error('Auth is not initialized');
  }

  try {
    const session = await auth.api.getSession({
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    if (!session) {
      return { session: null, user: null };
    }

    return { session, user: session.user };
  } catch (error) {
    console.error('Session validation error:', error);
    return { session: null, user: null };
  }
}
