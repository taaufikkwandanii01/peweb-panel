"use client";
import React, { useState } from "react";
import { FiX, FiSave } from "react-icons/fi";
import { Product } from "@/components/views/Developer/Products";

interface CardProductsAddProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (product: Product) => void;
}

const CardProductsAdd: React.FC<CardProductsAddProps> = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Website" as "Website" | "Web App",
    price: "",
    discount: "0",
    href: "",
    image: "",
    description: "",
    tools: "",
  });

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

      const response = await fetch("/api/developer/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        throw new Error(errorData.error || "Gagal menambahkan produk");
      }

      const data = await response.json();

      setFormData({
        title: "",
        category: "Website",
        price: "",
        discount: "0",
        href: "",
        image: "",
        description: "",
        tools: "",
      });

      onProductAdded(data.product);
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err instanceof Error ? err.message : "Gagal menambahkan produk");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-6 flex justify-between items-center bg-indigo-50">
          <h2 className="text-lg md:text-xl font-bold text-indigo-900">
            Tambah Produk
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(90vh-180px)]">
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
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Nama Produk..."
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
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="125000"
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
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="0"
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
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="https://example.com"
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
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="/images/Product/001.png"
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
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                rows={3}
                placeholder="Deskripsi produk..."
                required
              ></textarea>
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
              className="bg-indigo-600 text-white px-4 py-2 text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <FiSave size={16} /> Simpan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardProductsAdd;
