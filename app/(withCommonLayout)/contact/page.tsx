"use client";

import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <section className="w-full bg-[#FAF9F6] min-h-screen py-16 px-6 md:px-16 lg:px-24 text-[#1E2E24]">
      <div className="container mx-auto max-w-5xl">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-center mb-12">Get in Touch</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Details */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FAF6F0] text-[#2C3E30] rounded-full flex items-center justify-center"><FaPhoneAlt size={14} /></div>
              <div><h4 className="text-xs text-gray-400 uppercase">Call Us</h4><p className="text-sm font-semibold">+880 1712-345678</p></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FAF6F0] text-[#2C3E30] rounded-full flex items-center justify-center"><FaEnvelope size={14} /></div>
              <div><h4 className="text-xs text-gray-400 uppercase">Email Us</h4><p className="text-sm font-semibold">support@sreyoshi.com</p></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FAF6F0] text-[#2C3E30] rounded-full flex items-center justify-center"><FaMapMarkerAlt size={14} /></div>
              <div><h4 className="text-xs text-gray-400 uppercase">Office</h4><p className="text-sm font-semibold">Gulshan-2, Dhaka, Bangladesh</p></div>
            </div>
          </div>

          {/* Form */}
          <form className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Your Name</label>
              <input type="text" className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#2C3E30]" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Email Address</label>
              <input type="email" className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#2C3E30]" />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs text-gray-600">Message</label>
              <textarea rows={4} className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#2C3E30] resize-none" />
            </div>
            <button type="submit" className="md:col-span-2 bg-[#2C3E30] hover:bg-[#1A261D] text-white py-3 rounded-full text-xs font-medium transition-colors mt-2">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
}