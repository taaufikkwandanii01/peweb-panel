"use client";
import { Product } from "@/components/views/Developer/Products";
import React, { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import Button from "../../Button";

interface CardProductsDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onProductDeleted: () => void;
}

const CardProductsDelete: React.FC<CardProductsDeleteProps> = ({
  isOpen,
  onClose,
  product,
  onProductDeleted,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/developer/products/change-products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus produk");
      }

      onClose();
      onProductDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus produk");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 pb-6 p-5 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <FiAlertTriangle size={32} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900">Delete</h3>
            <p className="text-gray-600 mt-2 text-sm">
              Apakah Anda yakin ingin menghapus <b>{product.title}</b>?
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm text-left">
              {error}
            </div>
          )}

          <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-5 mb-8">
            <div className="grid grid-cols-2 gap-6 relative justify-items-center">
              {/* Divider Tengah */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden sm:block"></div>

              {/* Kategori */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Kategori
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-bold text-gray-700">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Status
                </span>
                <div className="flex justify-center">
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-lg border shadow-sm uppercase ${
                      product.status === "approved"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : product.status === "rejected"
                          ? "bg-rose-50 text-rose-600 border-rose-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleDelete}
              isLoading={isLoading}
              className="flex-1 cursor-pointer"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProductsDelete;
