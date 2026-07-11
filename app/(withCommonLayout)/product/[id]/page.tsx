

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useSession } from "next-auth/react"; 
// import Image from "next/image"; 
// import { Heart, Plus, Minus, Loader2 } from "lucide-react";
// import { ProductShade } from "@/Types/types";
// import { useGetSingleProductForCustomer } from "@/hooks/useCustomerData";
// import { useWishlist } from "@/hooks/useWishlist"; 
// import { useBrands } from "@/hooks/useBrands"; 

// import { useApp } from "@/context/AppContext";
// import ProductReviews from "@/components/ProductReviews";
// import RelatedProducts from "./components/RelatedProducts";
// import RecommendedProducts from "./components/RecommendedProducts";
// import Breadcrumb from "@/components/Shared/Breadcrumb/Breadcrumb";


// type TabType = "desc" | "howToUse" | "reviews";

// export default function ProductDetailsPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { data: session, status: sessionStatus } = useSession(); 
//   const { addToCart } = useApp();

//   const { wishlistItems, toggleWishlist, isTogglingWishlist } = useWishlist();
//   const { data: product, isLoading, isError } = useGetSingleProductForCustomer(id as string);
//   const { brandsData } = useBrands(); 

//   const [activeTab, setActiveTab] = useState<TabType>("desc");
//   const [quantity, setQuantity] = useState(1);
//   const [isDescExpanded, setIsDescExpanded] = useState(false);

//   // Local State Management 
//   const [userSelectedShade, setUserSelectedShade] = useState<ProductShade | null>(null);
//   const [userSelectedImg, setUserSelectedImg] = useState<string>("");

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-2">
//         <Loader2 className="w-10 h-10 animate-spin text-[#1A2E22]" />
//         <p className="text-sm font-medium text-[#1A2E22]/70">Loading Product Details...</p>
//       </div>
//     );
//   }

//   if (isError || !product) {
//     return (
//       <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-4">
//         <p className="text-gray-500 font-medium">Product not found or an error occurred.</p>
//         <button onClick={() => router.push("/shop")} className="bg-[#1A2E22] text-white px-6 py-2 rounded-xl text-xs font-bold">
//           Back to Shop
//         </button>
//       </div>
//     );
//   }

//   // DETERMINISTIC DERIVED STATES
//   const defaultShade = product.shades && product.shades.length > 0
//     ? (product.shades.find((s: any) => s.status === "Active") || product.shades[0])
//     : null;

//   const selectedShade = userSelectedShade || defaultShade;

//   const defaultImg = selectedShade?.shadeImage 
//     ? selectedShade.shadeImage 
//     : (product.commonImages && product.commonImages.length > 0 ? product.commonImages[0] : "");

//   const selectedImg = userSelectedImg || defaultImg;

//   const handleShadeSelect = (shade: ProductShade) => {
//     setUserSelectedShade(shade);
//     if (shade.shadeImage) {
//       setUserSelectedImg(shade.shadeImage);
//     }
//   };

//   const currentAvailableStock = product.shades && product.shades.length > 0
//     ? (selectedShade ? selectedShade.stock : 0)
//     : product.totalStock;

//   const isOutOfStock = currentAvailableStock <= 0;

//   const isFavorite = product._id && Array.isArray(wishlistItems)
//     ? wishlistItems.some((item: any) => item.productId?._id === product._id || item.productId === product._id) 
//     : false;
  
//   const categoryId = typeof product.category === "object" ? (product.category as any)?._id : "";
//   const categoryName = typeof product.category === "object" ? (product.category as any)?.name : product.category;
  
//   const brandId = typeof product.brand === "object" ? (product.brand as any)?._id : (product.brand || "");
//   const foundBrandObj = brandsData?.find((b: any) => b._id === brandId);
//   const brandName = typeof product.brand === "object" ? (product.brand as any)?.name : (foundBrandObj ? foundBrandObj.name : "Sreyoshi");

//   const discountAmount = product.oldPrice && product.oldPrice > product.price ? product.oldPrice - product.price : 0;
//   const discountPercentage = product.oldPrice && product.oldPrice > product.price 
//     ? Math.round((discountAmount / product.oldPrice) * 100) 
//     : 0;

