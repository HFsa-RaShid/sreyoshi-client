"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { ArrowRight, Leaf, Heart, Shield, RotateCw } from "lucide-react";

// Swiper CSS styles import
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// 3 slides curated for CeraVe, Pond's, and Centella with studio backgrounds
const slides = [
  {
    id: 1,
    brand: "CeraVe",
    title: "Good for your skin. Better for you.",
    subtitle: "High performance beauty with clean, powerful ingredients that truly care.",
    image: "/Hero/centella.png", // Your CeraVe image asset
    buttonText: "Shop Now",
    linkText: "Explore Ingredients",
  },
  {
    id: 2,
    brand: "Pond's",
    title: "Nourish deeply. Glow naturally.",
    subtitle: "Botanical extracts and active vitamins designed to restore your skin's vibrant health.",
    image: "/Hero/ponds.png", // Pond's setup asset split
    buttonText: "Shop New In",
    linkText: "Our Philosophy",
  },
  {
    id: 3,
    brand: "Centella",
    title: "Pure elements. Real results.",
    subtitle: "Earthy simplicity backed by clean science for a radiant, perfectly balanced complexion.",
    image: "/Hero/cerave.png", // Centella setup asset split
    buttonText: "Shop Serums",
    linkText: "Clinical Studies",
  }
];

export default function HeroSection() {
  return (
    <section className="relative w-full h-[690px] md:h-[950px] overflow-hidden">
      
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect={"fade"}
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".custom-swiper-pagination",
        }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full ">
            
            
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center lg:bg-[center_right_-50px] xl:bg-center transition-transform duration-[5000ms] "
              style={{ backgroundImage: `url(${slide.image})` }}
            />
           

            {/* FOREGROUND CONTENT LAYER */}
            <div className=" container mx-auto h-full grid grid-cols-1 lg:grid-cols-12 items-center px-4 relative z-10">
              
           
              <div className="col-span-1 lg:col-span-6 flex flex-col justify-center mt-8 lg:mt-0">
                
                {/* Brand Tag */}
                <span className="text-xs uppercase tracking-[0.2em] text-[#727E75] font-semibold mb-3">
                  {slide.brand} Essentials
                </span>

                {/* Main Heading */}
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E2E24] leading-[1.15] font-light tracking-tight max-w-[520px]">
                  {slide.title}
                </h1>
                
                {/* Subtitle */}
                <p className="mt-6 text-[#5E6A60] font-sans text-base md:text-lg max-w-[460px] leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Buttons */}
                <div className="mt-8 flex items-center flex-wrap gap-6">
                  <button className="bg-[#354536] hover:bg-[#263327] text-white font-sans text-sm md:text-base font-medium px-8 py-3.5 rounded-lg shadow-sm transition-all duration-300">
                    {slide.buttonText}
                  </button>

                  <a href="#" className="flex items-center gap-2 text-[#354536] border border-[[#354536] px-8 py-3.5 rounded-lg hover:text-black font-medium text-sm md:text-base transition-colors group">
                    {slide.linkText}
                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* BOTTOM TRUST BADGES (Perfect layout match) */}
                <div className="mt-4 pt-8 grid grid-cols-4 gap-2 md:gap-4 max-w-[370px] text-[#354536]">
                  <div className="flex flex-col ">
                    <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-2 shadow-sm">
                      <Leaf size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold ">Clean</span>
                    <span className="text-[10px] text-[#727E75] -mt-0.5">Ingredients</span>
                  </div>

                  <div className="flex flex-col ">
                    <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-2 shadow-sm">
                      <Heart size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold">Visible</span>
                    <span className="text-[10px] text-[#727E75] -mt-0.5">Results</span>
                  </div>

                  <div className="flex flex-col ">
                    <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-2 shadow-sm">
                      <Shield size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold ">Safe for</span>
                    <span className="text-[10px] text-[#727E75] -mt-0.5">Sensitive Skin</span>
                  </div>

                  <div className="flex flex-col">
                    <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-2 shadow-sm">
                      <RotateCw size={16} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold">Sustainable</span>
                    <span className="text-[10px] text-[#727E75] -mt-0.5">Packaging</span>
                  </div>
                </div>

              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* MINIMALIST PAGINATION DOTS (Absolute Positioned over Swiper) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-24 lg:translate-x-0 z-30 flex justify-center">
        <div className="custom-swiper-pagination flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm" />
      </div>

      {/* Custom Styles overrides for Swiper active transitions */}
      <style jsx global>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #D1C9BF !important;
          opacity: 1;
          transition: all 0.3s ease;
          border-radius: 9999px;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          width: 24px !important;
          background: #354536 !important;
        }
      `}</style>
    </section>
  );
}