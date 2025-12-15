"use client";

import Link from "next/link";
import { 
  ListTodo, 
  ArrowLeft, 
  Circle, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Plus,
  Calendar
} from "lucide-react";
import { useTasks, type Task } from "@/contexts/DataContext";
import { appConfig } from "@/lib/config";

// ========================================
// ACTIVE TASKS WIDGET - GLOBAL DATA
// Shows ALL company tasks (NOT filtered by user)
// All users see the same data
// ========================================

const priorityConfig = {
  low: { label: "منخفض", color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  medium: { label: "متوسط", color: "bg-blue-100 text-blue-600", dot: "bg-blue-500" },
  high: { label: "عالي", color: "bg-amber-100 text-amber-600", dot: "bg-amber-500" },
  urgent: { label: "عاجل", color: "bg-red-100 text-red-600", dot: "bg-red-500" },
};

const statusConfig = {
  pending: { label: "قيد الانتظار", color: "text-gray-500", icon: Circle },
  in_progress: { label: "قيد التنفيذ", color: "text-blue-500", icon: Clock },
  completed: { label: "مكتمل", color: "text-green-500", icon: CheckCircle2 },
};

export function ActiveTasksWidget() {
  const { tasks, updateTask } = useTasks();
  
  // Get active tasks (pending and in_progress), sorted by priority then date
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  const activeTasks = tasks
    .filter(t => t.status !== "completed")
    .sort((a, b) => {
      // Sort by priority first
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      // Then by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    })
    .slice(0, 5);

  // Stats
  const pendingCount = tasks.filter(t => t.status === "pending").length;
  const inProgressCount = tasks.filter(t => t.status === "in_progress").length;
  const completedCount = tasks.filter(t => t.status === "completed").length;
  const urgentCount = tasks.filter(t => t.priority === "urgent" && t.status !== "completed").length;

  // Format date
  const formatDate = (date?: string) => {
    if (!date) return null;
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const isTomorrow = d.toDateString() === new Date(now.getTime() + 86400000).toDateString();
    
    if (isToday) return "اليوم";
    if (isTomorrow) return "غداً";
    return d.toLocaleDateString("ar-SA", { month: "short", day: "numeric" });
  };

  // Check if overdue
  const isOverdue = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  // Toggle task completion
  const handleToggleTask = (taskId: string, currentStatus: Task["status"]) => {
    updateTask(taskId, { 
      status: currentStatus === "completed" ? "pending" : "completed" 
    });
  };

  return (
    <div 
      className="p-6 rounded-3xl h-full"
      style={{ backgroundColor: appConfig.design_system.colors.surface }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">المهام النشطة</h3>
            <p className="text-xs text-gray-500">{tasks.length} مهمة</p>
          </div>
        </div>
        <Link 
          href="/tasks"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          عرض الكل
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <div className="p-2 rounded-xl bg-gray-50 text-center">
          <p className="text-xl font-bold text-gray-600">{pendingCount}</p>
          <p className="text-[10px] text-gray-500">انتظار</p>
        </div>
        <div className="p-2 rounded-xl bg-blue-50 text-center">
          <p className="text-xl font-bold text-blue-600">{inProgressCount}</p>
          <p className="text-[10px] text-blue-500">تنفيذ</p>
        </div>
        <div className="p-2 rounded-xl bg-green-50 text-center">
          <p className="text-xl font-bold text-green-600">{completedCount}</p>
          <p className="text-[10px] text-green-500">مكتمل</p>
        </div>
        <div className="p-2 rounded-xl bg-red-50 text-center">
          <p className="text-xl font-bold text-red-600">{urgentCount}</p>
          <p className="text-[10px] text-red-500">عاجل</p>
        </div>
      </div>

      {/* Tasks List */}
      {activeTasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">لا توجد مهام نشطة</p>
          <p className="text-xs text-gray-400 mb-4">أحسنت! أنجزت جميع المهام</p>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
          >
            <Plus className="w-4 h-4" />
            إضافة مهمة
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {activeTasks.map((task) => {
            const priority = priorityConfig[task.priority];
            const status = statusConfig[task.status];
            const StatusIcon = status.icon;
            const dueDate = formatDate(task.dueDate);
            const overdue = isOverdue(task.dueDate) && task.status !== "completed";
            
            return (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className={`
                      mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                      ${task.status === "completed" 
                        ? "bg-green-500 border-green-500 text-white" 
                        : "border-gray-300 hover:border-green-500"
                      }
                    `}
                  >
                    {task.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium text-sm text-gray-800 line-clamp-1 ${task.status === "completed" ? "line-through text-gray-400" : ""}`}>
                        {task.title}
                      </p>
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${priority.dot}`} title={priority.label} />
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {dueDate && (
                        <span className={`flex items-center gap-1 text-xs ${overdue ? "text-red-500" : "text-gray-500"}`}>
                          <Calendar className="w-3 h-3" />
                          {dueDate}
                          {overdue && <AlertCircle className="w-3 h-3" />}
                        </span>
                      )}
                      {task.assignee && (
                        <span className="text-xs text-gray-400">• {task.assignee}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

