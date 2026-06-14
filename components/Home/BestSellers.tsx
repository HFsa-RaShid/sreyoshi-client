"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext"; 

import productsData from "../../public/data/products.json";
import { Product } from "@/Types/types";
import CarouselButtons from "../Button/CarouselButtons";

export default function BestSellers() {
  const { addToCart } = useApp();
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // ১. শুধুমাত্র "Best Sellers" ফিল্টার এবং salesCount অনুযায়ী সর্ট করা
  const bestSellers = [...(productsData as Product[])]
    .filter((product) => product.promotion === "Best Sellers")
    .sort((a, b) => b.salesCount - a.salesCount);

  // প্রোডাক্টের সংখ্যা ৫টির বেশি কি না তা যাচাই করার কন্ডিশন
  const hasMoreThanFive = bestSellers.length > 5;

  // ২. ডানে ও বামে স্মুথ স্ক্রোল করার ফাংশন
  const handleScroll = (direction: "left" | "right") => {
    if (gridContainerRef.current) {
      const { scrollLeft, clientWidth } = gridContainerRef.current;
      // স্ক্রিন সাইজ অনুযায়ী ডাইনামিকালি কার্ডের সমপরিমাণ দূরত্বে স্ক্রোল হবে
      const scrollAmount = clientWidth * 0.4; 
      
      gridContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // যদি কোনো বেস্ট সেলার প্রোডাক্ট না থাকে, তবে সেকশনটি দেখাবে না
  if (bestSellers.length === 0) return null;

  return (
    <section className="w-full bg-[#FAF9F6] py-16 px-6 md:px-16 lg:px-24 relative group/section">
      <div className="container mx-auto">
        
        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-2xl md:text-3xl text-[#1E2E24] font-normal">
            Best Sellers
          </h2>
          <Link href="/shop" className="flex items-center gap-1.5 text-xs md:text-sm font-sans text-[#1E2E24] font-medium hover:opacity-70 transition-opacity">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* PRODUCT CARDS AREA WITH SEPARATED BUTTONS */}
        <div className="relative w-full">
          
          {/* আলাদা ফাইল থেকে আনা কাস্টম বাটন কন্ট্রোলার */}
          <CarouselButtons 
            onScrollLeft={() => handleScroll("left")}
            onScrollRight={() => handleScroll("right")}
            showButtons={hasMoreThanFive} // ৫টির বেশি হলেই কেবল বাটন একটিভ হবে
          />

          {/* PRODUCT CARDS GRID / SLIDER */}
          {/* ৫টির বেশি প্রোডাক্ট হলে flex row ও স্ক্রোল চালু হবে, কম হলে ফিক্সড গ্রিড থাকবে */}
          <div 
            ref={gridContainerRef}
            className={`w-full gap-5 scrollbar-none pb-4 snap-x snap-mandatory ${
              hasMoreThanFive 
                ? "flex overflow-x-auto" 
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
            }`}
          >
            {bestSellers.map((product) => (
              <div 
                key={product.id} 
                className={`flex flex-col bg-white rounded-2xl pb-4 shadow-[0_4px_20px_rgba(0,0,0,0.012)] border border-gray-100/40 relative group overflow-hidden snap-start ${
                  hasMoreThanFive ? "min-w-[46%] md:min-w-[31%] lg:min-w-[18.8%]" : ""
                }`}
              >
                
                {/* Product Image Box with Hover Effect */}
                <div className="w-full aspect-square rounded-t-2xl bg-[#FAF6F0] relative overflow-hidden">
                  
                  {/* Default Image */}
                  <Image 
                    src={product.images[0]} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className={`object-cover transition-all duration-500 ${
                      product.images[1] ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
                    }`}
                    priority={true}
                  />

                  {/* Hover Image */}
                  {product.images[1] && (
                    <Image 
                      src={product.images[1]} 
                      alt={`${product.name} alternate`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="absolute inset-0 object-cover opacity-0 scale-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                  )}

                  {/* Discount Badge */}
                  {product.discount && (
                    <span className="absolute top-3 left-3 bg-[#354536] text-white text-[10px] font-medium px-2 py-0.5 rounded-full z-10">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="mt-4 flex flex-col grow justify-between px-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                      {product.subCategory}
                    </span>
                    <h3 className="font-sans text-xs md:text-sm font-medium text-[#1E2E24] line-clamp-2 mb-2">
                      {product.name}
                    </h3>

                    {/* Dynamic Rating System */}
                    <div className="flex items-center gap-1.5 ">
                      <div className="flex items-center text-[#9BA69C] gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={11} 
                            fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                            className="text-[#9BA69C]" 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-sans text-gray-400 font-light py-2">
                        ({product.ratingCount})
                      </span>
                    </div>
                  </div>

                  {/* Price & Add to Cart Button */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-2">
                      <span className="font-sans text-sm md:text-base font-semibold text-[#1E2E24]">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-gray-400 line-through mt-1">
                          ${product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {/* Cart Action Button */}
                    <button 
                      onClick={() => addToCart(product, 1)}
                      className="w-8 h-8 rounded-full bg-[#2C3E30] hover:bg-[#1A261D] text-white flex items-center justify-center shadow-sm transition-colors active:scale-95"
                      title="Add to Cart"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}