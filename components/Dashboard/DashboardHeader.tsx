"use client";

import React from "react";
import { Bell, Search, Menu, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useUserData } from "@/hooks/useUserData"; // 🎯 ১. আপনার কাস্টম হুক ইম্পোর্ট করুন

export default function DashboardHeader() {
  const { data: session, status } = useSession();
  
  // 🎯 ২. রিয়েল-টাইম ডাটা সিঙ্কের জন্য useUserData থেকে ইউজার অবজেক্ট নিন
  const { user: apiUser, isLoading: isUserLoading } = useUserData();

  // 🎯 ৩. ব্যাকএন্ডের ফ্রেশ ডাটা থাকলে সেটা দেখাবে, ব্যাকএন্ড রিকোয়েস্ট পেন্ডিং থাকলে সেশনের ডাটা ফলব্যাক হবে
  const user = apiUser || session?.user;

  // সেশন থেকে রোল বের করা
  const userRole = (user as any)?.role || "user";

  // সামগ্রিক লোডিং স্টেট (NextAuth বা API যেকোনো একটা লোড হলে স্কেলিটন দেখাবে)
  const isGlobalLoading = status === "loading" || (status === "authenticated" && isUserLoading && !apiUser);

  return (
    <header className="container mx-auto p-6 bg-white border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Logo & Responsive Mobile Menu */}
      <div className="flex items-center gap-3">
        <button className="p-2 md:hidden rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
          <Menu size={20} />
        </button>
        <div className="flex items-start gap-0.5 relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#8FA887] text-base md:text-xl md:-top-2.5">
              🍃
            </span>
            <Link
              href="/dashboard"
              className="font-serif text-2xl md:text-3xl font-semibold text-[#1A2E22] tracking-wide mt-1"
            >
              Sreyoshi
            </Link>
          </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 w-full max-w-xs text-xs">
        <Search size={14} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search items, orders..."
          className="bg-transparent outline-none text-gray-700 placeholder:text-gray-400 w-full"
        />
      </div>

      {/* Actions & Profile Frame */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Link 
          href="/dashboard/notifications" 
          className="p-2 bg-gray-50 border border-gray-100 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors relative"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </Link>

        {/* Profile Info Handler */}
        <div className="flex items-center gap-2.5 border-l border-gray-100 pl-4 min-h-[32px]">
          {isGlobalLoading ? (
            // সেশন বা এপিআই লোড হওয়ার সময় মসৃণ স্কেলিটন লোডার
            <div className="flex items-center gap-2 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Loader2 size={12} className="animate-spin text-gray-400" />
              </div>
              <div className="hidden md:block space-y-1">
                <div className="h-3 w-16 bg-gray-100 rounded"></div>
                <div className="h-2.5 w-10 bg-gray-50 rounded"></div>
              </div>
            </div>
          ) : (
            // ডাটা সফলভাবে সিঙ্ক হলে ফ্রেশ রিয়েল-টাইম ডাটা রেন্ডার হবে
            <>
              <div className="w-8 h-8 rounded-full bg-[#4E612B] text-white font-bold text-xs flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                {(user as any)?.profileImage || user?.image ? (
                  <img 
                    src={(user as any)?.profileImage || user?.image || ""} 
                    alt={user?.name || "User Avatar"} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  user?.name?.slice(0, 2).toUpperCase() || "US"
                )}
              </div>
              
              <div className="hidden md:block text-left">
                <h4 className="text-xs font-bold text-[#0F1E29] leading-none">
                  {user?.name}
                </h4>
                <span className="text-[10px] text-gray-400 font-semibold capitalize mt-1 block">
                  {userRole}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}