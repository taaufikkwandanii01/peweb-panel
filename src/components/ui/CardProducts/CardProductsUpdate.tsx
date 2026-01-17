"use client";
import { Product } from "@/components/views/Developer/Products";
import React, { useState, useEffect, useRef } from "react";
import { FiX, FiRefreshCw, FiUpload } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

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
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setImagePreview(product.image);
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Update preview if image URL is manually entered
    if (name === "image") {
      setImagePreview(value);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error("Gagal upload gambar: " + uploadError.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Update form data and preview
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      setImagePreview(imageUrl);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err instanceof Error ? err.message : "Gagal upload gambar");
    } finally {
      setIsUploading(false);
    }
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
      onClose();
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

            {/* Image Upload Section */}
            <div className="col-span-full space-y-2">
              <label className="text-xs md:text-sm font-semibold text-gray-700">
                Product Image <span className="text-red-500">*</span>
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setFormData((prev) => ({ ...prev, image: "" }));
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                    <span className="text-sm font-medium">Uploading...</span>
                  </>
                ) : (
                  <>
                    <FiUpload size={20} />
                    <span className="text-sm font-medium">
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </span>
                  </>
                )}
              </button>

              {/* Manual URL Input */}
              <div className="text-center text-xs text-gray-500">atau</div>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2 md:p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Atau masukkan URL gambar..."
                required
              />
              <p className="text-xs text-gray-500">
                Max 5MB. Format: JPG, PNG, GIF, WebP
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
              disabled={isLoading || isUploading}
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
