/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { CheckCircle2, ShoppingBag, XCircle, Loader2 } from "lucide-react";
import { useGetOrderTracking } from "@/hooks/useTracking";


interface TrackOrderTimelineProps {
  orderId: string;
  fallbackStatus: string;
}

export default function TrackOrderTimeline({ orderId, fallbackStatus }: TrackOrderTimelineProps) {
  // 🎯 আপনার নিজস্ব রিঅ্যাক্ট কোয়েরি হুক দিয়ে লাইভ ট্র্যাকিং ডেটা ফেচিং
  const { data: trackingData, isLoading } = useGetOrderTracking(orderId);

  // ব্যাকএন্ড থেকে ডাটা লোড হওয়ার সময়ের স্কেলিটন
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
        <Loader2 className="w-4 h-4 animate-spin text-[#4E612B]" /> Loading live order tracking timeline...
      </div>
    );
  }

  // লাইভ ডাটা না থাকলে মেইন অর্ডারের স্ট্যাটাসটাই কারেন্ট স্ট্যাটাস ধরবে
  const currentStatus = trackingData?.currentStatus || fallbackStatus || "Pending";
  const history = trackingData?.history || [];

  // ৩টি নির্দিষ্ট স্ট্যাটাসের সিকোয়েন্স স্টেপস
  const trackingSteps = [
    { name: "Order Placed", key: "Pending", icon: ShoppingBag, defaultMsg: "We have received your order" },
    { name: "Order Confirmed", key: "Confirmed", icon: CheckCircle2, defaultMsg: "Order has been verified and confirmed" },
  ];

  // স্ট্যাটাস ইনডেক্স বের করার হেল্পার
  const orderSequence = ["Pending", "Confirmed"];
  const currentStepIndex = orderSequence.indexOf(currentStatus);

  // তারিখ ফরম্যাট করার হেল্পার
  const formatHistoryDate = (dateStr: any) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ", " + 
           new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // অর্ডার ক্যানসেল হলে সরাসরি এই নোটিশটি রেন্ডার হবে
  if (currentStatus === "Cancelled") {
    const cancelLog = history.find((h: any) => h.status === "Cancelled");
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-2xs">
        <h3 className="text-[18px] font-bold text-[#0A1128] mb-4">Track Order</h3>
        <div className="flex items-start gap-4 p-4 text-rose-600 bg-rose-50/50 rounded-xl border border-rose-100 text-[14px]">
          <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">This order has been cancelled.</p>
            <p className="text-[12px] text-rose-500 mt-0.5">{cancelLog?.message || "Order cancellation processed successfully."}</p>
            {cancelLog?.updatedAt && <p className="text-[11px] text-gray-400 mt-1 font-mono">{formatHistoryDate(cancelLog.updatedAt)}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-2xs">
      <h3 className="text-[18px] font-bold text-[#0A1128] mb-8">Track Order</h3>
      
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4 w-full px-2">
        {trackingSteps.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const StepIcon = step.icon;
          
          // ব্যাকঅ্যান্ড হিস্ট্রি থেকে এই স্টেপের মেসেজ ও আপডেটেড টাইম খুঁজে বের করা
          const historyLog = history.find((h: any) => h.status === step.key);
          const logTime = historyLog?.updatedAt;
          const logMessage = historyLog?.message || step.defaultMsg;

          return (
            <div key={idx} className="flex md:flex-col items-center flex-1 w-full relative group">
              {/* অনুভূমিক রেখা (ডেস্কটপ) */}
              {idx !== trackingSteps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[50%] right-[-50%] h-[3px] bg-gray-100 z-0">
                  <div className="h-full bg-[#4E612B] transition-all duration-500" style={{ width: idx < currentStepIndex ? "100%" : "0%" }} />
                </div>
              )}
              {/* উলম্ব রেখা (মোবাইল) */}
              {idx !== trackingSteps.length - 1 && (
                <div className="md:hidden absolute left-6 top-12 bottom-[-24px] w-[3px] bg-gray-100 z-0">
                  <div className="w-full bg-[#4E612B] transition-all duration-500" style={{ height: idx < currentStepIndex ? "100%" : "0%" }} />
                </div>
              )}
              
              {/* আইকন সার্কেল */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 shrink-0 transition-all ${isCompleted ? "bg-[#4E612B] border-[#4E612B] text-white shadow-md shadow-[#4E612B]/20" : "bg-[#F4F4F4] border-gray-200 text-gray-400"}`}>
                <StepIcon size={20} />
              </div>
              
              {/* স্ট্যাটাস বিবরণ */}
              <div className="ml-4 md:ml-0 md:text-center mt-0 md:mt-4 z-10 max-w-xs">
                <p className={`text-[14px] font-bold ${isCompleted ? "text-[#1E1E1E]" : "text-gray-400"}`}>{step.name}</p>
                <p className="text-[12px] text-gray-400 mt-0.5 font-medium leading-tight">
                  {isCompleted ? logMessage : "Awaiting this step"}
                </p>
                {isCompleted && logTime && (
                  <p className="text-[10px] text-gray-400 mt-1 font-mono font-medium">{formatHistoryDate(logTime)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}