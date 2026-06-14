/**
 * Represents the skin type suitability for a skin care product.
 */
export type SkinType = 'Normal' | 'Dry' | 'Oily' | 'Combination' | 'Sensitive' | 'All';

/**
 * Represents promotional tags or labels for items.
 */
export type PromotionTag = 'Best Sellers' | 'New Arrivals' | 'Sale' | 'Trending' | 'None';

/**
 * Represents stock availability status.
 */
export type AvailabilityStatus = 'In Stock' | 'Out of Stock' | 'Pre-order';

/**
 * Detailed structure for a Product item.
 */
export interface Product {
  id: string;
  name: string;
  category: string;       // e.g., 'skin-care', 'makeup'
  subCategory: string;    // e.g., 'Serums/Oils', 'Foundation'
  skinType?: SkinType;    // Optional, mainly for skin-care category
  price: number;
  oldPrice?: number;      // Optional, if there's a discount
  discount?: string;      // Optional, e.g., '50% off'
  rating: number;
  ratingCount: number;
  salesCount: number;
  createdAt: string;      // ISO Date string
  promotion?: PromotionTag;
  availability: AvailabilityStatus;
  images: string[];       // Array of image URLs
}

/**
 * Represents a single group/sub-section inside a category.
 */
export interface SubCategoryGroup {
  title: string;          // e.g., 'FACE', 'EYES', 'FEMININE HYGIENE'
  items: string[];        // Array of specific sub-category items
}

/**
 * Structure for a main Category.
 */
export interface Category {
  id: string;
  name: string;
  image?: string;         // Optional image URL representing the category
  subCategories: SubCategoryGroup[];
}