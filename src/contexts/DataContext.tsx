"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

// ========================================
// GLOBAL DATA CONTEXT - SINGLE SOURCE OF TRUTH
// All data is "Company Data" - visible to ALL users
// No private data filtering - everything is shared
// ========================================

// ===== TYPE DEFINITIONS =====

export interface Tool {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

export interface Employee {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  location?: string;
  status: "active" | "vacation" | "inactive";
  productivity: number;
  joinDate: string;
  avatar?: string;
  documents: UploadedFile[];
  // Audit fields (NOT for visibility restriction)
  createdBy: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  client?: string;
  status: "pending" | "active" | "review" | "completed";
  progress: number;
  deadline?: string;
  team: string[];
  blockers: string[];
  manager?: string; // Project lead - for assignment, NOT visibility
  // Audit fields (NOT for visibility restriction)
  createdBy: string;
  createdAt: string;
  isGlobal: true; // Always true - all projects are company-wide
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string; // For task assignment, NOT visibility
  dueDate?: string;
  project?: string;
  // Audit fields (NOT for visibility restriction)
  createdBy: string;
  createdAt: string;
  isGlobal: true; // Always true - all tasks visible to all
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: "pdf" | "excel" | "doc" | "ppt" | "image";
  category: string;
  size: string;
  file?: UploadedFile;
  downloads: number;
  // Audit fields (NOT for visibility restriction)
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isGlobal: true; // Always true - all reports visible to all
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

// ===== CONTEXT TYPE =====

interface DataContextType {
  // Tools (Global)
  tools: Tool[];
  addTool: (tool: Omit<Tool, "id">) => void;
  updateTool: (id: string, data: Partial<Tool>) => void;
  deleteTool: (id: string) => void;

  // Employees (Global - Company Directory)
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, "id" | "createdAt" | "createdBy">, createdBy: string) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Projects (Global - All Company Projects)
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "createdAt" | "createdBy" | "isGlobal">, createdBy: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Tasks (Global - All Company Tasks)
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "createdBy" | "isGlobal">, createdBy: string) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Reports (Global - All Company Reports)
  reports: Report[];
  addReport: (report: Omit<Report, "id" | "createdAt" | "updatedAt" | "downloads" | "createdBy" | "isGlobal">, createdBy: string) => void;
  updateReport: (id: string, data: Partial<Report>) => void;
  deleteReport: (id: string) => void;

  // Global Stats
  getGlobalStats: () => {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    pendingTasks: number;
    totalEmployees: number;
    activeEmployees: number;
    totalReports: number;
  };
}

// ===== DEFAULT TOOLS (Global Setup) =====

const defaultTools: Tool[] = [
  { id: "1", name: "Zoho Mail", url: "https://www.zoho.com/ar/mail/", icon: "Mail", color: "bg-blue-100 text-blue-600" },
  { id: "2", name: "Slack", url: "https://slack.com/", icon: "MessageSquare", color: "bg-purple-100 text-purple-600" },
  { id: "3", name: "Hubstaff", url: "https://app.hubstaff.com/organizations", icon: "Clock", color: "bg-green-100 text-green-600" },
  { id: "4", name: "GitHub", url: "https://github.com/", icon: "Github", color: "bg-gray-100 text-gray-800" },
  { id: "5", name: "Taqnyat", url: "https://portal.taqnyat.sa/", icon: "MessageSquare", color: "bg-orange-100 text-orange-600" },
  { id: "6", name: "Store WhatsApp", url: "https://social.social-bot.io/app/login", icon: "Phone", color: "bg-emerald-100 text-emerald-600" },
  { id: "7", name: "Store Dashboard", url: "https://s.salla.sa/", icon: "ShoppingBag", color: "bg-teal-100 text-teal-600" },
  { id: "8", name: "Zoho Books", url: "https://books.zoho.com/app/884228379#/home/dashboard?dashboard_id=defaultdashboard", icon: "CreditCard", color: "bg-red-100 text-red-600" },
  { id: "9", name: "CP Admin", url: "https://cp-frontend-one.vercel.app/ar/", icon: "LayoutDashboard", color: "bg-indigo-100 text-indigo-600" },
];

// ===== CONTEXT =====

const DataContext = createContext<DataContextType | undefined>(undefined);

// ===== HELPER: Generate ID =====

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ===== PROVIDER =====

