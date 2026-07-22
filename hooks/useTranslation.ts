// src/hooks/useTranslation.ts
"use client";

import { useState } from "react";

export function useTranslation() {
  const [lang, setLang] = useState<"en" | "bn">((): "en" | "bn" => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("app_lang") as "en" | "bn";
      return savedLang || "en";
    }
    return "en";
  });

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "bn" : "en";
    setLang(nextLang);

    if (typeof window !== "undefined") {
      localStorage.setItem("app_lang", nextLang);

      // 🎯 গুগলের কুকিতে অটো ল্যাঙ্গুয়েজ সেট করে দেওয়া (যাতে ব্যানার ছাড়া অনুবাদ স্থায়ী হয়)
      document.cookie = `googtrans=/en/${nextLang}; path=/;`;
      document.cookie = `googtrans=/en/${nextLang}; domain=${window.location.hostname}; path=/;`;

      // গুগল ড্রপডাউন ব্যাকগ্রাউন্ডে ট্রিপগার
      const googleSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (googleSelect) {
        googleSelect.value = nextLang;
        googleSelect.dispatchEvent(new Event("change"));
      } else {
        // যদি সিলেক্টর না পাওয়া যায়, পেজ রিফ্রেশ ছাড়াই কুকি দিয়ে রিলোড
        window.location.reload();
      }
    }
  };

  return { lang, toggleLanguage };
}