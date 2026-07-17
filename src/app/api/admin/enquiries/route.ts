import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// GET handler to fetch enquiries
export async function GET(request: NextRequest) {
  try {
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
      // Empty if no file created yet
    }

    return NextResponse.json({ success: true, enquiries });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST handler to update status and remarks/notes on an enquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passcode, enquiryId, status, notes } = body;

    if (passcode !== "sdcf2026") {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), "src", "data", "enquiries.json");
    let enquiries = [];
    
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      enquiries = JSON.parse(fileData);
    } catch {
      return NextResponse.json({ success: false, error: "Enquiries file not found" }, { status: 404 });
    }

    const index = enquiries.findIndex((e: any) => e.id === enquiryId);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    // Update status and notes if provided
    if (status !== undefined) {
      enquiries[index].status = status;
    }
    if (notes !== undefined) {
      enquiries[index].notes = notes;
    }

    await fs.writeFile(filePath, JSON.stringify(enquiries, null, 2), "utf-8");

    return NextResponse.json({ success: true, enquiries });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
