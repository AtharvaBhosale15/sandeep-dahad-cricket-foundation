import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "src", "data");

    // Read Students/Testimonials
    let students = [];
    try {
      const studentsData = await fs.readFile(path.join(dataDir, "students.json"), "utf-8");
      students = JSON.parse(studentsData);
    } catch {
      // ignore
    }

    // Read Gallery
    let gallery = [];
    try {
      const galleryData = await fs.readFile(path.join(dataDir, "gallery.json"), "utf-8");
      gallery = JSON.parse(galleryData);
    } catch {
      // ignore
    }

    // Read Blogs
    let blogs = [];
    try {
      const blogsData = await fs.readFile(path.join(dataDir, "blogs.json"), "utf-8");
      blogs = JSON.parse(blogsData);
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      students,
      gallery,
      blogs
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
