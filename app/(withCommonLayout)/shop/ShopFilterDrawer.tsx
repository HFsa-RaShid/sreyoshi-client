
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useMemo, useRef } from "react";
// import { X, ChevronUp, ChevronDown, Star, SlidersHorizontal } from "lucide-react";
// import { Category, SkinType, PromotionTag } from "@/Types/types";
// import { useBrands } from "@/hooks/useBrands"; 

// interface ShopFilterDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onOpen: () => void;
//   categoriesData: Category[];
//   selectedCategories: string[];
//   openCategoryMenu: string | null;
//   handleCategorySelect: (id: string) => void;
//   selectedSubCategory: string | null;
//   handleSubCategoryItemSelect: (name: string) => void;
//   getProductCount: (
//     type: "category" | "subGroup" | "item" | "brand", 
//     name: string,
//   ) => number;
//   selectedSkinTypes: SkinType[];
//   setSelectedSkinTypes: React.Dispatch<React.SetStateAction<SkinType[]>>;
//   priceRange: number;
//   setPriceRange: (val: number) => void;
//   selectedRatings: number[];
//   setSelectedRatings: React.Dispatch<React.SetStateAction<number[]>>;
//   selectedPromotions: PromotionTag[];
//   setSelectedPromotions: React.Dispatch<React.SetStateAction<PromotionTag[]>>;
//   toggleFilter: <T>(
//     list: T[],
//     setList: React.Dispatch<React.SetStateAction<T[]>>,
//     value: T,
//   ) => void;
//   selectedBrands: string[];
//   setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
// }

// export default function ShopFilterDrawer({
//   isOpen,
//   onClose,
//   onOpen,
//   categoriesData,
//   selectedCategories,
//   openCategoryMenu,
//   handleCategorySelect,
//   selectedSubCategory,
//   handleSubCategoryItemSelect,
//   getProductCount,
//   selectedSkinTypes,
//   setSelectedSkinTypes,
//   priceRange,
//   setPriceRange,
//   selectedRatings,
//   setSelectedRatings,
//   selectedPromotions,
//   setSelectedPromotions,
//   toggleFilter,
//   selectedBrands,
//   setSelectedBrands,
// }: ShopFilterDrawerProps) {
  
//   const { brandsData } = useBrands();
//   const [showAllBrands, setShowAllBrands] = useState(false);
  
//   // 🖐️ প্রিমিয়াম সোয়াইপ ডিটেকশন (Right to Left to Open / Left to Right to Close)
//   const touchStartX = useRef<number>(0);
//   const touchEndX = useRef<number>(0);

//   const handleTouchStart = (e: React.TouchEvent) => {
//     touchStartX.current = e.targetTouches[0].clientX;
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     touchEndX.current = e.targetTouches[0].clientX;
//   };

//   const handleTouchEnd = () => {
//     const swipeDistance = touchStartX.current - touchEndX.current;
    
//     if (isOpen && swipeDistance < -50) {
//       // বাম থেকে ডানে সোয়াইপ করলে ক্লোজ হবে
//       onClose();
//     }
//   };

//   const rawBrands = useMemo(() => {
//     if (!brandsData) return [];
//     if (Array.isArray(brandsData)) return brandsData;
//     const fallback = brandsData as any;
//     return fallback.data || fallback.brands || [];
//   }, [brandsData]);

//   const displayedBrands = showAllBrands ? rawBrands : rawBrands.slice(0, 5);

//   return (
//     <>
//       {/* 🏷️ প্রিমিয়াম সাইড ভাসমান ফিল্টার ট্যাব (Floating Side Tab) - শুধুমাত্র মোবাইলের জন্য */}
//       {!isOpen && (
//         <div 
//           onClick={onOpen}
//           className="lg:hidden fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center bg-[#1A2E22] text-white rounded-l-xl shadow-[-4px_4px_16px_rgba(0,0,0,0.15)] cursor-pointer overflow-hidden border border-r-0 border-[#2D4A3E] active:scale-95 transition-all w-[55px]"
//         >
//           {/* উপরের ডার্ক সেকশন */}
//           <div className="py-3 px-2 flex flex-col items-center justify-center w-full gap-1">
//             <SlidersHorizontal size={18} className="text-[#FF3F6C]" />
//             <span className="text-[10px] font-sans font-bold uppercase tracking-wider vertical-text select-none">
//               Filter
//             </span>
//           </div>
//           {/* নিচের পিঙ্ক হাইলাইট সেকশন (লাইক ইমেজ) */}
//           <div className="bg-[#FF3F6C] w-full text-center py-1.5 text-[9px] font-sans font-bold tracking-tight border-t border-[#ff557e]">
//             OPEN
//           </div>
//         </div>
//       )}

