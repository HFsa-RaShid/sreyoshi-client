// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import React, { useState, useEffect, useMemo, Suspense } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Star, ChevronDown, ChevronUp } from "lucide-react";
// import { useApp } from "@/context/AppContext";

// import { Product, Category, SkinType, PromotionTag } from "@/Types/types";
// import {
//   useGetCategoriesForCustomer,
//   useGetProductsForCustomer,
// } from "@/hooks/useCustomerData";
// import { useBrands } from "@/hooks/useBrands";
// import ShopFilterDrawer from "./ShopFilterDrawer";
// import ShopProductCard from "./ShopProductCard";
// import { ShopProductSkeleton } from "@/components/Shared/ShopProductSkeleton/ShopProductSkeleton";

// function ShopContent() {
//   const { addToCart } = useApp();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // API থেকে ডাটা ফেচিং
//   const { data: categoriesData = [], isLoading: isCategoriesLoading } =
//     useGetCategoriesForCustomer() as { data: Category[]; isLoading: boolean };
//   const { data: productsData = [], isLoading: isProductsLoading } =
//     useGetProductsForCustomer() as { data: Product[]; isLoading: boolean };

//   // ব্র্যান্ড ডাটা ফেচিং
//   const { brandsData, isLoading: isBrandsLoading } = useBrands();

//   const urlCategory = searchParams.get("category");
//   const urlSubCategory = searchParams.get("subCategory");
//   const urlBrand = searchParams.get("brand");

//   // ফিল্টার এবং ড্রয়ার স্টেট
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
//     null,
//   );
//   const [selectedSkinTypes, setSelectedSkinTypes] = useState<SkinType[]>([]);
//   const [priceRange, setPriceRange] = useState<number>(5000);
//   const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
//   const [selectedPromotions, setSelectedPromotions] = useState<PromotionTag[]>(
//     [],
//   );

//   // ব্র্যান্ড ট্র্যাকিং স্টেট
//   const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
//   const [showAllBrands, setShowAllBrands] = useState<boolean>(false);
//   const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

//   const [sortBy, setSortBy] = useState<string>("latest");
//   const [openCategoryMenu, setOpenCategoryMenu] = useState<string | null>(null);
//   const [openSubCategoryMenu, setOpenSubCategoryMenu] = useState<string | null>(
//     null,
//   );

//   // সেফটি গার্ড: ব্র্যান্ড ডাটা রিসিভ করা
//   const rawBrands = useMemo(() => {
//     if (!brandsData) return [];
//     if (Array.isArray(brandsData)) return brandsData;
//     const fallback = brandsData as any;
//     return fallback.data || fallback.brands || [];
//   }, [brandsData]);

//   // 📋 বুলেটিপ্রুফ ব্র্যান্ড ম্যাচিং হেল্পার ফাংশন
//   const isProductMatchingBrand = (
//     product: any,
//     targetBrandIdOrName: string,
//   ) => {
//     if (!product.brand) return false;

//     const target = String(targetBrandIdOrName).toLowerCase().trim();

//     if (typeof product.brand === "string") {
//       return product.brand.toLowerCase().trim() === target;
//     }

//     if (typeof product.brand === "object") {
//       const bObj = product.brand as any;
//       const bId = bObj._id?.$oid || bObj._id;
//       const bName = bObj.name;
//       const bSlug = bObj.slug;

//       return (
//         (bId && String(bId).toLowerCase().trim() === target) ||
//         (bName && String(bName).toLowerCase().trim() === target) ||
//         (bSlug && String(bSlug).toLowerCase().trim() === target)
//       );
//     }

//     return false;
//   };

//   // 🎯 ইউআরএল প্যারামস সিঙ্ক (Category, SubCategory এবং Brand)
//   useEffect(() => {
//     if (urlCategory) {
//       setSelectedCategories([urlCategory]);
//       setOpenCategoryMenu(urlCategory);
//     } else if (urlSubCategory && categoriesData.length > 0) {
//       const parentCat = categoriesData.find((cat) =>
//         cat.subCategories.some((sub) =>
//           sub.items.some(
//             (item) =>
//               item?.name?.toLowerCase() === urlSubCategory.toLowerCase(),
//           ),
//         ),
//       );
//       if (parentCat) {
//         setSelectedCategories([parentCat._id]);
//         setOpenCategoryMenu(parentCat._id);

//         const subCat = parentCat.subCategories.find((sub) =>
//           sub.items.some(
//             (item) =>
//               item?.name?.toLowerCase() === urlSubCategory.toLowerCase(),
//           ),
//         );
//         if (subCat) {
//           setOpenSubCategoryMenu(subCat.title);
//         }
//       }
//       setSelectedSubCategory(urlSubCategory);
//     }

//     // 🎯 অন্য পেজ থেকে ব্র্যান্ডে ক্লিক করে আসলে স্টেট সিঙ্ক করার লজিক
//     if (urlBrand && rawBrands.length > 0) {
//       const matchedBrand = rawBrands.find((b: any) => {
//         const bId = b?._id?.$oid || b?._id;
//         return (
//           String(bId).toLowerCase() === urlBrand.toLowerCase() ||
//           String(b?.slug).toLowerCase() === urlBrand.toLowerCase() ||
//           String(b?.name).toLowerCase() === urlBrand.toLowerCase()
//         );
//       });

