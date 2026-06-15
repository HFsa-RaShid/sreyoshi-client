/**
 * Represents the skin type suitability for a skin care product.
 * (ব্যাকএন্ড স্কিমা ও ফ্রন্টএন্ড ফিল্টারিংয়ের সাথে মিল রেখে)
 */
export type SkinType = 'Normal' | 'Dry' | 'Oily' | 'Combination' | 'Sensitive' | 'All Skin Types';

/**
 * Represents promotional tags or labels for items.
 * (ব্যাকএন্ড স্কিমার enum: ['Best Sellers', 'New Arrivals', 'Trending'] এর সাথে হুবহু মিল)
 */
export type PromotionTag = 'Best Sellers' | 'New Arrivals' | 'Trending';

/**
 * Represents stock availability status.
 * (ব্যাকএন্ড স্কিমার enum: ['In Stock', 'Out of Stock'] এর সাথে হুবহু মিল)
 */
export type AvailabilityStatus = 'In Stock' | 'Out of Stock';

/**
 * Represents the product status.
 */
export type StatusType = 'Active' | 'Inactive';

/**
 * Represents a single makeup shade item inside the product.
 * (⚡ ব্যাকএন্ড স্কিমার productShadeSchema এর সাথে হুবহু মিল রেখে ফিক্সড করা হলো)
 */
export interface ProductShade {
  shadeName: string;
  shadeColorCode?: string; // ব্যাকএন্ডে required: false ছিল, তাই অপশনাল
  shadeImage: string;      // ⚡ ব্যাকএন্ডে required: true ছিল, তাই অপশনাল (!) তুলে দেওয়া হলো
  stock: number;          // ⚡ ব্যাকএন্ডে required: true ছিল, ডিফল্ট ০
  status?: StatusType;    // ⚡ ব্যাকএন্ডে enum: ['Active', 'Inactive'] ছিল, তাই কাস্টম টাইপ
}

/**
 * Detailed structure for a Product item.
 * (⚡ আপনার মঙ্গুস স্কিমার IProduct ইন্টারফেসের সাথে ১০০% ম্যাচড)
 */
export interface Product {
  _id?: string;            // মঙ্গোডিবি থেকে আসা রিয়াল আইডি
  productCode: string;    // ব্যাকএন্ডে unique ও required
  name: string;           // ব্যাকএন্ড ফিল্ডের নাম 'name'
  category: string | {    // ⚡ ক্যাটাগরি আইডি অথবা পপুলেট হয়ে আসা ক্যাটাগরি অবজেক্ট দুটোই হতে পারে
    _id: string;
    name: string;
    image?: string;
  };       
  subCategory: string;    // ব্যাকএন্ডে uppercase: true লজিক হ্যান্ডেল করা
  itemName: string;       // ব্যাকএন্ডে required ফিল্ড
  skinType?: SkinType;    
  price: number;
  oldPrice?: number;      
  discount?: string;      // ব্যাকএন্ড স্কিমাতে string টাইপ ছিল (যেমন: "10%")
  rating: number;         // ডিফল্ট ০
  ratingCount: number;    // ডিফল্ট ০
  salesCount: number;     // ডিফল্ট ০
  promotion?: PromotionTag;
  availability: AvailabilityStatus; // ডিফল্ট 'In Stock'
  status: StatusType;     // ⚡ মেইন প্রোডাক্টের স্ট্যাটাস ('Active' | 'Inactive')
  commonImages: string[]; // ⚡ ব্যাকএন্ড স্কিমা অনুযায়ী 'images' এর বদলে 'commonImages' হবে
  weightOrVolume: number; 
  unit: 'gm' | 'ml';      // ব্যাকএন্ডের enum: ['gm', 'ml']
  shades?: ProductShade[]; 
  createdAt?: string;     // timestamps: true থেকে জেনারেট হওয়া ISO ডেট
  updatedAt?: string;
}

/**
 * Represents a single group/sub-section inside a category.
 */
export interface SubCategoryGroup {
  title: string;          // যেমন: "LIPS", "FACE"
  items: string[];        // যেমন: ["Lipstick", "Foundation", "Liquid Lipstick"]
}

/**
 * Structure for a main Category.
 * (⚡ ক্যাটাগরি স্কিমার সাথে মিল রেখে ফিক্সড)
 */
export interface Category {
  _id: string;            // মঙ্গোডিবি এর ইউনিক আইডি
  name: string;           // ক্যাটাগরি নাম (যেমন: "Makeup")
  image?: string;         // ক্যাটাগরি ব্যানার বা আইকন ইমেজ
  subCategories: SubCategoryGroup[];
  createdAt?: string;
  updatedAt?: string;
}