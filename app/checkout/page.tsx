// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation"; // 💡 Next.js রাউটার ইমপোর্ট করা হলো
// import { ChevronRight, ShieldCheck, Truck, CreditCard, Landmark, ArrowLeft, X } from "lucide-react";
// import { useApp } from "@/context/AppContext";

// export default function CheckoutPage() {
//   const router = useRouter(); // 💡 রাউটার ইনিশিয়ালাইজ করা হলো
//   const { cart, clearCart, validateAndSyncCart } = useApp(); 
//   const [paymentMethod, setPaymentMethod] = useState<"COD" | "SSL">("COD");
//   const [isModalOpen, setIsModalOpen] = useState(false); 
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     postalCode: "",
//   });

//   const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const deliveryCharge = 60;
//   const grandTotal = cartTotal + deliveryCharge;

//   // ব্যাকএন্ড ফরম্যাট অনুযায়ী ডেটা প্রস্তুত করার হেল্পার
//   const prepareOrderData = () => {
//     return {
//       orderItems: cart.map(item => ({
//         product: item.id,
//         quantity: item.quantity,
//         price: item.price,
//         shadeName: item.selectedShade ? item.selectedShade.shadeName : "NoShade"
//       })),
//       shippingAddress: {
//         name: `${formData.firstName} ${formData.lastName}`,
//         phone: formData.phone,
//         address: `${formData.address}, Postal Code: ${formData.postalCode}`,
//         city: formData.city,
//         email: formData.email
//       },
//       totalPrice: grandTotal,
//       paymentMethod: paymentMethod === "SSL" ? "SSLCommerz" : "COD",
//     };
//   };

//   // 💡 মেইন সাবমিট হ্যান্ডেলার: পেমেন্ট গেটওয়ে বা মোডালে যাওয়ার আগে স্টক ডাবল চেক করবে
//   const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // ১. রিয়াল-টাইম স্টক ভ্যালিডেশন চেক
//       const response = await fetch("http://localhost:8080/api/v1/products/validate-cart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           items: cart.map(item => ({ id: item.id, shadeName: item.selectedShade?.shadeName }))
//         }),
//       });

//       const result = await response.json();
      
//       if (result.success) {
//         const freshStocks = result.data; // { "productId-shadeName": freshStock }
//         let isStockTampered = false;

//         for (const item of cart) {
//           const currentAvailableStock = freshStocks[item.cartItemId] ?? 0;
//           if (item.quantity > currentAvailableStock) {
//             isStockTampered = true;
//             break;
//           }
//         }

//         // ২. যদি ব্যাকএন্ডে স্টক কমে গিয়ে থাকে, তবে ইউজারকে আটকে কার্ট পেজে রিডাইরেক্ট করবে
//         if (isStockTampered) {
//           alert("🚨 Some products in your cart just went out of stock or have limited quantity. Redirecting to cart for review.");
//           if (validateAndSyncCart) await validateAndSyncCart();
//           router.push("/cart"); // 💡 window.location.href এর বদলে Next.js স্ট্যান্ডার্ড রাউটিং
//           return;
//         }
//       }

//       // ৩. স্টক ঠিক থাকলে অর্ডার মেথড অনুযায়ী এগোনো
//       if (paymentMethod === "COD") {
//         setIsModalOpen(true); 
//       } else {
//         await executeOrderCreation(); 
//       }
//     } catch (error) {
//       alert("Validation failed before placing order. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ব্যাকএন্ড এপিআই কল করার কমন ফাংশন
//   const executeOrderCreation = async () => {
//     setLoading(true);
//     const apiData = prepareOrderData();

//     try {
//       const response = await fetch("http://localhost:8080/api/v1/orders/create-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(apiData),
//       });

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message || "Something went wrong");
//       }

