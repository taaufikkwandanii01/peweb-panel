"use client";
import React, { useState, useEffect } from "react";
import { FiX, FiCheck, FiAlertCircle } from "react-icons/fi";

export interface AdminProduct {
  id: string;
  title: string;
  category: "Website" | "Web App";
  price: number;
  discount: number;
  href: string;
  image: string;
  developer_name: string;
  developer_phone: string;
  developer_email: string;
  developer_id: string;
  description: string;
  tools: string[];
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at?: string;
  updated_at?: string;
}

interface CardAdminProductStatusProps {
  isOpen: boolean;
  onClose: () => void;
  product: AdminProduct;
  onStatusUpdated: () => void;
}

const CardAdminProductStatus: React.FC<CardAdminProductStatusProps> = ({
  isOpen,
  onClose,
  product,
  onStatusUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    product.status,
  );
  const [adminNotes, setAdminNotes] = useState(product.admin_notes || "");

  useEffect(() => {
    setStatus(product.status);
    setAdminNotes(product.admin_notes || "");
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/products/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
          status,
          admin_notes: adminNotes.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengupdate status");
      }

      onClose();
      onStatusUpdated();
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err instanceof Error ? err.message : "Gagal mengupdate status");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (s: string) => {
    switch (s) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-amber-500";
    }
  };

  const getStatusBadgeStyle = (s: string) => {
    switch (s) {
      case "approved":
        return "bg-green-50 border-green-200 text-green-700";
      case "rejected":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-amber-50 border-amber-200 text-amber-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-6 flex justify-between items-start bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
          <div className="flex-1 min-w-0 mr-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
              Update Status Produk
            </h2>
            <p className="text-sm text-gray-600 truncate">{product.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors flex-shrink-0"
            disabled={isLoading}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="p-4 md:p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-200px)]">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <FiAlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Product Preview */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex gap-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase">
                      {product.category}
                    </span>
                    <span
                      className={`text-xs font-bold uppercase px-2 py-1 rounded border ${getStatusBadgeStyle(
                        product.status,
                      )}`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base md:text-lg line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                  <div className="space-y-1 text-xs md:text-sm text-gray-600">
                    <p>
                      <strong>Developer:</strong> {product.developer_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {product.developer_email}
                    </p>
                    {product.developer_phone && (
                      <p>
                        <strong>Phone:</strong> {product.developer_phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Deskripsi:
                </p>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Tools */}
              {product.tools.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Tech Stack:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="mt-3 flex items-center gap-3">
                <p className="text-sm text-gray-700 font-medium">Harga:</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-emerald-600">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(
                      product.price - product.price * (product.discount / 100),
                    )}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-xs line-through text-gray-400">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </span>
                      <span className="text-xs font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                        -{product.discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Link */}
              <div className="mt-3">
                <p className="text-sm text-gray-700 font-medium mb-1">Link:</p>
                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {product.href}
                </a>
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FiCheck size={16} />
                Status Produk <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("pending")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    status === "pending"
                      ? "border-amber-500 bg-amber-50 text-amber-700 font-bold"
                      : "border-gray-200 hover:border-amber-300 text-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${status === "pending" ? "bg-amber-500" : "bg-gray-300"}`}
                    ></div>
                    <span className="text-xs md:text-sm font-semibold">
                      Pending
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("approved")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    status === "approved"
                      ? "border-green-500 bg-green-50 text-green-700 font-bold"
                      : "border-gray-200 hover:border-green-300 text-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${status === "approved" ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span className="text-xs md:text-sm font-semibold">
                      Approved
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("rejected")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    status === "rejected"
                      ? "border-red-500 bg-red-50 text-red-700 font-bold"
                      : "border-gray-200 hover:border-red-300 text-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${status === "rejected" ? "bg-red-500" : "bg-gray-300"}`}
                    ></div>
                    <span className="text-xs md:text-sm font-semibold">
                      Rejected
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Catatan Admin
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                rows={4}
                placeholder="Tambahkan catatan untuk developer (opsional)..."
              ></textarea>
              <p className="text-xs text-gray-500">
                Catatan ini akan terlihat oleh developer sebagai feedback untuk
                produk mereka.
              </p>
            </div>

            {/* Current Admin Notes (if exists) */}
            {product.admin_notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-bold text-blue-900 mb-2">
                  Catatan Admin Sebelumnya:
                </p>
                <p className="text-sm text-blue-800">{product.admin_notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 bg-gray-50 border-t flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <FiCheck size={16} /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardAdminProductStatus;
