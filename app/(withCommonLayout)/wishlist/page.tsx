"use client";

import React from "react";
import { ShoppingBag, X, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/Types/types";
import { useWishlist } from "@/hooks/useWishlist"; 
import { useApp } from "@/context/AppContext"; 
import { ShopProductSkeleton } from "@/components/Shared/ShopProductSkeleton/ShopProductSkeleton";


export default function WishlistPage() {
  const { addToCart } = useApp();
  const { wishlistItems, isLoading, toggleWishlist, removeSingleItem } = useWishlist();

  
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

  // উইশলিস্ট খালি থাকলে
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-[#2C3E35] px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <X size={28} className="text-[#FF3F6C] opacity-80" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#1A2E22] mb-1">Your Wishlist is Empty</h2>
          <p className="text-sm text-gray-500 mb-5">Tap heart on a product to save them here.</p>
          <Link 
            href="/shop" 
            className="w-full bg-[#2C3E30] text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl shadow-sm hover:bg-[#FF3F6C] transition-all duration-300"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  const handleMoveToBag = async (product: any) => {
    if (!product?._id) return;

    const defaultVariant = product.variants && product.variants.length > 0 
      ? product.variants.find((v: any) => v.status === "Active") || product.variants[0] 
      : null;

    addToCart({
      ...product,
      selectedVariant: defaultVariant
    }, 1);

    await removeSingleItem(product._id);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-12 px-4 md:px-12 text-[#2C3E35]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200/60 pb-4">
          <h1 className="text-2xl font-serif font-bold text-[#1A2E22]">
            My Favorites <span className="text-sm font-sans font-normal text-gray-400 ml-1">({wishlistItems.length} items)</span>
          </h1>
        </div>
        
        {/* উইশলিস্ট প্রোডাক্ট গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
          {wishlistItems.map((item: any) => {
            const product = item.productId as Product;
            if (!product) return null;

            const productId = product._id || product.productCode;
            const mainImage = product.commonImages?.[0] || "/placeholder.jpg";
            const hoverImage = product.commonImages?.[1] || mainImage;
            const subCategoryName = product.subCategory ? product.subCategory.replace("-", " ") : "";

            return (
              <div 
                key={productId} 
                className="flex flex-col bg-white rounded-2xl border border-gray-100/40 relative group overflow-hidden transition-all duration-300 w-full hover:shadow-md"
              >
                {/* Product Image Box (Best Sellers স্টাইল হোভার ইফেক্ট সহ) */}
                <div className="w-full aspect-square rounded-t-2xl bg-[#FAF6F0] relative overflow-hidden">
                  <Image 
                    src={mainImage} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`object-cover transition-all duration-500 ${
                      product.commonImages && product.commonImages[1] ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
                    }`}
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

                  {/* উইশলিস্ট থেকে রিমুভ করার বাটন */}
                  <button 
                    onClick={() => toggleWishlist(product._id || "")}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm text-gray-400 hover:text-[#FF3F6C] shadow-sm hover:shadow flex items-center justify-center transition-all active:scale-90 z-10"
                    title="Remove from favorites"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Product Info */}
                <div className="mt-2 flex flex-col grow justify-between px-4 pb-4">
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider block mb-0.5">
                      {subCategoryName}
                    </span>
                    <Link href={`/product/${product.productCode}`}>
                      <h3 className="font-sans text-sm md:text-base font-medium text-[#1E2E24] hover:text-[#FF3F6C] transition-colors line-clamp-2 mb-1 leading-tight cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>

                    {/* রেটিং সিস্টেম */}
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

                  {/* নেট ভলিউম, প্রাইস এবং মুভ টু ব্যাগ বাটন */}
                  <div className="flex flex-col gap-1 mt-2">
                    {product.weightOrVolume && (
                      <div className="text-xs text-gray-400 font-sans">
                        Net: {product.weightOrVolume} {product.unit}
                      </div>
                    )}
                    
                    <div className="flex gap-2 items-center mb-2">
                      <span className="font-sans text-base md:text-lg font-bold text-[#1E2E24]">
                        ৳{(product.price || 0).toLocaleString()}
                      </span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="text-xs md:text-sm text-gray-400 line-through">
                          ৳{product.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Move to Bag বাটন (Best Sellers এর Buy Now বাটনের প্রিমিয়াম ফিল) */}
                    <button
                      onClick={() => handleMoveToBag(product)}
                      className="w-full py-2.5 bg-[#2C3E30] hover:bg-[#FF3F6C] text-white font-sans text-sm font-semibold rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-center"
                    >
                      <ShoppingBag size={14} /> Move to Bag
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}