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

    if (typeof window !== "undefined") {
      // ১. লোকাল স্টোরেজে সেভ করা
      localStorage.setItem("app_lang", nextLang);

      // ২. গুগল ট্র্যান্সলেটের কুকি একদম ক্লিন করে নতুন ভাষা সেট করা
      const googleCookieValue = nextLang === "bn" ? "/en/bn" : "/en/en";

      // পুরোনো কুকি রিমুভ করা
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;

      // নতুন কুকি রাইট করা
      document.cookie = `googtrans=${googleCookieValue}; path=/;`;
      document.cookie = `googtrans=${googleCookieValue}; domain=${window.location.hostname}; path=/;`;

      // ৩. ১ ক্লিকেই সাথে সাথে পেজ রিলোড করে কুকি অ্যাপ্লাই করা
      window.location.reload();
    }
  };

  return { lang, toggleLanguage };
}