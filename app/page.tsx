"use client"

import { useState, useEffect, useMemo } from "react"
import type { Product, FilterOptions, SortOption } from "@/lib/types"
import { getProducts } from "@/lib/storage"
import { filterProducts, sortProducts } from "@/lib/utils"
import ProductCard from "@/components/product-card"
import ProductFilters from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, ShoppingBag } from "lucide-react"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    category: "",
    minPrice: 0,
    maxPrice: 0,
    search: "",
  })
  const [sortBy, setSortBy] = useState<SortOption>("featured")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProducts = () => {
      try {
        const loadedProducts = getProducts()
        setProducts(loadedProducts)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = filterProducts(products, filters)
    return sortProducts(filtered, sortBy)
  }, [products, filters, sortBy])

  const handleResetFilters = () => {
    setFilters({
      category: "",
      minPrice: 0,
      maxPrice: 0,
      search: "",
    })
    setSortBy("featured")
  }

  const featuredProducts = products.filter((product) => product.featured)
  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Welcome to Our Store</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover amazing products at great prices. Browse our collection of {totalProducts} products across multiple
          categories.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <ShoppingBag className="w-5 h-5 mr-2" />
            {totalProducts} Products
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            ⭐ {featuredProducts.length} Featured
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            💰 ${totalValue.toLocaleString()} Total Value
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/admin">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              Manage Products
            </Button>
          </Link>
        </div>
      </div>

      <ProductFilters
        filters={filters}
        sortBy={sortBy}
        onFiltersChange={setFilters}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
      />
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing {filteredAndSortedProducts.length} of {totalProducts} products
        </p>
      </div>

      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
          <Button onClick={handleResetFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
