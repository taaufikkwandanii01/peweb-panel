"use client";
import { Product } from "@/components/views/Developer/Products";
import React, { useState, useEffect } from "react";
import { FiX, FiRefreshCw } from "react-icons/fi";

interface CardProductsUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onProductUpdated: (product: Product) => void;
}

const CardProductsUpdate: React.FC<CardProductsUpdateProps> = ({
  isOpen,
  onClose,
  product,
  onProductUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: product.title,
    category: product.category,
    price: product.price.toString(),
    discount: product.discount.toString(),
    href: product.href,
    image: product.image,
    description: product.description,
    tools: product.tools.join(", "),
  });

  useEffect(() => {
    setFormData({
      title: product.title,
      category: product.category,
      price: product.price.toString(),
      discount: product.discount.toString(),
      href: product.href,
      image: product.image,
      description: product.description,
      tools: product.tools.join(", "),
    });
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (
        !formData.title ||
        !formData.price ||
        !formData.href ||
        !formData.image ||
        !formData.description
      ) {
        throw new Error("Harap isi semua field yang wajib");
      }

      const toolsArray = formData.tools
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      const response = await fetch("/api/developer/products/change-products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
          title: formData.title,
          category: formData.category,
          price: parseFloat(formData.price),
          discount: parseInt(formData.discount) || 0,
          href: formData.href,
          image: formData.image,
          description: formData.description,
          tools: toolsArray,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengupdate produk");
      }

      const data = await response.json();
      onProductUpdated(data.product);
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err instanceof Error ? err.message : "Gagal mengupdate produk");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-6 flex justify-between items-center bg-amber-50">
          <div className="min-w-0 flex-1 mr-2">
            <h2 className="text-lg md:text-xl font-bold text-amber-900 truncate">
              Update Produk
            </h2>
            <p className="text-xs md:text-sm text-amber-700 truncate">
              {product.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-100 rounded-full transition-colors flex-shrink-0"
            disabled={isLoading}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(90vh-220px)]">
            {error && (
              <div className="col-span-full bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm">
                {error}
              </div>
            )}

            <div className="col-span-full space-y-1">
              <label className="text-xs md:text-sm font-semibold text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs md:text-sm font-semibold text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                required
              >
                <option value="Website">Website</option>
                <option value="Web App">Web App</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs md:text-sm font-semibold text-gray-700">
                Price (IDR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                min="0"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs md:text-sm font-semibold text-gray-700">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs md:text-sm font-semibold text-gray-700">
                URL/Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="href"
                value={formData.href}
                onChange={handleChange}
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="col-span-full space-y-1">
              <label className="text-xs md:text-sm font-semibold text-gray-700">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                required
              />
              <p className="text-xs text-gray-500">
                Masukkan path gambar atau URL lengkap
              </p>
            </div>

            <div className="col-span-full space-y-1">
              <label className="text-xs md:text-sm font-semibold text-gray-700">
                Tools/Tech Stack
              </label>
              <input
                type="text"
                name="tools"
                value={formData.tools}
                onChange={handleChange}
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="React.js, Tailwind CSS, Next.js"
              />
              <p className="text-xs text-gray-500">
                Pisahkan dengan koma untuk multiple tools
              </p>
            </div>

            <div className="col-span-full space-y-1">
              <label className="text-xs md:text-sm font-semibold text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                rows={3}
                required
              ></textarea>
            </div>

            <div className="col-span-full bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs md:text-sm text-amber-800">
                    <strong>Status saat ini:</strong>{" "}
                    <span className="uppercase font-bold">{product.status}</span>
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Setelah update, status akan kembali ke &quot;pending&quot;
                    untuk review admin
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 bg-gray-50 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-amber-500 text-white px-4 py-2 text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Mengupdate...
                </>
              ) : (
                <>
                  <FiRefreshCw size={16} /> Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardProductsUpdate;
