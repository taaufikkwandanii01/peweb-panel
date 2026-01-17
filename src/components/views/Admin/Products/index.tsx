"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiPackage,
  FiExternalLink,
  FiEdit2,
  FiEye,
} from "react-icons/fi";

// Import Modal Component
import CardAdminProductStatus from "@/components/ui/ModalProducts/ModalAdmin/ModalProductsUpdateStatus";
import { AdminProduct } from "@/components/ui/ModalProducts/ModalAdmin/ModalProductsUpdateStatus";

const AdminProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("all");

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State untuk Modal & Data
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Helper Formatting
  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  const getFinalPrice = (p: number, d: number) => p - p * (d / 100);

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-50 border-green-200 text-green-700";
      case "rejected":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-amber-50 border-amber-200 text-amber-700";
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border shadow-sm ${getStatusStyle(
          status,
        )}`}
      >
        {status}
      </span>
    );
  };

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

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
        <button
          onClick={fetchProducts}
          className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Statistics Cards */}
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
          <p className="text-2xl font-black text-amber-700">{stats.pending}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-green-700 uppercase">
              Approved
            </span>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-2xl font-black text-green-700">{stats.approved}</p>
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

      {/* Filter Bar */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2 relative">
          <input
            type="text"
            placeholder="Cari produk atau developer..."
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

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Developer
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <FiPackage className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      Produk tidak ditemukan
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Column */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {product.tools.slice(0, 2).join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Developer Column */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {product.developer_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {product.developer_email}
                        </p>
                        {product.developer_phone && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {product.developer_phone}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {product.category}
                      </span>
                    </td>

                    {/* Price Column */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-black text-emerald-600">
                          {formatIDR(
                            getFinalPrice(product.price, product.discount),
                          )}
                        </p>
                        {product.discount > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <p className="text-xs text-gray-400 line-through">
                              {formatIDR(product.price)}
                            </p>
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                              -{product.discount}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="px-4 py-4 text-center">
                      {getStatusBadge(product.status)}
                    </td>

                    {/* Actions Column */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => window.open(product.href, "_blank")}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Preview"
                        >
                          <FiExternalLink size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsUpdateStatusOpen(true);
                          }}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Update Status"
                        >
                          <FiEdit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer - Pagination */}
        {paginatedProducts.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-600 font-medium">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} products
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 shadow-sm transition-all"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-xs font-medium text-gray-700 px-2">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 shadow-sm transition-all"
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <CardAdminProductStatus
          isOpen={isUpdateStatusOpen}
          onClose={() => setIsUpdateStatusOpen(false)}
          product={selectedProduct}
          onStatusUpdated={fetchProducts}
        />
      )}
    </div>
  );
};

export default AdminProducts;