//       {/* Backdrop (ক্লিক করলে ক্লোজ হবে) */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       {/* 📱 ড্রয়ার বডি - রাইট সাইড এন্ট্রি (Right to Left) */}
//       <div
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//         className={`fixed top-0 right-0 h-full w-[310px] bg-white z-50 p-6 shadow-[-8px_0_30px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out lg:hidden overflow-y-auto scrollbar-none flex flex-col ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* উপরের হেডার এবং ক্লোজ বাটন */}
//         <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
//           <div className="flex flex-col">
//             <h2 className="text-lg font-serif font-bold text-[#1A2E22]">Filter Options</h2>
//             <span className="text-[10px] text-gray-400 font-medium animate-pulse">Swipe right to close ➔</span>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-700 border border-gray-100 transition-colors"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* content container */}
//         <div className="flex-1 space-y-6 pb-8">
//           {/* PRODUCT CATEGORIES */}
//           <div>
//             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
//               Product Categories
//             </h3>
//             <div className="flex flex-col gap-2.5">
//               {categoriesData.map((category) => {
//                 const isCatSelected = selectedCategories.includes(category._id);
//                 const isCatOpen = openCategoryMenu === category._id;
//                 const totalCatProducts = getProductCount("category", category._id);

//                 return (
//                   <div key={category._id} className="flex flex-col">
//                     <div
//                       onClick={() => handleCategorySelect(category._id)}
//                       className={`flex justify-between items-center font-sans text-sm font-semibold cursor-pointer transition-colors py-1.5 px-2 rounded-lg ${isCatSelected ? "bg-[#FF3F6C]/5 text-[#FF3F6C]" : "text-[#1A2E22] hover:bg-gray-50"}`}
//                     >
//                       <span>{category.name}</span>
//                       <div className="flex items-center gap-2">
//                         <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${isCatSelected ? "bg-[#FF3F6C] text-white" : "bg-gray-100 text-gray-500"}`}>
//                           {totalCatProducts}
//                         </span>
//                         {isCatOpen ? <ChevronUp size={14} className="opacity-60" /> : <ChevronDown size={14} className="opacity-60" />}
//                       </div>
//                     </div>

//                     {isCatOpen && (
//                       <div className="pl-4 mt-2 flex flex-col gap-3 border-l-2 border-gray-100 ml-3">
//                         {category.subCategories.map((sub, sIdx) => {
//                           const totalSubProducts = getProductCount("subGroup", sub.title);

//                           return (
//                             <div key={sIdx} className="flex flex-col">
//                               <div className="flex justify-between items-center text-[11px] font-bold uppercase text-[#FF3F6C] tracking-wide mb-1.5">
//                                 <span>{sub.title}</span>
//                                 <span className="bg-[#FF3F6C]/10 text-[#FF3F6C] text-[9px] px-1.5 py-0.2 rounded-full font-sans">
//                                   {totalSubProducts}
//                                 </span>
//                               </div>

//                               <ul className="flex flex-col gap-2 pl-1">
//                                 {sub.items.map((item, iIdx) => {
//                                   const isItemActive = selectedSubCategory?.toLowerCase() === item?.name?.toLowerCase();
//                                   const totalItemProducts = getProductCount("item", item?.name);

//                                   return (
//                                     <li
//                                       key={iIdx}
//                                       onClick={() => {
//                                         handleSubCategoryItemSelect(item.name);
//                                         onClose(); 
//                                       }}
//                                       className={`flex justify-between items-center text-xs font-medium cursor-pointer py-1 px-1.5 rounded-md transition-all ${isItemActive ? "bg-[#1A2E22] text-white font-semibold" : "text-[#5A655D] hover:bg-gray-50 hover:text-[#1A2E22]"}`}
//                                     >
//                                       <span className="truncate max-w-[150px]">{item.name}</span>
//                                       <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-sans ${isItemActive ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400"}`}>
//                                         {totalItemProducts}
//                                       </span>
//                                     </li>
//                                   );
//                                 })}
//                               </ul>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           <hr className="border-gray-100" />

