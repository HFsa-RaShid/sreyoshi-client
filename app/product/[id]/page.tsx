/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Heart, ArrowLeft, Plus, Minus, ShieldCheck, CreditCard, Headphones, Loader2 } from "lucide-react";
import { useApp } from "../../../context/AppContext";

import { Product, ProductShade } from "@/Types/types";
import { useGetSingleProductForCustomer } from "@/hooks/useCustomerData";

export default function ProductDetailsPage() {
  const { id } = useParams(); // 'id' আসলে ইউআরএল থেকে আসা 'productCode'
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useApp();

  // ১. TanStack Query দিয়ে ব্যাকএন্ড থেকে সিঙ্গেল প্রোডাক্ট নিয়ে আসা
  const { data: product, isLoading, isError } = useGetSingleProductForCustomer(id as string);

  // স্টেটসমূহ
  const [activeTab, setActiveTab] = useState<"desc" | "reviews" | "qa">("desc");
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [selectedShade, setSelectedShade] = useState<ProductShade | null>(null);

  // প্রোডাক্ট ডাটা লোড হলে ডিফল্ট শেড এবং ইমেজ সেট করার লজিক
  useEffect(() => {
    if (product) {
      // যদি প্রোডাক্টের একটিভ শেডস থাকে, তবে ১ম একটিভ শেডটি ডিফল্ট সেট হবে
      if (product.shades && product.shades.length > 0) {
        const firstActiveShade = product.shades.find((s: any) => s.status === "Active") || product.shades[0];
        setSelectedShade(firstActiveShade);
        
        // শেডের ইমেজ থাকলে মেইন স্ক্রিনে ১ম শেডের ইমেজটিই আগে দেখাবে
        if (firstActiveShade?.shadeImage) {
          setSelectedImg(firstActiveShade.shadeImage);
        } else if (product.commonImages && product.commonImages.length > 0) {
          setSelectedImg(product.commonImages[0]);
        }
      } else if (product.commonImages && product.commonImages.length > 0) {
        // যদি শেডস না থাকে, তবে কমন ইমেজের ১মটি দেখাবে
        setSelectedImg(product.commonImages[0]);
      }
    }
  }, [product]);

  // শেড ক্লিক হ্যান্ডলার
  const handleShadeSelect = (shade: ProductShade) => {
    setSelectedShade(shade);
    if (shade.shadeImage) {
      setSelectedImg(shade.shadeImage);
    }
  };

  // লোডিং স্টেট
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-[#1A2E22]" />
        <p className="text-sm font-medium text-[#1A2E22]/70">Loading Product Details...</p>
      </div>
    );
  }

  // এরর স্টেট
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

  const isFavorite = product._id ? wishlist.includes(product._id) : false;
  const categoryName = typeof product.category === "object" ? product.category?.name : product.subCategory;

  // কার্ট হ্যান্ডলার
  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedShade: selectedShade 
    }, quantity);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 md:px-12 text-[#2C3E35] bg-[#FAF9F6]">
      <div className="container mx-auto p-6 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-sm">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-60 hover:opacity-100 mb-8 transition-opacity">
          <ArrowLeft size={14} /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* ================= LEFT GALLERY ================= */}
          <div>
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#F1EFE9] mb-4 shadow-inner relative">
              <img src={selectedImg || "/placeholder.png"} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
            </div>
            
            {/* Common Images Thumbnail Row (স্থির থাকবে) */}
            <div className="grid grid-cols-4 gap-3">
              {product.commonImages?.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedImg(img)}
                  className={`aspect-square rounded-xl overflow-hidden bg-[#F1EFE9] cursor-pointer border-2 transition-all ${selectedImg === img ? "border-[#FF3F6C]" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt={`view-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT DETAILS INFO ================= */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">
                {categoryName} / {product.itemName}
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1A2E22] mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-200"} />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-500">{product.rating?.toFixed(1)} ({product.ratingCount} reviews)</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold text-[#FF3F6C]">৳{product.price?.toFixed(2)}</span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <>
                    <span className="text-sm line-through text-gray-400">৳{product.oldPrice?.toFixed(2)}</span>
                    <span className="bg-[#FF3F6C]/10 text-[#FF3F6C] text-[10px] font-bold px-2 py-0.5 rounded">SAVE {product.discount}</span>
                  </>
                )}
              </div>

              {/* DYNAMIC SHADES AREA */}
              {product.shades && product.shades.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22] mb-3">
                    Select Shade: <span className="text-[#FF3F6C] normal-case font-medium ml-1">{selectedShade?.shadeName || "None"}</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.shades.map((shade: ProductShade, idx: number) => {
                      if (shade.status === "Inactive") return null;
                      const isShadeSelected = selectedShade?.shadeName === shade.shadeName;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleShadeSelect(shade)}
                          title={`${shade.shadeName} (${shade.stock} left)`}
                          className={`w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center ${isShadeSelected ? "border-[#1A2E22] scale-110 shadow-md" : "border-gray-200 hover:scale-105"}`}
                          style={{ backgroundColor: shade.shadeColorCode || "#ccc" }}
                        >
                          {/* {isShadeSelected && (
                            <div className="w-2 h-2 rounded-full bg-white mix-blend-difference" />
                          )} */}
                          {shade.stock === 0 && (
                            <div className="absolute inset-0 w-full h-full bg-white/70 rounded-full flex items-center justify-center text-[8px] font-bold text-red-600">X</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-xl text-xs flex flex-col gap-2 border border-gray-100 mb-6">
                <p><b>Availability:</b> <span className={product.availability === "In Stock" ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>{product.availability}</span></p>
                <p className="text-gray-500">Weight/Volume: {product.weightOrVolume} {product.unit}</p>
              </div>
            </div>

            {/* INTERACTION BUTTONS */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <button 
                  onClick={() => product._id && toggleWishlist(product._id)}
                  className={`p-3.5 rounded-xl border transition-all ${isFavorite ? "bg-[#FF3F6C] text-white border-transparent" : "bg-white text-gray-400 hover:bg-gray-50 border-gray-200"}`}
                >
                  <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>

                <div className="flex items-center bg-gray-100 rounded-xl px-2 py-1">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 text-gray-500"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="p-2 text-gray-500"><Plus size={14} /></button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={product.availability === "Out of Stock"}
                  className={`flex-1 py-4 rounded-xl font-bold text-xs shadow-md transition-colors uppercase tracking-wider ${product.availability === "Out of Stock" ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#1A2E22] text-white hover:bg-black"}`}
                >
                  {product.availability === "Out of Stock" ? "Out of Stock" : "Add To Bag"}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                <div className="flex flex-col items-center gap-1"><ShieldCheck size={16} className="text-emerald-600" /> 100% Genuine</div>
                <div className="flex flex-col items-center gap-1"><CreditCard size={16} className="text-blue-600" /> Secure Pay</div>
                <div className="flex flex-col items-center gap-1"><Headphones size={16} className="text-amber-600" /> Support 24/7</div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS DETAILS */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <div className="flex justify-center gap-4 mb-8">
            {(["desc", "reviews", "qa"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wide transition-all ${activeTab === tab ? "bg-[#1A2E22] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {tab === "desc" ? "Description" : tab === "reviews" ? "Reviews" : "Q&A"}
              </button>
            ))}
          </div>

          <div className="text-sm leading-relaxed text-gray-600 max-w-3xl mx-auto bg-gray-50 p-6 rounded-2xl border border-gray-100">
            {activeTab === "desc" && (
              <div>
                <p className="mb-2">Premium quality formula suitable for your routine look. This product is crafted beautifully keeping backend standard checks in mind.</p>
                <p className="text-xs text-gray-400">Promotion Tag: {product.promotion || "Standard"}</p>
              </div>
            )}
            {activeTab === "reviews" && <p className="text-xs text-gray-400 text-center py-4">No reviews posted yet for this batch ({product.ratingCount} accumulated).</p>}
            {activeTab === "qa" && <p className="text-xs text-gray-400 text-center py-4">Have questions? Ask our specialist team above.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}