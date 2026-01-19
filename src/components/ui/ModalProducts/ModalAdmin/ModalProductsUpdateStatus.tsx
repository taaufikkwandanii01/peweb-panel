"use client";
import React, { useState, useEffect } from "react";
import {
  FiX,
  FiCheck,
  FiAlertCircle,
  FiClock,
  FiExternalLink,
  FiUser,
  FiMail,
  FiCpu,
  FiPhone,
} from "react-icons/fi";
import { IconType } from "react-icons";
import Button from "../../Button";
import { ToastType } from "../../Toast";

// Type definition
export type ProductStatus = "pending" | "approved" | "rejected";

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
  status: ProductStatus;
  admin_notes: string | null;
  created_at?: string;
  updated_at?: string;
}

interface CardAdminProductStatusProps {
  isOpen: boolean;
  onClose: () => void;
  product: AdminProduct;
  onStatusUpdated: () => void;
  showToast: (message: string, type: ToastType) => void;
}

// Configuration for status UI
interface StatusConfig {
  label: string;
  icon: IconType;
  bgColor: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
}

const statusConfigs: Record<ProductStatus, StatusConfig> = {
  pending: {
    label: "Pending Review",
    icon: FiClock,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-500",
    textColor: "text-amber-700",
    accentColor: "bg-amber-500",
  },
  approved: {
    label: "Approve Product",
    icon: FiCheck,
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-700",
    accentColor: "bg-emerald-500",
  },
  rejected: {
    label: "Reject Product",
    icon: FiAlertCircle,
    bgColor: "bg-rose-50",
    borderColor: "border-rose-500",
    textColor: "text-rose-700",
    accentColor: "bg-rose-500",
  },
};

const CardAdminProductStatus: React.FC<CardAdminProductStatusProps> = ({
  isOpen,
  onClose,
  product,
  onStatusUpdated,
  showToast,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<ProductStatus>(product.status);
  const [adminNotes, setAdminNotes] = useState<string>(
    product.admin_notes || "",
  );

  useEffect(() => {
    setStatus(product.status);
    setAdminNotes(product.admin_notes || "");
  }, [product]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi: Jika reject, catatan harus diisi
    if (status === "rejected" && !adminNotes.trim()) {
      showToast("Mohon berikan alasan penolakan", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/products/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          status,
          admin_notes: adminNotes.trim() || null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showToast("Product status updated successfully", "success");
        onStatusUpdated();
        onClose();
      } else {
        showToast(result.error || "Failed to update status", "error");
      }
    } catch (err: unknown) {
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col transition-all scale-100 uppercase-none">
        {/* Header */}
        <div className="px-6 py-4 flex items-center bg-amber-50">
          <div>
            <h2 className="text-xl font-bold text-amber-900">Product Review</h2>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Product Info Section */}
              <div className="lg:col-span-7 space-y-6">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-2 shadow-sm border border-slate-200 hover:bg-white transition-all"
                  >
                    <FiExternalLink /> View Demo
                  </a>

                  <div className="absolute top-3 left-3 flex items-center gap-2 mb-2">
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {product.discount > 0 && (
                      <div className="bg-rose-500 text-white px-2 py-1.5 rounded-lg flex flex-col items-center">
                        <span className="text-[8px] font-bold leading-none uppercase">
                          Disc
                        </span>
                        <span className="text-xs font-black">
                          {product.discount}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 capitalize">
                    {product.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xl font-bold text-emerald-600">
                      {formatCurrency(
                        product.price -
                          (product.price * product.discount) / 100,
                      )}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs line-through text-slate-400">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-1">
                      Description
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <FiCpu className="text-slate-400" /> Tools / Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {product.tools.map((tool) => (
                        <span
                          key={tool}
                          className="bg-slate-100 text-slate-600 text-[11px] px-2.5 py-1 rounded-md border border-slate-200 capitalize"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Developer Contact Card */}
                <div className="p-4 bg-slate-50 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-200">
                      <FiUser size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        Developer
                      </p>
                      <p className="text-xs font-semibold truncate text-slate-700">
                        {product.developer_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-200">
                      <FiMail size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        Email Address
                      </p>
                      <p className="text-xs font-semibold truncate text-slate-700">
                        {product.developer_email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-200">
                      <FiPhone size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        Phone Number
                      </p>
                      {product.developer_phone ? (
                        <a
                          href={`https://wa.me/${product.developer_phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold truncate text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1"
                          title="Chat via WhatsApp"
                        >
                          +62 {product.developer_phone}
                        </a>
                      ) : (
                        <p className="text-xs font-semibold truncate text-slate-500">
                          -
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Control Section */}
              <div className="lg:col-span-5">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 sticky top-0">
                  <div className="space-y-3 mb-6">
                    {(Object.keys(statusConfigs) as ProductStatus[]).map(
                      (key) => {
                        const config = statusConfigs[key];
                        const Icon = config.icon;
                        const isSelected = status === key;

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setStatus(key)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              isSelected
                                ? `${config.borderColor} ${config.bgColor} shadow-sm`
                                : "border-white bg-white hover:border-slate-200"
                            }`}
                          >
                            <div
                              className={`p-2 rounded-lg ${isSelected ? `${config.accentColor} text-white` : "bg-slate-100 text-slate-400"}`}
                            >
                              <Icon size={18} />
                            </div>
                            <span
                              className={`text-sm font-bold flex-1 text-left ${isSelected ? config.textColor : "text-slate-500"}`}
                            >
                              {config.label}
                            </span>
                            {isSelected && (
                              <FiCheck className={config.textColor} />
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Internal Notes / Feedback
                      </label>
                      {status === "approved" && (
                        <span className="text-[10px] font-medium text-emerald-600 animate-pulse">
                          Quick Actions Available
                        </span>
                      )}
                    </div>

                    {status === "approved" && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[
                          "Produk sangat bagus, disetujui!",
                          "Siap dipublikasikan.",
                        ].map((msg) => (
                          <button
                            key={msg}
                            type="button"
                            onClick={() => setAdminNotes(msg)}
                            className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            + {msg}
                          </button>
                        ))}
                      </div>
                    )}

                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full p-4 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none bg-white min-h-[120px] transition-all"
                      placeholder={
                        status === "rejected"
                          ? "Jelaskan alasan penolakan agar developer bisa memperbaiki..."
                          : "Berikan catatan untuk developer..."
                      }
                    />

                    {status === "rejected" && !adminNotes.trim() && (
                      <p className="text-[10px] text-rose-500 font-medium">
                        * Mohon berikan alasan jika menolak produk.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="px-6 py-4 bg-amber-50 flex justify-end gap-3">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              size="md"
              type="submit"
              isLoading={isLoading}
              className="cursor-pointer"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardAdminProductStatus;
