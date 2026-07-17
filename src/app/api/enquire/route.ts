import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age, mobile, email, city, level, preferredTime, message, service } = body;

    const newEnquiry = {
      id: Date.now().toString(),
      name,
      age,
      mobile,
      email,
      city,
      level,
      preferredTime,
      message,
      service,
      createdAt: new Date().toISOString()
    };

    const filePath = path.join(process.cwd(), "src", "data", "enquiries.json");
    let enquiries = [];
    
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      enquiries = JSON.parse(fileData);
    } catch {
      // Handle if file doesn't exist
    }

    enquiries.unshift(newEnquiry); // Add to beginning of array

    await fs.writeFile(filePath, JSON.stringify(enquiries, null, 2), "utf-8");

    return NextResponse.json({ success: true, data: newEnquiry });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
