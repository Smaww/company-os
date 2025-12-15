"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  FolderKanban,
  TrendingUp,
  Bell,
  Plus,
  Save,
  Loader2,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { appConfig } from "@/lib/config";

// ========================================
// ADMIN DASHBOARD - DATA ENTRY
// Only accessible to ADMIN role
// ========================================

type TabType = "employees" | "projects" | "kpis" | "alerts";

interface FormState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("employees");
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: null,
  });

  // Check if user is ADMIN
  useEffect(() => {
    if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      if (userRole !== "ADMIN") {
        router.push("/");
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  const userRole = (session?.user as any)?.role;
  if (userRole !== "ADMIN") {
    return null;
  }

  const tabs = [
    { id: "employees", label: "الموظفين", icon: Users },
    { id: "projects", label: "المشاريع", icon: FolderKanban },
    { id: "kpis", label: "مؤشرات الأداء", icon: TrendingUp },
    { id: "alerts", label: "التنبيهات", icon: Bell },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: appConfig.design_system.colors.bg }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            لوحة إدارة البيانات
          </h1>
          <p className="text-gray-500">إضافة وتعديل بيانات النظام</p>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-amber-700 text-sm">
            هذه الصفحة متاحة فقط لمديري النظام. التغييرات تنعكس مباشرة على لوحة التحكم الرئيسية.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div 
          className="p-8"
          style={{ 
            backgroundColor: appConfig.design_system.colors.surface,
            borderRadius: appConfig.design_system.radius
          }}
        >
          {activeTab === "employees" && <EmployeeForm formState={formState} setFormState={setFormState} />}
          {activeTab === "projects" && <ProjectForm formState={formState} setFormState={setFormState} />}
          {activeTab === "kpis" && <KPIForm formState={formState} setFormState={setFormState} />}
          {activeTab === "alerts" && <AlertForm formState={formState} setFormState={setFormState} />}
        </div>
      </div>
    </div>
  );
}

// ========================================
// EMPLOYEE FORM
// ========================================

function EmployeeForm({ formState, setFormState }: { formState: FormState; setFormState: any }) {
  const [data, setData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    location: "",
    phone: "",
    joinDate: "",
    productivity: "80",
    bio: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ isLoading: true, error: null, success: null });

    try {
      const response = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          joinDate: new Date(data.joinDate),
          productivity: parseInt(data.productivity),
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في إضافة الموظف");
      }

      setFormState({ isLoading: false, error: null, success: "تم إضافة الموظف بنجاح" });
      setData({ name: "", email: "", role: "", department: "", location: "", phone: "", joinDate: "", productivity: "80", bio: "" });
    } catch (error) {
      setFormState({ isLoading: false, error: "حدث خطأ أثناء الإضافة", success: null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">إضافة موظف جديد</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">المنصب *</label>
          <input
            type="text"
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            placeholder="مطور برمجيات"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">القسم *</label>
          <input
            type="text"
            value={data.department}
            onChange={(e) => setData({ ...data, department: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            placeholder="التقنية"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            placeholder="الرياض"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانضمام *</label>
          <input
            type="date"
            value={data.joinDate}
            onChange={(e) => setData({ ...data, joinDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الإنتاجية (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.productivity}
            onChange={(e) => setData({ ...data, productivity: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">نبذة</label>
        <textarea
          value={data.bio}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
          rows={3}
        />
      </div>

      <FormFeedback formState={formState} />

      <button
        type="submit"
        disabled={formState.isLoading}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 disabled:opacity-50"
      >
        {formState.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        إضافة الموظف
      </button>
    </form>
  );
}

// ========================================
// PROJECT FORM
// ========================================

function ProjectForm({ formState, setFormState }: { formState: FormState; setFormState: any }) {
  const [data, setData] = useState({
    name: "",
    client: "",
    description: "",
    status: "active",
    progress: "0",
    deadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ isLoading: true, error: null, success: null });

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          progress: parseInt(data.progress),
          deadline: data.deadline ? new Date(data.deadline) : null,
        }),
      });

      if (!response.ok) throw new Error("فشل في إضافة المشروع");

      setFormState({ isLoading: false, error: null, success: "تم إضافة المشروع بنجاح" });
      setData({ name: "", client: "", description: "", status: "active", progress: "0", deadline: "" });
    } catch (error) {
      setFormState({ isLoading: false, error: "حدث خطأ أثناء الإضافة", success: null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">إضافة مشروع جديد</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">اسم المشروع *</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">العميل</label>
          <input
            type="text"
            value={data.client}
            onChange={(e) => setData({ ...data, client: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
          <select
            value={data.status}
            onChange={(e) => setData({ ...data, status: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white"
          >
            <option value="active">قيد التنفيذ</option>
            <option value="on_hold">متوقف</option>
            <option value="at_risk">معرض للخطر</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">نسبة الإنجاز (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.progress}
            onChange={(e) => setData({ ...data, progress: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">الموعد النهائي</label>
          <input
            type="date"
            value={data.deadline}
            onChange={(e) => setData({ ...data, deadline: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
          rows={3}
        />
      </div>

      <FormFeedback formState={formState} />

      <button
        type="submit"
        disabled={formState.isLoading}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 disabled:opacity-50"
      >
        {formState.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        إضافة المشروع
      </button>
    </form>
  );
}

// ========================================
// KPI FORM
// ========================================

function KPIForm({ formState, setFormState }: { formState: FormState; setFormState: any }) {
  const [data, setData] = useState({
    name: "",
    nameAr: "",
    value: "",
    trend: "",
    category: "operations",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ isLoading: true, error: null, success: null });

    try {
      const response = await fetch("/api/admin/kpis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("فشل في إضافة المؤشر");

      setFormState({ isLoading: false, error: null, success: "تم إضافة المؤشر بنجاح" });
      setData({ name: "", nameAr: "", value: "", trend: "", category: "operations" });
    } catch (error) {
      setFormState({ isLoading: false, error: "حدث خطأ أثناء الإضافة", success: null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">إضافة مؤشر أداء</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">اسم المؤشر (عربي) *</label>
          <input
            type="text"
            value={data.nameAr}
            onChange={(e) => setData({ ...data, nameAr: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            placeholder="إجمالي الإيرادات"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">اسم المؤشر (إنجليزي)</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            placeholder="Total Revenue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">القيمة *</label>
          <input
            type="text"
            value={data.value}
            onChange={(e) => setData({ ...data, value: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            placeholder="3.2M ر.س"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">التغير</label>
          <input
            type="text"
            value={data.trend}
            onChange={(e) => setData({ ...data, trend: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            placeholder="+12%"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
          <select
            value={data.category}
            onChange={(e) => setData({ ...data, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white"
          >
            <option value="finance">المالية</option>
            <option value="operations">العمليات</option>
            <option value="hr">الموارد البشرية</option>
            <option value="sales">المبيعات</option>
          </select>
        </div>
      </div>

      <FormFeedback formState={formState} />

      <button
        type="submit"
        disabled={formState.isLoading}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 disabled:opacity-50"
      >
        {formState.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        إضافة المؤشر
      </button>
    </form>
  );
}

// ========================================
// ALERT FORM
// ========================================

function AlertForm({ formState, setFormState }: { formState: FormState; setFormState: any }) {
  const [data, setData] = useState({
    title: "",
    description: "",
    type: "info",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ isLoading: true, error: null, success: null });

    try {
      const response = await fetch("/api/admin/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("فشل في إضافة التنبيه");

      setFormState({ isLoading: false, error: null, success: "تم إضافة التنبيه بنجاح" });
      setData({ title: "", description: "", type: "info" });
    } catch (error) {
      setFormState({ isLoading: false, error: "حدث خطأ أثناء الإضافة", success: null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">إضافة تنبيه جديد</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">العنوان *</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">النوع</label>
          <select
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white"
          >
            <option value="info">معلومات</option>
            <option value="warning">تحذير</option>
            <option value="critical">عاجل</option>
            <option value="success">نجاح</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">التفاصيل</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
          rows={3}
        />
      </div>

      <FormFeedback formState={formState} />

      <button
        type="submit"
        disabled={formState.isLoading}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 disabled:opacity-50"
      >
        {formState.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        إضافة التنبيه
      </button>
    </form>
  );
}

// ========================================
// FORM FEEDBACK
// ========================================

function FormFeedback({ formState }: { formState: FormState }) {
  if (formState.error) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
        {formState.error}
      </div>
    );
  }
  if (formState.success) {
    return (
      <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
        {formState.success}
      </div>
    );
  }
  return null;
}

