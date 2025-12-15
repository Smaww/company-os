"use client";

import { useState } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Download,
  Trash2,
  Upload,
  File,
  FileSpreadsheet,
  FileImage,
  Presentation,
  Clock,
  X,
  Eye
} from "lucide-react";
import { appConfig } from "@/lib/config";
import { useUser } from "@/contexts/UserContext";
import { useReports, type Report, type UploadedFile } from "@/contexts/DataContext";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileUpload } from "@/components/ui/FileUpload";

// ========================================
// REPORTS PAGE - FULL CRUD WITH FILE UPLOAD
// ========================================

const typeConfig: Record<string, { icon: any; color: string }> = {
  pdf: { icon: FileText, color: "bg-red-100 text-red-600" },
  excel: { icon: FileSpreadsheet, color: "bg-green-100 text-green-600" },
  doc: { icon: File, color: "bg-blue-100 text-blue-600" },
  ppt: { icon: Presentation, color: "bg-orange-100 text-orange-600" },
  image: { icon: FileImage, color: "bg-purple-100 text-purple-600" },
};

const categories = ["مالية", "مبيعات", "استراتيجية", "موارد بشرية", "تسويق", "تقنية"];

const typeOptions = [
  { value: "pdf", label: "PDF" },
  { value: "excel", label: "Excel" },
  { value: "doc", label: "Word" },
  { value: "ppt", label: "PowerPoint" },
  { value: "image", label: "صورة" },
];

export default function ReportsPage() {
  const { user } = useUser();
  const { reports, addReport, deleteReport } = useReports();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  // Form State
  const [form, setForm] = useState<{
    name: string;
    description: string;
    type: "pdf" | "excel" | "doc" | "ppt" | "image";
    category: string;
    files: UploadedFile[];
  }>({
    name: "",
    description: "",
    type: "pdf",
    category: "مالية",
    files: [],
  });

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.includes(searchQuery) || 
                         report.description?.includes(searchQuery);
    const matchesCategory = filterCategory === "all" || report.category === filterCategory;
    const matchesType = filterType === "all" || report.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Format relative time
  const getRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "اليوم";
    if (diffDays === 1) return "أمس";
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
    return formatDate(date);
  };

  // Open Add Modal
  const openAddModal = () => {
    setForm({
      name: "",
      description: "",
      type: "pdf",
      category: "مالية",
      files: [],
    });
    setShowModal(true);
  };

  // Save Report
  // Save Report (Global - visible to all users)
  const handleSave = () => {
    if (!form.name.trim()) return;

    const file = form.files[0];
    
    // Pass createdBy for audit (NOT for visibility restriction)
    addReport({
      name: form.name,
      description: form.description,
      type: form.type,
      category: form.category,
      size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "0 KB",
      file: file || undefined,
    }, user?.name || "Unknown");

    setShowModal(false);
  };

  // Delete Report
  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا التقرير؟")) {
      deleteReport(id);
    }
    setPreviewReport(null);
  };

  // Download Report
  const handleDownload = (report: Report) => {
    if (report.file?.url) {
      const a = document.createElement("a");
      a.href = report.file.url;
      a.download = report.file.name;
      a.click();
    }
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
            <FileText className="w-10 h-10" />
            التقارير والمستندات
          </h1>
          <p 
            className="text-lg mt-2"
            style={{ color: appConfig.design_system.colors.text_secondary }}
          >
            {reports.length} مستند
          </p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
          style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
        >
          <Upload className="w-5 h-5" />
          رفع تقرير
        </button>
      </header>

      {/* Search & Filters */}
      {reports.length > 0 && (
        <div 
          className="p-6 rounded-3xl flex flex-col md:flex-row gap-4"
          style={{ backgroundColor: appConfig.design_system.colors.surface }}
        >
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث في التقارير..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white min-w-[150px]"
          >
            <option value="all">جميع التصنيفات</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white min-w-[150px]"
          >
            <option value="all">جميع الأنواع</option>
            {typeOptions.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Reports List or Empty State */}
      {reports.length === 0 ? (
        <EmptyState
          type="reports"
          onAction={openAddModal}
        />
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400">لا يوجد نتائج</h3>
          <p className="text-gray-400 mt-2">لم يتم العثور على تقارير مطابقة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => {
            const config = typeConfig[report.type] || typeConfig.pdf;
            const TypeIcon = config.icon;
            
            return (
              <div
                key={report.id}
                className="p-5 rounded-2xl flex items-center gap-4 hover:shadow-md transition-all duration-300 group"
                style={{ backgroundColor: appConfig.design_system.colors.surface }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${config.color}`}>
                  <TypeIcon className="w-7 h-7" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 mb-1">{report.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100">{report.category}</span>
                    <span>{report.size}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getRelativeTime(report.updatedAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setPreviewReport(report)}
                    className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    title="معاينة"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(report)}
                    className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 transition-colors"
                    title="تحميل"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ backgroundColor: appConfig.design_system.colors.surface }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">رفع تقرير جديد</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">عنوان التقرير *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none"
                  placeholder="التقرير المالي الربع الأول"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none resize-none"
                  rows={2}
                  placeholder="وصف مختصر للتقرير..."
                />
              </div>

              {/* Type & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">النوع</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white"
                  >
                    {typeOptions.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">التصنيف</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">الملف</label>
                <FileUpload
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                  multiple={false}
                  label="اسحب الملف هنا أو انقر للاختيار"
                  description="PDF, Word, Excel, PowerPoint, Images"
                  files={form.files}
                  onFilesChange={(files) => setForm(prev => ({ ...prev, files }))}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
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
                رفع التقرير
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ backgroundColor: appConfig.design_system.colors.surface }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${typeConfig[previewReport.type]?.color || typeConfig.pdf.color}`}>
                  {(() => {
                    const config = typeConfig[previewReport.type] || typeConfig.pdf;
                    const TypeIcon = config.icon;
                    return <TypeIcon className="w-7 h-7" />;
                  })()}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{previewReport.name}</h2>
                  {previewReport.description && (
                    <p className="text-gray-500 mt-1">{previewReport.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">التصنيف</p>
                  <p className="font-semibold text-gray-800">{previewReport.category}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">الحجم</p>
                  <p className="font-semibold text-gray-800">{previewReport.size}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">تاريخ الإنشاء</p>
                  <p className="font-semibold text-gray-800">{formatDate(previewReport.createdAt)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">تم الإنشاء بواسطة</p>
                  <p className="font-semibold text-gray-800">{previewReport.createdBy}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setPreviewReport(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                إغلاق
              </button>
              <button
                onClick={() => handleDownload(previewReport)}
                className="flex items-center justify-center gap-2 flex-1 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                style={{ backgroundColor: appConfig.design_system.colors.accent_primary }}
              >
                <Download className="w-5 h-5" />
                تحميل
              </button>
              <button
                onClick={() => handleDelete(previewReport.id)}
                className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
