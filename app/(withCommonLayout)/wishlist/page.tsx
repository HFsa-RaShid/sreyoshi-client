// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React from "react";
// import { Heart, ShoppingBag, Loader2 } from "lucide-react";
// import Link from "next/link";
// import { Product } from "@/Types/types";

// // আপনার প্রজেক্টের অল প্রোডাক্টস বা কাস্টমার প্রোডাক্টস ফেচ করার হুকটি এখানে ইম্পোর্ট করুন
// import { useGetProductsForCustomer } from "@/hooks/useCustomerData"; 
// import { useApp } from "@/context/AppContext";

// export default function WishlistPage() {
//   const { wishlist, toggleWishlist, addToCart } = useApp();
  
//   // ১. ব্যাকএন্ড থেকে সব প্রোডাক্ট নিয়ে আসা
//   const { data: allProducts, isLoading, isError } = useGetProductsForCustomer();

//   // ২. লোকাল `wishlist` অ্যারেতে থাকা `_id` গুলোর সাথে ব্যাকএন্ডের প্রোডাক্টস ফিল্টার করা
//   const favoriteProducts = allProducts 
//     ? allProducts.filter((product: Product) => wishlist.includes(product._id || "")) 
//     : [];

//   // লোডিং স্টেট
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-2">
//         <Loader2 className="w-10 h-10 animate-spin text-[#1A2E22]" />
//         <p className="text-sm font-medium text-[#1A2E22]/70">Loading Wishlist...</p>
//       </div>
//     );
//   }

//   // এরর বা উইশলিস্ট খালি থাকলে
//   if (isError || favoriteProducts.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-[#2C3E35]">
//         <Heart size={44} className="opacity-20 mb-3 text-[#FF3F6C]" />
//         <h2 className="text-lg font-serif font-bold mb-1">Your Wishlist is empty</h2>
//         <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-[#FF3F6C] underline">
//           Explore Products
//         </Link>
//       </div>
//     );
//   }

//   // "Move to Bag" হ্যান্ডলার (১ম ডিফল্ট শেড থাকলে তা সহ কার্টে পাঠাবে)
//   const handleMoveToBag = (product: Product) => {
//     const defaultShade = product.shades && product.shades.length > 0 
//       ? product.shades.find((s: any) => s.status === "Active") || product.shades[0] 
//       : null;

//     addToCart({
//       ...product,
//       selectedShade: defaultShade
//     }, 1);

//     // কার্টে মুভ করার পর উইশলিস্ট থেকে রিমুভ করে দেওয়া
//     if (product._id) {
//       toggleWishlist(product._id);
//     }
//   };

//   return (
//     <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-12 px-4 md:px-12 text-[#2C3E35]">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-2xl font-serif font-bold text-[#1A2E22] mb-8">
//           My Favorites ({favoriteProducts.length})
//         </h1>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           {favoriteProducts.map((product: Product) => {
//             const productId = product._id || "";
//             // images[0] এর বদলে ব্যাকএন্ডের commonImages[0] ব্যবহার করা হয়েছে
//             const productImg = (product.commonImages && product.commonImages[0]) || "/placeholder.png";

//             return (
//               <div key={productId} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative flex flex-col justify-between">
//                 <div>
//                   <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 mb-3 relative">
//                     <img src={productImg} alt={product.name} className="w-full h-full object-cover" />
//                     <button 
//                       onClick={() => toggleWishlist(productId)}
//                       className="absolute top-3 right-3 p-2 rounded-full bg-white text-[#FF3F6C] shadow-md hover:scale-105 transition-transform"
//                     >
//                       <Heart size={14} className="fill-current" />
//                     </button>
//                   </div>
                  
//                   {/* প্রোডাক্ট ডিটেইলস পেজে যাওয়ার জন্য ডাইনামিক লিংক (productCode ব্যবহার করে) */}
//                   <Link href={`/product/${product.productCode}`}>
//                     <h3 className="text-xs font-bold text-[#1A2E22] line-clamp-1 mb-1 hover:underline cursor-pointer">
//                       {product.name}
//                     </h3>
//                   </Link>
//                   <span className="text-sm font-bold text-[#CDA275]">৳{product.price.toFixed(2)}</span>
//                 </div>

