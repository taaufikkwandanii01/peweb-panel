import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel - Manage Your Application",
  description: "Modern and powerful admin panel for managing your applications",
  keywords: ["admin panel", "dashboard", "management", "nextjs"],
  authors: [{ name: "Your Company" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        {/* AuthProvider membungkus seluruh app untuk menyediakan user state */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
