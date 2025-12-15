import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CEO Workspace database...\n");

  // ========================================
  // 1. CREATE USERS (System & Executives)
  // ========================================
  console.log("👤 Creating users...");

  const users = [
    {
      email: "admin@ceoworkspace.com",
      password: "Admin@2024",
      name: "System Admin",
      nameAr: "مدير النظام",
      role: "ADMIN",
      phone: "+966 50 000 0000",
    },
    {
      email: "chairman@ceoworkspace.com",
      password: "Chairman@2024",
      name: "Ahmed Al-Rashid",
      nameAr: "أحمد الراشد",
      role: "CHAIRMAN",
      phone: "+966 50 111 1111",
    },
    {
      email: "vp@ceoworkspace.com",
      password: "VP@2024",
      name: "Khalid Al-Otaibi",
      nameAr: "خالد العتيبي",
      role: "VP",
      phone: "+966 50 222 2222",
    },
    {
      // PRIMARY USER - Islam El-Tahawy (General Manager)
      email: "islam@ceoworkspace.com",
      password: "GM@2024",
      name: "Islam El-Tahawy",
      nameAr: "إسلام الطحاوي",
      role: "GM",
      phone: "+966 50 333 3333",
    },
  ];

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        password: hashedPassword,
        name: userData.name,
        nameAr: userData.nameAr,
        role: userData.role,
        phone: userData.phone,
      },
      create: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        nameAr: userData.nameAr,
        role: userData.role,
        phone: userData.phone,
      },
    });
    
    console.log(`   ✅ ${userData.role}: ${userData.email}`);
  }

  // ========================================
  // 2. CREATE TOOLS REGISTRY
  // ========================================
  console.log("\n🔧 Creating tools registry...");

  const tools = [
    { name: "Zoho Mail", url: "https://www.zoho.com/ar/mail/", icon: "Mail", color: "bg-blue-100 text-blue-600", order: 1 },
    { name: "Slack", url: "https://slack.com/", icon: "MessageSquare", color: "bg-purple-100 text-purple-600", order: 2 },
    { name: "Hubstaff", url: "https://app.hubstaff.com/organizations", icon: "Clock", color: "bg-green-100 text-green-600", order: 3 },
    { name: "GitHub", url: "https://github.com/", icon: "Github", color: "bg-gray-100 text-gray-800", order: 4 },
    { name: "Taqnyat", url: "https://portal.taqnyat.sa/", icon: "MessageSquare", color: "bg-orange-100 text-orange-600", order: 5 },
    { name: "Store WhatsApp", url: "https://social.social-bot.io/app/login", icon: "Phone", color: "bg-emerald-100 text-emerald-600", order: 6 },
    { name: "Store Dashboard", url: "https://s.salla.sa/", icon: "ShoppingBag", color: "bg-teal-100 text-teal-600", order: 7 },
    { name: "Zoho Books", url: "https://books.zoho.com/app/884228379#/home/dashboard", icon: "CreditCard", color: "bg-red-100 text-red-600", order: 8 },
    { name: "CP Admin", url: "https://cp-frontend-one.vercel.app/ar/", icon: "LayoutDashboard", color: "bg-indigo-100 text-indigo-600", order: 9 },
  ];

  // Clear existing tools and recreate
  await prisma.tool.deleteMany();
  
  for (const tool of tools) {
    await prisma.tool.create({ data: tool });
    console.log(`   ✅ ${tool.name}`);
  }

  // ========================================
  // 3. CREATE SAMPLE EMPLOYEES
  // ========================================
  console.log("\n👥 Creating sample employees...");

  const employees = [
    {
      name: "محمد أحمد",
      nameEn: "Mohammed Ahmed",
      email: "mohammed@company.com",
      phone: "+966 50 123 4567",
      role: "مطور Full Stack",
      department: "التقنية",
      status: "active",
      productivity: 92,
      joinDate: new Date("2022-01-15"),
    },
    {
      name: "سارة خالد",
      nameEn: "Sara Khaled",
      email: "sara@company.com",
      phone: "+966 50 234 5678",
      role: "مصممة UI/UX",
      department: "التصميم",
      status: "active",
      productivity: 88,
      joinDate: new Date("2022-03-20"),
    },
    {
      name: "عبدالله عمر",
      nameEn: "Abdullah Omar",
      email: "abdullah@company.com",
      phone: "+966 50 345 6789",
      role: "مدير المشاريع",
      department: "الإدارة",
      status: "active",
      productivity: 95,
      joinDate: new Date("2021-06-01"),
    },
    {
      name: "نورة محمد",
      nameEn: "Noura Mohammed",
      email: "noura@company.com",
      phone: "+966 50 456 7890",
      role: "محللة أعمال",
      department: "التحليل",
      status: "active",
      productivity: 90,
      joinDate: new Date("2023-02-10"),
    },
    {
      name: "فهد العنزي",
      nameEn: "Fahad Al-Anzi",
      email: "fahad@company.com",
      phone: "+966 50 567 8901",
      role: "مهندس DevOps",
      department: "التقنية",
      status: "active",
      productivity: 87,
      joinDate: new Date("2023-05-15"),
    },
  ];

  for (const employee of employees) {
    await prisma.employee.upsert({
      where: { email: employee.email },
      update: employee,
      create: employee,
    });
    console.log(`   ✅ ${employee.name}`);
  }

  // ========================================
  // 4. CREATE SAMPLE KPIS
  // ========================================
  console.log("\n📊 Creating KPIs...");

  // Clear existing KPIs
  await prisma.kPI.deleteMany();

  const kpis = [
    { name: "Total Revenue", nameAr: "إجمالي الإيرادات", value: "2.4M SAR", trend: "+12%", icon: "TrendingUp", color: "green", category: "finance" },
    { name: "Active Projects", nameAr: "المشاريع النشطة", value: "12", trend: "+3", icon: "Folder", color: "blue", category: "operations" },
    { name: "Team Size", nameAr: "حجم الفريق", value: "48", trend: "+5", icon: "Users", color: "purple", category: "hr" },
    { name: "Customer Satisfaction", nameAr: "رضا العملاء", value: "94%", trend: "+2%", icon: "Star", color: "yellow", category: "quality" },
  ];

  for (const kpi of kpis) {
    await prisma.kPI.create({ data: kpi });
    console.log(`   ✅ ${kpi.nameAr}`);
  }

  // ========================================
  // 5. CREATE SAMPLE PROJECTS
  // ========================================
  console.log("\n📁 Creating sample projects...");

  const gmUser = await prisma.user.findUnique({
    where: { email: "islam@ceoworkspace.com" },
  });

  if (gmUser) {
    // Clear existing projects
    await prisma.blocker.deleteMany();
    await prisma.task.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();

    const projects = [
      {
        name: "تطوير منصة التجارة الإلكترونية",
        description: "بناء منصة متكاملة للتجارة الإلكترونية مع نظام إدارة المخزون",
        client: "شركة الرياض التجارية",
        status: "active",
        progress: 75,
        startDate: new Date("2024-01-01"),
        deadline: new Date("2024-06-30"),
        creatorId: gmUser.id,
      },
      {
        name: "تطبيق الجوال للعملاء",
        description: "تطوير تطبيق iOS و Android للعملاء",
        client: "مؤسسة النخبة",
        status: "active",
        progress: 45,
        startDate: new Date("2024-02-15"),
        deadline: new Date("2024-08-15"),
        creatorId: gmUser.id,
      },
      {
        name: "نظام إدارة الموارد البشرية",
        description: "نظام متكامل لإدارة شؤون الموظفين",
        client: "داخلي",
        status: "pending",
        progress: 10,
        startDate: new Date("2024-04-01"),
        deadline: new Date("2024-12-31"),
        creatorId: gmUser.id,
      },
    ];

    for (const projectData of projects) {
      const project = await prisma.project.create({ data: projectData });

      // Add sample tasks
      await prisma.task.createMany({
        data: [
          {
            title: `مهمة تحليل المتطلبات - ${projectData.name}`,
            status: "completed",
            priority: "high",
            projectId: project.id,
            creatorId: gmUser.id,
          },
          {
            title: `مهمة التصميم الأولي - ${projectData.name}`,
            status: "in_progress",
            priority: "medium",
            projectId: project.id,
            creatorId: gmUser.id,
          },
        ],
      });

      // Add blocker for active projects
      if (projectData.status === "active" && projectData.progress > 50) {
        await prisma.blocker.create({
          data: {
            description: "تأخر في استلام متطلبات التصميم من العميل",
            severity: "medium",
            projectId: project.id,
          },
        });
      }

      console.log(`   ✅ ${projectData.name}`);
    }
  }

  // ========================================
  // 6. CREATE SAMPLE ALERTS
  // ========================================
  console.log("\n🔔 Creating sample alerts...");

  // Clear existing alerts
  await prisma.alert.deleteMany();

  const alerts = [
    { title: "موعد تسليم مشروع", description: "مشروع التجارة الإلكترونية - التسليم خلال أسبوع", type: "warning" },
    { title: "تحديث أمني", description: "تم تثبيت التحديثات الأمنية الجديدة", type: "success" },
    { title: "اجتماع الفريق", description: "اجتماع أسبوعي غداً الساعة 10 صباحاً", type: "info" },
  ];

  for (const alert of alerts) {
    await prisma.alert.create({ data: alert });
    console.log(`   ✅ ${alert.title}`);
  }

  // ========================================
  // DONE
  // ========================================
  console.log("\n" + "=".repeat(50));
  console.log("🎉 Database seeding completed successfully!");
  console.log("=".repeat(50));
  console.log("\n📋 Login Credentials:");
  console.log("─".repeat(50));
  console.log("   👤 General Manager (Primary):");
  console.log("      Email: islam@ceoworkspace.com");
  console.log("      Password: GM@2024");
  console.log("");
  console.log("   👤 Admin:");
  console.log("      Email: admin@ceoworkspace.com");
  console.log("      Password: Admin@2024");
  console.log("");
  console.log("   👤 Chairman:");
  console.log("      Email: chairman@ceoworkspace.com");
  console.log("      Password: Chairman@2024");
  console.log("");
  console.log("   👤 VP:");
  console.log("      Email: vp@ceoworkspace.com");
  console.log("      Password: VP@2024");
  console.log("─".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
