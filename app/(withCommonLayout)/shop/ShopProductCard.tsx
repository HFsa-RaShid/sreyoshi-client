// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import React from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react"; 
// import { Star, Heart, Eye, ShoppingBag } from "lucide-react";
// import { Product } from "@/Types/types";
// import { useWishlist } from "@/hooks/useWishlist"; 

// interface ShopProductCardProps {
//   product: Product;
//   addToCart: (product: Product) => void;
// }

// export default function ShopProductCard({
//   product,
//   addToCart,
// }: ShopProductCardProps) {
//   const router = useRouter();
//   const { data: session, status } = useSession(); 
  
//   const { wishlistItems, toggleWishlist, isTogglingWishlist } = useWishlist();

//   const categoryName = typeof product.category === "object" ? product.category?.name : product.subCategory;
//   const firstImage = product.commonImages?.[0] || "/placeholder.png";
//   const secondImage = product.commonImages?.[1] || firstImage;

//   const isFavorite = product._id && Array.isArray(wishlistItems)
//     ? wishlistItems.some((item: any) => item.productId?._id === product._id || item.productId === product._id) 
//     : false;

//   const handleWishlistClick = async (e: React.MouseEvent) => {
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
//     <div className="group relative flex flex-col bg-white">
//       {/* IMAGE WRAPPER */}
//       <div className="relative aspect-[4/5] w-full bg-[#EAE7DC] overflow-hidden mb-3 shadow-sm cursor-pointer">
//         <div
//           className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out lg:group-hover:opacity-0"
//           style={{ backgroundImage: `url(${firstImage})` }}
//         />
//         <div
//           className="absolute inset-0 w-full h-full bg-cover bg-center scale-100 lg:group-hover:scale-105 transition-all duration-700 ease-in-out opacity-0 lg:group-hover:opacity-100"
//           style={{ backgroundImage: `url(${secondImage})` }}
//         />
        
//         {product.discount && (
//           <span className="absolute top-4 left-4 bg-[#1A2E22] text-white font-sans text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
//             {product.discount} OFF
//           </span>
//         )}

//         {/* 🎯 ACTIONS (মোবাইলে সব সময় দৃশ্যমান, ল্যাপটপ/ডেস্কটপে হোভার করলে আসবে) */}
//         <div className="absolute right-4 top-4 flex flex-col gap-2 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
//           <button 
//             onClick={handleWishlistClick}
//             disabled={status === "loading" || isTogglingWishlist} 
//             className={`p-2 rounded-full shadow-md transition-colors ${
//               isFavorite 
//                 ? "bg-[#FF3F6C] text-white" 
//                 : "bg-white text-[#1A2E22] hover:bg-[#1A2E22] hover:text-white"
//             } disabled:opacity-70`}
//           >
//             <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
//           </button>

//           <Link href={`/product/${product.productCode}`} className="bg-white text-[#1A2E22] p-2 rounded-full shadow-md hover:bg-[#1A2E22] hover:text-white transition-colors flex items-center justify-center">
//             <Eye size={16} />
//           </Link>

//           <button 
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               addToCart(product);
//             }}
//             disabled={product.availability === "Out of Stock"}
//             className={`p-2 rounded-full shadow-md transition-colors ${product.availability === "Out of Stock" ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#1A2E22] hover:bg-[#1A2E22] hover:text-white"}`}
//           >
//             <ShoppingBag size={16} />
//           </button>
//         </div>
//       </div>

//       {/* Metadata */}
//       <div className="flex justify-between items-start px-5 py-2">
//         <div>
//           <span className="text-xs text-gray-400 font-medium block mb-0.5 capitalize">{categoryName}</span>
//           <h4 className="font-serif font-bold text-base text-[#1A2E22] group-hover:text-black transition-colors line-clamp-1">{product.name}</h4>
//         </div>
//         <div className="flex items-center gap-1 text-xs font-bold text-[#1A2E22] mt-0.5 shrink-0">
//           <Star size={14} fill="currentColor" className="text-amber-400" />
//           <span>{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
//           <span className="text-gray-400 font-normal text-[10px]">({product.ratingCount || 0})</span>
//         </div>
//       </div>

//       <div className="flex items-center gap-2 mt-1 px-5 py-2">
//         <span className="text-[#CDA275] font-bold text-base">৳{product.price.toFixed(2)}</span>
//         {product.oldPrice && product.oldPrice > product.price && (
//           <span className="text-gray-400 line-through text-xs">৳{product.oldPrice.toFixed(2)}</span>
//         )}
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { Star, Heart, Plus } from "lucide-react";
import { Product } from "@/Types/types";
import { useWishlist } from "@/hooks/useWishlist"; 

interface ShopProductCardProps {
  product: Product;
  addToCart: (product: Product, quantity: number) => void;
}

