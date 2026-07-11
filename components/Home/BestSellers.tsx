

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react"; 
// import { ArrowRight, Star, Plus, Heart } from "lucide-react";
// import { useApp } from "@/context/AppContext"; 

// // ⚡ তানস্ট্যাক কুয়েরি হুক এবং উইশলিস্ট হুক ইমপোর্ট 
// import { useGetProductsForCustomer } from "@/hooks/useCustomerData";
// import { useWishlist } from "@/hooks/useWishlist";
// import { Product } from "@/Types/types";
// import { ShopProductSkeleton } from "../Shared/ShopProductSkeleton/ShopProductSkeleton";

// export default function BestSellers() {
//   const router = useRouter();
//   const { data: session, status } = useSession(); 
//   const { addToCart } = useApp() as any;

//   const { wishlistItems, toggleWishlist, isTogglingWishlist } = useWishlist();
//   const { data: fetchedProducts, isLoading, error } = useGetProductsForCustomer();

//   if (isLoading) {
//     return (
//       <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-12 px-4 md:px-12 text-[#2C3E35]">
//         <div className="max-w-6xl mx-auto">
//           <div className="h-8 bg-slate-200 rounded-md w-48 mb-8 animate-pulse" />
//           {/* লোডিং স্টেটেও মোবাইলে ২টি কলাম করা হলো */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
//             {[...Array(4)].map((_, idx) => (
//               <ShopProductSkeleton key={idx} />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !fetchedProducts) return null;

//   const bestSellers = [...(fetchedProducts as Product[])]
//     .filter((product) => product.promotion === "Best Sellers" && product.status === "Active")
//     .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));

//   if (bestSellers.length === 0) return null;

//   const handleBuyNow = (e: React.MouseEvent, product: Product) => {
//     e.stopPropagation();
//     addToCart(product, 1);
//     router.push("/checkout");
//   };

//   const handleWishlistClick = async (e: React.MouseEvent, product: Product) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (status === "loading" || isTogglingWishlist) return;

//     const isLoggedIn = !!session?.user;

//     if (!isLoggedIn) {
//       router.push("/signin");
//       return;
//     }

//     if (product._id) {
//       await toggleWishlist(product._id); 
//     }
//   };

//   return (
//     <section className="w-full bg-[#FAF9F6] py-12 md:py-16 px-3 sm:px-6 md:px-16 lg:px-24 relative group/section">
//       <div className="container mx-auto">
        
//         {/* SECTION HEADER */}
//         <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
//           <h2 className="font-serif text-xl md:text-3xl text-[#1E2E24] font-normal">
//             Best Sellers
//           </h2>
//           <Link href="/shop" className="flex items-center gap-1.5 text-xs md:text-sm font-sans text-[#1E2E24] font-medium hover:opacity-70 transition-opacity">
//             View All <ArrowRight size={14} />
//           </Link>
//         </div>

//         {/* 🎯 মেইন ফিক্স: মোবাইলে ২টি কার্ড দেখানোর জন্য grid-cols-2 এবং ছোট গ্যাপ (gap-3) দেওয়া হলো */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 w-full">
//           {bestSellers.map((product) => {
//             const productId = product._id || product.productCode;
            
//             const mainImage = product.commonImages?.[0] || "/placeholder.jpg";
//             const hoverImage = product.commonImages?.[1] || mainImage;
//             const subCategoryName = product.subCategory ? product.subCategory.replace("-", " ") : "";

//             const isFavorite = product._id && Array.isArray(wishlistItems)
//               ? wishlistItems.some((item: any) => item.productId?._id === product._id || item.productId === product._id) 
//               : false;

//             return (
//               <div 
//                 key={productId}
//                 onClick={() => router.push(`/product/${product.productCode}`)}
//                 className="flex flex-col bg-white rounded-xl md:rounded-2xl border border-gray-100/40 relative group overflow-hidden cursor-pointer transition-all duration-300 w-full shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
//               >
                
//                 {/* Product Image Box */}
//                 <div className="w-full aspect-square bg-[#FAF6F0] relative overflow-hidden">
//                   <Image 
//                     src={mainImage} 
//                     alt={product.name}
//                     fill
//                     sizes="(max-width: 768px) 50vw, 25vw"
//                     className={`object-cover transition-all duration-500 ${
//                       product.commonImages && product.commonImages[1] ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
//                     }`}
//                     priority={true}
//                   />

//                   {product.commonImages && product.commonImages[1] && (
//                     <Image 
//                       src={hoverImage} 
//                       alt={`${product.name} alternate`}
//                       fill
//                       sizes="(max-width: 768px) 50vw, 25vw"
//                       className="absolute inset-0 object-cover opacity-0 scale-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
//                     />
//                   )}

