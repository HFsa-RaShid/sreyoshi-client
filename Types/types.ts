/* eslint-disable @typescript-eslint/no-explicit-any */
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
  _id?: string;            
  productCode: string;    
  name: string;           
  category: string | {    
    _id?: string;
    name?: string;
    image?: string;
    $oid?: string; // 🎯 মঙ্গোডিবি আইডি হ্যান্ডেল করার জন্য
  };       
  brand?: string | {
    _id?: string;
    name?: string;
    $oid?: string;
  };
  subCategory: string;    
  itemName: string;       
  price: number;
  oldPrice?: number;      
  discount?: string;      
  rating: number;         
  ratingCount: number;    
  salesCount: number;     
  promotion?: string;
  availability: 'In Stock' | 'Out of Stock'; 
  status: 'Active' | 'Inactive';     
  commonImages: string[]; 
  weightOrVolume: number; 
  unit: 'gm' | 'ml' | 'pcs';  
  totalStock: number; // 🎯 ডাটাতে থাকা মেইন স্টক ফিল্ড   
  shades?: ProductShade[]; 
  description?: string;
  howToUse?: string;
  createdAt?: any;     
  updatedAt?: any;
}

/**
 * Represents a single group/sub-section inside a category.
 */
export interface SubCategoryItem {
  name: string;
  status: string;
}

export interface SubCategoryGroup {
  id?: string;
  title: string;
  status: string;
  items: SubCategoryItem[]; //  New definition
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