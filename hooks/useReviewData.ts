import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// 1️⃣ প্রোডাক্টের আইডি দিয়ে সব একটিভ রিভিউ গেট করার হুক
export const useGetProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", "product", productId],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/reviews/product/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      return data.data;
    },
    enabled: !!productId,
  });
};

// 2️⃣ 💡 নতুন যুক্ত করা হুক: নির্দিষ্ট ইউজার আইডি দিয়ে তার সব রিভিউ গেট করা
export const useGetUserReviews = (userId: string) => {
  return useQuery({
    // queryKey-তে userId থাকায় এটি প্রতিটি ইউজারের জন্য ইউনিক ক্যাশ মেইনটেইন করবে
    queryKey: ["reviews", "user", userId], 
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/reviews/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user reviews");
      const data = await res.json();
      return data.data; // ব্যাকএন্ডের { success: true, data: [...] } থেকে ডাটা রিটার্ন করছে
    },
    // শুধুমাত্র তখনই রিকোয়েস্ট ট্রিগার হবে যখন userId এভেইলেবল থাকবে
    enabled: !!userId, 
  });
};

// 3️⃣ নতুন রিভিউ সাবমিট করার হুক
export const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewData: { user: string; product: string; rating: number; comment: string }) => {
      const res = await fetch(`${BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      if (!res.ok) throw new Error("Failed to add review");
      return res.json();
    },
    onSuccess: (_, variables) => {
      // রিভিউ অ্যাড হলে প্রোডাক্ট ক্যাশ এবং ইউজারের নিজস্ব রিভিউ লিস্ট দুইটাই ইনভ্যালিডেট (অটো রি-ফেচ) হবে
      queryClient.invalidateQueries({ queryKey: ["reviews", "product", variables.product] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "user", variables.user] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.product] });
    },
  });
};