export function DataProvider({ children }: { children: ReactNode }) {
  // ========================================
  // GLOBAL STORES - Single Source of Truth
  // All data visible to ALL authorized users
  // ========================================
  
  const [tools, setTools] = useState<Tool[]>(defaultTools);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  // ===== TOOLS CRUD (Global) =====
  
  const addTool = useCallback((tool: Omit<Tool, "id">) => {
    setTools(prev => [...prev, { ...tool, id: generateId() }]);
  }, []);

  const updateTool = useCallback((id: string, data: Partial<Tool>) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const deleteTool = useCallback((id: string) => {
    setTools(prev => prev.filter(t => t.id !== id));
  }, []);

  // ===== EMPLOYEES CRUD (Global Company Directory) =====

  const addEmployee = useCallback((employee: Omit<Employee, "id" | "createdAt" | "createdBy">, createdBy: string) => {
    const now = new Date().toISOString();
    setEmployees(prev => [...prev, { 
      ...employee, 
      id: generateId(),
      createdBy,
      createdAt: now,
    }]);
  }, []);

  const updateEmployee = useCallback((id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, []);

  // ===== PROJECTS CRUD (Global - All Company Projects) =====

  const addProject = useCallback((project: Omit<Project, "id" | "createdAt" | "createdBy" | "isGlobal">, createdBy: string) => {
    const now = new Date().toISOString();
    setProjects(prev => [...prev, { 
      ...project, 
      id: generateId(),
      createdBy,
      createdAt: now,
      isGlobal: true, // Always global - visible to all
    }]);
  }, []);

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  // ===== TASKS CRUD (Global - All Company Tasks) =====

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt" | "createdBy" | "isGlobal">, createdBy: string) => {
    const now = new Date().toISOString();
    setTasks(prev => [...prev, { 
      ...task, 
      id: generateId(),
      createdBy,
      createdAt: now,
      isGlobal: true, // Always global - visible to all
    }]);
  }, []);

  const updateTask = useCallback((id: string, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // ===== REPORTS CRUD (Global - All Company Reports) =====

  const addReport = useCallback((report: Omit<Report, "id" | "createdAt" | "updatedAt" | "downloads" | "createdBy" | "isGlobal">, createdBy: string) => {
    const now = new Date().toISOString();
    setReports(prev => [...prev, { 
      ...report, 
      id: generateId(),
      createdBy,
      createdAt: now,
      updatedAt: now,
      downloads: 0,
      isGlobal: true, // Always global - visible to all
    }]);
  }, []);

  const updateReport = useCallback((id: string, data: Partial<Report>) => {
    setReports(prev => prev.map(r => r.id === id ? { 
      ...r, 
      ...data,
      updatedAt: new Date().toISOString()
    } : r));
  }, []);

  const deleteReport = useCallback((id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  }, []);

  // ===== GLOBAL STATS (Company-Wide) =====

  const getGlobalStats = useCallback(() => ({
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === "active").length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter(t => t.status !== "completed").length,
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === "active").length,
    totalReports: reports.length,
  }), [projects, tasks, employees, reports]);

  return (
    <DataContext.Provider value={{
      // Tools
      tools, addTool, updateTool, deleteTool,
      // Employees (Global Directory)
      employees, addEmployee, updateEmployee, deleteEmployee,
      // Projects (All Company Projects)
      projects, addProject, updateProject, deleteProject,
      // Tasks (All Company Tasks)
      tasks, addTask, updateTask, deleteTask,
      // Reports (All Company Reports)
      reports, addReport, updateReport, deleteReport,
      // Global Stats
      getGlobalStats,
    }}>
      {children}
    </DataContext.Provider>
  );
}

// ===== HOOK =====

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

// ===== UTILITY HOOKS (All return GLOBAL data) =====

export function useTools() {
  const { tools, addTool, updateTool, deleteTool } = useData();
  return { tools, addTool, updateTool, deleteTool };
}

export function useEmployees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useData();
  return { 
    employees, // All company employees
    addEmployee, 
    updateEmployee, 
    deleteEmployee 
  };
}

export function useProjects() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  return { 
    projects, // All company projects (NOT filtered by user)
    addProject, 
    updateProject, 
    deleteProject 
  };
}

export function useTasks() {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  return { 
    tasks, // All company tasks (NOT filtered by user)
    addTask, 
    updateTask, 
    deleteTask 
  };
}

export function useReports() {
  const { reports, addReport, updateReport, deleteReport } = useData();
  return { 
    reports, // All company reports (NOT filtered by user)
    addReport, 
    updateReport, 
    deleteReport 
  };
}

export function useGlobalStats() {
  const { getGlobalStats } = useData();
  return getGlobalStats();
}
