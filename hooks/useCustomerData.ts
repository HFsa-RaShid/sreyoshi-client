import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';

// ১. সব ক্যাটাগরি নিয়ে আসার হুক (ক্যাটাগরি বার বা হোমপেজের জন্য)
export const useGetCategoriesForCustomer = () => {
  return useQuery({
    queryKey: ['customer-categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('/categories');
      console.log(response);
      return response.data?.data; // ব্যাকএন্ড রেসপন্স স্ট্রাকচার অনুযায়ী ডাটা রিটার্ন
    },
  });
};

// ২. সব প্রোডাক্ট নিয়ে আসার হুক
export const useGetProductsForCustomer = () => {
  return useQuery({
    queryKey: ['customer-products'],
    queryFn: async () => {
      const response = await axiosInstance.get('/products');
      return response.data?.data;
    },
    staleTime: 0, // 💡 ডাটা কখনোই পুরোনো ক্যাশ ধরে রাখবে না
    refetchOnMount: 'always', // 💡 এই পেজে আসলেই ব্যাকএন্ড থেকে ফ্রেশ ডাটা টানবে
  });
};

// ৩. সিঙ্গেল প্রোডাক্ট ডিটেইলস দেখার হুক (এখানেও যুক্ত করুন)
export const useGetSingleProductForCustomer = (productCode: string) => {
  return useQuery({
    queryKey: ['customer-product', productCode],
    queryFn: async () => {
      if (!productCode) return null;
      const response = await axiosInstance.get(`/products/${productCode}`);
      return response.data?.data;
    },
    enabled: !!productCode,
    staleTime: 0, 
    refetchOnMount: 'always',
  });
};