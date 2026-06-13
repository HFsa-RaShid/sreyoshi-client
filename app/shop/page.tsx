/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Star, Heart, Eye, ShoppingBag, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import productsData from "../../public/data/products.json";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ইউআরএল থেকে ক্যাটাগরি বা সাব-ক্যাটাগরি রিড করা
  const urlCategory = searchParams.get("category");
  const urlSubCategory = searchParams.get("subCategory");

  // ফিল্টার স্টেটসমূহ
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(100);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");

  // ইউআরএল চেঞ্জ হলে অটোমেটিক ফিল্টার সিলেক্ট হওয়া
  useEffect(() => {
    if (urlCategory) setSelectedCategories([urlCategory]);
  }, [urlCategory]);

  // ফিল্টার এবং অ্যাডভান্সড সর্টিং লজিক প্রসেসিং
  const filteredProducts = useMemo(() => {
    return productsData
      .filter((product) => {
        // ১. ইউআরএল সাব-ক্যাটাগরি ফিল্টার (নেভবার থেকে সরাসরি ক্লিক করে আসলে)
        if (urlSubCategory && product.subCategory.toLowerCase() !== urlSubCategory.toLowerCase()) {
          return false;
        }
        // ২. সাইডবার ক্যাটাগরি ফিল্টার
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
          return false;
        }
        // ৩. স্কিন টাইপ ফিল্টার
        if (selectedSkinTypes.length > 0 && !selectedSkinTypes.includes(product.skinType)) {
          return false;
        }
        // ৪. প্রাইস রেঞ্জ ফিল্টার
        if (product.price > priceRange) {
          return false;
        }
        // ৫. রেটিং ফিল্টার
        if (selectedRatings.length > 0 && !selectedRatings.includes(Math.floor(product.rating))) {
          return false;
        }
        // ৬. প্রমোশন ফিল্টার
        if (selectedPromotions.length > 0 && !selectedPromotions.includes(product.promotion)) {
          return false;
        }
        // ৭. অ্যাভেইলেবিলিটি ফিল্টার
        if (selectedAvailability.length > 0 && !selectedAvailability.includes(product.availability)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "low-to-high") return a.price - b.price;
        if (sortBy === "high-to-low") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "popularity") return b.salesCount - a.salesCount; // সর্বোচ্চ বিক্রি হওয়া প্রোডাক্ট আগে আসবে
        if (sortBy === "latest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // নতুন আপলোড হওয়া প্রোডাক্ট আগে আসবে
        return 0; // Default Sorting
      });
  }, [selectedCategories, selectedSkinTypes, priceRange, selectedRatings, selectedPromotions, selectedAvailability, sortBy, urlSubCategory]);

  // সব ফিল্টার রিসেট করার ফাংশন (Clear All)
  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedSkinTypes([]);
    setPriceRange(100);
    setSelectedRatings([]);
    setSelectedPromotions([]);
    setSelectedAvailability([]);
    router.push("/shop"); // ইউআরএল কুয়েরি ক্লিন করার জন্য
  };

  // টগল হ্যান্ডলারস
  const toggleFilter = (list: any[], setList: Function, value: any) => {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-12 px-4 md:px-12 text-[#2C3E35]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ================= LEFT SIDEBAR: FILTER OPTIONS ================= */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24">
          <h2 className="text-xl font-serif font-bold text-[#1A2E22] mb-6">Filter Options</h2>

          {/* BY CATEGORIES */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">By Categories</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              {["skin-care", "makeup", "hair-care", "body-care"].map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer capitalize">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                    className="w-4 h-4 rounded accent-[#2D4A3E]"
                  />
                  {cat.replace("-", " ")}
                </label>
              ))}
            </div>
          </div>
          <hr className="my-5 border-gray-100" />

          {/* BY SKIN TYPE */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">By Skin Type</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              {["Normal", "Oily", "Dry", "Combination", "Sensitive"].map((type) => (
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-1">Price</h3>
            <p className="text-xs text-gray-500 mb-3">$10.00 - ${priceRange.toFixed(2)}</p>
            <input
              type="range"
              min="10"
              max="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#2D4A3E] cursor-pointer"
            />
          </div>
          <hr className="my-5 border-gray-100" />

          {/* REVIEW / RATING */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">Review</h3>
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">By Promotions</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              {["New Arrivals", "Best Sellers", "On Sale"].map((promo) => (
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
          <hr className="my-5 border-gray-100" />

          {/* AVAILABILITY */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A2E22] mb-3">Availability</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              {["In Stock", "Out of Stocks"].map((stock) => (
                <label key={stock} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAvailability.includes(stock)}
                    onChange={() => toggleFilter(selectedAvailability, setSelectedAvailability, stock)}
                    className="w-4 h-4 rounded accent-[#2D4A3E]"
                  />
                  {stock}
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDE: PRODUCT GRID & TOPBAR ================= */}
        <div className="lg:col-span-3">
          
          {/* TOPBAR: RESULTS count & SORTING */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-sm text-gray-600 font-medium">
              Showing 1-{filteredProducts.length} of {filteredProducts.length} results
              {urlSubCategory && <span className="text-[#2D4A3E] font-bold"> (Filtered by: {urlSubCategory})</span>}
            </p>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-sm text-gray-500">Sort by :</span>
              <div className="relative bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-medium flex items-center gap-4 shadow-sm">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent pr-6 outline-none cursor-pointer font-sans"
                >
                  <option value="default">Default Sorting</option>
                  <option value="popularity">Popularity (Sales)</option>
                  <option value="latest">Latest Arrivals</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 pointer-events-none text-gray-500" />
              </div>
            </div>
          </div>

          {/* ACTIVE FILTER BADGES */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-bold text-gray-400 mr-1">Active Filter</span>
            
            <div className="flex items-center gap-1.5 bg-[#1A2E22] text-white text-xs px-3 py-1.5 rounded-full font-medium">
              Price : $10.00 - ${priceRange.toFixed(2)}
            </div>

            {selectedPromotions.map((p) => (
              <div key={p} className="flex items-center gap-1.5 bg-[#1A2E22] text-white text-xs px-3 py-1.5 rounded-full font-medium">
                {p} <X size={12} className="cursor-pointer" onClick={() => toggleFilter(selectedPromotions, setSelectedPromotions, p)} />
              </div>
            ))}

            {selectedAvailability.map((a) => (
              <div key={a} className="flex items-center gap-1.5 bg-[#1A2E22] text-white text-xs px-3 py-1.5 rounded-full font-medium">
                {a} <X size={12} className="cursor-pointer" onClick={() => toggleFilter(selectedAvailability, setSelectedAvailability, a)} />
              </div>
            ))}

            <button onClick={handleClearAll} className="text-xs text-amber-600 font-semibold hover:underline ml-2">
              Clear All
            </button>
          </div>

          {/* PRODUCT GRID */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white text-center py-20 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No products found matching the criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative bg-transparent flex flex-col">
                  
                  {/* IMAGE WRAPPER (TWO-IMAGE TWO-LAYER HOVER HOOKED UPER-EFFECT) */}
                  <div className="relative aspect-[4/5] w-full bg-[#EAE7DC] rounded-[24px] overflow-hidden mb-3 shadow-sm cursor-pointer">
                    
                    {/* ডিফল্ট ইমেজ (images[0]) */}
                    <div
                      className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out group-hover:opacity-0"
                      style={{ backgroundImage: `url(${product.images[0]})` }}
                    />
                    
                    {/* হোভার ইমেজ (images[1] বা ব্যাকআপ হিসেবে images[0]) */}
                    <div
                      className="absolute inset-0 w-full h-full bg-cover bg-center scale-100 group-hover:scale-105 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100"
                      style={{ backgroundImage: `url(${product.images[1] || product.images[0]})` }}
                    />
                    
                    {/* Discount Badge */}
                    <span className="absolute top-4 left-4 bg-[#1A2E22] text-white font-sans text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
                      {product.discount}
                    </span>

                    {/* Quick Action Overlay Buttons */}
                    <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <button className="bg-white text-[#1A2E22] p-2 rounded-full shadow-md hover:bg-[#1A2E22] hover:text-white transition-colors">
                        <Heart size={16} />
                      </button>
                      <button className="bg-white text-[#1A2E22] p-2 rounded-full shadow-md hover:bg-[#1A2E22] hover:text-white transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="bg-white text-[#1A2E22] p-2 rounded-full shadow-md hover:bg-[#1A2E22] hover:text-white transition-colors">
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Product Metadata Area */}
                  <div className="flex justify-between items-start px-1">
                    <div>
                      <span className="text-xs text-gray-400 font-medium block mb-0.5 capitalize">
                        {product.category.replace("-", " ")}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#1A2E22] group-hover:text-black transition-colors">
                        {product.name}
                      </h4>
                    </div>
                    
                    {/* Dynamic Rating with Rating Count */}
                    <div className="flex items-center gap-1 text-xs font-bold text-[#1A2E22] mt-0.5 shrink-0">
                      <Star size={14} fill="currentColor" className="text-amber-400" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-gray-400 font-normal text-[10px]">({product.ratingCount})</span>
                    </div>
                  </div>

                  {/* Pricing row */}
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[#CDA275] font-bold text-base">${product.price.toFixed(2)}</span>
                    <span className="text-gray-400 line-through text-xs">${product.oldPrice.toFixed(2)}</span>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* ================= PAGINATION BAR ================= */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button className="p-2 rounded-full bg-white border border-gray-100 hover:bg-[#1A2E22] hover:text-white transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold bg-[#1A2E22] text-white">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold bg-white text-[#1A2E22] hover:bg-gray-100 transition-colors">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold bg-white text-[#1A2E22] hover:bg-gray-100 transition-colors">3</button>
              <span className="text-gray-400 text-xs px-1">...</span>
              <button className="w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold bg-white text-[#1A2E22] hover:bg-gray-100 transition-colors">10</button>
              <button className="p-2 rounded-full bg-white border border-gray-100 hover:bg-[#1A2E22] hover:text-white transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}