//   const handleAddToCart = () => {
//     if (isOutOfStock) return;
//     addToCart({
//       ...product,
//       selectedShade: selectedShade 
//     }, quantity);
//   };

//   const handleWishlistClick = async () => {
//     if (sessionStatus === "loading" || isTogglingWishlist) return;

//     const isLoggedIn = !!session?.user;
//     if (!isLoggedIn) {
//       router.push("/signin");
//       return;
//     }

//     if (product._id) {
//       await toggleWishlist(product._id);
//     }
//   };

//   const handleCategoryNavigation = (type: "category" | "subCategory" | "itemName" | "brand", value: string) => {
//     if (!value) return;
//     let queryKey = type as string;
//     if (type === "subCategory") queryKey = "subcategory";
//     if (type === "itemName") queryKey = "itemname";
//     if (type === "brand") queryKey = "brand";
    
//     const finalValue = type === "brand" ? brandId : value;
//     router.push(`/shop?${queryKey}=${encodeURIComponent(finalValue)}`);
//   };

// // 📋 ডাইনামিক ব্রেডক্রাম্ব অ্যারে (টাইপ ডিফাইন করে দেওয়া হলো যাতে link অপশনাল হতে পারে)
// const productBreadcrumbs: { name: string; link?: string }[] = [
//   { name: "Home", link: "/" },
//   { name: "Shop", link: "/shop" },
// ];

// if (categoryName) {
//   productBreadcrumbs.push({ 
//     name: categoryName, 
//     link: `/shop?category=${categoryId || categoryName}` 
//   });
// }

// if (product.name) {
//   // 🎯 এখন আর টাইপস্ক্রিপ্ট এরর দেবে না, কারণ link?: string ডিফাইন করা আছে
//   productBreadcrumbs.push({ name: product.name });
// }

//   return (
//     <div className="min-h-screen pt-16 md:pt-28 pb-16 px-4 md:px-12 text-[#2C3E35]">
//       <div className="container mx-auto p-6 md:p-10 rounded-[32px]">
        
//         {/* 🎯 ব্রেডক্রাম্ব এখানে বসানো হলো */}
//         <div className="mb-2 md:mb-4">
//           <Breadcrumb customItems={productBreadcrumbs} />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
//           {/* ================= LEFT GALLERY ================= */}
//           <div className="flex flex-col items-center lg:items-start w-full">
//             <div className="aspect-square w-full max-w-lg rounded-2xl overflow-hidden bg-[#F1EFE9] mb-4 shadow-inner relative">
//               <Image 
//                 src={selectedImg || "/placeholder.png"} 
//                 alt={product.name || "Product Image"} 
//                 fill
//                 priority
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 className="object-cover transition-all duration-300" 
//               />
//             </div>
            
//             <div className="grid grid-cols-4 gap-3 w-full max-w-lg">
//               {product.commonImages?.map((img: string, idx: number) => (
//                 <div 
//                   key={idx} 
//                   onClick={() => setUserSelectedImg(img)}
//                   className={`aspect-square rounded-xl overflow-hidden bg-[#F1EFE9] cursor-pointer border-2 transition-all relative ${selectedImg === img ? "border-[#E92C66]" : "border-transparent opacity-70 hover:opacity-100"}`}
//                 >
//                   <Image 
//                     src={img} 
//                     alt={`view-${idx}`} 
//                     fill
//                     sizes="25vw"
//                     className="object-cover" 
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ================= RIGHT DETAILS INFO ================= */}
//           <div className="flex flex-col justify-between space-y-6 overflow-visible w-full max-w-full">
//             <div className="space-y-4">
//               <h1 className="text-xl md:text-2xl font-sans font-semibold text-gray-800 tracking-tight">{product.name}</h1>
//               <p className="text-xs text-gray-400 font-medium">Size: {product.weightOrVolume} {product.unit}</p>
              
