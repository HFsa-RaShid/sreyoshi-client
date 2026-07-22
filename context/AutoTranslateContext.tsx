// src/context/AutoTranslateContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import "@/lib/i18n";
import { useTranslation } from "react-i18next";

interface AutoTranslateContextType {
  lang: "en" | "bn";
  toggleLanguage: () => void;
}

const AutoTranslateContext = createContext<AutoTranslateContextType | undefined>(
  undefined
);

const translationCache: Record<string, string> = {};

export const AutoTranslateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { i18n } = useTranslation();

  // 🎯 ১. Lazy State Initializer: useEffect ছাড়াই সরাসরি প্রাথমিক ভাষা লোড করা
  const [lang, setLang] = useState<"en" | "bn">((): "en" | "bn" => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app_lang") as "en" | "bn";
      return saved || "en";
    }
    return "en";
  });

  // 🎯 ২. প্রাথমিক লোডে i18n সিনক্রোনাইজ করা
  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "bn" : "en";
    setLang(nextLang);
    i18n.changeLanguage(nextLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_lang", nextLang);
    }
  };

  // 🎯 ৩. পুরো ওয়েবসাইটের Text Node অটো অনুবাদ করার লজিক
  useEffect(() => {
    if (lang === "en") return;

    const translateNode = async (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) {
        const text = node.nodeValue.trim();
        if (/^[0-9\s\W]+$/.test(text)) return; // শুধু সংখ্যা বা চিহ্ন হলে স্কিপ

        const cacheKey = `bn_${text}`;
        if (translationCache[cacheKey]) {
          node.nodeValue = translationCache[cacheKey];
          return;
        }

        try {
          const res = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=bn&dt=t&q=${encodeURIComponent(
              text
            )}`
          );
          const data = await res.json();
          const translatedText = data?.[0]?.[0]?.[0] || text;
          translationCache[cacheKey] = translatedText;
          node.nodeValue = translatedText;
        } catch (err) {
          // Error handling
        }
      } else {
        node.childNodes.forEach(translateNode);
      }
    };

    // পুরো পেজ স্ক্যান করা
    translateNode(document.body);

    // ডাইনামিকলি নতুন লোড হওয়া ডাটা স্ক্যান করা
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(translateNode);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [lang]);

  return (
    <AutoTranslateContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </AutoTranslateContext.Provider>
  );
};

export const useAutoTranslate = () => {
  const context = useContext(AutoTranslateContext);
  if (!context) {
    throw new Error("useAutoTranslate must be used within AutoTranslateProvider");
  }
  return context;
};