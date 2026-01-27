"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiExternalLink,
  FiTag,
  FiPackage,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiMessageSquare,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
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

  // IMPROVED: Better status badge dengan icon
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-sm">
            <FiCheckCircle size={16} />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg font-bold text-sm">
            <FiAlertTriangle size={16} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg font-bold text-sm">
            <FiClock size={16} />
            Pending Review
          </span>
        );
    }
  };

  const hasAdminNotes =
    product?.admin_notes && product.admin_notes.trim().length > 0;
  const isRejected = product?.status === "rejected";

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
            className="flex items-center justify-center gap-2 cursor-pointer"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 animate-pulse rounded-xl"
              />
            ))}
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
          </div>
        </div>
      ) : error || !product ? (
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div className="relative h-64 overflow-hidden bg-white">
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
                {product.discount > 0 && (
                  <div className="absolute top-3 right-3 bg-rose-500 text-white px-2 py-1.5 rounded-lg flex flex-col items-center">
                    <span className="text-[8px] font-bold leading-none uppercase">
                      Disc
                    </span>
                    <span className="text-xs font-black">
                      {product.discount}%
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all font-semibold text-sm"
                >
                  <FiExternalLink size={16} />
                  Live Preview
                </a>
              </div>
            </div>

            {/* IMPROVED: Status & Notes Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <FiTag size={16} />
                    Status
                  </h3>
                </div>
                <div className="flex justify-center">
                  {getStatusBadge(product.status)}
                </div>
              </div>

              {/* IMPROVED: Admin Notes dengan Alert Style */}
              {hasAdminNotes && (
                <div
                  className={`border-t p-0 ${
                    isRejected
                      ? "bg-rose-50/50 border-rose-100"
                      : "bg-blue-50/50 border-blue-100"
                  }`}
                >
                  <div
                    className={`p-4 ${
                      isRejected
                        ? "bg-rose-50 border-rose-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-bold mb-1 ${
                            isRejected ? "text-rose-900" : "text-blue-900"
                          }`}
                        >
                          {isRejected ? "Perlu Diperbaiki" : "Pesan dari Admin"}
                        </h4>
                        <p
                          className={`text-sm leading-relaxed ${
                            isRejected ? "text-rose-700" : "text-blue-700"
                          }`}
                        >
                          {product.admin_notes}
                        </p>
                      </div>
                    </div>
                    {isRejected && (
                      <div className="mt-4 pt-4 border-t border-rose-200">
                        <p className="text-xs text-rose-600 font-medium">
                          Silakan update produk Anda sesuai catatan di atas,
                          lalu submit kembali untuk review *
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!hasAdminNotes && (
                <div className="border-t bg-gray-50/50 border-gray-100 p-6">
                  <div className="flex flex-col items-center py-4 opacity-60">
                    <FiMessageSquare className="text-gray-300 mb-2" size={24} />
                    <p className="text-gray-400 text-sm italic text-center">
                      Belum ada catatan dari admin
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
                    {product.title}
                  </h1>
                </div>

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

                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

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

      {/* Modals */}
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
