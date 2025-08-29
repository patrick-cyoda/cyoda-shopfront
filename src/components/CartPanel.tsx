import React from 'react';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useCartStore } from '../store/cartStore';
import { useToast } from '../hooks/use-toast';
import { CartLine } from '../types/entities';

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  max,
  disabled
}) => {
  return (
    <div className="flex items-center border border-border rounded-md">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onDecrement}
        disabled={disabled || value <= min}
        className="h-8 w-8 rounded-none"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <div className="w-12 h-8 flex items-center justify-center text-sm font-medium border-x border-border">
        {value}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onIncrement}
        disabled={disabled || (max !== undefined && value >= max)}
        className="h-8 w-8 rounded-none"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};

interface CartLineItemProps {
  item: CartLine;
  onUpdateQuantity: (sku: string, quantity: number) => void;
  onRemove: (sku: string) => void;
  disabled?: boolean;
}

const CartLineItem: React.FC<CartLineItemProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  disabled 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-gradient-card">
      {/* Product Image Placeholder */}
      <div className="w-12 h-12 bg-gradient-subtle rounded-md flex items-center justify-center flex-shrink-0">
        <ShoppingBag className="h-6 w-6 text-muted-foreground/50" />
      </div>

      {/* Product Details */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-foreground line-clamp-1">
              {item.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              SKU: {item.sku}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(item.sku)}
            disabled={disabled}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <QuantityStepper
            value={item.qty}
            onIncrement={() => onUpdateQuantity(item.sku, item.qty + 1)}
            onDecrement={() => onUpdateQuantity(item.sku, item.qty - 1)}
            disabled={disabled}
          />
          <div className="text-right">
            <div className="font-semibold text-foreground">
              {formatPrice(item.lineTotal || item.qty * item.price)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatPrice(item.price)} each
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CartPanelProps {
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

export const CartPanel: React.FC<CartPanelProps> = ({ 
  onCheckout, 
  showCheckoutButton = true 
}) => {
  const { 
    cart, 
    isLoading, 
    updateQuantity, 
    removeFromCart, 
    getCartItemCount, 
    getCartTotal 
  } = useCartStore();
  const { toast } = useToast();

  const handleUpdateQuantity = async (sku: string, quantity: number) => {
    try {
      await updateQuantity(sku, quantity);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (sku: string) => {
    try {
      await removeFromCart(sku);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const isEmpty = !cart || cart.lines.length === 0;
  const itemCount = getCartItemCount();
  const total = getCartTotal();

  if (isEmpty) {
    return (
      <div className="text-center py-12 space-y-4">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mx-auto" />
        <div>
          <h3 className="font-semibold text-foreground mb-1">Your cart is empty</h3>
          <p className="text-sm text-muted-foreground">
            Add some products to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          Shopping Cart
        </h2>
        <Badge variant="secondary" className="text-sm">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {/* Cart Items */}
      <ScrollArea className="max-h-96">
        <div className="space-y-4">
          {cart.lines.map((item) => (
            <CartLineItem
              key={item.sku}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
              disabled={isLoading}
            />
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Cart Summary */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(total)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-success">Free</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-lg font-bold text-primary">
            {formatPrice(total)}
          </span>
        </div>

        {/* Checkout Button */}
        {showCheckoutButton && (
          <Button
            onClick={onCheckout}
            disabled={isLoading || isEmpty}
            className="w-full"
            variant="accent"
            size="lg"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};