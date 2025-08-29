import { getCyodaClient } from './cyoda';
import { Cart, AddToCartRequest, UpdateCartLineRequest, CartLine } from '../types/entities';

export class CartService {
  private client = getCyodaClient();

  async createCart(): Promise<Cart> {
    try {
      const newCart = await this.client.createEntity<Cart>('Cart', {
        status: 'NEW',
        lines: [],
        totalItems: 0,
        grandTotal: 0,
      });

      // Immediately activate the cart
      return await this.updateCartStatus(newCart.cartId, 'ACTIVE');
    } catch (error) {
      console.error('Error creating cart:', error);
      throw new Error('Failed to create cart');
    }
  }

  async getCart(cartId: string): Promise<Cart> {
    try {
      return await this.client.getEntity<Cart>('Cart', cartId);
    } catch (error) {
      console.error('Error getting cart:', error);
      throw new Error('Failed to load cart');
    }
  }

  async addToCart(cartId: string, request: AddToCartRequest): Promise<Cart> {
    try {
      const cart = await this.getCart(cartId);
      const existingLineIndex = cart.lines.findIndex(line => line.sku === request.sku);

      if (existingLineIndex >= 0) {
        // Update existing line
        cart.lines[existingLineIndex].qty += request.qty;
        cart.lines[existingLineIndex].lineTotal = cart.lines[existingLineIndex].qty * cart.lines[existingLineIndex].price;
      } else {
        // Get product details for new line (this would typically come from the request)
        const newLine: CartLine = {
          sku: request.sku,
          name: `Product ${request.sku}`, // This should come from product data
          price: 0, // This should come from product data
          qty: request.qty,
        };
        cart.lines.push(newLine);
      }

      // Recalculate totals
      cart.totalItems = cart.lines.reduce((sum, line) => sum + line.qty, 0);
      cart.grandTotal = cart.lines.reduce((sum, line) => sum + (line.lineTotal || line.qty * line.price), 0);

      return await this.client.updateEntity<Cart>('Cart', cartId, cart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  }

  async updateCartLine(cartId: string, request: UpdateCartLineRequest): Promise<Cart> {
    try {
      const cart = await this.getCart(cartId);
      const lineIndex = cart.lines.findIndex(line => line.sku === request.sku);

      if (lineIndex === -1) {
        throw new Error('Product not found in cart');
      }

      if (request.qty <= 0) {
        // Remove the line
        cart.lines.splice(lineIndex, 1);
      } else {
        // Update quantity
        cart.lines[lineIndex].qty = request.qty;
        cart.lines[lineIndex].lineTotal = cart.lines[lineIndex].qty * cart.lines[lineIndex].price;
      }

      // Recalculate totals
      cart.totalItems = cart.lines.reduce((sum, line) => sum + line.qty, 0);
      cart.grandTotal = cart.lines.reduce((sum, line) => sum + (line.lineTotal || line.qty * line.price), 0);

      return await this.client.updateEntity<Cart>('Cart', cartId, cart);
    } catch (error) {
      console.error('Error updating cart line:', error);
      throw new Error('Failed to update cart item');
    }
  }

  async removeFromCart(cartId: string, sku: string): Promise<Cart> {
    try {
      const cart = await this.getCart(cartId);
      cart.lines = cart.lines.filter(line => line.sku !== sku);

      // Recalculate totals
      cart.totalItems = cart.lines.reduce((sum, line) => sum + line.qty, 0);
      cart.grandTotal = cart.lines.reduce((sum, line) => sum + (line.lineTotal || line.qty * line.price), 0);

      return await this.client.updateEntity<Cart>('Cart', cartId, cart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  }

  async updateCartStatus(cartId: string, status: Cart['status']): Promise<Cart> {
    try {
      return await this.client.updateEntity<Cart>('Cart', cartId, { status });
    } catch (error) {
      console.error('Error updating cart status:', error);
      throw new Error('Failed to update cart status');
    }
  }

  async startCheckout(cartId: string): Promise<Cart> {
    return await this.updateCartStatus(cartId, 'CHECKING_OUT');
  }

  async convertCart(cartId: string): Promise<Cart> {
    return await this.updateCartStatus(cartId, 'CONVERTED');
  }
}

export const cartService = new CartService();