"use client";
import React, { useState, useRef } from "react";
import { FiX, FiSave, FiUpload } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
// Import komponen UI Anda
import Button from "../../Button";
import Input from "../../Input";

interface CardProductsAddProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

const CardProductsAdd: React.FC<CardProductsAddProps> = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Website" as "Website" | "Web App",
    price: "", // Diubah menjadi kosong agar user mengisi sendiri
    discount: "0",
    href: "",
    image: "",
    description: "",
    tools: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    // Logika otomatis harga berdasarkan kategori di sini telah dihapus
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError)
        throw new Error("Gagal upload gambar: " + uploadError.message);

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      setImagePreview(imageUrl);
    } catch (err) {
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

      const response = await fetch("/api/developer/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discount: parseInt(formData.discount) || 0,
          tools: toolsArray,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menambahkan produk");
      }

      // Reset form ke kondisi awal
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
      setImagePreview("");
      onProductAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambahkan produk");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
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
          {/* Menampilkan error jika ada */}
          {error && (
            <div className="mx-4 mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="col-span-full">
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nama Produk..."
                required
                fullWidth
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                required
              >
                <option value="Website">Website</option>
                <option value="Web App">Web App</option>
              </select>
            </div>

            <Input
              label="Price (IDR)"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Contoh: 150000"
              min="0"
              required
              fullWidth
            />

            <Input
              label="Discount (%)"
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="100"
              fullWidth
            />

            <Input
              label="URL/Link"
              type="url"
              name="href"
              value={formData.href}
              onChange={handleChange}
              placeholder="https://example.com"
              required
              fullWidth
            />

            <div className="col-span-full space-y-2">
              <label className="text-xs md:text-sm font-semibold text-gray-700">
                Product Image <span className="text-red-500">*</span>
              </label>

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
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
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
              <p className="text-xs text-gray-500">Max 5MB. Format: JPG, PNG</p>
            </div>

            <div className="col-span-full">
              <Input
                label="Tools/Tech Stack"
                name="tools"
                value={formData.tools}
                onChange={handleChange}
                placeholder="React.js, Tailwind CSS, Next.js"
                helperText="Pisahkan dengan koma untuk multiple tools"
                fullWidth
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                rows={3}
                placeholder="Deskripsi produk..."
                required
              />
            </div>
          </div>

          <div className="p-4 md:p-6 bg-gray-50 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>

            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isLoading}
              disabled={isUploading}
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardProductsAdd;
