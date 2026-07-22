// src/hooks/useTranslation.ts
"use client";

import { useState } from "react";

export function useTranslation() {
  // useState-এর ভেতরে ফাংশন দিয়ে প্রাথমিক মান লোড করা (Cascading Render হবে না)
  const [lang, setLang] = useState<"en" | "bn">(() => {
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

      // গুগল ট্র্যান্সলেট এলিমেন্টকে ব্যাকগ্রাউন্ডে ট্রিগার করা
      const googleSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (googleSelect) {
        googleSelect.value = nextLang;
        googleSelect.dispatchEvent(new Event("change"));
      }
    }
  };

  return { lang, toggleLanguage };
}