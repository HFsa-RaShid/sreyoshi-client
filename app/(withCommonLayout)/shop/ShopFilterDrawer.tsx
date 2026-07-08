


// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useMemo } from "react";
// import { X, ChevronUp, ChevronDown, Star } from "lucide-react";
// import { Category, SkinType, PromotionTag } from "@/Types/types";
// import { useBrands } from "@/hooks/useBrands"; 

// interface ShopFilterDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
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
  
//   // 🎯 useBrands হুক থেকে ডাটা রিসিভ করা হচ্ছে
//   const { brandsData } = useBrands();
//   const [showAllBrands, setShowAllBrands] = useState(false);

//   // সেফটি গার্ড: ব্র্যান্ড ডাটা অবজেক্ট বা অ্যারো যাই হোক নিরাপদে এক্সট্রাক্ট করা
//   const rawBrands = useMemo(() => {
//     if (!brandsData) return [];
//     if (Array.isArray(brandsData)) return brandsData;
//     const fallback = brandsData as any;
//     return fallback.data || fallback.brands || [];
//   }, [brandsData]);

//   if (!isOpen) return null;

//   // 🎯 সার্চ বার ছাড়া প্রথম অবস্থায় ৫টি ব্র্যান্ড স্লাইস করা হলো
//   const displayedBrands = showAllBrands ? rawBrands : rawBrands.slice(0, 5);

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black/40 z-50 transition-opacity lg:hidden"
//         onClick={onClose}
//       />

//       {/* Drawer Body */}
//       <div className="fixed top-0 left-0 min-h-screen h-fit w-[300px] bg-white z-50 p-6 shadow-2xl transition-transform duration-300 transform lg:hidden overflow-y-auto max-h-screen scrollbar-none">
//         <div className="flex items-center justify-between mb-6 border-b pb-4">
//           <h2 className="text-xl font-serif font-bold text-[#1A2E22]">
//             Filter Options
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* DYNAMIC NESTED CATEGORIES */}
//         <div className="mb-6">
//           <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22] mb-4 opacity-50">
//             Product Categories
//           </h3>
//           <div className="flex flex-col gap-3">
//             {categoriesData.map((category) => {
//               const isCatSelected = selectedCategories.includes(category._id);
//               const isCatOpen = openCategoryMenu === category._id;
//               const totalCatProducts = getProductCount("category", category._id);

//               return (
//                 <div key={category._id} className="flex flex-col">
//                   <div
//                     onClick={() => handleCategorySelect(category._id)}
//                     className={`flex justify-between items-center font-sans text-sm font-bold cursor-pointer transition-colors py-1 ${isCatSelected ? "text-[#FF3F6C]" : "text-[#1A2E22] hover:text-[#FF3F6C]"}`}
//                   >
//                     <span>{category.name}</span>
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`text-[10px] font-sans px-2 py-0.5 rounded-full ${isCatSelected ? "bg-[#FF3F6C] text-white" : "bg-gray-100 text-gray-500"}`}
//                       >
//                         {totalCatProducts}
//                       </span>
//                       {isCatOpen ? (
//                         <ChevronUp size={14} className="opacity-60" />
//                       ) : (
//                         <ChevronDown size={14} className="opacity-60" />
//                       )}
//                     </div>
//                   </div>

//                   {isCatOpen && (
//                     <div className="pl-4 mt-2 flex flex-col gap-3 border-l border-gray-100 ml-1">
//                       {category.subCategories.map((sub, sIdx) => {
//                         const totalSubProducts = getProductCount("subGroup", sub.title);

//                         return (
//                           <div key={sIdx} className="flex flex-col">
//                             <div className="flex justify-between items-center text-xs font-bold uppercase text-[#FF3F6C] tracking-wide mb-2 mt-1">
//                               <span>{sub.title}</span>
//                               <span className="bg-[#FF3F6C]/10 text-[#FF3F6C] text-[9px] px-1.5 py-0.2 rounded-full font-sans">
//                                 {totalSubProducts}
//                               </span>
//                             </div>

//                             <ul className="flex flex-col gap-1.5 pl-2 mb-1">
//                               {sub.items.map((item, iIdx) => {
//                                 const isItemActive =
//                                   selectedSubCategory?.toLowerCase() === item?.name?.toLowerCase();
//                                 const totalItemProducts = getProductCount("item", item?.name);

