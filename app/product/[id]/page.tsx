"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Heart, ArrowLeft, Plus, Minus, ShieldCheck, CreditCard, Headphones } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import productsData from "../../../public/data/products.json";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useApp();
  
  const product = productsData.find((p) => p.id === id) || productsData[0];
  const [activeTab, setActiveTab] = useState<"desc" | "reviews" | "qa">("desc");
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(product.images[0]);

  const isFavorite = wishlist.includes(product.id);

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 md:px-12 text-[#2C3E35]">
      <div className="container mx-auto p-6 md:p-10 rounded-[32px]">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-60 hover:opacity-100 mb-8 transition-opacity">
          <ArrowLeft size={14} /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* LEFT Gallery */}
          <div>
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#F1EFE9] mb-4 shadow-inner">
              <img src={selectedImg} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedImg(img)}
                  className={`aspect-square rounded-xl overflow-hidden bg-[#F1EFE9] cursor-pointer border-2 transition-all ${selectedImg === img ? "border-[#FF3F6C]" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT Details Info */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">{product.category}</span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1A2E22] mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400"><Star size={14} fill="currentColor" /></div>
                <span className="text-xs font-bold">{product.rating} ({product.ratingCount} reviews)</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold text-[#FF3F6C]">${product.price.toFixed(2)}</span>
                <span className="text-sm line-through text-gray-400">${product.oldPrice.toFixed(2)}</span>
                <span className="bg-[#FF3F6C]/10 text-[#FF3F6C] text-[10px] font-bold px-2 py-0.5 rounded">SAVE {product.discount}</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-xs flex flex-col gap-2 border border-gray-100 mb-6">
                <p>🚚 <b>Free Shipping Offers</b></p>
                <p className="text-gray-500">Free delivery valid on minimum order amounts of $50 or above.</p>
              </div>
            </div>

            {/* INTERACTION BUTTONS */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <button 
                  onClick={() => toggleWishlist(product.id)}
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
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-[#1A2E22] text-white py-4 rounded-xl font-bold text-xs shadow-md hover:bg-black transition-colors uppercase tracking-wider"
                >
                  Add To Bag
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
            {activeTab === "desc" && <p>Premium dermatologically tested organic formula. Gently rejuvenates the skin layer, bringing back natural glow and smooth radiant finish within 14 days of regular use.</p>}
            {activeTab === "reviews" && <p className="text-xs text-gray-400 text-center py-4">No reviews posted yet for this batch.</p>}
            {activeTab === "qa" && <p className="text-xs text-gray-400 text-center py-4">Have questions? Ask our specialist team above.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}