//       if (matchedBrand) {
//         const correctId =
//           matchedBrand?._id?.$oid ||
//           matchedBrand?._id ||
//           matchedBrand?.slug ||
//           matchedBrand?.name;
//         setSelectedBrands([String(correctId)]);
//       }
//     }
//   }, [urlCategory, urlSubCategory, urlBrand, categoriesData, rawBrands]);

//   // 🎯 প্রোডাক্ট কাউন্ট মেথড
//   const getProductCount = (
//     type: "category" | "subGroup" | "item" | "brand",
//     name: string,
//   ) => {
//     if (!productsData) return 0;
//     return productsData.filter((product) => {
//       const catId =
//         typeof product.category === "object"
//           ? product.category?._id
//           : product.category;

//       if (type === "category") return catId === name;
//       if (type === "subGroup")
//         return product.subCategory?.toLowerCase() === name.toLowerCase();
//       if (type === "item")
//         return product.itemName?.toLowerCase() === name.toLowerCase();

//       if (type === "brand") {
//         return isProductMatchingBrand(product, name);
//       }
//       return false;
//     }).length;
//   };

//   const handleCategorySelect = (categoryId: string) => {
//     setSelectedSubCategory(null);
//     setOpenSubCategoryMenu(null);

//     if (selectedCategories.includes(categoryId)) {
//       setSelectedCategories([]);
//       setOpenCategoryMenu(null);
//       router.push("/shop");
//     } else {
//       setSelectedCategories([categoryId]);
//       setOpenCategoryMenu(categoryId);
//       router.push(`/shop?category=${categoryId}`);
//     }
//   };

//   const handleSubCategoryToggle = (subTitle: string) => {
//     if (openSubCategoryMenu === subTitle) {
//       setOpenSubCategoryMenu(null);
//     } else {
//       setOpenSubCategoryMenu(subTitle);
//     }
//   };

//   const handleSubCategoryItemSelect = (itemName: string) => {
//     if (selectedSubCategory?.toLowerCase() === itemName.toLowerCase()) {
//       setSelectedSubCategory(null);
//       router.push(
//         selectedCategories.length
//           ? `/shop?category=${selectedCategories[0]}`
//           : "/shop",
//       );
//     } else {
//       setSelectedSubCategory(itemName);
//       router.push(`/shop?subCategory=${encodeURIComponent(itemName)}`);
//     }
//   };

//   // 🎯 কোনো ব্র্যান্ড চেক/আনচেক করলে ইউআরএল আপডেট করার ফাংশন
//   const handleBrandToggle = (brandId: string) => {
//     let updatedBrands = [...selectedBrands];
//     if (updatedBrands.includes(brandId)) {
//       updatedBrands = updatedBrands.filter((id) => id !== brandId);
//     } else {
//       updatedBrands.push(brandId);
//     }
//     setSelectedBrands(updatedBrands);

//     // ইউআরএল রিমুভ বা আপডেট করা যাতে রিফ্রেশ দিলেও ঠিক থাকে
//     if (updatedBrands.length === 1) {
//       router.push(`/shop?brand=${updatedBrands[0]}`);
//     } else if (updatedBrands.length === 0) {
//       router.push("/shop");
//     }
//   };

//   const displayedBrands = showAllBrands ? rawBrands : rawBrands.slice(0, 5);

//   // 🎯 ফিল্টারিং এবং সর্টিং মেকানিজম
//   const filteredProducts = useMemo(() => {
//     if (!productsData) return [];

//     return productsData
//       .filter((product) => {
//         if (product.status !== "Active") return false;

//         const catId =
//           typeof product.category === "object"
//             ? product.category?._id
//             : product.category;
//         if (
//           selectedCategories.length > 0 &&
//           (!catId || !selectedCategories.includes(catId))
//         ) {
//           return false;
//         }

//         if (
//           selectedSubCategory &&
//           product.itemName?.toLowerCase() !== selectedSubCategory.toLowerCase()
//         ) {
//           return false;
//         }

//         if (selectedBrands.length > 0) {
//           const matchedWithAnySelected = selectedBrands.some((brandIdOrName) =>
//             isProductMatchingBrand(product, brandIdOrName),
//           );
//           if (!matchedWithAnySelected) return false;
//         }

//         if (selectedSkinTypes.length > 0) {
//           if (!product.skinType || product.skinType.trim() === "") {
//             // All skin types
//           } else {
//             const productSkinLower = product.skinType.toLowerCase();
//             const isMatched = selectedSkinTypes.some(
//               (type) => type.toLowerCase() === productSkinLower,
//             );
//             if (!isMatched) return false;
//           }
//         }

//         if (product.price > priceRange) {
//           return false;
//         }

//         if (
//           selectedRatings.length > 0 &&
//           !selectedRatings.includes(Math.floor(product.rating || 0))
//         ) {
//           return false;
//         }

//         if (selectedPromotions.length > 0) {
//           if (!product.promotion) return false;

//           const pPromoClean = String(product.promotion).toLowerCase().trim();
//           const hasMatchedPromo = selectedPromotions.some(
//             (selectedPromo) =>
//               String(selectedPromo).toLowerCase().trim() === pPromoClean,
//           );

//           if (!hasMatchedPromo) return false;
//         }

//         return true;
//       })
//       .sort((a, b) => {
//         if (sortBy === "latest" || sortBy === "default") {
//           const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//           const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//           return dateB - dateA;
//         }
//         if (sortBy === "low-to-high") return a.price - b.price;
//         if (sortBy === "high-to-low") return b.price - a.price;
//         if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
//         if (sortBy === "popularity")
//           return (b.salesCount || 0) - (a.salesCount || 0);
//         return 0;
//       });
//   }, [
//     productsData,
//     selectedCategories,
//     selectedSubCategory,
//     selectedBrands,
//     selectedSkinTypes,
//     priceRange,
//     selectedRatings,
//     selectedPromotions,
//     sortBy,
//   ]);

