"use client";

import React from "react";
import { ShoppingBag, Heart, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function DashboardHomePage() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "loading") {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <span className="text-xs text-gray-400 font-medium animate-pulse">Loading Overview...</span>
      </div>
    );
  }

  const cards = [
    { name: "My Orders", count: "10 Items", icon: Heart, href: "/dashboard/my-orders", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { name: "Saved Addresses", count: "2 Addresses", icon: MapPin, href: "/dashboard/addresses", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { name: "Recent Orders", count: "45 Orders", icon: ShoppingBag, href: "#", color: "bg-blue-50 text-blue-600 border-blue-100" },
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F1E29]">Welcome Back, {user?.name || "Customer"}! 👋</h2>
          <p className="text-xs text-gray-400 font-medium mt-1">Here is a quick overview summary of your profile analytics metrics.</p>
        </div>
        <Link href="/dashboard/settings" className="px-4 py-2 bg-[#4E612B] hover:bg-[#3D4D22] text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1">
          View Profile <ArrowRight size={14} />
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} href={card.href} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-xs transition-all">
              <div className={`p-3 rounded-xl border ${card.color.split(" ")[0]} ${card.color.split(" ")[2]} ${card.color.split(" ")[1]}`}>
                <Icon size={20} />
              </div>
              <div>
                <h4 className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider">{card.name}</h4>
                <p className="text-lg font-bold text-[#0F1E29] mt-0.5">{card.count}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}