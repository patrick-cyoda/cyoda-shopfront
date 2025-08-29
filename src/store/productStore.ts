import { create } from 'zustand';
import { Product, SearchParams } from '../types/entities';
import { productService } from '../services/ProductService';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  searchQuery: string;
  selectedCategory: string | null;
  priceRange: [number, number];
  showInStockOnly: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadProducts: () => Promise<void>;
  searchProducts: (query: string) => void;
  filterByCategory: (category: string | null) => void;
  filterByPriceRange: (range: [number, number]) => void;
  toggleInStockOnly: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
  
  // Computed
  getProductBySku: (sku: string) => Product | undefined;
  getAvailableProducts: () => Product[];
  getPriceRange: () => [number, number];
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  filteredProducts: [],
  categories: [],
  searchQuery: '',
  selectedCategory: null,
  priceRange: [0, 1000],
  showInStockOnly: false,
  isLoading: false,
  error: null,

  loadProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const [products, categories] = await Promise.all([
        productService.getAllProducts(),
        productService.getProductCategories(),
      ]);
      
      // Calculate initial price range
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      set({
        products,
        filteredProducts: products,
        categories,
        priceRange: [minPrice, maxPrice],
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load products';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  searchProducts: (query: string) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  filterByCategory: (category: string | null) => {
    set({ selectedCategory: category });
    get().applyFilters();
  },

  filterByPriceRange: (range: [number, number]) => {
    set({ priceRange: range });
    get().applyFilters();
  },

  toggleInStockOnly: () => {
    set((state) => ({ showInStockOnly: !state.showInStockOnly }));
    get().applyFilters();
  },

  clearFilters: () => {
    const { products } = get();
    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    set({
      searchQuery: '',
      selectedCategory: null,
      priceRange: [minPrice, maxPrice],
      showInStockOnly: false,
      filteredProducts: products,
    });
  },

  applyFilters: () => {
    const { products, searchQuery, selectedCategory, priceRange, showInStockOnly } = get();
    
    let filtered = [...products];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply stock filter
    if (showInStockOnly) {
      filtered = filtered.filter((product) => product.availableQuantity > 0);
    }

    set({ filteredProducts: filtered });
  },

  // Computed properties
  getProductBySku: (sku: string) => {
    const { products } = get();
    return products.find((product) => product.sku === sku);
  },

  getAvailableProducts: () => {
    const { products } = get();
    return products.filter((product) => product.availableQuantity > 0);
  },

  getPriceRange: () => {
    const { products } = get();
    if (products.length === 0) return [0, 1000];
    
    const prices = products.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  },
}));