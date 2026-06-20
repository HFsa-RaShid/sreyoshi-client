"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, Send } from "lucide-react";
import { useGetProductReviews, useAddReview } from "@/hooks/useReviewData";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: reviews, isLoading } = useGetProductReviews(productId);
  const addReviewMutation = useAddReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 💡 লগইন না থাকলে সাইন-ইন পেজে রিডাইরেক্ট করবে
    if (!session?.user) {
      router.push("/signin");
      return;
    }

    if (!comment.trim()) return;

    const userId = (session.user as any).id; // NextAuth সেশন থেকে প্রাপ্ত ইউজার আইডি

    addReviewMutation.mutate(
      {
        user: userId,
        product: productId,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          setComment("");
          setRating(5);
        },
      }
    );
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* রিভিউ রাইটিং ফর্ম বা লগইন অ্যালার্ট */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
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
                  className="transition-transform hover:scale-110"
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
              placeholder={session?.user ? "Write your experience with this product..." : "Please sign in to drop your review."}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:border-[#1A2E22] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={addReviewMutation.isPending}
            className="bg-[#1A2E22] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {session?.user ? (
              <>
                {addReviewMutation.isPending ? "Submitting..." : "Submit Review"} <Send size={12} />
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
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((rev: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-[#1A2E22]">{rev.user?.name || "Anonymous User"}</p>
                  <span className="text-[10px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
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
          <p className="text-xs text-center text-gray-400 py-6 bg-white rounded-xl border border-dashed border-gray-200">No reviews yet for this product. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}