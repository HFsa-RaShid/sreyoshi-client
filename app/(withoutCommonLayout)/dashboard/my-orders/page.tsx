

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Loader2, Eye, Truck, ShoppingCart } from "lucide-react"; 

import { useUserData } from "@/hooks/useUserData";
import { useMyOrders } from "@/hooks/useGetOrderDetails";
import { useGetProductsForCustomer, useGetSingleProductForCustomer } from "@/hooks/useCustomerData"; 
import OrderDetailsPage from "./OrderDetailsPage";

type OrderFilter = "All" | "Packed" | "Shipped" | "Delivered" | "Cancelled" ;

// মঙ্গোডিবি অবজেক্ট আইডি ক্লিনার
const getSafeId = (productField: any): string => {
  if (!productField) return "";
  if (typeof productField === "string") return productField;
  if (typeof productField === "object") {
    if (productField.$oid) return productField.$oid;
    if (productField._id) {
      return typeof productField._id === "object" && productField._id.$oid 
        ? productField._id.$oid 
        : String(productField._id);
    }
  }
  return String(productField);
};

// 💡 ১. স্মার্ট ইমেজ কম্পোনেন্ট (১০০% রিঅ্যাক্ট কোয়েরি ও এক্সিওস ব্যাকড)
function IndividualProductImage({ itemField, allProducts }: { itemField: any; allProducts: any[] }) {
  const safeId = getSafeId(itemField?.product);
  
  // অল প্রোডাক্টস থেকে ম্যাপ করে productCode বের করা
  const matchedProduct = allProducts?.find((p: any) => getSafeId(p._id) === safeId);
  const queryKey = matchedProduct?.productCode || safeId;

  // আপনার কাস্টম হুক দিয়ে লাইভ ডেটা ফেচিং
  const { data: product, isLoading } = useGetSingleProductForCustomer(queryKey);

  let imgUrl = "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=80";
  if (product) {
    if (product.commonImages?.[0]) {
      imgUrl = product.commonImages[0];
    } else if (itemField?.shadeName && product.shades) {
      const matchedShade = product.shades.find(
        (s: any) => s.shadeName?.toLowerCase() === itemField.shadeName?.toLowerCase()
      );
      if (matchedShade?.shadeImage) imgUrl = matchedShade.shadeImage;
    }
  }

  if (isLoading) {
    return <div className="w-14 h-14 rounded-xl bg-gray-100 animate-pulse shrink-0" />;
  }

  return (
    <div className="w-14 h-14 relative rounded-xl border border-gray-100 bg-gray-50 overflow-hidden shadow-2xs shrink-0">
      <Image src={imgUrl} alt="product" fill className="object-cover" unoptimized={true} />
    </div>
  );
}

// 💡 ২. স্মার্ট টাইটেল কম্পোনেন্ট (১০০% রিঅ্যাক্ট কোয়েরি ও এক্সিওস ব্যাকড)
function OrderItemTitle({ orderItems, allProducts }: { orderItems: any[]; allProducts: any[] }) {
  const firstItem = orderItems[0];
  const safeId = getSafeId(firstItem?.product);
  
  const matchedProduct = allProducts?.find((p: any) => getSafeId(p._id) === safeId);
  const queryKey = matchedProduct?.productCode || safeId;

  const { data: product, isLoading } = useGetSingleProductForCustomer(queryKey);

  if (isLoading) {
    return <div className="h-5 w-40 bg-gray-100 animate-pulse rounded" />;
  }

  const title = product?.name || firstItem?.name || `Product (${firstItem?.shadeName || "Premium Item"})`;
  const displayTitle = orderItems.length > 1 ? `${title} and ${orderItems.length - 1} more` : title;

  return <p className="text-[16px] font-bold text-[#1E1E1E] truncate">{displayTitle}</p>;
}

