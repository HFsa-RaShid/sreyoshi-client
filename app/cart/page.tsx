/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Trash2, Plus, Minus, ShoppingBag, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, validateAndSyncCart } = useApp();

  // 💡 কার্ট পেজে ঢোকার সাথে সাথে ব্যাকএন্ডের ফ্রেশ স্টক ডাটার সাথে সিঙ্ক করা
  useEffect(() => {
    validateAndSyncCart();
  }, []);

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // 💡 চেক করা কার্টের কোনো আইটেম স্টক আউট বা ইনভ্যালিড অবস্থায় আছে কিনা
  const hasCartError = cart.some((item) => item.error || item.quantity === 0);

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
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
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
                  className={`bg-white p-4 rounded-2xl flex gap-4 items-center border shadow-sm transition-all ${
                    item.error ? "border-amber-300 bg-amber-50/30" : "border-gray-100"
                  }`}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className={`w-20 h-20 rounded-xl object-cover bg-gray-50 flex-shrink-0 ${item.quantity === 0 ? "grayscale opacity-50" : ""}`} 
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#1A2E22] line-clamp-1">{item.name}</h3>
                    <p className="text-[11px] text-gray-400 capitalize mb-1">{item.category}</p>
                    
                    {item.selectedShade && (
                      <div className="flex items-center gap-1.5 mb-1">
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

                    {/* 💡 এরর মেসেজ বা স্টক আউট নোটিশ শো করা */}
                    {item.error && (
                      <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium mt-1">
                        <AlertTriangle size={12} />
                        <span>{item.error}</span>
                      </div>
                    )}
                  </div>
                  
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
                      disabled={item.quantity >= item.maxStock}
                      className="p-2 text-gray-500 hover:text-[#1A2E22] transition-colors disabled:opacity-30"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

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

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22] mb-4 opacity-60">
              Order Summary
            </h3>
            <div className="flex justify-between text-sm font-bold border-b border-gray-100 pb-4 mb-4">
              <span className="text-gray-400 font-normal">Subtotal</span>
              <span className="text-[#1A2E22] font-sans">৳{totalPrice.toFixed(2)}</span>
            </div>
            
            {/* 💡 কার্টে কোনো স্টক এরর থাকলে Checkout বাটন লক থাকবে এবং ওয়ার্নিং দেবে */}
            {hasCartError ? (
              <div>
                <button disabled className="w-full bg-gray-300 text-gray-500 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed shadow-none">
                  Proceed To Checkout
                </button>
                <p className="text-[10px] text-rose-500 text-center mt-2 font-medium">
                  Please fix or remove the out-of-stock items to proceed!
                </p>
              </div>
            ) : (
              <Link href='/checkout'>
                <button className="w-full bg-[#1A2E22] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors shadow-md">
                  Proceed To Checkout
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}