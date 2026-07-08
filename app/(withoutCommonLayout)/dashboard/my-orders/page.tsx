// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { Loader2, Eye, Truck, ShoppingCart } from "lucide-react";

// import { useUserData } from "@/hooks/useUserData";
// import { useMyOrders } from "@/hooks/useGetOrderDetails";
// import {
//   useGetProductsForCustomer,
//   useGetSingleProductForCustomer,
// } from "@/hooks/useCustomerData";
// import OrderDetailsPage from "./OrderDetailsPage";

// type OrderFilter =
//   | "All"
//   | "Pending"
//   | "Packed"
//   | "Shipped"
//   | "Delivered"
//   | "Cancelled";

// // মঙ্গোডিবি অবজেক্ট আইডি ক্লিনার
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

// // 💡 ১. স্মার্ট ইমেজ কম্পোনেন্ট (মোবাইল ফ্রেন্ডলি সাইজ)
// function IndividualProductImage({
//   itemField,
//   allProducts,
// }: {
//   itemField: any;
//   allProducts: any[];
// }) {
//   const safeId = getSafeId(itemField?.product);

//   const matchedProduct = allProducts?.find(
//     (p: any) => getSafeId(p._id) === safeId,
//   );
//   const queryKey = matchedProduct?.productCode || safeId;

//   const { data: product, isLoading } = useGetSingleProductForCustomer(queryKey);

//   let imgUrl =
//     "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=80";
//   if (product) {
//     if (product.commonImages?.[0]) {
//       imgUrl = product.commonImages[0];
//     } else if (itemField?.shadeName && product.shades) {
//       const matchedShade = product.shades.find(
//         (s: any) =>
//           s.shadeName?.toLowerCase() === itemField.shadeName?.toLowerCase(),
//       );
//       if (matchedShade?.shadeImage) imgUrl = matchedShade.shadeImage;
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-100 animate-pulse shrink-0" />
//     );
//   }

//   return (
//     <div className="w-12 h-12 md:w-14 md:h-14 relative rounded-xl border border-gray-100 bg-gray-50 overflow-hidden shadow-2xs shrink-0">
//       <Image
//         src={imgUrl}
//         alt="product"
//         fill
//         className="object-cover"
//         unoptimized={true}
//       />
//     </div>
//   );
// }

// // 💡 ২. স্মার্ট টাইটেল কম্পোনেন্ট
// function OrderItemTitle({
//   orderItems,
//   allProducts,
// }: {
//   orderItems: any[];
//   allProducts: any[];
// }) {
//   const firstItem = orderItems[0];
//   const safeId = getSafeId(firstItem?.product);

//   const matchedProduct = allProducts?.find(
//     (p: any) => getSafeId(p._id) === safeId,
//   );
//   const queryKey = matchedProduct?.productCode || safeId;

//   const { data: product, isLoading } = useGetSingleProductForCustomer(queryKey);

//   if (isLoading) {
//     return <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />;
//   }

//   const title =
//     product?.name ||
//     firstItem?.name ||
//     `Product (${firstItem?.shadeName || "Premium Item"})`;
//   const displayTitle =
//     orderItems.length > 1
//       ? `${title} and ${orderItems.length - 1} more`
//       : title;

//   return (
//     <p className="text-[14px] md:text-[16px] font-bold text-[#1E1E1E] truncate">
//       {displayTitle}
//     </p>
//   );
// }

// export default function MyOrdersPage() {
//   const [activeFilter, setActiveFilter] = useState<OrderFilter>("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
//   const itemsPerPage = 5;

//   // 💡 টিপস: সেশন ল্যাগ কাটাতে হুক থেকে refetch ডেসট্রাকচার করা হলো
//   const { user: backendUser, isLoading: isUserLoading, refetch: refetchUser } = useUserData() as any;
//   const { orders: rawOrders = [], isLoading: isOrdersLoading, refetch: refetchOrders } = useMyOrders() as any;
//   const { data: allProducts = [], isLoading: isProductsLoading } = useGetProductsForCustomer();

