
// "use client";
// import React from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react"; 
// import { Star, Heart, Eye, ShoppingBag } from "lucide-react";
// import { Product } from "@/Types/types";

// interface ShopProductCardProps {
//   product: Product;
//   wishlist: string[];
//   toggleWishlist: (id: string) => void;
//   addToCart: (product: Product) => void;
// }

// export default function ShopProductCard({
//   product,
//   wishlist,
//   toggleWishlist,
//   addToCart,
// }: ShopProductCardProps) {
//   const router = useRouter();
//   const { data: session, status } = useSession(); 

//   const categoryName = typeof product.category === "object" ? product.category?.name : product.subCategory;
//   const firstImage = product.commonImages?.[0] || "/placeholder.png";
//   const secondImage = product.commonImages?.[1] || firstImage;
//   const isFavorite = product._id ? wishlist.includes(product._id) : false;

//   const handleWishlistClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (status === "loading") return;

//     const isLoggedIn = !!session?.user;

//     if (!isLoggedIn) {
//       router.push("/signin");
//       return;
//     }

//     if (product._id) {
//       toggleWishlist(product._id);
//     }
//   };

//   return (
//     <div className="group relative bg-transparent flex flex-col">
//       {/* IMAGE WRAPPER WITH DUAL-HOVER EFFECT */}
//       <div className="relative aspect-[4/5] w-full bg-[#EAE7DC] rounded-[24px] overflow-hidden mb-3 shadow-sm cursor-pointer">
//         <div
//           className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out group-hover:opacity-0"
//           style={{ backgroundImage: `url(${firstImage})` }}
//         />
//         <div
//           className="absolute inset-0 w-full h-full bg-cover bg-center scale-100 group-hover:scale-105 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100"
//           style={{ backgroundImage: `url(${secondImage})` }}
//         />
        
//         {product.discount && (
//           <span className="absolute top-4 left-4 bg-[#1A2E22] text-white font-sans text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
//             {product.discount} OFF
//           </span>
//         )}

//         {/* ACTIONS */}
//         <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
//           <button 
//             onClick={handleWishlistClick}
//             disabled={status === "loading"} 
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
//             onClick={() => addToCart(product)}
//             disabled={product.availability === "Out of Stock"}
//             className={`p-2 rounded-full shadow-md transition-colors ${product.availability === "Out of Stock" ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#1A2E22] hover:bg-[#1A2E22] hover:text-white"}`}
//           >
//             <ShoppingBag size={16} />
//           </button>
//         </div>
//       </div>

//       {/* Metadata */}
//       <div className="flex justify-between items-start px-1">
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

//       <div className="flex items-center gap-2 mt-1 px-1">
//         <span className="text-[#CDA275] font-bold text-base">৳{product.price.toFixed(2)}</span>
//         {product.oldPrice && product.oldPrice > product.price && (
//           <span className="text-gray-400 line-through text-xs">৳{product.oldPrice.toFixed(2)}</span>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { Star, Heart, Eye, ShoppingBag } from "lucide-react";
import { Product } from "@/Types/types";
import { useWishlist } from "@/hooks/useWishlist"; // 🎯 ১. নতুন লাইভ উইশলিস্ট হুক ইম্পোর্ট করা হলো

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
  
  // 🎯 ২. প্রপসের বদলে সরাসরি হুক থেকে ডাটা ও মেথড নেওয়া হলো
  const { wishlistItems, toggleWishlist, isTogglingWishlist } = useWishlist();

  const categoryName = typeof product.category === "object" ? product.category?.name : product.subCategory;
  const firstImage = product.commonImages?.[0] || "/placeholder.png";
  const secondImage = product.commonImages?.[1] || firstImage;

  // 🎯 ৩. ব্যাকএন্ড স্ট্রাকচার (Populated object বা direct ID) সেফলি চেক করা হচ্ছে
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
      // 🎯 ৪. গ্লোবাল কুয়েরি মিউটেশন ট্রিগার করবে
      await toggleWishlist(product._id); 
    }
  };

  return (
    <div className="group relative bg-transparent flex flex-col">
      {/* IMAGE WRAPPER WITH DUAL-HOVER EFFECT */}
      <div className="relative aspect-[4/5] w-full bg-[#EAE7DC] rounded-[24px] overflow-hidden mb-3 shadow-sm cursor-pointer">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out group-hover:opacity-0"
          style={{ backgroundImage: `url(${firstImage})` }}
        />
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center scale-100 group-hover:scale-105 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100"
          style={{ backgroundImage: `url(${secondImage})` }}
        />
        
        {product.discount && (
          <span className="absolute top-4 left-4 bg-[#1A2E22] text-white font-sans text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
            {product.discount} OFF
          </span>
        )}

        {/* ACTIONS */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button 
            onClick={handleWishlistClick}
            disabled={status === "loading" || isTogglingWishlist} 
            className={`p-2 rounded-full shadow-md transition-colors ${
              isFavorite 
                ? "bg-[#FF3F6C] text-white" 
                : "bg-white text-[#1A2E22] hover:bg-[#1A2E22] hover:text-white"
            } disabled:opacity-70`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          <Link href={`/product/${product.productCode}`} className="bg-white text-[#1A2E22] p-2 rounded-full shadow-md hover:bg-[#1A2E22] hover:text-white transition-colors flex items-center justify-center">
            <Eye size={16} />
          </Link>

          <button 
            onClick={() => addToCart(product)}
            disabled={product.availability === "Out of Stock"}
            className={`p-2 rounded-full shadow-md transition-colors ${product.availability === "Out of Stock" ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#1A2E22] hover:bg-[#1A2E22] hover:text-white"}`}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex justify-between items-start px-1">
        <div>
          <span className="text-xs text-gray-400 font-medium block mb-0.5 capitalize">{categoryName}</span>
          <h4 className="font-serif font-bold text-base text-[#1A2E22] group-hover:text-black transition-colors line-clamp-1">{product.name}</h4>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-[#1A2E22] mt-0.5 shrink-0">
          <Star size={14} fill="currentColor" className="text-amber-400" />
          <span>{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
          <span className="text-gray-400 font-normal text-[10px]">({product.ratingCount || 0})</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1 px-1">
        <span className="text-[#CDA275] font-bold text-base">৳{product.price.toFixed(2)}</span>
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="text-gray-400 line-through text-xs">৳{product.oldPrice.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
}

