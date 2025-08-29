import React from 'react';
import { ShoppingCart, Search, Package, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useCartStore } from '../store/cartStore';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationProps {
  onCartClick?: () => void;
  onSearch?: (query: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onCartClick, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemCount } = useCartStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const cartItemCount = getCartItemCount();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const navItems = [
    { label: 'Products', path: '/', icon: Package },
    { label: 'Cart', path: '/cart', icon: ShoppingCart, badge: cartItemCount > 0 ? cartItemCount : undefined },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold gradient-text">Cyoda Store</h1>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-border/50 focus:bg-background"
            />
          </div>
        </form>

        {/* Navigation Items */}
        <div className="flex items-center space-x-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              size="sm"
              onClick={() => item.path === '/cart' ? onCartClick?.() : navigate(item.path)}
              className="relative"
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">{item.label}</span>
              {item.badge && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Search - Visible only on mobile */}
      <div className="md:hidden border-t border-border/40 p-4">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-border/50"
            />
          </div>
        </form>
      </div>
    </nav>
  );
};