/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useGetProductsForCustomer } from "@/hooks/useCustomerData";
import { useApp } from "@/context/AppContext";

import { ShopProductSkeleton } from "@/components/Shared/ShopProductSkeleton/ShopProductSkeleton";
import ShopProductCard from "@/app/(withCommonLayout)/shop/ShopProductCard";

export default function RelatedProducts({ currentProduct }: { currentProduct: any }) {
  const { addToCart } = useApp();
  const { data: productsData = [], isLoading } = useGetProductsForCustomer() as { data: any[]; isLoading: boolean };

  // একই ক্যাটাগরির প্রোডাক্ট ফিল্টার লজিক
  const relatedItems = React.useMemo(() => {
    if (!productsData || !currentProduct) return [];
    
    const currentCatId = typeof currentProduct.category === "object" ? currentProduct.category?._id : currentProduct.category;

    return productsData
      .filter((p: any) => {
        const pCatId = typeof p.category === "object" ? p.category?._id : p.category;
        return p._id !== currentProduct._id && p.status === "Active" && pCatId === currentCatId;
      })
      .slice(0, 4); // ৪টি রিলেটেড প্রোডাক্ট
  }, [productsData, currentProduct]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#1A2E22]">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[...Array(4)].map((_, idx) => <ShopProductSkeleton key={idx} />)}
        </div>
      </div>
    );
  }

  if (relatedItems.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-serif font-bold text-[#1A2E22] border-b border-gray-100 pb-3">
        Related Products
      </h2>
      
      {/* 🎯 শপ পেজের মতো রেসপন্সিভ গ্রিড লেআউট */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {relatedItems.map((product: any) => (
          <ShopProductCard
            key={product._id || product.productCode}
            product={product}
            addToCart={addToCart} // আপনার কার্ডের রিকোয়ারমেন্ট অনুযায়ী ফাংশন পাস করা হলো
          />
        ))}
      </div>
    </div>
  );
}