export default function MyOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null); 
  const itemsPerPage = 5; 

  const { user: backendUser, isLoading: isUserLoading } = useUserData();
  const userId = getSafeId(backendUser?._id || backendUser?.id);
  const { orders: rawOrders = [], isLoading: isOrdersLoading } = useMyOrders();
  
  // 🎯 এখানে আপনার সব প্রোডাক্টের হুক কল করে নিচের চাইল্ডদের পাস করে দেওয়া হয়েছে
  const { data: allProducts = [], isLoading: isProductsLoading } = useGetProductsForCustomer();

  const isLoading = isUserLoading || isOrdersLoading || isProductsLoading;
  const filterOptions: OrderFilter[] = ["All", "Packed", "Shipped", "Delivered", "Cancelled"];

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Pending": case "Packed": case "Processing": return "bg-[#FFF9E6] text-[#D9A700] border-transparent";
      case "Shipped": case "Out for delivery": return "bg-[#EBF3FF] text-[#0066FF] border-transparent";
      case "Delivered": return "bg-[#EBF5EE] text-[#2D4A3E] border-transparent";
      case "Cancelled": case "Canceled": return "bg-[#FCE8E6] text-[#D93025] border-transparent";
      default: return "bg-gray-100 text-gray-600 border-transparent";
    }
  };

  if (activeOrderId) {
    const selectedOrder = rawOrders.find((o: any) => getSafeId(o._id) === activeOrderId);
    return <OrderDetailsPage orderData={selectedOrder} onBack={() => setActiveOrderId(null)} allProducts={allProducts} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 p-6">
        <Loader2 className="w-8 h-8 animate-spin text-[#4E612B]" />
        <p className="text-[13px] text-gray-400">Loading your secure dashboard...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center bg-white rounded-2xl p-6">
        <p className="text-[14px] font-medium text-gray-500">Please log in to view your orders.</p>
      </div>
    );
  }

  const sortedOrders = [...rawOrders].sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt?.$date || a.createdAt).getTime();
    const dateB = new Date(b.createdAt?.$date || b.createdAt).getTime();
    return dateB - dateA;
  });

  const filteredOrders = sortedOrders.filter((order: any) => {
    if (activeFilter === "All") return true;
    const status = order.orderStatus || "Pending";
    if (activeFilter === "Cancelled" && (status === "Cancelled" || status === "Canceled")) return true;
    if (activeFilter === "Packed" && ["pending", "packed", "shipped", "out for delivery"].includes(status.toLowerCase())) return true;
    return status.toLowerCase() === activeFilter.toLowerCase();
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen p-4 md:p-6 text-[#1E1E1E] font-sans">
      <div className="max-w-5xl mx-auto">
        {/* FILTER HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-sans font-bold text-[28px] text-[#0A1128] tracking-tight">My Orders</h1>
            <p className="text-[14px] text-gray-400 mt-0.5">{filteredOrders.length} total orders</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                className={`px-5 py-2 rounded-xl text-[14px] font-medium border cursor-pointer transition-all ${
                  activeFilter === filter ? "bg-[#4E612B] text-white border-[#4E612B]" : "bg-white text-[#555555] border-gray-200 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {currentOrders.length === 0 ? (
            <div className="text-center py-16 text-[14px] text-gray-400 border border-gray-100 rounded-2xl bg-white shadow-xs">
              No orders found matching this status.
            </div>
          ) : (
            currentOrders.map((order: any, idx: number) => {
              const items = order.orderItems || [];
              const rawDate = order.createdAt?.$date || order.createdAt;
              const orderDate = rawDate ? new Date(rawDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "12 Jun 2026";
              const currentStatus = order.orderStatus || "Processing";
              const orderStringId = getSafeId(order._id);

              return (
                <div key={orderStringId || idx} className="p-5 border border-gray-100 bg-white rounded-2xl flex flex-col gap-4 shadow-2xs">
                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-10 md:gap-14 text-[13px]">
                      <div>
                        <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Order ID</p>
                        <p className="font-bold text-[#1E1E1E] mt-1">
                          #{order.transactionId?.split("-")[1] || orderStringId.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Placed On</p>
                        <p className="font-medium text-[#555555] mt-1">{orderDate}</p>
                      </div>
                      <div>
                        <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Payment</p>
                        <p className="font-medium text-[#555555] mt-1">{order.paymentMethod || "COD"}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[12px] font-bold border capitalize ${getStatusBadgeStyle(currentStatus)}`}>
                      • {currentStatus}
                    </span>
                  </div>

                  {/* CARD BODY */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex items-center gap-2 shrink-0">
                        {items.slice(0, 2).map((item: any, i: number) => (
                          <IndividualProductImage key={i} itemField={item} allProducts={allProducts} />
                        ))}
                        {items.length > 2 && (
                          <div className="w-14 h-14 rounded-xl border border-gray-100 bg-[#F4F4F4] flex items-center justify-center">
                            <p className="text-[13px] font-bold text-[#555555]">+{items.length - 2}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <OrderItemTitle orderItems={items} allProducts={allProducts} />
                        <p className="text-[13px] text-gray-400 truncate flex items-center gap-1">
                          <span>📍</span> {order.shippingAddress?.address || "Dhaka, Bangladesh"}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-row sm:flex-col items-end justify-between sm:justify-center gap-4 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                      <div className="sm:text-right">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Total Amount</p>
                        <p className="text-[18px] font-extrabold text-[#1E1E1E] mt-0.5">৳{order.totalPrice || "0"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setActiveOrderId(orderStringId)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-bold text-[#555555] hover:bg-gray-50 cursor-pointer shadow-2xs bg-white">
                          <Eye size={15} /> Details
                        </button>
                        {["Pending", "Packed", "Shipped", "Out for delivery", "Processing"].includes(currentStatus) ? (
                          <button onClick={() => setActiveOrderId(orderStringId)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4E612B] text-[13px] font-bold text-white hover:bg-[#3d4d22] cursor-pointer shadow-sm">
                            <Truck size={15} /> Track Order
                          </button>
                        ) : (
                          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-bold text-[#4E612B] hover:bg-gray-50 cursor-pointer shadow-2xs bg-white">
                            <ShoppingCart size={14} /> Order Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-bold text-gray-500 disabled:opacity-40 bg-white cursor-pointer shadow-2xs">
              ← Previous
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-9 h-9 rounded-xl text-[13px] font-extrabold transition-all cursor-pointer ${currentPage === i + 1 ? "bg-[#4E612B] text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 shadow-2xs"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-bold text-gray-500 disabled:opacity-40 bg-white cursor-pointer shadow-2xs">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}