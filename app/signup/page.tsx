"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 💡 আপনার ব্যাকএন্ডের রেজিস্ট্রেশন API-তে সরাসরি হিট করা হচ্ছে
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // রেজিস্ট্রেশন সফল হলে সরাসরি সাইন-ইন পেজে পাঠিয়ে দেওয়া হবে
        router.push("/signin");
      } else {
        setError(data.message || "Registration failed. Try again.");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-sans pt-24">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="font-serif text-2xl text-[#1A2E22] text-center mb-6 font-semibold">Create Account</h2>
        {error && <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#8FA887]"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#8FA887]"
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
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#8FA887]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2C3E30] hover:bg-[#1A261D] text-white py-3 rounded-full text-sm font-medium transition-colors mt-2"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className="text-xs text-gray-500 text-center mt-4">
          Already have an account? <Link href="/signin" className="text-[#8FA887] font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}