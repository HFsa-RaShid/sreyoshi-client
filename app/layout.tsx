// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { AppProvider } from "@/context/AppContext";
// import QueryProvider from "@/lib/QueryProvider"; 
// import { SessionProvider } from "next-auth/react"; 
// import { Toaster } from 'react-hot-toast';
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Sreyoshi",
//   description: "Shop.Love.Live",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//     >
//       <body className="bg-[#FAF9F6]">
//         <SessionProvider> 
//           <QueryProvider>
//             <AppProvider>
       
//               {children}
//               <Toaster position="top-center" reverseOrder={false} />
//             </AppProvider>
//           </QueryProvider>
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import QueryProvider from "@/lib/QueryProvider"; 
import { SessionProvider } from "next-auth/react"; 
import { Toaster } from 'react-hot-toast';
import Script from "next/script"; // 👈 ১. Next.js Script ইম্পোর্ট করুন

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sreyoshi",
  description: "Shop.Love.Live",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-[#FAF9F6]">
        {/* 👈 ২. গুগল অটো-অনুবাদ স্ক্রিপ্ট (হাইড করা থাকবে) */}
        <div id="google_translate_element" className="hidden"></div>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,bn',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>

        <SessionProvider> 
          <QueryProvider>
            <AppProvider>
              {children}
              <Toaster position="top-center" reverseOrder={false} />
            </AppProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}