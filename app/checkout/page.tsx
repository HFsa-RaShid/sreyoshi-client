"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, CreditCard, Landmark, ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext"; // আপনার ফাইল পাথ অনুযায়ী ঠিক করে নিবেন

export default function CheckoutPage() {
  const { cart, cartTotal } = useApp(); // আপনার Context থেকে কার্ট ডাটা ও টোটাল প্রাইস আনা হয়েছে
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "SSL">("COD");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const deliveryCharge = 60; // ঢাকার ভিতরে ৬০ টাকা (আপনার সুবিধা অনুযায়ী কন্ডিশনাল করতে পারেন)
  const grandTotal = cartTotal + deliveryCharge;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData = {
      customer: formData,
      items: cart,
      paymentMethod,
      totalAmount: grandTotal,
    };

    if (paymentMethod === "SSL") {
      console.log("Redirecting to SSLCommerz gateway with data:", orderData);
      alert("Redirecting to SSLCommerz Payment Gateway...");
      // এখানে আপনার backend API এন্ডপয়েন্টে রিকোয়েস্ট পাঠাবেন (e.g., /api/ssl-init)
    } else {
      console.log("Processing Cash on Delivery order:", orderData);
      alert("Order Placed Successfully via Cash on Delivery!");
      // এখানে COD অর্ডার কনফার্মেশনের জন্য backend API কল করবেন
    }
  };

  // কার্ট খালি থাকলে ইউজারকে শপ পেজে ফেরত পাঠানোর মেসেজ
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF9F6] px-4">
        <h2 className="font-serif text-2xl text-[#1E2E24] mb-4">Your cart is empty</h2>
        <Link href="/shop" className="bg-[#2C3E30] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1A261D] transition-colors flex items-center gap-2">
          <ArrowLeft size={16} /> Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#FAF9F6] min-h-screen py-12 px-4 md:px-16 lg:px-24">
      <div className="container mx-auto max-w-6xl">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-sans text-gray-400 mb-8">
          <Link href="/cart" className="hover:text-[#1E2E24] transition-colors">Cart</Link>
          <ChevronRight size={12} />
          <span className="text-[#1E2E24] font-medium">Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: SHIPPING & PAYMENT FORM (7 Columns) */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-gray-100/60">
            
            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="font-serif text-xl text-[#1E2E24] mb-4 font-normal">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">Email Address *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="yourname@email.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">Phone Number *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="017XXXXXXXX" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-8">
              <h3 className="font-serif text-xl text-[#1E2E24] mb-4 font-normal">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">First Name *</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">Last Name *</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs font-medium text-gray-600">Full Street Address *</label>
                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="House no, Street name, Area..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">City *</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="e.g. Dhaka" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">Postal Code *</label>
                  <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="1212" />
                </div>
              </div>
            </div>

            {/* Payment Methods (COD & SSLCommerz) */}
            <div className="mb-6">
              <h3 className="font-serif text-xl text-[#1E2E24] mb-4 font-normal">Payment Method</h3>
              <div className="flex flex-col gap-3">
                
                {/* Cash on Delivery Option */}
                <label 
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "COD" ? "border-[#2C3E30] bg-[#FAF9F6]" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={paymentMethod === "COD"} readOnly className="accent-[#2C3E30] h-4 w-4" />
                    <div>
                      <span className="text-sm font-medium text-[#1E2E24] block">Cash on Delivery (COD)</span>
                      <span className="text-xs text-gray-500">Pay with cash upon package delivery.</span>
                    </div>
                  </div>
                  <Truck size={20} className="text-[#2C3E30]" />
                </label>

                {/* SSLCommerz Option */}
                <label 
                  onClick={() => setPaymentMethod("SSL")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "SSL" ? "border-[#2C3E30] bg-[#FAF9F6]" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={paymentMethod === "SSL"} readOnly className="accent-[#2C3E30] h-4 w-4" />
                    <div>
                      <span className="text-sm font-medium text-[#1E2E24] block">Online Payment (SSLCommerz)</span>
                      <span className="text-xs text-gray-500">Pay securely via Cards, Mobile Banking or Net Banking.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <CreditCard size={18} />
                    <Landmark size={18} />
                  </div>
                </label>

              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-[#2C3E30] hover:bg-[#1A261D] text-white font-sans text-sm font-medium py-3.5 rounded-full shadow-sm transition-colors mt-4 active:scale-[0.99]">
              {paymentMethod === "SSL" ? "Proceed to Secure Payment" : "Confirm Order (COD)"}
            </button>

          </form>

          {/* RIGHT SIDE: ORDER SUMMARY (5 Columns) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-gray-100/60 sticky top-6">
            <h3 className="font-serif text-xl text-[#1E2E24] mb-6 font-normal pb-3 border-b border-gray-100">Order Summary</h3>
            
            {/* Product Item List */}
            <div className="flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-1 scrollbar-none mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-1">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#FAF6F0] rounded-xl relative overflow-hidden flex-shrink-0 border border-gray-100">
                      <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 bg-[#2C3E30] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-medium text-[#1E2E24] line-clamp-1">{item.name}</h4>
                      <span className="text-[11px] text-gray-400">{item.subCategory}</span>
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-[#1E2E24]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Calculation Row */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 font-sans text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#1E2E24]">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-medium text-[#1E2E24]">${deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#1E2E24] pt-3 border-t border-dashed border-gray-200 mt-1">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 bg-[#FAF9F6] rounded-xl p-4 flex items-start gap-3 border border-gray-100">
              <ShieldCheck size={20} className="text-[#354536] flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-semibold text-[#1E2E24]">Secure Checkout Guaranteed</h5>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">Your personal data and transaction security are encrypted and fully protected under industry standards.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}