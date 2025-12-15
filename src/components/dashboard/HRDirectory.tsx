"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  FileText,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  ChevronLeft,
  X,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import { appConfig } from "@/lib/config";

// ========================================
// EMPLOYEE TYPES
// ========================================

interface Employee {
  id: string;
  name: string;
  nameEn: string | null;
  email: string;
  phone: string | null;
  role: string;
  department: string;
  location: string | null;
  joinDate: string;
  status: string;
  productivity: number;
  bio: string | null;
  documents: { id: string; name: string; type: string; uploadDate: string }[];
  performance: { period: string; score: number; notes: string | null }[];
}

// ========================================
// STATUS CONFIG
// ========================================

const statusConfig: Record<string, { label: string; bg: string; ring: string }> = {
  online: { label: "متصل", bg: "bg-green-500", ring: "ring-green-500" },
  active: { label: "نشط", bg: "bg-green-500", ring: "ring-green-500" },
  offline: { label: "غير متصل", bg: "bg-gray-400", ring: "ring-gray-400" },
  away: { label: "بعيد", bg: "bg-amber-500", ring: "ring-amber-500" },
  inactive: { label: "غير نشط", bg: "bg-gray-400", ring: "ring-gray-400" },
  on_leave: { label: "في إجازة", bg: "bg-blue-500", ring: "ring-blue-500" },
};

// ========================================
// EMPLOYEE CARD
// ========================================

function EmployeeCard({ employee, onSelect }: { employee: Employee; onSelect: () => void }) {
  const status = statusConfig[employee.status] || statusConfig.active;

  return (
    <div 
      onClick={onSelect}
      className="p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      style={{ 
        backgroundColor: appConfig.design_system.colors.surface,
        borderRadius: "20px"
      }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center text-purple-700 font-bold text-lg">
            {employee.name.charAt(0)}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${status.bg} border-2 border-white`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 truncate">{employee.name}</h3>
          <p className="text-sm text-gray-500 truncate">{employee.role}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
              {employee.department}
            </span>
            {employee.location && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs">
                {employee.location}
              </span>
            )}
          </div>
        </div>

        {/* Productivity */}
        <div className="text-left">
          <div className="flex items-center gap-1">
            <TrendingUp className={`w-4 h-4 ${employee.productivity >= 80 ? "text-green-500" : "text-amber-500"}`} />
            <span className={`text-lg font-bold ${employee.productivity >= 80 ? "text-green-600" : "text-amber-600"}`}>
              {employee.productivity}%
            </span>
          </div>
          <p className="text-xs text-gray-400">الإنتاجية</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {employee.documents?.length || 0} ملف
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {employee.performance?.[0]?.score || "-"}
          </span>
        </div>
        <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
    </div>
  );
}

// ========================================
// EMPLOYEE DETAIL MODAL
// ========================================

function EmployeeDetailModal({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"info" | "docs" | "performance">("info");
  const status = statusConfig[employee.status] || statusConfig.active;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: appConfig.design_system.colors.surface,
          borderRadius: appConfig.design_system.radius
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-start justify-between" style={{ borderRadius: "32px 32px 0 0" }}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center text-purple-700 font-bold text-xl">
                {employee.name.charAt(0)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${status.bg} border-2 border-white`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{employee.name}</h2>
              <p className="text-gray-500">{employee.role}</p>
              <p className="text-sm text-gray-400">{employee.department} • {employee.location || "—"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-gray-100">
          {[
            { key: "info", label: "المعلومات" },
            { key: "docs", label: "الملفات" },
            { key: "performance", label: "الأداء" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key 
                  ? "bg-gray-800 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "info" && (
            <div className="space-y-6">
              {employee.bio && (
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">نبذة</h4>
                  <p className="text-gray-600 leading-relaxed">{employee.bio}</p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-gray-800 mb-3">معلومات الاتصال</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{employee.email}</span>
                  </div>
                  {employee.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  {employee.location && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span>{employee.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>تاريخ الانضمام: {new Date(employee.joinDate).toLocaleDateString("ar-SA")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "docs" && (
            <div className="space-y-3">
              {employee.documents && employee.documents.length > 0 ? (
                employee.documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">{doc.name}</p>
                        <p className="text-xs text-gray-500">{new Date(doc.uploadDate).toLocaleDateString("ar-SA")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-white transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white transition-colors">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">لا توجد ملفات</p>
              )}
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-4">
              {employee.performance && employee.performance.length > 0 ? (
                employee.performance.map((record, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{record.period}</span>
                      <span className={`text-2xl font-bold ${
                        record.score >= 90 ? "text-green-600" : 
                        record.score >= 80 ? "text-blue-600" : "text-amber-600"
                      }`}>
                        {record.score}%
                      </span>
                    </div>
                    {record.notes && <p className="text-sm text-gray-500">{record.notes}</p>}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">لا توجد سجلات أداء</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================
// MAIN HR DIRECTORY SECTION
// ========================================

export function HRDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/admin/employees");
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const departments = [...new Set(employees.map(e => e.department))];
  
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.includes(searchQuery) || 
                         emp.role.includes(searchQuery) ||
                         emp.email.includes(searchQuery);
    const matchesDept = departmentFilter === "all" || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const stats = {
    total: employees.length,
    online: employees.filter(e => e.status === "online" || e.status === "active").length,
    avgProductivity: employees.length > 0 
      ? Math.round(employees.reduce((sum, e) => sum + e.productivity, 0) / employees.length)
      : 0
  };

  if (isLoading) {
    return (
      <section>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
          <span className="w-1.5 h-7 bg-gray-800 rounded-full"></span>
          ملفات الموظفين
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
            ملفات الموظفين
          </h2>
          <p className="text-gray-500 mt-1">الملفات الشخصية والمستندات وتاريخ الأداء</p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-gray-100">
            <span className="text-sm text-gray-500">الإجمالي: </span>
            <span className="font-bold text-gray-800">{stats.total}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-green-100">
            <span className="text-sm text-green-600">نشط: </span>
            <span className="font-bold text-green-700">{stats.online}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-blue-100">
            <span className="text-sm text-blue-600">الإنتاجية: </span>
            <span className="font-bold text-blue-700">{stats.avgProductivity}%</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو المنصب..."
            className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
          />
        </div>
        {departments.length > 0 && (
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white"
          >
            <option value="all">كل الأقسام</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        )}
      </div>

      {/* Employee Grid */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEmployees.map((employee) => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee} 
              onSelect={() => setSelectedEmployee(employee)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">لا يوجد موظفون حالياً</p>
          <p className="text-sm text-gray-400">يمكن لمدير النظام إضافة موظفين من لوحة الإدارة</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
        />
      )}
    </section>
  );
}
