import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { CartPanel } from '../components/CartPanel';
import { Navigation } from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handleContinueShopping}
            className="hover-lift"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Cart</h1>
            <p className="text-muted-foreground">
              Review your items before checkout
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg border border-border/50 shadow-card p-6">
            <CartPanel onCheckout={handleCheckout} />
            
            {!isEmpty && (
              <div className="mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleContinueShopping}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            )}
            
            {isEmpty && (
              <div className="mt-6">
                <Button
                  onClick={handleContinueShopping}
                  className="w-full"
                  variant="accent"
                >
                  Start Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};