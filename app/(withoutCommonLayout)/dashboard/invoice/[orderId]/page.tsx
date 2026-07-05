/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useMyOrders } from "@/hooks/useGetOrderDetails";
import { useGetProductsForCustomer } from "@/hooks/useCustomerData";
import { Loader2, Printer, ArrowLeft } from "lucide-react";

export default function DashboardDirectInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const { orders = [], isLoading: isOrdersLoading } = useMyOrders();
  const { data: allProducts = [], isLoading: isProductsLoading } = useGetProductsForCustomer();

  const isLoading = isOrdersLoading || isProductsLoading;

  const orderData = orders.find((o: any) => {
    const id = o._id?.$oid || o._id;
    return String(id) === orderId;
  });

  // 📥 ব্রাউজারের নিজস্ব প্রিন্ট অপশন ট্রিগার
  const handleDownloadPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[350px] md:min-h-[450px] flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 p-4">
        <Loader2 className="w-7 h-7 animate-spin text-[#4E612B]" />
        <p className="text-[12px] md:text-[13px] text-gray-400">Loading invoice framework...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="p-6 md:p-8 text-center bg-white rounded-2xl border border-gray-100">
        <p className="text-[14px] md:text-[15px] font-bold text-rose-500">Invoice parameters missing or invalid.</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-gray-100 rounded-xl text-[12px] md:text-[13px] font-bold cursor-pointer">
          Go Back
        </button>
      </div>
    );
  }

  const items = orderData.orderItems || [];
  const rawDate = orderData.createdAt?.$date || orderData.createdAt;
  const orderDate = rawDate ? new Date(rawDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "12 Jun 2026";

  return (
    <div className="w-full max-w-4xl mx-auto p-1 md:p-2 font-sans text-[#1E1E1E]">
      
      {/* 🎯 প্রিন্ট সিএসএস হ্যাক */}
      <style jsx global>{`
        @media print {
          aside, nav, header, .no-print, .print\\:hidden,
          [class*="sidebar"], [class*="Navbar"], [class*="header"] {
            display: none !important;
          }
          main, .w-full, .max-w-4xl {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #invoice-target-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
      
      {/* 🔝 অ্যাকশন কন্ট্রোল বার (মোবাইল ফ্রেন্ডলি ফ্লেক্স) */}
      <div className="flex items-center justify-between gap-2 mb-5 px-1 print:hidden no-print">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-1 text-[13px] md:text-[14px] font-bold text-gray-400 hover:text-gray-700 transition-all cursor-pointer">
            <ArrowLeft size={15} /> Back
          </button>
          <h1 className="text-[20px] md:text-[26px] font-bold text-[#0A1128] tracking-tight mt-0.5">Invoice Manager</h1>
        </div>
        <button onClick={handleDownloadPDF} className="flex items-center gap-1.5 px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl bg-[#4E612B] text-white text-[12px] md:text-[14px] font-bold cursor-pointer hover:bg-[#3d4d22] transition-all shadow-sm shrink-0">
          <Printer size={15} /> Print / PDF
        </button>
      </div>

      {/* 📄 ইনভয়েস মেইন বডি কার্ড */}
      <div 
        id="invoice-target-card"
        className="bg-white rounded-2xl border border-gray-100 p-4 md:p-10 shadow-3xs min-h-[750px] md:min-h-[850px] flex flex-col justify-between"
      >
        <div>
          {/* হেডার লোগো এবং স্ট্যাটাস */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-5 mb-5">
            <div>
              <h2 className="text-[24px] md:text-[28px] font-extrabold text-[#4E612B] tracking-tight">SREYOSHI</h2>
              <p className="text-[11px] md:text-[12px] text-gray-400 mt-0.5">Premium Cosmetics & Skincare</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-[#EBF5EE] text-[#2D4A3E] rounded-lg text-[11px] md:text-[12px] font-bold uppercase tracking-wide whitespace-nowrap">
                ✓ {orderData.paymentStatus || "Paid"}
              </span>
            </div>
          </div>

          {/* কাস্টমার ও ইনভয়েস মেটা ডেটা (মোবাইলে ১ কলাম, ডেসকটপে ২ কলাম) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8 mb-6 md:mb-8 text-[12px] md:text-[13px]">
            <div className="bg-gray-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-gray-100/50 sm:border-none">
              <h3 className="text-[10px] md:text-[11px] font-bold text-[#4E612B] uppercase tracking-wider mb-1.5">Customer Address</h3>
              <p className="font-bold text-[#1E1E1E] text-[13px] md:text-[14px]">{orderData.shippingAddress?.name || orderData.user?.name || "Valued Customer"}</p>
              <p className="text-gray-500 mt-1 leading-relaxed">
                📍 {orderData.shippingAddress?.address || "N/A"}<br />
                🏙️ City: {orderData.shippingAddress?.city || "N/A"}<br />
                📞 Phone: {orderData.shippingAddress?.phone || "N/A"}
              </p>
            </div>
            <div className="sm:text-right bg-gray-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-gray-100/50 sm:border-none">
              <h3 className="text-[10px] md:text-[11px] font-bold text-[#4E612B] uppercase tracking-wider mb-1.5">Reference Info</h3>
              <p className="text-gray-600 truncate"><span className="text-gray-400 font-medium">TXN ID:</span> <span className="font-semibold uppercase text-[#1E1E1E] break-all">{orderData.transactionId}</span></p>
              <p className="text-gray-600 mt-1"><span className="text-gray-400 font-medium">Order Date:</span> {orderDate}</p>
              <p className="text-gray-600 mt-1"><span className="text-gray-400 font-medium">Method:</span> {orderData.paymentMethod || "SSLCommerz"}</p>
            </div>
          </div>

          {/* 📦 প্রোডাক্ট কন্টেইনার (মোবাইলে রেসপন্সিভ কার্ড এবং ট্যাবলেটে টেবিল ভিউ) */}
          <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
            
            {/* 💻 ডেসকটপ টেবিল ভিউ (hidden md:block) */}
            <table className="w-full text-left border-collapse hidden md:table">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-[#4E612B] uppercase tracking-wider">
                  <th className="p-4">Product Description</th>
                  <th className="p-4 text-right">Unit Price</th>
                  <th className="p-4 text-center">Qty</th>
                  <th className="p-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-[13px] divide-y divide-gray-50">
                {items.map((item: any, index: number) => {
                  const matched = allProducts?.find((p: any) => (p._id?.$oid || p._id) === (item.product?.$oid || item.product));
                  return (
                    <tr key={index}>
                      <td className="p-4">
                        <p className="font-bold text-[#1E1E1E]">{matched?.name || item.name || "Premium Item"}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Shade: {item.shadeName || "NoShade"}</p>
                      </td>
                      <td className="p-4 text-right font-medium">৳{item.price || 0}</td>
                      <td className="p-4 text-center text-gray-500 font-bold">{item.quantity || 1}</td>
                      <td className="p-4 text-right font-extrabold text-[#1E1E1E]">৳{(item.price || 0) * (item.quantity || 1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 📱 মোবাইল লিস্ট ভিউ (md:hidden) */}
            <div className="block md:hidden divide-y divide-gray-100">
              {items.map((item: any, index: number) => {
                const matched = allProducts?.find((p: any) => (p._id?.$oid || p._id) === (item.product?.$oid || item.product));
                return (
                  <div key={index} className="p-3.5 flex flex-col gap-1.5 text-[12px]">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-[#1E1E1E] text-[13px] truncate">{matched?.name || item.name || "Premium Item"}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Shade: {item.shadeName || "NoShade"}</p>
                      </div>
                      <p className="font-extrabold text-[#1E1E1E] whitespace-nowrap">৳{(item.price || 0) * (item.quantity || 1)}</p>
                    </div>
                    <div className="flex justify-between items-center text-gray-400 pt-0.5">
                      <span>Unit Price: ৳{item.price || 0}</span>
                      <span className="font-medium text-gray-600">Qty: {item.quantity || 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* কস্টিং সামারি */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 bg-gray-50/50 border border-gray-100 rounded-xl p-4 space-y-2.5 text-[12px] md:text-[13px]">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-[#1E1E1E]">৳{orderData.totalPrice - (orderData.deliveryCharge || 0)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Charge</span>
                <span className="font-bold text-[#1E1E1E]">৳{orderData.deliveryCharge || 0}</span>
              </div>
              <div className="flex justify-between text-[13px] md:text-[14px] font-extrabold text-[#0A1128] pt-2 border-t border-dashed border-gray-200">
                <span>Total Paid</span>
                <span className="text-[15px] md:text-[16px] text-[#4E612B]">৳{orderData.totalPrice || "0"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ফুটার নোট */}
        <div className="border-t border-gray-100 pt-5 mt-6 text-center text-[10px] md:text-[11px] text-gray-400 space-y-1">
          <p>Thank you for shopping with SREYOSHI! This is a computer-generated digital invoice.</p>
          <p className="opacity-75">Support: support@sreyoshi.com | Web: www.sreyoshi.com</p>
        </div>
      </div>
    </div>
  );
}