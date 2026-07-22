// src/context/AutoTranslateContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import "@/lib/i18n";
import { useTranslation } from "react-i18next";

interface AutoTranslateContextType {
  lang: "en" | "bn";
  toggleLanguage: () => void;
}

// Custom Text Node Type to hold original text
interface CustomTextNode extends Node {
  originalText?: string;
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

  const [lang, setLang] = useState<"en" | "bn">((): "en" | "bn" => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app_lang") as "en" | "bn";
      return saved || "en";
    }
    return "en";
  });

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

  // 🎯 টগল হ্যান্ডলিং: EN এবং BN উভয়ের জন্য টেক্সট নোড রিম্যাপ করা
  useEffect(() => {
    const processNode = async (node: CustomTextNode) => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) {
        const text = node.nodeValue.trim();
        if (/^[0-9\s\W]+$/.test(text)) return; // শুধু সংখ্যা বা চিহ্ন হলে স্কিপ

        // ১. অরিজিনাল টেক্সট ব্যাকআপে রাখা
        if (!node.originalText) {
          node.originalText = node.nodeValue;
        }

        // ২. যদি ইউজার English চয়েস করে, তবে অরিজিনাল ব্যাকআপ টেক্সট ফিরিয়ে দেবে
        if (lang === "en") {
          if (node.originalText) {
            node.nodeValue = node.originalText;
          }
          return;
        }

        // ৩. যদি Bangla চয়েস করে, তবে অনুবাদ করবে
        const sourceText = node.originalText || text;
        const cacheKey = `bn_${sourceText}`;

        if (translationCache[cacheKey]) {
          node.nodeValue = translationCache[cacheKey];
          return;
        }

        try {
          const res = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=bn&dt=t&q=${encodeURIComponent(
              sourceText
            )}`
          );
          const data = await res.json();
          const translatedText = data?.[0]?.[0]?.[0] || sourceText;
          translationCache[cacheKey] = translatedText;
          node.nodeValue = translatedText;
        } catch (err) {
          // Error handling
        }
      } else {
        node.childNodes.forEach(processNode);
      }
    };

    // পুরো পেজ স্ক্যান করা
    processNode(document.body);

    // ডাইনামিকলি নতুন লোড হওয়া ডাটা স্ক্যান করা
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(processNode);
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