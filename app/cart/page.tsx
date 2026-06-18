"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  // AppContext থেকে স্টেট এবং সঠিক ফাংশনগুলো নিয়ে আসা
  const { cart, updateQuantity, removeFromCart } = useApp();

  // রিয়াল-টাইম মোট প্রাইস ক্যালকুলেশন
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // কার্ট খালি থাকলে এই ভিউটি দেখাবে
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-[#2C3E35]">
        <ShoppingBag size={44} className="opacity-20 mb-3" />
        <h2 className="text-lg font-serif font-bold mb-1">Your Shopping Bag is empty</h2>
        <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-[#FF3F6C] underline">
          Go To Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 pb-12 px-4 md:px-12 text-[#2C3E35]">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl font-serif font-bold text-[#1A2E22] mb-8">
          Shopping Bag ({cart.length})
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE: CART ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              // মাইনাস বাটনে ক্লিক করলে কোয়ান্টিটি কমবে, ১ এর নিচে নামলে স্বয়ংক্রিয়ভাবে রিমুভ হবে
              const handleMinusClick = () => {
                if (item.quantity <= 1) {
                  removeFromCart(item.cartItemId);
                } else {
                  updateQuantity(item.cartItemId, item.quantity - 1);
                }
              };

              return (
                <div 
                  key={item.cartItemId} 
                  className="bg-white p-4 rounded-2xl flex gap-4 items-center border border-gray-100 shadow-sm"
                >
                  {/* PRODUCT IMAGE (কনটেক্সট থেকে সরাসরি আসা শেড ইমেজ বা মেইন ইমেজ) */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 rounded-xl object-cover bg-gray-50 flex-shrink-0" 
                  />
                  
                  {/* PRODUCT DETAILS */}
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#1A2E22] line-clamp-1">{item.name}</h3>
                    <p className="text-[11px] text-gray-400 capitalize mb-1">{item.category}</p>
                    
                    {/* যদি কোনো শেড সিলেক্ট করা থাকে তবে তা সুন্দর করে দেখাবে */}
                    {item.selectedShade && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block"
                          style={{ backgroundColor: item.selectedShade.shadeColorCode || "#ccc" }}
                        />
                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">
                          Shade: {item.selectedShade.shadeName}
                        </span>
                      </div>
                    )}
                    
                    <div className="block">
                      <span className="text-sm font-bold text-[#FF3F6C]">৳{item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center bg-gray-100 rounded-xl px-1">
                    <button 
                      onClick={handleMinusClick} 
                      className="p-2 text-gray-500 hover:text-[#FF3F6C] transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold font-sans">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} 
                      className="p-2 text-gray-500 hover:text-[#1A2E22] transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* REMOVE / TRASH BUTTON */}
                  <button 
                    onClick={() => removeFromCart(item.cartItemId)} 
                    className="text-gray-300 hover:text-rose-500 transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDE: ORDER SUMMARY */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22] mb-4 opacity-60">
              Order Summary
            </h3>
            <div className="flex justify-between text-sm font-bold border-b border-gray-100 pb-4 mb-4">
              <span className="text-gray-400 font-normal">Subtotal</span>
              <span className="text-[#1A2E22] font-sans">৳{totalPrice.toFixed(2)}</span>
            </div>
            <Link href='/checkout'>
            <button className="w-full bg-[#1A2E22] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors shadow-md">
              Proceed To Checkout
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}