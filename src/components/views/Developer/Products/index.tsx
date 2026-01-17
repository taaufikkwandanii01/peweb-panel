"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiPackage,
  FiExternalLink,
  FiLayers,
  FiEye,
} from "react-icons/fi";
import Link from "next/link";

// Import Modal Components
import CardProductsAdd from "@/components/ui/ModalProducts/ModalDeveloper/ModalProductsAdd";
import CardProductsDelete from "@/components/ui/ModalProducts/ModalDeveloper/ModaProductsDelete";
import CardProductsUpdate from "@/components/ui/ModalProducts/ModalDeveloper/ModalProductsUpdate";
import Button from "@/components/ui/Button";
import CardDeveloperProducts from "@/components/ui/CardProducts/CardDeveloperProducts";

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
}

const DeveloperProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // State untuk Pagination (Mengikuti pola menu Users)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // State untuk Modal & Data
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/developer/products");
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
  }, [searchTerm, selectedCategory, selectedStatus]);

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

  // Pagination Logic (Sesuai dengan implementasi menu Users)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
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
            Total {products.length} system products.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={fetchProducts}
          >
            Refresh
          </Button>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {" "}
            <FiPlus size={16} /> Tambah Produk
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-5">
        <div className="md:col-span-2 lg:col-span-3 relative">
          <input
            type="text"
            placeholder="Cari nama produk..."
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white border border-dashed border-gray-300 rounded-2xl">
            <FiPackage className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Produk tidak ditemukan</p>
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

      {/* Pagination (Gaya visual identik dengan menu Users) */}
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

      {/* Modals */}
      <CardProductsAdd
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onProductAdded={fetchProducts}
      />
      {selectedProduct && (
        <>
          <CardProductsUpdate
            isOpen={isUpdateOpen}
            onClose={() => setIsUpdateOpen(false)}
            product={selectedProduct}
            onProductUpdated={fetchProducts}
          />
          <CardProductsDelete
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            product={selectedProduct}
            onProductDeleted={fetchProducts}
          />
        </>
      )}
    </div>
  );
};

export default DeveloperProducts;
