"use client";

import { 
  Users, 
  Folder, 
  FileText, 
  ListTodo, 
  Wrench,
  Plus,
  Inbox
} from "lucide-react";
import { appConfig } from "@/lib/config";

// ========================================
// EMPTY STATE COMPONENT
// Beautiful "Soft UI" empty state for lists
// ========================================

interface EmptyStateProps {
  type: "employees" | "projects" | "tasks" | "reports" | "tools" | "generic";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const emptyStateConfig = {
  employees: {
    icon: Users,
    title: "لا يوجد موظفين",
    description: "ابدأ بإضافة أول موظف إلى فريقك",
    actionLabel: "إضافة موظف",
    gradient: "from-purple-100 to-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
  },
  projects: {
    icon: Folder,
    title: "لا توجد مشاريع",
    description: "أنشئ أول مشروع لبدء العمل",
    actionLabel: "إضافة مشروع",
    gradient: "from-blue-100 to-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  tasks: {
    icon: ListTodo,
    title: "لا توجد مهام",
    description: "أضف مهمة جديدة لتنظيم عملك",
    actionLabel: "إضافة مهمة",
    gradient: "from-green-100 to-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
  },
  reports: {
    icon: FileText,
    title: "لا توجد تقارير",
    description: "ارفع أول تقرير أو مستند",
    actionLabel: "رفع تقرير",
    gradient: "from-amber-100 to-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  tools: {
    icon: Wrench,
    title: "لا توجد أدوات",
    description: "أضف أدواتك المفضلة للوصول السريع",
    actionLabel: "إضافة أداة",
    gradient: "from-indigo-100 to-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-500",
  },
  generic: {
    icon: Inbox,
    title: "لا توجد بيانات",
    description: "لا توجد بيانات حتى الآن",
    actionLabel: "إضافة جديد",
    gradient: "from-gray-100 to-gray-50",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
  },
};

export function EmptyState({ 
  type, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <div 
      className={`
        relative overflow-hidden rounded-3xl p-12
        bg-gradient-to-br ${config.gradient}
        flex flex-col items-center justify-center text-center
        min-h-[400px]
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" className="text-gray-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon */}
        <div 
          className={`
            w-24 h-24 rounded-3xl ${config.iconBg} ${config.iconColor}
            flex items-center justify-center mb-6
            shadow-lg shadow-gray-200/50
            animate-pulse
          `}
        >
          <Icon className="w-12 h-12" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3 
          className="text-2xl font-extrabold mb-3"
          style={{ color: appConfig.design_system.colors.text_primary }}
        >
          {title || config.title}
        </h3>

        {/* Description */}
        <p 
          className="text-lg mb-8 max-w-md"
          style={{ color: appConfig.design_system.colors.text_secondary }}
        >
          {description || config.description}
        </p>

        {/* Action Button */}
        {onAction && (
          <button
            onClick={onAction}
            className="
              flex items-center gap-3 px-8 py-4
              text-white font-bold text-lg
              rounded-2xl shadow-lg
              hover:opacity-90 hover:scale-105
              transition-all duration-300
              group
            "
            style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            <span>{actionLabel || config.actionLabel}</span>
          </button>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-white/50 blur-2xl" />
      <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-white/50 blur-3xl" />
    </div>
  );
}
