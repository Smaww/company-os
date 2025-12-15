"use client";

import Link from "next/link";
import { 
  Users, 
  ArrowLeft, 
  UserPlus,
  TrendingUp,
  MapPin
} from "lucide-react";
import { useEmployees, type Employee } from "@/contexts/DataContext";
import { appConfig } from "@/lib/config";

// ========================================
// TEAM ACTIVITY WIDGET - GLOBAL DATA
// Shows ALL company employees (company directory)
// All users see the same data
// ========================================

const statusConfig = {
  active: { label: "نشط", color: "bg-green-500" },
  vacation: { label: "إجازة", color: "bg-amber-500" },
  inactive: { label: "غير نشط", color: "bg-gray-400" },
};

export function TeamActivityWidget() {
  const { employees } = useEmployees();
  
  // Get recently added employees (sorted by joinDate)
  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 6);

  // Stats
  const activeCount = employees.filter(e => e.status === "active").length;
  const vacationCount = employees.filter(e => e.status === "vacation").length;
  const avgProductivity = employees.length > 0 
    ? Math.round(employees.reduce((sum, e) => sum + e.productivity, 0) / employees.length)
    : 0;

  // Get initials
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2);
  };

  // Get avatar gradient colors based on name hash
  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-purple-400 to-purple-600",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-amber-400 to-amber-600",
      "from-pink-400 to-pink-600",
      "from-indigo-400 to-indigo-600",
      "from-teal-400 to-teal-600",
      "from-rose-400 to-rose-600",
    ];
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  return (
    <div 
      className="p-6 rounded-3xl h-full"
      style={{ backgroundColor: appConfig.design_system.colors.surface }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">فريق العمل</h3>
            <p className="text-xs text-gray-500">{employees.length} موظف</p>
          </div>
        </div>
        <Link 
          href="/team"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          عرض الكل
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-green-50 text-center">
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          <p className="text-xs text-green-500">نشط</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 text-center">
          <p className="text-2xl font-bold text-amber-600">{vacationCount}</p>
          <p className="text-xs text-amber-500">إجازة</p>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{avgProductivity}%</p>
          </div>
          <p className="text-xs text-blue-500">إنتاجية</p>
        </div>
      </div>

      {/* Team Grid */}
      {recentEmployees.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">لا يوجد موظفين بعد</p>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
          >
            <UserPlus className="w-4 h-4" />
            إضافة موظف
          </Link>
        </div>
      ) : (
        <>
          {/* Avatars Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {recentEmployees.map((employee) => {
              const status = statusConfig[employee.status];
              
              return (
                <Link
                  key={employee.id}
                  href="/team"
                  className="group text-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative inline-block mb-2">
                    {employee.avatar ? (
                      <img 
                        src={employee.avatar} 
                        alt={employee.name}
                        className="w-12 h-12 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div 
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(employee.name)} flex items-center justify-center text-white font-bold text-sm mx-auto`}
                      >
                        {getInitials(employee.name)}
                      </div>
                    )}
                    {/* Status Indicator */}
                    <span 
                      className={`absolute bottom-0 right-1/2 translate-x-3 w-3 h-3 rounded-full border-2 border-white ${status.color}`}
                      title={status.label}
                    />
                  </div>
                  
                  {/* Name */}
                  <p className="text-xs font-medium text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                    {employee.name.split(" ")[0]}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">{employee.role}</p>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          {employees.length > 6 && (
            <div className="text-center pt-3 border-t border-gray-100">
              <Link
                href="/team"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                +{employees.length - 6} موظف آخر
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

