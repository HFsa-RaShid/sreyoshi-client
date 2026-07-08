/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useGetProductsForCustomer } from "@/hooks/useCustomerData";
import { useApp } from "@/context/AppContext";
import { ShopProductSkeleton } from "@/components/Shared/ShopProductSkeleton/ShopProductSkeleton";
import ShopProductCard from "@/app/(withCommonLayout)/shop/ShopProductCard";

export default function RecommendedProducts() {
  const { addToCart } = useApp();
  const { data: productsData = [], isLoading } = useGetProductsForCustomer() as { data: any[]; isLoading: boolean };

  // 🎯 রেটিংয়ের ওপর বেস করে সর্টিং লজিক (Highest Rating First)
  const recommendedItems = React.useMemo(() => {
    if (!productsData) return [];
    
    return productsData
      .filter((p: any) => p.status === "Active") // শুধুমাত্র একটিভ প্রোডাক্ট ফিল্টার
      .sort((a: any, b: any) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        
        // ১. যার রেtaining বেশি সে আগে আসবে
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        // ২. রেটিং সমান হলে বেশি ভোট পাওয়া (ratingCount) প্রোডাক্ট আগে আসবে
        return (b.ratingCount || 0) - (a.ratingCount || 0);
      })
      .slice(0, 4); // টপ ৪টি হাইয়েস্ট রেটেড প্রোডাক্ট দেখাবে
  }, [productsData]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#1A2E22]">Recommended For You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[...Array(4)].map((_, idx) => <ShopProductSkeleton key={idx} />)}
        </div>
      </div>
    );
  }

  if (recommendedItems.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-serif font-bold text-[#1A2E22] border-b border-gray-100 pb-3">
        Recommended For You
      </h2>
      
      {/* 🎯 শপ পেজের মতো রেসপন্সিভ গ্রিড লেআউট */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {recommendedItems.map((product: any) => (
          <ShopProductCard
            key={product._id || product.productCode}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}