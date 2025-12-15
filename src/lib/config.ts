// ========================================
// CEO WORKSPACE v4.0 - CONFIGURATION
// Dynamic Data-Driven System
// ========================================

export const appConfig = {
  app_config: {
    name: "CEO Workspace",
    version: "4.0",
    db_provider: "Supabase/Postgres",
    language: "ar",
    direction: "rtl" as const,
  },
  design_system: {
    theme: "Soft Pastel UI",
    colors: {
      bg: "#F3F4F6",
      surface: "#FFFFFF",
      surface_dark: "#1A1A1A",
      accent_primary: "#1F2937",
      text_primary: "#1F2937",
      text_secondary: "#9CA3AF",
      text_inverse: "#FFFFFF"
    },
    radius: "32px",
    gap: "24px",
    accents: {
      mint: "#A7F3D0",
      lavender: "#C4B5FD",
      blue: "#BFDBFE",
      orange: "#FDBA74",
      red: "#FECACA",
      green: "#BBF7D0",
      purple: "#DDD6FE",
      indigo: "#C7D2FE",
      slate: "#CBD5E1",
      teal: "#99F6E4",
      emerald: "#A7F3D0"
    }
  },
  tools_registry: [
    { id: "zoho_mail", name: "Zoho Mail", url: "https://www.zoho.com/ar/mail/", icon: "Mail", color: "bg-blue-100 text-blue-600" },
    { id: "slack", name: "Slack", url: "https://slack.com/", icon: "Slack", color: "bg-purple-100 text-purple-600" },
    { id: "hubstaff", name: "Hubstaff", url: "https://app.hubstaff.com/organizations", icon: "Clock", color: "bg-green-100 text-green-600" },
    { id: "github", name: "GitHub", url: "https://github.com/", icon: "Github", color: "bg-gray-100 text-gray-800" },
    { id: "taqnyat", name: "بوابة تقنيات", url: "https://portal.taqnyat.sa/", icon: "MessageSquare", color: "bg-orange-100 text-orange-600" },
    { id: "social_bot", name: "واتساب المتجر", url: "https://social.social-bot.io/app/login", icon: "Phone", color: "bg-emerald-100 text-emerald-600" },
    { id: "salla_store", name: "لوحة المتجر", url: "https://s.salla.sa/", icon: "ShoppingBag", color: "bg-teal-100 text-teal-600" },
    { id: "zoho_books", name: "Zoho Books", url: "https://books.zoho.com/app/884228379#/home/dashboard?dashboard_id=defaultdashboard", icon: "CreditCard", color: "bg-red-100 text-red-600" },
    { id: "cp_admin", name: "CP Admin", url: "https://cp-frontend-one.vercel.app/ar/", icon: "LayoutDashboard", color: "bg-indigo-100 text-indigo-600" }
  ],
  contacts_registry: {
    CHAIRMAN: { label: "رئيس مجلس الإدارة", phone: "966536729954" },
    VP: { label: "نائب الرئيس", phone: "966554500338" },
    GM: { label: "المدير العام", phone: "966554520700" }
  },
  roles: {
    ADMIN: { label: "مدير النظام", greeting: "مرحباً، مدير النظام", level: 0, canEdit: true },
    CHAIRMAN: { label: "رئيس مجلس الإدارة", greeting: "أهلاً بك، سيادة الرئيس", level: 1, canEdit: false },
    VP: { label: "نائب الرئيس", greeting: "أهلاً بك، نائب الرئيس", level: 2, canEdit: false },
    GM: { label: "المدير العام", greeting: "مرحباً، حضرة المدير", level: 3, canEdit: false }
  }
} as const;

export type UserRole = keyof typeof appConfig.roles;
export type Tool = typeof appConfig.tools_registry[number];
export type Contact = typeof appConfig.contacts_registry[keyof typeof appConfig.contacts_registry];
