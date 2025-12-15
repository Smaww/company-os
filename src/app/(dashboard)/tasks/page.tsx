"use client";

import { useState } from "react";
import { 
  ListTodo, 
  Plus, 
  Search, 
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Circle,
  AlertCircle,
  MoreVertical,
  Filter,
  Pencil,
  Trash2,
  X
} from "lucide-react";
import { appConfig } from "@/lib/config";
import { useUser } from "@/contexts/UserContext";
import { useTasks, type Task } from "@/contexts/DataContext";
import { EmptyState } from "@/components/ui/EmptyState";

// ========================================
// TASKS PAGE - FULL CRUD
// ========================================

const statusConfig = {
  pending: { label: "قيد الانتظار", color: "bg-gray-100 text-gray-700", icon: Circle },
  in_progress: { label: "قيد التنفيذ", color: "bg-blue-100 text-blue-700", icon: Clock },
  completed: { label: "مكتمل", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

const priorityConfig = {
  low: { label: "منخفض", color: "bg-gray-100 text-gray-600" },
  medium: { label: "متوسط", color: "bg-blue-100 text-blue-600" },
  high: { label: "عالي", color: "bg-amber-100 text-amber-600" },
  urgent: { label: "عاجل", color: "bg-red-100 text-red-600" },
};

export default function TasksPage() {
  const { user } = useUser();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState<{
    title: string;
    description: string;
    status: "pending" | "in_progress" | "completed";
    priority: "low" | "medium" | "high" | "urgent";
    assignee: string;
    dueDate: string;
    project: string;
  }>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    assignee: "",
    dueDate: "",
    project: "",
  });

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.includes(searchQuery) || 
                         task.description?.includes(searchQuery) ||
                         task.project?.includes(searchQuery);
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Format date
  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("ar-SA", { month: "short", day: "numeric" });
  };

  // Check if overdue
  const isOverdue = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingTask(null);
    setForm({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      assignee: "",
      dueDate: "",
      project: "",
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      assignee: task.assignedTo || "",
      dueDate: task.dueDate || "",
      project: task.project || "",
    });
    setShowModal(true);
    setShowMenu(null);
  };

  // Save Task
  // Save Task (Global - visible to all users)
  const handleSave = () => {
    if (!form.title.trim()) return;

    const taskData = {
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      assignedTo: form.assignee || undefined, // For assignment, NOT visibility
      dueDate: form.dueDate || undefined,
      project: form.project || undefined,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      // Pass createdBy for audit (NOT for visibility restriction)
      addTask(taskData, user?.name || "Unknown");
    }

    setShowModal(false);
  };

  // Delete Task
  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
      deleteTask(id);
    }
    setShowMenu(null);
  };

  // Toggle task status
  const toggleTaskStatus = (taskId: string, currentStatus: Task["status"]) => {
    const newStatus = currentStatus === "completed" ? "pending" : 
                     currentStatus === "pending" ? "in_progress" : "completed";
    updateTask(taskId, { status: newStatus });
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
            <ListTodo className="w-10 h-10" />
            المهام المشتركة
          </h1>
          <p 
            className="text-lg mt-2"
            style={{ color: appConfig.design_system.colors.text_secondary }}
          >
            {tasks.length} مهمة • {tasks.filter(t => t.status === "completed").length} مكتمل
          </p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
          style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
        >
          <Plus className="w-5 h-5" />
          مهمة جديدة
        </button>
      </header>

      {/* Search & Filters */}
      {tasks.length > 0 && (
        <div 
          className="p-6 rounded-3xl flex flex-col md:flex-row gap-4"
          style={{ backgroundColor: appConfig.design_system.colors.surface }}
        >
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث في المهام..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white min-w-[150px]"
          >
            <option value="all">جميع الحالات</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white min-w-[150px]"
          >
            <option value="all">جميع الأولويات</option>
            {Object.entries(priorityConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Tasks List or Empty State */}
      {tasks.length === 0 ? (
        <EmptyState
          type="tasks"
          onAction={openAddModal}
        />
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400">لا يوجد نتائج</h3>
          <p className="text-gray-400 mt-2">لم يتم العثور على مهام مطابقة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const StatusIcon = statusConfig[task.status].icon;
            
            return (
              <div
                key={task.id}
                className={`p-5 rounded-2xl flex items-start gap-4 hover:shadow-md transition-all duration-300 group ${
                  task.status === "completed" ? "opacity-60" : ""
                }`}
                style={{ backgroundColor: appConfig.design_system.colors.surface }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTaskStatus(task.id, task.status)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.status === "completed" 
                      ? "bg-green-500 border-green-500 text-white" 
                      : "border-gray-300 hover:border-green-500"
                  }`}
                >
                  {task.status === "completed" && <CheckCircle2 className="w-4 h-4" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`font-bold text-gray-800 ${task.status === "completed" ? "line-through" : ""}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                      )}
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShowMenu(showMenu === task.id ? null : task.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {showMenu === task.id && (
                        <div className="absolute left-0 top-full mt-1 w-36 py-2 rounded-xl bg-white shadow-lg border border-gray-100 z-10">
                          <button
                            onClick={() => openEditModal(task)}
                            className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Pencil className="w-4 h-4" />
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[task.status].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[task.status].label}
                    </span>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityConfig[task.priority].color}`}>
                      {priorityConfig[task.priority].label}
                    </span>

                    {task.assignedTo && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        {task.assignedTo}
                      </span>
                    )}

                    {task.dueDate && (
                      <span className={`flex items-center gap-1 text-xs ${
                        isOverdue(task.dueDate) && task.status !== "completed" 
                          ? "text-red-500" 
                          : "text-gray-500"
                      }`}>
                        <Calendar className="w-3 h-3" />
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && task.status !== "completed" && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                      </span>
                    )}

                    {task.project && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                        {task.project}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ backgroundColor: appConfig.design_system.colors.surface }}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingTask ? "تعديل المهمة" : "مهمة جديدة"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">عنوان المهمة *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  placeholder="مراجعة تصميم الصفحة الرئيسية"
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الأولوية</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white"
                  >
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">المسؤول</label>
                  <input
                    type="text"
                    value={form.assignee}
                    onChange={(e) => setForm(prev => ({ ...prev, assignee: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                    placeholder="اسم الموظف"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">المشروع</label>
                <input
                  type="text"
                  value={form.project}
                  onChange={(e) => setForm(prev => ({ ...prev, project: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  placeholder="اسم المشروع المرتبط"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="flex-1 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
              >
                {editingTask ? "حفظ التغييرات" : "إضافة المهمة"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowMenu(null)} />
      )}
    </div>
  );
}
