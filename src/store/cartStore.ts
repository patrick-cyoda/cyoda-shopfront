import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, Product, AddToCartRequest } from '../types/entities';
import { cartService } from '../services/CartService';
import { productService } from '../services/ProductService';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createCart: () => Promise<void>;
  loadCart: (cartId: string) => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (sku: string, quantity: number) => Promise<void>;
  removeFromCart: (sku: string) => Promise<void>;
  clearCart: () => void;
  startCheckout: () => Promise<void>;
  convertCart: () => Promise<void>;
  
  // Computed
  getCartItemCount: () => number;
  getCartTotal: () => number;
  isInCart: (sku: string) => boolean;
  getCartItem: (sku: string) => Cart['lines'][0] | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      createCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const newCart = await cartService.createCart();
          set({ cart: newCart, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create cart';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      loadCart: async (cartId: string) => {
        set({ isLoading: true, error: null });
        try {
          const cart = await cartService.getCart(cartId);
          set({ cart, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load cart';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      addToCart: async (product: Product, quantity = 1) => {
        const { cart, createCart } = get();
        
        if (!cart) {
          await createCart();
        }

        const currentCart = get().cart;
        if (!currentCart) {
          throw new Error('Failed to create cart');
        }

        set({ isLoading: true, error: null });
        try {
          const request: AddToCartRequest = {
            sku: product.sku,
            qty: quantity,
          };

          // Create enriched cart line with product data
          const existingLineIndex = currentCart.lines.findIndex(line => line.sku === product.sku);
          const updatedCart = { ...currentCart };

          if (existingLineIndex >= 0) {
            // Update existing line
            updatedCart.lines[existingLineIndex].qty += quantity;
            updatedCart.lines[existingLineIndex].lineTotal = updatedCart.lines[existingLineIndex].qty * product.price;
          } else {
            // Add new line with product data
            updatedCart.lines.push({
              sku: product.sku,
              name: product.name,
              price: product.price,
              qty: quantity,
              lineTotal: quantity * product.price,
            });
          }

          // Recalculate totals
          updatedCart.totalItems = updatedCart.lines.reduce((sum, line) => sum + line.qty, 0);
          updatedCart.grandTotal = updatedCart.lines.reduce((sum, line) => sum + (line.lineTotal || 0), 0);

          // Update via service (this would sync with backend)
          await cartService.addToCart(currentCart.cartId, request);
          
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updateQuantity: async (sku: string, quantity: number) => {
        const { cart } = get();
        if (!cart) return;

        set({ isLoading: true, error: null });
        try {
          const updatedCart = await cartService.updateCartLine(cart.cartId, { sku, qty: quantity });
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update quantity';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      removeFromCart: async (sku: string) => {
        const { cart } = get();
        if (!cart) return;

        set({ isLoading: true, error: null });
        try {
          const updatedCart = await cartService.removeFromCart(cart.cartId, sku);
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      clearCart: () => {
        set({ cart: null, error: null });
      },

      startCheckout: async () => {
        const { cart } = get();
        if (!cart) return;

        set({ isLoading: true, error: null });
        try {
          const updatedCart = await cartService.startCheckout(cart.cartId);
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to start checkout';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      convertCart: async () => {
        const { cart } = get();
        if (!cart) return;

        set({ isLoading: true, error: null });
        try {
          const updatedCart = await cartService.convertCart(cart.cartId);
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to convert cart';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Computed properties
      getCartItemCount: () => {
        const { cart } = get();
        return cart?.totalItems || 0;
      },

      getCartTotal: () => {
        const { cart } = get();
        return cart?.grandTotal || 0;
      },

      isInCart: (sku: string) => {
        const { cart } = get();
        return cart?.lines.some(line => line.sku === sku) || false;
      },

      getCartItem: (sku: string) => {
        const { cart } = get();
        return cart?.lines.find(line => line.sku === sku);
      },
    }),
    {
      name: 'cyoda-cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);