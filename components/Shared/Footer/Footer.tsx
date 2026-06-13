"use client";

import React from "react";
import Link from "next/link";
import {  ArrowRight, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1E2E24] text-[#EAE2D8] pt-16 pb-8 px-6 md:px-16 lg:px-24 border-t border-[#2D4A3E] ">
      <div className="container mx-auto">
        
        {/* TOP SECTION: BRAND, LINKS & NEWSLETTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#2D4A3E]">
          
          {/* 1. BRAND COLUMN (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex flex-col select-none">
              <div className="flex items-start gap-0.5 relative">
                <span className="text-[#8FA887] text-lg absolute -top-2">🍃</span>
                <span className="font-serif text-3xl font-semibold text-white tracking-wide mt-1">
                  verdora
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#8FA887] font-medium mt-0.5">
                Shop. Love. Live.
              </span>
            </div>
            <p className="text-sm text-[#A2AFA4] max-w-sm leading-relaxed mt-2">
              High performance beauty with clean, powerful ingredients that truly care for your unique skin journey.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 mt-2">
              {/* <Link href="#" className="p-2 rounded-full bg-[#2D4A3E] text-white hover:bg-[#8FA887] hover:text-[#1E2E24] transition-colors duration-300">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-[#2D4A3E] text-white hover:bg-[#8FA887] hover:text-[#1E2E24] transition-colors duration-300">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-[#2D4A3E] text-white hover:bg-[#8FA887] hover:text-[#1E2E24] transition-colors duration-300">
                <Twitter size={18} />
              </Link> */}
            </div>
          </div>

          {/* 2. QUICK LINKS (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-white font-medium text-base tracking-wide font-serif">Shop</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#A2AFA4]">
              <li><Link href="#" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Special Deals</Link></li>
            </ul>
          </div>

          {/* 3. COMPANY / SUPPORT (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-white font-medium text-base tracking-wide font-serif">Our Story</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#A2AFA4]">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Ingredients Glossary</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQs & Help</Link></li>
            </ul>
          </div>

          {/* 4. NEWSLETTER & CONTACT (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className="text-white font-medium text-base tracking-wide font-serif">Stay Connected</h4>
            <p className="text-sm text-[#A2AFA4]">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            
            {/* Newsletter Input */}
            <div className="relative w-full mt-1">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-[#2D4A3E]/40 border border-[#3A5A4A] rounded-lg py-3 pl-4 pr-12 text-sm text-white placeholder-[#728A79] focus:outline-none focus:border-[#8FA887]"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-[#8FA887] text-[#1E2E24] hover:bg-white transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Micro Contact Info */}
            <div className="flex flex-col gap-2 mt-2 text-xs text-[#728A79]">
              <div className="flex items-center gap-2">
                <Mail size={14} /> <span>hello@verdora.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: COPYRIGHT & LEGAL */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#728A79]">
          <p>© {new Date().getFullYear()} Verdora Beauty. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-[#A2AFA4] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#A2AFA4] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#A2AFA4] transition-colors">Shipping & Returns</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}