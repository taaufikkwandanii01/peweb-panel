"use client";

import React from "react";
import { FiEdit2, FiTrash2, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import { ApiUser } from "@/services/adminService";

interface CardAdminUsersProps {
  user: ApiUser;
  onEdit: (user: ApiUser) => void;
  onDelete: (user: ApiUser) => void;
}

const CardAdminUsers: React.FC<CardAdminUsersProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-gray-500 to-black rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user.full_name?.charAt(0).toUpperCase() || "?"}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
              {user.full_name || "Tanpa Nama"}
            </h3>
            <p className="font-bold text-gray-500 text-xs capitalize">
              {user.role}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Status"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus User"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-gray-50">
        <div className="flex justify-end items-center">
          <p
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
              user.status === "approved"
                ? "bg-green-50 text-green-700 border-green-100"
                : user.status === "rejected"
                  ? "bg-red-50 text-red-700 border-red-100"
                  : "bg-amber-50 text-amber-700 border-amber-100"
            }`}
          >
            {user.status}
          </p>
        </div>
        <div className="flex items-center text-xs text-gray-600 gap-2">
          <FiMail className="shrink-0 text-gray-400" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600 gap-2">
          <FiPhone className="shrink-0 text-gray-400" />
          {user.phone ? (
            <a
              href={`https://wa.me/${user.phone.replace(/^0/, "62").replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 flex items-center gap-1 transition-colors"
            >
              <span>+62 {user.phone.replace(/^0/, "")}</span>
            </a>
          ) : (
            <span>-</span>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-600 gap-2">
          <FiCalendar className="shrink-0 text-gray-400" />
          <span>
            Joined{" "}
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString("id-ID")
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardAdminUsers;
