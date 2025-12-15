import { PrismaClient } from "@prisma/client";

// ========================================
// PRISMA CLIENT SINGLETON
// Prevents connection pool exhaustion in serverless environments
// ========================================

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with logging in development
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" 
    ? ["query", "error", "warn"] 
    : ["error"],
});

// Only cache the client in non-production to prevent hot reload issues
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
