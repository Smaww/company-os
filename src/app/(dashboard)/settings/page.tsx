"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  Check,
  Wrench,
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Mail,
  MessageSquare,
  Clock,
  Github,
  Phone,
  ShoppingBag,
  CreditCard,
  LayoutDashboard,
  Folder,
  FileText,
  Users,
  Zap,
  Cloud,
  Database,
  Server,
  Loader2
} from "lucide-react";
import { appConfig } from "@/lib/config";
import { useUser } from "@/contexts/UserContext";
import { useTools, type Tool } from "@/contexts/DataContext";
import { EmptyState } from "@/components/ui/EmptyState";

// ========================================
// SETTINGS PAGE WITH TOOLS MANAGER
// ========================================

// Icon options for tools
const iconOptions = [
  { name: "Mail", icon: Mail },
  { name: "MessageSquare", icon: MessageSquare },
  { name: "Clock", icon: Clock },
  { name: "Github", icon: Github },
  { name: "Phone", icon: Phone },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "CreditCard", icon: CreditCard },
  { name: "LayoutDashboard", icon: LayoutDashboard },
  { name: "Folder", icon: Folder },
  { name: "FileText", icon: FileText },
  { name: "Users", icon: Users },
  { name: "Zap", icon: Zap },
  { name: "Cloud", icon: Cloud },
  { name: "Database", icon: Database },
  { name: "Server", icon: Server },
  { name: "Settings", icon: Settings },
];

// Color options for tools
const colorOptions = [
  { label: "أزرق", value: "bg-blue-100 text-blue-600" },
  { label: "أخضر", value: "bg-green-100 text-green-600" },
  { label: "أرجواني", value: "bg-purple-100 text-purple-600" },
  { label: "برتقالي", value: "bg-orange-100 text-orange-600" },
  { label: "أحمر", value: "bg-red-100 text-red-600" },
  { label: "رمادي", value: "bg-gray-100 text-gray-800" },
  { label: "أزرق مخضر", value: "bg-teal-100 text-teal-600" },
  { label: "زمردي", value: "bg-emerald-100 text-emerald-600" },
  { label: "نيلي", value: "bg-indigo-100 text-indigo-600" },
  { label: "وردي", value: "bg-pink-100 text-pink-600" },
];

// Get icon component by name
function getIconComponent(iconName: string) {
  const found = iconOptions.find(i => i.name === iconName);
  return found?.icon || Mail;
}