//   const handleClearAll = () => {
//     setSelectedCategories([]);
//     setSelectedSubCategory(null);
//     setSelectedSkinTypes([]);
//     setSelectedBrands([]);
//     setPriceRange(5000);
//     setSelectedRatings([]);
//     setSelectedPromotions([]);
//     setOpenCategoryMenu(null);
//     setOpenSubCategoryMenu(null);
//     setSortBy("latest");
//     router.push("/shop");
//   };

//   const toggleFilter = <T,>(
//     list: T[],
//     setList: React.Dispatch<React.SetStateAction<T[]>>,
//     value: T,
//   ) => {
//     setList(
//       list.includes(value)
//         ? list.filter((item) => item !== value)
//         : [...list, value],
//     );
//   };

//   const showSkeleton = isCategoriesLoading || isProductsLoading;

//   return (
//     <div className="bg-[#FAF9F6] min-h-screen pt-16 md:pt-28 pb-12 px-4 md:px-12 text-[#2C3E35]">
//       <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
//         {/* ================= LEFT SIDEBAR (DESKTOP) ================= */}
//         <div className="hidden lg:block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24 max-h-[85vh] overflow-y-auto scrollbar-none">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-serif font-bold text-[#1A2E22]">
//               Filter Options
//             </h2>
//             {(selectedCategories.length > 0 ||
//               selectedSubCategory ||
//               selectedBrands.length > 0 ||
//               selectedSkinTypes.length > 0 ||
//               priceRange < 5000 ||
//               selectedRatings.length > 0 ||
//               selectedPromotions.length > 0) && (
//               <button
//                 onClick={handleClearAll}
//                 className="text-xs font-bold text-rose-500 hover:underline"
//               >
//                 Clear All
//               </button>
//             )}
//           </div>

//           <div className="mb-6">
//             <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22] mb-4 opacity-50">
//               Product Categories
//             </h3>
//             {isCategoriesLoading ? (
//               <div className="space-y-3 animate-pulse">
//                 <div className="h-4 bg-slate-100 rounded w-3/4"></div>
//                 <div className="h-4 bg-slate-100 rounded w-5/6"></div>
//                 <div className="h-4 bg-slate-100 rounded w-2/3"></div>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-3">
//                 {categoriesData.map((category) => {
//                   const isCatSelected = selectedCategories.includes(
//                     category._id,
//                   );
//                   const isCatOpen = openCategoryMenu === category._id;
//                   const totalCatProducts = getProductCount(
//                     "category",
//                     category._id,
//                   );

//                   return (
//                     <div key={category._id} className="flex flex-col">
//                       <div
//                         onClick={() => handleCategorySelect(category._id)}
//                         className={`flex justify-between items-center font-sans text-sm font-bold cursor-pointer transition-colors py-1 ${isCatSelected ? "text-[#FF3F6C]" : "text-[#1A2E22] hover:text-[#FF3F6C]"}`}
//                       >
//                         <span>{category.name}</span>
//                         <div className="flex items-center gap-2">
//                           <span
//                             className={`text-[10px] font-sans px-2 py-0.5 rounded-full ${isCatSelected ? "bg-[#FF3F6C] text-white" : "bg-gray-100 text-gray-500"}`}
//                           >
//                             {totalCatProducts}
//                           </span>
//                           {isCatOpen ? (
//                             <ChevronUp size={14} className="opacity-60" />
//                           ) : (
//                             <ChevronDown size={14} className="opacity-60" />
//                           )}
//                         </div>
//                       </div>

//                       {isCatOpen && (
//                         <div className="pl-4 mt-2 flex flex-col gap-3 border-l border-gray-100 ml-1">
//                           {category.subCategories.map((sub, sIdx) => {
//                             const totalSubProducts = getProductCount(
//                               "subGroup",
//                               sub.title,
//                             );
//                             const isSubOpen = openSubCategoryMenu === sub.title;

//                             return (
//                               <div key={sIdx} className="flex flex-col">
//                                 <div
//                                   onClick={() =>
//                                     handleSubCategoryToggle(sub.title)
//                                   }
//                                   className="flex justify-between items-center text-xs font-bold uppercase text-[#FF3F6C] tracking-wide mb-2 mt-1 cursor-pointer hover:opacity-80 transition-all"
//                                 >
//                                   <span>{sub.title}</span>
//                                   <div className="flex items-center gap-1">
//                                     <span className="bg-[#FF3F6C]/10 text-[#FF3F6C] text-[9px] px-1.5 py-0.2 rounded-full font-sans">
//                                       {totalSubProducts}
//                                     </span>
//                                     {isSubOpen ? (
//                                       <ChevronUp size={12} />
//                                     ) : (
//                                       <ChevronDown size={12} />
//                                     )}
//                                   </div>
//                                 </div>

//                                 {isSubOpen && (
//                                   <ul className="flex flex-col gap-1.5 pl-2 mb-1 animate-fadeIn">
//                                     {sub.items.map((item, iIdx) => {
//                                       const isItemActive =
//                                         selectedSubCategory?.toLowerCase() ===
//                                         item?.name?.toLowerCase();
//                                       const totalItemProducts = getProductCount(
//                                         "item",
//                                         item?.name,
//                                       );

