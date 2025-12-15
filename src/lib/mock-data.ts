// ========================================
// COMPANY OS - MOCK DATA (Arabic)
// بيانات تجريبية للوحة التحكم
// ========================================

// KPI Statistics - إحصائيات المؤشرات الرئيسية
export const kpiStats = [
  {
    id: "revenue",
    title: "الإيرادات الشهرية",
    value: 847500,
    change: 12.5,
    trend: "up" as const,
    icon: "TrendingUp",
    format: "currency" as const,
  },
  {
    id: "expenses",
    title: "المصاريف",
    value: 312000,
    change: -8.3,
    trend: "down" as const,
    icon: "TrendingDown",
    format: "currency" as const,
  },
  {
    id: "cashflow",
    title: "السيولة المتاحة",
    value: 2450000,
    change: 5.2,
    trend: "up" as const,
    icon: "Wallet",
    format: "currency" as const,
  },
  {
    id: "alerts",
    title: "التنبيهات العاجلة",
    value: 7,
    change: 3,
    trend: "up" as const,
    icon: "AlertTriangle",
    format: "number" as const,
  },
];

// Alert Types
export type AlertType = "critical" | "warning" | "info";

// Recent Alerts - التنبيهات الأخيرة
export const recentAlerts = [
  {
    id: 1,
    type: "critical" as AlertType,
    source: "المالية",
    sourceIcon: "Wallet",
    title: "فاتورة متأخرة #4892",
    description: "شركة أكمي - ٤٥,٠٠٠ ر.س - متأخرة ١٥ يوم",
    timestamp: "منذ ساعتين",
    actionLabel: "مراجعة",
  },
  {
    id: 2,
    type: "warning" as AlertType,
    source: "سلاك",
    sourceIcon: "MessageSquare",
    title: "@CEO في #القيادة",
    description: "سارة: 'نحتاج موافقة عاجلة على ميزانية الربع الأول'",
    timestamp: "منذ ٣٥ دقيقة",
    actionLabel: "رد",
  },
  {
    id: 3,
    type: "critical" as AlertType,
    source: "المشاريع",
    sourceIcon: "FolderKanban",
    title: "مشروع فينيكس متوقف",
    description: "بانتظار بيانات API من العميل - ٣ أيام",
    timestamp: "منذ ٤ ساعات",
    actionLabel: "تصعيد",
  },
  {
    id: 4,
    type: "warning" as AlertType,
    source: "البريد",
    sourceIcon: "Mail",
    title: "تحضيرات اجتماع مجلس الإدارة",
    description: "العرض يحتاج مراجعة قبل يوم الجمعة",
    timestamp: "منذ ساعة",
    actionLabel: "فتح",
  },
  {
    id: 5,
    type: "info" as AlertType,
    source: "الموارد البشرية",
    sourceIcon: "Users",
    title: "عرض وظيفي بانتظار التوقيع",
    description: "مطور أول - أحمد محمد",
    timestamp: "منذ ٦ ساعات",
    actionLabel: "عرض",
  },
  {
    id: 6,
    type: "warning" as AlertType,
    source: "النظام",
    sourceIcon: "Server",
    title: "استخدام الخادم مرتفع",
    description: "وصل استخدام CPU إلى ٨٥٪ على الخادم الرئيسي",
    timestamp: "منذ ٢٠ دقيقة",
    actionLabel: "فحص",
  },
];

// Cash Flow Data for Charts - بيانات التدفق النقدي
export const cashFlowData = [
  { month: "يوليو", revenue: 680000, expenses: 520000 },
  { month: "أغسطس", revenue: 720000, expenses: 540000 },
  { month: "سبتمبر", revenue: 695000, expenses: 510000 },
  { month: "أكتوبر", revenue: 780000, expenses: 560000 },
  { month: "نوفمبر", revenue: 820000, expenses: 580000 },
  { month: "ديسمبر", revenue: 847500, expenses: 535500 },
];

// Employee Status Type
export type EmployeeStatus = "online" | "idle" | "offline";

// Employee Data - بيانات الموظفين
export const employees = [
  {
    id: 1,
    name: "أحمد محمد",
    role: "مدير الهندسة",
    avatar: "أم",
    status: "online" as EmployeeStatus,
    activity: "VS Code",
    productivity: 94,
    lastSeen: "نشط الآن",
  },
  {
    id: 2,
    name: "سارة أحمد",
    role: "مدير المنتج",
    avatar: "سأ",
    status: "online" as EmployeeStatus,
    activity: "Figma",
    productivity: 87,
    lastSeen: "نشط الآن",
  },
  {
    id: 3,
    name: "خالد عبدالله",
    role: "مصمم واجهات",
    avatar: "خع",
    status: "idle" as EmployeeStatus,
    activity: "استراحة",
    productivity: 72,
    lastSeen: "منذ ١٥ دقيقة",
  },
  {
    id: 4,
    name: "نورة سعد",
    role: "مهندسة DevOps",
    avatar: "نس",
    status: "online" as EmployeeStatus,
    activity: "Terminal",
    productivity: 91,
    lastSeen: "نشط الآن",
  },
  {
    id: 5,
    name: "محمد علي",
    role: "مدير المبيعات",
    avatar: "مع",
    status: "offline" as EmployeeStatus,
    activity: "غير متصل",
    productivity: 0,
    lastSeen: "منذ ساعتين",
  },
  {
    id: 6,
    name: "ليلى حسن",
    role: "مدير التسويق",
    avatar: "لح",
    status: "online" as EmployeeStatus,
    activity: "Slack",
    productivity: 88,
    lastSeen: "نشط الآن",
  },
  {
    id: 7,
    name: "عمر فهد",
    role: "مطور Backend",
    avatar: "عف",
    status: "online" as EmployeeStatus,
    activity: "VS Code",
    productivity: 96,
    lastSeen: "نشط الآن",
  },
  {
    id: 8,
    name: "هند محمود",
    role: "مهندسة QA",
    avatar: "هم",
    status: "idle" as EmployeeStatus,
    activity: "اجتماع",
    productivity: 78,
    lastSeen: "منذ ٨ دقائق",
  },
];

// Team Summary - ملخص الفريق
export const teamSummary = {
  total: 47,
  online: 38,
  idle: 6,
  offline: 3,
  avgProductivity: 87,
};

// Financial Summary - الملخص المالي
export const financialSummary = {
  totalRevenue: 4542500,
  totalExpenses: 3245500,
  netProfit: 1297000,
  labels: {
    totalRevenue: "إجمالي الإيرادات",
    totalExpenses: "إجمالي المصاريف", 
    netProfit: "صافي الربح",
  }
};
