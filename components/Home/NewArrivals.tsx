// "use client";

// import React, { useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { ArrowRight, Star, Plus } from "lucide-react";
// import { useApp } from "@/context/AppContext"; 

// // ⚡ তানস্ট্যাক কুয়েরি হুক ইমপোর্ট করা হলো (লোকাল JSON এর পরিবর্তে)
// import { useGetProductsForCustomer } from "@/hooks/useCustomerData";
// import { Product } from "@/Types/types";
// import CarouselButtons from "../Button/CarouselButtons";

// export default function NewArrivals() {
//   const { addToCart } = useApp();
//   const gridContainerRef = useRef<HTMLDivElement>(null);

//   // ⚡ ডাটাবেজ থেকে রিয়েল-টাইম প্রোডাক্ট ডাটা ফেচ করা হচ্ছে
//   const { data: fetchedProducts, isLoading, error } = useGetProductsForCustomer();

//   // লোডিং অবস্থায় ব্যাকগ্রাউন্ড ব্রেক না করে ক্লিন মেসেজ শো করা
//   if (isLoading) {
//     return <div className="py-16 text-center text-gray-500 font-sans">Loading New Arrivals...</div>;
//   }

//   // কোনো এরর থাকলে বা ডাটা না পাওয়া গেলে সেকশনটি দেখাবে না
//   if (error || !fetchedProducts) return null;

//   // ১. শুধুমাত্র "New Arrivals" ফিল্টার এবং createdAt ডেট অনুযায়ী (নতুন থেকে পুরাতন) সর্ট করা
//   const newArrivals = [...(fetchedProducts as Product[])]
//     .filter((product) => product.promotion === "New Arrivals")
//     .sort((a, b) => {
//       const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//       const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//       return dateB - dateA;
//     });

//   // প্রোডাক্টের সংখ্যা ৫টির বেশি কি না তা যাচাই করার কন্ডিশন
//   const hasMoreThanFive = newArrivals.length > 5;

//   // ২. ডানে ও বামে স্মুথ স্ক্রোল করার ফাংশন
//   const handleScroll = (direction: "left" | "right") => {
//     if (gridContainerRef.current) {
//       const { scrollLeft, clientWidth } = gridContainerRef.current;
//       const scrollAmount = clientWidth * 0.4; 
      
//       gridContainerRef.current.scrollTo({
//         left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   // যদি কোনো নিউ অ্যারাইভাল প্রোডাক্ট না থাকে, তবে সেকশনটি রেন্ডার হবে না
//   if (newArrivals.length === 0) return null;

//   return (
//     <section className="w-full bg-[#FAF9F6] py-16 px-6 md:px-16 lg:px-24 border-t border-gray-100/50 relative group/section">
//       <div className="container mx-auto">
        
//         {/* SECTION HEADER */}
//         <div className="flex items-center justify-between mb-10">
//           <h2 className="font-serif text-2xl md:text-3xl text-[#1E2E24] font-normal">
//             New Arrivals
//           </h2>
//           <Link href="/shop" className="flex items-center gap-1.5 text-xs md:text-sm font-sans text-[#1E2E24] font-medium hover:opacity-70 transition-opacity">
//             View All <ArrowRight size={14} />
//           </Link>
//         </div>

//         {/* PRODUCT CARDS AREA WITH SEPARATED BUTTONS */}
//         <div className="relative w-full">
          
//           {/* কাস্টম বাটন কন্ট্রোলার */}
//           <CarouselButtons 
//             onScrollLeft={() => handleScroll("left")}
//             onScrollRight={() => handleScroll("right")}
//             showButtons={hasMoreThanFive} 
//           />

//           {/* PRODUCT CARDS GRID / SLIDER */}
//           <div 
//             ref={gridContainerRef}
//             className={`w-full gap-5 scrollbar-none pb-4 snap-x snap-mandatory ${
//               hasMoreThanFive 
//                 ? "flex overflow-x-auto" 
//                 : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
//             }`}
//           >
//             {newArrivals.map((product) => (
//               <div 
//                 key={product._id || product.productCode} // মঙ্গোডিবি ইউনিক আইডি ম্যাপ করা হলো
//                 className={`flex flex-col bg-white rounded-2xl pb-4 shadow-[0_4px_20px_rgba(0,0,0,0.012)] border border-gray-100/40 relative group overflow-hidden snap-start ${
//                   hasMoreThanFive ? "min-w-[46%] md:min-w-[31%] lg:min-w-[18.8%]" : ""
//                 }`}
//               >
                
