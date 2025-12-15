// ========================================
// SERVICE LAYER - TYPE DEFINITIONS
// ========================================

export type ConnectionStatus = "connected" | "disconnected" | "error" | "loading";

export interface ServiceResponse<T> {
  data: T | null;
  status: ConnectionStatus;
  error?: string;
  lastUpdated?: Date;
}

// Tool-specific response types
export interface ZohoMailData {
  unreadCount: number;
  importantCount: number;
}

export interface SlackData {
  unreadMentions: number;
  activeChannels: number;
}

export interface HubstaffData {
  onlineEmployees: number;
  totalEmployees: number;
  todayHours: number;
}

export interface GitHubData {
  openPRs: number;
  openIssues: number;
  pendingReviews: number;
}

export interface SMSGatewayData {
  creditBalance: number;
  messagesSentToday: number;
}

export interface WhatsAppData {
  queuedMessages: number;
  deliveredToday: number;
}

export interface StoreDashData {
  ordersToday: number;
  revenue: number;
  pendingOrders: number;
}

export interface ZohoBooksData {
  cashFlow: number;
  pendingInvoices: number;
  overdueAmount: number;
}

export interface CPAdminData {
  serverStatus: "online" | "offline" | "maintenance";
  cpuUsage: number;
  memoryUsage: number;
}

// Union type for all tool data
export type ToolData = 
  | ZohoMailData 
  | SlackData 
  | HubstaffData 
  | GitHubData 
  | SMSGatewayData 
  | WhatsAppData 
  | StoreDashData 
  | ZohoBooksData 
  | CPAdminData;

// Finance types
export interface CashFlowData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  cashFlow: CashFlowData[];
}

// Team types
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: "online" | "offline" | "away";
  avatar?: string;
  productivity?: number;
}

export interface TeamSummary {
  totalEmployees: number;
  onlineNow: number;
  departments: { name: string; count: number }[];
  employees: Employee[];
}