//       if (paymentMethod === "SSL" && result.data.redirectUrl) {
//         window.location.href = result.data.redirectUrl; // গেটওয়ে ইউআরএল এর জন্য সরাসরি উইন্ডো অ্যাসাইনমেন্ট ঠিক আছে
//       } else {
//         alert("Order Placed Successfully via Cash on Delivery!");
//         if (clearCart) clearCart(); 
//         setIsModalOpen(false);
//       }
//     } catch (error: any) {
//       alert(`Error: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ইনভ্যালিড বা খালি কার্ট প্রোটেকশন গার্ড
//   if (!cart || cart.length === 0 || cart.some(item => item.quantity === 0 || item.error)) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF9F6] px-4 pt-24">
//         <h2 className="font-serif text-2xl text-[#1E2E24] mb-2">Invalid Cart Items Detected</h2>
//         <p className="text-sm text-gray-500 mb-6">Some items in your bag are out of stock or exceeded limits.</p>
//         <Link href="/cart" className="bg-[#2C3E30] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1A261D] transition-colors flex items-center gap-2">
//           <ArrowLeft size={16} /> Return to Cart
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <section className="w-full bg-[#FAF9F6] min-h-screen pt-28 pb-12 px-4 md:px-16 lg:px-24">
//       <div className="container mx-auto max-w-6xl">
        
//         {/* BREADCRUMB */}
//         <nav className="flex items-center gap-2 text-xs font-sans text-gray-400 mb-8">
//           <Link href="/cart" className="hover:text-[#1E2E24] transition-colors">Cart</Link>
//           <ChevronRight size={12} />
//           <span className="text-[#1E2E24] font-medium">Checkout</span>
//         </nav>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
//           {/* LEFT SIDE: SHIPPING & PAYMENT FORM */}
//           <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-gray-100/60">
//             {/* Contact Info */}
//             <div className="mb-8">
//               <h3 className="font-serif text-xl text-[#1E2E24] mb-4 font-normal">Contact Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-medium text-gray-600">Email Address *</label>
//                   <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="yourname@email.com" />
//                 </div>
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-medium text-gray-600">Phone Number *</label>
//                   <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="017XXXXXXXX" />
//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address */}
//             <div className="mb-8">
//               <h3 className="font-serif text-xl text-[#1E2E24] mb-4 font-normal">Shipping Address</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-medium text-gray-600">First Name *</label>
//                   <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" />
//                 </div>
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-medium text-gray-600">Last Name *</label>
//                   <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-1.5 mb-4">
//                 <label className="text-xs font-medium text-gray-600">Full Street Address *</label>
//                 <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="House no, Street name, Area..." />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-medium text-gray-600">City *</label>
//                   <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="e.g. Dhaka" />
//                 </div>
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs font-medium text-gray-600">Postal Code *</label>
//                   <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="1212" />
//                 </div>
//               </div>
//             </div>

//             {/* Payment Methods */}
//             <div className="mb-6">
//               <h3 className="font-serif text-xl text-[#1E2E24] mb-4 font-normal">Payment Method</h3>
//               <div className="flex flex-col gap-3">
//                 <div onClick={() => setPaymentMethod("COD")} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "COD" ? "border-[#2C3E30] bg-[#FAF9F6]" : "border-gray-200 hover:border-gray-300"}`}>
//                   <div className="flex items-center gap-3">
//                     <input type="radio" checked={paymentMethod === "COD"} readOnly className="accent-[#2C3E30] h-4 w-4" />
//                     <div>
//                       <span className="text-sm font-medium text-[#1E2E24] block">Cash on Delivery (COD)</span>
//                       <span className="text-xs text-gray-500">Pay with cash upon package delivery.</span>
//                     </div>
//                   </div>
//                   <Truck size={20} className="text-[#2C3E30]" />
//                 </div>