//                                       return (
//                                         <li
//                                           key={iIdx}
//                                           onClick={() =>
//                                             handleSubCategoryItemSelect(
//                                               item.name,
//                                             )
//                                           }
//                                           className={`flex justify-between items-center text-xs font-medium cursor-pointer py-0.5 transition-all ${isItemActive ? "text-[#1A2E22] font-bold" : "text-[#5A655D] hover:text-[#1A2E22]"}`}
//                                         >
//                                           <span className="truncate max-w-[160px]">
//                                             {item.name}
//                                           </span>
//                                           <span className="text-[10px] bg-gray-50 text-gray-400 font-normal px-1.5 py-0.2 rounded-full font-sans">
//                                             {totalItemProducts}
//                                           </span>
//                                         </li>
//                                       );
//                                     })}
//                                   </ul>
//                                 )}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//           <hr className="my-5 border-gray-100" />

//           {/* BRAND FILTER SECTION */}
//           <div className="mb-6">
//             <h3 className="text-sm font-bold text-[#1A2E22] mb-3">
//               Filter by Brand
//             </h3>

//             <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto scrollbar-none pr-1">
//               {isBrandsLoading ? (
//                 <div className="space-y-2 animate-pulse py-1">
//                   <div className="h-4 bg-slate-100 rounded w-full"></div>
//                   <div className="h-4 bg-slate-100 rounded w-5/6"></div>
//                 </div>
//               ) : displayedBrands.length > 0 ? (
//                 displayedBrands.map((brand: any) => {
//                   const brandIdentifier =
//                     brand?._id?.$oid ||
//                     brand?._id ||
//                     String(brand?.slug || brand?.name);
//                   const isBrandChecked =
//                     selectedBrands.includes(brandIdentifier);
//                   const totalBrandProducts = getProductCount(
//                     "brand",
//                     brandIdentifier,
//                   );

//                   return (
//                     <label
//                       key={brandIdentifier}
//                       className="flex items-center justify-between cursor-pointer group select-none text-slate-600 hover:text-slate-900"
//                     >
//                       <div className="flex items-center gap-3">
//                         <input
//                           type="checkbox"
//                           checked={isBrandChecked}
//                           onChange={() => handleBrandToggle(brandIdentifier)}
//                           className="w-4 h-4 rounded border-slate-300 text-[#2D4A3E] focus:ring-[#2D4A3E] accent-[#2D4A3E]"
//                         />
//                         <span className="text-sm font-medium capitalize">
//                           {brand.name}
//                         </span>
//                       </div>
//                       <span className="bg-slate-100 text-slate-500 text-[11px] font-semibold px-2 py-0.5 rounded-full font-mono min-w-[24px] text-center">
//                         {totalBrandProducts}
//                       </span>
//                     </label>
//                   );
//                 })
//               ) : (
//                 <p className="text-xs text-slate-400 italic py-1">
//                   No brands found!
//                 </p>
//               )}
//             </div>

//             {rawBrands.length > 5 && (
//               <button
//                 onClick={() => setShowAllBrands(!showAllBrands)}
//                 className="text-xs font-bold text-rose-500 hover:text-rose-600 mt-4 cursor-pointer block transition-all"
//               >
//                 {showAllBrands ? "Show less" : "Show more"}
//               </button>
//             )}
//           </div>
//           <hr className="my-5 border-gray-100" />

//           {/* BY SKIN TYPE */}
//           <div className="mb-6">
//             <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">
//               By Skin Type
//             </h3>
//             <div className="flex flex-col gap-2.5 text-sm">
//               <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-400">
//                 <input
//                   type="checkbox"
//                   checked={selectedSkinTypes.length === 0}
//                   onChange={() => setSelectedSkinTypes([])}
//                   className="w-4 h-4 rounded accent-[#2D4A3E]"
//                 />
//                 All Skin Types (Reset)
//               </label>
//               {(
//                 [
//                   "Normal",
//                   "Oily",
//                   "Dry",
//                   "Combination",
//                   "Sensitive",
//                 ] as SkinType[]
//               ).map((type) => (
//                 <label
//                   key={type}
//                   className="flex items-center gap-3 cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedSkinTypes.includes(type)}
//                     onChange={() =>
//                       toggleFilter(
//                         selectedSkinTypes,
//                         setSelectedSkinTypes,
//                         type,
//                       )
//                     }
//                     className="w-4 h-4 rounded accent-[#2D4A3E]"
//                   />
//                   {type}
//                 </label>
//               ))}
//             </div>
//           </div>
//           <hr className="my-5 border-gray-100" />

//           {/* PRICE RANGE */}
//           <div className="mb-6">
//             <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-1">
//               Price
//             </h3>
//             <p className="text-xs text-gray-500 mb-3">
//               ৳0.00 - ৳{priceRange.toFixed(2)}
//             </p>
//             <input
//               type="range"
//               min="0"
//               max="5000"
//               value={priceRange}
//               onChange={(e) => setPriceRange(Number(e.target.value))}
//               className="w-full accent-[#2D4A3E] cursor-pointer"
//             />
//           </div>
//           <hr className="my-5 border-gray-100" />

