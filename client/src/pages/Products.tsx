import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const [location] = useLocation();
  const { toast } = useToast();
  
  // Extract the category from the URL, if present
  const urlParams = new URLSearchParams(
    location.includes("?") ? location.split("?")[1] : ""
  );
  const categoryParam = urlParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam
  );
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");

  const { data: categories, isLoading: loadingCategories } = useQuery<
    Category[]
  >({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: [
      selectedCategory
        ? `/api/products?category=${selectedCategory}`
        : "/api/products",
    ],
  });

  // Filter and sort products
  const filteredAndSortedProducts = products
    ? products
        .filter(
          (product) =>
            Number(product.price) >= priceRange[0] &&
            Number(product.price) <= priceRange[1]
        )
        .sort((a, b) => {
          if (sortBy === "price-low") {
            return Number(a.price) - Number(b.price);
          } else if (sortBy === "price-high") {
            return Number(b.price) - Number(a.price);
          } else if (sortBy === "rating") {
            return Number(b.rating) - Number(a.rating);
          } else {
            // featured by default
            return b.featured === a.featured ? 0 : b.featured ? 1 : -1;
          }
        })
    : [];

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar filters */}
        <div className="w-full md:w-64 lg:w-72 mb-8 md:mb-0 md:mr-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Filters</h2>

            {/* Categories filter */}
            <Accordion type="single" collapsible defaultValue="categories">
              <AccordionItem value="categories">
                <AccordionTrigger className="text-base font-medium">
                  Categories
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="all-categories"
                        checked={selectedCategory === null}
                        onCheckedChange={() => handleCategoryChange(null)}
                      />
                      <label
                        htmlFor="all-categories"
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        All Categories
                      </label>
                    </div>
                    {loadingCategories ? (
                      <div className="space-y-2">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="h-6 bg-gray-200 animate-pulse rounded"
                          ></div>
                        ))}
                      </div>
                    ) : (
                      categories?.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategory === category.slug}
                            onCheckedChange={() =>
                              handleCategoryChange(category.slug)
                            }
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Price Range filter */}
            <Accordion type="single" collapsible defaultValue="price">
              <AccordionItem value="price">
                <AccordionTrigger className="text-base font-medium">
                  Price Range
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2">
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={2000}
                      step={10}
                      onValueChange={setPriceRange}
                      className="mb-4"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        ${priceRange[0]}
                      </span>
                      <span className="text-sm text-gray-600">
                        ${priceRange[1]}
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                setSelectedCategory(null);
                setPriceRange([0, 1000]);
                setSortBy("featured");
                toast({
                  title: "Filters Reset",
                  description: "All product filters have been reset.",
                });
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedCategory
                ? categories?.find((cat) => cat.slug === selectedCategory)?.name || "Products"
                : "All Products"}
            </h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort by:</span>
              <select
                className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Best Rating</option>
              </select>
            </div>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or browse our other categories.
              </p>
              <Button onClick={() => handleCategoryChange(null)}>
                View All Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