//   const userId = getSafeId(backendUser?._id || backendUser?.id);
//   const isLoading = isUserLoading || isOrdersLoading || isProductsLoading;

//   // ─── 🎯 [CRITICAL FIX: AUTO-SYNC WITHOUT REFRESH] ───
//   // পেজ লোড হওয়ার সাথে সাথে যখনই userId স্টেট পাবে, ইনস্ট্যান্ট ব্যাকএন্ড ডাটা পুশ করবে
//   useEffect(() => {
//     if (userId) {
//       if (typeof refetchUser === "function") refetchUser();
//       if (typeof refetchOrders === "function") refetchOrders();
//     }
//   }, [userId, refetchUser, refetchOrders]);

//   const filterOptions: OrderFilter[] = [
//     "All",
//     "Pending",
//     "Packed",
//     "Shipped",
//     "Delivered",
//     "Cancelled",
//   ];

//   const getStatusBadgeStyle = (status: string) => {
//     switch (status) {
//       case "Pending":
//       case "Packed":
//         return "bg-[#FFF9E6] text-[#D9A700]";
//       case "Shipped":
//       case "Out for delivery":
//         return "bg-[#EBF3FF] text-[#0066FF]";
//       case "Delivered":
//         return "bg-[#EBF5EE] text-[#2D4A3E]";
//       case "Cancelled":
//       case "Canceled":
//         return "bg-[#FCE8E6] text-[#D93025]";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   if (activeOrderId) {
//     const selectedOrder = rawOrders.find(
//       (o: any) => getSafeId(o._id) === activeOrderId,
//     );
//     return (
//       <OrderDetailsPage
//         orderData={selectedOrder}
//         onBack={() => setActiveOrderId(null)}
//         allProducts={allProducts}
//       />
//     );
//   }

//   // ─── 🎯 লোডার স্ক্রিন: চেক চলাকালীন সময়ে রিফ্রেশ লক বাঁচাবে ───
//   if (isLoading) {
//     return (
//       <div className="min-h-[350px] md:min-h-[450px] flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 p-4">
//         <Loader2 className="w-7 h-7 animate-spin text-[#4E612B]" />
//         <p className="text-[12px] md:text-[13px] text-gray-400">
//           Loading your secure orders...
//         </p>
//       </div>
//     );
//   }

//   // 🚫 [REMOVE CRASH CONDITION] - "if (!userId)" ব্লকটি পুরোপুরি বাদ দেওয়া হয়েছে, কারণ আপনি অলরেডি লগইনড!

//   // সব অর্ডার থেকে শুধুমাত্র কারেন্ট লগইন করা ইউজারের অর্ডারগুলো ফিল্টার করা হলো
//   const myFilteredOnlyOrders = rawOrders.filter((order: any) => {
//     const orderUserId = getSafeId(order.user);
//     return orderUserId === userId;
//   });

//   // ফিল্টার করা অর্ডারের ওপর বেস করে ডেট সর্টিং হচ্ছে
//   const sortedOrders = [...myFilteredOnlyOrders].sort((a: any, b: any) => {
//     const dateA = new Date(a.createdAt?.$date || a.createdAt).getTime();
//     const dateB = new Date(b.createdAt?.$date || b.createdAt).getTime();
//     return dateB - dateA;
//   });

//   const filteredOrders = sortedOrders.filter((order: any) => {
//     if (activeFilter === "All") return true;
//     const status = (order.orderStatus || "Pending").toLowerCase();
//     if (activeFilter === "Cancelled")
//       return status === "cancelled" || status === "canceled";
//     if (activeFilter === "Pending")
//       return status === "pending" || status === "packed";
//     if (activeFilter === "Shipped")
//       return status === "shipped" || status === "out for delivery";
//     return status === activeFilter.toLowerCase();
//   });

