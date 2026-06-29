
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Heart,
  User,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  useGetCategoriesForCustomer,
  useGetProductsForCustomer,
} from "@/hooks/useCustomerData";
import { Category, Product, SubCategoryGroup } from "@/Types/types";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/useWishlist"; 

export default function Navbar() {
  const router = useRouter();
  const { cart } = useApp();
  const { data: session } = useSession();

  const { wishlistItems = [] } = useWishlist(); 

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData = [] } = useGetCategoriesForCustomer();
  const { data: productsData = [] } = useGetProductsForCustomer();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchDropdown(false);
    } else {
      const filtered = productsData.filter((product: Product) =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    }
  };

  const toggleMobileSubMenu = (id: string) => {
    if (activeMobileMenu === id) {
      setActiveMobileMenu(null);
    } else {
      setActiveMobileMenu(id);
    }
  };

  // 🎯 মেইন ফিক্স ২: লগইন না থাকলে উইশলিস্ট বাটনে ক্লিক করলে সাইন-ইন পেজে রিডাইরেক্ট করার হ্যান্ডলার
  const handleWishlistClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault(); // ডিফল্ট লিঙ্ক ট্র্যাকিং ব্লক
      router.push("/signin"); // সরাসরি সাইন ইন পেজে পাঠিয়ে দেওয়া
    }
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav
      className={`px-2 py-5 md:px-12 w-full z-50 transition-all duration-300 left-0 right-0 ${
        isScrolled
          ? "fixed top-0 bg-[#FAF9F6] shadow-sm backdrop-blur-md "
          : "absolute top-0 bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex flex-col items-center select-none shrink-0">
          <div className="flex items-start gap-0.5 relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#8FA887] text-base md:text-xl md:-top-2.5">
              🍃
            </span>
            <Link
              href="/"
              className="font-serif text-2xl md:text-3xl font-semibold text-[#1A2E22] tracking-wide mt-1"
            >
              Sreyoshi
            </Link>
          </div>
          <span className="text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-[#5A655D] font-medium -mt-0.5 md:-mt-1">
            Shop. Love. Live.
          </span>
        </div>

        {/* DESKTOP NAVIGATION LINKS */}
        <div className="hidden lg:flex items-center gap-8 text-[#2C3E35] font-medium text-[15px] h-full static">
          {categoriesData.map((category: Category) => {
            const categoryId = category._id;
            const subCategories = category.subCategories || [];

            return (
              <div key={categoryId} className="static group py-5">
                <Link
                  href={`/shop?category=${categoryId}`}
                  className="hover:text-black transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  {category.name}
                  <ChevronDown
                    size={14}
                    className="opacity-60 group-hover:rotate-180 transition-transform duration-300"
                  />
                </Link>

                {subCategories.length > 0 && (
                  <div
                    className="absolute left-0 right-0 mx-auto top-22 bg-white shadow-xl rounded-2xl p-8 grid opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 before:content-[''] before:absolute before:-top-7.5 before:left-0 before:right-0 before:h-7.5"
                    style={{
                      width: subCategories.length > 3 ? "85vw" : "60vw",
                      maxWidth: "1150px",
                      gridTemplateColumns: `repeat(${subCategories.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {subCategories.map(
                      (sub: SubCategoryGroup, subIdx: number) => (
                        <div key={subIdx} className="flex flex-col px-2">
                          <h4 className="font-sans text-xs font-bold tracking-wider text-[#1A2E22] mb-3 border-b border-gray-100 pb-1 uppercase">
                            {sub.title}
                          </h4>
                          <ul className="flex flex-col gap-2">
                            {(sub.items || []).map(
                              (item: any, itemIdx: number) => (
                                <li key={itemIdx}>
                                  <Link
                                    href={`/shop?subCategory=${encodeURIComponent(item.name)}`}
                                    className="font-sans text-xs text-[#5A655D] hover:text-[#1A2E22] hover:font-medium transition-all block whitespace-nowrap"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SEARCH BAR, WISHLIST, USER PROFILE & CART */}
        <div className="hidden md:flex items-center gap-4 grow max-w-lg justify-end">
          {/* SEARCH BAR */}
          <div ref={searchRef} className="relative w-full max-w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
              placeholder="Search products..."
              className="w-full bg-white/50 border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#8FA887] placeholder-gray-500 text-gray-700 transition-colors"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4 cursor-pointer" />

            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-50 p-2">
                {searchResults.map((product) => {
                  const pId = product._id || product.id || product.productCode;
                  return (
                    <div
                      key={pId}
                      onClick={() => {
                        router.push(`/product/${product.productCode || pId}`);
                        setShowSearchDropdown(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 relative overflow-hidden shrink-0">
                        <Image
                          src={
                            product.images?.[0] ||
                            "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=100"
                          }
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#1A2E22] truncate">
                          {product.name}
                        </span>
                        <span className="text-[11px] text-[#CDA275] font-semibold">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT ACTION BUTTONS CONTAINER */}
          <div className="flex items-center gap-4 shrink-0">
            {/* USER PROFILE / SIGN IN CONTROLLER */}
            <div ref={profileRef} className="relative flex items-center">
              {session ? (
                <div
                  className="relative py-2"
                  onMouseEnter={() => setShowProfileDropdown(true)}
                  onMouseLeave={() => setShowProfileDropdown(false)}
                >
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition-colors focus:outline-none whitespace-nowrap"
                  >
                    <User strokeWidth={1.5} className="w-7 h-7" />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-0 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-50 font-sans">
                      <Link
                        href="/dashboard"
                        className="w-full block text-left px-3 py-2 text-xs text-[#2C3E35] hover:bg-gray-50 rounded-xl mt-1 transition-colors font-medium"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl mt-0.5 transition-colors font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-[#1A2E22] border border-gray-300 rounded-full px-4 py-2 hover:border-[#1A2E22] bg-white/40 transition-all shadow-sm whitespace-nowrap inline-block"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* WISHLIST (DESKTOP) */}
            <Link
              href="/wishlist"
              onClick={handleWishlistClick} // 🎯 মেইন ফিক্স ৩: লগইন না থাকলে রিডাইরেক্ট কন্ডিশন সেট হলো
              className="relative p-1 text-gray-700 hover:text-[#FF3F6C] transition-colors shrink-0"
            >
              <Heart
                strokeWidth={1.5}
                className={`w-7 h-7 ${session && wishlistItems.length > 0 ? "text-[#FF3F6C] fill-[#FF3F6C]" : ""}`}
              />
              {/* 🎯 মেইন ফিক্স ৪: সাইন-ইন অবস্থায় লাইভ উইশলিস্ট আইটেম কাউন্টের ব্যাজ লোড হবে */}
              {session && wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF3F6C] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center translate-x-1 -translate-y-1 animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* CART */}
            <Link
              href="/cart"
              className="relative p-1 text-gray-700 hover:text-black transition-colors shrink-0"
            >
              <ShoppingBag strokeWidth={1.5} className="w-7 h-7" />
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#2D4A3E] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center translate-x-1 -translate-y-1">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* MOBILE USER PROFILE DROPDOWN */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="text-gray-700 hover:text-black p-1 focus:outline-none"
              >
                <User strokeWidth={1.5} className="w-6 h-6" />
              </button>

              {/* Mobile Profile Dropdown Box */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl p-1.5 z-50 font-sans">
                  <Link
                    href="/dashboard"
                    onClick={() => setShowProfileDropdown(false)}
                    className="w-full block text-left px-3 py-2 text-xs text-[#2C3E35] hover:bg-gray-50 rounded-lg font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      signOut();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium mt-0.5"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              className="text-xs font-bold uppercase text-gray-700 border border-gray-300 rounded-full px-3 py-1 bg-white shadow-sm whitespace-nowrap"
            >
              Sign In
            </Link>
          )}

          {/* WISHLIST (MOBILE) */}
          <Link
            href="/wishlist"
            onClick={handleWishlistClick} // 🎯 মেইন ফিক্স ৫: মোবাইল ভিউতেও রিডাইরেক্ট সিকিউরিটি হ্যান্ডলার যুক্ত হলো
            className="relative p-1 text-gray-700 shrink-0"
          >
            <Heart
              strokeWidth={1.5}
              className={`w-6 h-6 ${session && wishlistItems.length > 0 ? "text-[#FF3F6C] fill-[#FF3F6C]" : ""}`}
            />
            {/* 🎯 মেইন ফিক্স ৬: মোবাইল ভিউর জন্য লাইভ উইশলিস্ট ব্যাজ কাউন্টার */}
            {session && wishlistItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#FF3F6C] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center translate-x-1 -translate-y-1 animate-pulse">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative p-1 text-gray-700 shrink-0">
            <ShoppingBag strokeWidth={1.5} className="w-6 h-6" />
            {totalCartItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#2D4A3E] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center translate-x-1 -translate-y-1">
                {totalCartItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#1A2E22] p-1 shrink-0"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROP-DOWN MENU PANEL */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-2 shadow-md max-h-[80vh] overflow-y-auto transition-all">
          {/* MOBILE SEARCH */}
          <div ref={searchRef} className="relative w-full mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>

          {categoriesData.map((category: any) => {
            const categoryId = category._id || category.id;
            const subCategories = category.subCategories || [];

            return (
              <div key={categoryId} className="border-b border-gray-50 pb-2">
                <button
                  onClick={() => toggleMobileSubMenu(categoryId)}
                  className="w-full flex items-center justify-between font-medium py-2 text-[#2C3E35] text-sm"
                >
                  {category.name}
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${activeMobileMenu === categoryId ? "rotate-180" : ""}`}
                  />
                </button>

                {activeMobileMenu === categoryId &&
                  subCategories.length > 0 && (
                    <div className="pl-4 mt-1 flex flex-col gap-4 bg-gray-50/50 p-3 rounded-lg">
                      {subCategories.map((sub: any, subIdx: number) => (
                        <div key={subIdx}>
                          <p className="text-[11px] font-bold text-[#1A2E22] uppercase tracking-wider mb-1.5">
                            {sub.title}
                          </p>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            {(sub.items || []).map(
                              (item: any, itemIdx: number) => (
                                <Link
                                  key={itemIdx}
                                  href={`/shop?subCategory=${encodeURIComponent(item.name)}`}
                                  onClick={() => setIsOpen(false)}
                                  className="text-xs text-[#5A655D] py-0.5 hover:text-black"
                                >
                                  {item.name}
                                </Link>
                              ),
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}