export default function ShopProductCard({
  product,
  addToCart,
}: ShopProductCardProps) {
  const router = useRouter();
  const { data: session, status } = useSession(); 
  const { wishlistItems, toggleWishlist, isTogglingWishlist } = useWishlist();

  const categoryName = typeof product.category === "object" ? product.category?.name : product.subCategory;
  const firstImage = product.commonImages?.[0] || "/placeholder.png";
  const secondImage = product.commonImages?.[1] || firstImage;
  const subCategoryName = product.subCategory ? product.subCategory.replace("-", " ") : categoryName || "Cosmetics";

  const isFavorite = product._id && Array.isArray(wishlistItems)
    ? wishlistItems.some((item: any) => item.productId?._id === product._id || item.productId === product._id) 
    : false;

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === "loading" || isTogglingWishlist) return;

    if (!session?.user) {
      router.push("/signin");
      return;
    }

    if (product._id) {
      await toggleWishlist(product._id); 
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    router.push("/checkout");
  };

  return (
    <div 
      onClick={() => router.push(`/product/${product.productCode}`)}
      className="group flex flex-col bg-white rounded-xl md:rounded-2xl border border-gray-100/60 relative overflow-hidden cursor-pointer transition-all duration-300 w-full shadow-[0_2px_12px_rgba(0,0,0,0.012)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
    >
      {/* 🎯 IMAGE WRAPPER (ডেস্কটপে প্রফেশনাল বড় সাইজ এবং ওভারফ্লো প্রটেক্টেড) */}
      <div className="relative aspect-[4/5] w-full bg-[#FAF6F0] overflow-hidden shrink-0">
        <Image 
          src={firstImage} 
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className={`object-cover transition-all duration-500 ${
            product.commonImages && product.commonImages[1] ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
          }`}
          priority={false}
        />

        {product.commonImages && product.commonImages[1] && (
          <Image 
            src={secondImage} 
            alt={`${product.name} alternate`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="absolute inset-0 object-cover opacity-0 scale-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
          />
        )}
        
        {product.discount && (
          <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#FF3F6C] text-white font-sans text-[9px] md:text-[11px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full z-10">
            {product.discount}
          </span>
        )}

        {/* Floating Wishlist Button */}
        <button 
          onClick={handleWishlistClick}
          disabled={status === "loading" || isTogglingWishlist} 
          className={`absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center shadow-xs md:shadow-md transition-all duration-300 active:scale-90 z-10 ${
            isFavorite 
              ? "bg-[#FF3F6C] text-white" 
              : "bg-white text-[#2C3E30] hover:bg-[#FF3F6C] hover:text-white"
          } disabled:opacity-70`}
        >
          <Heart size={13} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* 🎯 INFO & METADATA AREA (মোবাইলে বাইরে টেক্সট বের হওয়া লক করা হয়েছে) */}
      <div className="mt-1 md:mt-2 flex flex-col grow justify-between px-2.5 md:px-4 pb-3 md:pb-4 overflow-hidden">
        <div>
          <span className="text-[9px] md:text-[11px] text-gray-400 uppercase tracking-wider block mb-0.5 truncate capitalize">
            {subCategoryName}
          </span>
          {/* h-8 (মোবাইল) এবং h-12 (ডেস্কটপ) হাইট লকিং গ্রিড সমান্তরাল রাখবে */}
          <h4 className="font-serif font-bold text-xs md:text-base text-[#1A2E22] group-hover:text-[#FF3F6C] transition-colors line-clamp-2 mb-1 leading-tight h-8 md:h-12">
            {product.name}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-500 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={10} 
                  fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} 
                  className={i < Math.floor(product.rating || 0) ? "text-amber-500" : "text-gray-200"} 
                />
              ))}
            </div>
            <span className="text-[10px] md:text-xs font-sans text-gray-400 font-light pt-0.5">
              ({product.ratingCount || 0})
            </span>
          </div>
        </div>

        {/* Price, Metric & Cart Linkups */}
        <div className="flex flex-col gap-1 mt-2">
          <div className="text-[10px] md:text-xs text-gray-400 font-sans truncate">
            Net: {product.weightOrVolume || "1"} {product.unit || "unit"}
          </div>
          
          <div className="flex items-center justify-between mb-1.5 gap-1">
            <div className="flex flex-wrap items-baseline gap-1 md:gap-2">
              <span className="font-sans text-sm md:text-lg font-bold text-[#1A2E22] whitespace-nowrap">
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-[10px] md:text-xs text-gray-400 line-through whitespace-nowrap">
                  ৳{product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {/* প্লাস কার্ট বাটন */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              disabled={product.availability === "Out of Stock"}
              className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#FAF6F0] text-[#2C3E30] hover:bg-[#2C3E30] hover:text-white flex items-center justify-center shadow-xs transition-all active:scale-95 z-10 border border-gray-100/30 shrink-0 disabled:opacity-40"
              title="Add to Cart"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* BUY NOW বাটন */}
          <button
            onClick={handleBuyNow}
            disabled={product.availability === "Out of Stock"}
            className="w-full py-1.5 md:py-2.5 bg-[#2C3E30] hover:bg-[#FF3F6C] text-white font-sans text-xs md:text-sm font-semibold rounded-lg md:rounded-xl shadow-xs transition-all duration-300 active:scale-[0.98] text-center disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {product.availability === "Out of Stock" ? "Out of Stock" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}