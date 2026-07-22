
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
  LayoutDashboard,
  LogOut
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
import { useAutoTranslate } from "@/context/AutoTranslateContext";



export default function Navbar() {
  const router = useRouter();
  const { cart } = useApp();
  const { data: session } = useSession();

  const { wishlistItems = [] } = useWishlist()
  const { lang, toggleLanguage } = useAutoTranslate();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // ⚡ ফিক্সড: ডেক্সটপ ড্রপডাউন কন্ট্রোল করার জন্য নতুন স্টেট
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null); 
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData = [] } = useGetCategoriesForCustomer() as { data: Category[] };
  const { data: productsData = [] } = useGetProductsForCustomer() as { data: Product[] };

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
    return () => document.addEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchDropdown(false);
    } else {
      const filtered = (productsData || []).filter((product: Product) =>
        product?.name?.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault(); 
      router.push("/signin"); 
    }
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav
      className={`px-4 py-4 md:px-12 w-full z-50 transition-all duration-300 left-0 right-0 ${
        isScrolled || isOpen
          ? "fixed top-0 bg-[#FAF9F6] shadow-md backdrop-blur-md"
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
              onClick={() => setIsOpen(false)}
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
          {(categoriesData || []).map((category: Category) => {
            const categoryId = category._id;
            const subCategories = category.subCategories || [];
            const isCurrentOpen = activeDropdown === categoryId;

            return (
              <div 
                key={categoryId} 
                className="static py-5"
                // ⚡ ফিক্সড: মাউস ড্রপডাউন কন্ডিশনাল হ্যান্ডেলিং
                onMouseEnter={() => setActiveDropdown(categoryId)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={`/shop?category=${categoryId}`}
                  onClick={() => setActiveDropdown(null)} // 🎯 ফিক্সড: ক্লিক করলেই মেনু অফ হবে
                  className="hover:text-black transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  {category.name}
                  <ChevronDown
                    size={14}
                    className={`opacity-60 transition-transform duration-300 ${isCurrentOpen ? "rotate-180" : ""}`}
                  />
                </Link>

                {subCategories.length > 0 && (
                  <div
                    className={`absolute left-0 right-0 mx-auto top-22 bg-white shadow-xl rounded-2xl p-8 grid transition-all duration-300 z-50 before:content-[''] before:absolute before:-top-7.5 before:left-0 before:right-0 before:h-7.5 ${
                      isCurrentOpen 
                        ? "opacity-100 translate-y-0 pointer-events-auto" 
                        : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
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
                                    onClick={() => setActiveDropdown(null)} // 🎯 ফিক্সড: সাবক্লিক করলেও মেনু সাথে সাথে বন্ধ হবে
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

        {/* SEARCH BAR, WISHLIST, USER PROFILE & CART (DESKTOP) */}
        <div className="hidden md:flex items-center gap-4 grow max-w-lg justify-end">
          <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-xs font-semibold rounded-full border bg-white/80"
    >
      🌐 {lang === "en" ? "BN" : "EN"}
    </button>
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
                          src={product.commonImages?.[0]}
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
                          ৳{product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
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

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-0 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-50 font-sans">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowProfileDropdown(false)}
                        className="w-full block text-left px-3 py-2 text-xs text-[#2C3E35] hover:bg-gray-50 rounded-xl mt-1 transition-colors font-medium cursor-pointer"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          signOut();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl mt-0.5 transition-colors font-medium cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-[#1A2E22] border border-gray-300 rounded-full px-4 py-2 hover:border-[#1A2E22] bg-white/40 transition-all shadow-sm whitespace-nowrap inline-block cursor-pointer"
                >
                  Sign In
                </Link>
              )}
            </div>

            <Link
              href="/wishlist"
              onClick={handleWishlistClick}
              className="relative p-1 text-gray-700 hover:text-[#FF3F6C] transition-colors shrink-0 cursor-pointer"
            >
              <Heart
                strokeWidth={1.5}
                className={`w-7 h-7 ${session && wishlistItems.length > 0 ? "text-[#FF3F6C] fill-[#FF3F6C]" : ""}`}
              />
              {session && wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF3F6C] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center translate-x-1 -translate-y-1 animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-1 text-gray-700 hover:text-black transition-colors shrink-0 cursor-pointer"
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
          <Link
            href="/wishlist"
            onClick={(e: any) => {
              handleWishlistClick(e);
              setIsOpen(false);
            }} 
            className="relative p-1 text-gray-700 shrink-0 cursor-pointer"
          >
            <Heart
              strokeWidth={1.5}
              className={`w-6 h-6 ${session && wishlistItems.length > 0 ? "text-[#FF3F6C] fill-[#FF3F6C]" : ""}`}
            />
            {session && wishlistItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#FF3F6C] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center translate-x-1 -translate-y-1 animate-pulse">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link href="/cart" onClick={() => setIsOpen(false)} className="relative p-1 text-gray-700 shrink-0 cursor-pointer">
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
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 px-6 py-5 flex flex-col gap-3 shadow-xl max-h-[80vh] overflow-y-auto transition-all z-50">
          
          {session ? (
            <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-3 mb-1 font-sans">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-3 bg-[#1A2E22] text-white text-sm font-semibold rounded-xl active:scale-[0.98] transition-all"
              >
                <LayoutDashboard size={18} strokeWidth={2} />
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-medium rounded-xl transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              onClick={() => setIsOpen(false)}
              className="w-full text-center block px-4 py-3 bg-gray-100 text-[#1A2E22] text-sm font-bold rounded-xl mb-1"
            >
              SIGN IN
            </Link>
          )}

          {/* MOBILE SEARCH */}
          <div ref={mobileSearchRef} className="relative w-full mb-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>

          {/* CATEGORIES SECTION */}
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Categories
            </p>

            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className="w-full text-left font-bold py-3 px-3 bg-rose-50 text-rose-600 rounded-xl text-sm transition-colors block border border-dashed border-rose-200 mb-1"
            >
              🛍️ All Products
            </Link>

            {(categoriesData || []).map((category: any) => {
              const categoryId = category._id || category.id;

              return (
                <Link
                  key={categoryId}
                  href={`/shop?category=${categoryId}`}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left font-medium py-3 px-3 hover:bg-gray-50 rounded-xl text-[#2C3E35] text-sm transition-colors block"
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}