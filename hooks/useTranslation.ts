// // src/hooks/useTranslation.ts
// "use client";

// import { useState } from "react";

// export function useTranslation() {
//   const [lang, setLang] = useState<"en" | "bn">((): "en" | "bn" => {
//     if (typeof window !== "undefined") {
//       const savedLang = localStorage.getItem("app_lang") as "en" | "bn";
//       return savedLang || "en";
//     }
//     return "en";
//   });

//   const toggleLanguage = () => {
//     const nextLang = lang === "en" ? "bn" : "en";
//     setLang(nextLang);

//     if (typeof window !== "undefined") {
//       localStorage.setItem("app_lang", nextLang);

//       // ১. কুকি আপডেট (রিলোড ছাড়া ব্যাকগ্রাউন্ড সিংকের জন্য)
//       const googleCookieValue = nextLang === "bn" ? "/en/bn" : "/en/en";
//       document.cookie = `googtrans=${googleCookieValue}; path=/;`;
//       document.cookie = `googtrans=${googleCookieValue}; domain=${window.location.hostname}; path=/;`;

//       // ২. ড্রপডাউন সিলেক্টর খুঁজে রিয়েল-টাইমে ইভেন্ট ট্রিগার করা (স্মুথ চেঞ্জ)
//       const triggerGoogleTranslate = () => {
//         const googleSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        
//         if (googleSelect) {
//           googleSelect.value = nextLang;
//           // Modern Event Trigger
//           googleSelect.dispatchEvent(new Event("change", { bubbles: true }));
//         }
//       };

//       // গুগল ড্রপডাউন রেডি হতে মাঝে মাঝে কয়েক মিলি-সেকেন্ড সময় নেয়, তাই Instant + Micro-delay কম্বো
//       triggerGoogleTranslate();
//       setTimeout(triggerGoogleTranslate, 100);
//     }
//   };

//   return { lang, toggleLanguage };
// }






