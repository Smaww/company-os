import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/lib/config";

// ========================================
// USER SERVICE - DATABASE OPERATIONS
// ========================================

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  nameAr?: string;
  role: UserRole;
  phone?: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  nameAr: string | null;
  role: string;
  phone: string | null;
  avatar: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create a new user
export async function createUser(input: CreateUserInput): Promise<UserWithoutPassword> {
  const hashedPassword = await bcrypt.hash(input.password, 12);
  
  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      name: input.name,
      nameAr: input.nameAr,
      role: input.role,
      phone: input.phone,
    },
    select: {
      id: true,
      email: true,
      name: true,
      nameAr: true,
      role: true,
      phone: true,
      avatar: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

// Get user by email
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Get user by ID (without password)
export async function getUserById(id: string): Promise<UserWithoutPassword | null> {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      nameAr: true,
      role: true,
      phone: true,
      avatar: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// Validate user credentials
export async function validateCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);
  
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Get all users
export async function getAllUsers(): Promise<UserWithoutPassword[]> {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      nameAr: true,
      role: true,
      phone: true,
      avatar: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

