"use client";

import React from "react";
import { Star, Gift, Crown } from "lucide-react";

export default function LoyaltyRewards() {
  return (
    <section className="w-full bg-[#FAF9F6] pb-16 px-6 md:px-16 lg:px-24">
      <div className="container mx-auto rounded-2xl overflow-hidden bg-[#F4EFEA] grid grid-cols-1 lg:grid-cols-12 shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
        
        {/* LEFT GREEN BOX */}
        <div className="lg:col-span-4 bg-[#314033] p-8 md:p-10 flex flex-col justify-between items-start text-white">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#A3B8A6] font-semibold">
              Loyalty Program
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-light mt-2 leading-tight max-w-[240px]">
              Good choices deserve rewards.
            </h2>
            <p className="mt-3 text-xs md:text-sm text-[#FAF5F0]/80 font-light leading-relaxed max-w-[260px]">
              Earn points on every order and unlock exclusive perks.
            </p>
          </div>
          
          <button className="mt-8 bg-[#A2B3A4] hover:bg-[#8EA190] text-[#1E2E24] font-sans text-xs md:text-sm font-semibold px-6 py-2.5 rounded-md transition-colors shadow-sm">
            Join Now
          </button>
        </div>

        {/* RIGHT LIGHT REWARDS PERKS AREA */}
        <div className="lg:col-span-8 p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center text-center">
          
          {/* Perk 1 */}
          <div className="flex flex-col items-center max-w-[180px]">
            <div className="w-10 h-10 rounded-full bg-[#728275] flex items-center justify-center text-white mb-3 shadow-sm">
              <Star size={18} strokeWidth={1.8} />
            </div>
            <h4 className="font-serif text-sm font-semibold text-[#1E2E24]">Earn Points</h4>
            <p className="text-[11px] text-[#5E6A60] mt-1 leading-normal font-light">For every dollar spent</p>
          </div>

          {/* Vertical Divider 1 */}
          <div className="hidden md:block h-12 w-px bg-gray-300/60" />

          {/* Perk 2 */}
          <div className="flex flex-col items-center max-w-[180px] -mt-4 md:mt-0">
            <div className="w-10 h-10 rounded-full bg-[#728275] flex items-center justify-center text-white mb-3 shadow-sm">
              <Gift size={18} strokeWidth={1.8} />
            </div>
            <h4 className="font-serif text-sm font-semibold text-[#1E2E24]">Unlock Rewards</h4>
            <p className="text-[11px] text-[#5E6A60] mt-1 leading-normal font-light">Exclusive discounts & gifts</p>
          </div>

          {/* Vertical Divider 2 */}
          <div className="hidden md:block h-12 w-px bg-gray-300/60" />

          {/* Perk 3 */}
          <div className="flex flex-col items-center max-w-[180px] -mt-4 md:mt-0">
            <div className="w-10 h-10 rounded-full bg-[#728275] flex items-center justify-center text-white mb-3 shadow-sm">
              <Crown size={18} strokeWidth={1.8} />
            </div>
            <h4 className="font-serif text-sm font-semibold text-[#1E2E24]">VIP Access</h4>
            <p className="text-[11px] text-[#5E6A60] mt-1 leading-normal font-light">Early access to new drops</p>
          </div>

        </div>

      </div>
    </section>
  );
}