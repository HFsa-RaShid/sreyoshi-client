
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Star,
  ChevronDown,
  ChevronUp,
  Loader2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

import { Product, Category, SkinType, PromotionTag } from "@/Types/types";
import {
  useGetCategoriesForCustomer,
  useGetProductsForCustomer,
} from "@/hooks/useCustomerData";
import ShopFilterDrawer from "./ShopFilterDrawer";
import ShopProductCard from "./ShopProductCard";
import { ShopProductSkeleton } from "@/components/Shared/ShopProductSkeleton/ShopProductSkeleton";

export default function ShopPage() {
  const { addToCart } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // API থেকে ডাটা ফেচিং
  const { data: categoriesData = [], isLoading: isCategoriesLoading } =
    useGetCategoriesForCustomer() as { data: Category[]; isLoading: boolean };
  const { data: productsData = [], isLoading: isProductsLoading } =
    useGetProductsForCustomer() as { data: Product[]; isLoading: boolean };

  const urlCategory = searchParams.get("category");
  const urlSubCategory = searchParams.get("subCategory");

  // ফিল্টার এবং ড্রয়ার স্টেট
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
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
  
  // 🎯 ১. লেটেস্ট প্রোডাক্ট আগে দেখানোর জন্য ডিফল্ট সর্টিং "latest" করা হলো
  const [sortBy, setSortBy] = useState<string>("latest");
  const [openCategoryMenu, setOpenCategoryMenu] = useState<string | null>(null);
  
  // 🎯 ২. শুধুমাত্র একটি সাব-ক্যাটাগরি ওপেন রাখার জন্য নতুন স্টেট
  const [openSubCategoryMenu, setOpenSubCategoryMenu] = useState<string | null>(null);

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
          sub.items.some((item) => item?.name?.toLowerCase() === urlSubCategory.toLowerCase())
        );
        if (subCat) {
          setOpenSubCategoryMenu(subCat.title);
        }
      }
      setSelectedSubCategory(urlSubCategory);
    }
  }, [urlCategory, urlSubCategory, categoriesData]);

  const getProductCount = (
    type: "category" | "subGroup" | "item",
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
      return false;
    }).length;
  };

  // 🎯 ৩. ক্যাটাগরি ক্লিক হ্যান্ডলার (ক্লিক করলে সাব-ক্যাটাগরি লিস্ট আসবে, কিন্তু আইটেম বন্ধ থাকবে)
  const handleCategorySelect = (categoryId: string) => {
    setSelectedSubCategory(null);
    setOpenSubCategoryMenu(null); // সাব-ক্যাটাগরি মেনু রিসেট
    
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

  // 🎯 ৪. সাব-ক্যাটাগরি হেডার ক্লিক হ্যান্ডলার (একটি ওপেন হলে অন্যগুলো অফ হয়ে যাবে)
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

  // ফিল্টারিং এবং সর্টিং মেকানিজম
  const filteredProducts = useMemo(() => {
    if (!productsData) return [];

    return productsData
      .filter((product) => {
        if (product.status !== "Active") return false;

        // ক্যাটাগরি ফিল্টার - ক্যাটাগরি সিলেক্ট করলে ওই ক্যাটাগরির সব প্রোডাক্ট আসবে
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

        // সাব-ক্যাটাগরি আইটেম ফিল্টার
        if (
          selectedSubCategory &&
          product.itemName?.toLowerCase() !== selectedSubCategory.toLowerCase()
        ) {
          return false;
        }

        // স্কিন টাইপ ফিল্টারিং
        if (selectedSkinTypes.length > 0) {
          if (!product.skinType || product.skinType.trim() === "") {
            // All skin types
          } else {
            const productSkinLower = product.skinType.toLowerCase();
            const isMatched = selectedSkinTypes.some(
              (type) => type.toLowerCase() === productSkinLower
            );
            if (!isMatched) return false;
          }
        }

        // প্রাইস রেঞ্জ ফিল্টার
        if (product.price > priceRange) {
          return false;
        }

        // রেটিং ফিল্টার
        if (
          selectedRatings.length > 0 &&
          !selectedRatings.includes(Math.floor(product.rating || 0))
        ) {
          return false;
        }

        // প্রমোশন ট্যাগ ফিল্টার
        if (
          selectedPromotions.length > 0 &&
          (!product.promotion ||
            !selectedPromotions.includes(product.promotion as PromotionTag))
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // 🎯 ৫. ডিফল্ট সর্টিং অথবা "latest" সিলেক্ট করা থাকলে লেটেস্ট প্রোডাক্ট আগে আসবে
        if (sortBy === "latest" || sortBy === "default") {
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          return dateB - dateA;
        }
        if (sortBy === "low-to-high") return a.price - b.price;
        if (sortBy === "high-to-low") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "popularity") return (b.salesCount || 0) - (a.salesCount || 0);
        return 0;
      });
  }, [
    productsData,
    selectedCategories,
    selectedSubCategory,
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
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ================= LEFT SIDEBAR (DESKTOP) - এটি লোডিংয়ের সময়ও দৃশ্যমান থাকবে ================= */}
        <div className="hidden lg:block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-auto sticky top-24">
          <h2 className="text-xl font-serif font-bold text-[#1A2E22] mb-6">
            Filter Options
          </h2>

          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22] mb-4 opacity-50">
              Product Categories
            </h3>
            {/* যদি ক্যাটাগরি লোড হতে থাকে তবে সাইডবারে একটি ছোট অ্যানিমেটেড লোডার দেখাবে */}
            {isCategoriesLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              </div>
            ) : (
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
                          <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full ${isCatSelected ? "bg-[#FF3F6C] text-white" : "bg-gray-100 text-gray-500"}`}>
                            {totalCatProducts}
                          </span>
                          {isCatOpen ? <ChevronUp size={14} className="opacity-60" /> : <ChevronDown size={14} className="opacity-60" />}
                        </div>
                      </div>

                      {isCatOpen && (
                        <div className="pl-4 mt-2 flex flex-col gap-3 border-l border-gray-100 ml-1">
                          {category.subCategories.map((sub, sIdx) => {
                            const totalSubProducts = getProductCount("subGroup", sub.title);
                            const isSubOpen = openSubCategoryMenu === sub.title;

                            return (
                              <div key={sIdx} className="flex flex-col">
                                <div 
                                  onClick={() => handleSubCategoryToggle(sub.title)}
                                  className="flex justify-between items-center text-xs font-bold uppercase text-[#FF3F6C] tracking-wide mb-2 mt-1 cursor-pointer hover:opacity-80 transition-all"
                                >
                                  <span>{sub.title}</span>
                                  <div className="flex items-center gap-1">
                                    <span className="bg-[#FF3F6C]/10 text-[#FF3F6C] text-[9px] px-1.5 py-0.2 rounded-full font-sans">
                                      {totalSubProducts}
                                    </span>
                                    {isSubOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                  </div>
                                </div>

                                {isSubOpen && (
                                  <ul className="flex flex-col gap-1.5 pl-2 mb-1 animate-fadeIn">
                                    {sub.items.map((item, iIdx) => {
                                      const isItemActive = selectedSubCategory?.toLowerCase() === item?.name?.toLowerCase();
                                      const totalItemProducts = getProductCount("item", item?.name);

                                      return (
                                        <li
                                          key={iIdx}
                                          onClick={() => handleSubCategoryItemSelect(item.name)}
                                          className={`flex justify-between items-center text-xs font-medium cursor-pointer py-0.5 transition-all ${isItemActive ? "text-[#1A2E22] font-bold" : "text-[#5A655D] hover:text-[#1A2E22]"}`}
                                        >
                                          <span className="truncate max-w-[160px]">{item.name}</span>
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

          {/* BY SKIN TYPE */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">By Skin Type</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-400">
                <input type="checkbox" checked={selectedSkinTypes.length === 0} onChange={() => setSelectedSkinTypes([])} className="w-4 h-4 rounded accent-[#2D4A3E]" />
                All Skin Types (Reset)
              </label>
              {(["Normal", "Oily", "Dry", "Combination", "Sensitive"] as SkinType[]).map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={selectedSkinTypes.includes(type)} onChange={() => toggleFilter(selectedSkinTypes, setSelectedSkinTypes, type)} className="w-4 h-4 rounded accent-[#2D4A3E]" />
                  {type}
                </label>
              ))}
            </div>
          </div>
          <hr className="my-5 border-gray-100" />

          {/* PRICE RANGE */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-1">Price</h3>
            <p className="text-xs text-gray-500 mb-3">৳0.00 - ৳{priceRange.toFixed(2)}</p>
            <input type="range" min="0" max="5000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-[#2D4A3E] cursor-pointer" />
          </div>
        </div>

        {/* ================= MOBILE DRAWER OPTION ================= */}
        <ShopFilterDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
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
        />

        {/* ================= RIGHT SIDE: PRODUCT GRID & TOPBAR ================= */}
        <div className="lg:col-span-3">
          {/* TOPBAR */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-sm text-gray-600 font-medium">
              {showSkeleton ? (
                <span className="inline-block h-4 bg-slate-200 rounded w-28 animate-pulse" />
              ) : (
                `Showing 1-${filteredProducts.length} of ${filteredProducts.length} results`
              )}
            </p>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button onClick={() => setIsDrawerOpen(true)} className="lg:hidden flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 shadow-sm mr-2">
                <SlidersHorizontal size={14} /> Filter
              </button>
              <span className="text-sm text-gray-500">Sort by :</span>
              <div className="relative bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-medium flex items-center gap-4 shadow-sm">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-transparent pr-6 outline-none cursor-pointer font-sans text-xs">
                  <option value="latest">Latest Arrivals (Default)</option>
                  <option value="popularity">Popularity (Sales)</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 pointer-events-none text-gray-500" />
              </div>
            </div>
          </div>

          {/* ─── 🎯 ২. রাইট সাইড প্রোডাক্ট গ্রিডের কন্ডিশনাল রেন্ডারিং (লোডিং বনাম প্রোডাক্টস) ─── */}
          {showSkeleton ? (
            // লোড হওয়ার সময় ৩ কলামের রেসপন্সিভ গ্রিড অনুযায়ী ৬টি স্কেলিটন কার্ড শো করবে
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <ShopProductSkeleton key={idx} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white text-center py-20 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No products found matching the criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
  );
}