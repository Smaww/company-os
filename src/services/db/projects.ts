import prisma from "@/lib/db";

// ========================================
// PROJECT SERVICE - DATABASE OPERATIONS
// ========================================

export interface CreateProjectInput {
  name: string;
  description?: string;
  client?: string;
  status?: string;
  progress?: number;
  startDate?: Date;
  deadline?: Date;
  budget?: number;
  creatorId: string;
}

// Get all projects with relations
export async function getAllProjects() {
  return prisma.project.findMany({
    include: {
      creator: {
        select: { id: true, name: true, avatar: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
      blockers: {
        where: { resolved: false },
      },
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

// Get project by ID
export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      creator: {
        select: { id: true, name: true, avatar: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
      tasks: {
        orderBy: { createdAt: "desc" },
      },
      blockers: true,
    },
  });
}

// Create project
export async function createProject(input: CreateProjectInput) {
  return prisma.project.create({
    data: input,
  });
}

// Update project
export async function updateProject(id: string, input: Partial<CreateProjectInput>) {
  return prisma.project.update({
    where: { id },
    data: input,
  });
}

// Delete project
export async function deleteProject(id: string) {
  return prisma.project.delete({
    where: { id },
  });
}

// Get project statistics
export async function getProjectStats() {
  const total = await prisma.project.count();
  const active = await prisma.project.count({
    where: { status: "active" },
  });
  const atRisk = await prisma.project.count({
    where: { status: "at_risk" },
  });
  const completed = await prisma.project.count({
    where: { status: "completed" },
  });

  return { total, active, atRisk, completed };
}

// Add blocker to project
export async function addBlocker(projectId: string, description: string, severity: string = "medium") {
  return prisma.blocker.create({
    data: {
      projectId,
      description,
      severity,
    },
  });
}

// Resolve blocker
export async function resolveBlocker(id: string) {
  return prisma.blocker.update({
    where: { id },
    data: {
      resolved: true,
      resolvedAt: new Date(),
    },
  });
}

