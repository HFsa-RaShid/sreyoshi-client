

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
// আপনার ফাইল স্ট্রাকচার অনুযায়ী json ফাইলের পাথটি ঠিক করে নিন
import categoriesData from "../../public/data/categories.json";

export default function CategorySection() {
  return (
    <section className="w-full py-16 px-6 md:px-12">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
        
        {/* LEFT TEXT BLOCK */}
        <div className="lg:col-span-3 flex flex-col items-start pr-4">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1E2E24] font-normal leading-tight">
            Shop by Category
          </h2>
          <p className="mt-4 text-[#5E6A60] font-sans text-sm md:text-base leading-relaxed max-w-[240px]">
            Everything you need for your best skin & hair days.
          </p>
          <Link 
            href="/shop" 
            className="mt-6 flex items-center gap-2 text-[#10381a] hover:text-[#457651] font-sans text-sm font-semibold border-b border-[#1E2E24] pb-0.5 transition-opacity group"
          >
            View All Products
            <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* RIGHT CATEGORIES GRID (DYNAMIC) */}
        <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
          {categoriesData.map((category) => {
            // যদি JSON-এ ইমেজ না থাকে, তাহলে একটি সুন্দর ক্যাটাগরি ভিত্তিক প্লেসহোল্ডার ইমেজ দেখাবে
            const fallbackImage = `https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600`;
            const productImage = category.image || fallbackImage;

            return (
              <div 
                key={category.id} 
                className="flex flex-col items-center bg-white rounded-2xl pb-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100/50"
              >
                {/* Image Box */}
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF5F0] relative">
                  <img 
                    src={productImage} 
                    alt={category.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Title */}
                <h3 className="font-serif text-base md:text-md text-[#1E2E24] mt-4 font-normal capitalize">
                  {category.name}
                </h3>
                
                {/* ডাইনামিক শপ পেজ লিংক */}
                <Link 
                  href={`/shop?category=${category.id}`}
                  className="mt-1 flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#10381a] font-semibold hover:text-[#457651] transition-colors group"
                >
                  Shop Now
                  <ArrowRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
                </Link>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}