//                 {/* Product Image Box */}
//                 <div className="w-full aspect-square rounded-t-2xl bg-[#FAF6F0] relative overflow-hidden">
//                   <Image 
//                     src={product.images[0]} 
//                     alt={product.name}
//                     fill
//                     sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
//                     className={`object-cover transition-all duration-500 ${
//                       product.images[1] ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
//                     }`}
//                     priority={true}
//                   />

//                   {product.images[1] && (
//                     <Image 
//                       src={product.images[1]} 
//                       alt={`${product.name} alternate`}
//                       fill
//                       sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
//                       className="absolute inset-0 object-cover opacity-0 scale-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
//                     />
//                   )}

//                   {product.discount && (
//                     <span className="absolute top-3 left-3 bg-[#354536] text-white text-[10px] font-medium px-2 py-0.5 rounded-full z-10">
//                       {product.discount}
//                     </span>
//                   )}
//                 </div>

//                 {/* Product Info */}
//                 <div className="mt-4 flex flex-col grow justify-between px-3">
//                   <div>
//                     <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
//                       {product.subCategory}
//                     </span>
//                     <h3 className="font-sans text-xs md:text-sm font-medium text-[#1E2E24] line-clamp-2 h-10 leading-snug">
//                       {product.name}
//                     </h3>

//                     {/* Rating */}
//                     <div className="flex items-center gap-1.5 my-3">
//                       <div className="flex items-center text-[#9BA69C] gap-0.5">
//                         {[...Array(5)].map((_, i) => (
//                           <Star 
//                             key={i} 
//                             size={11} 
//                             fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} 
//                             className="text-[#9BA69C]" 
//                           />
//                         ))}
//                       </div>
//                       <span className="text-[10px] font-sans text-gray-400 font-light">
//                         ({product.ratingCount || 0})
//                       </span>
//                     </div>
//                   </div>

//                   {/* Price & Cart Button */}
//                   <div className="flex items-center justify-between mt-2">
//                     <div className="flex flex-col">
//                       <span className="font-sans text-sm md:text-base font-semibold text-[#1E2E24]">
//                         ${product.price.toFixed(2)}
//                       </span>
//                       {product.oldPrice && (
//                         <span className="text-xs text-gray-400 line-through -mt-1">
//                           ${product.oldPrice.toFixed(2)}
//                         </span>
//                       )}
//                     </div>
                    
//                     <button 
//                       onClick={() => addToCart(product, 1)}
//                       className="w-8 h-8 rounded-full bg-[#2C3E30] hover:bg-[#1A261D] text-white flex items-center justify-center shadow-sm transition-colors active:scale-95"
//                       title="Add to Cart"
//                     >
//                       <Plus size={16} />
//                     </button>
//                   </div>
//                 </div>

//               </div>
//             ))}
//           </div>

//         </div>

//       </div>
//     </section>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext"; 

// ⚡ তানস্ট্যাক কুয়েরি হুক ইমপোর্ট (লোকাল JSON এর পরিবর্তে)
import { useGetProductsForCustomer } from "@/hooks/useCustomerData";

import CarouselButtons from "../Button/CarouselButtons";
import { Product } from "@/Types/types";