//           {/* BRAND FILTER SECTION */}
//           <div>
//             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Filter by Brand</h3>
//             <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto scrollbar-none pr-1">
//               {displayedBrands.length > 0 ? (
//                 displayedBrands.map((brand: any) => {
//                   const brandIdentifier = brand?._id && typeof brand._id === "object" && "$oid" in brand._id ? String(brand._id.$oid) : String(brand?._id || "");
//                   const finalKey = brandIdentifier && brandIdentifier !== "undefined" ? brandIdentifier : String(brand?.slug || brand?.name);
//                   const isBrandChecked = selectedBrands.includes(finalKey);
//                   const totalBrandProducts = getProductCount("brand", finalKey);

//                   return (
//                     <label key={finalKey} className="flex items-center justify-between cursor-pointer group select-none text-slate-600 hover:text-slate-900 py-0.5">
//                       <div className="flex items-center gap-3">
//                         <input
//                           type="checkbox"
//                           checked={isBrandChecked}
//                           onChange={() => toggleFilter(selectedBrands, setSelectedBrands, finalKey)}
//                           className="w-4 h-4 rounded border-slate-300 text-[#2D4A3E] focus:ring-[#2D4A3E] accent-[#2D4A3E]"
//                         />
//                         <span className="text-sm font-medium capitalize">{brand.name}</span>
//                       </div>
//                       <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono min-w-[24px] text-center">
//                         {totalBrandProducts}
//                       </span>
//                     </label>
//                   );
//                 })
//               ) : (
//                 <p className="text-xs text-slate-400 italic py-1">No brands found!</p>
//               )}
//             </div>
//             {rawBrands.length > 5 && (
//               <button onClick={() => setShowAllBrands(!showAllBrands)} className="text-xs font-bold text-rose-500 hover:text-rose-600 mt-3 cursor-pointer block transition-all">
//                 {showAllBrands ? "Show less" : "Show more"}
//               </button>
//             )}
//           </div>
//           <hr className="border-gray-100" />

//           {/* BY SKIN TYPE */}
//           <div>
//             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">By Skin Type</h3>
//             <div className="flex flex-col gap-2.5 text-sm text-[#1A2E22]">
//               <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-400 py-0.5">
//                 <input type="checkbox" checked={selectedSkinTypes.length === 0} onChange={() => setSelectedSkinTypes([])} className="w-4 h-4 rounded accent-[#2D4A3E]" />
//                 All Skin Types (Reset)
//               </label>
//               {(["Normal", "Oily", "Dry", "Combination", "Sensitive"] as SkinType[]).map((type) => (
//                 <label key={type} className="flex items-center gap-3 cursor-pointer py-0.5">
//                   <input
//                     type="checkbox"
//                     checked={selectedSkinTypes.includes(type)}
//                     onChange={() => toggleFilter(selectedSkinTypes, setSelectedSkinTypes, type)}
//                     className="w-4 h-4 rounded accent-[#2D4A3E]"
//                   />
//                   {type}
//                 </label>
//               ))}
//             </div>
//           </div>
//           <hr className="border-gray-100" />

//           {/* PRICE RANGE */}
//           <div>
//             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Price Range</h3>
//             <p className="text-sm font-semibold text-gray-700 mb-3">
//               ৳0.00 - <span className="text-[#FF3F6C]">৳{priceRange.toFixed(2)}</span>
//             </p>
//             <input type="range" min="0" max="5000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-[#2D4A3E] cursor-pointer" />
//           </div>
//           <hr className="border-gray-100" />

//           {/* REVIEW / RATING */}
//           <div>
//             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Review & Ratings</h3>
//             <div className="flex flex-col gap-2.5">
//               {[5, 4, 3, 2, 1].map((stars) => (
//                 <label key={stars} className="flex items-center gap-3 cursor-pointer text-sm py-0.5">
//                   <input
//                     type="checkbox"
//                     checked={selectedRatings.includes(stars)}
//                     onChange={() => toggleFilter(selectedRatings, setSelectedRatings, stars)}
//                     className="w-4 h-4 rounded accent-[#2D4A3E]"
//                   />
//                   <div className="flex items-center text-amber-400 gap-0.5">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} size={14} fill={i < stars ? "currentColor" : "none"} className={i < stars ? "" : "text-gray-200"} />
//                     ))}
//                   </div>
//                   <span className="text-xs text-gray-500 font-medium">{stars} Star</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//           <hr className="border-gray-100" />