//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const currentOrders = filteredOrders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   return (
//     <div className="w-full bg-[#FAFAFA] min-h-screen p-3 md:p-6 text-[#1E1E1E] font-sans">
//       <div className="max-w-5xl mx-auto">
//         {/* FILTER HEADER */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="font-sans font-bold text-[22px] md:text-[28px] text-[#0A1128] tracking-tight">
//               My Orders
//             </h1>
//             <p className="text-[12px] md:text-[14px] text-gray-400 mt-0.5">
//               {filteredOrders.length} total orders
//             </p>
//           </div>

//           {/* ফিল্টার বাটন গ্ৰুপ */}
//           <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-3 px-3 lg:mx-0 lg:px-0 scrollbar-none snap-x">
//             {filterOptions.map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => {
//                   setActiveFilter(filter);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-4 py-1.5 md:px-5 md:py-2 rounded-xl text-[13px] md:text-[14px] font-medium border cursor-pointer whitespace-nowrap transition-all snap-contained ${
//                   activeFilter === filter
//                     ? "bg-[#4E612B] text-white border-[#4E612B]"
//                     : "bg-white text-[#555555] border-gray-200 hover:bg-gray-50"
//                 }`}
//               >
//                 {filter}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* LIST */}
//         <div className="space-y-4">
//           {currentOrders.length === 0 ? (
//             <div className="text-center py-12 md:py-16 text-[13px] md:text-[14px] text-gray-400 border border-gray-100 rounded-2xl bg-white shadow-xs">
//               No orders found matching this status.
//             </div>
//           ) : (
//             currentOrders.map((order: any, idx: number) => {
//               const items = order.orderItems || [];
//               const rawDate = order.createdAt?.$date || order.createdAt;
//               const orderDate = rawDate
//                 ? new Date(rawDate).toLocaleDateString("en-GB", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                   })
//                 : "12 Jun 2026";
//               const currentStatus = order.orderStatus || "Packed";
//               const orderStringId = getSafeId(order._id);

//               return (
//                 <div
//                   key={orderStringId || idx}
//                   className="p-4 md:p-5 border border-gray-100 bg-white rounded-2xl flex flex-col gap-4 shadow-2xs"
//                 >
//                   {/* CARD HEADER */}
//                   <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-3">
//                     <div className="grid grid-cols-2 gap-y-3 gap-x-6 sm:flex sm:items-center sm:gap-10 md:gap-14 text-[12px] md:text-[13px]">
//                       <div>
//                         <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
//                           Order ID
//                         </p>
//                         <p className="font-bold text-[#1E1E1E] mt-0.5">
//                           #
//                           {order.transactionId?.split("-")[1] ||
//                             orderStringId.slice(-8).toUpperCase()}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
//                           Placed On
//                         </p>
//                         <p className="font-medium text-[#555555] mt-0.5">
//                           {orderDate}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
//                           Payment
//                         </p>
//                         <p className="font-medium text-[#555555] mt-0.5">
//                           {order.paymentMethod || "COD"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="self-start sm:self-auto">
//                       <span
//                         className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] md:text-[12px] font-bold border border-transparent capitalize ${getStatusBadgeStyle(currentStatus)}`}
//                       >
//                         • {currentStatus}
//                       </span>
//                     </div>
//                   </div>

//                   {/* CARD BODY */}
//                   <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
//                     <div className="flex items-start sm:items-center gap-3 md:gap-4 flex-1 min-w-0">
//                       {/* প্রোডাক্ট ইমেজ গ্ৰুপ */}
//                       <div className="flex items-center gap-1.5 shrink-0">
//                         {items.slice(0, 2).map((item: any, i: number) => (
//                           <IndividualProductImage
//                             key={i}
//                             itemField={item}
//                             allProducts={allProducts}
//                           />
//                         ))}
//                         {items.length > 2 && (
//                           <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-gray-100 bg-[#F4F4F4] flex items-center justify-center shrink-0">
//                             <p className="text-[12px] md:text-[13px] font-bold text-[#555555]">
//                               +{items.length - 2}
//                             </p>
//                           </div>
//                         )}
//                       </div>

