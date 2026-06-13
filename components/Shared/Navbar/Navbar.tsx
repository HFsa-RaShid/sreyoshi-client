"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import categoriesData from "../../../public/data/categories.json";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);

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

  const toggleMobileSubMenu = (id: string) => {
    if (activeMobileMenu === id) {
      setActiveMobileMenu(null);
    } else {
      setActiveMobileMenu(id);
    }
  };

  return (
    <nav
      className={`px-6 py-5 md:px-0 w-full z-50 transition-all duration-300 left-0 right-0 ${
        isScrolled
          ? "fixed top-0 bg-[#FAF9F6] shadow-sm backdrop-blur-md border-b border-gray-100"
          : "absolute top-0 bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* BRAND LOGO AREA */}
        <div className="flex flex-col items-center select-none shrink-0">
          <div className="flex items-start gap-0.5 relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[#8FA887] text-xl">
              🍃
            </span>
            <span className="font-serif text-3xl font-semibold text-[#1A2E22] tracking-wide mt-1">
              Sreyoshi
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#5A655D] font-medium -mt-1">
            Shop. Love. Live.
          </span>
        </div>

        {/* DESKTOP NAVIGATION LINKS WITH SMART MEGA MENU */}

        <div className="hidden lg:flex items-center gap-8 text-[#2C3E35] font-medium text-[15px] h-full static">
          {categoriesData.map((category) => (
            <div key={category.id} className="static group py-5">
              <Link
                href="#"
                className="hover:text-black transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                {category.name}
                <ChevronDown
                  size={14}
                  className="opacity-60 group-hover:rotate-180 transition-transform duration-300"
                />
              </Link>

              {/* DYNAMIC MEGA MENU PANEL */}
              <div

                className="absolute left-0 right-0 mx-auto top-full bg-white shadow-xl rounded-2xl p-8 grid opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50
        before:content-[''] before:absolute before:top-[-30px] before:left-0 before:right-0 before:h-[30px]"
                style={{
                  width: category.subCategories.length > 3 ? "85vw" : "60vw",
                  maxWidth: "1150px",
                  gridTemplateColumns: `repeat(${category.subCategories.length}, minmax(0, 1fr))`,
                }}
              >
                {category.subCategories.map((sub, subIdx) => (
                  <div key={subIdx} className="flex flex-col px-2">
                    <h4 className="font-sans text-xs font-bold tracking-wider text-[#1A2E22] mb-3 border-b border-gray-100 pb-1 uppercase">
                      {sub.title}
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {sub.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <Link
                            href={`/shop?subCategory=${encodeURIComponent(item)}`}
                            className="font-sans text-xs text-[#5A655D] hover:text-[#1A2E22] hover:font-medium transition-all block whitespace-nowrap"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Link href="#" className="hover:text-black transition-colors py-5">
            Contact
          </Link>
        </div>

        {/* SEARCH BAR & CART */}
        <div className="hidden md:flex items-center gap-6 grow max-w-md justify-end lg:grow-0">
          <div className="relative w-full max-w-[280px]">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white/50 border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#8FA887] placeholder-gray-500 text-gray-700 transition-colors"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4 cursor-pointer" />
          </div>

          <button className="relative p-1 text-gray-700 hover:text-black transition-colors">
            <ShoppingBag strokeWidth={1.5} className="w-7 h-7" />
            <span className="absolute top-0 right-0 bg-[#2D4A3E] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center translate-x-1 -translate-y-1">
              2
            </span>
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="flex items-center gap-4 lg:hidden">
          <button className="relative p-1 text-gray-700 md:hidden">
            <ShoppingBag strokeWidth={1.5} className="w-6 h-6" />
            <span className="absolute top-0 right-0 bg-[#2D4A3E] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center translate-x-1 -translate-y-1">
              2
            </span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#1A2E22] p-1"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROP-DOWN MENU */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-2 shadow-md max-h-[80vh] overflow-y-auto transition-all">
          <div className="relative w-full md:hidden mb-2">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>

          {categoriesData.map((category) => (
            <div key={category.id} className="border-b border-gray-50 pb-2">
              <button
                onClick={() => toggleMobileSubMenu(category.id)}
                className="w-full flex items-center justify-between font-medium py-2 text-[#2C3E35] text-sm"
              >
                {category.name}
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${activeMobileMenu === category.id ? "rotate-180" : ""}`}
                />
              </button>

              {activeMobileMenu === category.id && (
                <div className="pl-4 mt-1 flex flex-col gap-4 bg-gray-50/50 p-3 rounded-lg">
                  {category.subCategories.map((sub, subIdx) => (
                    <div key={subIdx}>
                      <p className="text-[11px] font-bold text-[#1A2E22] uppercase tracking-wider mb-1.5">
                        {sub.title}
                      </p>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {sub.items.map((item, itemIdx) => (
                          <Link
                            key={itemIdx}
                            href="#"
                            className="text-xs text-[#5A655D] py-0.5 hover:text-black"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="#" className="font-medium py-2 text-[#2C3E35] text-sm">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
