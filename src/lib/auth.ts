import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateCredentials } from "@/services/db/users";
import { appConfig, type UserRole } from "./config";

// ========================================
// NEXTAUTH CONFIGURATION - v4.0
// ========================================

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await validateCredentials(credentials.email, credentials.password);
        
        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
          avatar: user.avatar,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.avatar = (user as any).avatar;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).avatar = token.avatar;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET || "ceo-workspace-secret-key-v4"
};

// ========================================
// HELPER FUNCTIONS
// ========================================

export function getRoleConfig(role: UserRole) {
  return appConfig.roles[role];
}

export function getGreeting(role: UserRole): string {
  return appConfig.roles[role]?.greeting || "مرحباً";
}

export function canEdit(role: UserRole): boolean {
  return appConfig.roles[role]?.canEdit || false;
}

export function getContactsForRole(currentRole: UserRole) {
  // Return all contacts except the current user's role
  return Object.entries(appConfig.contacts_registry)
    .filter(([role]) => role !== currentRole)
    .map(([role, data]) => ({
      role: role as UserRole,
      ...data
    }));
}
