"use client";

import React from "react";
import {
  FiEdit2,
  FiExternalLink,
  FiTag,
  FiUser,
  FiMail,
  FiPhone,
  FiLayers,
  FiCalendar,
} from "react-icons/fi";
import { AdminProduct } from "@/components/ui/ModalProducts/ModalAdmin/ModalProductsUpdateStatus";

interface CardAdminProductsProps {
  product: AdminProduct;
  onEdit: (product: AdminProduct) => void;
}

const CardAdminProducts: React.FC<CardAdminProductsProps> = ({
  product,
  onEdit,
}) => {
  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  const getFinalPrice = (p: number, d: number) => p - p * (d / 100);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header Section: Mengikuti gaya CardAdminUsers */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar Inisial Produk (Menggantikan image agar lebih clean di dashboard admin) */}
          <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-blue-500 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-semibold text-sm">
              {product.title?.charAt(0).toUpperCase() || "P"}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm capitalize line-clamp-1">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold capitalize text-gray-600">
                {product.category}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Update Status"
          >
            <FiEdit2 size={16} />
          </button>
          <a
            href={product.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            title="Lihat Demo"
          >
            <FiExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Pricing & Tools Section */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-indigo-600">
            {formatIDR(getFinalPrice(product.price, product.discount))}
          </span>
          {product.discount > 0 && (
            <span className="text-[10px] text-gray-400 line-through">
              {formatIDR(product.price)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {product.tools.slice(0, 3).map((tool, idx) => (
            <span
              key={idx}
              className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded capitalize"
            >
              {tool}
            </span>
          ))}
          {product.tools.length > 3 && (
            <span className="text-[9px] px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded">
              +{product.tools.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-600 gap-2">
          <FiCalendar className="shrink-0 text-gray-400" />
          <span>
            Created at{" "}
            {product.created_at
              ? new Date(product.created_at).toLocaleDateString("id-ID")
              : "-"}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-600 gap-2">
          <FiCalendar className="shrink-0 text-gray-400" />
          <span>
            Updated at{" "}
            {product.updated_at
              ? new Date(product.updated_at).toLocaleDateString("id-ID")
              : "-"}
          </span>
        </div>
        <div className="flex items-center justify-end">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
              product.status === "approved"
                ? "bg-green-50 text-green-700 border-green-100"
                : product.status === "rejected"
                  ? "bg-red-50 text-red-700 border-red-100"
                  : "bg-amber-50 text-amber-700 border-amber-100"
            }`}
          >
            {product.status}
          </span>
        </div>
      </div>

      {/* Developer Info Section: Konsisten dengan CardAdminUsers */}
      <div className="space-y-2 pt-3 border-t border-gray-50">
        <div className="flex items-center text-xs text-gray-600 gap-2">
          <FiUser className="shrink-0 text-gray-400" size={14} />
          <span className="font-semibold truncate capitalize">
            {product.developer_name}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-600 gap-2">
          <FiMail className="shrink-0 text-gray-400" size={14} />
          <span className="truncate">{product.developer_email}</span>
        </div>
        {product.developer_phone && (
          <div className="flex items-center text-xs text-gray-600 gap-2">
            <FiPhone className="shrink-0 text-gray-400" size={14} />
            <a
              href={`https://wa.me/${product.developer_phone.replace(/^0/, "62").replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 flex items-center gap-1 transition-colors"
            >
              <span>{product.developer_phone}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardAdminProducts;
