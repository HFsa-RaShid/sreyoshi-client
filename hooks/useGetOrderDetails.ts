/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const useMyOrders = () => {
  const { data: session, status } = useSession();

  const token = 
    (session as any)?.accessToken || 
    (session?.user as any)?.accessToken || 
    (session as any)?.token || 
    (session?.user as any)?.token;

  const { data: ordersData, isLoading, isError, error } = useQuery({
    queryKey: ['my-orders', token],
    queryFn: async () => {
      if (!token) return [];
      try {
        const res = await axios.get(`${BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return res.data?.data || res.data || [];
      } catch (err: any) {
        console.error("Error fetching my orders list:", err);
        return [];
      }
    },
    enabled: status === 'authenticated' && !!token,
    retry: false,
  });

  // এই ফাংশনটি পুরো লিস্ট থেকে নির্দিষ্ট আইডি'র অর্ডারটা খুঁজে বের করে দেবে
  const getOrderDetailsLocal = (orderId: string | null) => {
    if (!orderId || !Array.isArray(ordersData)) return null;
    return ordersData.find((o: any) => o._id === orderId) || null;
  };

  return {
    orders: ordersData,
    getOrderDetailsLocal, // এটিকে আমরা OrderDetailsPage এ পাস করব
    isLoading: status === 'loading' || isLoading,
    isError,
    error
  };
};