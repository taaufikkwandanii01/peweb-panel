"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Toast, { ToastType } from "@/components/ui/Toast";
import { adminService, ApiUser } from "@/services/adminService";

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

interface EditModalState {
  isOpen: boolean;
  user: ApiUser | null;
}

interface DeleteModalState {
  isOpen: boolean;
  user: ApiUser | null;
}

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State untuk data
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // State untuk modals
  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    user: null,
  });
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    user: null,
  });

  // State untuk edit form
  const [editForm, setEditForm] = useState({
    status: "pending" as "pending" | "approved" | "rejected",
  });

  // State untuk toast
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
    type: "info",
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await adminService.getAllUsers();
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      showToast("Failed to load users", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({
      isVisible: true,
      message,
      type,
    });
  };

  const handleOpenEditModal = (user: ApiUser) => {
    setEditModal({ isOpen: true, user });
    setEditForm({
      status: (user.status || "pending") as "pending" | "approved" | "rejected",
    });
  };

  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, user: null });
  };

  const handleOpenDeleteModal = (user: ApiUser) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleUpdateUser = async () => {
    if (!editModal.user) return;

    setIsActionLoading(true);
    try {
      // Update status
      const statusResult = await adminService.updateUserStatus({
        userId: editModal.user.id,
        status: editForm.status,
      });

      if (statusResult.success) {
        showToast("User updated successfully", "success");
        handleCloseEditModal();
        fetchUsers(); // Refresh data
      } else {
        showToast(statusResult.message, "error");
      }
    } catch (error) {
      showToast("Failed to update user", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;

    setIsActionLoading(true);
    try {
      const result = await adminService.deleteUser(deleteModal.user.id);

      if (result.success) {
        showToast("User deleted successfully", "success");
        handleCloseDeleteModal();
        fetchUsers(); // Refresh data
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      showToast("Failed to delete user", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      user.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "approved":
        return "bg-green-50 border-green-200 text-green-700";
      case "rejected":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Users Management
          </h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Total {users.length} system users.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={fetchUsers}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-3 relative">
          <input
            type="text"
            placeholder="Search name/email..."
            value={searchQuery}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <select
          value={filterStatus}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3">User Information</th>
                <th className="hidden md:table-cell px-4 py-3 text-center">
                  Role
                </th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="hidden lg:table-cell px-4 py-3 text-center">
                  Join Date
                </th>
                <th className="px-4 py-3 text-right text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 truncate max-w-[140px] sm:max-w-none">
                          {user.full_name || "N/A"}
                        </span>
                        <span className="text-[11px] text-gray-500 truncate max-w-[140px] sm:max-w-none">
                          {user.email}
                        </span>
                        <span className="text-[11px] text-gray-500 truncate max-w-[140px] sm:max-w-none">
                          {user.phone}
                        </span>
                        <div className="flex gap-2 mt-1 md:hidden">
                          <span className="text-[10px] font-bold uppercase text-blue-600 tracking-tighter">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-4 text-gray-600 text-center">
                      <span>{user.role}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-4 py-4 text-gray-500 text-center">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                          title="Edit user"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(user)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                          title="Delete user"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-[11px] text-gray-500 font-medium">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 text-xs font-semibold border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 text-xs font-semibold border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={handleCloseEditModal}
        title="Edit User"
      >
        {editModal.user && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editModal.user.full_name || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editModal.user.email || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="email"
                value={editModal.user.role || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    status: e.target.value as
                      | "pending"
                      | "approved"
                      | "rejected",
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={handleCloseEditModal}
                disabled={isActionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleUpdateUser}
                isLoading={isActionLoading}
              >
                Update User
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        title="Delete User"
      >
        {deleteModal.user && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-red-800">
                    Warning: Permanent Action
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    This action cannot be undone. This will permanently delete
                    the user account.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this user?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <p className="text-sm font-semibold text-gray-900">
                  {deleteModal.user.full_name}
                </p>
                <p className="text-xs text-gray-600">
                  {deleteModal.user.email}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                fullWidth
                onClick={handleCloseDeleteModal}
                disabled={isActionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={handleDeleteUser}
                isLoading={isActionLoading}
              >
                Delete User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;
