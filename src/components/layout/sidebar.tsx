"use client";

import {
  LayoutGrid,
  Folder,
  Users,
  ListTodo,
  FileText,
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";

// ========================================
// SIDEBAR NAVIGATION - SYNCHRONIZED
// ========================================

const sidebarNav = [
  { label: "الرئيسية", icon: LayoutGrid, href: "/" },
  { label: "المشاريع", icon: Folder, href: "/projects" },
  { label: "الفريق", icon: Users, href: "/team" },
  { label: "المهام", icon: ListTodo, href: "/tasks" },
  { label: "التقارير", icon: FileText, href: "/reports" },
  { label: "الإعدادات", icon: Settings, href: "/settings" },
];

// ========================================
// DESIGN SYSTEM VALUES
// ========================================

const colors = {
  surface_primary: "#FFFFFF",
  surface_secondary: "#1A1A1A",
  text_primary: "#1F2937",
  text_secondary: "#9CA3AF",
  accents: { mint_green: "#A7F3D0", lavender: "#C4B5FD" }
};

// ========================================
// SIDEBAR COMPONENT
// ========================================

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isMounted } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Track component mount for hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // ========================================
  // SECURE LOGOUT - The "Clean Exit"
  // ========================================
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // 1. Wipe Local State - Clear all stored data
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear any cached data
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      }
      
      // 2. Sign Out via NextAuth - Clear session
      await signOut({ 
        callbackUrl: "/login", 
        redirect: false 
      });
      
      // 3. Hard redirect to login
      window.location.href = "/login";
      
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: Force redirect even if signOut fails
      window.location.href = "/login";
    }
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // User display values - only compute after mount
  const displayName = mounted && user ? user.name : "";
  const displayRole = mounted && user ? user.roleLabel : "";
  const displayInitials = mounted && user ? getInitials(user.name) : "";
  const showUserContent = mounted && isMounted && !isLoading && user;

  return (
    <div className="h-full flex flex-col bg-white">
      
      {/* Logo & Brand */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: `linear-gradient(135deg, ${colors.accents.mint_green}, #6EE7B7)` }}
          >
            <span className="text-gray-800 font-extrabold text-lg">C</span>
          </div>
          <div>
            <h1 className="font-extrabold text-gray-800 text-lg">نظام الشركة</h1>
            <p className="text-xs text-gray-500">مركز القيادة</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
          <Search className="w-4 h-4" />
          <span className="text-sm">بحث...</span>
          <kbd className="mr-auto text-xs bg-white px-2 py-0.5 rounded border border-gray-200 font-mono">⌘K</kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <p className="px-3 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
          القائمة الرئيسية
        </p>
        <div className="space-y-1">
          {sidebarNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? "bg-green-50 text-green-700 font-semibold" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }
                `}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-sm">{item.label}</span>
                
                {isActive && (
                  <div 
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full"
                    style={{ backgroundColor: "#059669" }}
                  />
                )}
                
                <ChevronLeft className={`
                  w-4 h-4 mr-auto opacity-0 group-hover:opacity-100 transition-opacity
                  ${isActive ? "opacity-100" : ""}
                `} />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Notifications */}
      <div className="px-3 py-3 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="text-sm">الإشعارات</span>
          <span 
            className="absolute top-2 right-6 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#EF4444" }}
          />
          <span 
            className="mr-auto text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: colors.accents.lavender, color: "#7C3AED" }}
          >
            3
          </span>
        </button>
      </div>

      {/* User Profile & Logout - HYDRATION SAFE */}
      <div className="p-4 border-t border-gray-100" suppressHydrationWarning>
        {!showUserContent ? (
          // Loading skeleton - consistent on server and client
          <div className="flex items-center gap-3 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-24" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-16" />
            </div>
          </div>
        ) : (
          <div className="space-y-3" suppressHydrationWarning>
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{ background: `linear-gradient(135deg, ${colors.accents.lavender}, #A78BFA)` }}
                suppressHydrationWarning
              >
                {displayInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate" suppressHydrationWarning>
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate" suppressHydrationWarning>
                  {displayRole}
                </p>
              </div>
            </div>

            {/* Logout Button - Prominent Red */}
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الخروج...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
