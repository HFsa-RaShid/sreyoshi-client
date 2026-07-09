/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ArrowLeft, ShoppingBag, CheckCircle2, XCircle, Loader2, Calendar, Hash } from "lucide-react";
import { useGetOrderTracking } from "@/hooks/useTracking";

interface TrackOrderPageProps {
  orderId: string;
  orderData: any;
  onBack: () => void;
}

export default function TrackOrderPage({ orderId, orderData, onBack }: TrackOrderPageProps) {
  const { data: trackingData, isLoading } = useGetOrderTracking(orderId);

  const fallbackStatus = orderData?.orderStatus || "Pending";
  const currentStatus = trackingData?.currentStatus || fallbackStatus;
  const history = trackingData?.history || [];

  const trackingSteps = [
    { name: "Order Placed", key: "Pending", icon: ShoppingBag, defaultMsg: "We have received your order" },
    { name: "Order Confirmed", key: "Confirmed", icon: CheckCircle2, defaultMsg: "Order has been verified and confirmed" },
  ];

  const orderSequence = ["Pending", "Confirmed"];
  const currentStepIndex = orderSequence.indexOf(currentStatus);

  const formatHistoryDate = (dateStr: any) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + 
           new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 bg-[#FAFAFA] min-h-screen font-sans text-[#1E1E1E]">
      
      {/* HEADER */}
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-700 mb-3 cursor-pointer transition-all">
          <ArrowLeft size={16} /> Back to orders
        </button>
        <h1 className="text-24px md:text-[28px] font-bold text-[#0A1128] tracking-tight">Live Order Tracking</h1>
        <p className="text-xs text-gray-400 mt-1">Real-time update of your purchase</p>
      </div>

      {/* QUICK INFOCARD */}
      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-gray-100 mb-6 shadow-3xs">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Hash size={16}/></div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase">Order ID</p>
            <p className="text-[14px] font-bold">#{orderData?.transactionId?.split("-")[1] || orderId.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Calendar size={16}/></div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase">Total Price</p>
            <p className="text-[14px] font-bold text-[#4E612B]">৳{orderData?.totalPrice || 0}</p>
          </div>
        </div>
      </div>

      {/* TIMELINE VIEW */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-2xs">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-xs text-gray-400 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-[#4E612B]" /> Loading live timeline...
          </div>
        ) : currentStatus === "Cancelled" ? (
          <div className="flex items-start gap-4 p-4 text-rose-600 bg-rose-50/50 rounded-xl border border-rose-100 text-[14px]">
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">This order has been cancelled.</p>
              <p className="text-[12px] text-rose-500 mt-0.5">
                {history.find((h: any) => h.status === "Cancelled")?.message || "Order cancellation processed."}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 font-mono">
                {formatHistoryDate(history.find((h: any) => h.status === "Cancelled")?.updatedAt)}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col gap-8 w-full pl-2">
            {trackingSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const StepIcon = step.icon;
              const historyLog = history.find((h: any) => h.status === step.key);

              return (
                <div key={idx} className="flex items-start relative group">
                  {/* উলম্ব রেখা কানেক্টর */}
                  {idx !== trackingSteps.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-[-20px] w-[2px] bg-gray-100 z-0">
                      <div className="w-full bg-[#4E612B] transition-all" style={{ height: idx < currentStepIndex ? "100%" : "0%" }} />
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 shrink-0 transition-all ${isCompleted ? "bg-[#4E612B] border-[#4E612B] text-white shadow-md" : "bg-[#F4F4F4] border-gray-200 text-gray-400"}`}>
                    <StepIcon size={20} />
                  </div>

                  <div className="ml-4 pt-1 max-w-md">
                    <p className={`text-[15px] font-bold ${isCompleted ? "text-[#1E1E1E]" : "text-gray-400"}`}>{step.name}</p>
                    <p className="text-[13px] text-gray-400 mt-0.5 leading-tight">
                      {isCompleted ? (historyLog?.message || step.defaultMsg) : "Awaiting this step"}
                    </p>
                    {isCompleted && historyLog?.updatedAt && (
                      <p className="text-[11px] text-gray-400 mt-1 font-mono font-medium">{formatHistoryDate(historyLog.updatedAt)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}