//                   {product.discount && (
//                     <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#FF3F6C] text-white text-[9px] md:text-[11px] font-medium px-1.5 md:px-2.5 py-0.5 rounded-full z-10">
//                       {product.discount}
//                     </span>
//                   )}

//                   <button 
//                     onClick={(e) => handleWishlistClick(e, product)}
//                     disabled={status === "loading" || isTogglingWishlist} 
//                     className={`absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center shadow-xs md:shadow-md transition-all duration-300 active:scale-90 z-10 ${
//                       isFavorite 
//                         ? "bg-[#FF3F6C] text-white" 
//                         : "bg-white text-[#2C3E30] hover:bg-[#FF3F6C] hover:text-white"
//                     } disabled:opacity-70`}
//                     title="Add to Wishlist"
//                   >
//                     <Heart size={13} fill={isFavorite ? "currentColor" : "none"} />
//                   </button>
//                 </div>

//                 {/* Product Info */}
//                 <div className="mt-1.5 flex flex-col grow justify-between px-2.5 md:px-4 pb-3 md:pb-4">
//                   <div>
//                     <span className="text-[9px] md:text-[11px] text-gray-400 uppercase tracking-wider block mb-0.5">
//                       {subCategoryName}
//                     </span>
//                     <h3 className="font-sans text-xs md:text-base font-medium text-[#1E2E24] group-hover:text-[#FF3F6C] transition-colors line-clamp-2 leading-tight mb-1">
//                       {product.name}
//                     </h3>

//                     {/* Rating System */}
//                     <div className="flex items-center gap-1">
//                       <div className="flex items-center text-amber-500 gap-0.5">
//                         {[...Array(5)].map((_, i) => (
//                           <Star 
//                             key={i} 
//                             size={10} 
//                             fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} 
//                             className={i < Math.floor(product.rating || 0) ? "text-amber-500" : "text-gray-200"} 
//                           />
//                         ))}
//                       </div>
//                       <span className="text-[10px] md:text-xs font-sans text-gray-400 font-light pt-0.5">
//                         ({product.ratingCount || 0})
//                       </span>
//                     </div>
//                   </div>

//                   {/* Price, Metric & Add to Cart Button */}
//                   <div className="flex flex-col gap-1 mt-1">
//                     <div className="text-[10px] md:text-xs text-gray-400 font-sans">
//                       Net: {product.weightOrVolume} {product.unit}
//                     </div>
                    
//                     <div className="flex items-center justify-between mb-1.5">
//                       <div className="flex flex-wrap gap-1 md:gap-2 items-center">
//                         <span className="font-sans text-sm md:text-lg font-bold text-[#1E2E24]">
//                           ৳{(product.price || 0).toLocaleString()}
//                         </span>
//                         {product.oldPrice && (
//                           <span className="text-[10px] md:text-sm text-gray-400 line-through">
//                             ৳{product.oldPrice.toLocaleString()}
//                           </span>
//                         )}
//                       </div>
                      
//                       {/* প্লাস কার্ট বাটন */}
//                       <button 
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           addToCart(product, 1);
//                         }}
//                         className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#FAF6F0] text-[#2C3E30] hover:bg-[#2C3E30] hover:text-white flex items-center justify-center shadow-xs transition-colors active:scale-95 z-10 relative border border-gray-100/30 shrink-0"
//                         title="Add to Cart"
//                       >
//                         <Plus size={14} />
//                       </button>
//                     </div>

//                     {/* BUY NOW বাটন */}
//                     <button
//                       onClick={(e) => handleBuyNow(e, product)}
//                       className="w-full py-2 md:py-2.5 bg-[#2C3E30] hover:bg-[#FF3F6C] text-white font-sans text-xs md:text-sm font-semibold rounded-lg md:rounded-xl shadow-xs transition-all duration-300 active:scale-[0.98] text-center"
//                     >
//                       Buy Now
//                     </button>

//                   </div>
//                 </div>

//               </div>
//             );
//           })}
//         </div>

//       </div>
//     </section>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { ArrowRight, Star, Heart } from "lucide-react";
import { useApp } from "@/context/AppContext"; 

import { useGetProductsForCustomer } from "@/hooks/useCustomerData";
import { useWishlist } from "@/hooks/useWishlist";
import { Product } from "@/Types/types";
import { ShopProductSkeleton } from "../Shared/ShopProductSkeleton/ShopProductSkeleton";

