// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, EffectFade, Pagination } from "swiper/modules";
// import { ArrowRight, Leaf, Heart, Shield, RotateCw } from "lucide-react";
// import Link from "next/link";

// // Swiper CSS styles import
// import "swiper/css";
// import "swiper/css/effect-fade";
// import "swiper/css/pagination";


// const slides = [
//   {
//     id: 1,
//     brand: "CeraVe",
//     title: "Good for your skin. Better for you.",
//     subtitle:
//       "High performance beauty with clean, powerful ingredients that truly care.",
//     image: "/Hero/centella.png", 
//     buttonText: "Shop Cleansers",
//     primaryLink: `/shop?subCategory=${encodeURIComponent("Cleanser")}`, 
//     secondaryLink: "/ingredients/cerave", 
//     linkText: "Explore Ingredients",
//   },
//   {
//     id: 2,
//     brand: "Pond's",
//     title: "Nourish deeply. Glow naturally.",
//     subtitle:
//       "Botanical extracts and active vitamins designed to restore your skin's vibrant health.",
//     image: "/Hero/ponds.png", 
//     buttonText: "Shop Moisturizers",
//     primaryLink: `/shop?subCategory=${encodeURIComponent("Moisturizers")}`, 
//     secondaryLink: "/philosophy",
//     linkText: "Our Philosophy",
//   },
//   {
//     id: 3,
//     brand: "Centella",
//     title: "Pure elements. Real results.",
//     subtitle:
//       "Earthy simplicity backed by clean science for a radiant, perfectly balanced complexion.",
//     image: "/Hero/cerave.png", 
//     buttonText: "Shop Serums & Oils",
//     primaryLink: `/shop?subCategory=${encodeURIComponent("Serums & Oils")}`, 
//     secondaryLink: "/clinical-studies",
//     linkText: "Clinical Studies",
//   },
// ];

// export default function HeroSection() {
//   return (
//     <section className="relative w-full h-167.5 md:h-175 overflow-hidden">
//       <Swiper
//         modules={[Autoplay, EffectFade, Pagination]}
//         effect={"fade"}
//         speed={1000}
//         autoplay={{
//           delay: 5000,
//           disableOnInteraction: false,
//         }}
//         pagination={{
//           clickable: true,
//           el: ".custom-swiper-pagination",
//         }}
//         className="w-full h-full"
//       >
//         {slides.map((slide) => (
//           <SwiperSlide key={slide.id} className="relative w-full">
//             <div
//               className="absolute inset-0 w-full h-full bg-cover bg-center lg:bg-[center_right_-50px] xl:bg-center transition-transform duration-[5000ms]"
//               style={{ backgroundImage: `url(${slide.image})` }}
//             />

//             {/* FOREGROUND CONTENT LAYER */}
//             <div className="container mx-auto h-full grid grid-cols-1 lg:grid-cols-12 items-center px-4 relative z-10">
//               <div className="col-span-1 lg:col-span-6 flex flex-col justify-center mt-8 lg:mt-0">
//                 {/* Brand Tag */}
//                 <span className="text-xs uppercase tracking-[0.2em] text-[#727E75] font-semibold mb-3">
//                   {slide.brand} Essentials
//                 </span>

//                 {/* Main Heading */}
//                 <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E2E24] leading-[1.15] font-light tracking-tight max-w-[520px]">
//                   {slide.title}
//                 </h1>

//                 {/* Subtitle */}
//                 <p className="mt-6 text-[#5E6A60] font-sans text-base md:text-lg max-w-[460px] leading-relaxed">
//                   {slide.subtitle}
//                 </p>

//                 {/* Buttons Group (Next.js Link Wrapped) */}
//                 <div className="mt-8 flex items-center flex-wrap gap-6">
//                   {/* 🎯 প্রথম বাটন: সরাসরি শপ পেজে সিলেক্টেড সাব-ক্যাটাগরি ফিল্টারে নিয়ে যাবে */}
//                   <Link 
//                     href={slide.primaryLink}
//                     className="bg-[#354536] hover:bg-[#263327] text-white font-sans text-sm md:text-base font-medium px-8 py-3.5 rounded-lg shadow-sm transition-all duration-300 text-center cursor-pointer"
//                   >
//                     {slide.buttonText}
//                   </Link>

