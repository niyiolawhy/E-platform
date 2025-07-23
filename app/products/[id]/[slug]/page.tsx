"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/storage";
import { formatPrice, formatDate, generateProductSlug } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Star, Package, Calendar, Tag } from "lucide-react";
import { Product } from "@/lib/types";

export default function ProductPage() {
  const { id, slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const products = getProducts();
    const found = products.find((p) => p.id === id);
    if (!found) return;

    const expectedSlug = generateProductSlug(found.name);
    if (slug !== expectedSlug) {
      router.replace(`/product/${found.id}/${expectedSlug}`);
    } else {
      setProduct(found);
    }
  }, [id, slug, router]);

  if (!product) {
    return <div className="p-6 text-center">Product not found or loading...</div>;
  }

  const isInStock = product.stock > 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.featured && (
              <Badge className="absolute top-4 left-4 bg-yellow-500 text-yellow-900">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              <Tag className="w-3 h-3 mr-1" />
              {product.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-green-600">{formatPrice(product.price)}</span>
              {product.featured && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">⭐ Featured Product</Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Stock:</span>
                <span
                  className={`font-semibold ${
                    !isInStock ? "text-red-600" : isLowStock ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {!isInStock
                    ? "Out of Stock"
                    : isLowStock
                      ? `Only ${product.stock} left`
                      : `${product.stock} available`}
                </span>
              </div>
            </div>

            {isLowStock && isInStock && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800 font-medium">⚠️ Hurry! Only {product.stock} items left in stock</p>
              </div>
            )}

            {!isInStock && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">😞 This item is currently out of stock</p>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Added</span>
                  </div>
                  <p className="text-sm text-gray-600">{formatDate(product.createdAt)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Category</span>
                  </div>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/admin" className="flex-1">
              <Button className="w-full" size="lg">
                Manage This Product
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