export default function BestSellers() {
  const router = useRouter();
  const { data: session, status } = useSession(); 
  const { addToCart } = useApp() as any;

  const { wishlistItems, toggleWishlist, isTogglingWishlist } = useWishlist();
  const { data: fetchedProducts, isLoading, error } = useGetProductsForCustomer();

  if (isLoading) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-12 px-4 md:px-12 text-[#2C3E35]">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-slate-200 rounded-md w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {[...Array(5)].map((_, idx) => (
              <ShopProductSkeleton key={idx} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !fetchedProducts) return null;

  const bestSellers = [...(fetchedProducts as Product[])]
    .filter((product) => product.promotion === "Best Sellers" && product.status === "Active")
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));

  if (bestSellers.length === 0) return null;

  const handleShopNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    router.push("/checkout");
  };

  const handleWishlistClick = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === "loading" || isTogglingWishlist) return;

    const isLoggedIn = !!session?.user;
    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }

    if (product._id) {
      await toggleWishlist(product._id); 
    }
  };

  return (
    <section className="w-full bg-[#FAF9F6] py-12 md:py-16 px-3 sm:px-6 md:px-12 xl:px-20 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
          <h2 className="font-serif text-xl md:text-3xl text-[#1E2E24] font-normal tracking-wide">
            Best Sellers
          </h2>
          <Link href="/shop" className="flex items-center gap-1 text-xs md:text-sm font-sans text-[#1E2E24] font-medium hover:opacity-70 transition-opacity">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* 🎯 মেইন গ্রিড: লার্জ স্ক্রিনে ৫টি কলাম (xl:grid-cols-5) এবং টাইট গ্যাপ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 w-full">
          {bestSellers.map((product) => {
            const productId = product._id || product.productCode;
            const mainImage = product.commonImages?.[0] || "/placeholder.jpg";
            const hoverImage = product.commonImages?.[1] || mainImage;

            const isFavorite = product._id && Array.isArray(wishlistItems)
              ? wishlistItems.some((item: any) => item.productId?._id === product._id || item.productId === product._id) 
              : false;

            return (
              <div 
                key={productId}
                onClick={() => router.push(`/product/${product.productCode}`)}
                className="flex flex-col bg-white rounded-2xl border border-gray-100 p-2.5 group cursor-pointer transition-all duration-300 w-full hover:shadow-md"
              >
                {/* Product Image Box (হুবহু ছবির মতো লাইট শেইপ ও হাইট) */}
                <div className="w-full aspect-[1.1/1] sm:aspect-square bg-[#F5F5F5] rounded-xl relative overflow-hidden shrink-0">
                  <Image 
                    src={mainImage} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />

                  {product.commonImages && product.commonImages[1] && (
                    <Image 
                      src={hoverImage} 
                      alt={`${product.name} alternate`}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  )}

                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-[#1B3B22] text-white text-[9px] font-medium px-2 py-0.5 rounded-full z-10">
                      {product.discount} off
                    </span>
                  )}

                  <button 
                    onClick={(e) => handleWishlistClick(e, product)}
                    disabled={status === "loading" || isTogglingWishlist} 
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center shadow-xs text-[#2C3E30] hover:bg-white z-10"
                  >
                    <Heart size={13} fill={isFavorite ? "#FF3F6C" : "none"} className={isFavorite ? "text-[#FF3F6C]" : "text-gray-600"} />
                  </button>
                </div>

                {/* Info Area */}
                <div className="mt-3 flex flex-col grow justify-between text-center items-center px-1">
                  <div className="w-full flex flex-col items-center">
                    <h3 className="font-sans text-xs md:text-[13px] font-semibold text-gray-800 line-clamp-1 mb-1 w-full">
                      {product.name}
                    </h3>

                    {/* ⭐ Rating (Best Sellers এ থাকছে) */}
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={11} 
                            fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} 
                            className="text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-sans text-gray-500 font-medium">
                        ({product.rating ? product.rating.toFixed(1) : "0.0"})
                      </span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="w-full mt-1">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <span className="font-sans text-xs md:text-sm font-bold text-gray-900">
                        ৳{product.price.toFixed(2)}
                      </span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="text-[10px] md:text-xs text-gray-400 line-through">
                          ৳{product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* 🟢 SHOP NOW বাটন (হুবহু ছবির মতো ডার্ক গ্রিন এলিগ্যান্ট ডিজাইন) */}
                    <button
                      onClick={(e) => handleShopNow(e, product)}
                      className="w-full py-1.5 bg-[#12221A] hover:bg-[#1c3529] text-white font-sans text-[10px] md:text-xs font-semibold rounded-md tracking-wider uppercase transition-colors"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}