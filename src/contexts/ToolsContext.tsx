"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// ========================================
// TOOLS CONTEXT - DYNAMIC TOOL MANAGEMENT
// ========================================

export interface Tool {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

interface ToolsContextType {
  tools: Tool[];
  addTool: (tool: Omit<Tool, "id">) => void;
  updateTool: (id: string, tool: Partial<Tool>) => void;
  deleteTool: (id: string) => void;
  reorderTools: (tools: Tool[]) => void;
}

// Default tools (can be cleared for true clean slate)
const defaultTools: Tool[] = [
  { id: "zoho_mail", name: "Zoho Mail", url: "https://www.zoho.com/ar/mail/", icon: "Mail", color: "bg-blue-100 text-blue-600" },
  { id: "slack", name: "Slack", url: "https://slack.com/", icon: "MessageSquare", color: "bg-purple-100 text-purple-600" },
  { id: "hubstaff", name: "Hubstaff", url: "https://app.hubstaff.com/organizations", icon: "Clock", color: "bg-green-100 text-green-600" },
  { id: "github", name: "GitHub", url: "https://github.com/", icon: "Github", color: "bg-gray-100 text-gray-800" },
  { id: "taqnyat", name: "Taqnyat", url: "https://portal.taqnyat.sa/", icon: "MessageSquare", color: "bg-orange-100 text-orange-600" },
  { id: "social_bot", name: "Store WhatsApp", url: "https://social.social-bot.io/app/login", icon: "Phone", color: "bg-emerald-100 text-emerald-600" },
  { id: "salla", name: "Store Dashboard", url: "https://s.salla.sa/", icon: "ShoppingBag", color: "bg-teal-100 text-teal-600" },
  { id: "zoho_books", name: "Zoho Books", url: "https://books.zoho.com/app/884228379#/home/dashboard?dashboard_id=defaultdashboard", icon: "CreditCard", color: "bg-red-100 text-red-600" },
  { id: "cp_admin", name: "CP Admin", url: "https://cp-frontend-one.vercel.app/ar/", icon: "LayoutDashboard", color: "bg-indigo-100 text-indigo-600" },
];

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

const STORAGE_KEY = "ceo-dashboard-tools";

export function ToolsProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setTools(JSON.parse(stored));
        } catch {
          setTools(defaultTools);
        }
      } else {
        // First time - use default tools
        setTools(defaultTools);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    }
  }, [tools, isInitialized]);

  const addTool = (tool: Omit<Tool, "id">) => {
    const newTool: Tool = {
      ...tool,
      id: `tool_${Date.now()}`,
    };
    setTools(prev => [...prev, newTool]);
  };

  const updateTool = (id: string, updates: Partial<Tool>) => {
    setTools(prev => prev.map(tool => 
      tool.id === id ? { ...tool, ...updates } : tool
    ));
  };

  const deleteTool = (id: string) => {
    setTools(prev => prev.filter(tool => tool.id !== id));
  };

  const reorderTools = (newTools: Tool[]) => {
    setTools(newTools);
  };

  return (
    <ToolsContext.Provider value={{ tools, addTool, updateTool, deleteTool, reorderTools }}>
      {children}
    </ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error("useTools must be used within a ToolsProvider");
  }
  return context;
}

