"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

// ========================================
// USER CONTEXT - SINGLE SOURCE OF TRUTH
// ========================================

export interface UserData {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: "ADMIN" | "CHAIRMAN" | "VP" | "GM";
  roleLabel: string;
  avatar: string;
  phone?: string;
}

interface UserContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMounted: boolean; // Track if component has mounted (for hydration)
  updateUser: (data: Partial<UserData>) => void;
}

// Role labels in Arabic
const roleLabels: Record<string, string> = {
  ADMIN: "مدير النظام",
  CHAIRMAN: "رئيس مجلس الإدارة",
  VP: "نائب الرئيس",
  GM: "المدير العام",
};

// Role greetings
export const roleGreetings: Record<string, string> = {
  ADMIN: "مرحباً بك",
  CHAIRMAN: "أهلاً بك، سيادة الرئيس",
  VP: "أهلاً بك، نائب الرئيس",
  GM: "مرحباً، حضرة المدير",
};

// Default user (fallback)
const defaultUser: UserData = {
  id: "default",
  name: "Islam El-Tahawy",
  nameAr: "إسلام الطحاوي",
  email: "islam@company.com",
  role: "GM",
  roleLabel: "المدير العام",
  avatar: "/avatars/islam.png",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Track mounting to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (status === "authenticated" && session?.user) {
      const sessionUser = session.user as any;
      const role = sessionUser.role || "GM";
      
      setUser({
        id: sessionUser.id || "session-user",
        name: sessionUser.name || defaultUser.name,
        nameAr: sessionUser.nameAr || defaultUser.nameAr,
        email: sessionUser.email || defaultUser.email,
        role: role,
        roleLabel: roleLabels[role] || roleLabels.GM,
        avatar: sessionUser.avatar || defaultUser.avatar,
        phone: sessionUser.phone,
      });
    } else {
      // Use default user when not authenticated (for development)
      setUser(defaultUser);
    }
    
    setIsLoading(false);
  }, [session, status, isMounted]);

  const updateUser = (data: Partial<UserData>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: status === "authenticated",
        isMounted,
        updateUser 
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function useUserGreeting() {
  const { user, isMounted } = useUser();
  if (!isMounted || !user) return "مرحباً";
  return roleGreetings[user.role] || "مرحباً";
}
