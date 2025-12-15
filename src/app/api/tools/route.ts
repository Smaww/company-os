import { NextResponse } from "next/server";
import { fetchAllTools } from "@/services/tools";

export async function GET() {
  try {
    const tools = await fetchAllTools();
    return NextResponse.json(tools);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    );
  }
}

