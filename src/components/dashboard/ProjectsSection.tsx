"use client";

import { useState, useEffect } from "react";
import {
  FolderKanban,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Calendar,
  MoreHorizontal,
  Plus,
  Loader2,
} from "lucide-react";
import { appConfig } from "@/lib/config";

// ========================================
// PROJECT TYPES
// ========================================

interface Project {
  id: string;
  name: string;
  client: string | null;
  status: string;
  progress: number;
  deadline: string | null;
  _count?: { tasks: number };
  members?: { user: { id: string; name: string } }[];
  blockers?: { id: string; description: string; severity: string }[];
}

type ProjectStatus = "active" | "on_hold" | "completed" | "at_risk";

// ========================================
// STATUS CONFIG
// ========================================

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  active: { label: "قيد التنفيذ", bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
  at_risk: { label: "معرض للخطر", bg: "bg-red-100", text: "text-red-700", icon: AlertTriangle },
  on_hold: { label: "متوقف", bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
  completed: { label: "مكتمل", bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle2 }
};

// ========================================
// PROJECT CARD COMPONENT
// ========================================

function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status] || statusConfig.active;
  const deadline = project.deadline ? new Date(project.deadline) : null;
  const daysRemaining = deadline 
    ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const isUrgent = daysRemaining !== null && daysRemaining <= 7 && project.status !== "completed";
  const memberCount = project.members?.length || 0;

  return (
    <div 
      className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      style={{ 
        backgroundColor: appConfig.design_system.colors.surface,
        borderRadius: "24px"
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${status.bg}`}>
            <FolderKanban className={`w-5 h-5 ${status.text}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{project.name}</h3>
            <p className="text-sm text-gray-500">{project.client || "—"}</p>
          </div>
        </div>
        <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">التقدم</span>
          <span className="text-sm font-bold text-gray-800">{project.progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              project.status === "at_risk" ? "bg-red-500" : 
              project.status === "completed" ? "bg-blue-500" : "bg-green-500"
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Blockers */}
      {project.blockers && project.blockers.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100">
          <p className="text-xs font-semibold text-red-600 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            عوائق ({project.blockers.length})
          </p>
          <p className="text-xs text-red-700">{project.blockers[0].description}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-500">
            <Users className="w-4 h-4" />
            <span className="text-sm">{memberCount}</span>
          </div>
          {daysRemaining !== null && (
            <div className={`flex items-center gap-1 ${isUrgent ? "text-red-500" : "text-gray-500"}`}>
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {daysRemaining <= 0 ? "متأخر" : `${daysRemaining} يوم`}
              </span>
            </div>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>
    </div>
  );
}

// ========================================
// MAIN PROJECTS SECTION
// ========================================

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects");
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.status === filter);

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "active").length,
    atRisk: projects.filter(p => p.status === "at_risk").length,
    completed: projects.filter(p => p.status === "completed").length
  };

  if (isLoading) {
    return (
      <section>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
          <span className="w-1.5 h-7 bg-gray-800 rounded-full"></span>
          مركز العمليات والمشاريع
        </h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
            <span className="w-1.5 h-7 bg-gray-800 rounded-full"></span>
            مركز العمليات والمشاريع
          </h2>
          <p className="text-gray-500 mt-1">متابعة المشاريع والمواعيد النهائية</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "إجمالي المشاريع", value: stats.total, color: "bg-gray-100", textColor: "text-gray-700" },
          { label: "قيد التنفيذ", value: stats.active, color: "bg-green-100", textColor: "text-green-700" },
          { label: "معرض للخطر", value: stats.atRisk, color: "bg-red-100", textColor: "text-red-700" },
          { label: "مكتمل", value: stats.completed, color: "bg-blue-100", textColor: "text-blue-700" }
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl ${stat.color}`}>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-3xl font-extrabold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: "all", label: "الكل" },
          { key: "active", label: "قيد التنفيذ" },
          { key: "at_risk", label: "معرض للخطر" },
          { key: "on_hold", label: "متوقف" },
          { key: "completed", label: "مكتمل" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              filter === tab.key 
                ? "bg-gray-800 text-white" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl">
          <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">لا توجد مشاريع حالياً</p>
          <p className="text-sm text-gray-400">يمكن لمدير النظام إضافة مشاريع من لوحة الإدارة</p>
        </div>
      )}
    </section>
  );
}
