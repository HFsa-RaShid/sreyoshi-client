/* eslint-disable @typescript-eslint/no-explicit-any */
// @/hooks/useBrands.ts
import { IBrandDocument } from "@/Types/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// আপনার ব্যাকএন্ড এক্সপ্রেস রাউটার এন্ডপয়েন্ট: /api/brands
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/brands`;

const fetchActiveBrands = async (): Promise<IBrandDocument[]> => {
  const { data } = await axios.get(API_BASE_URL);
  
  // সেফটি চেক: ব্যাকএন্ড যদি সরাসরি অ্যারে [...] না পাঠিয়ে { success: true, data: [...] } পাঠায়
  const rawArray = Array.isArray(data) ? data : data?.data || [];
  
  // শুধু 'Active' ব্র্যান্ডগুলো ফিল্টার করে রিটার্ন করা হচ্ছে
  return rawArray.filter(
    (brand: any) => brand.status?.toLowerCase() === "active"
  );
};

export function useBrands() {
  const { data: brandsData = [], isLoading, error, refetch } = useQuery<IBrandDocument[]>({
    queryKey: ["active-brands"],
    queryFn: fetchActiveBrands,
    staleTime: 10 * 60 * 1000, // ১০ মিনিট ডেটা ক্যাশে থাকবে
  });

  return {
    brandsData,
    isLoading,
    error,
    refetch,
  };
}