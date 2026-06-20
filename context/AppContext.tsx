/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Product, ProductShade } from "@/Types/types";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  cartItemId: string; 
  id: string;         
  name: string;
  price: number;
  oldPrice?: number; 
  image: string;
  quantity: number;
  category: string;
  selectedShade: ProductShade | null;
  // 💡 নিচে নতুন প্রোপার্টিগুলো যোগ করা হয়েছে
  maxStock: number; 
  error?: string; 
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product & { selectedShade?: ProductShade | null }, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleWishlist: (id: string) => void;
  clearCart: () => void; 
  validateAndSyncCart: () => Promise<void>; // 💡 কার্ট ভ্যালিডেশনের গ্লোবাল মেথড
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // লোকাল স্টোরেজ থেকে ডাটা লোড করা
  useEffect(() => {
    const savedCart = localStorage.getItem("sreyoshi_cart");
    const savedWishlist = localStorage.getItem("sreyoshi_wishlist");

    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch (e) { console.error(e); }
    }
    setIsHydrated(true); 
  }, []);

  // কার্ট ও উইশলিস্ট সেভ করা
  useEffect(() => {
    if (isHydrated) localStorage.setItem("sreyoshi_cart", JSON.stringify(cart));
  }, [cart, isHydrated]);

  useEffect(() => {
    if (isHydrated) localStorage.setItem("sreyoshi_wishlist", JSON.stringify(wishlist));
  }, [wishlist, isHydrated]);

  // 💡 ব্যাকএন্ড থেকে কার্টের ফ্রেশ স্টক ভ্যালিডেশন ও সিঙ্ক করার মেথড
  const validateAndSyncCart = useCallback(async () => {
    if (cart.length === 0) return;
    try {
      // আপনার ব্যাকএন্ডের সঠিক এপিআই এন্ডপয়েন্ট এখানে বসাবেন
      const response = await fetch("http://localhost:8080/api/v1/products/validate-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({ id: item.id, shadeName: item.selectedShade?.shadeName }))
        }),
      });

      const result = await response.json();
      if (!result.success) return;

      // ব্যাকএন্ড থেকে ডাটা আসবে: { [cartItemId]: freshStock } ফরম্যাটে
      const freshStocks = result.data; 

      setCart((prev) =>
        prev.map((item) => {
          const freshStock = freshStocks[item.cartItemId] ?? item.maxStock;
          let errorMsg = undefined;
          let finalQty = item.quantity;

          if (freshStock === 0) {
            errorMsg = "Out of Stock";
            finalQty = 0;
          } else if (item.quantity > freshStock) {
            errorMsg = `Adjusted to max available (${freshStock})`;
            finalQty = freshStock;
          }

          return {
            ...item,
            maxStock: freshStock,
            quantity: finalQty,
            error: errorMsg,
          };
        })
      );
    } catch (error) {
      console.error("Cart stock validation failed", error);
    }
  }, [cart]);

  // ৪. কার্ট-এ অ্যাড করার লজিক (স্টক ভ্যালিডেশনসহ)
  const addToCart = (product: Product & { selectedShade?: ProductShade | null }, qty = 1) => {
    const productId = product._id || product.productCode || "";
    const shadeName = product.selectedShade?.shadeName || "NoShade";
    const cartItemId = `${productId}-${shadeName}`;

    // প্রোডাক্টের শেড থাকলে শেডের স্টক, না থাকলে টোটাল স্টক কাউন্ট হবে
    const maxStock = product.selectedShade ? (product.selectedShade as any).stock : (product as any).totalStock || 0;

    if (maxStock <= 0) {
      alert("Sorry, this item is currently out of stock!");
      return;
    }

    const categoryString = typeof product.category === "object" 
      ? (product.category as any)?.name 
      : product.subCategory || product.category || "";

    const cartImage = product.selectedShade?.shadeImage || (product.commonImages && product.commonImages[0]) || "/placeholder.png";

    setCart((prev) => {
      const exists = prev.find((item) => item.cartItemId === cartItemId);
      if (exists) {
        const potentialQty = exists.quantity + qty;
        if (potentialQty > maxStock) {
          alert(`Sorry, only ${maxStock} units available. You already have ${exists.quantity} in your bag.`);
          return prev;
        }
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: potentialQty, error: undefined } : item
        );
      }
      
      if (qty > maxStock) {
        alert(`Sorry, only ${maxStock} units available.`);
        return prev;
      }

      return [
        ...prev,
        {
          cartItemId,
          id: productId,
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          image: cartImage,
          quantity: qty,
          category: categoryString,
          selectedShade: product.selectedShade ? { ...product.selectedShade } : null,
          maxStock,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // 💡 কোয়ান্টিটি আপডেট করার সময় ম্যাক্স স্টক চেক করা
  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(cartItemId);
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          if (quantity > item.maxStock) {
            alert(`Maximum limit reached! Only ${item.maxStock} items available.`);
            return item;
          }
          return { ...item, quantity, error: undefined };
        }
        return item;
      })
    );
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("sreyoshi_cart");
  }, []);

  return (
    <AppContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQuantity, toggleWishlist, clearCart, validateAndSyncCart }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};