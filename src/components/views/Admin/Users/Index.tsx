"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Developer";
  status: "Pending" | "Approve" | "Rejected";
  phone: string;
  joinDate: string;
}

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [users] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "Pending",
      phone: "6281572565173",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Developer",
      status: "Approve",
      phone: "6281572565173",
      joinDate: "2024-02-20",
    },

    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      role: "Developer",
      status: "Approve",
      phone: "6281572565173",
      joinDate: "2024-03-05",
    },

    {
      id: 6,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "Admin",
      status: "Approve",
      phone: "6281572565173",
      joinDate: "2024-01-25",
    },
    {
      id: 7,
      name: "David Wilson",
      email: "david.wilson@example.com",
      role: "Developer",
      status: "Rejected",
      phone: "6281572565173",
      joinDate: "2024-02-15",
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(paginatedUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-green-100 text-green-700";
      case "Approve":
        return "bg-gray-100 text-gray-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-blue-100 text-blue-700";
      case "Developer":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header: Stacked on mobile, side-by-side on desktop */}
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
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            Export
          </Button>
          <Button variant="primary" size="sm" className="flex-1 sm:flex-none">
            + Add User
          </Button>
        </div>
      </div>

      {/* Filter Bar: Compact Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-5">
        <div className="md:col-span-2 lg:col-span-3 relative">
          <input
            type="text"
            placeholder="Search name/email..."
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
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Developer">Developer</option>
        </select>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Status</option>
          <option value="Approve">Approve</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Table Section: Truly Responsive */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3 w-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600"
                  />
                </th>
                <th className="px-4 py-3">User Information</th>
                <th className="hidden lg:table-cell px-4 py-3">Phone</th>
                <th className="hidden md:table-cell px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden lg:table-cell px-4 py-3">Join Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 truncate max-w-[140px] sm:max-w-none">
                        {user.name}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate max-w-[140px] sm:max-w-none">
                        {user.email}
                      </span>
                      {/* Info tambahan yang muncul HANYA di mobile */}
                      <div className="flex gap-2 mt-1 md:hidden">
                        <span className="text-[10px] font-bold uppercase text-blue-600 tracking-tighter">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-4 py-4 text-gray-500">
                    {user.phone}
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 text-gray-600">
                    {user.role}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        user.status === "Approve"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-orange-50 border-orange-200 text-orange-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-4 py-4 text-gray-500">
                    {user.joinDate}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors">
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
                      <button className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors">
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Simple Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-[11px] text-gray-500 font-medium">
            Page {currentPage} of {totalPages}
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
    </div>
  );
};

export default AdminUsers;
