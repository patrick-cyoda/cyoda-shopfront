import { Product } from '../types/entities';

export const mockProducts: Product[] = [
  {
    sku: 'LAPTOP-001',
    name: 'MacBook Pro 16-inch',
    description: 'Powerful laptop with M3 Pro chip, 18GB RAM, and 512GB SSD. Perfect for professional work and creative tasks.',
    price: 2499.00,
    availableQuantity: 15,
    warehouseId: 'WH-001',
    category: 'Electronics',
  },
  {
    sku: 'PHONE-001',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with titanium design, advanced camera system, and USB-C connectivity.',
    price: 999.00,
    availableQuantity: 25,
    warehouseId: 'WH-001',
    category: 'Electronics',
  },
  {
    sku: 'WATCH-001',
    name: 'Apple Watch Series 9',
    description: 'Advanced smartwatch with health monitoring, GPS, and all-day battery life.',
    price: 399.00,
    availableQuantity: 30,
    warehouseId: 'WH-002',
    category: 'Wearables',
  },
  {
    sku: 'HEADPHONES-001',
    name: 'AirPods Pro (2nd Gen)',
    description: 'Premium wireless earbuds with active noise cancellation and spatial audio.',
    price: 249.00,
    availableQuantity: 50,
    warehouseId: 'WH-001',
    category: 'Audio',
  },
  {
    sku: 'TABLET-001',
    name: 'iPad Pro 12.9-inch',
    description: 'Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support.',
    price: 1099.00,
    availableQuantity: 12,
    warehouseId: 'WH-002',
    category: 'Electronics',
  },
  {
    sku: 'KEYBOARD-001',
    name: 'Magic Keyboard',
    description: 'Wireless keyboard with scissor mechanism and numeric keypad.',
    price: 199.00,
    availableQuantity: 40,
    warehouseId: 'WH-001',
    category: 'Accessories',
  },
  {
    sku: 'MOUSE-001',
    name: 'Magic Mouse',
    description: 'Wireless mouse with Multi-Touch surface and rechargeable battery.',
    price: 79.00,
    availableQuantity: 35,
    warehouseId: 'WH-001',
    category: 'Accessories',
  },
  {
    sku: 'MONITOR-001',
    name: 'Studio Display 27-inch',
    description: '5K Retina display with True Tone, wide color (P3), and built-in camera.',
    price: 1599.00,
    availableQuantity: 8,
    warehouseId: 'WH-002',
    category: 'Displays',
  },
  {
    sku: 'SPEAKER-001',
    name: 'HomePod mini',
    description: 'Compact smart speaker with 360-degree audio and Siri integration.',
    price: 99.00,
    availableQuantity: 60,
    warehouseId: 'WH-001',
    category: 'Audio',
  },
  {
    sku: 'CABLE-001',
    name: 'USB-C to Lightning Cable',
    description: 'High-quality charging cable for fast data transfer and charging.',
    price: 19.00,
    availableQuantity: 100,
    warehouseId: 'WH-001',
    category: 'Accessories',
  },
  {
    sku: 'CHARGER-001',
    name: 'MagSafe Charger',
    description: 'Wireless charger for iPhone with magnetic alignment and fast charging.',
    price: 39.00,
    availableQuantity: 75,
    warehouseId: 'WH-002',
    category: 'Accessories',
  },
  {
    sku: 'CASE-001',
    name: 'iPhone Leather Case',
    description: 'Premium leather case with MagSafe compatibility and elegant design.',
    price: 59.00,
    availableQuantity: 45,
    warehouseId: 'WH-001',
    category: 'Accessories',
  },
  {
    sku: 'TV-001',
    name: 'Apple TV 4K',
    description: 'Streaming device with 4K HDR, Dolby Vision, and A15 Bionic chip.',
    price: 179.00,
    availableQuantity: 20,
    warehouseId: 'WH-002',
    category: 'Entertainment',
  },
  {
    sku: 'CAMERA-001',
    name: 'Canon EOS R5',
    description: 'Professional mirrorless camera with 45MP sensor and 8K video recording.',
    price: 3899.00,
    availableQuantity: 5,
    warehouseId: 'WH-002',
    category: 'Photography',
  },
  {
    sku: 'LENS-001',
    name: 'Canon RF 24-70mm f/2.8L',
    description: 'Professional zoom lens with exceptional image quality and fast aperture.',
    price: 2299.00,
    availableQuantity: 8,
    warehouseId: 'WH-002',
    category: 'Photography',
  },
  {
    sku: 'TRIPOD-001',
    name: 'Carbon Fiber Tripod',
    description: 'Lightweight and stable tripod for professional photography and videography.',
    price: 299.00,
    availableQuantity: 15,
    warehouseId: 'WH-002',
    category: 'Photography',
  },
  {
    sku: 'DRONE-001',
    name: 'DJI Mini 4 Pro',
    description: 'Compact drone with 4K camera, omnidirectional obstacle sensing.',
    price: 759.00,
    availableQuantity: 12,
    warehouseId: 'WH-002',
    category: 'Photography',
  },
  {
    sku: 'GAMING-001',
    name: 'PlayStation 5',
    description: 'Next-gen gaming console with ultra-high speed SSD and ray tracing.',
    price: 499.00,
    availableQuantity: 3,
    warehouseId: 'WH-001',
    category: 'Gaming',
  },
  {
    sku: 'CONTROLLER-001',
    name: 'DualSense Controller',
    description: 'Wireless gaming controller with haptic feedback and adaptive triggers.',
    price: 69.00,
    availableQuantity: 25,
    warehouseId: 'WH-001',
    category: 'Gaming',
  },
  {
    sku: 'VR-001',
    name: 'Meta Quest 3',
    description: 'Mixed reality headset with high-resolution display and hand tracking.',
    price: 499.00,
    availableQuantity: 10,
    warehouseId: 'WH-002',
    category: 'Gaming',
  },
];

// Mock service to simulate API responses when backend is not available
export const getMockProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockProducts]), 500); // Simulate network delay
  });
};

export const getMockProductBySku = (sku: string): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.sku === sku);
      resolve(product || null);
    }, 200);
  });
};

export const getMockCategories = (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = [...new Set(mockProducts.map(p => p.category).filter(Boolean))];
      resolve(categories);
    }, 200);
  });
};