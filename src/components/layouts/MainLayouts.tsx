"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "../fragments/Navbar";
import Sidebar from "../fragments/Sidebar";
import Footer from "../fragments/Footer";

interface MainLayoutsProps {
  children: React.ReactNode;
  userRole: "admin" | "developer";
  showSidebar?: boolean;
  showFooter?: boolean;
}

const MainLayouts: React.FC<MainLayoutsProps> = ({
  children,
  userRole,
  showSidebar = true,
  showFooter = true,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    // min-h-screen dan flex-col memastikan footer bisa didorong ke bawah
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navbar - Fixed at top with high z-index */}
      <Navbar
        userRole={userRole}
        onLogout={handleLogout}
        onToggleSidebar={toggleSidebar}
      />

      {/* Kontainer Utama */}
      <div className="flex flex-1 pt-16">
        {" "}
        {/* pt-16 menyesuaikan h-16 pada Navbar */}
        {/* Sidebar - Position fixed inside */}
        {showSidebar && (
          <Sidebar
            userRole={userRole}
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />
        )}
        {/* Area Konten Utama */}
        <div className="flex flex-col flex-1 w-full">
          <main
            className={`flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)] ${
              showSidebar ? "lg:ml-64" : ""
            }`}
          >
            {/* Wrapper konten dengan padding yang konsisten */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>

          {/* Footer diletakkan di dalam flex-col konten utama agar sejajar dengan margin sidebar */}
          {showFooter && (
            <div
              className={`transition-all duration-300 ${showSidebar ? "lg:ml-64" : ""}`}
            >
              <Footer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayouts;
