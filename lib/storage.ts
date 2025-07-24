import type { Product, ProductFormData } from "./types"

const STORAGE_KEY = "ecommerce_products"
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 199.99,
    category: "Electronics",
    image: "https://i.pinimg.com/736x/17/64/d5/1764d599ee004bfcb4823077a8221f71.jpg",
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
    image: "https://i.pinimg.com/1200x/f2/0c/64/f20c64cf9531243cfd90c611b08eab02.jpg",
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
    image: "https://i.pinimg.com/736x/59/1c/23/591c23cccfc79ea05752e9105e9411b5.jpg",
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
    image: "https://i.pinimg.com/1200x/48/d9/40/48d94098fd5b142bc97b05bc4b2cfcef.jpg",
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
    image: "https://i.pinimg.com/1200x/02/6b/c6/026bc6f22b877087ea10f08b7b9300d1.jpg",
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
    image: "https://i.pinimg.com/1200x/a0/55/60/a055605433b7699874a5f9b61b491a59.jpg",
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
