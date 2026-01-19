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
  FiMessageSquare,
} from "react-icons/fi";
import { Product } from "./index";
import CardProductsUpdate from "@/components/ui/ModalProducts/ModalDeveloper/ModalProductsUpdate";
import CardProductsDelete from "@/components/ui/ModalProducts/ModalDeveloper/ModaProductsDelete";
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
        return <span className="text-green-700">Approved</span>;
      case "rejected":
        return <span className="text-red-700">Rejected</span>;
      default:
        return <span className="text-amber-700">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header dengan tombol Back */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => router.push("/developer/products")}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors w-fit cursor-pointer"
        >
          <FiArrowLeft size={20} />
          <span className="font-semibold">Back To Products List</span>
        </button>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProductDetail}
            disabled={isLoading}
            className="flex-1 items-center justify-center gap-2 cursor-pointer"
          >
            <FiRefreshCw
              className={isLoading ? "animate-spin" : ""}
              size={16}
            />
            {isLoading ? "Loading" : "Refresh"}
          </Button>

          <Button
            onClick={() => setIsUpdateOpen(true)}
            disabled={!product}
            className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiEdit2 size={14} />
          </Button>
          <Button
            onClick={() => setIsDeleteOpen(true)}
            disabled={!product}
            className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiTrash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Main Content - Conditional Rendering */}
      {isLoading ? (
        // LOADING STATE - Skeleton
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 animate-pulse rounded-xl"
              />
            ))}
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
          </div>
        </div>
      ) : error || !product ? (
        // ERROR STATE - Product tidak ditemukan
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <FiPackage className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {error || "Produk tidak ditemukan"}
          </h2>
          <button
            onClick={() => router.push("/developer/products")}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FiArrowLeft size={16} />
            Back To Products List
          </button>
        </div>
      ) : (
        // SUCCESS STATE - Tampilkan Product Detail
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div className="relative overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase">
                    {product.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  {product.discount > 0 && (
                    <div className="bg-rose-500 text-white px-2 py-1.5 rounded-lg flex flex-col items-center">
                      <span className="text-[8px] font-bold leading-none uppercase">
                        Disc
                      </span>
                      <span className="text-xs font-black">
                        {product.discount}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all font-semibold text-sm"
                >
                  <FiExternalLink size={16} />
                  Preview
                </a>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header Section - Status */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-1">
                    <FiTag className="text-blue-500" size={16} />
                    Status Products {getStatusBadge(product.status)}
                  </h3>
                  {/* Dot indikator kecil */}
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </div>
              </div>

              {/* Admin Notes Section */}
              <div className="bg-gray-50/50 border-t border-gray-100 p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FiMessageSquare className="text-gray-400" size={16} />
                  Notes
                </h3>

                {product.admin_notes ? (
                  <div className="relative">
                    {/* Quote Icon Background */}
                    <div className="absolute right-2 top-2 opacity-5 text-gray-900">
                      <FiMessageSquare size={40} />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed relative z-10 font-medium">
                      {product.admin_notes}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2 opacity-60">
                    <p className="text-gray-400 text-sm italic">
                      No additional instructions
                    </p>
                  </div>
                )}
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
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
                    {product.title}
                  </h1>
                </div>

                {/* Price Section */}
                <div className="flex flex-row items-center gap-2 py-4 border-t border-b border-gray-100">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-indigo-600">
                      {formatIDR(
                        getFinalPrice(product.price, product.discount),
                      )}
                    </span>
                  </div>
                  {product.discount > 0 && (
                    <p className="text-sm text-gray-400 line-through decoration-rose-500/50 font-medium">
                      {formatIDR(product.price)}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Tools/Tech Stack */}
                <div className="col-span-full">
                  <div className="flex items-center mb-3">
                    <h4 className="text-sm font-bold text-gray-500">
                      Tools & Tech Stack
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.tools.length > 0 ? (
                      product.tools.map((tool, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium capitalize"
                        >
                          {tool}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">
                        Tools not specified
                      </span>
                    )}
                  </div>
                </div>

                {/* Created At */}
                <div>
                  <div className="flex items-center mb-2">
                    <h4 className="text-sm font-bold text-gray-500">
                      Created At
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(product.created_at)}
                  </p>
                </div>

                {/* Updated At */}
                <div>
                  <div className="flex items-center mb-2">
                    <h4 className="text-sm font-bold text-gray-500">
                      Updated At
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(product.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals - Hanya render jika product ada */}
      {product && (
        <>
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
        </>
      )}
    </div>
  );
};

export default ProductDetail;
