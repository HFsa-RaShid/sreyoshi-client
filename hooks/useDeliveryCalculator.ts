/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/delivery-charge`;

export const useDeliveryCalculator = (city: string) => {
  const [deliveryCharge, setDeliveryCharge] = useState<number>(60);
  const [zoneName, setZoneName] = useState<string>("Inside Dhaka");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [allZones, setAllZones] = useState<any[]>([]); 

  // ১. পেজ লোড হতেই সব একটিভ জোন নিয়ে আসার জন্য ইফেক্ট
  useEffect(() => {
    const fetchAllZones = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/all-zones`);
        if (response.data?.success) {
          // শুধু একটিভ জোনগুলো ফিল্টার করে রাখছি ড্রপডাউনের জন্য
          const activeZones = response.data.data.filter((zone: any) => zone.isActive);
          setAllZones(activeZones);
        }
      } catch (error) {
        console.error("Error fetching all zones:", error);
      }
    };
    fetchAllZones();
  }, []);

  // ২. সিটি চেঞ্জ হলে চার্জ ক্যালকুলেট করার ইফেক্ট
  useEffect(() => {
    if (!city) return;

    const fetchCharge = async () => {
      setIsCalculating(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/calculate`, {
          params: { city: city.toLowerCase().trim() },
        });

        if (response.data?.success) {
          setDeliveryCharge(response.data.data.charge);
          setZoneName(response.data.data.zoneName);
        }
      } catch (error) {
        console.error("Error calculating delivery charge:", error);
        setDeliveryCharge(city.toLowerCase().trim() === "dhaka" ? 60 : 120);
      } finally {
        setIsCalculating(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchCharge();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [city]);

  return { deliveryCharge, zoneName, isCalculating, allZones }; // 🎯 allZones রিটার্ন করা হলো
};