import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    // Simple passcode check in headers or query parameters to protect enquiries
    const { searchParams } = new URL(request.url);
    const passcode = searchParams.get("passcode");

    if (passcode !== "sdcf2026") {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), "src", "data", "enquiries.json");
    let enquiries = [];
    
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      enquiries = JSON.parse(fileData);
    } catch {
      // Return empty if file not created yet
    }

    return NextResponse.json({ success: true, enquiries });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
