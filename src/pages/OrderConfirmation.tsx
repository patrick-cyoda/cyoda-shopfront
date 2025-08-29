import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, Truck, Home, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Navigation } from '../components/Navigation';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { orderService } from '../services/OrderService';
import { Order, OrderLine } from '../types/entities';

export const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCartStore();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get order details from navigation state or mock data
  const { orderId, orderNumber, paymentId } = location.state || {};

  useEffect(() => {
    // Clear the cart since order is complete
    clearCart();

    // In a real app, fetch the order details
    // For demo purposes, create mock order data
    const mockOrder: Order = {
      orderId: orderId || 'mock-order-id',
      orderNumber: orderNumber || '#ABC123XYZ',
      userId: 'mock-user-id',
      shippingAddress: {
        line1: '123 Main St',
        city: 'New York',
        postcode: '10001',
        country: 'US',
      },
      lines: [
        {
          sku: 'DEMO-001',
          name: 'Premium Product',
          unitPrice: 99.99,
          qty: 2,
          lineTotal: 199.98,
        },
      ] as OrderLine[],
      totals: {
        items: 2,
        grand: 199.98,
      },
      status: 'WAITING_TO_FULFILL',
      createdAt: new Date().toISOString(),
    };

    // Simulate loading
    setTimeout(() => {
      setOrder(mockOrder);
      setIsLoading(false);
    }, 1000);
  }, [orderId, orderNumber]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      'WAITING_TO_FULFILL': Package,
      'PICKING': Package,
      'WAITING_TO_SEND': Truck,
      'SENT': Truck,
      'DELIVERED': Home,
    };
    return icons[status] || Package;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Order not found</h1>
            <Button onClick={() => navigate('/')} variant="accent">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusIcon = getStatusIcon(order.status);
  const StatusIcon = statusIcon;
  const progress = orderService.getStatusProgress(order.status);
  const statusColor = orderService.getStatusColor(order.status);
  const statusDisplay = orderService.getStatusDisplayName(order.status);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Success Header */}
          <Card className="border-border/50 shadow-card text-center">
            <CardContent className="pt-8 pb-6">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground mb-4">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
              <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
                <span className="text-sm text-muted-foreground">Order Number:</span>
                <span className="font-semibold text-foreground">{order.orderNumber}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card className="border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 text-${statusColor}`} />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{statusDisplay}</span>
                <Badge variant="secondary" className={`bg-${statusColor}/10 text-${statusColor}`}>
                  {order.status}
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {progress === 100 
                  ? 'Your order has been delivered!'
                  : 'We\'ll notify you when your order status changes.'
                }
              </p>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="border-border/50 shadow-card">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Items */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Items</h3>
                {order.lines.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-subtle rounded-md flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        {formatPrice(item.lineTotal)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatPrice(item.unitPrice)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Shipping Address</h3>
                <div className="text-sm text-muted-foreground">
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.postcode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Items ({order.totals.items})</span>
                    <span>{formatPrice(order.totals.grand)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(order.totals.grand)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="accent"
              className="flex-1"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="flex-1"
            >
              Print Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};