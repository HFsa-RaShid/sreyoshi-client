// src/lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {}, // 👈 কোনো JSON ফাইল দেওয়া হলো না!
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React-এর জন্য
  },
  // Key না পেলে সরাসরি টেক্সটটিই রিটার্ন করবে
  parseMissingKeyHandler: (key) => key, 
});

export default i18n;