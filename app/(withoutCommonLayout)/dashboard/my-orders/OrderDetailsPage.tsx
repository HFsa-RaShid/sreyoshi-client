// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React from "react";
// import Image from "next/image";
// import { ArrowLeft, ShoppingCart, CheckCircle2, Package, Truck, Bike, MapPin, Loader2 } from "lucide-react";
// import Link from "next/link";
// import { useGetSingleProductForCustomer } from "@/hooks/useCustomerData"; // 👈 আপনার ৩ নম্বর কাস্টম হুক

// interface OrderDetailsPageProps {
//   orderData: any;
//   onBack: () => void;
//   allProducts: any[]; // 👈 প্যারেন্ট থেকে পাঠানো অল প্রোডাক্টস অ্যারে
// }

// // 💡 মঙ্গোডিবি অবজেক্ট আইডি ক্লিনার হেল্পার
// const getSafeId = (productField: any): string => {
//   if (!productField) return "";
//   if (typeof productField === "string") return productField;
//   if (typeof productField === "object") {
//     if (productField.$oid) return productField.$oid;
//     if (productField._id) {
//       return typeof productField._id === "object" && productField._id.$oid 
//         ? productField._id.$oid 
//         : String(productField._id);
//     }
//   }
//   return String(productField);
// };

// // 💡 স্মার্ট প্রোডাক্ট রো কম্পোনেন্ট (হুক ফ্রেন্ডলি)
// function OrderItemRow({ item, allProducts }: { item: any; allProducts: any[] }) {
//   const productId = getSafeId(item?.product);
  
//   // অল প্রোডাক্টস থেকে আইডি মিলিয়ে productCode বের করা
//   const matchedProduct = allProducts?.find((p: any) => getSafeId(p._id) === productId);
//   const queryKey = matchedProduct?.productCode || productId;

//   // 🎯 আপনার নিজস্ব রিঅ্যাক্ট কোয়েরি হুক দিয়ে লাইভ ডেটা ফেচিং
//   const { data: product, isLoading } = useGetSingleProductForCustomer(queryKey);

//   let imgUrl = "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=160";
//   if (product) {
//     if (product.commonImages?.[0]) {
//       imgUrl = product.commonImages[0];
//     } else if (item?.shadeName && product.shades) {
//       const matchedShade = product.shades.find(
//         (s: any) => s.shadeName?.toLowerCase() === item.shadeName?.toLowerCase()
//       );
//       if (matchedShade?.shadeImage) imgUrl = matchedShade.shadeImage;
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 animate-pulse">
//         <div className="flex items-center gap-4">
//           <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
//             <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
//           </div>
//           <div className="space-y-2">
//             <div className="h-4 w-40 bg-gray-100 rounded"></div>
//             <div className="h-3 w-16 bg-gray-100 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
//       <div className="flex items-center gap-4">
//         <div className="w-16 h-16 relative rounded-xl border border-gray-100 overflow-hidden shrink-0 bg-gray-50 shadow-3xs">
//           <Image 
//             src={imgUrl} 
//             alt="product" 
//             fill 
//             className="object-cover" 
//             unoptimized={true} 
//           />
//         </div>
//         <div>
//           <h4 className="text-[16px] font-bold text-[#1E1E1E] leading-snug">
//             {product?.name || item?.name || "Premium Product"}
//           </h4>
//           <p className="text-[13px] text-gray-400 mt-0.5">
//             {product?.weightOrVolume ? `${product.weightOrVolume} ${product.unit || 'ml'}` : (item?.shadeName ? `Shade: ${item.shadeName}` : "1 unit")}
//           </p>
//           <span className="inline-block mt-1 text-[12px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-[#555555]">
//             ৳{item?.price || 0} × {item?.quantity || 1}
//           </span>
//         </div>
//       </div>
//       <div className="text-right">
//         <p className="text-[16px] font-extrabold text-[#1E1E1E]">৳{(item?.price || 0) * (item?.quantity || 1)}</p>
//         <p className="text-[12px] text-gray-400 mt-0.5 font-medium">Qty: {item?.quantity || 1}</p>
//       </div>
//     </div>
//   );
// }

