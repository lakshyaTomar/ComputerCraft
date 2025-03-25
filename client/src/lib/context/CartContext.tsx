import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CartItem, Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextProps {
  items: CartItem[];
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateCartItemQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Ensure session ID is set
  useEffect(() => {
    const getSessionId = () => {
      // Try to get from response headers first
      const sessionIdFromHeader = document.querySelector('meta[name="x-session-id"]')?.getAttribute('content');
      
      // If not available, check localStorage
      let id = sessionIdFromHeader || localStorage.getItem("cart_session_id");
      
      // If still not available, generate a new one
      if (!id) {
        id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("cart_session_id", id);
      }
      
      return id;
    };
    
    setSessionId(getSessionId());
  }, []);

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    enabled: !!sessionId,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: number; quantity: number }) =>
      apiRequest("POST", "/api/cart", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update cart item quantity mutation
  const updateCartItemMutation = useMutation({
    mutationFn: (data: { id: number; quantity: number }) =>
      apiRequest("PUT", `/api/cart/${data.id}`, { quantity: data.quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/cart/${id}`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", "/api/cart", undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  // Add to cart function
  const addToCart = (productId: number, quantity: number = 1) => {
    if (!sessionId) return;
    addToCartMutation.mutate({ productId, quantity });
  };

  // Update cart item quantity function
  const updateCartItemQuantity = (itemId: number, quantity: number) => {
    updateCartItemMutation.mutate({ id: itemId, quantity });
  };

  // Remove from cart function
  const removeFromCart = (itemId: number) => {
    removeFromCartMutation.mutate(itemId);
  };

  // Clear cart function
  const clearCart = () => {
    clearCartMutation.mutate();
  };

  const value = {
    items: cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartTotal,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
