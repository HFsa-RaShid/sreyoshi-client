/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useEffect } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  User,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useUserData } from "@/hooks/useUserData";
import { useMyOrders } from "@/hooks/useGetOrderDetails";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// মঙ্গোডিবি অবজেক্ট আইডি ক্লিনার
const getSafeId = (userField: any): string => {
  if (!userField) return "";
  if (typeof userField === "string") return userField;
  return userField.$oid || userField._id || String(userField);
};

export default function DashboardHomePage() {
  const { user: backendUser, isLoading: isUserLoading, refetch: refetchUser } = useUserData() as any;
  const { orders: rawOrders = [], isLoading: isOrdersLoading, refetch: refetchOrders } = useMyOrders() as any;

  const userId = getSafeId(backendUser?._id || backendUser?.id);
  
  // ─── 🎯 [CRITICAL FIX]: শুধু isLoading নয়, userId না আসা পর্যন্ত পেজকে Loading-এ আটকে রাখা হবে ───
  const isPageLoading = isUserLoading || isOrdersLoading || !userId || rawOrders.length === 0;

  // অটো-সিঙ্ক: যখনই ব্যাকএন্ড থেকে সেশন আইডি রেডি হবে, জোরপূর্বক ডাটা রি-ফেচ হবে
  useEffect(() => {
    if (userId) {
      if (typeof refetchUser === "function") refetchUser();
      if (typeof refetchOrders === "function") refetchOrders();
    }
  }, [userId, refetchUser, refetchOrders]);

  // স্ট্যাটস ও চার্ট ক্যালকুলেশন
  const stats = useMemo(() => {
    if (!userId) {
      return {
        totalOrders: 0, pendingCount: 0, deliveredCount: 0, totalSpent: 0,
        areaChartData: [], pieChartData: [], recentOrders: []
      };
    }

    const myOrders = rawOrders.filter(
      (order: any) => getSafeId(order.user) === userId,
    );

    const totalOrders = myOrders.length;
    let pendingCount = 0;
    let deliveredCount = 0;
    let totalSpent = 0;

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartMap: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    myOrders.forEach((order: any) => {
      const status = (order.orderStatus || "Pending").toLowerCase();
      if (status === "pending" || status === "packed") pendingCount++;
      if (status === "delivered") deliveredCount++;

      if (status !== "cancelled" && status !== "canceled") {
        totalSpent += order.totalPrice || 0;
      }

      const rawDate = order.createdAt?.$date || order.createdAt;
      if (rawDate) {
        const dayName = daysOfWeek[new Date(rawDate).getDay()];
        chartMap[dayName] += order.totalPrice || 0;
      }
    });

    const areaChartData = daysOfWeek.map((day) => ({ name: day, Amount: chartMap[day] }));

    const pieChartData = [
      { name: "Delivered", value: deliveredCount, color: "#2E4A3E" },
      { name: "Pending/Active", value: pendingCount, color: "#D9A700" },
      { name: "Others", value: Math.max(0, totalOrders - (deliveredCount + pendingCount)), color: "#9CA3AF" },
    ].filter((item) => item.value > 0);

    const recentOrders = [...myOrders]
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt?.$date || a.createdAt).getTime();
        const dateB = new Date(b.createdAt?.$date || b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);

    return { totalOrders, pendingCount, deliveredCount, totalSpent, areaChartData, pieChartData, recentOrders };
  }, [rawOrders, userId]);

  // ─── 🎯 স্কেলিটন বা ফুল স্ক্রিন পালস লোডিং ───
  if (isPageLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse p-4">
        {/* ব্যানার স্কেলিটন */}
        <div className="h-32 bg-gray-200 rounded-2xl w-full" />
        {/* কার্ড স্কেলিটন */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 bg-gray-200 rounded-2xl" />
          <div className="h-24 bg-gray-200 rounded-2xl" />
          <div className="h-24 bg-gray-200 rounded-2xl" />
          <div className="h-24 bg-gray-200 rounded-2xl" />
        </div>
        {/* চার্ট স্কেলিটন */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 h-64 bg-gray-200 rounded-2xl" />
          <div className="lg:col-span-4 h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 font-sans text-[#1E1E1E]">
      <div className="relative bg-[#0F1E29] rounded-2xl p-6 md:p-8 text-white overflow-hidden shadow-xs">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#4E612B] rounded-full blur-3xl opacity-40" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] bg-[#4E612B] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">Customer Portal</span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight pt-1">Welcome Back, {backendUser?.name || "Premium User"}! 👋</h2>
            <p className="text-xs text-gray-400 max-w-xl">Here is your live real-time purchasing summary, account spend tracking, and active order analytics metrics.</p>
          </div>
          <Link href="/dashboard/settings" className="sm:self-center shrink-0 px-5 py-2.5 bg-[#4E612B] hover:bg-[#3D4D22] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm">
            <User size={14} /> Profile Settings <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* স্ট্যাটস গ্রিড */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Total Orders", val: stats.totalOrders, sub: "Placed overall", icon: ShoppingBag, color: "bg-blue-50 text-blue-600 border-blue-100" },
          { name: "Active Orders", val: stats.pendingCount, sub: "In Packed / Pending", icon: Clock, color: "bg-amber-50 text-amber-600 border-amber-100" },
          { name: "Delivered Items", val: stats.deliveredCount, sub: "Successfully received", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
          { name: "Total Spent", val: `৳${stats.totalSpent}`, sub: "Valid purchases", icon: DollarSign, color: "bg-purple-50 text-purple-600 border-purple-100" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-2xs">
              <div className={`p-3 rounded-xl border shrink-0 ${item.color}`}><Icon size={20} /></div>
              <div className="min-w-0">
                <h4 className="text-gray-400 font-bold text-[11px] uppercase tracking-wider truncate">{item.name}</h4>
                <p className="text-lg md:text-xl font-extrabold text-[#0F1E29] mt-0.5">{item.val}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-medium truncate">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* চার্টস গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-[#0F1E29] flex items-center gap-1.5"><TrendingUp size={16} className="text-[#4E612B]" /> Weekly Expense Analytics</h3>
              <p className="text-[11px] text-gray-400 font-medium">Spending analysis based on current week order logs</p>
            </div>
            <span className="text-[10px] bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-gray-500 font-mono">Live</span>
          </div>
          <div className="w-full h-60">
            {stats.totalOrders === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">No order data available this week.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.areaChartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4E612B" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4E612B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => [`৳${value}`, "Amount"]} contentStyle={{ background: "#0F1E29", borderRadius: "12px", color: "#fff", fontSize: "12px", border: "none" }} />
                  <Area type="monotone" dataKey="Amount" stroke="#4E612B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-[#0F1E29]">Fulfillment Ratio</h3>
            <p className="text-[11px] text-gray-400 font-medium">Status ratio breakdown</p>
          </div>
          <div className="w-full h-35 relative flex items-center justify-center my-2">
            {stats.totalOrders === 0 ? (
              <p className="text-xs text-gray-400 font-medium">No distribution logs.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.pieChartData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value">
                    {stats.pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black text-[#0F1E29]">{stats.totalOrders}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total</span>
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-gray-50">
            {stats.pieChartData.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center font-medium">No order statuses to graph.</p>
            ) : (
              stats.pieChartData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-[#0F1E29]">{item.value} ({Math.round((item.value / stats.totalOrders) * 100)}%)</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* সাম্প্রতিক অর্ডার লগ */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#0F1E29]">Recent Purchase Orders</h3>
            <p className="text-[11px] text-gray-400 font-medium">Instant tracking access for your last 3 orders</p>
          </div>
          <Link href="/dashboard/my-orders" className="text-xs font-bold text-[#4E612B] hover:underline flex items-center gap-0.5">
            See All Orders <ChevronRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 font-medium border border-dashed border-gray-100 rounded-xl">You haven&apos;t placed any orders yet.</div>
          ) : (
            stats.recentOrders.map((order: any, idx: number) => {
              const rawDate = order.createdAt?.$date || order.createdAt;
              const dateStr = rawDate ? new Date(rawDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "05 Jul 2026";
              const status = order.orderStatus || "Pending";

              return (
                <div key={order._id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border border-gray-50 rounded-xl hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FAF9F6] border border-gray-100 rounded-xl flex items-center justify-center text-[#4E612B] font-bold text-sm shrink-0">📦</div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F1E29]">#{order.transactionId?.split("-")[1] || String(order._id).slice(-8).toUpperCase()}</p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-0.5 font-medium">
                        <span className="flex items-center gap-0.5"><Calendar size={12} /> {dateStr}</span>
                        <span className="flex items-center gap-0.5 truncate"><MapPin size={12} /> {order.shippingAddress?.city || "Dhaka"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                    <div className="sm:text-right">
                      <p className="text-xs font-extrabold text-[#0F1E29]">৳{order.totalPrice}</p>
                      <span className={`inline-block text-[10px] font-bold capitalize mt-0.5 ${status === "Delivered" ? "text-emerald-600" : status === "Cancelled" ? "text-red-500" : "text-amber-500"}`}>• {status}</span>
                    </div>
                    <Link href="/dashboard/my-orders" className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"><ArrowRight size={14} /></Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size }: { size: number }) {
  return <ArrowRight size={size} className="rotate-0 shrink-0" />;
}