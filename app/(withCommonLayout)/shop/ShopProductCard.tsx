

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
//     <div className="group relative flex flex-col bg-transparent w-full max-w-[280px] mx-auto transition-transform duration-300">
//       {/* 📸 IMAGE WRAPPER */}
//       <div className="relative aspect-square w-full bg-[#F4F1EA] rounded-2xl overflow-hidden mb-2.5 cursor-pointer">
//         <div
//           className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out lg:group-hover:opacity-0"
//           style={{ backgroundImage: `url(${firstImage})` }}
//         />
//         <div
//           className="absolute inset-0 w-full h-full bg-cover bg-center scale-100 lg:group-hover:scale-105 transition-all duration-700 ease-in-out opacity-0 lg:group-hover:opacity-100"
//           style={{ backgroundImage: `url(${secondImage})` }}
//         />
        
//         {/* 🏷️ DISCOUNT BADGE */}
//         {product.discount && (
//           <span className="absolute top-3 left-3 bg-[#1B3B22] text-white font-sans text-[10px] md:text-xs font-medium px-2.5 py-1 rounded-full z-10 shadow-xs">
//             {product.discount} off
//           </span>
//         )}

//         {/* 🎯 ACTIONS BUTTONS (বড় স্ক্রিনে আইকন ও প্যাডিং একটু বাড়ানো হয়েছে) */}
//         <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
//           <button 
//             onClick={handleWishlistClick}
//             disabled={status === "loading" || isTogglingWishlist} 
//             className={`p-1.5 md:p-2 rounded-full shadow-xs transition-all transform active:scale-95 ${
//               isFavorite 
//                 ? "bg-[#FF3F6C] text-white" 
//                 : "bg-white text-gray-700 hover:bg-gray-100"
//             } disabled:opacity-70`}
//           >
//             <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" fill={isFavorite ? "currentColor" : "none"} />
//           </button>

//           <Link href={`/product/${product.productCode}`} className="bg-white text-gray-700 p-1.5 md:p-2 rounded-full shadow-xs hover:bg-gray-100 transition-all transform active:scale-95 flex items-center justify-center">
//             <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
//           </Link>

//           <button 
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               addToCart(product);
//             }}
//             disabled={product.availability === "Out of Stock"}
//             className={`p-1.5 md:p-2 rounded-full shadow-xs transition-all transform active:scale-95 ${product.availability === "Out of Stock" ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}
//           >
//             <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
//           </button>
//         </div>
//       </div>

//       {/* 📝 METADATA (টেক্সট এবং রেটিং বড় স্ক্রিনে সুন্দরভাবে বড় হবে) */}
//       <div className="flex justify-between items-start w-full px-0.5">
//         <div className="flex flex-col max-w-[75%]">
//           <span className="text-[11px] md:text-2xl lg:text-xs text-gray-400 font-medium capitalize tracking-tight">{categoryName}</span>
//           <h4 className="font-sans font-semibold text-xs md:text-sm lg:text-[15px] text-gray-800 transition-colors line-clamp-1 mt-0.5">
//             {product.name}
//           </h4>
//         </div>
        
//         {/* ⭐ RATING */}
//         <div className="flex items-center gap-0.5 text-[11px] md:text-xs lg:text-sm font-bold text-gray-800 shrink-0 mt-0.5">
//           <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-400" fill="currentColor" />
//           <span>{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
//         </div>
//       </div>

//       {/* 💰 PRICING */}
//       <div className="flex items-center gap-1.5 mt-1 px-0.5">
//         <span className="text-[#C59B6D] font-bold text-xs md:text-sm lg:text-base">৳{product.price.toFixed(2)}</span>
//         {product.oldPrice && product.oldPrice > product.price && (
//           <span className="text-gray-300 line-through text-[11px] md:text-xs">৳{product.oldPrice.toFixed(2)}</span>
//         )}
//       </div>
//     </div>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // ⚡ Next.js Image ইমপোর্ট করা হলো
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
      {/* 📸 IMAGE WRAPPER (আপনার আগের লেআউটেই Next Image দিয়ে কন্ডিশনাল হোভার সেট করা হলো) */}
      <div className="relative aspect-square w-full bg-[#F4F1EA] rounded-2xl overflow-hidden mb-2.5 cursor-pointer">
        <Image 
          src={firstImage} 
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover transition-all duration-500 ${
            product.commonImages && product.commonImages[1] ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
          }`}
          priority
        />

        {product.commonImages && product.commonImages[1] && (
          <Image 
            src={secondImage} 
            alt={`${product.name} alternate`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="absolute inset-0 object-cover opacity-0 scale-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
          />
        )}
        
        {/* 🏷️ DISCOUNT BADGE */}
        {product.discount && (
          <span className="absolute top-3 left-3 bg-[#1B3B22] text-white font-sans text-[10px] md:text-xs font-medium px-2.5 py-1 rounded-full z-10 shadow-xs">
            {product.discount} off
          </span>
        )}

        {/* 🎯 ACTIONS BUTTONS */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleWishlistClick}
            disabled={status === "loading" || isTogglingWishlist} 
            className={`p-1.5 md:p-2 rounded-full shadow-xs transition-all transform active:scale-95 ${
              isFavorite 
                ? "bg-[#FF3F6C] text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            } disabled:opacity-70`}
          >
            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" fill={isFavorite ? "#FF3F6C" : "none"} />
          </button>

          <Link href={`/product/${product.productCode}`} className="bg-white text-gray-700 p-1.5 md:p-2 rounded-full shadow-xs hover:bg-gray-100 transition-all transform active:scale-95 flex items-center justify-center">
            <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Link>

          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={product.availability === "Out of Stock"}
            className={`p-1.5 md:p-2 rounded-full shadow-xs transition-all transform active:scale-95 ${product.availability === "Out of Stock" ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* 📝 METADATA */}
      <div className="flex justify-between items-start w-full px-0.5">
        <div className="flex flex-col max-w-[75%]">
          <span className="text-[11px] md:text-2xl lg:text-xs text-gray-400 font-medium capitalize tracking-tight">{categoryName}</span>
          <h4 className="font-sans font-semibold text-xs md:text-sm lg:text-[15px] text-gray-800 transition-colors line-clamp-1 mt-0.5">
            {product.name}
          </h4>
        </div>
        
        {/* ⭐ RATING */}
        <div className="flex items-center gap-0.5 text-[11px] md:text-xs lg:text-sm font-bold text-gray-800 shrink-0 mt-0.5">
          <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-400" fill="currentColor" />
          <span>{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
        </div>
      </div>

      {/* 💰 PRICING */}
      <div className="flex items-center gap-1.5 mt-1 px-0.5">
        <span className="text-[#C59B6D] font-bold text-xs md:text-sm lg:text-base">৳{product.price.toFixed(2)}</span>
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="text-gray-300 line-through text-[11px] md:text-xs">৳{product.oldPrice.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
}