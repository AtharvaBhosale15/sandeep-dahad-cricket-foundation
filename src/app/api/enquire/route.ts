import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Mock email sender that saves emails to mock_sent_emails.json
async function sendMockEmail(to: string, subject: string, body: string) {
  try {
    const dataDir = path.join(process.cwd(), "src", "data");
    const filePath = path.join(dataDir, "mock_sent_emails.json");
    
    let sentEmails = [];
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      sentEmails = JSON.parse(fileData);
    } catch {
      // Handle file not existing yet
    }

    const newEmail = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      to,
      subject,
      body,
      sentAt: new Date().toISOString()
    };

    sentEmails.unshift(newEmail);
    await fs.writeFile(filePath, JSON.stringify(sentEmails, null, 2), "utf-8");
    
    // Log to console for debugging
    console.log(`\n=================== [MOCK EMAIL SENT] ===================`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`BODY:\n${body}`);
    console.log(`=========================================================\n`);
    
    return true;
  } catch (err) {
    console.error("Error in mock email sending:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      age, 
      gender, 
      mobile, 
      email, 
      city, 
      level, 
      preferredDate, 
      preferredTime, 
      message, 
      service, 
      formType 
    } = body;

    // Create enquiry object matching status requirements
    const newEnquiry = {
      id: Date.now().toString(),
      name,
      age: age || "",
      gender: gender || "",
      mobile,
      email,
      city,
      level: level || "",
      service: service || "General",
      preferredDate: preferredDate || "",
      preferredTime: preferredTime || "",
      message,
      status: "New", // Default status is "New"
      notes: "",     // Remarks/internal notes defaults to empty string
      formType: formType || "contact",
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

    enquiries.unshift(newEnquiry); // Add to beginning
    await fs.writeFile(filePath, JSON.stringify(enquiries, null, 2), "utf-8");

    // Send emails
    // 1. Admin Email Notification
    const adminEmailBody = `Hello Admin,\n\n` +
      `A new ${formType === "booking" ? "Booking" : "General"} Enquiry has been submitted on the Sandeep Dahad Cricket Foundation website.\n\n` +
      `--- Enquiry Details ---\n` +
      `Date/Time: ${new Date(newEnquiry.createdAt).toLocaleString()}\n` +
      `Name: ${newEnquiry.name}\n` +
      (formType === "booking" ? `Age: ${newEnquiry.age}\n` : "") +
      (formType === "booking" && newEnquiry.gender ? `Gender: ${newEnquiry.gender}\n` : "") +
      `Mobile Number: ${newEnquiry.mobile}\n` +
      `Email Address: ${newEnquiry.email}\n` +
      `City: ${newEnquiry.city}\n` +
      `Service Requested/Type: ${newEnquiry.service}\n` +
      (formType === "booking" ? `Playing Level: ${newEnquiry.level}\n` : "") +
      (formType === "booking" && newEnquiry.preferredDate ? `Preferred Date: ${newEnquiry.preferredDate}\n` : "") +
      (formType === "booking" && newEnquiry.preferredTime ? `Preferred Time: ${newEnquiry.preferredTime}\n` : "") +
      `Message:\n${newEnquiry.message}\n\n` +
      `Please log into the Admin Dashboard to manage this enquiry.`;

    await sendMockEmail("sdcricketfoundation@gmail.com", `New ${newEnquiry.service} Enquiry from ${newEnquiry.name}`, adminEmailBody);

    // 2. User Acknowledgement Auto-Reply Email
    const userEmailBody = `Dear ${newEnquiry.name},\n\n` +
      `Thank you for your enquiry.\n` +
      `Our team has received your request and will contact you shortly.\n\n` +
      `Regards,\n` +
      `Sandeep Dahad Cricket Foundation`;

    await sendMockEmail(newEnquiry.email, "Thank You for Contacting Sandeep Dahad Cricket Foundation", userEmailBody);

    return NextResponse.json({ success: true, data: newEnquiry });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
