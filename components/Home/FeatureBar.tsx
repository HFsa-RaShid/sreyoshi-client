"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

export default function FeatureBar() {
  return (
    <section className="w-full bg-[#3D4F41] text-white py-3 px-6 md:px-16 lg:px-24">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-items-center text-center md:text-left">
        
        {/* Feature 1: Free Shipping */}
        <div className="flex items-center gap-4 max-w-[280px]">
          <Truck strokeWidth={1.2} className="w-8 h-8 opacity-90 shrink-0 text-[#FAF5F0]" />
          <div>
            <h4 className="font-sans text-sm font-semibold tracking-wide">Free Shipping</h4>
            <p className="text-xs text-[#FAF5F0]/70 font-light mt-0.5">On all orders over $50</p>
          </div>
        </div>

        {/* Divider 1 (Desktop Only) */}
        <div className="hidden md:block h-6 w-px bg-white/20 absolute left-[33.33%] pointer-events-none" />

        {/* Feature 2: 30-Day Returns */}
        <div className="flex items-center gap-4 max-w-[280px] md:pl-8">
          <RotateCcw strokeWidth={1.2} className="w-8 h-8 opacity-90 shrink-0 text-[#FAF5F0]" />
          <div>
            <h4 className="font-sans text-sm font-semibold tracking-wide">30-Day Returns</h4>
            <p className="text-xs text-[#FAF5F0]/70 font-light mt-0.5">Love it or return it</p>
          </div>
        </div>

        {/* Divider 2 (Desktop Only) */}
        <div className="hidden md:block h-6 w-px bg-white/20 absolute left-[66.66%] pointer-events-none" />

        {/* Feature 3: Secure Checkout */}
        <div className="flex items-center gap-4 max-w-[280px] md:pl-8">
          <ShieldCheck strokeWidth={1.2} className="w-8 h-8 opacity-90 shrink-0 text-[#FAF5F0]" />
          <div>
            <h4 className="font-sans text-sm font-semibold tracking-wide">Secure Checkout</h4>
            <p className="text-xs text-[#FAF5F0]/70 font-light mt-0.5">100% protected payments</p>
          </div>
        </div>

      </div>
    </section>
  );
}