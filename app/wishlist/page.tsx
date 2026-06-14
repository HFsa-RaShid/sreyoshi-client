"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import productsData from "../../public/data/products.json";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { Product } from "@/Types/types";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  
  const favoriteProducts = productsData.filter((p) => wishlist.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-[#2C3E35]">
        <Heart size={44} className="opacity-20 mb-3 text-[#FF3F6C]" />
        <h2 className="text-lg font-serif font-bold mb-1">Your Wishlist is empty</h2>
        <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-[#FF3F6C] underline">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-12 px-4 md:px-12 text-[#2C3E35]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-serif font-bold text-[#1A2E22] mb-8">My Favorites ({favoriteProducts.length})</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="aspect-4/5 rounded-xl overflow-hidden bg-gray-50 mb-3 relative">
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white text-[#FF3F6C] shadow-md hover:scale-105 transition-transform"
                  >
                    <Heart size={14} className="fill-current" />
                  </button>
                </div>
                <h3 className="text-xs font-bold text-[#1A2E22] line-clamp-1 mb-1">{product.name}</h3>
                <span className="text-sm font-bold text-[#CDA275]">${product.price.toFixed(2)}</span>
              </div>

              <button 
                onClick={() => { addToCart(product as Product); toggleWishlist(product.id); }}
                className="w-full mt-4 bg-gray-50 hover:bg-[#1A2E22] text-[#1A2E22] hover:text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={12} /> Move to Bag
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}