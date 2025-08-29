import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Navigation } from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { useToast } from '../hooks/use-toast';
import { paymentService } from '../services/PaymentService';
import { CreateUserRequest, Address } from '../types/entities';

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, startCheckout, convertCart, getCartTotal } = useCartStore();
  const { upsertUser } = useUserStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      postcode: '',
      country: 'US',
      line2: '',
    },
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');

  const handleInputChange = (field: keyof CheckoutFormData | string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1] as keyof Address;
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim()) {
      toast({ title: "Error", description: "Email is required", variant: "destructive" });
      return false;
    }
    if (!formData.address.line1.trim()) {
      toast({ title: "Error", description: "Address line 1 is required", variant: "destructive" });
      return false;
    }
    if (!formData.address.city.trim()) {
      toast({ title: "Error", description: "City is required", variant: "destructive" });
      return false;
    }
    if (!formData.address.postcode.trim()) {
      toast({ title: "Error", description: "Postal code is required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || cart.lines.length === 0) {
      toast({ title: "Error", description: "Your cart is empty", variant: "destructive" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Step 1: Start checkout process
      await startCheckout();

      // Step 2: Upsert user
      const userRequest: CreateUserRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address,
      };
      
      const user = await upsertUser(userRequest);
      
      // Step 3: Create payment
      const payment = await paymentService.createPayment({
        cartId: cart.cartId,
        amount: getCartTotal(),
      });

      // Step 4: Simulate payment processing (3 seconds as per spec)
      await paymentService.simulatePaymentProcessing(payment.paymentId);

      // Step 5: Poll for payment completion
      const completedPayment = await paymentService.pollPaymentStatus(payment.paymentId);
      
      if (completedPayment.status === 'PAID') {
        setPaymentStatus('completed');
        
        // Step 6: Convert cart (triggers order creation on backend)
        await convertCart();
        
        // Navigate to order confirmation
        // In a real app, the backend would return the order ID
        setTimeout(() => {
          navigate('/order-confirmation', { 
            state: { 
              orderId: `ORD-${Date.now()}`, // Mock order ID
              orderNumber: `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              paymentId: payment.paymentId 
            }
          });
        }, 1500);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      setPaymentStatus('failed');
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const isEmpty = !cart || cart.lines.length === 0;
  const total = getCartTotal();

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some items before checkout</p>
            <Button onClick={() => navigate('/')} variant="accent">
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="pt-6 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h2 className="text-xl font-semibold">Processing Payment</h2>
            <p className="text-muted-foreground">Please wait while we process your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="pt-6 space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto text-success" />
            <h2 className="text-xl font-semibold text-success">Payment Successful!</h2>
            <p className="text-muted-foreground">Redirecting to order confirmation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/cart')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <Card className="border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Shipping & Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Contact Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Shipping Address</h3>
                  <div className="space-y-2">
                    <Label htmlFor="line1">Address Line 1</Label>
                    <Input
                      id="line1"
                      value={formData.address.line1}
                      onChange={(e) => handleInputChange('address.line1', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                    <Input
                      id="line2"
                      value={formData.address.line2 || ''}
                      onChange={(e) => handleInputChange('address.line2', e.target.value)}
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postal Code</Label>
                      <Input
                        id="postcode"
                        value={formData.address.postcode}
                        onChange={(e) => handleInputChange('address.postcode', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.address.country}
                        onChange={(e) => handleInputChange('address.country', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full"
                  variant="accent"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Complete Payment ${formatPrice(total)}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border-border/50 shadow-card h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.lines.map((item) => (
                <div key={item.sku} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-md"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                  </div>
                  <div className="text-sm font-medium">
                    {formatPrice(item.lineTotal || item.qty * item.price)}
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(0)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};