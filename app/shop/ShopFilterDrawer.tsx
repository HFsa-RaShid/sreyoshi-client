"use client";

import React from "react";
import { X, ChevronUp, ChevronDown, Star } from "lucide-react";
import { Category, SkinType, PromotionTag } from "@/Types/types";

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
    type: "category" | "subGroup" | "item",
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
}: ShopFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity lg:hidden"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="fixed top-0 left-0 min-h-screen h-fit w-[300px] bg-white z-50 p-6 shadow-2xl transition-transform duration-300 transform lg:hidden">
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
                                  selectedSubCategory?.toLowerCase() ===
                                  item?.name?.toLowerCase();
                                const totalItemProducts = getProductCount(
                                  "item",
                                  item?.name,
                                );

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

        {/* BY SKIN TYPE */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">
            By Skin Type
          </h3>
          <div className="flex flex-col gap-2.5 text-sm">
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
                    toggleFilter(selectedSkinTypes, setSelectedSkinTypes, type)
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
    </>
  );
}
