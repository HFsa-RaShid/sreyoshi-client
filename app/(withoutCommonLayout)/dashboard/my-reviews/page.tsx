"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useGetUserReviews } from "@/src/hooks/useReviewHooks"; // আপনার হুকের পাথ দিন

type RatingFilter = "All" | 5 | 4 | 3 | 2 | 1;

// 💡 টোকেন ডিকোড করার হেল্পার ফাংশন
const getUserIdFromToken = (token: string): string | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.id || decoded._id || decoded.userId || null;
  } catch {
    return null;
  }
};

export default function MyReviewsPage() {
  const [activeFilter, setActiveFilter] = useState<RatingFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // 💡 lazy initializer দিয়ে টোকেন থেকে userId বের করা
  const [userId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const token =
      localStorage.getItem("token") || localStorage.getItem("refreshToken");
    return token ? getUserIdFromToken(token) : null;
  });

  // ডাইনামিক হুক কল
  const { data: reviews = [], isLoading } = useGetUserReviews(userId || "");

  // এডিট, ডিলিট এবং নতুন রিভিউ হ্যান্ডলার (ফাংশনালিটি পরে যুক্ত করতে পারবেন)
  const handleEditReview = (reviewId: string) => console.log("Edit review:", reviewId);
  const handleDeleteReview = (reviewId: string) => console.log("Delete review:", reviewId);
  const handleWriteReview = (productId: string) => console.log("Write review for:", productId);

  // ফিল্টারিং লজিক (রেটিং এর ওপর ভিত্তি করে)
  const filteredReviews = reviews.filter((review: any) => {
    if (activeFilter === "All") return true;
    return review.rating === activeFilter;
  });

  // স্ট্যাটাস অনুযায়ী ব্যাজ কালার ডাইনামিক করার ফাংশন
  const getStatusStyle = (status: "Active" | "Pending" | "Inactive" | string) => {
    switch (status) {
      case "Active":
      case "Approved":
        return "bg-[#EBF5EE] text-[#2D4A3E] border-[#2D4A3E]/10";
      case "Pending":
        return "bg-[#FFF9E6] text-[#D9A700] border-[#D9A700]/10";
      case "Inactive":
      case "Rejected":
        return "bg-[#FDF2F2] text-[#E02424] border-[#E02424]/10";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  if (!userId) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm font-medium text-gray-500">Please log in to view your reviews.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 p-6">
        <Loader2 className="w-8 h-8 animate-spin text-[#4E612B]" />
        <p className="text-xs text-gray-400">Loading your reviews...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-6 md:p-8 text-[#1E1E1E]">
      
      {/* ---------- HEADER SECTION ---------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-[#1E1E1E] tracking-tight">
            My Reviews
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {reviews.length} Total Reviews
          </p>
        </div>

        {/* TOP FILTER TABS */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setActiveFilter("All")}
            className={`px-4 py-2 rounded-lg transition-all border cursor-pointer ${
              activeFilter === "All"
                ? "bg-[#4E612B] text-white border-[#4E612B]"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          {([5, 4, 3, 2, 1] as const).map((star) => (
            <button
              key={star}
              onClick={() => setActiveFilter(star)}
              className={`px-3 py-2 rounded-lg transition-all border flex items-center gap-1 cursor-pointer ${
                activeFilter === star
                  ? "bg-[#4E612B] text-white border-[#4E612B]"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Star size={12} fill={activeFilter === star ? "white" : "#FBBF24"} className={activeFilter === star ? "text-white" : "text-[#FBBF24]"} />
              {star} Star
            </button>
          ))}
        </div>
      </div>

      {/* ---------- REVIEWS LIST BLOCK ---------- */}
      <div className="space-y-5">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-xs text-gray-400">
            No reviews found for this rating.
          </div>
        ) : (
          filteredReviews.map((item: any) => {
            const product = item?.productId;
            const hasComment = !!item.comment; // বা ব্যাকএন্ডের message/text

            return (
              <div
                key={item._id}
                className="w-full border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start transition-all hover:border-gray-300"
              >
                {/* Product Thumbnail */}
                <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                  <Image
                    src={product?.images?.[0] || "/img/checkout.png"}
                    alt={product?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-start justify-between gap-2 w-full">
                    <div>
                      <h4 className="font-semibold text-[15px] text-[#1E1E1E]">
                        {product?.name || "Unknown Product"}
                      </h4>
                      {/* যদি কমেন্ট বা রেটিং দেওয়া না থাকে (Write Review State) */}
                      {!hasComment && (
                        <p className="text-[12px] text-gray-400 mt-0.5">
                          Order #KB-10245 · Delivered on June 12, 2026
                        </p>
                      )}
                    </div>

                    {/* Right Side Buttons or Status Tags */}
                    {hasComment ? (
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getStatusStyle(item.status || "Approved")}`}>
                          {item.status || "Approved"}
                        </span>
                        <button
                          onClick={() => handleEditReview(item._id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(item._id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 cursor-pointer transition-colors"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleWriteReview(product?._id)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition-all cursor-pointer"
                      >
                        Write Review
                      </button>
                    )}
                  </div>

                  {/* Stars Row */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={15}
                        fill={index < item.rating ? "#FBBF24" : "none"}
                        className={index < item.rating ? "text-[#FBBF24]" : "text-gray-300"}
                      />
                    ))}
                    {hasComment && (
                      <span className="text-[12px] font-bold text-gray-500 ml-1">
                        {item.rating?.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Recommendation Tag & Review Text */}
                  {hasComment && (
                    <div className="space-y-1.5 pt-1">
                      {item.rating >= 4 && (
                        <span className="inline-flex items-center bg-[#F4F8F1] text-[#37651B] text-[11px] font-bold px-2 py-0.5 rounded-md">
                          👍 Recommended
                        </span>
                      )}
                      <p className="text-xs text-gray-500 leading-relaxed font-sans max-w-3xl">
                        {item.comment}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono pt-1">
                        Delivered on June 12, 2026
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ---------- FOOTER PAGINATION ---------- */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-400 disabled:opacity-40 cursor-not-allowed transition-colors bg-white"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === pageNum
                  ? "bg-[#4E612B] text-white shadow-xs"
                  : "text-gray-500 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors bg-white"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}