// export default function OrderDetailsPage({ orderData, onBack, allProducts }: OrderDetailsPageProps) {
//   const currentStatus = orderData?.orderStatus || "Pending";

//   const trackingSteps = [
//     { name: "Order Confirmed", key: "Pending", icon: CheckCircle2, sub: "Order received" },
//     { name: "Packed", key: "Packed", icon: Package, sub: "Ready to ship" },
//     { name: "Shipped", key: "Shipped", icon: Truck, sub: "In transit" },
//     { name: "Out for delivery", key: "Out for delivery", icon: Bike, sub: "Near your area" },
//   ];

//   const getStepIndex = (status: string) => {
//     const orderSequence = ["Pending", "Packed", "Shipped", "Out for delivery"];
//     return orderSequence.indexOf(status);
//   };

//   const currentStepIndex = getStepIndex(currentStatus);

//   const formatDate = (dateObj: any) => {
//     const dateStr = dateObj?.$date || dateObj;
//     if (!dateStr) return "12 Jun 2026, 9:14 AM";
//     return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-[#FAFAFA] min-h-screen font-sans text-[#1E1E1E]">
      
//       {/* TOP CONTENT TITLE BAR */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div>
//           <button onClick={onBack} className="flex items-center gap-1.5 text-[14px] font-bold text-gray-400 hover:text-gray-700 mb-2 cursor-pointer transition-all">
//             <ArrowLeft size={16} /> Back to orders
//           </button>
//           <div className="flex items-center gap-3">
//             <h1 className="text-[28px] font-bold text-[#0A1128] tracking-tight">Order Details</h1>
//             <span className="px-3 py-1 rounded-lg text-[12px] font-bold bg-[#FFF9E6] text-[#D9A700] border-transparent capitalize">
//               • {currentStatus}
//             </span>
//           </div>
//           <p className="text-[13px] text-gray-400 mt-1">Placed on {formatDate(orderData?.createdAt)}</p>
//         </div>
//         <Link href="/shop">
//           <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E612B] text-white text-[14px] font-bold cursor-pointer hover:bg-[#3d4d22] transition-all shadow-sm">
//             <ShoppingCart size={16} /> Reorder All
//           </button>
//         </Link>
//       </div>

//       {/* CORE CONTENT GRID */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
//         {/* LEFT COLUMN: ORDER ITEMS BOX */}
//         <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between shadow-2xs">
//           <div>
//             <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
//               <h2 className="text-[18px] font-bold text-[#0A1128]">Order Items</h2>
//               <span className="text-[13px] text-gray-400 font-medium">{orderData?.orderItems?.length || 0} items</span>
//             </div>
            
//             <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
//               {orderData?.orderItems?.map((item: any, index: number) => (
//                 <OrderItemRow 
//                   key={item?._id?.$oid || getSafeId(item?._id) || index} 
//                   item={item} 
//                   allProducts={allProducts} 
//                 />
//               ))}
//             </div>
//           </div>

