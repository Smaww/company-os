import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/services/db/users";
import type { UserRole } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, nameAr, role, phone } = body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مسجل مسبقاً" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ["ADMIN", "CHAIRMAN", "VP", "GM"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "المنصب غير صالح" },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({
      email,
      password,
      name,
      nameAr,
      role,
      phone,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الحساب" },
      { status: 500 }
    );
  }
}