export default function SettingsPage() {
  const { user, isMounted, isLoading } = useUser();
  const { tools, addTool, updateTool, deleteTool } = useTools();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "tools" | "notifications" | "security">("profile");
  
  // Fix hydration mismatch - track client mount
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Tool Modal State
  const [showToolModal, setShowToolModal] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [toolForm, setToolForm] = useState({
    name: "",
    url: "",
    icon: "Mail",
    color: "bg-blue-100 text-blue-600"
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Open Add Tool Modal
  const openAddModal = () => {
    setEditingTool(null);
    setToolForm({ name: "", url: "", icon: "Mail", color: "bg-blue-100 text-blue-600" });
    setShowToolModal(true);
  };

  // Open Edit Tool Modal
  const openEditModal = (tool: Tool) => {
    setEditingTool(tool);
    setToolForm({
      name: tool.name,
      url: tool.url,
      icon: tool.icon,
      color: tool.color
    });
    setShowToolModal(true);
  };

  // Save Tool
  const handleSaveTool = () => {
    if (!toolForm.name.trim() || !toolForm.url.trim()) return;

    if (editingTool) {
      updateTool(editingTool.id, toolForm);
    } else {
      addTool(toolForm);
    }
    
    setShowToolModal(false);
    setEditingTool(null);
  };

  // Delete Tool
  const handleDeleteTool = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الأداة؟")) {
      deleteTool(id);
    }
  };

  const tabs = [
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "tools", label: "إدارة الأدوات", icon: Wrench },
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "security", label: "الأمان", icon: Shield },
  ];

  // Show loading state until mounted and user loaded
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <header>
        <h1 
          className="text-4xl font-extrabold flex items-center gap-3"
          style={{ color: appConfig.design_system.colors.text_primary }}
        >
          <Settings className="w-10 h-10" />
          الإعدادات
        </h1>
        <p 
          className="text-lg mt-2"
          style={{ color: appConfig.design_system.colors.text_secondary }}
        >
          إدارة إعدادات حسابك والنظام
        </p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-gray-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
                transition-all duration-300
                ${activeTab === tab.id 
                  ? "bg-white text-gray-800 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl">
        
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div 
            className="p-6 rounded-3xl space-y-6"
            style={{ backgroundColor: appConfig.design_system.colors.surface }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">الملف الشخصي</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" suppressHydrationWarning>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم</label>
                <input
                  type="text"
                  defaultValue={isMounted ? (user?.name || "") : ""}
                  key={isMounted ? "name-mounted" : "name-ssr"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  suppressHydrationWarning
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  defaultValue={isMounted ? (user?.email || "") : ""}
                  key={isMounted ? "email-mounted" : "email-ssr"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div suppressHydrationWarning>
              <label className="block text-sm font-semibold text-gray-700 mb-2">المنصب</label>
              <input
                type="text"
                defaultValue={isMounted ? (user?.roleLabel || "") : ""}
                key={isMounted ? "role-mounted" : "role-ssr"}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                suppressHydrationWarning
              />
            </div>

            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all ${
                saved ? "bg-green-500" : "hover:opacity-90"
              }`}
              style={{ backgroundColor: saved ? undefined : appConfig.design_system.colors.accent_primary }}
            >
              {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? "تم الحفظ" : "حفظ التغييرات"}
            </button>
          </div>
        )}

        {/* Tools Manager Tab */}
        {activeTab === "tools" && (
          <div className="space-y-6">
            {/* Header */}
            <div 
              className="p-6 rounded-3xl flex items-center justify-between"
              style={{ backgroundColor: appConfig.design_system.colors.surface }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">إدارة الأدوات</h2>
                  <p className="text-sm text-gray-500">{tools.length} أداة مسجلة</p>
                </div>
              </div>
              
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
              >
                <Plus className="w-5 h-5" />
                إضافة أداة
              </button>
            </div>

            {/* Tools List or Empty State */}
            {tools.length === 0 ? (
              <EmptyState
                type="tools"
                onAction={openAddModal}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool) => {
                  const IconComponent = getIconComponent(tool.icon);
                  
                  return (
                    <div
                      key={tool.id}
                      className="p-4 rounded-2xl flex items-center gap-4 group hover:shadow-md transition-all"
                      style={{ backgroundColor: appConfig.design_system.colors.surface }}
                    >
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800">{tool.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{tool.url}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(tool)}
                          className="p-2 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTool(tool.id)}
                          className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div 
            className="p-6 rounded-3xl"
            style={{ backgroundColor: appConfig.design_system.colors.surface }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">الإشعارات</h2>
            </div>

            <div className="space-y-4">
              {[
                { label: "إشعارات البريد الإلكتروني", desc: "استلام تحديثات عبر البريد" },
                { label: "إشعارات المشاريع", desc: "تنبيهات عند تحديث المشاريع" },
                { label: "إشعارات المهام", desc: "تذكير بالمهام المستحقة" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div 
            className="p-6 rounded-3xl space-y-4"
            style={{ backgroundColor: appConfig.design_system.colors.surface }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">الأمان</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور الحالية</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                />
              </div>
            </div>

            <button
              className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
              style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
            >
              <Save className="w-5 h-5" />
              تحديث كلمة المرور
            </button>
          </div>
        )}
      </div>

      {/* Tool Modal */}
      {showToolModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ backgroundColor: appConfig.design_system.colors.surface }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingTool ? "تعديل الأداة" : "إضافة أداة جديدة"}
              </h2>
              <button
                onClick={() => setShowToolModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الأداة</label>
                <input
                  type="text"
                  value={toolForm.name}
                  onChange={(e) => setToolForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  placeholder="مثال: Google Drive"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">رابط الأداة</label>
                <input
                  type="url"
                  value={toolForm.url}
                  onChange={(e) => setToolForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الأيقونة</label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setToolForm(prev => ({ ...prev, icon: option.name }))}
                        className={`
                          p-2.5 rounded-xl border-2 transition-all
                          ${toolForm.icon === option.name 
                            ? "border-green-500 bg-green-50" 
                            : "border-transparent bg-gray-50 hover:bg-gray-100"
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 text-gray-600 mx-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اللون</label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setToolForm(prev => ({ ...prev, color: option.value }))}
                      className={`
                        p-3 rounded-xl border-2 transition-all text-sm font-medium
                        ${option.value.split(" ")[0]}
                        ${toolForm.color === option.value 
                          ? "border-gray-800 ring-2 ring-offset-2 ring-gray-800" 
                          : "border-transparent hover:border-gray-300"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">معاينة</p>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${toolForm.color}`}>
                    {(() => {
                      const Icon = getIconComponent(toolForm.icon);
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{toolForm.name || "اسم الأداة"}</p>
                    <p className="text-sm text-gray-500 truncate">{toolForm.url || "رابط الأداة"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowToolModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveTool}
                disabled={!toolForm.name.trim() || !toolForm.url.trim()}
                className="flex-1 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
              >
                {editingTool ? "حفظ التغييرات" : "إضافة الأداة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
