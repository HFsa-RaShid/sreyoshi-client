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
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { Star, Heart, Eye, ShoppingBag } from "lucide-react";
import { Product } from "@/Types/types";
import { useWishlist } from "@/hooks/useWishlist"; 

interface ShopProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
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

  const isFavorite = product._id && Array.isArray(wishlistItems)
    ? wishlistItems.some((item: any) => item.productId?._id === product._id || item.productId === product._id) 
    : false;

  const handleWishlistClick = async (e: React.MouseEvent) => {
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
    <div className="group relative flex flex-col bg-transparent w-full max-w-[280px] mx-auto transition-transform duration-300">
      {/* 📸 IMAGE WRAPPER (ছবির মতো পারফেক্ট রাউন্ডেড কোণা এবং সাইজ লক) */}
      <div className="relative aspect-square w-full bg-[#F4F1EA] rounded-2xl overflow-hidden mb-2.5 cursor-pointer">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out lg:group-hover:opacity-0"
          style={{ backgroundImage: `url(${firstImage})` }}
        />
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center scale-100 lg:group-hover:scale-105 transition-all duration-700 ease-in-out opacity-0 lg:group-hover:opacity-100"
          style={{ backgroundImage: `url(${secondImage})` }}
        />
        
        {/* 🏷️ DISCOUNT BADGE (হুবহু ছবির মতো ডার্ক গ্রিন রাউন্ডেড লুক) */}
        {product.discount && (
          <span className="absolute top-3 left-3 bg-[#1B3B22] text-white font-sans text-[10px] font-medium px-2.5 py-1 rounded-full z-10 shadow-xs">
            {product.discount} off
          </span>
        )}

        {/* 🎯 ACTIONS BUTTONS (ছবির মতো ডান কোণায় হোয়াইট সার্কেল বোতাম) */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleWishlistClick}
            disabled={status === "loading" || isTogglingWishlist} 
            className={`p-1.5 rounded-full shadow-xs transition-all transform active:scale-95 ${
              isFavorite 
                ? "bg-[#FF3F6C] text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            } disabled:opacity-70`}
          >
            <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          <Link href={`/product/${product.productCode}`} className="bg-white text-gray-700 p-1.5 rounded-full shadow-xs hover:bg-gray-100 transition-all transform active:scale-95 flex items-center justify-center">
            <Eye size={14} />
          </Link>

          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={product.availability === "Out of Stock"}
            className={`p-1.5 rounded-full shadow-xs transition-all transform active:scale-95 ${product.availability === "Out of Stock" ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>

      {/* 📝 METADATA (ছবির মতো ক্যাটাগরি এবং ডানপাশে স্টার রেটিং) */}
      <div className="flex justify-between items-start w-full px-0.5">
        <div className="flex flex-col max-w-[75%]">
          <span className="text-[11px] text-gray-400 font-medium capitalize tracking-tight">{categoryName}</span>
          <h4 className="font-sans font-semibold text-xs md:text-[13px] text-gray-800 transition-colors line-clamp-1 mt-0.5">
            {product.name}
          </h4>
        </div>
        
        {/* ⭐ RATING */}
        <div className="flex items-center gap-0.5 text-[11px] font-bold text-gray-800 shrink-0 mt-0.5">
          <Star size={12} fill="currentColor" className="text-amber-400" />
          <span>{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
        </div>
      </div>

      {/* 💰 PRICING (ছবির মতো কমপ্যাক্ট গোল্ডেন-অরেঞ্জ কালার কোড থিম) */}
      <div className="flex items-center gap-1.5 mt-1 px-0.5">
        <span className="text-[#C59B6D] font-bold text-xs md:text-sm">৳{product.price.toFixed(2)}</span>
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="text-gray-300 line-through text-[11px]">৳{product.oldPrice.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
}