import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passcode, type, data } = body;

    if (passcode !== "sdcf2026") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!["students", "gallery", "blogs"].includes(type)) {
      return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "src", "data", `${type}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: `${type} data saved.` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
