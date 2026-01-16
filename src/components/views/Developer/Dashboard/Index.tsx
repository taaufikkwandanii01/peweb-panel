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

// 1. Definisikan Interface untuk Props StatCard
interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  colorClass: string;
  bgColor: string;
}

// 2. Terapkan interface pada komponen
const StatCard = ({
  title,
  value,
  icon: Icon,
  colorClass,
  bgColor,
}: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center">
      <div className={`flex-shrink-0 rounded-lg p-3 ${bgColor} ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div className="ml-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default function DeveloperDashboard() {
  const { user, loading, isAuthorized } = useRequireAuth(["developer"]);

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
    <MainLayouts userRole="developer">
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Header Section - Minimalist Version */}
        <div className="flex flex-col border-b border-gray-200 pb-6 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Developer Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Selamat datang{" "}
              <span className="font-medium text-indigo-600 capitalize">
                {user?.user_metadata?.full_name || "Developer"}
              </span>
            </p>
          </div>
        </div>

        {/* SECTION: PRODUCT STATISTICS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <FiActivity className="text-purple-600" size={20} />
            <h2 className="text-xl font-bold text-gray-800">Status Products</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Website Category Box */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center">
                <div className="flex items-center gap-2 font-bold text-gray-700">
                  <FiGlobe className="text-blue-500" />
                  <span>Kategori: Website</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <StatusSmallCard
                  label="Pending"
                  value={0}
                  icon={FiClock}
                  color="text-amber-500"
                />
                <StatusSmallCard
                  label="Approved"
                  value={0}
                  icon={FiCheckCircle}
                  color="text-emerald-500"
                  border="border-emerald-500"
                />
                <StatusSmallCard
                  label="Rejected"
                  value={0}
                  icon={FiXCircle}
                  color="text-rose-500"
                  border="border-rose-500"
                />
              </div>
            </div>

            {/* Web App Category Box */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center">
                <div className="flex items-center gap-2 font-bold text-gray-700">
                  <FiLayout className="text-purple-500" />
                  <span>Kategori: Web App</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <StatusSmallCard
                  label="Pending"
                  value={0}
                  icon={FiClock}
                  color="text-amber-500"
                />
                <StatusSmallCard
                  label="Approved"
                  value={0}
                  icon={FiCheckCircle}
                  color="text-emerald-500"
                  border="border-emerald-500"
                />
                <StatusSmallCard
                  label="Rejected"
                  value={0}
                  icon={FiXCircle}
                  color="text-rose-500"
                  border="border-rose-500"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayouts>
  );
}

// 3. Tambahan Komponen Kecil untuk Status Produk agar lebih rapi
interface StatusSmallCardProps {
  label: string;
  value: number;
  icon: IconType;
  color: string;
  border?: string;
}

const StatusSmallCard = ({
  label,
  value,
  icon: Icon,
  color,
  border,
}: StatusSmallCardProps) => (
  <div
    className={`bg-white p-4 rounded-xl shadow-sm text-center border-b-2 ${
      border || "border-transparent"
    }`}
  >
    <Icon className={`mx-auto mb-1 ${color}`} />
    <p className="text-[10px] uppercase text-gray-400 font-bold">{label}</p>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);
