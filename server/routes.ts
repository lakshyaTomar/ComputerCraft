import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { v4 as uuidv4 } from "uuid";
import { 
  insertCartItemSchema,
  pcBuilderRequirementsSchema
} from "@shared/schema";
import { generatePCBuildRecommendation } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session ID middleware for cart functionality
  app.use((req, res, next) => {
    let sessionId = req.headers["x-session-id"] as string;
    if (!sessionId) {
      sessionId = uuidv4();
      res.setHeader("X-Session-ID", sessionId);
    }
    (req as any).sessionId = sessionId;
    next();
  });

  // Categories API
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  // Products API
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const { category, featured } = req.query;
      
      if (category) {
        const categoryObj = await storage.getCategoryBySlug(category as string);
        if (!categoryObj) {
          return res.status(404).json({ message: "Category not found" });
        }
        const products = await storage.getProductsByCategory(categoryObj.id);
        return res.json(products);
      }
      
      if (featured === "true") {
        const products = await storage.getFeaturedProducts();
        return res.json(products);
      }
      
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProductById(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  // PC Builder API
  app.post("/api/pc-builder/recommend", async (req: Request, res: Response) => {
    try {
      const requirements = pcBuilderRequirementsSchema.parse(req.body);
      const recommendation = await generatePCBuildRecommendation(requirements);
      
      // Attempt to match recommended components with actual products in our database
      const allProducts = await storage.getAllProducts();
      
      // Map recommended components to actual products where possible
      recommendation.components = recommendation.components.map(component => {
        const matchedProduct = allProducts.find(product => 
          product.name.toLowerCase().includes(component.name.toLowerCase()) ||
          component.name.toLowerCase().includes(product.name.toLowerCase())
        );
        
        if (matchedProduct) {
          return {
            ...component,
            id: matchedProduct.id,
            image: matchedProduct.image
          };
        }
        
        return component;
      });
      
      // Save the build to database
      const savedBuild = await storage.createPCBuild({
        purpose: requirements.purpose,
        requirements: requirements,
        recommendations: recommendation,
        totalPrice: recommendation.totalPrice,
      });
      
      res.json({
        buildId: savedBuild.id,
        ...recommendation
      });
    } catch (error) {
      console.error("PC Builder recommendation error:", error);
      res.status(500).json({ message: "Error generating PC build recommendation" });
    }
  });

  app.get("/api/pc-builder/:id", async (req: Request, res: Response) => {
    try {
      const build = await storage.getPCBuildById(parseInt(req.params.id));
      if (!build) {
        return res.status(404).json({ message: "PC Build not found" });
      }
      res.json(build);
    } catch (error) {
      res.status(500).json({ message: "Error fetching PC Build" });
    }
  });

  // Cart API
  app.get("/api/cart", async (req: Request, res: Response) => {
    try {
      const sessionId = (req as any).sessionId;
      const cartItems = await storage.getCartItems(sessionId);
      
      // Fetch product details for each cart item
      const cartItemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return {
            ...item,
            product,
          };
        })
      );
      
      res.json(cartItemsWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart" });
    }
  });

  app.post("/api/cart", async (req: Request, res: Response) => {
    try {
      const sessionId = (req as any).sessionId;
      const cartItemData = { ...req.body, sessionId };
      
      const validatedData = insertCartItemSchema.parse(cartItemData);
      
      // Check if product exists
      const product = await storage.getProductById(validatedData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if item already exists in cart
      const existingItem = await storage.getCartItemByProductId(
        validatedData.productId,
        sessionId
      );
      
      if (existingItem) {
        // Update quantity instead of creating new item
        const updatedItem = await storage.updateCartItemQuantity(
          existingItem.id,
          existingItem.quantity + validatedData.quantity
        );
        
        return res.json(updatedItem);
      }
      
      // Add new item to cart
      const cartItem = await storage.createCartItem(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Error adding item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const { quantity } = req.body;
      
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedItem = await storage.updateCartItemQuantity(
        parseInt(req.params.id),
        quantity
      );
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Error updating cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.removeCartItem(parseInt(req.params.id));
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error removing cart item" });
    }
  });

  app.delete("/api/cart", async (req: Request, res: Response) => {
    try {
      const sessionId = (req as any).sessionId;
      await storage.clearCart(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error clearing cart" });
    }
  });

  // Order processing (mock checkout)
  app.post("/api/checkout", async (req: Request, res: Response) => {
    try {
      const sessionId = (req as any).sessionId;
      const { shippingInfo, paymentInfo } = req.body;
      
      // Get cart items
      const cartItems = await storage.getCartItems(sessionId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // In a real application, we would process payment and create an order
      // For this demo, we'll just clear the cart and return success
      
      await storage.clearCart(sessionId);
      
      res.json({
        success: true,
        orderId: `ORD-${Date.now()}`,
        message: "Order placed successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Error processing checkout" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