//           {/* REVIEW / RATING */}
//           <div className="mb-6">
//             <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">
//               Review
//             </h3>
//             <div className="flex flex-col gap-2.5">
//               {[5, 4, 3, 2, 1].map((stars) => (
//                 <label
//                   key={stars}
//                   className="flex items-center gap-3 cursor-pointer text-sm"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedRatings.includes(stars)}
//                     onChange={() =>
//                       toggleFilter(selectedRatings, setSelectedRatings, stars)
//                     }
//                     className="w-4 h-4 rounded accent-[#2D4A3E]"
//                   />
//                   <div className="flex items-center text-amber-400 gap-0.5">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         size={14}
//                         fill={i < stars ? "currentColor" : "none"}
//                         className={i < stars ? "" : "text-gray-200"}
//                       />
//                     ))}
//                   </div>
//                   <span className="text-xs text-gray-500">{stars} Star</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//           <hr className="my-5 border-gray-100" />

//           {/* BY PROMOTIONS */}
//           <div className="mb-6">
//             <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">
//               By Promotions
//             </h3>
//             <div className="flex flex-col gap-2.5 text-sm">
//               {(
//                 ["New Arrivals", "Best Sellers", "Trending"] as PromotionTag[]
//               ).map((promo) => (
//                 <label
//                   key={promo}
//                   className="flex items-center gap-3 cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedPromotions.includes(promo)}
//                     onChange={() =>
//                       toggleFilter(
//                         selectedPromotions,
//                         setSelectedPromotions,
//                         promo,
//                       )
//                     }
//                     className="w-4 h-4 rounded accent-[#2D4A3E]"
//                   />
//                   {promo}
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ================= MOBILE DRAWER OPTION ================= */}
//         <ShopFilterDrawer
//           isOpen={isDrawerOpen}
//           onClose={() => setIsDrawerOpen(false)}
//           onOpen={() => setIsDrawerOpen(true)} // 🎯 ফিক্সড: এই missing রিকোয়ার্ড প্রপ্সটি যোগ করা হয়েছে
//           categoriesData={categoriesData}
//           selectedCategories={selectedCategories}
//           openCategoryMenu={openCategoryMenu}
//           handleCategorySelect={handleCategorySelect}
//           selectedSubCategory={selectedSubCategory}
//           handleSubCategoryItemSelect={handleSubCategoryItemSelect}
//           getProductCount={getProductCount}
//           selectedSkinTypes={selectedSkinTypes}
//           setSelectedSkinTypes={setSelectedSkinTypes}
//           priceRange={priceRange}
//           setPriceRange={setPriceRange}
//           selectedRatings={selectedRatings}
//           setSelectedRatings={setSelectedRatings}
//           selectedPromotions={selectedPromotions}
//           setSelectedPromotions={setSelectedPromotions}
//           toggleFilter={toggleFilter}
//           selectedBrands={selectedBrands}
//           setSelectedBrands={setSelectedBrands}
//         />

//         {/* ================= RIGHT SIDE: PRODUCT GRID & TOPBAR ================= */}
//            <div className="lg:col-span-3">
//           {/* TOPBAR */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//             <p className="text-sm text-gray-600 font-medium">
//               {showSkeleton ? (
//                 <span className="inline-block h-4 bg-slate-200 rounded w-28 animate-pulse" />
//               ) : (
//                 `Showing 1-${filteredProducts.length} of ${filteredProducts.length} results`
//               )}
//             </p>
//             <div className="flex items-center gap-2 self-start sm:self-auto">

//               {/* <span className="text-sm text-gray-500">Sort by :</span> */}
//               <div className="relative bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-medium flex items-center gap-4 shadow-sm">
//                 <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-transparent pr-6 outline-none cursor-pointer font-sans text-xs">
//                   <option value="latest">Latest Arrivals (Default)</option>
//                   <option value="popularity">Popularity (Sales)</option>
//                   <option value="low-to-high">Price: Low to High</option>
//                   <option value="high-to-low">Price: High to Low</option>
//                   <option value="rating">Highest Rating</option>
//                 </select>
//                 <ChevronDown size={14} className="absolute right-3 pointer-events-none text-gray-500" />
//               </div>
//             </div>
//           </div>

