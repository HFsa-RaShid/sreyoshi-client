/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext"; 

function SuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");
  const { clearCart } = useApp(); 


  useEffect(() => {
    if (clearCart) {
      clearCart();
    }
  }, []); 

  return (
    <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-emerald-50 p-4 rounded-full text-emerald-600">
          <CheckCircle2 size={48} className="animate-bounce" />
        </div>
      </div>

      <h1 className="font-serif text-2xl text-[#1E2E24] mb-2 font-normal">
        Payment Successful!
      </h1>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Thank you for your purchase. Your payment has been processed successfully, and your order is now being processed.
      </p>

      {transactionId && (
        <div className="bg-[#FAF9F6] rounded-xl p-3 mb-8 border border-gray-100">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-medium">
            Transaction ID
          </span>
          <span className="text-xs font-mono font-semibold text-[#1E2E24]">
            {transactionId}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Link
          href="/shop"
          className="w-full bg-[#2C3E30] hover:bg-[#1A261D] text-white font-sans text-sm font-medium py-3 rounded-full transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} /> Continue Shopping
        </Link>
        <Link
          href="/dashboard/orders" 
          className="w-full bg-transparent hover:bg-gray-50 text-gray-600 font-sans text-sm font-medium py-3 rounded-full border border-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          View Order History <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <section className="w-full bg-[#FAF9F6] min-h-screen flex items-center justify-center px-4 py-24">
      <Suspense fallback={<div className="text-sm text-gray-500 font-sans">Loading details...</div>}>
        <SuccessContent />
      </Suspense>
    </section>
  );
}