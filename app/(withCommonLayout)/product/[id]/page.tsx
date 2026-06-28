

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, ArrowLeft, Plus, Minus, Loader2 } from "lucide-react";
import { ProductShade } from "@/Types/types";
import { useGetSingleProductForCustomer } from "@/hooks/useCustomerData";
import ProductReviews from "@/components/ProductReviews";
import { useApp } from "@/context/AppContext";

type TabType = "desc" | "howToUse" | "reviews";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useApp();

  // 💡 TanStack Query-র staleTime: 0 থাকায় এটি প্রতিবার মাউন্টে ব্যাকএন্ড থেকে ফ্রেশ লাইভ ডাটা টানবে
  const { data: product, isLoading, isError } = useGetSingleProductForCustomer(id as string);

  const [activeTab, setActiveTab] = useState<TabType>("desc");
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [selectedShade, setSelectedShade] = useState<ProductShade | null>(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.shades && product.shades.length > 0) {
        const firstActiveShade = product.shades.find((s: any) => s.status === "Active") || product.shades[0];
        setSelectedShade(firstActiveShade);
        
        if (firstActiveShade?.shadeImage) {
          setSelectedImg(firstActiveShade.shadeImage);
        } else if (product.commonImages && product.commonImages.length > 0) {
          setSelectedImg(product.commonImages[0]);
        }
      } else if (product.commonImages && product.commonImages.length > 0) {
        setSelectedImg(product.commonImages[0]);
      }
    }
  }, [product]);

  const handleShadeSelect = (shade: ProductShade) => {
    setSelectedShade(shade);
    if (shade.shadeImage) {
      setSelectedImg(shade.shadeImage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-[#1A2E22]" />
        <p className="text-sm font-medium text-[#1A2E22]/70">Loading Product Details...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-medium">Product not found or an error occurred.</p>
        <button onClick={() => router.push("/shop")} className="bg-[#1A2E22] text-white px-6 py-2 rounded-xl text-xs font-bold">
          Back to Shop
        </button>
      </div>
    );
  }

  // 💡 কারেন্ট স্টক লজিক (শেড সিলেক্ট করা থাকলে শেডের স্টক, না থাকলে মেইন স্টক কাউন্ট হবে)
  const currentAvailableStock = product.shades && product.shades.length > 0
    ? (selectedShade ? selectedShade.stock : 0)
    : product.totalStock;

  const isOutOfStock = currentAvailableStock <= 0;

  const isFavorite = product._id ? wishlist.includes(product._id) : false;
  
  const categoryId = typeof product.category === "object" ? (product.category as any)?._id : "";
  const categoryName = typeof product.category === "object" ? (product.category as any)?.name : product.category;
  const brandName = typeof product.brand === "object" ? (product.brand as any)?.name : "Sreyoshi Group";
  const brandId = typeof product.brand === "object" ? (product.brand as any)?._id : "";

  const discountAmount = product.oldPrice && product.oldPrice > product.price ? product.oldPrice - product.price : 0;
  const discountPercentage = product.oldPrice && product.oldPrice > product.price 
    ? Math.round((discountAmount / product.oldPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      ...product,
      selectedShade: selectedShade 
    }, quantity);
  };

  const handleCategoryNavigation = (type: "category" | "subCategory" | "itemName" | "brand", value: string) => {
    if (!value) return;
    router.push(`/shop?${type}=${encodeURIComponent(value)}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 md:px-12 text-[#2C3E35]">
      <div className="container mx-auto p-6 md:p-10 rounded-[32px]">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-60 hover:opacity-100 mb-8 transition-opacity">
          <ArrowLeft size={14} /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* ================= LEFT GALLERY ================= */}
          <div>
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#F1EFE9] mb-4 shadow-inner relative">
              <img src={selectedImg || "/placeholder.png"} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {product.commonImages?.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedImg(img)}
                  className={`aspect-square rounded-xl overflow-hidden bg-[#F1EFE9] cursor-pointer border-2 transition-all ${selectedImg === img ? "border-[#E92C66]" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt={`view-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT DETAILS INFO ================= */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h1 className="text-xl md:text-2xl font-sans font-semibold text-gray-800 tracking-tight">{product.name}</h1>
              <p className="text-xs text-gray-400 font-medium">Size: {product.weightOrVolume} {product.unit}</p>
              
              {/* 💡 লাইভ বড় কালারফুল স্টক স্ট্যাটাস এরিয়া */}
              <div className="pt-1">
                {isOutOfStock ? (
                  <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-1.5 rounded-xl">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm md:text-base font-bold text-red-600 uppercase tracking-wide">Out of Stock</span>
                    <span className="text-xs text-red-500 font-medium font-mono">({currentAvailableStock} left)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-xl">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm md:text-base font-bold text-emerald-600 uppercase tracking-wide">In Stock</span>
                    <span className="text-xs text-emerald-600 font-bold font-mono">({currentAvailableStock} items left)</span>
                  </div>
                )}
              </div>

              {/* প্রাইস এরিয়া */}
              <div className="flex items-center flex-wrap gap-2.5 pt-1">
                <span className="text-xl font-bold text-[#E92C66]">৳{product.price?.toFixed(2)}</span>
                {discountAmount > 0 && (
                  <>
                    <span className="text-sm line-through text-gray-400">৳{product.oldPrice?.toFixed(2)}</span>
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Save ৳{discountAmount.toFixed(0)}</span>
                    <span className="bg-[#612193] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{discountPercentage}% OFF</span>
                  </>
                )}
              </div>

              {/* ব্যাজসমূহ */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="bg-[#121B2B] text-white text-[11px] px-3 py-1 rounded-full font-medium">
                  No #{product.salesCount || 1} {product.promotion || "Best Seller"}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  in <span onClick={() => handleCategoryNavigation("subCategory", product.subCategory)} className="text-[#E92C66] underline font-semibold cursor-pointer uppercase">{product.subCategory}</span>
                </span>
              </div>

              {/* শেড সিলেকশন */}
              {product.shades && product.shades.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-gray-700 mb-2">
                    Select Shade: <span className="text-[#E92C66] ml-1 font-semibold">{selectedShade?.shadeName || "None"}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {product.shades.map((shade: ProductShade, idx: number) => {
                      if (shade.status === "Inactive") return null;
                      const isShadeSelected = selectedShade?.shadeName === shade.shadeName;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleShadeSelect(shade)}
                          className={`w-8 h-8 rounded-full border transition-all relative ${isShadeSelected ? "ring-2 ring-offset-2 ring-gray-800 scale-105" : "border-gray-200 hover:scale-105"}`}
                          style={{ backgroundColor: shade.shadeColorCode || "#ccc" }}
                          title={`${shade.shadeName} (${shade.stock} left)`}
                        >
                          {shade.stock === 0 && (
                            <div className="absolute inset-0 bg-white/0 rounded-full flex items-center justify-center text-[10px] font-bold text-red-600 shadow-inner">X</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* কার্ট এবং কোয়ান্টিটি হ্যান্ডলার বক্স */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => product._id && toggleWishlist(product._id)}
                  className={`p-3 rounded-lg border transition-all ${isFavorite ? "bg-[#121B2B] text-white border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200 shadow-sm"}`}
                >
                  <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                </button>

                <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden h-[44px]">
                  <button 
                    disabled={isOutOfStock} 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="px-3 text-gray-400 hover:bg-gray-50 h-full disabled:opacity-30"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-gray-800">{isOutOfStock ? 0 : quantity}</span>
                  <button 
                    disabled={isOutOfStock || quantity >= currentAvailableStock} 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="px-3 text-gray-400 hover:bg-gray-50 h-full disabled:opacity-30"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* 💡 আউট অব স্টক হলে বাটন ডিসেবল ও গ্রে কালার হবে */}
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 h-[44px] rounded-lg font-bold text-xs shadow-sm transition-colors uppercase tracking-wider text-white ${isOutOfStock ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none border border-gray-200" : "bg-[#E92C66] hover:bg-[#d12457]"}`}
                >
                  {isOutOfStock ? "Out of Stock" : "Add To Cart"}
                </button>
              </div>
            </div>

            {/* ব্রিফ ডেসক্রিপশন */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Brief Description</p>
              <div 
                className={`text-xs text-gray-600 leading-relaxed transition-all ${!isDescExpanded ? "line-clamp-3" : ""}`}
                dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }}
              />
              {product.description && product.description.length > 150 && (
                <button 
                  onClick={() => setIsDescExpanded(!isDescExpanded)} 
                  className="text-[#E92C66] text-xs font-bold mt-1 hover:underline block"
                >
                  {isDescExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>

            {/* মেটা ইনফরমেশন টেবিল */}
            <div className="border-t border-gray-100 pt-5 text-xs space-y-2.5 text-gray-600">
              <div className="grid grid-cols-[100px_1fr] items-start">
                <span className="font-semibold text-gray-500">SKU</span>
                <span className="text-gray-800 font-medium">: {product.productCode || "N/A"}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-start">
                <span className="font-semibold text-gray-500">Categories</span>
                <div className="text-gray-800 font-medium">
                  : {" "}
                  {categoryName && (
                    <span onClick={() => handleCategoryNavigation("category", categoryId || categoryName)} className="hover:text-[#E92C66] hover:underline cursor-pointer transition-colors capitalize">{categoryName}</span>
                  )}
                  {product.subCategory && (
                    <>
                      , <span onClick={() => handleCategoryNavigation("subCategory", product.subCategory)} className="hover:text-[#E92C66] hover:underline cursor-pointer transition-colors capitalize">{product.subCategory}</span>
                    </>
                  )}
                  {product.itemName && (
                    <>
                      , <span onClick={() => handleCategoryNavigation("itemName", product.itemName)} className="hover:text-[#E92C66] hover:underline cursor-pointer transition-colors capitalize">{product.itemName}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-start">
                <span className="font-semibold text-gray-500">Brands</span>
                <span 
                  onClick={() => handleCategoryNavigation("brand", brandId || brandName)} 
                  className="text-[#E92C66] underline font-semibold cursor-pointer"
                >
                  : {brandName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM TABS DETAILS ================= */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <div className="flex justify-center gap-4 mb-8">
            {([ "desc", "howToUse", "reviews" ] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wide transition-all ${activeTab === tab ? "bg-[#1A2E22] text-white shadow-sm" : "bg-white text-black hover:bg-gray-200"}`}
              >
                {tab === "desc" ? "Full Description" : tab === "howToUse" ? "Features & Details" : `Reviews (${product.ratingCount || 0})`}
              </button>
            ))}
          </div>

          <div className="text-sm leading-relaxed text-gray-600 max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-gray-100">
            {activeTab === "desc" && (
              <div>
                <div dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }} className="prose text-xs text-gray-600 leading-relaxed" />
                <p className="text-[11px] font-bold text-gray-800 mt-4">* Online Exclusive Offer.</p>
              </div>
            )}
            
            {activeTab === "howToUse" && (
              <div dangerouslySetInnerHTML={{ __html: product.howToUse || "<p>Apply smoothly over wet body structure skin surface.</p>" }} className="prose text-xs text-gray-600 leading-relaxed" />
            )}

            {activeTab === "reviews" && (
              <ProductReviews productId={product._id as string} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}