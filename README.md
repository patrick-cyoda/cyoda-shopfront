# Cyoda E-commerce OMS Frontend

A modern, production-ready React TypeScript frontend for the Cyoda Order Management System (OMS). Built with beautiful UI components, state management, and seamless integration with Cyoda's standard REST APIs.

## Features

- **Modern E-commerce UI**: Beautiful product browsing, cart management, and checkout flow
- **Cyoda Integration**: Direct integration with Cyoda's standard `/entity/*` REST APIs
- **State Management**: Zustand-powered stores for cart, user, and product data
- **Responsive Design**: Mobile-first design with elegant desktop experience
- **Type Safety**: Full TypeScript coverage with proper entity definitions
- **Error Handling**: Comprehensive error boundaries and user feedback

## Architecture

### Design System
- **Color Palette**: Sophisticated purple-blue with luxury gold accents
- **Components**: Enhanced shadcn/ui components with custom variants
- **Animations**: Smooth transitions and hover effects
- **Typography**: Inter font for modern, clean aesthetics

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui with custom enhancements
- **State Management**: Zustand with persistence
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6

### Services Layer
Clean abstraction over Cyoda's REST APIs:
- `CyodaClient`: Base HTTP client with authentication
- `ProductService`: Product search and filtering
- `CartService`: Cart operations with real-time updates
- `UserService`: User management with address handling
- `PaymentService`: Dummy payment processing with polling
- `OrderService`: Order tracking and status management

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Access to a Cyoda instance with proper authentication

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cyoda-ecommerce-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Cyoda instance details:
```env
VITE_CYODA_API_BASE=https://your-cyoda-host.com/api
VITE_CYODA_TOKEN=your-bearer-token-here
```

4. Start the development server:
```bash
npm run dev
```

## API Integration

### Entity Structure
The application uses these Cyoda entities:

- **Product**: `sku`, `name`, `description`, `price`, `availableQuantity`, `warehouseId`
- **Cart**: `cartId`, `userId`, `status`, `lines[]`, `totalItems`, `grandTotal`
- **User**: `userId`, `name`, `email`, `phone`, `address{}`
- **Payment**: `paymentId`, `cartId`, `amount`, `status`, `provider`
- **Order**: `orderId`, `orderNumber`, `userId`, `lines[]`, `totals{}`, `status`

### Workflow States
- **Cart**: NEW → ACTIVE → CHECKING_OUT → CONVERTED
- **Order**: WAITING_TO_FULFILL → PICKING → WAITING_TO_SEND → SENT → DELIVERED

### Authentication
Uses Bearer token authentication via the `Authorization` header:
```
Authorization: Bearer <your-cyoda-token>
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── ProductCard.tsx # Product display component
│   ├── CartPanel.tsx   # Shopping cart interface
│   └── Navigation.tsx  # Main navigation bar
├── pages/              # Main application pages
│   ├── ProductList.tsx # Product browsing and filtering
│   ├── Cart.tsx        # Cart management page
│   ├── Checkout.tsx    # Checkout and payment flow
│   └── OrderConfirmation.tsx # Order completion
├── services/           # API services layer
│   ├── cyoda.ts        # Base Cyoda client
│   ├── ProductService.ts
│   ├── CartService.ts
│   ├── UserService.ts
│   ├── PaymentService.ts
│   └── OrderService.ts
├── store/              # State management
│   ├── cartStore.ts    # Shopping cart state
│   ├── userStore.ts    # User session state
│   └── productStore.ts # Product catalog state
├── types/              # TypeScript definitions
│   └── entities.ts     # Cyoda entity types
└── index.css          # Design system and styles
```

## Key Features

### Product Catalog
- **Search & Filter**: Real-time product search with category and price filtering
- **Inventory Display**: Live stock levels with low-stock warnings
- **Responsive Grid**: Adaptive layout for all screen sizes

### Shopping Cart
- **Real-time Updates**: Instant quantity changes with backend sync
- **Reservation Management**: 4-hour TTL with automatic refresh
- **Persistent Storage**: Cart state preserved across sessions

### Checkout Process
1. **Address Collection**: User information with address validation
2. **Payment Processing**: Dummy payment with 3-second simulation
3. **Order Creation**: Automatic order generation after payment success
4. **Confirmation**: Real-time status updates and tracking

### Order Management
- **Status Tracking**: Visual progress through fulfillment pipeline
- **Order History**: Complete order details and line items
- **Shipping Updates**: Real-time delivery status

## Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
```

### Environment Variables
- `VITE_CYODA_API_BASE`: Cyoda API base URL
- `VITE_CYODA_TOKEN`: Authentication bearer token

### Code Style
- **TypeScript**: Strict mode with comprehensive type coverage
- **ESLint**: Enforced code standards and best practices
- **Prettier**: Consistent code formatting
- **CSS**: Utility-first with semantic design tokens

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting platform

3. Configure environment variables in your deployment platform

4. Ensure CORS is properly configured on your Cyoda instance

## Contributing

1. Follow the established code style and patterns
2. Add TypeScript types for any new entities or APIs
3. Update the design system for consistent styling
4. Test all user flows before submitting changes

## Support

For issues related to:
- **Frontend bugs**: Check the browser console and network tab
- **API connectivity**: Verify environment variables and network access
- **Cyoda integration**: Consult the [Cyoda documentation](https://docs.cyoda.net)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.