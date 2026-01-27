"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import MainLayouts from "@/components/layouts/MainLayouts";
import { useState, useEffect } from "react";

interface ProfileData {
  full_name: string;
}

const DeveloperDashboard: React.FC = () => {
  const { user, isAuthorized } = useRequireAuth(["developer"]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await fetch("/api/developer/profile");

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
    <MainLayouts userRole="developer">
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        <div className="flex flex-col border-b border-gray-200 pb-6 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            {isLoadingProfile ? (
              <span className="inline-block w-40 h-7 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              <p className="text-gray-500 mt-1">
                Wilujeung Sumping{" "}
                <span className="font-medium text-indigo-600 capitalize">
                  {profileData?.full_name || "Developer"}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayouts>
  );
};

export default DeveloperDashboard;
