"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { supabase } from "@/lib/supabase";

interface NavbarProps {
  userRole?: "admin" | "developer";
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  userRole = "admin",
  onLogout,
  onToggleSidebar,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Efek shadow saat scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("usersProfiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profileError) {
          setUserName(user.email?.split("@")[0] || "User");
        } else if (profile) {
          setUserName(profile.full_name || "User");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white"
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors active:scale-95"
            >
              <FaBars className="w-5 h-5" />
            </button>

            <Link
              href={`/${userRole}/dashboard`}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform duration-300">
                <span className="text-white font-bold text-lg italic">P</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tighter text-gray-900 group-hover:text-indigo-600 transition-colors">
                  PEWEB<span className="text-indigo-600">.</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Notification Bell (Interaktif) */}
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative group">
              <FaBell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 p-1.5 pr-3 rounded-2xl transition-all duration-200 ${
                  isProfileOpen
                    ? "bg-gray-100 ring-1 ring-gray-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs uppercase">
                      {loading ? "" : userName.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="hidden md:flex flex-col items-start leading-none">
                  <span className="text-sm font-bold text-gray-800 line-clamp-1 capitalize">
                    {loading ? "Loading..." : userName}
                  </span>
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter mt-1">
                    {userRole}
                  </span>
                </div>

                <FaChevronDown
                  className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Enhanced Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 py-2 z-20 border border-gray-100 animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {userName}
                      </p>
                    </div>

                    <Link
                      href={`/${userRole}/profile`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white">
                        <FaUser className="w-3.5 h-3.5" />
                      </div>
                      My Profile
                    </Link>

                    <Link
                      href={`/${userRole}/settings`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        <FaCog className="w-3.5 h-3.5" />
                      </div>
                      Settings
                    </Link>

                    <div className="px-2 mt-2 pt-2 border-t border-gray-50">
                      <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                          <FaSignOutAlt className="w-3.5 h-3.5" />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
