"use client";

import React, { useState, useEffect } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiDroplet,
  FiSettings,
  FiBriefcase,
} from "react-icons/fi";
import { adminService, ApiUser } from "@/services/adminService";
import { ToastType } from "@/components/ui/Toast";
import Button from "../Button";
import { FaBriefcase } from "react-icons/fa";

interface ModalUsersUpdateStatusProps {
  isOpen: boolean;
  onClose: () => void;
  user: ApiUser | null;
  onUserUpdated: () => void;
  showToast: (message: string, type: ToastType) => void;
}

const ModalUsersUpdateStatus: React.FC<ModalUsersUpdateStatusProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
  showToast,
}) => {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending",
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setStatus(
        (user.status || "pending") as "pending" | "approved" | "rejected",
      );
    }
  }, [user]);

  const handleUpdate = async (): Promise<void> => {
    if (!user) return;
    setIsLoading(true);

    try {
      const result = await adminService.updateUserStatus({
        userId: user.id,
        status: status,
      });

      if (result.success) {
        showToast("User status updated successfully", "success");
        onUserUpdated();
        onClose();
      } else {
        showToast(result.message || "Failed to update", "error");
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 md:p-6 flex justify-start items-center bg-amber-50">
          <h2 className="text-lg font-bold text-amber-900">
            Form Update Status Account
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-100">
            <div className="flex items-center text-sm text-gray-700">
              <FiUser className="mr-2 text-amber-500" />
              <span className="font-semibold capitalize">
                {user.full_name || "N/A"}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 capitalize">
              <FiBriefcase className="mr-2 text-amber-500" />
              <span>{user.role}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiPhone className="mr-2 text-amber-500" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiMail className="mr-2 text-amber-500" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 capitalize">
              <FiSettings className="mr-2 text-amber-500" />
              <span>{user.status}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "pending" | "approved" | "rejected")
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              variant="warning"
              fullWidth
              onClick={handleUpdate}
              isLoading={isLoading}
              className="cursor-pointer"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUsersUpdateStatus;