//                       {/* টাইটেল ও শিপিং অ্যাড্রেস */}
//                       <div className="space-y-1 min-w-0 flex-1 pt-0.5 sm:pt-0">
//                         <OrderItemTitle
//                           orderItems={items}
//                           allProducts={allProducts}
//                         />
//                         <p className="text-[12px] md:text-[13px] text-gray-400 truncate flex items-center gap-1">
//                           <span className="shrink-0">📍</span>
//                           <span className="truncate">
//                             {order.shippingAddress?.address ||
//                               "Dhaka, Bangladesh"}
//                           </span>
//                         </p>
//                       </div>
//                     </div>

//                     {/* ACTIONS & AMOUNT */}
//                     <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-50 mt-1 md:mt-0">
//                       <div className="md:text-right">
//                         <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider hidden sm:block">
//                           Total Amount
//                         </p>
//                         <p className="text-[16px] md:text-[18px] font-extrabold text-[#1E1E1E]">
//                           ৳{order.totalPrice || "0"}
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => setActiveOrderId(orderStringId)}
//                           className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-gray-200 text-[12px] md:text-[13px] font-bold text-[#555555] hover:bg-gray-50 cursor-pointer shadow-2xs bg-white"
//                         >
//                           <Eye size={14} />{" "}
//                           <span className="hidden xs:inline">Details</span>
//                         </button>
//                         {[
//                           "Pending",
//                           "Packed",
//                           "Shipped",
//                           "Out for delivery",
//                         ].includes(currentStatus) ? (
//                           <button
//                             onClick={() => setActiveOrderId(orderStringId)}
//                             className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-[#4E612B] text-[12px] md:text-[13px] font-bold text-white hover:bg-[#3d4d22] cursor-pointer shadow-sm"
//                           >
//                             <Truck size={14} /> Track
//                           </button>
//                         ) : (
//                           <button className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-gray-200 text-[12px] md:text-[13px] font-bold text-[#4E612B] hover:bg-gray-50 cursor-pointer shadow-2xs bg-white">
//                             <ShoppingCart size={13} />{" "}
//                             <span className="hidden xs:inline">Again</span>
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* PAGINATION */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between mt-6 pt-2">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-gray-200 text-[12px] md:text-[13px] font-bold text-gray-500 disabled:opacity-40 bg-white cursor-pointer shadow-2xs"
//             >
//               ← Prev
//             </button>
//             <div className="flex items-center gap-1">
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i + 1}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`w-8 h-8 md:w-9 md:h-9 rounded-xl text-[12px] md:text-[13px] font-extrabold transition-all cursor-pointer ${currentPage === i + 1 ? "bg-[#4E612B] text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 shadow-2xs"}`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-gray-200 text-[12px] md:text-[13px] font-bold text-gray-500 disabled:opacity-40 bg-white cursor-pointer shadow-2xs"
//             >
//               Next →
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Eye, Truck, ShoppingCart } from "lucide-react";

import { useUserData } from "@/hooks/useUserData";
import { useMyOrders } from "@/hooks/useGetOrderDetails";
import {
  useGetProductsForCustomer,
  useGetSingleProductForCustomer,
} from "@/hooks/useCustomerData";
import OrderDetailsPage from "./OrderDetailsPage";

type OrderFilter =
  | "All"
  | "Pending"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

// মঙ্গোডিবি অবজেক্ট আইডি ক্লিনার
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

