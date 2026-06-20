/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Product, ProductShade } from "@/Types/types";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// CartItem ইন্টারফেস
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
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product & { selectedShade?: ProductShade | null }, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleWishlist: (id: string) => void;
  clearCart: () => void; 
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // ১. লোকাল স্টোরেজ থেকে ডাটা লোড করা
  useEffect(() => {
    const savedCart = localStorage.getItem("sreyoshi_cart");
    const savedWishlist = localStorage.getItem("sreyoshi_wishlist");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart hydration failed", e);
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Wishlist hydration failed", e);
      }
    }
    setIsHydrated(true); 
  }, []);

  // ২. কার্ট সেভ করা
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("sreyoshi_cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  // ৩. উইশলিস্ট সেভ করা
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("sreyoshi_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated]);

  // ৪. কার্ট-এ অ্যাড করার লজিক
  const addToCart = (product: Product & { selectedShade?: ProductShade | null }, qty = 1) => {
    const productId = product._id || product.productCode || "";
    const shadeName = product.selectedShade?.shadeName || "NoShade";
    const cartItemId = `${productId}-${shadeName}`;

    const categoryString = typeof product.category === "object" 
      ? product.category?.name 
      : product.subCategory || product.category || "";

    const cartImage = product.selectedShade?.shadeImage || (product.commonImages && product.commonImages[0]) || "/placeholder.png";

    setCart((prev) => {
      const exists = prev.find((item) => item.cartItemId === cartItemId);
      if (exists) {
        return prev.map((item) =>
          item.cartItemId === cartItemId 
            ? { ...item, quantity: item.quantity + qty } 
            : item
        );
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
        },
      ];
    });
  };

  // ৫. কার্ট থেকে আইটেম রিমুভ করা
  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // ৬. কোয়ান্টিটি আপডেট করা
  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(cartItemId);
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  // ৭. উইশলিস্ট টগল করা
  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

 
  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("sreyoshi_cart");
  }, []);

  return (
    <AppContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQuantity, toggleWishlist, clearCart }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};