import { Category, Product, PCBuilderRequirements, PCBuildRecommendation } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

// Category Functions
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch("/api/categories");
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`/api/categories/${slug}`);
    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category with slug ${slug}:`, error);
    return null;
  }
}

// Product Functions
export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch("/api/products?featured=true");
    if (!response.ok) {
      throw new Error("Failed to fetch featured products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?category=${categorySlug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products for category ${categorySlug}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error);
    return [];
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}

// PC Builder Functions
export async function getPCBuildRecommendations(
  requirements: PCBuilderRequirements
): Promise<PCBuildRecommendation> {
  // We're not handling errors here because we want them to propagate
  // to the UI component so they can be properly displayed there.
  // The error handling will be done in the PCBuilderWizard component.
  const response = await apiRequest("POST", "/api/pc-builder/recommend", requirements);
  return response;
}

export async function getPCBuildById(buildId: number): Promise<PCBuildRecommendation | null> {
  try {
    const response = await fetch(`/api/pc-builder/${buildId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch PC build with ID ${buildId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching PC build with ID ${buildId}:`, error);
    return null;
  }
}

// Cart Functions
export async function getCartItems(): Promise<any[]> {
  try {
    const response = await fetch("/api/cart");
    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
}

export async function addItemToCart(productId: number, quantity: number = 1): Promise<any> {
  try {
    const response = await apiRequest("POST", "/api/cart", { productId, quantity });
    return response;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
}

export async function updateCartItem(itemId: number, quantity: number): Promise<any> {
  try {
    const response = await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
    return response;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
}

export async function removeCartItem(itemId: number): Promise<any> {
  try {
    const response = await apiRequest("DELETE", `/api/cart/${itemId}`);
    return response;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
}

export async function clearCart(): Promise<any> {
  try {
    const response = await apiRequest("DELETE", "/api/cart");
    return response;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}

// Checkout Functions
export async function processCheckout(checkoutData: any): Promise<any> {
  try {
    const response = await apiRequest("POST", "/api/checkout", checkoutData);
    return response;
  } catch (error) {
    console.error("Error processing checkout:", error);
    throw error;
  }
}
