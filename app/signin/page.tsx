"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Loader2 } from "lucide-react"; // Mail এর জায়গায় User আইকন ব্যবহার করা হয়েছে মানানসই ডিজাইনের জন্য

export default function SignInPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState(""); // email এর নাম পরিবর্তন করে identity করা হলো (Email/Phone)
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  // 🎯 যদি ইউজার অলরেডি লগইন থাকে, তবে তাকে হোম পেজে রিডাইরেক্ট করে দেওয়া হবে
  useEffect(() => {
    if (status === "authenticated" || session) {
      router.replace("/");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🟢 [Frontend] Initiating Multi-Layer Authentication...");

    try {
      // 🎯 যদি ইনপুটটি ইমেইল হয় তবেই লোয়ারকেস করবে, ফোন নাম্বার হলে শুধু ট্রিম করবে
      const formattedIdentity = identity.includes("@") 
        ? identity.trim().toLowerCase() 
        : identity.trim();

      // 🎯 লেয়ার ১: সরাসরি ব্যাকএন্ড এপিআই হিট করে একদম ফ্রেশ টোকেন ভেরিফাই করা হচ্ছে
      // আপনার ব্যাকএন্ড কন্ট্রোলারে অলরেডি 'identity' হিসেবে হ্যান্ডেল করা আছে, তাই বডিতে identity পাস করা হচ্ছে
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: formattedIdentity, password }),
      });

      if (!res.ok) {
        setError("Incorrect email/phone or password. Please try again.");
        setLoading(false);
        return;
      }

      const responseData = await res.json();
      const actualData = responseData?.data || responseData;
      const token = responseData?.accessToken || responseData?.token || actualData?.accessToken;

      // ব্যাকএন্ড থেকে টোকেন না আসলে রিকোয়েস্ট ব্লক
      if (!token) {
        setError("Authentication failed. Invalid token received from server.");
        setLoading(false);
        return;
      }

      console.log("🎯 [Frontend] Backend Token Verified! Syncing with NextAuth...");

      // 🎯 লেয়ার ২: ব্যাকএন্ডের গ্রিন সিগন্যাল পাওয়ার পর NextAuth সেশন ট্রিগার করা
      // NextAuth-এর 'credentials' প্রোভাইডারেও আমরা ইমেইল বা আইডেন্টিটি হিসেবে এই ফরম্যাটেড ভ্যালু পাঠাবো
      const result = await signIn("credentials", {
        email: formattedIdentity, // NextAuth এর বিল্ট-ইন ফিল্ড নেম সাধারণত email থাকে, তবে এর ভেতরে এখন ফোন নম্বরও সেফলি পাস হবে
        password,
        redirect: false, 
      });

      if (result?.error || !result?.ok) {
        console.error("❌ [Frontend] NextAuth Sync Failed:", result?.error);
        setError("Incorrect email/phone or password.");
        setLoading(false);
      } else {
        console.log("🎉 [Frontend] Session Sync Successful! Redirecting...");
        router.refresh();
        window.location.href = "/"; // সেশন ক্যাশ ক্লিন করে ফ্রেশ এন্ট্রি নিশ্চিত করা
      }
    } catch (err) {
      console.error("💥 [Frontend] Critical Auth Catch Error:", err);
      setError("Failed to connect to the authentication server.");
      setLoading(false);
    }
  };

  // সেশন চেকিং স্টেটমেশিন লোডার
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-400">
        <Loader2 className="animate-spin mr-2" size={16} /> Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-sans pt-24 bg-gray-50/50">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="font-serif text-2xl text-[#1A2E22] text-center mb-6 font-semibold">Welcome Back</h2>
        
        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl mb-4 text-center font-medium border border-rose-100 animate-fade-in">
            {error}
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            {/* 🎯 লেবেল পরিবর্তন করে ইমেইল বা ফোন দেওয়া হয়েছে */}
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email or Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <User size={16} />
              </span>
              {/* 🎯 ইনপুট টাইপ 'text' করা হয়েছে যাতে ০১৭... বা ইমেইল দুটোই ইনপুট নেওয়া যায় */}
              <input
                type="text"
                required
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#2C3E30] text-gray-800 transition-colors"
                placeholder="example@mail.com or 017XXXXXXXX"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#2C3E30] text-gray-800 transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2C3E30] hover:bg-[#1A261D] text-white py-3 rounded-full text-sm font-medium transition-all mt-2 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Verifying...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#8FA887] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}