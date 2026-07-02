/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { ArrowRight, Star, Plus, Heart } from "lucide-react";
import { useApp } from "@/context/AppContext"; 

// ⚡ তানস্ট্যাক কুয়েরি হুক এবং উইশলিস্ট হুক ইমপোর্ট 
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
        <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-12 px-4 md:px-12 text-[#2C3E35]">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 bg-slate-200 rounded-md w-48 mb-8 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, idx) => (
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

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
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
    <section className="w-full bg-[#FAF9F6] py-16 px-6 md:px-16 lg:px-24 relative group/section">
      <div className="container mx-auto">
        
        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-[#1E2E24] font-normal">
            Best Sellers
          </h2>
          <Link href="/shop" className="flex items-center gap-1.5 text-sm font-sans text-[#1E2E24] font-medium hover:opacity-70 transition-opacity">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* ডাইনামিক রেসপন্সিভ গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {bestSellers.map((product) => {
            const productId = product._id || product.productCode;
            
            const mainImage = product.commonImages?.[0] || "/placeholder.jpg";
            const hoverImage = product.commonImages?.[1] || mainImage;
            const subCategoryName = product.subCategory ? product.subCategory.replace("-", " ") : "";

         
            const isFavorite = product._id && Array.isArray(wishlistItems)
              ? wishlistItems.some((item: any) => item.productId?._id === product._id || item.productId === product._id) 
              : false;

            return (
              <div 
                key={productId}
                onClick={() => router.push(`/product/${product.productCode}`)}
                className="flex flex-col bg-white rounded-2xl  border border-gray-100/40 relative group overflow-hidden cursor-pointer transition-all duration-300 w-full"
              >
                
                {/* Product Image Box */}
                <div className="w-full aspect-square rounded-t-2xl bg-[#FAF6F0] relative overflow-hidden">
                  <Image 
                    src={mainImage} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="absolute inset-0 object-cover opacity-0 scale-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                  )}

                  {product.discount && (
                    <span className="absolute top-3 left-3 bg-[#FF3F6C] text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full z-10">
                      {product.discount}
                    </span>
                  )}

                  
                  <button 
                    onClick={(e) => handleWishlistClick(e, product)}
                    disabled={status === "loading" || isTogglingWishlist} 
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 active:scale-90 z-10 ${
                      isFavorite 
                        ? "bg-[#FF3F6C] text-white" 
                        : "bg-white text-[#2C3E30] hover:bg-[#FF3F6C] hover:text-white"
                    } disabled:opacity-70`}
                    title="Add to Wishlist"
                  >
                    <Heart size={15} fill={isFavorite ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Product Info */}
                <div className="mt-2 flex flex-col grow justify-between px-4 pb-4">
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider block mb-0.5">
                      {subCategoryName}
                    </span>
                    <h3 className="font-sans text-sm md:text-base font-medium text-[#1E2E24] group-hover:text-[#FF3F6C] transition-colors line-clamp-2 mb-1 leading-tight">
                      {product.name}
                    </h3>

                    {/* Rating System */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-amber-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} 
                            className={i < Math.floor(product.rating || 0) ? "text-amber-500" : "text-gray-200"} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-sans text-gray-400 font-light pt-0.5">
                        ({product.ratingCount || 0})
                      </span>
                    </div>
                  </div>

                  {/* Price, Metric & Add to Cart Button */}
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="text-xs text-gray-400 font-sans">
                      Net: {product.weightOrVolume} {product.unit}
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-2 items-center">
                        <span className="font-sans text-base md:text-lg font-bold text-[#1E2E24]">
                          ৳{(product.price || 0).toLocaleString()}
                        </span>
                        {product.oldPrice && (
                          <span className="text-xs md:text-sm text-gray-400 line-through">
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
                        className="w-9 h-9 rounded-full bg-[#FAF6F0] text-[#2C3E30] hover:bg-[#2C3E30] hover:text-white flex items-center justify-center shadow-sm transition-colors active:scale-95 z-10 relative border border-gray-100/30"
                        title="Add to Cart"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* BUY NOW বাটন */}
                    <button
                      onClick={(e) => handleBuyNow(e, product)}
                      className="w-full py-2.5 bg-[#2C3E30] hover:bg-[#FF3F6C] text-white font-sans text-sm font-semibold rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] text-center"
                    >
                      Buy Now
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