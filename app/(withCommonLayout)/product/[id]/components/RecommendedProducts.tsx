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

  // রিকমেন্ডেড বা ট্রেন্ডিং ফিল্টার লজিক
  const recommendedItems = React.useMemo(() => {
    if (!productsData) return [];
    
    return productsData
      .filter((p: any) => p.status === "Active" && (p.promotion === "Trending" || p.promotion === "Best Sellers" || p.rating >= 4))
      .slice(0, 4); // ৪টি রিকমেন্ডেড প্রোডাক্ট
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