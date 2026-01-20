import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PeWeb Panel - Manage Your Products",
  description: "Modern and powerful admin panel for managing your products.",
  keywords: ["peweb panel", "dashboard", "management", "products"],
  authors: [{ name: "Ibra" }],
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