//           {/* BOTTOM BILLING DETAILS TABLE */}
//           <div className="border-t border-gray-100 pt-4 mt-6 space-y-3 bg-[#FAFAFA]/50 -mx-5 -mb-5 p-5 rounded-b-2xl">
//             <div className="flex justify-between text-[14px] text-[#555555] font-medium">
//               <span>Subtotal ({orderData?.orderItems?.length || 0} items)</span>
//               <span className="font-bold text-[#1E1E1E]">৳{orderData?.totalPrice - (orderData?.deliveryCharge || 0)}</span>
//             </div>
//             <div className="flex justify-between text-[14px] text-[#555555] font-medium">
//               <span>Delivery Charge</span>
//               <span className="font-bold text-[#1E1E1E]">৳{orderData?.deliveryCharge || 0}</span>
//             </div>
//             <div className="flex justify-between text-[16px] font-extrabold text-[#0A1128] pt-3 border-t border-dashed border-gray-200">
//               <span>Total Paid</span>
//               <span className="text-[20px] text-[#4E612B]">৳{orderData?.totalPrice || "0"}</span>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN: SIDEBAR SUMMARY CARD BLOCKS */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
//             <h2 className="text-[18px] font-bold text-[#0A1128] border-b border-gray-100 pb-3 mb-4">Order Summary</h2>
//             <div className="space-y-4 text-[14px]">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-400 font-medium">Order ID</span>
//                 <span className="font-bold text-[#1E1E1E] uppercase">
//                   #{orderData?.transactionId?.split("-")[1] || getSafeId(orderData?._id).slice(-8).toUpperCase()}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-400 font-medium">Order Date</span>
//                 <span className="font-bold text-[#1E1E1E]">{orderData?.createdAt ? new Date(orderData.createdAt?.$date || orderData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "12 Jun 2026"}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-400 font-medium">Payment Method</span>
//                 <span className="font-bold text-[#1E1E1E]">{orderData?.paymentMethod || "SSLCommerz"}</span>
//               </div>
//               <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-[16px] font-extrabold">
//                 <span className="text-[#0A1128]">Total</span>
//                 <span className="text-[#4E612B] text-[20px]">৳{orderData?.totalPrice || "0"}</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
//             <h2 className="text-[18px] font-bold text-[#0A1128] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//               <span className="p-1.5 bg-[#4E612B]/10 rounded-lg text-[#4E612B]"><MapPin size={16} /></span> Delivery Address
//             </h2>
//             <div className="space-y-2 text-[14px]">
//               <p className="font-bold text-[#1E1E1E] flex items-center gap-1.5"><span className="text-gray-400 text-[16px]">👤</span> {orderData?.shippingAddress?.name || "N/A"}</p>
//               <p className="text-[#555555] font-medium flex items-center gap-1.5"><span className="text-gray-400 text-[16px]">📞</span> {orderData?.shippingAddress?.phone || "N/A"}</p>
//               <p className="text-gray-400 text-[13px] leading-relaxed pt-1 pl-5 border-l-2 border-gray-100">
//                 {orderData?.shippingAddress?.address}, {orderData?.shippingAddress?.city}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* TRACK ORDER TIMELINE */}
//       <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-2xs">
//         <h3 className="text-[18px] font-bold text-[#0A1128] mb-8">Track Order</h3>
//         {currentStatus === "Cancelled" || currentStatus === "Canceled" ? (
//           <div className="text-center py-6 text-rose-600 bg-rose-50/50 rounded-xl border border-rose-100 text-[14px] font-bold">
//             ❌ This order has been canceled.
//           </div>
//         ) : (
//           <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4 w-full px-2">
//             {trackingSteps.map((step, idx) => {
//               const isCompleted = idx <= currentStepIndex;
//               const StepIcon = step.icon;
//               return (
//                 <div key={idx} className="flex md:flex-col items-center flex-1 w-full relative group">
//                   {idx !== trackingSteps.length - 1 && (
//                     <div className="hidden md:block absolute top-6 left-[50%] right-[-50%] h-[3px] bg-gray-100 z-0">
//                       <div className="h-full bg-[#4E612B] transition-all duration-500" style={{ width: idx < currentStepIndex ? "100%" : "0%" }} />
//                     </div>
//                   )}
//                   {idx !== trackingSteps.length - 1 && (
//                     <div className="md:hidden absolute left-6 top-12 bottom-[-24px] w-[3px] bg-gray-100 z-0">
//                       <div className="w-full bg-[#4E612B] transition-all duration-500" style={{ height: idx < currentStepIndex ? "100%" : "0%" }} />
//                     </div>
//                   )}
//                   <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 shrink-0 transition-all ${isCompleted ? "bg-[#4E612B] border-[#4E612B] text-white shadow-md shadow-[#4E612B]/20" : "bg-[#F4F4F4] border-gray-200 text-gray-400"}`}>
//                     <StepIcon size={20} />
//                   </div>
//                   <div className="ml-4 md:ml-0 md:text-center mt-0 md:mt-4 z-10">
//                     <p className={`text-[14px] font-bold ${isCompleted ? "text-[#1E1E1E]" : "text-gray-400"}`}>{step.name}</p>
//                     <p className="text-[12px] text-gray-400 mt-1 font-medium">{isCompleted ? "Completed" : step.sub}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, MapPin, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { useGetSingleProductForCustomer } from "@/hooks/useCustomerData";


