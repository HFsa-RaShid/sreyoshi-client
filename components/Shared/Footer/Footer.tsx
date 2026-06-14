"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaPercent,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1E2E24] text-white pt-16 pb-8 px-6 md:px-16 lg:px-24 border-t border-[#2D4A3E] font-sans tracking-wide">
      <div className="container mx-auto">
        {/* TOP SECTION: GRID COLUMNS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 pb-12 border-b border-[#2D4A3E] text-white ">
          {/* 1. BRAND COLUMN (3 Cols) */}
          <div className="col-span-2 lg:col-span-3 flex flex-col gap-5">
            <div className="flex flex-col select-none">
              <div className="flex items-start gap-0.5 relative">
                <span className="text-[#8FA887] text-lg absolute -top-3 left-15">
                  🍃
                </span>
                <span className="font-serif text-3xl font-semibold text-white tracking-wide mt-1">
                  Sreyoshi
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#8FA887] font-medium mt-0.5">
                Shop. Love. Live.
              </span>
            </div>

            <ul className="flex flex-col gap-3 text-xs uppercase font-medium tracking-wider ">
              <li>
                <Link
                  href="/our-story"
                  className="hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/magazine"
                  className="hover:text-white transition-colors"
                >
                  Sreyoshi Magazine
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-white transition-colors"
                >
                  Join Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/authenticity"
                  className="hover:text-white transition-colors"
                >
                  Authenticity
                </Link>
              </li>
            </ul>

            {/* Social Connections */}
            <div className="pt-2">
              <span className="text-xs text-[#8FA887] uppercase font-semibold  tracking-widest block mb-3">
                Share Your Love
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full border border-[#2D4A3E] flex items-center justify-center hover:bg-[#8FA887] hover:text-[#1E2E24] transition-all"
                >
                  <FaFacebookF size={13} />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full border border-[#2D4A3E] flex items-center justify-center hover:bg-[#8FA887] hover:text-[#1E2E24] transition-all"
                >
                  <FaTwitter size={13} />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full border border-[#2D4A3E] flex items-center justify-center hover:bg-[#8FA887] hover:text-[#1E2E24] transition-all"
                >
                  <FaYoutube size={13} />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full border border-[#2D4A3E] flex items-center justify-center hover:bg-[#8FA887] hover:text-[#1E2E24] transition-all"
                >
                  <FaInstagram size={13} />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full border border-[#2D4A3E] flex items-center justify-center hover:bg-[#8FA887] hover:text-[#1E2E24] transition-all"
                >
                  <FaPercent size={11} />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. TOP CATEGORIES (2 Cols) */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-[#8FA887] text-xs uppercase font-bold tracking-widest">
              Top Categories
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs uppercase font-medium">
              <li>
                <Link
                  href="/category/makeup"
                  className="hover:text-white transition-colors"
                >
                  Makeup
                </Link>
              </li>
              <li>
                <Link
                  href="/category/skin"
                  className="hover:text-white transition-colors"
                >
                  Skin
                </Link>
              </li>
              <li>
                <Link
                  href="/category/eye-care"
                  className="hover:text-white transition-colors"
                >
                  Eye Care
                </Link>
              </li>
              <li>
                <Link
                  href="/category/hair"
                  className="hover:text-white transition-colors"
                >
                  Hair
                </Link>
              </li>
              <li>
                <Link
                  href="/category/personal-care"
                  className="hover:text-white transition-colors"
                >
                  Personal Care
                </Link>
              </li>
              <li>
                <Link
                  href="/category/natural"
                  className="hover:text-white transition-colors"
                >
                  Natural
                </Link>
              </li>
              <li>
                <Link
                  href="/category/mom-baby"
                  className="hover:text-white transition-colors"
                >
                  Mom & Baby
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. QUICK LINKS (2 Cols) */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-[#8FA887] text-xs uppercase font-bold tracking-widest">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs uppercase font-medium">
              <li>
                <Link
                  href="/offers"
                  className="hover:text-white transition-colors"
                >
                  Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/category/mens"
                  className="hover:text-white transition-colors"
                >
                  Mens Products
                </Link>
              </li>
              <li>
                <Link
                  href="/concerns"
                  className="hover:text-white transition-colors"
                >
                  Skin Concerns
                </Link>
              </li>
              <li>
                <Link
                  href="/new-arrivals"
                  className="hover:text-white transition-colors"
                >
                  New Arrival
                </Link>
              </li>
              <li>
                <Link
                  href="/category/makeup"
                  className="hover:text-white transition-colors"
                >
                  Makeup
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. ALL ABOUT BEAUTY (2 Cols) */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-[#8FA887] text-xs uppercase font-bold tracking-widest">
              All About Beauty
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs uppercase font-medium">
              <li>
                <Link
                  href="/routine"
                  className="hover:text-white transition-colors"
                >
                  Know Your Routine
                </Link>
              </li>
              <li>
                <Link
                  href="/hair-care-101"
                  className="hover:text-white transition-colors"
                >
                  Hair Care 101
                </Link>
              </li>
              <li>
                <Link
                  href="/skin-care-101"
                  className="hover:text-white transition-colors"
                >
                  Skin Care 101
                </Link>
              </li>
              <li>
                <Link
                  href="/makeup-101"
                  className="hover:text-white transition-colors"
                >
                  Makeup 101
                </Link>
              </li>
            </ul>
          </div>

          {/* 5. HELP & PAYMENTS (3 Cols) */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-[#8FA887] text-xs uppercase font-bold tracking-widest">
              Help
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs uppercase font-medium pb-2">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/points"
                  className="hover:text-white transition-colors"
                >
                  Points
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="hover:text-white transition-colors"
                >
                  Faqs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-delivery"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="hover:text-white transition-colors"
                >
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/trade-license"
                  className="hover:text-white transition-colors"
                >
                  Trade License
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>

            {/* Accepted Payments Grid */}
            <div className="border-t border-[#2D4A3E] pt-4">
              <span className="text-[10px] uppercase font-semibold text-[#728A79] tracking-widest block mb-2.5">
                Payments Accepted
              </span>
              <div className="flex flex-wrap gap-2">
                {/* bKash */}
                <div className="bg-white rounded px-2 py-1 text-[10px] font-bold text-pink-600 flex items-center justify-center h-6 w-11 shadow-sm">
                  bkash
                </div>
                {/* Amex */}
                <div className="bg-blue-600 text-white rounded px-1 text-[8px] font-bold flex flex-col items-center justify-center leading-none h-6 w-11 shadow-sm">
                  <span>AMEX</span>
                </div>
                {/* Mastercard */}
                <div className="bg-[#1A1A1A] rounded px-1 flex items-center justify-center gap-0.5 h-6 w-11 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F00] block"></span>
                  <span className="w-2 h-2 rounded-full bg-[#EB001B] block -ml-1"></span>
                </div>
                {/* Visa */}
                <div className="bg-white rounded px-1 text-[10px] font-bold text-blue-800 italic flex items-center justify-center h-6 w-11 shadow-sm">
                  VISA
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: COMPACT IN-LINE LINKS & COPYRIGHT */}
        <div className="mt-6 pt-6 flex flex-col items-center gap-4 text-[11px] text-[#728A79] tracking-wider">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 uppercase font-medium">
            <Link
              href="/authenticity"
              className="hover:text-white transition-colors"
            >
              Authenticity
            </Link>
            <Link
              href="/terms-conditions"
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/refund-policy"
              className="hover:text-white transition-colors"
            >
              Refund & Return Policy
            </Link>
            <Link href="/faqs" className="hover:text-white transition-colors">
              Faqs
            </Link>
          </div>
          <p className="text-center text-[#728A79] mt-2 font-light">
            Copyright © 2026 Sreyoshi Limited. All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
