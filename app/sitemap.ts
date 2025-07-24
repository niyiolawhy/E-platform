import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/storage"
import { generateProductSlug } from "@/lib/utils"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://E-commerce-platform.com"

  const products = getProducts()

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}/${generateProductSlug(product.name)}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...productRoutes]
}
