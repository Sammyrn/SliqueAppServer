# E-Commerce Frontend

This is the frontend application for the E-Commerce Platform, built with React 19, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Backend server running on port 5050

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## 🏗️ Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/        # Basic UI components (buttons, inputs, etc.)
│   ├── layout/    # Layout components (header, footer, etc.)
│   └── forms/     # Form components
├── Pages/         # Page components
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Orders.jsx
│   └── admin/     # Admin pages
├── context/       # React context providers
├── config/        # Configuration files
├── constants/     # Application constants
├── assets/        # Static assets
├── App.jsx        # Main application component
└── main.jsx       # Application entry point
```

## 🎨 Styling

This project uses **Tailwind CSS** for styling with a custom design system:

- **Colors**: Custom color palette defined in `tailwind.config.js`
- **Components**: Reusable component classes
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Built-in dark mode support

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the client directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5050/api

# Socket Configuration
VITE_SOCKET_URL=http://localhost:5050

# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
```

### Vite Configuration

The project uses Vite for fast development and building:

- **Hot Module Replacement (HMR)** for instant updates
- **ESBuild** for fast bundling
- **Plugin React** for React support
- **Tailwind CSS** integration

## 📦 Key Dependencies

### Core
- **React 19** - UI library with hooks
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server

### State Management
- **Zustand** - Lightweight state management
- **React Context** - Global state providers

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lottie React** - Animation library

### API & Communication
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication

### Utilities
- **date-fns** - Date manipulation
- **react-paginate** - Pagination component

## 🔄 Development Workflow

### 1. Component Development

```jsx
// Example component structure
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={product.image} alt={product.name} />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">${product.price}</p>
    </div>
  );
};

export default ProductCard;
```

### 2. State Management

```jsx
// Using Zustand store
import { useCartStore } from '../stores/cartStore';

const ProductPage = () => {
  const { addItem } = useCartStore();
  
  const handleAddToCart = (product) => {
    addItem(product, 1);
  };
  
  return (
    // Component JSX
  );
};
```

### 3. API Integration

```jsx
// Using custom API hooks
import { useProducts } from '../hooks/useProducts';

const ProductsPage = () => {
  const { products, loading, error } = useProducts();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

## 🎯 Features

### Customer Features
- **Product Browsing** - Browse and search products
- **Shopping Cart** - Add/remove items with quantity management
- **User Authentication** - Login/register functionality
- **Order Management** - View order history and status
- **Payment Integration** - Secure checkout with Paystack
- **Real-time Updates** - Live order status updates

### Admin Features
- **Product Management** - Add, edit, delete products
- **Order Management** - Update order statuses
- **User Management** - View customer accounts
- **Dashboard** - Sales and analytics overview

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Client-side form validation
- **XSS Protection** - React's built-in XSS protection
- **HTTPS** - Secure communication in production

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Performance

### Optimization Techniques

- **Code Splitting** - Lazy loading of routes
- **Image Optimization** - WebP format and lazy loading
- **Bundle Optimization** - Tree shaking and minification
- **Caching** - Browser caching strategies

### Performance Monitoring

- **Lighthouse** scores for performance metrics
- **Bundle Analyzer** for bundle size optimization
- **React DevTools** for component profiling

## 🧪 Testing

### Testing Strategy

- **Unit Tests** - Component and utility testing
- **Integration Tests** - API integration testing
- **E2E Tests** - User flow testing

### Running Tests

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 📦 Building for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

The build output will be in the `dist/` directory, ready for deployment.

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running on correct port
   - Check CORS configuration in backend

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check for missing dependencies

3. **Hot Reload Not Working**
   - Check file watchers limit on Linux
   - Restart development server

## 📚 Additional Resources

- [Main Project README](../README.md)
- [API Documentation](../docs/API.md)
- [Architecture Documentation](../docs/ARCHITECTURE.md)
- [Setup Guide](../docs/SETUP.md)

## 🤝 Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## 📄 License

This project is licensed under the ISC License.
