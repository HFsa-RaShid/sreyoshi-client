"use client";

import React from "react";

export default function LegalPolicyPage() {
  return (
    <section className="w-full bg-[#FAF9F6] min-h-screen py-16 px-6 md:px-16 lg:px-24 text-[#1E2E24]">
      <div className="container mx-auto max-w-3xl bg-white p-6 md:p-10 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="font-serif text-2xl md:text-3xl font-normal mb-2">Terms & Conditions</h1>
        <p className="text-[11px] text-gray-400 mb-6">Last Updated: June 2026</p>

        <div className="prose prose-sm text-xs md:text-sm text-gray-500 flex flex-col gap-4 leading-relaxed">
          <p>Welcome to Sreyoshi. By accessing or purchasing from our platform, you agree to comply with our commercial and logistical regulations.</p>
          
          <h3 className="font-sans font-semibold text-sm text-[#1E2E24] mt-4">1. Account Security</h3>
          <p>Users are responsible for safeguarding registration details and ensuring transactions originating from their accounts are entirely validated.</p>
          
          <h3 className="font-sans font-semibold text-sm text-[#1E2E24] mt-4">2. Pricing & Orders</h3>
          <p>Sreyoshi reserves the dynamic right to modify listed cosmetics pricing, inventory updates, or promotion bounds at any interval without primitive notices.</p>
        </div>
      </div>
    </section>
  );
}