import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  categories, type Category, type InsertCategory,
  pcBuilds, type PCBuild, type InsertPCBuild,
  cartItems, type CartItem, type InsertCartItem
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // PC Builds
  createPCBuild(pcBuild: InsertPCBuild): Promise<PCBuild>;
  getPCBuildById(id: number): Promise<PCBuild | undefined>;
  
  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  getCartItemById(id: number): Promise<CartItem | undefined>;
  getCartItemByProductId(productId: number, sessionId: string): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private pcBuilds: Map<number, PCBuild>;
  private cartItems: Map<number, CartItem>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private pcBuildIdCounter: number;
  private cartItemIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.pcBuilds = new Map();
    this.cartItems = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.pcBuildIdCounter = 1;
    this.cartItemIdCounter = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Initialize categories
    const categoryData: InsertCategory[] = [
      { name: "Processors", slug: "processors", icon: "cpu" },
      { name: "Graphics Cards", slug: "graphics-cards", icon: "gpu" },
      { name: "Memory", slug: "memory", icon: "memory" },
      { name: "Storage", slug: "storage", icon: "database" },
      { name: "Motherboards", slug: "motherboards", icon: "chip" },
      { name: "Power Supplies", slug: "power-supplies", icon: "zap" }
    ];
    
    categoryData.forEach(category => this.createCategory(category));
    
    // Initialize products
    const productData: InsertProduct[] = [
      {
        name: "AMD Ryzen 7 5800X",
        description: "8-Core, 16-Thread Desktop Processor",
        price: "369.99",
        image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 1,
        stock: 25,
        specifications: {
          cores: 8,
          threads: 16,
          baseFrequency: "3.8 GHz",
          boostFrequency: "4.7 GHz",
          tdp: 105,
          socket: "AM4"
        },
        featured: true,
        rating: "4.7",
        reviews: 243,
        tag: "Best Seller"
      },
      {
        name: "NVIDIA GeForce RTX 3070",
        description: "8GB GDDR6 Graphics Card",
        price: "599.99",
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf899?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 2,
        stock: 15,
        specifications: {
          memory: "8GB GDDR6",
          boostClock: "1.73 GHz",
          cudaCores: 5888,
          rtCores: 46,
          tensorCores: 184
        },
        featured: true,
        rating: "4.8",
        reviews: 189,
        tag: "New Arrival"
      },
      {
        name: "Corsair Vengeance RGB Pro",
        description: "32GB DDR4-3600 Memory Kit",
        price: "159.99",
        image: "https://images.unsplash.com/photo-1592664474496-8b8c0ef2cbf8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 3,
        stock: 50,
        specifications: {
          capacity: "32GB (2x16GB)",
          speed: "3600MHz",
          timing: "CL18",
          voltage: "1.35V",
          rgb: true
        },
        featured: true,
        rating: "4.5",
        reviews: 124,
        tag: "Sale"
      },
      {
        name: "Samsung 970 EVO Plus",
        description: "1TB NVMe M.2 SSD",
        price: "149.99",
        image: "https://images.unsplash.com/photo-1600348712270-5a9563d8635a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 4,
        stock: 35,
        specifications: {
          capacity: "1TB",
          interface: "PCIe Gen 3.0 x4, NVMe 1.3",
          formFactor: "M.2 2280",
          sequential_read: "3,500 MB/s",
          sequential_write: "3,300 MB/s"
        },
        featured: true,
        rating: "4.6",
        reviews: 98
      },
      {
        name: "MSI MAG B550 TOMAHAWK",
        description: "AMD AM4 ATX Gaming Motherboard",
        price: "179.99",
        image: "https://images.unsplash.com/photo-1592664474496-8b8c0ef2cbf8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 5,
        stock: 20,
        specifications: {
          chipset: "AMD B550",
          socket: "AM4",
          memorySlots: 4,
          maxMemory: "128GB",
          pciSlots: "PCIe 4.0 x16, PCIe 3.0 x16",
          sataConnectors: 6
        },
        featured: false,
        rating: "4.4",
        reviews: 78
      },
      {
        name: "Corsair RM750x",
        description: "750W 80+ Gold Certified Power Supply",
        price: "129.99",
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 6,
        stock: 30,
        specifications: {
          wattage: "750W",
          efficiency: "80+ Gold",
          modular: "Fully Modular",
          fanSize: "135mm",
          mtbf: "100,000 hours"
        },
        featured: false,
        rating: "4.9",
        reviews: 156
      }
    ];
    
    productData.forEach(product => this.createProduct(product));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.featured
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  // PC Build methods
  async createPCBuild(insertPCBuild: InsertPCBuild): Promise<PCBuild> {
    const id = this.pcBuildIdCounter++;
    const pcBuild: PCBuild = { ...insertPCBuild, id };
    this.pcBuilds.set(id, pcBuild);
    return pcBuild;
  }
  
  async getPCBuildById(id: number): Promise<PCBuild | undefined> {
    return this.pcBuilds.get(id);
  }
  
  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
  }
  
  async getCartItemById(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }
  
  async getCartItemByProductId(productId: number, sessionId: string): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      (item) => item.productId === productId && item.sessionId === sessionId
    );
  }
  
  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemIdCounter++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (cartItem) {
      const updatedItem = { ...cartItem, quantity };
      this.cartItems.set(id, updatedItem);
      return updatedItem;
    }
    return undefined;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  async clearCart(sessionId: string): Promise<boolean> {
    const cartItemsToRemove = Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
    
    cartItemsToRemove.forEach(item => {
      this.cartItems.delete(item.id);
    });
    
    return true;
  }
}

export const storage = new MemStorage();
