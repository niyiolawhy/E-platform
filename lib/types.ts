export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface  ProductFormData {
  name: string
  description: string
  price: number 
  category: string
  image: string
  stock: number
  featured: boolean
}

export interface FilterOptions {
  category: string
  minPrice: number
  maxPrice: number
  search: string
}

export enum ProductCategory {
  ELECTRONICS = "Electronics",
  CLOTHING = "Clothing",
  HOME = "Home & Garden",
  SPORTS = "Sports & Outdoors",
  BOOKS = "Books",
  BEAUTY = "Beauty & Personal Care",
  TOYS = "Toys & Games",
  AUTOMOTIVE = "Automotive",
}

export type SortOption = "name" | "price-low" | "price-high" | "newest" | "featured"