//               <div className="pt-1">
//                 {isOutOfStock ? (
//                   <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-1.5 rounded-xl">
//                     <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
//                     <span className="text-sm md:text-base font-bold text-red-600 uppercase tracking-wide">Out of Stock</span>
//                     <span className="text-xs text-red-500 font-medium font-mono">({currentAvailableStock} left)</span>
//                   </div>
//                 ) : (
//                   <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-xl">
//                     <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
//                     <span className="text-sm md:text-base font-bold text-emerald-600 uppercase tracking-wide">In Stock</span>
//                     <span className="text-xs text-emerald-600 font-bold font-mono">({currentAvailableStock} items left)</span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center flex-wrap gap-2.5 pt-1">
//                 <span className="text-xl font-bold text-[#E92C66]">৳{product.price?.toFixed(2)}</span>
//                 {discountAmount > 0 && (
//                   <>
//                     <span className="text-sm line-through text-gray-400">৳{product.oldPrice?.toFixed(2)}</span>
//                     <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Save ৳{discountAmount.toFixed(0)}</span>
//                     <span className="bg-[#612193] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{discountPercentage}% OFF</span>
//                   </>
//                 )}
//               </div>

//               <div className="flex items-center gap-2 pt-1 flex-wrap">
//                 <span className="bg-[#121B2B] text-white text-[11px] px-3 py-1 rounded-full font-medium">
//                   No #{product.salesCount || 1} {product.promotion || "Best Seller"}
//                 </span>
//                 <span className="text-xs text-gray-400 font-medium">
//                   in <span onClick={() => handleCategoryNavigation("subCategory", product.subCategory)} className="text-[#E92C66] underline font-semibold cursor-pointer uppercase">{product.subCategory}</span>
//                 </span>
//               </div>

//               {product.shades && product.shades.length > 0 && (
//                 <div className="pt-2">
//                   <h3 className="text-xs font-bold text-gray-700 mb-2">
//                     Select Shade: <span className="text-[#E92C66] ml-1 font-semibold">{selectedShade?.shadeName || "None"}</span>
//                   </h3>
//                   <div className="flex flex-wrap gap-2.5 p-1 overflow-visible">
//                     {product.shades.map((shade: ProductShade, idx: number) => {
//                       if (shade.status === "Inactive") return null;
//                       const isShadeSelected = selectedShade?.shadeName === shade.shadeName;

//                       return (
//                         <button
//                           key={idx}
//                           onClick={() => handleShadeSelect(shade)}
//                           className={`w-8 h-8 rounded-full border transition-all relative ${isShadeSelected ? "ring-2 ring-offset-2 ring-gray-800 scale-105" : "border-gray-200 hover:scale-105"}`}
//                           style={{ backgroundColor: shade.shadeColorCode || "#ccc" }}
//                           title={`${shade.shadeName} (${shade.stock} left)`}
//                         >
//                           {shade.stock === 0 && (
//                             <div className="absolute inset-0 bg-white/0 rounded-full flex items-center justify-center text-[10px] font-bold text-red-600 shadow-inner">X</div>
//                           )}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-3">
//               <div className="flex items-center gap-3">
//                 <button 
//                   onClick={handleWishlistClick}
//                   disabled={sessionStatus === "loading" || isTogglingWishlist}
//                   className={`p-3 rounded-lg border transition-all ${isFavorite ? "bg-[#121B2B] text-white border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200 shadow-sm"} disabled:opacity-70`}
//                 >
//                   <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
//                 </button>

//                 <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden h-[44px]">
//                   <button 
//                     disabled={isOutOfStock} 
//                     onClick={() => setQuantity(q => Math.max(1, q - 1))} 
//                     className="px-3 text-gray-400 hover:bg-gray-50 h-full disabled:opacity-30"
//                   >
//                     <Minus size={12} />
//                   </button>
//                   <span className="w-9 text-center text-xs font-bold text-gray-800">{isOutOfStock ? 0 : quantity}</span>
//                   <button 
//                     disabled={isOutOfStock || quantity >= currentAvailableStock} 
//                     onClick={() => setQuantity(q => q + 1)} 
//                     className="px-3 text-gray-400 hover:bg-gray-50 h-full disabled:opacity-30"
//                   >
//                     <Plus size={12} />
//                   </button>
//                 </div>