//                                 return (
//                                   <li
//                                     key={iIdx}
//                                     onClick={() => {
//                                       handleSubCategoryItemSelect(item.name);
//                                       onClose();
//                                     }}
//                                     className={`flex justify-between items-center text-xs font-medium cursor-pointer py-0.5 transition-all ${isItemActive ? "text-[#1A2E22] font-bold" : "text-[#5A655D] hover:text-[#1A2E22]"}`}
//                                   >
//                                     <span className="truncate max-w-[160px]">
//                                       {item.name}
//                                     </span>
//                                     <span className="text-[10px] bg-gray-50 text-gray-400 font-normal px-1.5 py-0.2 rounded-full font-sans">
//                                       {totalItemProducts}
//                                     </span>
//                                   </li>
//                                 );
//                               })}
//                             </ul>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//         <hr className="my-5 border-gray-100" />

//         {/* 📸 BRAND FILTER SECTION (সার্চ বার ছাড়া একদম ক্লিন মোবাইল ভিউ) */}
//         <div className="mb-6">
//           <h3 className="text-sm font-bold text-[#1A2E22] mb-3">
//             Filter by Brand
//           </h3>

//           <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto scrollbar-none pr-1">
//             {displayedBrands.length > 0 ? (
//               displayedBrands.map((brand: any) => {
//                 // মেইন পেজের সাথে সিঙ্ক রেখে আইডি ট্র্যাকিং ভ্যালু জেনারেট করা হলো
//                 const brandIdentifier = brand?._id?.$oid || brand?._id || String(brand?.slug || brand?.name);
//                 const isBrandChecked = selectedBrands.includes(brandIdentifier);
//                 const totalBrandProducts = getProductCount("brand", brandIdentifier);

//                 return (
//                   <label
//                     key={brandIdentifier}
//                     className="flex items-center justify-between cursor-pointer group select-none text-slate-600 hover:text-slate-900"
//                   >
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="checkbox"
//                         checked={isBrandChecked}
//                         onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brandIdentifier)}
//                         className="w-4 h-4 rounded border-slate-300 text-[#2D4A3E] focus:ring-[#2D4A3E] accent-[#2D4A3E]"
//                       />
//                       <span className="text-sm font-medium capitalize">
//                         {brand.name}
//                       </span>
//                     </div>
//                     <span className="bg-slate-100 text-slate-500 text-[11px] font-semibold px-2 py-0.5 rounded-full font-mono min-w-[24px] text-center">
//                       {totalBrandProducts}
//                     </span>
//                   </label>
//                 );
//               })
//             ) : (
//               <p className="text-xs text-slate-400 italic py-1">No brands found!</p>
//             )}
//           </div>

//           {rawBrands.length > 5 && (
//             <button
//               onClick={() => setShowAllBrands(!showAllBrands)}
//               className="text-xs font-bold text-rose-500 hover:text-rose-600 mt-4 cursor-pointer block transition-all"
//             >
//               {showAllBrands ? "Show less" : "Show more"}
//             </button>
//           )}
//         </div>
//         <hr className="my-5 border-gray-100" />

//         {/* BY SKIN TYPE */}
//         <div className="mb-6">
//           <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">
//             By Skin Type
//           </h3>
//           <div className="flex flex-col gap-2.5 text-sm text-[#1A2E22]">
//             <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-400">
//               <input
//                 type="checkbox"
//                 checked={selectedSkinTypes.length === 0}
//                 onChange={() => setSelectedSkinTypes([])} 
//                 className="w-4 h-4 rounded accent-[#2D4A3E]"
//               />
//               All Skin Types (Reset)
//             </label>

//             {(["Normal", "Oily", "Dry", "Combination", "Sensitive"] as SkinType[]).map((type) => (
//               <label key={type} className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={selectedSkinTypes.includes(type)}
//                   onChange={() => toggleFilter(selectedSkinTypes, setSelectedSkinTypes, type)}
//                   className="w-4 h-4 rounded accent-[#2D4A3E]"
//                 />
//                 {type}
//               </label>
//             ))}
//           </div>
//         </div>
//         <hr className="my-5 border-gray-100" />

//         {/* PRICE RANGE */}
//         <div className="mb-6">
//           <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-1">
//             Price
//           </h3>
//           <p className="text-xs text-gray-500 mb-3">
//             ৳0.00 - ৳{priceRange.toFixed(2)}
//           </p>
//           <input
//             type="range"
//             min="0"
//             max="5000"
//             value={priceRange}
//             onChange={(e) => setPriceRange(Number(e.target.value))}
//             className="w-full accent-[#2D4A3E] cursor-pointer"
//           />
//         </div>
//         <hr className="my-5 border-gray-100" />

