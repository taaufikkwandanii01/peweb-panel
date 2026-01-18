"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import MainLayouts from "@/components/layouts/MainLayouts";
import { IconType } from "react-icons";
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiGlobe,
  FiLayout,
  FiActivity,
} from "react-icons/fi";

export default function AdminDashboard() {
  const { user, loading, isAuthorized } = useRequireAuth(["admin"]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <MainLayouts userRole="admin">
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Header Section - Minimalist Version */}
        <div className="flex flex-col border-b border-gray-200 pb-6 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Selamat datang{" "}
              <span className="font-medium text-indigo-600 capitalize">
                {user?.user_metadata?.full_name || "Admin"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
