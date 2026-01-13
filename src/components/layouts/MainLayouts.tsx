"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../fragments/Navbar";
import Sidebar from "../fragments/Sidebar";
import Footer from "../fragments/Footer";

interface MainLayoutsProps {
  children: React.ReactNode;
  userRole: "admin" | "developer";
  userName?: string;
  showSidebar?: boolean;
  showFooter?: boolean;
}

const MainLayouts: React.FC<MainLayoutsProps> = ({
  children,
  userRole,
  userName = "User",
  showSidebar = true,
  showFooter = true,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    router.push("/auth/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar
        userRole={userRole}
        userName={userName}
        onLogout={handleLogout}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            userRole={userRole}
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />
        )}

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            showSidebar ? "lg:ml-64" : ""
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
          {/* Footer */}
          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};

export default MainLayouts;