//                 <button 
//                   onClick={handleAddToCart}
//                   disabled={isOutOfStock}
//                   className={`flex-1 h-[44px] rounded-lg font-bold text-xs shadow-sm transition-colors uppercase tracking-wider text-white ${isOutOfStock ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none border border-gray-200" : "bg-[#E92C66] hover:bg-[#d12457]"}`}
//                 >
//                   {isOutOfStock ? "Out of Stock" : "Add To Cart"}
//                 </button>
//               </div>
//             </div>

//             {/* ================= BRIEF DESCRIPTION ================= */}
//             <div className="pt-2 border-t border-gray-100 w-full max-w-full overflow-hidden">
//               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Brief Description</p>
//               <div 
//                 className={`text-xs text-gray-600 leading-relaxed w-full max-w-full ${
//                   !isDescExpanded ? "line-clamp-3 overflow-hidden text-ellipsis" : ""
//                 }`}
//                 style={{ 
//                   wordBreak: "keep-all", 
//                   overflowWrap: "break-word", 
//                   whiteSpace: "normal",
//                   display: !isDescExpanded ? "-webkit-box" : "block",
//                   WebkitLineClamp: !isDescExpanded ? 3 : "unset",
//                   WebkitBoxOrient: "vertical"
//                 }}
//                 dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }}
//               />
//               {product.description && product.description.replace(/<[^>]*>/g, '').length > 150 && (
//                 <button 
//                   onClick={() => setIsDescExpanded(!isDescExpanded)} 
//                   className="text-[#E92C66] text-xs font-bold mt-1 hover:underline block"
//                 >
//                   {isDescExpanded ? "Read Less" : "Read More"}
//                 </button>
//               )}
//             </div>

//             <div className="border-t border-gray-100 pt-5 text-xs space-y-2.5 text-gray-600">
//               <div className="grid grid-cols-[130px_1fr] items-start">
//                 <span className="font-semibold text-gray-500">SKU</span>
//                 <span className="text-gray-800 font-medium">: {product.productCode || "N/A"}</span>
//               </div>
//               <div className="grid grid-cols-[130px_1fr] items-start">
//                 <span className="font-semibold text-gray-500">Category</span>
//                 <div className="text-gray-800 font-medium">
//                   : {" "}
//                   {categoryName && (
//                     <span onClick={() => handleCategoryNavigation("category", categoryId || categoryName)} className="hover:text-[#E92C66] hover:underline cursor-pointer transition-colors capitalize">{categoryName}</span>
//                   )}
//                   {product.subCategory && (
//                     <>
//                       , <span onClick={() => handleCategoryNavigation("subCategory", product.subCategory)} className="hover:text-[#E92C66] hover:underline cursor-pointer transition-colors capitalize">{product.subCategory}</span>
//                     </>
//                   )}
//                   {product.itemName && (
//                     <>
//                       , <span onClick={() => handleCategoryNavigation("itemName", product.itemName)} className="hover:text-[#E92C66] hover:underline cursor-pointer transition-colors capitalize">{product.itemName}</span>
//                     </>
//                   )}
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-[130px_1fr] items-start">
//                 <span className="font-semibold text-gray-500">Brands</span>
//                 <span 
//                   onClick={() => handleCategoryNavigation("brand", brandId)} 
//                   className="text-[#E92C66] underline font-semibold cursor-pointer transition-colors"
//                 >
//                   : {brandName}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================= BOTTOM TABS DETAILS ================= */}
//         <div className="mt-16 border-t border-gray-100 pt-10">
//           <div className="flex justify-center gap-4 mb-8">
//             {([ "desc", "howToUse", "reviews" ] as TabType[]).map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-6 py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wide transition-all ${activeTab === tab ? "bg-[#1A2E22] text-white shadow-sm" : "bg-white text-black hover:bg-gray-200"}`}
//               >
//                 {tab === "desc" ? "Full Description" : tab === "howToUse" ? "Features & Details" : `Reviews (${product.ratingCount || 0})`}
//               </button>
//             ))}
//           </div>

