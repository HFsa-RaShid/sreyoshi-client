"use client";

import { Product } from "@/Types/types";
import React, { createContext, useContext, useState, useEffect } from "react";

// oldPrice কে অপশনাল (?.) করা হয়েছে
interface CartItem {
  id: string;
  name: string;
  price: number;
  oldPrice?: number; 
  image: string;
  quantity: number;
  category: string;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleWishlist: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("sreyoshi_cart");
    const savedWishlist = localStorage.getItem("sreyoshi_wishlist");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  useEffect(() => {
    if (cart.length > 0 || localStorage.getItem("sreyoshi_cart")) {
      localStorage.setItem("sreyoshi_cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (wishlist.length > 0 || localStorage.getItem("sreyoshi_wishlist")) {
      localStorage.setItem("sreyoshi_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const addToCart = (product: Product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice, // এখন আর এরর দিবে না
          image: product.images[0],
          quantity: qty,
          category: product.category,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

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