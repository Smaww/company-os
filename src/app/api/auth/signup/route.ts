import { NextResponse } from "next/server";
import type { UserRole } from "@/lib/config";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

// ========================================
// SIGNUP API ROUTE - ROBUST ERROR HANDLING
// POST /api/auth/signup
// ========================================

export async function POST(request: Request) {
  console.log("[SIGNUP] Starting signup request...");
  
  try {
    // ========================================
    // 1. PARSE REQUEST BODY
    // ========================================
    let body;
    try {
      body = await request.json();
      console.log("[SIGNUP] Body parsed successfully:", { 
        email: body.email, 
        name: body.name, 
        role: body.role 
      });
    } catch (parseError) {
      console.error("[SIGNUP] JSON Parse Error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body", details: "فشل في قراءة البيانات" },
        { status: 400 }
      );
    }

    const { email, password, name, nameAr, role, phone } = body;

    // ========================================
    // 2. VALIDATE REQUIRED FIELDS
    // ========================================
    if (!email || !password || !name || !role) {
      console.log("[SIGNUP] Validation failed - missing fields");
      return NextResponse.json(
        { error: "Missing required fields", details: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("[SIGNUP] Invalid email format:", email);
      return NextResponse.json(
        { error: "Invalid email format", details: "صيغة البريد الإلكتروني غير صحيحة" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      console.log("[SIGNUP] Password too short");
      return NextResponse.json(
        { error: "Password too short", details: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ["ADMIN", "CHAIRMAN", "VP", "GM"];
    if (!validRoles.includes(role)) {
      console.log("[SIGNUP] Invalid role:", role);
      return NextResponse.json(
        { error: "Invalid role", details: "المنصب غير صالح" },
        { status: 400 }
      );
    }

    // ========================================
    // 3. CHECK IF USER ALREADY EXISTS
    // ========================================
    console.log("[SIGNUP] Checking if user exists...");
    
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: { id: true, email: true }
      });
    } catch (dbError: any) {
      console.error("[SIGNUP] Database error checking existing user:", {
        message: dbError.message,
        code: dbError.code,
        stack: dbError.stack
      });
      return NextResponse.json(
        { 
          error: "Database connection error", 
          details: "فشل في الاتصال بقاعدة البيانات",
          code: dbError.code || "UNKNOWN"
        },
        { status: 500 }
      );
    }

    if (existingUser) {
      console.log("[SIGNUP] User already exists:", email);
      return NextResponse.json(
        { error: "User already exists", details: "البريد الإلكتروني مسجل مسبقاً" },
        { status: 400 }
      );
    }

    // ========================================
    // 4. HASH PASSWORD
    // ========================================
    console.log("[SIGNUP] Hashing password...");
    
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (hashError: any) {
      console.error("[SIGNUP] Password hashing error:", hashError);
      return NextResponse.json(
        { error: "Password hashing failed", details: "فشل في معالجة كلمة المرور" },
        { status: 500 }
      );
    }

    // ========================================
    // 5. CREATE USER IN DATABASE
    // ========================================
    console.log("[SIGNUP] Creating user in database...");
    
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          name: name.trim(),
          nameAr: nameAr?.trim() || null,
          role: role,
          phone: phone?.trim() || null,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          nameAr: true,
          role: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
      });
      
      console.log("[SIGNUP] User created successfully:", { id: user.id, email: user.email });
      
    } catch (createError: any) {
      console.error("[SIGNUP] User creation error:", {
        message: createError.message,
        code: createError.code,
        meta: createError.meta,
        stack: createError.stack
      });

      // Handle specific Prisma errors
      if (createError.code === 'P2002') {
        // Unique constraint violation
        return NextResponse.json(
          { error: "User already exists", details: "البريد الإلكتروني مسجل مسبقاً" },
          { status: 400 }
        );
      }

      if (createError.code === 'P1001') {
        // Can't reach database
        return NextResponse.json(
          { error: "Database unreachable", details: "لا يمكن الوصول إلى قاعدة البيانات" },
          { status: 503 }
        );
      }

      if (createError.code === 'P1002') {
        // Database timeout
        return NextResponse.json(
          { error: "Database timeout", details: "انتهت مهلة الاتصال بقاعدة البيانات" },
          { status: 503 }
        );
      }

      // Generic database error
      return NextResponse.json(
        { 
          error: "Failed to create user", 
          details: "فشل في إنشاء الحساب",
          code: createError.code || "UNKNOWN"
        },
        { status: 500 }
      );
    }

    // ========================================
    // 6. RETURN SUCCESS RESPONSE
    // ========================================
    console.log("[SIGNUP] Signup completed successfully");
    
    return NextResponse.json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }, { status: 201 });

  } catch (error: any) {
    // ========================================
    // CATCH-ALL ERROR HANDLER
    // ========================================
    console.error("[SIGNUP] Unhandled error:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: "حدث خطأ غير متوقع أثناء إنشاء الحساب",
        debug: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ========================================
// OPTIONS - Handle CORS preflight
// ========================================
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
