import { getCyodaClient } from './cyoda';
import { Order } from '../types/entities';

export class OrderService {
  private client = getCyodaClient();

  async getOrder(orderId: string): Promise<Order> {
    try {
      return await this.client.getEntity<Order>('Order', orderId);
    } catch (error) {
      console.error('Error getting order:', error);
      throw new Error('Failed to load order');
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      const orders = await this.client.searchEntities<Order>('Order', undefined, { orderNumber });
      return orders.length > 0 ? orders[0] : null;
    } catch (error) {
      console.error('Error getting order by number:', error);
      return null;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      return await this.client.searchEntities<Order>('Order', undefined, { userId });
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  getStatusDisplayName(status: Order['status']): string {
    const statusMap: Record<Order['status'], string> = {
      'WAITING_TO_FULFILL': 'Preparing Order',
      'PICKING': 'Picking Items',
      'WAITING_TO_SEND': 'Ready to Ship',
      'SENT': 'Shipped',
      'DELIVERED': 'Delivered'
    };

    return statusMap[status] || status;
  }

  getStatusProgress(status: Order['status']): number {
    const progressMap: Record<Order['status'], number> = {
      'WAITING_TO_FULFILL': 20,
      'PICKING': 40,
      'WAITING_TO_SEND': 60,
      'SENT': 80,
      'DELIVERED': 100
    };

    return progressMap[status] || 0;
  }

  getStatusColor(status: Order['status']): string {
    const colorMap: Record<Order['status'], string> = {
      'WAITING_TO_FULFILL': 'warning',
      'PICKING': 'primary',
      'WAITING_TO_SEND': 'accent',
      'SENT': 'primary',
      'DELIVERED': 'success'
    };

    return colorMap[status] || 'muted';
  }
}

export const orderService = new OrderService();