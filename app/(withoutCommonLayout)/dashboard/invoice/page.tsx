
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useUserData } from "@/hooks/useUserData";
import { useMyOrders } from "@/hooks/useGetOrderDetails";
import { Loader2, FileText, Eye, Calendar, CreditCard } from "lucide-react";

export default function MyInvoicesListPage() {
  // 💡 ১. সেশন এবং অর্ডার ডাটা উভয়ই রিফ্রেস করা নিশ্চিত করার জন্য হুক কল
  const { user: backendUser, isLoading: isUserLoading, refetch: refetchUser } = useUserData() as any;
  const { orders = [], isLoading: isOrdersLoading, refetch: refetchOrders } = useMyOrders() as any;
  
  const userId = backendUser?._id || backendUser?.id;
  const isLoading = isUserLoading || isOrdersLoading;

  // 🎯 ২. অটো-সিঙ্ক মেকানিজম: প্রথমবার পেজে ল্যান্ড করলে রিলোড ছাড়াই ডাটা ফেচ হবে
  useEffect(() => {
    if (userId) {
      if (typeof refetchUser === "function") refetchUser();
      if (typeof refetchOrders === "function") refetchOrders();
    }
  }, [userId, refetchUser, refetchOrders]);

  // মঙ্গোডিবি আইডি ক্লিন করার হেল্পার
  const getSafeId = (idField: any): string => {
    if (!idField) return "";
    return typeof idField === "object" ? idField.$oid || idField._id || String(idField) : String(idField);
  };

  // 🎯 ৩. কন্ডিশন ফিক্সড: শুধুমাত্র পেমেন্ট স্ট্যাটাস paid হলেই ইনভয়েস দেখাবে (packed/delivered এর কন্ডিশন বাদ)
  const invoiceOrders = orders.filter((order: any) => {
    const paymentPaid = order.paymentStatus?.toLowerCase() === "paid";
    const isUserOrder = getSafeId(order.user) === getSafeId(userId);
    return paymentPaid && isUserOrder;
  });

  // লোডিং স্টেট স্ক্রিন
  if (isLoading) {
    return (
      <div className="min-h-[350px] md:min-h-[400px] flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 p-4">
        <Loader2 className="w-7 h-7 animate-spin text-[#4E612B]" />
        <p className="text-[12px] md:text-[13px] text-gray-400">Loading your invoices...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen p-3 md:p-6 text-[#1E1E1E] font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="font-bold text-[22px] md:text-[26px] text-[#0A1128] tracking-tight">My Invoices</h1>
          <p className="text-[12px] md:text-[13px] text-gray-400 mt-0.5">Available official invoice copies ({invoiceOrders.length})</p>
        </div>

        {invoiceOrders.length === 0 ? (
          <div className="text-center py-12 md:py-16 text-[13px] md:text-[14px] text-gray-400 border border-gray-100 rounded-2xl bg-white p-4">
            No eligible invoices found yet. Invoices are generated once payment is verified.
          </div>
        ) : (
          <>
            {/* 📱 ১. মোবাইল ভিউ: কার্ড লেআউট (শুধুমাত্র ছোট স্ক্রিনের জন্য দৃশ্যমান) */}
            <div className="block md:hidden space-y-3">
              {invoiceOrders.map((order: any) => {
                const orderId = getSafeId(order._id);
                const rawDate = order.createdAt?.$date || order.createdAt;
                const orderDate = rawDate ? new Date(rawDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A";

                return (
                  <div key={orderId} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-3.5">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 bg-gray-50 rounded-xl mt-0.5 text-[#4E612B] shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[14px] text-[#1E1E1E]">
                          #{order.transactionId?.split("-")[1] || orderId.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-gray-400 break-all font-mono tracking-tight mt-0.5">
                          {order.transactionId}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 text-[12px] border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Calendar size={13} className="text-gray-400" />
                        <span>{orderDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 justify-end">
                        <CreditCard size={13} className="text-gray-400" />
                        <span className="font-medium">{order.paymentMethod || "SSLCommerz"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Amount</p>
                        <p className="text-[16px] font-extrabold text-[#1E1E1E] mt-0.5">৳{order.totalPrice}</p>
                      </div>
                      <Link 
                        href={`/dashboard/invoice/${orderId}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-[12px] font-bold text-[#4E612B] hover:bg-gray-50 bg-white shadow-2xs cursor-pointer"
                      >
                        <Eye size={14} /> View Invoice
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 💻 ২. ডেসকটপ ভিউ: ক্লিন টেবিল লেআউট (মাঝারি ও বড় স্ক্রিনের জন্য) */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-3xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-[#4E612B] uppercase tracking-wider">
                      <th className="p-4">Invoice / TXN ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Method</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] divide-y divide-gray-50">
                    {invoiceOrders.map((order: any) => {
                      const orderId = getSafeId(order._id);
                      const rawDate = order.createdAt?.$date || order.createdAt;
                      const orderDate = rawDate ? new Date(rawDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A";

                      return (
                        <tr key={orderId} className="hover:bg-gray-50/50 transition-all">
                          <td className="p-4 font-medium">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-[#4E612B] shrink-0" />
                              <div>
                                <p className="font-bold text-[#1E1E1E]">#{order.transactionId?.split("-")[1] || orderId.slice(-6).toUpperCase()}</p>
                                <p className="text-[11px] text-gray-400 uppercase tracking-tight font-mono">{order.transactionId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-500 font-medium">{orderDate}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-md">
                              {order.paymentMethod || "SSLCommerz"}
                            </span>
                          </td>
                          <td className="p-4 text-right font-extrabold text-[#1E1E1E]">৳{order.totalPrice}</td>
                          <td className="p-4 text-center">
                            <Link 
                              href={`/dashboard/invoice/${orderId}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-bold text-[#4E612B] hover:bg-gray-50 bg-white shadow-3xs transition-all cursor-pointer"
                            >
                              <Eye size={13} /> View Invoice
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}