//                 <div onClick={() => setPaymentMethod("SSL")} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "SSL" ? "border-[#2C3E30] bg-[#FAF9F6]" : "border-gray-200 hover:border-gray-300"}`}>
//                   <div className="flex items-center gap-3">
//                     <input type="radio" checked={paymentMethod === "SSL"} readOnly className="accent-[#2C3E30] h-4 w-4" />
//                     <div>
//                       <span className="text-sm font-medium text-[#1E2E24] block">Online Payment (SSLCommerz)</span>
//                       <span className="text-xs text-gray-500">Pay securely via Cards, Mobile Banking or Net Banking.</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-1.5 text-gray-400">
//                     <CreditCard size={18} />
//                     <Landmark size={18} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <button type="submit" disabled={loading} className="w-full bg-[#2C3E30] hover:bg-[#1A261D] text-white font-sans text-sm font-medium py-3.5 rounded-full shadow-sm transition-colors mt-4 disabled:opacity-50">
//               {loading ? "Processing..." : paymentMethod === "SSL" ? "Proceed to Secure Payment" : "Place Order"}
//             </button>
//           </form>

//           {/* RIGHT SIDE: ORDER SUMMARY */}
//           <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-gray-100/60 sticky top-28">
//             <h3 className="font-serif text-xl text-[#1E2E24] mb-6 font-normal pb-3 border-b border-gray-100">Order Summary</h3>
//             <div className="flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-1 mb-6">
//               {cart.map((item) => (
//                 <div key={item.cartItemId} className="flex items-center justify-between gap-4 py-1">
//                   <div className="flex items-center gap-3">
//                     <div className="w-14 h-14 bg-[#FAF6F0] rounded-xl relative overflow-hidden flex-shrink-0 border border-gray-100">
//                       <Image src={item.image} alt={item.name} fill className="object-cover" />
//                       <span className="absolute -top-1 -right-1 bg-[#2C3E30] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
//                         {item.quantity}
//                       </span>
//                     </div>
//                     <div>
//                       <h4 className="text-xs md:text-sm font-medium text-[#1E2E24] line-clamp-1">{item.name}</h4>
//                       <p className="text-[10px] text-gray-400 capitalize">
//                         {item.category} {item.selectedShade ? `• Shade: ${item.selectedShade.shadeName}` : ""}
//                       </p>
//                     </div>
//                   </div>
//                   <span className="text-xs md:text-sm font-medium text-[#1E2E24]">
//                     ৳{(item.price * item.quantity).toFixed(2)}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 font-sans text-sm text-gray-600">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span className="font-medium text-[#1E2E24]">৳{cartTotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Shipping Fee</span>
//                 <span className="font-medium text-[#1E2E24]">৳{deliveryCharge.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-base font-semibold text-[#1E2E24] pt-3 border-t border-dashed border-gray-200 mt-1">
//                 <span>Total</span>
//                 <span>৳{grandTotal.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* COD CONFIRMATION MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
//             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
//               <X size={20} />
//             </button>
//             <h4 className="font-serif text-xl text-[#1E2E24] mb-2">Confirm Your Order</h4>
//             <p className="text-sm text-gray-500 mb-6 leading-relaxed">
//               You are placing an order using <strong className="text-[#2C3E30]">Cash on Delivery (COD)</strong>. You will pay total <strong className="text-[#2C3E30]">৳{grandTotal.toFixed(2)}</strong> when the product is delivered to your address.
//             </p>
//             <div className="flex gap-3 justify-end">
//               <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
//                 Cancel
//               </button>
//               <button onClick={executeOrderCreation} disabled={loading} className="px-6 py-2 rounded-full bg-[#2C3E30] hover:bg-[#1A261D] text-white text-sm font-medium transition-colors">
//                 {loading ? "Confirming..." : "Confirm Order"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }




