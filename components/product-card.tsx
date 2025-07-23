"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { formatPrice, generateProductSlug } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Edit, Trash2, Star } from "lucide-react"

interface ProductCardProps {
  product: Product
  showActions?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (id: string) => void
}

export default function ProductCard({ product, showActions = false, onEdit, onDelete }: ProductCardProps) {
  const productSlug = generateProductSlug(product.name)

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}/${productSlug}`}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-900">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Low Stock
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <Link href={`/products/${product.id}/${productSlug}`}>
            <h3 className="font-semibold truncate text-lg line-clamp-2 hover:text-blue-600 transition-colors">{product.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>
            <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
          </div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit?.(product)} className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete?.(product.id)} className="flex-1">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
