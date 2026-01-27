"use client";

import React, { useState, useEffect, useMemo } from "react";
import Button from "@/components/ui/Button";
import { adminService, ApiUser } from "@/services/adminService";
import { FiSearch, FiUsers, FiRefreshCw, FiPackage } from "react-icons/fi";
import Toast, { ToastType } from "@/components/ui/Toast";
import ModalUsersUpdateStatus from "@/components/ui/ModalUsers/ModalUsersUpdateStatus";
import ModalUsersDelete from "@/components/ui/ModalUsers/ModalUsersDelete";
import CardAdminUsers from "@/components/ui/CardUsers/CardAdminUsers";

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // State Data
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State Modals
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // State Toast
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType): void => {
    setToast({ isVisible: true, message, type });
  };

  const fetchUsers = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllUsers();
      if (response.success) {
        // Gunakan spread operator agar React mendeteksi perubahan referensi array
        setUsers([...(response.data || [])]);
      } else {
        showToast(response.message || "Gagal mengambil data user", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, filterStatus]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: users.length,
      pending: users.filter((u) => u.status === "pending").length,
      approved: users.filter((u) => u.status === "approved").length,
      rejected: users.filter((u) => u.status === "rejected").length,
    };
  }, [users]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Users Management
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center gap-2 cursor-pointer"
          onClick={fetchUsers}
          disabled={isLoading}
        >
          <FiRefreshCw className={isLoading ? "animate-spin" : ""} size={16} />
          {isLoading ? "Loading" : "Refresh"}
        </Button>
      </div>

      {/* Statistics Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Total
              </span>
              <FiPackage className="text-gray-400" size={18} />
            </div>
            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-700 uppercase">
                Pending
              </span>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            </div>
            <p className="text-2xl font-black text-amber-700">
              {stats.pending}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-green-700 uppercase">
                Approved
              </span>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <p className="text-2xl font-black text-green-700">
              {stats.approved}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-red-700 uppercase">
                Rejected
              </span>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
            <p className="text-2xl font-black text-red-700">{stats.rejected}</p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-3 relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <select
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none cursor-pointer"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedUsers.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white border border-dashed border-gray-300 rounded-2xl">
              <FiUsers className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">
                Users (developer) not found
              </p>
            </div>
          ) : (
            paginatedUsers.map((user) => (
              <CardAdminUsers
                key={user.id}
                user={user}
                onEdit={(u) => {
                  setSelectedUser(u);
                  setIsUpdateModalOpen(true);
                }}
                onDelete={(u) => {
                  setSelectedUser(u);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination (Gaya visual identik dengan menu Users) */}
      <div className="mt-6 px-1 flex items-center justify-between">
        <p className="text-[11px] text-gray-500 font-medium">
          Page {currentPage} of {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 shadow-sm transition-all"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 shadow-sm transition-all"
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <ModalUsersUpdateStatus
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        user={selectedUser}
        onUserUpdated={fetchUsers}
        showToast={showToast}
      />

      <ModalUsersDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        user={selectedUser}
        onUserDeleted={fetchUsers}
        showToast={showToast}
      />

      {/* Toast Notification */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        />
      )}
    </div>
  );
};

export default AdminUsers;
