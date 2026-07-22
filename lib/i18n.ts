// src/lib/i18n.ts
"use client"; // 👈 এই লাইনটি যোগ না থাকলে সার্ভার সাইড বিল্ড ফেল করবে!

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {},
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  parseMissingKeyHandler: (key) => key,
});

export default i18n;