



// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react"; 
// import { ArrowRight, Heart } from "lucide-react";
// import { useApp } from "@/context/AppContext"; 

// import { useGetProductsForCustomer } from "@/hooks/useCustomerData";
// import { useWishlist } from "@/hooks/useWishlist";
// import { Product } from "@/Types/types";
// import { ShopProductSkeleton } from "../Shared/ShopProductSkeleton/ShopProductSkeleton";

// export default function NewArrivals() {
//   const router = useRouter();
//   const { data: session, status } = useSession(); 
//   const { addToCart } = useApp() as any;
//   const { wishlistItems, toggleWishlist, isTogglingWishlist } = useWishlist();
//   const { data: fetchedProducts, isLoading, error } = useGetProductsForCustomer();

//   if (isLoading) {
//     return (
//       <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-12 px-4 md:px-12 text-[#2C3E35]">
//         <div className="max-w-7xl mx-auto">
//           <div className="h-8 bg-slate-200 rounded-md w-48 mb-8 animate-pulse" />
//           <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
//             {[...Array(5)].map((_, idx) => (
//               <ShopProductSkeleton key={idx} />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !fetchedProducts) return null;

//   const newArrivals = [...(fetchedProducts as Product[])]
//     .filter((product) => product.promotion === "New Arrivals" && product.status === "Active")
//     .sort((a, b) => {
//       const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//       const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//       return dateB - dateA;
//     });

//   if (newArrivals.length === 0) return null;

//   const handleShopNow = (e: React.MouseEvent, product: Product) => {
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
//     <section className="w-full bg-[#FAF9F6] py-12 md:py-16 px-3 sm:px-6 md:px-12 xl:px-20 border-t border-gray-100/50 relative">
//       <div className="max-w-7xl mx-auto">
        
//         {/* SECTION HEADER */}
//         <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
//           <h2 className="font-serif text-xl md:text-3xl text-[#1E2E24] font-normal tracking-wide">
//             New Arrivals
//           </h2>
//           <Link href="/shop" className="flex items-center gap-1 text-xs md:text-sm font-sans text-[#1E2E24] font-medium hover:opacity-70 transition-opacity">
//             View All <ArrowRight size={14} />
//           </Link>
//         </div>

//         {/* 🎯 মেইন গ্রিড: লার্জ স্ক্রিনে ৫টি কলাম (xl:grid-cols-5) এবং টাইট গ্যাপ */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 w-full">
//           {newArrivals.map((product) => {
//             const productId = product._id || product.productCode;
//             const mainImage = product.commonImages?.[0] || "/placeholder.jpg";
//             const hoverImage = product.commonImages?.[1] || mainImage;

//             const isFavorite = product._id && Array.isArray(wishlistItems)
//               ? wishlistItems.some((item: any) => item.productId?._id === product._id || item.productId === product._id) 
//               : false;

//             return (
//               <div 
//                 key={productId}
//                 onClick={() => router.push(`/product/${product.productCode}`)}
//                 className="flex flex-col bg-white rounded-2xl border border-gray-100 p-2.5 group cursor-pointer transition-all duration-300 w-full hover:shadow-md"
//               >
//                 {/* Product Image Box */}
//                 <div className="w-full aspect-[1.1/1] sm:aspect-square bg-[#F5F5F5] rounded-xl relative overflow-hidden shrink-0">
//                   <Image 
//                     src={mainImage} 
//                     alt={product.name}
//                     fill
//                     sizes="(max-width: 768px) 50vw, 20vw"
//                     className="object-cover transition-transform duration-500 group-hover:scale-105"
//                     priority
//                   />

//                   {product.commonImages && product.commonImages[1] && (
//                     <Image 
//                       src={hoverImage} 
//                       alt={`${product.name} alternate`}
//                       fill
//                       sizes="(max-width: 768px) 50vw, 20vw"
//                       className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
//                     />
//                   )}

//                   {product.discount && (
//                     <span className="absolute top-2 left-2 bg-[#1B3B22] text-white text-[9px] font-medium px-2 py-0.5 rounded-full z-10">
//                       {product.discount} off
//                     </span>
//                   )}

//                   <button 
//                     onClick={(e) => handleWishlistClick(e, product)}
//                     disabled={status === "loading" || isTogglingWishlist} 
//                     className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center shadow-xs text-[#2C3E30] hover:bg-white z-10"
//                   >
//                     <Heart size={13} fill={isFavorite ? "#FF3F6C" : "none"} className={isFavorite ? "text-[#FF3F6C]" : "text-gray-600"} />
//                   </button>
//                 </div>