interface OrderDetailsPageProps {
  orderData: any;
  onBack: () => void;
  allProducts: any[];
}

const getSafeId = (productField: any): string => {
  if (!productField) return "";
  if (typeof productField === "string") return productField;
  if (typeof productField === "object") {
    if (productField.$oid) return productField.$oid;
    if (productField._id) {
      return typeof productField._id === "object" && productField._id.$oid 
        ? productField._id.$oid 
        : String(productField._id);
    }
  }
  return String(productField);
};

function OrderItemRow({ item, allProducts }: { item: any; allProducts: any[] }) {
  const productId = getSafeId(item?.product);
  const matchedProduct = allProducts?.find((p: any) => getSafeId(p._id) === productId);
  const queryKey = matchedProduct?.productCode || productId;

  const { data: product, isLoading } = useGetSingleProductForCustomer(queryKey);

  let imgUrl = "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=160";
  if (product) {
    if (product.commonImages?.[0]) {
      imgUrl = product.commonImages[0];
    } else if (item?.shadeName && product.shades) {
      const matchedShade = product.shades.find(
        (s: any) => s.shadeName?.toLowerCase() === item.shadeName?.toLowerCase()
      );
      if (matchedShade?.shadeImage) imgUrl = matchedShade.shadeImage;
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-100 rounded"></div>
            <div className="h-3 w-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 relative rounded-xl border border-gray-100 overflow-hidden shrink-0 bg-gray-50 shadow-3xs">
          <Image src={imgUrl} alt="product" fill className="object-cover" unoptimized={true} />
        </div>
        <div>
          <h4 className="text-[16px] font-bold text-[#1E1E1E] leading-snug">
            {product?.name || item?.name || "Premium Product"}
          </h4>
          <p className="text-[13px] text-gray-400 mt-0.5">
            {product?.weightOrVolume ? `${product.weightOrVolume} ${product.unit || 'ml'}` : (item?.shadeName ? `Shade: ${item.shadeName}` : "1 unit")}
          </p>
          <span className="inline-block mt-1 text-[12px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-[#555555]">
            ৳{item?.price || 0} × {item?.quantity || 1}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[16px] font-extrabold text-[#1E1E1E]">৳{(item?.price || 0) * (item?.quantity || 1)}</p>
        <p className="text-[12px] text-gray-400 mt-0.5 font-medium">Qty: {item?.quantity || 1}</p>
      </div>
    </div>
  );
}

export default function OrderDetailsPage({ orderData, onBack, allProducts }: OrderDetailsPageProps) {
  const currentStatus = orderData?.orderStatus || "Pending";
  const orderMongoId = getSafeId(orderData?._id);

  const formatDate = (dateObj: any) => {
    const dateStr = dateObj?.$date || dateObj;
    if (!dateStr) return "12 Jun 2026, 9:14 AM";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-[#FAFAFA] min-h-screen font-sans text-[#1E1E1E]">
      
      {/* TOP CONTENT TITLE BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <button onClick={onBack} className="flex items-center gap-1.5 text-[14px] font-bold text-gray-400 hover:text-gray-700 mb-2 cursor-pointer transition-all">
            <ArrowLeft size={16} /> Back to orders
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold text-[#0A1128] tracking-tight">Order Details</h1>
            <span className={`px-3 py-1 rounded-lg text-[12px] font-bold border-transparent capitalize ${currentStatus === "Cancelled" ? "bg-rose-50 text-rose-600" : "bg-[#FFF9E6] text-[#D9A700]"}`}>
              • {currentStatus}
            </span>
          </div>
          <p className="text-[13px] text-gray-400 mt-1">Placed on {formatDate(orderData?.createdAt)}</p>
        </div>
        <Link href="/shop">
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E612B] text-white text-[14px] font-bold cursor-pointer hover:bg-[#3d4d22] transition-all shadow-sm">
            <ShoppingCart size={16} /> Reorder All
          </button>
        </Link>
      </div>

      {/* CORE CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* LEFT COLUMN: ORDER ITEMS BOX */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h2 className="text-[18px] font-bold text-[#0A1128]">Order Items</h2>
              <span className="text-[13px] text-gray-400 font-medium">{orderData?.orderItems?.length || 0} items</span>
            </div>
            
            <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
              {orderData?.orderItems?.map((item: any, index: number) => (
                <OrderItemRow 
                  key={item?._id?.$oid || getSafeId(item?._id) || index} 
                  item={item} 
                  allProducts={allProducts} 
                />
              ))}
            </div>
          </div>

          {/* BOTTOM BILLING DETAILS TABLE */}
          <div className="border-t border-gray-100 pt-4 mt-6 space-y-3 bg-[#FAFAFA]/50 -mx-5 -mb-5 p-5 rounded-b-2xl">
            <div className="flex justify-between text-[14px] text-[#555555] font-medium">
              <span>Subtotal ({orderData?.orderItems?.length || 0} items)</span>
              <span className="font-bold text-[#1E1E1E]">৳{orderData?.totalPrice - (orderData?.deliveryCharge || 0)}</span>
            </div>
            <div className="flex justify-between text-[14px] text-[#555555] font-medium">
              <span>Delivery Charge</span>
              <span className="font-bold text-[#1E1E1E]">৳{orderData?.deliveryCharge || 0}</span>
            </div>
            <div className="flex justify-between text-[16px] font-extrabold text-[#0A1128] pt-3 border-t border-dashed border-gray-200">
              <span>Total Paid</span>
              <span className="text-[20px] text-[#4E612B]">৳{orderData?.totalPrice || "0"}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR SUMMARY CARD BLOCKS */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
            <h2 className="text-[18px] font-bold text-[#0A1128] border-b border-gray-100 pb-3 mb-4">Order Summary</h2>
            <div className="space-y-4 text-[14px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Order ID</span>
                <span className="font-bold text-[#1E1E1E] uppercase">
                  #{orderData?.transactionId?.split("-")[1] || orderMongoId.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Order Date</span>
                <span className="font-bold text-[#1E1E1E]">{orderData?.createdAt ? new Date(orderData.createdAt?.$date || orderData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "12 Jun 2026"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Payment Method</span>
                <span className="font-bold text-[#1E1E1E]">{orderData?.paymentMethod || "SSLCommerz"}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-[16px] font-extrabold">
                <span className="text-[#0A1128]">Total</span>
                <span className="text-[#4E612B] text-[20px]">৳{orderData?.totalPrice || "0"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
            <h2 className="text-[18px] font-bold text-[#0A1128] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
              <span className="p-1.5 bg-[#4E612B]/10 rounded-lg text-[#4E612B]"><MapPin size={16} /></span> Delivery Address
            </h2>
            <div className="space-y-2 text-[14px]">
              <p className="font-bold text-[#1E1E1E] flex items-center gap-1.5"><span className="text-gray-400 text-[16px]">👤</span> {orderData?.shippingAddress?.name || "N/A"}</p>
              <p className="text-[#555555] font-medium flex items-center gap-1.5"><span className="text-gray-400 text-[16px]">📞</span> {orderData?.shippingAddress?.phone || "N/A"}</p>
              <p className="text-gray-400 text-[13px] leading-relaxed pt-1 pl-5 border-l-2 border-gray-100">
                {orderData?.shippingAddress?.address}, {orderData?.shippingAddress?.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}