//           {/* BY PROMOTIONS */}
//           <div>
//             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">By Promotions</h3>
//             <div className="flex flex-col gap-2.5 text-sm">
//               {(["New Arrivals", "Best Sellers", "Trending"] as PromotionTag[]).map((promo) => (
//                 <label key={promo} className="flex items-center gap-3 cursor-pointer py-0.5">
//                   <input
//                     type="checkbox"
//                     checked={selectedPromotions.includes(promo)}
//                     onChange={() => toggleFilter(selectedPromotions, setSelectedPromotions, promo)}
//                     className="w-4 h-4 rounded accent-[#2D4A3E]"
//                   />
//                   {promo}
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🛠️ CSS ফর ভার্টিকাল টেক্সট (Vertical Text) */}
//       <style jsx global>{`
//         .vertical-text {
//           writing-mode: vertical-rl;
//           text-orientation: mixed;
//           transform: rotate(180deg);
//         }
//       `}</style>
//     </>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useRef } from "react";
import { X, ChevronUp, ChevronDown, Star, SlidersHorizontal } from "lucide-react";
import { Category, SkinType, PromotionTag } from "@/Types/types";
import { useBrands } from "@/hooks/useBrands"; 

interface ShopFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  categoriesData: Category[];
  selectedCategories: string[];
  openCategoryMenu: string | null;
  handleCategorySelect: (id: string) => void;
  selectedSubCategory: string | null;
  handleSubCategoryItemSelect: (name: string) => void;
  getProductCount: (
    type: "category" | "subGroup" | "item" | "brand", 
    name: string,
  ) => number;
  selectedSkinTypes: SkinType[];
  setSelectedSkinTypes: React.Dispatch<React.SetStateAction<SkinType[]>>;
  priceRange: number;
  setPriceRange: (val: number) => void;
  selectedRatings: number[];
  setSelectedRatings: React.Dispatch<React.SetStateAction<number[]>>;
  selectedPromotions: PromotionTag[];
  setSelectedPromotions: React.Dispatch<React.SetStateAction<PromotionTag[]>>;
  toggleFilter: <T>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    value: T,
  ) => void;
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ShopFilterDrawer({
  isOpen,
  onClose,
  onOpen,
  categoriesData,
  selectedCategories,
  openCategoryMenu,
  handleCategorySelect,
  selectedSubCategory,
  handleSubCategoryItemSelect,
  getProductCount,
  selectedSkinTypes,
  setSelectedSkinTypes,
  priceRange,
  setPriceRange,
  selectedRatings,
  setSelectedRatings,
  selectedPromotions,
  setSelectedPromotions,
  toggleFilter,
  selectedBrands,
  setSelectedBrands,
}: ShopFilterDrawerProps) {
  
  const { brandsData } = useBrands();
  const [showAllBrands, setShowAllBrands] = useState(false);
  
  // 🖐️ গ্লোবাল সোয়াইপ জেসচার লজিক (Left to Right to Open / Right to Left to Close)
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;
    
    // ১. ড্রয়ার বন্ধ থাকলে: বাম থেকে ডানে ৫০px সোয়াইপ করলে ওপেন হবে (কোনো ক্লিকের প্রয়োজন নেই)
    if (!isOpen && swipeDistance > 50 && touchStartX.current < 60) {
      onOpen();
    }
    
    // ২. ড্রয়ার খোলা থাকলে: ডান থেকে বামে ৫০px সোয়াইপ করলে ক্লোজ হবে
    if (isOpen && swipeDistance < -50) {
      onClose();
    }
  };

  const rawBrands = useMemo(() => {
    if (!brandsData) return [];
    if (Array.isArray(brandsData)) return brandsData;
    const fallback = brandsData as any;
    return fallback.data || fallback.brands || [];
  }, [brandsData]);

  const displayedBrands = showAllBrands ? rawBrands : rawBrands.slice(0, 5);

  return (
    <>
      {/* গ্লোবাল সোয়াইপ ডিটেকশন কন্টেইনার (পুরো স্ক্রিনের বাম পাশে ট্র্যাকিং এর জন্য) */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="lg:hidden"
      >
        {/* 🏷️ বাম পাশের স্টিকি ভাসমান ট্যাব (Floating Left Tab) - পেজ স্ক্রল করলেও সাথে থাকবে */}
        {!isOpen && (
          <div 
            onClick={onOpen}
            className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center bg-[#1A2E22] text-white rounded-r-xl shadow-[4px_4px_16px_rgba(0,0,0,0.15)] cursor-pointer overflow-hidden border border-l-0 border-[#2D4A3E] active:scale-95 transition-all w-[55px]"
          >
            {/* ডার্ক সেকশন */}
            <div className="py-3 px-2 flex flex-col items-center justify-center w-full gap-1">
              <SlidersHorizontal size={18} className="text-[#FF3F6C]" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider vertical-text select-none">
                Filter
              </span>
            </div>
            {/* পিঙ্ক হাইলাইট সেকশন */}
            <div className="bg-[#FF3F6C] w-full text-center py-1.5 text-[9px] font-sans font-bold tracking-tight border-t border-[#ff557e]">
              PULL
            </div>
          </div>
        )}

        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity lg:hidden"
            onClick={onClose}
          />
        )}

        {/* 📱 ড্রয়ার বডি - বাম দিক থেকে এন্ট্রি (Left to Right) */}
        <div
          className={`fixed top-0 left-0 h-full w-[310px] bg-white z-50 p-6 shadow-[8px_0_30px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out lg:hidden overflow-y-auto scrollbar-none flex flex-col ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* হেডার এবং ক্লোজ গাইড */}
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-serif font-bold text-[#1A2E22]">Filter Options</h2>
              <span className="text-[10px] text-gray-400 font-medium">Swipe left to close ➔</span>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-700 border border-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* ফিল্টার কন্টেন্টসমূহ */}
          <div className="flex-1 space-y-6 pb-8">
            {/* PRODUCT CATEGORIES */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Product Categories
              </h3>
              <div className="flex flex-col gap-2.5">
                {categoriesData.map((category) => {
                  const isCatSelected = selectedCategories.includes(category._id);
                  const isCatOpen = openCategoryMenu === category._id;
                  const totalCatProducts = getProductCount("category", category._id);

                  return (
                    <div key={category._id} className="flex flex-col">
                      <div
                        onClick={() => handleCategorySelect(category._id)}
                        className={`flex justify-between items-center font-sans text-sm font-semibold cursor-pointer transition-colors py-1.5 px-2 rounded-lg ${isCatSelected ? "bg-[#FF3F6C]/5 text-[#FF3F6C]" : "text-[#1A2E22] hover:bg-gray-50"}`}
                      >
                        <span>{category.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${isCatSelected ? "bg-[#FF3F6C] text-white" : "bg-gray-100 text-gray-500"}`}>
                            {totalCatProducts}
                          </span>
                          {isCatOpen ? <ChevronUp size={14} className="opacity-60" /> : <ChevronDown size={14} className="opacity-60" />}
                        </div>
                      </div>

                      {isCatOpen && (
                        <div className="pl-4 mt-2 flex flex-col gap-3 border-l-2 border-gray-100 ml-3">
                          {category.subCategories.map((sub, sIdx) => {
                            const totalSubProducts = getProductCount("subGroup", sub.title);

                            return (
                              <div key={sIdx} className="flex flex-col">
                                <div className="flex justify-between items-center text-[11px] font-bold uppercase text-[#FF3F6C] tracking-wide mb-1.5">
                                  <span>{sub.title}</span>
                                  <span className="bg-[#FF3F6C]/10 text-[#FF3F6C] text-[9px] px-1.5 py-0.2 rounded-full font-sans">
                                    {totalSubProducts}
                                  </span>
                                </div>

                                <ul className="flex flex-col gap-2 pl-1">
                                  {sub.items.map((item, iIdx) => {
                                    const isItemActive = selectedSubCategory?.toLowerCase() === item?.name?.toLowerCase();
                                    const totalItemProducts = getProductCount("item", item?.name);

                                    return (
                                      <li
                                        key={iIdx}
                                        onClick={() => handleSubCategoryItemSelect(item.name)} // 🎯 ফিক্সড: এখানে ক্লিক করলেও এখন ড্রয়ার বন্ধ হবে না।
                                        className={`flex justify-between items-center text-xs font-medium cursor-pointer py-1 px-1.5 rounded-md transition-all ${isItemActive ? "bg-[#1A2E22] text-white font-semibold" : "text-[#5A655D] hover:bg-gray-50 hover:text-[#1A2E22]"}`}
                                      >
                                        <span className="truncate max-w-[150px]">{item.name}</span>
                                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-sans ${isItemActive ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400"}`}>
                                          {totalItemProducts}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <hr className="border-gray-100" />

            {/* BRAND FILTER SECTION */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Filter by Brand</h3>
              <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto scrollbar-none pr-1">
                {displayedBrands.length > 0 ? (
                  displayedBrands.map((brand: any) => {
                    const brandIdentifier = brand?._id && typeof brand._id === "object" && "$oid" in brand._id ? String(brand._id.$oid) : String(brand?._id || "");
                    const finalKey = brandIdentifier && brandIdentifier !== "undefined" ? brandIdentifier : String(brand?.slug || brand?.name);
                    const isBrandChecked = selectedBrands.includes(finalKey);
                    const totalBrandProducts = getProductCount("brand", finalKey);

                    return (
                      <label key={finalKey} className="flex items-center justify-between cursor-pointer group select-none text-slate-600 hover:text-slate-900 py-0.5">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isBrandChecked}
                            onChange={() => toggleFilter(selectedBrands, setSelectedBrands, finalKey)}
                            className="w-4 h-4 rounded border-slate-300 text-[#2D4A3E] focus:ring-[#2D4A3E] accent-[#2D4A3E]"
                          />
                          <span className="text-sm font-medium capitalize">{brand.name}</span>
                        </div>
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono min-w-[24px] text-center">
                          {totalBrandProducts}
                        </span>
                      </label>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 italic py-1">No brands found!</p>
                )}
              </div>
              {rawBrands.length > 5 && (
                <button onClick={() => setShowAllBrands(!showAllBrands)} className="text-xs font-bold text-rose-500 hover:text-rose-600 mt-3 cursor-pointer block transition-all">
                  {showAllBrands ? "Show less" : "Show more"}
                </button>
              )}
            </div>
            <hr className="border-gray-100" />

            {/* BY SKIN TYPE */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">By Skin Type</h3>
              <div className="flex flex-col gap-2.5 text-sm text-[#1A2E22]">
                <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-400 py-0.5">
                  <input type="checkbox" checked={selectedSkinTypes.length === 0} onChange={() => setSelectedSkinTypes([])} className="w-4 h-4 rounded accent-[#2D4A3E]" />
                  All Skin Types (Reset)
                </label>
                {(["Normal", "Oily", "Dry", "Combination", "Sensitive"] as SkinType[]).map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      checked={selectedSkinTypes.includes(type)}
                      onChange={() => toggleFilter(selectedSkinTypes, setSelectedSkinTypes, type)}
                      className="w-4 h-4 rounded accent-[#2D4A3E]"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            <hr className="border-gray-100" />

            {/* PRICE RANGE */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Price Range</h3>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                ৳0.00 - <span className="text-[#FF3F6C]">৳{priceRange.toFixed(2)}</span>
              </p>
              <input type="range" min="0" max="5000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-[#2D4A3E] cursor-pointer" />
            </div>
            <hr className="border-gray-100" />

            {/* REVIEW / RATING */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Review & Ratings</h3>
              <div className="flex flex-col gap-2.5">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <label key={stars} className="flex items-center gap-3 cursor-pointer text-sm py-0.5">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(stars)}
                      onChange={() => toggleFilter(selectedRatings, setSelectedRatings, stars)}
                      className="w-4 h-4 rounded accent-[#2D4A3E]"
                    />
                    <div className="flex items-center text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < stars ? "currentColor" : "none"} className={i < stars ? "" : "text-gray-200"} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{stars} Star</span>
                  </label>
                ))}
              </div>
            </div>
            <hr className="border-gray-100" />

            {/* BY PROMOTIONS */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">By Promotions</h3>
              <div className="flex flex-col gap-2.5 text-sm">
                {(["New Arrivals", "Best Sellers", "Trending"] as PromotionTag[]).map((promo) => (
                  <label key={promo} className="flex items-center gap-3 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      checked={selectedPromotions.includes(promo)}
                      onChange={() => toggleFilter(selectedPromotions, setSelectedPromotions, promo)}
                      className="w-4 h-4 rounded accent-[#2D4A3E]"
                    />
                    {promo}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
      `}</style>
    </>
  );
}