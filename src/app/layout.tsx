import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sandeep Dahad Cricket Foundation | Elite Cricket Coaching",
  description: "Elite cricket coaching, private & group programs, high performance training and consultations by BCCI & Cricket Australia Level-3 Coach Sandeep Dahad.",
  keywords: ["Sandeep Dahad", "Cricket Coaching", "Cricket Academy Mumbai", "High Performance Cricket", "BCCI Level-3 Coach", "Fast Bowling Specialist"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}