// 💡 ১. স্মার্ট ইমেজ কম্পোনেন্ট (মোবাইল ফ্রেন্ডলি সাইজ)
function IndividualProductImage({
  itemField,
  allProducts,
}: {
  itemField: any;
  allProducts: any[];
}) {
  const safeId = getSafeId(itemField?.product);

  const matchedProduct = allProducts?.find(
    (p: any) => getSafeId(p._id) === safeId,
  );
  const queryKey = matchedProduct?.productCode || safeId;

  const { data: product, isLoading } = useGetSingleProductForCustomer(queryKey);

  let imgUrl =
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=80";
  if (product) {
    if (product.commonImages?.[0]) {
      imgUrl = product.commonImages[0];
    } else if (itemField?.shadeName && product.shades) {
      const matchedShade = product.shades.find(
        (s: any) =>
          s.shadeName?.toLowerCase() === itemField.shadeName?.toLowerCase(),
      );
      if (matchedShade?.shadeImage) imgUrl = matchedShade.shadeImage;
    }
  }

  if (isLoading) {
    return (
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-100 animate-pulse shrink-0" />
    );
  }

  return (
    <div className="w-12 h-12 md:w-14 md:h-14 relative rounded-xl border border-gray-100 bg-gray-50 overflow-hidden shadow-2xs shrink-0">
      <Image
        src={imgUrl}
        alt="product"
        fill
        className="object-cover"
        unoptimized={true}
      />
    </div>
  );
}

// 💡 ২. স্মার্ট টাইটেল কম্পোনেন্ট
function OrderItemTitle({
  orderItems,
  allProducts,
}: {
  orderItems: any[];
  allProducts: any[];
}) {
  const firstItem = orderItems[0];
  const safeId = getSafeId(firstItem?.product);

  const matchedProduct = allProducts?.find(
    (p: any) => getSafeId(p._id) === safeId,
  );
  const queryKey = matchedProduct?.productCode || safeId;

  const { data: product, isLoading } = useGetSingleProductForCustomer(queryKey);

  if (isLoading) {
    return <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />;
  }

  const title =
    product?.name ||
    firstItem?.name ||
    `Product (${firstItem?.shadeName || "Premium Item"})`;
  const displayTitle =
    orderItems.length > 1
      ? `${title} and ${orderItems.length - 1} more`
      : title;

  return (
    <p className="text-[14px] md:text-[16px] font-bold text-[#1E1E1E] truncate">
      {displayTitle}
    </p>
  );
}