//         {/* REVIEW / RATING */}
//         <div className="mb-6">
//           <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">
//             Review
//           </h3>
//           <div className="flex flex-col gap-2.5">
//             {[5, 4, 3, 2, 1].map((stars) => (
//               <label key={stars} className="flex items-center gap-3 cursor-pointer text-sm">
//                 <input
//                   type="checkbox"
//                   checked={selectedRatings.includes(stars)}
//                   onChange={() => toggleFilter(selectedRatings, setSelectedRatings, stars)}
//                   className="w-4 h-4 rounded accent-[#2D4A3E]"
//                 />
//                 <div className="flex items-center text-amber-400 gap-0.5">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       size={14}
//                       fill={i < stars ? "currentColor" : "none"}
//                       className={i < stars ? "" : "text-gray-200"}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-xs text-gray-500">{stars} Star</span>
//               </label>
//             ))}
//           </div>
//         </div>
//         <hr className="my-5 border-gray-100" />

//         {/* BY PROMOTIONS */}
//         <div className="mb-6">
//           <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">
//             By Promotions
//           </h3>
//           <div className="flex flex-col gap-2.5 text-sm">
//             {(["New Arrivals", "Best Sellers", "Trending"] as PromotionTag[]).map((promo) => (
//               <label key={promo} className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={selectedPromotions.includes(promo)}
//                   onChange={() => toggleFilter(selectedPromotions, setSelectedPromotions, promo)}
//                   className="w-4 h-4 rounded accent-[#2D4A3E]"
//                 />
//                 {promo}
//               </label>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { X, ChevronUp, ChevronDown, Star } from "lucide-react";
import { Category, SkinType, PromotionTag } from "@/Types/types";
import { useBrands } from "@/hooks/useBrands"; 

