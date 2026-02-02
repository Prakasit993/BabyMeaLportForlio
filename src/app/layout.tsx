import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "System Engineer / Automation Engineer | Business Solution Architect",
  description: "Portfolio ของ System Engineer / Automation Engineer | Business Solution Architect - ผู้เชี่ยวชาญด้าน Next.js, AI และ Automation",
  keywords: "Full-stack Developer, AI Engineer, Next.js, Supabase, n8n, Business Automation, Thailand",
};

import { LanguageProvider } from "@/lib/context/language-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {/* Animated Background */}
          <div className="bg-animated">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
