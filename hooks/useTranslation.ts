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

      // ১. গুগলের কুকিতে নতুন ভাষা ফোরস করা
      const targetLang = nextLang === "bn" ? "/en/bn" : "/en/en";
      document.cookie = `googtrans=${targetLang}; path=/;`;
      document.cookie = `googtrans=${targetLang}; domain=${window.location.hostname}; path=/;`;

      // ২. গুগলের সিলেক্টর এলিমেন্টটি ড্রপডাউনে খুঁজে সাথে সাথে ফায়ার করা
      const googleSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;

      if (googleSelect) {
        googleSelect.value = nextLang;
        
        // Change event ফায়ার করা
        const event = document.createEvent("HTMLEvents");
        event.initEvent("change", true, true);
        googleSelect.dispatchEvent(event);
      } else {
        // যদি সিলেক্টর লোড না হয়ে থাকে, তবে ১ ক্লিকেই পেজ রিফ্রেশ করে কুকি অ্যাপ্লাই করা
        window.location.reload();
      }
    }
  };

  return { lang, toggleLanguage };
}