/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Truck, CreditCard, Landmark, ArrowLeft, X } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, validateAndSyncCart } = useApp(); 
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "SSL">("COD");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [loading, setLoading] = useState(false);
  
  // 🎯 নতুন স্টেট: ডেলিভারি চার্জ এবং জোনের নাম ট্র্যাকিংয়ের জন্য
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [deliveryZoneName, setDeliveryZoneName] = useState<string>("Detecting Zone...");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "", // এই সিটির ভ্যালুর ওপর বেস করে চার্জ লোড হবে
    postalCode: "",
  });

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const grandTotal = cartTotal + deliveryCharge;

  // 🎯 সিটি চেঞ্জ হলে লাইভ ডেলিভারি চার্জ ক্যালকুলেট করার ইফেক্ট
  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      if (!formData.city.trim()) {
        setDeliveryCharge(0);
        setDeliveryZoneName("Please enter city");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/delivery-charge/calculate?city=${encodeURIComponent(formData.city)}`
        );
        const result = await response.json();
        
        if (result.success) {
          setDeliveryCharge(result.data.charge);
          setDeliveryZoneName(result.data.zoneName);
        } else {
          // ফালব্যাক চার্জ যদি কোনো কারণে ব্যাকএন্ড রেসপন্স ফেইল করে
          setDeliveryCharge(120);
          setDeliveryZoneName("Standard Shipping");
        }
      } catch (error) {
        console.error("Failed to sync matrix logistic data stream.");
      }
    };

    // ইউজার টাইপ করা শেষ করার একটি ছোট ডেবাউন্স পিরিয়ড
    const delayDebounceFn = setTimeout(() => {
      fetchDeliveryCharge();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.city]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const prepareOrderData = () => {
    return {
      orderItems: cart.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        shadeName: item.selectedShade ? item.selectedShade.shadeName : "NoShade"
      })),
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        address: `${formData.address}, Postal Code: ${formData.postalCode}`,
        city: formData.city,
        email: formData.email
      },
      deliveryCharge, // 🎯 ডায়নামিক চার্জ ব্যাকএন্ড অর্ডারে পাঠানো হচ্ছে
      totalPrice: grandTotal,
      paymentMethod: paymentMethod === "SSL" ? "SSLCommerz" : "COD",
    };
  };

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city.trim()) {
      alert("Please specify a valid shipping destination city.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/products/validate-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({ id: item.id, shadeName: item.selectedShade?.shadeName }))
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        const freshStocks = result.data;
        let isStockTampered = false;

        for (const item of cart) {
          const currentAvailableStock = freshStocks[item.cartItemId] ?? 0;
          if (item.quantity > currentAvailableStock) {
            isStockTampered = true;
            break;
          }
        }

        if (isStockTampered) {
          alert("🚨 Some products in your cart just went out of stock. Redirecting to cart.");
          if (validateAndSyncCart) await validateAndSyncCart();
          router.push("/cart");
          return;
        }
      }

      if (paymentMethod === "COD") {
        setIsModalOpen(true); 
      } else {
        await executeOrderCreation(); 
      }
    } catch (error) {
      alert("Validation failed before placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const executeOrderCreation = async () => {
    setLoading(true);
    const apiData = prepareOrderData();

    try {
      const response = await fetch("http://localhost:8080/api/v1/orders/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Something went wrong");
      }

      if (paymentMethod === "SSL" && result.data.redirectUrl) {
        window.location.href = result.data.redirectUrl;
      } else {
        alert("Order Placed Successfully via Cash on Delivery!");
        if (clearCart) clearCart(); 
        setIsModalOpen(false);
        router.push("/order-success"); // আপনার সাকসেস পেজের রাউট দিন
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0 || cart.some(item => item.quantity === 0 || item.error)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF9F6] px-4 pt-24">
        <h2 className="font-serif text-2xl text-[#1E2E24] mb-2">Invalid Cart Items Detected</h2>
        <p className="text-sm text-gray-500 mb-6">Some items in your bag are out of stock or exceeded limits.</p>
        <Link href="/cart" className="bg-[#2C3E30] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1A261D] transition-colors flex items-center gap-2">
          <ArrowLeft size={16} /> Return to Cart
        </Link>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#FAF9F6] min-h-screen pt-28 pb-12 px-4 md:px-16 lg:px-24">
      <div className="container mx-auto max-w-6xl">
        
        <nav className="flex items-center gap-2 text-xs font-sans text-gray-400 mb-8">
          <Link href="/cart" className="hover:text-[#1E2E24] transition-colors">Cart</Link>
          <ChevronRight size={12} />
          <span className="text-[#1E2E24] font-medium">Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: SHIPPING FORM */}
          <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-gray-100/60">
            
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
                {/* 🎯 সিটি ইনপুট ফিল্ড: এটি টাইপ করার সাথে সাথে ব্যাকএন্ড ট্রিগার হবে */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">City *</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="e.g. Barishal or Dhaka" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">Postal Code *</label>
                  <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2C3E30] transition-colors" placeholder="1212" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-serif text-xl text-[#1E2E24] mb-4 font-normal">Payment Method</h3>
              <div className="flex flex-col gap-3">
                <div onClick={() => setPaymentMethod("COD")} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "COD" ? "border-[#2C3E30] bg-[#FAF9F6]" : "border-gray-200 hover:border-gray-300"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === "COD"} readOnly className="accent-[#2C3E30] h-4 w-4" />
                    <div>
                      <span className="text-sm font-medium text-[#1E2E24] block">Cash on Delivery (COD)</span>
                      <span className="text-xs text-gray-500">Pay with cash upon package delivery.</span>
                    </div>
                  </div>
                  <Truck size={20} className="text-[#2C3E30]" />
                </div>

                <div onClick={() => setPaymentMethod("SSL")} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "SSL" ? "border-[#2C3E30] bg-[#FAF9F6]" : "border-gray-200 hover:border-gray-300"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === "SSL"} readOnly className="accent-[#2C3E30] h-4 w-4" />
                    <div>
                      <span className="text-sm font-medium text-[#1E2E24] block">Online Payment (SSLCommerz)</span>
                      <span className="text-xs text-gray-500">Pay securely via Cards or Mobile Banking.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <CreditCard size={18} />
                    <Landmark size={18} />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#2C3E30] hover:bg-[#1A261D] text-white font-sans text-sm font-medium py-3.5 rounded-full shadow-sm transition-colors mt-4 disabled:opacity-50">
              {loading ? "Processing..." : paymentMethod === "SSL" ? "Proceed to Secure Payment" : "Place Order"}
            </button>
          </form>

          {/* RIGHT SIDE: ORDER SUMMARY */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-gray-100/60 sticky top-28">
            <h3 className="font-serif text-xl text-[#1E2E24] mb-6 font-normal pb-3 border-b border-gray-100">Order Summary</h3>
            <div className="flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-1 mb-6">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between gap-4 py-1">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#FAF6F0] rounded-xl relative overflow-hidden flex-shrink-0 border border-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 bg-[#2C3E30] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-medium text-[#1E2E24] line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 capitalize">
                        {item.category} {item.selectedShade ? `• Shade: ${item.selectedShade.shadeName}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-[#1E2E24]">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* 🎯 অর্ডার প্রাইস ক্যালকুলেশন জোন */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 font-sans text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#1E2E24]">৳{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span>Shipping Fee</span>
                  <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">({deliveryZoneName})</span>
                </div>
                <span className="font-medium text-[#1E2E24]">৳{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#1E2E24] pt-3 border-t border-dashed border-gray-200 mt-1">
                <span>Total</span>
                <span>৳{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COD CONFIRMATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h4 className="font-serif text-xl text-[#1E2E24] mb-2">Confirm Your Order</h4>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              You are placing an order using <strong className="text-[#2C3E30]">Cash on Delivery (COD)</strong>. You will pay total <strong className="text-[#2C3E30]">৳{grandTotal.toFixed(2)}</strong> when the product is delivered to your address.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={executeOrderCreation} disabled={loading} className="px-6 py-2 rounded-full bg-[#2C3E30] hover:bg-[#1A261D] text-white text-sm font-medium transition-colors">
                {loading ? "Confirming..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}