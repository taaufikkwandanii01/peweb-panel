"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FiSearch, FiRefreshCw, FiPackage } from "react-icons/fi";

// Import Modal & Card Component
import CardAdminProductStatus from "@/components/ui/ModalProducts/ModalAdmin/ModalProductsUpdateStatus";
import { AdminProduct } from "@/components/ui/ModalProducts/ModalAdmin/ModalProductsUpdateStatus";
import CardAdminProducts from "@/components/ui/CardProducts/CardAdminProducts";
import Button from "@/components/ui/Button";
import Toast, { ToastType } from "@/components/ui/Toast";

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

const AdminProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("all");

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // State untuk Modal & Data
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Toast
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType): void => {
    setToast({ isVisible: true, message, type });
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) throw new Error("Gagal memuat data");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
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
  }, [searchTerm, selectedCategory, selectedStatus, selectedDeveloper]);

  // Get unique developers
  const developers = useMemo(() => {
    const uniqueDevs = Array.from(
      new Set(products.map((p) => p.developer_name)),
    );
    return uniqueDevs.sort();
  }, [products]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.developer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.developer_email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchStatus =
        selectedStatus === "all" || p.status === selectedStatus;
      const matchDeveloper =
        selectedDeveloper === "all" || p.developer_name === selectedDeveloper;
      return matchSearch && matchCategory && matchStatus && matchDeveloper;
    });
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedStatus,
    selectedDeveloper,
  ]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: products.length,
      pending: products.filter((p) => p.status === "pending").length,
      approved: products.filter((p) => p.status === "approved").length,
      rejected: products.filter((p) => p.status === "rejected").length,
    };
  }, [products]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Products Management
          </h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Kelola dan review products dari developer
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center gap-2"
          onClick={fetchProducts}
          disabled={isLoading}
        >
          <FiRefreshCw className={isLoading ? "animate-spin" : ""} size={16} />
          {isLoading ? "Loading" : "Refresh"}
        </Button>
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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2 relative">
          <input
            type="text"
            placeholder="Search product by name or developer..."
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

        <select
          value={selectedDeveloper}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
          onChange={(e) => setSelectedDeveloper(e.target.value)}
        >
          <option value="all">Semua Developer</option>
          {developers.map((dev) => (
            <option key={dev} value={dev}>
              {dev}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedProducts.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white border border-dashed border-gray-300 rounded-2xl">
              <FiPackage className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">
                Produk tidak ditemukan
              </p>
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <CardAdminProducts
                key={product.id}
                product={product}
                onEdit={(p) => {
                  setSelectedProduct(p);
                  setIsUpdateStatusOpen(true);
                }}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {paginatedProducts.length > 0 && (
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
      )}

      {/* Modal */}
      {selectedProduct && (
        <CardAdminProductStatus
          isOpen={isUpdateStatusOpen}
          onClose={() => setIsUpdateStatusOpen(false)}
          product={selectedProduct}
          onStatusUpdated={fetchProducts}
          showToast={showToast}
        />
      )}

      {/* Toast Notification */}
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

export default AdminProducts;
