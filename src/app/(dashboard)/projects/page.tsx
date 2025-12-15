"use client";

import { useState } from "react";
import { 
  Folder, 
  Plus, 
  Search, 
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  Circle,
  MoreVertical,
  ArrowLeft,
  Pencil,
  Trash2,
  X
} from "lucide-react";
import { appConfig } from "@/lib/config";
import { useUser } from "@/contexts/UserContext";
import { useProjects } from "@/contexts/DataContext";
import { EmptyState } from "@/components/ui/EmptyState";

// ========================================
// PROJECTS PAGE - KANBAN BOARD WITH FULL CRUD
// ========================================

const statusConfig = {
  pending: { label: "قيد الانتظار", color: "bg-gray-100 text-gray-700", icon: Circle },
  active: { label: "قيد التنفيذ", color: "bg-blue-100 text-blue-700", icon: Clock },
  review: { label: "قيد المراجعة", color: "bg-amber-100 text-amber-700", icon: AlertTriangle },
  completed: { label: "مكتمل", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

export default function ProjectsPage() {
  const { user } = useUser();
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form State
  const [form, setForm] = useState<{
    name: string;
    description: string;
    client: string;
    status: "pending" | "active" | "review" | "completed";
    progress: number;
    deadline: string;
    team: string[];
    blockers: string[];
    manager: string;
    newTeamMember: string;
    newBlocker: string;
  }>({
    name: "",
    description: "",
    client: "",
    status: "pending",
    progress: 0,
    deadline: "",
    team: [],
    blockers: [],
    manager: "",
    newTeamMember: "",
    newBlocker: "",
  });

  // Filter projects
  const filteredProjects = projects.filter(p => 
    p.name.includes(searchQuery) || 
    p.description?.includes(searchQuery) ||
    p.client?.includes(searchQuery)
  );

  // Group by status
  const groupedProjects = {
    pending: filteredProjects.filter(p => p.status === "pending"),
    active: filteredProjects.filter(p => p.status === "active"),
    review: filteredProjects.filter(p => p.status === "review"),
    completed: filteredProjects.filter(p => p.status === "completed"),
  };

  // Format date
  const formatDate = (date?: string) => {
    if (!date) return "غير محدد";
    return new Date(date).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Check if deadline is soon/passed
  const isDeadlineSoon = (date?: string) => {
    if (!date) return false;
    const deadline = new Date(date);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days <= 7 && days > 0;
  };

  const isDeadlinePassed = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingProject(null);
    setForm({
      name: "",
      description: "",
      client: "",
      status: "pending",
      progress: 0,
      deadline: "",
      team: [],
      blockers: [],
      manager: "",
      newTeamMember: "",
      newBlocker: "",
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (project: any) => {
    setEditingProject(project);
    setForm({
      name: project.name,
      description: project.description || "",
      client: project.client || "",
      status: project.status,
      progress: project.progress,
      deadline: project.deadline || "",
      team: project.team,
      blockers: project.blockers,
      manager: project.manager || "",
      newTeamMember: "",
      newBlocker: "",
    });
    setShowModal(true);
    setSelectedProject(null);
  };

  // Save Project (Global - visible to all users)
  const handleSave = () => {
    if (!form.name.trim()) return;

    const projectData = {
      name: form.name,
      description: form.description,
      client: form.client,
      status: form.status,
      progress: form.progress,
      deadline: form.deadline || undefined,
      team: form.team,
      blockers: form.blockers,
      manager: form.manager,
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      // Pass createdBy for audit (NOT for visibility restriction)
      addProject(projectData, user?.name || "Unknown");
    }

    setShowModal(false);
  };

  // Delete Project
  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المشروع؟")) {
      deleteProject(id);
    }
    setSelectedProject(null);
  };

  // Add team member
  const addTeamMember = () => {
    if (form.newTeamMember.trim()) {
      setForm(prev => ({
        ...prev,
        team: [...prev.team, prev.newTeamMember.trim()],
        newTeamMember: ""
      }));
    }
  };

  // Remove team member
  const removeTeamMember = (index: number) => {
    setForm(prev => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index)
    }));
  };

  // Add blocker
  const addBlocker = () => {
    if (form.newBlocker.trim()) {
      setForm(prev => ({
        ...prev,
        blockers: [...prev.blockers, prev.newBlocker.trim()],
        newBlocker: ""
      }));
    }
  };

  // Remove blocker
  const removeBlocker = (index: number) => {
    setForm(prev => ({
      ...prev,
      blockers: prev.blockers.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
        <div>
          <h1 
            className="text-4xl font-extrabold flex items-center gap-3"
            style={{ color: appConfig.design_system.colors.text_primary }}
          >
            <Folder className="w-10 h-10" />
            المشاريع
          </h1>
          <p 
            className="text-lg mt-2"
            style={{ color: appConfig.design_system.colors.text_secondary }}
          >
            {projects.length} مشروع • {groupedProjects.active.length} قيد التنفيذ
          </p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
          style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
        >
          <Plus className="w-5 h-5" />
          مشروع جديد
        </button>
      </header>

      {/* Search */}
      {projects.length > 0 && (
        <div 
          className="p-6 rounded-3xl"
          style={{ backgroundColor: appConfig.design_system.colors.surface }}
        >
          <div className="relative max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث في المشاريع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            />
          </div>
        </div>
      )}

      {/* Kanban or Empty State */}
      {projects.length === 0 ? (
        <EmptyState
          type="projects"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
            const config = statusConfig[status];
            const StatusIcon = config.icon;
            const statusProjects = groupedProjects[status];

            return (
              <div key={status} className="space-y-4">
                {/* Column Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-5 h-5 text-gray-500" />
                    <h2 className="font-bold text-gray-700">{config.label}</h2>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {statusProjects.length}
                    </span>
                  </div>
                </div>

                {/* Project Cards */}
                <div className="space-y-4 min-h-[200px]">
                  {statusProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 group"
                      style={{ backgroundColor: appConfig.design_system.colors.surface }}
                    >
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                        {project.name}
                      </h3>

                      {project.client && (
                        <p className="text-sm text-gray-500 mb-3">{project.client}</p>
                      )}

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500">التقدم</span>
                          <span className="font-semibold text-gray-700">{project.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${project.progress}%`,
                              backgroundColor: project.progress === 100 ? "#10B981" : "#6366F1"
                            }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        {project.deadline && (
                          <div className={`flex items-center gap-1 text-sm ${
                            isDeadlinePassed(project.deadline) ? "text-red-500" :
                            isDeadlineSoon(project.deadline) ? "text-amber-500" : "text-gray-500"
                          }`}>
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(project.deadline)}</span>
                          </div>
                        )}

                        {project.team.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>{project.team.length}</span>
                          </div>
                        )}

                        {project.blockers.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-red-500">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{project.blockers.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {statusProjects.length === 0 && (
                    <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                      <p className="text-gray-400 text-sm">لا توجد مشاريع</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
            style={{ backgroundColor: appConfig.design_system.colors.surface }}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
              <button onClick={() => setSelectedProject(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">تفاصيل المشروع</h2>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(selectedProject)} className="p-2 rounded-lg hover:bg-blue-100 text-gray-500 hover:text-blue-600">
                  <Pencil className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(selectedProject.id)} className="p-2 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <h3 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedProject.status].color}`}>
                  {statusConfig[selectedProject.status].label}
                </span>
              </div>

              {selectedProject.description && (
                <p className="text-gray-500">{selectedProject.description}</p>
              )}

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">نسبة الإنجاز</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ width: `${selectedProject.progress}%`, backgroundColor: "#6366F1" }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{selectedProject.progress}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedProject.client && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">العميل</p>
                    <p className="font-semibold text-gray-800">{selectedProject.client}</p>
                  </div>
                )}
                {selectedProject.deadline && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">موعد التسليم</p>
                    <p className={`font-semibold ${isDeadlinePassed(selectedProject.deadline) ? "text-red-500" : "text-gray-800"}`}>
                      {formatDate(selectedProject.deadline)}
                    </p>
                  </div>
                )}
              </div>

              {selectedProject.team.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">فريق العمل</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.team.map((member, i) => (
                      <span key={i} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.blockers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    العوائق
                  </h4>
                  <div className="space-y-2">
                    {selectedProject.blockers.map((blocker, i) => (
                      <div key={i} className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                        {blocker}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
            style={{ backgroundColor: appConfig.design_system.colors.surface }}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProject ? "تعديل المشروع" : "مشروع جديد"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المشروع *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  placeholder="تطوير منصة التجارة الإلكترونية"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">العميل</label>
                  <input
                    type="text"
                    value={form.client}
                    onChange={(e) => setForm(prev => ({ ...prev, client: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الحالة</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white"
                  >
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">نسبة الإنجاز: {form.progress}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.progress}
                    onChange={(e) => setForm(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">موعد التسليم</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  />
                </div>
              </div>

              {/* Team */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">فريق العمل</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={form.newTeamMember}
                    onChange={(e) => setForm(prev => ({ ...prev, newTeamMember: e.target.value }))}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                    placeholder="اسم العضو"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTeamMember())}
                  />
                  <button onClick={addTeamMember} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.team.map((member, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {member}
                      <button onClick={() => removeTeamMember(i)} className="hover:text-purple-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Blockers */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">العوائق</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={form.newBlocker}
                    onChange={(e) => setForm(prev => ({ ...prev, newBlocker: e.target.value }))}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                    placeholder="وصف العائق"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBlocker())}
                  />
                  <button onClick={addBlocker} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                    إضافة
                  </button>
                </div>
                <div className="space-y-2">
                  {form.blockers.map((blocker, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-red-50 text-red-700 rounded-xl text-sm">
                      {blocker}
                      <button onClick={() => removeBlocker(i)} className="hover:text-red-900">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white rounded-b-3xl">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim()}
                className="flex-1 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
              >
                {editingProject ? "حفظ التغييرات" : "إنشاء المشروع"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
