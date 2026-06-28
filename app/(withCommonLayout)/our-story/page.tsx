"use client";

import React from "react";
import { FaHeart, FaLeaf, FaShieldAlt } from "react-icons/fa";

export default function OurStoryPage() {
  return (
    <section className="w-full bg-[#FAF9F6] min-h-screen py-16 px-6 md:px-16 lg:px-24 text-[#1E2E24]">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-normal mb-6">Our Skin Journey</h1>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
          At Sreyoshi, we believe beauty isn't about altering who you are. It's about nurturing your skin with clean, high-performance ingredients that honor your natural glow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
            <FaLeaf className="text-[#8FA887] text-2xl mb-4" />
            <h3 className="font-serif text-lg font-medium mb-2">100% Clean</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Formulated without parabens, sulfates, or artificial toxins. Only pure goodness.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
            <FaHeart className="text-[#8FA887] text-2xl mb-4" />
            <h3 className="font-serif text-lg font-medium mb-2">Cruelty Free</h3>
            <p className="text-xs text-gray-500 leading-relaxed">We love nature and all its creations. None of our products are tested on animals.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
            <FaShieldAlt className="text-[#8FA887] text-2xl mb-4" />
            <h3 className="font-serif text-lg font-medium mb-2">Authentic Results</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Dermatologically tested solutions designed to deliver visible, long-lasting wellness.</p>
          </div>
        </div>
      </div>
    </section>
  );
}