//                 <button 
//                   onClick={() => handleMoveToBag(product)}
//                   className="w-full mt-4 bg-gray-50 hover:bg-[#1A2E22] text-[#1A2E22] hover:text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
//                 >
//                   <ShoppingBag size={12} /> Move to Bag
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }



/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { Product } from "@/Types/types";
import { useWishlist } from "@/hooks/useWishlist"; // 🎯 নতুন লাইভ হুক
import { useApp } from "@/context/AppContext"; // কার্ট হ্যান্ডলারের জন্য

export default function WishlistPage() {
  const { addToCart } = useApp();
  // 🎯 লোকাল ফিল্টারিং বাদ দিয়ে সরাসরি ব্যাকএন্ড থেকে ডেটা ও ফাংশন আনা হলো
  const { wishlistItems, isLoading, toggleWishlist, removeSingleItem } = useWishlist();

  // লোডিং স্টেট
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-[#1A2E22]" />
        <p className="text-sm font-medium text-[#1A2E22]/70">Loading Live Wishlist...</p>
      </div>
    );
  }

  // যদি ব্যাকএন্ডে কোনো প্রোডাক্ট না থাকে
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-[#2C3E35]">
        <Heart size={44} className="opacity-20 mb-3 text-[#FF3F6C]" />
        <h2 className="text-lg font-serif font-bold mb-1">Your Wishlist is empty</h2>
        <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-[#FF3F6C] underline">
          Explore Products
        </Link>
      </div>
    );
  }

  // ─── 🎯 Move to Bag হ্যান্ডলার (উইশলিস্ট থেকে ডিলিট হয়ে কার্টে যাবে) ───
  const handleMoveToBag = async (product: any) => {
    if (!product?._id) return;

    // ১. প্রথমে ফ্রন্টএন্ড শপিং কার্টে আইটেমটি যুক্ত করা হচ্ছে
    const defaultVariant = product.variants && product.variants.length > 0 
      ? product.variants.find((v: any) => v.status === "Active") || product.variants[0] 
      : null;

    addToCart({
      ...product,
      selectedVariant: defaultVariant
    }, 1);

    // ২. 🎯 ব্যাকএন্ডের PATCH এপিআই এর মাধ্যমে উইশলিস্ট থেকে ডিলিট করে দেওয়া হলো
    await removeSingleItem(product._id);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-12 px-4 md:px-12 text-[#2C3E35]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-serif font-bold text-[#1A2E22] mb-8">
          My Favorites ({wishlistItems.length})
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {wishlistItems.map((item: any) => {
            // মঙ্গুস পপুলেশনের কারণে আসল প্রোডাক্ট অবজেক্টটি productId এর ভেতরে থাকবে
            const product = item.productId as Product;
            if (!product) return null; // সেফটি চেক

            const productId = product._id || "";
            const productImg = (product.commonImages && product.commonImages[0]) || "/placeholder.png";

            return (
              <div key={productId} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative flex flex-col justify-between">
                <div>
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 mb-3 relative">
                    <img src={productImg} alt={product.name} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => toggleWishlist(productId)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white text-[#FF3F6C] shadow-md hover:scale-105 transition-transform"
                    >
                      <Heart size={14} className="fill-current" />
                    </button>
                  </div>
                  
                  <Link href={`/product/${product.productCode}`}>
                    <h3 className="text-xs font-bold text-[#1A2E22] line-clamp-1 mb-1 hover:underline cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  <span className="text-sm font-bold text-[#CDA275]">৳{product.price ? product.price.toFixed(2) : "0.00"}</span>
                </div>

                {/* কার্টে নিয়ে যাওয়ার বাটন */}
                <button 
                  onClick={() => handleMoveToBag(product)}
                  className="w-full mt-4 bg-gray-50 hover:bg-[#1A2E22] text-[#1A2E22] hover:text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={12} /> Move to Bag
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}