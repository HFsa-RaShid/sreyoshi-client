"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselButtonsProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
  showButtons: boolean;
}

export default function CarouselButtons({
  onScrollLeft,
  onScrollRight,
  showButtons,
}: CarouselButtonsProps) {
  // প্রোডাক্ট ৫টা বা তার কম হলে বাটন দুটি স্ক্রিনে রেন্ডারই হবে না
  if (!showButtons) return null;

  return (
    <>
      {/* Left Arrow Button - ১ম কার্ডের বাম পাশে লেগে থাকবে */}
      <button
        onClick={onScrollLeft}
        className="absolute -left-4 top-[35%] -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-black z-30 border border-gray-100 transition-all opacity-0 group-hover/section:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>

      {/* Right Arrow Button - শেষ কার্ডের ডান পাশে লেগে থাকবে */}
      <button
        onClick={onScrollRight}
        className="absolute -right-4 top-[35%] -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-black z-30 border border-gray-100 transition-all opacity-0 group-hover/section:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>
    </>
  );
}