"use client";

import { Product, ProductShade } from "@/Types/types";
import React, { createContext, useContext, useState, useEffect } from "react";

// ব্যাকএন্ড ডাটা স্ট্রাকচার অনুযায়ী CartItem ইন্টারফেস
export interface CartItem {
  cartItemId: string; // ProductId + ShadeName দিয়ে তৈরি ইউনিক আইডি
  id: string;         // আসল প্রোডাক্টের _id
  name: string;
  price: number;
  oldPrice?: number; 
  image: string;
  quantity: number;
  category: string;
  selectedShade: ProductShade | null; // সিলেক্টেড শেডের সম্পূর্ণ ডাটা সংরক্ষণের জন্য
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product & { selectedShade?: ProductShade | null }, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleWishlist: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  // লোকাল স্টোরেজ থেকে ডাটা লোড শেষ হয়েছে কিনা তা ট্র্যাক করার জন্য
  const [isHydrated, setIsHydrated] = useState(false);

  // ১. মাউন্ট হওয়ার সময় লোকাল স্টোরেজ থেকে ডাটা লোড করা
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
    setIsHydrated(true); // লোড কমপ্লিট
  }, []);

  // ২. কার্ট স্টেট চেঞ্জ হলে লোকাল স্টোরেজে সেভ করা (শুধুমাত্র ডাটা লোড হওয়ার পর)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("sreyoshi_cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  // ৩. উইশলিস্ট স্টেট চেঞ্জ হলে লোকাল স্টোরেজে সেভ করা (শুধুমাত্র ডাটা লোড হওয়ার পর)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("sreyoshi_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated]);

  // ৪. কার্ট-এ অ্যাড করার লজিক (একই প্রোডাক্ট এবং শেড হলে কাউন্ট বাড়বে)
  const addToCart = (product: Product & { selectedShade?: ProductShade | null }, qty = 1) => {
    const productId = product._id || product.productCode || "";
    const shadeName = product.selectedShade?.shadeName || "NoShade";
    
    // প্রোডাক্ট আইডি এবং শেডের নাম মিলিয়ে সম্পূর্ণ ইউনিক আইডি তৈরি
    const cartItemId = `${productId}-${shadeName}`;

    // ক্যাটাগরি অবজেক্ট বা স্ট্রিং ডাইনামিক হ্যান্ডেল
    const categoryString = typeof product.category === "object" 
      ? product.category?.name 
      : product.subCategory || product.category || "";

    // কার্ট ইমেজের প্রায়োরিটি সেটআপ
    const cartImage = product.selectedShade?.shadeImage || (product.commonImages && product.commonImages[0]) || "/placeholder.png";

    setCart((prev) => {
      // কার্টে অলরেডি এই `cartItemId` আছে কিনা চেক করা হচ্ছে
      const exists = prev.find((item) => item.cartItemId === cartItemId);
      
      if (exists) {
        // নতুন রো তৈরি না করে আগের আইটেমটির সাথেই কোয়ান্টিটি যোগ হবে
        return prev.map((item) =>
          item.cartItemId === cartItemId 
            ? { ...item, quantity: item.quantity + qty } 
            : item
        );
      }
      
      // কার্টে না থাকলে নতুন আইটেম হিসেবে পুশ হবে
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

  // ७. উইশলিস্ট টগল করা
  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <AppContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQuantity, toggleWishlist }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};