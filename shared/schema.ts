import { pgTable, text, serial, integer, boolean, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  icon: true,
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  image: text("image").notNull(),
  categoryId: integer("category_id").notNull(),
  stock: integer("stock").notNull().default(0),
  specifications: jsonb("specifications").notNull(),
  featured: boolean("featured").notNull().default(false),
  rating: numeric("rating").notNull().default(0),
  reviews: integer("reviews").notNull().default(0),
  tag: text("tag"),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const pcBuilds = pgTable("pc_builds", {
  id: serial("id").primaryKey(),
  purpose: text("purpose").notNull(),
  requirements: jsonb("requirements").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  totalPrice: numeric("total_price").notNull(),
});

export const insertPCBuildSchema = createInsertSchema(pcBuilds).omit({
  id: true,
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  sessionId: text("session_id").notNull(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type PCBuild = typeof pcBuilds.$inferSelect;
export type InsertPCBuild = z.infer<typeof insertPCBuildSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

// Validation schemas for requests
export const pcBuilderRequirementsSchema = z.object({
  purpose: z.string(),
  budget: z.string(),
  performance: z.string(),
  storage: z.string(),
  resolution: z.string(),
  additionalRequirements: z.string().optional(),
});

export type PCBuilderRequirements = z.infer<typeof pcBuilderRequirementsSchema>;
