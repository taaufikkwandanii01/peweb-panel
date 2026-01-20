"use client";

import React from "react";
import {
  FiExternalLink,
  FiLayers,
  FiMessageSquare,
  FiAlertCircle,
} from "react-icons/fi";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Product } from "@/components/views/Developer/Products";

interface CardDeveloperProductsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const CardDeveloperProducts: React.FC<CardDeveloperProductsProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  const getFinalPrice = (p: number, d: number) => p - p * (d / 100);

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "rejected":
        return "bg-rose-50 border-rose-200 text-rose-700";
      default:
        return "bg-amber-50 border-amber-200 text-amber-700";
    }
  };

  // IMPROVED: Better admin notes detection
  const hasAdminNotes =
    product.admin_notes && product.admin_notes.trim().length > 0;
  const isRejected = product.status === "rejected";
  const isPending = product.status === "pending";
  const isApproved = product.status === "approved";

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail Section */}
      <div className="relative h-48 overflow-hidden bg-white">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-white/90 backdrop-blur-sm text-indigo-600 shadow-sm border border-indigo-100">
            {product.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border shadow-sm backdrop-blur-md ${getStatusStyle(product.status)}`}
          >
            {product.status}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {product.discount > 0 && (
            <div className="bg-rose-500 text-white px-2 py-1.5 rounded-lg flex flex-col items-center">
              <span className="text-[8px] font-bold leading-none uppercase">
                Disc
              </span>
              <span className="text-xs font-black">{product.discount}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors capitalize">
            {product.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-gray-400">
            <FiLayers className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium truncate italic capitalize">
              {product.tools.length > 0
                ? product.tools.join(", ")
                : "No tools specified"}
            </span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="relative overflow-hidden bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-3 relative z-10">
            <span className="text-xl font-black text-indigo-600 tracking-tight">
              {formatIDR(getFinalPrice(product.price, product.discount))}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-400 line-through decoration-rose-500/50">
                {formatIDR(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-auto space-y-2.5">
          <div className="flex gap-2">
            <Link
              href={`/developer/products/${product.id}`}
              className={`flex-[2] flex justify-center items-center py-2.5 rounded-xl transition-all shadow-lg uppercase tracking-wide ${
                isRejected
                  ? "bg-rose-600 hover:bg-rose-700 text-white border-rose-800 shadow-rose-100"
                  : isPending
                    ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-700 shadow-amber-100"
                    : isApproved
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700 shadow-emerald-100"
                      : "bg-gray-900 hover:bg-indigo-600 text-white border-gray-950 shadow-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[11px] font-black flex flex-col items-center leading-tight">
                  {hasAdminNotes ? "Show Details & Notes" : "Show Details"}
                  <span className="text-[8px] font-medium normal-case opacity-90 flex items-center gap-1 mt-0.5">
                    {isRejected && "Perlu Diperbaiki"}
                    {isPending && hasAdminNotes && "Ada Pesan"}
                    {isPending && !hasAdminNotes && "Menunggu Review"}
                    {isApproved && "Disetujui"}
                  </span>
                </span>
              </div>
            </Link>

            <button
              onClick={() => window.open(product.href, "_blank")}
              className="flex-1 flex justify-center items-center bg-white text-gray-400 hover:text-indigo-600 rounded-xl transition-all border border-gray-200 hover:border-indigo-200 cursor-pointer"
            >
              <FiExternalLink size={16} />
            </button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(product)}
              variant="primary"
              size="md"
              className="flex-1 py-2 text-[11px] font-bold rounded-xl cursor-pointer"
            >
              Update
            </Button>
            <Button
              onClick={() => onDelete(product)}
              variant="danger"
              size="md"
              className="flex-1 py-2 text-[11px] font-bold rounded-xl cursor-pointer"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDeveloperProducts;
