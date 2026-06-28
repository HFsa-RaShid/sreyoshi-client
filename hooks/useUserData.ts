import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_BASE_URL = `${BASE_URL}/users`;

export const useUserData = () => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  // 🎯 ফিক্স ১: আমরা আগের 'auth.ts'-এ 'token.accessToken = user.accessToken' দিয়েছিলাম। 
  // তাই সেশন থেকে সরাসরি 'session.user.accessToken' বা 'session.accessToken' চেক করা হচ্ছে।
  const token = (session as any)?.accessToken || (session?.user as any)?.accessToken || (session as any)?.user?.token;

  // হেডার কনফিগুরেশন
  const getAuthHeaders = () => {
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // প্রোফাইল ডেটা গেট করা
  const { data, isLoading: isQueryLoading, isError } = useQuery({
    queryKey: ['my-profile', token], 
    queryFn: async () => {
      // টোকেন না থাকলে রিকোয়েস্ট করারই দরকার নেই
      if (!token) return null;
      
      try {
        const res = await axios.get(`${API_BASE_URL}/my-profile`, getAuthHeaders());
        console.log("🎯 Backend User Data Response:", res.data); // ডিবাগিং এর জন্য লগ
        return res.data;
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || "";
        const errorStatus = err?.response?.status;

        if (
          errorStatus === 401 || 
          errorStatus === 500 || 
          errorMsg.includes('expired') || 
          errorMsg.includes('token')
        ) {
          console.warn("⚠️ Token expired or invalid! Force clearing session...");
          signOut({ redirect: false });
          if (typeof window !== "undefined") {
            window.sessionStorage.clear();
            window.localStorage.clear();
            window.location.href = "/signin";
          }
        }
        throw err;
      }
    },
    // সেশন পুরোপুরি লোড হওয়া এবং টোকেন খুঁজে পাওয়ার পরেই কেবল রিকোয়েস্ট ট্রিগার হবে
    enabled: status === 'authenticated' && !!token, 
    retry: false,
  });

  // প্রোফাইল ইনফরমেশন ও প্রিফারেন্সেস আপডেট করা
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: FormData | Record<string, any>) => {
      const headers = payload instanceof FormData 
        ? { ...getAuthHeaders().headers, 'Content-Type': 'multipart/form-data' }
        : getAuthHeaders().headers;

      const res = await axios.patch(`${API_BASE_URL}/update-profile`, payload, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });

  // পাসওয়ার্ড চেঞ্জ করা
  const changePasswordMutation = useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      const res = await axios.patch(`${API_BASE_URL}/change-password`, payload, getAuthHeaders());
      return res.data;
    },
  });

  // সেশন টার্মিনেট
  const terminateSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await axios.delete(`${API_BASE_URL}/terminate-session/${sessionId}`, getAuthHeaders());
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });

  // অ্যাকাউন্ট ডিলিট করা
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`${API_BASE_URL}/delete-account`, getAuthHeaders());
      return res.data;
    },
  });

  // 🎯 ফিক্স ২: ব্যাকএন্ড রেসপন্স ম্যাপিং আরও নিখুঁত করা হলো
  // আপনার ব্যাকএন্ড কন্ট্রোলার সাধারণত { success: true, data: user } অথবা সরাসরি { ...user } পাঠায়।
  const backendUser = data?.data || data?.user || (data?.success ? data : null);

  return {
    // 🎯 ফিক্স ৩: যদি ব্যাকএন্ডের ডাটা চলে আসে, তবে শুধু সেটাই দেখাবে। 
    // কোনো অবস্থাতেই লোডিং শেষ হওয়ার পর সেশনের হাফসা ডাটা ফলব্যাক হবে না।
    user: backendUser,
    isLoading: status === 'loading' || isQueryLoading,
    isError,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    terminateSession: terminateSessionMutation.mutateAsync,
    deleteAccount: deleteAccountMutation.mutateAsync,
  };
};