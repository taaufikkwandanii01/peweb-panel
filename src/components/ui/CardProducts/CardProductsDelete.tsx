"use client";
import { Product } from "@/components/views/Developer/Products";
import React, { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import Button from "../Button";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus produk");
      }

      // Close modal first
      onClose();

      // Call the callback to refresh products list
      onProductDeleted();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err instanceof Error ? err.message : "Gagal menghapus produk");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        {/* Header dengan close button */}
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-2 text-center space-y-4">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <FiAlertTriangle size={28} className="md:w-8 md:h-8" />
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Hapus Produk?
            </h3>
            <p className="text-gray-600 mt-2 text-xs md:text-sm px-2">
              Apakah Anda yakin ingin menghapus <b>{product.title}</b>? Tindakan
              ini tidak dapat dibatalkan.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm text-left">
              {error}
            </div>
          )}

          {/* Product details */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-4 text-left">
            <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
              <div className="text-gray-600 font-medium">Kategori:</div>
              <div className="font-semibold text-gray-900">
                {product.category}
              </div>

              <div className="text-gray-600 font-medium">Status:</div>
              <div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    product.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : product.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {product.status}
                </span>
              </div>

              {product.tools.length > 0 && (
                <>
                  <div className="text-gray-600 font-medium">Tools:</div>
                  <div className="text-gray-900 text-xs">
                    {product.tools.slice(0, 2).join(", ")}
                    {product.tools.length > 2 && "..."}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menghapus...
                </div>
              ) : (
                "Hapus Sekarang"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProductsDelete;
