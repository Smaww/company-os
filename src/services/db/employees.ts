import prisma from "@/lib/db";

// ========================================
// EMPLOYEE SERVICE - DATABASE OPERATIONS
// ========================================

export interface CreateEmployeeInput {
  name: string;
  nameEn?: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  location?: string;
  joinDate: Date;
  status?: string;
  productivity?: number;
  bio?: string;
}

// Get all employees with relations
export async function getAllEmployees() {
  return prisma.employee.findMany({
    include: {
      documents: true,
      performance: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// Get employee by ID
export async function getEmployeeById(id: string) {
  return prisma.employee.findUnique({
    where: { id },
    include: {
      documents: true,
      performance: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

// Create employee
export async function createEmployee(input: CreateEmployeeInput) {
  return prisma.employee.create({
    data: input,
  });
}

// Update employee
export async function updateEmployee(id: string, input: Partial<CreateEmployeeInput>) {
  return prisma.employee.update({
    where: { id },
    data: input,
  });
}

// Delete employee
export async function deleteEmployee(id: string) {
  return prisma.employee.delete({
    where: { id },
  });
}

// Get employee statistics
export async function getEmployeeStats() {
  const total = await prisma.employee.count();
  const online = await prisma.employee.count({
    where: { status: "online" },
  });
  const active = await prisma.employee.count({
    where: { status: "active" },
  });
  
  const employees = await prisma.employee.findMany({
    select: { productivity: true },
  });
  
  const avgProductivity = employees.length > 0
    ? Math.round(employees.reduce((sum, e) => sum + e.productivity, 0) / employees.length)
    : 0;

  return { total, online, active, avgProductivity };
}

