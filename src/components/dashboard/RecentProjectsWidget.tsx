"use client";

import Link from "next/link";
import { 
  Folder, 
  ArrowLeft, 
  Circle, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  Plus 
} from "lucide-react";
import { useProjects, type Project } from "@/contexts/DataContext";
import { appConfig } from "@/lib/config";

// ========================================
// RECENT PROJECTS WIDGET - GLOBAL DATA
// Shows ALL company projects (NOT filtered by user)
// All users see the same data
// ========================================

const statusConfig = {
  pending: { label: "قيد الانتظار", color: "bg-gray-100 text-gray-600", icon: Circle },
  active: { label: "قيد التنفيذ", color: "bg-blue-100 text-blue-600", icon: Clock },
  review: { label: "مراجعة", color: "bg-amber-100 text-amber-600", icon: AlertTriangle },
  completed: { label: "مكتمل", color: "bg-green-100 text-green-600", icon: CheckCircle2 },
};

export function RecentProjectsWidget() {
  const { projects } = useProjects();
  
  // Get top 5 most recent projects (sorted by createdAt descending)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Stats
  const activeCount = projects.filter(p => p.status === "active").length;
  const completedCount = projects.filter(p => p.status === "completed").length;
  const atRiskCount = projects.filter(p => p.status === "review").length;

  return (
    <div 
      className="p-6 rounded-3xl h-full"
      style={{ backgroundColor: appConfig.design_system.colors.surface }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">المشاريع النشطة</h3>
            <p className="text-xs text-gray-500">{projects.length} مشروع</p>
          </div>
        </div>
        <Link 
          href="/projects"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          عرض الكل
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-blue-50 text-center">
          <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
          <p className="text-xs text-blue-500">قيد التنفيذ</p>
        </div>
        <div className="p-3 rounded-xl bg-green-50 text-center">
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          <p className="text-xs text-green-500">مكتمل</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 text-center">
          <p className="text-2xl font-bold text-amber-600">{atRiskCount}</p>
          <p className="text-xs text-amber-500">مراجعة</p>
        </div>
      </div>

      {/* Projects List */}
      {recentProjects.length === 0 ? (
        <div className="text-center py-8">
          <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">لا توجد مشاريع بعد</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
          >
            <Plus className="w-4 h-4" />
            إضافة مشروع
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recentProjects.map((project) => {
            const status = statusConfig[project.status];
            const StatusIcon = status.icon;
            
            return (
              <Link
                key={project.id}
                href="/projects"
                className="block p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h4>
                  <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${project.progress}%`,
                        backgroundColor: project.progress === 100 ? "#10B981" : "#6366F1"
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-10 text-left">
                    {project.progress}%
                  </span>
                </div>

                {/* Client & Team */}
                {(project.client || project.team.length > 0) && (
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    {project.client && <span>{project.client}</span>}
                    {project.team.length > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">
                          {project.team.length}
                        </span>
                        عضو
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

