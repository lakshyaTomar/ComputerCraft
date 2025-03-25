import React from "react";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/lib/types";
import { useCart } from "@/lib/context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateCartItemQuantity, removeFromCart } = useCart();

  const handleIncreaseQuantity = () => {
    updateCartItemQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200 last:border-none">
      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="font-medium text-gray-800">{item.product.name}</h3>
        <p className="text-sm text-gray-500">{item.product.description}</p>
        <span className="text-gray-700 font-medium mt-1 block">
          ${item.product.price}
        </span>
      </div>
      <div className="flex items-center ml-4">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={handleDecreaseQuantity}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="mx-2 w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={handleIncreaseQuantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-right ml-4 w-24">
        <div className="font-medium text-gray-800">
          ${(Number(item.product.price) * item.quantity).toFixed(2)}
        </div>
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 mt-1 flex items-center justify-end text-sm"
        >
          <X className="h-4 w-4 mr-1" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