export default function MyOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const { user: backendUser, isLoading: isUserLoading, refetch: refetchUser } = useUserData() as any;
  const { orders: rawOrders = [], isLoading: isOrdersLoading, refetch: refetchOrders } = useMyOrders() as any;
  const { data: allProducts = [], isLoading: isProductsLoading } = useGetProductsForCustomer();

  const userId = getSafeId(backendUser?._id || backendUser?.id);

  // ─── 🎯 [CRITICAL RECONCILE FIX]: সেশন টোকেন ও ফার্স্ট ডেটা রেডি না হওয়া পর্যন্ত লোডিং ধরে রাখবে ───
  const isPageLoading = isUserLoading || isOrdersLoading || isProductsLoading || !userId || rawOrders.length === 0;

  // ─── 🎯 [AUTO-SYNC WITHOUT REFRESH] ───
  useEffect(() => {
    if (userId) {
      if (typeof refetchUser === "function") refetchUser();
      if (typeof refetchOrders === "function") refetchOrders();
    }
  }, [userId, refetchUser, refetchOrders]);

  const filterOptions: OrderFilter[] = [
    "All",
    "Pending",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Pending":
      case "Packed":
        return "bg-[#FFF9E6] text-[#D9A700]";
      case "Shipped":
      case "Out for delivery":
        return "bg-[#EBF3FF] text-[#0066FF]";
      case "Delivered":
        return "bg-[#EBF5EE] text-[#2D4A3E]";
      case "Cancelled":
      case "Canceled":
        return "bg-[#FCE8E6] text-[#D93025]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (activeOrderId) {
    const selectedOrder = rawOrders.find(
      (o: any) => getSafeId(o._id) === activeOrderId,
    );
    return (
      <OrderDetailsPage
        orderData={selectedOrder}
        onBack={() => setActiveOrderId(null)}
        allProducts={allProducts}
      />
    );
  }

  // ─── 🎯 স্কেলিটন লোডার স্ক্রিন: ল্যাগিং পিরিয়ডে ফাঁকা স্ক্রিন বা 'No Orders' ট্র্যাপ আটকাবে ───
  if (isPageLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-5 p-4 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-xl w-1/4 mb-2" />
        <div className="flex gap-2 mb-6">
          <div className="h-9 bg-gray-200 rounded-xl w-16" />
          <div className="h-9 bg-gray-200 rounded-xl w-24" />
          <div className="h-9 bg-gray-200 rounded-xl w-20" />
        </div>
        {[1, 2, 3].map((n) => (
          <div key={n} className="p-5 border border-gray-100 bg-white rounded-2xl space-y-4 shadow-2xs">
            <div className="h-5 bg-gray-200 rounded-md w-1/3" />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded-md w-32" />
              </div>
              <div className="h-8 bg-gray-200 rounded-xl w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // সব অর্ডার থেকে শুধুমাত্র কারেন্ট লগইন করা ইউজারের অর্ডারগুলো ফিল্টার করা হলো
  const myFilteredOnlyOrders = rawOrders.filter((order: any) => {
    const orderUserId = getSafeId(order.user);
    return orderUserId === userId;
  });

  // ফিল্টার করা অর্ডারের ওপর বেস করে ডেট সর্টিং হচ্ছে
  const sortedOrders = [...myFilteredOnlyOrders].sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt?.$date || a.createdAt).getTime();
    const dateB = new Date(b.createdAt?.$date || b.createdAt).getTime();
    return dateB - dateA;
  });

  const filteredOrders = sortedOrders.filter((order: any) => {
    if (activeFilter === "All") return true;
    const status = (order.orderStatus || "Pending").toLowerCase();
    if (activeFilter === "Cancelled")
      return status === "cancelled" || status === "canceled";
    if (activeFilter === "Pending")
      return status === "pending" || status === "packed";
    if (activeFilter === "Shipped")
      return status === "shipped" || status === "out for delivery";
    return status === activeFilter.toLowerCase();
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen p-3 md:p-6 text-[#1E1E1E] font-sans">
      <div className="max-w-5xl mx-auto">
        {/* FILTER HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-sans font-bold text-[22px] md:text-[28px] text-[#0A1128] tracking-tight">
              My Orders
            </h1>
            <p className="text-[12px] md:text-[14px] text-gray-400 mt-0.5">
              {filteredOrders.length} total orders
            </p>
          </div>

          {/* ফিল্টার বাটন গ্ৰুপ */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-3 px-3 lg:mx-0 lg:px-0 scrollbar-none snap-x">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 md:px-5 md:py-2 rounded-xl text-[13px] md:text-[14px] font-medium border cursor-pointer whitespace-nowrap transition-all snap-contained ${
                  activeFilter === filter
                    ? "bg-[#4E612B] text-white border-[#4E612B]"
                    : "bg-white text-[#555555] border-gray-200 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {currentOrders.length === 0 ? (
            <div className="text-center py-12 md:py-16 text-[13px] md:text-[14px] text-gray-400 border border-gray-100 rounded-2xl bg-white shadow-xs">
              No orders found matching this status.
            </div>
          ) : (
            currentOrders.map((order: any, idx: number) => {
              const items = order.orderItems || [];
              const rawDate = order.createdAt?.$date || order.createdAt;
              const orderDate = rawDate
                ? new Date(rawDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "12 Jun 2026";
              const currentStatus = order.orderStatus || "Packed";
              const orderStringId = getSafeId(order._id);

              return (
                <div
                  key={orderStringId || idx}
                  className="p-4 md:p-5 border border-gray-100 bg-white rounded-2xl flex flex-col gap-4 shadow-2xs"
                >
                  {/* CARD HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6 sm:flex sm:items-center sm:gap-10 md:gap-14 text-[12px] md:text-[13px]">
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                          Order ID
                        </p>
                        <p className="font-bold text-[#1E1E1E] mt-0.5">
                          #
                          {order.transactionId?.split("-")[1] ||
                            orderStringId.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                          Placed On
                        </p>
                        <p className="font-medium text-[#555555] mt-0.5">
                          {orderDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                          Payment
                        </p>
                        <p className="font-medium text-[#555555] mt-0.5">
                          {order.paymentMethod || "COD"}
                        </p>
                      </div>
                    </div>

                    <div className="self-start sm:self-auto">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] md:text-[12px] font-bold border border-transparent capitalize ${getStatusBadgeStyle(currentStatus)}`}
                      >
                        • {currentStatus}
                      </span>
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3 md:gap-4 flex-1 min-w-0">
                      {/* প্রোডাক্ট ইমেজ গ্ৰুপ */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {items.slice(0, 2).map((item: any, i: number) => (
                          <IndividualProductImage
                            key={i}
                            itemField={item}
                            allProducts={allProducts}
                          />
                        ))}
                        {items.length > 2 && (
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-gray-100 bg-[#F4F4F4] flex items-center justify-center shrink-0">
                            <p className="text-[12px] md:text-[13px] font-bold text-[#555555]">
                              +{items.length - 2}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* টাইটেল ও শিপিং অ্যাড্রেস */}
                      <div className="space-y-1 min-w-0 flex-1 pt-0.5 sm:pt-0">
                        <OrderItemTitle
                          orderItems={items}
                          allProducts={allProducts}
                        />
                        <p className="text-[12px] md:text-[13px] text-gray-400 truncate flex items-center gap-1">
                          <span className="shrink-0">📍</span>
                          <span className="truncate">
                            {order.shippingAddress?.address ||
                              "Dhaka, Bangladesh"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS & AMOUNT */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-50 mt-1 md:mt-0">
                      <div className="md:text-right">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider hidden sm:block">
                          Total Amount
                        </p>
                        <p className="text-[16px] md:text-[18px] font-extrabold text-[#1E1E1E]">
                          ৳{order.totalPrice || "0"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveOrderId(orderStringId)}
                          className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-gray-200 text-[12px] md:text-[13px] font-bold text-[#555555] hover:bg-gray-50 cursor-pointer shadow-2xs bg-white"
                        >
                          <Eye size={14} />{" "}
                          <span className="hidden xs:inline">Details</span>
                        </button>
                        {[
                          "Pending",
                          "Packed",
                          "Shipped",
                          "Out for delivery",
                        ].includes(currentStatus) ? (
                          <button
                            onClick={() => setActiveOrderId(orderStringId)}
                            className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-[#4E612B] text-[12px] md:text-[13px] font-bold text-white hover:bg-[#3d4d22] cursor-pointer shadow-sm"
                          >
                            <Truck size={14} /> Track
                          </button>
                        ) : (
                          <button className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-gray-200 text-[12px] md:text-[13px] font-bold text-[#4E612B] hover:bg-gray-50 cursor-pointer shadow-2xs bg-white">
                            <ShoppingCart size={13} />{" "}
                            <span className="hidden xs:inline">Again</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-gray-200 text-[12px] md:text-[13px] font-bold text-gray-500 disabled:opacity-40 bg-white cursor-pointer shadow-2xs"
            >
              ← Prev
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-xl text-[12px] md:text-[13px] font-extrabold transition-all cursor-pointer ${currentPage === i + 1 ? "bg-[#4E612B] text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 shadow-2xs"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-gray-200 text-[12px] md:text-[13px] font-bold text-gray-500 disabled:opacity-40 bg-white cursor-pointer shadow-2xs"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}