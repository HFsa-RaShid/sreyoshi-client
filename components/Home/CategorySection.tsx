"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  { id: 1, name: "Skincare", image: "/Categories/skincare.png", link: "#" },
  { id: 2, name: "Haircare", image: "/Categories/haircare.png", link: "#" },
  { id: 3, name: "Body Care", image: "/Categories/bodycare.png", link: "#" },
  { id: 4, name: "Makeup", image: "/Categories/makeup.png", link: "#" },
  { id: 5, name: "Makeup", image: "/Categories/makeup.png", link: "#" },
];

export default function CategorySection() {
  return (
    <section className="w-full bg-[#FAF9F6] py-16">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-14 gap-8 items-center">
        
        {/* LEFT TEXT BLOCK */}
        <div className="lg:col-span-4 flex flex-col items-start pr-4">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1E2E24] font-normal leading-tight">
            Shop by Category
          </h2>
          <p className="mt-4 text-[#5E6A60] font-sans text-sm md:text-base leading-relaxed max-w-[240px]">
            Everything you need for your best skin & hair days.
          </p>
          <Link 
            href="#" 
            className="mt-6 flex items-center gap-2 text-[#1E2E24] font-sans text-sm font-semibold border-b border-[#1E2E24] pb-0.5 hover:opacity-70 transition-opacity group"
          >
            View All Products
            <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* RIGHT CATEGORIES GRID */}
        <div className="lg:col-span-10 grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col items-center bg-white rounded-2xl pb-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100/50">
              
              {/* Image Box */}
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF5F0] relative">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Title and Shop Now Text */}
              <h3 className="font-serif text-base md:text-lg text-[#1E2E24] mt-4 font-normal">
                {category.name}
              </h3>
              
              <Link 
                href={category.link}
                className="mt-1 flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#727E75] font-semibold hover:text-black transition-colors group"
              >
                Shop Now
                <ArrowRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
              </Link>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}