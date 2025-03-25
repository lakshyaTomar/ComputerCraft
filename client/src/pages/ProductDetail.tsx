import React from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Star, ChevronLeft } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-1/4 mb-4 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 w-full rounded"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-10 w-3/4 rounded"></div>
              <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
              <div className="bg-gray-200 h-24 w-full rounded"></div>
              <div className="bg-gray-200 h-10 w-1/4 rounded"></div>
              <div className="bg-gray-200 h-12 w-1/3 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Link href="/products">
        <a className="inline-flex items-center text-primary mb-6 hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </a>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
        </div>

        <div>
          <div className="mb-4">
            {product.tag && (
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${
                  product.tag === "Best Seller"
                    ? "bg-primary text-white"
                    : product.tag === "New Arrival"
                    ? "bg-accent text-white"
                    : "bg-secondary text-white"
                }`}
              >
                {product.tag}
              </span>
            )}
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(Number(product.rating))
                        ? "fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({product.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-800">
              ${product.price}
            </span>
            {product.tag === "Sale" && (
              <span className="text-lg text-gray-500 line-through ml-2">
                ${(Number(product.price) * 1.1).toFixed(2)}
              </span>
            )}
          </div>

          <div className="mb-8">
            <p className="text-green-600 flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              In Stock: {product.stock} available
            </p>
            <Button
              size="lg"
              className="w-full md:w-auto"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="specifications">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="specifications" className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications as Record<string, any>).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="border-b border-gray-100 pb-2 flex justify-between"
                    >
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="font-medium text-gray-800">{value}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="compatibility" className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Compatibility Information
              </h3>
              <p className="text-gray-600 mb-4">
                This product has been verified to be compatible with the
                following systems and components:
              </p>
              {/* Would show compatibility details from API */}
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Compatible with all standard ATX motherboards</li>
                <li>Requires PCIe 4.0 x16 slot for optimal performance</li>
                <li>Minimum 650W power supply recommended</li>
                <li>Works with Windows 10/11 and Linux operating systems</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Customer Reviews ({product.reviews})
              </h3>
              <div className="flex items-center mb-6">
                <div className="flex text-amber-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(Number(product.rating))
                          ? "fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-800 font-medium">
                  {product.rating} out of 5
                </span>
              </div>
              {/* Sample reviews - would come from API */}
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center mb-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 5 ? "fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <h4 className="ml-2 font-medium text-gray-800">
                      Great product!
                    </h4>
                  </div>
                  <p className="text-gray-600 mb-1">
                    This exceeded my expectations. Performance is outstanding and
                    it runs cool even under heavy loads.
                  </p>
                  <p className="text-gray-500 text-sm">
                    By John D. on September 15, 2023
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center mb-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? "fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <h4 className="ml-2 font-medium text-gray-800">
                      Good value
                    </h4>
                  </div>
                  <p className="text-gray-600 mb-1">
                    Solid performance for the price. Installation was easy and
                    it's been working great for a month now.
                  </p>
                  <p className="text-gray-500 text-sm">
                    By Sarah M. on August 22, 2023
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
