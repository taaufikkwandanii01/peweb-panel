"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiExternalLink,
  FiCalendar,
  FiTag,
  FiDollarSign,
  FiPackage,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import { Product } from "./index";
import CardProductsUpdate from "@/components/ui/CardProducts/CardProductsUpdate";
import CardProductsDelete from "@/components/ui/CardProducts/CardProductsDelete";
import Button from "@/components/ui/Button";

const ProductDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchProductDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/developer/products");
      if (!response.ok) throw new Error("Gagal memuat data produk");

      const products = await response.json();
      const foundProduct = products.find((p: Product) => p.id === productId);

      if (!foundProduct) {
        throw new Error("Produk tidak ditemukan");
      }

      setProduct(foundProduct);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  const getFinalPrice = (p: number, d: number) => p - p * (d / 100);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold text-sm">
            <FiCheckCircle size={18} />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-sm">
            <FiXCircle size={18} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-bold text-sm">
            <FiClock size={18} />
            Pending
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FiPackage className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {error || "Produk tidak ditemukan"}
        </h2>
        <button
          onClick={() => router.push("/developer/products")}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <FiArrowLeft size={16} />
          Kembali ke Daftar Produk
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header dengan tombol Back */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => router.push("/developer/products")}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors w-fit"
        >
          <FiArrowLeft size={20} />
          <span className="font-semibold">Kembali ke Daftar Produk</span>
        </button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={fetchProductDetail}
          >
            Refresh
          </Button>

          <Button
            onClick={() => setIsUpdateOpen(true)}
            className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <FiEdit2 size={14} /> Edit
          </Button>
          <Button
            onClick={() => setIsDeleteOpen(true)}
            className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
          >
            {" "}
            <FiTrash2 size={14} /> Hapus
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Product Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all font-semibold text-sm"
              >
                <FiExternalLink size={16} />
                Lihat Preview
              </a>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
              Status Produk
            </h3>
            <div className="flex justify-center">
              {getStatusBadge(product.status)}
            </div>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="space-y-4">
              {/* Title & Category */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase">
                    {product.category}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {product.title}
                </h1>
              </div>

              {/* Price Section */}
              <div className="flex flex-col gap-2 py-4 border-t border-b border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-emerald-600">
                    {formatIDR(getFinalPrice(product.price, product.discount))}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-base font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-lg">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                {product.discount > 0 && (
                  <p className="text-sm text-gray-400 line-through font-medium">
                    Harga Normal: {formatIDR(product.price)}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                  Deskripsi
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Technical Details Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Detail Teknis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tools/Tech Stack */}
              <div className="col-span-full">
                <div className="flex items-center gap-2 mb-3">
                  <FiPackage className="text-indigo-600" size={18} />
                  <h4 className="text-sm font-semibold text-gray-700">
                    Tools & Tech Stack
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.tools.length > 0 ? (
                    product.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                      >
                        {tool}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">
                      Tidak ada tools yang ditentukan
                    </span>
                  )}
                </div>
              </div>

              {/* Created At */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiCalendar className="text-gray-500" size={16} />
                  <h4 className="text-sm font-semibold text-gray-700">
                    Tanggal Dibuat
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  {formatDate(product.created_at)}
                </p>
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiTag className="text-gray-500" size={16} />
                  <h4 className="text-sm font-semibold text-gray-700">
                    Kategori
                  </h4>
                </div>
                <p className="text-sm text-gray-600">{product.category}</p>
              </div>

              {/* Price */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiDollarSign className="text-gray-500" size={16} />
                  <h4 className="text-sm font-semibold text-gray-700">
                    Harga Normal
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  {formatIDR(product.price)}
                </p>
              </div>

              {/* Discount */}
              {product.discount > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiTag className="text-gray-500" size={16} />
                    <h4 className="text-sm font-semibold text-gray-700">
                      Diskon
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600">{product.discount}%</p>
                </div>
              )}
            </div>
          </div>

          {/* Developer Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Informasi Developer
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Nama
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {product.developer_name || "Unknown Developer"}
                </p>
              </div>
              {product.developer_phone && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                    Telepon
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {product.developer_phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CardProductsUpdate
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        product={product}
        onProductUpdated={() => {
          fetchProductDetail();
          setIsUpdateOpen(false);
        }}
      />
      <CardProductsDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        product={product}
        onProductDeleted={() => {
          router.push("/developer/products");
        }}
      />
    </div>
  );
};

export default ProductDetail;
