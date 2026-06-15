"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetCategoriesForCustomer } from "@/hooks/useCustomerData"; 
import { Category } from "@/Types/types";
import Image from "next/image";

export default function CategorySection() {
  const { data: categoriesData, isLoading, error } = useGetCategoriesForCustomer();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // লোডিং ও এরর হ্যান্ডেলিং
  if (isLoading) {
    return <div className="py-16 text-center text-gray-500 font-sans">Loading Categories...</div>;
  }
  if (error || !categoriesData || categoriesData.length === 0) return null;

  const isSlider = categoriesData.length > 5;

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.5; 
      
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full py-16 px-6 md:px-12 relative group/section">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
        
        {/* LEFT TEXT BLOCK */}
        <div className="lg:col-span-3 flex flex-col items-start pr-4 z-10 bg-white">
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

        {/* RIGHT CATEGORIES AREA WITH FLOATING BUTTONS */}
        <div className="lg:col-span-9 relative w-full overflow-hidden">
          
          {isSlider && (
            <>
              <button 
                onClick={() => handleScroll("left")}
                className="absolute left-2 top-[40%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-[#1E2E24] hover:bg-[#1E2E24] hover:text-white transition-all opacity-0 group-hover/section:opacity-100"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => handleScroll("right")}
                className="absolute right-2 top-[40%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-[#1E2E24] hover:bg-[#1E2E24] hover:text-white transition-all opacity-0 group-hover/section:opacity-100"
                aria-label="Scroll Right"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* DYNAMIC GRID / HORIZONTAL SLIDER CONTAINER */}
          <div 
            ref={scrollContainerRef}
            className={`w-full gap-4 pb-4 scrollbar-none snap-x snap-mandatory ${
              isSlider 
                ? "flex overflow-x-auto" 
                : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            }`}
          >
            {categoriesData.map((category: Category) => {
              
              const productImage = category.image;
              
              const categoryId = category._id || category.name.toLowerCase().replace(/\s+/g, '-');

              return (
                <div 
                  key={categoryId} 
                  className={`flex flex-col items-center bg-white rounded-2xl pb-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100/50 snap-start ${
                    isSlider ? "min-w-[45%] sm:min-w-[30%] lg:min-w-[18.8%]" : "w-full"
                  }`}
                >
                  {/* Image Box */}
                  {/* Image Box */}
<div className="w-full aspect-[4/5] rounded-t-2xl overflow-hidden bg-[#FAF5F0] relative">
  <Image 
    src={productImage} 
    alt={category.name}
    fill
    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
    className="object-cover transform hover:scale-105 transition-transform duration-700"
    priority={false} // পেজ স্পীড বুস্ট করার জন্য লেজি লোডিং এনাবলড থাকবে
  />
</div>

                  {/* Title */}
                  <h3 className="font-serif text-base md:text-md text-[#1E2E24] mt-4 font-normal capitalize px-2 text-center line-clamp-1">
                    {category.name}
                  </h3>
                  
                  {/* Shop Page Link */}
                  <Link 
                    href={`/shop?category=${categoryId}`}
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

      </div>
    </section>
  );
}