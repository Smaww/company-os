import prisma from "@/lib/db";

// ========================================
// KPI SERVICE - DATABASE OPERATIONS
// ========================================

export interface CreateKPIInput {
  name: string;
  nameAr?: string;
  value: string;
  trend?: string;
  icon?: string;
  color?: string;
  category: string;
  period?: string;
}

// Get all KPIs
export async function getAllKPIs() {
  return prisma.kPI.findMany({
    orderBy: { category: "asc" },
  });
}

// Get KPIs by category
export async function getKPIsByCategory(category: string) {
  return prisma.kPI.findMany({
    where: { category },
    orderBy: { createdAt: "desc" },
  });
}

// Create KPI
export async function createKPI(input: CreateKPIInput) {
  return prisma.kPI.create({
    data: input,
  });
}

// Update KPI
export async function updateKPI(id: string, input: Partial<CreateKPIInput>) {
  return prisma.kPI.update({
    where: { id },
    data: input,
  });
}

// Delete KPI
export async function deleteKPI(id: string) {
  return prisma.kPI.delete({
    where: { id },
  });
}

// ========================================
// ALERT SERVICE
// ========================================

export interface CreateAlertInput {
  title: string;
  description?: string;
  type?: string;
}

// Get all alerts
export async function getAllAlerts() {
  return prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// Get unread alerts
export async function getUnreadAlerts() {
  return prisma.alert.findMany({
    where: { isRead: false },
    orderBy: { createdAt: "desc" },
  });
}

// Create alert
export async function createAlert(input: CreateAlertInput) {
  return prisma.alert.create({
    data: input,
  });
}

// Mark alert as read
export async function markAlertAsRead(id: string) {
  return prisma.alert.update({
    where: { id },
    data: { isRead: true },
  });
}

// Delete alert
export async function deleteAlert(id: string) {
  return prisma.alert.delete({
    where: { id },
  });
}

