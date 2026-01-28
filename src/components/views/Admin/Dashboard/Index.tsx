"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import MainLayouts from "@/components/layouts/MainLayouts";
import { useState, useEffect } from "react";

interface ProfileData {
  full_name: string;
}

const AdminDashboard: React.FC = () => {
  const { user, isAuthorized } = useRequireAuth(["admin"]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await fetch("/api/admin/profile");

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (isAuthorized) {
      fetchProfile();
    }
  }, [isAuthorized]);

  if (!isAuthorized) return null;

  return (
    <MainLayouts userRole="admin">
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        <div className="flex flex-col border-b border-gray-200 pb-6 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p
              className={`text-gray-500 mt-1 transition-opacity duration-300 ${isLoadingProfile ? "opacity-50" : "opacity-100"}`}
            >
              Wilujeung Sumping{" "}
              <span className="font-medium text-indigo-600 capitalize">
                {isLoadingProfile ? "User" : profileData?.full_name || "Admin"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
};

export default AdminDashboard;
