import type { Product, ProductFormData } from "./types"

const STORAGE_KEY = "ecommerce_products"
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 199.99,
    category: "Electronics",
    image: "/placeholder.svg?height=400&width=400",
    stock: 25,
    featured: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Premium Cotton T-Shirt",
    description: "Comfortable 100% organic cotton t-shirt available in multiple colors.",
    price: 29.99,
    category: "Clothing",
    image: "/placeholder.svg?height=400&width=400",
    stock: 50,
    featured: false,
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "3",
    name: "Smart Home Security Camera",
    description: "1080p HD security camera with night vision and mobile app integration.",
    price: 149.99,
    category: "Electronics",
    image: "/placeholder.svg?height=400&width=400",
    stock: 15,
    featured: true,
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z",
  },
  {
    id: "4",
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat with extra cushioning for comfortable practice.",
    price: 49.99,
    category: "Sports & Outdoors",
    image: "/placeholder.svg?height=400&width=400",
    stock: 30,
    featured: false,
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "5",
    name: "Ceramic Plant Pot Set",
    description: "Set of 3 decorative ceramic plant pots perfect for indoor plants.",
    price: 39.99,
    category: "Home & Garden",
    image: "/placeholder.svg?height=400&width=400",
    stock: 20,
    featured: false,
    createdAt: "2024-01-19T10:00:00Z",
    updatedAt: "2024-01-19T10:00:00Z",
  },
  {
    id: "6",
    name: "JavaScript Programming Book",
    description: "Complete guide to modern JavaScript programming with practical examples.",
    price: 34.99,
    category: "Books",
    image: "/placeholder.svg?height=400&width=400",
    stock: 40,
    featured: true,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
]

export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProducts))
    return sampleProducts
  }

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProducts))
    return sampleProducts
  }
}

export const getProductById = (id: string): Product | null => {
  const products = getProducts()
  return products.find((product) => product.id === id) || null
}

export const saveProduct = (productData: ProductFormData): Product => {
  const products = getProducts()
  const now = new Date().toISOString()

  const newProduct: Product = {
    id: Date.now().toString(),
    ...productData,
    createdAt: now,
    updatedAt: now,
  }

  const updatedProducts = [...products, newProduct]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts))

  return newProduct
}

export const updateProduct = (id: string, productData: ProductFormData): Product | null => {
  const products = getProducts()
  const index = products.findIndex((product) => product.id === id)

  if (index === -1) return null

  const updatedProduct: Product = {
    ...products[index],
    ...productData,
    updatedAt: new Date().toISOString(),
  }

  products[index] = updatedProduct
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))

  return updatedProduct
}

export const deleteProduct = (id: string): boolean => {
  const products = getProducts()
  const filteredProducts = products.filter((product) => product.id !== id)

  if (filteredProducts.length === products.length) return false

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts))
  return true
}

export const getCategories = (): string[] => {
  const products = getProducts()
  const categories = [...new Set(products.map((product) => product.category))]
  return categories.sort()
}
