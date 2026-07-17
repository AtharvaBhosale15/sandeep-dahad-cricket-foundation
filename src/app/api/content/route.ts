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

    // Read Instagram
    let instagram = [];
    try {
      const instagramData = await fs.readFile(path.join(dataDir, "instagram.json"), "utf-8");
      instagram = JSON.parse(instagramData);
      
      // Dynamically update timestamps relative to current call time
      instagram = instagram.map((item: any) => {
        const dateObj = new Date();
        dateObj.setHours(dateObj.getHours() - item.hoursAgo);
        
        let relativeTime = "";
        const diffHours = item.hoursAgo;
        if (diffHours < 24) {
          relativeTime = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        } else {
          const days = Math.floor(diffHours / 24);
          relativeTime = `${days} day${days > 1 ? "s" : ""} ago`;
        }
        
        // Add random likes fluctuation to feel live-updating
        const randomFluctuation = Math.floor(Math.sin(Date.now() / 100000 + item.likes) * 5);
        
        return {
          ...item,
          likes: item.likes + randomFluctuation,
          date: relativeTime
        };
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      students,
      gallery,
      blogs,
      instagram
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
