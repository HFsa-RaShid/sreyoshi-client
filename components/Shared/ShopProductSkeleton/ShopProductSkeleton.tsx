export function ShopProductSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100/40 relative overflow-hidden animate-pulse w-full">
      
      {/* 1. Product Image Box Skeleton (Best Sellers কার্ডের মতো স্কয়ার 1:1) */}
      <div className="w-full aspect-square bg-slate-200" />

      {/* 2. Content Info Area */}
      <div className="mt-2 flex flex-col grow justify-between px-4 pb-4">
        <div>
          {/* Subcategory Label Skeleton */}
          <div className="h-3 bg-slate-200 rounded-md w-1/3 mb-2 mt-1" />
          
          {/* Product Title Skeletons (২ লাইনের টাইটেল স্পেস হোল্ডার) */}
          <div className="h-4 bg-slate-200 rounded-md w-11/12 mb-1.5" />
          <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-2" />
          
          {/* Rating Stars Skeleton */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-slate-200 rounded-full" />
              ))}
            </div>
            <div className="h-3 bg-slate-100 rounded-md w-8 ml-1" />
          </div>
        </div>

        {/* 3. Price, Metric & Button Area */}
        <div className="flex flex-col gap-1 mt-4">
          {/* Net Weight/Volume Metric Skeleton */}
          <div className="h-3 bg-slate-100 rounded-md w-1/2 mb-1" />
          
          {/* Price Tag & Small Plus Button Loader Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-6 bg-slate-200 rounded-md w-24" />
          </div>

          {/* Bottom Action Button (Buy Now / Move to Bag বাটন লোডার) */}
          <div className="w-full h-10 bg-slate-200 rounded-xl" />
        </div>
      </div>

    </div>
  );
}