import React from "react";
import { Link } from "wouter";
import { Product } from "@/lib/types";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.tag && (
          <div
            className={`absolute top-2 right-2 ${
              product.tag === "Best Seller"
                ? "bg-primary"
                : product.tag === "New Arrival"
                ? "bg-accent"
                : product.tag === "Sale"
                ? "bg-secondary"
                : "bg-primary"
            } text-white text-xs font-semibold px-2 py-1 rounded`}
          >
            {product.tag}
          </div>
        )}
      </div>
      <Link href={`/products/${product.id}`}>
        <a className="block p-4">
          <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-center mb-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(Number(product.rating))
                      ? "fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2">
              ({product.reviews} reviews)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold text-gray-800">
                ${product.price}
              </span>
              {product.tag === "Sale" && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${(Number(product.price) * 1.1).toFixed(2)}
                </span>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default ProductCard;
