"use client";

import { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin,
  TrendingUp,
  MoreVertical,
  UserPlus,
  Pencil,
  Trash2,
  X,
  Briefcase
} from "lucide-react";
import { appConfig } from "@/lib/config";
import { useUser } from "@/contexts/UserContext";
import { useEmployees, type Employee, type UploadedFile } from "@/contexts/DataContext";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileUpload, ImageUpload } from "@/components/ui/FileUpload";

// ========================================
// TEAM PAGE - GLOBAL COMPANY DIRECTORY
// All employees visible to all authorized users
// ========================================

const departments = ["التقنية", "التصميم", "الإدارة", "التحليل", "التسويق", "المالية", "الموارد البشرية"];
const statuses = [
  { value: "active", label: "نشط" },
  { value: "vacation", label: "إجازة" },
  { value: "inactive", label: "غير نشط" },
];

export default function TeamPage() {
  const { user } = useUser();
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  
  // Form State
  const [form, setForm] = useState<{
    name: string;
    nameEn: string;
    role: string;
    department: string;
    phone: string;
    email: string;
    location: string;
    status: "active" | "vacation" | "inactive";
    productivity: number;
    joinDate: string;
    avatar: UploadedFile | null;
    documents: UploadedFile[];
  }>({
    name: "",
    nameEn: "",
    role: "",
    department: "التقنية",
    phone: "",
    email: "",
    location: "",
    status: "active",
    productivity: 80,
    joinDate: new Date().toISOString().split("T")[0],
    avatar: null,
    documents: [],
  });

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.includes(searchQuery) || 
                         emp.email.includes(searchQuery) ||
                         emp.role.includes(searchQuery);
    const matchesDepartment = filterDepartment === "all" || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Open Add Modal
  const openAddModal = () => {
    setEditingEmployee(null);
    setForm({
      name: "",
      nameEn: "",
      role: "",
      department: "التقنية",
      phone: "",
      email: "",
      location: "",
      status: "active",
      productivity: 80,
      joinDate: new Date().toISOString().split("T")[0],
      avatar: null,
      documents: [],
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setForm({
      name: employee.name,
      nameEn: employee.nameEn || "",
      role: employee.role,
      department: employee.department,
      phone: employee.phone,
      email: employee.email,
      location: employee.location || "",
      status: employee.status,
      productivity: employee.productivity,
      joinDate: employee.joinDate,
      avatar: null,
      documents: employee.documents,
    });
    setShowModal(true);
    setShowMenu(null);
  };

  // Save Employee
  // Save Employee (Global Company Directory - visible to all)
  const handleSave = () => {
    if (!form.name.trim() || !form.role.trim() || !form.email.trim()) return;

    const employeeData = {
      name: form.name,
      nameEn: form.nameEn,
      role: form.role,
      department: form.department,
      phone: form.phone,
      email: form.email,
      location: form.location,
      status: form.status,
      productivity: form.productivity,
      joinDate: form.joinDate,
      avatar: form.avatar?.url,
      documents: form.documents,
    };

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, employeeData);
    } else {
      // Pass createdBy for audit (NOT for visibility restriction)
      addEmployee(employeeData, user?.name || "Unknown");
    }

    setShowModal(false);
  };

  // Delete Employee
  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الموظف؟")) {
      deleteEmployee(id);
    }
    setShowMenu(null);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "vacation": return "bg-amber-100 text-amber-700";
      case "inactive": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "نشط";
      case "vacation": return "إجازة";
      case "inactive": return "غير نشط";
      default: return status;
    }
  };

  // Get initials
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2);
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
            <Users className="w-10 h-10" />
            فريق العمل
          </h1>
          <p 
            className="text-lg mt-2"
            style={{ color: appConfig.design_system.colors.text_secondary }}
          >
            {employees.length} موظف • {employees.filter(e => e.status === "active").length} نشط
          </p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
          style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
        >
          <UserPlus className="w-5 h-5" />
          إضافة موظف
        </button>
      </header>

      {/* Search & Filters */}
      {employees.length > 0 && (
        <div 
          className="p-6 rounded-3xl flex flex-col md:flex-row gap-4"
          style={{ backgroundColor: appConfig.design_system.colors.surface }}
        >
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد أو المنصب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            />
          </div>
          
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white min-w-[180px]"
          >
            <option value="all">جميع الأقسام</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      )}

      {/* Employee Grid or Empty State */}
      {employees.length === 0 ? (
        <EmptyState
          type="employees"
          onAction={openAddModal}
        />
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400">لا يوجد نتائج</h3>
          <p className="text-gray-400 mt-2">لم يتم العثور على موظفين مطابقين للبحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="p-6 rounded-3xl hover:shadow-lg transition-all duration-300 group relative"
              style={{ backgroundColor: appConfig.design_system.colors.surface }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {employee.avatar ? (
                    <img 
                      src={employee.avatar} 
                      alt={employee.name}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                  ) : (
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: "linear-gradient(135deg, #C4B5FD, #A78BFA)" }}
                    >
                      {getInitials(employee.name)}
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.role}</p>
                  </div>
                </div>
                
                {/* Three-dot Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowMenu(showMenu === employee.id ? null : employee.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {showMenu === employee.id && (
                    <div className="absolute left-0 top-full mt-1 w-40 py-2 rounded-xl bg-white shadow-lg border border-gray-100 z-10">
                      <button
                        onClick={() => openEditModal(employee)}
                        className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Department & Status */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                  {employee.department}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(employee.status)}`}>
                  {getStatusLabel(employee.status)}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{employee.location}</span>
                  </div>
                )}
              </div>

              {/* Productivity */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    الإنتاجية
                  </span>
                  <span className="text-sm font-bold text-gray-800">{employee.productivity}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${employee.productivity}%`,
                      backgroundColor: employee.productivity >= 90 ? "#10B981" : 
                                      employee.productivity >= 70 ? "#F59E0B" : "#EF4444"
                    }}
                  />
                </div>
              </div>

              {/* Documents Badge */}
              {employee.documents.length > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  📎 {employee.documents.length} مستند مرفق
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
            style={{ backgroundColor: appConfig.design_system.colors.surface }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
              <h2 className="text-xl font-bold text-gray-800">
                {editingEmployee ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">صورة الموظف</label>
                <ImageUpload
                  currentImage={editingEmployee?.avatar}
                  onImageChange={(file) => setForm(prev => ({ ...prev, avatar: file }))}
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم بالعربي *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                    placeholder="محمد أحمد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم بالإنجليزي</label>
                  <input
                    type="text"
                    value={form.nameEn}
                    onChange={(e) => setForm(prev => ({ ...prev, nameEn: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                    placeholder="Mohammed Ahmed"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">المنصب *</label>
                  <div className="relative">
                    <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                      placeholder="مطور Full Stack"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">القسم</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني *</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                      placeholder="email@company.com"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                      placeholder="+966 50 123 4567"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الموقع</label>
                  <div className="relative">
                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                      placeholder="الرياض"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الحالة</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white"
                  >
                    {statuses.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Productivity & Join Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الإنتاجية: {form.productivity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.productivity}
                    onChange={(e) => setForm(prev => ({ ...prev, productivity: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ الانضمام</label>
                  <input
                    type="date"
                    value={form.joinDate}
                    onChange={(e) => setForm(prev => ({ ...prev, joinDate: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  />
                </div>
              </div>

              {/* Documents Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">المستندات (العقد / CV)</label>
                <FileUpload
                  accept=".pdf,.doc,.docx"
                  multiple
                  label="اسحب المستندات هنا أو انقر للاختيار"
                  description="PDF, Word"
                  files={form.documents}
                  onFilesChange={(files) => setForm(prev => ({ ...prev, documents: files }))}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white rounded-b-3xl">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.role.trim() || !form.email.trim()}
                className="flex-1 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
              >
                {editingEmployee ? "حفظ التغييرات" : "إضافة الموظف"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(null)}
        />
      )}
    </div>
  );
}