//                   {/* দ্বিতীয় বাটন */}
//                   <Link
//                     href={slide.secondaryLink}
//                     className="flex items-center gap-2 text-[#354536] border border-[#354536] px-8 py-3.5 rounded-lg hover:text-black font-medium text-sm md:text-base transition-colors group cursor-pointer bg-white/20 backdrop-blur-2xs hover:bg-white/40"
//                   >
//                     {slide.linkText}
//                     <ArrowRight
//                       size={18}
//                       className="transform group-hover:translate-x-1 transition-transform"
//                     />
//                   </Link>
//                 </div>

//                 {/* BOTTOM TRUST BADGES */}
//                 <div className="mt-4 pt-8 grid grid-cols-4 gap-2 md:gap-4 max-w-[370px] text-[#354536]">
//                   <div className="flex flex-col">
//                     <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-2 shadow-sm">
//                       <Leaf size={18} strokeWidth={1.5} />
//                     </div>
//                     <span className="text-[10px] md:text-xs font-semibold">Clean</span>
//                     <span className="text-[10px] text-[#727E75] -mt-0.5">Ingredients</span>
//                   </div>

//                   <div className="flex flex-col">
//                     <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-2 shadow-sm">
//                       <Heart size={18} strokeWidth={1.5} />
//                     </div>
//                     <span className="text-[10px] md:text-xs font-semibold">Visible</span>
//                     <span className="text-[10px] text-[#727E75] -mt-0.5">Results</span>
//                   </div>

//                   <div className="flex flex-col">
//                     <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-2 shadow-sm">
//                       <Shield size={18} strokeWidth={1.5} />
//                     </div>
//                     <span className="text-[10px] md:text-xs font-semibold">Safe for</span>
//                     <span className="text-[10px] text-[#727E75] -mt-0.5">Sensitive Skin</span>
//                   </div>

//                   <div className="flex flex-col">
//                     <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-2 shadow-sm">
//                       <RotateCw size={16} strokeWidth={1.5} />
//                     </div>
//                     <span className="text-[10px] md:text-xs font-semibold">Sustainable</span>
//                     <span className="text-[10px] text-[#727E75] -mt-0.5">Packaging</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {/* MINIMALIST PAGINATION DOTS */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-24 lg:translate-x-0 z-30 flex justify-center">
//         <div className="custom-swiper-pagination flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm" />
//       </div>

//       <style jsx global>{`
//         .custom-swiper-pagination .swiper-pagination-bullet {
//           width: 8px;
//           height: 8px;
//           background: #d1c9bf !important;
//           opacity: 1;
//           transition: all 0.3s ease;
//           border-radius: 9999px;
//         }
//         .custom-swiper-pagination .swiper-pagination-bullet-active {
//           width: 24px !important;
//           background: #354536 !important;
//         }
//       `}</style>
//     </section>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Leaf, Heart, Shield, RotateCw } from "lucide-react";
import Link from "next/link";

// Swiper CSS styles import
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    brand: "CeraVe",
    title: "Good for your skin. Better for you.",
    subtitle:
      "High performance beauty with clean, powerful ingredients that truly care.",
    image: "/Hero/centella.png", 
    buttonText: "Shop Cleansers",
    primaryLink: `/shop?subCategory=${encodeURIComponent("Cleanser")}`, 
  },
  {
    id: 2,
    brand: "Pond's",
    title: "Nourish deeply. Glow naturally.",
    subtitle:
      "Botanical extracts and active vitamins designed to restore your skin's vibrant health.",
    image: "/Hero/ponds.png", 
    buttonText: "Shop Moisturizers",
    primaryLink: `/shop?subCategory=${encodeURIComponent("Moisturizers")}`, 
  },
  {
    id: 3,
    brand: "Centella",
    title: "Pure elements. Real results.",
    subtitle:
      "Earthy simplicity backed by clean science for a radiant, perfectly balanced complexion.",
    image: "/Hero/cerave.png", 
    buttonText: "Shop Serums & Oils",
    primaryLink: `/shop?subCategory=${encodeURIComponent("Serums & Oils")}`, 
  },
];

