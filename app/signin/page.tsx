"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🟢 [Frontend] Form Submitted. Email:", email);

    try {
      // 💡 NextAuth এর signIn মেথড ট্রিগার করা হচ্ছে
      const res = await signIn("credentials", {
        redirect: false, // আমাদের কাস্টম রিডাইরেকশনের জন্য এটিকে false রাখা হয়েছে
        email: email.trim(),
        password: password,
      });

      console.log("🟢 [Frontend] NextAuth Raw Response Object:", res);

      if (res?.error) {
        console.error("❌ [Frontend] NextAuth returned an error:", res.error);
        // NextAuth v5 এ অনেক সময় কাস্টম এরর ডিরেক্টলি আসে না, তাই ইউজার ফ্রেন্ডলি মেসেজ দেওয়া হলো
        if (res.status === 401) {
          setError("Incorrect email or password.");
        } else {
          setError("Authentication failed. Please check backend connections.");
        }
      } else if (res?.ok) {
        console.log("🎉 [Frontend] Login successful! Redirecting to Home...");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("💥 [Frontend] Unexpected error inside catch block:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-sans pt-24">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="font-serif text-2xl text-[#1A2E22] text-center mb-6 font-semibold">Welcome Back</h2>
        
        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#8FA887] text-gray-800"
              placeholder="example@mail.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#8FA887] text-gray-800"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2C3E30] hover:bg-[#1A261D] text-white py-3 rounded-full text-sm font-medium transition-colors mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Signing In..." : "Sign In"}
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