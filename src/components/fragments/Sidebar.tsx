"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaTimes,
  FaChevronRight,
  FaBolt,
  FaCode,
} from "react-icons/fa";

interface SidebarProps {
  userRole: "admin" | "developer";
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  isOpen = true,
  onClose,
}) => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      href: `/${userRole}/dashboard`,
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <FaUsers className="w-5 h-5" />,
      adminOnly: true,
    },
    {
      name: "Products",
      href: `/${userRole}/products`,
      icon: <FaCode className="w-5 h-5" />,
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || userRole === "admin"
  );

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 capitalize">
                {userRole} Panel
              </h2>
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={onClose}
                  >
                    <span
                      className={
                        isActive(item.href) ? "text-blue-600" : "text-gray-500"
                      }
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    {isActive(item.href) && (
                      <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <FaBolt className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Need Help?
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    Check our support center
                  </p>
                  <button
                    onClick={() => {
                      // Option 1: Show alert (temporary)
                      // alert("Support feature coming soon!");
                      
                      // Option 2: Open external docs
                      // window.open('https://your-docs-url.com', '_blank');
                      
                      // Option 3: Navigate to internal docs (if exists)
                      // window.location.href = '/support';
                      
                      alert("Documentation and support features coming soon!");
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    Learn More
                    <FaChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
