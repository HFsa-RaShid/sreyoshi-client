/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

// 🎯 মেইন ফিক্স: ডাইরেক্ট এক্সপ্রেস ব্যাকএন্ড ইউআরএল পোর্ট (8080) সেট করা হলো
const API_BASE_URL = "https://sreyoshi-server.vercel.app/api/v1";

export const useReviews = (productId?: string) => {
  const queryClient = useQueryClient();

  // ─── ১. নির্দিষ্ট প্রোডাক্টের সব রিভিউ রিড করা ───
  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
    refetch,
  } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      if (!productId) return [];

      // সঠিক ইউআরএল: https://sreyoshi-server.vercel.app/api/v1/reviews/product/YOUR_PRODUCT_ID
      const response = await axios.get(
        `${API_BASE_URL}/reviews/product/${productId}`,
      );

      // ব্যাকএন্ড যদি ডাটা অবজেক্টের ভেতর পাঠায় (যেমন res.data.data)
      if (response.data && response.data.data) {
        return Array.isArray(response.data.data) ? response.data.data : [];
      }
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!productId, // productId থাকলেই কেবল এপিআই হিট করবে
  });

  // ─── ২. নতুন রিভিউ তৈরি করা ───
  // ─── ২. নতুন রিভিউ তৈরি করা (JSON ফরমেটে ফিক্সড) ───
  const { mutateAsync: createReview, isPending: isCreatingReview } =
    useMutation({
      mutationFn: async (reviewData: any) => {
        // ব্যাকএন্ড স্কিমার সাথে মিলিয়ে ক্লিন অবজেক্ট (Payload) তৈরি
        const payload = {
          product: reviewData.productId,
          user: reviewData.userId,
          rating: Number(reviewData.rating),
          comment: reviewData.comment,
          isRecommended: reviewData.isRecommended ?? true,
          title: reviewData.title || "",
        };

        // ১. যদি কোনো ইমেজ ফাইল না থাকে (সাধারণ কমেন্ট) -> ডাইরেক্ট JSON পাঠান
        if (!reviewData.images || reviewData.images.length === 0) {
          const response = await axios.post(
            `${API_BASE_URL}/reviews`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          return response.data;
        }

        // ২. যদি ইমেজ ফাইল থাকে (ফাইল আপলোড লজিক) -> FormData পাঠান
        const formData = new FormData();
        formData.append("product", reviewData.productId);
        formData.append("user", reviewData.userId);
        formData.append("rating", String(reviewData.rating));
        formData.append("comment", reviewData.comment);
        formData.append("isRecommended", String(reviewData.isRecommended));
        if (reviewData.title) formData.append("title", reviewData.title);

        reviewData.images.forEach((file: File) => {
          formData.append("images", file);
        });

        const response = await axios.post(`${API_BASE_URL}/reviews`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        toast.success("Review submitted successfully!");
      },
    });

  // ─── ৩. রিভিউর স্ট্যাটাস আপডেট করা ───
  const { mutateAsync: updateReviewStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: async ({
        id,
        status,
      }: {
        id: string;
        status: "Active" | "Inactive";
      }) => {
        const response = await axios.patch(
          `${API_BASE_URL}/reviews/${id}/status`,
          { status },
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
      },
    });

  // ─── ৪. রিভিউ ডিলিট করা ───
  const { mutateAsync: deleteReview, isPending: isDeletingReview } =
    useMutation({
      mutationFn: async (id: string) => {
        const response = await axios.delete(`${API_BASE_URL}/reviews/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
      },
    });

  return {
    reviews,
    isLoadingReviews,
    refetch,
    createReview,
    isCreatingReview,
    updateReviewStatus,
    isUpdatingStatus,
    deleteReview,
    isDeletingReview,
  };
};