export default function NewArrivals() {
  const { addToCart } = useApp() as any;
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // ⚡ ডাটাবেজ থেকে রিয়েল-টাইম প্রোডাক্ট ডাটা ফেচ করা হচ্ছে
  const { data: fetchedProducts, isLoading, error } = useGetProductsForCustomer();

  // লোডিং অবস্থায় ব্যাকগ্রাউন্ড ব্রেক না করে ক্লিন মেসেজ শো করা
  if (isLoading) {
    return (
      <div className="w-full bg-[#FAF9F6] py-16 px-6 md:px-16 lg:px-24 border-t border-gray-100/50">
        <div className="container mx-auto text-center text-gray-400 font-sans animate-pulse">
          Loading New Arrivals...
        </div>
      </div>
    );
  }

  // কোনো এরর থাকলে বা ডাটা না পাওয়া গেলে সেকশনটি দেখাবে না
  if (error || !fetchedProducts) return null;

  // ১. শুধুমাত্র "New Arrivals" ফিল্টার এবংcreatedAt ডেট অনুযায়ী (নতুন থেকে পুরাতন) সর্ট করা
  const newArrivals = [...(fetchedProducts as Product[])]
    .filter((product) => product.promotion === "New Arrivals" && product.status === "Active")
    .sort((a, b) => {
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  // প্রোডাক্টের সংখ্যা ৫টির বেশি কি না তা যাচাই করার কন্ডিশন
  const hasMoreThanFive = newArrivals.length > 5;

  // ২. ডানে ও বামে স্মুথ স্ক্রোল করার ফাংশন
  const handleScroll = (direction: "left" | "right") => {
    if (gridContainerRef.current) {
      const { scrollLeft, clientWidth } = gridContainerRef.current;
      const scrollAmount = clientWidth * 0.4; 
      
      gridContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // যদি কোনো নিউ অ্যারাইভাল প্রোডাক্ট না থাকে, তবে সেকশনটি রেন্ডার হবে না
  if (newArrivals.length === 0) return null;

  return (
    <section className="w-full bg-[#FAF9F6] py-16 px-6 md:px-16 lg:px-24 border-t border-gray-100/50 relative group/section">
      <div className="container mx-auto">
        
        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-2xl md:text-3xl text-[#1E2E24] font-normal">
            New Arrivals
          </h2>
          <Link href="/shop" className="flex items-center gap-1.5 text-xs md:text-sm font-sans text-[#1E2E24] font-medium hover:opacity-70 transition-opacity">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* PRODUCT CARDS AREA WITH SEPARATED BUTTONS */}
        <div className="relative w-full">
          
          {/* কাস্টম বাটন কন্ট্রোলার */}
          <CarouselButtons 
            onScrollLeft={() => handleScroll("left")}
            onScrollRight={() => handleScroll("right")}
            showButtons={hasMoreThanFive} 
          />

          {/* PRODUCT CARDS GRID / SLIDER */}
          <div 
            ref={gridContainerRef}
            className={`w-full gap-5 scrollbar-none pb-4 snap-x snap-mandatory ${
              hasMoreThanFive 
                ? "flex overflow-x-auto" 
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
            }`}
          >
            {newArrivals.map((product) => {
              const productId = product._id || product.productCode;
              
              // নতুন ডাটা স্ট্রাকচার অনুযায়ী ভেরিয়েবল ডিফাইন
              const mainImage = product.commonImages?.[0] || "/placeholder.jpg";
              const hoverImage = product.commonImages?.[1] || mainImage;
              const subCategoryName = product.subCategory ? product.subCategory.replace("-", " ") : "";

              return (
                <div 
                  key={productId}
                  className={`flex flex-col bg-white rounded-2xl pb-4 shadow-[0_4px_20px_rgba(0,0,0,0.012)] border border-gray-100/40 relative group overflow-hidden snap-start ${
                    hasMoreThanFive ? "min-w-[46%] md:min-w-[31%] lg:min-w-[18.8%]" : ""
                  }`}
                >
                  
                  {/* Product Image Box */}
                  <div className="w-full aspect-square rounded-t-2xl bg-[#FAF6F0] relative overflow-hidden">
                    <Image 
                      src={mainImage} 
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className={`object-cover transition-all duration-500 ${
                        product.commonImages && product.commonImages[1] ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
                      }`}
                      priority={true}
                    />

                    {product.commonImages && product.commonImages[1] && (
                      <Image 
                        src={hoverImage} 
                        alt={`${product.name} alternate`}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="absolute inset-0 object-cover opacity-0 scale-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                      />
                    )}

                    {product.discount && (
                      <span className="absolute top-3 left-3 bg-[#FF3F6C] text-white text-[10px] font-medium px-2 py-0.5 rounded-full z-10">
                        {product.discount}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mt-4 flex flex-col grow justify-between px-3">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                        {subCategoryName}
                      </span>
                      <Link href={`/product/${productId}`}>
                        <h3 className="font-sans text-xs md:text-sm font-medium text-[#1E2E24] hover:text-[#FF3F6C] transition-colors line-clamp-2 h-10 leading-snug mb-1">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 my-2">
                        <div className="flex items-center text-amber-500 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={11} 
                              fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} 
                              className={i < Math.floor(product.rating || 0) ? "text-amber-500" : "text-gray-200"} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-sans text-gray-400 font-light">
                          ({product.ratingCount || 0})
                        </span>
                      </div>
                    </div>

                    {/* Price, Weight & Cart Button */}
                    <div className="flex flex-col gap-1 mt-2">
                      {/* ওজনের বিবরণী যুক্ত করা হলো */}
                      <div className="text-[10px] text-gray-400 font-sans">
                        Net: {product.weightOrVolume} {product.unit}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-sans text-sm md:text-base font-semibold text-[#1E2E24]">
                            ৳{(product.price || 0).toLocaleString()}
                          </span>
                          {product.oldPrice && (
                            <span className="text-xs text-gray-400 line-through -mt-0.5">
                              ৳{product.oldPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => addToCart(product, 1)}
                          className="w-8 h-8 rounded-full bg-[#2C3E30] hover:bg-[#FF3F6C] text-white flex items-center justify-center shadow-sm transition-colors active:scale-95"
                          title="Add to Cart"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}