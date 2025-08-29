import { getCyodaClient } from './cyoda';
import { Payment, CreatePaymentRequest } from '../types/entities';

export class PaymentService {
  private client = getCyodaClient();

  async createPayment(request: CreatePaymentRequest): Promise<Payment> {
    try {
      const payment = await this.client.createEntity<Payment>('Payment', {
        cartId: request.cartId,
        amount: request.amount,
        status: 'INITIATED',
        provider: 'DUMMY',
      });

      return payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to initiate payment');
    }
  }

  async getPayment(paymentId: string): Promise<Payment> {
    try {
      return await this.client.getEntity<Payment>('Payment', paymentId);
    } catch (error) {
      console.error('Error getting payment:', error);
      throw new Error('Failed to load payment');
    }
  }

  async pollPaymentStatus(paymentId: string, maxAttempts = 20, intervalMs = 300): Promise<Payment> {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const poll = async () => {
        try {
          attempts++;
          const payment = await this.getPayment(paymentId);

          // Check if payment is completed
          if (payment.status === 'PAID') {
            resolve(payment);
            return;
          }

          // Check if payment failed
          if (payment.status === 'FAILED' || payment.status === 'CANCELED') {
            reject(new Error(`Payment ${payment.status.toLowerCase()}`));
            return;
          }

          // Continue polling if still processing
          if (attempts < maxAttempts && payment.status === 'INITIATED') {
            setTimeout(poll, intervalMs);
          } else if (attempts >= maxAttempts) {
            reject(new Error('Payment timeout - please try again'));
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  async simulatePaymentProcessing(paymentId: string): Promise<void> {
    // Simulate payment processing time (3 seconds as per spec)
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real implementation, this would be handled by the backend
        // The backend would update the payment status to 'PAID' automatically
        resolve();
      }, 3000);
    });
  }
}

export const paymentService = new PaymentService();