//           <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-2xl border border-gray-100 overflow-hidden text-left">
//             {activeTab === "desc" && (
//               <div className="w-full max-w-full overflow-hidden">
//                 <div 
//                   dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }} 
//                   className="prose max-w-none text-xs text-gray-600 leading-relaxed w-full" 
//                   style={{ wordBreak: "keep-all", overflowWrap: "break-word", whiteSpace: "normal" }}
//                 />
//                 <p className="text-[11px] font-bold text-gray-800 mt-4">* Online Exclusive Offer.</p>
//               </div>
//             )}
            
//             {activeTab === "howToUse" && (
//               <div className="w-full max-w-full overflow-hidden">
//                 <div 
//                   dangerouslySetInnerHTML={{ __html: product.howToUse || "<p>Apply smoothly over wet body structure skin surface.</p>" }} 
//                   className="prose max-w-none text-xs text-gray-600 leading-relaxed w-full" 
//                   style={{ wordBreak: "keep-all", overflowWrap: "break-word", whiteSpace: "normal" }}
//                 />
//               </div>
//             )}

//             {activeTab === "reviews" && (
//               <div className="w-full">
//                 <ProductReviews productId={product._id as string} />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ================= DYNAMIC PRODUCTS CARDS SECTIONS ================= */}
//         <div className="mt-20 space-y-16">
//           <RelatedProducts currentProduct={product} />
//           <RecommendedProducts />
//         </div>

//       </div>
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import Image from "next/image"; 
import { Heart, Plus, Minus, Loader2 } from "lucide-react";
import { ProductShade } from "@/Types/types";
import { useGetSingleProductForCustomer } from "@/hooks/useCustomerData";
import { useWishlist } from "@/hooks/useWishlist"; 
import { useBrands } from "@/hooks/useBrands"; 

import { useApp } from "@/context/AppContext";
import ProductReviews from "@/components/ProductReviews";
import RelatedProducts from "./components/RelatedProducts";
import RecommendedProducts from "./components/RecommendedProducts";
import Breadcrumb from "@/components/Shared/Breadcrumb/Breadcrumb";

