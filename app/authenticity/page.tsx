"use client";

import React from "react";
import { FaCheckCircle, FaAward, FaBuilding } from "react-icons/fa";

export default function AuthenticityPage() {
  return (
    <section className="w-full bg-[#FAF9F6] min-h-screen py-16 px-6 md:px-16 lg:px-24 text-[#1E2E24]">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-widest text-[#8FA887] font-semibold block mb-2">100% Original Guaranteed</span>
          <h1 className="font-serif text-3xl md:text-4xl font-normal">Our Authenticity Promise</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
          <div className="flex gap-4 items-start">
            <FaCheckCircle className="text-[#2C3E30] text-xl mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-sans text-base font-semibold mb-1">Direct Brand Sourcing</h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">We source every single product directly from global manufacturers or authorized distributors. No middleman, zero counterfiet risk.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
            <FaAward className="text-[#2C3E30] text-xl mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-sans text-base font-semibold mb-1">Strict Quality Audits</h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Our temperature-controlled warehouses ensure skincare and cosmetic formulations remain stable, potent, and safe for usage.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}