interface ShopFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

  // সেফটি গার্ড: ব্র্যান্ড ডাটা অবজেক্ট বা অ্যারো যাই হোক নিরাপদে এক্সট্রাক্ট করা
  const rawBrands = useMemo(() => {
    if (!brandsData) return [];
    if (Array.isArray(brandsData)) return brandsData;
    const fallback = brandsData as any;
    return fallback.data || fallback.brands || [];
  }, [brandsData]);

  if (!isOpen) return null;

  const displayedBrands = showAllBrands ? rawBrands : rawBrands.slice(0, 5);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity lg:hidden"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="fixed top-0 left-0 min-h-screen h-fit w-[300px] bg-white z-50 p-6 shadow-2xl transition-transform duration-300 transform lg:hidden overflow-y-auto max-h-screen scrollbar-none">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h2 className="text-xl font-serif font-bold text-[#1A2E22]">
            Filter Options
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* DYNAMIC NESTED CATEGORIES */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22] mb-4 opacity-50">
            Product Categories
          </h3>
          <div className="flex flex-col gap-3">
            {categoriesData.map((category) => {
              const isCatSelected = selectedCategories.includes(category._id);
              const isCatOpen = openCategoryMenu === category._id;
              const totalCatProducts = getProductCount("category", category._id);

              return (
                <div key={category._id} className="flex flex-col">
                  <div
                    onClick={() => handleCategorySelect(category._id)}
                    className={`flex justify-between items-center font-sans text-sm font-bold cursor-pointer transition-colors py-1 ${isCatSelected ? "text-[#FF3F6C]" : "text-[#1A2E22] hover:text-[#FF3F6C]"}`}
                  >
                    <span>{category.name}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-sans px-2 py-0.5 rounded-full ${isCatSelected ? "bg-[#FF3F6C] text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        {totalCatProducts}
                      </span>
                      {isCatOpen ? (
                        <ChevronUp size={14} className="opacity-60" />
                      ) : (
                        <ChevronDown size={14} className="opacity-60" />
                      )}
                    </div>
                  </div>

                  {isCatOpen && (
                    <div className="pl-4 mt-2 flex flex-col gap-3 border-l border-gray-100 ml-1">
                      {category.subCategories.map((sub, sIdx) => {
                        const totalSubProducts = getProductCount("subGroup", sub.title);

                        return (
                          <div key={sIdx} className="flex flex-col">
                            <div className="flex justify-between items-center text-xs font-bold uppercase text-[#FF3F6C] tracking-wide mb-2 mt-1">
                              <span>{sub.title}</span>
                              <span className="bg-[#FF3F6C]/10 text-[#FF3F6C] text-[9px] px-1.5 py-0.2 rounded-full font-sans">
                                {totalSubProducts}
                              </span>
                            </div>

                            <ul className="flex flex-col gap-1.5 pl-2 mb-1">
                              {sub.items.map((item, iIdx) => {
                                const isItemActive =
                                  selectedSubCategory?.toLowerCase() === item?.name?.toLowerCase();
                                const totalItemProducts = getProductCount("item", item?.name);

                                return (
                                  <li
                                    key={iIdx}
                                    onClick={() => {
                                      handleSubCategoryItemSelect(item.name);
                                      onClose();
                                    }}
                                    className={`flex justify-between items-center text-xs font-medium cursor-pointer py-0.5 transition-all ${isItemActive ? "text-[#1A2E22] font-bold" : "text-[#5A655D] hover:text-[#1A2E22]"}`}
                                  >
                                    <span className="truncate max-w-[160px]">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] bg-gray-50 text-gray-400 font-normal px-1.5 py-0.2 rounded-full font-sans">
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
        <hr className="my-5 border-gray-100" />

        {/* 📸 BRAND FILTER SECTION */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#1A2E22] mb-3">
            Filter by Brand
          </h3>

          <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto scrollbar-none pr-1">
            {displayedBrands.length > 0 ? (
              displayedBrands.map((brand: any) => {
                // 🎯 বুলেটিপ্রুফ স্ট্রিং আইডি এক্সট্রাকশন লজিক
                const brandIdentifier = 
                  brand?._id && typeof brand._id === "object" && "$oid" in brand._id 
                    ? String(brand._id.$oid) 
                    : String(brand?._id || "");

                // যদি আইডি কোনো কারণে ফেইল করে তবে সেফটি ফলব্যাক হিসেবে নাম বা স্লাগ ব্যবহার করা
                const finalKey = brandIdentifier && brandIdentifier !== "undefined" ? brandIdentifier : String(brand?.slug || brand?.name);

                const isBrandChecked = selectedBrands.includes(finalKey);
                const totalBrandProducts = getProductCount("brand", finalKey);

                return (
                  <label
                    key={finalKey}
                    className="flex items-center justify-between cursor-pointer group select-none text-slate-600 hover:text-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isBrandChecked}
                        onChange={() => toggleFilter(selectedBrands, setSelectedBrands, finalKey)}
                        className="w-4 h-4 rounded border-slate-300 text-[#2D4A3E] focus:ring-[#2D4A3E] accent-[#2D4A3E]"
                      />
                      <span className="text-sm font-medium capitalize">
                        {brand.name}
                      </span>
                    </div>
                    <span className="bg-slate-100 text-slate-500 text-[11px] font-semibold px-2 py-0.5 rounded-full font-mono min-w-[24px] text-center">
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
            <button
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 mt-4 cursor-pointer block transition-all"
            >
              {showAllBrands ? "Show less" : "Show more"}
            </button>
          )}
        </div>
        <hr className="my-5 border-gray-100" />

        {/* BY SKIN TYPE */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">
            By Skin Type
          </h3>
          <div className="flex flex-col gap-2.5 text-sm text-[#1A2E22]">
            <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-400">
              <input
                type="checkbox"
                checked={selectedSkinTypes.length === 0}
                onChange={() => setSelectedSkinTypes([])} 
                className="w-4 h-4 rounded accent-[#2D4A3E]"
              />
              All Skin Types (Reset)
            </label>

            {(["Normal", "Oily", "Dry", "Combination", "Sensitive"] as SkinType[]).map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer">
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
        <hr className="my-5 border-gray-100" />

        {/* PRICE RANGE */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-1">
            Price
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            ৳0.00 - ৳{priceRange.toFixed(2)}
          </p>
          <input
            type="range"
            min="0"
            max="5000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-[#2D4A3E] cursor-pointer"
          />
        </div>
        <hr className="my-5 border-gray-100" />

        {/* REVIEW / RATING */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">
            Review
          </h3>
          <div className="flex flex-col gap-2.5">
            {[5, 4, 3, 2, 1].map((stars) => (
              <label key={stars} className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(stars)}
                  onChange={() => toggleFilter(selectedRatings, setSelectedRatings, stars)}
                  className="w-4 h-4 rounded accent-[#2D4A3E]"
                />
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < stars ? "currentColor" : "none"}
                      className={i < stars ? "" : "text-gray-200"}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{stars} Star</span>
              </label>
            ))}
          </div>
        </div>
        <hr className="my-5 border-gray-100" />

        {/* BY PROMOTIONS */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">
            By Promotions
          </h3>
          <div className="flex flex-col gap-2.5 text-sm">
            {(["New Arrivals", "Best Sellers", "Trending"] as PromotionTag[]).map((promo) => (
              <label key={promo} className="flex items-center gap-3 cursor-pointer">
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
    </>
  );
}