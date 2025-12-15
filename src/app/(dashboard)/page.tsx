"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Plus, 
  LogOut, 
  Loader2, 
  Settings,
  Folder,
  Users,
  ListTodo,
  FileText,
  TrendingUp,
  AlertTriangle,
  Clock
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { appConfig, type UserRole } from "@/lib/config";
import { useUser, useUserGreeting } from "@/contexts/UserContext";
import { useProjects, useTasks, useEmployees, useReports, useGlobalStats } from "@/contexts/DataContext";

// Dashboard Widgets - Real-Time Data
import { ToolsGrid } from "@/components/dashboard/ToolsGrid";
import { ExecutiveComms } from "@/components/dashboard/ExecutiveComms";
import { RecentProjectsWidget } from "@/components/dashboard/RecentProjectsWidget";
import { ActiveTasksWidget } from "@/components/dashboard/ActiveTasksWidget";
import { TeamActivityWidget } from "@/components/dashboard/TeamActivityWidget";

// ========================================
// MAIN DASHBOARD PAGE
// Uses Real-Time Data from DataContext
// ========================================

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isMounted } = useUser();
  const greeting = useUserGreeting();
  
  // ========================================
  // GLOBAL DATA - Single Source of Truth
  // All data visible to ALL authorized users
  // ========================================
  
  const { projects } = useProjects();    // All company projects
  const { tasks } = useTasks();          // All company tasks
  const { employees } = useEmployees();  // All company employees
  const { reports } = useReports();      // All company reports
  const globalStats = useGlobalStats();  // Company-wide statistics
  
  // Fix hydration mismatch - track client mount
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated (after loading completes)
  // This is a fallback - middleware should handle this
  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  // Loading state - show until mounted and user loaded
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // No user data - show loading (redirect will happen via useEffect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // Get role config
  const roleConfig = appConfig.roles[user.role as UserRole];
  const canAccessAdmin = roleConfig?.canEdit || false;

  // ========================================
  // GLOBAL COMPANY STATS - Real-Time
  // All stats reflect company-wide data
  // ========================================
  
  const stats = {
    projects: {
      total: globalStats.totalProjects,
      active: globalStats.activeProjects,
      atRisk: projects.filter(p => p.status === "review").length,
      completed: projects.filter(p => p.status === "completed").length,
    },
    tasks: {
      total: globalStats.totalTasks,
      pending: globalStats.pendingTasks,
      inProgress: tasks.filter(t => t.status === "in_progress").length,
      completed: tasks.filter(t => t.status === "completed").length,
      urgent: tasks.filter(t => t.priority === "urgent" && t.status !== "completed").length,
    },
    employees: {
      total: globalStats.totalEmployees,
      active: globalStats.activeEmployees,
      avgProductivity: employees.length > 0 
        ? Math.round(employees.reduce((sum, e) => sum + e.productivity, 0) / employees.length)
        : 0,
    },
    reports: {
      total: globalStats.totalReports,
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <header 
        className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 p-6 rounded-3xl"
        style={{ backgroundColor: appConfig.design_system.colors.surface }}
      >
        <div>
          <h1 
            className="text-3xl lg:text-4xl font-extrabold"
            style={{ color: appConfig.design_system.colors.text_primary }}
          >
            {greeting} 👋
          </h1>
          <p 
            className="text-lg mt-2"
            style={{ color: appConfig.design_system.colors.text_secondary }}
          >
            {user.name} • {user.roleLabel}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/reports"
            className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
            style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
          >
            <Plus className="w-5 h-5" />
            تقرير جديد
          </Link>
          
          <Link
            href="/settings"
            className="p-3 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Quick Stats Cards - Real-Time Data */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Card */}
        <Link 
          href="/projects"
          className="p-5 rounded-2xl hover:shadow-lg transition-all duration-300 group"
          style={{ backgroundColor: appConfig.design_system.colors.surface }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Folder className="w-6 h-6" />
            </div>
            {stats.projects.atRisk > 0 && (
              <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {stats.projects.atRisk}
              </span>
            )}
          </div>
          <p className="text-3xl font-extrabold text-gray-800 mb-1">{stats.projects.total}</p>
          <p className="text-sm text-gray-500">المشاريع</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-blue-600">{stats.projects.active} نشط</span>
            <span className="text-gray-300">•</span>
            <span className="text-green-600">{stats.projects.completed} مكتمل</span>
          </div>
        </Link>

        {/* Tasks Card */}
        <Link 
          href="/tasks"
          className="p-5 rounded-2xl hover:shadow-lg transition-all duration-300 group"
          style={{ backgroundColor: appConfig.design_system.colors.surface }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <ListTodo className="w-6 h-6" />
            </div>
            {stats.tasks.urgent > 0 && (
              <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {stats.tasks.urgent} عاجل
              </span>
            )}
          </div>
          <p className="text-3xl font-extrabold text-gray-800 mb-1">{stats.tasks.total}</p>
          <p className="text-sm text-gray-500">المهام</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-amber-600">{stats.tasks.pending} انتظار</span>
            <span className="text-gray-300">•</span>
            <span className="text-blue-600">{stats.tasks.inProgress} تنفيذ</span>
          </div>
        </Link>

        {/* Team Card */}
        <Link 
          href="/team"
          className="p-5 rounded-2xl hover:shadow-lg transition-all duration-300 group"
          style={{ backgroundColor: appConfig.design_system.colors.surface }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            {stats.employees.avgProductivity > 0 && (
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stats.employees.avgProductivity}%
              </span>
            )}
          </div>
          <p className="text-3xl font-extrabold text-gray-800 mb-1">{stats.employees.total}</p>
          <p className="text-sm text-gray-500">الموظفين</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-green-600">{stats.employees.active} نشط</span>
          </div>
        </Link>

        {/* Reports Card */}
        <Link 
          href="/reports"
          className="p-5 rounded-2xl hover:shadow-lg transition-all duration-300 group"
          style={{ backgroundColor: appConfig.design_system.colors.surface }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-800 mb-1">{stats.reports.total}</p>
          <p className="text-sm text-gray-500">التقارير</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-gray-500">المستندات والملفات</span>
          </div>
        </Link>
      </section>

      {/* Tools Grid */}
      <ToolsGrid />

      {/* Main Dashboard Widgets - Real-Time Data */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <RecentProjectsWidget />
        
        {/* Active Tasks */}
        <ActiveTasksWidget />
        
        {/* Team Activity */}
        <TeamActivityWidget />
      </section>

      {/* Executive Comms Widget */}
      <ExecutiveComms />
    </div>
  );
}
