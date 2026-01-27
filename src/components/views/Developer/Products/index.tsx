"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FiSearch, FiPlus, FiRefreshCw, FiPackage } from "react-icons/fi";

// Import Modal Components
import CardProductsAdd from "@/components/ui/ModalProducts/ModalDeveloper/ModalProductsAdd";
import CardProductsDelete from "@/components/ui/ModalProducts/ModalDeveloper/ModaProductsDelete";
import CardProductsUpdate from "@/components/ui/ModalProducts/ModalDeveloper/ModalProductsUpdate";
import Button from "@/components/ui/Button";
import CardDeveloperProducts from "@/components/ui/CardProducts/CardDeveloperProducts";
import Toast, { ToastType } from "@/components/ui/Toast"; // TAMBAHAN: Import Toast

// Interface Product
export interface Product {
  id: string;
  title: string;
  category: "Website" | "Web App";
  price: number;
  discount: number;
  href: string;
  image: string;
  developer_name: string;
  developer_phone: string;
  description: string;
  tools: string[];
  status: "pending" | "approved" | "rejected";
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}

// TAMBAHAN: Toast State Interface
interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

const DeveloperProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // State untuk Modal & Data
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TAMBAHAN: State Toast
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
    type: "success",
  });

  // TAMBAHAN: Show Toast Function
  const showToast = (message: string, type: ToastType): void => {
    setToast({ isVisible: true, message, type });
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/developer/products");
      if (!response.ok) throw new Error("Gagal memuat data");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      showToast("Gagal memuat data products", "error"); // TAMBAHAN
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset page ke 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchStatus =
        selectedStatus === "all" || p.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Statistics
  const stats = useMemo(() => {
    return {
      total: products.length,
      pending: products.filter((p) => p.status === "pending").length,
      approved: products.filter((p) => p.status === "approved").length,
      rejected: products.filter((p) => p.status === "rejected").length,
    };
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Products Management
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProducts}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiRefreshCw
              className={isLoading ? "animate-spin" : ""}
              size={16}
            />
            {isLoading ? "Loading" : "Refresh"}
          </Button>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiPlus size={16} /> Add New Product
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Total
              </span>
              <FiPackage className="text-gray-400" size={18} />
            </div>
            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-700 uppercase">
                Pending
              </span>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            </div>
            <p className="text-2xl font-black text-amber-700">
              {stats.pending}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-green-700 uppercase">
                Approved
              </span>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <p className="text-2xl font-black text-green-700">
              {stats.approved}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-red-700 uppercase">
                Rejected
              </span>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
            <p className="text-2xl font-black text-red-700">{stats.rejected}</p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-5">
        <div className="md:col-span-2 lg:col-span-3 relative">
          <input
            type="text"
            placeholder="Search product by title..."
            value={searchTerm}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <select
          value={selectedCategory}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Semua Kategori</option>
          <option value="Website">Website</option>
          <option value="Web App">Web App</option>
        </select>

        <select
          value={selectedStatus}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Grid Cards Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-62 bg-gray-100 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white border border-dashed border-gray-300 rounded-2xl">
              <FiPackage className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">
                Produk tidak ditemukan
              </p>
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <CardDeveloperProducts
                key={product.id}
                product={product}
                onEdit={(p) => {
                  setSelectedProduct(p);
                  setIsUpdateOpen(true);
                }}
                onDelete={(p) => {
                  setSelectedProduct(p);
                  setIsDeleteOpen(true);
                }}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 px-1 flex items-center justify-between">
        <p className="text-[11px] text-gray-500 font-medium">
          Page {currentPage} of {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 shadow-sm transition-all"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 shadow-sm transition-all"
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals - PERBAIKAN: Tambahkan callback untuk show toast */}
      <CardProductsAdd
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onProductAdded={() => {
          fetchProducts();
          showToast("Product successfully added.", "success");
        }}
      />
      {selectedProduct && (
        <>
          <CardProductsUpdate
            isOpen={isUpdateOpen}
            onClose={() => setIsUpdateOpen(false)}
            product={selectedProduct}
            onProductUpdated={() => {
              fetchProducts();
              showToast("Product successfully updated.", "success");
            }}
          />
          <CardProductsDelete
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            product={selectedProduct}
            onProductDeleted={() => {
              fetchProducts();
              showToast("Product successfully deleted!", "success");
            }}
          />
        </>
      )}

      {/* TAMBAHAN: Toast Notification */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        />
      )}
    </div>
  );
};

export default DeveloperProducts;
