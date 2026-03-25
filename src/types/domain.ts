export type Material =
  | "stainless_steel"
  | "cast_iron"
  | "non_stick"
  | "ceramic"
  | "aluminum"
  | "hard_anodized"
  | "copper"
  | "carbon_steel"
  | "glass"
  | "enameled_cast_iron"
  | string;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_future_collection: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string;
  stock: number;
  category_id: string | null;
  material: string | null;
  dimensions: string | null;
  weight: string | null;
  featured: boolean;
  best_seller: boolean;
  care_instructions: string | null;
  shipping_info: string | null;
  tags: string[] | null;
  rating: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
  categories?: Pick<Category, "name" | "slug"> | null;
  product_images?: ProductImage[];
}

export interface CartLine {
  productId: string;
  qty: number;
}

export interface Review {
  id: string;
  product_id: string;
  author_name: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  subtitle: string | null;
  image_url: string | null;
  rating: number | null;
}

export interface HomepageSection {
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body: Record<string, unknown>;
}

export interface DeliveryZone {
  id: string;
  name: string;
  slug: string;
  fee_ghs: number;
  free_over_ghs: number | null;
  eta_hours_min: number | null;
  eta_hours_max: number | null;
}
