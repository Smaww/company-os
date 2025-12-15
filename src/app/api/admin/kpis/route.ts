import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createKPI, getAllKPIs } from "@/services/db/kpis";

export async function GET() {
  try {
    const kpis = await getAllKPIs();
    return NextResponse.json(kpis);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch KPIs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const kpi = await createKPI(body);
    return NextResponse.json(kpi);
  } catch (error) {
    console.error("Error creating KPI:", error);
    return NextResponse.json({ error: "Failed to create KPI" }, { status: 500 });
  }
}

