import React from 'react';
import { ShoppingCart, Package, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Product } from '../types/entities';
import { useCartStore } from '../store/cartStore';
import { useToast } from '../hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart, isLoading } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    try {
      await addToCart(product, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add item to cart",
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

  const isOutOfStock = product.availableQuantity <= 0;
  const isLowStock = product.availableQuantity > 0 && product.availableQuantity <= 5;

  return (
    <Card className="group hover-lift overflow-hidden bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-300">
      <div className="relative overflow-hidden">
        {/* Product Image Placeholder */}
        <div className="aspect-square bg-gradient-subtle flex items-center justify-center">
          <Package className="h-12 w-12 text-muted-foreground/50" />
        </div>
        
        {/* Stock Status Badge */}
        <div className="absolute top-3 left-3">
          {isOutOfStock ? (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          ) : isLowStock ? (
            <Badge variant="secondary" className="text-xs bg-warning text-warning-foreground">
              Low Stock
            </Badge>
          ) : null}
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
              {product.category}
            </Badge>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(product)}
            className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-background/90 backdrop-blur-sm"
          >
            View Details
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Product Name */}
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            SKU: {product.sku}
          </p>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            <div className="text-xs text-muted-foreground">
              {product.availableQuantity} in stock
            </div>
          </div>
          
          {/* Rating Placeholder */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-accent fill-accent" />
            <span className="text-sm text-muted-foreground">4.5</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className="w-full"
          variant={isOutOfStock ? "outline" : "cart"}
          size="sm"
        >
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
};