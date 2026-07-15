// components/ProductDetailsSkeleton.tsx
import React from "react";

export default function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] antialiased">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-slate-200/80 rounded-sm w-48 animate-pulse mb-8" />

        {/* Product Details Skeleton Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
          
          {/* Left: Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main Big Image */}
            <div className="aspect-square w-full bg-slate-200/80 rounded-2xl animate-pulse" />
            {/* Thumbnails Row */}
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-slate-200/80 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>

          {/* Right: Info Section Skeleton */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category/Tag */}
              <div className="h-4 bg-slate-200/80 rounded-md w-24 animate-pulse" />
              
              {/* Product Title */}
              <div className="space-y-2">
                <div className="h-8 bg-slate-200/80 rounded-md w-3/4 animate-pulse" />
                <div className="h-8 bg-slate-200/80 rounded-md w-1/2 animate-pulse" />
              </div>

              {/* Rating Star Row */}
              <div className="h-5 bg-slate-200/80 rounded-md w-36 animate-pulse" />

              {/* Price Tag */}
              <div className="h-9 bg-slate-200/80 rounded-md w-28 animate-pulse mt-4" />

              <hr className="border-slate-200 my-6" />

              {/* Description Lines */}
              <div className="space-y-2.5">
                <div className="h-4 bg-slate-200/80 rounded-md w-full animate-pulse" />
                <div className="h-4 bg-slate-200/80 rounded-md w-full animate-pulse" />
                <div className="h-4 bg-slate-200/80 rounded-md w-5/6 animate-pulse" />
              </div>
            </div>

            {/* Variants Selector */}
            <div className="space-y-3 mt-6">
              <div className="h-4 bg-slate-200/80 rounded-md w-16 animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-16 bg-slate-200/80 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>

            {/* Quantity and CTA Buttons */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="h-12 w-full sm:w-32 bg-slate-200/80 rounded-xl animate-pulse" />
                <div className="h-12 flex-1 bg-slate-200/80 rounded-xl animate-pulse" />
              </div>
              <div className="h-12 w-full bg-slate-200/80 rounded-xl animate-pulse" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}