//           {showSkeleton ? (
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, idx) => (
//                 <ShopProductSkeleton key={idx} />
//               ))}
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="bg-white text-center py-20 rounded-2xl border border-dashed border-gray-200">
//               <p className="text-gray-500 font-medium">No products found matching the criteria.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//               {filteredProducts.map((product) => (
//                 <ShopProductCard
//                   key={product._id || product.productCode}
//                   product={product}
//                   addToCart={addToCart}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function ShopPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
//           <div className="animate-pulse text-[#2D4A3E] font-medium">
//             Loading Shop...
//           </div>
//         </div>
//       }
//     >
//       <ShopContent />
//     </Suspense>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "@/context/AppContext";

import { Product, Category, SkinType, PromotionTag } from "@/Types/types";
import {
  useGetCategoriesForCustomer,
  useGetProductsForCustomer,
} from "@/hooks/useCustomerData";
import { useBrands } from "@/hooks/useBrands";
import ShopFilterDrawer from "./ShopFilterDrawer";
import ShopProductCard from "./ShopProductCard";
import { ShopProductSkeleton } from "@/components/Shared/ShopProductSkeleton/ShopProductSkeleton";
import Breadcrumb from "@/components/Shared/Breadcrumb/Breadcrumb";

function ShopContent() {
  const { addToCart } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // API থেকে ডাটা ফেচিং
  const { data: categoriesData = [], isLoading: isCategoriesLoading } =
    useGetCategoriesForCustomer() as { data: Category[]; isLoading: boolean };
  const { data: productsData = [], isLoading: isProductsLoading } =
    useGetProductsForCustomer() as { data: Product[]; isLoading: boolean };

  // ব্র্যান্ড ডাটা ফেচিং
  const { brandsData, isLoading: isBrandsLoading } = useBrands();

  const urlCategory = searchParams.get("category");
  const urlSubCategory = searchParams.get("subCategory");
  const urlBrand = searchParams.get("brand");

  // ফিল্টার এবং ড্রয়ার স্টেট
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null,
  );
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<SkinType[]>([]);
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedPromotions, setSelectedPromotions] = useState<PromotionTag[]>(
    [],
  );

  // ব্র্যান্ড ট্র্যাকিং স্টেট
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showAllBrands, setShowAllBrands] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [sortBy, setSortBy] = useState<string>("latest");
  const [openCategoryMenu, setOpenCategoryMenu] = useState<string | null>(null);
  const [openSubCategoryMenu, setOpenSubCategoryMenu] = useState<string | null>(
    null,
  );

  // সেফটি গার্ড: ব্র্যান্ড ডাটা রিসিভ করা
  const rawBrands = useMemo(() => {
    if (!brandsData) return [];
    if (Array.isArray(brandsData)) return brandsData;
    const fallback = brandsData as any;
    return fallback.data || fallback.brands || [];
  }, [brandsData]);

  // 📋 বুলেটিপ্রুফ ব্র্যান্ড ম্যাচিং হেল্পার ফাংশন
  const isProductMatchingBrand = (
    product: any,
    targetBrandIdOrName: string,
  ) => {
    if (!product.brand) return false;

    const target = String(targetBrandIdOrName).toLowerCase().trim();

    if (typeof product.brand === "string") {
      return product.brand.toLowerCase().trim() === target;
    }

    if (typeof product.brand === "object") {
      const bObj = product.brand as any;
      const bId = bObj._id?.$oid || bObj._id;
      const bName = bObj.name;
      const bSlug = bObj.slug;

      return (
        (bId && String(bId).toLowerCase().trim() === target) ||
        (bName && String(bName).toLowerCase().trim() === target) ||
        (bSlug && String(bSlug).toLowerCase().trim() === target)
      );
    }

    return false;
  };

  // 🎯 ইউআরএল প্যারামস সিঙ্ক (Category, SubCategory এবং Brand)
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategories([urlCategory]);
      setOpenCategoryMenu(urlCategory);
    } else if (urlSubCategory && categoriesData.length > 0) {
      const parentCat = categoriesData.find((cat) =>
        cat.subCategories.some((sub) =>
          sub.items.some(
            (item) =>
              item?.name?.toLowerCase() === urlSubCategory.toLowerCase(),
          ),
        ),
      );
      if (parentCat) {
        setSelectedCategories([parentCat._id]);
        setOpenCategoryMenu(parentCat._id);

        const subCat = parentCat.subCategories.find((sub) =>
          sub.items.some(
            (item) =>
              item?.name?.toLowerCase() === urlSubCategory.toLowerCase(),
          ),
        );
        if (subCat) {
          setOpenSubCategoryMenu(subCat.title);
        }
      }
      setSelectedSubCategory(urlSubCategory);
    }

    // 🎯 অন্য পেজ থেকে ব্র্যান্ডে ক্লিক করে আসলে স্টেট সিঙ্ক করার লজিক
    if (urlBrand && rawBrands.length > 0) {
      const matchedBrand = rawBrands.find((b: any) => {
        const bId = b?._id?.$oid || b?._id;
        return (
          String(bId).toLowerCase() === urlBrand.toLowerCase() ||
          String(b?.slug).toLowerCase() === urlBrand.toLowerCase() ||
          String(b?.name).toLowerCase() === urlBrand.toLowerCase()
        );
      });

      if (matchedBrand) {
        const correctId =
          matchedBrand?._id?.$oid ||
          matchedBrand?._id ||
          matchedBrand?.slug ||
          matchedBrand?.name;
        setSelectedBrands([String(correctId)]);
      }
    }
  }, [urlCategory, urlSubCategory, urlBrand, categoriesData, rawBrands]);

  // 🎯 প্রোডাক্ট কাউন্ট মেথড
  const getProductCount = (
    type: "category" | "subGroup" | "item" | "brand",
    name: string,
  ) => {
    if (!productsData) return 0;
    return productsData.filter((product) => {
      const catId =
        typeof product.category === "object"
          ? product.category?._id
          : product.category;

      if (type === "category") return catId === name;
      if (type === "subGroup")
        return product.subCategory?.toLowerCase() === name.toLowerCase();
      if (type === "item")
        return product.itemName?.toLowerCase() === name.toLowerCase();

      if (type === "brand") {
        return isProductMatchingBrand(product, name);
      }
      return false;
    }).length;
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedSubCategory(null);
    setOpenSubCategoryMenu(null);

    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories([]);
      setOpenCategoryMenu(null);
      router.push("/shop");
    } else {
      setSelectedCategories([categoryId]);
      setOpenCategoryMenu(categoryId);
      router.push(`/shop?category=${categoryId}`);
    }
  };

  const handleSubCategoryToggle = (subTitle: string) => {
    if (openSubCategoryMenu === subTitle) {
      setOpenSubCategoryMenu(null);
    } else {
      setOpenSubCategoryMenu(subTitle);
    }
  };

  const handleSubCategoryItemSelect = (itemName: string) => {
    if (selectedSubCategory?.toLowerCase() === itemName.toLowerCase()) {
      setSelectedSubCategory(null);
      router.push(
        selectedCategories.length
          ? `/shop?category=${selectedCategories[0]}`
          : "/shop",
      );
    } else {
      setSelectedSubCategory(itemName);
      router.push(`/shop?subCategory=${encodeURIComponent(itemName)}`);
    }
  };

  // 🎯 কোনো ব্র্যান্ড চেক/আনচেক করলে ইউআরএল আপডেট করার ফাংশন
  const handleBrandToggle = (brandId: string) => {
    let updatedBrands = [...selectedBrands];
    if (updatedBrands.includes(brandId)) {
      updatedBrands = updatedBrands.filter((id) => id !== brandId);
    } else {
      updatedBrands.push(brandId);
    }
    setSelectedBrands(updatedBrands);

    // ইউআরএল রিমুভ বা আপডেট করা যাতে রিফ্রেশ দিলেও ঠিক থাকে
    if (updatedBrands.length === 1) {
      router.push(`/shop?brand=${updatedBrands[0]}`);
    } else if (updatedBrands.length === 0) {
      router.push("/shop");
    }
  };

  const displayedBrands = showAllBrands ? rawBrands : rawBrands.slice(0, 5);

  // 🎯 ফিল্টারিং এবং সর্টিং মেকানিজম
  const filteredProducts = useMemo(() => {
    if (!productsData) return [];

    return productsData
      .filter((product) => {
        if (product.status !== "Active") return false;

        const catId =
          typeof product.category === "object"
            ? product.category?._id
            : product.category;
        if (
          selectedCategories.length > 0 &&
          (!catId || !selectedCategories.includes(catId))
        ) {
          return false;
        }

        if (
          selectedSubCategory &&
          product.itemName?.toLowerCase() !== selectedSubCategory.toLowerCase()
        ) {
          return false;
        }

        if (selectedBrands.length > 0) {
          const matchedWithAnySelected = selectedBrands.some((brandIdOrName) =>
            isProductMatchingBrand(product, brandIdOrName),
          );
          if (!matchedWithAnySelected) return false;
        }

        if (selectedSkinTypes.length > 0) {
          if (!product.skinType || product.skinType.trim() === "") {
            // All skin types
          } else {
            const productSkinLower = product.skinType.toLowerCase();
            const isMatched = selectedSkinTypes.some(
              (type) => type.toLowerCase() === productSkinLower,
            );
            if (!isMatched) return false;
          }
        }

        if (product.price > priceRange) {
          return false;
        }

        if (
          selectedRatings.length > 0 &&
          !selectedRatings.includes(Math.floor(product.rating || 0))
        ) {
          return false;
        }

        if (selectedPromotions.length > 0) {
          if (!product.promotion) return false;

          const pPromoClean = String(product.promotion).toLowerCase().trim();
          const hasMatchedPromo = selectedPromotions.some(
            (selectedPromo) =>
              String(selectedPromo).toLowerCase().trim() === pPromoClean,
          );

          if (!hasMatchedPromo) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "latest" || sortBy === "default") {
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          return dateB - dateA;
        }
        if (sortBy === "low-to-high") return a.price - b.price;
        if (sortBy === "high-to-low") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "popularity")
          return (b.salesCount || 0) - (a.salesCount || 0);
        return 0;
      });
  }, [
    productsData,
    selectedCategories,
    selectedSubCategory,
    selectedBrands,
    selectedSkinTypes,
    priceRange,
    selectedRatings,
    selectedPromotions,
    sortBy,
  ]);

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedSubCategory(null);
    setSelectedSkinTypes([]);
    setSelectedBrands([]);
    setPriceRange(5000);
    setSelectedRatings([]);
    setSelectedPromotions([]);
    setOpenCategoryMenu(null);
    setOpenSubCategoryMenu(null);
    setSortBy("latest");
    router.push("/shop");
  };

  const toggleFilter = <T,>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    value: T,
  ) => {
    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value],
    );
  };

  const showSkeleton = isCategoriesLoading || isProductsLoading;

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-12 px-4 md:px-12 text-[#2C3E35]">
      <div className="container mx-auto">
        <div className="md:mb-6 md:pl-2">
          <Breadcrumb />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* ================= LEFT SIDEBAR (DESKTOP) ================= */}
          <div className="hidden lg:block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24 max-h-[85vh] overflow-y-auto scrollbar-none">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold text-[#1A2E22]">
                Filter Options
              </h2>
              {(selectedCategories.length > 0 ||
                selectedSubCategory ||
                selectedBrands.length > 0 ||
                selectedSkinTypes.length > 0 ||
                priceRange < 5000 ||
                selectedRatings.length > 0 ||
                selectedPromotions.length > 0) && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22] mb-4 opacity-50">
                Product Categories
              </h3>
              {isCategoriesLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {categoriesData.map((category) => {
                    const isCatSelected = selectedCategories.includes(
                      category._id,
                    );
                    const isCatOpen = openCategoryMenu === category._id;
                    const totalCatProducts = getProductCount(
                      "category",
                      category._id,
                    );

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
                              const totalSubProducts = getProductCount(
                                "subGroup",
                                sub.title,
                              );
                              const isSubOpen =
                                openSubCategoryMenu === sub.title;

                              return (
                                <div key={sIdx} className="flex flex-col">
                                  <div
                                    onClick={() =>
                                      handleSubCategoryToggle(sub.title)
                                    }
                                    className="flex justify-between items-center text-xs font-bold uppercase text-[#FF3F6C] tracking-wide mb-2 mt-1 cursor-pointer hover:opacity-80 transition-all"
                                  >
                                    <span>{sub.title}</span>
                                    <div className="flex items-center gap-1">
                                      <span className="bg-[#FF3F6C]/10 text-[#FF3F6C] text-[9px] px-1.5 py-0.2 rounded-full font-sans">
                                        {totalSubProducts}
                                      </span>
                                      {isSubOpen ? (
                                        <ChevronUp size={12} />
                                      ) : (
                                        <ChevronDown size={12} />
                                      )}
                                    </div>
                                  </div>

                                  {isSubOpen && (
                                    <ul className="flex flex-col gap-1.5 pl-2 mb-1 animate-fadeIn">
                                      {sub.items.map((item, iIdx) => {
                                        const isItemActive =
                                          selectedSubCategory?.toLowerCase() ===
                                          item?.name?.toLowerCase();
                                        const totalItemProducts =
                                          getProductCount("item", item?.name);

                                        return (
                                          <li
                                            key={iIdx}
                                            onClick={() =>
                                              handleSubCategoryItemSelect(
                                                item.name,
                                              )
                                            }
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
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <hr className="my-5 border-gray-100" />

            {/* BRAND FILTER SECTION */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#1A2E22] mb-3">
                Filter by Brand
              </h3>

              <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto scrollbar-none pr-1">
                {isBrandsLoading ? (
                  <div className="space-y-2 animate-pulse py-1">
                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                    <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  </div>
                ) : displayedBrands.length > 0 ? (
                  displayedBrands.map((brand: any) => {
                    const brandIdentifier =
                      brand?._id?.$oid ||
                      brand?._id ||
                      String(brand?.slug || brand?.name);
                    const isBrandChecked =
                      selectedBrands.includes(brandIdentifier);
                    const totalBrandProducts = getProductCount(
                      "brand",
                      brandIdentifier,
                    );

                    return (
                      <label
                        key={brandIdentifier}
                        className="flex items-center justify-between cursor-pointer group select-none text-slate-600 hover:text-slate-900"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isBrandChecked}
                            onChange={() => handleBrandToggle(brandIdentifier)}
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
                  <p className="text-xs text-slate-400 italic py-1">
                    No brands found!
                  </p>
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
              <div className="flex flex-col gap-2.5 text-sm">
                <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedSkinTypes.length === 0}
                    onChange={() => setSelectedSkinTypes([])}
                    className="w-4 h-4 rounded accent-[#2D4A3E]"
                  />
                  All Skin Types (Reset)
                </label>
                {(
                  [
                    "Normal",
                    "Oily",
                    "Dry",
                    "Combination",
                    "Sensitive",
                  ] as SkinType[]
                ).map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSkinTypes.includes(type)}
                      onChange={() =>
                        toggleFilter(
                          selectedSkinTypes,
                          setSelectedSkinTypes,
                          type,
                        )
                      }
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
                  <label
                    key={stars}
                    className="flex items-center gap-3 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(stars)}
                      onChange={() =>
                        toggleFilter(selectedRatings, setSelectedRatings, stars)
                      }
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
                {(
                  ["New Arrivals", "Best Sellers", "Trending"] as PromotionTag[]
                ).map((promo) => (
                  <label
                    key={promo}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPromotions.includes(promo)}
                      onChange={() =>
                        toggleFilter(
                          selectedPromotions,
                          setSelectedPromotions,
                          promo,
                        )
                      }
                      className="w-4 h-4 rounded accent-[#2D4A3E]"
                    />
                    {promo}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ================= MOBILE DRAWER OPTION ================= */}
          <ShopFilterDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onOpen={() => setIsDrawerOpen(true)}
            categoriesData={categoriesData}
            selectedCategories={selectedCategories}
            openCategoryMenu={openCategoryMenu}
            handleCategorySelect={handleCategorySelect}
            selectedSubCategory={selectedSubCategory}
            handleSubCategoryItemSelect={handleSubCategoryItemSelect}
            getProductCount={getProductCount}
            selectedSkinTypes={selectedSkinTypes}
            setSelectedSkinTypes={setSelectedSkinTypes}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedRatings={selectedRatings}
            setSelectedRatings={setSelectedRatings}
            selectedPromotions={selectedPromotions}
            setSelectedPromotions={setSelectedPromotions}
            toggleFilter={toggleFilter}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
          />

          {/* ================= RIGHT SIDE: PRODUCT GRID & TOPBAR ================= */}
          <div className="lg:col-span-3">
            {/* TOPBAR */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 md:gap-4 mb-6">
              <p className="text-sm text-gray-600 font-medium">
                {showSkeleton ? (
                  <span className="inline-block md:h-4 bg-slate-200 rounded w-28 animate-pulse" />
                ) : (
                  `Showing 1-${filteredProducts.length} of ${filteredProducts.length} results`
                )}
              </p>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="relative bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-medium flex items-center gap-4 shadow-sm">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent pr-6 outline-none cursor-pointer font-sans text-xs"
                  >
                    <option value="latest">Latest Arrivals (Default)</option>
                    <option value="popularity">Popularity (Sales)</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                    <option value="rating">Highest Rating</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 pointer-events-none text-gray-500"
                  />
                </div>
              </div>
            </div>

            {showSkeleton ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <ShopProductSkeleton key={idx} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white text-center py-20 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">
                  No products found matching the criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ShopProductCard
                    key={product._id || product.productCode}
                    product={product}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
          <div className="animate-pulse text-[#2D4A3E] font-medium">
            Loading Shop...
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
