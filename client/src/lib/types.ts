// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId: number;
  stock: number;
  specifications: Record<string, any>;
  featured: boolean;
  rating: string;
  reviews: number;
  tag?: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

// Cart Types
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  sessionId: string;
  product: Product;
}

// PC Builder Types
export interface PCBuilderRequirements {
  purpose: string;
  budget: string;
  performance: string;
  storage: string;
  resolution: string;
  additionalRequirements?: string;
}

export interface ComponentRecommendation {
  name: string;
  description: string;
  price: string;
  image: string;
  id?: number;
}

export interface PCBuildRecommendation {
  purpose: string;
  analysis: string;
  components: ComponentRecommendation[];
  totalPrice: string;
  performanceRating: number;
  estimatedPowerDraw: string;
  buildId?: number;
}

// Checkout Types
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentInfo {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

export interface CheckoutData {
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  items: CartItem[];
  orderTotal: number;
}
