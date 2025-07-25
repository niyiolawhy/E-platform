"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductFormData } from "@/lib/types";
import {
  getProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/storage";
import ProductCard from "@/components/product-card";
import ProductForm from "@/components/product-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Package, TrendingUp, AlertTriangle, Home } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const router = useRouter();

  // Paginated products for current page
  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    try {
      const loadedProducts = getProducts();
      setProducts(loadedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    }
  };

  const handleSaveProduct = async (formData: ProductFormData) => {
    setIsLoading(true);
    try {
      if (editingProduct) {
        const updated = updateProduct(editingProduct.id, formData);
        if (updated) {
          toast({
            title: "Success",
            description: "Product updated successfully",
          });
        }
      } else {
        saveProduct(formData);
        toast({
          title: "Success",
          description: "Product added successfully",
        });
        setActiveTab("products"); // Switch to products tab after add
      }

      loadProducts();
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
    setActiveTab("form");
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const success = deleteProduct(id);
      if (success) {
        loadProducts();
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
    setDeleteProductId(null);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
    setActiveTab("form");
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setActiveTab("overview");
  };

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const lowStockProducts = products.filter(
    (product) => product.stock <= 5 && product.stock > 0
  );
  const outOfStockProducts = products.filter((product) => product.stock === 0);
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage your product inventory and details
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val);
          if (val === "form") handleAddNew();
        }}
        className="space-y-6"
      >
        <TabsList className="flex w-full overflow-x-auto sm:grid sm:grid-cols-3 gap-2 sm:gap-0 min-w-max">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products ({totalProducts})</TabsTrigger>
          <TabsTrigger
            value="form"
            disabled={showForm ? false : undefined}
            onClick={handleAddNew}
          >
            {editingProduct ? "Edit Product" : "Add Product"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Summary Cards */}
            {[
              {
                title: "Total Products",
                icon: <Package className="h-4 w-4 text-muted-foreground" />,
                value: totalProducts,
                subtitle: `${featuredProducts.length} featured`,
              },
              {
                title: "Total Value",
                icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
                value: `$${totalValue.toLocaleString()}`,
                subtitle: "Inventory value",
              },
              {
                title: "Low Stock",
                icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
                value: lowStockProducts.length,
                subtitle: "≤ 5 items remaining",
                color: "text-orange-600",
              },
              {
                title: "Out of Stock",
                icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
                value: outOfStockProducts.length,
                subtitle: "Need restocking",
                color: "text-red-600",
              },
            ].map((card, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${card.color || ""}`}>
                    {card.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {card.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
            <div className="space-y-4">
              {outOfStockProducts.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Out of Stock Products ({outOfStockProducts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 gap-y-3">
                      {outOfStockProducts.map((product) => (
                        <Badge key={product.id} variant="destructive">
                          {product.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              {lowStockProducts.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Low Stock Products ({lowStockProducts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 gap-y-3">
                      {lowStockProducts.map((product) => (
                        <Badge
                          key={product.id}
                          variant="secondary"
                          className="bg-orange-100 text-orange-800"
                        >
                          {product.name} ({product.stock} left)
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recently Added Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .slice(0, 6)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      showActions={true}
                      onEdit={handleEditProduct}
                      onDelete={(id) => setDeleteProductId(id)}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showActions={true}
                    onEdit={handleEditProduct}
                    onDelete={(id) => setDeleteProductId(id)}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.max(1, p - 1));
                        }}
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                        }}
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-gray-600 mb-4">
                  Get started by adding your first product
                </p>
                <Button onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="form">
          {showForm && (
            <ProductForm
              product={editingProduct || undefined}
              onSave={handleSaveProduct}
              onCancel={handleCancelForm}
              isLoading={isLoading}
            />
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={!!deleteProductId}
        onOpenChange={() => setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteProductId && handleDeleteProduct(deleteProductId)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
