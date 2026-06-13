// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { ChevronDown, Search, ShoppingBag, Menu, X } from "lucide-react";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   // পেজ স্ক্রল করলে ব্যাকগ্রাউন্ড সাদা করার জন্য ইফেক্ট
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 20) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <nav 
//       className={`px-6 py-4 md:px-0 sticky top-0 z-50 transition-all duration-300 group ${
//         isScrolled 
//           ? " backdrop-blur-md" 
//           : "bg-transparent border-b border-transparent hover:bg-white/95 hover:backdrop-blur-md hover:border-gray-100 hover:shadow-sm"
//       }`}
//     >
//       <div className="container mx-auto flex items-center justify-between gap-4">
        
//         {/* 1. BRAND LOGO AREA */}
//         <div className="flex flex-col items-center select-none shrink-0">
//           <div className="flex items-start gap-0.5 relative">
//             {/* Decorative Leaf Icon */}
//             <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[#8FA887] text-xl">
//               🍃
//             </span>
//             <span className="font-serif text-3xl font-semibold text-[#1A2E22] tracking-wide mt-1">
//               verdora
//             </span>
//           </div>
//           <span className="text-[9px] uppercase tracking-[0.25em] text-[#5A655D] font-medium -mt-1">
//             Shop. Love. Live.
//           </span>
//         </div>

//         {/* 2. DESKTOP NAVIGATION LINKS */}
//         <div className="hidden lg:flex items-center gap-8 text-[#2C3E35] font-medium text-[15px]">
//           <Link href="#" className="flex items-center gap-1 hover:text-black transition-colors">
//             Shop All <ChevronDown size={16} className="text-gray-500" />
//           </Link>
//           <Link href="#" className="hover:text-black transition-colors">New In</Link>
//           <Link href="#" className="hover:text-black transition-colors">Best Sellers</Link>
//           <Link href="#" className="hover:text-black transition-colors">Collections</Link>
//           <Link href="#" className="hover:text-black transition-colors">Deals</Link>
//         </div>

//         {/* 3. SEARCH BAR & CART */}
//         <div className="hidden md:flex items-center gap-6 grow max-w-md justify-end lg:grow-0">
//           {/* Rounded Search Bar */}
//           <div className="relative w-full max-w-[280px]">
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="w-full bg-white/40 group-hover:bg-transparent border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#8FA887] placeholder-gray-500 text-gray-700 transition-colors"
//             />
//             <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4 cursor-pointer" />
//           </div>

//           {/* Cart Icon with Badge */}
//           <button className="relative p-1 text-gray-700 hover:text-black transition-colors">
//             <ShoppingBag strokeWidth={1.5} className="w-7 h-7" />
//             <span className="absolute top-0 right-0 bg-[#2D4A3E] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center translate-x-1 -translate-y-1">
//               2
//             </span>
//           </button>
//         </div>

//         {/* MOBILE MENU BUTTON (Hamburger) */}
//         <div className="flex items-center gap-4 lg:hidden">
//           {/* Mobile Cart Icon shortcut */}
//           <button className="relative p-1 text-gray-700 md:hidden">
//             <ShoppingBag strokeWidth={1.5} className="w-6 h-6" />
//             <span className="absolute top-0 right-0 bg-[#2D4A3E] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center translate-x-1 -translate-y-1">
//               2
//             </span>
//           </button>
          
//           <button onClick={() => setIsOpen(!isOpen)} className="text-[#1A2E22] p-1">
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//       </div>

//       {/* MOBILE DROP-DOWN MENU */}
//       {isOpen && (
//         <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 shadow-md transition-all">
//           <div className="relative w-full md:hidden mb-2">
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="w-full bg-transparent border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm"
//             />
//             <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
//           </div>
//           <Link href="#" className="flex items-center justify-between font-medium py-1 text-[#2C3E35]">
//             Shop All <ChevronDown size={16} />
//           </Link>
//           <Link href="#" className="font-medium py-1 text-[#2C3E35]">New In</Link>
//           <Link href="#" className="font-medium py-1 text-[#2C3E35]">Best Sellers</Link>
//           <Link href="#" className="font-medium py-1 text-[#2C3E35]">Collections</Link>
//           <Link href="#" className="font-medium py-1 text-[#2C3E35]">Deals</Link>
//         </div>
//       )}
//     </nav>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Search, ShoppingBag, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <nav 
      className={`px-6 py-6 md:px-0 w-full z-50 transition-all duration-300 left-0 right-0 ${
        isScrolled 
          ? "fixed top-0 bg-[#FAF9F6] backdrop-blur-md " 
          : "absolute top-0 bg-transparent "
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        
        {/* 1. BRAND LOGO AREA */}
        <div className="flex flex-col items-center select-none shrink-0">
          <div className="flex items-start gap-0.5 relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[#8FA887] text-xl">
              🍃
            </span>
            <span className="font-serif text-3xl font-semibold text-[#1A2E22] tracking-wide mt-1">
              verdora
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#5A655D] font-medium -mt-1">
            Shop. Love. Live.
          </span>
        </div>

        {/* 2. DESKTOP NAVIGATION LINKS */}
        <div className="hidden lg:flex items-center gap-8 text-[#2C3E35] font-medium text-[15px]">
          <Link href="#" className="flex items-center gap-1 hover:text-black transition-colors">
            Shop All <ChevronDown size={16} className="text-gray-500" />
          </Link>
          <Link href="#" className="hover:text-black transition-colors">New In</Link>
          <Link href="#" className="hover:text-black transition-colors">Best Sellers</Link>
          <Link href="#" className="hover:text-black transition-colors">Collections</Link>
          <Link href="#" className="hover:text-black transition-colors">Deals</Link>
        </div>

        {/* 3. SEARCH BAR & CART */}
        <div className="hidden md:flex items-center gap-6 grow max-w-md justify-end lg:grow-0">
          <div className="relative w-full max-w-[280px]">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white/40 group-hover:bg-transparent border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#8FA887] placeholder-gray-500 text-gray-700 transition-colors"
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

        {/* MOBILE MENU BUTTON (Hamburger) */}
        <div className="flex items-center gap-4 lg:hidden">
          <button className="relative p-1 text-gray-700 md:hidden">
            <ShoppingBag strokeWidth={1.5} className="w-6 h-6" />
            <span className="absolute top-0 right-0 bg-[#2D4A3E] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center translate-x-1 -translate-y-1">
              2
            </span>
          </button>
          
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#1A2E22] p-1">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* MOBILE DROP-DOWN MENU */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 shadow-md transition-all">
          <div className="relative w-full md:hidden mb-2">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
          <Link href="#" className="flex items-center justify-between font-medium py-1 text-[#2C3E35]">
            Shop All <ChevronDown size={16} />
          </Link>
          <Link href="#" className="font-medium py-1 text-[#2C3E35]">New In</Link>
          <Link href="#" className="font-medium py-1 text-[#2C3E35]">Best Sellers</Link>
          <Link href="#" className="font-medium py-1 text-[#2C3E35]">Collections</Link>
          <Link href="#" className="font-medium py-1 text-[#2C3E35]">Deals</Link>
        </div>
      )}
    </nav>
  );
}