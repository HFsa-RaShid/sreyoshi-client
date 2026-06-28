"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "Are Sreyoshi products authentic?", a: "Yes, 100%. All cosmetics and skincare products listed on Sreyoshi are sourced directly from global brands and authorized channels." },
    { q: "How long does delivery take?", a: "Inside Dhaka takes 1-2 business days. Outside Dhaka takes 3-5 business days." },
    { q: "Can I return a product if it doesn't suit my skin?", a: "We only accept returns for damaged or incorrect deliveries. We recommend reviewing ingredients listings before purchasing." }
  ];

  return (
    <section className="w-full bg-[#FAF9F6] min-h-screen py-16 px-6 md:px-16 lg:px-24 text-[#1E2E24]">
      <div className="container mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl font-normal text-center mb-10">Frequently Asked Questions</h1>
        
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.005)]">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-5 py-4 text-left flex justify-between items-center font-medium text-xs md:text-sm"
              >
                <span>{faq.q}</span>
                <FaChevronDown size={12} className={`transition-transform text-gray-400 ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-4 text-xs text-gray-500 leading-relaxed border-t border-gray-50/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}