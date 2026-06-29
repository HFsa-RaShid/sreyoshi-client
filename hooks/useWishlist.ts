import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';
import { useUserData } from './useUserData'; // 🎯 আপনার ইউজার ডাটা হুকটি ইম্পোর্ট করা হলো

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_BASE_URL = `${BASE_URL}/wishlist`;

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  
  // 🎯 মেইন ট্রিক: আপনার useUserData হুক থেকে লাইভ ব্যাকএন্ড ইউজার অবজেক্ট নেওয়া হচ্ছে
  const { user: backendUser, isLoading: isUserLoading } = useUserData();

  // আপনার auth.ts এবং সেশন চেইন অনুযায়ী টোকেন রিড করা
  const token = (session?.user as any)?.accessToken || (session as any)?.accessToken;
  
  // 🎯 আলটিমেট ফিক্স: সেশনের ভাঙা UUID আইডি একদম বাদ! 
  // সরাসরি ব্যাকএন্ড থেকে আসা নিখুঁত মঙ্গোডিবি ২৪ অক্ষরের `_id` ব্যবহার করা হচ্ছে
  const userId = backendUser?._id || backendUser?.id;

  const getAuthHeaders = () => {
    return { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      } 
    };
  };

  // ১. গেট কুয়েরি (ডাটাবেজ থেকে উইশলিস্ট ডাটা রিড করা)
  const { data, isLoading: isQueryLoading, isError } = useQuery({
    // কুয়েরি কি-তে userId ডিপেন্ডেন্সি দেওয়া হলো যেন ইউজার আইডি পাওয়ার সাথে সাথে ডাটা লোড হয়
    queryKey: ['my-wishlist', token, userId], 
    queryFn: async () => {
      if (!token || !userId) return null;
      try {
        const res = await axios.get(`${API_BASE_URL}/${userId}`, getAuthHeaders());
        return res.data;
      } catch (err: any) {
        const errorStatus = err?.response?.status;
        if (errorStatus === 401 || errorStatus === 403) {
          if (typeof window !== "undefined") {
            window.sessionStorage.clear();
            window.localStorage.clear();
            signOut({ callbackUrl: "/signin" });
          }
        }
        throw err;
      }
    },
    // টোকেন এবং ব্যাকএন্ড থেকে আসা আসল মঙ্গো আইডি দুটোই রেডি থাকলে কুয়েরি ফায়ার হবে
    enabled: status === 'authenticated' && !!token && !!userId, 
    retry: false,
  });

  // ২. টগল মিউটেশন (পণ্য যোগ/বিয়োগ)
  const toggleWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!token || !userId) throw new Error("Unauthorized: Missing User Information");
      const payload = { userId, productId };
      const res = await axios.post(`${API_BASE_URL}/toggle`, payload, getAuthHeaders());
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-wishlist'] });
    },
  });

  // ৩. সিঙ্গেল আইটেম রিমুভ মিউটেশন (কার্টে মুভ করার পর ডিলিট হওয়া)
  const removeSingleItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!token || !userId) throw new Error("Unauthorized: Missing User Information");
      const payload = { userId, productId };
      const res = await axios.patch(`${API_BASE_URL}/remove-item`, payload, getAuthHeaders());
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-wishlist'] });
    },
  });

  const backendWishlistItems = data?.data?.products || data?.products || [];

  return {
    wishlistItems: backendWishlistItems,
    // প্রোফাইল লোডিং বা উইশলিস্ট কুয়েরি লোডিং যেকোনো একটি ট্রু থাকলে লোডিং স্টেট দেখাবে
    isLoading: status === 'loading' || isUserLoading || isQueryLoading,
    isError,
    toggleWishlist: toggleWishlistMutation.mutateAsync,
    isTogglingWishlist: toggleWishlistMutation.isPending,
    removeSingleItem: removeSingleItemMutation.mutateAsync,
    isRemovingItem: removeSingleItemMutation.isPending,
  };
};