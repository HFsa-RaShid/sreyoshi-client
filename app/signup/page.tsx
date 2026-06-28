"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { User, Mail, Lock, Phone, Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // অলরেডি লগইন থাকলে হোম পেজে পাঠিয়ে দাও
  useEffect(() => {
    if (status === "authenticated" || session) {
      router.replace("/");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🎯 ফ্রন্টএন্ড পাসওয়ার্ড ম্যাচ চেকিং
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match!");
      return;
    }

    setLoading(true);

    try {
      const sanitizedEmail = email.trim().toLowerCase();

      // 🎯 ব্যাকএন্ডের রেজিস্ট্রেশন API-তে রিকোয়েস্ট (আপনার ব্যাকএন্ড রিকোয়ারমেন্ট অনুযায়ী)
      const res = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: sanitizedEmail, 
          phone: phone.trim(),
          password, 
          confirmPassword,
          role: "user" // ডিফল্ট রোল ইউজার সেট করা হলো
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log("🎉 Registration successful!");
        router.push("/signin");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("💥 Registration Client Error:", err);
      setError("Failed to connect to the registration server.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-400">
        <Loader2 className="animate-spin mr-2" size={16} /> Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-sans pt-24 bg-gray-50/50 pb-12">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="font-serif text-2xl text-[#1A2E22] text-center mb-6 font-semibold">Create Account</h2>
        
        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl mb-4 text-center font-medium border border-rose-100">
            {error}
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#2C3E30] text-gray-800 transition-colors"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#2C3E30] text-gray-800 transition-colors"
                placeholder="example@mail.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Phone Number - ব্যাকএন্ডে রিকোয়ার্ড */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Phone size={16} />
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#2C3E30] text-gray-800 transition-colors"
                placeholder="017XXXXXXXX"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
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

          {/* Confirm Password - ব্যাকএন্ডে ম্যাচিং আবশ্যিক */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <Loader2 size={16} className="animate-spin" /> Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#8FA887] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}