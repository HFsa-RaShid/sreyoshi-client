/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, Send } from "lucide-react";
import { useReviews } from "@/hooks/useReviews"; 
import { useUserData } from "@/hooks/useUserData"; // 🎯 নতুন ইউজার ডাটা হুক ইম্পোর্ট

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const router = useRouter();
  
  // ─── 🎯 সেশন ও ব্যাকএন্ড ইউজার ডাটা ফিক্স ───
  const { user: currentUser, isLoading: isUserLoading } = useUserData();

  // ─── রিভিউ ডাটা ও মিউটেশন হুক ───
  const { 
    reviews, 
    isLoadingReviews: isLoading, 
    createReview 
  } = useReviews(productId);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🎯 শুধুমাত্র Active রিভিউগুলো ফিল্টার করে আলাদা ভ্যারিয়েবলে রাখা হলো
  const activeReviews = reviews ? reviews.filter((rev: any) => rev.status === "Active") : [];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 💡 ইউজার লগইন না থাকলে সাইন-ইন পেজে নিয়ে যাবে
    if (!currentUser) {
      router.push("/signin");
      return;
    }

    if (!comment.trim()) return;

    // 🎯 ব্যাকএন্ড ডাটাবেজ থেকে আসা সঠিক আইডি চেক (_id অথবা id)
    const userId = currentUser._id || currentUser.id;

    if (!userId) {
      console.error("❌ User ID could not be resolved from backend profile data.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // হুকের মাধ্যমে ব্যাকএন্ডে রিকোয়েস্ট পাঠানো
      await createReview({
        productId,
        userId, 
        rating,
        comment,
        isRecommended: true,
      });

      // সফল হলে ফর্ম রিসেট
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2">
      {/* রিভিউ রাইটিং ফর্ম বা লগইন অ্যালার্ট */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="text-sm font-bold text-[#1A2E22] mb-3 flex items-center gap-2">
          <MessageSquare size={16} /> Share Your Feedback
        </h4>
        
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Your Rating</label>
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    size={20}
                    fill={(hoverRating !== null ? hoverRating : rating) >= star ? "currentColor" : "none"}
                    className={(hoverRating !== null ? hoverRating : rating) >= star ? "" : "text-gray-200"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Comment</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={currentUser ? "Write your experience with this product..." : "Please sign in to drop your review."}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:border-[#1A2E22] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isUserLoading}
            className="bg-[#1A2E22] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {currentUser ? (
              <>
                {isSubmitting ? "Submitting..." : "Submit Review"} <Send size={12} />
              </>
            ) : (
              "Login to Add Review"
            )}
          </button>
        </form>
      </div>

      {/* রিভিউর তালিকা */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Reviews</h4>
        
        {isLoading ? (
          <p className="text-xs text-center text-gray-400 py-4">Loading Reviews...</p>
        ) : activeReviews.length > 0 ? (
          <div className="space-y-3">
            {/* 🎯 ম্যাপ লুপ এখন শুধু ফিল্টার করা activeReviews-এর ওপর চলবে */}
            {activeReviews.map((rev: any, index: number) => (
              <div key={rev._id || index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-[#1A2E22]">{rev.user?.name || rev.userName || "Anonymous User"}</p>
                  <span className="text-[10px] text-gray-400">
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-gray-200"} />
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-1">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-center text-gray-400 py-6 bg-white rounded-xl border border-dashed border-gray-200">
            No approved reviews yet for this product. Be the first to review!
          </p>
        )}
      </div>
    </div>
  );
}