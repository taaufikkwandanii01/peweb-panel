"use client";

import Button from "@/components/ui/Button";
import React, { useState, useEffect } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaGithubSquare,
} from "react-icons/fa";
import { SiGmail, SiLinkedin } from "react-icons/si";
import { TbBrandWhatsappFilled } from "react-icons/tb";

interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  location: string | null;
  bio: string | null;
  linkedin: string | null;
  created_at: string;
  updated_at: string;
}

const AdminProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<ProfileData>({
    id: "",
    email: "",
    full_name: "",
    phone: null,
    role: "admin",
    location: null,
    bio: null,
    linkedin: null,
    created_at: "",
    updated_at: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchProfile = async () => {
    try {
      setIsFetchingProfile(true);
      const response = await fetch("/api/admin/profile");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch profile");
      }

      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to load profile",
      });
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          linkedin: formData.linkedin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      setIsEditing(false);

      if (data.profile) {
        setFormData((prev) => ({ ...prev, ...data.profile }));
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setMessage({
        type: "success",
        text: "Password changed successfully!",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to change password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Profile Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <FaCheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <FaExclamationCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Main Content - Conditional Rendering */}
      {isFetchingProfile ? (
        // LOADING STATE - Skeleton
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col items-center">
                {/* Avatar Skeleton */}
                <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>

                {/* Name Skeleton */}
                <div className="w-40 h-6 bg-gray-200 rounded mt-4 animate-pulse"></div>

                {/* Email Skeleton */}
                <div className="w-48 h-4 bg-gray-200 rounded mt-2 animate-pulse"></div>

                {/* Info Section Skeleton */}
                <div className="w-full mt-6 pt-6 border-t border-gray-200 space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Forms Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Skeleton */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={i >= 4 ? "md:col-span-2" : ""}>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div
                      className={`w-full ${i === 5 ? "h-24" : "h-10"} bg-gray-200 rounded-lg animate-pulse`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password Skeleton */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="w-40 h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="w-32 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                ))}
                <div className="w-40 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // SUCCESS STATE - Actual Content
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-4xl">
                      {formData.full_name
                        ? formData.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "AD"}
                    </span>
                  </div>
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {formData.full_name || "Admin User"}
                </h2>
                <a
                  href={`mailto:${formData.email}`}
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-all flex items-center gap-2"
                >
                  {formData.email}
                </a>

                {/* Social Links */}
                <div className="flex items-center justify-center">
                  {" "}
                  {(formData.phone || formData.linkedin) && (
                    <div className="w-full pt-3">
                      <div className="flex flex-row items-center justify-center gap-4">
                        {formData.phone && (
                          <a
                            href={`https://wa.me/${formData.phone.replace(/\D/g, "")}`} // Perbaikan link WhatsApp
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-green-500 hover:bg-green-50 transition-all"
                            title="Chat via WhatsApp"
                          >
                            <TbBrandWhatsappFilled className="w-6 h-6" />
                          </a>
                        )}

                        {formData.linkedin && (
                          <a
                            href={
                              formData.linkedin.startsWith("http")
                                ? formData.linkedin
                                : `https://${formData.linkedin}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            title="LinkedIn Profile"
                          >
                            <SiLinkedin className="w-6 h-6" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FaBriefcase className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 capitalize">
                      {formData.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">
                      Joined {formatDate(formData.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information & Password */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    Update Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={true}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="081933565666"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <input
                    name="linkedin"
                    value={formData.linkedin || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="linkedin.com/in/username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    name="location"
                    value={formData.location || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleSaveProfile}
                    isLoading={isLoading}
                    disabled={isLoading}
                    variant="primary"
                    className="px-6 py-2 cursor-pointer"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }}
                    disabled={isLoading}
                    className="px-6 py-2 cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Change Password
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Must be at least 6 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleChangePassword}
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="px-6 py-2 cursor-pointer"
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
