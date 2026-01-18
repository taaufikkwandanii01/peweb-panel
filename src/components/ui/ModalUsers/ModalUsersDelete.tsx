"use client";

import React, { useState } from "react";
import {
  FiX,
  FiAlertTriangle,
  FiUser,
  FiPhone,
  FiMail,
  FiDroplet,
  FiSettings,
} from "react-icons/fi";
import { adminService, ApiUser } from "@/services/adminService";
import { ToastType } from "@/components/ui/Toast";
import Button from "../Button";

interface ModalUsersDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  user: ApiUser | null;
  onUserDeleted: () => void;
  showToast: (message: string, type: ToastType) => void;
}

const ModalUsersDelete: React.FC<ModalUsersDeleteProps> = ({
  isOpen,
  onClose,
  user,
  onUserDeleted,
  showToast,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async (): Promise<void> => {
    if (!user) return;
    setIsLoading(true);

    try {
      const result = await adminService.deleteUser(user.id);
      if (result.success) {
        showToast("User deleted successfully", "success");
        onUserDeleted();
        onClose();
      } else {
        showToast(result.message || "Failed to delete user", "error");
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
        <div className="px-6 pb-6 p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <FiAlertTriangle size={32} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900">Hapus</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Apakah Anda yakin ingin menghapus <b>{user.full_name}</b>?
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-100">
            <div className="flex items-center text-sm text-gray-700">
              <FiUser className="mr-2 text-red-500" />
              <span className="font-semibold">{user.full_name || "N/A"}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 capitalize">
              <FiDroplet className="mr-2 text-red-500" />
              <span>{user.role}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiPhone className="mr-2 text-red-500" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiMail className="mr-2 text-red-500" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 capitalize">
              <FiSettings className="mr-2 text-red-500" />
              <span>{user.status}</span>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleDelete}
              isLoading={isLoading}
            >
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUsersDelete;
