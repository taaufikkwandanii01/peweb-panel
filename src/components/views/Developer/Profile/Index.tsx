"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  FaCamera,
  FaCode,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";

const DeveloperProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Jane Developer",
    email: "jane.dev@company.com",
    phone: "+1 234 567 8901",
    role: "Developer",
    expertise: "Full Stack Development",
    location: "San Francisco, USA",
    bio: "Passionate full-stack developer with expertise in modern web technologies and cloud architecture.",
    github: "github.com/janedev",
    linkedin: "linkedin.com/in/janedev",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const skills = [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "Docker",
    "AWS",
    "PostgreSQL",
    "GraphQL",
  ];

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
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Developer Profile
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your developer account and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-4xl">
                    {formData.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {formData.fullName}
              </h2>
              <p className="text-sm text-gray-600">{formData.email}</p>

              <div className="w-full mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FaBriefcase className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{formData.role}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaCode className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{formData.expertise}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Joined Jan 2024</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="w-full mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Connect
                </h3>
                <div className="space-y-3">
                  <a
                    href={`https://${formData.github}`}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    <FaGithub className="w-5 h-5 text-gray-400" />
                    GitHub
                  </a>
                  <a
                    href={`https://${formData.linkedin}`}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    <FaLinkedin className="w-5 h-5 text-gray-400" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
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
                name="fullName"
                value={formData.fullName}
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
                disabled={!isEditing}
                fullWidth
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                fullWidth
              />
              <Input
                label="Expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleInputChange}
                disabled={!isEditing}
                fullWidth
              />
              <Input
                label="GitHub"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                disabled={!isEditing}
                fullWidth
              />
              <Input
                label="LinkedIn"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                disabled={!isEditing}
                fullWidth
              />
              <div className="md:col-span-2">
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  fullWidth
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  onClick={() => setIsEditing(false)}
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
              />
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                fullWidth
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

export default DeveloperProfile;
