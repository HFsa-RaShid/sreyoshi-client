"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, AlertCircle, ArrowLeft } from "lucide-react";

function FailContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");

  return (
    <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-rose-50 p-4 rounded-full text-rose-600">
          <XCircle size={48} />
        </div>
      </div>

      <h1 className="font-serif text-2xl text-[#1E2E24] mb-2 font-normal">
        Payment Failed
      </h1>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        We couldn&apos;t process your transaction. This might happen due to incorrect details, cancellation, or network connection loss.
      </p>

      {errorMessage && (
        <div className="bg-rose-50/50 text-rose-700 rounded-xl p-3 mb-8 border border-rose-100 flex items-center gap-2 text-left">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span className="text-xs font-medium leading-normal">
            Reason: {decodeURIComponent(errorMessage)}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Link
          href="/cart" // কার্ট বা চেকআউট পেজে ফেরত পাঠানো
          className="w-full bg-[#2C3E30] hover:bg-[#1A261D] text-white font-sans text-sm font-medium py-3 rounded-full transition-colors flex items-center justify-center gap-2"
        >
          Try Again
        </Link>
        <Link
          href="/shop"
          className="w-full bg-transparent hover:bg-gray-50 text-gray-600 font-sans text-sm font-medium py-3 rounded-full border border-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} /> Return to Shop
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <section className="w-full bg-[#FAF9F6] min-h-screen flex items-center justify-center px-4 py-24">
      <Suspense fallback={<div className="text-sm text-gray-500 font-sans">Loading details...</div>}>
        <FailContent />
      </Suspense>
    </section>
  );
}