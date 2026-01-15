"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaLinkedin,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

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

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Clear message after 5 seconds
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

      // Update form data with response
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

  const handleChangePassword = async (e: React.FormEvent) => {
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

  if (isFetchingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              <p className="text-sm text-gray-600">{formData.email}</p>

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

              {formData.linkedin && (
                <div className="w-full mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Connect
                  </h3>
                  <div className="space-y-3">
                    <a
                      href={
                        formData.linkedin.startsWith("http")
                          ? formData.linkedin
                          : `https://${formData.linkedin}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      <FaLinkedin className="w-5 h-5 text-gray-400" />
                      LinkedIn
                    </a>
                  </div>
                </div>
              )}
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
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                fullWidth
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={true}
                fullWidth
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                fullWidth
                placeholder="+1 234 567 8900"
              />
              <Input
                label="LinkedIn"
                name="linkedin"
                value={formData.linkedin || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                fullWidth
                placeholder="linkedin.com/in/username"
              />
              <div className="md:col-span-2">
                <Input
                  label="Location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  fullWidth
                  placeholder="City, Country"
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
                  variant="primary"
                  isLoading={isLoading}
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile(); // Reset to original data
                  }}
                  variant="outline"
                  disabled={isLoading}
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
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                fullWidth
                placeholder="Enter current password"
              />
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                fullWidth
                helperText="Must be at least 8 characters"
                placeholder="Enter new password"
              />
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                fullWidth
                placeholder="Confirm new password"
              />
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
