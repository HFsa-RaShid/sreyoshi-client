/**
 * Represents the skin type suitability for a skin care product.
 */
export type SkinType = 'Normal' | 'Dry' | 'Oily' | 'Combination' | 'Sensitive' | 'All';

/**
 * Represents promotional tags or labels for items.
 */
export type PromotionTag = 'Best Sellers' | 'New Arrivals' | 'Trending';

/**
 * Represents stock availability status.
 */
export type AvailabilityStatus = 'In Stock' | 'Out of Stock';

/**
 * Represents a single makeup shade item.
 */
export interface ProductShade {
  shadeName: string;
  shadeColorCode?: string;
  shadeImage?: string; // Cloudinary URL
  isActive: boolean;
}

/**
 * Detailed structure for a Product item.
 */
export interface Product {
  _id?: string;           // ⚡ মঙ্গোডিবি থেকে আসা রিয়াল আইডি (ঐচ্ছিক রাখা হয়েছে সেফটির জন্য)
  productCode: string;    // ⚡ আমাদের ইউনিক কোড (যেমন: "lip-matte-01")
  name: string;
  category: string;       // ক্যাটাগরি আইডি (যেমন পপুলেট করা অবজেক্ট আইডি)
  subCategory: string;    
  skinType?: SkinType;    
  price: number;
  oldPrice?: number;      
  discount?: string;      
  rating: number;
  ratingCount: number;
  salesCount: number;
  createdAt?: string;      // ISO Date string (timestamps থেকে আসবে)
  updatedAt?: string;
  promotion?: PromotionTag;
  availability: AvailabilityStatus;
  images: string[];       
  weightOrVolume: number; // ⚡ ব্যাকএন্ড স্কিমার সাথে মিল রেখে যুক্ত করা হলো
  unit: 'gm' | 'ml';      // ⚡ ব্যাকএন্ড স্কিমার সাথে মিল রেখে যুক্ত করা হলো
  shades?: ProductShade[]; // ⚡ মেকআপ ক্যাটাগরির শেড হ্যান্ডেল করার জন্য কাস্টম টাইপ
}

/**
 * Represents a single group/sub-section inside a category.
 */
export interface SubCategoryGroup {
  title: string;          
  items: string[];        
}

/**
 * Structure for a main Category.
 */
export interface Category {
  _id: string;            // ⚡ মঙ্গোডিবি এর ইউনিক আইডি
  name: string;
  image: string;         
  subCategories: SubCategoryGroup[];
  createdAt?: string;
  updatedAt?: string;
}