// Cyoda Entity Type Definitions for E-commerce OMS

export interface Product {
  sku: string;
  name: string;
  description?: string;
  price: number;
  availableQuantity: number;
  warehouseId?: string;
  imageUrl?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartLine {
  sku: string;
  name: string;
  price: number;
  qty: number;
  lineTotal?: number;
}

export interface Cart {
  cartId: string;
  userId?: string;
  status: 'NEW' | 'ACTIVE' | 'CHECKING_OUT' | 'CONVERTED';
  lines: CartLine[];
  totalItems: number;
  grandTotal: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  line1: string;
  city: string;
  postcode: string;
  country: string;
  line2?: string;
  state?: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  address: Address;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  paymentId: string;
  cartId: string;
  amount: number;
  status: 'INITIATED' | 'PAID' | 'FAILED' | 'CANCELED';
  provider: 'DUMMY';
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderLine {
  sku: string;
  name: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export interface OrderTotals {
  items: number;
  grand: number;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  userId: string;
  shippingAddress: Address;
  lines: OrderLine[];
  totals: OrderTotals;
  status: 'WAITING_TO_FULFILL' | 'PICKING' | 'WAITING_TO_SEND' | 'SENT' | 'DELIVERED';
  createdAt?: string;
  updatedAt?: string;
}

// Request/Response types for API calls
export interface AddToCartRequest {
  sku: string;
  qty: number;
}

export interface UpdateCartLineRequest {
  sku: string;
  qty: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  address: Address;
}

export interface CreatePaymentRequest {
  cartId: string;
  amount: number;
}

// Search and filter types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface SearchParams {
  query?: string;
  filters?: ProductFilters;
  limit?: number;
  offset?: number;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  code: string;
  validation?: ValidationError[];
}