type TabType = "desc" | "howToUse" | "reviews";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession(); 
  const { addToCart } = useApp();

  const { wishlistItems, toggleWishlist, isTogglingWishlist } = useWishlist();
  const { data: product, isLoading, isError } = useGetSingleProductForCustomer(id as string);
  const { brandsData } = useBrands(); 

  const [activeTab, setActiveTab] = useState<TabType>("desc");
  const [quantity, setQuantity] = useState(1);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Local State Management 
  const [userSelectedShade, setUserSelectedShade] = useState<ProductShade | null>(null);
  const [userSelectedImg, setUserSelectedImg] = useState<string>("");
  const [animateKey, setAnimateKey] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-[#1A2E22]" />
        <p className="text-sm font-medium text-[#1A2E22]/70">Loading Product Details...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-medium">Product not found or an error occurred.</p>
        <button onClick={() => router.push("/shop")} className="bg-[#1A2E22] text-white px-6 py-2 rounded-xl text-xs font-bold">
          Back to Shop
        </button>
      </div>
    );
  }

  // DETERMINISTIC DERIVED STATES
  const defaultShade = product.shades && product.shades.length > 0
    ? (product.shades.find((s: any) => s.status === "Active") || product.shades[0])
    : null;

  const selectedShade = userSelectedShade || defaultShade;

  const defaultImg = selectedShade?.shadeImage 
    ? selectedShade.shadeImage 
    : (product.commonImages && product.commonImages.length > 0 ? product.commonImages[0] : "");

  const selectedImg = userSelectedImg || defaultImg;

  // আলতো এবং মসৃণ রাইট-টু-লেফট ট্রানজিশন হ্যান্ডলার
  const handleImageChange = (img: string) => {
    if (selectedImg !== img) {
      setUserSelectedImg(img);
      setAnimateKey(prev => prev + 1);
    }
  };

  const handleShadeSelect = (shade: ProductShade) => {
    setUserSelectedShade(shade);
    if (shade.shadeImage) {
      handleImageChange(shade.shadeImage);
    }
  };

  const currentAvailableStock = product.shades && product.shades.length > 0
    ? (selectedShade ? selectedShade.stock : 0)
    : product.totalStock;

  const isOutOfStock = currentAvailableStock <= 0;

  const isFavorite = product._id && Array.isArray(wishlistItems)
    ? wishlistItems.some((item: any) => item.productId?._id === product._id || item.productId === product._id) 
    : false;
  
  const categoryId = typeof product.category === "object" ? (product.category as any)?._id : "";
  const categoryName = typeof product.category === "object" ? (product.category as any)?.name : product.category;
  
  const brandId = typeof product.brand === "object" ? (product.brand as any)?._id : (product.brand || "");
  const foundBrandObj = brandsData?.find((b: any) => b._id === brandId);
  const brandName = typeof product.brand === "object" ? (product.brand as any)?.name : (foundBrandObj ? foundBrandObj.name : "Sreyoshi");

  const discountAmount = product.oldPrice && product.oldPrice > product.price ? product.oldPrice - product.price : 0;
  const discountPercentage = product.oldPrice && product.oldPrice > product.price 
    ? Math.round((discountAmount / product.oldPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      ...product,
      selectedShade: selectedShade 
    }, quantity);
  };

  const handleWishlistClick = async () => {
    if (sessionStatus === "loading" || isTogglingWishlist) return;

    const isLoggedIn = !!session?.user;
    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }

    if (product._id) {
      await toggleWishlist(product._id);
    }
  };

  const handleCategoryNavigation = (type: "category" | "subCategory" | "itemName" | "brand", value: string) => {
    if (!value) return;
    let queryKey = type as string;
    if (type === "subCategory") queryKey = "subcategory";
    if (type === "itemName") queryKey = "itemname";
    if (type === "brand") queryKey = "brand";
    
    const finalValue = type === "brand" ? brandId : value;
    router.push(`/shop?${queryKey}=${encodeURIComponent(finalValue)}`);
  };

  const productBreadcrumbs: { name: string; link?: string }[] = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop" },
  ];

  if (categoryName) {
    productBreadcrumbs.push({ 
      name: categoryName, 
      link: `/shop?category=${categoryId || categoryName}` 
    });
  }

  if (product.name) {
    productBreadcrumbs.push({ name: product.name });
  }

  return (
    <div className="min-h-screen pt-16 md:pt-28 pb-16 px-4 md:px-12 text-[#2C3E35]">
      {/* গ্লোবাল সিএসএস দিয়ে আলতো স্লাইড ও ফেড-ইন ট্রানজিশন ডিফাইন করা হলো */}
      <style jsx global>{`
        @keyframes smoothSlideLeft {
          0% {
            transform: translateX(15px);
            opacity: 0.4;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-gallery-slide {
          animation: smoothSlideLeft 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <div className="container mx-auto p-6 md:p-10 rounded-[32px]">
        
        <div className="mb-2 md:mb-4">
          <Breadcrumb customItems={productBreadcrumbs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* ================= LEFT GALLERY ================= */}
          <div className="flex flex-col items-center lg:items-start w-full">
            {/* বড় ইমেজ সাইজ আগের মতোই max-w-lg রাখা হয়েছে, যা ডিভাইস অনুযায়ী রেসপনসিভলি সংকুচিত হবে */}
            <div className="aspect-square w-full max-w-lg rounded-2xl overflow-hidden bg-[#F1EFE9] mb-4 shadow-inner relative">
              <div key={animateKey} className="w-full h-full relative animate-gallery-slide">
                <Image 
                  src={selectedImg || "/placeholder.png"} 
                  alt={product.name || "Product Image"} 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover" 
                />
              </div>
            </div>
            
            {/* ছোট থাম্বনেইল কন্টেইনার, এটিও ডিভাইস সাইজ অনুযায়ী ছোট হতে থাকবে */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-lg">
              {product.commonImages?.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  onMouseEnter={() => handleImageChange(img)}
                  onClick={() => handleImageChange(img)}
                  onTouchStart={() => handleImageChange(img)}
                  className={`aspect-square rounded-xl overflow-hidden bg-[#F1EFE9] cursor-pointer border-2 transition-all duration-300 relative ${selectedImg === img ? "border-[#E92C66] scale-[0.98]" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <Image 
                    src={img} 
                    alt={`view-${idx}`} 
                    fill
                    sizes="25vw"
                    className="object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT DETAILS INFO ================= */}
          <div className="flex flex-col justify-between space-y-6 overflow-visible w-full max-w-full">
            <div className="space-y-4">
              <h1 className="text-xl md:text-2xl font-sans font-semibold text-gray-800 tracking-tight">{product.name}</h1>
              <p className="text-xs text-gray-400 font-medium">Size: {product.weightOrVolume} {product.unit}</p>
              
              <div className="pt-1">
                {isOutOfStock ? (
                  <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-1.5 rounded-xl">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm md:text-base font-bold text-red-600 uppercase tracking-wide">Out of Stock</span>
                    <span className="text-xs text-red-500 font-medium font-mono">({currentAvailableStock} left)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-xl">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm md:text-base font-bold text-emerald-600 uppercase tracking-wide">In Stock</span>
                    <span className="text-xs text-emerald-600 font-bold font-mono">({currentAvailableStock} items left)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-2.5 pt-1">
                <span className="text-xl font-bold text-[#E92C66]">৳{product.price?.toFixed(2)}</span>
                {discountAmount > 0 && (
                  <>
                    <span className="text-sm line-through text-gray-400">৳{product.oldPrice?.toFixed(2)}</span>
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Save ৳{discountAmount.toFixed(0)}</span>
                    <span className="bg-[#612193] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{discountPercentage}% OFF</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="bg-[#121B2B] text-white text-[11px] px-3 py-1 rounded-full font-medium">
                  No #{product.salesCount || 1} {product.promotion || "Best Seller"}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  in <span onClick={() => handleCategoryNavigation("subCategory", product.subCategory)} className="text-[#E92C66] underline font-semibold cursor-pointer uppercase">{product.subCategory}</span>
                </span>
              </div>

              {product.shades && product.shades.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-gray-700 mb-2">
                    Select Shade: <span className="text-[#E92C66] ml-1 font-semibold">{selectedShade?.shadeName || "None"}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2.5 p-1 overflow-visible">
                    {product.shades.map((shade: ProductShade, idx: number) => {
                      if (shade.status === "Inactive") return null;
                      const isShadeSelected = selectedShade?.shadeName === shade.shadeName;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleShadeSelect(shade)}
                          className={`w-8 h-8 rounded-full border transition-all relative ${isShadeSelected ? "ring-2 ring-offset-2 ring-gray-800 scale-105" : "border-gray-200 hover:scale-105"}`}
                          style={{ backgroundColor: shade.shadeColorCode || "#ccc" }}
                          title={`${shade.shadeName} (${shade.stock} left)`}
                        >
                          {shade.stock === 0 && (
                            <div className="absolute inset-0 bg-white/0 rounded-full flex items-center justify-center text-[10px] font-bold text-red-600 shadow-inner">X</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleWishlistClick}
                  disabled={sessionStatus === "loading" || isTogglingWishlist}
                  className={`p-3 rounded-lg border transition-all ${isFavorite ? "bg-[#121B2B] text-white border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200 shadow-sm"} disabled:opacity-70`}
                >
                  <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                </button>

                <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden h-[44px]">
                  <button 
                    disabled={isOutOfStock} 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="px-3 text-gray-400 hover:bg-gray-50 h-full disabled:opacity-30"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-gray-800">{isOutOfStock ? 0 : quantity}</span>
                  <button 
                    disabled={isOutOfStock || quantity >= currentAvailableStock} 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="px-3 text-gray-400 hover:bg-gray-50 h-full disabled:opacity-30"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 h-[44px] rounded-lg font-bold text-xs shadow-sm transition-colors uppercase tracking-wider text-white ${isOutOfStock ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none border border-gray-200" : "bg-[#E92C66] hover:bg-[#d12457]"}`}
                >
                  {isOutOfStock ? "Out of Stock" : "Add To Cart"}
                </button>
              </div>
            </div>

            {/* ================= BRIEF DESCRIPTION ================= */}
            <div className="pt-2 border-t border-gray-100 w-full max-w-full overflow-hidden">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Brief Description</p>
              <div 
                className={`text-xs text-gray-600 leading-relaxed w-full max-w-full ${
                  !isDescExpanded ? "line-clamp-3 overflow-hidden text-ellipsis" : ""
                }`}
                style={{ 
                  wordBreak: "keep-all", 
                  overflowWrap: "break-word", 
                  whiteSpace: "normal",
                  display: !isDescExpanded ? "-webkit-box" : "block",
                  WebkitLineClamp: !isDescExpanded ? 3 : "unset",
                  WebkitBoxOrient: "vertical"
                }}
                dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }}
              />
              {product.description && product.description.replace(/<[^>]*>/g, '').length > 150 && (
                <button 
                  onClick={() => setIsDescExpanded(!isDescExpanded)} 
                  className="text-[#E92C66] text-xs font-bold mt-1 hover:underline block"
                >
                  {isDescExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>

            <div className="border-t border-gray-100 pt-5 text-xs space-y-2.5 text-gray-600">
              <div className="grid grid-cols-[130px_1fr] items-start">
                <span className="font-semibold text-gray-500">SKU</span>
                <span className="text-gray-800 font-medium">: {product.productCode || "N/A"}</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-start">
                <span className="font-semibold text-gray-500">Category</span>
                <div className="text-gray-800 font-medium">
                  : {" "}
                  {categoryName && (
                    <span onClick={() => handleCategoryNavigation("category", categoryId || categoryName)} className="hover:text-[#E92C66] hover:underline cursor-pointer transition-colors capitalize">{categoryName}</span>
                  )}
                  {product.subCategory && (
                    <>
                      , <span onClick={() => handleCategoryNavigation("subCategory", product.subCategory)} className="hover:text-[#E92C66] hover:underline cursor-pointer transition-colors capitalize">{product.subCategory}</span>
                    </>
                  )}
                  {product.itemName && (
                    <>
                      , <span onClick={() => handleCategoryNavigation("itemName", product.itemName)} className="hover:text-[#E92C66] hover:underline cursor-pointer transition-colors capitalize">{product.itemName}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-[130px_1fr] items-start">
                <span className="font-semibold text-gray-500">Brands</span>
                <span 
                  onClick={() => handleCategoryNavigation("brand", brandId)} 
                  className="text-[#E92C66] underline font-semibold cursor-pointer transition-colors"
                >
                  : {brandName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM TABS DETAILS ================= */}
        <div className="mt-16 border-t border-gray-200 pt-6">
          <div className="flex justify-start gap-8 border-b border-gray-200 pb-0 mb-8 overflow-x-auto whitespace-nowrap">
            {([ "desc", "howToUse", "reviews" ] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-sans font-medium text-sm transition-all relative ${
                  activeTab === tab 
                    ? "text-[#1A2E22] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#1A2E22]" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "desc" ? "Description" : tab === "howToUse" ? "Additional Information" : `Review (${product.ratingCount || 0})`}
              </button>
            ))}
          </div>

          <div className="w-full max-w-5xl mx-auto bg-white py-2 overflow-hidden text-left">
            {activeTab === "desc" && (
              <div className="w-full max-w-full overflow-hidden">
                <div 
                  dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }} 
                  className="prose max-w-none text-xs text-gray-600 leading-relaxed w-full" 
                  style={{ wordBreak: "keep-all", overflowWrap: "break-word", whiteSpace: "normal" }}
                />
                <p className="text-[11px] font-bold text-gray-800 mt-4">* Online Exclusive Offer.</p>
              </div>
            )}
            
            {activeTab === "howToUse" && (
              <div className="w-full max-w-full overflow-hidden">
                <div 
                  dangerouslySetInnerHTML={{ __html: product.howToUse || "<p>Apply smoothly over wet body structure skin surface.</p>" }} 
                  className="prose max-w-none text-xs text-gray-600 leading-relaxed w-full" 
                  style={{ wordBreak: "keep-all", overflowWrap: "break-word", whiteSpace: "normal" }}
                />
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="w-full">
                <ProductReviews productId={product._id as string} />
              </div>
            )}
          </div>
        </div>

        {/* ================= DYNAMIC PRODUCTS CARDS SECTIONS ================= */}
        <div className="mt-20 space-y-16">
          <RelatedProducts currentProduct={product} />
          <RecommendedProducts />
        </div>

      </div>
    </div>
  );
}
//