//                 {/* Info Area (❌ রিমুভ করা হয়েছে রেটিং সিস্টেম) */}
//                 <div className="mt-3 flex flex-col grow justify-between text-center items-center px-1">
//                   <h3 className="font-sans text-xs md:text-[13px] font-semibold text-gray-800 line-clamp-1 mb-2 w-full">
//                     {product.name}
//                   </h3>

//                   {/* Price & Action */}
//                   <div className="w-full mt-auto">
//                     <div className="flex items-center justify-center gap-1.5 mb-2.5">
//                       <span className="font-sans text-xs md:text-sm font-bold text-gray-900">
//                         ৳{product.price.toFixed(2)}
//                       </span>
//                       {product.oldPrice && product.oldPrice > product.price && (
//                         <span className="text-[10px] md:text-xs text-gray-400 line-through">
//                           ৳{product.oldPrice.toFixed(2)}
//                         </span>
//                       )}
//                     </div>

//                     {/* 🟢 SHOP NOW বাটন */}
//                     <button
//                       onClick={(e) => handleShopNow(e, product)}
//                       className="w-full py-1.5 bg-[#12221A] hover:bg-[#1c3529] text-white font-sans text-[10px] md:text-xs font-semibold rounded-md tracking-wider uppercase transition-colors"
//                     >
//                       Shop Now
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
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext"; 

import { useGetProductsForCustomer } from "@/hooks/useCustomerData";
import { useWishlist } from "@/hooks/useWishlist";
import { Product } from "@/Types/types";
import { ShopProductSkeleton } from "../Shared/ShopProductSkeleton/ShopProductSkeleton";

export default function NewArrivals() {
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

  const newArrivals = [...(fetchedProducts as Product[])]
    .filter((product) => product.promotion === "New Arrivals" && product.status === "Active")
    .sort((a, b) => {
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  if (newArrivals.length === 0) return null;

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
    <section className="w-full bg-[#FAF9F6] py-12 md:py-16 px-3 sm:px-6 md:px-12 xl:px-20 border-t border-gray-100/50 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
          <h2 className="font-serif text-xl md:text-3xl text-[#1E2E24] font-normal tracking-wide">
            New Arrivals
          </h2>
          <Link href="/shop" className="flex items-center gap-1 text-xs md:text-sm font-sans text-[#1E2E24] font-medium hover:opacity-70 transition-opacity">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* মেইন গ্রিড */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 w-full">
          {newArrivals.map((product) => {
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
                className="flex flex-col bg-white rounded-2xl border border-gray-100  group cursor-pointer transition-all duration-300 w-full hover:shadow-md"
              >
                {/* Product Image Box */}
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

                {/* Info Area (❌ রেটিং রিমুভড) */}
                <div className="mt-3 flex flex-col grow justify-between text-center items-center p-2.5">
                  <h3 className="font-sans text-xs md:text-[13px] font-semibold text-gray-800 line-clamp-1 mb-2 w-full">
                    {product.name}
                  </h3>

                  {/* Price & Actions (Shop Now + Cart Icon) */}
                  <div className="w-full mt-auto">
                    <div className="flex items-center justify-center gap-1.5 mb-2.5">
                      <span className="font-sans text-xs md:text-sm font-bold text-gray-900">
                        ৳{product.price.toFixed(2)}
                      </span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="text-[10px] md:text-xs text-gray-400 line-through">
                          ৳{product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* 🎯 অ্যাকশন রো: শপ নাও বাটনের পাশে কার্ট আইকন */}
                    <div className="flex gap-1 w-full">
                      <button
                        onClick={(e) => handleShopNow(e, product)}
                        className="flex-1 py-1.5 bg-[#12221A] hover:bg-[#1c3529] text-white font-sans text-[10px] md:text-xs font-semibold rounded-md tracking-wider uppercase transition-colors"
                      >
                        Shop Now
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1);
                        }}
                        className="p-1.5 bg-gray-100 hover:bg-[#12221A] text-gray-700 hover:text-white rounded-md flex items-center justify-center transition-colors shrink-0"
                        title="Add to Cart"
                      >
                        <ShoppingBag size={14} />
                      </button>
                    </div>
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