export default function HeroSection() {
  return (
    <section className="relative w-full h-[460px] md:h-175 overflow-hidden">
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
          <SwiperSlide key={slide.id} className="relative w-full">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center lg:bg-[center_right_-50px] xl:bg-center transition-transform duration-[5000ms]"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* FOREGROUND CONTENT LAYER */}
            <div className="container mx-auto h-full grid grid-cols-1 lg:grid-cols-12 items-center px-4 relative z-10">
              <div className="col-span-1 lg:col-span-6 flex flex-col justify-center mt-2 lg:mt-0">
                {/* Brand Tag */}
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#727E75] font-semibold mb-1.5 md:mb-3">
                  {slide.brand} Essentials
                </span>

                {/* Main Heading */}
                <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-[#1E2E24] leading-[1.2] lg:leading-[1.15] font-light tracking-tight max-w-[520px]">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="mt-3 md:mt-6 text-[#5E6A60] font-sans text-xs sm:text-sm md:text-lg max-w-[460px] leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Button Group */}
                <div className="mt-5 md:mt-8 flex items-center gap-6">
                  <Link 
                    href={slide.primaryLink}
                    className="bg-[#354536] hover:bg-[#263327] text-white font-sans text-xs md:text-base font-medium px-6 md:px-8 py-2.5 md:py-3.5 rounded-lg shadow-sm transition-all duration-300 text-center cursor-pointer"
                  >
                    {slide.buttonText}
                  </Link>
                </div>

                {/* BOTTOM TRUST BADGES */}
                {/* ⚡ ফিক্সড: মোবাইলের জন্য flex ও tight gap ব্যবহার করা হয়েছে যাতে দূরে দূরে না যায় */}
                <div className="mt-5 pt-4 md:pt-8 flex flex-wrap gap-x-4 gap-y-3 md:grid md:grid-cols-4 md:gap-4 max-w-sm md:max-w-[370px] text-[#354536]">
                  
                  {/* Item 1 */}
                  <div className="flex flex-col items-start max-w-[70px] md:max-w-none">
                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-1 md:mb-2 shadow-sm">
                      <Leaf className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
                    </div>
                    <span className="text-[9px] md:text-xs font-semibold leading-tight">Clean</span>
                    <span className="text-[8px] md:text-[10px] text-[#727E75] -mt-0.5 leading-tight truncate w-full">Ingredients</span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex flex-col items-start max-w-[70px] md:max-w-none">
                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-1 md:mb-2 shadow-sm">
                      <Heart className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
                    </div>
                    <span className="text-[9px] md:text-xs font-semibold leading-tight">Visible</span>
                    <span className="text-[8px] md:text-[10px] text-[#727E75] -mt-0.5 leading-tight truncate w-full">Results</span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex flex-col items-start max-w-18.75 md:max-w-none">
                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-1 md:mb-2 shadow-sm">
                      <Shield className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
                    </div>
                    <span className="text-[9px] md:text-xs font-semibold leading-tight">Safe for</span>
                    <span className="text-[8px] md:text-[10px] text-[#727E75] -mt-0.5 leading-tight break-words md:break-normal">Sensitive Skin</span>
                  </div>

                  {/* Item 4 */}
                  <div className="flex flex-col items-start max-w-[75px] md:max-w-none">
                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#354536] mb-1 md:mb-2 shadow-sm">
                      <RotateCw className="w-3 h-3 md:w-4 md:h-4" strokeWidth={1.5} />
                    </div>
                    <span className="text-[9px] md:text-xs font-semibold leading-tight">Sustainable</span>
                    <span className="text-[8px] md:text-[10px] text-[#727E75] -mt-0.5 leading-tight break-words md:break-normal">Packaging</span>
                  </div>

                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* MINIMALIST PAGINATION DOTS */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-24 lg:translate-x-0 z-30 flex justify-center">
        <div className="custom-swiper-pagination flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm" />
      </div>

      <style jsx global>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #d1c9bf !important;
          opacity: 1;
          transition: all 0.3s ease;
          border-radius: 9999px;
          cursor: pointer;
        }
        @media (min-width: 768px) {
          .custom-swiper-pagination .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
          }
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          width: 18px !important;
          background: #354536 !important;
        }
        @media (min-width: 768px) {
          .custom-swiper-pagination .swiper-pagination-bullet-active {
            width: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}