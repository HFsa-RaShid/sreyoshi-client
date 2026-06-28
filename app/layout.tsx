import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import QueryProvider from "@/lib/QueryProvider"; 
import { SessionProvider } from "next-auth/react"; 

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
        <SessionProvider> 
          <QueryProvider>
            <AppProvider>
       
              {children}
              
            </AppProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}