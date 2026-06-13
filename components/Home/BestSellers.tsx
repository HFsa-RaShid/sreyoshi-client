"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Star, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import productsData from "../../public/data/products.json";

export default function BestSellers() {
  const bestSellers = [...productsData]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  return (
    <section className="w-full bg-[#FAF9F6] py-12 px-6 md:px-16 lg:px-24 relative group/section">
      <div className="container mx-auto">
        
        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-[#1E2E24] font-normal">
            Best Sellers
          </h2>
          <Link href="#" className="flex items-center gap-1.5 text-xs md:text-sm font-sans text-[#1E2E24] font-medium hover:opacity-70 transition-opacity">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* CAROUSEL WRAPPER WITH NAVIGATION BUTTONS */}
        <div className="relative w-full">
          
          {/* Left Arrow Button */}
          <button className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-black z-20 border border-gray-100 transition-all opacity-0 group-hover/section:opacity-100">
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>

          {/* PRODUCT CARDS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 overflow-x-auto scrollbar-none pb-4">
            {bestSellers.map((product) => (
              <div key={product.id} className="flex flex-col min-w-[170px] bg-white rounded-2xl pb-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-gray-100/40 relative group">
                
                {/* Product Image Box */}
                <div className="w-full aspect-square rounded-xl bg-[#FAF6F0] flex items-center justify-center p-4 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  
                </div>

                {/* Product Info */}
                <div className="mt-4 flex flex-col grow justify-between p-3">
                  <div>
                    <h3 className="font-sans text-xs md:text-sm font-medium text-[#1E2E24]">
                      {product.name}
                    </h3>

                    {/* Star Rating & Review Count */}
                    <div className="flex items-center gap-1 my-3">
                      <div className="flex items-center text-[#9BA69C]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} fill="currentColor" className="text-[#9BA69C]" />
                        ))}
                      </div>
                      <span className="text-[10px] font-sans text-gray-400 font-light">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Price & Action Button Row */}
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm md:text-base font-semibold text-[#1E2E24]">
                      ${product.price.toFixed(2)}
                    </span>
                    
                    {/* Rounded Plus Icon Button */}
                    <button className="w-7 h-7 rounded-full bg-[#2C3E30] hover:bg-[#1A261D] text-white flex items-center justify-center shadow-sm transition-colors">
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-black z-20 border border-gray-100 transition-all opacity-0 group-hover/section:opacity-100">
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>

        </div>

      </div>
    </section>
  );
}