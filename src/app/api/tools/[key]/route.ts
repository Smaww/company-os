import { NextResponse } from "next/server";
import { fetchTool, type ToolKey } from "@/services/tools";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  
  try {
    const result = await fetchTool(key as ToolKey);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { data: null, status: "error", error: "Failed to fetch tool" },
      { status: 500 }
    );
  }
}

