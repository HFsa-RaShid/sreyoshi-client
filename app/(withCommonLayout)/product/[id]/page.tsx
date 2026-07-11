// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useSession } from "next-auth/react"; 
// import Image from "next/image"; 
// import { Heart, ArrowLeft, Plus, Minus, Loader2 } from "lucide-react";
// import { ProductShade } from "@/Types/types";
// import { useGetSingleProductForCustomer } from "@/hooks/useCustomerData";
// import { useWishlist } from "@/hooks/useWishlist"; 
// import { useBrands } from "@/hooks/useBrands"; 

// import { useApp } from "@/context/AppContext";
// import ProductReviews from "@/components/ProductReviews";
// import RelatedProducts from "./components/RelatedProducts";
// import RecommendedProducts from "./components/RecommendedProducts";

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

//   return (
//     <div className="min-h-screen pt-28 pb-16 px-4 md:px-12 text-[#2C3E35]">
//       <div className="container mx-auto p-6 md:p-10 rounded-[32px]">
        
//         <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-60 hover:opacity-100 mb-8 transition-opacity">
//           <ArrowLeft size={14} /> Back to Shop
//         </button>

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
//           {/* 🎯 কন্টেইনার উইডথ লক করতে max-w-full এবং রিং কাট যাতে না যায় তার জন্য overflow-visible */}
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

//             {/* ================= BRIEF DESCRIPTION (ফাইনাল আলটিমেট ফিক্স) ================= */}
//             {/* 🎯 এখানে w-full max-w-full এবং কড়া ইনলাইন সিএসএস প্রয়োগ করা হয়েছে */}
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
import { Heart, ArrowLeft, Plus, Minus } from "lucide-react";
import { ProductShade } from "@/Types/types";
import { useGetSingleProductForCustomer } from "@/hooks/useCustomerData";
import { useWishlist } from "@/hooks/useWishlist"; 
import { useBrands } from "@/hooks/useBrands"; 

import { useApp } from "@/context/AppContext";
import ProductReviews from "@/components/ProductReviews";
import RelatedProducts from "./components/RelatedProducts";
import RecommendedProducts from "./components/RecommendedProducts";

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

  // ✨ ১. প্রিমিয়াম পালস স্কেলিটন লোডার (লোডিং স্পিনারের পরিবর্তে)
  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 md:px-12 bg-[#FAF9F6] animate-pulse">
        <div className="container mx-auto max-w-7xl">
          <div className="h-4 bg-gray-200 rounded w-24 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4 w-full max-w-md">
              <div className="aspect-square bg-gray-200 rounded-2xl w-full"></div>
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>)}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
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

  const handleShadeSelect = (shade: ProductShade) => {
    setUserSelectedShade(shade);
    if (shade.shadeImage) {
      setUserSelectedImg(shade.shadeImage);
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

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 px-4 md:px-12 bg-[#FAF9F6] text-[#2C3E35]">
      <div className="container mx-auto max-w-7xl">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-60 hover:opacity-100 mb-6 transition-opacity">
          <ArrowLeft size={14} /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 mb-12 items-start">
          {/* ================= LEFT GALLERY (ডেস্কটপে ইমেজ সাইজ ব্যালেন্স করা হয়েছে) ================= */}
          <div className="flex flex-col items-center lg:items-start w-full max-w-md xl:max-w-lg mx-auto lg:mx-0">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#F1EFE9] mb-4 shadow-xs relative border border-gray-100">
              <Image 
                src={selectedImg || "/placeholder.png"} 
                alt={product.name || "Product Image"} 
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-all duration-300" 
              />
            </div>
            
            <div className="grid grid-cols-4 gap-3 w-full">
              {product.commonImages?.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => setUserSelectedImg(img)}
                  className={`aspect-square rounded-xl overflow-hidden bg-[#F1EFE9] cursor-pointer border-2 transition-all relative ${selectedImg === img ? "border-[#E92C66]" : "border-transparent opacity-70 hover:opacity-100"}`}
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
          <div className="flex flex-col justify-between space-y-6 overflow-visible w-full max-w-full mt-4 lg:mt-0">
            <div className="space-y-4">
              <h1 className="text-xl md:text-2xl font-sans font-bold text-gray-800 tracking-tight leading-tight">{product.name}</h1>
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

        {/* ================= BOTTOM TABS DETAILS (মোবাইল স্ক্রল প্রুফ ফিক্স) ================= */}
        <div className="mt-16 border-t border-gray-100 pt-8">
          <div className="w-full flex justify-start sm:justify-center items-center overflow-x-auto scrollbar-none snap-x snap-mandatory gap-3 pb-3">
            {([ "desc", "howToUse", "reviews" ] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 rounded-xl font-sans font-bold text-[11px] md:text-xs uppercase tracking-wider transition-all snap-center whitespace-nowrap border ${
                  activeTab === tab 
                    ? "bg-[#1A2E22] text-white border-transparent shadow-xs" 
                    : "bg-white text-[#2C3E35] border-gray-100 hover:bg-gray-50"
                }`}
              >
                {tab === "desc" ? "Full Description" : tab === "howToUse" ? "Features & Details" : `Reviews (${product.ratingCount || 0})`}
              </button>
            ))}
          </div>

          <div className="w-full max-w-5xl mx-auto bg-white p-5 md:p-8 rounded-2xl border border-gray-100 text-left mt-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
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

