"use client";

import { useState, useEffect, useCallback } from "react";
import type { ServiceResponse } from "@/services/types";
import type { ToolKey } from "@/services/tools";

// ========================================
// REACT HOOKS FOR TOOL SERVICES
// ========================================

interface UseToolResult<T> {
  data: T | null;
  status: "connected" | "disconnected" | "error" | "loading";
  error?: string;
  refetch: () => void;
  lastUpdated?: Date;
}

// Generic hook for fetching tool data
export function useTool<T>(
  toolKey: ToolKey,
  fetchFn: () => Promise<ServiceResponse<T>>
): UseToolResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<UseToolResult<T>["status"]>("loading");
  const [error, setError] = useState<string | undefined>();
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>();

  const fetchData = useCallback(async () => {
    setStatus("loading");
    try {
      const result = await fetchFn();
      setData(result.data);
      setStatus(result.status);
      setError(result.error);
      setLastUpdated(result.lastUpdated);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, status, error, refetch: fetchData, lastUpdated };
}

// ========================================
// SPECIALIZED HOOKS FOR EACH TOOL
// ========================================

// Client-side API calls through Next.js API routes
async function fetchToolAPI<T>(toolKey: ToolKey): Promise<ServiceResponse<T>> {
  try {
    const response = await fetch(`/api/tools/${toolKey}`);
    if (!response.ok) {
      if (response.status === 401) {
        return { data: null, status: "disconnected" };
      }
      throw new Error(`HTTP ${response.status}`);
    }
    const result = await response.json();
    return { 
      data: result.data, 
      status: result.status, 
      error: result.error,
      lastUpdated: new Date()
    };
  } catch (error) {
    return { 
      data: null, 
      status: "error", 
      error: error instanceof Error ? error.message : "Network error" 
    };
  }
}

export function useZohoMail() {
  return useTool("zoho_mail", () => fetchToolAPI("zoho_mail"));
}

export function useSlack() {
  return useTool("slack", () => fetchToolAPI("slack"));
}

export function useHubstaff() {
  return useTool("hubstaff", () => fetchToolAPI("hubstaff"));
}

export function useGitHub() {
  return useTool("github", () => fetchToolAPI("github"));
}

export function useSMSGateway() {
  return useTool("sms_gateway", () => fetchToolAPI("sms_gateway"));
}

export function useWhatsApp() {
  return useTool("whatsapp", () => fetchToolAPI("whatsapp"));
}

export function useStoreDash() {
  return useTool("store_dash", () => fetchToolAPI("store_dash"));
}

export function useZohoBooks() {
  return useTool("zoho_books", () => fetchToolAPI("zoho_books"));
}

export function useCPAdmin() {
  return useTool("cp_admin", () => fetchToolAPI("cp_admin"));
}

// ========================================
// HOOK FOR ALL TOOLS AT ONCE
// ========================================

interface AllToolsState {
  tools: Record<ToolKey, ServiceResponse<any>>;
  isLoading: boolean;
  refetchAll: () => void;
}

export function useAllTools(): AllToolsState {
  const [tools, setTools] = useState<Record<ToolKey, ServiceResponse<any>>>({} as any);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tools");
      const data = await response.json();
      setTools(data);
    } catch (error) {
      console.error("Failed to fetch tools:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  return { tools, isLoading, refetchAll: fetchAllData };
}

